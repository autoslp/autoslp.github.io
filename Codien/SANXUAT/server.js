const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

let db;

function handleDisconnect() {
  db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'anhvinh123', // Đổi nếu bạn dùng mật khẩu khác
    database: 'autoslp',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 10000,
  });

  db.connect((err) => {
    if (err) {
      console.error('❌ Lỗi kết nối MySQL:', err);
      setTimeout(handleDisconnect, 2000);
    } else {
      console.log('✅ Đã kết nối MySQL');
    }
  });

  db.on('error', (err) => {
    console.error('⚠️ MySQL error:', err);
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
      console.log('🔄 Mất kết nối DB, đang kết nối lại...');
      handleDisconnect();
    } else {
      throw err;
    }
  });
}

handleDisconnect();

// ========== CÁC API CŨ ==========

app.get('/', (req, res) => {
  res.send('✅ API Server is running.');
});

app.get('/data/may', (req, res) => {
  db.query('SELECT * FROM may', (err, results) => {
    if (err) return res.status(500).send('❌ Lỗi truy vấn bảng may');
    res.json(results);
  });
});

app.get('/data/user', (req, res) => {
  db.query('SELECT * FROM user', (err, results) => {
    if (err) return res.status(500).send('❌ Lỗi truy vấn bảng user');
    res.json(results);
  });
});

app.get('/data/congviec', (req, res) => {
  db.query('SELECT * FROM bao_tri_su_co', (err, results) => {
    if (err) return res.status(500).send('❌ Lỗi truy vấn bảng bao_tri_su_co');
    res.json(results);
  });
});

app.get('/data/air_conditioners', (req, res) => {
  db.query('SELECT * FROM air_conditioners', (err, results) => {
    if (err) return res.status(500).send('❌ Lỗi truy vấn bảng air_conditioners');
    res.json(results);
  });
});

app.get('/data/work_history', (req, res) => {
  db.query('SELECT * FROM air_work_history', (err, results) => {
    if (err) return res.status(500).send('❌ Lỗi truy vấn bảng air_work_history');
    res.json(results);
  });
});

app.get('/data/contractors', (req, res) => {
  db.query('SELECT * FROM air_contractors', (err, results) => {
    if (err) return res.status(500).send('❌ Lỗi truy vấn bảng air_contractors');
    res.json(results);
  });
});

app.get('/data/air_areas', (req, res) => {
  db.query('SELECT * FROM air_areas', (err, results) => {
    if (err) return res.status(500).send('❌ Lỗi truy vấn bảng air_areas');
    res.json(results);
  });
});

app.get('/data/air_ac_types', (req, res) => {
  db.query('SELECT * FROM air_ac_types', (err, results) => {
    if (err) return res.status(500).send('❌ Lỗi truy vấn bảng air_ac_types');
    res.json(results);
  });
});

app.get('/data/air_locations', (req, res) => {
  db.query('SELECT * FROM air_locations', (err, results) => {
    if (err) return res.status(500).send('❌ Lỗi truy vấn bảng air_locations');
    res.json(results);
  });
});

app.get('/data/air_brands', (req, res) => {
  db.query('SELECT * FROM air_brands', (err, results) => {
    if (err) return res.status(500).send('❌ Lỗi truy vấn bảng air_brands');
    res.json(results);
  });
});

// ========== MACHINE MANAGEMENT APIs ==========

// Máy móc - machines
app.get('/data/machines', (req, res) => {
  db.query('SELECT * FROM machines', (err, results) => {
    if (err) return res.status(500).send('❌ Lỗi truy vấn bảng machines');
    res.json(results);
  });
});

app.get('/data/machines/:id', (req, res) => {
  const { id } = req.params;
  db.query('SELECT * FROM machines WHERE id = ?', [id], (err, results) => {
    if (err) return res.status(500).send('❌ Lỗi truy vấn máy móc');
    if (results.length === 0) return res.status(404).send('❌ Không tìm thấy máy móc');
    res.json(results[0]);
  });
});

// Lịch sử công việc máy móc - machine_work_history
app.get('/data/machine_work_history', (req, res) => {
  db.query('SELECT * FROM machine_work_history ORDER BY work_date DESC', (err, results) => {
    if (err) return res.status(500).send('❌ Lỗi truy vấn bảng machine_work_history');
    res.json(results);
  });
});

app.get('/data/machine_work_history/:machine_id', (req, res) => {
  const { machine_id } = req.params;
  db.query('SELECT * FROM machine_work_history WHERE machine_id = ? ORDER BY work_date DESC', [machine_id], (err, results) => {
    if (err) return res.status(500).send('❌ Lỗi truy vấn lịch sử công việc');
    res.json(results);
  });
});

