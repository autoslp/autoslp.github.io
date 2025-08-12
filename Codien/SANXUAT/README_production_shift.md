# HỆ THỐNG QUẢN LÝ CA LÀM VIỆC (PRODUCTION ORDERS SHIFT)

## Tổng quan

Hệ thống này cho phép quản lý chi tiết thông tin sản xuất theo từng ca làm việc, bổ sung cho bảng `production_orders` hiện tại.

### Cấu trúc dữ liệu

#### 1. Bảng `production_orders` (hiện tại)
- Lưu trữ **tổng số lượng** và **tổng thông tin báo cáo**
- Ví dụ: Lệnh A có tổng 1000 pcs OK, 100 pcs NG

#### 2. Bảng `production_orders_shift` (mới)
- Lưu trữ **thông tin chi tiết theo từng ca**
- Ví dụ: Lệnh A có 3 ca:
  - Ca 1: 400 pcs OK, 40 pcs NG
  - Ca 2: 350 pcs OK, 35 pcs NG  
  - Ca 3: 250 pcs OK, 25 pcs NG

## Cài đặt

### 1. Tạo bảng và cấu trúc dữ liệu

```bash
# Chạy script SQL để tạo bảng
mysql -u root -p autoslp < create_production_orders_shift_table.sql
```

### 2. Thêm API vào server.js

```javascript
// Thêm vào cuối file server.js
const productionShiftApis = require('./production_shift_apis');
app.use('/data', productionShiftApis);
```

## Cấu trúc bảng

### Bảng `production_orders_shift`

| Trường | Kiểu dữ liệu | Mô tả |
|--------|--------------|-------|
| `id` | INT | Khóa chính |
| `production_order_id` | INT | ID lệnh sản xuất (FK) |
| `stage` | VARCHAR(50) | Tên công đoạn (xa, xen, in_offset, boi, be, dan_may, kho) |
| `shift_number` | INT | Số thứ tự ca (1, 2, 3...) |
| `shift_name` | VARCHAR(50) | Tên ca (Ca 1, Ca 2, Ca 3, Kíp 1, Kíp 2) |
| `shift_date` | DATE | Ngày làm việc của ca |
| `input_quantity` | INT | Số lượng đầu vào ca này |
| `output_quantity` | INT | Tổng số lượng sản xuất ca này |
| `good_quantity` | INT | Số lượng OK ca này |
| `ng_quantity` | INT | Số lượng NG ca này |
| `ng_start_end_quantity` | INT | NG đầu/cuối ca |
| `return_quantity` | INT | Hàng trả ca này |
| `handover_quantity` | INT | Số lượng bàn giao ca này |
| `production_order` | VARCHAR(100) | Mã lệnh sản xuất |
| `start_time` | DATETIME | Thời gian bắt đầu ca |
| `end_time` | DATETIME | Thời gian kết thúc ca |
| `work_duration_minutes` | INT | Thời gian làm việc (phút) |
| `worker_name` | VARCHAR(100) | Thợ phụ trách ca này |
| `machine_name` | VARCHAR(100) | Máy sử dụng ca này |
| `handover_person` | VARCHAR(100) | Người bàn giao |
| `receiver_person` | VARCHAR(100) | Người nhận |
| `ng_reason` | TEXT | Lý do NG |
| `efficiency_percent` | DECIMAL(5,2) | Hiệu suất (%) |
| `quality_score` | DECIMAL(3,2) | Điểm chất lượng (0-10) |
| `status` | ENUM | Trạng thái (in_progress, completed, paused, cancelled) |
| `notes` | TEXT | Ghi chú ca này |
| `quality_notes` | TEXT | Ghi chú chất lượng |
| `is_overtime` | TINYINT(1) | Có làm thêm giờ không |
| `overtime_hours` | DECIMAL(4,2) | Số giờ làm thêm |
| `is_night_shift` | TINYINT(1) | Có phải ca đêm không |
| `break_duration_minutes` | INT | Thời gian nghỉ (phút) |

## API Endpoints

### 1. Quản lý Shift

#### Lấy danh sách shift của một lệnh sản xuất
```http
GET /data/production_orders/:id/shifts
```

**Query Parameters:**
- `stage` (optional): Lọc theo công đoạn
- `shift_date` (optional): Lọc theo ngày
- `status` (optional): Lọc theo trạng thái

**Response:**
```json
{
  "order_id": 2,
  "total_shifts": 5,
  "shifts": [
    {
      "id": 1,
      "production_order_id": 2,
      "stage": "xa",
      "shift_number": 1,
      "shift_name": "Ca 1",
      "shift_date": "2025-03-11",
      "good_quantity": 900,
      "ng_quantity": 50,
      "start_time": "2025-03-11 06:00:00",
      "end_time": "2025-03-11 14:00:00",
      "worker_name": "Nguyễn Văn A",
      "machine_name": "Xả 1",
      "status": "completed"
    }
  ]
}
```

#### Lấy chi tiết một shift
```http
GET /data/production_orders_shift/:id
```

#### Tạo shift mới
```http
POST /data/production_orders_shift
```

