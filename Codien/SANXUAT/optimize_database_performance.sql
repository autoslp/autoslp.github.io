-- =================================================================
-- TỐI ƯU DATABASE PERFORMANCE CHO PRODUCTION_ORDERS
-- =================================================================
-- File này chứa các lệnh SQL để tối ưu hiệu suất database
-- Chạy các lệnh này để cải thiện tốc độ truy vấn

-- 1. Tạo indexes cho các cột thường được query
-- =================================================================

-- Index cho deployment_date (filter theo ngày)
CREATE INDEX idx_production_orders_deployment_date 
ON production_orders(deployment_date);

-- Index cho status (filter theo trạng thái)
CREATE INDEX idx_production_orders_status 
ON production_orders(status);

-- Index cho customer_name (filter và search)
CREATE INDEX idx_production_orders_customer_name 
ON production_orders(customer_name);

-- Index cho production_order (search)
CREATE INDEX idx_production_orders_production_order 
ON production_orders(production_order);

-- Index cho po_number (search)
CREATE INDEX idx_production_orders_po_number 
ON production_orders(po_number);

-- Index cho product_name (search)
CREATE INDEX idx_production_orders_product_name 
ON production_orders(product_name);

-- Index cho created_at (sắp xếp)
CREATE INDEX idx_production_orders_created_at 
ON production_orders(created_at DESC);

-- Index cho work_stage (filter theo công đoạn)
CREATE INDEX idx_production_orders_work_stage 
ON production_orders(work_stage);

-- 2. Composite indexes cho các query phức tạp
-- =================================================================

-- Index cho filter deployment_date + status
CREATE INDEX idx_production_orders_deployment_status 
ON production_orders(deployment_date, status);

-- Index cho search multiple columns
CREATE INDEX idx_production_orders_search 
ON production_orders(production_order, po_number, product_name, customer_name);

-- Index cho xa-stage specific columns
CREATE INDEX idx_production_orders_xa_stage 
ON production_orders(xa_status, xa_input_quantity, xa_output_quantity);

-- Index cho xen-stage specific columns
CREATE INDEX idx_production_orders_xen_stage 
ON production_orders(xen_status, xen_input_quantity, xen_output_quantity);

-- 3. Partial indexes cho dữ liệu gần đây
-- =================================================================

-- Index cho orders trong 30 ngày gần nhất
CREATE INDEX idx_production_orders_recent_30_days 
ON production_orders(deployment_date, created_at) 
WHERE deployment_date >= DATE_SUB(CURDATE(), INTERVAL 30 DAY);

-- Index cho orders đang hoạt động
CREATE INDEX idx_production_orders_active 
ON production_orders(status, work_stage) 
WHERE status IN ('Chờ triển khai', 'Đang sản xuất', 'Hoàn thành');

-- 4. Analyze table để cập nhật thống kê
-- =================================================================

-- Cập nhật thống kê cho optimizer
ANALYZE TABLE production_orders;

-- 5. Kiểm tra hiệu suất indexes
-- =================================================================

-- Xem tất cả indexes hiện tại
SHOW INDEX FROM production_orders;

-- Kiểm tra kích thước indexes
SELECT 
    table_name,
    index_name,
    ROUND(stat_value * @@innodb_page_size / 1024 / 1024, 2) AS size_mb
FROM mysql.innodb_index_stats 
WHERE table_name = 'production_orders' 
AND stat_name = 'size';

-- 6. Query để test performance
-- =================================================================

-- Test query cho xa-stage (nên sử dụng index)
EXPLAIN SELECT 
    id, production_order, po_number, customer_name, product_name,
    order_quantity, deployed_quantity, required_quantity,
    xa_input_quantity, xa_output_quantity, xa_good_quantity, xa_ng_quantity,
    xa_status, xa_start_time, xa_end_time, xa_worker_name, xa_note,
    xen_input_quantity, xen_output_quantity, xen_good_quantity, xen_ng_quantity,
    xen_status, xen_start_time, xen_end_time, xen_worker_name, xen_note,
    work_stage, status, deployment_date, created_at, updated_at
FROM production_orders 
WHERE (deployment_date >= DATE_SUB(CURDATE(), INTERVAL 30 DAY) OR deployment_date IS NULL)
ORDER BY created_at DESC 
LIMIT 500;

-- Test query cho search
EXPLAIN SELECT * FROM production_orders 
WHERE (production_order LIKE '%PO%' OR po_number LIKE '%PO%' OR product_name LIKE '%PO%' OR customer_name LIKE '%PO%')
AND deployment_date >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
ORDER BY created_at DESC 
LIMIT 100;

-- 7. Monitoring queries
-- =================================================================

-- Xem slow queries (nếu có)
-- SHOW PROCESSLIST;

-- Xem thống kê truy vấn
-- SELECT * FROM performance_schema.events_statements_summary_by_digest 
-- WHERE SCHEMA_NAME = 'autoslp' 
-- ORDER BY COUNT_STAR DESC 
-- LIMIT 10;

-- 8. Cleanup (nếu cần xóa indexes)
-- =================================================================
-- DROP INDEX idx_production_orders_deployment_date ON production_orders;
-- DROP INDEX idx_production_orders_status ON production_orders;
-- DROP INDEX idx_production_orders_customer_name ON production_orders;
-- DROP INDEX idx_production_orders_production_order ON production_orders;
-- DROP INDEX idx_production_orders_po_number ON production_orders;
-- DROP INDEX idx_production_orders_product_name ON production_orders;
-- DROP INDEX idx_production_orders_created_at ON production_orders;
-- DROP INDEX idx_production_orders_work_stage ON production_orders;
-- DROP INDEX idx_production_orders_deployment_status ON production_orders;
-- DROP INDEX idx_production_orders_search ON production_orders;
-- DROP INDEX idx_production_orders_xa_stage ON production_orders;
-- DROP INDEX idx_production_orders_xen_stage ON production_orders;
-- DROP INDEX idx_production_orders_recent_30_days ON production_orders;
-- DROP INDEX idx_production_orders_active ON production_orders; 