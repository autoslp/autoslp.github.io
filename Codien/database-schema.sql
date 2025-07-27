-- Database Schema for Smart AC Management System
-- Tạo các bảng cho hệ thống quản lý điều hòa thông minh

-- 1. Bảng loại điều hòa (AC Types)
CREATE TABLE IF NOT EXISTS ac_types (
    id INT PRIMARY KEY AUTO_INCREMENT,
    ten_loai VARCHAR(100) NOT NULL UNIQUE COMMENT 'Tên loại điều hòa',
    ma_loai VARCHAR(50) NOT NULL UNIQUE COMMENT 'Mã loại điều hòa',
    trang_thai ENUM('active', 'inactive') DEFAULT 'active' COMMENT 'Trạng thái hoạt động',
    so_luong INT DEFAULT 0 COMMENT 'Số lượng điều hòa loại này',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_ma_loai (ma_loai),
    INDEX idx_trang_thai (trang_thai)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Bảng loại điều hòa';

-- 2. Bảng khu vực (Areas)
CREATE TABLE IF NOT EXISTS areas (
    id INT PRIMARY KEY AUTO_INCREMENT,
    ten_khu_vuc VARCHAR(100) NOT NULL UNIQUE COMMENT 'Tên khu vực',
    mo_ta TEXT COMMENT 'Mô tả khu vực',
    so_luong INT DEFAULT 0 COMMENT 'Số lượng điều hòa trong khu vực',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_ten_khu_vuc (ten_khu_vuc)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Bảng khu vực';

-- 3. Bảng vị trí cụ thể (Locations)
CREATE TABLE IF NOT EXISTS locations (
    id INT PRIMARY KEY AUTO_INCREMENT,
    khu_vuc VARCHAR(100) NOT NULL COMMENT 'Tên khu vực',
    ten_vi_tri VARCHAR(100) NOT NULL COMMENT 'Tên vị trí cụ thể',
    ma_vi_tri VARCHAR(50) NOT NULL UNIQUE COMMENT 'Mã vị trí',
    so_luong INT DEFAULT 0 COMMENT 'Số lượng điều hòa tại vị trí này',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_khu_vuc (khu_vuc),
    INDEX idx_ma_vi_tri (ma_vi_tri),
    FOREIGN KEY (khu_vuc) REFERENCES areas(ten_khu_vuc) ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Bảng vị trí cụ thể';

-- 4. Bảng hãng sản xuất (Brands)
CREATE TABLE IF NOT EXISTS air_brands (
    id INT PRIMARY KEY AUTO_INCREMENT,
    ten_hang VARCHAR(100) NOT NULL UNIQUE COMMENT 'Tên hãng sản xuất',
    quoc_gia VARCHAR(100) COMMENT 'Quốc gia',
    website VARCHAR(255) COMMENT 'Website chính thức',
    so_luong INT DEFAULT 0 COMMENT 'Số lượng điều hòa của hãng này',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_ten_hang (ten_hang),
    INDEX idx_quoc_gia (quoc_gia)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Bảng hãng sản xuất';

-- 5. Bảng điều hòa (Air Conditioners) - Bảng đã tồn tại, chỉ thêm cột mới
-- Thêm các trường mới vào bảng air_conditioners (nếu bảng đã tồn tại)
ALTER TABLE air_conditioners 
ADD COLUMN IF NOT EXISTS serial VARCHAR(100) COMMENT 'Số serial điều hòa' AFTER hang,
ADD COLUMN IF NOT EXISTS avatar_url TEXT COMMENT 'URL ảnh đại diện từ Google Drive' AFTER bao_duong_tiep_theo,
ADD COLUMN IF NOT EXISTS images_urls JSON COMMENT 'Mảng URL ảnh điều hòa từ Google Drive' AFTER avatar_url,
ADD COLUMN IF NOT EXISTS documents_urls JSON COMMENT 'Mảng URL ảnh giấy tờ bàn giao từ Google Drive' AFTER images_urls;

-- Thêm index cho trường serial
CREATE INDEX IF NOT EXISTS idx_serial ON air_conditioners(serial);

-- 6. Bảng lịch sử công việc (Work History)
CREATE TABLE IF NOT EXISTS work_history (
    id INT PRIMARY KEY AUTO_INCREMENT,
    ma_dieu_hoa VARCHAR(50) NOT NULL COMMENT 'Mã điều hòa',
    loai_cong_viec ENUM('maintenance', 'repair', 'inspection', 'cleaning', 'replacement') NOT NULL COMMENT 'Loại công việc',
    ngay_thuc_hien DATE NOT NULL COMMENT 'Ngày thực hiện',
    mo_ta_cong_viec TEXT COMMENT 'Mô tả công việc',
    nha_thau VARCHAR(100) COMMENT 'Nhà thầu thực hiện',
    chi_phi DECIMAL(10,2) DEFAULT 0 COMMENT 'Chi phí',
    trang_thai_truoc ENUM('excellent', 'good', 'maintenance', 'repair', 'broken') COMMENT 'Trạng thái trước khi sửa',
    trang_thai_sau ENUM('excellent', 'good', 'maintenance', 'repair', 'broken') COMMENT 'Trạng thái sau khi sửa',
    hinh_anh_truoc TEXT COMMENT 'Đường dẫn ảnh trước khi sửa (JSON array)',
    hinh_anh_sau TEXT COMMENT 'Đường dẫn ảnh sau khi sửa (JSON array)',
    ghi_chu TEXT COMMENT 'Ghi chú',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_ma_dieu_hoa (ma_dieu_hoa),
    INDEX idx_loai_cong_viec (loai_cong_viec),
    INDEX idx_ngay_thuc_hien (ngay_thuc_hien),
    INDEX idx_nha_thau (nha_thau),
    FOREIGN KEY (ma_dieu_hoa) REFERENCES air_conditioners(ma_dieu_hoa) ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Bảng lịch sử công việc';

-- Chèn dữ liệu mẫu

-- Dữ liệu mẫu cho bảng ac_types
INSERT IGNORE INTO ac_types (ten_loai, ma_loai, trang_thai, so_luong) VALUES
('Điều hòa Split', 'split', 'active', 0),
('Điều hòa Multi', 'multi', 'active', 0),
('Điều hòa trung tâm', 'central', 'active', 0),
('Điều hòa âm trần', 'cassette', 'active', 0);

-- Dữ liệu mẫu cho bảng areas
INSERT IGNORE INTO areas (ten_khu_vuc, mo_ta, so_luong) VALUES
('Tầng 1', 'Tầng trệt - Khu vực tiếp khách và văn phòng', 0),
('Tầng 2', 'Tầng 2 - Phòng họp và làm việc', 0),
('Tầng 3', 'Tầng 3 - Phòng giám đốc và hành chính', 0),
('Xưởng sản xuất', 'Khu vực sản xuất và kho bãi', 0);

-- Dữ liệu mẫu cho bảng brands
INSERT IGNORE INTO air_brands (ten_hang, quoc_gia, website, so_luong) VALUES
('Daikin', 'Nhật Bản', 'https://daikin.com.vn', 0),
('Mitsubishi', 'Nhật Bản', 'https://mitsubishielectric.com.vn', 0),
('LG', 'Hàn Quốc', 'https://lg.com/vn', 0),
('Samsung', 'Hàn Quốc', 'https://samsung.com/vn', 0),
('Panasonic', 'Nhật Bản', 'https://panasonic.com/vn', 0);

-- Dữ liệu mẫu cho bảng locations
INSERT IGNORE INTO locations (khu_vuc, ten_vi_tri, ma_vi_tri, so_luong) VALUES
('Tầng 1', 'Phòng tiếp khách', 'T1-TK', 0),
('Tầng 1', 'Phòng giám đốc', 'T1-GD', 0),
('Tầng 2', 'Phòng họp lớn', 'T2-HL', 0),
('Tầng 2', 'Phòng họp nhỏ', 'T2-HN', 0),
('Tầng 3', 'Phòng hành chính', 'T3-HC', 0),
('Xưởng sản xuất', 'Khu vực máy cắt', 'XSX-MC', 0),
('Xưởng sản xuất', 'Khu vực đóng gói', 'XSX-DG', 0);

-- Tạo triggers để tự động cập nhật số lượng

-- Trigger cho bảng air_conditioners
DELIMITER //

CREATE TRIGGER IF NOT EXISTS update_counts_after_insert
AFTER INSERT ON air_conditioners
FOR EACH ROW
BEGIN
    -- Cập nhật số lượng trong bảng ac_types
    UPDATE ac_types SET so_luong = so_luong + 1 WHERE ma_loai = NEW.loai;
    
    -- Cập nhật số lượng trong bảng areas  
    UPDATE areas SET so_luong = so_luong + 1 WHERE ten_khu_vuc = NEW.khu_vuc;
    
    -- Cập nhật số lượng trong bảng locations
    UPDATE locations SET so_luong = so_luong + 1 WHERE ten_vi_tri = NEW.vi_tri;
    
    -- Cập nhật số lượng trong bảng brands
    UPDATE air_brands SET so_luong = so_luong + 1 WHERE ten_hang = NEW.hang;
END//

CREATE TRIGGER IF NOT EXISTS update_counts_after_delete
AFTER DELETE ON air_conditioners
FOR EACH ROW
BEGIN
    -- Cập nhật số lượng trong bảng ac_types
    UPDATE ac_types SET so_luong = GREATEST(so_luong - 1, 0) WHERE ma_loai = OLD.loai;
    
    -- Cập nhật số lượng trong bảng areas
    UPDATE areas SET so_luong = GREATEST(so_luong - 1, 0) WHERE ten_khu_vuc = OLD.khu_vuc;
    
    -- Cập nhật số lượng trong bảng locations
    UPDATE locations SET so_luong = GREATEST(so_luong - 1, 0) WHERE ten_vi_tri = OLD.vi_tri;
    
    -- Cập nhật số lượng trong bảng brands
    UPDATE air_brands SET so_luong = GREATEST(so_luong - 1, 0) WHERE ten_hang = OLD.hang;
END//

CREATE TRIGGER IF NOT EXISTS update_counts_after_update
AFTER UPDATE ON air_conditioners
FOR EACH ROW
BEGIN
    -- Nếu loại thay đổi
    IF OLD.loai != NEW.loai THEN
        UPDATE ac_types SET so_luong = GREATEST(so_luong - 1, 0) WHERE ma_loai = OLD.loai;
        UPDATE ac_types SET so_luong = so_luong + 1 WHERE ma_loai = NEW.loai;
    END IF;
    
    -- Nếu khu vực thay đổi
    IF OLD.khu_vuc != NEW.khu_vuc THEN
        UPDATE areas SET so_luong = GREATEST(so_luong - 1, 0) WHERE ten_khu_vuc = OLD.khu_vuc;
        UPDATE areas SET so_luong = so_luong + 1 WHERE ten_khu_vuc = NEW.khu_vuc;
    END IF;
    
    -- Nếu vị trí thay đổi
    IF OLD.vi_tri != NEW.vi_tri THEN
        UPDATE locations SET so_luong = GREATEST(so_luong - 1, 0) WHERE ten_vi_tri = OLD.vi_tri;
        UPDATE locations SET so_luong = so_luong + 1 WHERE ten_vi_tri = NEW.vi_tri;
    END IF;
    
    -- Nếu hãng thay đổi
    IF OLD.hang != NEW.hang THEN
        UPDATE air_brands SET so_luong = GREATEST(so_luong - 1, 0) WHERE ten_hang = OLD.hang;
        UPDATE air_brands SET so_luong = so_luong + 1 WHERE ten_hang = NEW.hang;
    END IF;
END//

DELIMITER ;

-- Tạo view để truy vấn dễ dàng

-- View thống kê tổng quan
CREATE OR REPLACE VIEW v_ac_statistics AS
SELECT 
    (SELECT COUNT(*) FROM air_conditioners) as tong_dieu_hoa,
    (SELECT COUNT(*) FROM air_conditioners WHERE trang_thai = 'excellent') as excellent,
    (SELECT COUNT(*) FROM air_conditioners WHERE trang_thai = 'good') as good,
    (SELECT COUNT(*) FROM air_conditioners WHERE trang_thai = 'maintenance') as maintenance,
    (SELECT COUNT(*) FROM air_conditioners WHERE trang_thai = 'repair') as repair,
    (SELECT COUNT(*) FROM air_conditioners WHERE trang_thai = 'broken') as broken;

-- View điều hòa cần bảo dưỡng sắp tới
CREATE OR REPLACE VIEW v_upcoming_maintenance AS
SELECT 
    ac.*,
    DATEDIFF(ac.bao_duong_tiep_theo, CURDATE()) as ngay_con_lai
FROM air_conditioners ac
WHERE ac.bao_duong_tiep_theo IS NOT NULL 
    AND ac.bao_duong_tiep_theo >= CURDATE()
    AND ac.bao_duong_tiep_theo <= DATE_ADD(CURDATE(), INTERVAL 30 DAY)
ORDER BY ac.bao_duong_tiep_theo ASC;

-- View lịch sử công việc với thông tin chi tiết
CREATE OR REPLACE VIEW v_work_history_detail AS
SELECT 
    wh.*,
    ac.khu_vuc,
    ac.vi_tri,
    ac.hang,
    ac.loai
FROM work_history wh
JOIN air_conditioners ac ON wh.ma_dieu_hoa = ac.ma_dieu_hoa
ORDER BY wh.ngay_thuc_hien DESC;

-- Tạo stored procedures để xử lý dữ liệu

DELIMITER //

-- Procedure để tính lại số lượng
CREATE PROCEDURE IF NOT EXISTS RecalculateCounts()
BEGIN
    -- Cập nhật số lượng trong bảng ac_types
    UPDATE ac_types at SET so_luong = (
        SELECT COUNT(*) FROM air_conditioners ac WHERE ac.loai = at.ma_loai
    );
    
    -- Cập nhật số lượng trong bảng areas
    UPDATE areas a SET so_luong = (
        SELECT COUNT(*) FROM air_conditioners ac WHERE ac.khu_vuc = a.ten_khu_vuc
    );
    
    -- Cập nhật số lượng trong bảng locations
    UPDATE locations l SET so_luong = (
        SELECT COUNT(*) FROM air_conditioners ac WHERE ac.vi_tri = l.ten_vi_tri
    );
    
    -- Cập nhật số lượng trong bảng brands
    UPDATE air_brands b SET so_luong = (
        SELECT COUNT(*) FROM air_conditioners ac WHERE ac.hang = b.ten_hang
    );
END//

-- Procedure để lấy báo cáo thống kê
CREATE PROCEDURE IF NOT EXISTS GetACReport(
    IN start_date DATE,
    IN end_date DATE
)
BEGIN
    SELECT 
        'Tổng quan' as loai_bao_cao,
        COUNT(*) as so_luong,
        AVG(CASE WHEN trang_thai = 'excellent' THEN 5
                 WHEN trang_thai = 'good' THEN 4
                 WHEN trang_thai = 'maintenance' THEN 3
                 WHEN trang_thai = 'repair' THEN 2
                 ELSE 1 END) as diem_trung_binh
    FROM air_conditioners
    WHERE created_at BETWEEN start_date AND end_date
    
    UNION ALL
    
    SELECT 
        CONCAT('Khu vực: ', khu_vuc) as loai_bao_cao,
        COUNT(*) as so_luong,
        AVG(CASE WHEN trang_thai = 'excellent' THEN 5
                 WHEN trang_thai = 'good' THEN 4
                 WHEN trang_thai = 'maintenance' THEN 3
                 WHEN trang_thai = 'repair' THEN 2
                 ELSE 1 END) as diem_trung_binh
    FROM air_conditioners
    WHERE created_at BETWEEN start_date AND end_date
    GROUP BY khu_vuc
    
    UNION ALL
    
    SELECT 
        CONCAT('Hãng: ', hang) as loai_bao_cao,
        COUNT(*) as so_luong,
        AVG(CASE WHEN trang_thai = 'excellent' THEN 5
                 WHEN trang_thai = 'good' THEN 4
                 WHEN trang_thai = 'maintenance' THEN 3
                 WHEN trang_thai = 'repair' THEN 2
                 ELSE 1 END) as diem_trung_binh
    FROM air_conditioners
    WHERE created_at BETWEEN start_date AND end_date
        AND hang IS NOT NULL
    GROUP BY hang;
END//

DELIMITER ;

-- Gọi procedure để tính lại số lượng ban đầu
CALL RecalculateCounts();

-- Tạo indexes bổ sung để tối ưu hiệu suất
CREATE INDEX IF NOT EXISTS idx_ac_ngay_lap_dat ON air_conditioners(ngay_lap_dat);
CREATE INDEX IF NOT EXISTS idx_ac_ngay_bao_hanh ON air_conditioners(ngay_bao_hanh);
CREATE INDEX IF NOT EXISTS idx_wh_chi_phi ON work_history(chi_phi);
CREATE INDEX IF NOT EXISTS idx_wh_trang_thai ON work_history(trang_thai_sau);

-- Commit tất cả thay đổi
COMMIT;
