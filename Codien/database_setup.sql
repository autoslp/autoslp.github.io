-- ========================================
-- SMART AC MANAGEMENT DATABASE SETUP
-- ========================================

-- Drop existing tables (if any)
DROP TABLE IF EXISTS air_audit_logs;
DROP TABLE IF EXISTS air_maintenance_schedules;
DROP TABLE IF EXISTS air_work_history;
DROP TABLE IF EXISTS air_contractors;
DROP TABLE IF EXISTS air_conditioners;
DROP TABLE IF EXISTS air_users;
DROP TABLE IF EXISTS air_system_settings;

-- ========================================
-- 1. BẢNG USERS - Người dùng hệ thống
-- ========================================
CREATE TABLE air_users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255),
    role ENUM('admin', 'technician', 'manager', 'viewer') DEFAULT 'viewer',
    phone VARCHAR(20),
    is_active BOOLEAN DEFAULT TRUE,
    last_login TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ========================================
-- 2. BẢNG AIR_CONDITIONERS - Thông tin điều hòa
-- ========================================
CREATE TABLE air_conditioners (
    id INT PRIMARY KEY AUTO_INCREMENT,
    code VARCHAR(50) UNIQUE NOT NULL,
    type ENUM('split', 'multi', 'central', 'cassette') NOT NULL,
    area VARCHAR(100) NOT NULL,
    location VARCHAR(255) NOT NULL,
    capacity INT,                    -- BTU
    brand VARCHAR(100),
    install_date DATE,
    warranty_date DATE,
    status ENUM('excellent', 'good', 'maintenance', 'repair', 'broken') DEFAULT 'good',
    last_maintenance DATE,
    next_maintenance DATE,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ========================================
-- 3. BẢNG CONTRACTORS - Nhà thầu thi công
-- ========================================
CREATE TABLE air_contractors (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    license VARCHAR(100),           -- Giấy phép
    address TEXT,
    rating DECIMAL(2,1) DEFAULT 0.0,
    experience VARCHAR(50),         -- Kinh nghiệm
    specialties JSON,               -- Mảng chuyên môn ['Daikin', 'LG', ...]
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ========================================
-- 4. BẢNG WORK_HISTORY - Lịch sử công việc (TỔNG HỢP)
-- ========================================
CREATE TABLE air_work_history (
    id INT PRIMARY KEY AUTO_INCREMENT,
    ac_id INT NOT NULL,
    contractor_id INT,
    work_date DATE NOT NULL,
    type ENUM('maintenance', 'repair', 'inspection', 'cleaning', 'replacement') NOT NULL,
    description TEXT NOT NULL,
    worker_name VARCHAR(255) NOT NULL,
    cost DECIMAL(12,2) DEFAULT 0,   -- Chi phí
    warranty VARCHAR(100),          -- Thời gian bảo hành
    status ENUM('completed', 'in-progress', 'pending') DEFAULT 'pending',
    notes TEXT,
    
    -- === PHẦN GIẤY TỜ BÀN GIAO ===
    -- Thay vì tạo bảng riêng, lưu trực tiếp trong work_history
    documents JSON,                 -- Array các giấy tờ: [{"type": "invoice", "name": "Hóa đơn VAT", "file_path": "/uploads/...", "file_size": 1024, "uploaded_at": "2024-01-01"}]
    
    -- === PHẦN ẢNH CÔNG VIỆC ===
    -- Thay vì tạo bảng riêng, lưu trực tiếp trong work_history
    images_before JSON,             -- Array ảnh trước: [{"path": "/uploads/before1.jpg", "name": "Trước bảo dưỡng", "size": 2048}]
    images_during JSON,             -- Array ảnh trong quá trình: [{"path": "/uploads/during1.jpg", "name": "Đang sửa chữa", "size": 1536}]
    images_after JSON,              -- Array ảnh sau: [{"path": "/uploads/after1.jpg", "name": "Sau bảo dưỡng", "size": 2048}]
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (ac_id) REFERENCES air_conditioners(id) ON DELETE CASCADE,
    FOREIGN KEY (contractor_id) REFERENCES air_contractors(id) ON DELETE SET NULL
);

-- ========================================
-- 5. BẢNG MAINTENANCE_SCHEDULES - Lịch bảo dưỡng
-- ========================================
CREATE TABLE air_maintenance_schedules (
    id INT PRIMARY KEY AUTO_INCREMENT,
    ac_id INT NOT NULL,
    scheduled_date DATE NOT NULL,
    schedule_type ENUM('monthly', 'quarterly', 'semi-annual', 'annual') NOT NULL,
    is_completed BOOLEAN DEFAULT FALSE,
    completed_work_id INT NULL,     -- Link đến work_history khi hoàn thành
    notes TEXT,
    created_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (ac_id) REFERENCES air_conditioners(id) ON DELETE CASCADE,
    FOREIGN KEY (completed_work_id) REFERENCES air_work_history(id) ON DELETE SET NULL,
    FOREIGN KEY (created_by) REFERENCES air_users(id) ON DELETE SET NULL
);

-- ========================================
-- 6. BẢNG SYSTEM_SETTINGS - Cài đặt hệ thống
-- ========================================
CREATE TABLE air_system_settings (
    id INT PRIMARY KEY AUTO_INCREMENT,
    setting_key VARCHAR(100) UNIQUE NOT NULL,
    setting_value TEXT,
    description TEXT,
    updated_by INT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (updated_by) REFERENCES air_users(id) ON DELETE SET NULL
);

-- ========================================
-- 7. BẢNG AUDIT_LOGS - Nhật ký hoạt động
-- ========================================
CREATE TABLE air_audit_logs (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    action VARCHAR(100) NOT NULL,   -- 'create', 'update', 'delete'
    table_name VARCHAR(100) NOT NULL,
    record_id INT,
    old_values JSON,                -- Giá trị cũ
    new_values JSON,                -- Giá trị mới
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES air_users(id) ON DELETE SET NULL
);

-- ========================================
-- INDEXES FOR PERFORMANCE
-- ========================================
-- Air Conditioners indexes
CREATE INDEX idx_ac_code ON air_conditioners(code);
CREATE INDEX idx_ac_status ON air_conditioners(status);
CREATE INDEX idx_ac_next_maintenance ON air_conditioners(next_maintenance);

-- Work History indexes
CREATE INDEX idx_work_ac_date ON air_work_history(ac_id, work_date);
CREATE INDEX idx_work_type ON air_work_history(type);
CREATE INDEX idx_work_status ON air_work_history(status);
CREATE INDEX idx_work_contractor ON air_work_history(contractor_id);

-- Maintenance Schedules indexes
CREATE INDEX idx_schedule_date ON air_maintenance_schedules(scheduled_date);
CREATE INDEX idx_schedule_completed ON air_maintenance_schedules(is_completed);
CREATE INDEX idx_schedule_ac ON air_maintenance_schedules(ac_id);

-- Contractors indexes
CREATE INDEX idx_contractor_active ON air_contractors(is_active);
CREATE INDEX idx_contractor_rating ON air_contractors(rating);

-- Audit Logs indexes
CREATE INDEX idx_audit_user_date ON air_audit_logs(user_id, created_at);
CREATE INDEX idx_audit_table_record ON air_audit_logs(table_name, record_id);

-- ========================================
-- SAMPLE DATA
-- ========================================

-- Insert sample contractors
INSERT INTO air_contractors (name, phone, license, address, rating, experience, specialties) VALUES
('Công ty TNHH Điều Hòa Miền Nam', '0909.123.456', 'GP-2024-001', '123 Nguyễn Văn Cừ, Q.5, TP.HCM', 4.8, '10+ năm', '["Daikin", "Mitsubishi", "LG"]'),
('Dịch vụ kỹ thuật ABC', '0912.345.678', 'GP-2024-002', '456 Lê Văn Việt, Q.9, TP.HCM', 4.5, '8+ năm', '["Panasonic", "Samsung", "Toshiba"]'),
('Trung tâm bảo hành Daikin', '1800.1234', 'GP-2024-003', '789 Điện Biên Phủ, Q.3, TP.HCM', 5.0, '15+ năm', '["Daikin", "Tư vấn chuyên sâu"]'),
('Công ty Kiểm định Kỹ thuật', '0908.111.222', 'GP-2024-004', '321 Võ Văn Tần, Q.3, TP.HCM', 4.7, '12+ năm', '["Kiểm định", "Chứng nhận", "Báo cáo kỹ thuật"]'),
('LG Electronics Service', '1800.9999', 'GP-2024-006', '777 Cách Mạng Tháng 8, Q.10, TP.HCM', 4.9, '20+ năm', '["LG", "Bảo hành chính hãng"]');

-- Insert sample air conditioners
INSERT INTO air_conditioners (code, type, area, location, capacity, brand, install_date, warranty_date, status, last_maintenance, next_maintenance, notes) VALUES
('AC-001', 'split', 'Tầng 1', 'Phòng giám đốc', 12000, 'Daikin', '2023-01-15', '2026-01-15', 'excellent', '2024-12-01', '2025-03-01', 'Hoạt động xuất sắc, vừa được bảo dưỡng'),
('AC-002', 'multi', 'Tầng 2', 'Phòng họp lớn', 24000, 'Mitsubishi', '2022-08-20', '2025-08-20', 'maintenance', '2024-10-15', '2025-01-15', 'Cần vệ sinh filter và kiểm tra gas'),
('AC-003', 'split', 'Xưởng sản xuất', 'Khu vực máy cắt', 18000, 'LG', '2023-05-10', '2026-05-10', 'repair', '2024-11-20', '2025-02-20', 'Tiếng ồn bất thường, cần kiểm tra motor quạt');

-- Insert sample work history with documents and images
INSERT INTO air_work_history (
    ac_id, contractor_id, work_date, type, description, worker_name, cost, warranty, status, notes,
    documents, images_before, images_during, images_after
) VALUES
(1, 1, '2024-12-01', 'maintenance', 'Bảo dưỡng định kỳ 6 tháng: Vệ sinh filter, kiểm tra gas, làm sạch dàn nóng', 'Nguyễn Văn A', 850000, '6 tháng', 'completed', 'Hoàn thành tốt, gas đầy đủ, filter được thay mới',
'[
    {"type": "invoice", "name": "Hóa đơn VAT", "file_path": "/uploads/invoice_001.pdf", "file_size": 2048000, "uploaded_at": "2024-12-01 14:30:00"},
    {"type": "handover", "name": "Biên bản bàn giao", "file_path": "/uploads/handover_001.pdf", "file_size": 1536000, "uploaded_at": "2024-12-01 15:00:00"},
    {"type": "warranty", "name": "Phiếu bảo hành", "file_path": "/uploads/warranty_001.jpg", "file_size": 1024000, "uploaded_at": "2024-12-01 15:30:00"}
]',
'[
    {"path": "/uploads/before_001_1.jpg", "name": "Filter cũ", "size": 2048000, "uploaded_at": "2024-12-01 09:00:00"},
    {"path": "/uploads/before_001_2.jpg", "name": "Dàn nóng trước vệ sinh", "size": 1536000, "uploaded_at": "2024-12-01 09:15:00"}
]',
'[
    {"path": "/uploads/during_001_1.jpg", "name": "Đang vệ sinh filter", "size": 1792000, "uploaded_at": "2024-12-01 11:00:00"},
    {"path": "/uploads/during_001_2.jpg", "name": "Kiểm tra gas", "size": 1920000, "uploaded_at": "2024-12-01 12:30:00"}
]',
'[
    {"path": "/uploads/after_001_1.jpg", "name": "Filter mới", "size": 2048000, "uploaded_at": "2024-12-01 14:00:00"},
    {"path": "/uploads/after_001_2.jpg", "name": "Dàn nóng sau vệ sinh", "size": 1792000, "uploaded_at": "2024-12-01 14:15:00"}
]'),

