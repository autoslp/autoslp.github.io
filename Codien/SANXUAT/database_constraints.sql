-- Database Constraints để đảm bảo chỉ có một lệnh đang chạy
-- Cách tiếp cận này sử dụng database triggers và constraints

-- 1. Tạo bảng để theo dõi lệnh đang chạy
CREATE TABLE IF NOT EXISTS running_orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    stage VARCHAR(50) NOT NULL,
    order_id INT NOT NULL,
    production_order VARCHAR(100) NOT NULL,
    start_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    worker_name VARCHAR(100),
    machine_name VARCHAR(100),
    UNIQUE KEY unique_running_stage (stage)
);

-- 2. Trigger để tự động thêm vào bảng running_orders khi bắt đầu
DELIMITER //
CREATE TRIGGER IF NOT EXISTS tr_start_production_xa
AFTER UPDATE ON production_orders
FOR EACH ROW
BEGIN
    IF NEW.xa_start_time IS NOT NULL AND OLD.xa_start_time IS NULL THEN
        -- Xóa lệnh cũ nếu có
        DELETE FROM running_orders WHERE stage = 'xa';
        
        -- Thêm lệnh mới
        INSERT INTO running_orders (stage, order_id, production_order, worker_name, machine_name)
        VALUES ('xa', NEW.id, NEW.production_order, NEW.xa_worker_name, NEW.xa_machine_name);
    END IF;
END//

CREATE TRIGGER IF NOT EXISTS tr_start_production_xen
AFTER UPDATE ON production_orders
FOR EACH ROW
BEGIN
    IF NEW.xen_start_time IS NOT NULL AND OLD.xen_start_time IS NULL THEN
        -- Xóa lệnh cũ nếu có
        DELETE FROM running_orders WHERE stage = 'xen';
        
        -- Thêm lệnh mới
        INSERT INTO running_orders (stage, order_id, production_order, worker_name, machine_name)
        VALUES ('xen', NEW.id, NEW.production_order, NEW.xen_worker_name, NEW.xen_machine_name);
    END IF;
END//

-- 3. Trigger để tự động xóa khỏi bảng running_orders khi kết thúc
CREATE TRIGGER IF NOT EXISTS tr_end_production_xa
AFTER UPDATE ON production_orders
FOR EACH ROW
BEGIN
    IF NEW.xa_end_time IS NOT NULL AND OLD.xa_end_time IS NULL THEN
        DELETE FROM running_orders WHERE stage = 'xa' AND order_id = NEW.id;
    END IF;
END//

CREATE TRIGGER IF NOT EXISTS tr_end_production_xen
AFTER UPDATE ON production_orders
FOR EACH ROW
BEGIN
    IF NEW.xen_end_time IS NOT NULL AND OLD.xen_end_time IS NULL THEN
        DELETE FROM running_orders WHERE stage = 'xen' AND order_id = NEW.id;
    END IF;
END//

DELIMITER ;

-- 4. Stored Procedure để kiểm tra và bắt đầu sản xuất an toàn
DELIMITER //
CREATE PROCEDURE IF NOT EXISTS StartProductionSafely(
    IN p_stage VARCHAR(50),
    IN p_order_id INT,
    IN p_worker_name VARCHAR(100),
    IN p_machine_name VARCHAR(100),
    IN p_note TEXT
)
BEGIN
    DECLARE v_running_order_id INT DEFAULT NULL;
    DECLARE v_running_production_order VARCHAR(100) DEFAULT NULL;
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;
    
    START TRANSACTION;
    
    -- Kiểm tra xem có lệnh nào đang chạy không
    SELECT order_id, production_order INTO v_running_order_id, v_running_production_order
    FROM running_orders 
    WHERE stage = p_stage;
    
    IF v_running_order_id IS NOT NULL THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = CONCAT('Lệnh ', v_running_production_order, ' đang chạy. Vui lòng kết thúc lệnh hiện tại trước.');
    END IF;
    
    -- Bắt đầu lệnh mới
    SET @sql = CONCAT('
        UPDATE production_orders 
        SET ', p_stage, '_start_time = NOW(),
            ', p_stage, '_status = "in_progress",
            ', p_stage, '_worker_name = ?,
            ', p_stage, '_machine_name = ?,
            ', p_stage, '_note = ?
        WHERE id = ?
    ');
    
    PREPARE stmt FROM @sql;
    EXECUTE stmt USING p_worker_name, p_machine_name, p_note, p_order_id;
    DEALLOCATE PREPARE stmt;
    
    COMMIT;
END//

DELIMITER ;

-- 5. View để dễ dàng xem lệnh đang chạy
CREATE OR REPLACE VIEW v_running_orders AS
SELECT 
    ro.stage,
    ro.order_id,
    ro.production_order,
    ro.start_time,
    ro.worker_name,
    ro.machine_name,
    TIMESTAMPDIFF(MINUTE, ro.start_time, NOW()) as running_minutes
FROM running_orders ro;

-- 6. Function để kiểm tra trạng thái
DELIMITER //
CREATE FUNCTION IF NOT EXISTS IsStageRunning(p_stage VARCHAR(50))
RETURNS BOOLEAN
READS SQL DATA
DETERMINISTIC
BEGIN
    DECLARE v_count INT DEFAULT 0;
    
    SELECT COUNT(*) INTO v_count
    FROM running_orders 
    WHERE stage = p_stage;
    
    RETURN v_count > 0;
END//

DELIMITER ;

-- 7. Cleanup procedure để dọn dẹp dữ liệu không nhất quán
DELIMITER //
CREATE PROCEDURE IF NOT EXISTS CleanupRunningOrders()
BEGIN
    -- Xóa các lệnh trong running_orders mà đã kết thúc
    DELETE ro FROM running_orders ro
    INNER JOIN production_orders po ON ro.order_id = po.id
    WHERE (ro.stage = 'xa' AND po.xa_end_time IS NOT NULL)
       OR (ro.stage = 'xen' AND po.xen_end_time IS NOT NULL);
END//

DELIMITER ;

-- 8. Index để tối ưu hiệu suất
CREATE INDEX idx_running_orders_stage ON running_orders(stage);
CREATE INDEX idx_running_orders_order_id ON running_orders(order_id);

-- 9. Insert dữ liệu mẫu để test
-- INSERT INTO running_orders (stage, order_id, production_order, worker_name, machine_name)
-- VALUES ('xa', 1, 'LSX001', 'Nguyễn Văn A', 'Máy Xả 1');

-- 10. Query để test
-- SELECT * FROM v_running_orders;
-- SELECT IsStageRunning('xa') as xa_running, IsStageRunning('xen') as xen_running;
-- CALL StartProductionSafely('xa', 2, 'Nguyễn Văn B', 'Máy Xả 2', 'Ghi chú test'); 