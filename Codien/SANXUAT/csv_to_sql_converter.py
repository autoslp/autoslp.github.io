#!/usr/bin/env python
# -*- coding: utf-8 -*-
import csv
import codecs
import re
import os
import random
from datetime import datetime, timedelta

# Đường dẫn tới file CSV và file output
input_file = 'data.csv'
output_file = 'full_sample_production_orders.sql'

# Chuyển đổi định dạng ngày từ dd/mm/yyyy sang yyyy-mm-dd cho SQL
def format_date(date_str):
    if not date_str or date_str == '-':
        return 'NULL'
    try:
        date_obj = datetime.strptime(date_str.strip(), '%d/%m/%Y')
        return f"'{date_obj.strftime('%Y-%m-%d')}'"
    except:
        return 'NULL'

# Xử lý chuỗi để tránh lỗi SQL injection và lỗi cú pháp
def format_string(s):
    if s is None or s == '' or s == '-':
        return 'NULL'
    # Thay thế dấu nháy đơn bằng hai dấu nháy đơn
    s = s.replace("'", "''")
    return f"'{s}'"

# Hàm xử lý số
def format_number(n):
    if n is None or n == '' or n == '-':
        return 'NULL'
    # Loại bỏ dấu phẩy, dấu chấm, dấu phần trăm và các ký tự không phải số
    n = re.sub(r'[^\d.-]', '', n)
    if n == '':
        return 'NULL'
    return n

# Đọc dữ liệu từ file CSV
data_rows = []
try:
    with codecs.open(input_file, 'r', encoding='utf-8') as file:
        reader = csv.reader(file)
        for row in reader:
            if len(row) > 20:  # Đảm bảo hàng có đủ dữ liệu
                data_rows.append(row)
except Exception as e:
    print(f"Lỗi khi đọc file CSV: {e}")
    # Nếu không đọc được file, tạo dữ liệu giả
    data_rows = []

# Số lệnh INSERT cần tạo
num_inserts = 500

# Tạo câu lệnh INSERT SQL
sql = """-- Script tự động tạo 500 lệnh INSERT cho bảng production_orders
-- Sử dụng dữ liệu từ file CSV thực tế
-- Thời gian tạo: {datetime}

-- Tạo bảng nếu chưa tồn tại
CREATE TABLE IF NOT EXISTS production_orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    deployment_date DATE,
    production_order VARCHAR(20),
    po_number VARCHAR(20),
    sales_order_code VARCHAR(50),
    order_date DATE,
    delivery_date DATE,
    internal_product_code VARCHAR(50),
    order_type VARCHAR(20),
    customer_code VARCHAR(20),
    customer_name VARCHAR(100),
    product_name VARCHAR(255),
    version VARCHAR(10),
    not_deployed_reason TEXT,
    sales_note TEXT,
    customer_production_note TEXT,
    order_quantity VARCHAR(20),
    inventory VARCHAR(20),
    required_quantity VARCHAR(20),
    deployed_quantity VARCHAR(20),
    offset_waste VARCHAR(20),
    waste VARCHAR(20),
    sheet_count VARCHAR(20),
    product_length VARCHAR(20),
    product_width VARCHAR(20),
    product_height VARCHAR(20),
    paper_length VARCHAR(20),
    paper_width VARCHAR(20),
    part_count VARCHAR(10),
    color_count VARCHAR(20),
    customer_group VARCHAR(50),
    paper_type VARCHAR(100),
    paper_weight VARCHAR(10),
    work_stage VARCHAR(100),
    status VARCHAR(20) DEFAULT 'Chờ triển khai'
);

-- Xóa dữ liệu cũ nếu cần
-- TRUNCATE TABLE production_orders;

-- 500 lệnh INSERT được tạo từ dữ liệu CSV thực tế
INSERT INTO production_orders (
    deployment_date, production_order, po_number, sales_order_code, order_date, delivery_date,
    internal_product_code, order_type, customer_code, customer_name, product_name, version,
    not_deployed_reason, sales_note, customer_production_note, order_quantity, inventory,
    required_quantity, deployed_quantity, offset_waste, waste, sheet_count, product_length,
    product_width, product_height, paper_length, paper_width, part_count, color_count,
    customer_group, paper_type, paper_weight, work_stage, status
) VALUES
""".format(datetime=datetime.now().strftime('%Y-%m-%d %H:%M:%S'))

