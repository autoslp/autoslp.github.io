# 🚀 API CHUNG CHO TẤT CẢ CÔNG ĐOẠN

## 📊 Tổng quan

Thay vì tạo riêng API cho từng công đoạn, chúng ta sử dụng **một API chung** `/data/production_orders/optimized` với tham số `stage` để xác định công đoạn cần lấy dữ liệu.

**🆕 Tính năng mới**: Sử dụng file cấu hình riêng `stage-columns-config.js` để quản lý định nghĩa cột, giúp tăng tính linh hoạt và dễ bảo trì.

## 🎯 API Endpoint

```
GET /data/production_orders/optimized
```

## 📋 Tham số

| Tham số | Kiểu | Mô tả | Ví dụ |
|---------|------|-------|-------|
| `stage` | string | Tên công đoạn | `xa`, `xen`, `in_offset`, `boi`, `be`, `dan_may`, `kho` |
| `days_back` | number | Số ngày lùi lại (mặc định: 30) | `7`, `30`, `90` |
| `limit` | number | Số records tối đa | `100`, `500`, `1000` |
| `offset` | number | Số records bỏ qua (cho pagination) | `0`, `100`, `200` |
| `status` | string | Lọc theo trạng thái | `Đang sản xuất`, `Hoàn thành` |
| `customer_name` | string | Lọc theo khách hàng | `ABC Company` |
| `search` | string | Tìm kiếm theo từ khóa | `PO123`, `Product A` |
| `columns` | string | Cột tùy chỉnh (phân cách bằng dấu phẩy) | `xa_input_quantity,xa_output_quantity` |

## 🏭 Các công đoạn được hỗ trợ

### 1. **XA** - Công đoạn Xả
```javascript
const url = `${API_BASE_URL}/data/production_orders/optimized?stage=xa&limit=500&days_back=30`;
```

### 2. **XEN** - Công đoạn Xén
```javascript
const url = `${API_BASE_URL}/data/production_orders/optimized?stage=xen&limit=500&days_back=30`;
```

### 3. **IN_OFFSET** - Công đoạn In Offset
```javascript
const url = `${API_BASE_URL}/data/production_orders/optimized?stage=in_offset&limit=500&days_back=30`;
```

### 4. **BOI** - Công đoạn Bồi
```javascript
const url = `${API_BASE_URL}/data/production_orders/optimized?stage=boi&limit=500&days_back=30`;
```

### 5. **BE** - Công đoạn Bế
```javascript
const url = `${API_BASE_URL}/data/production_orders/optimized?stage=be&limit=500&days_back=30`;
```

### 6. **DAN_MAY** - Công đoạn Dán Máy
```javascript
const url = `${API_BASE_URL}/data/production_orders/optimized?stage=dan_may&limit=500&days_back=30`;
```

### 7. **KHO** - Kho Thành Phẩm
```javascript
const url = `${API_BASE_URL}/data/production_orders/optimized?stage=kho&limit=500&days_back=30`;
```

## 📊 Cột dữ liệu theo công đoạn

### Cột cơ bản (luôn có):
- `id`, `production_order`, `po_number`, `customer_name`, `product_name`
- `order_quantity`, `deployed_quantity`, `required_quantity`
- `work_stage`, `status`, `deployment_date`, `created_at`, `updated_at`

### Cột theo công đoạn:

#### XA Stage:
- `xa_input_quantity`, `xa_output_quantity`, `xa_good_quantity`, `xa_ng_quantity`
- `xa_status`, `xa_start_time`, `xa_end_time`, `xa_worker_name`, `xa_note`
- `xen_input_quantity`, `xen_output_quantity`, `xen_good_quantity`, `xen_ng_quantity`
- `xen_status`, `xen_start_time`, `xen_end_time`, `xen_worker_name`, `xen_note`

#### XEN Stage:
- `xen_input_quantity`, `xen_output_quantity`, `xen_good_quantity`, `xen_ng_quantity`
- `xen_status`, `xen_start_time`, `xen_end_time`, `xen_worker_name`, `xen_note`
- `in_offset_input_quantity`, `in_offset_output_quantity`, `in_offset_good_quantity`, `in_offset_ng_quantity`
- `in_offset_status`, `in_offset_start_time`, `in_offset_end_time`, `in_offset_worker_name`, `in_offset_note`

