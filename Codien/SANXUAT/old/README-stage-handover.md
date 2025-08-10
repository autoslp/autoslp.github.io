# Hệ Thống Bàn Giao Tự Động Giữa Các Công Đoạn

## 🎯 Mục tiêu
Tự động cập nhật dữ liệu khi bàn giao giữa các công đoạn:
- `xa_output_quantity` → `xen_input_quantity`
- `xen_output_quantity` → `in_offset_input_quantity`
- ... và tương tự cho tất cả 17 công đoạn

## 📁 Files đã tạo/cập nhật

### 1. Database (production_orders_database.sql)
- **Stored Procedure `record_stage_handover`**: Xử lý bàn giao manual với đầy đủ tham số
- **Stored Procedure `quick_stage_handover`**: Bàn giao nhanh (lấy output của stage trước)
- **Trigger `auto_update_next_stage_input`**: Tự động cập nhật input_quantity khi output_quantity thay đổi
- **Bảng `stage_handover_history`**: Lưu lịch sử bàn giao

### 2. JavaScript API (stage-handover-api.js)
- **Class `StageHandoverAPI`**: Xử lý tất cả API calls
- **Methods chính**:
  - `updateStageOutput()`: Cập nhật output quantity
  - `manualHandover()`: Bàn giao manual
  - `quickHandover()`: Bàn giao nhanh
  - `completeAndHandover()`: Hoàn thành stage và bàn giao
  - `getHandoverHistory()`: Lấy lịch sử bàn giao

### 3. Server API (server.js) 
- **POST `/api/stage_handover`**: Bàn giao manual
- **POST `/api/quick_stage_handover`**: Bàn giao nhanh
- **GET `/api/stage_handover_history/:id`**: Lịch sử bàn giao
- **GET `/api/production_orders/:id/stages`**: Chi tiết tất cả stages

### 4. Test Interface (test-stage-handover.html)
- Giao diện test đầy đủ tính năng
- Hiển thị workflow 17 công đoạn
- Form bàn giao nhanh
- Lịch sử bàn giao
- Console log real-time

## 🚀 Cách sử dụng

### 1. Cài đặt Database
```sql
-- Chạy file SQL để tạo stored procedures và trigger
mysql -u root -p autoslp < production_orders_database.sql
```

### 2. Khởi động Server
```bash
cd SANXUAT
node server.js
```

### 3. Test bằng giao diện
```
http://localhost:3000/test-stage-handover.html
```

### 4. Sử dụng JavaScript API
```javascript
// Khởi tạo API
const api = new StageHandoverAPI('/api');

// Cập nhật output quantity (sẽ tự động trigger input cho stage tiếp theo)
await api.updateStageOutput(orderId, 'xa', 1000, 950, 50, 'Nguyễn Văn A');

// Bàn giao nhanh
await api.quickHandover(orderId, 'xa', 'Người bàn giao', 'Người nhận');

// Hoàn thành và bàn giao
await api.completeAndHandover(orderId, 'xa', 1000, 950, 50, 'Thợ A', 'Người giao', 'Người nhận');
```

## 🔄 Flow hoạt động

### 1. Trigger tự động (Database Level)
```sql
-- Khi cập nhật xa_output_quantity
UPDATE production_orders SET xa_output_quantity = 1000 WHERE id = 1;
-- → Trigger tự động set xen_input_quantity = 1000
```

### 2. API Level bàn giao
```javascript
// Bước 1: Update output của stage hiện tại
await api.updateStageOutput(orderId, 'xa', 1000);

// Bước 2: Bàn giao cho stage tiếp theo
await api.quickHandover(orderId, 'xa');
```

### 3. Stored Procedure bàn giao
```sql
CALL quick_stage_handover(1, 'xa', 'xen', 'Người giao', 'Người nhận', 'Ghi chú');
```

## 📊 Workflow 17 công đoạn

```
XẢ → XÉN → IN OFFSET → XÉN TOA → KCS IN → KCS SAU IN → LÁNG → IN LƯỚI → BỒI → BẾ → BÓC LẺ → DÁN 3M → DÁN MÁY → HOÀN THIỆN → GHIM → GẤP → NHẬP KHO
```

### Mapping dữ liệu:
- `xa_output_quantity` → `xen_input_quantity`
- `xen_output_quantity` → `in_offset_input_quantity`
- `in_offset_output_quantity` → `xen_toa_input_quantity`
- ... và tiếp tục cho đến nhap_kho

## 🔍 Debugging

### 1. Check trigger hoạt động
```sql
-- Test trigger
UPDATE production_orders SET xa_output_quantity = 1500 WHERE id = 1;
SELECT xa_output_quantity, xen_input_quantity FROM production_orders WHERE id = 1;
```

### 2. Check stored procedure
```sql
-- Test bàn giao nhanh
CALL quick_stage_handover(1, 'xa', 'xen', 'Test User', 'Test Receiver', 'Test handover');
```

### 3. Check API
```bash
# Test với curl
curl -X POST http://localhost:3000/api/quick_stage_handover \
  -H "Content-Type: application/json" \
  -d '{"order_id": 1, "from_stage": "xa", "to_stage": "xen", "handover_person": "Test"}'
```

## ✨ Tính năng chính

### 1. Tự động cập nhật
- **Database Trigger**: Tự động cập nhật input khi output thay đổi
- **Real-time sync**: Đồng bộ dữ liệu giữa các stage

### 2. Bàn giao linh hoạt
- **Manual handover**: Bàn giao với số lượng tùy chọn
- **Quick handover**: Bàn giao nhanh với output của stage trước
- **Complete & handover**: Hoàn thành stage và bàn giao luôn

### 3. Lịch sử đầy đủ
- **Handover history**: Lưu lại tất cả lần bàn giao
- **Quantity tracking**: Theo dõi chênh lệch số lượng
- **Person tracking**: Ghi nhận người bàn giao/nhận

### 4. Validation
- **Quantity validation**: Kiểm tra số lượng hợp lệ
- **Stage validation**: Đảm bảo đúng thứ tự workflow
- **Status validation**: Kiểm tra trạng thái stage

## 📝 Lưu ý quan trọng

1. **Database Trigger** sẽ tự động chạy khi UPDATE `*_output_quantity`
2. **Stored Procedures** đảm bảo tính nhất quán dữ liệu
3. **API endpoints** cung cấp interface dễ sử dụng
4. **Test interface** giúp debug và demo tính năng

## 🔧 Troubleshooting

### Lỗi thường gặp:
1. **Trigger không chạy**: Check MySQL version và syntax
2. **API error**: Check server.js và database connection
3. **Số lượng không sync**: Check trigger logic
4. **Stage không chuyển**: Check workflow definition

### Debug commands:
```sql
-- Check triggers
SHOW TRIGGERS LIKE 'production_orders';

-- Check procedures  
SHOW PROCEDURE STATUS WHERE Name LIKE '%handover%';

-- Check handover history
SELECT * FROM stage_handover_history ORDER BY handover_date DESC LIMIT 10;
```
