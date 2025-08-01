-- Cách 3: Phức tạp - Hệ thống Scheduling thông minh
-- Bao gồm: Load balancing, Priority queue, Maintenance scheduling

-- 1. Bảng machine với thông tin chi tiết
CREATE TABLE IF NOT EXISTS smart_machines (
    id INT AUTO_INCREMENT PRIMARY KEY,
    stage VARCHAR(50) NOT NULL,
    machine_id VARCHAR(50) NOT NULL,
    machine_name VARCHAR(100) NOT NULL,
    machine_type VARCHAR(100),
    capacity_per_hour INT DEFAULT 1000,
    efficiency_rating DECIMAL(3,2) DEFAULT 0.95, -- Hiệu suất 0-1
    priority_level INT DEFAULT 1, -- 1=cao nhất, 5=thấp nhất
    status ENUM('active', 'inactive', 'maintenance', 'broken', 'setup') DEFAULT 'active',
    current_load DECIMAL(5,2) DEFAULT 0.00, -- Tải hiện tại (%)
    last_maintenance DATE,
    next_maintenance DATE,
    maintenance_duration_hours INT DEFAULT 4,
    setup_time_minutes INT DEFAULT 30,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_machine (stage, machine_id)
);

-- 2. Bảng production queue với priority
CREATE TABLE IF NOT EXISTS production_queue (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    production_order VARCHAR(100) NOT NULL,
    stage VARCHAR(50) NOT NULL,
    priority INT DEFAULT 3, -- 1=urgent, 2=high, 3=normal, 4=low, 5=background
    estimated_duration_hours DECIMAL(4,2),
    required_quantity INT,
    customer_priority ENUM('vip', 'regular', 'low') DEFAULT 'regular',
    due_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    scheduled_start TIMESTAMP NULL,
    status ENUM('queued', 'scheduled', 'running', 'completed', 'cancelled') DEFAULT 'queued',
    FOREIGN KEY (order_id) REFERENCES production_orders(id) ON DELETE CASCADE
);

-- 3. Bảng machine assignments với scheduling
CREATE TABLE IF NOT EXISTS smart_machine_assignments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    queue_id INT NOT NULL,
    machine_id VARCHAR(50) NOT NULL,
    order_id INT NOT NULL,
    production_order VARCHAR(100) NOT NULL,
    stage VARCHAR(50) NOT NULL,
    worker_name VARCHAR(100),
    scheduled_start TIMESTAMP,
    actual_start TIMESTAMP NULL,
    scheduled_end TIMESTAMP,
    actual_end TIMESTAMP NULL,
    status ENUM('scheduled', 'running', 'completed', 'cancelled', 'delayed') DEFAULT 'scheduled',
    efficiency_score DECIMAL(3,2) DEFAULT 1.00,
    note TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (queue_id) REFERENCES production_queue(id) ON DELETE CASCADE
);