**Request Body:**
```json
{
  "production_order_id": 2,
  "stage": "xa",
  "shift_number": 1,
  "shift_name": "Ca 1",
  "shift_date": "2025-03-11",
  "input_quantity": 1000,
  "worker_name": "Nguyễn Văn A",
  "machine_name": "Xả 1",
  "start_time": "2025-03-11 06:00:00",
  "notes": "Ca sáng"
}
```

#### Cập nhật shift
```http
PUT /data/production_orders_shift/:id
```

#### Xóa shift
```http
DELETE /data/production_orders_shift/:id
```

#### Kết thúc shift
```http
POST /data/production_orders_shift/:id/complete
```

**Request Body:**
```json
{
  "output_quantity": 950,
  "good_quantity": 900,
  "ng_quantity": 50,
  "end_time": "2025-03-11 14:00:00",
  "handover_person": "Nguyễn Văn A",
  "receiver_person": "Trần Thị B",
  "notes": "Hoàn thành ca sáng"
}
```

### 2. Thống kê

#### Thống kê shift
```http
GET /data/production_orders_shift/statistics
```

**Query Parameters:**
- `stage` (optional): Lọc theo công đoạn
- `shift_date` (optional): Lọc theo ngày
- `worker_name` (optional): Lọc theo thợ
- `machine_name` (optional): Lọc theo máy

#### Tổng hợp dữ liệu
```http
GET /data/production_orders/:id/summary
```

**Response:**
```json
{
  "success": true,
  "order": {
    "id": 2,
    "production_order": "01-2503-00071",
    "product_name": "Vỉ thuốc Boganic 250mg",
    "customer_name": "Công ty CP Dược Traphaco"
  },
  "shift_statistics": {
    "xa": {
      "total_shifts": 3,
      "total_good_from_shifts": 2770,
      "total_ng_from_shifts": 130
    },
    "xen": {
      "total_shifts": 2,
      "total_good_from_shifts": 1650,
      "total_ng_from_shifts": 100
    }
  },
  "comparison": {
    "xa": {
      "from_production_orders": {
        "good_quantity": 2770,
        "ng_quantity": 130
      },
      "from_shifts": {
        "total_good_from_shifts": 2770,
        "total_ng_from_shifts": 130
      },
      "difference": {
        "good_diff": 0,
        "ng_diff": 0
      }
    }
  }
}
```

## Stored Procedures và Triggers

### Stored Procedures

1. **`UpdateProductionOrderTotals`**: Tự động cập nhật tổng số lượng bao gồm:
   - `good_quantity`: Tổng số lượng OK
   - `ng_quantity`: Tổng số lượng NG  
   - `output_quantity`: Tổng số lượng sản xuất
   - `handover_quantity`: Tổng số lượng bàn giao

### Triggers

1. **`tr_production_orders_shift_after_insert`**: Tự động cập nhật khi thêm shift
2. **`tr_production_orders_shift_after_update`**: Tự động cập nhật khi sửa shift
3. **`tr_production_orders_shift_after_delete`**: Tự động cập nhật khi xóa shift

## Ví dụ sử dụng

### 1. Tạo ca làm việc mới

```javascript
// Tạo ca 1 cho công đoạn XẢ
const newShift = {
  production_order_id: 2,
  stage: 'xa',
  shift_number: 1,
  shift_name: 'Ca 1',
  shift_date: '2025-03-11',
  input_quantity: 1000,
  worker_name: 'Nguyễn Văn A',
  machine_name: 'Xả 1',
  start_time: '2025-03-11 06:00:00',
  notes: 'Ca sáng'
};

fetch('/data/production_orders_shift', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(newShift)
});
```

### 2. Kết thúc ca làm việc

```javascript
// Kết thúc ca 1
const completeShift = {
  output_quantity: 950,
  good_quantity: 900,
  ng_quantity: 50,
  end_time: '2025-03-11 14:00:00',
  handover_person: 'Nguyễn Văn A',
  receiver_person: 'Trần Thị B',
  notes: 'Hoàn thành ca sáng'
};

fetch('/data/production_orders_shift/1/complete', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(completeShift)
});
```

### 3. Lấy thống kê

```javascript
// Lấy thống kê theo ngày
fetch('/data/production_orders_shift/statistics?shift_date=2025-03-11')
  .then(response => response.json())
  .then(data => {
    console.log('Thống kê:', data.statistics);
  });
```

## Lợi ích

1. **Quản lý chi tiết**: Theo dõi được từng ca làm việc cụ thể
2. **Phân tích hiệu suất**: So sánh hiệu suất giữa các ca
3. **Truy xuất nguồn gốc**: Biết được sản phẩm được sản xuất ở ca nào
4. **Báo cáo linh hoạt**: Tạo báo cáo theo nhiều chiều khác nhau
5. **Tự động đồng bộ**: Dữ liệu tự động cập nhật giữa 2 bảng

## Lưu ý

1. **Unique Constraint**: Một lệnh sản xuất chỉ có 1 ca số X cho mỗi công đoạn
2. **Foreign Key**: Shift phải liên kết với lệnh sản xuất tồn tại
3. **Auto Update**: Tổng số lượng tự động cập nhật khi thay đổi shift
4. **Data Integrity**: Đảm bảo tính toàn vẹn dữ liệu giữa 2 bảng 