(1, 2, '2024-06-15', 'cleaning', 'Vệ sinh filter và dàn lạnh', 'Trần Văn B', 300000, '1 tháng', 'completed', 'Vệ sinh sạch sẽ, khử mùi hoàn toàn',
'[
    {"type": "invoice", "name": "Hóa đơn", "file_path": "/uploads/invoice_002.pdf", "file_size": 1024000, "uploaded_at": "2024-06-15 16:00:00"},
    {"type": "handover", "name": "Biên bản bàn giao", "file_path": "/uploads/handover_002.jpg", "file_size": 768000, "uploaded_at": "2024-06-15 16:30:00"},
    {"type": "completion", "name": "Ảnh hoàn thành", "file_path": "/uploads/completion_002.png", "file_size": 512000, "uploaded_at": "2024-06-15 17:00:00"}
]',
'[
    {"path": "/uploads/before_002_1.jpg", "name": "Filter bẩn", "size": 1536000, "uploaded_at": "2024-06-15 08:30:00"}
]',
'[]',
'[
    {"path": "/uploads/after_002_1.jpg", "name": "Filter sạch", "size": 1792000, "uploaded_at": "2024-06-15 15:30:00"}
]'),

(3, 5, '2024-11-20', 'repair', 'Sửa chữa motor quạt dàn nóng bị rung', 'Phạm Văn D', 2500000, '12 tháng', 'in-progress', 'Đang chờ linh kiện về từ nhà máy, dự kiến hoàn thành trong 3-5 ngày',
'[
    {"type": "invoice", "name": "Hóa đơn VAT", "file_path": "/uploads/invoice_003.pdf", "file_size": 2560000, "uploaded_at": "2024-11-20 17:00:00"},
    {"type": "export", "name": "Phiếu xuất kho", "file_path": "/uploads/export_003.pdf", "file_size": 1024000, "uploaded_at": "2024-11-20 17:15:00"},
    {"type": "warranty", "name": "Tem bảo hành", "file_path": "/uploads/warranty_003.jpg", "file_size": 512000, "uploaded_at": "2024-11-20 17:30:00"}
]',
'[
    {"path": "/uploads/before_003_1.jpg", "name": "Motor cũ bị rung", "size": 2048000, "uploaded_at": "2024-11-20 09:00:00"},
    {"path": "/uploads/before_003_2.jpg", "name": "Dàn nóng bị hỏng", "size": 1792000, "uploaded_at": "2024-11-20 09:30:00"}
]',
'[
    {"path": "/uploads/during_003_1.jpg", "name": "Tháo motor cũ", "size": 1920000, "uploaded_at": "2024-11-20 14:00:00"}
]',
'[
    {"path": "/uploads/after_003_1.jpg", "name": "Motor mới", "size": 2048000, "uploaded_at": "2024-11-20 16:30:00"}
]');

