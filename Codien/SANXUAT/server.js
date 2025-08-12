const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

let db;

function handleDisconnect() {
  db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'anhvinh123', //  ?i n?u b?n d ng m?t kh?u kh c
    database: 'autoslp',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 10000,
  });

  db.connect((err) => {
    if (err) {
      console.error('? L?i k?t n?i MySQL:', err);
      setTimeout(handleDisconnect, 2000);
    } else {
      console.log('?    k?t n?i MySQL');
    }
  });

  db.on('error', (err) => {
    console.error('?? MySQL error:', err);
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
      console.log('?? M?t k?t n?i DB, dang k?t n?i l?i...');
      handleDisconnect();
    } else {
      throw err;
    }
  });
}

handleDisconnect();

// ========== C C API CU ==========

app.get('/', (req, res) => {
  res.send('? API Server is running.');
});

app.get('/data/may', (req, res) => {
  db.query('SELECT * FROM may', (err, results) => {
    if (err) return res.status(500).send('? L?i truy v?n b?ng may');
    res.json(results);
  });
});

app.get('/data/user', (req, res) => {
  db.query('SELECT * FROM user', (err, results) => {
    if (err) return res.status(500).send('? L?i truy v?n b?ng user');
    res.json(results);
  });
});

// Login API
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  
  if (!username || !password) {
    return res.status(400).json({ error: 'Vui lòng nhập tên đăng nhập và mật khẩu' });
  }
  
  const query = 'SELECT * FROM user WHERE ma_nhan_vien = ? AND mat_khau = ?';
  db.query(query, [username, password], (err, results) => {
    if (err) {
      console.error('Login error:', err);
      return res.status(500).json({ error: 'Lỗi server' });
    }
    
    if (results.length === 0) {
      return res.status(401).json({ error: 'Tên đăng nhập hoặc mật khẩu không đúng' });
    }
    
    const user = results[0];
    
    // Tạo session data
    const sessionData = {
      user_id: user.ma_nhan_vien,
      username: user.ma_nhan_vien,
      full_name: user.ten_nhan_vien,
      manager: user.nguoi_quan_ly,
      department: user.bo_phan,
      role: user.chuc_vu,
      login_time: new Date().toISOString(),
      expires_at: new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString() // 8 giờ
    };
    
    res.json(sessionData);
  });
});

// Check session API
app.get('/check-session', (req, res) => {
  const sessionData = req.headers['x-session-data'];
  
  if (!sessionData) {
    return res.status(401).json({ error: 'Không có session' });
  }
  
  try {
    const session = JSON.parse(sessionData);
    const now = new Date();
    const expiresAt = new Date(session.expires_at);
    
    if (now > expiresAt) {
      return res.status(401).json({ error: 'Session đã hết hạn' });
    }
    
    res.json({ valid: true, user: session });
  } catch (error) {
    res.status(401).json({ error: 'Session không hợp lệ' });
  }
});

app.get('/data/congviec', (req, res) => {
  db.query('SELECT * FROM bao_tri_su_co', (err, results) => {
    if (err) return res.status(500).send('? L?i truy v?n b?ng bao_tri_su_co');
    res.json(results);
  });
});

app.get('/data/air_conditioners', (req, res) => {
  db.query('SELECT * FROM air_conditioners', (err, results) => {
    if (err) return res.status(500).send('? L?i truy v?n b?ng air_conditioners');
    res.json(results);
  });
});

app.get('/data/work_history', (req, res) => {
  db.query('SELECT * FROM air_work_history', (err, results) => {
    if (err) return res.status(500).send('? L?i truy v?n b?ng air_work_history');
    res.json(results);
  });
});

app.get('/data/contractors', (req, res) => {
  db.query('SELECT * FROM air_contractors', (err, results) => {
    if (err) return res.status(500).send('? L?i truy v?n b?ng air_contractors');
    res.json(results);
  });
});

app.get('/data/air_areas', (req, res) => {
  db.query('SELECT * FROM air_areas', (err, results) => {
    if (err) return res.status(500).send('? L?i truy v?n b?ng air_areas');
    res.json(results);
  });
});

app.get('/data/air_ac_types', (req, res) => {
  db.query('SELECT * FROM air_ac_types', (err, results) => {
    if (err) return res.status(500).send('? L?i truy v?n b?ng air_ac_types');
    res.json(results);
  });
});

app.get('/data/air_locations', (req, res) => {
  db.query('SELECT * FROM air_locations', (err, results) => {
    if (err) return res.status(500).send('? L?i truy v?n b?ng air_locations');
    res.json(results);
  });
});

app.get('/data/air_brands', (req, res) => {
  db.query('SELECT * FROM air_brands', (err, results) => {
    if (err) return res.status(500).send('? L?i truy v?n b?ng air_brands');
    res.json(results);
  });
});

// ========== MACHINE MANAGEMENT APIs ==========

// M y m c - machines
app.get('/data/machines', (req, res) => {
  db.query('SELECT * FROM machines', (err, results) => {
    if (err) return res.status(500).send('? L?i truy v?n b?ng machines');
    res.json(results);
  });
});

app.get('/data/machines/:id', (req, res) => {
  const { id } = req.params;
  db.query('SELECT * FROM machines WHERE id = ?', [id], (err, results) => {
    if (err) return res.status(500).send('? L?i truy v?n m y m c');
    if (results.length === 0) return res.status(404).send('? Kh ng t m th?y m y m c');
    res.json(results[0]);
  });
});

// L?ch s? c ng vi?c m y m c - machine_work_history
app.get('/data/machine_work_history', (req, res) => {
  db.query('SELECT * FROM machine_work_history ORDER BY work_date DESC', (err, results) => {
    if (err) return res.status(500).send('? L?i truy v?n b?ng machine_work_history');
    res.json(results);
  });
});

app.get('/data/machine_work_history/:machine_id', (req, res) => {
  const { machine_id } = req.params;
  db.query('SELECT * FROM machine_work_history WHERE machine_id = ? ORDER BY work_date DESC', [machine_id], (err, results) => {
    if (err) return res.status(500).send('? L?i truy v?n l?ch s? c ng vi?c');
    res.json(results);
  });
});

// Nh  th?u m y m c - machine_contractors
app.get('/data/machine_contractors', (req, res) => {
  const activeOnly = req.query.active === 'true';
  const query = activeOnly ? 'SELECT * FROM machine_contractors WHERE is_active = 1' : 'SELECT * FROM machine_contractors';
  
  db.query(query, (err, results) => {
    if (err) return res.status(500).send('? L?i truy v?n b?ng machine_contractors');
    res.json(results);
  });
});

// Th?ng k  m y m c - machine_statistics
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
    if (err) return res.status(500).send('? L?i truy v?n th?ng k  m y m c');
    
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

// Lo?i m y m c - machine_types
app.get('/data/machine_types', (req, res) => {
  db.query('SELECT * FROM machine_types WHERE is_active = 1', (err, results) => {
    if (err) return res.status(500).send('? L?i truy v?n b?ng machine_types');
    res.json(results);
  });
});

// Khu v?c m y m c - machine_areas
app.get('/data/machine_areas', (req, res) => {
  db.query('SELECT * FROM machine_areas WHERE is_active = 1', (err, results) => {
    if (err) return res.status(500).send('? L?i truy v?n b?ng machine_areas');
    res.json(results);
  });
});

// V? tr  m y m c - machine_locations
app.get('/data/machine_locations', (req, res) => {
  const areaId = req.query.area_id;
  let query = 'SELECT * FROM machine_locations WHERE is_active = 1';
  let params = [];
  
  if (areaId) {
    query += ' AND area_id = ?';
    params.push(areaId);
  }
  
  db.query(query, params, (err, results) => {
    if (err) return res.status(500).send('? L?i truy v?n b?ng machine_locations');
    res.json(results);
  });
});

// Thuong hi?u m y m c - machine_brands
app.get('/data/machine_brands', (req, res) => {
  db.query('SELECT * FROM machine_brands WHERE is_active = 1', (err, results) => {
    if (err) return res.status(500).send('? L?i truy v?n b?ng machine_brands');
    res.json(results);
  });
});

// Ph? t ng m y m c - machine_parts
app.get('/data/machine_parts', (req, res) => {
  db.query('SELECT * FROM machine_parts WHERE is_active = 1', (err, results) => {
    if (err) return res.status(500).send('? L?i truy v?n b?ng machine_parts');
    res.json(results);
  });
});

// T?n kho ph? t ng - machine_inventory
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
    if (err) return res.status(500).send('? L?i truy v?n b?ng machine_inventory');
    res.json(results);
  });
});

// C i d?t h? th?ng - machine_system_settings
app.get('/data/machine_system_settings', (req, res) => {
  db.query('SELECT * FROM machine_system_settings', (err, results) => {
    if (err) return res.status(500).send('? L?i truy v?n b?ng machine_system_settings');
    res.json(results);
  });
});

app.get('/data/machine_system_settings/:key', (req, res) => {
  const { key } = req.params;
  db.query('SELECT * FROM machine_system_settings WHERE setting_key = ?', [key], (err, results) => {
    if (err) return res.status(500).send('? L?i truy v?n c i d?t h? th?ng');
    if (results.length === 0) return res.status(404).send('? Kh ng t m th?y c i d?t');
    res.json(results[0]);
  });
});

// ========== PRODUCTION ORDERS APIs ==========

// ========== STAGE COLUMNS CONFIG (Embedded) ==========

// �?nh nghia c�c c?t co b?n lu�n c?n cho t?t c? c�ng do?n
const BASE_COLUMNS = [
  'id', 'production_order', 'po_number', 'customer_name', 'product_name','assigned_machine',
  'order_quantity', 'deployed_quantity', 'required_quantity','internal_product_code','workflow_definition',
  'work_stage', 'status', 'deployment_date', 'created_at', 'updated_at','sheet_count','paper_length','paper_width','paper_type','paper_weight','part_count','color_count','blank_count','order_type'
];

