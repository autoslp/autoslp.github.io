-- SQL Script để cập nhật bảng production_orders với các trường BIG DATA
-- Chạy script này để thêm tất cả các trường mới vào bảng hiện tại

-- ==== THÊM CÁC TRƯỜNG CHI TIẾT TỪNG CÔNG ĐOẠN ====

-- XẢ - Detailed tracking
ALTER TABLE production_orders 
ADD xa_start_time DATETIME COMMENT 'Thời gian bắt đầu XẢ',
ADD xa_end_time DATETIME COMMENT 'Thời gian kết thúc XẢ',
ADD xa_worker_name VARCHAR(100) COMMENT 'Tên thợ XẢ',
ADD xa_machine_name VARCHAR(50) COMMENT 'Tên máy XẢ',
ADD xa_input_quantity INT DEFAULT 0 COMMENT 'SL đầu vào XẢ',
ADD xa_output_quantity INT DEFAULT 0 COMMENT 'SL đầu ra XẢ',
ADD xa_good_quantity INT DEFAULT 0 COMMENT 'SL đạt XẢ',
ADD xa_ng_quantity INT DEFAULT 0 COMMENT 'SL NG XẢ',
ADD xa_ng_reason TEXT COMMENT 'Lý do NG XẢ',
ADD xa_efficiency DECIMAL(5,2) COMMENT 'Hiệu suất XẢ (%)',
ADD xa_note TEXT COMMENT 'Ghi chú XẢ',
ADD xa_status ENUM('waiting', 'in_progress', 'completed', 'paused') DEFAULT 'waiting' COMMENT 'Trạng thái XẢ';

-- XÉN - Detailed tracking
ALTER TABLE production_orders 
ADD COLUMN xen_start_time DATETIME COMMENT 'Thời gian bắt đầu XÉN',
ADD COLUMN xen_end_time DATETIME COMMENT 'Thời gian kết thúc XÉN',
ADD COLUMN xen_worker_name VARCHAR(100) COMMENT 'Tên thợ XÉN',
ADD COLUMN xen_machine_name VARCHAR(50) COMMENT 'Tên máy XÉN',
ADD COLUMN xen_input_quantity INT DEFAULT 0 COMMENT 'SL đầu vào XÉN',
ADD COLUMN xen_output_quantity INT DEFAULT 0 COMMENT 'SL đầu ra XÉN',
ADD COLUMN xen_good_quantity INT DEFAULT 0 COMMENT 'SL đạt XÉN',
ADD COLUMN xen_ng_quantity INT DEFAULT 0 COMMENT 'SL NG XÉN',
ADD COLUMN xen_ng_reason TEXT COMMENT 'Lý do NG XÉN',
ADD COLUMN xen_efficiency DECIMAL(5,2) COMMENT 'Hiệu suất XÉN (%)',
ADD COLUMN xen_note TEXT COMMENT 'Ghi chú XÉN',
ADD COLUMN xen_status ENUM('waiting', 'in_progress', 'completed', 'paused') DEFAULT 'waiting' COMMENT 'Trạng thái XÉN';

-- IN - Detailed tracking
ALTER TABLE production_orders 
ADD COLUMN in_start_time DATETIME COMMENT 'Thời gian bắt đầu IN',
ADD COLUMN in_end_time DATETIME COMMENT 'Thời gian kết thúc IN',
ADD COLUMN in_worker_name VARCHAR(100) COMMENT 'Tên thợ IN',
ADD COLUMN in_machine_name VARCHAR(50) COMMENT 'Tên máy IN',
ADD COLUMN in_input_quantity INT DEFAULT 0 COMMENT 'SL đầu vào IN',
ADD COLUMN in_output_quantity INT DEFAULT 0 COMMENT 'SL đầu ra IN',
ADD COLUMN in_good_quantity INT DEFAULT 0 COMMENT 'SL đạt IN',
ADD COLUMN in_ng_quantity INT DEFAULT 0 COMMENT 'SL NG IN',
ADD COLUMN in_ng_reason TEXT COMMENT 'Lý do NG IN',
ADD COLUMN in_efficiency DECIMAL(5,2) COMMENT 'Hiệu suất IN (%)',
ADD COLUMN in_note TEXT COMMENT 'Ghi chú IN',
ADD COLUMN in_status ENUM('waiting', 'in_progress', 'completed', 'paused') DEFAULT 'waiting' COMMENT 'Trạng thái IN',
ADD COLUMN in_color_setup_time INT DEFAULT 0 COMMENT 'Thời gian setup màu (phút)',
ADD COLUMN in_plates_count INT DEFAULT 0 COMMENT 'Số bản in';

