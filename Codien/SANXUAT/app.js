// Định nghĩa các công đoạn sản xuất
const CONG_DOAN = [
    { id: 1, ten: 'XẢ', moTa: 'Công đoạn xả giấy' },
    { id: 2, ten: 'XÉN', moTa: 'Công đoạn xén giấy' },
    { id: 3, ten: 'IN OFFSET', moTa: 'Công đoạn in offset' },
    { id: 4, ten: 'XÉN TOA', moTa: 'Công đoạn xén toa' },
    { id: 5, ten: 'KCS IN', moTa: 'Kiểm tra chất lượng in' },
    { id: 6, ten: 'KCS SAU IN', moTa: 'Kiểm tra chất lượng sau in' },
    { id: 7, ten: 'KHO NG IN', moTa: 'Kho nguyên liệu in' },
    { id: 8, ten: 'LÁNG', moTa: 'Công đoạn láng' },
    { id: 9, ten: 'IN LƯỚI', moTa: 'Công đoạn in lưới' },
    { id: 10, ten: 'BỒI', moTa: 'Công đoạn bồi' },
    { id: 11, ten: 'BẾ', moTa: 'Công đoạn bế' },
    { id: 12, ten: 'BÓC LỀ', moTa: 'Công đoạn bóc lề' },
    { id: 13, ten: 'DÁN MÁY', moTa: 'Công đoạn dán máy' },
    { id: 14, ten: 'KHO THÀNH PHẨM', moTa: 'Kho thành phẩm' }
];