// �?nh nghia c�c c?t theo c�ng do?n
const STAGE_COLUMNS = {
  'xa': [
    'xa_input_quantity', 'xa_output_quantity', 'xa_good_quantity', 'xa_ng_quantity',
    'xa_status', 'xa_start_time', 'xa_end_time', 'xa_worker_name', 'xa_note','xa_shift',
    'xen_input_quantity', 'xen_output_quantity', 'xen_good_quantity', 'xen_ng_quantity', 'xa_handover_quantity',
    'xen_status', 'xen_start_time', 'xen_end_time', 'xen_worker_name', 'xen_note','xa_machine_name'
  ],
  'xen': [
    'xen_input_quantity', 'xen_output_quantity', 'xen_good_quantity', 'xen_ng_quantity',
    'xen_status', 'xen_start_time', 'xen_end_time', 'xen_worker_name', 'xen_note',
    'in_offset_input_quantity', 'in_offset_output_quantity', 'in_offset_good_quantity', 'in_offset_ng_quantity',
    'in_offset_status', 'in_offset_start_time', 'in_offset_end_time', 'in_offset_worker_name', 'in_offset_note'
  ],
  'in_offset': [
    'in_offset_input_quantity', 'in_offset_output_quantity', 'in_offset_good_quantity', 'in_offset_ng_quantity',
    'in_offset_status', 'in_offset_start_time', 'in_offset_end_time', 'in_offset_worker_name', 'in_offset_note',
    'xen_toa_input_quantity', 'xen_toa_output_quantity', 'xen_toa_good_quantity', 'xen_toa_ng_quantity',
    'xen_toa_status', 'xen_toa_start_time', 'xen_toa_end_time', 'xen_toa_worker_name', 'xen_toa_note'
  ],
  'boi': [
    'boi_input_quantity', 'boi_output_quantity', 'boi_good_quantity', 'boi_ng_quantity',
    'boi_status', 'boi_start_time', 'boi_end_time', 'boi_worker_name', 'boi_note',
    'be_input_quantity', 'be_output_quantity', 'be_good_quantity', 'be_ng_quantity',
    'be_status', 'be_start_time', 'be_end_time', 'be_worker_name', 'be_note'
  ],
  'be': [
    'be_input_quantity', 'be_output_quantity', 'be_good_quantity', 'be_ng_quantity',
    'be_status', 'be_start_time', 'be_end_time', 'be_worker_name', 'be_note',
    'dan_may_input_quantity', 'dan_may_output_quantity', 'dan_may_good_quantity', 'dan_may_ng_quantity',
    'dan_may_status', 'dan_may_start_time', 'dan_may_end_time', 'dan_may_worker_name', 'dan_may_note'
  ],
  'dan_may': [
    'dan_may_input_quantity', 'dan_may_output_quantity', 'dan_may_good_quantity', 'dan_may_ng_quantity',
    'dan_may_status', 'dan_may_start_time', 'dan_may_end_time', 'dan_may_worker_name', 'dan_may_note',
    'hoan_thien_input_quantity', 'hoan_thien_output_quantity', 'hoan_thien_good_quantity', 'hoan_thien_ng_quantity',
    'hoan_thien_status', 'hoan_thien_start_time', 'hoan_thien_end_time', 'hoan_thien_worker_name', 'hoan_thien_note'
  ],
  'kho': [
    'nhap_kho_input_quantity', 'nhap_kho_output_quantity', 'nhap_kho_good_quantity', 'nhap_kho_ng_quantity',
    'nhap_kho_status', 'nhap_kho_start_time', 'nhap_kho_end_time', 'nhap_kho_worker_name', 'nhap_kho_note'
  ]
};

/**
 * L?y danh s�ch c?t cho m?t c�ng do?n c? th?
 * @param {string} stage - T�n c�ng do?n (xa, xen, in_offset, boi, be, dan_may, kho)
 * @param {string} customColumns - Chu?i c?t t�y ch?nh (t�y ch?n)
 * @returns {Array} Danh s�ch c�c c?t c?n l?y
 */
function getColumnsForStage(stage, customColumns = null) {
  // B?t d?u v?i c�c c?t co b?n
  let selectedColumns = [...BASE_COLUMNS];
  
  // Th�m c?t theo c�ng do?n n?u c�
  if (stage && STAGE_COLUMNS[stage]) {
    selectedColumns = [...selectedColumns, ...STAGE_COLUMNS[stage]];
  }
  
  // Th�m c?t t�y ch?nh n?u c�
  if (customColumns) {
    const customCols = customColumns.split(',').map(col => col.trim());
    selectedColumns = [...selectedColumns, ...customCols];
  }
  
  // Lo?i b? c?t tr�ng l?p
  return [...new Set(selectedColumns)];
}

/**
 * Ki?m tra xem m?t c�ng do?n c� t?n t?i kh�ng
 * @param {string} stage - T�n c�ng do?n
 * @returns {boolean} True n?u c�ng do?n t?n t?i
 */
function isValidStage(stage) {
  return STAGE_COLUMNS.hasOwnProperty(stage);
}

// API t?i uu chung cho t?t c? c�ng do?n - ch? l?y d? li?u c?n thi?t
app.get('/data/production_orders/optimized', (req, res) => {
  const { stage, columns, days_back = 30, limit, offset, status, customer_name, search } = req.query;
  
  // Using the imported functions to get columns
  let selectedColumns;
  if (stage && isValidStage(stage)) {
    selectedColumns = getColumnsForStage(stage, columns);
  } else if (columns) {
    selectedColumns = getColumnsForStage(null, columns);
  } else {
    selectedColumns = getColumnsForStage(); // Default to base columns
  }
  
  // T?o query
  let query = `SELECT ${selectedColumns.join(', ')} FROM production_orders WHERE 1=1`;
  let params = [];
  
  // Filter theo workflow_definition - ch? hi?n th? l?nh thu?c v? c�ng do?n hi?n t?i
  if (stage) {
    query += ' AND workflow_definition LIKE ?';
    params.push(`%${stage}%`);
  }
  
  // Filter theo ng�y tri?n khai
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - parseInt(days_back));
  query += ' AND (deployment_date >= ? OR deployment_date IS NULL)';
  params.push(startDate.toISOString().split('T')[0]);
  
  // Filter theo tr?ng th�i
  if (status) {
    query += ' AND status = ?';
    params.push(status);
  }
  
  // Filter theo kh�ch h�ng
  if (customer_name) {
    query += ' AND customer_name LIKE ?';
    params.push(`%${customer_name}%`);
  }
  
  // T�m ki?m theo t? kh�a
  if (search) {
    query += ' AND (production_order LIKE ? OR po_number LIKE ? OR product_name LIKE ? OR customer_name LIKE ?)';
    const searchTerm = `%${search}%`;
    params.push(searchTerm, searchTerm, searchTerm, searchTerm);
  }
  
  // S?p x?p theo th?i gian t?o m?i nh?t
  query += ' ORDER BY created_at DESC';
  
  // Ph�n trang
  if (limit) {
    query += ' LIMIT ?';
    params.push(parseInt(limit));
    
    if (offset) {
      query += ' OFFSET ?';
      params.push(parseInt(offset));
    }
  }
  
  db.query(query, params, (err, results) => {
    if (err) {
      console.error('? L?i truy v?n production_orders (optimized):', err);
      return res.status(500).json({ error: 'L?i truy v?n d? li?u', details: err.message });
    }
    
    res.json(results);
  });
});

// API tuong th�ch ngu?c cho xa-stage (redirect d?n API chung)
app.get('/data/production_orders/xa-stage', (req, res) => {
  const queryString = new URLSearchParams(req.query).toString();
  res.redirect(`/data/production_orders/optimized?stage=xa&${queryString}`);
});

// API tuong th�ch ngu?c cho xen-stage (redirect d?n API chung)
app.get('/data/production_orders/xen-stage', (req, res) => {
  const queryString = new URLSearchParams(req.query).toString();
  res.redirect(`/data/production_orders/optimized?stage=xen&${queryString}`);
});

// API test workflow filtering
app.get('/data/production_orders/workflow-test', (req, res) => {
  const { stage } = req.query;
  
  if (!stage) {
    return res.status(400).json({ error: 'Stage parameter is required' });
  }
  
  const query = `
    SELECT id, production_order, workflow_definition, status, deployment_date 
    FROM production_orders 
    WHERE (workflow_definition LIKE ? OR workflow_definition IS NULL)
    ORDER BY created_at DESC
    LIMIT 20
  `;
  
  db.query(query, [`%${stage}%`], (err, results) => {
    if (err) {
      console.error('? L?i test workflow filtering:', err);
      return res.status(500).json({ error: 'L?i truy v?n d? li?u', details: err.message });
    }
    
    res.json({
      stage: stage,
      total_orders: results.length,
      orders: results
    });
  });
});

// L?y t?t c? l?nh s?n xu?t v?i b? l?c (API g?c - gi? l?i d? tuong th�ch)
app.get('/data/production_orders', (req, res) => {
  let query = 'SELECT * FROM production_orders WHERE 1=1';
  let params = [];
  
  // B? l?c theo workflow_definition n?u c� stage parameter
  if (req.query.stage) {
    // Kiểm tra workflow_definition có chứa stage hiện tại
    // Sử dụng FIND_IN_SET để tìm chính xác stage trong danh sách workflow
    query += ' AND (FIND_IN_SET(?, workflow_definition) > 0 OR workflow_definition IS NULL)';
    params.push(req.query.stage);
  }
  
  // B? l?c theo ng�y tri?n khai
  if (req.query.deployment_date) {
    query += ' AND deployment_date = ?';
    params.push(req.query.deployment_date);
  }
  
  // B? l?c theo kho?ng ngày tri?n khai
  if (req.query.from_date && req.query.to_date) {
    query += ' AND deployment_date BETWEEN ? AND ?';
    params.push(req.query.from_date, req.query.to_date);
  } else if (req.query.from_date) {
    query += ' AND deployment_date >= ?';
    params.push(req.query.from_date);
  } else if (req.query.to_date) {
    query += ' AND deployment_date <= ?';
    params.push(req.query.to_date);
  }
  
  // B? l?c theo tr?ng thi
  if (req.query.status) {
    query += ' AND status = ?';
    params.push(req.query.status);
  }
  
  // B? l?c theo kh�ch h�ng
  if (req.query.customer_name) {
    query += ' AND customer_name LIKE ?';
    params.push(`%${req.query.customer_name}%`);
  }
  
  // T�m ki?m theo t? kh�a
  if (req.query.search) {
    query += ' AND (production_order LIKE ? OR po_number LIKE ? OR product_name LIKE ? OR customer_name LIKE ?)';
    const searchTerm = `%${req.query.search}%`;
    params.push(searchTerm, searchTerm, searchTerm, searchTerm);
  }
  
  // S?p x?p
  query += ' ORDER BY created_at DESC';
  
  // Ph�n trang
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
      console.error('? L?i truy v?n production_orders:', err);
      return res.status(500).json({ error: 'L?i truy v?n d? li?u', details: err.message });
    }
    
    res.json(results);
  });
});

