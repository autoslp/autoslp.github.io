-- Cách 2: Trung bình - Bảng Machine Assignments
-- Tách riêng việc quản lý máy và lệnh sản xuất

-- 1. Tạo bảng machine assignments
CREATE TABLE IF NOT EXISTS machine_assignments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    stage VARCHAR(50) NOT NULL,
    machine_id VARCHAR(50) NOT NULL,
    order_id INT NOT NULL,
    production_order VARCHAR(100) NOT NULL,
    worker_name VARCHAR(100),
    start_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    end_time TIMESTAMP NULL,
    status ENUM('running', 'completed', 'cancelled') DEFAULT 'running',
    note TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_machine_running (stage, machine_id, status),
    FOREIGN KEY (order_id) REFERENCES production_orders(id) ON DELETE CASCADE
);

-- 2. Tạo bảng machine inventory
CREATE TABLE IF NOT EXISTS machine_inventory (
    id INT AUTO_INCREMENT PRIMARY KEY,
    stage VARCHAR(50) NOT NULL,
    machine_id VARCHAR(50) NOT NULL,
    machine_name VARCHAR(100) NOT NULL,
    machine_type VARCHAR(100),
    capacity_per_hour INT DEFAULT 1000, -- Sản lượng/giờ
    status ENUM('active', 'inactive', 'maintenance', 'broken') DEFAULT 'active',
    last_maintenance DATE,
    next_maintenance DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_machine (stage, machine_id)
);

-- 3. Insert dữ liệu máy
INSERT INTO machine_inventory (stage, machine_id, machine_name, machine_type, capacity_per_hour) VALUES
('xa', 'XA001', 'Máy Xả 1', 'Slitting Machine', 1200),
('xa', 'XA002', 'Máy Xả 2', 'Slitting Machine', 1000),
('xa', 'XA003', 'Máy Xả 3', 'Slitting Machine', 800),
('xen', 'XEN001', 'Máy Xén 1', 'Cutting Machine', 1500),
('xen', 'XEN002', 'Máy Xén 2', 'Cutting Machine', 1200),
('xen', 'XEN003', 'Máy Xén 3', 'Cutting Machine', 1000);

-- 4. Function kiểm tra máy có rảnh không
DELIMITER //
CREATE FUNCTION IF NOT EXISTS IsMachineAvailable(p_stage VARCHAR(50), p_machine_id VARCHAR(50))
RETURNS BOOLEAN
READS SQL DATA
DETERMINISTIC
BEGIN
    DECLARE v_count INT DEFAULT 0;
    
    SELECT COUNT(*) INTO v_count
    FROM machine_assignments 
    WHERE stage = p_stage 
    AND machine_id = p_machine_id 
    AND status = 'running';
    
    RETURN v_count = 0;
END//

DELIMITER ;

-- 5. Function lấy danh sách máy rảnh
DELIMITER //
CREATE FUNCTION IF NOT EXISTS GetAvailableMachinesList(p_stage VARCHAR(50))
RETURNS TEXT
READS SQL DATA
DETERMINISTIC
BEGIN
    DECLARE v_result TEXT DEFAULT '';
    
    SELECT GROUP_CONCAT(
        CONCAT(machine_id, ':', machine_name, ':', capacity_per_hour) 
        SEPARATOR ';'
    ) INTO v_result
    FROM machine_inventory 
    WHERE stage = p_stage 
    AND status = 'active'
    AND machine_id NOT IN (
        SELECT machine_id 
        FROM machine_assignments 
        WHERE stage = p_stage AND status = 'running'
    );
    
    RETURN IFNULL(v_result, '');
END//

DELIMITER ;