-- Insert system settings
INSERT INTO air_system_settings (setting_key, setting_value, description) VALUES
('maintenance_reminder_days', '7', 'Số ngày nhắc nhở trước khi bảo dưỡng'),
('default_warranty_period', '6 tháng', 'Thời gian bảo hành mặc định'),
('company_name', 'Smart AC Manager', 'Tên công ty'),
('max_file_size', '10485760', 'Kích thước file tối đa (bytes)'),
('allowed_file_types', 'jpg,jpeg,png,pdf,doc,docx', 'Loại file được phép upload'),
('document_types', '[
    {"id": "invoice", "name": "Hóa đơn VAT", "icon": "bi-receipt", "required": true, "description": "Hóa đơn giá trị gia tăng"},
    {"id": "handover", "name": "Biên bản bàn giao", "icon": "bi-file-earmark-text", "required": true, "description": "Biên bản nghiệm thu công việc"},
    {"id": "warranty", "name": "Phiếu bảo hành", "icon": "bi-shield-check", "required": false, "description": "Chứng từ bảo hành dịch vụ"},
    {"id": "certificate", "name": "Giấy chứng nhận", "icon": "bi-patch-check", "required": false, "description": "Chứng nhận chất lượng, chính hãng"},
    {"id": "export", "name": "Phiếu xuất kho", "icon": "bi-box-seam", "required": false, "description": "Phiếu xuất linh kiện, vật tư"},
    {"id": "report", "name": "Báo cáo kỹ thuật", "icon": "bi-graph-up", "required": false, "description": "Báo cáo kiểm tra, đánh giá kỹ thuật"}
]', 'Cấu hình các loại giấy tờ');

