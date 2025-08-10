-- Script SQL tự động sinh 500 lệnh INSERT cho bảng production_orders
-- Đây là một cách tiếp cận sử dụng bảng tạm và vòng lặp để tạo dữ liệu mẫu đa dạng

-- Tạo bảng tạm chứa các giá trị mẫu cho các trường
CREATE TEMPORARY TABLE IF NOT EXISTS temp_order_types (id INT AUTO_INCREMENT PRIMARY KEY, type_name VARCHAR(20));
INSERT INTO temp_order_types (type_name) VALUES 
('Thường'), ('Khẩn'), ('Mẫu'), ('Gia công'), ('Đại trà'), ('Bù');

CREATE TEMPORARY TABLE IF NOT EXISTS temp_customer_groups (id INT AUTO_INCREMENT PRIMARY KEY, group_name VARCHAR(20));
INSERT INTO temp_customer_groups (group_name) VALUES 
('VIP'), ('Thường'), ('Mới'), ('Chiến lược'), ('Nhóm 2'), ('Nhóm 3'), ('Nhóm 4');

CREATE TEMPORARY TABLE IF NOT EXISTS temp_customers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(20),
    name VARCHAR(100),
    customer_group VARCHAR(20)
);
INSERT INTO temp_customers (code, name, customer_group) VALUES 
('3245782', 'Công ty TNHH Dược phẩm Mekophar', 'VIP'),
('2781456', 'Công ty CP Dược Traphaco', 'Chiến lược'),
('1956234', 'Công ty TNHH Unilever Việt Nam', 'VIP'),
('2854367', 'Công ty CP Dược phẩm Pharmavina', 'Thường'),
('3642189', 'Công ty CP Sữa Việt Nam', 'VIP'),
('1547823', 'Công ty CP Dược Hậu Giang', 'Chiến lược'),
('1852367', 'Công ty CP NCB Việt Nam', 'Thường'),
('2456789', 'Công ty TNHH Abbott Việt Nam', 'VIP'),
('3215478', 'Công ty TNHH Nestlé Việt Nam', 'VIP'),
('2658741', 'Công ty CP Dầu khí Long Sơn', 'Chiến lược'),
('1958742', 'Công ty CP Pizza Express', 'Nhóm 2'),
('2314587', 'Công ty CP Simpharma', 'Nhóm 2'),
('3654789', 'Công ty TNHH Satori', 'Mới'),
('1857423', 'Công ty CP Aeon Việt Nam', 'VIP'),
('2541698', 'Công ty TNHH ACE Manufacturing', 'Thường'),
('3214569', 'Công ty TNHH Kim Đồng Hải', 'Chiến lược'),
('2698745', 'Công ty CP In Phương Mai Phát', 'Thường'),
('3654127', 'Công ty CP Amtec Electronics', 'VIP'),
('1952368', 'Công ty TNHH Thành Hưng Việt', 'Nhóm 3'),
('2841596', 'Công ty TNHH Cosmetic Plus', 'VIP'),
('3789514', 'Công ty CP Diana Unicharm', 'VIP'),
('2647891', 'Công ty TNHH Coca-Cola Việt Nam', 'VIP'),
('1478236', 'Công ty CP Tân Á Đại Thành', 'Nhóm 2'),
('3698741', 'Công ty CP Vinamilk', 'VIP'),
('2158746', 'Công ty TNHH Sanofi Việt Nam', 'Chiến lược'),
('3265478', 'Công ty CP Thực phẩm TH True Milk', 'Chiến lược'),
('2587413', 'Công ty TNHH Dược phẩm OPC', 'Nhóm 2'),
('1863247', 'Công ty CP Đông Dược Phúc Hưng', 'Nhóm 3'),
('3542178', 'Công ty TNHH Samsung Việt Nam', 'VIP'),
('2613574', 'Công ty CP Bánh kẹo Bibica', 'Nhóm 2');