// Mở rộng chi tiết cho các công đoạn
const CHI_TIET_CONG_DOAN = {
    1: { // XẢ
        thongSoKyThuat: [
            'Kích thước giấy (mm)',
            'Loại giấy',
            'Độ dày (mm)',
            'Độ ẩm (%)'
        ],
        thamSoVanHanh: [
            'Tốc độ xả (m/phút)',
            'Áp suất máy',
            'Nhiệt độ hoạt động'
        ],
        congNhan: 2,
        vatTu: [
            { ma: 'GIAY001', ten: 'Giấy kraft', donVi: 'Tấn' },
            { ma: 'GIAY002', ten: 'Giấy bồi', donVi: 'Tấn' }
        ]
    },
    2: { // XÉN
        thongSoKyThuat: [
            'Kích thước cắt (mm)',
            'Độ sắc bén lưỡi cắt',
            'Độ chính xác (mm)'
        ],
        thamSoVanHanh: [
            'Tốc độ xén (tờ/phút)',
            'Áp lực cắt',
            'Góc nghiêng lưỡi'
        ],
        congNhan: 2,
        vatTu: [
            { ma: 'LB001', ten: 'Lưỡi bén', donVi: 'Chiếc' },
            { ma: 'DM001', ten: 'Dầu máy', donVi: 'Lít' }
        ]
    },
    3: { // IN OFFSET
        thongSoKyThuat: [
            'Kích thước in (mm)',
            'Độ phân giải (DPI)',
            'Số màu',
            'Pantone'
        ],
        thamSoVanHanh: [
            'Tốc độ in (tờ/giờ)',
            'Áp suất ép',
            'Nhiệt độ sấy',
            'Độ ẩm giấy'
        ],
        congNhan: 3,
        vatTu: [
            { ma: 'MUC001', ten: 'Mực in đen', donVi: 'Kg' },
            { ma: 'MUC002', ten: 'Mực in xanh', donVi: 'Kg' },
            { ma: 'MUC003', ten: 'Mực in đỏ', donVi: 'Kg' },
            { ma: 'MUC004', ten: 'Mực in vàng', donVi: 'Kg' },
            { ma: 'HC001', ten: 'Hóa chất pha mực', donVi: 'Lít' }
        ]
    },
    4: { // XÉN TOA
        thongSoKyThuat: [
            'Kích thước cắt (mm)',
            'Độ chính xác (mm)',
            'Loại lưỡi'
        ],
        thamSoVanHanh: [
            'Tốc độ cắt (tờ/phút)',
            'Áp lực xén'
        ],
        congNhan: 2,
        vatTu: [
            { ma: 'LX001', ten: 'Lưỡi xén toa', donVi: 'Chiếc' },
            { ma: 'DM001', ten: 'Dầu máy', donVi: 'Lít' }
        ]
    },
    5: { // KCS IN
        thongSoKyThuat: [
            'Tiêu chuẩn màu sắc',
            'Độ sai lệch cho phép (%)',
            'Tiêu chuẩn chấm mực'
        ],
        thamSoVanHanh: [
            'Tốc độ kiểm tra (tờ/phút)',
            'Cường độ ánh sáng kiểm tra (lux)'
        ],
        congNhan: 2,
        vatTu: []
    },
    6: { // KCS SAU IN
        thongSoKyThuat: [
            'Tiêu chuẩn hoàn thiện',
            'Độ sai lệch cho phép (%)'
        ],
        thamSoVanHanh: [
            'Tốc độ kiểm tra (tờ/phút)'
        ],
        congNhan: 2,
        vatTu: []
    },
    7: { // KHO NG IN
        thongSoKyThuat: [
            'Nhiệt độ kho (°C)',
            'Độ ẩm kho (%)',
            'Thời gian lưu kho tối đa (ngày)'
        ],
        thamSoVanHanh: [
            'Sắp xếp theo FIFO'
        ],
        congNhan: 1,
        vatTu: []
    },
    8: { // LÁNG
        thongSoKyThuat: [
            'Độ bóng (%)',
            'Độ phủ (%)',
            'Độ dày lớp láng (μm)'
        ],
        thamSoVanHanh: [
            'Tốc độ láng (tờ/phút)',
            'Nhiệt độ láng (°C)',
            'Áp suất láng'
        ],
        congNhan: 2,
        vatTu: [
            { ma: 'HL001', ten: 'Hóa chất láng UV', donVi: 'Lít' },
            { ma: 'HL002', ten: 'Hóa chất láng thường', donVi: 'Lít' }
        ]
    },
    9: { // IN LƯỚI
        thongSoKyThuat: [
            'Kích thước lưới (mesh)',
            'Độ phân giải in (DPI)',
            'Số màu'
        ],
        thamSoVanHanh: [
            'Tốc độ in (tờ/giờ)',
            'Áp lực ép',
            'Góc nghiêng lưỡi gạt'
        ],
        congNhan: 2,
        vatTu: [
            { ma: 'ML001', ten: 'Mực in lưới đen', donVi: 'Kg' },
            { ma: 'ML002', ten: 'Mực in lưới vàng', donVi: 'Kg' },
            { ma: 'ML003', ten: 'Lưới in', donVi: 'Mét' },
            { ma: 'HC002', ten: 'Dung môi rửa lưới', donVi: 'Lít' }
        ]
    },
    10: { // BỒI
        thongSoKyThuat: [
            'Loại keo bồi',
            'Định lượng keo (g/m²)',
            'Áp lực bồi (N/m²)'
        ],
        thamSoVanHanh: [
            'Tốc độ bồi (tờ/phút)',
            'Nhiệt độ keo (°C)',
            'Thời gian sấy (phút)'
        ],
        congNhan: 3,
        vatTu: [
            { ma: 'KB001', ten: 'Keo bồi', donVi: 'Kg' },
            { ma: 'GC001', ten: 'Giấy carton sóng', donVi: 'Tấn' }
        ]
    },
    11: { // BẾ
        thongSoKyThuat: [
            'Loại dao bế',
            'Áp lực bế (tấn)',
            'Độ chính xác (mm)'
        ],
        thamSoVanHanh: [
            'Tốc độ bế (tờ/phút)',
            'Áp lực máy',
            'Tuổi thọ dao'
        ],
        congNhan: 2,
        vatTu: [
            { ma: 'DB001', ten: 'Dao bế', donVi: 'Bộ' },
            { ma: 'GC002', ten: 'Gỗ chèn', donVi: 'Tấm' }
        ]
    },
    12: { // BÓC LỀ
        thongSoKyThuat: [
            'Tiêu chuẩn bóc lề',
            'Độ sạch cạnh (%)'
        ],
        thamSoVanHanh: [
            'Tốc độ bóc (hộp/phút)'
        ],
        congNhan: 3,
        vatTu: []
    },
    13: { // DÁN MÁY
        thongSoKyThuat: [
            'Loại keo dán',
            'Định lượng keo (g/m²)',
            'Lực bám dính (N/m²)'
        ],
        thamSoVanHanh: [
            'Tốc độ dán (hộp/phút)',
            'Nhiệt độ keo (°C)',
            'Thời gian ép (giây)'
        ],
        congNhan: 2,
        vatTu: [
            { ma: 'KD001', ten: 'Keo dán', donVi: 'Kg' }
        ]
    },
    14: { // KHO THÀNH PHẨM
        thongSoKyThuat: [
            'Tiêu chuẩn đóng gói',
            'Số lượng/thùng',
            'Cách sắp xếp'
        ],
        thamSoVanHanh: [
            'Phương thức lưu kho'
        ],
        congNhan: 2,
        vatTu: [
            { ma: 'TG001', ten: 'Thùng giấy đóng gói', donVi: 'Chiếc' },
            { ma: 'BG001', ten: 'Băng keo đóng gói', donVi: 'Cuộn' }
        ]
    }
};

