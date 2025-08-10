-- =========================================
-- STAGE HANDOVERS DATABASE SETUP
-- Tạo bảng stage_handovers để lưu dữ liệu bàn giao công đoạn
-- =========================================

-- Tạo bảng stage_handovers
CREATE TABLE IF NOT EXISTS `stage_handovers` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `production_order_id` int(11) NOT NULL COMMENT 'ID lệnh sản xuất từ bảng production_orders',
  `stage` varchar(50) NOT NULL COMMENT 'Công đoạn hiện tại (xa, xen, in, boi, be, dan, kho)',
  `from_stage` varchar(50) DEFAULT NULL COMMENT 'Công đoạn trước đó',
  `to_stage` varchar(50) DEFAULT NULL COMMENT 'Công đoạn tiếp theo',
  
  -- Thông tin số lượng
  `handover_quantity` int(11) NOT NULL DEFAULT 0 COMMENT 'Số lượng bàn giao',
  `good_quantity` int(11) NOT NULL DEFAULT 0 COMMENT 'Số lượng đạt/OK',
  `ng_quantity` int(11) NOT NULL DEFAULT 0 COMMENT 'Số lượng NG/lỗi',
  `ng_start_end_quantity` int(11) NOT NULL DEFAULT 0 COMMENT 'Số lượng NG đầu/cuối',
  `return_quantity` int(11) NOT NULL DEFAULT 0 COMMENT 'Số lượng tồn trả',
  
  -- Thông tin bàn giao
  `handover_date` date NOT NULL COMMENT 'Ngày bàn giao',
  `handover_shift` varchar(20) DEFAULT 'Ca 1' COMMENT 'Ca bàn giao',
  `handover_machine` varchar(100) DEFAULT NULL COMMENT 'Máy thực hiện',
  `handover_person` varchar(100) DEFAULT NULL COMMENT 'Người bàn giao',
  `receiver_person` varchar(100) DEFAULT NULL COMMENT 'Người nhận',
  `handover_notes` text DEFAULT NULL COMMENT 'Ghi chú bàn giao',
  `stage_notes` text DEFAULT NULL COMMENT 'Ghi chú công đoạn',
  
  -- Thông tin thợ và thời gian
  `worker` varchar(100) DEFAULT NULL COMMENT 'Thợ thực hiện',
  `start_time` time DEFAULT NULL COMMENT 'Giờ bắt đầu',
  `end_time` time DEFAULT NULL COMMENT 'Giờ kết thúc',
  
  -- Trạng thái
  `status` enum('in_progress','completed','cancelled') NOT NULL DEFAULT 'completed' COMMENT 'Trạng thái bàn giao',
  
  -- Thông tin hệ thống
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Thời gian tạo',
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Thời gian cập nhật',
  
  PRIMARY KEY (`id`),
  KEY `idx_production_order_id` (`production_order_id`),
  KEY `idx_stage` (`stage`),
  KEY `idx_handover_date` (`handover_date`),
  KEY `idx_status` (`status`),
  
  -- Foreign key constraint
  CONSTRAINT `fk_stage_handovers_production_order` 
    FOREIGN KEY (`production_order_id`) 
    REFERENCES `production_orders` (`id`) 
    ON DELETE CASCADE ON UPDATE CASCADE
    
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Bảng lưu trữ dữ liệu bàn giao công đoạn sản xuất';

-- =========================================
-- SAMPLE DATA (optional)
-- =========================================

-- Insert một số dữ liệu mẫu để test
INSERT INTO `stage_handovers` (
  `production_order_id`, `stage`, `from_stage`, `to_stage`,
  `handover_quantity`, `good_quantity`, `ng_quantity`, `ng_start_end_quantity`, `return_quantity`,
  `handover_date`, `handover_shift`, `handover_machine`, 
  `handover_person`, `receiver_person`, `handover_notes`, `stage_notes`,
  `worker`, `start_time`, `end_time`, `status`
) VALUES
-- Bàn giao từ công đoạn XẢ sang XÉN
(1, 'xa', NULL, 'xen', 1000, 950, 30, 10, 10, '2025-07-30', 'Ca 1', 'Máy xả 1', 
 'Nguyễn Văn A', 'Trần Văn B', 'Bàn giao đầy đủ, chất lượng tốt', 'Hoàn thành công đoạn xả', 
 'Nguyễn Văn A', '08:00:00', '12:00:00', 'completed'),