-- BỒI - Detailed tracking
ALTER TABLE production_orders 
ADD COLUMN boi_start_time DATETIME COMMENT 'Thời gian bắt đầu BỒI',
ADD COLUMN boi_end_time DATETIME COMMENT 'Thời gian kết thúc BỒI',
ADD COLUMN boi_worker_name VARCHAR(100) COMMENT 'Tên thợ BỒI',
ADD COLUMN boi_machine_name VARCHAR(50) COMMENT 'Tên máy BỒI',
ADD COLUMN boi_input_quantity INT DEFAULT 0 COMMENT 'SL đầu vào BỒI',
ADD COLUMN boi_output_quantity INT DEFAULT 0 COMMENT 'SL đầu ra BỒI',
ADD COLUMN boi_good_quantity INT DEFAULT 0 COMMENT 'SL đạt BỒI',
ADD COLUMN boi_ng_quantity INT DEFAULT 0 COMMENT 'SL NG BỒI',
ADD COLUMN boi_ng_reason TEXT COMMENT 'Lý do NG BỒI',
ADD COLUMN boi_efficiency DECIMAL(5,2) COMMENT 'Hiệu suất BỒI (%)',
ADD COLUMN boi_note TEXT COMMENT 'Ghi chú BỒI',
ADD COLUMN boi_status ENUM('waiting', 'in_progress', 'completed', 'paused') DEFAULT 'waiting' COMMENT 'Trạng thái BỒI',
ADD COLUMN boi_dry_time INT DEFAULT 0 COMMENT 'Thời gian khô (phút)',
ADD COLUMN boi_temperature DECIMAL(5,2) COMMENT 'Nhiệt độ (°C)';

-- BẾ - Detailed tracking
ALTER TABLE production_orders 
ADD COLUMN be_start_time DATETIME COMMENT 'Thời gian bắt đầu BẾ',
ADD COLUMN be_end_time DATETIME COMMENT 'Thời gian kết thúc BẾ',
ADD COLUMN be_worker_name VARCHAR(100) COMMENT 'Tên thợ BẾ',
ADD COLUMN be_machine_name VARCHAR(50) COMMENT 'Tên máy BẾ',
ADD COLUMN be_input_quantity INT DEFAULT 0 COMMENT 'SL đầu vào BẾ',
ADD COLUMN be_output_quantity INT DEFAULT 0 COMMENT 'SL đầu ra BẾ',
ADD COLUMN be_good_quantity INT DEFAULT 0 COMMENT 'SL đạt BẾ',
ADD COLUMN be_ng_quantity INT DEFAULT 0 COMMENT 'SL NG BẾ',
ADD COLUMN be_ng_reason TEXT COMMENT 'Lý do NG BẾ',
ADD COLUMN be_efficiency DECIMAL(5,2) COMMENT 'Hiệu suất BẾ (%)',
ADD COLUMN be_note TEXT COMMENT 'Ghi chú BẾ',
ADD COLUMN be_status ENUM('waiting', 'in_progress', 'completed', 'paused') DEFAULT 'waiting' COMMENT 'Trạng thái BẾ',
ADD COLUMN be_setup_time INT DEFAULT 0 COMMENT 'Thời gian setup dao (phút)',
ADD COLUMN be_die_count INT DEFAULT 0 COMMENT 'Số dao bế sử dụng';

-- DÁN - Detailed tracking
ALTER TABLE production_orders 
ADD COLUMN dan_start_time DATETIME COMMENT 'Thời gian bắt đầu DÁN',
ADD COLUMN dan_end_time DATETIME COMMENT 'Thời gian kết thúc DÁN',
ADD COLUMN dan_worker_name VARCHAR(100) COMMENT 'Tên thợ DÁN',
ADD COLUMN dan_machine_name VARCHAR(50) COMMENT 'Tên máy DÁN',
ADD COLUMN dan_input_quantity INT DEFAULT 0 COMMENT 'SL đầu vào DÁN',
ADD COLUMN dan_output_quantity INT DEFAULT 0 COMMENT 'SL đầu ra DÁN',
ADD COLUMN dan_good_quantity INT DEFAULT 0 COMMENT 'SL đạt DÁN',
ADD COLUMN dan_ng_quantity INT DEFAULT 0 COMMENT 'SL NG DÁN',
ADD COLUMN dan_ng_reason TEXT COMMENT 'Lý do NG DÁN',
ADD COLUMN dan_efficiency DECIMAL(5,2) COMMENT 'Hiệu suất DÁN (%)',
ADD COLUMN dan_note TEXT COMMENT 'Ghi chú DÁN',
ADD COLUMN dan_status ENUM('waiting', 'in_progress', 'completed', 'paused') DEFAULT 'waiting' COMMENT 'Trạng thái DÁN',
ADD COLUMN dan_glue_usage DECIMAL(8,2) COMMENT 'Lượng keo sử dụng (kg)',
ADD COLUMN dan_temperature DECIMAL(5,2) COMMENT 'Nhiệt độ dán (°C)';

