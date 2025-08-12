// =====================================================
// PRODUCTION ORDERS SHIFT APIs
// Quản lý thông tin chi tiết theo từng ca làm việc
// =====================================================

const express = require('express');
const router = express.Router();

// =====================================================
// API LẤY DANH SÁCH SHIFT CỦA MỘT LỆNH SẢN XUẤT
// =====================================================

/**
 * GET /data/production_orders/:id/shifts
 * Lấy tất cả ca làm việc của một lệnh sản xuất
 */
app.get('/data/production_orders/:id/shifts', (req, res) => {
  const orderId = req.params.id;
  const { stage, shift_date, status } = req.query;

  let query = `
    SELECT 
      pos.*,
      COALESCE(pos.production_order, po.production_order) as production_order,
      po.product_name,
      po.customer_name,
      po.internal_product_code
    FROM production_orders_shift pos
    LEFT JOIN production_orders po ON pos.production_order_id = po.id
    WHERE pos.production_order_id = ?
  `;
  
  let params = [orderId];

  // Filter theo công đoạn
  if (stage) {
    query += ' AND pos.stage = ?';
    params.push(stage);
  }

  // Filter theo ngày
  if (shift_date) {
    query += ' AND pos.shift_date = ?';
    params.push(shift_date);
  }

  // Filter theo trạng thái
  if (status) {
    query += ' AND pos.status = ?';
    params.push(status);
  }

  query += ' ORDER BY pos.stage, pos.shift_number ASC';

  db.query(query, params, (err, results) => {
    if (err) {
      console.error('❌ Lỗi lấy danh sách shift:', err);
      return res.status(500).json({
        error: 'Lỗi lấy danh sách shift',
        details: err.message
      });
    }

    res.json({
      order_id: orderId,
      total_shifts: results.length,
      shifts: results
    });
  });
});

// =====================================================
// API LẤY CHI TIẾT MỘT SHIFT
// =====================================================

/**
 * GET /data/production_orders_shift/:id
 * Lấy chi tiết một ca làm việc
 */
app.get('/data/production_orders_shift/:id', (req, res) => {
  const shiftId = req.params.id;

      const query = `
      SELECT 
        pos.*,
        COALESCE(pos.production_order, po.production_order) as production_order,
        po.product_name,
        po.customer_name,
        po.internal_product_code,
        po.order_quantity,
        po.deployed_quantity
      FROM production_orders_shift pos
      LEFT JOIN production_orders po ON pos.production_order_id = po.id
      WHERE pos.id = ?
    `;

  db.query(query, [shiftId], (err, results) => {
    if (err) {
      console.error('❌ Lỗi lấy chi tiết shift:', err);
      return res.status(500).json({
        error: 'Lỗi lấy chi tiết shift',
        details: err.message
      });
    }

    if (results.length === 0) {
      return res.status(404).json({
        error: 'Không tìm thấy shift với ID: ' + shiftId
      });
    }

    res.json({
      success: true,
      shift: results[0]
    });
  });
});

// =====================================================
// API TẠO SHIFT MỚI
// =====================================================

/**
 * POST /data/production_orders_shift
 * Tạo ca làm việc mới
 */
