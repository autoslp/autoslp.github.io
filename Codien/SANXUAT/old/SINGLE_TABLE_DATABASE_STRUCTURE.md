# Cấu trúc Database - 1 Bảng Duy Nhất

## Bảng `production_orders` - Tất cả dữ liệu trong 1 bảng

### ✅ **Ưu điểm của cách tiếp cận 1 bảng:**
1. **Đơn giản**: Dễ hiểu, dễ quản lý
2. **Hiệu suất**: Không cần JOIN phức tạp
3. **Dễ backup/restore**: Chỉ 1 bảng duy nhất
4. **API đơn giản**: 1 endpoint cho tất cả dữ liệu
5. **Phù hợp với quy mô nhỏ-vừa**: < 1 triệu records

### 📊 **Cấu trúc trường dữ liệu:**

#### **1. Thông tin cơ bản (giữ nguyên)**
- `id`, `deployment_date`, `production_order`, `po_number`
- `customer_code`, `customer_name`, `product_name`
- `order_quantity`, `deployed_quantity`, etc.

#### **2. Workflow Management (MỚI)**
```sql
workflow_definition        TEXT        -- 'xa,xen,in,boi,be,dan,kho'
current_stage             VARCHAR(10)  -- 'xa', 'xen', 'in', etc.
current_stage_index       INT          -- 0, 1, 2, etc.
stage_progress            TEXT         -- JSON format
```

#### **3. Production Details (MỚI)**
```sql
production_date          DATE         -- Ngày sản xuất
production_shift         VARCHAR(10)  -- 'Ca 1', 'Ca 2', 'Ca 3'
assigned_machine         VARCHAR(50)  -- Máy được gán
worker_name             VARCHAR(100)  -- Tên thợ phụ trách
```

#### **4. Stage Timing (MỚI)**
```sql
stage_start_time        TIME         -- Giờ bắt đầu stage
stage_end_time          TIME         -- Giờ kết thúc stage
stage_note              TEXT         -- Ghi chú stage
```

#### **5. Stage Quantities (MỚI)**
```sql
stage_input_quantity     INT         -- SL đầu vào stage hiện tại
stage_output_quantity    INT         -- SL đầu ra stage hiện tại
stage_good_quantity      INT         -- SL đạt stage hiện tại
stage_ng_quantity        INT         -- SL NG stage hiện tại
stage_ng_start_end_quantity INT      -- SL NG đầu/cuối (XẢ, XÉN)
stage_return_quantity    INT         -- SL tồn trả (XẢ, XÉN)
```

#### **6. Stage-specific Fields (MỚI)**

**XẢ (Xả giấy):**
```sql
xa_paper_sheets         INT          -- Số phôi
xa_sheet_length         DECIMAL(10,2) -- Dài phôi
xa_sheet_width          DECIMAL(10,2) -- Rộng phôi
xa_rounds              INT          -- Lượt
xa_required_quantity    INT          -- SL yêu cầu
```

**XÉN (Xén giấy):**
```sql
xen_cut_length         DECIMAL(10,2) -- Khổ cắt dài
xen_cut_width          DECIMAL(10,2) -- Khổ cắt rộng
xen_sheets_per_piece   INT          -- Số phôi/tờ
xen_total_sheets       INT          -- Tổng số tờ
```

**IN (In ấn):**
```sql
in_ink_type           VARCHAR(100)  -- Loại mực
in_print_speed        INT          -- Tốc độ in
```

**BỒI (Bồi giấy):**
```sql
boi_glue_type         VARCHAR(100)  -- Loại keo
boi_layer_count       INT          -- Số lớp
```

**BẾ (Bế hộp):**
```sql
be_die_type           VARCHAR(100)  -- Loại dao bế
be_complexity         VARCHAR(50)   -- Độ phức tạp
```

**DÁN (Dán hộp):**
```sql
dan_glue_type         VARCHAR(100)  -- Loại keo dán
dan_dry_time          INT          -- Thời gian khô (phút)
```

**KHO (Kho thành phẩm):**
```sql
kho_storage_location  VARCHAR(100)  -- Vị trí lưu kho
kho_package_type      VARCHAR(100)  -- Loại đóng gói
```

#### **7. Workflow Progress Tracking (MỚI)**
```sql
workflow_started_at    DATETIME     -- Thời gian bắt đầu workflow
workflow_completed_at  DATETIME     -- Thời gian hoàn thành workflow
total_good_quantity   INT          -- Tổng SL đạt toàn bộ workflow
total_ng_quantity     INT          -- Tổng SL NG toàn bộ workflow
workflow_efficiency   DECIMAL(5,2) -- Hiệu suất workflow (%)
```

### 📈 **Views được tạo:**

1. **`production_workflow_status`** - Trạng thái workflow chi tiết
2. **`stage_dashboard_stats`** - Thống kê theo stage
3. **`machine_utilization_stats`** - Thống kê theo máy
4. **`production_orders_stats`** - Thống kê tổng quan
5. **`customer_orders_stats`** - Thống kê theo khách hàng
6. **`monthly_orders_stats`** - Thống kê theo tháng

### 🔍 **Indexes được tối ưu:**

```sql
INDEX idx_current_stage (current_stage)
INDEX idx_workflow_definition (workflow_definition(100))
INDEX idx_production_date (production_date)
INDEX idx_production_shift (production_shift)
INDEX idx_assigned_machine (assigned_machine)
```

### 📝 **Ví dụ sử dụng:**

#### **1. Lấy tất cả orders đang ở stage XẢ:**
```sql
SELECT * FROM production_orders 
WHERE current_stage = 'xa' AND status = 'Đang sản xuất';
```

#### **2. Lấy workflow status chi tiết:**
```sql
SELECT * FROM production_workflow_status 
WHERE progress_percentage < 100;
```

#### **3. Thống kê hiệu suất theo stage:**
```sql
SELECT * FROM stage_dashboard_stats 
ORDER BY good_rate_percentage DESC;
```

#### **4. Cập nhật stage progress:**
```sql
UPDATE production_orders 
SET 
    stage_good_quantity = 950,
    stage_ng_quantity = 50,
    current_stage = 'xen',
    current_stage_index = 1,
    stage_progress = '{"xa":{"status":"completed","goodQty":950,"ngQty":50},"xen":{"status":"in_progress","inputQty":950}}'
WHERE id = 1;
```

### 🚀 **Khi nào nên chuyển sang nhiều bảng:**

1. **Dữ liệu > 1 triệu records**
2. **Cần lưu lịch sử chi tiết từng stage**
3. **Nhiều user đồng thời (> 100 concurrent)**
4. **Cần phân tích phức tạp theo thời gian**

### 💡 **Kết luận:**

Cách tiếp cận **1 bảng duy nhất** phù hợp cho:
- ✅ Hệ thống nhỏ-vừa (< 50,000 orders/năm)
- ✅ Đội phát triển nhỏ
- ✅ Cần deploy nhanh
- ✅ Ít phức tạp về business logic
- ✅ Dễ bảo trì và backup

Đây là lựa chọn **tối ưu** cho giai đoạn đầu phát triển hệ thống!