-- KHO - Detailed tracking
ALTER TABLE production_orders 
ADD COLUMN kho_start_time DATETIME COMMENT 'Thời gian bắt đầu KHO',
ADD COLUMN kho_end_time DATETIME COMMENT 'Thời gian kết thúc KHO',
ADD COLUMN kho_worker_name VARCHAR(100) COMMENT 'Tên thợ KHO',
ADD COLUMN kho_input_quantity INT DEFAULT 0 COMMENT 'SL đầu vào KHO',
ADD COLUMN kho_output_quantity INT DEFAULT 0 COMMENT 'SL đầu ra KHO',
ADD COLUMN kho_good_quantity INT DEFAULT 0 COMMENT 'SL đạt KHO',
ADD COLUMN kho_ng_quantity INT DEFAULT 0 COMMENT 'SL NG KHO',
ADD COLUMN kho_ng_reason TEXT COMMENT 'Lý do NG KHO',
ADD COLUMN kho_efficiency DECIMAL(5,2) COMMENT 'Hiệu suất KHO (%)',
ADD COLUMN kho_note TEXT COMMENT 'Ghi chú KHO',
ADD COLUMN kho_status ENUM('waiting', 'in_progress', 'completed', 'paused') DEFAULT 'waiting' COMMENT 'Trạng thái KHO',
ADD COLUMN kho_boxes_count INT DEFAULT 0 COMMENT 'Số thùng đóng',
ADD COLUMN kho_package_weight DECIMAL(8,2) COMMENT 'Trọng lượng đóng gói (kg)';

-- ==== QUẢN LÝ CHẤT LƯỢNG & KIỂM TRA ====

-- Quality Control
ALTER TABLE production_orders 
ADD COLUMN qc_inspector_name VARCHAR(100) COMMENT 'Tên người kiểm tra QC',
ADD COLUMN qc_check_time DATETIME COMMENT 'Thời gian kiểm tra QC',
ADD COLUMN qc_passed BOOLEAN DEFAULT FALSE COMMENT 'QC đạt/không đạt',
ADD COLUMN qc_notes TEXT COMMENT 'Ghi chú QC',
ADD COLUMN qc_defect_types TEXT COMMENT 'Loại lỗi phát hiện (JSON)',
ADD COLUMN qc_sample_size INT DEFAULT 0 COMMENT 'Kích thước mẫu kiểm tra',
ADD COLUMN qc_defect_count INT DEFAULT 0 COMMENT 'Số lỗi phát hiện',
ADD COLUMN qc_approval_status ENUM('pending', 'approved', 'rejected', 'conditional') DEFAULT 'pending' COMMENT 'Trạng thái duyệt QC';

-- Material Tracking
ALTER TABLE production_orders 
ADD COLUMN material_paper_lot VARCHAR(50) COMMENT 'Lot giấy sử dụng',
ADD COLUMN material_ink_lots TEXT COMMENT 'Lots mực sử dụng (JSON)',
ADD COLUMN material_glue_lot VARCHAR(50) COMMENT 'Lot keo sử dụng',
ADD COLUMN material_cost DECIMAL(10,2) DEFAULT 0 COMMENT 'Chi phí nguyên liệu',
ADD COLUMN material_waste_cost DECIMAL(10,2) DEFAULT 0 COMMENT 'Chi phí hao phí';

-- Production Planning & Scheduling
ALTER TABLE production_orders 
ADD COLUMN planned_start_date DATE COMMENT 'Ngày dự kiến bắt đầu',
ADD COLUMN planned_end_date DATE COMMENT 'Ngày dự kiến hoàn thành',
ADD COLUMN actual_start_date DATE COMMENT 'Ngày thực tế bắt đầu',
ADD COLUMN actual_end_date DATE COMMENT 'Ngày thực tế hoàn thành',
ADD COLUMN priority_level ENUM('Low', 'Normal', 'High', 'Critical', 'Emergency') DEFAULT 'Normal' COMMENT 'Mức độ ưu tiên',
ADD COLUMN rush_order BOOLEAN DEFAULT FALSE COMMENT 'Đơn hàng gấp';

-- Cost & Performance Analysis
ALTER TABLE production_orders 
ADD COLUMN total_labor_hours DECIMAL(8,2) DEFAULT 0 COMMENT 'Tổng giờ công',
ADD COLUMN total_machine_hours DECIMAL(8,2) DEFAULT 0 COMMENT 'Tổng giờ máy',
ADD COLUMN total_setup_time INT DEFAULT 0 COMMENT 'Tổng thời gian setup (phút)',
ADD COLUMN total_production_cost DECIMAL(12,2) DEFAULT 0 COMMENT 'Tổng chi phí sản xuất',
ADD COLUMN cost_per_unit DECIMAL(8,4) DEFAULT 0 COMMENT 'Chi phí/đơn vị',
ADD COLUMN productivity_rate DECIMAL(8,2) DEFAULT 0 COMMENT 'Tỷ lệ năng suất (sp/giờ)';

