<?php
require_once 'config.php';

$method = $_SERVER['REQUEST_METHOD'];

try {
    switch($method) {
        case 'GET':
            if (isset($_GET['id'])) {
                // Lấy chi tiết một công việc
                $stmt = $pdo->prepare("
                    SELECT 
                        wh.*,
                        ac.code as ac_code,
                        ac.location as ac_location,
                        ac.area as ac_area,
                        c.name as contractor_name,
                        c.phone as contractor_phone,
                        c.rating as contractor_rating
                    FROM air_work_history wh
                    INNER JOIN air_conditioners ac ON wh.ac_id = ac.id
                    LEFT JOIN air_contractors c ON wh.contractor_id = c.id
                    WHERE wh.id = ?
                ");
                $stmt->execute([$_GET['id']]);
                $result = $stmt->fetch();
                
                if ($result) {
                    // Parse JSON fields
                    $result['documents'] = json_decode($result['documents'] ?? '[]', true);
                    $result['images_before'] = json_decode($result['images_before'] ?? '[]', true);
                    $result['images_during'] = json_decode($result['images_during'] ?? '[]', true);
                    $result['images_after'] = json_decode($result['images_after'] ?? '[]', true);
                    
                    echo json_encode($result);
                } else {
                    http_response_code(404);
                    echo json_encode(['error' => 'Work history not found']);
                }
            } else {
                // Lấy danh sách tất cả công việc
                $stmt = $pdo->query("
                    SELECT 
                        wh.*,
                        ac.code as ac_code,
                        ac.location as ac_location,
                        ac.area as ac_area,
                        c.name as contractor_name,
                        c.phone as contractor_phone,
                        c.rating as contractor_rating,
                        JSON_LENGTH(wh.documents) as document_count,
                        JSON_LENGTH(wh.images_before) as before_image_count,
                        JSON_LENGTH(wh.images_during) as during_image_count,
                        JSON_LENGTH(wh.images_after) as after_image_count,
                        (JSON_LENGTH(IFNULL(wh.images_before, '[]')) + 
                         JSON_LENGTH(IFNULL(wh.images_during, '[]')) + 
                         JSON_LENGTH(IFNULL(wh.images_after, '[]'))) as total_image_count
                    FROM air_work_history wh
                    INNER JOIN air_conditioners ac ON wh.ac_id = ac.id
                    LEFT JOIN air_contractors c ON wh.contractor_id = c.id
                    ORDER BY wh.work_date DESC
                ");
                $result = $stmt->fetchAll();
                
                // Parse JSON fields for all records
                foreach ($result as &$work) {
                    $work['documents'] = json_decode($work['documents'] ?? '[]', true);
                    $work['images_before'] = json_decode($work['images_before'] ?? '[]', true);
                    $work['images_during'] = json_decode($work['images_during'] ?? '[]', true);
                    $work['images_after'] = json_decode($work['images_after'] ?? '[]', true);
                }
                
                echo json_encode($result);
            }
            break;
            
        case 'POST':
            // Thêm công việc mới
            $data = json_decode(file_get_contents('php://input'), true);
            
            $stmt = $pdo->prepare("
                INSERT INTO air_work_history 
                (ac_id, contractor_id, work_date, type, description, worker_name, cost, warranty, status, notes, documents, images_before, images_during, images_after) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ");
            
            $stmt->execute([
                $data['ac_id'],
                $data['contractor_id'] ?? null,
                $data['work_date'],
                $data['type'],
                $data['description'],
                $data['worker_name'],
                $data['cost'] ?? 0,
                $data['warranty'] ?? '',
                $data['status'] ?? 'pending',
                $data['notes'] ?? '',
                json_encode($data['documents'] ?? []),
                json_encode($data['images_before'] ?? []),
                json_encode($data['images_during'] ?? []),
                json_encode($data['images_after'] ?? [])
            ]);
            
            echo json_encode(['success' => true, 'id' => $pdo->lastInsertId()]);
            break;
            
        case 'PUT':
            // Cập nhật công việc
            if (!isset($_GET['id'])) {
                http_response_code(400);
                echo json_encode(['error' => 'ID is required']);
                break;
            }
            
            $data = json_decode(file_get_contents('php://input'), true);
            
            $stmt = $pdo->prepare("
                UPDATE air_work_history 
                SET ac_id=?, contractor_id=?, work_date=?, type=?, description=?, worker_name=?, 
                    cost=?, warranty=?, status=?, notes=?, documents=?, images_before=?, images_during=?, images_after=?,
                    updated_at=NOW()
                WHERE id=?
            ");
            
            $stmt->execute([
                $data['ac_id'],
                $data['contractor_id'] ?? null,
                $data['work_date'],
                $data['type'],
                $data['description'],
                $data['worker_name'],
                $data['cost'] ?? 0,
                $data['warranty'] ?? '',
                $data['status'],
                $data['notes'] ?? '',
                json_encode($data['documents'] ?? []),
                json_encode($data['images_before'] ?? []),
                json_encode($data['images_during'] ?? []),
                json_encode($data['images_after'] ?? []),
                $_GET['id']
            ]);
            
            echo json_encode(['success' => true]);
            break;
            
        case 'DELETE':
            // Xóa công việc
            if (!isset($_GET['id'])) {
                http_response_code(400);
                echo json_encode(['error' => 'ID is required']);
                break;
            }
            
            $stmt = $pdo->prepare("DELETE FROM air_work_history WHERE id = ?");
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
