# Hệ thống Quản lý Lệnh Sản xuất - Production Orders Management

## Mô tả

Hệ thống quản lý lệnh sản xuất cho nhà máy carton với đầy đủ 35 trường dữ liệu theo yêu cầu, bao gồm:
- Thông tin cơ bản (ngày triển khai, mã lệnh, PO, etc.)
- Thông tin sản phẩm (mã nội bộ, tên sản phẩm, version, etc.)
- Thông tin khách hàng (mã KH, tên KH, nhóm KH, etc.)
- Thông tin số lượng (đơn hàng, tồn kho, cần SX, etc.)
- Thông tin kích thước (dài/rộng/cao sản phẩm và giấy)
- Thông tin vật liệu (loại giấy, định lượng, công đoạn)
- Ghi chú đầy đủ

## Cấu trúc File

```
SANXUAT/
├── production-orders.html           # Frontend chính
├── server.js                       # Backend Node.js API Server
├── production_orders_database.sql  # Database schema và dữ liệu mẫu
└── README-production-orders.md     # File này
```

## Cài đặt và Chạy

### 1. Chuẩn bị Database

```sql
-- 1. Tạo database (nếu chưa có)
CREATE DATABASE IF NOT EXISTS autoslp CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE autoslp;

-- 2. Chạy file SQL để tạo bảng
SOURCE production_orders_database.sql;
```

### 2. Cài đặt Node.js Dependencies

```bash
# Cài đặt các package cần thiết
npm install express mysql2 cors

# Hoặc tạo package.json
npm init -y
npm install express mysql2 cors
```

### 3. Cấu hình Database

Cập nhật thông tin kết nối database trong `server.js`:

```javascript
db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'anhvinh123', // Thay đổi password phù hợp
  database: 'autoslp',
  // ... các config khác
});
```

### 4. Chạy Server

```bash
# Khởi động server
node server.js

# Server sẽ chạy tại http://localhost:3000
```

### 5. Truy cập Frontend

Mở file `production-orders.html` trong trình duyệt hoặc host trên web server.

## API Endpoints

### Production Orders APIs

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/data/production_orders` | Lấy danh sách lệnh sản xuất (có bộ lọc) |
| GET | `/data/production_orders/:id` | Lấy chi tiết một lệnh |
| POST | `/data/production_orders` | Tạo lệnh mới |
| PUT | `/data/production_orders/:id` | Cập nhật lệnh |
| DELETE | `/data/production_orders/:id` | Xóa lệnh |

### Query Parameters cho GET /data/production_orders

- `deployment_date`: Lọc theo ngày triển khai
- `status`: Lọc theo trạng thái
- `customer_name`: Lọc theo tên khách hàng
- `search`: Tìm kiếm trong mã LSX, PO, tên sản phẩm, tên KH
- `limit`: Giới hạn số kết quả
- `offset`: Bỏ qua số kết quả đầu

### Statistics APIs

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/data/production_orders_stats` | Thống kê tổng quan |
| GET | `/data/customer_orders_stats` | Thống kê theo khách hàng |
| GET | `/data/monthly_orders_stats` | Thống kê theo tháng |
| GET | `/data/customers` | Danh sách khách hàng |

## Database Schema

### Bảng chính: `production_orders`

Chứa 35 trường dữ liệu chính:

```sql
CREATE TABLE production_orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    
    -- Thông tin cơ bản
    deployment_date DATE,
    production_order VARCHAR(50) NOT NULL,
    po_number VARCHAR(50) NOT NULL,
    sales_order_code VARCHAR(100),
    order_date DATE,
    delivery_date DATE,
    
    -- Thông tin sản phẩm
    internal_product_code VARCHAR(100) NOT NULL,
    order_type ENUM(...),
    product_name TEXT NOT NULL,
    version VARCHAR(20),
    
    -- Thông tin khách hàng
    customer_code VARCHAR(50) NOT NULL,
    customer_name VARCHAR(255) NOT NULL,
    customer_group ENUM(...),
    
    -- Số lượng
    order_quantity INT DEFAULT 0,
    inventory INT DEFAULT 0,
    required_quantity INT DEFAULT 0,
    deployed_quantity INT DEFAULT 0,
    offset_waste INT DEFAULT 0,
    waste INT DEFAULT 0,
    sheet_count INT DEFAULT 0,
    
    -- Kích thước
    product_length DECIMAL(10,2),
    product_width DECIMAL(10,2),
    product_height DECIMAL(10,2),
    paper_length DECIMAL(10,2),
    paper_width DECIMAL(10,2),
    part_count INT DEFAULT 0,
    color_count INT DEFAULT 0,
    
    -- Vật liệu
    paper_type VARCHAR(100),
    paper_weight INT,
    work_stage TEXT,
    
    -- Ghi chú
    not_deployed_reason TEXT,
    sales_note TEXT,
    customer_production_note TEXT,
    
    -- Hệ thống
    status ENUM('Chờ triển khai', 'Đang sản xuất', 'Hoàn thành', 'Đã hủy'),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### Views thống kê

- `production_orders_stats`: Thống kê tổng quan
- `customer_orders_stats`: Thống kê theo khách hàng  
- `monthly_orders_stats`: Thống kê theo tháng

## Tính năng chính

### 1. Quản lý Lệnh sản xuất
- ✅ Xem danh sách với 35 cột dữ liệu
- ✅ Thêm/Sửa/Xóa lệnh sản xuất
- ✅ Form nhập liệu với 5 nhóm thông tin rõ ràng
- ✅ Validation dữ liệu đầu vào

### 2. Bộ lọc và Tìm kiếm
- ✅ Lọc theo ngày triển khai
- ✅ Lọc theo trạng thái
- ✅ Lọc theo khách hàng
- ✅ Tìm kiếm toàn văn

### 3. Thống kê Dashboard
- ✅ Tổng số lệnh, số lượng
- ✅ Số lệnh theo trạng thái
- ✅ Thống kê theo khách hàng
- ✅ Thống kê theo tháng

### 4. Giao diện người dùng
- ✅ Responsive Bootstrap 5.3
- ✅ Sidebar có thể thu gọn
- ✅ Tables với scroll ngang
- ✅ Modal forms với nhóm fields
- ✅ Loading states và notifications

## Dữ liệu mẫu

Hệ thống đã được tích hợp sẵn 4 lệnh sản xuất mẫu từ các công ty thực tế:

1. **Dorco vina** - LSX 01-2503-00065 (16,688 cái)
2. **Dược Hanvet** - LSX 01-2503-00067 (10,000 cái) 
3. **Hoa Linh Hà Nam** - LSX 01-2503-00068 (Mẫu)
4. **ARTPRESTO** - LSX 01-2503-00069 (1,627 cái bù)

## Troubleshooting

### Lỗi kết nối Database
```bash
# Kiểm tra MySQL đang chạy
service mysql status

# Kiểm tra quyền user
GRANT ALL PRIVILEGES ON autoslp.* TO 'root'@'localhost';
```

### Lỗi CORS
Server đã cấu hình CORS cho frontend, nếu vẫn gặp lỗi:
```javascript
app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:5500'],
  credentials: true
}));
```

### Lỗi Port đã được sử dụng
```bash
# Tìm process đang dùng port 3000
lsof -i :3000

# Kill process
kill -9 <PID>
```

## Phát triển thêm

### Thêm trường dữ liệu mới
1. Cập nhật database schema
2. Thêm field vào form HTML
3. Cập nhật API endpoints
4. Cập nhật JavaScript functions

### Tích hợp với hệ thống khác
- Export/Import Excel
- In báo cáo PDF  
- Notifications email
- Workflow approval
- Barcode/QR code

## Liên hệ

Để hỗ trợ kỹ thuật hoặc tùy chỉnh thêm tính năng, vui lòng liên hệ team phát triển.