-- Environmental & Energy Tracking
ALTER TABLE production_orders 
ADD COLUMN energy_consumption DECIMAL(10,2) DEFAULT 0 COMMENT 'Tiêu thụ điện năng (kWh)',
ADD COLUMN water_usage DECIMAL(10,2) DEFAULT 0 COMMENT 'Sử dụng nước (lít)',
ADD COLUMN waste_generated DECIMAL(10,2) DEFAULT 0 COMMENT 'Chất thải phát sinh (kg)',
ADD COLUMN recycled_material DECIMAL(10,2) DEFAULT 0 COMMENT 'Nguyên liệu tái chế (kg)';

-- Customer & Sales Integration
ALTER TABLE production_orders 
ADD COLUMN sales_rep_name VARCHAR(100) COMMENT 'Tên nhân viên kinh doanh',
ADD COLUMN customer_po_date DATE COMMENT 'Ngày PO khách hàng',
ADD COLUMN customer_specifications TEXT COMMENT 'Yêu cầu kỹ thuật khách hàng',
ADD COLUMN packaging_requirements TEXT COMMENT 'Yêu cầu đóng gói',
ADD COLUMN shipping_method VARCHAR(50) COMMENT 'Phương thức vận chuyển',
ADD COLUMN delivery_address TEXT COMMENT 'Địa chỉ giao hàng';

-- Digital Integration & IoT
ALTER TABLE production_orders 
ADD COLUMN machine_data_logs TEXT COMMENT 'Logs dữ liệu máy móc (JSON)',
ADD COLUMN sensor_readings TEXT COMMENT 'Số liệu cảm biến (JSON)',
ADD COLUMN barcode_tracking VARCHAR(100) COMMENT 'Mã vạch theo dõi',
ADD COLUMN rfid_tags TEXT COMMENT 'RFID tags (JSON)',
ADD COLUMN digital_signatures TEXT COMMENT 'Chữ ký số (JSON)';

-- Maintenance & Equipment
ALTER TABLE production_orders 
ADD COLUMN equipment_maintenance_due DATE COMMENT 'Ngày bảo trì thiết bị',
ADD COLUMN last_calibration_date DATE COMMENT 'Ngày hiệu chuẩn cuối',
ADD COLUMN tool_wear_level DECIMAL(5,2) COMMENT 'Mức độ mài mòn dao cụ (%)',
ADD COLUMN preventive_maintenance BOOLEAN DEFAULT FALSE COMMENT 'Bảo trì phòng ngừa';

-- Regulatory & Compliance
ALTER TABLE production_orders 
ADD COLUMN regulatory_compliance BOOLEAN DEFAULT TRUE COMMENT 'Tuân thủ quy định',
ADD COLUMN certifications_required TEXT COMMENT 'Chứng nhận yêu cầu',
ADD COLUMN audit_trail TEXT COMMENT 'Dấu vết kiểm toán (JSON)',
ADD COLUMN document_versions TEXT COMMENT 'Phiên bản tài liệu (JSON)';

-- Analytics & Reporting
ALTER TABLE production_orders 
ADD COLUMN kpi_oee DECIMAL(5,2) COMMENT 'OEE - Overall Equipment Effectiveness (%)',
ADD COLUMN kpi_yield DECIMAL(5,2) COMMENT 'Tỷ lệ đạt (%)',
ADD COLUMN kpi_throughput DECIMAL(8,2) COMMENT 'Năng suất (sp/giờ)',
ADD COLUMN kpi_first_pass_yield DECIMAL(5,2) COMMENT 'Tỷ lệ đạt lần đầu (%)',
ADD COLUMN performance_score DECIMAL(5,2) COMMENT 'Điểm hiệu suất tổng thể';

-- Extended Workflow States
ALTER TABLE production_orders 
ADD COLUMN rework_required BOOLEAN DEFAULT FALSE COMMENT 'Cần làm lại',
ADD COLUMN rework_stage VARCHAR(10) COMMENT 'Stage cần làm lại',
ADD COLUMN rework_reason TEXT COMMENT 'Lý do làm lại',
ADD COLUMN rework_count INT DEFAULT 0 COMMENT 'Số lần làm lại',
ADD COLUMN hold_status BOOLEAN DEFAULT FALSE COMMENT 'Trạng thái tạm dừng',
ADD COLUMN hold_reason TEXT COMMENT 'Lý do tạm dừng',
ADD COLUMN expedite_status BOOLEAN DEFAULT FALSE COMMENT 'Trạng thái khẩn cấp';

-- Multi-shift Support
ALTER TABLE production_orders 
ADD COLUMN shift_handover_notes TEXT COMMENT 'Ghi chú bàn giao ca',
ADD COLUMN night_shift_issues TEXT COMMENT 'Vấn đề ca đêm',
ADD COLUMN weekend_production BOOLEAN DEFAULT FALSE COMMENT 'Sản xuất cuối tuần',
ADD COLUMN overtime_hours DECIMAL(6,2) DEFAULT 0 COMMENT 'Giờ làm thêm';