-- ========================================
-- USEFUL VIEWS
-- ========================================

-- View tổng hợp thống kê điều hòa
CREATE VIEW ac_summary AS
SELECT 
    ac.*,
    COUNT(wh.id) as total_works,
    SUM(CASE WHEN wh.type = 'maintenance' THEN 1 ELSE 0 END) as maintenance_count,
    SUM(CASE WHEN wh.type = 'repair' THEN 1 ELSE 0 END) as repair_count,
    SUM(CASE WHEN wh.type = 'inspection' THEN 1 ELSE 0 END) as inspection_count,
    SUM(CASE WHEN wh.type = 'cleaning' THEN 1 ELSE 0 END) as cleaning_count,
    SUM(CASE WHEN wh.type = 'replacement' THEN 1 ELSE 0 END) as replacement_count,
    SUM(wh.cost) as total_cost,
    AVG(wh.cost) as avg_cost,
    MAX(wh.work_date) as last_work_date,
    c.name as last_contractor_name
FROM air_conditioners ac
LEFT JOIN air_work_history wh ON ac.id = wh.ac_id
LEFT JOIN air_contractors c ON wh.contractor_id = c.id AND wh.work_date = (
    SELECT MAX(work_date) FROM air_work_history WHERE ac_id = ac.id
)
GROUP BY ac.id;

