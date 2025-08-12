-- =====================================================
-- TẠO BẢNG PRODUCTION_ORDERS_SHIFT
-- Lưu trữ thông tin chi tiết theo từng ca làm việc
-- =====================================================

CREATE TABLE IF NOT EXISTS `production_orders_shift` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  
  -- Thông tin liên kết với production_orders
  `production_order_id` int(11) NOT NULL,
  `production_order` varchar(100) DEFAULT NULL COMMENT 'Mã lệnh sản xuất',
  `stage` varchar(50) NOT NULL COMMENT 'Tên công đoạn (xa, xen, in_offset, boi, be, dan_may, kho)',
  
  -- Thông tin ca làm việc
  `shift_number` int(11) NOT NULL COMMENT 'Số thứ tự ca (1, 2, 3...)',
  `shift_name` varchar(50) DEFAULT NULL COMMENT 'Tên ca (Ca 1, Ca 2, Ca 3, Kíp 1, Kíp 2)',
  `shift_date` date DEFAULT NULL COMMENT 'Ngày làm việc của ca',
  
  -- Thông tin sản xuất theo ca
  `input_quantity` int(11) DEFAULT 0 COMMENT 'Số lượng đầu vào ca này',
  `output_quantity` int(11) DEFAULT 0 COMMENT 'Tổng số lượng sản xuất ca này',
  `good_quantity` int(11) DEFAULT 0 COMMENT 'Số lượng OK ca này',
  `ng_quantity` int(11) DEFAULT 0 COMMENT 'Số lượng NG ca này',
  `ng_start_end_quantity` int(11) DEFAULT 0 COMMENT 'NG đầu/cuối ca',
  `return_quantity` int(11) DEFAULT 0 COMMENT 'Hàng trả ca này',
  `handover_quantity` int(11) DEFAULT 0 COMMENT 'Số lượng bàn giao ca này',
  
  -- Thông tin thời gian
  `start_time` datetime DEFAULT NULL COMMENT 'Thời gian bắt đầu ca',
  `end_time` datetime DEFAULT NULL COMMENT 'Thời gian kết thúc ca',
  `work_duration_minutes` int(11) DEFAULT 0 COMMENT 'Thời gian làm việc (phút)',
  `break_duration_minutes` int(11) DEFAULT 0 COMMENT 'Thời gian nghỉ (phút)',
  
  -- Thông tin nhân sự
  `worker_name` varchar(100) DEFAULT NULL COMMENT 'Thợ phụ trách ca này',
  `machine_name` varchar(100) DEFAULT NULL COMMENT 'Máy sử dụng ca này',
  `handover_person` varchar(100) DEFAULT NULL COMMENT 'Người bàn giao',
  `receiver_person` varchar(100) DEFAULT NULL COMMENT 'Người nhận',
  
  -- Thông tin chất lượng
  `ng_reason` text COMMENT 'Lý do NG',
  `efficiency_percent` decimal(5,2) DEFAULT 0.00 COMMENT 'Hiệu suất (%)',
  `quality_score` decimal(3,2) DEFAULT 0.00 COMMENT 'Điểm chất lượng (0-10)',
  
  -- Trạng thái và ghi chú
  `status` enum('in_progress','completed','paused','cancelled') DEFAULT 'in_progress',
  `notes` text COMMENT 'Ghi chú ca này',
  `quality_notes` text COMMENT 'Ghi chú chất lượng',
  
  -- Thông tin bổ sung
  `is_overtime` tinyint(1) DEFAULT 0 COMMENT 'Có làm thêm giờ không',
  `overtime_hours` decimal(4,2) DEFAULT 0.00 COMMENT 'Số giờ làm thêm',
  `is_night_shift` tinyint(1) DEFAULT 0 COMMENT 'Có phải ca đêm không',
  
  -- Timestamps
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  PRIMARY KEY (`id`),
  
  -- Indexes
  KEY `idx_production_order` (`production_order_id`),
  KEY `idx_stage` (`stage`),
  KEY `idx_shift_number` (`shift_number`),
  KEY `idx_shift_date` (`shift_date`),
  KEY `idx_start_time` (`start_time`),
  KEY `idx_worker` (`worker_name`),
  KEY `idx_machine` (`machine_name`),
  KEY `idx_status` (`status`),
  
  -- Unique constraint: Một lệnh sản xuất chỉ có 1 ca số X cho mỗi công đoạn
  UNIQUE KEY `unique_order_stage_shift` (`production_order_id`, `stage`, `shift_number`),
  
  -- Foreign key
  CONSTRAINT `fk_production_orders_shift_order` 
    FOREIGN KEY (`production_order_id`) 
    REFERENCES `production_orders` (`id`) 
    ON DELETE CASCADE 
    ON UPDATE CASCADE
  
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Bảng lưu trữ thông tin chi tiết theo từng ca làm việc';

