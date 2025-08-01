// UI đơn giản cho máy

class SimpleMachineManager {
    constructor() {
        this.availableMachines = [];
        this.machineStatus = [];
    }

    // Load danh sách máy rảnh
    async loadAvailableMachines() {
        try {
            const response = await fetch(API_CONFIG.getUrl(API_CONFIG.ENDPOINTS.AVAILABLE_MACHINES));
            const data = await response.json();
            
            if (response.ok) {
                this.availableMachines = data.available_machines;
                console.log(`📊 Loaded ${this.availableMachines.length} available machines`);
            } else {
                console.error('❌ Error loading machines:', data.error);
                this.availableMachines = [];
            }
        } catch (error) {
            console.error('❌ Error loading machines:', error);
            this.availableMachines = [];
        }
    }

    // Load trạng thái máy
    async loadMachineStatus() {
        try {
            const response = await fetch(API_CONFIG.getUrl(API_CONFIG.ENDPOINTS.MACHINE_STATUS));
            const data = await response.json();
            
            if (response.ok) {
                this.machineStatus = data.machines;
                console.log(`📊 Loaded machine status for ${this.machineStatus.length} machines`);
            } else {
                console.error('❌ Error loading machine status:', data.error);
                this.machineStatus = [];
            }
        } catch (error) {
            console.error('❌ Error loading machine status:', error);
            this.machineStatus = [];
        }
    }

    // Bắt đầu lệnh trên máy
    async startOrderOnMachine(machineId, orderId, orderCode) {
        try {
            const response = await fetch(API_CONFIG.getUrl(API_CONFIG.ENDPOINTS.START_ORDER_ON_MACHINE), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    machine_id: machineId,
                    order_id: orderId,
                    order_code: orderCode
                })
            });

            const result = await response.json();

            if (response.ok) {
                showNotification(`✅ ${result.message}`, 'success');
                await this.loadAvailableMachines(); // Refresh danh sách máy
                await this.loadMachineStatus(); // Refresh trạng thái máy
                return true;
            } else {
                showNotification(`❌ ${result.error}`, 'error');
                return false;
            }
        } catch (error) {
            console.error('❌ Error starting order on machine:', error);
            showNotification('❌ Lỗi kết nối server', 'error');
            return false;
        }
    }

    // Kết thúc lệnh trên máy
    async endOrderOnMachine(machineId, orderId) {
        try {
            const response = await fetch(API_CONFIG.getUrl(API_CONFIG.ENDPOINTS.END_ORDER_ON_MACHINE), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    machine_id: machineId,
                    order_id: orderId
                })
            });

            const result = await response.json();

            if (response.ok) {
                showNotification(`✅ ${result.message}`, 'success');
                await this.loadAvailableMachines(); // Refresh danh sách máy
                await this.loadMachineStatus(); // Refresh trạng thái máy
                return true;
            } else {
                showNotification(`❌ ${result.error}`, 'error');
                return false;
            }
        } catch (error) {
            console.error('❌ Error ending order on machine:', error);
            showNotification('❌ Lỗi kết nối server', 'error');
            return false;
        }
    }

    // Hiển thị modal chọn máy
    showMachineSelectionModal(orderId, orderCode) {
        if (this.availableMachines.length === 0) {
            showNotification('❌ Không có máy rảnh', 'warning');
            return;
        }

        // Tạo modal đơn giản
        const modal = document.createElement('div');
        modal.className = 'modal fade show';
        modal.style.display = 'block';
        modal.innerHTML = `
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Chọn máy cho lệnh ${orderCode}</h5>
                        <button type="button" class="btn-close" onclick="this.closest('.modal').remove()"></button>
                    </div>
                    <div class="modal-body">
                        <p>Có ${this.availableMachines.length} máy rảnh:</p>
                        <div class="machine-list">
                            ${this.availableMachines.map(machine => `
                                <div class="machine-item d-flex justify-content-between align-items-center p-2 border-bottom">
                                    <div>
                                        <strong>${machine.machine_name}</strong>
                                        <br><small class="text-muted">${machine.machine_id}</small>
                                    </div>
                                    <button class="btn btn-sm btn-primary select-machine-btn" 
                                            data-machine-id="${machine.machine_id}"
                                            data-machine-name="${machine.machine_name}">
                                        Chọn
                                    </button>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Thêm modal vào body
        document.body.appendChild(modal);

        // Xử lý sự kiện chọn máy
        modal.querySelectorAll('.select-machine-btn').forEach(btn => {
            btn.onclick = async () => {
                const machineId = btn.getAttribute('data-machine-id');
                const machineName = btn.getAttribute('data-machine-name');
                
                // Bắt đầu lệnh trên máy
                const success = await this.startOrderOnMachine(machineId, orderId, orderCode);
                
                if (success) {
                    // Refresh data và UI
                    if (typeof refreshData === 'function') {
                        await refreshData();
                    }
                    this.updateTableButtons();
                }
                
                // Đóng modal
                modal.remove();
            };
        });
    }

    // Cập nhật nút trong bảng
    updateTableButtons() {
        const tableRows = document.querySelectorAll('#stageTableBody tr');
        
        tableRows.forEach(row => {
            const orderId = parseInt(row.getAttribute('data-order-id'));
            const startButton = row.querySelector('.btn-start-production');
            
            if (startButton) {
                const order = ordersData.find(o => o.id === orderId);
                if (order) {
                    // Kiểm tra máy có đang chạy lệnh này không
                    const machineRunningThisOrder = this.machineStatus.find(m => 
                        m.current_order_id === orderId
                    );
                    
                    // Kiểm tra máy có đang chạy lệnh khác không
                    const machineRunningOtherOrder = this.machineStatus.find(m => 
                        m.current_order_id !== null && m.current_order_id !== orderId
                    );
                    
                    if (order.xa_status === 'completed' || order.xa_end_time) {
                        // Lệnh đã hoàn thành
                        startButton.disabled = true;
                        startButton.title = 'Lệnh đã hoàn thành';
                        startButton.classList.add('btn-secondary');
                        startButton.classList.remove('btn-primary', 'btn-warning');
                    } else if (machineRunningThisOrder) {
                        // Lệnh đang chạy trên máy
                        startButton.disabled = true;
                        startButton.title = `Đang chạy trên máy ${machineRunningThisOrder.machine_id}`;
                        startButton.classList.add('btn-warning');
                        startButton.classList.remove('btn-primary', 'btn-secondary');
                    } else if (this.availableMachines.length > 0) {
                        // Có thể bắt đầu
                        startButton.disabled = false;
                        startButton.title = `Có ${this.availableMachines.length} máy rảnh - Click để chọn`;
                        startButton.classList.add('btn-primary');
                        startButton.classList.remove('btn-secondary', 'btn-warning');
                    } else {
                        // Tất cả máy đều đang bận
                        startButton.disabled = true;
                        startButton.title = 'Tất cả máy đều đang bận';
                        startButton.classList.add('btn-secondary');
                        startButton.classList.remove('btn-primary', 'btn-warning');
                    }
                }
            }
        });
    }

    // Khởi tạo
    async initialize() {
        await this.loadAvailableMachines();
        await this.loadMachineStatus();
        this.updateTableButtons();
        console.log('🚀 Simple machine manager initialized');
    }
}