// L?y chi ti?t m?t l?nh s?n xu?t
app.get('/data/production_orders/:id', (req, res) => {
  const { id } = req.params;
  db.query('SELECT * FROM production_orders WHERE id = ?', [id], (err, results) => {
    if (err) {
      console.error('? L?i truy v?n l?nh s?n xu?t:', err);
      return res.status(500).json({ error: 'L?i truy v?n d? li?u' });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: 'Kh ng t m th?y l?nh s?n xu?t' });
    }
    res.json(results[0]);
  });
});

// T?o l?nh s?n xu?t m?i
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
    color_count || 0, customer_group, paper_type, paper_weight, work_stage, status || 'Ch? tri?n khai'
  ], (err, result) => {
    if (err) {
      console.error('? L?i t?o l?nh s?n xu?t:', err);
      return res.status(500).json({ error: 'L?i t?o l?nh s?n xu?t', details: err.message });
    }
    res.json({ 
      success: true, 
      id: result.insertId, 
      message: 'T?o l?nh s?n xu?t th nh c ng' 
    });
  });
});

// C?p nh?t l?nh s?n xu?t
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
      console.error('? L?i c?p nh?t l?nh s?n xu?t:', err);
      return res.status(500).json({ error: 'L?i c?p nh?t l?nh s?n xu?t', details: err.message });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Kh ng t m th?y l?nh s?n xu?t' });
    }
    res.json({ 
      success: true, 
      message: 'C?p nh?t l?nh s?n xu?t th nh c ng' 
    });
  });
});

// X a l?nh s?n xu?t
app.delete('/data/production_orders/:id', (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM production_orders WHERE id = ?', [id], (err, result) => {
    if (err) {
      console.error('? L?i x a l?nh s?n xu?t:', err);
      return res.status(500).json({ error: 'L?i x a l?nh s?n xu?t', details: err.message });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Kh ng t m th?y l?nh s?n xu?t' });
    }
    res.json({ 
      success: true, 
      message: 'X a l?nh s?n xu?t th nh c ng' 
    });
  });
});

// Th?ng k  t?ng quan l?nh s?n xu?t
app.get('/data/production_orders_stats', (req, res) => {
  db.query('SELECT * FROM production_orders_stats', (err, results) => {
    if (err) {
      console.error('? L?i truy v?n th?ng k :', err);
      return res.status(500).json({ error: 'L?i truy v?n th?ng k ' });
    }
    res.json(results[0] || {});
  });
});

// Th?ng k  theo kh ch h ng
app.get('/data/customer_orders_stats', (req, res) => {
  db.query('SELECT * FROM customer_orders_stats LIMIT 10', (err, results) => {
    if (err) {
      console.error('? L?i truy v?n th?ng k  kh ch h ng:', err);
      return res.status(500).json({ error: 'L?i truy v?n th?ng k  kh ch h ng' });
    }
    res.json(results);
  });
});

// Th?ng k  theo th ng
app.get('/data/monthly_orders_stats', (req, res) => {
  db.query('SELECT * FROM monthly_orders_stats LIMIT 12', (err, results) => {
    if (err) {
      console.error('? L?i truy v?n th?ng k  theo th ng:', err);
      return res.status(500).json({ error: 'L?i truy v?n th?ng k  theo th ng' });
    }
    res.json(results);
  });
});

// L?y danh s ch kh ch h ng distinct
app.get('/data/customers', (req, res) => {
  const query = `
    SELECT DISTINCT customer_name, customer_code, customer_group
    FROM production_orders 
    WHERE customer_name IS NOT NULL AND customer_name != ''
    ORDER BY customer_name
  `;
  
  db.query(query, (err, results) => {
    if (err) {
      console.error('? L?i truy v?n danh s ch kh ch h ng:', err);
      return res.status(500).json({ error: 'L?i truy v?n danh s ch kh ch h ng' });
    }
    res.json(results);
  });
});

// ========== STAGE HANDOVER APIs (B N GIAO C NG  O?N) ==========

// L?y t?t c? d? li?u b n giao c ng do?n
app.get('/data/stage_handovers', (req, res) => {
  let query = `
    SELECT 
      sh.*,
      po.production_order,
      po.product_name,
      po.customer_name,
      po.internal_product_code
    FROM stage_handovers sh
    LEFT JOIN production_orders po ON sh.production_order_id = po.id
    WHERE 1=1
  `;
  let params = [];
  
  // B? l?c theo c ng do?n
  if (req.query.stage) {
    query += ' AND sh.stage = ?';
    params.push(req.query.stage);
  }
  
  // B? l?c theo ng y b n giao
  if (req.query.handover_date) {
    query += ' AND sh.handover_date = ?';
    params.push(req.query.handover_date);
  }
  
  // B? l?c theo l?nh s?n xu?t
  if (req.query.production_order_id) {
    query += ' AND sh.production_order_id = ?';
    params.push(req.query.production_order_id);
  }
  
  // B? l?c theo tr?ng th i
  if (req.query.status) {
    query += ' AND sh.status = ?';
    params.push(req.query.status);
  }
  
  query += ' ORDER BY sh.handover_date DESC, sh.created_at DESC';
  
  db.query(query, params, (err, results) => {
    if (err) {
      console.error('? L?i truy v?n stage_handovers:', err);
      return res.status(500).json({ error: 'L?i truy v?n d? li?u b n giao', details: err.message });
    }
    res.json(results);
  });
});

// L?y chi ti?t m?t b n giao
app.get('/data/stage_handovers/:id', (req, res) => {
  const { id } = req.params;
  const query = `
    SELECT 
      sh.*,
      po.production_order,
      po.product_name,
      po.customer_name,
      po.internal_product_code
    FROM stage_handovers sh
    LEFT JOIN production_orders po ON sh.production_order_id = po.id
    WHERE sh.id = ?
  `;
  
  db.query(query, [id], (err, results) => {
    if (err) {
      console.error('? L?i truy v?n chi ti?t b n giao:', err);
      return res.status(500).json({ error: 'L?i truy v?n d? li?u' });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: 'Kh ng t m th?y b n giao' });
    }
    res.json(results[0]);
  });
});

