# 🏭 Hệ thống Quản lý Sản xuất Hộp Carton - Enterprise Edition

![Carton Manager Logo](./images/logo.svg)

Hệ thống quản lý quy trình sản xuất hộp carton chuyên nghiệp dành cho doanh nghiệp, được thiết kế với giao diện hiện đại và tính năng đầy đủ. Phần mềm được xây dựng dạng Progressive Web App (PWA), có thể cài đặt và sử dụng offline trên nhiều thiết bị.

## 🚀 Tính năng chính

### 📊 Dashboard
- Tổng quan sản xuất với biểu đồ và thống kê
- Thống kê lệnh sản xuất theo trạng thái
- Biểu đồ tiến độ sản xuất và tỷ lệ lỗi
- Thao tác nhanh để truy cập các chức năng chính

### ⚡ Quản lý tiến độ (Mới!)
- **Bảng chi tiết theo công đoạn**: Mỗi công đoạn có bảng riêng với xuất nhập tồn
- **Quản lý số lượng**: Nhập/xuất số lượng sản phẩm cho từng lệnh ở từng công đoạn
- **Tự động chuyển hàng**: Khi "Xuất" sang công đoạn tiếp theo, tự động chuyển hàng tồn kho
- **Tổng kết theo công đoạn**: Hiển thị tổng gốc, nhập, xuất, tồn của mỗi công đoạn
- **Luồng công việc thông minh**: Lệnh chỉ xuất hiện ở công đoạn tiếp theo khi hoàn thành công đoạn trước
- **Cập nhật trực tiếp**: Thay đổi trạng thái, thời gian, người thực hiện
- **Tích hợp nhật ký**: Tự động ghi lại mọi thay đổi

### 📋 Quản lý lệnh sản xuất
- Tạo, xem, cập nhật và xóa lệnh sản xuất
- Tìm kiếm và lọc lệnh theo trạng thái
- Chi tiết lệnh với 4 tab chính:
  - **Tiến độ**: Theo dõi trạng thái từng công đoạn, thời gian bắt đầu/kết thúc, người thực hiện
  - **Vật tư**: Quản lý xuất vật tư cho từng công đoạn, kiểm tra tồn kho
  - **Công đoạn**: Chi tiết kỹ thuật, tham số vận hành, QC, vật tư dự kiến
  - **Nhật ký**: Lịch sử thao tác, tự động ghi nhận mọi thay đổi

### 📦 Quản lý vật tư
- Theo dõi tồn kho vật tư với cảnh báo mức thấp
- Thêm vật tư mới với ID tự động
- Tích hợp với lệnh sản xuất để xuất vật tư
- Kiểm tra tồn kho trước khi xuất

### ⚙️ Quản lý công đoạn
- Định nghĩa các bước trong quy trình sản xuất
- Thêm/sửa/xóa công đoạn
- Chi tiết kỹ thuật cho từng công đoạn

### 📈 Báo cáo
- Tạo báo cáo sản xuất với biểu đồ
- Lọc theo khoảng thời gian
- Xuất báo cáo (đang phát triển)

### 🔧 Tính năng kỹ thuật
- **PWA**: Hỗ trợ cài đặt như ứng dụng và hoạt động offline
- **LocalStorage**: Lưu trữ dữ liệu local
- **Responsive**: Tương thích mobile, tablet, desktop
- **Auto-save**: Tự động lưu mọi thay đổi
- **Logging**: Ghi nhật ký tự động mọi thao tác

## 📖 Cách sử dụng

### 🚀 Khởi động hệ thống
1. Mở trang `index.html` để đăng nhập
2. Demo: sử dụng bất kỳ mã nhân viên nào:
   - `NV001` (Công nhân Xả Xén)
   - `QD001` (Quản đốc)  
   - `QL001` (Quản lý)

### 📊 Dashboard
- Xem tổng quan tình hình sản xuất
- Thống kê lệnh sản xuất theo trạng thái
- Biểu đồ tiến độ và tỷ lệ lỗi
- Thao tác nhanh để truy cập các chức năng chính

### ⚡ Quản lý tiến độ
- Xem bảng chi tiết theo công đoạn với xuất nhập tồn
- Nhập/xuất số lượng sản phẩm cho từng lệnh
- Tự động chuyển hàng khi xuất sang công đoạn tiếp theo
- Tổng kết số lượng theo từng công đoạn
- Theo dõi luồng công việc thực tế

### 🎯 Trang riêng cho từng công đoạn
- **stage-xa.html**: Công đoạn XẢ - Xả giấy cuộn
- **stage-xen.html**: Công đoạn XÉN - Xén giấy
- **stage-in.html**: Công đoạn IN OFFSET - In offset
- **stage-boi.html**: Công đoạn BỒI - Bồi giấy
- **stage-be.html**: Công đoạn BẾ - Bế hộp
- **stage-dan.html**: Công đoạn DÁN MÁY - Dán hộp
- **stage-kho.html**: KHO THÀNH PHẨM - Lưu kho thành phẩm

