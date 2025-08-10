// API endpoint để kết thúc sản xuất
app.post('/data/production_orders/:id/end_production', (req, res) => {
  const orderId = req.params.id;
  const { 
    stage = '',           // Mặc định là công đoạn XẢ
    production_order = '',  // Mã lệnh sản xuất
    worker_name = '',       // Tên thợ sản xuất
    machine_name = '',      // Tên máy sản xuất
    shift = '',             // Ca làm việc
    notes = '',             // Ghi chú
    good_quantity = 0,      // Số lượng OK
    ng_quantity = 0,        // Số lượng NG
    handover_quantity = 0   // Số lượng bàn giao
  } = req.body;

  // Bắt đầu transaction để đảm bảo tính nhất quán dữ liệu
  db.beginTransaction((err) => {
    if (err) {
      return res.status(500).json({ 
        error: 'Lỗi khởi tạo transaction: ' + err.message 
      });
    }

    // 1. Cập nhật bảng production_orders
    const updateOrderQuery = `
      UPDATE production_orders 
      SET 
        ${stage}_end_time = NOW(),                      -- Cập nhật thời gian kết thúc = thời gian hiện tại
        ${stage}_status = 'completed',                  -- Cập nhật trạng thái = hoàn thành
        ${stage}_worker_name = ?,                       -- Ghi lại tên thợ
        ${stage}_machine_name = ?,                      -- Ghi lại tên máy
        production_shift = ?,                           -- Cập nhật ca làm việc
        ${stage}_note = ?,                              -- Ghi lại ghi chú
        ${stage}_good_quantity = ?,                     -- Số lượng OK
        ${stage}_ng_quantity = ?,                       -- Số lượng NG
        ${stage}_output_quantity = ?,                   -- Tổng số lượng sản xuất (OK + NG)
        updated_at = CURRENT_TIMESTAMP                  -- Cập nhật thời gian chỉnh sửa
      WHERE id = ?
    `;

    const totalQuantity = parseInt(good_quantity) + parseInt(ng_quantity);

    const orderQueryParams = [
      worker_name,      // Tham số 1: tên thợ
      machine_name,     // Tham số 2: tên máy
      shift,           // Tham số 3: ca làm việc
      notes,           // Tham số 4: ghi chú
      good_quantity,   // Tham số 5: số lượng OK
      ng_quantity,     // Tham số 6: số lượng NG
      totalQuantity,   // Tham số 7: tổng số lượng
      orderId          // Tham số 8: ID lệnh sản xuất
    ];

    // 2. Cập nhật bảng production_machines - xóa lệnh hiện tại
    const updateMachineQuery = `
      UPDATE production_machines 
      SET 
        current_order_id = NULL,                        -- Xóa ID lệnh sản xuất hiện tại
        current_order_code = NULL                       -- Xóa mã lệnh sản xuất hiện tại
      WHERE machine_name = ?
    `;

    const machineQueryParams = [
      machine_name      // Tham số 1: Tên máy
    ];

    // Thực hiện cập nhật bảng production_orders trước
    db.query(updateOrderQuery, orderQueryParams, (err, orderResult) => {
      if (err) {
        return db.rollback(() => {
          res.status(500).json({ 
            error: 'Lỗi cập nhật production_orders', 
            details: err.message,
            debug_info: {
              code: err.code,
              errno: err.errno,
              sqlState: err.sqlState,
              sqlMessage: err.sqlMessage
            }
          });
        });
      }

      // Kiểm tra xem có cập nhật được dòng nào không
      if (orderResult.affectedRows === 0) {
        return db.rollback(() => {
          res.status(404).json({ 
            error: 'Không tìm thấy lệnh sản xuất với ID: ' + orderId 
          });
        });
      }

      // Thực hiện cập nhật bảng production_machines
      db.query(updateMachineQuery, machineQueryParams, (err, machineResult) => {
        if (err) {
          return db.rollback(() => {
            res.status(500).json({ 
              error: 'Lỗi cập nhật production_machines', 
              details: err.message,
              debug_info: {
                code: err.code,
                errno: err.errno,
                sqlState: err.sqlState,
                sqlMessage: err.sqlMessage
              }
            });
          });
        }

        // Commit transaction nếu tất cả thành công
        db.commit((err) => {
          if (err) {
            return db.rollback(() => {
              res.status(500).json({ 
                error: 'Lỗi commit transaction: ' + err.message 
              });
            });
          }

          // Trả về kết quả thành công
          res.json({
            success: true,
            message: `Đã kết thúc sản xuất công đoạn ${stage.toUpperCase()}`,
            order_id: orderId,
            production_order: production_order,
            stage: stage,
            end_time: new Date().toISOString(),
            worker_name: worker_name,
            machine_name: machine_name,
            shift: shift,
            good_quantity: good_quantity,
            ng_quantity: ng_quantity,
            total_quantity: totalQuantity,
            handover_quantity: handover_quantity,
            affected_rows: {
              production_orders: orderResult.affectedRows,
              production_machines: machineResult.affectedRows
            }
          });
        });
      });
    });
  });
}); 