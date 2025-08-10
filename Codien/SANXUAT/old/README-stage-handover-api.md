# STAGE HANDOVER API DOCUMENTATION
## API Documentation cho Bàn giao Công đoạn

### 📋 **Tổng quan**
Hệ thống API để quản lý việc bàn giao giữa các công đoạn sản xuất (XẢ → XÉN → IN → BỒI → BẾ → DÁN → KHO).

### 🚀 **Setup Database**

1. **Chạy SQL script để tạo bảng:**
```sql
-- Chạy file: stage_handovers_database.sql
source stage_handovers_database.sql;
```

2. **Kiểm tra bảng đã tạo:**
```sql
DESCRIBE stage_handovers;
SELECT COUNT(*) FROM stage_handovers;
```

### 🔧 **API Endpoints**

#### 1. **GET /data/stage_handovers**
Lấy danh sách bàn giao công đoạn

**Parameters:**
- `stage` (optional): Lọc theo công đoạn (xa, xen, in, boi, be, dan, kho)
- `handover_date` (optional): Lọc theo ngày bàn giao (YYYY-MM-DD)
- `production_order_id` (optional): Lọc theo ID lệnh sản xuất
- `status` (optional): Lọc theo trạng thái (in_progress, completed, cancelled)

**Response:**
```json
[
  {
    "id": 1,
    "production_order_id": 1,
    "stage": "xa",
    "to_stage": "xen",
    "handover_quantity": 1000,
    "good_quantity": 950,
    "ng_quantity": 30,
    "handover_date": "2025-07-30",
    "handover_person": "Nguyễn Văn A",
    "receiver_person": "Trần Văn B",
    "production_order": "LSX001",
    "product_name": "Hộp giày Nike"
  }
]
```

#### 2. **POST /data/stage_handovers**
Tạo bàn giao công đoạn mới

**Request Body:**
```json
{
  "production_order_id": 1,
  "stage": "xa",
  "to_stage": "xen",
  "handover_quantity": 1000,
  "good_quantity": 950,
  "ng_quantity": 30,
  "ng_start_end_quantity": 10,
  "return_quantity": 10,
  "handover_shift": "Ca 1",
  "handover_machine": "Máy xả 1",
  "handover_person": "Nguyễn Văn A",
  "receiver_person": "Trần Văn B",
  "handover_notes": "Ghi chú bàn giao",
  "worker": "Nguyễn Văn A"
}
```

#### 3. **PUT /data/stage_handovers/:id**
Cập nhật bàn giao công đoạn

**Request Body:** (same as POST)

#### 4. **DELETE /data/stage_handovers/:id**
Xóa bàn giao công đoạn

#### 5. **GET /data/stage_handovers_stats**
Lấy thống kê bàn giao theo công đoạn

**Response:**
```json
[
  {
    "stage": "xa",
    "total_handovers": 10,
    "total_handover_qty": 10000,
    "total_good_qty": 9500,
    "total_ng_qty": 300,
    "avg_efficiency": 95.5
  }
]
```

#### 6. **POST /data/complete_and_handover_stage** ⭐
API đặc biệt: Hoàn thành và bàn giao công đoạn

**Request Body:**
```json
{
  "production_order_id": 1,
  "stage": "xa",
  "to_stage": "xen",
  "good_quantity": 950,
  "ng_quantity": 30,
  "handover_quantity": 950,
  "handover_person": "Nguyễn Văn A",
  "receiver_person": "Trần Văn B",
  "machine": "Máy xả 1",
  "worker": "Nguyễn Văn A",
  "shift": "Ca 1",
  "handover_notes": "Bàn giao đầy đủ"
}
```

### 📱 **Frontend Usage**

#### JavaScript API Functions:

```javascript
// 1. Lấy danh sách bàn giao
const handovers = await window.ProductionAPI.getStageHandovers({
  stage: 'xa',
  handover_date: '2025-07-30'
});

// 2. Tạo bàn giao mới
const newHandover = await window.ProductionAPI.saveStageHandover({
  production_order_id: 1,
  stage: 'xa',
  to_stage: 'xen',
  handover_quantity: 1000,
  good_quantity: 950,
  // ... other fields
}, false); // false = create new

// 3. Cập nhật bàn giao
const updatedHandover = await window.ProductionAPI.saveStageHandover({
  handover_quantity: 1000,
  good_quantity: 960,
  // ... other fields
}, true, handoverId); // true = update, handoverId = ID to update

// 4. Hoàn thành và bàn giao (recommended)
const result = await window.ProductionAPI.completeAndHandoverStage({
  production_order_id: 1,
  stage: 'xa',
  to_stage: 'xen',
  good_quantity: 950,
  handover_quantity: 950,
  handover_person: 'Nguyễn Văn A',
  receiver_person: 'Trần Văn B'
});

// 5. Lấy thống kê
const stats = await window.ProductionAPI.getStageHandoversStats();
```

### 🎯 **Integration với Stage Files**

