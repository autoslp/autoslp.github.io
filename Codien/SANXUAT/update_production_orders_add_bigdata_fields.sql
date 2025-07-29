-- ==== SQL Script để cập nhật bảng production_orders với BIG DATA ====
-- Chạy từng lệnh ALTER TABLE riêng biệt cho MySQL

-- XẢ - Detailed tracking
ALTER TABLE production_orders ADD xa_start_time DATETIME COMMENT 'Thời gian bắt đầu XẢ';
ALTER TABLE production_orders ADD xa_end_time DATETIME COMMENT 'Thời gian kết thúc XẢ';
ALTER TABLE production_orders ADD xa_worker_name VARCHAR(100) COMMENT 'Tên thợ XẢ';
ALTER TABLE production_orders ADD xa_machine_name VARCHAR(50) COMMENT 'Tên máy XẢ';
ALTER TABLE production_orders ADD xa_input_quantity INT DEFAULT 0 COMMENT 'SL đầu vào XẢ';
ALTER TABLE production_orders ADD xa_output_quantity INT DEFAULT 0 COMMENT 'SL đầu ra XẢ';
ALTER TABLE production_orders ADD xa_good_quantity INT DEFAULT 0 COMMENT 'SL đạt XẢ';
ALTER TABLE production_orders ADD xa_ng_quantity INT DEFAULT 0 COMMENT 'SL NG XẢ';
ALTER TABLE production_orders ADD xa_ng_reason TEXT COMMENT 'Lý do NG XẢ';
ALTER TABLE production_orders ADD xa_efficiency DECIMAL(5,2) COMMENT 'Hiệu suất XẢ (%)';
ALTER TABLE production_orders ADD xa_note TEXT COMMENT 'Ghi chú XẢ';
ALTER TABLE production_orders ADD xa_status ENUM('waiting', 'in_progress', 'completed', 'paused') DEFAULT 'waiting' COMMENT 'Trạng thái XẢ';

-- XÉN - Detailed tracking
ALTER TABLE production_orders ADD xen_start_time DATETIME COMMENT 'Thời gian bắt đầu XÉN';
ALTER TABLE production_orders ADD xen_end_time DATETIME COMMENT 'Thời gian kết thúc XÉN';
ALTER TABLE production_orders ADD xen_worker_name VARCHAR(100) COMMENT 'Tên thợ XÉN';
ALTER TABLE production_orders ADD xen_machine_name VARCHAR(50) COMMENT 'Tên máy XÉN';
ALTER TABLE production_orders ADD xen_input_quantity INT DEFAULT 0 COMMENT 'SL đầu vào XÉN';
ALTER TABLE production_orders ADD xen_output_quantity INT DEFAULT 0 COMMENT 'SL đầu ra XÉN';
ALTER TABLE production_orders ADD xen_good_quantity INT DEFAULT 0 COMMENT 'SL đạt XÉN';
ALTER TABLE production_orders ADD xen_ng_quantity INT DEFAULT 0 COMMENT 'SL NG XÉN';
ALTER TABLE production_orders ADD xen_ng_reason TEXT COMMENT 'Lý do NG XÉN';
ALTER TABLE production_orders ADD xen_efficiency DECIMAL(5,2) COMMENT 'Hiệu suất XÉN (%)';
ALTER TABLE production_orders ADD xen_note TEXT COMMENT 'Ghi chú XÉN';
ALTER TABLE production_orders ADD xen_status ENUM('waiting', 'in_progress', 'completed', 'paused') DEFAULT 'waiting' COMMENT 'Trạng thái XÉN';

