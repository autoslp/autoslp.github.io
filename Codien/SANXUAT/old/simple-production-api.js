/**
 * Simple Production API - Sử dụng webhook n8n thay vì SQL database
 * Chỉ tập trung vào các chức năng cơ bản cần thiết
 */

class SimpleProductionAPI {
    constructor() {
        // Cấu hình API để nhận dữ liệu
        this.baseURL = 'https://api.autoslp.com';
        
        // Cấu hình webhook n8n để gửi dữ liệu
        this.webhookURL = 'https://n8n.api.autoslp.com/webhook/production';
        
        // Backup endpoint (nếu webhook chính không khả dụng)
        this.backupWebhookURL = 'https://webhook.site/your-backup-url';
        
        // Dữ liệu local (chỉ đọc, không cập nhật SQL)
        this.fallbackData = [
            {
                id: 1,
                order_code: 'PO-2024-001',
                production_order: 'PO-2024-001',
                product_name: 'Thùng carton 3 lớp 40x30x20cm',
                internal_product_code: 'CT-403020-3L',
                customer_name: 'Công ty ABC',
                current_stage: 'xa',
                total_quantity: 1000,
                xa_input_quantity: 1000,
                xa_output_quantity: 0,
                xa_good_quantity: 0,
                xa_ng_quantity: 0,
                xa_status: 'waiting',
                xa_machine_name: 'Xả 1',
                xa_worker_name: '',
                xa_note: '',
                paper_type: 'Duplex',
                paper_weight: 250,
                production_shift: 'Ca 1',
                status: 'in_progress',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
                delivery_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
            },
            {
                id: 2,
                order_code: 'PO-2024-002',
                production_order: 'PO-2024-002',
                product_name: 'Thùng carton 5 lớp 50x40x30cm',
                internal_product_code: 'CT-504030-5L',
                customer_name: 'Công ty XYZ',
                current_stage: 'xa',
                total_quantity: 500,
                xa_input_quantity: 500,
                xa_output_quantity: 0,
                xa_good_quantity: 0,
                xa_ng_quantity: 0,
                xa_status: 'waiting',
                xa_machine_name: 'Xả 2',
                xa_worker_name: '',
                xa_note: '',
                paper_type: 'KraftLiner',
                paper_weight: 200,
                production_shift: 'Ca 2',
                status: 'in_progress',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
                delivery_date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
            },
            {
                id: 3,
                order_code: 'PO-2024-003',
                production_order: 'PO-2024-003',
                product_name: 'Thùng carton 3 lớp 35x25x15cm',
                internal_product_code: 'CT-352515-3L',
                customer_name: 'Công ty DEF',
                current_stage: 'xa',
                total_quantity: 800,
                xa_input_quantity: 800,
                xa_output_quantity: 600,
                xa_good_quantity: 580,
                xa_ng_quantity: 20,
                xa_status: 'completed',
                xa_machine_name: 'Xả 1',
                xa_worker_name: 'Nguyễn Văn A',
                xa_note: 'Hoàn thành tốt',
                paper_type: 'Duplex',
                paper_weight: 300,
                production_shift: 'Ca 1',
                status: 'in_progress',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
                delivery_date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
            }
        ];
        
        console.log('Simple Production API initialized');
        console.log('- Data reading from:', this.baseURL);
        console.log('- Data sending via webhook:', this.webhookURL);
    }

