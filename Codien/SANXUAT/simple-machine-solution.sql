-- Giải pháp đơn giản: 1 bảng máy + gửi/xóa lệnh

-- 1. Tạo bảng máy đơn giản
CREATE TABLE IF NOT EXISTS production_machines (
    id INT AUTO_INCREMENT PRIMARY KEY,
    machine_id VARCHAR(50) NOT NULL UNIQUE,
    machine_name VARCHAR(100) NOT NULL,
    current_order_id INT NULL, -- Lệnh đang chạy (NULL = rảnh)
    current_order_code VARCHAR(100) NULL, -- Mã lệnh đang chạy
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Thêm dữ liệu máy
INSERT INTO production_machines (machine_id, machine_name) VALUES
('XA001', 'Máy Xả 1'),
('XA002', 'Máy Xả 2'),
('XA003', 'Máy Xả 3'),
('XEN001', 'Máy Xén 1'),
('XEN002', 'Máy Xén 2'),
('XEN003', 'Máy Xén 3');

-- 3. Function kiểm tra máy có rảnh không
DELIMITER //
CREATE FUNCTION IsMachineAvailable(p_machine_id VARCHAR(50))
RETURNS BOOLEAN
READS SQL DATA
DETERMINISTIC
BEGIN
    DECLARE v_count INT DEFAULT 0;
    
    SELECT COUNT(*) INTO v_count
    FROM production_machines 
    WHERE machine_id = p_machine_id 
    AND current_order_id IS NULL;
    
    RETURN v_count > 0;
END//
DELIMITER ;

-- 4. Function lấy danh sách máy rảnh
DELIMITER //
CREATE FUNCTION GetAvailableMachines()
RETURNS TEXT
READS SQL DATA
DETERMINISTIC
BEGIN
    DECLARE v_result TEXT DEFAULT '';
    
    SELECT GROUP_CONCAT(machine_id SEPARATOR ',') INTO v_result
    FROM production_machines 
    WHERE current_order_id IS NULL;
    
    RETURN IFNULL(v_result, '');
END//
DELIMITER ;

-- 5. Stored Procedure bắt đầu lệnh trên máy
DELIMITER //
CREATE PROCEDURE StartOrderOnMachine(
    IN p_machine_id VARCHAR(50),
    IN p_order_id INT,
    IN p_order_code VARCHAR(100)
)
BEGIN
    DECLARE v_machine_available BOOLEAN DEFAULT FALSE;
    
    -- Kiểm tra máy có rảnh không
    SET v_machine_available = IsMachineAvailable(p_machine_id);
    
    IF NOT v_machine_available THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = CONCAT('Máy ', p_machine_id, ' đang bận. Vui lòng chọn máy khác.');
    END IF;
    
    -- Gán lệnh cho máy
    UPDATE production_machines 
    SET current_order_id = p_order_id,
        current_order_code = p_order_code
    WHERE machine_id = p_machine_id;
    
    -- Cập nhật lệnh sản xuất
    UPDATE production_orders 
    SET xa_start_time = NOW(),
        xa_status = 'in_progress',
        xa_machine_id = p_machine_id
    WHERE id = p_order_id;
END//
DELIMITER ;

-- 6. Stored Procedure kết thúc lệnh trên máy
DELIMITER //
CREATE PROCEDURE EndOrderOnMachine(
    IN p_machine_id VARCHAR(50),
    IN p_order_id INT
)
BEGIN
    -- Xóa lệnh khỏi máy
    UPDATE production_machines 
    SET current_order_id = NULL,
        current_order_code = NULL
    WHERE machine_id = p_machine_id;
    
    -- Cập nhật lệnh sản xuất
    UPDATE production_orders 
    SET xa_end_time = NOW(),
        xa_status = 'completed'
    WHERE id = p_order_id;
END//
DELIMITER ;

-- 7. View trạng thái máy
CREATE OR REPLACE VIEW v_machine_status AS
SELECT 
    machine_id,
    machine_name,
    CASE 
        WHEN current_order_id IS NULL THEN 'available'
        ELSE 'busy'
    END as status,
    current_order_code,
    current_order_id
FROM production_machines
ORDER BY machine_id;

-- 8. Query test
-- SELECT * FROM v_machine_status;
-- SELECT GetAvailableMachines() as available_machines;
-- SELECT IsMachineAvailable('XA001') as xa001_available;
-- CALL StartOrderOnMachine('XA001', 1, 'LENH001');
-- CALL EndOrderOnMachine('XA001', 1); 