-- =====================================================
-- TẠO STORED PROCEDURE ĐỂ TỰ ĐỘNG CẬP NHẬT TỔNG SỐ LƯỢNG
-- =====================================================

DELIMITER $$

CREATE PROCEDURE `UpdateProductionOrderTotals`(IN order_id INT, IN stage_name VARCHAR(50))
BEGIN
    DECLARE total_good INT DEFAULT 0;
    DECLARE total_ng INT DEFAULT 0;
    DECLARE total_output INT DEFAULT 0;
    DECLARE total_handover INT DEFAULT 0;
    
    -- Tính tổng từ bảng shift
    SELECT 
        COALESCE(SUM(good_quantity), 0),
        COALESCE(SUM(ng_quantity), 0),
        COALESCE(SUM(output_quantity), 0),
        COALESCE(SUM(handover_quantity), 0)
    INTO total_good, total_ng, total_output, total_handover
    FROM production_orders_shift 
    WHERE production_order_id = order_id AND stage = stage_name;
    
    -- Cập nhật vào bảng production_orders sử dụng CASE WHEN
    IF stage_name = 'xa' THEN
        UPDATE production_orders 
        SET 
            xa_good_quantity = total_good,
            xa_ng_quantity = total_ng,
            xa_output_quantity = total_output,
            xa_handover_quantity = total_handover,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = order_id;
    ELSEIF stage_name = 'xen' THEN
        UPDATE production_orders 
        SET 
            xen_good_quantity = total_good,
            xen_ng_quantity = total_ng,
            xen_output_quantity = total_output,
            xen_handover_quantity = total_handover,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = order_id;
    ELSEIF stage_name = 'in_offset' THEN
        UPDATE production_orders 
        SET 
            in_offset_good_quantity = total_good,
            in_offset_ng_quantity = total_ng,
            in_offset_output_quantity = total_output,
            in_offset_handover_quantity = total_handover,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = order_id;
    ELSEIF stage_name = 'boi' THEN
        UPDATE production_orders 
        SET 
            boi_good_quantity = total_good,
            boi_ng_quantity = total_ng,
            boi_output_quantity = total_output,
            boi_handover_quantity = total_handover,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = order_id;
    ELSEIF stage_name = 'be' THEN
        UPDATE production_orders 
        SET 
            be_good_quantity = total_good,
            be_ng_quantity = total_ng,
            be_output_quantity = total_output,
            be_handover_quantity = total_handover,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = order_id;
    ELSEIF stage_name = 'dan_may' THEN
        UPDATE production_orders 
        SET 
            dan_may_good_quantity = total_good,
            dan_may_ng_quantity = total_ng,
            dan_may_output_quantity = total_output,
            dan_may_handover_quantity = total_handover,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = order_id;
    ELSEIF stage_name = 'kho' THEN
        UPDATE production_orders 
        SET 
            kho_good_quantity = total_good,
            kho_ng_quantity = total_ng,
            kho_output_quantity = total_output,
            kho_handover_quantity = total_handover,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = order_id;
    END IF;
    
END$$

DELIMITER ;

-- =====================================================
-- TẠO TRIGGER ĐỂ TỰ ĐỘNG CẬP NHẬT KHI THAY ĐỔI SHIFT
-- =====================================================