app.post('/data/production_orders_shift', (req, res) => {
  const {
    production_order_id,
    stage,
    shift_number,
    shift_name,
    shift_date,
    input_quantity,
    worker_name,
    machine_name,
    start_time,
    notes
  } = req.body;

  // Validation
  if (!production_order_id || !stage || !shift_number) {
    return res.status(400).json({
      error: 'Thiếu thông tin bắt buộc: production_order_id, stage, shift_number'
    });
  }

  // Kiểm tra xem shift này đã tồn tại chưa
  const checkQuery = `
    SELECT id FROM production_orders_shift 
    WHERE production_order_id = ? AND stage = ? AND shift_number = ?
  `;

  db.query(checkQuery, [production_order_id, stage, shift_number], (checkErr, checkResults) => {
    if (checkErr) {
      console.error('❌ Lỗi kiểm tra shift tồn tại:', checkErr);
      return res.status(500).json({
        error: 'Lỗi kiểm tra shift tồn tại',
        details: checkErr.message
      });
    }

    if (checkResults.length > 0) {
      return res.status(400).json({
        error: `Shift ${shift_number} của công đoạn ${stage} đã tồn tại cho lệnh sản xuất này`
      });
    }

    // Tạo shift mới
    const insertQuery = `
      INSERT INTO production_orders_shift (
        production_order_id, stage, shift_number, shift_name, shift_date,
        input_quantity, worker_name, machine_name, start_time, notes,
        status, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'in_progress', NOW(), NOW())
    `;

    const insertParams = [
      production_order_id, stage, shift_number, shift_name, shift_date,
      input_quantity || 0, worker_name, machine_name, start_time, notes
    ];

    db.query(insertQuery, insertParams, (insertErr, insertResult) => {
      if (insertErr) {
        console.error('❌ Lỗi tạo shift mới:', insertErr);
        return res.status(500).json({
          error: 'Lỗi tạo shift mới',
          details: insertErr.message
        });
      }

      const newShiftId = insertResult.insertId;

      // Lấy thông tin shift vừa tạo
      const getShiftQuery = `
        SELECT 
          pos.*,
          po.production_order,
          po.product_name,
          po.customer_name
        FROM production_orders_shift pos
        LEFT JOIN production_orders po ON pos.production_order_id = po.id
        WHERE pos.id = ?
      `;

      db.query(getShiftQuery, [newShiftId], (getErr, getResults) => {
        if (getErr) {
          console.error('❌ Lỗi lấy thông tin shift mới:', getErr);
        }

        res.status(201).json({
          success: true,
          message: `Đã tạo ca ${shift_number} cho công đoạn ${stage}`,
          shift_id: newShiftId,
          shift: getResults[0] || { id: newShiftId }
        });
      });
    });
  });
});

// =====================================================
// API CẬP NHẬT SHIFT
// =====================================================

/**
 * PUT /data/production_orders_shift/:id
 * Cập nhật thông tin ca làm việc
 */
app.put('/data/production_orders_shift/:id', (req, res) => {
  const shiftId = req.params.id;
  const {
    output_quantity,
    good_quantity,
    ng_quantity,
    ng_start_end_quantity,
    return_quantity,
    handover_quantity,
    end_time,
    worker_name,
    machine_name,
    handover_person,
    receiver_person,
    ng_reason,
    efficiency_percent,
    quality_score,
    status,
    notes,
    quality_notes,
    is_overtime,
    overtime_hours,
    is_night_shift
  } = req.body;

  // Tính toán thời gian làm việc nếu có start_time và end_time
  let work_duration_minutes = 0;
  if (req.body.start_time && end_time) {
    const startTime = new Date(req.body.start_time);
    const endTime = new Date(end_time);
    work_duration_minutes = Math.round((endTime - startTime) / (1000 * 60));
  }

  const updateQuery = `
    UPDATE production_orders_shift 
    SET 
      output_quantity = ?,
      good_quantity = ?,
      ng_quantity = ?,
      ng_start_end_quantity = ?,
      return_quantity = ?,
      handover_quantity = ?,
      end_time = ?,
      worker_name = ?,
      machine_name = ?,
      handover_person = ?,
      receiver_person = ?,
      ng_reason = ?,
      efficiency_percent = ?,
      quality_score = ?,
      status = ?,
      notes = ?,
      quality_notes = ?,
      work_duration_minutes = ?,
      is_overtime = ?,
      overtime_hours = ?,
      is_night_shift = ?,
      updated_at = NOW()
    WHERE id = ?
  `;

  const updateParams = [
    output_quantity || 0,
    good_quantity || 0,
    ng_quantity || 0,
    ng_start_end_quantity || 0,
    return_quantity || 0,
    handover_quantity || 0,
    end_time,
    worker_name,
    machine_name,
    handover_person,
    receiver_person,
    ng_reason,
    efficiency_percent || 0,
    quality_score || 0,
    status || 'in_progress',
    notes,
    quality_notes,
    work_duration_minutes,
    is_overtime || 0,
    overtime_hours || 0,
    is_night_shift || 0,
    shiftId
  ];

  db.query(updateQuery, updateParams, (err, result) => {
    if (err) {
      console.error('❌ Lỗi cập nhật shift:', err);
      return res.status(500).json({
        error: 'Lỗi cập nhật shift',
        details: err.message
      });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({
        error: 'Không tìm thấy shift với ID: ' + shiftId
      });
    }

    res.json({
      success: true,
      message: 'Đã cập nhật shift thành công',
      shift_id: shiftId,
      affected_rows: result.affectedRows
    });
  });
});