-- IN - Detailed tracking
ALTER TABLE production_orders ADD in_start_time DATETIME COMMENT 'Thời gian bắt đầu IN';
ALTER TABLE production_orders ADD in_end_time DATETIME COMMENT 'Thời gian kết thúc IN';
ALTER TABLE production_orders ADD in_worker_name VARCHAR(100) COMMENT 'Tên thợ IN';
ALTER TABLE production_orders ADD in_machine_name VARCHAR(50) COMMENT 'Tên máy IN';
ALTER TABLE production_orders ADD in_input_quantity INT DEFAULT 0 COMMENT 'SL đầu vào IN';
ALTER TABLE production_orders ADD in_output_quantity INT DEFAULT 0 COMMENT 'SL đầu ra IN';
ALTER TABLE production_orders ADD in_good_quantity INT DEFAULT 0 COMMENT 'SL đạt IN';
ALTER TABLE production_orders ADD in_ng_quantity INT DEFAULT 0 COMMENT 'SL NG IN';
ALTER TABLE production_orders ADD in_ng_reason TEXT COMMENT 'Lý do NG IN';
ALTER TABLE production_orders ADD in_efficiency DECIMAL(5,2) COMMENT 'Hiệu suất IN (%)';
ALTER TABLE production_orders ADD in_note TEXT COMMENT 'Ghi chú IN';
ALTER TABLE production_orders ADD in_status ENUM('waiting', 'in_progress', 'completed', 'paused') DEFAULT 'waiting' COMMENT 'Trạng thái IN';
ALTER TABLE production_orders ADD in_color_setup_time INT DEFAULT 0 COMMENT 'Thời gian setup màu (phút)';
ALTER TABLE production_orders ADD in_plates_count INT DEFAULT 0 COMMENT 'Số bản in';

-- BỒI - Detailed tracking
ALTER TABLE production_orders ADD boi_start_time DATETIME COMMENT 'Thời gian bắt đầu BỒI';
ALTER TABLE production_orders ADD boi_end_time DATETIME COMMENT 'Thời gian kết thúc BỒI';
ALTER TABLE production_orders ADD boi_worker_name VARCHAR(100) COMMENT 'Tên thợ BỒI';
ALTER TABLE production_orders ADD boi_machine_name VARCHAR(50) COMMENT 'Tên máy BỒI';
ALTER TABLE production_orders ADD boi_input_quantity INT DEFAULT 0 COMMENT 'SL đầu vào BỒI';
ALTER TABLE production_orders ADD boi_output_quantity INT DEFAULT 0 COMMENT 'SL đầu ra BỒI';
ALTER TABLE production_orders ADD boi_good_quantity INT DEFAULT 0 COMMENT 'SL đạt BỒI';
ALTER TABLE production_orders ADD boi_ng_quantity INT DEFAULT 0 COMMENT 'SL NG BỒI';
ALTER TABLE production_orders ADD boi_ng_reason TEXT COMMENT 'Lý do NG BỒI';
ALTER TABLE production_orders ADD boi_efficiency DECIMAL(5,2) COMMENT 'Hiệu suất BỒI (%)';
ALTER TABLE production_orders ADD boi_note TEXT COMMENT 'Ghi chú BỒI';
ALTER TABLE production_orders ADD boi_status ENUM('waiting', 'in_progress', 'completed', 'paused') DEFAULT 'waiting' COMMENT 'Trạng thái BỒI';
ALTER TABLE production_orders ADD boi_dry_time INT DEFAULT 0 COMMENT 'Thời gian khô (phút)';
ALTER TABLE production_orders ADD boi_temperature DECIMAL(5,2) COMMENT 'Nhiệt độ (°C)';

