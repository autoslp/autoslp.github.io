-- Cách 1 Tối ưu: Hỗ trợ nhiều công đoạn
-- Chỉ tạo những thứ thực sự cần thiết

-- 1. Thêm trường machine_id cho tất cả công đoạn
ALTER TABLE production_orders 
ADD COLUMN xa_machine_id VARCHAR(50) AFTER xa_machine_name,
ADD COLUMN xen_machine_id VARCHAR(50) AFTER xen_machine_name,
ADD COLUMN in_offset_machine_id VARCHAR(50) AFTER in_offset_machine_name,
ADD COLUMN boi_machine_id VARCHAR(50) AFTER boi_machine_name,
ADD COLUMN be_machine_id VARCHAR(50) AFTER be_machine_name,
ADD COLUMN dan_may_machine_id VARCHAR(50) AFTER dan_may_machine_name,
ADD COLUMN nhap_kho_machine_id VARCHAR(50) AFTER nhap_kho_machine_name;

-- 2. Tạo bảng danh sách máy (chỉ những thứ cần thiết)
CREATE TABLE IF NOT EXISTS production_machines (
    id INT AUTO_INCREMENT PRIMARY KEY,
    stage VARCHAR(50) NOT NULL,
    machine_id VARCHAR(50) NOT NULL,
    machine_name VARCHAR(100) NOT NULL,
    status ENUM('active', 'inactive') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_machine (stage, machine_id)
);

-- 3. Insert dữ liệu máy cho các công đoạn chính
INSERT INTO production_machines (stage, machine_id, machine_name) VALUES
-- Xả
('xa', 'XA001', 'Máy Xả 1'),
('xa', 'XA002', 'Máy Xả 2'),
('xa', 'XA003', 'Máy Xả 3'),
-- Xén
('xen', 'XEN001', 'Máy Xén 1'),
('xen', 'XEN002', 'Máy Xén 2'),
('xen', 'XEN003', 'Máy Xén 3'),
-- In Offset
('in_offset', 'IN001', 'Máy In Offset 1'),
('in_offset', 'IN002', 'Máy In Offset 2'),
-- Bồi
('boi', 'BOI001', 'Máy Bồi 1'),
('boi', 'BOI002', 'Máy Bồi 2'),
-- Bế
('be', 'BE001', 'Máy Bế 1'),
('be', 'BE002', 'Máy Bế 2'),
-- Dán máy
('dan_may', 'DAN001', 'Máy Dán 1'),
('dan_may', 'DAN002', 'Máy Dán 2'),
-- Nhập kho
('nhap_kho', 'KHO001', 'Khu vực Kho 1'),
('nhap_kho', 'KHO002', 'Khu vực Kho 2');

