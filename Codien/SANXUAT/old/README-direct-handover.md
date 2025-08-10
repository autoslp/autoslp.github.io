# Hệ Thống Bàn Giao Trực Tiếp - Chỉ Sử Dụng 1 Bảng

## 🎯 Mục tiêu mới
Khi bàn giao từ **XẢ** sang **XÉN**:
- Số lượng bàn giao sẽ được ghi **trực tiếp** vào cột `xen_input_quantity` 
- **Chỉ sử dụng 1 bảng** `production_orders` để lưu dữ liệu
- Không cần bảng lịch sử phức tạp

## 🔄 Cách hoạt động

### 1. **Workflow đơn giản:**
```
XẢ (xa_output_quantity = 1000) 
    ↓ [Bàn giao]
XÉN (xen_input_quantity = 1000) ← Ghi trực tiếp vào đây
```

### 2. **Database Stored Procedure:**
```sql
CALL handover_to_next_stage(order_id, 'xa', 1000, 'Người giao', 'Người nhận', 'Ghi chú');
```
**Kết quả:**
- `xa_output_quantity = 1000`
- `xa_status = 'completed'` 
- `xen_input_quantity = 1000` ← **Ghi trực tiếp**
- `xen_status = 'in_progress'`
- `current_stage = 'xen'`

### 3. **JavaScript API:**
```javascript
// Bàn giao trực tiếp 
await api.handoverToNextStage(orderId, 'xa', 1000, 'Người giao', 'Người nhận');

// Hoàn thành và bàn giao
await api.completeAndHandover(orderId, 'xa', 1000, 950, 50, 'Thợ A', 'Người giao', 'Người nhận');
```

## 📁 Files đã cập nhật

### 1. **Database (production_orders_database.sql)**
- ✅ Stored procedure `handover_to_next_stage()` - Bàn giao trực tiếp
- ✅ Xóa trigger phức tạp, chỉ giữ logic đơn giản
- ✅ Mapping đầy đủ 17 công đoạn

### 2. **Server API (server.js)**
- ✅ `POST /api/handover_to_next_stage` - API bàn giao trực tiếp
- ✅ `PUT /api/production_orders/:id/stage_output` - Cập nhật output
- ✅ Response trả về tên cột đã được cập nhật

### 3. **JavaScript API (stage-handover-api.js)**
- ✅ `handoverToNextStage()` - Bàn giao trực tiếp mới
- ✅ `updateStageOutput()` - Cập nhật output đơn giản
- ✅ `completeAndHandover()` - Hoàn thành và bàn giao

### 4. **Test Interface**
- ✅ `test-direct-handover.html` - Giao diện test đơn giản XẢ→XÉN
- ✅ `test-stage-handover.html` - Giao diện test đầy đủ 17 stage

## 🚀 Cách sử dụng

### 1. **Chạy Database:**
```bash
mysql -u root -p autoslp < production_orders_database.sql
```

### 2. **Khởi động Server:**
```bash
cd SANXUAT
node server.js
```

### 3. **Test bàn giao trực tiếp:**
```
http://localhost:3000/test-direct-handover.html
```

### 4. **Test đầy đủ 17 công đoạn:**
```
http://localhost:3000/test-stage-handover.html
```

## 📊 Ví dụ thực tế

### Scenario: Bàn giao từ XẢ sang XÉN

**Trước khi bàn giao:**
```sql
SELECT xa_output_quantity, xen_input_quantity, current_stage 
FROM production_orders WHERE id = 1;
-- Kết quả: 0, 0, 'xa'
```

**Thực hiện bàn giao:**
```javascript
await api.handoverToNextStage(1, 'xa', 1000, 'Nguyễn Văn A', 'Trần Thị B');
```

**Sau khi bàn giao:**
```sql
SELECT xa_output_quantity, xen_input_quantity, current_stage 
FROM production_orders WHERE id = 1;
-- Kết quả: 1000, 1000, 'xen'
```

## 🔧 API Endpoints

### 1. **Bàn giao trực tiếp**
```http
POST /api/handover_to_next_stage
Content-Type: application/json

{
  "order_id": 1,
  "current_stage": "xa", 
  "handover_quantity": 1000,
  "handover_person": "Nguyễn Văn A",
  "receiver_person": "Trần Thị B",
  "notes": "Bàn giao đúng hạn"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Bàn giao thành công từ XA sang XEN",
  "from_stage": "xa",
  "to_stage": "xen", 
  "handover_quantity": 1000,
  "updated_column": "xen_input_quantity"
}
```

### 2. **Cập nhật output**
```http
PUT /api/production_orders/1/stage_output
Content-Type: application/json

{
  "stage": "xa",
  "output_quantity": 1000,
  "good_quantity": 950,
  "ng_quantity": 50,
  "worker_name": "Thợ XẢ A"
}
```

## 🎨 Giao diện test

### Test đơn giản (XẢ → XÉN):
- Hiển thị 2 stage cạnh nhau
- Input số lượng bàn giao
- Button bàn giao trực tiếp
- Real-time update kết quả

### Test đầy đủ (17 công đoạn):
- Workflow hoàn chỉnh
- Quản lý tất cả stages
- Lịch sử bàn giao
- Console log chi tiết

## ✨ Ưu điểm

### 1. **Đơn giản**
- Chỉ 1 bảng `production_orders`
- Logic rõ ràng: output → input
- Dễ hiểu, dễ maintain

### 2. **Hiệu quả**
- Không cần JOIN nhiều bảng
- Transaction đơn giản
- Performance tốt

### 3. **Trực quan**
- Dữ liệu tập trung 1 nơi
- Dễ query và báo cáo
- Debug nhanh chóng

## 🔍 Debug & Troubleshooting

### 1. **Kiểm tra dữ liệu:**
```sql
-- Xem tình trạng workflow
SELECT production_order, current_stage, 
       xa_output_quantity, xen_input_quantity,
       xen_output_quantity, in_offset_input_quantity
FROM production_orders WHERE id = 1;
```

### 2. **Test stored procedure:**
```sql
-- Test bàn giao
CALL handover_to_next_stage(1, 'xa', 1000, 'Test User', 'Test Receiver', 'Test note');
```

### 3. **Test API với curl:**
```bash
curl -X POST http://localhost:3000/api/handover_to_next_stage \
  -H "Content-Type: application/json" \
  -d '{"order_id": 1, "current_stage": "xa", "handover_quantity": 1000}'
```

## 📝 Lưu ý quan trọng

1. **Dữ liệu được ghi trực tiếp** vào cột `{next_stage}_input_quantity`
2. **1 transaction** xử lý: output current + input next + update status
3. **Lịch sử vẫn được lưu** trong bảng `stage_handover_history` để audit
4. **Current stage tự động chuyển** sang stage tiếp theo
5. **Status tự động cập nhật**: completed → in_progress

Hệ thống này đảm bảo tính đơn giản và hiệu quả, phù hợp với yêu cầu chỉ sử dụng 1 bảng để lưu dữ liệu công đoạn!