-- BẾ - Detailed tracking
ALTER TABLE production_orders ADD be_start_time DATETIME COMMENT 'Thời gian bắt đầu BẾ';
ALTER TABLE production_orders ADD be_end_time DATETIME COMMENT 'Thời gian kết thúc BẾ';
ALTER TABLE production_orders ADD be_worker_name VARCHAR(100) COMMENT 'Tên thợ BẾ';
ALTER TABLE production_orders ADD be_machine_name VARCHAR(50) COMMENT 'Tên máy BẾ';
ALTER TABLE production_orders ADD be_input_quantity INT DEFAULT 0 COMMENT 'SL đầu vào BẾ';
ALTER TABLE production_orders ADD be_output_quantity INT DEFAULT 0 COMMENT 'SL đầu ra BẾ';
ALTER TABLE production_orders ADD be_good_quantity INT DEFAULT 0 COMMENT 'SL đạt BẾ';
ALTER TABLE production_orders ADD be_ng_quantity INT DEFAULT 0 COMMENT 'SL NG BẾ';
ALTER TABLE production_orders ADD be_ng_reason TEXT COMMENT 'Lý do NG BẾ';
ALTER TABLE production_orders ADD be_efficiency DECIMAL(5,2) COMMENT 'Hiệu suất BẾ (%)';
ALTER TABLE production_orders ADD be_note TEXT COMMENT 'Ghi chú BẾ';
ALTER TABLE production_orders ADD be_status ENUM('waiting', 'in_progress', 'completed', 'paused') DEFAULT 'waiting' COMMENT 'Trạng thái BẾ';
ALTER TABLE production_orders ADD be_setup_time INT DEFAULT 0 COMMENT 'Thời gian setup dao (phút)';
ALTER TABLE production_orders ADD be_die_count INT DEFAULT 0 COMMENT 'Số dao bế sử dụng';

-- DÁN - Detailed tracking
ALTER TABLE production_orders ADD dan_start_time DATETIME COMMENT 'Thời gian bắt đầu DÁN';
ALTER TABLE production_orders ADD dan_end_time DATETIME COMMENT 'Thời gian kết thúc DÁN';
ALTER TABLE production_orders ADD dan_worker_name VARCHAR(100) COMMENT 'Tên thợ DÁN';
ALTER TABLE production_orders ADD dan_machine_name VARCHAR(50) COMMENT 'Tên máy DÁN';
ALTER TABLE production_orders ADD dan_input_quantity INT DEFAULT 0 COMMENT 'SL đầu vào DÁN';
ALTER TABLE production_orders ADD dan_output_quantity INT DEFAULT 0 COMMENT 'SL đầu ra DÁN';
ALTER TABLE production_orders ADD dan_good_quantity INT DEFAULT 0 COMMENT 'SL đạt DÁN';
ALTER TABLE production_orders ADD dan_ng_quantity INT DEFAULT 0 COMMENT 'SL NG DÁN';
ALTER TABLE production_orders ADD dan_ng_reason TEXT COMMENT 'Lý do NG DÁN';
ALTER TABLE production_orders ADD dan_efficiency DECIMAL(5,2) COMMENT 'Hiệu suất DÁN (%)';
ALTER TABLE production_orders ADD dan_note TEXT COMMENT 'Ghi chú DÁN';
ALTER TABLE production_orders ADD dan_status ENUM('waiting', 'in_progress', 'completed', 'paused') DEFAULT 'waiting' COMMENT 'Trạng thái DÁN';
ALTER TABLE production_orders ADD dan_glue_usage DECIMAL(8,2) COMMENT 'Lượng keo sử dụng (kg)';
ALTER TABLE production_orders ADD dan_temperature DECIMAL(5,2) COMMENT 'Nhiệt độ dán (°C)';

-- KHO - Detailed tracking
ALTER TABLE production_orders ADD kho_start_time DATETIME COMMENT 'Thời gian bắt đầu KHO';
ALTER TABLE production_orders ADD kho_end_time DATETIME COMMENT 'Thời gian kết thúc KHO';
ALTER TABLE production_orders ADD kho_worker_name VARCHAR(100) COMMENT 'Tên thợ KHO';
ALTER TABLE production_orders ADD kho_input_quantity INT DEFAULT 0 COMMENT 'SL đầu vào KHO';
ALTER TABLE production_orders ADD kho_output_quantity INT DEFAULT 0 COMMENT 'SL đầu ra KHO';
ALTER TABLE production_orders ADD kho_good_quantity INT DEFAULT 0 COMMENT 'SL đạt KHO';
ALTER TABLE production_orders ADD kho_ng_quantity INT DEFAULT 0 COMMENT 'SL NG KHO';
ALTER TABLE production_orders ADD kho_ng_reason TEXT COMMENT 'Lý do NG KHO';
ALTER TABLE production_orders ADD kho_efficiency DECIMAL(5,2) COMMENT 'Hiệu suất KHO (%)';
ALTER TABLE production_orders ADD kho_note TEXT COMMENT 'Ghi chú KHO';
ALTER TABLE production_orders ADD kho_status ENUM('waiting', 'in_progress', 'completed', 'paused') DEFAULT 'waiting' COMMENT 'Trạng thái KHO';
ALTER TABLE production_orders ADD kho_boxes_count INT DEFAULT 0 COMMENT 'Số thùng đóng';
ALTER TABLE production_orders ADD kho_package_weight DECIMAL(8,2) COMMENT 'Trọng lượng đóng gói (kg)';

