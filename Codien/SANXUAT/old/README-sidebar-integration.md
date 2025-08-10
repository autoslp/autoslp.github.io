# Tích Hợp Sidebar Với API Calls - XẢ Stage

## Tổng Quan

Đã cải thiện các function `startProduction()`, `endProduction()`, và `executeHandover()` trong file `xa-stage.html` để đảm bảo chúng lấy giá trị trực tiếp từ phần "Thông tin sản xuất" trong sidebar thay vì sử dụng giá trị mặc định cứng.

## Các Thay Đổi Đã Thực Hiện

### 1. Function `startProduction()`

**Trước:**
```javascript
const worker = getElementValue('worker') || '';
const notes = getElementValue('note') || '';
```

**Sau:**
```javascript
// Lấy thông tin từ form trong sidebar
const machine = getElementValue('machine') || '';
const shift = getElementValue('shift') || '';
const worker = getElementValue('worker') || '';
const notes = getElementValue('note') || '';

// Log để debug
console.log('🔍 Lấy giá trị từ sidebar:');
console.log('  machine:', machine);
console.log('  shift:', shift);
console.log('  worker:', worker);
console.log('  notes:', notes);

// Validation cơ bản
if (!worker.trim()) {
    showNotification('⚠️ Vui lòng nhập tên thợ phụ trách trong phần "Thông tin sản xuất"', 'warning');
    return;
}
```

### 2. Function `endProduction()`

**Trước:**
```javascript
const machine = getElementValue('machine') || 'Xả 1';
const shift = getElementValue('shift') || 'Ca 1';
const worker = getElementValue('worker') || '';
const notes = getElementValue('note') || '';
```

**Sau:**
```javascript
// Lấy thông tin từ form trong sidebar
const machine = getElementValue('machine') || '';
const shift = getElementValue('shift') || '';
const worker = getElementValue('worker') || '';
const notes = getElementValue('note') || '';

// Log để debug
console.log('🔍 Lấy giá trị từ sidebar (end production):');
console.log('  goodQty:', goodQty);
console.log('  ngQty:', ngQty);
console.log('  machine:', machine);
console.log('  shift:', shift);
console.log('  worker:', worker);
console.log('  notes:', notes);

// Validation cơ bản
if (!worker.trim()) {
    showNotification('⚠️ Vui lòng nhập tên thợ phụ trách trong phần "Thông tin sản xuất"', 'warning');
    return;
}
```

### 3. Function `executeHandover()`

**Trước:**
```javascript
const productionData = {
    machine: getElementValue('machine'),
    shift: getElementValue('shift'),
    workerName: getElementValue('worker'),
    notes: getElementValue('note')
};
```

**Sau:**
```javascript
// Lấy dữ liệu kết quả sản xuất từ sidebar
const productionData = {
    goodQuantity: parseInt(getElementValue('goodQty')) || 0,
    ngQuantity: parseInt(getElementValue('ngQty')) || 0,
    ngStartEndQuantity: parseInt(getElementValue('ngStartEndQty')) || 0,
    returnQuantity: parseInt(getElementValue('returnQty')) || 0,
    machine: getElementValue('machine') || '',
    shift: getElementValue('shift') || '',
    workerName: getElementValue('worker') || '',
    notes: getElementValue('note') || ''
};

// Log để debug
console.log('🔍 Lấy giá trị từ sidebar (handover):');
console.log('  productionData:', productionData);

// Validation cơ bản
if (!productionData.workerName.trim()) {
    showNotification('⚠️ Vui lòng nhập tên thợ phụ trách trong phần "Thông tin sản xuất"', 'warning');
    return;
}
```

## Các Form Elements Trong Sidebar

Các function sử dụng các form elements sau từ phần "Thông tin sản xuất":