// Danh sách vật tư
const VAT_TU = [
    // Giấy
    { ma: 'GIAY001', ten: 'Giấy kraft', donVi: 'Tấn', tonKho: 5.2, giaTri: 18500000 },
    { ma: 'GIAY002', ten: 'Giấy bồi', donVi: 'Tấn', tonKho: 3.8, giaTri: 15000000 },
    { ma: 'GC001', ten: 'Giấy carton sóng', donVi: 'Tấn', tonKho: 8.4, giaTri: 16500000 },
    
    // Mực in
    { ma: 'MUC001', ten: 'Mực in đen', donVi: 'Kg', tonKho: 85, giaTri: 380000 },
    { ma: 'MUC002', ten: 'Mực in xanh', donVi: 'Kg', tonKho: 65, giaTri: 420000 },
    { ma: 'MUC003', ten: 'Mực in đỏ', donVi: 'Kg', tonKho: 60, giaTri: 450000 },
    { ma: 'MUC004', ten: 'Mực in vàng', donVi: 'Kg', tonKho: 70, giaTri: 410000 },
    { ma: 'ML001', ten: 'Mực in lưới đen', donVi: 'Kg', tonKho: 42, giaTri: 520000 },
    { ma: 'ML002', ten: 'Mực in lưới vàng', donVi: 'Kg', tonKho: 38, giaTri: 550000 },
    
    // Hóa chất
    { ma: 'HC001', ten: 'Hóa chất pha mực', donVi: 'Lít', tonKho: 120, giaTri: 95000 },
    { ma: 'HC002', ten: 'Dung môi rửa lưới', donVi: 'Lít', tonKho: 85, giaTri: 78000 },
    { ma: 'HL001', ten: 'Hóa chất láng UV', donVi: 'Lít', tonKho: 65, giaTri: 450000 },
    { ma: 'HL002', ten: 'Hóa chất láng thường', donVi: 'Lít', tonKho: 90, giaTri: 280000 },
    
    // Keo
    { ma: 'KB001', ten: 'Keo bồi', donVi: 'Kg', tonKho: 180, giaTri: 75000 },
    { ma: 'KD001', ten: 'Keo dán', donVi: 'Kg', tonKho: 150, giaTri: 82000 },
    
    // Dao và lưỡi
    { ma: 'LB001', ten: 'Lưỡi bén', donVi: 'Chiếc', tonKho: 25, giaTri: 420000 },
    { ma: 'LX001', ten: 'Lưỡi xén toa', donVi: 'Chiếc', tonKho: 18, giaTri: 380000 },
    { ma: 'DB001', ten: 'Dao bế', donVi: 'Bộ', tonKho: 5, giaTri: 4500000 },
    
    // Vật tư khác
    { ma: 'DM001', ten: 'Dầu máy', donVi: 'Lít', tonKho: 75, giaTri: 65000 },
    { ma: 'ML003', ten: 'Lưới in', donVi: 'Mét', tonKho: 50, giaTri: 125000 },
    { ma: 'GC002', ten: 'Gỗ chèn', donVi: 'Tấm', tonKho: 30, giaTri: 350000 },
    { ma: 'TG001', ten: 'Thùng giấy đóng gói', donVi: 'Chiếc', tonKho: 300, giaTri: 15000 },
    { ma: 'BG001', ten: 'Băng keo đóng gói', donVi: 'Cuộn', tonKho: 120, giaTri: 28000 }
];