// T?o b n giao c ng do?n m?i
app.post('/data/stage_handovers', (req, res) => {
  const {
    production_order_id,
    stage,
    from_stage,
    to_stage,
    handover_quantity,
    good_quantity,
    ng_quantity,
    ng_start_end_quantity,
    return_quantity,
    handover_date,
    handover_shift,
    handover_machine,
    handover_person,
    receiver_person,
    handover_notes,
    stage_notes,
    worker,
    start_time,
    end_time,
    status
  } = req.body;
  
  // Validate required fields
  if (!production_order_id || !stage || !handover_quantity) {
    return res.status(400).json({ 
      error: 'Thi?u th ng tin b?t bu?c',
      required: ['production_order_id', 'stage', 'handover_quantity']
    });
  }
  
  const query = `
    INSERT INTO stage_handovers (
      production_order_id, stage, from_stage, to_stage, handover_quantity,
      good_quantity, ng_quantity, ng_start_end_quantity, return_quantity,
      handover_date, handover_shift, handover_machine, handover_person,
      receiver_person, handover_notes, stage_notes, worker, start_time,
      end_time, status
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  
  db.query(query, [
    production_order_id,
    stage,
    from_stage || null,
    to_stage || null,
    handover_quantity || 0,
    good_quantity || 0,
    ng_quantity || 0,
    ng_start_end_quantity || 0,
    return_quantity || 0,
    handover_date || new Date().toISOString().split('T')[0],
    handover_shift || 'Ca 1',
    handover_machine || null,
    handover_person || null,
    receiver_person || null,
    handover_notes || null,
    stage_notes || null,
    worker || null,
    start_time || null,
    end_time || null,
    status || 'completed'
  ], (err, result) => {
    if (err) {
      console.error('? L?i t?o b n giao:', err);
      return res.status(500).json({ error: 'L?i t?o b n giao', details: err.message });
    }
    
    // Tr? v? b n giao v?a t?o
    const newId = result.insertId;
    db.query(
      `SELECT sh.*, po.production_order, po.product_name 
       FROM stage_handovers sh 
       LEFT JOIN production_orders po ON sh.production_order_id = po.id 
       WHERE sh.id = ?`, 
      [newId], 
      (err, results) => {
        if (err) {
          console.error('? L?i l?y b n giao v?a t?o:', err);
          return res.status(500).json({ error: 'L?i l?y d? li?u sau t?o' });
        }
        res.status(201).json({
          message: 'T?o b n giao th nh c ng',
          data: results[0] || { id: newId }
        });
      }
    );
  });
});

// C?p nh?t b n giao c ng do?n
app.put('/data/stage_handovers/:id', (req, res) => {
  const { id } = req.params;
  const {
    handover_quantity,
    good_quantity,
    ng_quantity,
    ng_start_end_quantity,
    return_quantity,
    handover_date,
    handover_shift,
    handover_machine,
    handover_person,
    receiver_person,
    handover_notes,
    stage_notes,
    worker,
    start_time,
    end_time,
    status
  } = req.body;
  
  const query = `
    UPDATE stage_handovers SET 
      handover_quantity = ?, good_quantity = ?, ng_quantity = ?,
      ng_start_end_quantity = ?, return_quantity = ?, handover_date = ?,
      handover_shift = ?, handover_machine = ?, handover_person = ?,
      receiver_person = ?, handover_notes = ?, stage_notes = ?,
      worker = ?, start_time = ?, end_time = ?, status = ?,
      updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `;
  
  db.query(query, [
    handover_quantity || 0,
    good_quantity || 0,
    ng_quantity || 0,
    ng_start_end_quantity || 0,
    return_quantity || 0,
    handover_date,
    handover_shift,
    handover_machine,
    handover_person,
    receiver_person,
    handover_notes,
    stage_notes,
    worker,
    start_time,
    end_time,
    status || 'completed',
    id
  ], (err, result) => {
    if (err) {
      console.error('? L?i c?p nh?t b n giao:', err);
      return res.status(500).json({ error: 'L?i c?p nh?t b n giao', details: err.message });
    }
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Kh ng t m th?y b n giao d? c?p nh?t' });
    }
    
    res.json({ message: 'C?p nh?t b n giao th nh c ng', affectedRows: result.affectedRows });
  });
});

// X a b n giao c ng do?n
app.delete('/data/stage_handovers/:id', (req, res) => {
  const { id } = req.params;
  
  db.query('DELETE FROM stage_handovers WHERE id = ?', [id], (err, result) => {
    if (err) {
      console.error('? L?i x a b n giao:', err);
      return res.status(500).json({ error: 'L?i x a b n giao', details: err.message });
    }
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Kh ng t m th?y b n giao d? x a' });
    }
    
    res.json({ message: 'X a b n giao th nh c ng', affectedRows: result.affectedRows });
  });
});

// L?y th?ng k  b n giao theo c ng do?n
app.get('/data/stage_handovers_stats', (req, res) => {
  const query = `
    SELECT 
      stage,
      COUNT(*) as total_handovers,
      SUM(handover_quantity) as total_handover_qty,
      SUM(good_quantity) as total_good_qty,
      SUM(ng_quantity) as total_ng_qty,
      AVG(CASE WHEN handover_quantity > 0 THEN good_quantity / handover_quantity * 100 ELSE 0 END) as avg_efficiency
    FROM stage_handovers 
    GROUP BY stage
    ORDER BY stage
  `;
  
  db.query(query, (err, results) => {
    if (err) {
      console.error('? L?i th?ng k  b n giao:', err);
      return res.status(500).json({ error: 'L?i th?ng k  b n giao' });
    }
    res.json(results);
  });
});

// API d?c bi?t: Ho n th nh v  b n giao c ng do?n (d ng cho frontend)
app.post('/data/complete_and_handover_stage', (req, res) => {
  const {
    production_order_id,
    stage,
    to_stage,
    good_quantity,
    ng_quantity,
    ng_start_end_quantity,
    return_quantity,
    handover_quantity,
    handover_person,
    receiver_person,
    machine,
    worker,
    shift,
    handover_notes,
    stage_notes,
    start_time,
    end_time
  } = req.body;
  
  // Validate
  if (!production_order_id || !stage || !good_quantity || !handover_quantity) {
    return res.status(400).json({ 
      error: 'Thi?u th ng tin b?t bu?c',
      required: ['production_order_id', 'stage', 'good_quantity', 'handover_quantity']
    });
  }
  
  if (handover_quantity > good_quantity) {
    return res.status(400).json({ 
      error: 'S? lu?ng b n giao kh ng th? l?n hon s? lu?ng d?t'
    });
  }
  
  // B?t d?u transaction
  db.beginTransaction((err) => {
    if (err) {
      console.error('? L?i b?t d?u transaction:', err);
      return res.status(500).json({ error: 'L?i h? th?ng' });
    }
    
    // 1. T?o b n giao
    const insertHandoverQuery = `
      INSERT INTO stage_handovers (
        production_order_id, stage, to_stage, handover_quantity,
        good_quantity, ng_quantity, ng_start_end_quantity, return_quantity,
        handover_date, handover_shift, handover_machine, handover_person,
        receiver_person, handover_notes, stage_notes, worker, start_time,
        end_time, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, CURDATE(), ?, ?, ?, ?, ?, ?, ?, ?, ?, 'completed')
    `;
    
    db.query(insertHandoverQuery, [
      production_order_id, stage, to_stage, handover_quantity,
      good_quantity, ng_quantity || 0, ng_start_end_quantity || 0, return_quantity || 0,
      shift || 'Ca 1', machine, handover_person, receiver_person,
      handover_notes, stage_notes, worker, start_time, end_time
    ], (err, handoverResult) => {
      if (err) {
        return db.rollback(() => {
          console.error('? L?i t?o b n giao:', err);
          res.status(500).json({ error: 'L?i t?o b n giao', details: err.message });
        });
      }
      
      // 2. C?p nh?t tr?ng th i l?nh s?n xu?t (optional)
      const updateOrderQuery = `
        UPDATE production_orders 
        SET work_stage = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `;
      
      db.query(updateOrderQuery, [to_stage || stage, production_order_id], (err) => {
        if (err) {
          return db.rollback(() => {
            console.error('? L?i c?p nh?t l?nh s?n xu?t:', err);
            res.status(500).json({ error: 'L?i c?p nh?t l?nh s?n xu?t' });
          });
        }
        
        // Commit transaction
        db.commit((err) => {
          if (err) {
            return db.rollback(() => {
              console.error('? L?i commit transaction:', err);
              res.status(500).json({ error: 'L?i ho n t?t giao d?ch' });
            });
          }
          
          res.status(201).json({
            message: 'Ho n th nh v  b n giao c ng do?n th nh c ng',
            handover_id: handoverResult.insertId,
            production_order_id: production_order_id,
            stage: stage,
            to_stage: to_stage,
            handover_quantity: handover_quantity
          });
        });
      });
    });
  });
});

// ========== API B N GIAO T?  ?NG GI?A C C C NG  O?N ==========

// API: B n giao tr?c ti?p v o c?t input_quantity c?a stage ti?p theo
app.post('/api/handover_to_next_stage', (req, res) => {
  const { 
    order_id, 
    current_stage, 
    handover_quantity,
    handover_person = '', 
    receiver_person = '', 
    notes = '' 
  } = req.body;

  if (!order_id || !current_stage || !handover_quantity) {
    return res.status(400).json({ 
      error: 'Thi?u th ng tin: order_id, current_stage, handover_quantity' 
    });
  }

  if (handover_quantity <= 0) {
    return res.status(400).json({ 
      error: 'S? lu?ng b n giao ph?i > 0' 
    });
  }

  const callProcedure = `
    CALL handover_to_next_stage(?, ?, ?, ?, ?, ?)
  `;

  db.query(callProcedure, [
    order_id,
    current_stage,
    handover_quantity,
    handover_person,
    receiver_person,
    notes
  ], (err, results) => {
    if (err) {
      console.error('? L?i th?c hi?n b n giao:', err);
      return res.status(500).json({ 
        error: 'L?i th?c hi?n b n giao', 
        details: err.message 
      });
    }

    // X c d?nh stage ti?p theo
    const stageMapping = {
      'xa': 'xen',
      'xen': 'in_offset', 
      'in_offset': 'xen_toa',
      'xen_toa': 'kcs_in',
      'kcs_in': 'kcs_sau_in',
      'kcs_sau_in': 'lang',
      'lang': 'in_luoi',
      'in_luoi': 'boi',
      'boi': 'be',
      'be': 'boc_le',
      'boc_le': 'dan_3m',
      'dan_3m': 'dan_may',
      'dan_may': 'hoan_thien',
      'hoan_thien': 'ghim',
      'ghim': 'gap',
      'gap': 'nhap_kho'
    };

    const next_stage = stageMapping[current_stage];

    res.json({
      success: true,
      message: `B n giao th nh c ng t? ${current_stage.toUpperCase()} sang ${next_stage ? next_stage.toUpperCase() : 'KHO'}`,
      order_id: order_id,
      from_stage: current_stage,
      to_stage: next_stage,
      handover_quantity: handover_quantity,
      updated_column: `${next_stage}_input_quantity`
    });
  });
});

// API: Endpoint tuong th ch v?i client /data/handover_to_next_stage
app.post('/data/handover_to_next_stage', (req, res) => {
  const { 
    order_id, 
    current_stage, 
    handover_quantity,
    handover_person = '', 
    receiver_person = '', 
    notes = '' 
  } = req.body;

  if (!order_id || !current_stage || !handover_quantity) {
    return res.status(400).json({ 
      error: 'Thi?u th ng tin: order_id, current_stage, handover_quantity' 
    });
  }

  if (handover_quantity <= 0) {
    return res.status(400).json({ 
      error: 'S? lu?ng b n giao ph?i > 0' 
    });
  }

  const callProcedure = `
    CALL handover_to_next_stage(?, ?, ?, ?, ?, ?)
  `;

  db.query(callProcedure, [
    order_id,
    current_stage,
    handover_quantity,
    handover_person,
    receiver_person,
    notes
  ], (err, results) => {
    if (err) {
      console.error('? L?i th?c hi?n b n giao:', err);
      return res.status(500).json({ 
        error: 'L?i th?c hi?n b n giao', 
        details: err.message 
      });
    }

    // X c d?nh stage ti?p theo
    const stageMapping = {
      'xa': 'xen',
      'xen': 'in_offset', 
      'in_offset': 'xen_toa',
      'xen_toa': 'kcs_in',
      'kcs_in': 'kcs_sau_in',
      'kcs_sau_in': 'lang',
      'lang': 'in_luoi',
      'in_luoi': 'boi',
      'boi': 'be',
      'be': 'boc_le',
      'boc_le': 'dan_3m',
      'dan_3m': 'dan_may',
      'dan_may': 'hoan_thien',
      'hoan_thien': 'ghim',
      'ghim': 'gap',
      'gap': 'nhap_kho'
    };

    const next_stage = stageMapping[current_stage];

    res.json({
      success: true,
      message: `B n giao th nh c ng t? ${current_stage.toUpperCase()} sang ${next_stage ? next_stage.toUpperCase() : 'KHO'}`,
      order_id: order_id,
      from_stage: current_stage,
      to_stage: next_stage,
      handover_quantity: handover_quantity,
      updated_column: `${next_stage}_input_quantity`
    });
  });
});

// API: C?p nh?t s? lu?ng output cho stage hi?n t?i
app.put('/api/production_orders/:id/stage_output', (req, res) => {
  const orderId = req.params.id;
  const { 
    stage, 
    output_quantity, 
    good_quantity = 0, 
    ng_quantity = 0,
    worker_name = '',
    notes = ''
  } = req.body;

  if (!stage || output_quantity === undefined) {
    return res.status(400).json({ 
      error: 'Thi?u th ng tin: stage, output_quantity' 
    });
  }

  // T?o query dynamic d? update c c c?t c?a stage c? th?
  const updateFields = [
    `${stage}_output_quantity = ?`,
    `${stage}_good_quantity = ?`,
    `${stage}_ng_quantity = ?`,
    `${stage}_worker_name = ?`,
    `${stage}_note = ?`,
    `${stage}_end_time = NOW()`,
    `${stage}_status = 'completed'`
  ];

  const updateQuery = `
    UPDATE production_orders 
    SET ${updateFields.join(', ')}, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `;

  db.query(updateQuery, [
    output_quantity,
    good_quantity, 
    ng_quantity,
    worker_name,
    notes,
    orderId
  ], (err, result) => {
    if (err) {
      console.error('? L?i c?p nh?t stage output:', err);
      return res.status(500).json({ 
        error: 'L?i c?p nh?t stage output', 
        details: err.message 
      });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Kh ng t m th?y don h ng' });
    }

    res.json({
      success: true,
      message: `C?p nh?t th nh c ng ${stage}_output_quantity = ${output_quantity}`,
      order_id: orderId,
      stage: stage,
      output_quantity: output_quantity,
      good_quantity: good_quantity,
      ng_quantity: ng_quantity
    });
  });
});

// API: Endpoint tuong th ch v?i client /data/production_orders/{id}/stage_output
app.put('/data/production_orders/:id/stage_output', (req, res) => {
  const orderId = req.params.id;
  const { 
    stage, 
    output_quantity, 
    good_quantity = 0, 
    ng_quantity = 0,
    worker_name = '',
    notes = ''
  } = req.body;

  if (!stage || output_quantity === undefined) {
    return res.status(400).json({ 
      error: 'Thi?u th ng tin: stage, output_quantity' 
    });
  }

  // T?o query dynamic d? update c c c?t c?a stage c? th?
  const updateFields = [
    `${stage}_output_quantity = ?`,
    `${stage}_good_quantity = ?`,
    `${stage}_ng_quantity = ?`,
    `${stage}_worker_name = ?`,
    `${stage}_note = ?`,
    `${stage}_end_time = NOW()`,
    `${stage}_status = 'completed'`
  ];

  const updateQuery = `
    UPDATE production_orders 
    SET ${updateFields.join(', ')}, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `;

  db.query(updateQuery, [
    output_quantity,
    good_quantity, 
    ng_quantity,
    worker_name,
    notes,
    orderId
  ], (err, result) => {
    if (err) {
      console.error('? L?i c?p nh?t stage output:', err);
      return res.status(500).json({ 
        error: 'L?i c?p nh?t stage output', 
        details: err.message 
      });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Kh ng t m th?y don h ng' });
    }

    res.json({
      success: true,
      message: `C?p nh?t th nh c ng ${stage}_output_quantity = ${output_quantity}`,
      order_id: orderId,
      stage: stage,
      output_quantity: output_quantity,
      good_quantity: good_quantity,
      ng_quantity: ng_quantity
    });
  });
});

// API: B n giao manual v?i stored procedure
app.post('/api/stage_handover', (req, res) => {
  const { 
    order_id, 
    from_stage, 
    to_stage, 
    quantity_handover, 
    quantity_received = quantity_handover,
    handover_person = '', 
    receiver_person = '', 
    notes = '' 
  } = req.body;

  if (!order_id || !from_stage || !to_stage || !quantity_handover) {
    return res.status(400).json({ 
      error: 'Thi?u th ng tin: order_id, from_stage, to_stage, quantity_handover' 
    });
  }

  const callProcedure = `
    CALL record_stage_handover(?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(callProcedure, [
    order_id,
    from_stage,
    to_stage,
    quantity_handover,
    quantity_received,
    handover_person,
    receiver_person,
    notes
  ], (err, results) => {
    if (err) {
      console.error('? L?i th?c hi?n b n giao:', err);
      return res.status(500).json({ 
        error: 'L?i th?c hi?n b n giao', 
        details: err.message 
      });
    }

    res.json({
      success: true,
      message: `B n giao th nh c ng t? ${from_stage} sang ${to_stage}`,
      order_id: order_id,
      from_stage: from_stage,
      to_stage: to_stage,
      quantity_handover: quantity_handover,
      quantity_received: quantity_received
    });
  });
});

// API: B n giao nhanh (quick handover) v?i stored procedure
app.post('/api/quick_stage_handover', (req, res) => {
  const { 
    order_id, 
    from_stage, 
    to_stage, 
    handover_person = '', 
    receiver_person = '', 
    notes = '' 
  } = req.body;

  if (!order_id || !from_stage || !to_stage) {
    return res.status(400).json({ 
      error: 'Thi?u th ng tin: order_id, from_stage, to_stage' 
    });
  }

  const callProcedure = `
    CALL quick_stage_handover(?, ?, ?, ?, ?, ?)
  `;

  db.query(callProcedure, [
    order_id,
    from_stage,
    to_stage,
    handover_person,
    receiver_person,
    notes
  ], (err, results) => {
    if (err) {
      console.error('? L?i th?c hi?n b n giao nhanh:', err);
      return res.status(500).json({ 
        error: 'L?i th?c hi?n b n giao nhanh', 
        details: err.message 
      });
    }

    res.json({
      success: true,
      message: `B n giao nhanh th nh c ng t? ${from_stage} sang ${to_stage}`,
      order_id: order_id,
      from_stage: from_stage,
      to_stage: to_stage
    });
  });
});

// API: L?y l?ch s? b n giao c?a m?t don h ng
app.get('/api/stage_handover_history/:order_id', (req, res) => {
  const orderId = req.params.order_id;

  const query = `
    SELECT 
      id,
      handover_date,
      from_stage,
      to_stage,
      quantity_handover,
      quantity_received,
      quantity_difference,
      handover_person,
      receiver_person,
      notes,
      status,
      created_at
    FROM stage_handover_history 
    WHERE production_order_id = ?
    ORDER BY handover_date DESC
  `;

  db.query(query, [orderId], (err, results) => {
    if (err) {
      console.error('? L?i l?y l?ch s? b n giao:', err);
      return res.status(500).json({ 
        error: 'L?i l?y l?ch s? b n giao', 
        details: err.message 
      });
    }

    res.json({
      order_id: orderId,
      handover_history: results
    });
  });
});

// API: L?y chi ti?t t?t c? stage c?a m?t don h ng
app.get('/api/production_orders/:id/stages', (req, res) => {
  const orderId = req.params.id;

  const query = `
    SELECT 
      id, production_order, current_stage, current_stage_index,
      -- Chi ti?t t?ng stage
      xa_input_quantity, xa_output_quantity, xa_good_quantity, xa_ng_quantity, xa_status, xa_start_time, xa_end_time, xa_worker_name,
      xen_input_quantity, xen_output_quantity, xen_good_quantity, xen_ng_quantity, xen_status, xen_start_time, xen_end_time, xen_worker_name,
      in_offset_input_quantity, in_offset_output_quantity, in_offset_good_quantity, in_offset_ng_quantity, in_offset_status, in_offset_start_time, in_offset_end_time, in_offset_worker_name,
      xen_toa_input_quantity, xen_toa_output_quantity, xen_toa_good_quantity, xen_toa_ng_quantity, xen_toa_status, xen_toa_start_time, xen_toa_end_time, xen_toa_worker_name,
      kcs_in_input_quantity, kcs_in_output_quantity, kcs_in_good_quantity, kcs_in_ng_quantity, kcs_in_status, kcs_in_start_time, kcs_in_end_time, kcs_in_worker_name,
      kcs_sau_in_input_quantity, kcs_sau_in_output_quantity, kcs_sau_in_good_quantity, kcs_sau_in_ng_quantity, kcs_sau_in_status, kcs_sau_in_start_time, kcs_sau_in_end_time, kcs_sau_in_worker_name,
      lang_input_quantity, lang_output_quantity, lang_good_quantity, lang_ng_quantity, lang_status, lang_start_time, lang_end_time, lang_worker_name,
      in_luoi_input_quantity, in_luoi_output_quantity, in_luoi_good_quantity, in_luoi_ng_quantity, in_luoi_status, in_luoi_start_time, in_luoi_end_time, in_luoi_worker_name,
      boi_input_quantity, boi_output_quantity, boi_good_quantity, boi_ng_quantity, boi_status, boi_start_time, boi_end_time, boi_worker_name,
      be_input_quantity, be_output_quantity, be_good_quantity, be_ng_quantity, be_status, be_start_time, be_end_time, be_worker_name,
      boc_le_input_quantity, boc_le_output_quantity, boc_le_good_quantity, boc_le_ng_quantity, boc_le_status, boc_le_start_time, boc_le_end_time, boc_le_worker_name,
      dan_3m_input_quantity, dan_3m_output_quantity, dan_3m_good_quantity, dan_3m_ng_quantity, dan_3m_status, dan_3m_start_time, dan_3m_end_time, dan_3m_worker_name,
      dan_may_input_quantity, dan_may_output_quantity, dan_may_good_quantity, dan_may_ng_quantity, dan_may_status, dan_may_start_time, dan_may_end_time, dan_may_worker_name,
      hoan_thien_input_quantity, hoan_thien_output_quantity, hoan_thien_good_quantity, hoan_thien_ng_quantity, hoan_thien_status, hoan_thien_start_time, hoan_thien_end_time, hoan_thien_worker_name,
      ghim_input_quantity, ghim_output_quantity, ghim_good_quantity, ghim_ng_quantity, ghim_status, ghim_start_time, ghim_end_time, ghim_worker_name,
      gap_input_quantity, gap_output_quantity, gap_good_quantity, gap_ng_quantity, gap_status, gap_start_time, gap_end_time, gap_worker_name,
      nhap_kho_input_quantity, nhap_kho_output_quantity, nhap_kho_good_quantity, nhap_kho_ng_quantity, nhap_kho_status, nhap_kho_start_time, nhap_kho_end_time, nhap_kho_worker_name
    FROM production_orders 
    WHERE id = ?
  `;

  db.query(query, [orderId], (err, results) => {
    if (err) {
      console.error('? L?i l?y chi ti?t stage:', err);
      return res.status(500).json({ 
        error: 'L?i l?y chi ti?t stage', 
        details: err.message 
      });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: 'Kh ng t m th?y don h ng' });
    }

    const order = results[0];
    const stages = [
      'xa', 'xen', 'in_offset', 'xen_toa', 'kcs_in', 'kcs_sau_in', 
      'lang', 'in_luoi', 'boi', 'be', 'boc_le', 'dan_3m', 
      'dan_may', 'hoan_thien', 'ghim', 'gap', 'nhap_kho'
    ];

    // C?u tr c l?i d? li?u theo t?ng stage
    const stageDetails = {};
    stages.forEach(stage => {
      stageDetails[stage] = {
        input_quantity: order[`${stage}_input_quantity`] || 0,
        output_quantity: order[`${stage}_output_quantity`] || 0,
        good_quantity: order[`${stage}_good_quantity`] || 0,
        ng_quantity: order[`${stage}_ng_quantity`] || 0,
        status: order[`${stage}_status`] || 'waiting',
        start_time: order[`${stage}_start_time`],
        end_time: order[`${stage}_end_time`],
        worker_name: order[`${stage}_worker_name`] || ''
      };
    });

    res.json({
      order_id: orderId,
      production_order: order.production_order,
      current_stage: order.current_stage,
      current_stage_index: order.current_stage_index,
      stages: stageDetails
    });
  });
});

