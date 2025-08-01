// Multi-Machine UI Support
// Cập nhật UI để hỗ trợ nhiều máy cho mỗi công đoạn

class MultiMachineManager {
    constructor() {
        this.currentStage = null;
        this.availableMachines = [];
    }

    // Khởi tạo cho stage cụ thể
    async initialize(stage) {
        this.currentStage = stage;
        await this.loadAvailableMachines();
        this.updateMachineSelectionUI();
    }

    // Load danh sách máy rảnh
    async loadAvailableMachines() {
        try {
            const response = await fetch(`/api/available_machines/${this.currentStage}`);
            const data = await response.json();
            
            if (response.ok) {
                this.availableMachines = data.available_machines;
                console.log(`📊 Loaded ${this.availableMachines.length} available machines for ${this.currentStage}`);
            } else {
                console.error('❌ Error loading machines:', data.error);
                this.availableMachines = [];
            }
        } catch (error) {
            console.error('❌ Error loading machines:', error);
            this.availableMachines = [];
        }
    }

    // Cập nhật UI chọn máy
    updateMachineSelectionUI() {
        // Cập nhật dropdown chọn máy trong sidebar
        const machineSelect = document.getElementById('machine-select');
        if (machineSelect) {
            machineSelect.innerHTML = '<option value="">Chọn máy...</option>';
            
            this.availableMachines.forEach(machine => {
                const option = document.createElement('option');
                option.value = machine.machine_id;
                option.textContent = `${machine.machine_name} (${machine.machine_id})`;
                machineSelect.appendChild(option);
            });
        }

        // Cập nhật thông báo trạng thái máy
        this.updateMachineStatusMessage();
    }

    // Cập nhật thông báo trạng thái máy
    updateMachineStatusMessage() {
        const statusElement = document.getElementById('machine-status-message');
        if (statusElement) {
            if (this.availableMachines.length === 0) {
                statusElement.innerHTML = `
                    <div class="alert alert-warning">
                        <i class="bi bi-exclamation-triangle"></i>
                        <strong>Tất cả máy đều đang bận</strong>
                        <br><small>Vui lòng chờ máy rảnh hoặc kết thúc lệnh hiện tại</small>
                    </div>
                `;
                statusElement.style.display = 'block';
            } else {
                statusElement.innerHTML = `
                    <div class="alert alert-info">
                        <i class="bi bi-info-circle"></i>
                        <strong>Có ${this.availableMachines.length} máy rảnh</strong>
                        <br><small>Vui lòng chọn máy để bắt đầu sản xuất</small>
                    </div>
                `;
                statusElement.style.display = 'block';
            }
        }
    }