// Dữ liệu mẫu cho lệnh sản xuất
let LENH_SAN_XUAT = [
    {
        maLenh: 'LSX001',
        tenSanPham: 'Hộp carton A4',
        soLuong: 1000,
        ngayBatDau: '2025-07-25',
        ngayHoanThanh: '2025-07-30',
        trangThai: 'đang-san-xuat',
        tienDo: [
            { idCongDoan: 1, soLuongHoanThanh: 1000, soLuongLoi: 20, thoiGianBatDau: '2025-07-25 08:00', thoiGianKetThuc: '2025-07-25 12:00', nguoiThucHien: 'NV001', ghiChu: '' },
            { idCongDoan: 2, soLuongHoanThanh: 980, soLuongLoi: 10, thoiGianBatDau: '2025-07-25 13:00', thoiGianKetThuc: '2025-07-25 17:00', nguoiThucHien: 'NV002', ghiChu: '' },
            { idCongDoan: 3, soLuongHoanThanh: 970, soLuongLoi: 5, thoiGianBatDau: '2025-07-26 08:00', thoiGianKetThuc: '2025-07-26 15:00', nguoiThucHien: 'NV003', ghiChu: '' },
            { idCongDoan: 4, soLuongHoanThanh: 0, soLuongLoi: 0, thoiGianBatDau: '', thoiGianKetThuc: '', nguoiThucHien: '', ghiChu: '' }
        ]
    },
    {
        maLenh: 'LSX002',
        tenSanPham: 'Hộp carton B5',
        soLuong: 500,
        ngayBatDau: '2025-07-24',
        ngayHoanThanh: '2025-07-29',
        trangThai: 'đang-san-xuat',
        tienDo: [
            { idCongDoan: 1, soLuongHoanThanh: 500, soLuongLoi: 0, thoiGianBatDau: '2025-07-24 08:00', thoiGianKetThuc: '2025-07-24 10:00', nguoiThucHien: 'NV001', ghiChu: '' },
            { idCongDoan: 2, soLuongHoanThanh: 500, soLuongLoi: 5, thoiGianBatDau: '2025-07-24 11:00', thoiGianKetThuc: '2025-07-24 13:00', nguoiThucHien: 'NV002', ghiChu: '' },
            { idCongDoan: 3, soLuongHoanThanh: 495, soLuongLoi: 0, thoiGianBatDau: '2025-07-24 14:00', thoiGianKetThuc: '2025-07-24 16:00', nguoiThucHien: 'NV003', ghiChu: '' },
            { idCongDoan: 4, soLuongHoanThanh: 495, soLuongLoi: 0, thoiGianBatDau: '2025-07-25 08:00', thoiGianKetThuc: '2025-07-25 10:00', nguoiThucHien: 'NV004', ghiChu: '' },
            { idCongDoan: 5, soLuongHoanThanh: 495, soLuongLoi: 5, thoiGianBatDau: '2025-07-25 11:00', thoiGianKetThuc: '2025-07-25 12:00', nguoiThucHien: 'NV005', ghiChu: '' },
            { idCongDoan: 6, soLuongHoanThanh: 490, soLuongLoi: 0, thoiGianBatDau: '2025-07-26 08:00', thoiGianKetThuc: '2025-07-26 09:00', nguoiThucHien: 'NV006', ghiChu: '' },
            { idCongDoan: 7, soLuongHoanThanh: 0, soLuongLoi: 0, thoiGianBatDau: '', thoiGianKetThuc: '', nguoiThucHien: '', ghiChu: '' }
        ]
    },
    {
        maLenh: 'LSX003',
        tenSanPham: 'Hộp carton C3',
        soLuong: 2000,
        ngayBatDau: '2025-07-26',
        ngayHoanThanh: '2025-08-02',
        trangThai: 'chưa-bắt-đầu',
        tienDo: []
    }
];

