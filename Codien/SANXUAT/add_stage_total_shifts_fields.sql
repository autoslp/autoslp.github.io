-- Script để thêm các trường total_shifts cho từng giai đoạn sản xuất
-- Chạy script này để cập nhật cấu trúc database

USE autoslp;

-- Thêm trường total_shifts cho từng giai đoạn
ALTER TABLE production_orders 
ADD COLUMN xen_total_shifts JSON NULL COMMENT 'Lưu trữ thông tin ca kíp của giai đoạn Xén',
ADD COLUMN xa_total_shifts JSON NULL COMMENT 'Lưu trữ thông tin ca kíp của giai đoạn Xả',
ADD COLUMN in_offset_total_shifts JSON NULL COMMENT 'Lưu trữ thông tin ca kíp của giai đoạn In Offset',
ADD COLUMN boi_total_shifts JSON NULL COMMENT 'Lưu trữ thông tin ca kíp của giai đoạn Bồi',
ADD COLUMN dan_total_shifts JSON NULL COMMENT 'Lưu trữ thông tin ca kíp của giai đoạn Dán',
ADD COLUMN kho_total_shifts JSON NULL COMMENT 'Lưu trữ thông tin ca kíp của giai đoạn Kho';

-- Tạo index để tối ưu hiệu suất truy vấn
CREATE INDEX idx_xen_total_shifts ON production_orders(xen_total_shifts);
CREATE INDEX idx_xa_total_shifts ON production_orders(xa_total_shifts);
CREATE INDEX idx_in_offset_total_shifts ON production_orders(in_offset_total_shifts);
CREATE INDEX idx_boi_total_shifts ON production_orders(boi_total_shifts);
CREATE INDEX idx_dan_total_shifts ON production_orders(dan_total_shifts);
CREATE INDEX idx_kho_total_shifts ON production_orders(kho_total_shifts);

-- Hiển thị thông tin về cấu trúc bảng sau khi cập nhật
DESCRIBE production_orders;

-- Hiển thị các trường total_shifts mới
SELECT 
    COLUMN_NAME,
    DATA_TYPE,
    IS_NULLABLE,
    COLUMN_COMMENT
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_SCHEMA = 'autoslp' 
    AND TABLE_NAME = 'production_orders' 
    AND COLUMN_NAME LIKE '%_total_shifts'
ORDER BY COLUMN_NAME;
