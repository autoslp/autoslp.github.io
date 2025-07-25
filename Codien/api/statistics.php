<?php
require_once 'config.php';

$method = $_SERVER['REQUEST_METHOD'];

try {
    switch($method) {
        case 'GET':
            // Lấy thống kê tổng quan
            $stats = [];
            
            // Thống kê điều hòa theo trạng thái
            $stmt = $pdo->query("
                SELECT 
                    status,
                    COUNT(*) as count
                FROM air_conditioners 
                GROUP BY status
            ");
            $acStats = $stmt->fetchAll();
            $stats['ac_by_status'] = array_column($acStats, 'count', 'status');
            
            // Thống kê công việc theo loại
            $stmt = $pdo->query("
                SELECT 
                    type,
                    COUNT(*) as count,
                    SUM(cost) as total_cost,
                    AVG(cost) as avg_cost
                FROM air_work_history 
                GROUP BY type
            ");
            $workStats = $stmt->fetchAll();
            $stats['work_by_type'] = $workStats;
            
            // Thống kê công việc theo tháng (6 tháng gần nhất)
            $stmt = $pdo->query("
                SELECT 
                    YEAR(work_date) as year,
                    MONTH(work_date) as month,
                    COUNT(*) as count,
                    SUM(cost) as total_cost
                FROM air_work_history 
                WHERE work_date >= DATE_SUB(NOW(), INTERVAL 6 MONTH)
                GROUP BY YEAR(work_date), MONTH(work_date)
                ORDER BY year DESC, month DESC
            ");
            $monthlyStats = $stmt->fetchAll();
            $stats['monthly_works'] = $monthlyStats;
            
            // Nhà thầu có rating cao nhất
            $stmt = $pdo->query("
                SELECT * FROM air_contractors 
                WHERE is_active = 1 
                ORDER BY rating DESC 
                LIMIT 5
            ");
            $topContractors = $stmt->fetchAll();
            $stats['top_contractors'] = $topContractors;
            
            // Điều hòa cần bảo dưỡng sắp tới
            $stmt = $pdo->query("
                SELECT 
                    code,
                    location,
                    area,
                    next_maintenance,
                    DATEDIFF(next_maintenance, CURDATE()) as days_until,
                    status,
                    CASE 
                        WHEN DATEDIFF(next_maintenance, CURDATE()) <= 0 THEN 'Quá hạn'
                        WHEN DATEDIFF(next_maintenance, CURDATE()) <= 7 THEN 'Khẩn cấp'
                        WHEN DATEDIFF(next_maintenance, CURDATE()) <= 30 THEN 'Sắp đến'
                        ELSE 'Bình thường'
                    END as priority
                FROM air_conditioners
                WHERE next_maintenance >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
                ORDER BY next_maintenance ASC
                LIMIT 10
            ");
            $upcomingMaintenance = $stmt->fetchAll();
            $stats['upcoming_maintenance'] = $upcomingMaintenance;
            
            // Tổng số liệu
            $stmt = $pdo->query("SELECT COUNT(*) as total FROM air_conditioners");
            $stats['total_acs'] = $stmt->fetch()['total'];
            
            $stmt = $pdo->query("SELECT COUNT(*) as total FROM air_work_history");
            $stats['total_works'] = $stmt->fetch()['total'];
            
            $stmt = $pdo->query("SELECT COUNT(*) as total FROM air_contractors WHERE is_active = 1");
            $stats['total_contractors'] = $stmt->fetch()['total'];
            
            $stmt = $pdo->query("SELECT SUM(cost) as total FROM air_work_history WHERE YEAR(work_date) = YEAR(NOW())");
            $stats['total_cost_this_year'] = $stmt->fetch()['total'] ?? 0;
            
            echo json_encode($stats);
            break;
            
        default:
            http_response_code(405);
            echo json_encode(['error' => 'Method not allowed']);
            break;
    }
} catch(Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
?>
