# 🏭 Hệ thống Máy Đơn giản

## 📋 Mô tả
Hệ thống quản lý máy đơn giản với các tính năng:
- ✅ **1 bảng máy** (`production_machines`)
- ✅ **Gửi mã lệnh vào máy** khi bắt đầu
- ✅ **Xóa lệnh khỏi máy** khi kết thúc
- ✅ **Chặn các lệnh khác** của máy đang bận

## 🚀 Cách chạy

### 1. Chạy SQL để tạo database
```sql
SOURCE simple-machine-solution.sql;
```

### 2. Khởi động server
```bash
cd SANXUAT
node server.js
```

### 3. Mở trình duyệt
```
https://autoslp.duckdns.org/test-machine-system.html
```

## 📊 Database Schema

### Bảng `production_machines`
```sql
CREATE TABLE production_machines (
    id INT AUTO_INCREMENT PRIMARY KEY,
    machine_id VARCHAR(50) NOT NULL UNIQUE,
    machine_name VARCHAR(100) NOT NULL,
    current_order_id INT NULL, -- Lệnh đang chạy (NULL = rảnh)
    current_order_code VARCHAR(100) NULL, -- Mã lệnh đang chạy
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Functions & Stored Procedures
- `IsMachineAvailable(machine_id)` - Kiểm tra máy có rảnh không
- `GetAvailableMachines()` - Lấy danh sách máy rảnh
- `StartOrderOnMachine(machine_id, order_id, order_code)` - Bắt đầu lệnh
- `EndOrderOnMachine(machine_id, order_id)` - Kết thúc lệnh

### View
- `v_machine_status` - Trạng thái máy (available/busy)

## 🔌 API Endpoints

### 1. Lấy danh sách máy rảnh
```
GET /api/available_machines
```
**Response:**
```json
{
  "available_machines": [
    {"machine_id": "XA001", "machine_name": "Máy Xả 1"},
    {"machine_id": "XA002", "machine_name": "Máy Xả 2"}
  ]
}
```

### 2. Bắt đầu lệnh trên máy
```
POST /api/start_order_on_machine
```
**Body:**
```json
{
  "machine_id": "XA001",
  "order_id": 1,
  "order_code": "LENH001"
}
```

### 3. Kết thúc lệnh trên máy
```
POST /api/end_order_on_machine
```
**Body:**
```json
{
  "machine_id": "XA001",
  "order_id": 1
}
```

### 4. Lấy trạng thái máy
```
GET /api/machine_status
```
**Response:**
```json
{
  "machines": [
    {
      "machine_id": "XA001",
      "machine_name": "Máy Xả 1",
      "status": "available",
      "current_order_code": null,
      "current_order_id": null
    }
  ]
}
```

## 🧪 Test

### 1. Test bắt đầu lệnh
1. Chọn máy rảnh từ dropdown
2. Chọn lệnh chưa hoàn thành
3. Nhấn "Bắt đầu"
4. Kiểm tra máy chuyển từ "Rảnh" → "Bận"

### 2. Test kết thúc lệnh
1. Chọn máy đang chạy từ dropdown
2. Nhấn "Kết thúc"
3. Kiểm tra máy chuyển từ "Bận" → "Rảnh"

### 3. Test chặn lệnh
1. Bắt đầu lệnh trên máy A
2. Thử bắt đầu lệnh khác trên máy A
3. Kiểm tra thông báo lỗi "Máy đang bận"

## 📁 Files

- `simple-machine-solution.sql` - Database schema
- `server.js` - API endpoints (đã thêm)
- `api-config.js` - API configuration
- `simple-machine-ui.js` - UI logic
- `test-machine-system.html` - Test interface

## 🔧 Troubleshooting

### Lỗi "Table doesn't exist"
```sql
-- Kiểm tra bảng đã tạo chưa
SHOW TABLES LIKE 'production_machines';

-- Tạo lại nếu cần
SOURCE simple-machine-solution.sql;
```

### Lỗi "Function doesn't exist"
```sql
-- Kiểm tra functions
SHOW FUNCTION STATUS WHERE Name LIKE '%Machine%';

-- Tạo lại nếu cần
SOURCE simple-machine-solution.sql;
```

### Lỗi API
- Kiểm tra server đã chạy chưa: `node server.js`
- Kiểm tra domain `https://autoslp.duckdns.org` có hoạt động không
- Kiểm tra database connection
- Kiểm tra file `api-config.js` có đúng domain không

## 🎯 Tính năng chính

1. **Quản lý máy đơn giản** - Chỉ 1 bảng
2. **Gán lệnh cho máy** - Khi bắt đầu sản xuất
3. **Xóa lệnh khỏi máy** - Khi kết thúc sản xuất
4. **Chặn lệnh trùng** - Máy đang bận không nhận lệnh mới
5. **Real-time status** - Auto refresh mỗi 5 giây
6. **UI thân thiện** - Modal chọn máy, thông báo

## 📈 Mở rộng

Có thể mở rộng thêm:
- Thêm nhiều công đoạn (xa, xen, in_offset, etc.)
- Thêm thông tin máy (capacity, efficiency, etc.)
- Thêm scheduling thông minh
- Thêm maintenance schedule
- Thêm reporting & analytics 