#### Trong xa-stage.html:
```javascript
// Function hoàn thành công đoạn XẢ
async function completeStageXa(orderId) {
  try {
    const result = await window.ProductionAPI.completeAndHandoverStage({
      production_order_id: orderId,
      stage: 'xa',
      to_stage: 'xen',
      good_quantity: parseInt(document.getElementById('goodQty').value),
      ng_quantity: parseInt(document.getElementById('ngQty').value),
      handover_quantity: parseInt(document.getElementById('handoverQty').value),
      handover_person: document.getElementById('handoverPerson').value,
      receiver_person: document.getElementById('receiverPerson').value,
      machine: document.getElementById('machine').value,
      worker: document.getElementById('worker').value,
      shift: document.getElementById('shift').value,
      handover_notes: document.getElementById('handoverNotes').value
    });
    
    App.notify('Hoàn thành và bàn giao công đoạn XẢ thành công!', 'success');
    refreshData();
  } catch (error) {
    App.notify('Lỗi: ' + error.message, 'error');
  }
}
```

#### Trong xen-stage.html:
```javascript
// Function hoàn thành công đoạn XÉN
async function completeStageXen(orderId) {
  try {
    const result = await window.ProductionAPI.completeAndHandoverStage({
      production_order_id: orderId,
      stage: 'xen',
      to_stage: 'in',
      good_quantity: parseInt(document.getElementById('goodQty').value),
      ng_quantity: parseInt(document.getElementById('ngQty').value),
      handover_quantity: parseInt(document.getElementById('handoverQty').value),
      handover_person: document.getElementById('handoverPerson').value,
      receiver_person: document.getElementById('receiverPerson').value,
      machine: document.getElementById('machine').value,
      worker: document.getElementById('worker').value,
      shift: document.getElementById('shift').value,
      handover_notes: document.getElementById('handoverNotes').value
    });
    
    App.notify('Hoàn thành và bàn giao công đoạn XÉN thành công!', 'success');
    refreshData();
  } catch (error) {
    App.notify('Lỗi: ' + error.message, 'error');
  }
}
```

### ✅ **Validation Rules**

1. **Required Fields:**
   - `production_order_id`
   - `stage`
   - `handover_quantity` > 0

2. **Business Rules:**
   - `good_quantity` ≤ `handover_quantity`
   - `handover_quantity` ≥ (`good_quantity` + `ng_quantity`)
   - `production_order_id` phải tồn tại trong bảng `production_orders`

3. **Data Types:**
   - Quantities: Integer ≥ 0
   - Dates: YYYY-MM-DD format
   - Times: HH:MM:SS format

### 🔒 **Error Handling**

```javascript
try {
  const result = await window.ProductionAPI.completeAndHandoverStage(data);
  // Success
} catch (error) {
  if (error.message.includes('Thiếu thông tin bắt buộc')) {
    // Handle missing required fields
  } else if (error.message.includes('Số lượng bàn giao không thể lớn hơn')) {
    // Handle business rule violation
  } else {
    // Handle other errors
  }
}
```

### 📊 **Database Views**

#### stage_handovers_summary:
```sql
SELECT * FROM stage_handovers_summary 
WHERE handover_date = '2025-07-30';
```

#### stage_handovers_detail:
```sql
SELECT * FROM stage_handovers_detail 
WHERE stage = 'xa'
ORDER BY handover_date DESC;
```

### 🧪 **Testing**

1. **Mở file test:** `test-stage-handover-api.html`
2. **Chạy server:** `node server.js`
3. **Test từng API endpoint**
4. **Kiểm tra database:** Verify data trong MySQL

### 📈 **Monitoring**

#### Log các API calls:
```javascript
console.log('=== STAGE HANDOVER API CALL ===');
console.log('Endpoint:', url);
console.log('Method:', method);
console.log('Data:', data);
console.log('Response:', response);
```

#### Kiểm tra performance:
```sql
-- Top handovers by efficiency
SELECT * FROM stage_handovers_detail 
WHERE efficiency_percent < 90
ORDER BY efficiency_percent ASC;

-- Daily handover summary
SELECT handover_date, COUNT(*) as total_handovers,
       SUM(handover_quantity) as total_qty
FROM stage_handovers 
WHERE handover_date >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
GROUP BY handover_date;
```

### 🚨 **Common Issues**

1. **Foreign Key Error:**
   - Đảm bảo `production_order_id` tồn tại
   - Kiểm tra bảng `production_orders`

2. **Validation Error:**
   - Kiểm tra số lượng bàn giao > số lượng đạt
   - Validate required fields

3. **Connection Error:**
   - Kiểm tra server đang chạy
   - Verify database connection

### 🎁 **Best Practices**

1. **Sử dụng Transaction:** API `complete_and_handover_stage` đã có transaction
2. **Validate trước khi gọi API:** Check data ở frontend
3. **Handle errors gracefully:** Show user-friendly messages
4. **Log important actions:** Track handover history
5. **Use appropriate HTTP status codes:** 200, 201, 400, 404, 500

---

### 📞 **Support**

Nếu có vấn đề, kiểm tra:
1. Server logs: `console.log` trong server.js
2. Browser console: `F12` → Console tab  
3. Network tab: Xem API requests/responses
4. Database: Kiểm tra data trong MySQL

**Happy Coding! 🚀**
