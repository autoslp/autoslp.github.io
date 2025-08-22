-- Bổ sung các trường thiếu cho tất cả các công đoạn dựa trên cấu trúc của công đoạn xén
-- Các trường cần bổ sung: ng_start_end_quantity, return_quantity, handover_quantity

-- 1. Bổ sung cho công đoạn xả (xa)
ALTER TABLE `production_orders` 
ADD COLUMN `xa_ng_start_end_quantity` INT DEFAULT 0 COMMENT 'Số lượng NG đầu cuối công đoạn xả',
ADD COLUMN `xa_return_quantity` INT DEFAULT 0 COMMENT 'Số lượng trả lại công đoạn xả',
ADD COLUMN `xa_handover_quantity` INT DEFAULT 0 COMMENT 'Số lượng bàn giao công đoạn xả';

-- 2. Bổ sung cho công đoạn in offset (in_offset)
ALTER TABLE `production_orders` 
ADD COLUMN `in_offset_ng_start_end_quantity` INT DEFAULT 0 COMMENT 'Số lượng NG đầu cuối công đoạn in offset',
ADD COLUMN `in_offset_return_quantity` INT DEFAULT 0 COMMENT 'Số lượng trả lại công đoạn in offset',
ADD COLUMN `in_offset_handover_quantity` INT DEFAULT 0 COMMENT 'Số lượng bàn giao công đoạn in offset';

-- 3. Bổ sung cho công đoạn xén tạo (xen_toa)
ALTER TABLE `production_orders` 
ADD COLUMN `xen_toa_ng_start_end_quantity` INT DEFAULT 0 COMMENT 'Số lượng NG đầu cuối công đoạn xén tạo',
ADD COLUMN `xen_toa_return_quantity` INT DEFAULT 0 COMMENT 'Số lượng trả lại công đoạn xén tạo',
ADD COLUMN `xen_toa_handover_quantity` INT DEFAULT 0 COMMENT 'Số lượng bàn giao công đoạn xén tạo';

-- 4. Bổ sung cho công đoạn KCS đầu vào (kcs_in)
ALTER TABLE `production_orders` 
ADD COLUMN `kcs_in_ng_start_end_quantity` INT DEFAULT 0 COMMENT 'Số lượng NG đầu cuối công đoạn KCS đầu vào',
ADD COLUMN `kcs_in_return_quantity` INT DEFAULT 0 COMMENT 'Số lượng trả lại công đoạn KCS đầu vào',
ADD COLUMN `kcs_in_handover_quantity` INT DEFAULT 0 COMMENT 'Số lượng bàn giao công đoạn KCS đầu vào';

-- 5. Bổ sung cho công đoạn KCS sau in (kcs_sau_in)
ALTER TABLE `production_orders` 
ADD COLUMN `kcs_sau_in_ng_start_end_quantity` INT DEFAULT 0 COMMENT 'Số lượng NG đầu cuối công đoạn KCS sau in',
ADD COLUMN `kcs_sau_in_return_quantity` INT DEFAULT 0 COMMENT 'Số lượng trả lại công đoạn KCS sau in',
ADD COLUMN `kcs_sau_in_handover_quantity` INT DEFAULT 0 COMMENT 'Số lượng bàn giao công đoạn KCS sau in';

-- 6. Bổ sung cho công đoạn lạng (lang)
ALTER TABLE `production_orders` 
ADD COLUMN `lang_ng_start_end_quantity` INT DEFAULT 0 COMMENT 'Số lượng NG đầu cuối công đoạn lạng',
ADD COLUMN `lang_return_quantity` INT DEFAULT 0 COMMENT 'Số lượng trả lại công đoạn lạng',
ADD COLUMN `lang_handover_quantity` INT DEFAULT 0 COMMENT 'Số lượng bàn giao công đoạn lạng';

-- 7. Bổ sung cho công đoạn in lưới (in_luoi)
ALTER TABLE `production_orders` 
ADD COLUMN `in_luoi_ng_start_end_quantity` INT DEFAULT 0 COMMENT 'Số lượng NG đầu cuối công đoạn in lưới',
ADD COLUMN `in_luoi_return_quantity` INT DEFAULT 0 COMMENT 'Số lượng trả lại công đoạn in lưới',
ADD COLUMN `in_luoi_handover_quantity` INT DEFAULT 0 COMMENT 'Số lượng bàn giao công đoạn in lưới';

-- 8. Bổ sung cho công đoạn bồi (boi)
ALTER TABLE `production_orders` 
ADD COLUMN `boi_ng_start_end_quantity` INT DEFAULT 0 COMMENT 'Số lượng NG đầu cuối công đoạn bồi',
ADD COLUMN `boi_return_quantity` INT DEFAULT 0 COMMENT 'Số lượng trả lại công đoạn bồi',
ADD COLUMN `boi_handover_quantity` INT DEFAULT 0 COMMENT 'Số lượng bàn giao công đoạn bồi';