// Nhà thầu máy móc - machine_contractors
app.get('/data/machine_contractors', (req, res) => {
  const activeOnly = req.query.active === 'true';
  const query = activeOnly ? 'SELECT * FROM machine_contractors WHERE is_active = 1' : 'SELECT * FROM machine_contractors';
  
  db.query(query, (err, results) => {
    if (err) return res.status(500).send('❌ Lỗi truy vấn bảng machine_contractors');
    res.json(results);
  });
});

// Thống kê máy móc - machine_statistics
app.get('/data/machine_statistics', (req, res) => {
  const statisticsQuery = `
    SELECT 
      COUNT(*) as total_machines,
      SUM(CASE WHEN status = 'excellent' THEN 1 ELSE 0 END) as excellent_count,
      SUM(CASE WHEN status = 'good' THEN 1 ELSE 0 END) as good_count,
      SUM(CASE WHEN status = 'maintenance' THEN 1 ELSE 0 END) as maintenance_count,
      SUM(CASE WHEN status = 'repair' THEN 1 ELSE 0 END) as repair_count,
      SUM(CASE WHEN status = 'broken' THEN 1 ELSE 0 END) as broken_count
    FROM machines
  `;
  
  db.query(statisticsQuery, (err, results) => {
    if (err) return res.status(500).send('❌ Lỗi truy vấn thống kê máy móc');
    
    const stats = results[0];
    const response = {
      total_machines: stats.total_machines,
      machine_by_status: {
        excellent: stats.excellent_count,
        good: stats.good_count,
        maintenance: stats.maintenance_count,
        repair: stats.repair_count,
        broken: stats.broken_count
      },
      upcoming_maintenance: [],
      work_by_type: [],
      monthly_works: []
    };
    
    res.json(response);
  });
});

// Loại máy móc - machine_types
app.get('/data/machine_types', (req, res) => {
  db.query('SELECT * FROM machine_types WHERE is_active = 1', (err, results) => {
    if (err) return res.status(500).send('❌ Lỗi truy vấn bảng machine_types');
    res.json(results);
  });
});

// Khu vực máy móc - machine_areas
app.get('/data/machine_areas', (req, res) => {
  db.query('SELECT * FROM machine_areas WHERE is_active = 1', (err, results) => {
    if (err) return res.status(500).send('❌ Lỗi truy vấn bảng machine_areas');
    res.json(results);
  });
});

// Vị trí máy móc - machine_locations
app.get('/data/machine_locations', (req, res) => {
  const areaId = req.query.area_id;
  let query = 'SELECT * FROM machine_locations WHERE is_active = 1';
  let params = [];
  
  if (areaId) {
    query += ' AND area_id = ?';
    params.push(areaId);
  }
  
  db.query(query, params, (err, results) => {
    if (err) return res.status(500).send('❌ Lỗi truy vấn bảng machine_locations');
    res.json(results);
  });
});

// Thương hiệu máy móc - machine_brands
app.get('/data/machine_brands', (req, res) => {
  db.query('SELECT * FROM machine_brands WHERE is_active = 1', (err, results) => {
    if (err) return res.status(500).send('❌ Lỗi truy vấn bảng machine_brands');
    res.json(results);
  });
});

// Phụ tùng máy móc - machine_parts
app.get('/data/machine_parts', (req, res) => {
  db.query('SELECT * FROM machine_parts WHERE is_active = 1', (err, results) => {
    if (err) return res.status(500).send('❌ Lỗi truy vấn bảng machine_parts');
    res.json(results);
  });
});

// Tồn kho phụ tùng - machine_inventory
app.get('/data/machine_inventory', (req, res) => {
  const query = `
    SELECT 
      i.*,
      p.name as part_name,
      p.code as part_code,
      p.category,
      p.brand as part_brand,
      p.unit,
      p.cost
    FROM machine_inventory i
    JOIN machine_parts p ON i.part_id = p.id
    ORDER BY i.location, p.name
  `;
  
  db.query(query, (err, results) => {
    if (err) return res.status(500).send('❌ Lỗi truy vấn bảng machine_inventory');
    res.json(results);
  });
});

// Cài đặt hệ thống - machine_system_settings
app.get('/data/machine_system_settings', (req, res) => {
  db.query('SELECT * FROM machine_system_settings', (err, results) => {
    if (err) return res.status(500).send('❌ Lỗi truy vấn bảng machine_system_settings');
    res.json(results);
  });
});

app.get('/data/machine_system_settings/:key', (req, res) => {
  const { key } = req.params;
  db.query('SELECT * FROM machine_system_settings WHERE setting_key = ?', [key], (err, results) => {
    if (err) return res.status(500).send('❌ Lỗi truy vấn cài đặt hệ thống');
    if (results.length === 0) return res.status(404).send('❌ Không tìm thấy cài đặt');
    res.json(results[0]);
  });
});