    // Bắt đầu sản xuất với máy được chọn
    async startProductionWithMachine(orderId, machineId, workerName, note) {
        if (!machineId) {
            showNotification('❌ Vui lòng chọn máy', 'error');
            return false;
        }

        try {
            const response = await fetch(`/api/start_production/${this.currentStage}/${orderId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    machine_id: machineId,
                    worker_name: workerName,
                    note: note
                })
            });

            const result = await response.json();

            if (response.ok) {
                showNotification(`✅ Đã bắt đầu sản xuất trên máy ${machineId}`, 'success');
                await this.loadAvailableMachines(); // Refresh danh sách máy
                this.updateMachineSelectionUI();
                return true;
            } else {
                showNotification(`❌ ${result.message || result.error}`, 'error');
                return false;
            }
        } catch (error) {
            console.error('❌ Error starting production:', error);
            showNotification('❌ Lỗi kết nối server', 'error');
            return false;
        }
    }

    // Cập nhật trạng thái nút bắt đầu trong bảng
    updateTableStartButtons() {
        const tableRows = document.querySelectorAll('#stageTableBody tr');
        
        tableRows.forEach(row => {
            const orderId = parseInt(row.getAttribute('data-order-id'));
            const startButton = row.querySelector('.btn-start-production');
            
            if (startButton) {
                const order = ordersData.find(o => o.id === orderId);
                if (order) {
                    const statusField = `${this.currentStage}_status`;
                    const endTimeField = `${this.currentStage}_end_time`;
                    const machineIdField = `${this.currentStage}_machine_id`;
                    
                    if (order[statusField] === 'completed' || order[endTimeField]) {
                        // Lệnh đã hoàn thành
                        startButton.disabled = true;
                        startButton.title = 'Lệnh đã hoàn thành';
                        startButton.classList.add('btn-secondary');
                        startButton.classList.remove('btn-primary', 'btn-warning');
                    } else if (order[machineIdField] && order[statusField] === 'in_progress') {
                        // Lệnh đang chạy trên máy
                        startButton.disabled = true;
                        startButton.title = `Đang chạy trên máy ${order[machineIdField]}`;
                        startButton.classList.add('btn-warning');
                        startButton.classList.remove('btn-primary', 'btn-secondary');
                    } else {
                        // Có thể bắt đầu
                        if (this.availableMachines.length > 0) {
                            startButton.disabled = false;
                            startButton.title = `Có ${this.availableMachines.length} máy rảnh - Click để chọn`;
                            startButton.classList.add('btn-primary');
                            startButton.classList.remove('btn-secondary', 'btn-warning');
                        } else {
                            startButton.disabled = true;
                            startButton.title = 'Tất cả máy đều đang bận';
                            startButton.classList.add('btn-secondary');
                            startButton.classList.remove('btn-primary', 'btn-warning');
                        }
                    }
                }
            }
        });
    }

    // Hiển thị modal chọn máy
    showMachineSelectionModal(orderId) {
        if (this.availableMachines.length === 0) {
            showNotification('❌ Không có máy rảnh', 'warning');
            return;
        }

        const modal = document.getElementById('machineSelectionModal');
        if (modal) {
            // Cập nhật danh sách máy trong modal
            const machineList = modal.querySelector('.machine-list');
            machineList.innerHTML = '';
            
            this.availableMachines.forEach(machine => {
                const machineItem = document.createElement('div');
                machineItem.className = 'machine-item';
                machineItem.innerHTML = `
                    <div class="machine-info">
                        <strong>${machine.machine_name}</strong>
                        <small class="text-muted">${machine.machine_id}</small>
                    </div>
                    <button class="btn btn-sm btn-primary select-machine-btn" 
                            data-machine-id="${machine.machine_id}"
                            data-machine-name="${machine.machine_name}">
                        Chọn
                    </button>
                `;
                machineList.appendChild(machineItem);
            });

            // Xử lý sự kiện chọn máy
            machineList.querySelectorAll('.select-machine-btn').forEach(btn => {
                btn.onclick = () => {
                    const machineId = btn.getAttribute('data-machine-id');
                    const machineName = btn.getAttribute('data-machine-name');
                    this.selectMachineForOrder(orderId, machineId, machineName);
                    modal.style.display = 'none';
                };
            });

            modal.style.display = 'block';
        }
    }

    // Chọn máy cho lệnh
    async selectMachineForOrder(orderId, machineId, machineName) {
        // Hiển thị form nhập thông tin
        const workerName = prompt(`Nhập tên công nhân cho máy ${machineName}:`);
        if (!workerName) return;

        const note = prompt('Nhập ghi chú (tùy chọn):') || '';

        // Bắt đầu sản xuất
        const success = await this.startProductionWithMachine(orderId, machineId, workerName, note);
        
        if (success) {
            // Refresh data và UI
            if (typeof refreshData === 'function') {
                await refreshData();
            }
            this.updateTableStartButtons();
        }
    }
}

// Global instance
let multiMachineManager = null;

// Khởi tạo khi trang load
function initializeMultiMachine(stage) {
    if (multiMachineManager) {
        multiMachineManager = null;
    }
    
    multiMachineManager = new MultiMachineManager();
    multiMachineManager.initialize(stage);
    
    console.log(`🚀 Multi-machine manager initialized for stage: ${stage}`);
}

// Hàm bắt đầu sản xuất từ bảng (cập nhật)
async function startProductionFromTable(orderId) {
    if (!multiMachineManager) {
        showNotification('❌ Multi-machine manager chưa được khởi tạo', 'error');
        return;
    }

    const order = ordersData.find(o => o.id === orderId);
    if (!order) {
        showNotification('❌ Không tìm thấy lệnh sản xuất', 'error');
        return;
    }

    // Kiểm tra trạng thái lệnh
    const statusField = `${multiMachineManager.currentStage}_status`;
    const endTimeField = `${multiMachineManager.currentStage}_end_time`;
    
    if (order[statusField] === 'completed' || order[endTimeField]) {
        showNotification('❌ Lệnh đã hoàn thành', 'warning');
        return;
    }

    // Hiển thị modal chọn máy
    multiMachineManager.showMachineSelectionModal(orderId);
}

// Export cho sử dụng global
window.MultiMachineManager = MultiMachineManager;
window.initializeMultiMachine = initializeMultiMachine;
window.startProductionFromTable = startProductionFromTable; 