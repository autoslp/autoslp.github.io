# Hướng Dẫn Sử Dụng Nút "Xử Lý"

## Tổng Quan
Chức năng nút "Xử lý" đã được cải thiện để điền tên đăng nhập vào cột U (Người làm chính) trong Google Sheet.

## Các Cải Tiến Đã Thực Hiện

### 1. Cải thiện hàm `assignMainWorker()`
- **Kiểm tra đăng nhập**: Hiển thị thông báo nếu chưa đăng nhập
- **Cập nhật UI ngay lập tức**: Nút chuyển thành "Đã nhận" ngay khi nhấn
- **Thông báo thành công**: Hiển thị alert khi nhận công việc thành công
- **Xử lý lỗi**: Khôi phục trạng thái nút nếu có lỗi
- **Refresh dữ liệu**: Tự động refresh danh sách sau khi cập nhật

### 2. Cải thiện hiển thị
- **Badge thông tin**: Hiển thị badge "Đã nhận: [Tên]" khi đã có người xử lý
- **Ẩn nút hợp lý**: Nút "Xử lý" chỉ hiển thị khi chưa có người nhận

### 3. Tính năng mới
- **Log chi tiết**: Ghi log các hoạt động trong console
- **Thông báo real-time**: Hiển thị thông báo ngay lập tức
- **Xử lý lỗi tốt hơn**: Có cơ chế khôi phục khi có lỗi

## Cách Sử Dụng

### 1. Đăng nhập
```javascript
// Lưu tên đăng nhập vào localStorage
localStorage.setItem('slp_name', 'Nguyễn Văn A');
```

### 2. Nhấn nút "Xử lý"
- Nút sẽ chuyển thành "Đã nhận" ngay lập tức
- Tên đăng nhập sẽ được điền vào cột U (Người làm chính)
- Hiển thị thông báo thành công
- Tự động refresh danh sách sau 1 giây

### 3. Kiểm tra kết quả
- Cột U trong Google Sheet sẽ được cập nhật với tên đăng nhập
- Badge "Đã nhận: [Tên]" sẽ hiển thị thay vì nút "Xử lý"

## Cấu Trúc Code

### Hàm chính: `assignMainWorker(stt)`
```javascript
function assignMainWorker(stt) {
  const userName = localStorage.getItem('slp_name') || '';
  
  // Kiểm tra đăng nhập
  if (!userName) {
    alert('Vui lòng đăng nhập trước khi thực hiện!');
    return;
  }
  
  // Cập nhật dữ liệu local
  work.thuchienboy1 = userName;
  
  // Cập nhật UI ngay lập tức
  button.innerHTML = '<i class="bi bi-check-circle me-1"></i>Đã nhận';
  button.disabled = true;
  
  // Gửi dữ liệu lên Google Sheet
  // Cột U: Người làm chính
  formData.append('column', 'U');
  formData.append('value', userName);
}
```

### Hiển thị nút
```javascript
${!thuchienboy1Val ? `
  <button class="btn btn-success btn-action" onclick="assignMainWorker('${work.stt}')">
    <i class="bi bi-person-check me-1"></i>Xử lý
  </button>
` : `
  <span class="badge bg-success me-2">
    <i class="bi bi-person-check me-1"></i>Đã nhận: ${thuchienboy1Val}
  </span>
`}
```

## Test Chức Năng

### File test: `test-xuly.html`
- Mở file `test-xuly.html` để test chức năng
- Có thể thay đổi tên đăng nhập và test
- Hiển thị log chi tiết các hoạt động

### Cách test:
1. Mở `test-xuly.html` trong trình duyệt
2. Nhấn "Đăng nhập test" hoặc thay đổi tên
3. Nhấn nút "Xử lý" để test
4. Xem log để kiểm tra quá trình

## Lưu Ý Quan Trọng

### 1. API Google Apps Script
- URL API: `https://script.google.com/macros/s/AKfycbxmgvV8TAly8s-nfArMBkN--yC_3Axio4vHI1vnr1MSPFcJNXL9KBXnNywZ-WGAT1TH/exec`
- Method: POST
- Data: FormData với stt, column, value

### 2. Cột Google Sheet
- **Cột U**: Người làm chính (thuchienboy1)
- **Cột V**: Người làm phụ 1 (thuchienboy2)
- **Cột W**: Người làm phụ 2 (thuchienboy3)

### 3. Xử lý lỗi
- Nếu chưa đăng nhập: Hiển thị thông báo
- Nếu đã có người xử lý: Hiển thị thông báo
- Nếu lỗi API: Khôi phục trạng thái nút

## Troubleshooting

### Vấn đề thường gặp:
1. **Không cập nhật được**: Kiểm tra kết nối internet và API
2. **Nút không ẩn**: Refresh trang hoặc kiểm tra localStorage
3. **Lỗi CORS**: API đã được cấu hình để tránh CORS

### Debug:
- Mở Developer Tools (F12)
- Xem tab Console để kiểm tra log
- Kiểm tra Network tab để xem API calls

### Test API:
1. Mở file `test-api.html` để test API trực tiếp
2. Kiểm tra log để xem response từ server
3. Đảm bảo API URL đúng và hoạt động

### Các bước debug:
1. **Kiểm tra Console**: Xem log chi tiết khi nhấn nút "Xử lý"
2. **Test API**: Sử dụng `test-api.html` để test API độc lập
3. **Kiểm tra Network**: Xem request/response trong tab Network
4. **Kiểm tra Google Sheet**: Xem dữ liệu có được cập nhật không

## Cập Nhật Tương Lai

### Có thể cải thiện thêm:
1. **Thông báo real-time**: Sử dụng WebSocket
2. **Lịch sử hoạt động**: Lưu log chi tiết hơn
3. **Phân quyền**: Kiểm tra quyền người dùng
4. **Backup dữ liệu**: Tự động backup khi có lỗi 