// ========== TEST API FOR WORKFLOW_DEFINITION ==========

// // API test d? ki?m tra workflow_definition
// app.get('/api/test/workflow_definition', (req, res) => {
//   const query = `
//     SELECT id, production_order, workflow_definition, work_stage
//     FROM production_orders 
//     ORDER BY id DESC
//     LIMIT 10
//   `;
  
//   db.query(query, (err, results) => {
//     if (err) {
//       console.error('? L?i truy v?n test workflow:', err);
//       return res.status(500).json({ error: 'L?i truy v?n d? li?u' });
//     }
    
//     console.log('=== TEST WORKFLOW_DEFINITION RESULTS ===');
//     results.forEach(row => {
//       console.log({
//         id: row.id,
//         production_order: row.production_order,
//         workflow_definition: row.workflow_definition,
//         work_stage: row.work_stage,
//         workflow_is_null: row.workflow_definition === null,
//         workflow_type: typeof row.workflow_definition
//       });
//     });
//     console.log('=== END TEST RESULTS ===');
    
//     res.json({
//       message: 'Test workflow_definition completed',
//       total_rows: results.length,
//       null_workflow_count: results.filter(r => r.workflow_definition === null).length,
//       results: results
//     });
//   });
// });

// // API d? c?p nh?t workflow_definition cho test orders
// app.post('/api/test/update_workflow', (req, res) => {
//   const updates = [
//     { id: 20, workflow: 'xa,in_offset,boi,kho' },
//     { id: 19, workflow: 'xa,xen,be,dan_may,kho' },
//     { id: 18, workflow: 'xa,boi,kho' },
//     { id: 17, workflow: 'xa,in_offset,kho' },
//     { id: 16, workflow: 'xa,xen,boi,kho' }
//   ];
  
