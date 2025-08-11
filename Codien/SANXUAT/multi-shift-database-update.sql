-- SQL script để thêm các cột hỗ trợ multi-shift production cho từng công đoạn
-- Chạy script này để cập nhật bảng production_orders

-- Thêm các cột multi-shift cho từng stage cụ thể
-- XEN stage multi-shift columns
ALTER TABLE production_orders 
ADD COLUMN xen_total_produced_quantity INT DEFAULT 0 COMMENT 'Tổng số lượng đã sản xuất qua tất cả các ca cho XEN',
ADD COLUMN xen_total_shifts_completed INT DEFAULT 0 COMMENT 'Tổng số ca đã hoàn thành cho XEN',
ADD COLUMN xen_current_shift_start DATETIME NULL COMMENT 'Thời gian bắt đầu ca hiện tại cho XEN',
ADD COLUMN xen_current_shift_end DATETIME NULL COMMENT 'Thời gian kết thúc ca hiện tại cho XEN',
ADD COLUMN xen_shift_data JSON NULL COMMENT 'Dữ liệu chi tiết từng ca cho XEN (JSON format)',
ADD COLUMN xen_allow_multiple_shifts BOOLEAN DEFAULT FALSE COMMENT 'Cho phép chạy nhiều ca cho XEN';

-- XA stage multi-shift columns
ALTER TABLE production_orders 
ADD COLUMN xa_total_produced_quantity INT DEFAULT 0 COMMENT 'Tổng số lượng đã sản xuất qua tất cả các ca cho XA',
ADD COLUMN xa_total_shifts_completed INT DEFAULT 0 COMMENT 'Tổng số ca đã hoàn thành cho XA',
ADD COLUMN xa_current_shift_start DATETIME NULL COMMENT 'Thời gian bắt đầu ca hiện tại cho XA',
ADD COLUMN xa_current_shift_end DATETIME NULL COMMENT 'Thời gian kết thúc ca hiện tại cho XA',
ADD COLUMN xa_shift_data JSON NULL COMMENT 'Dữ liệu chi tiết từng ca cho XA (JSON format)',
ADD COLUMN xa_allow_multiple_shifts BOOLEAN DEFAULT FALSE COMMENT 'Cho phép chạy nhiều ca cho XA';

-- IN_OFFSET stage multi-shift columns
ALTER TABLE production_orders 
ADD COLUMN in_offset_total_produced_quantity INT DEFAULT 0 COMMENT 'Tổng số lượng đã sản xuất qua tất cả các ca cho IN_OFFSET',
ADD COLUMN in_offset_total_shifts_completed INT DEFAULT 0 COMMENT 'Tổng số ca đã hoàn thành cho IN_OFFSET',
ADD COLUMN in_offset_current_shift_start DATETIME NULL COMMENT 'Thời gian bắt đầu ca hiện tại cho IN_OFFSET',
ADD COLUMN in_offset_current_shift_end DATETIME NULL COMMENT 'Thời gian kết thúc ca hiện tại cho IN_OFFSET',
ADD COLUMN in_offset_shift_data JSON NULL COMMENT 'Dữ liệu chi tiết từng ca cho IN_OFFSET (JSON format)',
ADD COLUMN in_offset_allow_multiple_shifts BOOLEAN DEFAULT FALSE COMMENT 'Cho phép chạy nhiều ca cho IN_OFFSET';

-- BOI stage multi-shift columns
ALTER TABLE production_orders 
ADD COLUMN boi_total_produced_quantity INT DEFAULT 0 COMMENT 'Tổng số lượng đã sản xuất qua tất cả các ca cho BOI',
ADD COLUMN boi_total_shifts_completed INT DEFAULT 0 COMMENT 'Tổng số ca đã hoàn thành cho BOI',
ADD COLUMN boi_current_shift_start DATETIME NULL COMMENT 'Thời gian bắt đầu ca hiện tại cho BOI',
ADD COLUMN boi_current_shift_end DATETIME NULL COMMENT 'Thời gian kết thúc ca hiện tại cho BOI',
ADD COLUMN boi_shift_data JSON NULL COMMENT 'Dữ liệu chi tiết từng ca cho BOI (JSON format)',
ADD COLUMN boi_allow_multiple_shifts BOOLEAN DEFAULT FALSE COMMENT 'Cho phép chạy nhiều ca cho BOI';

-- BE stage multi-shift columns
ALTER TABLE production_orders 
ADD COLUMN be_total_produced_quantity INT DEFAULT 0 COMMENT 'Tổng số lượng đã sản xuất qua tất cả các ca cho BE',
ADD COLUMN be_total_shifts_completed INT DEFAULT 0 COMMENT 'Tổng số ca đã hoàn thành cho BE',
ADD COLUMN be_current_shift_start DATETIME NULL COMMENT 'Thời gian bắt đầu ca hiện tại cho BE',
ADD COLUMN be_current_shift_end DATETIME NULL COMMENT 'Thời gian kết thúc ca hiện tại cho BE',
ADD COLUMN be_shift_data JSON NULL COMMENT 'Dữ liệu chi tiết từng ca cho BE (JSON format)',
ADD COLUMN be_allow_multiple_shifts BOOLEAN DEFAULT FALSE COMMENT 'Cho phép chạy nhiều ca cho BE';

