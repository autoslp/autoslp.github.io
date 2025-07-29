-- SQL script để tạo bảng production_orders cho hệ thống Lệnh sản xuất

-- Tạo bảng chính lưu trữ lệnh sản xuất
CREATE TABLE IF NOT EXISTS production_orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    deployment_date DATE COMMENT 'Ngày triển khai LSX',
    production_order VARCHAR(50) NOT NULL COMMENT 'Lệnh Sản xuất',
    po_number VARCHAR(50) NOT NULL COMMENT 'Số PO', 
    sales_order_code VARCHAR(100) COMMENT 'Mã code KD đặt hàng',
    order_date DATE COMMENT 'Ngày đặt hàng',
    delivery_date DATE COMMENT 'Ngày giao hàng',
    internal_product_code VARCHAR(100) NOT NULL COMMENT 'Mã code SP Nội bộ SX',
    order_type ENUM('Thường', 'Khẩn', 'Mẫu', 'Gia công', 'Đại trà', 'Bù') COMMENT 'Phân Loại Lệnh sản xuất',
    customer_code VARCHAR(50) NOT NULL COMMENT 'Mã code khách hàng',
    customer_name VARCHAR(255) NOT NULL COMMENT 'Tên khách hàng',
    product_name TEXT NOT NULL COMMENT 'Tên sản phẩm',
    version VARCHAR(20) COMMENT 'Version',
    not_deployed_reason TEXT COMMENT 'Ghi chú lý do chưa Triển khai LSX',
    sales_note TEXT COMMENT 'Ghi chú đơn hàng KD',
    customer_production_note TEXT COMMENT 'Ghi chú Lệnh sản xuất KH',
    order_quantity INT DEFAULT 0 COMMENT 'Số lượng đơn hàng',
    inventory INT DEFAULT 0 COMMENT 'Tồn kho',
    required_quantity INT DEFAULT 0 COMMENT 'Số lượng Cần sản xuất',
    deployed_quantity INT DEFAULT 0 COMMENT 'Số lượng Triển khai',
    offset_waste INT DEFAULT 0 COMMENT 'Hao phí in offset',
    waste INT DEFAULT 0 COMMENT 'Hao phí',
    sheet_count INT DEFAULT 0 COMMENT 'Số tờ triển khai',
    product_length DECIMAL(10,2) COMMENT 'Sản phẩm (Dài)',
    product_width DECIMAL(10,2) COMMENT 'Sản phẩm (Rộng)',
    product_height DECIMAL(10,2) COMMENT 'Sản phẩm (Cao)',
    paper_length DECIMAL(10,2) COMMENT 'Giấy (Dài)',
    paper_width DECIMAL(10,2) COMMENT 'Giấy (Rộng)',
    part_count INT DEFAULT 0 COMMENT 'Số part',
    color_count INT DEFAULT 0 COMMENT 'Số màu',
    customer_group ENUM('VIP', 'Thường', 'Mới', 'Chiến lược', 'Nhóm 2', 'Nhóm 3', 'Nhóm 4') COMMENT 'Nhóm khách hàng',
    paper_type VARCHAR(100) COMMENT 'Loại giấy',
    paper_weight INT COMMENT 'Định Lượng giấy',
    work_stage TEXT COMMENT 'Công đoạn',
    status ENUM('Chờ triển khai', 'Đang sản xuất', 'Hoàn thành', 'Đã hủy') DEFAULT 'Chờ triển khai' COMMENT 'Trạng thái',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Thời gian tạo',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Thời gian cập nhật',
    
    INDEX idx_deployment_date (deployment_date),
    INDEX idx_production_order (production_order),
    INDEX idx_po_number (po_number),
    INDEX idx_customer_code (customer_code),
    INDEX idx_status (status),
    INDEX idx_order_date (order_date),
    INDEX idx_delivery_date (delivery_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Bảng quản lý lệnh sản xuất';

-- Chèn dữ liệu mẫu
INSERT INTO production_orders (
    deployment_date, production_order, po_number, sales_order_code, order_date, delivery_date,
    internal_product_code, order_type, customer_code, customer_name, product_name, version,
    not_deployed_reason, sales_note, customer_production_note, order_quantity, inventory,
    required_quantity, deployed_quantity, offset_waste, waste, sheet_count, product_length,
    product_width, product_height, paper_length, paper_width, part_count, color_count,
    customer_group, paper_type, paper_weight, work_stage, status
) VALUES 
(
    '2025-03-04', '01-2503-00065', '25.03.008.02', 'SLM-00217DCO-01', '2025-03-04', '2025-03-22',
    'SLM-00217DCO-01-16b', 'Đại trà', '3226329', 'Công ty TNHH Dorco vina', 
    'P3373 SVA4005-BX KR ONLINE IC', '1', '', 'Như lô gần nhất',
    'Như lô gần nhất - Hàng không được thiếu số lượng - Số lượng trên đã bao gồm số tờ in CẤP THÊM 50 TỜ ĐỂ LẤY 20 MẪU MÀU CHUẨN. ĐỐC CÔNG XƯỞNG IN DUYỆT ĐỂ LẤY MẪU MÀU CẤP CHO PHÒNG KỸ THUẬT',
    16688, 686, 16002, 23360, 340, 46, 1460, 148.00, 105.00, 0.00, 634.00, -452.00, 16, 2,
    'Nhóm 3', 'Couches TQ - Hikote', 200, 'Xả-Xén-In-Bế-Dán-Đóng thùng', 'Đang sản xuất'
),
(
    '2025-03-04', '01-2503-00067', '25.03.009.01', 'SLM-00452HAV-02', '2025-03-04', '2025-03-09',
    'SLM-00452HAV-02-4b', 'Đại trà', '0', 'Công Ty TNHH Dược Hanvet',
    'Hộp Clafotax, 1 gam (10 lọ x 1 gam)', '2', '', 
    'Thêm mã QR code. Nội dung còn lại như cũ. Màu sắc, quy cách như cũ. Sửa tên sp là: Hộp Clafotax, 1 gam (10 lọ x 1 gam)',
    'Ra bản mới Thêm mã QR code theo ECN số 6343. - Nội dung còn lại như cũ. Màu sắc, quy cách như cũ. - Cũ in giấy CM, lô này in giấy NB=> Chú ý in đúng màu và ra bản theo chế độ anh Tuấn chỉ định',
    10000, 0, 10000, 10880, 150, 9, 2720, 135.00, 53.00, 65.00, -563.00, 406.00, 4, 3,
    'Nhóm 2', 'Duplex Hanson', 350, 'Xả-Xén-In-Bế-Dán-Đóng thùng', 'Đang sản xuất'
),
(
    '2025-03-04', '01-2503-00068', 'YCM.7574.2', 'SLM-00056HNA-10', '2025-03-04', '2025-03-05',
    'SLM-00056HNA-10-9b', 'Mẫu', '0', 'Công ty TNHH Dược Phẩm Hoa Linh Hà Nam',
    'Hộp kem đánh răng Ngọc Châu truyền thống 100g', '10', '',
    '-', 'Nội dung theo mẫu đã in. Màu theo mẫu cũ=> Xưởng in duyệt màu khi in - Mẫu đã in khách báo bị loang màu - Cần 6 bộ mẫu',
    0, 0, 18, 4500, 0, 24900, 500, 45.00, 35.00, 185.00, -760.00, 532.00, 9, 5,
    'Nhóm 3', 'Ivory NingBo', 350, 'Xả-Xén-In-Bế-Dán-Đóng thùng', 'Chờ triển khai'
),
(
    '2025-03-04', '01-2503-00069', '25.02.011.04', 'SLM-00031APT-01', NULL, '2025-03-07',
    'SLM-00031APT-01-4b', 'Bù', '0', 'Công ty TNHH ARTPRESTO Việt Nam',
    'Hộp đồ chơi VNF-081077~VNF-081083 + VNF-081650 JAPAN ICHIBANKUJI SHINGEKINOKYOJIN SEKAI PRIZE I1 ~ I8 CHOKONOKKO FIGURE', '1', '',
    'Như mẫu khách hàng ký duyệt (Tone B). Tên cũ của sản phẩm là Hộp đồ chơi VNF-081004 JAPAN ICHIBANKUJI SHINGEKINOKYOJIN SEKAI PRIZE I CHOKONOKKO FIGURE',
    'In bù LSX 01-2502-00677 = cần 1.627 cái - Hàng không được thiếu số lượng - Kho cấp hết ram thiếu ít xả K1000',
    48188, -482, 1627, 3600, 270, 121, 900, 70.00, 70.00, 70.00, 598.00, -478.00, 4, 4,
    'Nhóm 4', 'Ivory NingBo', 350, 'Xả-Xén-In-Bế-Dán-Đóng thùng', 'Đang sản xuất'
);

-- Tạo view để thống kê tổng quan
CREATE VIEW production_orders_stats AS
SELECT 
    COUNT(*) as total_orders,
    SUM(order_quantity) as total_quantity,
    COUNT(CASE WHEN status = 'Chờ triển khai' THEN 1 END) as pending_orders,
    COUNT(CASE WHEN status = 'Đang sản xuất' THEN 1 END) as in_progress_orders,
    COUNT(CASE WHEN status = 'Hoàn thành' THEN 1 END) as completed_orders,
    COUNT(CASE WHEN status = 'Đã hủy' THEN 1 END) as cancelled_orders
FROM production_orders;

-- Tạo view thống kê theo khách hàng
CREATE VIEW customer_orders_stats AS
SELECT 
    customer_name,
    customer_code,
    COUNT(*) as total_orders,
    SUM(order_quantity) as total_quantity,
    AVG(order_quantity) as avg_quantity,
    COUNT(CASE WHEN status = 'Hoàn thành' THEN 1 END) as completed_orders
FROM production_orders
GROUP BY customer_name, customer_code
ORDER BY total_orders DESC;

-- Tạo view thống kê theo tháng
CREATE VIEW monthly_orders_stats AS
SELECT 
    YEAR(deployment_date) as year,
    MONTH(deployment_date) as month,
    COUNT(*) as total_orders,
    SUM(order_quantity) as total_quantity,
    COUNT(CASE WHEN status = 'Hoàn thành' THEN 1 END) as completed_orders
FROM production_orders
WHERE deployment_date IS NOT NULL
GROUP BY YEAR(deployment_date), MONTH(deployment_date)
ORDER BY year DESC, month DESC;

-- Chỉ mục để tối ưu truy vấn
CREATE INDEX idx_created_at ON production_orders(created_at);
CREATE INDEX idx_customer_name ON production_orders(customer_name);
CREATE INDEX idx_product_name ON production_orders(product_name);

-- Hiển thị thông tin đã tạo
SELECT 'Đã tạo thành công bảng production_orders và dữ liệu mẫu' as message;
SELECT * FROM production_orders_stats;