//   let completed = 0;
//   let errors = [];
  
//   updates.forEach(update => {
//     const query = 'UPDATE production_orders SET workflow_definition = ? WHERE id = ?';
//     db.query(query, [update.workflow, update.id], (err, result) => {
//       completed++;
      
//       if (err) {
//         console.error(`? L?i c?p nh?t workflow cho order ${update.id}:`, err);
//         errors.push({ id: update.id, error: err.message });
//       } else {
//         console.log(`? �� c?p nh?t workflow cho order ${update.id}: "${update.workflow}"`);
//       }
      
//       // Tr? k?t qu? khi ho�n th�nh t?t c?
//       if (completed === updates.length) {
//         res.json({
//           message: 'Workflow update completed',
//           total_updates: updates.length,
//           successful_updates: updates.length - errors.length,
//           errors: errors,
//           updated_orders: updates
//         });
//       }
//     });
//   });
// });

// // API endpoint v?i test data n?u database tr?ng
// app.get('/api/data/production_orders_with_fallback', (req, res) => {
//   const query = `
//     SELECT *
//     FROM production_orders 
//     ORDER BY created_at DESC
//     LIMIT 20
//   `;
  
//   db.query(query, (err, results) => {
//     if (err) {
//       console.error('? L?i truy v?n production_orders:', err);
//       return res.status(500).json({ error: 'L?i truy v?n d? li?u' });
//     }
    
//     // Th�m test workflow_definition n?u null
//     const enhancedResults = results.map(order => {
//       let workflow_definition = order.workflow_definition;
      
//       // N?u workflow_definition l� null, t?o workflow test
//       if (!workflow_definition) {
//         if (order.id % 3 === 0) {
//           workflow_definition = 'xa,in_offset,boi,kho'; // Test v?i in_offset
//         } else if (order.id % 3 === 1) {
//           workflow_definition = 'xa,xen,be,dan_may,kho'; // Test v?i xen
//         } else {
//           workflow_definition = 'xa,boi,kho'; // Test workflow ng?n
//         }
        
//         console.log(`[SERVER FALLBACK] Order ${order.id}: Generated workflow "${workflow_definition}"`);
//       }
      
//       return {
//         ...order,
//         workflow_definition: workflow_definition,
//         is_fallback_workflow: !order.workflow_definition // Flag d? bi?t l� test data
//       };
//     });
    
//     console.log(`[SERVER] Returning ${enhancedResults.length} orders with workflow fallback`);
//     res.json(enhancedResults);
//   });
// });



// Kh?i d?ng server
// ========== API CẬP NHẬT THỜI GIAN SẢN XUẤT ==========

/**
 * API: Bắt đầu sản xuất - Cập nhật thời gian bắt đầu
 * Endpoint: POST /api/production_orders/:id/start_production
 * 
 * Chức năng:
 * - Cập nhật thời gian bắt đầu sản xuất (xa_start_time)
 * - Cập nhật trạng thái sản xuất thành 'in_progress'
 * - Ghi lại thông tin thợ và máy
 * 
 * Tham số:
 * - orderId: ID của lệnh sản xuất
 * - stage: Tên công đoạn (vd: 'xa', 'xen', 'boi')
 * - worker_name: Tên thợ sản xuất
 * - machine_name: Tên máy sản xuất
 * - shift: Ca làm việc (Ca 1, Ca 2, Ca 3)
 */