-- Quality Control
ALTER TABLE production_orders ADD qc_inspector_name VARCHAR(100) COMMENT 'Tên người kiểm tra QC';
ALTER TABLE production_orders ADD qc_check_time DATETIME COMMENT 'Thời gian kiểm tra QC';
ALTER TABLE production_orders ADD qc_passed BOOLEAN DEFAULT FALSE COMMENT 'QC đạt/không đạt';
ALTER TABLE production_orders ADD qc_notes TEXT COMMENT 'Ghi chú QC';
ALTER TABLE production_orders ADD qc_defect_types TEXT COMMENT 'Loại lỗi phát hiện (JSON)';
ALTER TABLE production_orders ADD qc_sample_size INT DEFAULT 0 COMMENT 'Kích thước mẫu kiểm tra';
ALTER TABLE production_orders ADD qc_defect_count INT DEFAULT 0 COMMENT 'Số lỗi phát hiện';
ALTER TABLE production_orders ADD qc_approval_status ENUM('pending', 'approved', 'rejected', 'conditional') DEFAULT 'pending' COMMENT 'Trạng thái duyệt QC';

-- Material Tracking
ALTER TABLE production_orders ADD material_paper_lot VARCHAR(50) COMMENT 'Lot giấy sử dụng';
ALTER TABLE production_orders ADD material_ink_lots TEXT COMMENT 'Lots mực sử dụng (JSON)';
ALTER TABLE production_orders ADD material_glue_lot VARCHAR(50) COMMENT 'Lot keo sử dụng';
ALTER TABLE production_orders ADD material_cost DECIMAL(10,2) DEFAULT 0 COMMENT 'Chi phí nguyên liệu';
ALTER TABLE production_orders ADD material_waste_cost DECIMAL(10,2) DEFAULT 0 COMMENT 'Chi phí hao phí';

-- Production Planning & Scheduling
ALTER TABLE production_orders ADD planned_start_date DATE COMMENT 'Ngày dự kiến bắt đầu';
ALTER TABLE production_orders ADD planned_end_date DATE COMMENT 'Ngày dự kiến hoàn thành';
ALTER TABLE production_orders ADD actual_start_date DATE COMMENT 'Ngày thực tế bắt đầu';
ALTER TABLE production_orders ADD actual_end_date DATE COMMENT 'Ngày thực tế hoàn thành';
ALTER TABLE production_orders ADD priority_level ENUM('Low', 'Normal', 'High', 'Critical', 'Emergency') DEFAULT 'Normal' COMMENT 'Mức độ ưu tiên';
ALTER TABLE production_orders ADD rush_order BOOLEAN DEFAULT FALSE COMMENT 'Đơn hàng gấp';

