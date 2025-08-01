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
  'id', 'production_order', 'po_number', 'customer_name', 'product_name',
  'order_quantity', 'deployed_quantity', 'required_quantity','internal_product_code','workflow_definition',
  'work_stage', 'status', 'deployment_date', 'created_at', 'updated_at','sheet_count','paper_length','paper_width','paper_type','paper_weight','part_count','color_count','blank_count','order_type'
];

// �?nh nghia c�c c?t theo c�ng do?n
const STAGE_COLUMNS = {
  'xa': [
    'xa_input_quantity', 'xa_output_quantity', 'xa_good_quantity', 'xa_ng_quantity',
    'xa_status', 'xa_start_time', 'xa_end_time', 'xa_worker_name', 'xa_note',
    'xen_input_quantity', 'xen_output_quantity', 'xen_good_quantity', 'xen_ng_quantity',
    'xen_status', 'xen_start_time', 'xen_end_time', 'xen_worker_name', 'xen_note'
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
    query += ' AND (workflow_definition LIKE ? OR workflow_definition IS NULL)';
    params.push(`%${req.query.stage}%`);
  }
  
  // B? l?c theo ng�y tri?n khai
  if (req.query.deployment_date) {
    query += ' AND deployment_date = ?';
    params.push(req.query.deployment_date);
  }
  
  // B? l?c theo tr?ng th�i
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
    stage = 'xa',           // Mặc định là công đoạn XẢ
    worker_name = '',       // Tên thợ sản xuất
    machine_name = '',      // Tên máy sản xuất
    shift = '',             // Ca làm việc
    notes = ''              // Ghi chú
  } = req.body;

  // DEBUG: Log tất cả dữ liệu đầu vào
  console.log('🔍 DEBUG start_production - Dữ liệu đầu vào:');
  console.log('  orderId:', orderId, 'type:', typeof orderId);
  console.log('  req.body:', JSON.stringify(req.body, null, 2));
  console.log('  stage:', stage, 'type:', typeof stage);
  console.log('  worker_name:', worker_name, 'type:', typeof worker_name);
  console.log('  machine_name:', machine_name, 'type:', typeof machine_name);
  console.log('  shift:', shift, 'type:', typeof shift);
  console.log('  notes:', notes, 'type:', typeof notes);

  // Kiểm tra thông tin bắt buộc
  if (!orderId) {
    return res.status(400).json({ 
      error: 'Thiếu thông tin: orderId' 
    });
  }

  // Tạo câu lệnh SQL để cập nhật thời gian bắt đầu
  const updateQuery = `
    UPDATE production_orders 
    SET 
      ${stage}_start_time = NOW(),                    -- Cập nhật thời gian bắt đầu = thời gian hiện tại
      ${stage}_status = 'in_progress',                -- Cập nhật trạng thái = đang sản xuất
      ${stage}_worker_name = ?,                       -- Ghi lại tên thợ
      ${stage}_machine_name = ?,                      -- Ghi lại tên máy
      production_shift = ?,                           -- Cập nhật ca làm việc
      ${stage}_note = ?,                              -- Ghi lại ghi chú
      updated_at = CURRENT_TIMESTAMP                  -- Cập nhật thời gian chỉnh sửa
    WHERE id = ?
  `;

  const queryParams = [
    worker_name,      // Tham số 1: tên thợ
    machine_name,     // Tham số 2: tên máy
    shift,           // Tham số 3: ca làm việc
    notes,           // Tham số 4: ghi chú
    orderId          // Tham số 5: ID lệnh sản xuất
  ];

  // DEBUG: Log câu lệnh SQL và tham số
  console.log('🔍 DEBUG start_production - SQL Query:');
  console.log('  Query:', updateQuery);
  console.log('  Parameters:', JSON.stringify(queryParams, null, 2));
  console.log('  Parameter types:', queryParams.map(p => typeof p));
  
  // DEBUG: Kiểm tra dữ liệu trước khi update
  const beforeQuery = `SELECT id, ${stage}_start_time, ${stage}_status, ${stage}_worker_name, ${stage}_machine_name, production_shift, ${stage}_note FROM production_orders WHERE id = ?`;
  db.query(beforeQuery, [orderId], (beforeErr, beforeResult) => {
    if (beforeErr) {
      console.error('❌ Lỗi kiểm tra dữ liệu trước update:', beforeErr);
    } else {
      console.log('🔍 DEBUG start_production - Data before update:');
      console.log('  Before result:', JSON.stringify(beforeResult[0], null, 2));
    }
  });

  // Thực hiện câu lệnh SQL
  db.query(updateQuery, queryParams, (err, result) => {
    if (err) {
      console.error('❌ Lỗi cập nhật thời gian bắt đầu:', err);
      console.error('🔍 DEBUG - Chi tiết lỗi:');
      console.error('  Error code:', err.code);
      console.error('  Error number:', err.errno);
      console.error('  SQL state:', err.sqlState);
      console.error('  SQL message:', err.sqlMessage);
      return res.status(500).json({ 
        error: 'Lỗi cập nhật thời gian bắt đầu', 
        details: err.message,
        debug_info: {
          code: err.code,
          errno: err.errno,
          sqlState: err.sqlState,
          sqlMessage: err.sqlMessage
        }
      });
    }

    // DEBUG: Log kết quả query
    console.log('🔍 DEBUG start_production - Query Result:');
    console.log('  affectedRows:', result.affectedRows);
    console.log('  insertId:', result.insertId);
    console.log('  message:', result.message);

    // Kiểm tra xem có cập nhật được dòng nào không
    if (result.affectedRows === 0) {
      console.log('⚠️ WARNING: No rows affected - Order ID might not exist');
      return res.status(404).json({ 
        error: 'Không tìm thấy lệnh sản xuất với ID: ' + orderId 
      });
    }

    // DEBUG: Kiểm tra dữ liệu sau khi update
    const checkQuery = `SELECT id, ${stage}_start_time, ${stage}_status, ${stage}_worker_name, ${stage}_machine_name, production_shift, ${stage}_note FROM production_orders WHERE id = ?`;
    db.query(checkQuery, [orderId], (checkErr, checkResult) => {
      if (checkErr) {
        console.error('❌ Lỗi kiểm tra dữ liệu sau update:', checkErr);
      } else {
        console.log('🔍 DEBUG start_production - Data after update:');
        console.log('  Check result:', JSON.stringify(checkResult[0], null, 2));
      }
    });

    // Trả về kết quả thành công
    res.json({
      success: true,
      message: `Đã bắt đầu sản xuất công đoạn ${stage.toUpperCase()}`,
      order_id: orderId,
      stage: stage,
      start_time: new Date().toISOString(),
      worker_name: worker_name,
      machine_name: machine_name,
      shift: shift,
      affected_rows: result.affectedRows
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
app.post('/data/production_orders/:id/end_production', (req, res) => {
  const orderId = req.params.id;
  const { 
    stage = 'xa',                    // Mặc định là công đoạn XẢ
    good_quantity = 0,               // Số lượng đạt (OK)
    ng_quantity = 0,                 // Số lượng NG
    ng_start_end_quantity = 0,       // NG đầu/cuối
    return_quantity = 0,             // Hàng trả
    notes = ''                       // Ghi chú
  } = req.body;

  // Kiểm tra thông tin bắt buộc
  if (!orderId) {
    return res.status(400).json({ 
      error: 'Thiếu thông tin: orderId' 
    });
  }

  // Tính tổng số lượng output
  const total_output = good_quantity + ng_quantity + ng_start_end_quantity + return_quantity;

  // Tạo câu lệnh SQL để cập nhật thời gian kết thúc và kết quả
  const updateQuery = `
    UPDATE production_orders 
    SET 
      ${stage}_end_time = NOW(),                     -- Cập nhật thời gian kết thúc = thời gian hiện tại
      ${stage}_status = 'completed',                 -- Cập nhật trạng thái = hoàn thành
      ${stage}_good_quantity = ?,                    -- Số lượng đạt (OK)
      ${stage}_ng_quantity = ?,                      -- Số lượng NG
      stage_ng_start_end_quantity = ?,               -- NG đầu/cuối
      stage_return_quantity = ?,                     -- Hàng trả
      ${stage}_output_quantity = ?,                  -- Tổng số lượng output
      ${stage}_note = ?,                             -- Ghi chú
      updated_at = CURRENT_TIMESTAMP                 -- Cập nhật thời gian chỉnh sửa
    WHERE id = ?
  `;

  // Thực hiện câu lệnh SQL
  db.query(updateQuery, [
    good_quantity,              // Tham số 1: số lượng đạt
    ng_quantity,                // Tham số 2: số lượng NG
    ng_start_end_quantity,      // Tham số 3: NG đầu/cuối
    return_quantity,            // Tham số 4: hàng trả
    total_output,               // Tham số 5: tổng output
    notes,                      // Tham số 6: ghi chú
    orderId                     // Tham số 7: ID lệnh sản xuất
  ], (err, result) => {
    if (err) {
      console.error('❌ Lỗi cập nhật thời gian kết thúc:', err);
      return res.status(500).json({ 
        error: 'Lỗi cập nhật thời gian kết thúc', 
        details: err.message 
      });
    }

    // Kiểm tra xem có cập nhật được dòng nào không
    if (result.affectedRows === 0) {
      return res.status(404).json({ 
        error: 'Không tìm thấy lệnh sản xuất với ID: ' + orderId 
      });
    }

    // Trả về kết quả thành công
    res.json({
      success: true,
      message: `Đã kết thúc sản xuất công đoạn ${stage.toUpperCase()}`,
      order_id: orderId,
      stage: stage,
      end_time: new Date().toISOString(),
      production_results: {
        good_quantity: good_quantity,
        ng_quantity: ng_quantity,
        ng_start_end_quantity: ng_start_end_quantity,
        return_quantity: return_quantity,
        total_output: total_output
      },
      affected_rows: result.affectedRows
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

// API để kiểm tra tất cả cột của bảng production_orders
app.get('/data/check-all-columns', (req, res) => {
  const query = `
    SELECT
      COLUMN_NAME,
      DATA_TYPE,
      CHARACTER_MAXIMUM_LENGTH,
      IS_NULLABLE,
      COLUMN_DEFAULT,
      COLUMN_COMMENT
    FROM INFORMATION_SCHEMA.COLUMNS
    WHERE TABLE_SCHEMA = 'autoslp'
    AND TABLE_NAME = 'production_orders'
    AND COLUMN_NAME LIKE '%xa%'
    ORDER BY ORDINAL_POSITION
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error('❌ Lỗi kiểm tra tất cả cột:', err);
      return res.status(500).json({
        error: 'Lỗi kiểm tra tất cả cột',
        details: err.message
      });
    }

    res.json({
      success: true,
      columns: results
    });
  });
});

// API để kiểm tra dữ liệu của một lệnh sản xuất
app.get('/data/production_orders/:id/check', (req, res) => {
  const orderId = req.params.id;
  
  const checkQuery = `
    SELECT 
      id, 
      production_order,
      xa_start_time, 
      xa_status, 
      xa_worker_name, 
      xa_machine_name, 
      production_shift, 
      xa_note,
      updated_at
    FROM production_orders 
    WHERE id = ?
  `;
  
  db.query(checkQuery, [orderId], (err, result) => {
    if (err) {
      console.error('❌ Lỗi kiểm tra dữ liệu:', err);
      return res.status(500).json({ 
        error: 'Lỗi kiểm tra dữ liệu', 
        details: err.message 
      });
    }
    
    if (result.length === 0) {
      return res.status(404).json({ 
        error: 'Không tìm thấy lệnh sản xuất với ID: ' + orderId 
      });
    }
    
    res.json({
      success: true,
      data: result[0]
    });
  });
});

// ========== API ĐƠN GIẢN CHO MÁY ==========

// 1. Lấy danh sách máy rảnh
app.get('/api/available_machines', (req, res) => {
    const query = `
        SELECT machine_id, machine_name
        FROM production_machines 
        WHERE current_order_id IS NULL
        ORDER BY machine_id
    `;

    db.query(query, (err, results) => {
        if (err) {
            console.error('❌ Lỗi lấy danh sách máy rảnh:', err);
            return res.status(500).json({ 
                error: 'Lỗi lấy danh sách máy rảnh', 
                details: err.message 
            });
        }

        res.json({
            available_machines: results
        });
    });
});

// 2. Bắt đầu lệnh trên máy
app.post('/api/start_order_on_machine', (req, res) => {
    const { machine_id, order_id, order_code } = req.body;

    if (!machine_id || !order_id || !order_code) {
        return res.status(400).json({ error: 'Thiếu thông tin: machine_id, order_id, order_code' });
    }

    const query = `CALL StartOrderOnMachine(?, ?, ?)`;
    
    db.query(query, [machine_id, order_id, order_code], (err, results) => {
        if (err) {
            console.error('❌ Lỗi bắt đầu lệnh trên máy:', err);
            return res.status(500).json({ 
                error: 'Lỗi bắt đầu lệnh trên máy', 
                details: err.message 
            });
        }

        res.json({
            success: true,
            message: `Đã bắt đầu lệnh ${order_code} trên máy ${machine_id}`,
            machine_id: machine_id,
            order_id: order_id,
            order_code: order_code
        });
    });
});

// 3. Kết thúc lệnh trên máy
app.post('/api/end_order_on_machine', (req, res) => {
    const { machine_id, order_id } = req.body;

    if (!machine_id || !order_id) {
        return res.status(400).json({ error: 'Thiếu thông tin: machine_id, order_id' });
    }

    const query = `CALL EndOrderOnMachine(?, ?)`;
    
    db.query(query, [machine_id, order_id], (err, results) => {
        if (err) {
            console.error('❌ Lỗi kết thúc lệnh trên máy:', err);
            return res.status(500).json({ 
                error: 'Lỗi kết thúc lệnh trên máy', 
                details: err.message 
            });
        }

        res.json({
            success: true,
            message: `Đã kết thúc lệnh trên máy ${machine_id}`,
            machine_id: machine_id,
            order_id: order_id
        });
    });
});

// 4. Lấy trạng thái máy
app.get('/api/machine_status', (req, res) => {
    const query = `
        SELECT 
            machine_id,
            machine_name,
            CASE 
                WHEN current_order_id IS NULL THEN 'available'
                ELSE 'busy'
            END as status,
            current_order_code,
            current_order_id
        FROM production_machines
        ORDER BY machine_id
    `;

    db.query(query, (err, results) => {
        if (err) {
            console.error('❌ Lỗi lấy trạng thái máy:', err);
            return res.status(500).json({ 
                error: 'Lỗi lấy trạng thái máy', 
                details: err.message 
            });
        }

        res.json({
            machines: results
        });
    });
});

// 1.1. Lấy danh sách máy rảnh (data endpoint)
app.get('/api/data/available_machines', (req, res) => {
    const query = `
        SELECT machine_id, machine_name
        FROM production_machines 
        WHERE current_order_id IS NULL
        ORDER BY machine_id
    `;

    db.query(query, (err, results) => {
        if (err) {
            console.error('❌ Lỗi lấy danh sách máy rảnh:', err);
            return res.status(500).json({ 
                error: 'Lỗi lấy danh sách máy rảnh', 
                details: err.message 
            });
        }

        res.json({
            available_machines: results
        });
    });
});

// 2.1. Bắt đầu lệnh trên máy (data endpoint)
app.post('/api/data/start_order_on_machine', (req, res) => {
    const { machine_id, order_id, order_code } = req.body;

    if (!machine_id || !order_id || !order_code) {
        return res.status(400).json({ error: 'Thiếu thông tin: machine_id, order_id, order_code' });
    }

    const query = `CALL StartOrderOnMachine(?, ?, ?)`;
    
    db.query(query, [machine_id, order_id, order_code], (err, results) => {
        if (err) {
            console.error('❌ Lỗi bắt đầu lệnh trên máy:', err);
            return res.status(500).json({ 
                error: 'Lỗi bắt đầu lệnh trên máy', 
                details: err.message 
            });
        }

        res.json({
            success: true,
            message: `Đã bắt đầu lệnh ${order_code} trên máy ${machine_id}`,
            machine_id: machine_id,
            order_id: order_id,
            order_code: order_code
        });
    });
});

// 3.1. Kết thúc lệnh trên máy (data endpoint)
app.post('/api/data/end_order_on_machine', (req, res) => {
    const { machine_id, order_id } = req.body;

    if (!machine_id || !order_id) {
        return res.status(400).json({ error: 'Thiếu thông tin: machine_id, order_id' });
    }

    const query = `CALL EndOrderOnMachine(?, ?)`;
    
    db.query(query, [machine_id, order_id], (err, results) => {
        if (err) {
            console.error('❌ Lỗi kết thúc lệnh trên máy:', err);
            return res.status(500).json({ 
                error: 'Lỗi kết thúc lệnh trên máy', 
                details: err.message 
            });
        }

        res.json({
            success: true,
            message: `Đã kết thúc lệnh trên máy ${machine_id}`,
            machine_id: machine_id,
            order_id: order_id
        });
    });
});

// 4.1. Lấy trạng thái máy (data endpoint)
app.get('/api/data/machine_status', (req, res) => {
    const query = `
        SELECT 
            machine_id,
            machine_name,
            CASE 
                WHEN current_order_id IS NULL THEN 'available'
                ELSE 'busy'
            END as status,
            current_order_code,
            current_order_id
        FROM production_machines
        ORDER BY machine_id
    `;

    db.query(query, (err, results) => {
        if (err) {
            console.error('❌ Lỗi lấy trạng thái máy:', err);
            return res.status(500).json({ 
                error: 'Lỗi lấy trạng thái máy', 
                details: err.message 
            });
        }

        res.json({
            machines: results
        });
    });
});

// 5.1. Kiểm tra máy có rảnh không (data endpoint)
app.get('/api/data/check_machine/:machine_id', (req, res) => {
    const machine_id = req.params.machine_id;

    const query = `SELECT IsMachineAvailable(?) as is_available`;
    
    db.query(query, [machine_id], (err, results) => {
        if (err) {
            console.error('❌ Lỗi kiểm tra máy:', err);
            return res.status(500).json({ 
                error: 'Lỗi kiểm tra máy', 
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

// 5. Kiểm tra máy có rảnh không
app.get('/api/check_machine/:machine_id', (req, res) => {
    const machine_id = req.params.machine_id;

    const query = `SELECT IsMachineAvailable(?) as is_available`;
    
    db.query(query, [machine_id], (err, results) => {
        if (err) {
            console.error('❌ Lỗi kiểm tra máy:', err);
            return res.status(500).json({ 
                error: 'Lỗi kiểm tra máy', 
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

app.listen(port, () => {
  console.log(`🚀 Server đang chạy tại http://localhost:${port}`);
});
