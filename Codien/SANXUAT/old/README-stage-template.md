# Stage Template System - Hệ thống Template cho các Công đoạn Sản xuất

## Tổng quan

Hệ thống Stage Template được thiết kế để quản lý tất cả các trang công đoạn sản xuất từ 1 template duy nhất, giúp đồng bộ giao diện, chức năng và dễ dàng bảo trì.

## Cấu trúc File

```
SANXUAT/
├── stage-template.html        # Template chính cho tất cả stage
├── stage-config.js           # Cấu hình cho từng stage
├── stage-generator.js        # Script tạo file từ template  
├── stage-generator-demo.html # Demo interface để test
├── stage-xa.html            # File được tạo cho công đoạn XẢ
├── stage-xen.html           # File được tạo cho công đoạn XÉN
└── ...                      # Các file stage khác
```

## Các Phương án Đồng bộ (chỉ dữ liệu bảng thay đổi)

### 🎯 Phương án 1: Single Page Application (SPA)
**File:** `single-page-app.html`
- **1 file duy nhất** cho tất cả stage
- JavaScript Router chuyển đổi giữa các trang
- Template được clone động cho từng stage
- **Ưu điểm:** 
  - Sidebar cố định, không reload
  - Chuyển trang mượt mà
  - API/localStorage fallback
- **Nhược điểm:** JavaScript phức tạp hơn

### 🎯 Phương án 2: Dynamic Component với JSON
**File:** `dynamic-config.js` + `single-page-app.html`
- Cấu hình hoàn toàn bằng JSON
- **CHỈ thay đổi config bảng**, còn lại giống hệt nhau
- Tự động generate giao diện từ config
- **Ưu điểm:**
  - Dễ thêm stage mới nhất
  - Không cần biết HTML/CSS
  - Chỉ sửa JSON config
- **Nhược điểm:** Cần hiểu cấu trúc JSON

### 🎯 Phương án 3: Server-Side Rendering (PHP)
**File:** `stage-renderer.php` + `stage-config.json`
- Server PHP tạo HTML từ config
- URL: `stage.php?s=xa`, `stage.php?s=xen`
- **Ưu điểm:**
  - SEO friendly
  - Server-side caching
  - Shared layout tuyệt đối
- **Nhược điểm:** Cần server PHP

### 🎯 Phương án 4: CSS-only với Data Attributes
**File:** `universal-stage.html`
- **1 file HTML** cho tất cả stage
- CSS hide/show cột theo `data-stage` attribute
- URL: `universal-stage.html?stage=xa`
- **Ưu điểm:**
  - Đơn giản nhất
  - Không cần JavaScript phức tạp
  - Perfect cho beginners
- **Nhược điểm:** HTML hơi dài (chứa tất cả cột)

## So sánh các Phương án

| Phương án | Số File | Độ phức tạp | Thêm Stage | SEO | Performance |
|-----------|---------|-------------|------------|-----|-------------|
| **SPA** | 1 | ⭐⭐⭐ | Config JS | ❌ | ⭐⭐⭐⭐ |
| **JSON Config** | 1 | ⭐⭐ | Chỉ sửa JSON | ❌ | ⭐⭐⭐⭐ |
| **PHP Render** | 1 + PHP | ⭐⭐⭐⭐ | Config JSON | ✅ | ⭐⭐⭐⭐⭐ |
| **CSS-only** | 1 | ⭐ | Thêm HTML+CSS | ✅ | ⭐⭐⭐ |
| **Template (cũ)** | 7+ | ⭐⭐⭐⭐⭐ | Tạo file mới | ✅ | ⭐⭐ |

## Khuyến nghị

### 🏆 **Cho Beginner:** CSS-only Solution
```html
<!-- Chỉ cần thay đổi data-stage -->
<body data-stage="xa">   <!-- XẢ -->
<body data-stage="xen">  <!-- XÉN -->
<body data-stage="in">   <!-- IN -->
```

### 🏆 **Cho Advanced:** Dynamic JSON Config
```javascript
// Chỉ cần sửa file dynamic-config.js
stages: {
  new_stage: {
    title: "Công đoạn MỚI",
    table: {
      columns: [
        { key: "date", label: "Ngày", width: "100px" },
        { key: "newField", label: "Trường mới", width: "120px" }
      ]
    }
  }
}
```

### 🏆 **Cho Production:** PHP Server-Side
- Caching tốt nhất
- SEO optimization
- Server-side validation

## Ưu điểm Chung của Tất cả Phương án

### ✅ Thống nhất giao diện
- Sidebar menu giống hệt nhau trên tất cả trang
- CSS/JavaScript chia sẻ chung
- Responsive design nhất quán
- Bootstrap 5.3.0 chuẩn

### ✅ Dễ bảo trì
- Sửa 1 lần → áp dụng cho tất cả stage
- **CHỈ dữ liệu bảng khác nhau**, layout giống hệt
- Không cần copy/paste code giữa các file

### ✅ Linh hoạt cấu hình
- Mỗi stage có cấu hình riêng về:
  - Loại máy móc
  - Cột bảng dữ liệu
  - Form nhập liệu
  - Dữ liệu mẫu