-- Cost & Performance Analysis
ALTER TABLE production_orders ADD total_labor_hours DECIMAL(8,2) DEFAULT 0 COMMENT 'Tổng giờ công';
ALTER TABLE production_orders ADD total_machine_hours DECIMAL(8,2) DEFAULT 0 COMMENT 'Tổng giờ máy';
ALTER TABLE production_orders ADD total_setup_time INT DEFAULT 0 COMMENT 'Tổng thời gian setup (phút)';
ALTER TABLE production_orders ADD total_production_cost DECIMAL(12,2) DEFAULT 0 COMMENT 'Tổng chi phí sản xuất';
ALTER TABLE production_orders ADD cost_per_unit DECIMAL(8,4) DEFAULT 0 COMMENT 'Chi phí/đơn vị';
ALTER TABLE production_orders ADD productivity_rate DECIMAL(8,2) DEFAULT 0 COMMENT 'Tỷ lệ năng suất (sp/giờ)';

-- Environmental & Energy Tracking
ALTER TABLE production_orders ADD energy_consumption DECIMAL(10,2) DEFAULT 0 COMMENT 'Tiêu thụ điện năng (kWh)';
ALTER TABLE production_orders ADD water_usage DECIMAL(10,2) DEFAULT 0 COMMENT 'Sử dụng nước (lít)';
ALTER TABLE production_orders ADD waste_generated DECIMAL(10,2) DEFAULT 0 COMMENT 'Chất thải phát sinh (kg)';
ALTER TABLE production_orders ADD recycled_material DECIMAL(10,2) DEFAULT 0 COMMENT 'Nguyên liệu tái chế (kg)';

-- Customer & Sales Integration
ALTER TABLE production_orders ADD sales_rep_name VARCHAR(100) COMMENT 'Tên nhân viên kinh doanh';
ALTER TABLE production_orders ADD customer_po_date DATE COMMENT 'Ngày PO khách hàng';
ALTER TABLE production_orders ADD customer_specifications TEXT COMMENT 'Yêu cầu kỹ thuật khách hàng';
ALTER TABLE production_orders ADD packaging_requirements TEXT COMMENT 'Yêu cầu đóng gói';
ALTER TABLE production_orders ADD shipping_method VARCHAR(50) COMMENT 'Phương thức vận chuyển';
ALTER TABLE production_orders ADD delivery_address TEXT COMMENT 'Địa chỉ giao hàng';

-- Digital Integration & IoT
ALTER TABLE production_orders ADD machine_data_logs TEXT COMMENT 'Logs dữ liệu máy móc (JSON)';
ALTER TABLE production_orders ADD sensor_readings TEXT COMMENT 'Số liệu cảm biến (JSON)';
ALTER TABLE production_orders ADD barcode_tracking VARCHAR(100) COMMENT 'Mã vạch theo dõi';
ALTER TABLE production_orders ADD rfid_tags TEXT COMMENT 'RFID tags (JSON)';
ALTER TABLE production_orders ADD digital_signatures TEXT COMMENT 'Chữ ký số (JSON)';

-- Maintenance & Equipment
ALTER TABLE production_orders ADD equipment_maintenance_due DATE COMMENT 'Ngày bảo trì thiết bị';
ALTER TABLE production_orders ADD last_calibration_date DATE COMMENT 'Ngày hiệu chuẩn cuối';
ALTER TABLE production_orders ADD tool_wear_level DECIMAL(5,2) COMMENT 'Mức độ mài mòn dao cụ (%)';
ALTER TABLE production_orders ADD preventive_maintenance BOOLEAN DEFAULT FALSE COMMENT 'Bảo trì phòng ngừa';

-- Regulatory & Compliance
ALTER TABLE production_orders ADD regulatory_compliance BOOLEAN DEFAULT TRUE COMMENT 'Tuân thủ quy định';
ALTER TABLE production_orders ADD certifications_required TEXT COMMENT 'Chứng nhận yêu cầu';
ALTER TABLE production_orders ADD audit_trail TEXT COMMENT 'Dấu vết kiểm toán (JSON)';
ALTER TABLE production_orders ADD document_versions TEXT COMMENT 'Phiên bản tài liệu (JSON)';