// =====================================================
// API XÓA SHIFT
// =====================================================

/**
 * DELETE /data/production_orders_shift/:id
 * Xóa ca làm việc
 */
app.delete('/data/production_orders_shift/:id', (req, res) => {
  const shiftId = req.params.id;

  // Kiểm tra xem shift có tồn tại không
  const checkQuery = 'SELECT production_order_id, stage FROM production_orders_shift WHERE id = ?';

  db.query(checkQuery, [shiftId], (checkErr, checkResults) => {
    if (checkErr) {
      console.error('❌ Lỗi kiểm tra shift:', checkErr);
      return res.status(500).json({
        error: 'Lỗi kiểm tra shift',
        details: checkErr.message
      });
    }

    if (checkResults.length === 0) {
      return res.status(404).json({
        error: 'Không tìm thấy shift với ID: ' + shiftId
      });
    }

    const shiftInfo = checkResults[0];

    // Xóa shift
    const deleteQuery = 'DELETE FROM production_orders_shift WHERE id = ?';

    db.query(deleteQuery, [shiftId], (deleteErr, deleteResult) => {
      if (deleteErr) {
        console.error('❌ Lỗi xóa shift:', deleteErr);
        return res.status(500).json({
          error: 'Lỗi xóa shift',
          details: deleteErr.message
        });
      }

      res.json({
        success: true,
        message: 'Đã xóa shift thành công',
        shift_id: shiftId,
        order_id: shiftInfo.production_order_id,
        stage: shiftInfo.stage,
        affected_rows: deleteResult.affectedRows
      });
    });
  });
});

// =====================================================
// API KẾT THÚC SHIFT
// =====================================================

/**
 * POST /data/production_orders_shift/:id/complete
 * Kết thúc ca làm việc
 */
app.post('/data/production_orders_shift/:id/complete', (req, res) => {
  const shiftId = req.params.id;
  const {
    output_quantity,
    good_quantity,
    ng_quantity,
    ng_start_end_quantity,
    return_quantity,
    handover_quantity,
    end_time,
    handover_person,
    receiver_person,
    ng_reason,
    notes
  } = req.body;

  // Validation
  if (!output_quantity || !good_quantity || !end_time) {
    return res.status(400).json({
      error: 'Thiếu thông tin bắt buộc: output_quantity, good_quantity, end_time'
    });
  }

  // Lấy thông tin shift hiện tại
  const getShiftQuery = 'SELECT * FROM production_orders_shift WHERE id = ?';

  db.query(getShiftQuery, [shiftId], (getErr, getResults) => {
    if (getErr) {
      console.error('❌ Lỗi lấy thông tin shift:', getErr);
      return res.status(500).json({
        error: 'Lỗi lấy thông tin shift',
        details: getErr.message
      });
    }

    if (getResults.length === 0) {
      return res.status(404).json({
        error: 'Không tìm thấy shift với ID: ' + shiftId
      });
    }

    const currentShift = getResults[0];

    // Tính toán thời gian làm việc
    let work_duration_minutes = 0;
    if (currentShift.start_time && end_time) {
      const startTime = new Date(currentShift.start_time);
      const endTime = new Date(end_time);
      work_duration_minutes = Math.round((endTime - startTime) / (1000 * 60));
    }

    // Tính hiệu suất
    const efficiency_percent = currentShift.input_quantity > 0 ? (good_quantity / currentShift.input_quantity) * 100 : 0;

    // Cập nhật shift
    const updateQuery = `
      UPDATE production_orders_shift 
      SET 
        output_quantity = ?,
        good_quantity = ?,
        ng_quantity = ?,
        ng_start_end_quantity = ?,
        return_quantity = ?,
        handover_quantity = ?,
        end_time = ?,
        handover_person = ?,
        receiver_person = ?,
        ng_reason = ?,
        efficiency_percent = ?,
        work_duration_minutes = ?,
        status = 'completed',
        notes = ?,
        updated_at = NOW()
      WHERE id = ?
    `;

    const updateParams = [
      output_quantity,
      good_quantity,
      ng_quantity || 0,
      ng_start_end_quantity || 0,
      return_quantity || 0,
      handover_quantity || good_quantity,
      end_time,
      handover_person,
      receiver_person,
      ng_reason,
      efficiency_percent,
      work_duration_minutes,
      notes,
      shiftId
    ];

    db.query(updateQuery, updateParams, (updateErr, updateResult) => {
      if (updateErr) {
        console.error('❌ Lỗi kết thúc shift:', updateErr);
        return res.status(500).json({
          error: 'Lỗi kết thúc shift',
          details: updateErr.message
        });
      }

      res.json({
        success: true,
        message: 'Đã kết thúc shift thành công',
        shift_id: shiftId,
        order_id: currentShift.production_order_id,
        stage: currentShift.stage,
        shift_number: currentShift.shift_number,
        completion_data: {
          output_quantity: output_quantity,
          good_quantity: good_quantity,
          ng_quantity: ng_quantity || 0,
          handover_quantity: handover_quantity || good_quantity,
          work_duration_minutes: work_duration_minutes,
          efficiency_percent: efficiency_percent
        }
      });
    });
  });
});