// Thêm dữ liệu nhập xuất tồn cho lệnh sản xuất
let NHAP_XUAT_TON = [
    {
        maLenh: 'LSX001',
        phieuNhap: [
            { 
                maPhieu: 'PN001',
                ngayNhap: '2025-07-24',
                nguoiNhap: 'NV013',
                ghiChu: 'Nhập nguyên liệu đầu kỳ',
                chiTiet: [
                    { maVatTu: 'GIAY001', soLuong: 0.8, donGia: 18500000 },
                    { maVatTu: 'MUC001', soLuong: 12, donGia: 380000 },
                    { maVatTu: 'MUC002', soLuong: 10, donGia: 420000 },
                    { maVatTu: 'MUC003', soLuong: 8, donGia: 450000 },
                    { maVatTu: 'MUC004', soLuong: 9, donGia: 410000 }
                ]
            },
            {
                maPhieu: 'PN005',
                ngayNhap: '2025-07-25',
                nguoiNhap: 'NV013',
                ghiChu: 'Bổ sung vật tư công đoạn in',
                chiTiet: [
                    { maVatTu: 'HC001', soLuong: 15, donGia: 95000 }
                ]
            }
        ],
        phieuXuat: [
            {
                maPhieu: 'PX001',
                ngayXuat: '2025-07-25',
                nguoiXuat: 'NV001',
                congDoan: 1,
                ghiChu: 'Xuất vật tư cho công đoạn XẢ',
                chiTiet: [
                    { maVatTu: 'GIAY001', soLuong: 0.5, donGia: 18500000 }
                ]
            },
            {
                maPhieu: 'PX003',
                ngayXuat: '2025-07-26',
                nguoiXuat: 'NV003',
                congDoan: 3,
                ghiChu: 'Xuất vật tư cho công đoạn IN OFFSET',
                chiTiet: [
                    { maVatTu: 'MUC001', soLuong: 8, donGia: 380000 },
                    { maVatTu: 'MUC002', soLuong: 6, donGia: 420000 },
                    { maVatTu: 'MUC003', soLuong: 5, donGia: 450000 },
                    { maVatTu: 'MUC004', soLuong: 7, donGia: 410000 },
                    { maVatTu: 'HC001', soLuong: 10, donGia: 95000 }
                ]
            }
        ]
    },
    {
        maLenh: 'LSX002',
        phieuNhap: [
            {
                maPhieu: 'PN002',
                ngayNhap: '2025-07-23',
                nguoiNhap: 'NV013',
                ghiChu: 'Nhập nguyên liệu đầu kỳ',
                chiTiet: [
                    { maVatTu: 'GIAY002', soLuong: 0.5, donGia: 15000000 },
                    { maVatTu: 'ML001', soLuong: 15, donGia: 520000 },
                    { maVatTu: 'ML002', soLuong: 12, donGia: 550000 },
                    { maVatTu: 'HC002', soLuong: 20, donGia: 78000 }
                ]
            },
            {
                maPhieu: 'PN003',
                ngayNhap: '2025-07-24',
                nguoiNhap: 'NV013',
                ghiChu: 'Nhập bổ sung',
                chiTiet: [
                    { maVatTu: 'GC001', soLuong: 0.6, donGia: 16500000 },
                    { maVatTu: 'KB001', soLuong: 25, donGia: 75000 }
                ]
            }
        ],
        phieuXuat: [
            {
                maPhieu: 'PX002',
                ngayXuat: '2025-07-24',
                nguoiXuat: 'NV001',
                congDoan: 1,
                ghiChu: 'Xuất vật tư cho công đoạn XẢ',
                chiTiet: [
                    { maVatTu: 'GIAY002', soLuong: 0.3, donGia: 15000000 }
                ]
            },
            {
                maPhieu: 'PX004',
                ngayXuat: '2025-07-24',
                nguoiXuat: 'NV008',
                congDoan: 9,
                ghiChu: 'Xuất vật tư cho công đoạn IN LƯỚI',
                chiTiet: [
                    { maVatTu: 'ML001', soLuong: 8, donGia: 520000 },
                    { maVatTu: 'ML002', soLuong: 5, donGia: 550000 },
                    { maVatTu: 'ML003', soLuong: 6, donGia: 125000 },
                    { maVatTu: 'HC002', soLuong: 10, donGia: 78000 }
                ]
            },
            {
                maPhieu: 'PX005',
                ngayXuat: '2025-07-25',
                nguoiXuat: 'NV009',
                congDoan: 10,
                ghiChu: 'Xuất vật tư cho công đoạn BỒI',
                chiTiet: [
                    { maVatTu: 'GC001', soLuong: 0.4, donGia: 16500000 },
                    { maVatTu: 'KB001', soLuong: 15, donGia: 75000 }
                ]
            }
        ]
    }
];