-- 4. Bảng maintenance schedule
CREATE TABLE IF NOT EXISTS maintenance_schedule (
    id INT AUTO_INCREMENT PRIMARY KEY,
    machine_id VARCHAR(50) NOT NULL,
    maintenance_type ENUM('preventive', 'corrective', 'emergency') DEFAULT 'preventive',
    scheduled_date DATE NOT NULL,
    scheduled_start TIME NOT NULL,
    scheduled_end TIME NOT NULL,
    actual_start TIMESTAMP NULL,
    actual_end TIMESTAMP NULL,
    status ENUM('scheduled', 'in_progress', 'completed', 'cancelled') DEFAULT 'scheduled',
    technician_name VARCHAR(100),
    description TEXT,
    parts_required TEXT,
    cost DECIMAL(10,2) DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. Insert dữ liệu máy thông minh
INSERT INTO smart_machines (stage, machine_id, machine_name, machine_type, capacity_per_hour, efficiency_rating, priority_level) VALUES
('xa', 'XA001', 'Máy Xả 1', 'Slitting Machine', 1200, 0.95, 1),
('xa', 'XA002', 'Máy Xả 2', 'Slitting Machine', 1000, 0.90, 2),
('xa', 'XA003', 'Máy Xả 3', 'Slitting Machine', 800, 0.85, 3),
('xen', 'XEN001', 'Máy Xén 1', 'Cutting Machine', 1500, 0.92, 1),
('xen', 'XEN002', 'Máy Xén 2', 'Cutting Machine', 1200, 0.88, 2),
('xen', 'XEN003', 'Máy Xén 3', 'Cutting Machine', 1000, 0.85, 3);

-- 6. Function tính toán máy tốt nhất
DELIMITER //
CREATE FUNCTION IF NOT EXISTS GetBestAvailableMachine(
    p_stage VARCHAR(50),
    p_required_quantity INT,
    p_priority INT
)
RETURNS VARCHAR(50)
READS SQL DATA
DETERMINISTIC
BEGIN
    DECLARE v_best_machine VARCHAR(50) DEFAULT '';
    DECLARE v_best_score DECIMAL(10,4) DEFAULT 0;
    DECLARE v_current_score DECIMAL(10,4);
    
    -- Tính điểm cho từng máy dựa trên:
    -- - Hiệu suất (efficiency_rating)
    -- - Tải hiện tại (current_load)
    -- - Priority level
    -- - Capacity phù hợp
    
    SELECT machine_id INTO v_best_machine
    FROM smart_machines 
    WHERE stage = p_stage 
    AND status = 'active'
    AND machine_id NOT IN (
        SELECT DISTINCT machine_id 
        FROM smart_machine_assignments 
        WHERE stage = p_stage 
        AND status IN ('scheduled', 'running')
    )
    ORDER BY 
        (efficiency_rating * (1 - current_load/100) * (1/priority_level) * 
         CASE 
             WHEN capacity_per_hour >= p_required_quantity THEN 1.2
             ELSE 0.8
         END) DESC
    LIMIT 1;
    
    RETURN v_best_machine;
END//

DELIMITER ;

-- 7. Function tính thời gian hoàn thành ước tính
DELIMITER //
CREATE FUNCTION IF NOT EXISTS EstimateCompletionTime(
    p_machine_id VARCHAR(50),
    p_quantity INT
)
RETURNS INT -- Trả về số phút
READS SQL DATA
DETERMINISTIC
BEGIN
    DECLARE v_capacity_per_hour INT DEFAULT 0;
    DECLARE v_efficiency DECIMAL(3,2) DEFAULT 1.00;
    DECLARE v_setup_time INT DEFAULT 0;
    DECLARE v_production_time INT DEFAULT 0;
    
    SELECT capacity_per_hour, efficiency_rating, setup_time_minutes 
    INTO v_capacity_per_hour, v_efficiency, v_setup_time
    FROM smart_machines 
    WHERE machine_id = p_machine_id;
    
    -- Thời gian sản xuất = (Số lượng / (Công suất * Hiệu suất)) * 60 phút
    SET v_production_time = CEILING((p_quantity / (v_capacity_per_hour * v_efficiency)) * 60);
    
    RETURN v_setup_time + v_production_time;
END//

DELIMITER ;

-- 8. Stored Procedure thêm vào queue thông minh
DELIMITER //
CREATE PROCEDURE IF NOT EXISTS AddToSmartQueue(
    IN p_order_id INT,
    IN p_stage VARCHAR(50),
    IN p_priority INT,
    IN p_quantity INT,
    IN p_customer_priority ENUM('vip', 'regular', 'low'),
    IN p_due_date DATE
)
BEGIN
    DECLARE v_production_order VARCHAR(100) DEFAULT '';
    DECLARE v_estimated_duration DECIMAL(4,2) DEFAULT 0;
    DECLARE v_best_machine VARCHAR(50) DEFAULT '';
    DECLARE v_queue_id INT DEFAULT 0;
    
    -- Lấy thông tin lệnh sản xuất
    SELECT production_order INTO v_production_order
    FROM production_orders 
    WHERE id = p_order_id;
    
    -- Thêm vào queue
    INSERT INTO production_queue (
        order_id, production_order, stage, priority, 
        estimated_duration_hours, required_quantity, 
        customer_priority, due_date
    ) VALUES (
        p_order_id, v_production_order, p_stage, p_priority,
        p_quantity / 1000.0, p_quantity, -- Ước tính 1000/giờ
        p_customer_priority, p_due_date
    );
    
    SET v_queue_id = LAST_INSERT_ID();
    
    -- Tìm máy tốt nhất
    SET v_best_machine = GetBestAvailableMachine(p_stage, p_quantity, p_priority);
    
    IF v_best_machine != '' THEN
        -- Tạo assignment ngay lập tức
        INSERT INTO smart_machine_assignments (
            queue_id, machine_id, order_id, production_order, 
            stage, scheduled_start, scheduled_end
        ) VALUES (
            v_queue_id, v_best_machine, p_order_id, v_production_order,
            p_stage, NOW(), DATE_ADD(NOW(), INTERVAL EstimateCompletionTime(v_best_machine, p_quantity) MINUTE)
        );
        
        -- Cập nhật trạng thái queue
        UPDATE production_queue 
        SET status = 'scheduled',
            scheduled_start = NOW()
        WHERE id = v_queue_id;
    END IF;
END//

DELIMITER ;

-- 9. Stored Procedure bắt đầu sản xuất từ queue
DELIMITER //
CREATE PROCEDURE IF NOT EXISTS StartProductionFromQueue(
    IN p_queue_id INT,
    IN p_worker_name VARCHAR(100)
)
BEGIN
    DECLARE v_machine_id VARCHAR(50) DEFAULT '';
    DECLARE v_order_id INT DEFAULT 0;
    DECLARE v_stage VARCHAR(50) DEFAULT '';
    
    -- Lấy thông tin assignment
    SELECT machine_id, order_id, stage 
    INTO v_machine_id, v_order_id, v_stage
    FROM smart_machine_assignments 
    WHERE queue_id = p_queue_id 
    AND status = 'scheduled';
    
    IF v_machine_id = '' THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Không tìm thấy assignment cho queue này';
    END IF;
    
    -- Cập nhật assignment
    UPDATE smart_machine_assignments 
    SET actual_start = NOW(),
        status = 'running',
        worker_name = p_worker_name
    WHERE queue_id = p_queue_id;
    
    -- Cập nhật queue
    UPDATE production_queue 
    SET status = 'running'
    WHERE id = p_queue_id;
    
    -- Cập nhật lệnh sản xuất
    SET @sql = CONCAT('
        UPDATE production_orders 
        SET ', v_stage, '_start_time = NOW(),
            ', v_stage, '_status = "in_progress",
            ', v_stage, '_machine_id = ?,
            ', v_stage, '_worker_name = ?
        WHERE id = ?
    ');
    
    PREPARE stmt FROM @sql;
    EXECUTE stmt USING v_machine_id, p_worker_name, v_order_id;
    DEALLOCATE PREPARE stmt;
END//

DELIMITER ;

-- 10. View dashboard thông minh
CREATE OR REPLACE VIEW v_smart_dashboard AS
SELECT 
    sm.stage,
    sm.machine_id,
    sm.machine_name,
    sm.capacity_per_hour,
    sm.efficiency_rating,
    sm.current_load,
    sm.status as machine_status,
    CASE 
        WHEN sma.id IS NOT NULL THEN 'running'
        ELSE 'available'
    END as production_status,
    sma.production_order,
    sma.worker_name,
    sma.actual_start,
    TIMESTAMPDIFF(MINUTE, sma.actual_start, NOW()) as running_minutes,
    pq.priority,
    pq.customer_priority,
    pq.due_date,
    pq.status as queue_status
FROM smart_machines sm
LEFT JOIN smart_machine_assignments sma ON 
    sm.machine_id = sma.machine_id 
    AND sma.status = 'running'
LEFT JOIN production_queue pq ON 
    sma.queue_id = pq.id
WHERE sm.status IN ('active', 'maintenance')
ORDER BY sm.stage, sm.priority_level, sm.machine_id;

-- 11. Query test
-- SELECT * FROM v_smart_dashboard WHERE stage = 'xa';
-- SELECT GetBestAvailableMachine('xa', 1000, 2) as best_machine;
-- SELECT EstimateCompletionTime('XA001', 1000) as completion_minutes;
-- CALL AddToSmartQueue(1, 'xa', 2, 1000, 'regular', DATE_ADD(CURDATE(), INTERVAL 3 DAY));
-- CALL StartProductionFromQueue(1, 'Nguyễn Văn A'); 