-- Advanced Quality Metrics
ALTER TABLE production_orders 
ADD COLUMN cpk_value DECIMAL(6,4) COMMENT 'Chỉ số Cpk',
ADD COLUMN sigma_level DECIMAL(4,2) COMMENT 'Mức sigma',
ADD COLUMN defect_rate_ppm INT DEFAULT 0 COMMENT 'Tỷ lệ lỗi (PPM)',
ADD COLUMN customer_complaints INT DEFAULT 0 COMMENT 'Khiếu nại khách hàng',
ADD COLUMN returns_quantity INT DEFAULT 0 COMMENT 'Số lượng trả hàng';

-- ==== THÊM CÁC INDEXES CHO HIỆU NĂNG ====

-- Big Data Indexes
ALTER TABLE production_orders 
ADD INDEX idx_xa_status (xa_status),
ADD INDEX idx_xen_status (xen_status),
ADD INDEX idx_in_status (in_status),
ADD INDEX idx_boi_status (boi_status),
ADD INDEX idx_be_status (be_status),
ADD INDEX idx_dan_status (dan_status),
ADD INDEX idx_kho_status (kho_status),
ADD INDEX idx_priority_level (priority_level),
ADD INDEX idx_qc_approval_status (qc_approval_status),
ADD INDEX idx_planned_start_date (planned_start_date),
ADD INDEX idx_planned_end_date (planned_end_date),
ADD INDEX idx_actual_start_date (actual_start_date),
ADD INDEX idx_actual_end_date (actual_end_date),
ADD INDEX idx_rush_order (rush_order),
ADD INDEX idx_hold_status (hold_status),
ADD INDEX idx_rework_required (rework_required),
ADD INDEX idx_material_paper_lot (material_paper_lot),
ADD INDEX idx_barcode_tracking (barcode_tracking),
ADD INDEX idx_sales_rep_name (sales_rep_name),
ADD INDEX idx_qc_inspector_name (qc_inspector_name);

-- Composite indexes for complex queries
ALTER TABLE production_orders 
ADD INDEX idx_stage_status_date (current_stage, status, production_date),
ADD INDEX idx_customer_priority_date (customer_code, priority_level, order_date),
ADD INDEX idx_workflow_progress (workflow_definition(50), current_stage_index, status),
ADD INDEX idx_efficiency_analysis (workflow_efficiency, total_good_quantity, total_ng_quantity),
ADD INDEX idx_cost_analysis (total_production_cost, cost_per_unit, productivity_rate);

-- ==== TẠO CÁC VIEWS PHÂN TÍCH BIG DATA ====

-- Drop existing views if they exist
DROP VIEW IF EXISTS stage_detail_analysis;
DROP VIEW IF EXISTS quality_analysis;
DROP VIEW IF EXISTS cost_performance_analysis;
DROP VIEW IF EXISTS realtime_progress_tracking;
DROP VIEW IF EXISTS machine_performance_stats;
DROP VIEW IF EXISTS worker_performance_stats;
DROP VIEW IF EXISTS comprehensive_dashboard;

-- View chi tiết từng công đoạn
CREATE VIEW stage_detail_analysis AS
SELECT 
    id,
    production_order,
    product_name,
    -- XẢ
    xa_status, xa_start_time, xa_end_time, xa_worker_name, xa_machine_name,
    xa_input_quantity, xa_good_quantity, xa_ng_quantity, xa_efficiency,
    -- XÉN  
    xen_status, xen_start_time, xen_end_time, xen_worker_name, xen_machine_name,
    xen_input_quantity, xen_good_quantity, xen_ng_quantity, xen_efficiency,
    -- IN
    in_status, in_start_time, in_end_time, in_worker_name, in_machine_name,
    in_input_quantity, in_good_quantity, in_ng_quantity, in_efficiency,
    -- BỒI
    boi_status, boi_start_time, boi_end_time, boi_worker_name, boi_machine_name,
    boi_input_quantity, boi_good_quantity, boi_ng_quantity, boi_efficiency,
    -- BẾ
    be_status, be_start_time, be_end_time, be_worker_name, be_machine_name,
    be_input_quantity, be_good_quantity, be_ng_quantity, be_efficiency,
    -- DÁN
    dan_status, dan_start_time, dan_end_time, dan_worker_name, dan_machine_name,
    dan_input_quantity, dan_good_quantity, dan_ng_quantity, dan_efficiency,
    -- KHO
    kho_status, kho_start_time, kho_end_time, kho_worker_name,
    kho_input_quantity, kho_good_quantity, kho_ng_quantity, kho_efficiency
FROM production_orders;

