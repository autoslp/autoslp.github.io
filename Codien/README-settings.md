# Hệ Thống Quản Lý Điều Hòa Thông Minh - Cài Đặt Database

## Tổng quan

Hệ thống quản lý cài đặt danh mục cho ứng dụng quản lý điều hòa, bao gồm:
- **Loại điều hòa**: Split, Multi, Trung tâm, Âm trần
- **Khu vực**: Tầng 1, Tầng 2, Tầng 3, Xưởng sản xuất
- **Vị trí cụ thể**: Phòng giám đốc, Phòng họp, v.v.
- **Hãng sản xuất**: Daikin, Mitsubishi, LG, Samsung, Panasonic

## Cấu trúc Database

### 1. Bảng `ac_types` (Loại điều hòa)
```sql
- id: Primary key
- ten_loai: Tên loại điều hòa
- ma_loai: Mã loại (split, multi, central, cassette)
- trang_thai: active/inactive
- so_luong: Số lượng điều hòa loại này
```

### 2. Bảng `areas` (Khu vực)
```sql
- id: Primary key
- ten_khu_vuc: Tên khu vực
- mo_ta: Mô tả khu vực
- so_luong: Số lượng điều hòa trong khu vực
```

### 3. Bảng `locations` (Vị trí cụ thể)
```sql
- id: Primary key
- khu_vuc: Tên khu vực (FK)
- ten_vi_tri: Tên vị trí cụ thể
- ma_vi_tri: Mã vị trí
- so_luong: Số lượng điều hòa tại vị trí
```

### 4. Bảng `brands` (Hãng sản xuất)
```sql
- id: Primary key
- ten_hang: Tên hãng sản xuất
- quoc_gia: Quốc gia
- website: Website chính thức
- so_luong: Số lượng điều hòa của hãng
```

## Cài đặt Database

### 1. Tạo Database
```sql
CREATE DATABASE ac_management;
USE ac_management;
```

### 2. Chạy Schema
```bash
mysql -u username -p ac_management < database-schema.sql
```

### 3. Kiểm tra
```sql
SHOW TABLES;
SELECT * FROM ac_types;
SELECT * FROM areas;
SELECT * FROM locations;
SELECT * FROM brands;
```

## API Endpoints

### AC Types
- `GET /api/data/ac_types` - Lấy danh sách loại điều hòa
- `POST /webhook/ac_types` - Tạo loại điều hòa mới
- `PUT /webhook/ac_types` - Cập nhật loại điều hòa
- `DELETE /webhook/ac_types` - Xóa loại điều hòa

### Areas
- `GET /api/data/areas` - Lấy danh sách khu vực
- `POST /webhook/areas` - Tạo khu vực mới
- `PUT /webhook/areas` - Cập nhật khu vực
- `DELETE /webhook/areas` - Xóa khu vực

### Locations
- `GET /api/data/locations` - Lấy danh sách vị trí
- `POST /webhook/locations` - Tạo vị trí mới
- `PUT /webhook/locations` - Cập nhật vị trí
- `DELETE /webhook/locations` - Xóa vị trí

### Brands
- `GET /api/data/brands` - Lấy danh sách hãng sản xuất
- `POST /webhook/brands` - Tạo hãng mới
- `PUT /webhook/brands` - Cập nhật hãng
- `DELETE /webhook/brands` - Xóa hãng

## Sử dụng Trang Cài Đặt

### 1. Truy cập
Mở file `caidat-hethong.html` trong trình duyệt

### 2. Chức năng chính
- **Thêm mới**: Nhập thông tin và nhấn "Thêm"
- **Chỉnh sửa**: Nhấn icon pencil để sửa
- **Xóa**: Nhấn icon trash để xóa
- **Đồng bộ**: Nhấn "Đồng Bộ Database" để sync với API
- **Xuất/Nhập**: Export/Import dữ liệu dạng JSON

### 3. Tự động đồng bộ
- Khi thêm/sửa/xóa, dữ liệu được lưu vào database qua API
- Nếu API lỗi, dữ liệu vẫn được lưu local
- Số lượng sử dụng được cập nhật tự động

## Tính năng nổi bật

### 1. Hybrid Storage
- Ưu tiên lưu vào database qua API
- Fallback sang localStorage nếu API lỗi
- Đồng bộ tự động khi kết nối phục hồi

### 2. Thống kê Real-time
- Đếm số lượng điều hòa theo từng danh mục
- Cập nhật tự động khi có thay đổi
- Triggers database để đảm bảo tính nhất quán

### 3. Validation
- Kiểm tra trùng lặp mã/tên
- Validation input trước khi lưu
- Ràng buộc khóa ngoại trong database

### 4. Export/Import
- Xuất toàn bộ cài đặt dạng JSON
- Nhập cài đặt từ file backup
- Timestamp và version tracking

## Lưu ý quan trọng

### 1. Khóa ngoại
- Không thể xóa khu vực đang có điều hòa
- Không thể xóa hãng đang có điều hòa
- Cập nhật cascade khi đổi tên

### 2. Triggers tự động
- Số lượng được cập nhật tự động
- Không cần tính toán thủ công
- Đảm bảo tính chính xác

### 3. Performance
- Indexes được tối ưu cho truy vấn thường dùng
- Views cho các báo cáo phức tạp
- Stored procedures cho logic nghiệp vụ

## Troubleshooting

### 1. API không kết nối được
```javascript
// Kiểm tra console browser
// Dữ liệu vẫn được lưu local
// Sync lại khi API phục hồi
```

### 2. Số lượng không đúng
```sql
-- Chạy procedure tính lại
CALL RecalculateCounts();
```

### 3. Lỗi foreign key
```sql
-- Kiểm tra dữ liệu đã tồn tại chưa
SELECT * FROM areas WHERE ten_khu_vuc = 'Tên khu vực';
SELECT * FROM brands WHERE ten_hang = 'Tên hãng';
```

## File liên quan

1. `caidat-hethong.html` - Giao diện quản lý
2. `settings-manager.js` - Logic xử lý dữ liệu
3. `database-schema.sql` - Schema database
4. `README-settings.md` - Tài liệu này

## Support

Nếu có vấn đề, vui lòng:
1. Kiểm tra console browser để xem lỗi
2. Kiểm tra kết nối API
3. Kiểm tra log database
4. Liên hệ admin hệ thống