app.post('/data/production_orders/:id/start_production', (req, res) => {
  const orderId = req.params.id;
  const { 
    stage = '',           // Mặc định là công đoạn XẢ
    production_order = '',  // Mã lệnh sản xuất
    worker_name = '',       // Tên thợ sản xuất
    machine_name = '',      // Tên máy sản xuất
    shift = '',             // Ca làm việc
    notes = ''              // Ghi chú
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
        ${stage}_start_time = NOW(),                    -- Cập nhật thời gian bắt đầu = thời gian hiện tại
        ${stage}_status = 'in_progress',                -- Cập nhật trạng thái = đang sản xuất
        ${stage}_worker_name = ?,                       -- Ghi lại tên thợ
        ${stage}_machine_name = ?,                      -- Ghi lại tên máy
        ${stage}_shift = ?,                           -- Cập nhật ca làm việc
        ${stage}_note = ?,                              -- Ghi lại ghi chú
        updated_at = CURRENT_TIMESTAMP                  -- Cập nhật thời gian chỉnh sửa
      WHERE id = ?
    `;

    const orderQueryParams = [
      worker_name,      // Tham số 1: tên thợ
      machine_name,     // Tham số 2: tên máy
      shift,           // Tham số 3: ca làm việc
      notes,           // Tham số 4: ghi chú
      orderId          // Tham số 5: ID lệnh sản xuất
    ];

    // 2. Cập nhật bảng production_machines
    const updateMachineQuery = `
      UPDATE production_machines 
      SET 
        current_order_id = ?,                           -- Cập nhật ID lệnh sản xuất hiện tại
        current_order_code = ?                          -- Cập nhật mã lệnh sản xuất hiện tại
      WHERE machine_name = ?
    `;

    const machineQueryParams = [
      orderId,          // Tham số 1: ID lệnh sản xuất
      production_order, // Tham số 2: Mã lệnh sản xuất
      machine_name      // Tham số 3: Tên máy
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
            message: `Đã bắt đầu sản xuất công đoạn ${stage.toUpperCase()}`,
            order_id: orderId,
            production_order: production_order,
            stage: stage,
            start_time: new Date().toISOString(),
            worker_name: worker_name,
            machine_name: machine_name,
            shift: shift,
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

/**
 * API: Kết thúc sản xuất - Cập nhật thời gian kết thúc
 * Endpoint: POST /api/production_orders/:id/end_production
 * 
 * Chức năng:
 * - Cập nhật thời gian kết thúc sản xuất (xa_end_time)
 * - Cập nhật trạng thái sản xuất thành 'completed'
 * - Ghi lại kết quả sản xuất (số lượng đạt, NG)
 * 
 * Tham số:
 * - orderId: ID của lệnh sản xuất
 * - stage: Tên công đoạn (vd: 'xa', 'xen', 'boi')
 * - good_quantity: Số lượng đạt (OK)
 * - ng_quantity: Số lượng NG
 * - ng_start_end_quantity: NG đầu/cuối
 * - return_quantity: Hàng trả
 * - notes: Ghi chú
 */
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
    good_quantity = '',      // Số lượng OK
    ng_quantity = '',        // Số lượng NG
    handover_quantity = ''   // Số lượng bàn giao
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
        ${stage}_shift = ?,                           -- Cập nhật ca làm việc
        ${stage}_note = ?,                              -- Ghi lại ghi chú
        ${stage}_good_quantity = ?,                     -- Số lượng OK
        ${stage}_ng_quantity = ?,                       -- Số lượng NG
        ${stage}_output_quantity = ?,                   -- Tổng số lượng sản xuất (OK + NG)
        ${stage}_handover_quantity = ?,                 -- Số lượng bàn giao
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
      handover_quantity,   // Tham số 8: Số lượng bàn giao
      orderId          // Tham số 9: ID lệnh sản xuất
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

/**
 * API: Reset lệnh sản xuất về trạng thái chưa bắt đầu
 * Endpoint: POST /data/production_orders/:id/reset_production
 * 
 * Chức năng:
 * - Reset tất cả dữ liệu sản xuất của một stage về trạng thái ban đầu
 * - Xóa thời gian bắt đầu và kết thúc
 * - Reset trạng thái về 'not_started'
 * - Xóa dữ liệu sản xuất (số lượng, ghi chú, v.v.)
 * 
 * Tham số:
 * - orderId: ID của lệnh sản xuất
 * - stage: Tên công đoạn cần reset (vd: 'xa', 'xen', 'boi')
 * - reset_to_not_started: Flag xác nhận reset (true/false)
 */
app.post('/data/production_orders/:id/reset_production', (req, res) => {
  const orderId = req.params.id;
  const { 
    stage,           // Mặc định là công đoạn XẢ
    reset_to_not_started = true  // Flag xác nhận reset
  } = req.body;

  // Log để debug
  console.log('=== RESET PRODUCTION API CALLED ===');
  console.log('Order ID:', orderId);
  console.log('Stage:', stage);
  console.log('Reset flag:', reset_to_not_started);
  console.log('Full request body:', req.body);
  console.log('Request headers:', req.headers);

  // Validate input
  if (!stage) {
    console.log('❌ ERROR: Missing stage parameter');
    return res.status(400).json({ 
      error: 'Thiếu thông tin: stage' 
    });
  }

  if (!reset_to_not_started) {
    console.log('❌ ERROR: reset_to_not_started must be true');
    return res.status(400).json({ 
      error: 'Cần xác nhận reset_to_not_started = true để thực hiện reset' 
    });
  }

  console.log('✅ Validation passed, starting transaction...');

  // Bắt đầu transaction để đảm bảo tính nhất quán dữ liệu
  db.beginTransaction((err) => {
    if (err) {
      console.log('❌ ERROR: Failed to begin transaction:', err.message);
      return res.status(500).json({ 
        error: 'Lỗi khởi tạo transaction: ' + err.message 
      });
    }

    console.log('✅ Transaction started successfully');

    // 1. Reset bảng production_orders - xóa tất cả dữ liệu sản xuất của stage
    const resetOrderQuery = `
      UPDATE production_orders 
      SET 
        ${stage}_start_time = NULL,                     -- Xóa thời gian bắt đầu
        ${stage}_end_time = NULL,                       -- Xóa thời gian kết thúc
        ${stage}_status = 'waiting',                    -- Reset trạng thái về chờ
        ${stage}_worker_name = NULL,                    -- Xóa tên thợ
        ${stage}_machine_name = NULL,                   -- Xóa tên máy
        ${stage}_shift = NULL,                          -- Xóa ca làm việc
        ${stage}_note = NULL,                           -- Xóa ghi chú
        ${stage}_good_quantity = 0,                     -- Reset số lượng OK về 0
        ${stage}_ng_quantity = 0,                       -- Reset số lượng NG về 0
        ${stage}_output_quantity = 0,                   -- Reset tổng số lượng về 0
        ${stage}_handover_quantity = 0,                 -- Reset số lượng bàn giao về 0
        ${stage}_input_quantity = 0,                    -- Reset số lượng đầu vào về 0
        updated_at = CURRENT_TIMESTAMP                  -- Cập nhật thời gian chỉnh sửa
      WHERE id = ?
    `;

    console.log('📝 SQL Query for production_orders:', resetOrderQuery);
    console.log('🔍 Parameters:', [orderId]);

    // 2. Reset bảng production_machines - xóa lệnh hiện tại nếu có
    const resetMachineQuery = `
      UPDATE production_machines 
      SET 
        current_order_id = NULL,                        -- Xóa ID lệnh sản xuất hiện tại
        current_order_code = NULL                       -- Xóa mã lệnh sản xuất hiện tại
      WHERE current_order_id = ?
    `;

    // Thực hiện reset bảng production_orders trước
    console.log('🔄 Executing production_orders reset query...');
    db.query(resetOrderQuery, [orderId], (err, orderResult) => {
      if (err) {
        console.log('❌ ERROR: Failed to reset production_orders:', err.message);
        console.log('🔍 Error details:', {
          code: err.code,
          errno: err.errno,
          sqlState: err.sqlState,
          sqlMessage: err.sqlMessage
        });
        return db.rollback(() => {
          res.status(500).json({ 
            error: 'Lỗi reset production_orders', 
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

      console.log('✅ production_orders reset successful');
      console.log('📊 Affected rows:', orderResult.affectedRows);

      // Kiểm tra xem có reset được dòng nào không
      if (orderResult.affectedRows === 0) {
        console.log('❌ ERROR: No rows affected - order not found');
        return db.rollback(() => {
          res.status(404).json({ 
            error: 'Không tìm thấy lệnh sản xuất với ID: ' + orderId 
          });
        });
      }

      // Thực hiện reset bảng production_machines
      console.log('🔄 Executing production_machines reset query...');
      console.log('📝 SQL Query for production_machines:', resetMachineQuery);
      console.log('🔍 Parameters:', [orderId]);
      
      db.query(resetMachineQuery, [orderId], (err, machineResult) => {
        if (err) {
          console.log('❌ ERROR: Failed to reset production_machines:', err.message);
          console.log('🔍 Error details:', {
            code: err.code,
            errno: err.errno,
            sqlState: err.sqlState,
            sqlMessage: err.sqlMessage
          });
          return db.rollback(() => {
            res.status(500).json({ 
              error: 'Lỗi reset production_machines', 
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

        console.log('✅ production_machines reset successful');
        console.log('📊 Affected rows:', machineResult.affectedRows);

        // Commit transaction nếu tất cả thành công
        console.log('🔄 Committing transaction...');
        db.commit((err) => {
          if (err) {
            console.log('❌ ERROR: Failed to commit transaction:', err.message);
            return db.rollback(() => {
              res.status(500).json({ 
                error: 'Lỗi commit transaction: ' + err.message 
              });
            });
          }

          console.log('✅ Transaction committed successfully');
          console.log('🎉 RESET PRODUCTION COMPLETED SUCCESSFULLY');

          // Trả về kết quả thành công
          res.json({
            success: true,
            message: `Đã reset thành công công đoạn ${stage.toUpperCase()} về trạng thái chờ`,
            order_id: orderId,
            stage: stage,
            reset_time: new Date().toISOString(),
            reset_fields: [
              `${stage}_start_time`,
              `${stage}_end_time`, 
              `${stage}_status`,
              `${stage}_worker_name`,
              `${stage}_machine_name`,
              `${stage}_shift`,
              `${stage}_note`,
              `${stage}_good_quantity`,
              `${stage}_ng_quantity`,
              `${stage}_output_quantity`,
              `${stage}_handover_quantity`,
              `${stage}_input_quantity`
            ],
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

/**
 * API: Kiểm tra cấu trúc bảng production_orders
 * Endpoint: GET /data/check_table_structure
 */
app.get('/data/check_table_structure', (req, res) => {
  const query = `
    SELECT
      COLUMN_NAME,
      DATA_TYPE,
      IS_NULLABLE,
      COLUMN_DEFAULT,
      COLUMN_COMMENT
    FROM INFORMATION_SCHEMA.COLUMNS
    WHERE TABLE_SCHEMA = 'autoslp'
    AND TABLE_NAME = 'production_orders'
    ORDER BY ORDINAL_POSITION
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error('❌ Lỗi kiểm tra cấu trúc bảng:', err);
      return res.status(500).json({
        error: 'Lỗi kiểm tra cấu trúc bảng',
        details: err.message
      });
    }

    res.json({
      success: true,
      table_name: 'production_orders',
      total_columns: results.length,
      columns: results
    });
  });
});

// Test API để cập nhật xa_note
app.post('/data/test-xa-note', (req, res) => {
  const { orderId, note } = req.body;

  if (!orderId || !note) {
    return res.status(400).json({
      error: 'Thiếu thông tin: orderId hoặc note'
    });
  }

  const updateQuery = `
    UPDATE production_orders
    SET xa_note = ?
    WHERE id = ?
  `;

  db.query(updateQuery, [note, orderId], (err, result) => {
    if (err) {
      console.error('❌ Lỗi test cập nhật xa_note:', err);
      return res.status(500).json({
        error: 'Lỗi test cập nhật xa_note',
        details: err.message
      });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({
        error: 'Không tìm thấy record với ID: ' + orderId
      });
    }

    res.json({
      success: true,
      message: 'Đã cập nhật xa_note thành công',
      order_id: orderId,
      note: note,
      affected_rows: result.affectedRows
    });
  });
});

// API để kiểm tra dữ liệu hiện tại
app.get('/data/check-current-data/:id', (req, res) => {
  const orderId = req.params.id;

  const query = `
    SELECT 
      id,
      production_order,
      xa_note,
      xa_start_time,
      xa_end_time,
      xa_worker_name,
      xa_machine_name,
      production_shift,
      stage_ng_start_end_quantity,
      stage_return_quantity
    FROM production_orders
    WHERE id = ?
  `;

  db.query(query, [orderId], (err, results) => {
    if (err) {
      console.error('❌ Lỗi kiểm tra dữ liệu hiện tại:', err);
      return res.status(500).json({
        error: 'Lỗi kiểm tra dữ liệu hiện tại',
        details: err.message
      });
    }

    if (results.length === 0) {
      return res.status(404).json({
        error: 'Không tìm thấy record với ID: ' + orderId
      });
    }

    res.json({
      success: true,
      data: results[0]
    });
  });
});

// API để chạy SQL tùy chỉnh (chỉ cho SELECT)
app.post('/data/run-custom-sql', (req, res) => {
  const { sql } = req.body;

  if (!sql) {
    return res.status(400).json({
      error: 'Thiếu SQL query'
    });
  }

  // Chỉ cho phép SELECT để bảo mật
  if (!sql.trim().toUpperCase().startsWith('SELECT')) {
    return res.status(400).json({
      error: 'Chỉ cho phép SELECT query'
    });
  }

  db.query(sql, (err, results) => {
    if (err) {
      console.error('❌ Lỗi chạy SQL tùy chỉnh:', err);
      return res.status(500).json({
        error: 'Lỗi chạy SQL tùy chỉnh',
        details: err.message
      });
    }

    res.json({
      success: true,
      result: results
    });
  });
});

