-- ==== Script UPDATE Production Orders BIG DATA cho MySQL ====
-- Copy và chạy từng nhóm lệnh này trong MySQL

-- === NHÓM 1: XẢ TRACKING ===
ALTER TABLE production_orders ADD xa_start_time DATETIME;
ALTER TABLE production_orders ADD xa_end_time DATETIME;
ALTER TABLE production_orders ADD xa_worker_name VARCHAR(100);
ALTER TABLE production_orders ADD xa_machine_name VARCHAR(50);
ALTER TABLE production_orders ADD xa_input_quantity INT DEFAULT 0;
ALTER TABLE production_orders ADD xa_output_quantity INT DEFAULT 0;
ALTER TABLE production_orders ADD xa_good_quantity INT DEFAULT 0;
ALTER TABLE production_orders ADD xa_ng_quantity INT DEFAULT 0;
ALTER TABLE production_orders ADD xa_ng_reason TEXT;
ALTER TABLE production_orders ADD xa_efficiency DECIMAL(5,2);
ALTER TABLE production_orders ADD xa_note TEXT;
ALTER TABLE production_orders ADD xa_status ENUM('waiting', 'in_progress', 'completed', 'paused') DEFAULT 'waiting';

-- === NHÓM 2: XÉN TRACKING ===
ALTER TABLE production_orders ADD xen_start_time DATETIME;
ALTER TABLE production_orders ADD xen_end_time DATETIME;
ALTER TABLE production_orders ADD xen_worker_name VARCHAR(100);
ALTER TABLE production_orders ADD xen_machine_name VARCHAR(50);
ALTER TABLE production_orders ADD xen_input_quantity INT DEFAULT 0;
ALTER TABLE production_orders ADD xen_output_quantity INT DEFAULT 0;
ALTER TABLE production_orders ADD xen_good_quantity INT DEFAULT 0;
ALTER TABLE production_orders ADD xen_ng_quantity INT DEFAULT 0;
ALTER TABLE production_orders ADD xen_ng_reason TEXT;
ALTER TABLE production_orders ADD xen_efficiency DECIMAL(5,2);
ALTER TABLE production_orders ADD xen_note TEXT;
ALTER TABLE production_orders ADD xen_status ENUM('waiting', 'in_progress', 'completed', 'paused') DEFAULT 'waiting';

-- === NHÓM 3: IN TRACKING ===
ALTER TABLE production_orders ADD in_start_time DATETIME;
ALTER TABLE production_orders ADD in_end_time DATETIME;
ALTER TABLE production_orders ADD in_worker_name VARCHAR(100);
ALTER TABLE production_orders ADD in_machine_name VARCHAR(50);
ALTER TABLE production_orders ADD in_input_quantity INT DEFAULT 0;
ALTER TABLE production_orders ADD in_output_quantity INT DEFAULT 0;
ALTER TABLE production_orders ADD in_good_quantity INT DEFAULT 0;
ALTER TABLE production_orders ADD in_ng_quantity INT DEFAULT 0;
ALTER TABLE production_orders ADD in_ng_reason TEXT;
ALTER TABLE production_orders ADD in_efficiency DECIMAL(5,2);
ALTER TABLE production_orders ADD in_note TEXT;
ALTER TABLE production_orders ADD in_status ENUM('waiting', 'in_progress', 'completed', 'paused') DEFAULT 'waiting';
ALTER TABLE production_orders ADD in_color_setup_time INT DEFAULT 0;
ALTER TABLE production_orders ADD in_plates_count INT DEFAULT 0;

-- === NHÓM 4: BỒI TRACKING ===
ALTER TABLE production_orders ADD boi_start_time DATETIME;
ALTER TABLE production_orders ADD boi_end_time DATETIME;
ALTER TABLE production_orders ADD boi_worker_name VARCHAR(100);
ALTER TABLE production_orders ADD boi_machine_name VARCHAR(50);
ALTER TABLE production_orders ADD boi_input_quantity INT DEFAULT 0;
ALTER TABLE production_orders ADD boi_output_quantity INT DEFAULT 0;
ALTER TABLE production_orders ADD boi_good_quantity INT DEFAULT 0;
ALTER TABLE production_orders ADD boi_ng_quantity INT DEFAULT 0;
ALTER TABLE production_orders ADD boi_ng_reason TEXT;
ALTER TABLE production_orders ADD boi_efficiency DECIMAL(5,2);
ALTER TABLE production_orders ADD boi_note TEXT;
ALTER TABLE production_orders ADD boi_status ENUM('waiting', 'in_progress', 'completed', 'paused') DEFAULT 'waiting';
ALTER TABLE production_orders ADD boi_dry_time INT DEFAULT 0;
ALTER TABLE production_orders ADD boi_temperature DECIMAL(5,2);