// Dữ liệu mẫu cho nhân viên
const NHAN_VIEN = [
    { maNV: 'NV001', hoTen: 'Nguyễn Văn A', chucVu: 'Công nhân', boPhan: 'Xả Xén' },
    { maNV: 'NV002', hoTen: 'Trần Thị B', chucVu: 'Công nhân', boPhan: 'Xả Xén' },
    { maNV: 'NV003', hoTen: 'Lê Văn C', chucVu: 'Công nhân', boPhan: 'In Offset' },
    { maNV: 'NV004', hoTen: 'Phạm Thị D', chucVu: 'Công nhân', boPhan: 'Xén Toa' },
    { maNV: 'NV005', hoTen: 'Hoàng Văn E', chucVu: 'Kiểm tra viên', boPhan: 'KCS' },
    { maNV: 'NV006', hoTen: 'Đỗ Thị F', chucVu: 'Kiểm tra viên', boPhan: 'KCS' },
    { maNV: 'NV007', hoTen: 'Trương Văn G', chucVu: 'Công nhân', boPhan: 'Láng' },
    { maNV: 'NV008', hoTen: 'Lý Thị H', chucVu: 'Công nhân', boPhan: 'In Lưới' },
    { maNV: 'NV009', hoTen: 'Võ Văn I', chucVu: 'Công nhân', boPhan: 'Bồi' },
    { maNV: 'NV010', hoTen: 'Mai Thị K', chucVu: 'Công nhân', boPhan: 'Bế' },
    { maNV: 'NV011', hoTen: 'Dương Văn L', chucVu: 'Công nhân', boPhan: 'Bóc Lề' },
    { maNV: 'NV012', hoTen: 'Huỳnh Thị M', chucVu: 'Công nhân', boPhan: 'Dán Máy' },
    { maNV: 'NV013', hoTen: 'Phan Văn N', chucVu: 'Nhân viên', boPhan: 'Kho' },
    { maNV: 'QD001', hoTen: 'Bùi Văn X', chucVu: 'Quản đốc', boPhan: 'Sản xuất' },
    { maNV: 'QL001', hoTen: 'Đặng Thị Y', chucVu: 'Quản lý', boPhan: 'Điều hành' }
];

// Kiểm tra có dữ liệu lưu trong localStorage không
function loadData() {
    const savedLenhSanXuat = localStorage.getItem('lenhSanXuat');
    const savedNhapXuatTon = localStorage.getItem('nhapXuatTon');
    
    if (savedLenhSanXuat) {
        LENH_SAN_XUAT = JSON.parse(savedLenhSanXuat);
    } else {
        saveData();
    }
    
    if (savedNhapXuatTon) {
        NHAP_XUAT_TON = JSON.parse(savedNhapXuatTon);
    } else {
        localStorage.setItem('nhapXuatTon', JSON.stringify(NHAP_XUAT_TON));
    }
}

// Lưu dữ liệu vào localStorage
function saveData() {
    localStorage.setItem('lenhSanXuat', JSON.stringify(LENH_SAN_XUAT));
    localStorage.setItem('nhapXuatTon', JSON.stringify(NHAP_XUAT_TON));
}

// Tạo lệnh sản xuất mới
function taoLenhSanXuat(lenhMoi) {
    lenhMoi.maLenh = 'LSX' + String(LENH_SAN_XUAT.length + 1).padStart(3, '0');
    lenhMoi.trangThai = 'chưa-bắt-đầu';
    lenhMoi.tienDo = [];
    
    LENH_SAN_XUAT.push(lenhMoi);
    saveData();
    return lenhMoi;
}