// API để kiểm tra chi tiết kiểu dữ liệu
app.get('/data/check-column-types', (req, res) => {
  const query = `
    SELECT
      COLUMN_NAME,
      DATA_TYPE,
      CHARACTER_MAXIMUM_LENGTH,
      NUMERIC_PRECISION,
      NUMERIC_SCALE,
      IS_NULLABLE,
      COLUMN_DEFAULT,
      COLUMN_COMMENT
    FROM INFORMATION_SCHEMA.COLUMNS
    WHERE TABLE_SCHEMA = 'autoslp'
    AND TABLE_NAME = 'production_orders'
    AND COLUMN_NAME IN ('xa_note', 'production_shift', 'stage_ng_start_end_quantity', 'stage_return_quantity', 'xa_start_time', 'xa_end_time', 'xa_worker_name', 'xa_machine_name')
    ORDER BY ORDINAL_POSITION
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error('❌ Lỗi kiểm tra kiểu dữ liệu:', err);
      return res.status(500).json({
        error: 'Lỗi kiểm tra kiểu dữ liệu',
        details: err.message
      });
    }

    res.json({
      success: true,
      columns: results
    });
  });
});














// ========== API �ON GI?N CHO M�Y ==========

// 1. L?y danh s�ch m�y r?nh
app.get('/data/available_machines', (req, res) => {
    const query = `
        SELECT machine_id, machine_name
        FROM production_machines
        WHERE current_order_id IS NULL
        ORDER BY machine_id
    `;

    db.query(query, (err, results) => {
        if (err) {
            console.error('? L?i l?y danh s�ch m�y r?nh:', err);
            return res.status(500).json({ 
                error: 'L?i l?y danh s�ch m�y r?nh', 
                details: err.message 
            });
        }

        res.json({
            available_machines: results
        });
    });
});

// 2. B?t d?u l?nh tr�n m�y
app.post('/data/start_order_on_machine', (req, res) => {
    const { machine_id, order_id, order_code } = req.body;

    if (!machine_id || !order_id || !order_code) {
        return res.status(400).json({ error: 'Thi?u th�ng tin: machine_id, order_id, order_code' });
    }

    const query = `CALL StartOrderOnMachine(?, ?, ?)`;
    
    db.query(query, [machine_id, order_id, order_code], (err, results) => {
        if (err) {
            console.error('? L?i b?t d?u l?nh tr�n m�y:', err);
            return res.status(500).json({ 
                error: 'L?i b?t d?u l?nh tr�n m�y', 
                details: err.message 
            });
        }

        res.json({
            success: true,
            message: `�� b?t d?u l?nh ${order_code} tr�n m�y ${machine_id}`,
            machine_id: machine_id,
            order_id: order_id,
            order_code: order_code
        });
    });
});

// 3. K?t th�c l?nh tr�n m�y
app.post('/data/end_order_on_machine', (req, res) => {
    const { machine_id, order_id } = req.body;

    if (!machine_id || !order_id) {
        return res.status(400).json({ error: 'Thi?u th�ng tin: machine_id, order_id' });
    }

    const query = `CALL EndOrderOnMachine(?, ?)`;
    
    db.query(query, [machine_id, order_id], (err, results) => {
        if (err) {
            console.error('? L?i k?t th�c l?nh tr�n m�y:', err);
            return res.status(500).json({ 
                error: 'L?i k?t th�c l?nh tr�n m�y', 
                details: err.message 
            });
        }

        res.json({
            success: true,
            message: `�� k?t th�c l?nh tr�n m�y ${machine_id}`,
            machine_id: machine_id,
            order_id: order_id
        });
    });
});

// 4. L?y tr?ng th�i m�y
app.get('/data/machine_status', (req, res) => {
    const query = `SELECT * FROM v_machine_status`;

    db.query(query, (err, results) => {
        if (err) {
            console.error('? L?i l?y tr?ng th�i m�y:', err);
            return res.status(500).json({ 
                error: 'L?i l?y tr?ng th�i m�y', 
                details: err.message 
            });
        }

        res.json({
            machines: results
        });
    });
});

// 5. Ki?m tra m�y c� r?nh kh�ng
app.get('/data/check_machine/:machine_id', (req, res) => {
    const machine_id = req.params.machine_id;

    const query = `SELECT IsMachineAvailable(?) as is_available`;
    
    db.query(query, [machine_id], (err, results) => {
        if (err) {
            console.error('? L?i ki?m tra m�y:', err);
            return res.status(500).json({ 
                error: 'L?i ki?m tra m�y', 
                details: err.message 
            });
        }

        const isAvailable = results[0].is_available === 1;
        
        res.json({
            machine_id: machine_id,
            is_available: isAvailable
        });
    });
});





// API để lấy thông tin máy và lệnh sản xuất hiện tại
app.get('/data/production_machines', (req, res) => {
  const query = `
    SELECT 
      id,
      stage_machine,
      machine_id,
    
      machine_name,
      current_order_id,
      current_order_code,
      created_at
    FROM production_machines
    ORDER BY machine_name
  `;

  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({
        error: 'Lỗi khi lấy dữ liệu máy sản xuất',
        details: err.message
      });
    }

    res.json(results);
  });
});

// API để lấy thông tin máy theo tên máy
app.get('/data/production_machines/:machine_name', (req, res) => {
  const machineName = req.params.machine_name;
  
  const query = `
    SELECT 
      id,
      machine_id,
      stage_machine,
      machine_name,
      current_order_id,
      current_order_code,
      created_at
    FROM production_machines
    WHERE machine_name = ?
  `;

  db.query(query, [machineName], (err, results) => {
    if (err) {
      return res.status(500).json({
        error: 'Lỗi khi lấy dữ liệu máy sản xuất',
        details: err.message
      });
    }

    if (results.length === 0) {
      return res.status(404).json({
        error: 'Không tìm thấy máy: ' + machineName
      });
    }

    res.json(results[0]);
  });
});
















// =====================================================
// PRODUCTION ORDERS SHIFT APIs
// Quản lý thông tin chi tiết theo từng ca làm việc
// =====================================================

// API LẤY DANH SÁCH SHIFT CỦA MỘT LỆNH SẢN XUẤT
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

// API LẤY CHI TIẾT MỘT SHIFT
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

// API TẠO SHIFT MỚI
app.post('/data/production_orders_shift', (req, res) => {
  const {
    production_order_id,
    production_order,
    stage,
    shift_number,
    shift_name,
    shift_date,
    input_quantity,
    worker_name,
    machine_name,
    start_time,
    end_time,
    work_duration_minutes,
    good_quantity,
    ng_quantity,
    ng_start_end_quantity,
    return_quantity,
    output_quantity,
    handover_quantity,
    efficiency_percent,
    quality_score,
    handover_person,
    receiver_person,
    ng_reason,
    quality_notes,
    is_overtime,
    overtime_hours,
    is_night_shift,
    break_duration_minutes,
    status,
    notes
  } = req.body;

  // Validation
  if (!production_order_id || !stage || !shift_number) {
    return res.status(400).json({
      error: 'Thiếu thông tin bắt buộc: production_order_id, stage, shift_number'
    });
  }

  // Bỏ check - cho phép tạo nhiều shift cùng số

    // Tạo shift mới với đầy đủ thông tin
    const insertQuery = `
      INSERT INTO production_orders_shift (
        production_order_id, production_order, stage, shift_number, shift_name, shift_date,
        input_quantity, worker_name, machine_name, start_time, end_time,
        work_duration_minutes, good_quantity, ng_quantity, ng_start_end_quantity,
        return_quantity, output_quantity, handover_quantity, efficiency_percent,
        quality_score, handover_person, receiver_person, ng_reason, quality_notes,
        is_overtime, overtime_hours, is_night_shift, break_duration_minutes,
        status, notes
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const insertParams = [
      production_order_id, production_order, stage, shift_number, shift_name, shift_date,
      input_quantity || 0, worker_name, machine_name, start_time, end_time,
      work_duration_minutes || 0, good_quantity || 0, ng_quantity || 0, ng_start_end_quantity || 0,
      return_quantity || 0, output_quantity || 0, handover_quantity || 0, efficiency_percent || 0,
      quality_score || 0, handover_person, receiver_person, ng_reason, quality_notes,
      is_overtime || 0, overtime_hours || 0, is_night_shift || 0, break_duration_minutes || 0,
      status || 'in_progress', notes
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

      // Cập nhật bảng production_machines nếu có machine_name
      if (machine_name) {
        const updateMachineQuery = `
          UPDATE production_machines 
          SET 
            current_order_id = ?,
            current_order_code = ?
          WHERE machine_name = ?
        `;

        const machineQueryParams = [
          production_order_id,
          production_order,
          machine_name
        ];

        db.query(updateMachineQuery, machineQueryParams, (machineErr, machineResult) => {
          if (machineErr) {
            console.error('❌ Lỗi cập nhật production_machines:', machineErr);
            // Không return error vì shift đã tạo thành công, chỉ log lỗi
          } else {
            console.log('✅ Cập nhật production_machines thành công:', {
              machine_name,
              current_order_id: production_order_id,
              current_order_code: production_order,
              affected_rows: machineResult.affectedRows
            });
          }

          // Tiếp tục với việc lấy thông tin shift
          completeShiftCreation();
        });
      } else {
        // Nếu không có machine_name, tiếp tục trực tiếp
        completeShiftCreation();
      }

      function completeShiftCreation() {
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
            shift: getResults[0] || { id: newShiftId },
            machine_updated: !!machine_name
          });
        });
      }
    });
  });

// API CẬP NHẬT SHIFT
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

// API XÓA SHIFT
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

// API KẾT THÚC SHIFT
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

// API THỐNG KÊ SHIFT
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

// API TỔNG HỢP DỮ LIỆU SHIFT VÀ PRODUCTION_ORDERS
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



app.listen(port, () => {
  console.log(`🚀 Server đang chạy tại http://localhost:${port}`);
});