-- DAN_MAY stage multi-shift columns
ALTER TABLE production_orders 
ADD COLUMN dan_may_total_produced_quantity INT DEFAULT 0 COMMENT 'Tổng số lượng đã sản xuất qua tất cả các ca cho DAN_MAY',
ADD COLUMN dan_may_total_shifts_completed INT DEFAULT 0 COMMENT 'Tổng số ca đã hoàn thành cho DAN_MAY',
ADD COLUMN dan_may_current_shift_start DATETIME NULL COMMENT 'Thời gian bắt đầu ca hiện tại cho DAN_MAY',
ADD COLUMN dan_may_current_shift_end DATETIME NULL COMMENT 'Thời gian kết thúc ca hiện tại cho DAN_MAY',
ADD COLUMN dan_may_shift_data JSON NULL COMMENT 'Dữ liệu chi tiết từng ca cho DAN_MAY (JSON format)',
ADD COLUMN dan_may_allow_multiple_shifts BOOLEAN DEFAULT FALSE COMMENT 'Cho phép chạy nhiều ca cho DAN_MAY';

-- Thêm các cột cho từng stage để hỗ trợ multi-shift
-- XEN stage specific columns
ALTER TABLE production_orders 
ADD COLUMN xen_ng_start_end_quantity INT DEFAULT 0 COMMENT 'SL NG đầu/cuối cho XEN',
ADD COLUMN xen_return_quantity INT DEFAULT 0 COMMENT 'SL tồn trả cho XEN';

-- XA stage specific columns
ALTER TABLE production_orders 
ADD COLUMN xa_ng_start_end_quantity INT DEFAULT 0 COMMENT 'SL NG đầu/cuối cho XA',
ADD COLUMN xa_return_quantity INT DEFAULT 0 COMMENT 'SL tồn trả cho XA';

-- Tạo index để tối ưu hiệu suất truy vấn cho từng stage
CREATE INDEX idx_production_orders_xen_multi_shift ON production_orders(xen_total_produced_quantity, xen_total_shifts_completed, xen_current_shift_start);
CREATE INDEX idx_production_orders_xa_multi_shift ON production_orders(xa_total_produced_quantity, xa_total_shifts_completed, xa_current_shift_start);
CREATE INDEX idx_production_orders_in_offset_multi_shift ON production_orders(in_offset_total_produced_quantity, in_offset_total_shifts_completed, in_offset_current_shift_start);
CREATE INDEX idx_production_orders_boi_multi_shift ON production_orders(boi_total_produced_quantity, boi_total_shifts_completed, boi_current_shift_start);
CREATE INDEX idx_production_orders_be_multi_shift ON production_orders(be_total_produced_quantity, be_total_shifts_completed, be_current_shift_start);
CREATE INDEX idx_production_orders_dan_may_multi_shift ON production_orders(dan_may_total_produced_quantity, dan_may_total_shifts_completed, dan_may_current_shift_start);

-- Cập nhật dữ liệu hiện tại (nếu cần)
-- Đặt xen_total_produced_quantity = xen_good_quantity + xen_ng_quantity cho các lệnh đã hoàn thành XEN
UPDATE production_orders 
SET xen_total_produced_quantity = COALESCE(xen_good_quantity, 0) + COALESCE(xen_ng_quantity, 0),
    xen_total_shifts_completed = CASE 
        WHEN xen_status = 'completed' THEN 1 
        ELSE 0 
    END
WHERE xen_status = 'completed';

-- Đặt xa_total_produced_quantity = xa_good_quantity + xa_ng_quantity cho các lệnh đã hoàn thành XA
UPDATE production_orders 
SET xa_total_produced_quantity = COALESCE(xa_good_quantity, 0) + COALESCE(xa_ng_quantity, 0),
    xa_total_shifts_completed = CASE 
        WHEN xa_status = 'completed' THEN 1 
        ELSE 0 
    END
WHERE xa_status = 'completed';

-- Hiển thị thông tin về các cột đã thêm
SELECT 
    COLUMN_NAME,
    DATA_TYPE,
    IS_NULLABLE,
    COLUMN_DEFAULT,
    COLUMN_COMMENT
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_SCHEMA = 'autoslp'
AND TABLE_NAME = 'production_orders'
AND COLUMN_NAME LIKE '%_total_produced_quantity' 
   OR COLUMN_NAME LIKE '%_total_shifts_completed'
   OR COLUMN_NAME LIKE '%_current_shift_start'
   OR COLUMN_NAME LIKE '%_current_shift_end'
   OR COLUMN_NAME LIKE '%_shift_data'
   OR COLUMN_NAME LIKE '%_allow_multiple_shifts'
   OR COLUMN_NAME LIKE '%_ng_start_end_quantity'
   OR COLUMN_NAME LIKE '%_return_quantity'
ORDER BY COLUMN_NAME;