// Cập nhật tiến độ công đoạn
function capNhatTienDo(maLenh, idCongDoan, duLieuCapNhat) {
    const lenhIndex = LENH_SAN_XUAT.findIndex(lenh => lenh.maLenh === maLenh);
    
    if (lenhIndex === -1) return false;
    
    const lenh = LENH_SAN_XUAT[lenhIndex];
    const tienDoIndex = lenh.tienDo.findIndex(td => td.idCongDoan === idCongDoan);
    
    if (tienDoIndex === -1) {
        // Thêm tiến độ mới
        lenh.tienDo.push({
            idCongDoan,
            soLuongHoanThanh: duLieuCapNhat.soLuongHoanThanh || 0,
            soLuongLoi: duLieuCapNhat.soLuongLoi || 0,
            thoiGianBatDau: duLieuCapNhat.thoiGianBatDau || getCurrentDateTime(),
            thoiGianKetThuc: duLieuCapNhat.thoiGianKetThuc || '',
            nguoiThucHien: duLieuCapNhat.nguoiThucHien || '',
            ghiChu: duLieuCapNhat.ghiChu || ''
        });
    } else {
        // Cập nhật tiến độ hiện có
        lenh.tienDo[tienDoIndex] = {
            ...lenh.tienDo[tienDoIndex],
            ...duLieuCapNhat
        };
    }
    
    // Kiểm tra và cập nhật trạng thái lệnh
    updateTrangThaiLenh(lenh);
    
    saveData();
    return true;
}

// Cập nhật trạng thái lệnh
function updateTrangThaiLenh(lenh) {
    if (lenh.tienDo.length === 0) {
        lenh.trangThai = 'chưa-bắt-đầu';
    } else if (lenh.tienDo.some(td => td.idCongDoan === CONG_DOAN.length && td.thoiGianKetThuc)) {
        lenh.trangThai = 'hoàn-thành';
    } else {
        lenh.trangThai = 'đang-san-xuat';
    }
}

// Lấy lệnh sản xuất theo mã
function getLenhSanXuat(maLenh) {
    return LENH_SAN_XUAT.find(lenh => lenh.maLenh === maLenh);
}

// Lấy danh sách lệnh sản xuất theo trạng thái
function getLenhSanXuatTheoTrangThai(trangThai) {
    if (!trangThai) return LENH_SAN_XUAT;
    return LENH_SAN_XUAT.filter(lenh => lenh.trangThai === trangThai);
}

// Lấy tên công đoạn từ id
function getTenCongDoan(id) {
    const congDoan = CONG_DOAN.find(cd => cd.id === id);
    return congDoan ? congDoan.ten : '';
}

// Lấy chi tiết công đoạn từ id
function getChiTietCongDoan(id) {
    return CHI_TIET_CONG_DOAN[id] || null;
}

// Lấy tên nhân viên từ mã
function getTenNhanVien(maNV) {
    const nhanVien = NHAN_VIEN.find(nv => nv.maNV === maNV);
    return nhanVien ? nhanVien.hoTen : '';
}

// Lấy ngày giờ hiện tại định dạng YYYY-MM-DD HH:MM
function getCurrentDateTime() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    
    return `${year}-${month}-${day} ${hours}:${minutes}`;
}

// Tính tiến độ hoàn thành của lệnh (phần trăm)
function tinhTienDoHoanThanh(maLenh) {
    const lenh = getLenhSanXuat(maLenh);
    if (!lenh) return 0;
    
    const tongCongDoan = CONG_DOAN.length;
    const soLuongDaHoanThanh = lenh.tienDo.filter(td => td.thoiGianKetThuc).length;
    
    return Math.round((soLuongDaHoanThanh / tongCongDoan) * 100);
}

// Lấy thông tin vật tư theo mã
function getVatTu(maVatTu) {
    return VAT_TU.find(vt => vt.ma === maVatTu) || null;
}

// Lấy nhập xuất tồn theo lệnh
function getNhapXuatTon(maLenh) {
    return NHAP_XUAT_TON.find(nxt => nxt.maLenh === maLenh) || null;
}