DELIMITER $$

CREATE TRIGGER `tr_production_orders_shift_after_update`
AFTER UPDATE ON `production_orders_shift`
FOR EACH ROW
BEGIN
    -- Tự động cập nhật tổng số lượng khi có thay đổi
    CALL UpdateProductionOrderTotals(NEW.production_order_id, NEW.stage);
END$$

CREATE TRIGGER `tr_production_orders_shift_after_insert`
AFTER INSERT ON `production_orders_shift`
FOR EACH ROW
BEGIN
    -- Tự động cập nhật tổng số lượng khi thêm mới
    CALL UpdateProductionOrderTotals(NEW.production_order_id, NEW.stage);
END$$

CREATE TRIGGER `tr_production_orders_shift_after_delete`
AFTER DELETE ON `production_orders_shift`
FOR EACH ROW
BEGIN
    -- Tự động cập nhật tổng số lượng khi xóa
    CALL UpdateProductionOrderTotals(OLD.production_order_id, OLD.stage);
END$$

DELIMITER ;

-- =====================================================
-- INSERT DỮ LIỆU MẪU ĐỂ TEST
-- =====================================================

-- Thêm dữ liệu mẫu cho lệnh sản xuất ID = 2
INSERT INTO `production_orders_shift` (
    `production_order_id`, `production_order`, `stage`, `shift_number`, `shift_name`, `shift_date`,
    `input_quantity`, `output_quantity`, `good_quantity`, `ng_quantity`, `handover_quantity`,
    `start_time`, `end_time`, `worker_name`, `machine_name`, `status`
) VALUES 
-- Ca 1 của công đoạn XẢ
(2, '123456', 'xa', 1, 'Ca 1', '2025-03-11', 
 1000, 950, 900, 50, 900,
 '2025-03-11 06:00:00', '2025-03-11 14:00:00', 'Nguyễn Văn A', 'Xả 1', 'completed'),

-- Ca 2 của công đoạn XẢ  
(2, '123456', 'xa', 2, 'Ca 2', '2025-03-11',
 1000, 980, 950, 30, 950,
 '2025-03-11 14:00:00', '2025-03-11 22:00:00', 'Trần Thị B', 'Xả 1', 'completed'),

-- Ca 3 của công đoạn XẢ
(2, '123456', 'xa', 3, 'Ca 3', '2025-03-12',
 1000, 970, 920, 50, 920,
 '2025-03-11 22:00:00', '2025-03-12 06:00:00', 'Lê Văn C', 'Xả 1', 'completed'),

-- Ca 1 của công đoạn XÉN
(2, '123456', 'xen', 1, 'Ca 1', '2025-03-12',
 900, 850, 800, 50, 800,
 '2025-03-12 06:00:00', '2025-03-12 14:00:00', 'Phạm Thị D', 'Xén 1', 'completed'),

-- Ca 2 của công đoạn XÉN
(2, '123456', 'xen', 2, 'Ca 2', '2025-03-12',
 950, 900, 850, 50, 850,
 '2025-03-12 14:00:00', '2025-03-12 22:00:00', 'Hoàng Văn E', 'Xén 1', 'completed');

-- =====================================================
-- TẠO INDEXES BỔ SUNG ĐỂ TỐI ƯU HIỆU SUẤT
-- =====================================================

-- Index cho tìm kiếm theo ngày
CREATE INDEX `idx_shift_date_stage` ON `production_orders_shift` (`shift_date`, `stage`);

-- Index cho tìm kiếm theo worker và ngày
CREATE INDEX `idx_worker_date` ON `production_orders_shift` (`worker_name`, `shift_date`);

-- Index cho tìm kiếm theo machine và ngày  
CREATE INDEX `idx_machine_date` ON `production_orders_shift` (`machine_name`, `shift_date`);

-- Index cho thống kê theo thời gian
CREATE INDEX `idx_start_time_stage` ON `production_orders_shift` (`start_time`, `stage`); 