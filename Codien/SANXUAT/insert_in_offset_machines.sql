-- Thêm các máy in offset vào bảng production_machines
-- Tạo ngày: 2025-01-27

INSERT INTO `production_machines` (`stage_machine`, `machine_id`, `machine_name`, `current_order_id`, `current_order_code`, `created_at`) VALUES
('Stage_in_offset', 'IN002', '505UV', NULL, NULL, NOW()),
('Stage_in_offset', 'IN003', '505PLV', NULL, NULL, NOW()),
('Stage_in_offset', 'IN004', '506PLV', NULL, NULL, NOW()),
('Stage_in_offset', 'IN005', '706UV', NULL, NULL, NOW()),
('Stage_in_offset', 'IN006', '706PLV', NULL, NULL, NOW()),
('Stage_in_offset', 'IN007', '706DD', NULL, NULL, NOW());

-- Kiểm tra kết quả
SELECT * FROM `production_machines` WHERE `stage_machine` = 'Stage_in_offset' ORDER BY `machine_id` ASC; 