-- View lịch bảo dưỡng sắp đến
CREATE VIEW upcoming_maintenance AS
SELECT 
    ac.code,
    ac.location,
    ac.area,
    ac.next_maintenance,
    DATEDIFF(ac.next_maintenance, CURDATE()) as days_until,
    ac.status,
    CASE 
        WHEN DATEDIFF(ac.next_maintenance, CURDATE()) <= 0 THEN 'Quá hạn'
        WHEN DATEDIFF(ac.next_maintenance, CURDATE()) <= 7 THEN 'Khẩn cấp'
        WHEN DATEDIFF(ac.next_maintenance, CURDATE()) <= 30 THEN 'Sắp đến'
        ELSE 'Bình thường'
    END as priority
FROM air_conditioners ac
WHERE ac.next_maintenance >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
ORDER BY ac.next_maintenance ASC;

-- View chi tiết công việc với thông tin đầy đủ
CREATE VIEW work_details AS
SELECT 
    wh.*,
    ac.code as ac_code,
    ac.location as ac_location,
    ac.area as ac_area,
    c.name as contractor_name,
    c.phone as contractor_phone,
    c.rating as contractor_rating,
    JSON_LENGTH(wh.documents) as document_count,
    JSON_LENGTH(wh.images_before) as before_image_count,
    JSON_LENGTH(wh.images_during) as during_image_count,
    JSON_LENGTH(wh.images_after) as after_image_count,
    (JSON_LENGTH(IFNULL(wh.images_before, '[]')) + 
     JSON_LENGTH(IFNULL(wh.images_during, '[]')) + 
     JSON_LENGTH(IFNULL(wh.images_after, '[]'))) as total_image_count
FROM air_work_history wh
INNER JOIN air_conditioners ac ON wh.ac_id = ac.id
LEFT JOIN air_contractors c ON wh.contractor_id = c.id
ORDER BY wh.work_date DESC;

-- ========================================
-- SAMPLE QUERIES FOR COMMON OPERATIONS
-- ========================================

-- Lấy lịch sử công việc của một điều hòa với ảnh và giấy tờ
-- SELECT * FROM work_details WHERE ac_code = 'AC-001';

-- Lấy danh sách điều hòa cần bảo dưỡng trong 7 ngày tới
-- SELECT * FROM upcoming_maintenance WHERE days_until BETWEEN 0 AND 7;

-- Thống kê tổng chi phí theo loại công việc
-- SELECT type, COUNT(*) as count, SUM(cost) as total_cost, AVG(cost) as avg_cost 
-- FROM air_work_history GROUP BY type;

-- Lấy nhà thầu có rating cao nhất
-- SELECT * FROM air_contractors WHERE is_active = 1 ORDER BY rating DESC LIMIT 5;

-- Tìm điều hòa có chi phí bảo dưỡng cao nhất
-- SELECT * FROM ac_summary ORDER BY total_cost DESC LIMIT 10;
