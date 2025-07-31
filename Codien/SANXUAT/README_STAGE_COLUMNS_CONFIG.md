# Cấu hình Cột cho Các Công đoạn Sản xuất

## Tổng quan

File `stage-columns-config.js` chứa định nghĩa các cột cần thiết cho từng công đoạn sản xuất. Việc tách riêng file này giúp:

- **Tăng tính linh hoạt**: Dễ dàng thêm/sửa/xóa cột mà không cần sửa `server.js`
- **Dễ bảo trì**: Tập trung cấu hình cột vào một nơi
- **Tái sử dụng**: Có thể sử dụng trong cả server và client

## Cấu trúc File

### 1. Các cột cơ bản (`BASE_COLUMNS`)
```javascript
const BASE_COLUMNS = [
  'id', 'production_order', 'po_number', 'customer_name', 'product_name',
  'order_quantity', 'deployed_quantity', 'required_quantity',
  'work_stage', 'status', 'deployment_date', 'created_at', 'updated_at'
];
```

### 2. Các cột theo công đoạn (`STAGE_COLUMNS`)
```javascript
const STAGE_COLUMNS = {
  'xa': [ /* cột cho công đoạn xả */ ],
  'xen': [ /* cột cho công đoạn xén */ ],
  'in_offset': [ /* cột cho công đoạn in offset */ ],
  // ... các công đoạn khác
};
```

## Các Hàm Hỗ Trợ

### `getColumnsForStage(stage, customColumns)`
Lấy danh sách cột cho một công đoạn cụ thể.

**Tham số:**
- `stage` (string): Tên công đoạn (xa, xen, in_offset, boi, be, dan_may, kho)
- `customColumns` (string, tùy chọn): Chuỗi cột tùy chỉnh, phân cách bằng dấu phẩy

**Ví dụ:**
```javascript
// Lấy cột cho công đoạn xa
const xaColumns = getColumnsForStage('xa');

// Lấy cột cho công đoạn xen + cột tùy chỉnh
const xenColumns = getColumnsForStage('xen', 'custom_field1,custom_field2');
```

### `isValidStage(stage)`
Kiểm tra xem một công đoạn có tồn tại không.

**Ví dụ:**
```javascript
if (isValidStage('xa')) {
  console.log('Công đoạn xa hợp lệ');
}
```

### `getAvailableStages()`
Lấy danh sách tất cả các công đoạn có sẵn.

**Ví dụ:**
```javascript
const stages = getAvailableStages(); // ['xa', 'xen', 'in_offset', ...]
```

### `getAllAvailableColumns()`
Lấy danh sách tất cả các cột có sẵn.

## Cách Sử Dụng

### 1. Trong Server (Node.js)
```javascript
const { getColumnsForStage, isValidStage } = require('./stage-columns-config');

// Trong API endpoint
app.get('/data/production_orders/optimized', (req, res) => {
  const { stage, columns } = req.query;
  
  if (stage && isValidStage(stage)) {
    const selectedColumns = getColumnsForStage(stage, columns);
    // Sử dụng selectedColumns để tạo query
  }
});
```

### 2. Trong Client (Browser)
```html
<script src="stage-columns-config.js"></script>
<script>
  // Sử dụng global object
  const columns = StageColumnsConfig.getColumnsForStage('xa');
  
  // Hoặc sử dụng ES6 modules (nếu được hỗ trợ)
  import { getColumnsForStage } from './stage-columns-config.js';
</script>
```

## Thêm Công đoạn Mới

Để thêm một công đoạn mới:

1. **Thêm định nghĩa cột vào `STAGE_COLUMNS`:**
```javascript
const STAGE_COLUMNS = {
  // ... các công đoạn hiện có
  'new_stage': [
    'new_stage_input_quantity', 'new_stage_output_quantity',
    'new_stage_good_quantity', 'new_stage_ng_quantity',
    'new_stage_status', 'new_stage_start_time', 'new_stage_end_time',
    'new_stage_worker_name', 'new_stage_note'
  ]
};
```

2. **Không cần sửa `server.js`** - API sẽ tự động nhận diện công đoạn mới.

## Thêm Cột Mới

Để thêm cột mới cho một công đoạn:

1. **Chỉnh sửa `STAGE_COLUMNS` trong file cấu hình**
2. **Không cần restart server** - thay đổi sẽ có hiệu lực ngay lập tức

## Lợi ích

### Trước khi tách file:
- Phải sửa `server.js` mỗi khi thêm/sửa cột
- Code dài và khó đọc
- Khó tái sử dụng

### Sau khi tách file:
- ✅ Chỉ cần sửa file cấu hình
- ✅ Code sạch và dễ đọc
- ✅ Có thể sử dụng ở cả server và client
- ✅ Dễ dàng mở rộng và bảo trì

## API Endpoints Sử Dụng

### `/data/production_orders/optimized`
- **Tham số `stage`**: Chỉ định công đoạn (xa, xen, in_offset, boi, be, dan_may, kho)
- **Tham số `columns`**: Cột tùy chỉnh (tùy chọn)
- **Tham số `days_back`**: Số ngày lùi lại (mặc định: 30)

**Ví dụ:**
```
GET /data/production_orders/optimized?stage=xa&days_back=300
GET /data/production_orders/optimized?stage=xen&columns=custom_field1,custom_field2
```

## Tương thích Ngược

Các API cũ vẫn hoạt động bình thường:
- `/data/production_orders/xa-stage` → redirect đến `/data/production_orders/optimized?stage=xa`
- `/data/production_orders/xen-stage` → redirect đến `/data/production_orders/optimized?stage=xen` 