-- View phân tích chất lượng
CREATE VIEW quality_analysis AS
SELECT 
    id,
    production_order,
    product_name,
    customer_name,
    qc_inspector_name,
    qc_check_time,
    qc_passed,
    qc_approval_status,
    qc_sample_size,
    qc_defect_count,
    CASE 
        WHEN qc_sample_size > 0 THEN ROUND(qc_defect_count * 100.0 / qc_sample_size, 2)
        ELSE 0 
    END as defect_percentage,
    cpk_value,
    sigma_level,
    defect_rate_ppm,
    customer_complaints,
    returns_quantity,
    -- Tổng tỷ lệ đạt toàn workflow
    CASE 
        WHEN COALESCE(xa_input_quantity,0) + COALESCE(xen_input_quantity,0) + COALESCE(in_input_quantity,0) + COALESCE(boi_input_quantity,0) + COALESCE(be_input_quantity,0) + COALESCE(dan_input_quantity,0) + COALESCE(kho_input_quantity,0) > 0 THEN
            ROUND((COALESCE(xa_good_quantity,0) + COALESCE(xen_good_quantity,0) + COALESCE(in_good_quantity,0) + COALESCE(boi_good_quantity,0) + COALESCE(be_good_quantity,0) + COALESCE(dan_good_quantity,0) + COALESCE(kho_good_quantity,0)) * 100.0 / 
            (COALESCE(xa_input_quantity,0) + COALESCE(xen_input_quantity,0) + COALESCE(in_input_quantity,0) + COALESCE(boi_input_quantity,0) + COALESCE(be_input_quantity,0) + COALESCE(dan_input_quantity,0) + COALESCE(kho_input_quantity,0)), 2)
        ELSE 0 
    END as overall_yield_rate
FROM production_orders;

-- View phân tích chi phí và hiệu suất
CREATE VIEW cost_performance_analysis AS
SELECT 
    id,
    production_order,
    product_name,
    customer_name,
    order_quantity,
    total_production_cost,
    cost_per_unit,
    material_cost,
    material_waste_cost,
    total_labor_hours,
    total_machine_hours,
    productivity_rate,
    energy_consumption,
    kpi_oee,
    kpi_yield,
    kpi_throughput,
    performance_score,
    CASE 
        WHEN order_quantity > 0 THEN ROUND(total_production_cost / order_quantity, 4)
        ELSE 0 
    END as actual_cost_per_unit,
    CASE 
        WHEN total_labor_hours > 0 THEN ROUND(order_quantity / total_labor_hours, 2)
        ELSE 0 
    END as units_per_labor_hour
FROM production_orders;

-- View theo dõi tiến độ real-time
CREATE VIEW realtime_progress_tracking AS
SELECT 
    id,
    production_order,
    product_name,
    customer_name,
    priority_level,
    rush_order,
    planned_start_date,
    planned_end_date,
    actual_start_date,
    actual_end_date,
    current_stage,
    current_stage_index,
    workflow_definition,
    -- Tính % hoàn thành
    CASE 
        WHEN workflow_definition IS NOT NULL THEN
            ROUND((current_stage_index + 1) * 100.0 / (CHAR_LENGTH(workflow_definition) - CHAR_LENGTH(REPLACE(workflow_definition, ',', '')) + 1), 2)
        ELSE 0 
    END as completion_percentage,
    -- Tính độ trễ
    CASE 
        WHEN planned_end_date IS NOT NULL AND actual_end_date IS NOT NULL THEN 
            DATEDIFF(actual_end_date, planned_end_date)
        WHEN planned_end_date IS NOT NULL AND actual_end_date IS NULL AND CURDATE() > planned_end_date THEN
            DATEDIFF(CURDATE(), planned_end_date)
        ELSE 0
    END as delay_days,
    hold_status,
    hold_reason,
    rework_required,
    rework_count,
    expedite_status
FROM production_orders;

-- View thống kê máy móc chi tiết
CREATE VIEW machine_performance_stats AS
SELECT 
    stage_name,
    machine_name,
    COUNT(*) as total_jobs,
    SUM(input_qty) as total_input,
    SUM(good_qty) as total_good,
    SUM(ng_qty) as total_ng,
    AVG(efficiency) as avg_efficiency,
    SUM(labor_hours) as total_labor_hours,
    SUM(machine_hours) as total_machine_hours,
    CASE 
        WHEN SUM(input_qty) > 0 THEN ROUND(SUM(good_qty) * 100.0 / SUM(input_qty), 2)
        ELSE 0 
    END as overall_yield_rate