## 🔧 Ví dụ sử dụng

### 1. Load dữ liệu cho xa-stage:
```javascript
async function loadXaStageData() {
  const url = `${API_BASE_URL}/data/production_orders/optimized?stage=xa&limit=500&days_back=30`;
  const response = await fetch(url);
  const data = await response.json();
  return data;
}
```

### 2. Load dữ liệu cho xen-stage:
```javascript
async function loadXenStageData() {
  const url = `${API_BASE_URL}/data/production_orders/optimized?stage=xen&limit=500&days_back=30`;
  const response = await fetch(url);
  const data = await response.json();
  return data;
}
```

### 3. Tìm kiếm với filter:
```javascript
async function searchOrders(searchTerm) {
  const url = `${API_BASE_URL}/data/production_orders/optimized?stage=xa&search=${searchTerm}&limit=100`;
  const response = await fetch(url);
  const data = await response.json();
  return data;
}
```

### 4. Lọc theo khách hàng:
```javascript
async function getOrdersByCustomer(customerName) {
  const url = `${API_BASE_URL}/data/production_orders/optimized?stage=xa&customer_name=${customerName}&limit=200`;
  const response = await fetch(url);
  const data = await response.json();
  return data;
}
```

### 5. Cột tùy chỉnh:
```javascript
async function getCustomColumns() {
  const url = `${API_BASE_URL}/data/production_orders/optimized?columns=xa_input_quantity,xa_output_quantity,xa_status&limit=100`;
  const response = await fetch(url);
  const data = await response.json();
  return data;
}
```

## 🔄 Tương thích ngược

Các API cũ vẫn hoạt động và sẽ redirect đến API mới:

- `/data/production_orders/xa-stage` → `/data/production_orders/optimized?stage=xa`
- `/data/production_orders/xen-stage` → `/data/production_orders/optimized?stage=xen`

## 📈 Lợi ích

### ✅ **Giảm code trùng lặp**
- Từ 2 API riêng biệt → 1 API chung
- Dễ bảo trì và mở rộng

### ✅ **Linh hoạt**
- Có thể thêm công đoạn mới dễ dàng
- Cột tùy chỉnh theo nhu cầu

### ✅ **Performance**
- Chỉ lấy cột cần thiết
- Filter theo ngày mặc định
- Indexes tối ưu

### ✅ **Tương thích**
- API cũ vẫn hoạt động
- Không cần thay đổi frontend cũ

## 🛠️ Thêm công đoạn mới

Để thêm công đoạn mới, chỉ cần thêm vào `STAGE_COLUMNS` trong file `stage-columns-config.js`:

```javascript
const STAGE_COLUMNS = {
  // ... các công đoạn hiện tại
  'new_stage': [
    'new_stage_input_quantity', 'new_stage_output_quantity',
    'new_stage_good_quantity', 'new_stage_ng_quantity',
    'new_stage_status', 'new_stage_start_time', 'new_stage_end_time',
    'new_stage_worker_name', 'new_stage_note'
  ]
};
```

## 📁 File Cấu Hình

### `stage-columns-config.js`
File này chứa tất cả định nghĩa cột cho các công đoạn:

- **`BASE_COLUMNS`**: Các cột cơ bản luôn cần
- **`STAGE_COLUMNS`**: Các cột theo từng công đoạn
- **`getColumnsForStage(stage, customColumns)`**: Hàm lấy cột cho công đoạn
- **`isValidStage(stage)`**: Hàm kiểm tra công đoạn hợp lệ
- **`getAvailableStages()`**: Hàm lấy danh sách công đoạn có sẵn

### Lợi ích của file cấu hình riêng:
- ✅ **Không cần sửa `server.js`** khi thêm/sửa cột
- ✅ **Có thể sử dụng ở cả server và client**
- ✅ **Dễ dàng mở rộng và bảo trì**
- ✅ **Code sạch và có tổ chức**

## 📞 Hỗ trợ

Nếu cần thêm công đoạn hoặc cột mới, chỉ cần cập nhật `STAGE_COLUMNS` trong `stage-columns-config.js`!

Xem thêm: [README_STAGE_COLUMNS_CONFIG.md](./README_STAGE_COLUMNS_CONFIG.md) 