// Global instance
let simpleMachineManager = null;

// Khởi tạo khi trang load
async function initializeSimpleMachine() {
    if (simpleMachineManager) {
        simpleMachineManager = null;
    }
    
    simpleMachineManager = new SimpleMachineManager();
    await simpleMachineManager.initialize();
}

// Hàm bắt đầu sản xuất từ bảng (đơn giản)
async function startProductionFromTable(orderId) {
    if (!simpleMachineManager) {
        showNotification('❌ Machine manager chưa được khởi tạo', 'error');
        return;
    }

    const order = ordersData.find(o => o.id === orderId);
    if (!order) {
        showNotification('❌ Không tìm thấy lệnh sản xuất', 'error');
        return;
    }

    // Kiểm tra trạng thái lệnh
    if (order.xa_status === 'completed' || order.xa_end_time) {
        showNotification('❌ Lệnh đã hoàn thành', 'warning');
        return;
    }

    // Hiển thị modal chọn máy
    simpleMachineManager.showMachineSelectionModal(orderId, order.production_order);
}

// Hàm kết thúc sản xuất (đơn giản)
async function endProductionFromTable(orderId) {
    if (!simpleMachineManager) {
        showNotification('❌ Machine manager chưa được khởi tạo', 'error');
        return;
    }

    const order = ordersData.find(o => o.id === orderId);
    if (!order) {
        showNotification('❌ Không tìm thấy lệnh sản xuất', 'error');
        return;
    }

    // Tìm máy đang chạy lệnh này
    const machineRunningThisOrder = simpleMachineManager.machineStatus.find(m => 
        m.current_order_id === orderId
    );

    if (!machineRunningThisOrder) {
        showNotification('❌ Lệnh không đang chạy trên máy nào', 'warning');
        return;
    }

    // Kết thúc lệnh trên máy
    const success = await simpleMachineManager.endOrderOnMachine(
        machineRunningThisOrder.machine_id, 
        orderId
    );
    
    if (success) {
        // Refresh data và UI
        if (typeof refreshData === 'function') {
            await refreshData();
        }
        simpleMachineManager.updateTableButtons();
    }
}

// Export cho sử dụng global
window.SimpleMachineManager = SimpleMachineManager;
window.initializeSimpleMachine = initializeSimpleMachine;
window.startProductionFromTable = startProductionFromTable;
window.endProductionFromTable = endProductionFromTable; 