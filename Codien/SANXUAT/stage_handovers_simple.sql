-- =========================================
-- STAGE HANDOVERS DATABASE SETUP - SIMPLE VERSION
-- Compatible với tất cả phiên bản MySQL
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
  KEY `idx_stage_date` (`stage`, `handover_date`),
  KEY `idx_production_stage` (`production_order_id`, `stage`),
  KEY `idx_handover_flow` (`from_stage`, `to_stage`)
  
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Bảng lưu trữ dữ liệu bàn giao công đoạn sản xuất';

-- Thêm foreign key constraint (nếu bảng production_orders tồn tại)
-- ALTER TABLE `stage_handovers` 
-- ADD CONSTRAINT `fk_stage_handovers_production_order` 
-- FOREIGN KEY (`production_order_id`) 
-- REFERENCES `production_orders` (`id`) 
-- ON DELETE CASCADE ON UPDATE CASCADE;

-- =========================================
-- SAMPLE DATA
-- =========================================

-- Insert dữ liệu mẫu
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
-- COMPLETION MESSAGE
-- =========================================
SELECT 'Stage Handovers Database Setup Complete!' as status,
       'Bảng stage_handovers đã được tạo thành công!' as message,
       'Sử dụng API để lưu dữ liệu bàn giao' as note;