// =====================================================
// API THỐNG KÊ SHIFT
// =====================================================

/**
 * GET /data/production_orders_shift/statistics
 * Thống kê theo ca làm việc
 */
app.get('/data/production_orders_shift/statistics', (req, res) => {
  const { stage, shift_date, worker_name, machine_name } = req.query;

  let query = `
    SELECT 
      pos.stage,
      pos.shift_name,
      pos.shift_date,
      COUNT(*) as total_shifts,
      SUM(pos.good_quantity) as total_good,
      SUM(pos.ng_quantity) as total_ng,
      SUM(pos.output_quantity) as total_output,
      SUM(pos.handover_quantity) as total_handover,
      AVG(pos.efficiency_percent) as avg_efficiency,
      SUM(pos.work_duration_minutes) as total_work_minutes,
      COUNT(DISTINCT pos.worker_name) as unique_workers,
      COUNT(DISTINCT pos.machine_name) as unique_machines,
      COUNT(CASE WHEN pos.status = 'completed' THEN 1 END) as completed_shifts,
      COUNT(CASE WHEN pos.status = 'in_progress' THEN 1 END) as in_progress_shifts
    FROM production_orders_shift pos
    WHERE 1=1
  `;
  
  let params = [];

  // Filter theo công đoạn
  if (stage) {
    query += ' AND pos.stage = ?';
    params.push(stage);
  }

  // Filter theo ngày
  if (shift_date) {
    query += ' AND pos.shift_date = ?';
    params.push(shift_date);
  }

  // Filter theo worker
  if (worker_name) {
    query += ' AND pos.worker_name LIKE ?';
    params.push(`%${worker_name}%`);
  }

  // Filter theo machine
  if (machine_name) {
    query += ' AND pos.machine_name LIKE ?';
    params.push(`%${machine_name}%`);
  }

  query += ' GROUP BY pos.stage, pos.shift_name, pos.shift_date ORDER BY pos.shift_date DESC, pos.stage, pos.shift_name';

  db.query(query, params, (err, results) => {
    if (err) {
      console.error('❌ Lỗi thống kê shift:', err);
      return res.status(500).json({
        error: 'Lỗi thống kê shift',
        details: err.message
      });
    }

    res.json({
      success: true,
      statistics: results,
      filters: {
        stage: stage,
        shift_date: shift_date,
        worker_name: worker_name,
        machine_name: machine_name
      }
    });
  });
});

// =====================================================
// API TỔNG HỢP DỮ LIỆU SHIFT VÀ PRODUCTION_ORDERS
// =====================================================