FROM (
    SELECT 'xa' as stage_name, xa_machine_name as machine_name, COALESCE(xa_input_quantity,0) as input_qty, COALESCE(xa_good_quantity,0) as good_qty, COALESCE(xa_ng_quantity,0) as ng_qty, COALESCE(xa_efficiency,0) as efficiency, 
           COALESCE(TIMESTAMPDIFF(HOUR, xa_start_time, xa_end_time),0) as labor_hours, COALESCE(TIMESTAMPDIFF(HOUR, xa_start_time, xa_end_time),0) as machine_hours FROM production_orders WHERE xa_machine_name IS NOT NULL
    UNION ALL
    SELECT 'xen' as stage_name, xen_machine_name as machine_name, COALESCE(xen_input_quantity,0) as input_qty, COALESCE(xen_good_quantity,0) as good_qty, COALESCE(xen_ng_quantity,0) as ng_qty, COALESCE(xen_efficiency,0) as efficiency,
           COALESCE(TIMESTAMPDIFF(HOUR, xen_start_time, xen_end_time),0) as labor_hours, COALESCE(TIMESTAMPDIFF(HOUR, xen_start_time, xen_end_time),0) as machine_hours FROM production_orders WHERE xen_machine_name IS NOT NULL
    UNION ALL
    SELECT 'in' as stage_name, in_machine_name as machine_name, COALESCE(in_input_quantity,0) as input_qty, COALESCE(in_good_quantity,0) as good_qty, COALESCE(in_ng_quantity,0) as ng_qty, COALESCE(in_efficiency,0) as efficiency,
           COALESCE(TIMESTAMPDIFF(HOUR, in_start_time, in_end_time),0) as labor_hours, COALESCE(TIMESTAMPDIFF(HOUR, in_start_time, in_end_time),0) as machine_hours FROM production_orders WHERE in_machine_name IS NOT NULL
    UNION ALL
    SELECT 'boi' as stage_name, boi_machine_name as machine_name, COALESCE(boi_input_quantity,0) as input_qty, COALESCE(boi_good_quantity,0) as good_qty, COALESCE(boi_ng_quantity,0) as ng_qty, COALESCE(boi_efficiency,0) as efficiency,
           COALESCE(TIMESTAMPDIFF(HOUR, boi_start_time, boi_end_time),0) as labor_hours, COALESCE(TIMESTAMPDIFF(HOUR, boi_start_time, boi_end_time),0) as machine_hours FROM production_orders WHERE boi_machine_name IS NOT NULL
    UNION ALL
    SELECT 'be' as stage_name, be_machine_name as machine_name, COALESCE(be_input_quantity,0) as input_qty, COALESCE(be_good_quantity,0) as good_qty, COALESCE(be_ng_quantity,0) as ng_qty, COALESCE(be_efficiency,0) as efficiency,
           COALESCE(TIMESTAMPDIFF(HOUR, be_start_time, be_end_time),0) as labor_hours, COALESCE(TIMESTAMPDIFF(HOUR, be_start_time, be_end_time),0) as machine_hours FROM production_orders WHERE be_machine_name IS NOT NULL
    UNION ALL
    SELECT 'dan' as stage_name, dan_machine_name as machine_name, COALESCE(dan_input_quantity,0) as input_qty, COALESCE(dan_good_quantity,0) as good_qty, COALESCE(dan_ng_quantity,0) as ng_qty, COALESCE(dan_efficiency,0) as efficiency,
           COALESCE(TIMESTAMPDIFF(HOUR, dan_start_time, dan_end_time),0) as labor_hours, COALESCE(TIMESTAMPDIFF(HOUR, dan_start_time, dan_end_time),0) as machine_hours FROM production_orders WHERE dan_machine_name IS NOT NULL
) machine_data
GROUP BY stage_name, machine_name;

-- View thống kê nhân viên
CREATE VIEW worker_performance_stats AS
SELECT 
    stage_name,
    worker_name,
    COUNT(*) as total_jobs,
    SUM(input_qty) as total_input,
    SUM(good_qty) as total_good,
    SUM(ng_qty) as total_ng,
    AVG(efficiency) as avg_efficiency,
    CASE 
        WHEN SUM(input_qty) > 0 THEN ROUND(SUM(good_qty) * 100.0 / SUM(input_qty), 2)
        ELSE 0 
    END as personal_yield_rate
FROM (
    SELECT 'xa' as stage_name, xa_worker_name as worker_name, COALESCE(xa_input_quantity,0) as input_qty, COALESCE(xa_good_quantity,0) as good_qty, COALESCE(xa_ng_quantity,0) as ng_qty, COALESCE(xa_efficiency,0) as efficiency FROM production_orders WHERE xa_worker_name IS NOT NULL
    UNION ALL
    SELECT 'xen' as stage_name, xen_worker_name as worker_name, COALESCE(xen_input_quantity,0) as input_qty, COALESCE(xen_good_quantity,0) as good_qty, COALESCE(xen_ng_quantity,0) as ng_qty, COALESCE(xen_efficiency,0) as efficiency FROM production_orders WHERE xen_worker_name IS NOT NULL
    UNION ALL
    SELECT 'in' as stage_name, in_worker_name as worker_name, COALESCE(in_input_quantity,0) as input_qty, COALESCE(in_good_quantity,0) as good_qty, COALESCE(in_ng_quantity,0) as ng_qty, COALESCE(in_efficiency,0) as efficiency FROM production_orders WHERE in_worker_name IS NOT NULL
    UNION ALL
    SELECT 'boi' as stage_name, boi_worker_name as worker_name, COALESCE(boi_input_quantity,0) as input_qty, COALESCE(boi_good_quantity,0) as good_qty, COALESCE(boi_ng_quantity,0) as ng_qty, COALESCE(boi_efficiency,0) as efficiency FROM production_orders WHERE boi_worker_name IS NOT NULL
    UNION ALL
    SELECT 'be' as stage_name, be_worker_name as worker_name, COALESCE(be_input_quantity,0) as input_qty, COALESCE(be_good_quantity,0) as good_qty, COALESCE(be_ng_quantity,0) as ng_qty, COALESCE(be_efficiency,0) as efficiency FROM production_orders WHERE be_worker_name IS NOT NULL
    UNION ALL
    SELECT 'dan' as stage_name, dan_worker_name as worker_name, COALESCE(dan_input_quantity,0) as input_qty, COALESCE(dan_good_quantity,0) as good_qty, COALESCE(dan_ng_quantity,0) as ng_qty, COALESCE(dan_efficiency,0) as efficiency FROM production_orders WHERE dan_worker_name IS NOT NULL
    UNION ALL
    SELECT 'kho' as stage_name, kho_worker_name as worker_name, COALESCE(kho_input_quantity,0) as input_qty, COALESCE(kho_good_quantity,0) as good_qty, COALESCE(kho_ng_quantity,0) as ng_qty, COALESCE(kho_efficiency,0) as efficiency FROM production_orders WHERE kho_worker_name IS NOT NULL
) worker_data
GROUP BY stage_name, worker_name;