// ========== PRODUCTION ORDERS APIs ==========

// Lấy tất cả lệnh sản xuất với bộ lọc
app.get('/data/production_orders', (req, res) => {
  let query = 'SELECT * FROM production_orders WHERE 1=1';
  let params = [];
  
  // Bộ lọc theo ngày triển khai
  if (req.query.deployment_date) {
    query += ' AND deployment_date = ?';
    params.push(req.query.deployment_date);
  }
  
  // Bộ lọc theo trạng thái
  if (req.query.status) {
    query += ' AND status = ?';
    params.push(req.query.status);
  }
  
  // Bộ lọc theo khách hàng
  if (req.query.customer_name) {
    query += ' AND customer_name LIKE ?';
    params.push(`%${req.query.customer_name}%`);
  }
  
  // Tìm kiếm theo từ khóa
  if (req.query.search) {
    query += ' AND (production_order LIKE ? OR po_number LIKE ? OR product_name LIKE ? OR customer_name LIKE ?)';
    const searchTerm = `%${req.query.search}%`;
    params.push(searchTerm, searchTerm, searchTerm, searchTerm);
  }
  
  // Sắp xếp
  query += ' ORDER BY created_at DESC';
  
  // Phân trang
  if (req.query.limit) {
    query += ' LIMIT ?';
    params.push(parseInt(req.query.limit));
    
    if (req.query.offset) {
      query += ' OFFSET ?';
      params.push(parseInt(req.query.offset));
    }
  }
  
  db.query(query, params, (err, results) => {
    if (err) {
      console.error('❌ Lỗi truy vấn production_orders:', err);
      return res.status(500).json({ error: 'Lỗi truy vấn dữ liệu', details: err.message });
    }
    res.json(results);
  });
});

// Lấy chi tiết một lệnh sản xuất
app.get('/data/production_orders/:id', (req, res) => {
  const { id } = req.params;
  db.query('SELECT * FROM production_orders WHERE id = ?', [id], (err, results) => {
    if (err) {
      console.error('❌ Lỗi truy vấn lệnh sản xuất:', err);
      return res.status(500).json({ error: 'Lỗi truy vấn dữ liệu' });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: 'Không tìm thấy lệnh sản xuất' });
    }
    res.json(results[0]);
  });
});