-- Analytics & Reporting
ALTER TABLE production_orders ADD kpi_oee DECIMAL(5,2) COMMENT 'OEE - Overall Equipment Effectiveness (%)';
ALTER TABLE production_orders ADD kpi_yield DECIMAL(5,2) COMMENT 'Tỷ lệ đạt (%)';
ALTER TABLE production_orders ADD kpi_throughput DECIMAL(8,2) COMMENT 'Năng suất (sp/giờ)';
ALTER TABLE production_orders ADD kpi_first_pass_yield DECIMAL(5,2) COMMENT 'Tỷ lệ đạt lần đầu (%)';
ALTER TABLE production_orders ADD performance_score DECIMAL(5,2) COMMENT 'Điểm hiệu suất tổng thể';

-- Extended Workflow States
ALTER TABLE production_orders ADD rework_required BOOLEAN DEFAULT FALSE COMMENT 'Cần làm lại';
ALTER TABLE production_orders ADD rework_stage VARCHAR(10) COMMENT 'Stage cần làm lại';
ALTER TABLE production_orders ADD rework_reason TEXT COMMENT 'Lý do làm lại';
ALTER TABLE production_orders ADD rework_count INT DEFAULT 0 COMMENT 'Số lần làm lại';
ALTER TABLE production_orders ADD hold_status BOOLEAN DEFAULT FALSE COMMENT 'Trạng thái tạm dừng';
ALTER TABLE production_orders ADD hold_reason TEXT COMMENT 'Lý do tạm dừng';
ALTER TABLE production_orders ADD expedite_status BOOLEAN DEFAULT FALSE COMMENT 'Trạng thái khẩn cấp';

-- Multi-shift Support
ALTER TABLE production_orders ADD shift_handover_notes TEXT COMMENT 'Ghi chú bàn giao ca';
ALTER TABLE production_orders ADD night_shift_issues TEXT COMMENT 'Vấn đề ca đêm';
ALTER TABLE production_orders ADD weekend_production BOOLEAN DEFAULT FALSE COMMENT 'Sản xuất cuối tuần';
ALTER TABLE production_orders ADD overtime_hours DECIMAL(6,2) DEFAULT 0 COMMENT 'Giờ làm thêm';

-- Advanced Quality Metrics
ALTER TABLE production_orders ADD cpk_value DECIMAL(6,4) COMMENT 'Chỉ số Cpk';
ALTER TABLE production_orders ADD sigma_level DECIMAL(4,2) COMMENT 'Mức sigma';
ALTER TABLE production_orders ADD defect_rate_ppm INT DEFAULT 0 COMMENT 'Tỷ lệ lỗi (PPM)';
ALTER TABLE production_orders ADD customer_complaints INT DEFAULT 0 COMMENT 'Khiếu nại khách hàng';
ALTER TABLE production_orders ADD returns_quantity INT DEFAULT 0 COMMENT 'Số lượng trả hàng';

-- Thêm Indexes cho hiệu năng
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
ALTER TABLE production_orders ADD INDEX idx_material_paper_lot (material_paper_lot);
ALTER TABLE production_orders ADD INDEX idx_barcode_tracking (barcode_tracking);
ALTER TABLE production_orders ADD INDEX idx_sales_rep_name (sales_rep_name);
ALTER TABLE production_orders ADD INDEX idx_qc_inspector_name (qc_inspector_name);

-- Composite indexes cho truy vấn phức tạp
ALTER TABLE production_orders ADD INDEX idx_stage_status_date (current_stage, status, production_date);
ALTER TABLE production_orders ADD INDEX idx_customer_priority_date (customer_code, priority_level, order_date);
ALTER TABLE production_orders ADD INDEX idx_efficiency_analysis (workflow_efficiency, total_good_quantity, total_ng_quantity);

-- Hiển thị kết quả
SELECT 'Hoàn thành cập nhật bảng production_orders với hơn 150+ trường BIG DATA!' as message;

-- Hiển thị số lượng columns mới
SELECT 
    COUNT(*) as total_columns,
    'Tổng số cột sau khi cập nhật' as description
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_NAME = 'production_orders' 
  AND TABLE_SCHEMA = DATABASE();
