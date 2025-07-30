/**
 * Stage Handover API - Xử lý bàn giao giữa các công đoạn
 * Tự động cập nhật xa_output_quantity -> xen_input_quantity, v.v.
 */

class StageHandoverAPI {
    constructor(apiBaseUrl = '/api') {
        this.apiBaseUrl = apiBaseUrl;
        this.stages = [
            'xa', 'xen', 'in_offset', 'xen_toa', 'kcs_in', 'kcs_sau_in', 
            'lang', 'in_luoi', 'boi', 'be', 'boc_le', 'dan_3m', 
            'dan_may', 'hoan_thien', 'ghim', 'gap', 'nhap_kho'
        ];
    }

    /**
     * Lấy stage tiếp theo trong workflow
     */
    getNextStage(currentStage) {
        const currentIndex = this.stages.indexOf(currentStage);
        if (currentIndex >= 0 && currentIndex < this.stages.length - 1) {
            return this.stages[currentIndex + 1];
        }
        return null;
    }

    /**
     * Bàn giao trực tiếp vào cột input_quantity của stage tiếp theo
     * VD: XẢ bàn giao 1000 → xen_input_quantity = 1000
     */
    async handoverToNextStage(orderId, currentStage, handoverQuantity, handoverPerson = '', receiverPerson = '', notes = '') {
        try {
            const handoverData = {
                order_id: orderId,
                current_stage: currentStage,
                handover_quantity: handoverQuantity,
                handover_person: handoverPerson,
                receiver_person: receiverPerson,
                notes: notes
            };

            const response = await fetch(`${this.apiBaseUrl}/handover_to_next_stage`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(handoverData)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            
            console.log(`✅ Bàn giao thành công: ${currentStage} → ${result.to_stage} (${handoverQuantity} sản phẩm)`);
            console.log(`📝 Đã cập nhật cột: ${result.updated_column}`);
            
            return result;
        } catch (error) {
            console.error('❌ Lỗi bàn giao trực tiếp:', error);
            throw error;
        }
    }

    /**
     * Cập nhật output quantity cho stage hiện tại
     */
    async updateStageOutput(orderId, stage, outputQuantity, goodQuantity = 0, ngQuantity = 0, workerName = '', notes = '') {
        try {
            const updateData = {
                stage: stage,
                output_quantity: outputQuantity,
                good_quantity: goodQuantity,
                ng_quantity: ngQuantity,
                worker_name: workerName,
                notes: notes
            };

            const response = await fetch(`${this.apiBaseUrl}/production_orders/${orderId}/stage_output`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updateData)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            
            console.log(`✅ Cập nhật ${stage}_output_quantity: ${outputQuantity} cho đơn hàng ${orderId}`);
            
            return result;
        } catch (error) {
            console.error('❌ Lỗi cập nhật output quantity:', error);
            throw error;
        }
    }

    /**
     * Bàn giao manual giữa 2 stage với số lượng tùy chọn
     */
    async manualHandover(orderId, fromStage, toStage, handoverQuantity, receivedQuantity = null, handoverPerson = '', receiverPerson = '', notes = '') {
        try {
            if (receivedQuantity === null) {
                receivedQuantity = handoverQuantity;
            }

            const handoverData = {
                order_id: orderId,
                from_stage: fromStage,
                to_stage: toStage,
                quantity_handover: handoverQuantity,
                quantity_received: receivedQuantity,
                handover_person: handoverPerson,
                receiver_person: receiverPerson,
                notes: notes
            };

            const response = await fetch(`${this.apiBaseUrl}/stage_handover`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(handoverData)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            
            console.log(`✅ Bàn giao thành công từ ${fromStage} → ${toStage}: ${handoverQuantity} → ${receivedQuantity}`);
            
            return result;
        } catch (error) {
            console.error('❌ Lỗi bàn giao manual:', error);
            throw error;
        }
    }

    /**
     * Bàn giao nhanh - lấy output của stage trước làm input cho stage sau
     */
    async quickHandover(orderId, fromStage, handoverPerson = '', receiverPerson = '', notes = '') {
        try {
            const toStage = this.getNextStage(fromStage);
            if (!toStage) {
                throw new Error(`Không có stage tiếp theo sau ${fromStage}`);
            }

            const handoverData = {
                order_id: orderId,
                from_stage: fromStage,
                to_stage: toStage,
                handover_person: handoverPerson,
                receiver_person: receiverPerson,
                notes: notes
            };

            const response = await fetch(`${this.apiBaseUrl}/quick_stage_handover`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(handoverData)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            
            console.log(`✅ Bàn giao nhanh thành công từ ${fromStage} → ${toStage}`);
            
            return result;
        } catch (error) {
            console.error('❌ Lỗi bàn giao nhanh:', error);
            throw error;
        }
    }

    /**
     * Hoàn thành stage hiện tại và bàn giao trực tiếp cho stage tiếp theo
     * Chỉ sử dụng 1 bảng production_orders
     */
    async completeAndHandover(orderId, currentStage, outputQuantity, goodQuantity, ngQuantity, workerName, handoverPerson, receiverPerson, notes = '') {
        try {
            // Bước 1: Cập nhật output quantity cho stage hiện tại
            await this.updateStageOutput(orderId, currentStage, outputQuantity, goodQuantity, ngQuantity, workerName);
            
            // Bước 2: Bàn giao trực tiếp vào cột input của stage tiếp theo
            await this.handoverToNextStage(orderId, currentStage, outputQuantity, handoverPerson, receiverPerson, notes);
            
            const nextStage = this.getNextStage(currentStage);
            
            console.log(`✅ Hoàn thành và bàn giao ${currentStage} thành công với ${outputQuantity} sản phẩm`);
            console.log(`📝 Dữ liệu đã được ghi vào cột ${nextStage}_input_quantity`);
            
            return {
                success: true,
                message: `Hoàn thành ${currentStage} và bàn giao cho ${nextStage}`,
                stage: currentStage,
                next_stage: nextStage,
                quantity: outputQuantity,
                updated_column: `${nextStage}_input_quantity`
            };
        } catch (error) {
            console.error('❌ Lỗi hoàn thành và bàn giao:', error);
            throw error;
        }
    }

    /**
     * Lấy lịch sử bàn giao của một đơn hàng
     */
    async getHandoverHistory(orderId) {
        try {
            const response = await fetch(`${this.apiBaseUrl}/stage_handover_history/${orderId}`);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const history = await response.json();
            return history;
        } catch (error) {
            console.error('❌ Lỗi lấy lịch sử bàn giao:', error);
            throw error;
        }
    }

    /**
     * Lấy thông tin chi tiết stage của đơn hàng
     */
    async getStageDetails(orderId) {
        try {
            const response = await fetch(`${this.apiBaseUrl}/production_orders/${orderId}/stages`);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const stageDetails = await response.json();
            return stageDetails;
        } catch (error) {
            console.error('❌ Lỗi lấy chi tiết stage:', error);
            throw error;
        }
    }

    /**
     * Helper function: Tạo UI để hiển thị thông tin bàn giao
     */
    renderHandoverForm(orderId, currentStage) {
        const nextStage = this.getNextStage(currentStage);
        
        return `
        <div class="handover-form" data-order-id="${orderId}" data-current-stage="${currentStage}">
            <h3>Bàn giao ${currentStage.toUpperCase()}</h3>
            
            <div class="row">
                <div class="col-md-6">
                    <label>Số lượng đầu ra ${currentStage}:</label>
                    <input type="number" id="output-quantity" class="form-control" min="0">
                </div>
                <div class="col-md-6">
                    <label>Số lượng đạt:</label>
                    <input type="number" id="good-quantity" class="form-control" min="0">
                </div>
            </div>
            
            <div class="row">
                <div class="col-md-6">
                    <label>Số lượng NG:</label>
                    <input type="number" id="ng-quantity" class="form-control" min="0" value="0">
                </div>
                <div class="col-md-6">
                    <label>Tên thợ:</label>
                    <input type="text" id="worker-name" class="form-control">
                </div>
            </div>
            
            <div class="row">
                <div class="col-md-6">
                    <label>Người bàn giao:</label>
                    <input type="text" id="handover-person" class="form-control">
                </div>
                <div class="col-md-6">
                    <label>Người nhận:</label>
                    <input type="text" id="receiver-person" class="form-control">
                </div>
            </div>
            
            <div class="row">
                <div class="col-md-12">
                    <label>Ghi chú:</label>
                    <textarea id="handover-notes" class="form-control" rows="2"></textarea>
                </div>
            </div>
            
            <div class="text-center mt-3">
                <button onclick="stageHandoverAPI.handleCompleteAndHandover()" class="btn btn-primary">
                    Hoàn thành ${currentStage.toUpperCase()} & Bàn giao cho ${nextStage ? nextStage.toUpperCase() : 'KHO'}
                </button>
            </div>
        </div>
        `;
    }

    /**
     * Handler cho button bàn giao
     */
    async handleCompleteAndHandover() {
        const form = document.querySelector('.handover-form');
        const orderId = form.dataset.orderId;
        const currentStage = form.dataset.currentStage;
        
        const outputQuantity = parseInt(document.getElementById('output-quantity').value) || 0;
        const goodQuantity = parseInt(document.getElementById('good-quantity').value) || 0;
        const ngQuantity = parseInt(document.getElementById('ng-quantity').value) || 0;
        const workerName = document.getElementById('worker-name').value.trim();
        const handoverPerson = document.getElementById('handover-person').value.trim();
        const receiverPerson = document.getElementById('receiver-person').value.trim();
        const notes = document.getElementById('handover-notes').value.trim();

        if (outputQuantity <= 0) {
            alert('Vui lòng nhập số lượng đầu ra > 0');
            return;
        }

        try {
            const result = await this.completeAndHandover(
                orderId, 
                currentStage, 
                outputQuantity, 
                goodQuantity, 
                ngQuantity, 
                workerName, 
                handoverPerson, 
                receiverPerson, 
                notes
            );
            
            alert(`✅ ${result.message}`);
            
            // Reload hoặc cập nhật UI
            if (typeof updateProductionOrderDisplay === 'function') {
                updateProductionOrderDisplay(orderId);
            }
            
        } catch (error) {
            alert(`❌ Lỗi: ${error.message}`);
        }
    }
}

// Khởi tạo instance global
const stageHandoverAPI = new StageHandoverAPI();

// Export cho Node.js nếu cần
if (typeof module !== 'undefined' && module.exports) {
    module.exports = StageHandoverAPI;
}