// Tạo lệnh sản xuất mới
app.post('/data/production_orders', (req, res) => {
  const {
    deployment_date, production_order, po_number, sales_order_code, order_date, delivery_date,
    internal_product_code, order_type, customer_code, customer_name, product_name, version,
    not_deployed_reason, sales_note, customer_production_note, order_quantity, inventory,
    required_quantity, deployed_quantity, offset_waste, waste, sheet_count, product_length,
    product_width, product_height, paper_length, paper_width, part_count, color_count,
    customer_group, paper_type, paper_weight, work_stage, status
  } = req.body;
  
  const query = `
    INSERT INTO production_orders (
      deployment_date, production_order, po_number, sales_order_code, order_date, delivery_date,
      internal_product_code, order_type, customer_code, customer_name, product_name, version,
      not_deployed_reason, sales_note, customer_production_note, order_quantity, inventory,
      required_quantity, deployed_quantity, offset_waste, waste, sheet_count, product_length,
      product_width, product_height, paper_length, paper_width, part_count, color_count,
      customer_group, paper_type, paper_weight, work_stage, status
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  
  db.query(query, [
    deployment_date, production_order, po_number, sales_order_code, order_date, delivery_date,
    internal_product_code, order_type, customer_code, customer_name, product_name, version,
    not_deployed_reason, sales_note, customer_production_note, order_quantity || 0, inventory || 0,
    required_quantity || 0, deployed_quantity || 0, offset_waste || 0, waste || 0, sheet_count || 0,
    product_length, product_width, product_height, paper_length, paper_width, part_count || 0,
    color_count || 0, customer_group, paper_type, paper_weight, work_stage, status || 'Chờ triển khai'
  ], (err, result) => {
    if (err) {
      console.error('❌ Lỗi tạo lệnh sản xuất:', err);
      return res.status(500).json({ error: 'Lỗi tạo lệnh sản xuất', details: err.message });
    }
    res.json({ 
      success: true, 
      id: result.insertId, 
      message: 'Tạo lệnh sản xuất thành công' 
    });
  });
});

// Cập nhật lệnh sản xuất
app.put('/data/production_orders/:id', (req, res) => {
  const { id } = req.params;
  const {
    deployment_date, production_order, po_number, sales_order_code, order_date, delivery_date,
    internal_product_code, order_type, customer_code, customer_name, product_name, version,
    not_deployed_reason, sales_note, customer_production_note, order_quantity, inventory,
    required_quantity, deployed_quantity, offset_waste, waste, sheet_count, product_length,
    product_width, product_height, paper_length, paper_width, part_count, color_count,
    customer_group, paper_type, paper_weight, work_stage, status
  } = req.body;
  
  const query = `
    UPDATE production_orders SET 
      deployment_date = ?, production_order = ?, po_number = ?, sales_order_code = ?, 
      order_date = ?, delivery_date = ?, internal_product_code = ?, order_type = ?, 
      customer_code = ?, customer_name = ?, product_name = ?, version = ?,
      not_deployed_reason = ?, sales_note = ?, customer_production_note = ?, 
      order_quantity = ?, inventory = ?, required_quantity = ?, deployed_quantity = ?, 
      offset_waste = ?, waste = ?, sheet_count = ?, product_length = ?, product_width = ?, 
      product_height = ?, paper_length = ?, paper_width = ?, part_count = ?, color_count = ?,
      customer_group = ?, paper_type = ?, paper_weight = ?, work_stage = ?, status = ?,
      updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `;
  
  db.query(query, [
    deployment_date, production_order, po_number, sales_order_code, order_date, delivery_date,
    internal_product_code, order_type, customer_code, customer_name, product_name, version,
    not_deployed_reason, sales_note, customer_production_note, order_quantity || 0, inventory || 0,
    required_quantity || 0, deployed_quantity || 0, offset_waste || 0, waste || 0, sheet_count || 0,
    product_length, product_width, product_height, paper_length, paper_width, part_count || 0,
    color_count || 0, customer_group, paper_type, paper_weight, work_stage, status, id
  ], (err, result) => {
    if (err) {
      console.error('❌ Lỗi cập nhật lệnh sản xuất:', err);
      return res.status(500).json({ error: 'Lỗi cập nhật lệnh sản xuất', details: err.message });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Không tìm thấy lệnh sản xuất' });
    }
    res.json({ 
      success: true, 
      message: 'Cập nhật lệnh sản xuất thành công' 
    });
  });
});

// Xóa lệnh sản xuất
app.delete('/data/production_orders/:id', (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM production_orders WHERE id = ?', [id], (err, result) => {
    if (err) {
      console.error('❌ Lỗi xóa lệnh sản xuất:', err);
      return res.status(500).json({ error: 'Lỗi xóa lệnh sản xuất', details: err.message });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Không tìm thấy lệnh sản xuất' });
    }
    res.json({ 
      success: true, 
      message: 'Xóa lệnh sản xuất thành công' 
    });
  });
});

// Thống kê tổng quan lệnh sản xuất
app.get('/data/production_orders_stats', (req, res) => {
  db.query('SELECT * FROM production_orders_stats', (err, results) => {
    if (err) {
      console.error('❌ Lỗi truy vấn thống kê:', err);
      return res.status(500).json({ error: 'Lỗi truy vấn thống kê' });
    }
    res.json(results[0] || {});
  });
});

// Thống kê theo khách hàng
app.get('/data/customer_orders_stats', (req, res) => {
  db.query('SELECT * FROM customer_orders_stats LIMIT 10', (err, results) => {
    if (err) {
      console.error('❌ Lỗi truy vấn thống kê khách hàng:', err);
      return res.status(500).json({ error: 'Lỗi truy vấn thống kê khách hàng' });
    }
    res.json(results);
  });
});

// Thống kê theo tháng
app.get('/data/monthly_orders_stats', (req, res) => {
  db.query('SELECT * FROM monthly_orders_stats LIMIT 12', (err, results) => {
    if (err) {
      console.error('❌ Lỗi truy vấn thống kê theo tháng:', err);
      return res.status(500).json({ error: 'Lỗi truy vấn thống kê theo tháng' });
    }
    res.json(results);
  });
});

// Lấy danh sách khách hàng distinct
app.get('/data/customers', (req, res) => {
  const query = `
    SELECT DISTINCT customer_name, customer_code, customer_group
    FROM production_orders 
    WHERE customer_name IS NOT NULL AND customer_name != ''
    ORDER BY customer_name
  `;
  
  db.query(query, (err, results) => {
    if (err) {
      console.error('❌ Lỗi truy vấn danh sách khách hàng:', err);
      return res.status(500).json({ error: 'Lỗi truy vấn danh sách khách hàng' });
    }
    res.json(results);
  });
});

// Khởi động server
app.listen(port, () => {
  console.log(`🚀 Server đang chạy tại http://localhost:${port}`);
});