### ✅ API chuẩn hóa
- Endpoint thống nhất: `work_history.php?stage={stage_code}`
- Cấu trúc request/response nhất quán
- Fallback localStorage khi API lỗi

## Cách sử dụng

### 1. Chỉnh sửa cấu hình stage

Mở file `stage-config.js` và chỉnh sửa cấu hình cho stage cần thiết:

```javascript
window.STAGE_CONFIG = {
  xa: {
    name: 'XẢ',
    icon: 'bi-bullseye', 
    description: 'Xả giấy cuộn - Quản lý chi tiết',
    machines: ['Xả'],
    tableColumns: [
      { field: 'date', label: 'Ngày SX', width: '100px' },
      { field: 'shift', label: 'Ca', width: '80px' },
      // ... thêm cột khác
    ],
    formFields: [
      { field: 'productionDate', label: 'Ngày sản xuất', type: 'date', required: true },
      // ... thêm field khác  
    ],
    quantityFields: [
      { field: 'goodQty', label: 'Số lượng đạt', type: 'number', required: true },
      // ... thêm field khác
    ],
    sampleData: [
      // Dữ liệu mẫu cho stage này
    ]
  }
};
```

### 2. Tạo file stage mới

#### Cách 1: Sử dụng Demo Interface
1. Mở file `stage-generator-demo.html` trong browser
2. Chọn stage cần tạo từ dropdown
3. Click "Tạo file" hoặc "Tạo tất cả"
4. File sẽ được download tự động

#### Cách 2: Sử dụng JavaScript Console
```javascript
// Tạo file cho 1 stage
await stageGenerator.generateStageFile('xa');

// Tạo tất cả file stage  
await stageGenerator.generateAllStages();
```

### 3. Đồng bộ sidebar menu

Tất cả file stage đã được đồng bộ sidebar menu theo chuẩn:

```html
<nav class="sidebar-nav">
  <a href="dashboard.html" class="nav-link">
    <i class="bi bi-house"></i>
    <span class="nav-text">Trang chủ</span>
  </a>
  <a href="production-orders.html" class="nav-link">
    <i class="bi bi-clipboard-data"></i>
    <span class="nav-text">Lệnh sản xuất</span>
  </a>
  <!-- ... các menu khác -->
</nav>
```

## Cấu hình Stage mới

Để thêm stage mới, thêm vào `stage-config.js`:

```javascript
// Công đoạn MỚI
new_stage: {
  name: 'TÊN CÔNG ĐOẠN',
  icon: 'bi-icon-name',
  description: 'Mô tả công đoạn',
  machines: ['Máy 1', 'Máy 2'],
  tableColumns: [
    { field: 'fieldName', label: 'Tên hiển thị', width: '100px' },
    { field: 'quantity', label: 'Số lượng', width: '100px', 
      format: (val) => `<span class="quantity-display">${val || 0}</span>` }
  ],
  formFields: [
    { field: 'inputName', label: 'Label', type: 'text', required: true },
    { field: 'selectField', label: 'Dropdown', type: 'select', 
      options: ['Option 1', 'Option 2'], required: true }
  ],
  quantityFields: [
    { field: 'qty', label: 'Số lượng', type: 'number', required: true },
    { field: 'note', label: 'Ghi chú', type: 'textarea', rows: 3 }
  ],
  sampleData: [
    {
      orderCode: 'LSX001',
      date: new Date().toISOString().split('T')[0],
      // ... dữ liệu mẫu
    }
  ]
}
```

## Field Types hỗ trợ

| Type | Mô tả | Ví dụ |
|------|-------|-------|
| `text` | Input text | `<input type="text">` |
| `number` | Input số | `<input type="number">` |
| `date` | Input ngày | `<input type="date">` |
| `select` | Dropdown | `<select><option>...</option></select>` |
| `textarea` | Text area | `<textarea rows="3"></textarea>` |

## API Endpoints

Mỗi stage sẽ gọi API với pattern:

```
GET  /api/work_history.php?action=get_orders&stage={stage_code}
POST /api/work_history.php
{
  "action": "save_order|update_quantity|delete_order",
  "stage": "{stage_code}",
  "data": {...}
}
```

## Troubleshooting

### Sidebar menu không hiển thị đúng
- Kiểm tra class `active` trong nav-link
- Đảm bảo icon Bootstrap đúng format

### Bảng không hiển thị dữ liệu  
- Kiểm tra cấu hình `tableColumns` trong config
- Đảm bảo field name khớp với dữ liệu

### Form không lưu được
- Kiểm tra cấu hình `formFields` 
- Đảm bảo field `required` được đánh dấu đúng

### API không hoạt động
- Hệ thống sẽ fallback về localStorage
- Kiểm tra endpoint API có đúng không

## Kết luận

Hệ thống Stage Template giúp:
- **Đồng bộ** giao diện giữa tất cả trang
- **Dễ bảo trì** với 1 template duy nhất  
- **Linh hoạt** cấu hình cho từng công đoạn
- **Chuẩn hóa** API và cấu trúc dữ liệu
- **Nhanh chóng** tạo trang mới chỉ bằng cấu hình

Thay vì duy trì 7 file HTML riêng biệt, chỉ cần 1 template + file cấu hình!