-- Bàn giao từ công đoạn XÉN sang IN
(1, 'xen', 'xa', 'in', 950, 920, 20, 5, 5, '2025-07-30', 'Ca 2', 'Máy xén 1',
 'Trần Văn B', 'Lê Văn C', 'Đã xén theo đúng kích thước', 'Xén chuẩn, không lỗi',
 'Trần Văn B', '13:00:00', '17:00:00', 'completed'),

-- Bàn giao từ công đoạn IN sang BỒI  
(1, 'in', 'xen', 'boi', 920, 900, 15, 3, 2, '2025-07-30', 'Ca 3', 'Máy in offset 1',
 'Lê Văn C', 'Phạm Văn D', 'In 4 màu, chất lượng đạt yêu cầu', 'Hoàn thành in ấn',
 'Lê Văn C', '18:00:00', '22:00:00', 'completed');

-- =========================================
-- INDEXES FOR PERFORMANCE
-- =========================================

-- Tạo index compound cho các truy vấn thường dùng
CREATE INDEX `idx_stage_date` ON `stage_handovers` (`stage`, `handover_date`);
CREATE INDEX `idx_production_stage` ON `stage_handovers` (`production_order_id`, `stage`);
CREATE INDEX `idx_handover_flow` ON `stage_handovers` (`from_stage`, `to_stage`);

-- =========================================
-- VIEWS FOR REPORTING
-- =========================================

-- Drop views if exist
DROP VIEW IF EXISTS `stage_handovers_summary`;
DROP VIEW IF EXISTS `stage_handovers_detail`;

-- View thống kê bàn giao theo công đoạn
CREATE VIEW `stage_handovers_summary` AS
SELECT 
  sh.stage,
  sh.handover_date,
  COUNT(*) as total_handovers,
  SUM(sh.handover_quantity) as total_handover_qty,
  SUM(sh.good_quantity) as total_good_qty,
  SUM(sh.ng_quantity) as total_ng_qty,
  SUM(sh.ng_start_end_quantity) as total_ng_start_end_qty,
  SUM(sh.return_quantity) as total_return_qty,
  ROUND(AVG(CASE WHEN sh.handover_quantity > 0 THEN sh.good_quantity / sh.handover_quantity * 100 ELSE 0 END), 2) as avg_efficiency
FROM stage_handovers sh
GROUP BY sh.stage, sh.handover_date
ORDER BY sh.handover_date DESC, sh.stage;

-- View chi tiết bàn giao với thông tin lệnh sản xuất
CREATE VIEW `stage_handovers_detail` AS
SELECT 
  sh.*,
  po.production_order,
  po.po_number,
  po.product_name,
  po.customer_name,
  po.internal_product_code,
  po.paper_type,
  po.paper_weight,
  po.deployed_quantity as order_deployed_qty,
  ROUND(sh.good_quantity / sh.handover_quantity * 100, 2) as efficiency_percent,
  CASE 
    WHEN sh.handover_quantity = sh.good_quantity THEN 'Hoàn hảo'
    WHEN sh.good_quantity / sh.handover_quantity >= 0.95 THEN 'Tốt'
    WHEN sh.good_quantity / sh.handover_quantity >= 0.90 THEN 'Khá'
    ELSE 'Cần cải thiện'
  END as quality_rating
FROM stage_handovers sh
LEFT JOIN production_orders po ON sh.production_order_id = po.id
ORDER BY sh.handover_date DESC, sh.created_at DESC;

-- =========================================
-- FUNCTIONS FOR VALIDATION
-- =========================================

-- Drop function if exists
DROP FUNCTION IF EXISTS validate_handover_quantity;

-- Function kiểm tra số lượng bàn giao hợp lệ
DELIMITER //
CREATE FUNCTION validate_handover_quantity(
  p_handover_qty INT,
  p_good_qty INT,
  p_ng_qty INT
) RETURNS BOOLEAN
READS SQL DATA
DETERMINISTIC
BEGIN
  -- Kiểm tra số lượng bàn giao >= số lượng good + ng
  IF p_handover_qty >= (p_good_qty + p_ng_qty) THEN
    RETURN TRUE;
  ELSE
    RETURN FALSE;
  END IF;
END //
DELIMITER ;

-- =========================================
-- TRIGGERS FOR DATA INTEGRITY
-- =========================================