/**
 * GET /data/production_orders/:id/summary
 * Tổng hợp dữ liệu từ cả 2 bảng
 */
app.get('/data/production_orders/:id/summary', (req, res) => {
  const orderId = req.params.id;

  // Lấy thông tin lệnh sản xuất
  const orderQuery = 'SELECT * FROM production_orders WHERE id = ?';

  db.query(orderQuery, [orderId], (orderErr, orderResults) => {
    if (orderErr) {
      console.error('❌ Lỗi lấy thông tin lệnh sản xuất:', orderErr);
      return res.status(500).json({
        error: 'Lỗi lấy thông tin lệnh sản xuất',
        details: orderErr.message
      });
    }

    if (orderResults.length === 0) {
      return res.status(404).json({
        error: 'Không tìm thấy lệnh sản xuất với ID: ' + orderId
      });
    }

    const order = orderResults[0];

    // Lấy thống kê shift theo từng công đoạn
    const shiftStatsQuery = `
      SELECT 
        stage,
        COUNT(*) as total_shifts,
        SUM(good_quantity) as total_good_from_shifts,
        SUM(ng_quantity) as total_ng_from_shifts,
        SUM(output_quantity) as total_output_from_shifts,
        SUM(handover_quantity) as total_handover_from_shifts,
        AVG(efficiency_percent) as avg_efficiency,
        SUM(work_duration_minutes) as total_work_minutes
      FROM production_orders_shift 
      WHERE production_order_id = ?
      GROUP BY stage
    `;

    db.query(shiftStatsQuery, [orderId], (shiftErr, shiftResults) => {
      if (shiftErr) {
        console.error('❌ Lỗi lấy thống kê shift:', shiftErr);
      }

      // Tạo object thống kê theo stage
      const shiftStats = {};
      shiftResults.forEach(stat => {
        shiftStats[stat.stage] = stat;
      });

      // So sánh dữ liệu từ 2 bảng
      const comparison = {};
      const stages = ['xa', 'xen', 'in_offset', 'boi', 'be', 'dan_may', 'kho'];
      
      stages.forEach(stage => {
        const shiftData = shiftStats[stage];
        const orderData = {
          good_quantity: order[`${stage}_good_quantity`] || 0,
          ng_quantity: order[`${stage}_ng_quantity`] || 0,
          output_quantity: order[`${stage}_output_quantity`] || 0,
          handover_quantity: order[`${stage}_handover_quantity`] || 0
        };

        comparison[stage] = {
          from_production_orders: orderData,
          from_shifts: shiftData || {
            total_shifts: 0,
            total_good_from_shifts: 0,
            total_ng_from_shifts: 0,
            total_output_from_shifts: 0,
            total_handover_from_shifts: 0
          },
          difference: shiftData ? {
            good_diff: orderData.good_quantity - shiftData.total_good_from_shifts,
            ng_diff: orderData.ng_quantity - shiftData.total_ng_from_shifts,
            output_diff: orderData.output_quantity - shiftData.total_output_from_shifts,
            handover_diff: orderData.handover_quantity - shiftData.total_handover_from_shifts
          } : null
        };
      });

      res.json({
        success: true,
        order: {
          id: order.id,
          production_order: order.production_order,
          product_name: order.product_name,
          customer_name: order.customer_name,
          order_quantity: order.order_quantity,
          deployed_quantity: order.deployed_quantity
        },
        shift_statistics: shiftStats,
        comparison: comparison,
        summary: {
          total_stages_with_shifts: Object.keys(shiftStats).length,
          total_shifts: shiftResults.reduce((sum, stat) => sum + stat.total_shifts, 0),
          total_good_from_shifts: shiftResults.reduce((sum, stat) => sum + stat.total_good_from_shifts, 0),
          total_ng_from_shifts: shiftResults.reduce((sum, stat) => sum + stat.total_ng_from_shifts, 0),
          total_handover_from_shifts: shiftResults.reduce((sum, stat) => sum + stat.total_handover_from_shifts, 0)
        }
      });
    });
  });
});

module.exports = router; 