-- 9. Bổ sung cho công đoạn bế (be)
ALTER TABLE `production_orders` 
ADD COLUMN `be_ng_start_end_quantity` INT DEFAULT 0 COMMENT 'Số lượng NG đầu cuối công đoạn bế',
ADD COLUMN `be_return_quantity` INT DEFAULT 0 COMMENT 'Số lượng trả lại công đoạn bế',
ADD COLUMN `be_handover_quantity` INT DEFAULT 0 COMMENT 'Số lượng bàn giao công đoạn bế';

-- 10. Bổ sung cho công đoạn bóc lẻ (boc_le)
ALTER TABLE `production_orders` 
ADD COLUMN `boc_le_ng_start_end_quantity` INT DEFAULT 0 COMMENT 'Số lượng NG đầu cuối công đoạn bóc lẻ',
ADD COLUMN `boc_le_return_quantity` INT DEFAULT 0 COMMENT 'Số lượng trả lại công đoạn bóc lẻ',
ADD COLUMN `boc_le_handover_quantity` INT DEFAULT 0 COMMENT 'Số lượng bàn giao công đoạn bóc lẻ';

-- 11. Bổ sung cho công đoạn dán 3M (dan_3m)
ALTER TABLE `production_orders` 
ADD COLUMN `dan_3m_ng_start_end_quantity` INT DEFAULT 0 COMMENT 'Số lượng NG đầu cuối công đoạn dán 3M',
ADD COLUMN `dan_3m_return_quantity` INT DEFAULT 0 COMMENT 'Số lượng trả lại công đoạn dán 3M',
ADD COLUMN `dan_3m_handover_quantity` INT DEFAULT 0 COMMENT 'Số lượng bàn giao công đoạn dán 3M';

-- 12. Bổ sung cho công đoạn dán máy (dan_may)
ALTER TABLE `production_orders` 
ADD COLUMN `dan_may_ng_start_end_quantity` INT DEFAULT 0 COMMENT 'Số lượng NG đầu cuối công đoạn dán máy',
ADD COLUMN `dan_may_return_quantity` INT DEFAULT 0 COMMENT 'Số lượng trả lại công đoạn dán máy',
ADD COLUMN `dan_may_handover_quantity` INT DEFAULT 0 COMMENT 'Số lượng bàn giao công đoạn dán máy';

-- 13. Bổ sung cho công đoạn hoàn thiện (hoan_thien)
ALTER TABLE `production_orders` 
ADD COLUMN `hoan_thien_ng_start_end_quantity` INT DEFAULT 0 COMMENT 'Số lượng NG đầu cuối công đoạn hoàn thiện',
ADD COLUMN `hoan_thien_return_quantity` INT DEFAULT 0 COMMENT 'Số lượng trả lại công đoạn hoàn thiện',
ADD COLUMN `hoan_thien_handover_quantity` INT DEFAULT 0 COMMENT 'Số lượng bàn giao công đoạn hoàn thiện';

-- 14. Bổ sung cho công đoạn ghìm (ghim)
ALTER TABLE `production_orders` 
ADD COLUMN `ghim_ng_start_end_quantity` INT DEFAULT 0 COMMENT 'Số lượng NG đầu cuối công đoạn ghìm',
ADD COLUMN `ghim_return_quantity` INT DEFAULT 0 COMMENT 'Số lượng trả lại công đoạn ghìm',
ADD COLUMN `ghim_handover_quantity` INT DEFAULT 0 COMMENT 'Số lượng bàn giao công đoạn ghìm';

-- 15. Bổ sung cho công đoạn gấp (gap)
ALTER TABLE `production_orders` 
ADD COLUMN `gap_ng_start_end_quantity` INT DEFAULT 0 COMMENT 'Số lượng NG đầu cuối công đoạn gấp',
ADD COLUMN `gap_return_quantity` INT DEFAULT 0 COMMENT 'Số lượng trả lại công đoạn gấp',
ADD COLUMN `gap_handover_quantity` INT DEFAULT 0 COMMENT 'Số lượng bàn giao công đoạn gấp';

-- 16. Bổ sung cho công đoạn nhập kho (nhap_kho)
ALTER TABLE `production_orders` 
ADD COLUMN `nhap_kho_ng_start_end_quantity` INT DEFAULT 0 COMMENT 'Số lượng NG đầu cuối công đoạn nhập kho',
ADD COLUMN `nhap_kho_return_quantity` INT DEFAULT 0 COMMENT 'Số lượng trả lại công đoạn nhập kho',
ADD COLUMN `nhap_kho_handover_quantity` INT DEFAULT 0 COMMENT 'Số lượng bàn giao công đoạn nhập kho';

-- Kiểm tra kết quả
SELECT 
    'xa' as stage,
    COUNT(*) as record_count
FROM information_schema.columns 
WHERE table_name = 'production_orders' 
AND column_name LIKE 'xa_%_quantity'
UNION ALL
SELECT 
    'in_offset' as stage,
    COUNT(*) as record_count
FROM information_schema.columns 
WHERE table_name = 'production_orders' 
AND column_name LIKE 'in_offset_%_quantity'
UNION ALL
SELECT 
    'xen' as stage,
    COUNT(*) as record_count
FROM information_schema.columns 
WHERE table_name = 'production_orders' 
AND column_name LIKE 'xen_%_quantity'
ORDER BY stage; 