### 📋 Quản lý lệnh sản xuất
1. **Tạo lệnh mới**: Vào `orders.html` → "Tạo lệnh mới"
2. **Xem chi tiết**: Click vào lệnh để xem 4 tab:
   - **Tiến độ**: Cập nhật trạng thái từng công đoạn
   - **Vật tư**: Xuất vật tư cho từng công đoạn
   - **Công đoạn**: Nhập thông số kỹ thuật, QC
   - **Nhật ký**: Xem lịch sử thao tác

### 📦 Quản lý vật tư
- Xem tồn kho tại `materials.html`
- Thêm vật tư mới với ID tự động
- Xuất vật tư từ chi tiết lệnh sản xuất

### ⚙️ Quản lý công đoạn
- Định nghĩa workflow tại `workflow.html`
- Thêm/sửa/xóa công đoạn sản xuất

## 🔧 Lưu ý kỹ thuật

- **LocalStorage**: Dữ liệu được lưu trữ trong localStorage của trình duyệt
- **Responsive**: Giao diện tối ưu cho cả máy tính và thiết bị di động
- **Browser Support**: Hỗ trợ các trình duyệt hiện đại (Chrome, Firefox, Safari, Edge)
- **Chart.js**: Sử dụng biểu đồ từ thư viện Chart.js
- **Service Worker**: Cho phép sử dụng offline
- **PWA**: Progressive Web App với manifest và service worker
- **Auto-save**: Tự động lưu mọi thay đổi
- **Logging**: Ghi nhật ký tự động mọi thao tác

## 📁 Cấu trúc thư mục

```
SANXUAT/
├── 📄 index.html              # Trang đăng nhập
├── 📄 dashboard.html          # Dashboard tổng quan
├── 📄 orders.html             # Quản lý lệnh sản xuất
├── 📄 progress.html           # Quản lý tiến độ (Kanban)
├── 📄 stage-xa.html           # Trang riêng công đoạn XẢ
├── 📄 stage-xen.html          # Trang riêng công đoạn XÉN
├── 📄 stage-in.html           # Trang riêng công đoạn IN OFFSET
├── 📄 stage-boi.html          # Trang riêng công đoạn BỒI
├── 📄 stage-be.html           # Trang riêng công đoạn BẾ
├── 📄 stage-dan.html          # Trang riêng công đoạn DÁN MÁY
├── 📄 stage-kho.html          # Trang riêng KHO THÀNH PHẨM
├── 📄 order-detail.html       # Chi tiết lệnh sản xuất (4 tabs)
├── 📄 materials.html          # Quản lý vật tư
├── 📄 workflow.html           # Quản lý công đoạn
├── 📄 reports.html            # Báo cáo thống kê
├── 📄 test-system.html        # Test hệ thống
├── 📁 styles/
│   └── 📄 main.css            # CSS chính
├── 📁 js/
│   └── 📄 app.js              # JavaScript chính + dữ liệu mẫu
├── 📁 images/
│   ├── 📄 logo.svg            # Logo chính
│   ├── 📄 favicon.svg         # Favicon
│   └── 📄 icon-192x192.svg    # Icon PWA
├── 📄 service-worker.js       # Service worker cho PWA
├── 📄 manifest.json           # Manifest cho PWA
└── 📄 README.md               # Tài liệu hướng dẫn
```

## 🚀 Phát triển tiếp theo

### 📊 Báo cáo nâng cao
- Xuất báo cáo PDF/Excel
- Dashboard real-time với WebSocket
- Biểu đồ phân tích xu hướng

### 🔗 Tích hợp hệ thống
- Quét mã QR để cập nhật tiến độ nhanh
- API tích hợp với ERP/MES
- Đồng bộ dữ liệu đám mây
- Hệ thống thông báo real-time

### 🔐 Bảo mật & Phân quyền
- Xác thực đa yếu tố
- Phân quyền chi tiết theo vai trò
- Audit log đầy đủ
- Backup/restore dữ liệu

### 📱 Mobile App
- Ứng dụng mobile native
- Push notification
- Offline sync
- Camera integration

### 🤖 AI & Analytics
- Dự đoán thời gian hoàn thành
- Phân tích hiệu suất sản xuất
- Cảnh báo sớm sự cố
- Tối ưu hóa quy trình

---

## 🧪 Test hệ thống

Mở file `test-system.html` để kiểm tra toàn bộ chức năng của hệ thống:
- Kiểm tra App.js và các method
- Kiểm tra dữ liệu mẫu
- Kiểm tra localStorage
- Kiểm tra navigation

---

© 2025 Công ty TNHH Sản xuất Bao bì Carton - Enterprise Edition 