CREATE TEMPORARY TABLE IF NOT EXISTS temp_products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100),
    code_prefix VARCHAR(10),
    product_type VARCHAR(20)
);
INSERT INTO temp_products (name, code_prefix, product_type) VALUES 
('Hộp thuốc Mekophar PainRelief 500mg', 'MEV', 'Dược phẩm'),
('Vỉ thuốc Boganic 250mg', 'TRP', 'Dược phẩm'),
('Hộp kem đánh răng Close-up 200g', 'UNI', 'Mỹ phẩm'),
('Hộp thuốc Paracetamol 500mg', 'PVN', 'Dược phẩm'),
('Hộp sữa tiệt trùng Vinamilk 180ml', 'VNM', 'Thực phẩm'),
('Hộp thuốc kháng sinh Hapacol 650mg', 'DHG', 'Dược phẩm'),
('Hộp bánh trung thu NCB Premium', 'NCB', 'Thực phẩm'),
('Hộp sữa bột Ensure Gold 400g', 'ABT', 'Thực phẩm'),
('Hộp bánh ngũ cốc Milo 250g', 'NES', 'Thực phẩm'),
('Hộp đựng sản phẩm hóa dầu 500ml', 'DKL', 'Hóa chất'),
('Hộp đựng bánh pizza size L', 'PIZ', 'Thực phẩm'),
('Vỉ thuốc Dưỡng Gan 300mg', 'SMP', 'Dược phẩm'),
('Hộp trà thảo mộc Satori 20 gói', 'SAT', 'Thực phẩm'),
('Túi giấy đựng thực phẩm size M', 'AEO', 'Bao bì'),
('Hộp đựng thiết bị điện tử Model A25', 'ACE', 'Điện tử'),
('Hộp thuốc bổ Khoáng đa vi chất', 'KDH', 'Dược phẩm'),
('Vỏ hộp điện thoại Stype T20', 'PMP', 'Điện tử'),
('Vỏ hộp TV LED 55 inch', 'AMT', 'Điện tử'),
('Hộp đựng thực phẩm bảo quản 500g', 'THV', 'Bao bì'),
('Hộp mỹ phẩm kem dưỡng da Premium', 'CPP', 'Mỹ phẩm'),
('Hộp băng vệ sinh Diana 10 miếng', 'DIA', 'Mỹ phẩm'),
('Vỏ lon Coca-Cola 330ml', 'COC', 'Bao bì'),
('Hộp đựng bình nước Tân Á 1.5L', 'TNA', 'Bao bì'),
('Hộp sữa chua Vinamilk 100g x 4', 'VIN', 'Thực phẩm'),
('Vỉ thuốc Sanofi Doliprane 500mg', 'SAN', 'Dược phẩm'),
('Hộp sữa tươi TH True Milk 180ml', 'TTM', 'Thực phẩm'),
('Hộp thuốc ho OPC 20 viên', 'OPC', 'Dược phẩm'),
('Hộp thảo dược Phúc Hưng 30 gói', 'PHU', 'Dược phẩm'),
('Vỏ hộp điện thoại Samsung Galaxy', 'SAM', 'Điện tử'),
('Hộp bánh quy Bibica 300g', 'BIB', 'Thực phẩm');

CREATE TEMPORARY TABLE IF NOT EXISTS temp_paper_types (id INT AUTO_INCREMENT PRIMARY KEY, type_name VARCHAR(50));
INSERT INTO temp_paper_types (type_name) VALUES 
('Duplex Nhật'), ('Duplex Hanson'), ('Ivory NingBo'), ('Couches TQ'), 
('Couches Hàn Quốc'), ('Kraft'), ('Ivory Cao cấp'), ('Giấy tái chế'), 
('C2S 2 mặt bóng'), ('Giấy kraft lạnh');

CREATE TEMPORARY TABLE IF NOT EXISTS temp_work_stages (id INT AUTO_INCREMENT PRIMARY KEY, stage_name VARCHAR(100));
INSERT INTO temp_work_stages (stage_name) VALUES 
('Xả-Xén-In-Bế-Dán-Đóng thùng'),
('Xả-Xén-In-Bế-Đóng thùng'),
('Xả-Xén-In-Bế-Dán'),
('Xả-Xén-In-Bế-Dán-Ép kim-Đóng thùng'),
('Xả-Xén-In-Bế-Dán quai-Đóng thùng'),
('Bế-Dán-Đóng thùng'),
('Xả-Xén-In-Cán màng-Bế-Đóng thùng'),
('Xả-Xén-In-Bế-Ép nhũ-Dán-Đóng thùng'),
('Xả-Xén-In-UV cục bộ-Bế-Dán-Đóng thùng'),
('Xả-Xén-In-Bế-Dán-Đóng gói');