-- === NHÓM 5: BẾ TRACKING ===
ALTER TABLE production_orders ADD be_start_time DATETIME;
ALTER TABLE production_orders ADD be_end_time DATETIME;
ALTER TABLE production_orders ADD be_worker_name VARCHAR(100);
ALTER TABLE production_orders ADD be_machine_name VARCHAR(50);
ALTER TABLE production_orders ADD be_input_quantity INT DEFAULT 0;
ALTER TABLE production_orders ADD be_output_quantity INT DEFAULT 0;
ALTER TABLE production_orders ADD be_good_quantity INT DEFAULT 0;
ALTER TABLE production_orders ADD be_ng_quantity INT DEFAULT 0;
ALTER TABLE production_orders ADD be_ng_reason TEXT;
ALTER TABLE production_orders ADD be_efficiency DECIMAL(5,2);
ALTER TABLE production_orders ADD be_note TEXT;
ALTER TABLE production_orders ADD be_status ENUM('waiting', 'in_progress', 'completed', 'paused') DEFAULT 'waiting';
ALTER TABLE production_orders ADD be_setup_time INT DEFAULT 0;
ALTER TABLE production_orders ADD be_die_count INT DEFAULT 0;

-- === NHÓM 6: DÁN TRACKING ===
ALTER TABLE production_orders ADD dan_start_time DATETIME;
ALTER TABLE production_orders ADD dan_end_time DATETIME;
ALTER TABLE production_orders ADD dan_worker_name VARCHAR(100);
ALTER TABLE production_orders ADD dan_machine_name VARCHAR(50);
ALTER TABLE production_orders ADD dan_input_quantity INT DEFAULT 0;
ALTER TABLE production_orders ADD dan_output_quantity INT DEFAULT 0;
ALTER TABLE production_orders ADD dan_good_quantity INT DEFAULT 0;
ALTER TABLE production_orders ADD dan_ng_quantity INT DEFAULT 0;
ALTER TABLE production_orders ADD dan_ng_reason TEXT;
ALTER TABLE production_orders ADD dan_efficiency DECIMAL(5,2);
ALTER TABLE production_orders ADD dan_note TEXT;
ALTER TABLE production_orders ADD dan_status ENUM('waiting', 'in_progress', 'completed', 'paused') DEFAULT 'waiting';
ALTER TABLE production_orders ADD dan_glue_usage DECIMAL(8,2);
ALTER TABLE production_orders ADD dan_temperature DECIMAL(5,2);

-- === NHÓM 7: KHO TRACKING ===
ALTER TABLE production_orders ADD kho_start_time DATETIME;
ALTER TABLE production_orders ADD kho_end_time DATETIME;
ALTER TABLE production_orders ADD kho_worker_name VARCHAR(100);
ALTER TABLE production_orders ADD kho_input_quantity INT DEFAULT 0;
ALTER TABLE production_orders ADD kho_output_quantity INT DEFAULT 0;
ALTER TABLE production_orders ADD kho_good_quantity INT DEFAULT 0;
ALTER TABLE production_orders ADD kho_ng_quantity INT DEFAULT 0;
ALTER TABLE production_orders ADD kho_ng_reason TEXT;
ALTER TABLE production_orders ADD kho_efficiency DECIMAL(5,2);
ALTER TABLE production_orders ADD kho_note TEXT;
ALTER TABLE production_orders ADD kho_status ENUM('waiting', 'in_progress', 'completed', 'paused') DEFAULT 'waiting';
ALTER TABLE production_orders ADD kho_boxes_count INT DEFAULT 0;
ALTER TABLE production_orders ADD kho_package_weight DECIMAL(8,2);

