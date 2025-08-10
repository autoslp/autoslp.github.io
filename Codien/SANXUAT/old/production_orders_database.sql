-- SQL script để tạo bảng production_orders cho hệ thống Lệnh sản xuất với đầy đủ 17 công đoạn

-- Tạo bảng chính lưu trữ lệnh sản xuất
CREATE TABLE IF NOT EXISTS production_orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    deployment_date DATE COMMENT 'Ngày triển khai LSX',
    production_order VARCHAR(50) NOT NULL COMMENT 'Lệnh Sản xuất',
    po_number VARCHAR(50) NOT NULL COMMENT 'Số PO', 
    sales_order_code VARCHAR(100) COMMENT 'Mã code KD đặt hàng',
    order_date DATE COMMENT 'Ngày đặt hàng',
    delivery_date DATE COMMENT 'Ngày giao hàng',
    internal_product_code VARCHAR(100) NOT NULL COMMENT 'Mã code SP Nội bộ SX',
    order_type ENUM('Thường', 'Khẩn', 'Mẫu', 'Gia công', 'Đại trà', 'Bù') COMMENT 'Phân Loại Lệnh sản xuất',
    customer_code VARCHAR(50) NOT NULL COMMENT 'Mã code khách hàng',
    customer_name VARCHAR(255) NOT NULL COMMENT 'Tên khách hàng',
    product_name TEXT NOT NULL COMMENT 'Tên sản phẩm',
    version VARCHAR(20) COMMENT 'Version',
    not_deployed_reason TEXT COMMENT 'Ghi chú lý do chưa Triển khai LSX',
    sales_note TEXT COMMENT 'Ghi chú đơn hàng KD',
    customer_production_note TEXT COMMENT 'Ghi chú Lệnh sản xuất KH',
    order_quantity INT DEFAULT 0 COMMENT 'Số lượng đơn hàng',
    inventory INT DEFAULT 0 COMMENT 'Tồn kho',
    required_quantity INT DEFAULT 0 COMMENT 'Số lượng Cần sản xuất',
    deployed_quantity INT DEFAULT 0 COMMENT 'Số lượng Triển khai',
    offset_waste INT DEFAULT 0 COMMENT 'Hao phí in offset',
    waste INT DEFAULT 0 COMMENT 'Hao phí',
    sheet_count INT DEFAULT 0 COMMENT 'Số tờ triển khai',
    product_length DECIMAL(10,2) COMMENT 'Sản phẩm (Dài)',
    product_width DECIMAL(10,2) COMMENT 'Sản phẩm (Rộng)',
    product_height DECIMAL(10,2) COMMENT 'Sản phẩm (Cao)',
    paper_length DECIMAL(10,2) COMMENT 'Giấy (Dài)',
    paper_width DECIMAL(10,2) COMMENT 'Giấy (Rộng)',
    part_count INT DEFAULT 0 COMMENT 'Số part',
    color_count INT DEFAULT 0 COMMENT 'Số màu',
    customer_group ENUM('VIP', 'Thường', 'Mới', 'Chiến lược', 'Nhóm 2', 'Nhóm 3', 'Nhóm 4') COMMENT 'Nhóm khách hàng',
    paper_type VARCHAR(100) COMMENT 'Loại giấy',
    paper_weight INT COMMENT 'Định Lượng giấy',
    work_stage TEXT COMMENT 'Công đoạn',
    status ENUM('Chờ triển khai', 'Đang sản xuất', 'Hoàn thành', 'Đã hủy') DEFAULT 'Chờ triển khai' COMMENT 'Trạng thái',
    
    -- Workflow Management Fields - Cập nhật để hỗ trợ đầy đủ 17 công đoạn
    workflow_definition TEXT COMMENT 'Định nghĩa workflow (xa,xen,in_offset,xen_toa,kcs_in,kcs_sau_in,lang,in_luoi,boi,be,boc_le,dan_3m,dan_may,hoan_thien,ghim,gap,nhap_kho)',
    current_stage VARCHAR(20) DEFAULT 'xa' COMMENT 'Stage hiện tại (xa,xen,in_offset,xen_toa,kcs_in,kcs_sau_in,lang,in_luoi,boi,be,boc_le,dan_3m,dan_may,hoan_thien,ghim,gap,nhap_kho)',
    current_stage_index INT DEFAULT 0 COMMENT 'Vị trí stage trong workflow (0-based)',
    stage_progress TEXT COMMENT 'Chi tiết tiến độ từng stage (JSON format)',
    
    -- Production Details
    production_date DATE COMMENT 'Ngày sản xuất',
    production_shift VARCHAR(10) DEFAULT 'Ca 1' COMMENT 'Ca sản xuất (Ca 1, Ca 2, Ca 3)',
    assigned_machine VARCHAR(50) COMMENT 'Máy được gán cho stage hiện tại',
    worker_name VARCHAR(100) COMMENT 'Tên thợ phụ trách',
    
    -- Stage Timing
    stage_start_time TIME COMMENT 'Giờ bắt đầu stage hiện tại',
    stage_end_time TIME COMMENT 'Giờ kết thúc stage hiện tại',
    stage_note TEXT COMMENT 'Ghi chú cho stage hiện tại',
    
    -- Stage Quantities (Current Stage)
    stage_input_quantity INT DEFAULT 0 COMMENT 'SL đầu vào stage hiện tại',
    stage_output_quantity INT DEFAULT 0 COMMENT 'SL đầu ra stage hiện tại',
    stage_good_quantity INT DEFAULT 0 COMMENT 'SL đạt stage hiện tại',
    stage_ng_quantity INT DEFAULT 0 COMMENT 'SL NG stage hiện tại',
    stage_ng_start_end_quantity INT DEFAULT 0 COMMENT 'SL NG đầu/cuối (cho XẢ, XÉN)',
    stage_return_quantity INT DEFAULT 0 COMMENT 'SL tồn trả (cho XẢ, XÉN)',
    
    -- ==== CHI TIẾT TỪNG CÔNG ĐOẠN (17 công đoạn) ====
    
    -- 1. XẢ - Detailed tracking
    xa_start_time DATETIME COMMENT 'Thời gian bắt đầu XẢ',
    xa_end_time DATETIME COMMENT 'Thời gian kết thúc XẢ',
    xa_worker_name VARCHAR(100) COMMENT 'Tên thợ XẢ',
    xa_machine_name VARCHAR(50) COMMENT 'Tên máy XẢ',
    xa_input_quantity INT DEFAULT 0 COMMENT 'SL đầu vào XẢ',
    xa_output_quantity INT DEFAULT 0 COMMENT 'SL đầu ra XẢ',
    xa_good_quantity INT DEFAULT 0 COMMENT 'SL đạt XẢ',
    xa_ng_quantity INT DEFAULT 0 COMMENT 'SL NG XẢ',
    xa_ng_reason TEXT COMMENT 'Lý do NG XẢ',
    xa_efficiency DECIMAL(5,2) COMMENT 'Hiệu suất XẢ (%)',
    xa_note TEXT COMMENT 'Ghi chú XẢ',
    xa_status ENUM('waiting', 'in_progress', 'completed', 'paused') DEFAULT 'waiting' COMMENT 'Trạng thái XẢ',
    
    -- 2. XÉN - Detailed tracking
    xen_start_time DATETIME COMMENT 'Thời gian bắt đầu XÉN',
    xen_end_time DATETIME COMMENT 'Thời gian kết thúc XÉN',
    xen_worker_name VARCHAR(100) COMMENT 'Tên thợ XÉN',
    xen_machine_name VARCHAR(50) COMMENT 'Tên máy XÉN',
    xen_input_quantity INT DEFAULT 0 COMMENT 'SL đầu vào XÉN',
    xen_output_quantity INT DEFAULT 0 COMMENT 'SL đầu ra XÉN',
    xen_good_quantity INT DEFAULT 0 COMMENT 'SL đạt XÉN',
    xen_ng_quantity INT DEFAULT 0 COMMENT 'SL NG XÉN',
    xen_ng_reason TEXT COMMENT 'Lý do NG XÉN',
    xen_efficiency DECIMAL(5,2) COMMENT 'Hiệu suất XÉN (%)',
    xen_note TEXT COMMENT 'Ghi chú XÉN',
    xen_status ENUM('waiting', 'in_progress', 'completed', 'paused') DEFAULT 'waiting' COMMENT 'Trạng thái XÉN',
    
    -- 3. IN OFFSET - Detailed tracking
    in_offset_start_time DATETIME COMMENT 'Thời gian bắt đầu IN OFFSET',
    in_offset_end_time DATETIME COMMENT 'Thời gian kết thúc IN OFFSET',
    in_offset_worker_name VARCHAR(100) COMMENT 'Tên thợ IN OFFSET',
    in_offset_machine_name VARCHAR(50) COMMENT 'Tên máy IN OFFSET',
    in_offset_input_quantity INT DEFAULT 0 COMMENT 'SL đầu vào IN OFFSET',
    in_offset_output_quantity INT DEFAULT 0 COMMENT 'SL đầu ra IN OFFSET',
    in_offset_good_quantity INT DEFAULT 0 COMMENT 'SL đạt IN OFFSET',
    in_offset_ng_quantity INT DEFAULT 0 COMMENT 'SL NG IN OFFSET',
    in_offset_ng_reason TEXT COMMENT 'Lý do NG IN OFFSET',
    in_offset_efficiency DECIMAL(5,2) COMMENT 'Hiệu suất IN OFFSET (%)',
    in_offset_note TEXT COMMENT 'Ghi chú IN OFFSET',
    in_offset_status ENUM('waiting', 'in_progress', 'completed', 'paused') DEFAULT 'waiting' COMMENT 'Trạng thái IN OFFSET',
    
    -- 4. XÉN TOA - Detailed tracking
    xen_toa_start_time DATETIME COMMENT 'Thời gian bắt đầu XÉN TOA',
    xen_toa_end_time DATETIME COMMENT 'Thời gian kết thúc XÉN TOA',
    xen_toa_worker_name VARCHAR(100) COMMENT 'Tên thợ XÉN TOA',
    xen_toa_machine_name VARCHAR(50) COMMENT 'Tên máy XÉN TOA',
    xen_toa_input_quantity INT DEFAULT 0 COMMENT 'SL đầu vào XÉN TOA',
    xen_toa_output_quantity INT DEFAULT 0 COMMENT 'SL đầu ra XÉN TOA',
    xen_toa_good_quantity INT DEFAULT 0 COMMENT 'SL đạt XÉN TOA',
    xen_toa_ng_quantity INT DEFAULT 0 COMMENT 'SL NG XÉN TOA',
    xen_toa_ng_reason TEXT COMMENT 'Lý do NG XÉN TOA',
    xen_toa_efficiency DECIMAL(5,2) COMMENT 'Hiệu suất XÉN TOA (%)',
    xen_toa_note TEXT COMMENT 'Ghi chú XÉN TOA',
    xen_toa_status ENUM('waiting', 'in_progress', 'completed', 'paused') DEFAULT 'waiting' COMMENT 'Trạng thái XÉN TOA',
    
    -- 5. KCS IN - Detailed tracking
    kcs_in_start_time DATETIME COMMENT 'Thời gian bắt đầu KCS IN',
    kcs_in_end_time DATETIME COMMENT 'Thời gian kết thúc KCS IN',
    kcs_in_worker_name VARCHAR(100) COMMENT 'Tên thợ KCS IN',
    kcs_in_input_quantity INT DEFAULT 0 COMMENT 'SL đầu vào KCS IN',
    kcs_in_output_quantity INT DEFAULT 0 COMMENT 'SL đầu ra KCS IN',
    kcs_in_good_quantity INT DEFAULT 0 COMMENT 'SL đạt KCS IN',
    kcs_in_ng_quantity INT DEFAULT 0 COMMENT 'SL NG KCS IN',
    kcs_in_ng_reason TEXT COMMENT 'Lý do NG KCS IN',
    kcs_in_efficiency DECIMAL(5,2) COMMENT 'Hiệu suất KCS IN (%)',
    kcs_in_note TEXT COMMENT 'Ghi chú KCS IN',
    kcs_in_status ENUM('waiting', 'in_progress', 'completed', 'paused') DEFAULT 'waiting' COMMENT 'Trạng thái KCS IN',
    
    -- 6. KCS SAU IN - Detailed tracking
    kcs_sau_in_start_time DATETIME COMMENT 'Thời gian bắt đầu KCS SAU IN',
    kcs_sau_in_end_time DATETIME COMMENT 'Thời gian kết thúc KCS SAU IN',
    kcs_sau_in_worker_name VARCHAR(100) COMMENT 'Tên thợ KCS SAU IN',
    kcs_sau_in_input_quantity INT DEFAULT 0 COMMENT 'SL đầu vào KCS SAU IN',
    kcs_sau_in_output_quantity INT DEFAULT 0 COMMENT 'SL đầu ra KCS SAU IN',
    kcs_sau_in_good_quantity INT DEFAULT 0 COMMENT 'SL đạt KCS SAU IN',
    kcs_sau_in_ng_quantity INT DEFAULT 0 COMMENT 'SL NG KCS SAU IN',
    kcs_sau_in_ng_reason TEXT COMMENT 'Lý do NG KCS SAU IN',
    kcs_sau_in_efficiency DECIMAL(5,2) COMMENT 'Hiệu suất KCS SAU IN (%)',
    kcs_sau_in_note TEXT COMMENT 'Ghi chú KCS SAU IN',
    kcs_sau_in_status ENUM('waiting', 'in_progress', 'completed', 'paused') DEFAULT 'waiting' COMMENT 'Trạng thái KCS SAU IN',
    
    -- 7. LÁNG - Detailed tracking
    lang_start_time DATETIME COMMENT 'Thời gian bắt đầu LÁNG',
    lang_end_time DATETIME COMMENT 'Thời gian kết thúc LÁNG',
    lang_worker_name VARCHAR(100) COMMENT 'Tên thợ LÁNG',
    lang_machine_name VARCHAR(50) COMMENT 'Tên máy LÁNG',
    lang_input_quantity INT DEFAULT 0 COMMENT 'SL đầu vào LÁNG',
    lang_output_quantity INT DEFAULT 0 COMMENT 'SL đầu ra LÁNG',
    lang_good_quantity INT DEFAULT 0 COMMENT 'SL đạt LÁNG',
    lang_ng_quantity INT DEFAULT 0 COMMENT 'SL NG LÁNG',
    lang_ng_reason TEXT COMMENT 'Lý do NG LÁNG',
    lang_efficiency DECIMAL(5,2) COMMENT 'Hiệu suất LÁNG (%)',
    lang_note TEXT COMMENT 'Ghi chú LÁNG',
    lang_status ENUM('waiting', 'in_progress', 'completed', 'paused') DEFAULT 'waiting' COMMENT 'Trạng thái LÁNG',
    
    -- 8. IN LƯỚI - Detailed tracking
    in_luoi_start_time DATETIME COMMENT 'Thời gian bắt đầu IN LƯỚI',
    in_luoi_end_time DATETIME COMMENT 'Thời gian kết thúc IN LƯỚI',
    in_luoi_worker_name VARCHAR(100) COMMENT 'Tên thợ IN LƯỚI',
    in_luoi_machine_name VARCHAR(50) COMMENT 'Tên máy IN LƯỚI',
    in_luoi_input_quantity INT DEFAULT 0 COMMENT 'SL đầu vào IN LƯỚI',
    in_luoi_output_quantity INT DEFAULT 0 COMMENT 'SL đầu ra IN LƯỚI',
    in_luoi_good_quantity INT DEFAULT 0 COMMENT 'SL đạt IN LƯỚI',
    in_luoi_ng_quantity INT DEFAULT 0 COMMENT 'SL NG IN LƯỚI',
    in_luoi_ng_reason TEXT COMMENT 'Lý do NG IN LƯỚI',
    in_luoi_efficiency DECIMAL(5,2) COMMENT 'Hiệu suất IN LƯỚI (%)',
    in_luoi_note TEXT COMMENT 'Ghi chú IN LƯỚI',
    in_luoi_status ENUM('waiting', 'in_progress', 'completed', 'paused') DEFAULT 'waiting' COMMENT 'Trạng thái IN LƯỚI',
    
    -- 9. BỒI - Detailed tracking  
    boi_start_time DATETIME COMMENT 'Thời gian bắt đầu BỒI',
    boi_end_time DATETIME COMMENT 'Thời gian kết thúc BỒI',
    boi_worker_name VARCHAR(100) COMMENT 'Tên thợ BỒI',
    boi_machine_name VARCHAR(50) COMMENT 'Tên máy BỒI',
    boi_input_quantity INT DEFAULT 0 COMMENT 'SL đầu vào BỒI',
    boi_output_quantity INT DEFAULT 0 COMMENT 'SL đầu ra BỒI',
    boi_good_quantity INT DEFAULT 0 COMMENT 'SL đạt BỒI',
    boi_ng_quantity INT DEFAULT 0 COMMENT 'SL NG BỒI',
    boi_ng_reason TEXT COMMENT 'Lý do NG BỒI',
    boi_efficiency DECIMAL(5,2) COMMENT 'Hiệu suất BỒI (%)',
    boi_note TEXT COMMENT 'Ghi chú BỒI',
    boi_status ENUM('waiting', 'in_progress', 'completed', 'paused') DEFAULT 'waiting' COMMENT 'Trạng thái BỒI',
    
    -- 10. BẾ - Detailed tracking
    be_start_time DATETIME COMMENT 'Thời gian bắt đầu BẾ',
    be_end_time DATETIME COMMENT 'Thời gian kết thúc BẾ',
    be_worker_name VARCHAR(100) COMMENT 'Tên thợ BẾ',
    be_machine_name VARCHAR(50) COMMENT 'Tên máy BẾ',
    be_input_quantity INT DEFAULT 0 COMMENT 'SL đầu vào BẾ',
    be_output_quantity INT DEFAULT 0 COMMENT 'SL đầu ra BẾ',
    be_good_quantity INT DEFAULT 0 COMMENT 'SL đạt BẾ',
    be_ng_quantity INT DEFAULT 0 COMMENT 'SL NG BẾ',
    be_ng_reason TEXT COMMENT 'Lý do NG BẾ',
    be_efficiency DECIMAL(5,2) COMMENT 'Hiệu suất BẾ (%)',
    be_note TEXT COMMENT 'Ghi chú BẾ',
    be_status ENUM('waiting', 'in_progress', 'completed', 'paused') DEFAULT 'waiting' COMMENT 'Trạng thái BẾ',
    
    -- 11. BÓC LẺ - Detailed tracking
    boc_le_start_time DATETIME COMMENT 'Thời gian bắt đầu BÓC LẺ',
    boc_le_end_time DATETIME COMMENT 'Thời gian kết thúc BÓC LẺ',
    boc_le_worker_name VARCHAR(100) COMMENT 'Tên thợ BÓC LẺ',
    boc_le_machine_name VARCHAR(50) COMMENT 'Tên máy BÓC LẺ',
    boc_le_input_quantity INT DEFAULT 0 COMMENT 'SL đầu vào BÓC LẺ',
    boc_le_output_quantity INT DEFAULT 0 COMMENT 'SL đầu ra BÓC LẺ',
    boc_le_good_quantity INT DEFAULT 0 COMMENT 'SL đạt BÓC LẺ',
    boc_le_ng_quantity INT DEFAULT 0 COMMENT 'SL NG BÓC LẺ',
    boc_le_ng_reason TEXT COMMENT 'Lý do NG BÓC LẺ',
    boc_le_efficiency DECIMAL(5,2) COMMENT 'Hiệu suất BÓC LẺ (%)',
    boc_le_note TEXT COMMENT 'Ghi chú BÓC LẺ',
    boc_le_status ENUM('waiting', 'in_progress', 'completed', 'paused') DEFAULT 'waiting' COMMENT 'Trạng thái BÓC LẺ',
    
    -- 12. DÁN 3M-NILON - Detailed tracking
    dan_3m_start_time DATETIME COMMENT 'Thời gian bắt đầu DÁN 3M-NILON',
    dan_3m_end_time DATETIME COMMENT 'Thời gian kết thúc DÁN 3M-NILON',
    dan_3m_worker_name VARCHAR(100) COMMENT 'Tên thợ DÁN 3M-NILON',
    dan_3m_machine_name VARCHAR(50) COMMENT 'Tên máy DÁN 3M-NILON',
    dan_3m_input_quantity INT DEFAULT 0 COMMENT 'SL đầu vào DÁN 3M-NILON',
    dan_3m_output_quantity INT DEFAULT 0 COMMENT 'SL đầu ra DÁN 3M-NILON',
    dan_3m_good_quantity INT DEFAULT 0 COMMENT 'SL đạt DÁN 3M-NILON',
    dan_3m_ng_quantity INT DEFAULT 0 COMMENT 'SL NG DÁN 3M-NILON',
    dan_3m_ng_reason TEXT COMMENT 'Lý do NG DÁN 3M-NILON',
    dan_3m_efficiency DECIMAL(5,2) COMMENT 'Hiệu suất DÁN 3M-NILON (%)',
    dan_3m_note TEXT COMMENT 'Ghi chú DÁN 3M-NILON',
    dan_3m_status ENUM('waiting', 'in_progress', 'completed', 'paused') DEFAULT 'waiting' COMMENT 'Trạng thái DÁN 3M-NILON',
    
    -- 13. DÁN MÁY - Detailed tracking
    dan_may_start_time DATETIME COMMENT 'Thời gian bắt đầu DÁN MÁY',
    dan_may_end_time DATETIME COMMENT 'Thời gian kết thúc DÁN MÁY',
    dan_may_worker_name VARCHAR(100) COMMENT 'Tên thợ DÁN MÁY',
    dan_may_machine_name VARCHAR(50) COMMENT 'Tên máy DÁN MÁY',
    dan_may_input_quantity INT DEFAULT 0 COMMENT 'SL đầu vào DÁN MÁY',
    dan_may_output_quantity INT DEFAULT 0 COMMENT 'SL đầu ra DÁN MÁY',
    dan_may_good_quantity INT DEFAULT 0 COMMENT 'SL đạt DÁN MÁY',
    dan_may_ng_quantity INT DEFAULT 0 COMMENT 'SL NG DÁN MÁY',
    dan_may_ng_reason TEXT COMMENT 'Lý do NG DÁN MÁY',
    dan_may_efficiency DECIMAL(5,2) COMMENT 'Hiệu suất DÁN MÁY (%)',
    dan_may_note TEXT COMMENT 'Ghi chú DÁN MÁY',
    dan_may_status ENUM('waiting', 'in_progress', 'completed', 'paused') DEFAULT 'waiting' COMMENT 'Trạng thái DÁN MÁY',
    
    -- 14. HOÀN THIỆN - Detailed tracking
    hoan_thien_start_time DATETIME COMMENT 'Thời gian bắt đầu HOÀN THIỆN',
    hoan_thien_end_time DATETIME COMMENT 'Thời gian kết thúc HOÀN THIỆN',
    hoan_thien_worker_name VARCHAR(100) COMMENT 'Tên thợ HOÀN THIỆN',
    hoan_thien_machine_name VARCHAR(50) COMMENT 'Tên máy HOÀN THIỆN',
    hoan_thien_input_quantity INT DEFAULT 0 COMMENT 'SL đầu vào HOÀN THIỆN',
    hoan_thien_output_quantity INT DEFAULT 0 COMMENT 'SL đầu ra HOÀN THIỆN',
    hoan_thien_good_quantity INT DEFAULT 0 COMMENT 'SL đạt HOÀN THIỆN',
    hoan_thien_ng_quantity INT DEFAULT 0 COMMENT 'SL NG HOÀN THIỆN',
    hoan_thien_ng_reason TEXT COMMENT 'Lý do NG HOÀN THIỆN',
    hoan_thien_efficiency DECIMAL(5,2) COMMENT 'Hiệu suất HOÀN THIỆN (%)',
    hoan_thien_note TEXT COMMENT 'Ghi chú HOÀN THIỆN',
    hoan_thien_status ENUM('waiting', 'in_progress', 'completed', 'paused') DEFAULT 'waiting' COMMENT 'Trạng thái HOÀN THIỆN',
    
    -- 15. GHIM - Detailed tracking
    ghim_start_time DATETIME COMMENT 'Thời gian bắt đầu GHIM',
    ghim_end_time DATETIME COMMENT 'Thời gian kết thúc GHIM',
    ghim_worker_name VARCHAR(100) COMMENT 'Tên thợ GHIM',
    ghim_machine_name VARCHAR(50) COMMENT 'Tên máy GHIM',
    ghim_input_quantity INT DEFAULT 0 COMMENT 'SL đầu vào GHIM',
    ghim_output_quantity INT DEFAULT 0 COMMENT 'SL đầu ra GHIM',
    ghim_good_quantity INT DEFAULT 0 COMMENT 'SL đạt GHIM',
    ghim_ng_quantity INT DEFAULT 0 COMMENT 'SL NG GHIM',
    ghim_ng_reason TEXT COMMENT 'Lý do NG GHIM',
    ghim_efficiency DECIMAL(5,2) COMMENT 'Hiệu suất GHIM (%)',
    ghim_note TEXT COMMENT 'Ghi chú GHIM',
    ghim_status ENUM('waiting', 'in_progress', 'completed', 'paused') DEFAULT 'waiting' COMMENT 'Trạng thái GHIM',
    
    -- 16. GẤP - Detailed tracking
    gap_start_time DATETIME COMMENT 'Thời gian bắt đầu GẤP',
    gap_end_time DATETIME COMMENT 'Thời gian kết thúc GẤP',
    gap_worker_name VARCHAR(100) COMMENT 'Tên thợ GẤP',
    gap_machine_name VARCHAR(50) COMMENT 'Tên máy GẤP',
    gap_input_quantity INT DEFAULT 0 COMMENT 'SL đầu vào GẤP',
    gap_output_quantity INT DEFAULT 0 COMMENT 'SL đầu ra GẤP',
    gap_good_quantity INT DEFAULT 0 COMMENT 'SL đạt GẤP',
    gap_ng_quantity INT DEFAULT 0 COMMENT 'SL NG GẤP',
    gap_ng_reason TEXT COMMENT 'Lý do NG GẤP',
    gap_efficiency DECIMAL(5,2) COMMENT 'Hiệu suất GẤP (%)',
    gap_note TEXT COMMENT 'Ghi chú GẤP',
    gap_status ENUM('waiting', 'in_progress', 'completed', 'paused') DEFAULT 'waiting' COMMENT 'Trạng thái GẤP',
    
    -- 17. NHẬP KHO - Detailed tracking
    nhap_kho_start_time DATETIME COMMENT 'Thời gian bắt đầu NHẬP KHO',
    nhap_kho_end_time DATETIME COMMENT 'Thời gian kết thúc NHẬP KHO',
    nhap_kho_worker_name VARCHAR(100) COMMENT 'Tên thợ NHẬP KHO',
    nhap_kho_input_quantity INT DEFAULT 0 COMMENT 'SL đầu vào NHẬP KHO',
    nhap_kho_output_quantity INT DEFAULT 0 COMMENT 'SL đầu ra NHẬP KHO',
    nhap_kho_good_quantity INT DEFAULT 0 COMMENT 'SL đạt NHẬP KHO',
    nhap_kho_ng_quantity INT DEFAULT 0 COMMENT 'SL NG NHẬP KHO',
    nhap_kho_ng_reason TEXT COMMENT 'Lý do NG NHẬP KHO',
    nhap_kho_efficiency DECIMAL(5,2) COMMENT 'Hiệu suất NHẬP KHO (%)',
    nhap_kho_note TEXT COMMENT 'Ghi chú NHẬP KHO',
    nhap_kho_status ENUM('waiting', 'in_progress', 'completed', 'paused') DEFAULT 'waiting' COMMENT 'Trạng thái NHẬP KHO',
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Thời gian tạo',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Thời gian cập nhật',
    
    INDEX idx_deployment_date (deployment_date),
    INDEX idx_production_order (production_order),
    INDEX idx_po_number (po_number),
    INDEX idx_customer_code (customer_code),
    INDEX idx_status (status),
    INDEX idx_order_date (order_date),
    INDEX idx_delivery_date (delivery_date),
    INDEX idx_current_stage (current_stage),
    INDEX idx_workflow_definition (workflow_definition(100)),
    INDEX idx_production_date (production_date),
    INDEX idx_production_shift (production_shift),
    INDEX idx_assigned_machine (assigned_machine)
    
    -- Indexes cho các trạng thái stage
    INDEX idx_xa_status (xa_status),
    INDEX idx_xen_status (xen_status),
    INDEX idx_in_offset_status (in_offset_status),
    INDEX idx_xen_toa_status (xen_toa_status),
    INDEX idx_kcs_in_status (kcs_in_status),
    INDEX idx_kcs_sau_in_status (kcs_sau_in_status),
    INDEX idx_lang_status (lang_status),
    INDEX idx_in_luoi_status (in_luoi_status),
    INDEX idx_boi_status (boi_status),
    INDEX idx_be_status (be_status),
    INDEX idx_boc_le_status (boc_le_status),
    INDEX idx_dan_3m_status (dan_3m_status),
    INDEX idx_dan_may_status (dan_may_status),
    INDEX idx_hoan_thien_status (hoan_thien_status),
    INDEX idx_ghim_status (ghim_status),
    INDEX idx_gap_status (gap_status),
    INDEX idx_nhap_kho_status (nhap_kho_status)
    
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Bảng quản lý lệnh sản xuất với đầy đủ 17 công đoạn';