CREATE TEMPORARY TABLE IF NOT EXISTS temp_statuses (id INT AUTO_INCREMENT PRIMARY KEY, status_name VARCHAR(20));
INSERT INTO temp_statuses (status_name) VALUES 
('Chờ triển khai'), ('Đang sản xuất'), ('Hoàn thành'), ('Đã hủy');

-- Tạo delimiters để viết stored procedure
DELIMITER //

-- Tạo stored procedure để sinh 500 lệnh INSERT
CREATE PROCEDURE generate_500_orders()
BEGIN
    DECLARE i INT DEFAULT 0;
    DECLARE start_date DATE DEFAULT '2025-01-01';
    DECLARE current_date DATE;
    DECLARE current_po_number VARCHAR(20);
    DECLARE production_order VARCHAR(50);
    DECLARE batch_index INT;

    -- Tạo bảng tạm để lưu các lệnh INSERT
    CREATE TEMPORARY TABLE IF NOT EXISTS temp_insert_statements (
        id INT AUTO_INCREMENT PRIMARY KEY,
        statement TEXT
    );
    
    -- Vòng lặp tạo 500 lệnh INSERT
    WHILE i < 500 DO
        -- Tính ngày dựa trên index (phân bổ đều trong khoảng 8 tháng)
        SET current_date = DATE_ADD(start_date, INTERVAL FLOOR(i/2) DAY);
        SET batch_index = i % 100 + 1;
        
        -- Tạo production_order theo định dạng: '01-YYMM-XXXXX'
        SET production_order = CONCAT('01-', DATE_FORMAT(current_date, '%y%m'), '-', LPAD(batch_index, 5, '0'));
        
        -- Tạo po_number theo định dạng: 'YY.MM.XXX.XX'
        SET current_po_number = CONCAT(
            DATE_FORMAT(current_date, '%y'), '.',
            DATE_FORMAT(current_date, '%m'), '.',
            LPAD(FLOOR(RAND() * 100), 3, '0'), '.',
            LPAD(FLOOR(RAND() * 10), 2, '0')
        );
        
        -- Tạo câu lệnh INSERT và lưu vào bảng tạm
        INSERT INTO temp_insert_statements (statement)
        SELECT CONCAT(
            'INSERT INTO production_orders (',
            'deployment_date, production_order, po_number, sales_order_code, order_date, delivery_date, ',
            'internal_product_code, order_type, customer_code, customer_name, product_name, version, ',
            'not_deployed_reason, sales_note, customer_production_note, order_quantity, inventory, ',
            'required_quantity, deployed_quantity, offset_waste, waste, sheet_count, product_length, ',
            'product_width, product_height, paper_length, paper_width, part_count, color_count, ',
            'customer_group, paper_type, paper_weight, work_stage, status',
            ') VALUES (',
            
            -- deployment_date
            '\'', current_date, '\', ',
            
            -- production_order
            '\'', production_order, '\', ',
            
            -- po_number
            '\'', current_po_number, '\', ',
            
            -- sales_order_code - SLM-XXXXXYYY-VV
            '\'SLM-', LPAD(FLOOR(RAND() * 1000), 5, '0'), p.code_prefix, '-',
            LPAD(FLOOR(RAND() * 10), 2, '0'), '\', ',
            
            -- order_date
            '\'', DATE_SUB(current_date, INTERVAL FLOOR(RAND() * 5) DAY), '\', ',
            
            -- delivery_date
            '\'', DATE_ADD(current_date, INTERVAL 10 + FLOOR(RAND() * 20) DAY), '\', ',
            
            -- internal_product_code - SLM-XXXXXYYY-VV-Nb
            '\'SLM-', LPAD(FLOOR(RAND() * 1000), 5, '0'), p.code_prefix, '-',
            LPAD(FLOOR(RAND() * 10), 2, '0'), '-', FLOOR(RAND() * 10) + 1, 'b\', ',
            
            -- order_type
            '\'', ot.type_name, '\', ',
            
            -- customer_code, customer_name
            '\'', c.code, '\', ',
            '\'', c.name, '\', ',
            
            -- product_name
            '\'', p.name, '\', ',
            
            -- version
            '\'', FLOOR(RAND() * 10) + 1, '\', ',
            
            -- not_deployed_reason
            '\'\', ',
            
            -- sales_note
            CASE FLOOR(RAND() * 5)
                WHEN 0 THEN '\'Như lô gần nhất\', '
                WHEN 1 THEN '\'Cần giao gấp trong tuần\', '
                WHEN 2 THEN '\'Khách đề nghị giao sớm hơn dự kiến\', '
                WHEN 3 THEN CONCAT('\'Sản phẩm mới', IF(RAND() > 0.5, ' - kiểm tra kỹ chất lượng', ''), '\', ')
                ELSE '\'Theo thiết kế đã duyệt\', '
            END,
            
            -- customer_production_note
            CASE ot.type_name
                WHEN 'Mẫu' THEN '\'Mẫu cần đạt chuẩn màu - In bộ mẫu để duyệt\', '
                WHEN 'Bù' THEN CONCAT('\'In bù cho LSX 01-', DATE_FORMAT(DATE_SUB(current_date, INTERVAL 15 DAY), '%y%m'), 
                    '-00', FLOOR(RAND() * 100), ' = ', FLOOR(RAND() * 5000), ' cái - Hàng không được thiếu số lượng\', ')
                ELSE CONCAT('\'', 
                    CASE FLOOR(RAND() * 8)
                        WHEN 0 THEN 'In theo màu Pantone chuẩn'
                        WHEN 1 THEN 'Chú ý độ sắc nét hình ảnh'
                        WHEN 2 THEN 'Kiểm tra kỹ khâu bế'
                        WHEN 3 THEN CONCAT('Bổ sung mã QR mới theo ECN ', FLOOR(RAND() * 10000))
                        WHEN 4 THEN 'Sản xuất theo tiêu chuẩn ISO'
                        WHEN 5 THEN 'Yêu cầu giấy không bị cong vênh'
                        WHEN 6 THEN 'Đảm bảo màu sắc theo mẫu đã duyệt'
                        ELSE 'Kiểm tra kỹ chất lượng in và bế'
                    END, 
                    IF(RAND() > 0.7, CONCAT(' - ', 
                        CASE FLOOR(RAND() * 5)
                            WHEN 0 THEN 'Đóng gói riêng biệt'
                            WHEN 1 THEN 'Chú ý số lượng đóng thùng'
                            WHEN 2 THEN 'Vận chuyển cẩn thận'
                            WHEN 3 THEN 'Kiểm tra độ bóng của giấy'
                            ELSE 'Giao hàng đúng hạn'
                        END
                    ), ''),
                '\', ')
            END,
            
            -- order_quantity
            CASE 
                WHEN ot.type_name = 'Mẫu' THEN '0, '
                ELSE CONCAT(FLOOR(RAND() * 90000) + 10000, ', ')
            END,
            
            -- inventory
            CASE 
                WHEN ot.type_name = 'Mẫu' THEN '0, '
                WHEN ot.type_name = 'Bù' THEN CONCAT('-', FLOOR(RAND() * 1000) + 100, ', ')
                ELSE CONCAT(FLOOR(RAND() * 5000), ', ')
            END,
            
            -- required_quantity
            CASE 
                WHEN ot.type_name = 'Mẫu' THEN CONCAT(FLOOR(RAND() * 100) + 10, ', ')
                WHEN ot.type_name = 'Bù' THEN CONCAT(FLOOR(RAND() * 3000) + 500, ', ')
                ELSE CONCAT(CASE 
                    WHEN FLOOR(RAND() * 5000) > 0 THEN FLOOR(RAND() * 90000) + 10000 - FLOOR(RAND() * 5000)
                    ELSE FLOOR(RAND() * 90000) + 10000
                END, ', ')
            END,
            
            -- deployed_quantity
            CASE 
                WHEN ot.type_name = 'Mẫu' THEN CONCAT(FLOOR(RAND() * 500) + 100, ', ')
                ELSE CONCAT(FLOOR(1.05 * (CASE 
                    WHEN ot.type_name = 'Bù' THEN FLOOR(RAND() * 3000) + 500
                    ELSE CASE 
                        WHEN FLOOR(RAND() * 5000) > 0 THEN FLOOR(RAND() * 90000) + 10000 - FLOOR(RAND() * 5000)
                        ELSE FLOOR(RAND() * 90000) + 10000
                    END
                END)), ', ')
            END,
            
            -- offset_waste
            CASE 
                WHEN ot.type_name = 'Mẫu' THEN '0, '
                ELSE CONCAT(FLOOR(RAND() * 600) + 100, ', ')
            END,
            
            -- waste
            CASE 
                WHEN ot.type_name = 'Mẫu' THEN CONCAT(FLOOR(RAND() * 1000) + 100, ', ')
                ELSE CONCAT(FLOOR(RAND() * 100) + 10, ', ')
            END,
            
            -- sheet_count
            CASE 
                WHEN ot.type_name = 'Mẫu' THEN CONCAT(FLOOR(RAND() * 200) + 50, ', ')
                ELSE CONCAT(FLOOR(RAND() * 10000) + 1000, ', ')
            END,
            
            -- product_length, product_width, product_height
            FLOOR(RAND() * 200) + 80, '.00, ',
            FLOOR(RAND() * 150) + 50, '.00, ',
            FLOOR(RAND() * 150) + 10, '.00, ',
            
            -- paper_length, paper_width
            FLOOR(RAND() * 300) + 500, '.00, ',
            FLOOR(RAND() * 200) + 400, '.00, ',
            
            -- part_count, color_count
            FLOOR(RAND() * 12) + 2, ', ',
            FLOOR(RAND() * 6) + 1, ', ',
            
            -- customer_group
            '\'', c.customer_group, '\', ',
            
            -- paper_type
            '\'', pt.type_name, '\', ',
            
            -- paper_weight
            FLOOR(RAND() * 300) + 200, ', ',
            
            -- work_stage
            '\'', ws.stage_name, '\', ',
            
            -- status
            '\'', s.status_name, '\'',
            ');'
        )
        FROM temp_order_types ot
        JOIN temp_customers c ON FLOOR(RAND() * (SELECT COUNT(*) FROM temp_customers)) + 1 = c.id
        JOIN temp_products p ON FLOOR(RAND() * (SELECT COUNT(*) FROM temp_products)) + 1 = p.id
        JOIN temp_paper_types pt ON FLOOR(RAND() * (SELECT COUNT(*) FROM temp_paper_types)) + 1 = pt.id
        JOIN temp_work_stages ws ON FLOOR(RAND() * (SELECT COUNT(*) FROM temp_work_stages)) + 1 = ws.id
        JOIN temp_statuses s ON FLOOR(RAND() * (SELECT COUNT(*) FROM temp_statuses)) + 1 = s.id
        ORDER BY RAND()
        LIMIT 1;
        
        SET i = i + 1;
    END WHILE;
    
    -- Output the INSERT statements
    SELECT statement FROM temp_insert_statements;
    
    -- Cleanup
    DROP TEMPORARY TABLE IF EXISTS temp_insert_statements;
END //

DELIMITER ;

-- Execute the stored procedure
CALL generate_500_orders();

-- Cleanup
DROP PROCEDURE IF EXISTS generate_500_orders;
DROP TEMPORARY TABLE IF EXISTS temp_order_types;
DROP TEMPORARY TABLE IF EXISTS temp_customer_groups;
DROP TEMPORARY TABLE IF EXISTS temp_customers;
DROP TEMPORARY TABLE IF EXISTS temp_products;
DROP TEMPORARY TABLE IF EXISTS temp_paper_types;
DROP TEMPORARY TABLE IF EXISTS temp_work_stages;
DROP TEMPORARY TABLE IF EXISTS temp_statuses; 