-- Drop triggers if exist
DROP TRIGGER IF EXISTS `stage_handovers_before_insert`;
DROP TRIGGER IF EXISTS `stage_handovers_before_update`;

-- Trigger kiểm tra dữ liệu trước khi insert
DELIMITER //
CREATE TRIGGER `stage_handovers_before_insert`
BEFORE INSERT ON `stage_handovers`
FOR EACH ROW
BEGIN
  -- Kiểm tra số lượng bàn giao phải > 0
  IF NEW.handover_quantity <= 0 THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Số lượng bàn giao phải lớn hơn 0';
  END IF;
  
  -- Kiểm tra số lượng good không được lớn hơn số lượng bàn giao
  IF NEW.good_quantity > NEW.handover_quantity THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Số lượng đạt không được lớn hơn số lượng bàn giao';
  END IF;
  
  -- Kiểm tra tổng good + ng không được lớn hơn handover
  IF (NEW.good_quantity + NEW.ng_quantity + NEW.ng_start_end_quantity) > NEW.handover_quantity THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Tổng số lượng đạt + NG không được lớn hơn số lượng bàn giao';
  END IF;
END //
DELIMITER ;

-- Trigger kiểm tra dữ liệu trước khi update  
DELIMITER //
CREATE TRIGGER `stage_handovers_before_update`
BEFORE UPDATE ON `stage_handovers`
FOR EACH ROW
BEGIN
  -- Kiểm tra số lượng bàn giao phải > 0
  IF NEW.handover_quantity <= 0 THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Số lượng bàn giao phải lớn hơn 0';
  END IF;
  
  -- Kiểm tra số lượng good không được lớn hơn số lượng bàn giao
  IF NEW.good_quantity > NEW.handover_quantity THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Số lượng đạt không được lớn hơn số lượng bàn giao';
  END IF;
  
  -- Kiểm tra tổng good + ng không được lớn hơn handover
  IF (NEW.good_quantity + NEW.ng_quantity + NEW.ng_start_end_quantity) > NEW.handover_quantity THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Tổng số lượng đạt + NG không được lớn hơn số lượng bàn giao';
  END IF;
END //
DELIMITER ;

-- =========================================
-- SECURITY & PERMISSIONS
-- =========================================

-- Tạo user chuyên dụng cho stage handovers (optional)
-- CREATE USER 'stage_user'@'localhost' IDENTIFIED BY 'secure_password';
-- GRANT SELECT, INSERT, UPDATE ON autoslp.stage_handovers TO 'stage_user'@'localhost';
-- GRANT SELECT ON autoslp.production_orders TO 'stage_user'@'localhost';

-- =========================================
-- BACKUP & MAINTENANCE
-- =========================================

-- Drop procedure if exists
DROP PROCEDURE IF EXISTS archive_old_handovers;

-- Procedure để archive dữ liệu cũ (chạy hàng tháng)
DELIMITER //
CREATE PROCEDURE archive_old_handovers(IN months_old INT)
BEGIN
  DECLARE EXIT HANDLER FOR SQLEXCEPTION
  BEGIN
    ROLLBACK;
    RESIGNAL;
  END;
  
  START TRANSACTION;
  
  -- Tạo bảng archive nếu chưa có
  CREATE TABLE IF NOT EXISTS `stage_handovers_archive` LIKE `stage_handovers`;
  
  -- Copy dữ liệu cũ vào archive
  INSERT INTO `stage_handovers_archive`
  SELECT * FROM `stage_handovers`
  WHERE handover_date < DATE_SUB(CURDATE(), INTERVAL months_old MONTH);
  
  -- Xóa dữ liệu cũ khỏi bảng chính
  DELETE FROM `stage_handovers`
  WHERE handover_date < DATE_SUB(CURDATE(), INTERVAL months_old MONTH);
  
  COMMIT;
  
  SELECT CONCAT('Đã archive ', ROW_COUNT(), ' bản ghi cũ hơn ', months_old, ' tháng') AS result;
END //
DELIMITER ;

-- =========================================
-- COMPLETION MESSAGE
-- =========================================
SELECT 'Stage Handovers Database Setup Complete!' as status,
       'Bảng stage_handovers đã được tạo thành công!' as message,
       'Có thể sử dụng các API endpoints để lưu dữ liệu bàn giao' as note;