-- Tạo stored procedure để bàn giao trực tiếp vào cột input_quantity của stage tiếp theo
DELIMITER //
CREATE PROCEDURE handover_to_next_stage(
    IN p_order_id INT,
    IN p_current_stage VARCHAR(20),
    IN p_handover_quantity INT,
    IN p_handover_person VARCHAR(100),
    IN p_receiver_person VARCHAR(100),
    IN p_notes TEXT
)
BEGIN
    DECLARE p_next_stage VARCHAR(20);
    DECLARE p_current_output_col VARCHAR(50);
    DECLARE p_next_input_col VARCHAR(50);
    
    -- Xác định stage tiếp theo và tên cột
    CASE p_current_stage
        WHEN 'xa' THEN 
            SET p_next_stage = 'xen';
            SET p_current_output_col = 'xa_output_quantity';
            SET p_next_input_col = 'xen_input_quantity';
        WHEN 'xen' THEN 
            SET p_next_stage = 'in_offset';
            SET p_current_output_col = 'xen_output_quantity';
            SET p_next_input_col = 'in_offset_input_quantity';
        WHEN 'in_offset' THEN 
            SET p_next_stage = 'xen_toa';
            SET p_current_output_col = 'in_offset_output_quantity';
            SET p_next_input_col = 'xen_toa_input_quantity';
        WHEN 'xen_toa' THEN 
            SET p_next_stage = 'kcs_in';
            SET p_current_output_col = 'xen_toa_output_quantity';
            SET p_next_input_col = 'kcs_in_input_quantity';
        WHEN 'kcs_in' THEN 
            SET p_next_stage = 'kcs_sau_in';
            SET p_current_output_col = 'kcs_in_output_quantity';
            SET p_next_input_col = 'kcs_sau_in_input_quantity';
        WHEN 'kcs_sau_in' THEN 
            SET p_next_stage = 'lang';
            SET p_current_output_col = 'kcs_sau_in_output_quantity';
            SET p_next_input_col = 'lang_input_quantity';
        WHEN 'lang' THEN 
            SET p_next_stage = 'in_luoi';
            SET p_current_output_col = 'lang_output_quantity';
            SET p_next_input_col = 'in_luoi_input_quantity';
        WHEN 'in_luoi' THEN 
            SET p_next_stage = 'boi';
            SET p_current_output_col = 'in_luoi_output_quantity';
            SET p_next_input_col = 'boi_input_quantity';
        WHEN 'boi' THEN 
            SET p_next_stage = 'be';
            SET p_current_output_col = 'boi_output_quantity';
            SET p_next_input_col = 'be_input_quantity';
        WHEN 'be' THEN 
            SET p_next_stage = 'boc_le';
            SET p_current_output_col = 'be_output_quantity';
            SET p_next_input_col = 'boc_le_input_quantity';
        WHEN 'boc_le' THEN 
            SET p_next_stage = 'dan_3m';
            SET p_current_output_col = 'boc_le_output_quantity';
            SET p_next_input_col = 'dan_3m_input_quantity';
        WHEN 'dan_3m' THEN 
            SET p_next_stage = 'dan_may';
            SET p_current_output_col = 'dan_3m_output_quantity';
            SET p_next_input_col = 'dan_may_input_quantity';
        WHEN 'dan_may' THEN 
            SET p_next_stage = 'hoan_thien';
            SET p_current_output_col = 'dan_may_output_quantity';
            SET p_next_input_col = 'hoan_thien_input_quantity';
        WHEN 'hoan_thien' THEN 
            SET p_next_stage = 'ghim';
            SET p_current_output_col = 'hoan_thien_output_quantity';
            SET p_next_input_col = 'ghim_input_quantity';
        WHEN 'ghim' THEN 
            SET p_next_stage = 'gap';
            SET p_current_output_col = 'ghim_output_quantity';
            SET p_next_input_col = 'gap_input_quantity';
        WHEN 'gap' THEN 
            SET p_next_stage = 'nhap_kho';
            SET p_current_output_col = 'gap_output_quantity';
            SET p_next_input_col = 'nhap_kho_input_quantity';
        ELSE 
            SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Stage không hợp lệ hoặc đã là stage cuối cùng';
    END CASE;
    
    -- Cập nhật dữ liệu trong 1 transaction
    START TRANSACTION;
    
    -- 1. Cập nhật output_quantity của stage hiện tại
    SET @update_current_sql = CONCAT('
        UPDATE production_orders 
        SET 
            ', p_current_output_col, ' = ', p_handover_quantity, ',
            ', p_current_stage, '_status = "completed",
            ', p_current_stage, '_end_time = NOW()
        WHERE id = ', p_order_id
    );
    PREPARE stmt_current FROM @update_current_sql;
    EXECUTE stmt_current;
    DEALLOCATE PREPARE stmt_current;
    
    -- 2. Cập nhật input_quantity của stage tiếp theo
    SET @update_next_sql = CONCAT('
        UPDATE production_orders 
        SET 
            ', p_next_input_col, ' = ', p_handover_quantity, ',
            ', p_next_stage, '_status = "in_progress",
            ', p_next_stage, '_start_time = NOW(),
            current_stage = "', p_next_stage, '",
            current_stage_index = current_stage_index + 1
        WHERE id = ', p_order_id
    );
    PREPARE stmt_next FROM @update_next_sql;
    EXECUTE stmt_next;
    DEALLOCATE PREPARE stmt_next;
    
    -- 3. Ghi log vào bảng lịch sử (optional)
    INSERT INTO stage_handover_history (
        production_order_id, handover_date, from_stage, to_stage,
        quantity_handover, quantity_received, quantity_difference,
        handover_person, receiver_person, notes, status
    ) VALUES (
        p_order_id, NOW(), p_current_stage, p_next_stage,
        p_handover_quantity, p_handover_quantity, 0,
        p_handover_person, p_receiver_person, p_notes, 'confirmed'
    );
    
    COMMIT;
    
END //
DELIMITER ;

-- Chèn dữ liệu mẫu với workflow đầy đủ 17 công đoạn