-- === NHÓM 8: QUALITY CONTROL ===
ALTER TABLE production_orders ADD qc_inspector_name VARCHAR(100);
ALTER TABLE production_orders ADD qc_check_time DATETIME;
ALTER TABLE production_orders ADD qc_passed BOOLEAN DEFAULT FALSE;
ALTER TABLE production_orders ADD qc_notes TEXT;
ALTER TABLE production_orders ADD qc_defect_types TEXT;
ALTER TABLE production_orders ADD qc_sample_size INT DEFAULT 0;
ALTER TABLE production_orders ADD qc_defect_count INT DEFAULT 0;
ALTER TABLE production_orders ADD qc_approval_status ENUM('pending', 'approved', 'rejected', 'conditional') DEFAULT 'pending';

-- === NHÓM 9: MATERIAL TRACKING ===
ALTER TABLE production_orders ADD material_paper_lot VARCHAR(50);
ALTER TABLE production_orders ADD material_ink_lots TEXT;
ALTER TABLE production_orders ADD material_glue_lot VARCHAR(50);
ALTER TABLE production_orders ADD material_cost DECIMAL(10,2) DEFAULT 0;
ALTER TABLE production_orders ADD material_waste_cost DECIMAL(10,2) DEFAULT 0;

-- === NHÓM 10: PLANNING & SCHEDULING ===
ALTER TABLE production_orders ADD planned_start_date DATE;
ALTER TABLE production_orders ADD planned_end_date DATE;
ALTER TABLE production_orders ADD actual_start_date DATE;
ALTER TABLE production_orders ADD actual_end_date DATE;
ALTER TABLE production_orders ADD priority_level ENUM('Low', 'Normal', 'High', 'Critical', 'Emergency') DEFAULT 'Normal';
ALTER TABLE production_orders ADD rush_order BOOLEAN DEFAULT FALSE;

-- === NHÓM 11: COST & PERFORMANCE ===
ALTER TABLE production_orders ADD total_labor_hours DECIMAL(8,2) DEFAULT 0;
ALTER TABLE production_orders ADD total_machine_hours DECIMAL(8,2) DEFAULT 0;
ALTER TABLE production_orders ADD total_setup_time INT DEFAULT 0;
ALTER TABLE production_orders ADD total_production_cost DECIMAL(12,2) DEFAULT 0;
ALTER TABLE production_orders ADD cost_per_unit DECIMAL(8,4) DEFAULT 0;
ALTER TABLE production_orders ADD productivity_rate DECIMAL(8,2) DEFAULT 0;

-- === NHÓM 12: ENVIRONMENT & ENERGY ===
ALTER TABLE production_orders ADD energy_consumption DECIMAL(10,2) DEFAULT 0;
ALTER TABLE production_orders ADD water_usage DECIMAL(10,2) DEFAULT 0;
ALTER TABLE production_orders ADD waste_generated DECIMAL(10,2) DEFAULT 0;
ALTER TABLE production_orders ADD recycled_material DECIMAL(10,2) DEFAULT 0;

-- === NHÓM 13: CUSTOMER & SALES ===
ALTER TABLE production_orders ADD sales_rep_name VARCHAR(100);
ALTER TABLE production_orders ADD customer_po_date DATE;
ALTER TABLE production_orders ADD customer_specifications TEXT;
ALTER TABLE production_orders ADD packaging_requirements TEXT;
ALTER TABLE production_orders ADD shipping_method VARCHAR(50);
ALTER TABLE production_orders ADD delivery_address TEXT;

-- === NHÓM 14: DIGITAL & IoT ===
ALTER TABLE production_orders ADD machine_data_logs TEXT;
ALTER TABLE production_orders ADD sensor_readings TEXT;
ALTER TABLE production_orders ADD barcode_tracking VARCHAR(100);
ALTER TABLE production_orders ADD rfid_tags TEXT;
ALTER TABLE production_orders ADD digital_signatures TEXT;

-- === NHÓM 15: MAINTENANCE ===
ALTER TABLE production_orders ADD equipment_maintenance_due DATE;
ALTER TABLE production_orders ADD last_calibration_date DATE;
ALTER TABLE production_orders ADD tool_wear_level DECIMAL(5,2);
ALTER TABLE production_orders ADD preventive_maintenance BOOLEAN DEFAULT FALSE;