// Tạo phiếu nhập mới
function taoPhieuNhap(maLenh, phieuNhap) {
    let nhapXuatTon = getNhapXuatTon(maLenh);
    
    // Nếu lệnh chưa có thông tin nhập xuất tồn, tạo mới
    if (!nhapXuatTon) {
        nhapXuatTon = {
            maLenh,
            phieuNhap: [],
            phieuXuat: []
        };
        NHAP_XUAT_TON.push(nhapXuatTon);
    }
    
    // Tạo mã phiếu mới
    const maPhieu = `PN${String(nhapXuatTon.phieuNhap.length + 1).padStart(3, '0')}`;
    
    // Gán mã phiếu và thêm vào danh sách
    phieuNhap.maPhieu = maPhieu;
    nhapXuatTon.phieuNhap.push(phieuNhap);
    
    // Cập nhật tồn kho
    phieuNhap.chiTiet.forEach(ct => {
        const vatTu = getVatTu(ct.maVatTu);
        if (vatTu) {
            vatTu.tonKho += ct.soLuong;
        }
    });
    
    saveData();
    return phieuNhap;
}

// Tạo phiếu xuất mới
function taoPhieuXuat(maLenh, phieuXuat) {
    let nhapXuatTon = getNhapXuatTon(maLenh);
    
    // Nếu lệnh chưa có thông tin nhập xuất tồn, tạo mới
    if (!nhapXuatTon) {
        nhapXuatTon = {
            maLenh,
            phieuNhap: [],
            phieuXuat: []
        };
        NHAP_XUAT_TON.push(nhapXuatTon);
    }
    
    // Tạo mã phiếu mới
    const maPhieu = `PX${String(nhapXuatTon.phieuXuat.length + 1).padStart(3, '0')}`;
    
    // Gán mã phiếu và thêm vào danh sách
    phieuXuat.maPhieu = maPhieu;
    nhapXuatTon.phieuXuat.push(phieuXuat);
    
    // Cập nhật tồn kho
    phieuXuat.chiTiet.forEach(ct => {
        const vatTu = getVatTu(ct.maVatTu);
        if (vatTu) {
            vatTu.tonKho -= ct.soLuong;
        }
    });
    
    saveData();
    return phieuXuat;
}

// Tính giá trị nhập xuất tồn của lệnh
function tinhGiaTriNhapXuat(maLenh) {
    const nhapXuatTon = getNhapXuatTon(maLenh);
    
    if (!nhapXuatTon) return { tongNhap: 0, tongXuat: 0, tongTon: 0 };
    
    let tongNhap = 0;
    let tongXuat = 0;
    
    // Tính tổng giá trị nhập
    nhapXuatTon.phieuNhap.forEach(phieu => {
        phieu.chiTiet.forEach(ct => {
            tongNhap += ct.soLuong * ct.donGia;
        });
    });
    
    // Tính tổng giá trị xuất
    nhapXuatTon.phieuXuat.forEach(phieu => {
        phieu.chiTiet.forEach(ct => {
            tongXuat += ct.soLuong * ct.donGia;
        });
    });
    
    return {
        tongNhap,
        tongXuat,
        tongTon: tongNhap - tongXuat
    };
}

// Tính lượng vật tư đã sử dụng theo công đoạn
function tinhVatTuTheoCongDoan(maLenh) {
    const nhapXuatTon = getNhapXuatTon(maLenh);
    if (!nhapXuatTon) return {};
    
    const vatTuTheoCongDoan = {};
    
    // Thống kê theo công đoạn
    nhapXuatTon.phieuXuat.forEach(phieu => {
        const congDoanId = phieu.congDoan;
        if (!vatTuTheoCongDoan[congDoanId]) {
            vatTuTheoCongDoan[congDoanId] = [];
        }
        
        phieu.chiTiet.forEach(ct => {
            const vatTu = getVatTu(ct.maVatTu);
            if (vatTu) {
                // Kiểm tra xem vật tư đã được thêm chưa
                const existingVatTu = vatTuTheoCongDoan[congDoanId].find(v => v.ma === ct.maVatTu);
                if (existingVatTu) {
                    existingVatTu.soLuong += ct.soLuong;
                    existingVatTu.thanhTien += ct.soLuong * ct.donGia;
                } else {
                    vatTuTheoCongDoan[congDoanId].push({
                        ma: vatTu.ma,
                        ten: vatTu.ten,
                        donVi: vatTu.donVi,
                        soLuong: ct.soLuong,
                        donGia: ct.donGia,
                        thanhTien: ct.soLuong * ct.donGia
                    });
                }
            }
        });
    });
    
    return vatTuTheoCongDoan;
}

// Gọi loadData khi trang được tải
document.addEventListener('DOMContentLoaded', function() {
    loadData();
}); 