# Trạng thái sản xuất
statuses = ['Chờ triển khai', 'Đang sản xuất', 'Hoàn thành', 'Tạm dừng']

# Tạo các câu lệnh INSERT
for i in range(num_inserts):
    # Nếu có dữ liệu, lấy một hàng ngẫu nhiên từ dữ liệu thực
    if data_rows:
        row = random.choice(data_rows)
        
        # Nếu dòng không đủ số cột, bổ sung thêm
        while len(row) < 34:
            row.append('')
        
        deployment_date = format_date(row[0])
        production_order = format_string(row[1])
        po_number = format_string(row[2])
        sales_order_code = format_string(row[3])
        order_date = format_date(row[4])
        delivery_date = format_date(row[5])
        internal_product_code = format_string(row[6])
        order_type = format_string(row[7]) if row[7] else "'Thường'"
        customer_code = format_string(row[8])
        customer_name = format_string(row[9])
        product_name = format_string(row[10])
        version = format_string(row[11])
        not_deployed_reason = format_string(row[12])
        sales_note = format_string(row[13])
        customer_production_note = format_string(row[14])
        order_quantity = format_number(row[15])
        inventory = format_number(row[16])
        required_quantity = format_number(row[17])
        deployed_quantity = format_number(row[18])
        offset_waste = format_number(row[19])
        waste = format_string(row[20])
        sheet_count = format_number(row[21])
        product_length = format_number(row[22])
        product_width = format_number(row[23])
        product_height = format_number(row[24])
        paper_length = format_number(row[25])
        paper_width = format_number(row[26])
        part_count = format_number(row[27])
        color_count = format_string(row[28])
        customer_group = format_string(row[29])
        paper_type = format_string(row[30])
        paper_weight = format_number(row[31])
        work_stage = format_string(row[32])
        status = f"'{random.choice(statuses)}'"
    else:
        # Nếu không có dữ liệu, tạo dữ liệu giả
        current_date = datetime.now()
        random_days = random.randint(0, 30)
        deployment_date = f"'{(current_date + timedelta(days=random_days)).strftime('%Y-%m-%d')}'"
        production_order = f"'01-{current_date.strftime('%y%m')}-{i+1:05d}'"
        po_number = f"'{current_date.strftime('%y.%m')}.{random.randint(1, 999):03d}.{random.randint(1, 99):02d}'"
        sales_order_code = f"'SLM-{random.randint(1, 999):05d}ABC-{random.randint(1, 10):02d}'"
        order_date = f"'{(current_date - timedelta(days=random.randint(0, 7))).strftime('%Y-%m-%d')}'"
        delivery_date = f"'{(current_date + timedelta(days=random.randint(5, 30))).strftime('%Y-%m-%d')}'"
        internal_product_code = f"'SLM-{random.randint(1, 999):05d}ABC-{random.randint(1, 10):02d}-{random.randint(1, 20)}b'"
        order_types = ['Thường', 'Khẩn', 'Mẫu', 'Gia công', 'Đại trà', 'Bù']
        order_type = f"'{random.choice(order_types)}'"
        customer_code = f"'{random.randint(1000000, 9999999)}'"
        customer_names = ['Công ty TNHH Dược phẩm Mekophar', 'Công ty CP Dược Traphaco', 
                          'Công ty TNHH Unilever Việt Nam', 'Công ty CP Dược phẩm Pharmavina', 
                          'Công ty CP Sữa Việt Nam', 'Công ty CP Dược Hậu Giang']
        customer_name = f"'{random.choice(customer_names)}'"
        product_types = ['Hộp', 'Toa', 'Vỏ hộp', 'Nhãn', 'Tem']
        product_names = ['thuốc', 'kem đánh răng', 'sữa', 'bánh', 'nước giải khát']
        product_name = f"'{random.choice(product_types)} {random.choice(product_names)} {random.choice(['cao cấp', 'thường', 'đặc biệt', 'xuất khẩu'])}'"
        version = f"'{random.randint(1, 10)}'"
        not_deployed_reason = 'NULL'
        sales_note = f"'Như lô gần nhất'"
        customer_production_note = f"'Hàng không được thiếu số lượng - Cần {random.randint(1, 10)} bộ mẫu'"
        order_quantity = str(random.randint(1000, 100000))
        inventory = str(random.randint(0, 2000))
        required_quantity = str(int(order_quantity) - int(inventory))
        deployed_quantity = str(int(required_quantity) + random.randint(500, 5000))
        offset_waste = str(random.randint(100, 500))
        waste = f"'{random.randint(1, 100)}.00%'"
        sheet_count = str(random.randint(500, 10000))
        product_length = str(random.randint(30, 300))
        product_width = str(random.randint(20, 200))
        product_height = str(random.randint(0, 200))
        paper_length = str(random.randint(500, 1000))
        paper_width = str(random.randint(-700, -400))
        part_count = str(random.randint(1, 30))
        color_counts = ['1/1 trở nó', '4/4 trở nó', '5', '4', '1/2 trở khác', '5/5 trở nó']
        color_count = f"'{random.choice(color_counts)}'"
        customer_groups = ['VIP', 'Nhóm 1', 'Nhóm 2', 'Nhóm 3', 'Nhóm 4', 'Thường', 'Chiến lược', 'Mới']
        customer_group = f"'{random.choice(customer_groups)}'"
        paper_types = ['Ivory NingBo', 'Duplex Hanson', 'Couches TQ - Nivea', 'Ivory ChenMing', 
                       'Couches TQ - Hikote', 'Bãi Bằng (GI)', 'Duplex Nhật']
        paper_type = f"'{random.choice(paper_types)}'"
        paper_weight = str(random.randint(80, 400))
        work_stages = ['Xả-Xén-In-Láng-Bế-Dán-Đóng Thùng', 'Xả-Xén-In-Láng-Bế', 'Xả-Xén-In-Dán']
        work_stage = f"'{random.choice(work_stages)}'"
        status = f"'{random.choice(statuses)}'"
    
    # Tạo câu lệnh VALUES
    sql_values = f"""(
    {deployment_date}, {production_order}, {po_number}, {sales_order_code}, {order_date}, {delivery_date},
    {internal_product_code}, {order_type}, {customer_code}, {customer_name}, {product_name}, {version},
    {not_deployed_reason}, {sales_note}, {customer_production_note}, {order_quantity}, {inventory},
    {required_quantity}, {deployed_quantity}, {offset_waste}, {waste}, {sheet_count}, {product_length},
    {product_width}, {product_height}, {paper_length}, {paper_width}, {part_count}, {color_count},
    {customer_group}, {paper_type}, {paper_weight}, {work_stage}, {status}
)"""
    
    # Thêm dấu phẩy vào cuối trừ lệnh cuối cùng
    if i < num_inserts - 1:
        sql_values += ","
    
    sql += sql_values + "\n"

sql += ";\n\nCOMMIT;\n"

# Thêm thông tin hướng dẫn
sql += """
/*
Lệnh SQL này sẽ tạo 500 lệnh INSERT dựa trên dữ liệu CSV thực tế.
Các giá trị đã được định dạng phù hợp với cấu trúc bảng production_orders.
Có thể chạy trực tiếp trong MySQL/MariaDB để nhập liệu.
*/
"""

# Ghi vào file SQL
try:
    with codecs.open(output_file, 'w', encoding='utf-8') as file:
        file.write(sql)
    print(f"Đã tạo thành công file {output_file} với {num_inserts} lệnh INSERT.")
except Exception as e:
    print(f"Lỗi khi ghi file SQL: {e}") 