-- 4. Function kiểm tra máy có đang chạy không (tự động cho mọi stage)
DELIMITER //
CREATE FUNCTION IF NOT EXISTS IsMachineRunning(p_stage VARCHAR(50), p_machine_id VARCHAR(50))
RETURNS BOOLEAN
READS SQL DATA
DETERMINISTIC
BEGIN
    DECLARE v_count INT DEFAULT 0;
    
    SET @sql = CONCAT('
        SELECT COUNT(*) INTO @count
        FROM production_orders 
        WHERE ', p_stage, '_machine_id = ? 
        AND ', p_stage, '_start_time IS NOT NULL 
        AND ', p_stage, '_end_time IS NULL 
        AND ', p_stage, '_status != "completed"
    ');
    
    PREPARE stmt FROM @sql;
    EXECUTE stmt USING p_machine_id;
    DEALLOCATE PREPARE stmt;
    
    RETURN @count > 0;
END//

DELIMITER ;

-- 5. Function lấy danh sách máy rảnh (tự động cho mọi stage)
DELIMITER //
CREATE FUNCTION IF NOT EXISTS GetAvailableMachines(p_stage VARCHAR(50))
RETURNS TEXT
READS SQL DATA
DETERMINISTIC
BEGIN
    DECLARE v_result TEXT DEFAULT '';
    
    SELECT GROUP_CONCAT(machine_id SEPARATOR ',') INTO v_result
    FROM production_machines 
    WHERE stage = p_stage 
    AND status = 'active'
    AND machine_id NOT IN (
        SELECT DISTINCT 
            CASE 
                WHEN p_stage = 'xa' THEN xa_machine_id
                WHEN p_stage = 'xen' THEN xen_machine_id
                WHEN p_stage = 'in_offset' THEN in_offset_machine_id
                WHEN p_stage = 'boi' THEN boi_machine_id
                WHEN p_stage = 'be' THEN be_machine_id
                WHEN p_stage = 'dan_may' THEN dan_may_machine_id
                WHEN p_stage = 'nhap_kho' THEN nhap_kho_machine_id
            END
        FROM production_orders 
        WHERE (p_stage = 'xa' AND xa_start_time IS NOT NULL AND xa_end_time IS NULL AND xa_status != 'completed')
           OR (p_stage = 'xen' AND xen_start_time IS NOT NULL AND xen_end_time IS NULL AND xen_status != 'completed')
           OR (p_stage = 'in_offset' AND in_offset_start_time IS NOT NULL AND in_offset_end_time IS NULL AND in_offset_status != 'completed')
           OR (p_stage = 'boi' AND boi_start_time IS NOT NULL AND boi_end_time IS NULL AND boi_status != 'completed')
           OR (p_stage = 'be' AND be_start_time IS NOT NULL AND be_end_time IS NULL AND be_status != 'completed')
           OR (p_stage = 'dan_may' AND dan_may_start_time IS NOT NULL AND dan_may_end_time IS NULL AND dan_may_status != 'completed')
           OR (p_stage = 'nhap_kho' AND nhap_kho_start_time IS NOT NULL AND nhap_kho_end_time IS NULL AND nhap_kho_status != 'completed')
    );
    
    RETURN IFNULL(v_result, '');
END//

DELIMITER ;

-- 6. Stored Procedure bắt đầu sản xuất (tự động cho mọi stage)
DELIMITER //
CREATE PROCEDURE IF NOT EXISTS StartProductionOnMachine(
    IN p_stage VARCHAR(50),
    IN p_order_id INT,
    IN p_machine_id VARCHAR(50),
    IN p_worker_name VARCHAR(100),
    IN p_note TEXT
)
BEGIN
    DECLARE v_machine_running BOOLEAN DEFAULT FALSE;
    DECLARE v_running_order VARCHAR(100) DEFAULT '';
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;
    
    START TRANSACTION;
    
    -- Kiểm tra máy có đang chạy không
    SET v_machine_running = IsMachineRunning(p_stage, p_machine_id);
    
    IF v_machine_running THEN
        -- Lấy thông tin lệnh đang chạy
        SET @sql = CONCAT('
            SELECT production_order INTO @running_order
            FROM production_orders 
            WHERE ', p_stage, '_machine_id = ? 
            AND ', p_stage, '_start_time IS NOT NULL 
            AND ', p_stage, '_end_time IS NULL 
            AND ', p_stage, '_status != "completed"
        ');
        
        PREPARE stmt FROM @sql;
        EXECUTE stmt USING p_machine_id;
        DEALLOCATE PREPARE stmt;
        
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = CONCAT('Máy ', p_machine_id, ' đang chạy lệnh ', @running_order, '. Vui lòng chọn máy khác.');
    END IF;
    
    -- Bắt đầu lệnh mới trên máy được chọn
    SET @sql = CONCAT('
        UPDATE production_orders 
        SET ', p_stage, '_start_time = NOW(),
            ', p_stage, '_status = "in_progress",
            ', p_stage, '_machine_id = ?,
            ', p_stage, '_worker_name = ?,
            ', p_stage, '_note = ?
        WHERE id = ?
    ');
    
    PREPARE stmt FROM @sql;
    EXECUTE stmt USING p_machine_id, p_worker_name, p_note, p_order_id;
    DEALLOCATE PREPARE stmt;
    
    COMMIT;
END//

DELIMITER ;

-- 7. View trạng thái máy (tự động cho mọi stage)
CREATE OR REPLACE VIEW v_machine_status AS
SELECT 
    pm.stage,
    pm.machine_id,
    pm.machine_name,
    pm.status as machine_status,
    CASE 
        WHEN po.id IS NOT NULL THEN 'running'
        ELSE 'available'
    END as production_status,
    po.production_order,
    po.xa_worker_name as worker_name,
    po.xa_start_time as start_time,
    TIMESTAMPDIFF(MINUTE, po.xa_start_time, NOW()) as running_minutes
FROM production_machines pm
LEFT JOIN production_orders po ON 
    (pm.stage = 'xa' AND pm.machine_id = po.xa_machine_id AND po.xa_start_time IS NOT NULL AND po.xa_end_time IS NULL AND po.xa_status != 'completed')
    OR (pm.stage = 'xen' AND pm.machine_id = po.xen_machine_id AND po.xen_start_time IS NOT NULL AND po.xen_end_time IS NULL AND po.xen_status != 'completed')
    OR (pm.stage = 'in_offset' AND pm.machine_id = po.in_offset_machine_id AND po.in_offset_start_time IS NOT NULL AND po.in_offset_end_time IS NULL AND po.in_offset_status != 'completed')
    OR (pm.stage = 'boi' AND pm.machine_id = po.boi_machine_id AND po.boi_start_time IS NOT NULL AND po.boi_end_time IS NULL AND po.boi_status != 'completed')
    OR (pm.stage = 'be' AND pm.machine_id = po.be_machine_id AND po.be_start_time IS NOT NULL AND po.be_end_time IS NULL AND po.be_status != 'completed')
    OR (pm.stage = 'dan_may' AND pm.machine_id = po.dan_may_machine_id AND po.dan_may_start_time IS NOT NULL AND po.dan_may_end_time IS NULL AND po.dan_may_status != 'completed')
    OR (pm.stage = 'nhap_kho' AND pm.machine_id = po.nhap_kho_machine_id AND po.nhap_kho_start_time IS NOT NULL AND po.nhap_kho_end_time IS NULL AND po.nhap_kho_status != 'completed')
WHERE pm.status = 'active'
ORDER BY pm.stage, pm.machine_id;

-- 8. API endpoint để lấy danh sách máy rảnh (thêm vào server.js)
-- GET /api/available_machines/:stage
-- Trả về: { stage: 'xa', available_machines: ['XA001', 'XA002'] }

-- 9. API endpoint để bắt đầu sản xuất (thêm vào server.js)
-- POST /api/start_production/:stage/:order_id
-- Body: { machine_id: 'XA001', worker_name: 'Nguyễn Văn A', note: 'Ghi chú' }

-- 10. Query test
-- SELECT * FROM v_machine_status WHERE stage = 'xa';
-- SELECT GetAvailableMachines('xa') as available_xa_machines;
-- SELECT IsMachineRunning('xa', 'XA001') as xa001_running;
-- CALL StartProductionOnMachine('xa', 1, 'XA001', 'Nguyễn Văn A', 'Test note'); 