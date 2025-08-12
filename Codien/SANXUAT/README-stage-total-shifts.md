# Thay đổi từ `total_shifts` thành `${stage}_total_shifts`

## Tổng quan
Đã cập nhật hệ thống để sử dụng trường `${stage}_total_shifts` thay vì `total_shifts` chung. Điều này cho phép mỗi giai đoạn sản xuất có dữ liệu ca kíp riêng biệt.

## Thay đổi Database

### Trường mới được thêm vào bảng `production_orders`:
- `xen_total_shifts` - Lưu trữ thông tin ca kíp của giai đoạn Xén
- `xa_total_shifts` - Lưu trữ thông tin ca kíp của giai đoạn Xả  
- `in_offset_total_shifts` - Lưu trữ thông tin ca kíp của giai đoạn In Offset
- `boi_total_shifts` - Lưu trữ thông tin ca kíp của giai đoạn Bồi
- `dan_total_shifts` - Lưu trữ thông tin ca kíp của giai đoạn Dán
- `kho_total_shifts` - Lưu trữ thông tin ca kíp của giai đoạn Kho

### Chạy script SQL:
```sql
-- Chạy file: add_stage_total_shifts_fields.sql
```

## Thay đổi Backend (server.js)

### API Endpoint: `POST /data/production_orders/:id/end_shift`
- **Trước**: Sử dụng trường `total_shifts` chung
- **Sau**: Sử dụng trường `${stage}_total_shifts` tương ứng với giai đoạn

### Các thay đổi chính:
1. **Query SELECT**: Thay đổi từ `total_shifts` thành `${stage}_total_shifts`
2. **Query UPDATE**: Thay đổi từ `total_shifts = ?` thành `${stage}_total_shifts = ?`
3. **Error messages**: Cập nhật để hiển thị tên trường chính xác
4. **Response**: Thêm thông tin `stage` vào response

## Thay đổi Frontend (xen-stage.html)

### Hàm `endShift()`:
- Sử dụng `const stageTotalShiftsField = \`${STAGE_CONFIG.KEY}_total_shifts\``
- Cập nhật dữ liệu local với trường tương ứng

### Hàm `generateShiftsList()`:
- Sử dụng `const stageTotalShiftsField = \`${STAGE_CONFIG.KEY}_total_shifts\``
- Parse và hiển thị dữ liệu từ trường tương ứng

## Lợi ích của thay đổi

1. **Tách biệt dữ liệu**: Mỗi giai đoạn có dữ liệu ca kíp riêng
2. **Dễ quản lý**: Không bị trộn lẫn dữ liệu giữa các giai đoạn
3. **Hiệu suất**: Truy vấn nhanh hơn với index riêng cho từng giai đoạn
4. **Mở rộng**: Dễ dàng thêm giai đoạn mới trong tương lai

## Cấu trúc dữ liệu JSON

Mỗi trường `${stage}_total_shifts` chứa mảng JSON với cấu trúc:
```json
[
  {
    "shift_number": 1,
    "stage": "xen",
    "worker_name": "Nguyễn Văn A",
    "machine_name": "Máy Xén 01",
    "shift": "Ca Sáng",
    "good_quantity": 100,
    "ng_quantity": 5,
    "ng_start_end_quantity": 2,
    "return_quantity": 1,
    "handover_quantity": 92,
    "total_quantity": 108,
    "notes": "Ca kíp hoàn thành tốt",
    "start_time": "2024-01-15T08:00:00.000Z",
    "end_time": "2024-01-15T16:00:00.000Z",
    "created_at": "2024-01-15T16:00:00.000Z"
  }
]
```

## Migration từ dữ liệu cũ

Nếu có dữ liệu cũ trong trường `total_shifts`, có thể cần script migration để chuyển đổi dữ liệu sang trường mới tương ứng.

## Testing

1. Chạy script SQL để cập nhật database
2. Test API endpoint `/data/production_orders/:id/end_shift`
3. Test frontend để đảm bảo hiển thị đúng dữ liệu ca kíp
4. Test với các giai đoạn khác nhau (xen, xa, in_offset, etc.)