    /**
     * Gửi dữ liệu qua webhook n8n
     * @param {string} action - Loại hành động (update_stage, handover, complete_stage)
     * @param {Object} data - Dữ liệu gửi đi
     * @returns {Promise<Object>} Kết quả gửi webhook
     */
    async sendWebhook(action, data) {
        try {
            const payload = {
                action: action,
                timestamp: new Date().toISOString(),
                source: 'production_frontend',
                data: data
            };

            console.log(`Sending webhook for action: ${action}`, payload);

            const response = await fetch(this.webhookURL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                // Thử backup webhook nếu webhook chính fail
                const backupResponse = await fetch(this.backupWebhookURL, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(payload)
                });

                if (backupResponse.ok) {
                    console.log('Backup webhook successful');
                    return { success: true, message: 'Đã gửi qua backup webhook', backup: true };
                } else {
                    throw new Error(`Webhook failed: ${response.status}`);
                }
            }

            const result = await response.json();
            console.log('Webhook response:', result);
            
            return {
                success: true,
                message: 'Dữ liệu đã được gửi qua webhook thành công',
                webhook_response: result
            };

        } catch (error) {
            console.error('Error sending webhook:', error);
            
            // Fallback: Lưu vào localStorage để retry sau
            this.saveToLocalStorage(action, data);
            
            return {
                success: true,
                message: 'Đã lưu dữ liệu local (sẽ đồng bộ khi có kết nối)',
                local_only: true
            };
        }
    }

    /**
     * Lưu dữ liệu vào localStorage để retry sau
     */
    saveToLocalStorage(action, data) {
        try {
            const key = 'pending_webhooks';
            const existing = JSON.parse(localStorage.getItem(key) || '[]');
            
            existing.push({
                action: action,
                data: data,
                timestamp: new Date().toISOString()
            });
            
            localStorage.setItem(key, JSON.stringify(existing));
            console.log('Data saved to localStorage for later sync');
        } catch (error) {
            console.error('Error saving to localStorage:', error);
        }
    }

    /**
     * Đồng bộ dữ liệu đã lưu trong localStorage
     */
    async syncPendingData() {
        try {
            const key = 'pending_webhooks';
            const pending = JSON.parse(localStorage.getItem(key) || '[]');
            
            if (pending.length === 0) return;
            
            console.log(`Syncing ${pending.length} pending webhooks...`);
            
            for (const item of pending) {
                await this.sendWebhook(item.action, item.data);
            }
            
            // Xóa dữ liệu đã sync
            localStorage.removeItem(key);
            this.showNotification('Đã đồng bộ dữ liệu thành công', 'success');
            
        } catch (error) {
            console.error('Error syncing pending data:', error);
        }
    }

    /**
     * Kiểm tra server có khả dụng không
     */
    async checkServerAvailability() {
        try {
            const response = await fetch(`${this.baseURL}/api/health`, { 
                method: 'GET',
                timeout: 5000 
            });
            return response.ok;
        } catch (error) {
            console.warn('Server not available:', error.message);
            return false;
        }
    }

    /**
     * Lấy danh sách lệnh sản xuất theo công đoạn (đọc từ API)
     * @param {string} stage - Tên công đoạn (xa, xen, in_offset, ...)
     * @returns {Promise<Array>} Danh sách lệnh sản xuất
     */
    async getOrdersByStage(stage) {
        try {
            // Đồng bộ dữ liệu pending trước khi load
            await this.syncPendingData();
            
            console.log('Loading orders for stage:', stage, '(from API)');
            
            // Thử kết nối API trước
            const url = `${this.baseURL}/api/production_orders/stage/${stage}`;
            const response = await fetch(url);
            
            if (response.ok) {
                const data = await response.json();
                console.log('Orders loaded from API:', data.length);
                return data;
            } else {
                throw new Error(`API response: ${response.status}`);
            }
            
        } catch (error) {
            console.warn('API not available, using fallback data:', error.message);
            
            // Fallback: sử dụng dữ liệu mẫu
            const filteredData = this.fallbackData.filter(order => order.current_stage === stage);
            const dynamicData = this.generateDynamicSampleData(stage);
            const allData = [...filteredData, ...dynamicData];
            
            this.showNotification('Đang sử dụng dữ liệu mẫu do API không khả dụng', 'warning');
            console.log('Orders loaded from fallback data:', allData.length);
            return allData;
        }
    }

    /**
     * Tạo dữ liệu mẫu động
     */
    generateDynamicSampleData(stage) {
        const now = new Date();
        const today = now.toISOString().split('T')[0];
        
        return [
            {
                id: Date.now(),
                order_code: `PO-${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}-001`,
                production_order: `LSX-${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}-001`,
                product_name: 'Thùng carton 3 lớp mẫu động',
                internal_product_code: 'CT-DYNAMIC-001',
                customer_name: 'Khách hàng mẫu',
                current_stage: stage,
                total_quantity: 1000,
                xa_input_quantity: 1000,
                xa_output_quantity: 0,
                xa_good_quantity: 0,
                xa_ng_quantity: 0,
                xa_status: 'waiting',
                xa_machine_name: 'Xả 1',
                xa_worker_name: '',
                xa_note: 'Lệnh mẫu động',
                paper_type: 'BC',
                paper_weight: 300,
                production_shift: 'Ca 1',
                status: 'in_progress',
                created_at: now.toISOString(),
                updated_at: now.toISOString(),
                delivery_date: today
            }
        ];
    }

    /**
     * Lấy chi tiết một lệnh sản xuất (đọc từ API)
     * @param {number} orderId - ID của lệnh sản xuất
     * @returns {Promise<Object>} Chi tiết lệnh sản xuất
     */
    async getOrderDetails(orderId) {
        try {
            // Sử dụng endpoint API để đọc dữ liệu
            const url = `${this.baseURL}/api/production_orders/${orderId}`;
            console.log('Fetching order details from API for ID:', orderId);
            
            const response = await fetch(url);
            if (!response.ok) {
                const errorText = await response.text();
                console.error('API response:', errorText);
                
                // Fallback: tìm trong fallback data
                if (response.status === 404 || errorText.includes('<!DOCTYPE')) {
                    console.warn('API endpoint not found, checking fallback data');
                    const fallbackOrder = this.fallbackData.find(order => order.id === parseInt(orderId));
                    if (fallbackOrder) {
                        console.log('Found order in fallback data:', fallbackOrder);
                        this.showNotification('Đang sử dụng dữ liệu mẫu do API không khả dụng', 'warning');
                        return fallbackOrder;
                    }
                }
                
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            const data = await response.json();
            console.log('Order details received from API:', data);
            return data;
        } catch (error) {
            console.error('Error fetching order details from API:', error);
            
            // Network error fallback
            if (error.name === 'TypeError' || error.message.includes('fetch')) {
                console.warn('Using fallback data for order details due to network error');
                const fallbackOrder = this.fallbackData.find(order => order.id === parseInt(orderId));
                if (fallbackOrder) {
                    this.showNotification('Đang sử dụng dữ liệu mẫu do server không khả dụng', 'warning');
                    return fallbackOrder;
                }
            }
            
            throw error;
        }
    }

    /**
     * Bàn giao trực tiếp sang công đoạn tiếp theo (gửi qua webhook n8n)
     * @param {number} orderId - ID lệnh sản xuất
     * @param {string} currentStage - Công đoạn hiện tại
     * @param {number} handoverQuantity - Số lượng bàn giao
     * @param {string} handoverPerson - Người bàn giao
     * @param {string} receiverPerson - Người nhận
     * @param {string} notes - Ghi chú
     * @returns {Promise<Object>} Kết quả bàn giao
     */
    async handoverToNextStage(orderId, currentStage, handoverQuantity, handoverPerson = '', receiverPerson = '', notes = '') {
        try {
            console.log('Handover via webhook:', { orderId, currentStage, handoverQuantity });
            
            // Xác định stage tiếp theo
            const stageMapping = {
                'xa': 'xen',
                'xen': 'in_offset', 
                'in_offset': 'xen_toa',
                'xen_toa': 'kcs_in',
                'kcs_in': 'kcs_sau_in',
                'kcs_sau_in': 'lang',
                'lang': 'in_luoi',
                'in_luoi': 'boi',
                'boi': 'be',
                'be': 'boc_le',
                'boc_le': 'dan_3m',
                'dan_3m': 'dan_may',
                'dan_may': 'hoan_thien',
                'hoan_thien': 'ghim',
                'ghim': 'gap',
                'gap': 'nhap_kho'
            };
            
            const nextStage = stageMapping[currentStage];
            
            const webhookData = {
                order_id: orderId,
                from_stage: currentStage,
                to_stage: nextStage,
                handover_quantity: handoverQuantity,
                handover_person: handoverPerson,
                receiver_person: receiverPerson,
                notes: notes,
                handover_date: new Date().toISOString()
            };
            
            // Gửi qua webhook n8n
            const result = await this.sendWebhook('handover_to_next_stage', webhookData);
            
            if (result.success) {
                this.showNotification(
                    `Đã bàn giao ${this.formatNumber(handoverQuantity)} sản phẩm từ ${currentStage.toUpperCase()} sang ${nextStage ? nextStage.toUpperCase() : 'KHO'}`,
                    'success'
                );
            }
            
            return {
                success: true,
                message: `Bàn giao thành công từ ${currentStage.toUpperCase()} sang ${nextStage ? nextStage.toUpperCase() : 'KHO'}`,
                order_id: orderId,
                from_stage: currentStage,
                to_stage: nextStage,
                handover_quantity: handoverQuantity,
                webhook_sent: result.success
            };
            
        } catch (error) {
            console.error('Error handover to next stage:', error);
            
            // Fallback: Vẫn báo thành công nhưng chỉ lưu local
            this.showNotification(
                `Đã lưu bàn giao ${this.formatNumber(handoverQuantity)} sản phẩm (sẽ đồng bộ sau)`,
                'warning'
            );
            
            return {
                success: true,
                message: 'Bàn giao thành công (lưu local)',
                order_id: orderId,
                current_stage: currentStage,
                handover_quantity: handoverQuantity,
                local_only: true
            };
        }
    }

    /**
     * Cập nhật output quantity cho stage hiện tại (gửi qua webhook n8n)
     * @param {number} orderId - ID lệnh sản xuất
     * @param {string} stage - Công đoạn hiện tại
     * @param {number} outputQuantity - Số lượng đầu ra
     * @param {number} goodQuantity - Số lượng đạt
     * @param {number} ngQuantity - Số lượng NG
     * @param {string} workerName - Tên thợ
     * @param {string} notes - Ghi chú
     * @returns {Promise<Object>} Kết quả cập nhật
     */
    async updateStageOutput(orderId, stage, outputQuantity, goodQuantity = 0, ngQuantity = 0, workerName = '', notes = '') {
        try {
            console.log('Updating stage output via webhook:', { orderId, stage, outputQuantity });
            
            const webhookData = {
                order_id: orderId,
                stage: stage,
                output_quantity: outputQuantity,
                good_quantity: goodQuantity,
                ng_quantity: ngQuantity,
                worker_name: workerName,
                notes: notes,
                updated_at: new Date().toISOString()
            };
            
            // Gửi qua webhook n8n
            const result = await this.sendWebhook('update_stage_output', webhookData);
            
            if (result.success) {
                this.showNotification(`Đã cập nhật công đoạn ${stage.toUpperCase()}: ${this.formatNumber(outputQuantity)} sản phẩm`, 'success');
            }
            
            return {
                success: true,
                message: `Cập nhật thành công ${stage}_output_quantity = ${outputQuantity}`,
                order_id: orderId,
                stage: stage,
                output_quantity: outputQuantity,
                good_quantity: goodQuantity,
                ng_quantity: ngQuantity,
                webhook_sent: result.success
            };
            
        } catch (error) {
            console.error('Error updating stage output:', error);
            
            // Fallback: Vẫn báo thành công nhưng chỉ lưu local
            this.showNotification(`Đã lưu cập nhật công đoạn ${stage.toUpperCase()} (sẽ đồng bộ sau)`, 'warning');
            
            return {
                success: true,
                message: 'Cập nhật thành công (lưu local)',
                order_id: orderId,
                stage: stage,
                output_quantity: outputQuantity,
                local_only: true
            };
        }
    }

    /**
     * Bàn giao từ công đoạn XẢ sang XÉN
     * @param {number} orderId - ID lệnh sản xuất
     * @param {number} handoverQuantity - Số lượng bàn giao
     * @param {string} handoverPerson - Người bàn giao
     * @param {string} receiverPerson - Người nhận
     * @param {string} notes - Ghi chú bàn giao
     * @returns {Promise<Object>} Kết quả bàn giao
     */
    async handoverXaToXen(orderId, handoverQuantity, handoverPerson = '', receiverPerson = '', notes = '') {
        try {
            console.log('Handover XẢ to XÉN:', { orderId, handoverQuantity, handoverPerson, receiverPerson });
            
            // Gọi API bàn giao tổng quát với stage cụ thể
            const result = await this.handoverToNextStage(
                orderId, 
                'xa',  // current stage
                handoverQuantity, 
                handoverPerson, 
                receiverPerson, 
                notes
            );
            
            // Thông báo cụ thể cho bàn giao XẢ -> XÉN
            if (result.success) {
                this.showNotification(
                    `Đã bàn giao ${this.formatNumber(handoverQuantity)} sản phẩm từ công đoạn XẢ sang XÉN thành công!`,
                    'success'
                );
            }
            
            return result;
            
        } catch (error) {
            console.error('Error handover XẢ to XÉN:', error);
            
            // Fallback simulation với thông báo cụ thể
            console.warn('Simulating XẢ to XÉN handover due to API error');
            this.showNotification(
                `Đã mô phỏng bàn giao ${this.formatNumber(handoverQuantity)} sản phẩm từ XẢ sang XÉN`,
                'warning'
            );
            
            return {
                success: true,
                message: 'Bàn giao XẢ -> XÉN thành công (mô phỏng)',
                order_id: orderId,
                from_stage: 'xa',
                to_stage: 'xen',
                handover_quantity: handoverQuantity,
                handover_person: handoverPerson,
                receiver_person: receiverPerson,
                notes: notes,
                handover_time: new Date().toISOString()
            };
        }
    }

    /**
     * Hoàn thành công đoạn XẢ và bàn giao sang XÉN (gửi qua webhook n8n)
     * @param {number} orderId - ID lệnh sản xuất
     * @param {Object} completionData - Dữ liệu hoàn thành và bàn giao
     * @returns {Promise<Object>} Kết quả hoàn thành và bàn giao
     */
    async completeXaAndHandoverToXen(orderId, completionData) {
        try {
            console.log('Complete XẢ and handover to XÉN via webhook:', { orderId, completionData });
            
            // Tạo dữ liệu tổng hợp cho webhook
            const completeHandoverData = {
                order_id: orderId,
                action_type: 'complete_and_handover',
                from_stage: 'xa',
                to_stage: 'xen',
                
                // Thông tin hoàn thành
                completion: {
                    output_quantity: completionData.outputQuantity,
                    good_quantity: completionData.goodQuantity,
                    ng_quantity: completionData.ngQuantity,
                    worker_name: completionData.workerName,
                    notes: completionData.notes
                },
                
                // Thông tin bàn giao
                handover: {
                    handover_quantity: completionData.handoverQuantity || completionData.goodQuantity,
                    handover_person: completionData.handoverPerson,
                    receiver_person: completionData.receiverPerson,
                    handover_notes: completionData.handoverNotes
                },
                
                completed_at: new Date().toISOString()
            };
            
            // Gửi qua webhook n8n
            const result = await this.sendWebhook('complete_xa_and_handover_to_xen', completeHandoverData);
            
            if (result.success) {
                this.showNotification(
                    `✅ Hoàn thành XẢ và bàn giao ${this.formatNumber(completeHandoverData.handover.handover_quantity)} sản phẩm sang XÉN thành công!`,
                    'success'
                );
            }
            
            return {
                success: true,
                message: 'Hoàn thành công đoạn XẢ và bàn giao sang XÉN thành công',
                completion: {
                    stage: 'xa',
                    output_quantity: completionData.outputQuantity,
                    good_quantity: completionData.goodQuantity,
                    ng_quantity: completionData.ngQuantity
                },
                handover: {
                    from_stage: 'xa',
                    to_stage: 'xen',
                    handover_quantity: completeHandoverData.handover.handover_quantity
                },
                webhook_sent: result.success
            };
            
        } catch (error) {
            console.error('Error complete XẢ and handover to XÉN:', error);
            
            // Fallback: Vẫn báo thành công
            this.showNotification(
                `Đã lưu hoàn thành XẢ và bàn giao sang XÉN (sẽ đồng bộ sau)`,
                'warning'
            );
            
            return {
                success: true,
                message: 'Hoàn thành và bàn giao thành công (lưu local)',
                local_only: true
            };
        }
    }

    /**
     * Utility functions - Các hàm tiện ích
     */
    
    // Format số theo định dạng Việt Nam
    formatNumber(num) {
        if (!num && num !== 0) return '';
        return new Intl.NumberFormat('vi-VN').format(num);
    }

    // Format ngày
    formatDate(date, format = 'dd/mm/yyyy') {
        if (!date) return '';
        const d = new Date(date);
        const day = String(d.getDate()).padStart(2, '0');
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const year = d.getFullYear();
        
        return format
            .replace('dd', day)
            .replace('mm', month)
            .replace('yyyy', year);
    }

    // Lấy ngày hôm nay
    getToday() {
        return new Date().toISOString().split('T')[0];
    }

    // Hiển thị thông báo
    showNotification(message, type = 'success') {
        // Tạo toast notification đơn giản
        const toast = document.createElement('div');
        toast.className = `alert alert-${type === 'error' ? 'danger' : type === 'warning' ? 'warning' : 'success'} position-fixed`;
        toast.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 300px; animation: fadeIn 0.3s ease;';
        toast.innerHTML = `
            <div class="d-flex align-items-center">
                <i class="bi bi-${type === 'error' ? 'exclamation-triangle' : type === 'warning' ? 'exclamation-triangle' : 'check-circle'} me-2"></i>
                <span>${message}</span>
                <button type="button" class="btn-close ms-auto" onclick="this.parentElement.parentElement.remove()"></button>
            </div>
        `;
        document.body.appendChild(toast);
        
        // Tự động xóa sau 5 giây
        setTimeout(() => {
            if (toast.parentElement) {
                toast.style.animation = 'fadeOut 0.3s ease';
                setTimeout(() => toast.remove(), 300);
            }
        }, 5000);
    }

    // Hiển thị loading
    showLoading() {
        const loading = document.getElementById('loadingOverlay');
        if (loading) loading.style.display = 'flex';
    }

    // Ẩn loading
    hideLoading() {
        const loading = document.getElementById('loadingOverlay');
        if (loading) loading.style.display = 'none';
    }
}

// Tạo instance global để sử dụng dễ dàng
window.SimpleAPI = new SimpleProductionAPI();

// Thêm CSS cho animations
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeIn {
        from { opacity: 0; transform: translateX(100%); }
        to { opacity: 1; transform: translateX(0); }
    }
    @keyframes fadeOut {
        from { opacity: 1; transform: translateX(0); }
        to { opacity: 0; transform: translateX(100%); }
    }
`;
document.head.appendChild(style);

console.log('Simple Production API loaded successfully');
