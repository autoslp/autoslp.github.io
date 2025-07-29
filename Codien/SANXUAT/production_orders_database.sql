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

-- Tạo bảng lịch sử bàn giao giữa các công đoạn
CREATE TABLE IF NOT EXISTS stage_handover_history (
    id INT AUTO_INCREMENT PRIMARY KEY,
    production_order_id INT NOT NULL COMMENT 'ID của lệnh sản xuất',
    handover_date DATETIME NOT NULL COMMENT 'Thời gian bàn giao',
    from_stage VARCHAR(20) NOT NULL COMMENT 'Công đoạn bàn giao',
    to_stage VARCHAR(20) NOT NULL COMMENT 'Công đoạn nhận',
    quantity_handover INT NOT NULL COMMENT 'Số lượng bàn giao',
    quantity_received INT NOT NULL COMMENT 'Số lượng nhận thực tế',
    quantity_difference INT NOT NULL DEFAULT 0 COMMENT 'Chênh lệch số lượng',
    handover_person VARCHAR(100) COMMENT 'Người bàn giao',
    receiver_person VARCHAR(100) COMMENT 'Người nhận',
    notes TEXT COMMENT 'Ghi chú bàn giao',
    status ENUM('pending', 'confirmed', 'rejected') DEFAULT 'pending' COMMENT 'Trạng thái bàn giao',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_production_order_id (production_order_id),
    INDEX idx_from_stage (from_stage),
    INDEX idx_to_stage (to_stage),
    INDEX idx_handover_date (handover_date),
    INDEX idx_status (status),
    
    FOREIGN KEY (production_order_id) REFERENCES production_orders(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Lịch sử bàn giao giữa các công đoạn';

-- Tạo stored procedure để ghi lại lịch sử bàn giao
DELIMITER //
CREATE PROCEDURE record_stage_handover(
    IN p_order_id INT,
    IN p_from_stage VARCHAR(20),
    IN p_to_stage VARCHAR(20),
    IN p_quantity_handover INT,
    IN p_quantity_received INT,
    IN p_handover_person VARCHAR(100),
    IN p_receiver_person VARCHAR(100),
    IN p_notes TEXT
)
BEGIN
    -- Tính toán chênh lệch
    DECLARE p_difference INT;
    SET p_difference = p_quantity_received - p_quantity_handover;
    
    -- Ghi lịch sử bàn giao
    INSERT INTO stage_handover_history (
        production_order_id,
        handover_date,
        from_stage,
        to_stage,
        quantity_handover,
        quantity_received,
        quantity_difference,
        handover_person,
        receiver_person,
        notes,
        status
    ) VALUES (
        p_order_id,
        NOW(),
        p_from_stage,
        p_to_stage,
        p_quantity_handover,
        p_quantity_received,
        p_difference,
        p_handover_person,
        p_receiver_person,
        p_notes,
        'confirmed'
    );
    
    -- Cập nhật công đoạn hiện tại của đơn hàng
    UPDATE production_orders
    SET current_stage = p_to_stage,
        current_stage_index = current_stage_index + 1
    WHERE id = p_order_id;
    
    -- Cập nhật trạng thái và số lượng cho công đoạn mới
    SET @update_sql = CONCAT('
        UPDATE production_orders
        SET 
            ', p_from_stage, '_status = "completed",
            ', p_to_stage, '_status = "in_progress",
            ', p_to_stage, '_input_quantity = ', p_quantity_received, '
        WHERE id = ', p_order_id
    );
    
    PREPARE stmt FROM @update_sql;
    EXECUTE stmt;
    DEALLOCATE PREPARE stmt;
END //
DELIMITER ;

-- Chèn dữ liệu mẫu với workflow đầy đủ 17 công đoạn
INSERT INTO production_orders (
    deployment_date, production_order, po_number, sales_order_code, order_date, delivery_date,
    internal_product_code, order_type, customer_code, customer_name, product_name, version,
    not_deployed_reason, sales_note, customer_production_note, order_quantity, inventory,
    required_quantity, deployed_quantity, offset_waste, waste, sheet_count, product_length,
    product_width, product_height, paper_length, paper_width, part_count, color_count,
    customer_group, paper_type, paper_weight, work_stage, status,
    -- Workflow fields với đầy đủ 17 công đoạn
    workflow_definition, current_stage, current_stage_index, stage_progress,
    production_date, production_shift, assigned_machine, worker_name,
    stage_input_quantity, stage_good_quantity, stage_ng_quantity
) VALUES 
(
    '2025-03-04', '01-2503-00065', '25.03.008.02', 'SLM-00217DCO-01', '2025-03-04', '2025-03-22',
    'SLM-00217DCO-01-16b', 'Đại trà', '3226329', 'Công ty TNHH Dorco vina', 
    'P3373 SVA4005-BX KR ONLINE IC', '1', '', 'Như lô gần nhất',
    'Như lô gần nhất - Hàng không được thiếu số lượng - Số lượng trên đã bao gồm số tờ in CẤP THÊM 50 TỜ ĐỂ LẤY 20 MẪU MÀU CHUẨN. ĐỐC CÔNG XƯỞNG IN DUYỆT ĐỂ LẤY MẪU MÀU CẤP CHO PHÒNG KỸ THUẬT',
    16688, 686, 16002, 23360, 340, 46, 1460, 148.00, 105.00, 0.00, 634.00, -452.00, 16, 2,
    'Nhóm 3', 'Couches TQ - Hikote', 200, 'Xả-Xén-In Offset-Xén Toa-KCS In-KCS Sau In-Láng-In Lưới-Bồi-Bế-Bóc Lẻ-Dán 3M-Dán Máy-Hoàn Thiện-Ghim-Gấp-Nhập Kho', 'Đang sản xuất',
    -- Workflow fields với đầy đủ 17 công đoạn
    'xa,xen,in_offset,xen_toa,kcs_in,kcs_sau_in,lang,in_luoi,boi,be,boc_le,dan_3m,dan_may,hoan_thien,ghim,gap,nhap_kho', 'xen', 1, 
    '{"xa":{"status":"completed","inputQty":23360,"goodQty":23000,"ngQty":360},"xen":{"status":"in_progress","inputQty":23000,"goodQty":0,"ngQty":0},"in_offset":{"status":"waiting","inputQty":0,"goodQty":0,"ngQty":0},"xen_toa":{"status":"waiting","inputQty":0,"goodQty":0,"ngQty":0},"kcs_in":{"status":"waiting","inputQty":0,"goodQty":0,"ngQty":0},"kcs_sau_in":{"status":"waiting","inputQty":0,"goodQty":0,"ngQty":0},"lang":{"status":"waiting","inputQty":0,"goodQty":0,"ngQty":0},"in_luoi":{"status":"waiting","inputQty":0,"goodQty":0,"ngQty":0},"boi":{"status":"waiting","inputQty":0,"goodQty":0,"ngQty":0},"be":{"status":"waiting","inputQty":0,"goodQty":0,"ngQty":0},"boc_le":{"status":"waiting","inputQty":0,"goodQty":0,"ngQty":0},"dan_3m":{"status":"waiting","inputQty":0,"goodQty":0,"ngQty":0},"dan_may":{"status":"waiting","inputQty":0,"goodQty":0,"ngQty":0},"hoan_thien":{"status":"waiting","inputQty":0,"goodQty":0,"ngQty":0},"ghim":{"status":"waiting","inputQty":0,"goodQty":0,"ngQty":0},"gap":{"status":"waiting","inputQty":0,"goodQty":0,"ngQty":0},"nhap_kho":{"status":"waiting","inputQty":0,"goodQty":0,"ngQty":0}}',
    '2025-03-04', 'Ca 1', 'Xén 1', 'Nguyễn Văn A',
    23000, 0, 0
),
(
    '2025-03-04', '01-2503-00067', '25.03.009.01', 'SLM-00452HAV-02', '2025-03-04', '2025-03-09',
    'SLM-00452HAV-02-4b', 'Đại trà', '0', 'Công Ty TNHH Dược Hanvet',
    'Hộp Clafotax, 1 gam (10 lọ x 1 gam)', '2', '', 
    'Thêm mã QR code. Nội dung còn lại như cũ. Màu sắc, quy cách như cũ. Sửa tên sp là: Hộp Clafotax, 1 gam (10 lọ x 1 gam)',
    'Ra bản mới Thêm mã QR code theo ECN số 6343. - Nội dung còn lại như cũ. Màu sắc, quy cách như cũ. - Cũ in giấy CM, lô này in giấy NB=> Chú ý in đúng màu và ra bản theo chế độ anh Tuấn chỉ định',
    10000, 0, 10000, 10880, 150, 9, 2720, 135.00, 53.00, 65.00, -563.00, 406.00, 4, 3,
    'Nhóm 2', 'Duplex Hanson', 350, 'Xả-Xén-In Offset-Xén Toa-KCS In-KCS Sau In-Láng-In Lưới-Bồi-Bế-Bóc Lẻ-Dán 3M-Dán Máy-Hoàn Thiện-Ghim-Gấp-Nhập Kho', 'Đang sản xuất',
    -- Workflow fields với đầy đủ 17 công đoạn
    'xa,xen,in_offset,xen_toa,kcs_in,kcs_sau_in,lang,in_luoi,boi,be,boc_le,dan_3m,dan_may,hoan_thien,ghim,gap,nhap_kho', 'in_offset', 2, 
    '{"xa":{"status":"completed","inputQty":10880,"goodQty":10800,"ngQty":80},"xen":{"status":"completed","inputQty":10800,"goodQty":10700,"ngQty":100},"in_offset":{"status":"in_progress","inputQty":10700,"goodQty":0,"ngQty":0},"xen_toa":{"status":"waiting","inputQty":0,"goodQty":0,"ngQty":0},"kcs_in":{"status":"waiting","inputQty":0,"goodQty":0,"ngQty":0},"kcs_sau_in":{"status":"waiting","inputQty":0,"goodQty":0,"ngQty":0},"lang":{"status":"waiting","inputQty":0,"goodQty":0,"ngQty":0},"in_luoi":{"status":"waiting","inputQty":0,"goodQty":0,"ngQty":0},"boi":{"status":"waiting","inputQty":0,"goodQty":0,"ngQty":0},"be":{"status":"waiting","inputQty":0,"goodQty":0,"ngQty":0},"boc_le":{"status":"waiting","inputQty":0,"goodQty":0,"ngQty":0},"dan_3m":{"status":"waiting","inputQty":0,"goodQty":0,"ngQty":0},"dan_may":{"status":"waiting","inputQty":0,"goodQty":0,"ngQty":0},"hoan_thien":{"status":"waiting","inputQty":0,"goodQty":0,"ngQty":0},"ghim":{"status":"waiting","inputQty":0,"goodQty":0,"ngQty":0},"gap":{"status":"waiting","inputQty":0,"goodQty":0,"ngQty":0},"nhap_kho":{"status":"waiting","inputQty":0,"goodQty":0,"ngQty":0}}',
    '2025-03-04', 'Ca 2', 'Offset 1', 'Trần Thị B',
    10700, 0, 0
),
(
    '2025-03-04', '01-2503-00068', 'YCM.7574.2', 'SLM-00056HNA-10', '2025-03-04', '2025-03-05',
    'SLM-00056HNA-10-9b', 'Mẫu', '0', 'Công ty TNHH Dược Phẩm Hoa Linh Hà Nam',
    'Hộp kem đánh răng Ngọc Châu truyền thống 100g', '10', '',
    '-', 'Nội dung theo mẫu đã in. Màu theo mẫu cũ=> Xưởng in duyệt màu khi in - Mẫu đã in khách báo bị loang màu - Cần 6 bộ mẫu',
    0, 0, 18, 4500, 0, 24900, 500, 45.00, 35.00, 185.00, -760.00, 532.00, 9, 5,
    'Nhóm 3', 'Ivory NingBo', 350, 'Xả-Xén-In Offset-Xén Toa-KCS In-KCS Sau In-Láng-In Lưới-Bồi-Bế-Bóc Lẻ-Dán 3M-Dán Máy-Hoàn Thiện-Ghim-Gấp-Nhập Kho', 'Chờ triển khai',
    -- Workflow fields với đầy đủ 17 công đoạn
    'xa,xen,in_offset,xen_toa,kcs_in,kcs_sau_in,lang,in_luoi,boi,be,boc_le,dan_3m,dan_may,hoan_thien,ghim,gap,nhap_kho', 'xa', 0, 
    '{"xa":{"status":"waiting","inputQty":4500,"goodQty":0,"ngQty":0},"xen":{"status":"waiting","inputQty":0,"goodQty":0,"ngQty":0},"in_offset":{"status":"waiting","inputQty":0,"goodQty":0,"ngQty":0},"xen_toa":{"status":"waiting","inputQty":0,"goodQty":0,"ngQty":0},"kcs_in":{"status":"waiting","inputQty":0,"goodQty":0,"ngQty":0},"kcs_sau_in":{"status":"waiting","inputQty":0,"goodQty":0,"ngQty":0},"lang":{"status":"waiting","inputQty":0,"goodQty":0,"ngQty":0},"in_luoi":{"status":"waiting","inputQty":0,"goodQty":0,"ngQty":0},"boi":{"status":"waiting","inputQty":0,"goodQty":0,"ngQty":0},"be":{"status":"waiting","inputQty":0,"goodQty":0,"ngQty":0},"boc_le":{"status":"waiting","inputQty":0,"goodQty":0,"ngQty":0},"dan_3m":{"status":"waiting","inputQty":0,"goodQty":0,"ngQty":0},"dan_may":{"status":"waiting","inputQty":0,"goodQty":0,"ngQty":0},"hoan_thien":{"status":"waiting","inputQty":0,"goodQty":0,"ngQty":0},"ghim":{"status":"waiting","inputQty":0,"goodQty":0,"ngQty":0},"gap":{"status":"waiting","inputQty":0,"goodQty":0,"ngQty":0},"nhap_kho":{"status":"waiting","inputQty":0,"goodQty":0,"ngQty":0}}',
    '2025-03-04', 'Ca 1', 'Xả 1', '',
    4500, 0, 0
),
(
    '2025-03-04', '01-2503-00069', '25.02.011.04', 'SLM-00031APT-01', NULL, '2025-03-07',
    'SLM-00031APT-01-4b', 'Bù', '0', 'Công ty TNHH ARTPRESTO Việt Nam',
    'Hộp đồ chơi VNF-081077~VNF-081083 + VNF-081650 JAPAN ICHIBANKUJI SHINGEKINOKYOJIN SEKAI PRIZE I1 ~ I8 CHOKONOKKO FIGURE', '1', '',
    'Như mẫu khách hàng ký duyệt (Tone B). Tên cũ của sản phẩm là Hộp đồ chơi VNF-081004 JAPAN ICHIBANKUJI SHINGEKINOKYOJIN SEKAI PRIZE I CHOKONOKKO FIGURE',
    'In bù LSX 01-2502-00677 = cần 1.627 cái - Hàng không được thiếu số lượng - Kho cấp hết ram thiếu ít xả K1000',
    48188, -482, 1627, 3600, 270, 121, 900, 70.00, 70.00, 70.00, 598.00, -478.00, 4, 4,
    'Nhóm 4', 'Ivory NingBo', 350, 'Xả-Xén-In Offset-Xén Toa-KCS In-KCS Sau In-Láng-In Lưới-Bồi-Bế-Bóc Lẻ-Dán 3M-Dán Máy-Hoàn Thiện-Ghim-Gấp-Nhập Kho', 'Đang sản xuất',
    -- Workflow fields với đầy đủ 17 công đoạn
    'xa,xen,in_offset,xen_toa,kcs_in,kcs_sau_in,lang,in_luoi,boi,be,boc_le,dan_3m,dan_may,hoan_thien,ghim,gap,nhap_kho', 'nhap_kho', 16, 
    '{"xa":{"status":"completed","inputQty":3600,"goodQty":3500,"ngQty":100},"xen":{"status":"completed","inputQty":3500,"goodQty":3400,"ngQty":100},"in_offset":{"status":"completed","inputQty":3400,"goodQty":3300,"ngQty":100},"xen_toa":{"status":"completed","inputQty":3300,"goodQty":3200,"ngQty":100},"kcs_in":{"status":"completed","inputQty":3200,"goodQty":3100,"ngQty":100},"kcs_sau_in":{"status":"completed","inputQty":3100,"goodQty":3000,"ngQty":100},"lang":{"status":"completed","inputQty":3000,"goodQty":2900,"ngQty":100},"in_luoi":{"status":"completed","inputQty":2900,"goodQty":2800,"ngQty":100},"boi":{"status":"completed","inputQty":2800,"goodQty":2700,"ngQty":100},"be":{"status":"completed","inputQty":2700,"goodQty":2600,"ngQty":100},"boc_le":{"status":"completed","inputQty":2600,"goodQty":2500,"ngQty":100},"dan_3m":{"status":"completed","inputQty":2500,"goodQty":2400,"ngQty":100},"dan_may":{"status":"completed","inputQty":2400,"goodQty":2300,"ngQty":100},"hoan_thien":{"status":"completed","inputQty":2300,"goodQty":2200,"ngQty":100},"ghim":{"status":"completed","inputQty":2200,"goodQty":2100,"ngQty":100},"gap":{"status":"completed","inputQty":2100,"goodQty":2000,"ngQty":100},"nhap_kho":{"status":"completed","inputQty":2000,"goodQty":2000,"ngQty":0}}',
    '2025-03-04', 'Ca 3', 'Kho A', 'Lê Văn C',
    2000, 2000, 0
);

-- Chèn dữ liệu mẫu cho lịch sử bàn giao
INSERT INTO stage_handover_history (
    production_order_id, handover_date, from_stage, to_stage, 
    quantity_handover, quantity_received, quantity_difference,
    handover_person, receiver_person, notes, status
) VALUES 
(1, '2025-03-04 08:30:00', 'xa', 'xen', 23000, 23000, 0, 'Nguyễn Văn A', 'Trần Thị B', 'Bàn giao từ XẢ sang XÉN - Số lượng đúng', 'confirmed'),
(1, '2025-03-04 10:15:00', 'xen', 'in_offset', 22500, 22500, 0, 'Trần Thị B', 'Lê Văn C', 'Bàn giao từ XÉN sang IN OFFSET - Số lượng đúng', 'confirmed'),
(2, '2025-03-04 09:00:00', 'xa', 'xen', 10800, 10800, 0, 'Phạm Văn D', 'Hoàng Thị E', 'Bàn giao từ XẢ sang XÉN - Số lượng đúng', 'confirmed'),
(2, '2025-03-04 11:30:00', 'xen', 'in_offset', 10700, 10700, 0, 'Hoàng Thị E', 'Vũ Văn F', 'Bàn giao từ XÉN sang IN OFFSET - Số lượng đúng', 'confirmed'),
(4, '2025-03-04 07:45:00', 'xa', 'xen', 3500, 3500, 0, 'Đỗ Văn G', 'Bùi Thị H', 'Bàn giao từ XẢ sang XÉN - Số lượng đúng', 'confirmed'),
(4, '2025-03-04 09:30:00', 'xen', 'in_offset', 3400, 3400, 0, 'Bùi Thị H', 'Ngô Văn I', 'Bàn giao từ XÉN sang IN OFFSET - Số lượng đúng', 'confirmed'),
(4, '2025-03-04 11:15:00', 'in_offset', 'xen_toa', 3300, 3300, 0, 'Ngô Văn I', 'Lý Thị J', 'Bàn giao từ IN OFFSET sang XÉN TOA - Số lượng đúng', 'confirmed'),
(4, '2025-03-04 13:00:00', 'xen_toa', 'kcs_in', 3200, 3200, 0, 'Lý Thị J', 'Hồ Văn K', 'Bàn giao từ XÉN TOA sang KCS IN - Số lượng đúng', 'confirmed'),
(4, '2025-03-04 14:30:00', 'kcs_in', 'kcs_sau_in', 3100, 3100, 0, 'Hồ Văn K', 'Đặng Thị L', 'Bàn giao từ KCS IN sang KCS SAU IN - Số lượng đúng', 'confirmed'),
(4, '2025-03-04 16:00:00', 'kcs_sau_in', 'lang', 3000, 3000, 0, 'Đặng Thị L', 'Tô Văn M', 'Bàn giao từ KCS SAU IN sang LÁNG - Số lượng đúng', 'confirmed'),
(4, '2025-03-04 17:30:00', 'lang', 'in_luoi', 2900, 2900, 0, 'Tô Văn M', 'Trịnh Thị N', 'Bàn giao từ LÁNG sang IN LƯỚI - Số lượng đúng', 'confirmed'),
(4, '2025-03-04 19:00:00', 'in_luoi', 'boi', 2800, 2800, 0, 'Trịnh Thị N', 'Lưu Văn O', 'Bàn giao từ IN LƯỚI sang BỒI - Số lượng đúng', 'confirmed'),
(4, '2025-03-05 08:00:00', 'boi', 'be', 2700, 2700, 0, 'Lưu Văn O', 'Phan Thị P', 'Bàn giao từ BỒI sang BẾ - Số lượng đúng', 'confirmed'),
(4, '2025-03-05 09:30:00', 'be', 'boc_le', 2600, 2600, 0, 'Phan Thị P', 'Võ Văn Q', 'Bàn giao từ BẾ sang BÓC LẺ - Số lượng đúng', 'confirmed'),
(4, '2025-03-05 11:00:00', 'boc_le', 'dan_3m', 2500, 2500, 0, 'Võ Văn Q', 'Huỳnh Thị R', 'Bàn giao từ BÓC LẺ sang DÁN 3M - Số lượng đúng', 'confirmed'),
(4, '2025-03-05 12:30:00', 'dan_3m', 'dan_may', 2400, 2400, 0, 'Huỳnh Thị R', 'Dương Văn S', 'Bàn giao từ DÁN 3M sang DÁN MÁY - Số lượng đúng', 'confirmed'),
(4, '2025-03-05 14:00:00', 'dan_may', 'hoan_thien', 2300, 2300, 0, 'Dương Văn S', 'Lê Thị T', 'Bàn giao từ DÁN MÁY sang HOÀN THIỆN - Số lượng đúng', 'confirmed'),
(4, '2025-03-05 15:30:00', 'hoan_thien', 'ghim', 2200, 2200, 0, 'Lê Thị T', 'Nguyễn Văn U', 'Bàn giao từ HOÀN THIỆN sang GHIM - Số lượng đúng', 'confirmed'),
(4, '2025-03-05 17:00:00', 'ghim', 'gap', 2100, 2100, 0, 'Nguyễn Văn U', 'Trần Thị V', 'Bàn giao từ GHIM sang GẤP - Số lượng đúng', 'confirmed'),
(4, '2025-03-05 18:30:00', 'gap', 'nhap_kho', 2000, 2000, 0, 'Trần Thị V', 'Lê Văn C', 'Bàn giao từ GẤP sang NHẬP KHO - Số lượng đúng', 'confirmed');

-- Test stored procedure
CALL record_stage_handover(1, 'xen', 'in_offset', 22500, 22500, 'Trần Thị B', 'Lê Văn C', 'Test bàn giao từ XÉN sang IN OFFSET');

-- Hiển thị thông tin đã tạo
SELECT 'Đã tạo thành công bảng production_orders với đầy đủ 17 công đoạn và lịch sử bàn giao' as message;

-- Hiển thị thống kê tổng quan
SELECT '=== THỐNG KÊ TỔNG QUAN ===' as info;
SELECT 
    COUNT(*) as total_orders,
    SUM(order_quantity) as total_quantity,
    COUNT(CASE WHEN status = 'Chờ triển khai' THEN 1 END) as pending_orders,
    COUNT(CASE WHEN status = 'Đang sản xuất' THEN 1 END) as in_progress_orders,
    COUNT(CASE WHEN status = 'Hoàn thành' THEN 1 END) as completed_orders
FROM production_orders;

-- Hiển thị workflow status
SELECT '=== WORKFLOW STATUS ===' as info;
SELECT 
    production_order, 
    current_stage, 
    current_stage_index,
    CASE 
        WHEN workflow_definition IS NOT NULL THEN
            ROUND((current_stage_index + 1) * 100.0 / 17, 2)
        ELSE 0 
    END as progress_percentage,
    status 
FROM production_orders;

-- Hiển thị lịch sử bàn giao
SELECT '=== LỊCH SỬ BÀN GIAO ===' as info;
SELECT 
    po.production_order,
    po.product_name,
    h.handover_date,
    h.from_stage,
    h.to_stage,
    h.quantity_handover,
    h.quantity_received,
    h.quantity_difference,
    h.handover_person,
    h.receiver_person,
    h.notes
FROM stage_handover_history h
JOIN production_orders po ON h.production_order_id = po.id
ORDER BY h.handover_date DESC;

-- Hiển thị thống kê theo stage
SELECT '=== THỐNG KÊ THEO STAGE ===' as info;
SELECT 
    current_stage as stage_name,
    COUNT(*) as total_orders,
    SUM(stage_input_quantity) as total_input_qty,
    SUM(stage_good_quantity) as total_good_qty,
    SUM(stage_ng_quantity) as total_ng_qty,
    CASE 
        WHEN SUM(stage_input_quantity) > 0 THEN 
            ROUND(SUM(stage_good_quantity) * 100.0 / SUM(stage_input_quantity), 2)
        ELSE 0 
    END as good_rate_percentage
FROM production_orders
WHERE current_stage IS NOT NULL
GROUP BY current_stage;