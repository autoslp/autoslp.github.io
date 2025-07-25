<?php
require_once 'config.php';

$method = $_SERVER['REQUEST_METHOD'];

try {
    switch($method) {
        case 'GET':
            if (isset($_GET['id'])) {
                // Lấy chi tiết một điều hòa
                $stmt = $pdo->prepare("SELECT * FROM air_conditioners WHERE id = ?");
                $stmt->execute([$_GET['id']]);
                $result = $stmt->fetch();
                
                if ($result) {
                    // Lấy lịch sử công việc của điều hòa này
                    $stmt2 = $pdo->prepare("
                        SELECT wh.*, c.name as contractor_name 
                        FROM air_work_history wh 
                        LEFT JOIN air_contractors c ON wh.contractor_id = c.id 
                        WHERE wh.ac_id = ? 
                        ORDER BY wh.work_date DESC
                    ");
                    $stmt2->execute([$_GET['id']]);
                    $workHistory = $stmt2->fetchAll();
                    
                    // Parse JSON fields
                    foreach ($workHistory as &$work) {
                        $work['documents'] = json_decode($work['documents'] ?? '[]', true);
                        $work['images_before'] = json_decode($work['images_before'] ?? '[]', true);
                        $work['images_during'] = json_decode($work['images_during'] ?? '[]', true);
                        $work['images_after'] = json_decode($work['images_after'] ?? '[]', true);
                    }
                    
                    $result['work_history'] = $workHistory;
                    echo json_encode($result);
                } else {
                    http_response_code(404);
                    echo json_encode(['error' => 'Air conditioner not found']);
                }
            } else {
                // Lấy danh sách tất cả điều hòa với thống kê
                $stmt = $pdo->query("
                    SELECT 
                        ac.*,
                        COUNT(wh.id) as total_works,
                        SUM(CASE WHEN wh.type = 'maintenance' THEN 1 ELSE 0 END) as maintenance_count,
                        SUM(CASE WHEN wh.type = 'repair' THEN 1 ELSE 0 END) as repair_count,
                        SUM(CASE WHEN wh.type = 'inspection' THEN 1 ELSE 0 END) as inspection_count,
                        SUM(CASE WHEN wh.type = 'cleaning' THEN 1 ELSE 0 END) as cleaning_count,
                        SUM(CASE WHEN wh.type = 'replacement' THEN 1 ELSE 0 END) as replacement_count,
                        SUM(wh.cost) as total_cost,
                        AVG(wh.cost) as avg_cost,
                        MAX(wh.work_date) as last_work_date,
                        c.name as last_contractor_name
                    FROM air_conditioners ac
                    LEFT JOIN air_work_history wh ON ac.id = wh.ac_id
                    LEFT JOIN air_contractors c ON wh.contractor_id = c.id AND wh.work_date = (
                        SELECT MAX(work_date) FROM air_work_history WHERE ac_id = ac.id
                    )
                    GROUP BY ac.id
                    ORDER BY ac.code
                ");
                $result = $stmt->fetchAll();
                echo json_encode($result);
            }
            break;
            
        case 'POST':
            // Thêm điều hòa mới
            $data = json_decode(file_get_contents('php://input'), true);
            
            $stmt = $pdo->prepare("
                INSERT INTO air_conditioners 
                (code, type, area, location, capacity, brand, install_date, warranty_date, status, next_maintenance, notes) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ");
            
            $stmt->execute([
                $data['code'],
                $data['type'],
                $data['area'],
                $data['location'],
                $data['capacity'],
                $data['brand'],
                $data['install_date'],
                $data['warranty_date'],
                $data['status'] ?? 'good',
                $data['next_maintenance'],
                $data['notes']
            ]);
            
            echo json_encode(['success' => true, 'id' => $pdo->lastInsertId()]);
            break;
            
        case 'PUT':
            // Cập nhật điều hòa
            if (!isset($_GET['id'])) {
                http_response_code(400);
                echo json_encode(['error' => 'ID is required']);
                break;
            }
            
            $data = json_decode(file_get_contents('php://input'), true);
            
            $stmt = $pdo->prepare("
                UPDATE air_conditioners 
                SET code=?, type=?, area=?, location=?, capacity=?, brand=?, 
                    install_date=?, warranty_date=?, status=?, next_maintenance=?, notes=?,
                    updated_at=NOW()
                WHERE id=?
            ");
            
            $stmt->execute([
                $data['code'],
                $data['type'],
                $data['area'],
                $data['location'],
                $data['capacity'],
                $data['brand'],
                $data['install_date'],
                $data['warranty_date'],
                $data['status'],
                $data['next_maintenance'],
                $data['notes'],
                $_GET['id']
            ]);
            
            echo json_encode(['success' => true]);
            break;
            
        case 'DELETE':
            // Xóa điều hòa
            if (!isset($_GET['id'])) {
                http_response_code(400);
                echo json_encode(['error' => 'ID is required']);
                break;
            }
            
            $stmt = $pdo->prepare("DELETE FROM air_conditioners WHERE id = ?");
            $stmt->execute([$_GET['id']]);
            
            echo json_encode(['success' => true]);
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