-- View dashboard tổng hợp
CREATE VIEW comprehensive_dashboard AS
SELECT 
    -- Thông tin cơ bản
    COUNT(*) as total_orders,
    SUM(order_quantity) as total_planned_quantity,
    SUM(COALESCE(total_good_quantity,0)) as total_actual_good,
    SUM(COALESCE(total_ng_quantity,0)) as total_actual_ng,
    
    -- Thống kê trạng thái
    COUNT(CASE WHEN status = 'Chờ triển khai' THEN 1 END) as pending_orders,
    COUNT(CASE WHEN status = 'Đang sản xuất' THEN 1 END) as in_progress_orders,
    COUNT(CASE WHEN status = 'Hoàn thành' THEN 1 END) as completed_orders,
    COUNT(CASE WHEN rush_order = TRUE THEN 1 END) as rush_orders,
    COUNT(CASE WHEN hold_status = TRUE THEN 1 END) as hold_orders,
    COUNT(CASE WHEN rework_required = TRUE THEN 1 END) as rework_orders,
    
    -- Thống kê chất lượng
    AVG(CASE WHEN qc_passed = TRUE THEN 1.0 ELSE 0.0 END) * 100 as qc_pass_rate,
    AVG(COALESCE(kpi_yield,0)) as avg_yield,
    AVG(COALESCE(kpi_oee,0)) as avg_oee,
    SUM(COALESCE(customer_complaints,0)) as total_complaints,
    SUM(COALESCE(returns_quantity,0)) as total_returns,
    
    -- Thống kê chi phí
    SUM(COALESCE(total_production_cost,0)) as total_cost,
    AVG(COALESCE(cost_per_unit,0)) as avg_cost_per_unit,
    SUM(COALESCE(material_cost,0)) as total_material_cost,
    SUM(COALESCE(material_waste_cost,0)) as total_waste_cost,
    
    -- Thống kê môi trường
    SUM(COALESCE(energy_consumption,0)) as total_energy,
    SUM(COALESCE(water_usage,0)) as total_water,
    SUM(COALESCE(waste_generated,0)) as total_waste,
    SUM(COALESCE(recycled_material,0)) as total_recycled,
    
    -- Thống kê thời gian
    AVG(COALESCE(total_labor_hours,0)) as avg_labor_hours,
    AVG(COALESCE(total_machine_hours,0)) as avg_machine_hours,
    SUM(COALESCE(overtime_hours,0)) as total_overtime
FROM production_orders;

-- ==== HIỂN THỊ KẾT QUẢ ====

SELECT 'Đã cập nhật thành công bảng production_orders với BIG DATA - hơn 150+ trường mới!' as message;

-- Hiển thị số lượng columns mới
SELECT 
    COUNT(*) as total_columns,
    'Tổng số cột sau khi cập nhật' as description
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_NAME = 'production_orders' 
  AND TABLE_SCHEMA = DATABASE();

-- Hiển thị các trường mới đã thêm
SELECT 
    COLUMN_NAME,
    DATA_TYPE,
    COLUMN_COMMENT
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_NAME = 'production_orders' 
  AND TABLE_SCHEMA = DATABASE()
  AND COLUMN_NAME LIKE '%_start_time%' 
   OR COLUMN_NAME LIKE '%_efficiency%'
   OR COLUMN_NAME LIKE 'qc_%'
   OR COLUMN_NAME LIKE 'kpi_%'
   OR COLUMN_NAME LIKE 'material_%'
ORDER BY COLUMN_NAME;

SELECT 'Script hoàn thành! Bảng production_orders đã được mở rộng thành BIG DATA tổng hợp.' as final_message;
