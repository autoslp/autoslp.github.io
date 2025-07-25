<?php
require_once 'config.php';

$method = $_SERVER['REQUEST_METHOD'];

try {
    switch($method) {
        case 'GET':
            if (isset($_GET['id'])) {
                // Lấy chi tiết một nhà thầu
                $stmt = $pdo->prepare("SELECT * FROM air_contractors WHERE id = ?");
                $stmt->execute([$_GET['id']]);
                $result = $stmt->fetch();
                
                if ($result) {
                    $result['specialties'] = json_decode($result['specialties'] ?? '[]', true);
                    echo json_encode($result);
                } else {
                    http_response_code(404);
                    echo json_encode(['error' => 'Contractor not found']);
                }
            } else {
                // Lấy danh sách tất cả nhà thầu
                $activeOnly = isset($_GET['active']) && $_GET['active'] === 'true';
                $query = "SELECT * FROM air_contractors";
                if ($activeOnly) {
                    $query .= " WHERE is_active = 1";
                }
                $query .= " ORDER BY rating DESC, name ASC";
                
                $stmt = $pdo->query($query);
                $result = $stmt->fetchAll();
                
                // Parse JSON specialties for all contractors
                foreach ($result as &$contractor) {
                    $contractor['specialties'] = json_decode($contractor['specialties'] ?? '[]', true);
                }
                
                echo json_encode($result);
            }
            break;
            
        case 'POST':
            // Thêm nhà thầu mới
            $data = json_decode(file_get_contents('php://input'), true);
            
            $stmt = $pdo->prepare("
                INSERT INTO air_contractors 
                (name, phone, license, address, rating, experience, specialties, is_active) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            ");
            
            $stmt->execute([
                $data['name'],
                $data['phone'] ?? '',
                $data['license'] ?? '',
                $data['address'] ?? '',
                $data['rating'] ?? 0.0,
                $data['experience'] ?? '',
                json_encode($data['specialties'] ?? []),
                $data['is_active'] ?? true
            ]);
            
            echo json_encode(['success' => true, 'id' => $pdo->lastInsertId()]);
            break;
            
        case 'PUT':
            // Cập nhật nhà thầu
            if (!isset($_GET['id'])) {
                http_response_code(400);
                echo json_encode(['error' => 'ID is required']);
                break;
            }
            
            $data = json_decode(file_get_contents('php://input'), true);
            
            $stmt = $pdo->prepare("
                UPDATE air_contractors 
                SET name=?, phone=?, license=?, address=?, rating=?, experience=?, specialties=?, is_active=?,
                    updated_at=NOW()
                WHERE id=?
            ");
            
            $stmt->execute([
                $data['name'],
                $data['phone'] ?? '',
                $data['license'] ?? '',
                $data['address'] ?? '',
                $data['rating'] ?? 0.0,
                $data['experience'] ?? '',
                json_encode($data['specialties'] ?? []),
                $data['is_active'] ?? true,
                $_GET['id']
            ]);
            
            echo json_encode(['success' => true]);
            break;
            
        case 'DELETE':
            // Xóa nhà thầu (soft delete - set is_active = false)
            if (!isset($_GET['id'])) {
                http_response_code(400);
                echo json_encode(['error' => 'ID is required']);
                break;
            }
            
            $stmt = $pdo->prepare("UPDATE air_contractors SET is_active = 0, updated_at = NOW() WHERE id = ?");
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