| ID | Type | Label | Mô tả |
|---|---|---|---|
| `machine` | select | Máy sản xuất | Chọn máy Xả 1, Xả 2, Xả 3 |
| `shift` | select | Ca sản xuất | Chọn Ca 1, Ca 2, Ca 3 |
| `worker` | input | Thợ phụ trách | Nhập tên thợ (bắt buộc) |
| `note` | textarea | Ghi chú sản xuất | Ghi chú về quá trình sản xuất |
| `goodQty` | input | Số lượng OK | Số lượng sản phẩm đạt chuẩn |
| `ngQty` | input | Số lượng NG | Số lượng sản phẩm không đạt chuẩn |

## Validation

- **Tên thợ phụ trách (Input)**: Bắt buộc phải nhập. Nếu trống sẽ hiển thị cảnh báo và không thực hiện API call.
- **Máy sản xuất (Dropdown)**: Bắt buộc phải chọn. Nếu chưa chọn sẽ hiển thị cảnh báo và không thực hiện API call.
- **Ca sản xuất (Dropdown)**: Bắt buộc phải chọn. Nếu chưa chọn sẽ hiển thị cảnh báo và không thực hiện API call.
- **Ghi chú (Textarea)**: Có thể để trống, sẽ sử dụng giá trị mặc định.
- **Số lượng OK/NG (Input)**: Có thể để trống, sẽ sử dụng giá trị 0.

## Debugging

Đã thêm logging chi tiết để debug:

1. **Console logs**: Hiển thị tất cả giá trị được lấy từ sidebar
2. **Validation messages**: Thông báo rõ ràng khi thiếu thông tin bắt buộc
3. **API request logs**: Log dữ liệu gửi lên API

## File Test

Đã tạo file `test-sidebar-values.html` để test việc lấy giá trị từ sidebar:

- Mô phỏng giao diện sidebar với các form elements
- Function test để kiểm tra việc lấy giá trị
- Hiển thị kết quả và validation warnings

## Cách Sử Dụng

1. **Mở file `xa-stage.html`**
2. **Chọn một lệnh sản xuất** để mở sidebar
3. **Điền thông tin** trong phần "Thông tin sản xuất":
   - **Chọn máy sản xuất** (bắt buộc): Xả 1, Xả 2, Xả 3
   - **Chọn ca sản xuất** (bắt buộc): Ca 1, Ca 2, Ca 3
   - **Nhập tên thợ phụ trách** (bắt buộc): Tên người thợ
   - Nhập ghi chú (tùy chọn): Ghi chú về quá trình sản xuất
4. **Click các nút chức năng**:
   - "Bắt đầu" → `startProduction()`
   - "Kết thúc" → `endProduction()`
   - "Cập nhật & Chuyển giao" → `executeHandover()`

## Lưu Ý

- Tất cả giá trị sẽ được lấy trực tiếp từ sidebar, không còn sử dụng giá trị mặc định cứng
- Nếu chưa nhập tên thợ phụ trách, hệ thống sẽ hiển thị cảnh báo và không thực hiện API call
- Có thể sử dụng file `test-sidebar-values.html` để test việc lấy giá trị trước khi sử dụng chức năng chính

## Debugging Dropdown

### Vấn đề đã phát hiện:
- Dropdown không có option mặc định (placeholder)
- Có thể dropdown không có giá trị được chọn khi chưa có dữ liệu từ database

### Giải pháp đã áp dụng:
1. **Thêm option placeholder**: `-- Chọn máy --` và `-- Chọn ca --`
2. **Cải thiện function `getElementValue()`**: Thêm logging chi tiết cho dropdown
3. **Thêm debug khi mở sidebar**: Tự động log thông tin dropdown sau khi sidebar được render
4. **Tạo file test debug**: `test-dropdown-debug.html` để test chi tiết

### Cách debug:
1. Mở Developer Tools (F12)
2. Chọn một lệnh sản xuất để mở sidebar
3. Kiểm tra console logs để xem thông tin dropdown
4. Sử dụng file `test-dropdown-debug.html` để test riêng dropdown 