-- 6. Stored Procedure bắt đầu sản xuất
DELIMITER //
CREATE PROCEDURE IF NOT EXISTS AssignMachineToOrder(
    IN p_stage VARCHAR(50),
    IN p_order_id INT,
    IN p_machine_id VARCHAR(50),
    IN p_worker_name VARCHAR(100),
    IN p_note TEXT
)
BEGIN
    DECLARE v_production_order VARCHAR(100) DEFAULT '';
    DECLARE v_machine_available BOOLEAN DEFAULT FALSE;
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;
    
    START TRANSACTION;
    
    -- Lấy thông tin lệnh sản xuất
    SELECT production_order INTO v_production_order
    FROM production_orders 
    WHERE id = p_order_id;
    
    IF v_production_order = '' THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Không tìm thấy lệnh sản xuất';
    END IF;
    
    -- Kiểm tra máy có rảnh không
    SET v_machine_available = IsMachineAvailable(p_stage, p_machine_id);
    
    IF NOT v_machine_available THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = CONCAT('Máy ', p_machine_id, ' đang bận. Vui lòng chọn máy khác.');
    END IF;
    
    -- Tạo assignment mới
    INSERT INTO machine_assignments (
        stage, machine_id, order_id, production_order, 
        worker_name, start_time, status, note
    ) VALUES (
        p_stage, p_machine_id, p_order_id, v_production_order,
        p_worker_name, NOW(), 'running', p_note
    );
    
    -- Cập nhật trạng thái lệnh sản xuất
    SET @sql = CONCAT('
        UPDATE production_orders 
        SET ', p_stage, '_start_time = NOW(),
            ', p_stage, '_status = "in_progress",
            ', p_stage, '_machine_id = ?,
            ', p_stage, '_worker_name = ?
        WHERE id = ?
    ');
    
    PREPARE stmt FROM @sql;
    EXECUTE stmt USING p_machine_id, p_worker_name, p_order_id;
    DEALLOCATE PREPARE stmt;
    
    COMMIT;
END//

DELIMITER ;

-- 7. Stored Procedure kết thúc sản xuất
DELIMITER //
CREATE PROCEDURE IF NOT EXISTS CompleteMachineAssignment(
    IN p_stage VARCHAR(50),
    IN p_order_id INT,
    IN p_output_quantity INT,
    IN p_good_quantity INT,
    IN p_ng_quantity INT
)
BEGIN
    DECLARE v_machine_id VARCHAR(50) DEFAULT '';
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;
    
    START TRANSACTION;
    
    -- Lấy machine_id từ assignment
    SELECT machine_id INTO v_machine_id
    FROM machine_assignments 
    WHERE stage = p_stage 
    AND order_id = p_order_id 
    AND status = 'running';
    
    IF v_machine_id = '' THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Không tìm thấy assignment cho lệnh này';
    END IF;
    
    -- Cập nhật assignment
    UPDATE machine_assignments 
    SET end_time = NOW(),
        status = 'completed'
    WHERE stage = p_stage 
    AND order_id = p_order_id 
    AND status = 'running';
    
    -- Cập nhật lệnh sản xuất
    SET @sql = CONCAT('
        UPDATE production_orders 
        SET ', p_stage, '_end_time = NOW(),
            ', p_stage, '_status = "completed",
            ', p_stage, '_output_quantity = ?,
            ', p_stage, '_good_quantity = ?,
            ', p_stage, '_ng_quantity = ?
        WHERE id = ?
    ');
    
    PREPARE stmt FROM @sql;
    EXECUTE stmt USING p_output_quantity, p_good_quantity, p_ng_quantity, p_order_id;
    DEALLOCATE PREPARE stmt;
    
    COMMIT;
END//

DELIMITER ;

-- 8. View trạng thái máy chi tiết
CREATE OR REPLACE VIEW v_detailed_machine_status AS
SELECT 
    mi.stage,
    mi.machine_id,
    mi.machine_name,
    mi.machine_type,
    mi.capacity_per_hour,
    mi.status as machine_status,
    CASE 
        WHEN ma.id IS NOT NULL THEN 'running'
        ELSE 'available'
    END as production_status,
    ma.production_order,
    ma.worker_name,
    ma.start_time,
    TIMESTAMPDIFF(MINUTE, ma.start_time, NOW()) as running_minutes,
    ma.note
FROM machine_inventory mi
LEFT JOIN machine_assignments ma ON 
    mi.stage = ma.stage 
    AND mi.machine_id = ma.machine_id 
    AND ma.status = 'running'
WHERE mi.status IN ('active', 'maintenance')
ORDER BY mi.stage, mi.machine_id;

-- 9. Query test
-- SELECT * FROM v_detailed_machine_status WHERE stage = 'xa';
-- SELECT GetAvailableMachinesList('xa') as available_machines;
-- SELECT IsMachineAvailable('xa', 'XA001') as xa001_available;
-- CALL AssignMachineToOrder('xa', 1, 'XA001', 'Nguyễn Văn A', 'Test assignment');
-- CALL CompleteMachineAssignment('xa', 1, 1000, 950, 50); 