-- === NHÓM 16: COMPLIANCE ===
ALTER TABLE production_orders ADD regulatory_compliance BOOLEAN DEFAULT TRUE;
ALTER TABLE production_orders ADD certifications_required TEXT;
ALTER TABLE production_orders ADD audit_trail TEXT;
ALTER TABLE production_orders ADD document_versions TEXT;

-- === NHÓM 17: KPI & ANALYTICS ===
ALTER TABLE production_orders ADD kpi_oee DECIMAL(5,2);
ALTER TABLE production_orders ADD kpi_yield DECIMAL(5,2);
ALTER TABLE production_orders ADD kpi_throughput DECIMAL(8,2);
ALTER TABLE production_orders ADD kpi_first_pass_yield DECIMAL(5,2);
ALTER TABLE production_orders ADD performance_score DECIMAL(5,2);

-- === NHÓM 18: WORKFLOW STATES ===
ALTER TABLE production_orders ADD rework_required BOOLEAN DEFAULT FALSE;
ALTER TABLE production_orders ADD rework_stage VARCHAR(10);
ALTER TABLE production_orders ADD rework_reason TEXT;
ALTER TABLE production_orders ADD rework_count INT DEFAULT 0;
ALTER TABLE production_orders ADD hold_status BOOLEAN DEFAULT FALSE;
ALTER TABLE production_orders ADD hold_reason TEXT;
ALTER TABLE production_orders ADD expedite_status BOOLEAN DEFAULT FALSE;

-- === NHÓM 19: MULTI-SHIFT ===
ALTER TABLE production_orders ADD shift_handover_notes TEXT;
ALTER TABLE production_orders ADD night_shift_issues TEXT;
ALTER TABLE production_orders ADD weekend_production BOOLEAN DEFAULT FALSE;
ALTER TABLE production_orders ADD overtime_hours DECIMAL(6,2) DEFAULT 0;

-- === NHÓM 20: QUALITY METRICS ===
ALTER TABLE production_orders ADD cpk_value DECIMAL(6,4);
ALTER TABLE production_orders ADD sigma_level DECIMAL(4,2);
ALTER TABLE production_orders ADD defect_rate_ppm INT DEFAULT 0;
ALTER TABLE production_orders ADD customer_complaints INT DEFAULT 0;
ALTER TABLE production_orders ADD returns_quantity INT DEFAULT 0;

-- === NHÓM 21: INDEXES ===
ALTER TABLE production_orders ADD INDEX idx_xa_status (xa_status);
ALTER TABLE production_orders ADD INDEX idx_xen_status (xen_status);
ALTER TABLE production_orders ADD INDEX idx_in_status (in_status);
ALTER TABLE production_orders ADD INDEX idx_boi_status (boi_status);
ALTER TABLE production_orders ADD INDEX idx_be_status (be_status);
ALTER TABLE production_orders ADD INDEX idx_dan_status (dan_status);
ALTER TABLE production_orders ADD INDEX idx_kho_status (kho_status);
ALTER TABLE production_orders ADD INDEX idx_priority_level (priority_level);
ALTER TABLE production_orders ADD INDEX idx_qc_approval_status (qc_approval_status);
ALTER TABLE production_orders ADD INDEX idx_rush_order (rush_order);
ALTER TABLE production_orders ADD INDEX idx_hold_status (hold_status);
ALTER TABLE production_orders ADD INDEX idx_rework_required (rework_required);

-- === KIỂM TRA KẾT QUẢ ===
SELECT 'Hoàn thành! Bảng production_orders đã được mở rộng với hơn 150+ trường BIG DATA!' as message;

SELECT 
    COUNT(*) as total_columns,
    'Tổng số cột hiện tại' as description
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_NAME = 'production_orders' 
  AND TABLE_SCHEMA = DATABASE();

-- Hiển thị một số trường mới đã thêm
SELECT 
    COLUMN_NAME,
    DATA_TYPE,
    IS_NULLABLE,
    COLUMN_DEFAULT
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_NAME = 'production_orders' 
  AND TABLE_SCHEMA = DATABASE()
  AND (COLUMN_NAME LIKE 'xa_%' 
    OR COLUMN_NAME LIKE 'qc_%' 
    OR COLUMN_NAME LIKE 'kpi_%'
    OR COLUMN_NAME LIKE 'material_%')
ORDER BY COLUMN_NAME
LIMIT 20;
