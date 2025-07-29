-- =====================================================
-- MACHINE MANAGEMENT SYSTEM DATABASE SETUP
-- Tạo database cho hệ thống quản lý máy móc
-- =====================================================

-- Tạo database (nếu chưa có)
CREATE DATABASE IF NOT EXISTS autoslp 
CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE autoslp;

-- =====================================================
-- 1. BẢNG LOẠI MÁY MÓC (machine_types)
-- =====================================================
CREATE TABLE machine_types (
    id INT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(20) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    description TEXT NULL,
    is_active TINYINT(1) DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_machine_type_code (code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- 2. BẢNG KHU VỰC (machine_areas)
-- =====================================================
CREATE TABLE machine_areas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(20) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    description TEXT NULL,
    is_active TINYINT(1) DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_machine_area_code (code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- 3. BẢNG THƯƠNG HIỆU (machine_brands)
-- =====================================================
CREATE TABLE machine_brands (
    id INT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(20) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    country VARCHAR(50) NULL,
    logo_url VARCHAR(255) NULL,
    website VARCHAR(255) NULL,
    description TEXT NULL,
    is_active TINYINT(1) DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_machine_brand_code (code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- 4. BẢNG VỊ TRÍ CỤ THỂ (machine_locations)
-- =====================================================
CREATE TABLE machine_locations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    area_id INT NOT NULL,
    code VARCHAR(20) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    description TEXT NULL,
    is_active TINYINT(1) DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_machine_location_code (code),
    INDEX idx_machine_location_area (area_id),
    FOREIGN KEY (area_id) REFERENCES machine_areas(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- 5. BẢNG NGƯỜI THẦU/KỸ THUẬT VIÊN (machine_contractors)
-- =====================================================
CREATE TABLE machine_contractors (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NULL,
    license VARCHAR(100) NULL COMMENT 'Số giấy phép hành nghề',
    address TEXT NULL,
    rating DECIMAL(2,1) DEFAULT 0.0 COMMENT 'Đánh giá từ 0.0 đến 5.0',
    experience VARCHAR(50) NULL COMMENT 'Số năm kinh nghiệm',
    specialties JSON NULL COMMENT 'Chuyên môn (cutting, welding, electrical, etc.)',
    is_active TINYINT(1) DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_contractor_active (is_active),
    INDEX idx_contractor_rating (rating)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- 6. BẢNG MÁY MÓC CHÍNH (machines)
-- =====================================================
CREATE TABLE machines (
    id INT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE COMMENT 'Mã máy móc',
    type VARCHAR(50) NOT NULL COMMENT 'Loại máy: cutting, drilling, welding, milling, lathe, grinder, press, conveyor',
    area VARCHAR(100) NOT NULL COMMENT 'Khu vực đặt máy',
    location VARCHAR(255) NOT NULL COMMENT 'Vị trí cụ thể',
    power DECIMAL(8,2) NULL COMMENT 'Công suất (kW)',
    brand VARCHAR(100) NULL COMMENT 'Thương hiệu',
    model VARCHAR(100) NULL COMMENT 'Model máy',
    serial VARCHAR(100) NULL COMMENT 'Số serial',
    install_date DATE NULL COMMENT 'Ngày lắp đặt',
    warranty_date DATE NULL COMMENT 'Ngày hết bảo hành',
    status ENUM('excellent', 'good', 'maintenance', 'repair', 'broken') DEFAULT 'good',
    last_maintenance DATE NULL COMMENT 'Bảo dưỡng lần cuối',
    next_maintenance DATE NULL COMMENT 'Bảo dưỡng tiếp theo',
    maintenance_interval INT DEFAULT 90 COMMENT 'Chu kỳ bảo dưỡng (ngày)',
    notes TEXT NULL COMMENT 'Ghi chú',
    avatar_url TEXT NULL COMMENT 'Ảnh đại diện máy',
    images_urls TEXT NULL COMMENT 'Danh sách ảnh khác',
    documents_urls TEXT NULL COMMENT 'Tài liệu kỹ thuật',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_machine_code (code),
    INDEX idx_machine_type (type),
    INDEX idx_machine_area (area),
    INDEX idx_machine_status (status),
    INDEX idx_machine_next_maintenance (next_maintenance),
    INDEX idx_machine_brand (brand)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- 7. BẢNG LỊCH SỬ CÔNG VIỆC (machine_work_history)
-- =====================================================
CREATE TABLE machine_work_history (
    id INT AUTO_INCREMENT PRIMARY KEY,
    machine_id INT NOT NULL,
    contractor_id INT NULL,
    work_date DATE NOT NULL,
    type ENUM('maintenance', 'repair', 'inspection', 'cleaning', 'replacement', 'calibration', 'installation') NOT NULL,
    description TEXT NOT NULL,
    worker_name VARCHAR(255) NOT NULL COMMENT 'Tên người thực hiện',
    cost DECIMAL(12,2) DEFAULT 0.00 COMMENT 'Chi phí (VNĐ)',
    warranty VARCHAR(100) NULL COMMENT 'Thời gian bảo hành',
    status ENUM('completed', 'in-progress', 'pending', 'cancelled') DEFAULT 'pending',
    priority ENUM('low', 'medium', 'high', 'urgent') DEFAULT 'medium',
    estimated_hours DECIMAL(5,2) NULL COMMENT 'Thời gian dự kiến (giờ)',
    actual_hours DECIMAL(5,2) NULL COMMENT 'Thời gian thực tế (giờ)',
    parts_used JSON NULL COMMENT 'Linh kiện đã sử dụng',
    notes TEXT NULL,
    documents JSON NULL COMMENT 'Tài liệu đính kèm',
    images_before JSON NULL COMMENT 'Ảnh trước khi làm',
    images_during JSON NULL COMMENT 'Ảnh trong quá trình',
    images_after JSON NULL COMMENT 'Ảnh sau khi hoàn thành',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_work_machine_date (machine_id, work_date),
    INDEX idx_work_type (type),
    INDEX idx_work_status (status),
    INDEX idx_work_contractor (contractor_id),
    INDEX idx_work_priority (priority),
    FOREIGN KEY (machine_id) REFERENCES machines(id) ON DELETE CASCADE,
    FOREIGN KEY (contractor_id) REFERENCES machine_contractors(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- 8. BẢNG LỊCH BẢO DƯỠNG (machine_maintenance_schedules)
-- =====================================================
CREATE TABLE machine_maintenance_schedules (
    id INT AUTO_INCREMENT PRIMARY KEY,
    machine_id INT NOT NULL,
    scheduled_date DATE NOT NULL,
    schedule_type ENUM('weekly', 'monthly', 'quarterly', 'semi-annual', 'annual') NOT NULL,
    maintenance_type ENUM('preventive', 'corrective', 'predictive', 'emergency') DEFAULT 'preventive',
    is_completed TINYINT(1) DEFAULT 0,
    completed_work_id INT NULL,
    estimated_cost DECIMAL(12,2) NULL,
    notes TEXT NULL,
    created_by INT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_schedule_date (scheduled_date),
    INDEX idx_schedule_completed (is_completed),
    INDEX idx_schedule_machine (machine_id),
    INDEX idx_schedule_type (schedule_type),
    FOREIGN KEY (machine_id) REFERENCES machines(id) ON DELETE CASCADE,
    FOREIGN KEY (completed_work_id) REFERENCES machine_work_history(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- 9. BẢNG NGƯỜI DÙNG (machine_users)
-- =====================================================
CREATE TABLE machine_users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NULL,
    role ENUM('admin', 'technician', 'manager', 'operator', 'viewer') DEFAULT 'viewer',
    phone VARCHAR(20) NULL,
    department VARCHAR(100) NULL,
    is_active TINYINT(1) DEFAULT 1,
    last_login TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_user_username (username),
    INDEX idx_user_email (email),
    INDEX idx_user_role (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- 10. BẢNG CÀI ĐẶT HỆ THỐNG (machine_system_settings)
-- =====================================================
CREATE TABLE machine_system_settings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    setting_key VARCHAR(100) NOT NULL UNIQUE,
    setting_value TEXT NULL,
    data_type ENUM('string', 'number', 'boolean', 'json') DEFAULT 'string',
    description TEXT NULL,
    updated_by INT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_setting_key (setting_key),
    FOREIGN KEY (updated_by) REFERENCES machine_users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- 11. BẢNG NHẬT KÝ AUDIT (machine_audit_logs)
-- =====================================================
CREATE TABLE machine_audit_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NULL,
    action VARCHAR(100) NOT NULL COMMENT 'CREATE, UPDATE, DELETE, LOGIN, etc.',
    table_name VARCHAR(100) NOT NULL,
    record_id INT NULL,
    old_values JSON NULL,
    new_values JSON NULL,
    ip_address VARCHAR(45) NULL,
    user_agent TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_audit_user_date (user_id, created_at),
    INDEX idx_audit_table_record (table_name, record_id),
    INDEX idx_audit_action (action),
    FOREIGN KEY (user_id) REFERENCES machine_users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- 12. BẢNG LINH KIỆN/PHỤ TÙNG (machine_parts)
-- =====================================================
CREATE TABLE machine_parts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100) NULL COMMENT 'Loại linh kiện: motor, bearing, belt, filter, etc.',
    brand VARCHAR(100) NULL,
    model VARCHAR(100) NULL,
    specifications JSON NULL COMMENT 'Thông số kỹ thuật',
    unit VARCHAR(20) DEFAULT 'pcs' COMMENT 'Đơn vị tính',
    cost DECIMAL(12,2) DEFAULT 0.00 COMMENT 'Giá thành',
    supplier VARCHAR(255) NULL COMMENT 'Nhà cung cấp',
    warranty_period INT DEFAULT 0 COMMENT 'Thời gian bảo hành (ngày)',
    notes TEXT NULL,
    is_active TINYINT(1) DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_part_code (code),
    INDEX idx_part_category (category),
    INDEX idx_part_brand (brand)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- 13. BẢNG TỒN KHO LINH KIỆN (machine_inventory)
-- =====================================================
CREATE TABLE machine_inventory (
    id INT AUTO_INCREMENT PRIMARY KEY,
    part_id INT NOT NULL,
    location VARCHAR(100) NOT NULL COMMENT 'Vị trí lưu kho',
    quantity_available INT DEFAULT 0,
    quantity_reserved INT DEFAULT 0 COMMENT 'Số lượng đã đặt chỗ',
    minimum_stock INT DEFAULT 5 COMMENT 'Mức tồn kho tối thiểu',
    maximum_stock INT DEFAULT 100,
    last_restock_date DATE NULL,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_inventory_part (part_id),
    INDEX idx_inventory_location (location),
    INDEX idx_inventory_low_stock (part_id, quantity_available, minimum_stock),
    FOREIGN KEY (part_id) REFERENCES machine_parts(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- DỮ LIỆU MẪU (SAMPLE DATA)
-- =====================================================

-- Loại máy móc
INSERT INTO machine_types (code, name, description) VALUES
('CUTTING', 'Máy cắt', 'Các loại máy cắt kim loại, gỗ, vải'),
('DRILLING', 'Máy khoan', 'Máy khoan cột, khoan bàn, khoan CNC'),
('WELDING', 'Máy hàn', 'Máy hàn điện, hàn CO2, hàn TIG/MIG'),
('MILLING', 'Máy phay', 'Máy phay CNC, phay vạn năng'),
('LATHE', 'Máy tiện', 'Máy tiện CNC, tiện vạn năng'),
('GRINDER', 'Máy mài', 'Máy mài góc, mài phẳng, mài tròn'),
('PRESS', 'Máy ép', 'Máy ép thủy lực, ép cơ khí'),
('CONVEYOR', 'Băng tải', 'Hệ thống băng chuyền, băng tải');

-- Khu vực
INSERT INTO machine_areas (code, name, description) VALUES
('WORKSHOP1', 'Xưởng 1', 'Xưởng sản xuất chính'),
('WORKSHOP2', 'Xưởng 2', 'Xưởng gia công'),
('WORKSHOP3', 'Xưởng 3', 'Xưởng lắp ráp'),
('WAREHOUSE', 'Kho', 'Khu vực kho bãi'),
('OFFICE', 'Văn phòng', 'Khu vực văn phòng');

-- Thương hiệu
INSERT INTO machine_brands (code, name, country, description) VALUES
('SIEMENS', 'Siemens', 'Germany', 'Tập đoàn công nghiệp Đức'),
('ABB', 'ABB', 'Switzerland', 'Công ty tự động hóa và điện lực'),
('FANUC', 'FANUC', 'Japan', 'Chuyên về CNC và robot'),
('DMG', 'DMG MORI', 'Germany', 'Máy công cụ chính xác'),
('LINCOLN', 'Lincoln Electric', 'USA', 'Thiết bị hàn chuyên nghiệp'),
('MAKINO', 'Makino', 'Japan', 'Máy gia công chính xác');

-- Nhà thầu/Kỹ thuật viên
INSERT INTO machine_contractors (name, phone, license, experience, specialties, rating) VALUES
('Công ty TNHH Kỹ Thuật ABC', '0901234567', 'KT001', '10 năm', '["cutting", "welding", "electrical"]', 4.5),
('Nguyễn Văn An', '0912345678', 'KT002', '8 năm', '["drilling", "milling", "maintenance"]', 4.2),
('Trần Thị Bình', '0923456789', 'KT003', '12 năm', '["welding", "repair", "safety"]', 4.8),
('Công ty Bảo Dưỡng XYZ', '0934567890', 'KT004', '15 năm', '["preventive", "corrective", "all_types"]', 4.6),
('Lê Minh Cường', '0945678901', 'KT005', '6 năm', '["electrical", "calibration", "programming"]', 4.1);

-- Cài đặt hệ thống
INSERT INTO machine_system_settings (setting_key, setting_value, data_type, description) VALUES
('default_maintenance_interval', '90', 'number', 'Chu kỳ bảo dưỡng mặc định (ngày)'),
('notification_email', 'admin@company.com', 'string', 'Email nhận thông báo hệ thống'),
('working_hours_start', '08:00', 'string', 'Giờ bắt đầu ca làm việc'),
('working_hours_end', '17:00', 'string', 'Giờ kết thúc ca làm việc'),
('auto_schedule_maintenance', 'true', 'boolean', 'Tự động lập lịch bảo dưỡng'),
('currency', 'VND', 'string', 'Đơn vị tiền tệ'),
('company_name', 'Công ty ABC', 'string', 'Tên công ty'),
('maintenance_reminder_days', '7', 'number', 'Nhắc nhở trước bảo dưỡng (ngày)');

-- Máy móc mẫu
INSERT INTO machines (code, type, area, location, power, brand, model, serial, install_date, warranty_date, status, maintenance_interval, notes) VALUES
('MC-001', 'cutting', 'WORKSHOP1', 'Dây chuyền A1', 15.5, 'SIEMENS', 'CUT-2000', 'SN001234', '2023-01-15', '2026-01-15', 'excellent', 90, 'Máy cắt CNC chính xác cao'),
('MC-002', 'welding', 'WORKSHOP2', 'Khu vực hàn B2', 25.0, 'LINCOLN', 'WELD-300', 'SN002345', '2022-08-20', '2025-08-20', 'maintenance', 60, 'Cần kiểm tra hệ thống làm mát'),
('MC-003', 'drilling', 'WORKSHOP1', 'Dây chuyền C3', 12.0, 'DMG', 'DRILL-150', 'SN003456', '2023-05-10', '2026-05-10', 'repair', 90, 'Trục chính có tiếng ồn bất thường'),
('MC-004', 'milling', 'WORKSHOP3', 'Khu gia công D4', 30.0, 'FANUC', 'MILL-500', 'SN004567', '2023-03-22', '2026-03-22', 'good', 120, 'Máy phay CNC 5 trục'),
('MC-005', 'conveyor', 'WAREHOUSE', 'Băng tải chính', 5.5, 'ABB', 'CONV-100', 'SN005678', '2022-12-01', '2025-12-01', 'excellent', 30, 'Băng tải tự động');

-- Lịch sử công việc mẫu
INSERT INTO machine_work_history (machine_id, contractor_id, work_date, type, description, worker_name, cost, status, notes) VALUES
(1, 1, '2024-12-01', 'maintenance', 'Bảo dưỡng định kỳ máy cắt CNC', 'Nguyễn Văn An', 2500000, 'completed', 'Thay dầu và kiểm tra hệ thống'),
(2, 3, '2024-11-15', 'repair', 'Sửa chữa hệ thống làm mát máy hàn', 'Trần Thị Bình', 3200000, 'completed', 'Thay thế bơm làm mát và ống dẫn'),
(3, 2, '2024-10-20', 'inspection', 'Kiểm tra tiếng ồn trục chính', 'Nguyễn Văn An', 800000, 'completed', 'Phát hiện bearing bị hỏng, cần thay thế'),
(4, 4, '2024-12-10', 'maintenance', 'Bảo dưỡng máy phay CNC', 'Lê Minh Cường', 4500000, 'in-progress', 'Đang tiến hành hiệu chuẩn hệ thống'),
(5, 1, '2024-11-30', 'cleaning', 'Vệ sinh và bôi trơn băng tải', 'Công ty ABC', 1200000, 'completed', 'Vệ sinh toàn bộ hệ thống băng tải');

-- Lịch bảo dưỡng sắp tới
INSERT INTO machine_maintenance_schedules (machine_id, scheduled_date, schedule_type, maintenance_type, estimated_cost, notes) VALUES
(1, '2025-03-01', 'quarterly', 'preventive', 2800000, 'Bảo dưỡng định kỳ Q1/2025'),
(2, '2025-01-15', 'monthly', 'corrective', 2000000, 'Kiểm tra hệ thống làm mát sau sửa chữa'),
(3, '2025-02-20', 'quarterly', 'corrective', 5500000, 'Thay thế bearing trục chính'),
(4, '2025-04-22', 'quarterly', 'preventive', 5000000, 'Bảo dưỡng máy phay CNC'),
(5, '2025-01-30', 'monthly', 'preventive', 1500000, 'Bảo dưỡng băng tải hàng tháng');

-- =====================================================
-- TẠO USER VÀ PHÂN QUYỀN (TÙY CHỌN)
-- =====================================================

-- Tạo user cho ứng dụng (thay đổi mật khẩu trong production)
-- CREATE USER 'machine_app'@'localhost' IDENTIFIED BY 'secure_password_here';
-- GRANT SELECT, INSERT, UPDATE, DELETE ON machine_management.* TO 'machine_app'@'localhost';
-- FLUSH PRIVILEGES;

-- =====================================================
-- HOÀN THÀNH
-- =====================================================
SELECT 'Machine Management Database Setup Completed!' as Status;
