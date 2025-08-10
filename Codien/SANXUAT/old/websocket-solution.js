// WebSocket Solution cho Real-time Production Order Management
// Cách tiếp cận này sử dụng WebSocket để đồng bộ trạng thái real-time

class ProductionWebSocketManager {
    constructor() {
        this.ws = null;
        this.reconnectAttempts = 0;
        this.maxReconnectAttempts = 5;
        this.reconnectDelay = 1000;
        this.stage = null; // 'xa' hoặc 'xen'
        this.onOrderStatusChange = null;
        this.onRunningOrderUpdate = null;
    }

    // Kết nối WebSocket
    connect(stage) {
        this.stage = stage;
        const wsUrl = `ws://${window.location.hostname}:3001/ws/production/${stage}`;
        
        try {
            this.ws = new WebSocket(wsUrl);
            this.setupEventHandlers();
        } catch (error) {
            console.error('❌ Lỗi kết nối WebSocket:', error);
            this.scheduleReconnect();
        }
    }

    // Thiết lập event handlers
    setupEventHandlers() {
        this.ws.onopen = () => {
            console.log('✅ WebSocket connected for stage:', this.stage);
            this.reconnectAttempts = 0;
            
            // Gửi message để đăng ký nhận updates
            this.send({
                type: 'subscribe',
                stage: this.stage
            });
        };

        this.ws.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                this.handleMessage(data);
            } catch (error) {
                console.error('❌ Lỗi parse WebSocket message:', error);
            }
        };

        this.ws.onclose = () => {
            console.log('🔌 WebSocket disconnected');
            this.scheduleReconnect();
        };

        this.ws.onerror = (error) => {
            console.error('❌ WebSocket error:', error);
        };
    }

    // Xử lý message từ server
    handleMessage(data) {
        switch (data.type) {
            case 'order_status_change':
                if (this.onOrderStatusChange) {
                    this.onOrderStatusChange(data.order);
                }
                break;
                
            case 'running_order_update':
                if (this.onRunningOrderUpdate) {
                    this.onRunningOrderUpdate(data.runningOrder);
                }
                this.updateUIForRunningOrder(data.runningOrder);
                break;
                
            case 'production_started':
                this.handleProductionStarted(data);
                break;
                
            case 'production_ended':
                this.handleProductionEnded(data);
                break;
                
            case 'error':
                console.error('❌ Server error:', data.message);
                showNotification(data.message, 'error');
                break;
                
            default:
                console.log('📨 Unknown message type:', data.type);
        }
    }

    // Gửi message đến server
    send(data) {
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            this.ws.send(JSON.stringify(data));
        } else {
            console.warn('⚠️ WebSocket not connected, message queued');
            // Có thể implement message queue ở đây
        }
    }

    // Yêu cầu bắt đầu sản xuất
    requestStartProduction(orderId, workerName, machineName, note) {
        this.send({
            type: 'start_production',
            stage: this.stage,
            orderId: orderId,
            workerName: workerName,
            machineName: machineName,
            note: note
        });
    }

    // Yêu cầu kết thúc sản xuất
    requestEndProduction(orderId, outputQuantity, goodQuantity, ngQuantity) {
        this.send({
            type: 'end_production',
            stage: this.stage,
            orderId: orderId,
            outputQuantity: outputQuantity,
            goodQuantity: goodQuantity,
            ngQuantity: ngQuantity
        });
    }

    // Xử lý khi sản xuất bắt đầu
    handleProductionStarted(data) {
        showNotification(`✅ Lệnh ${data.productionOrder} đã bắt đầu sản xuất`, 'success');
        
        // Cập nhật UI
        this.updateUIForRunningOrder(data.runningOrder);
        
        // Refresh data
        if (typeof refreshData === 'function') {
            refreshData();
        }
    }

    // Xử lý khi sản xuất kết thúc
    handleProductionEnded(data) {
        showNotification(`✅ Lệnh ${data.productionOrder} đã kết thúc sản xuất`, 'success');
        
        // Cập nhật UI
        this.updateUIForRunningOrder(null);
        
        // Refresh data
        if (typeof refreshData === 'function') {
            refreshData();
        }
    }

    // Cập nhật UI dựa trên lệnh đang chạy
    updateUIForRunningOrder(runningOrder) {
        // Cập nhật trạng thái các nút bắt đầu
        this.updateStartButtonsState(runningOrder);
        
        // Cập nhật thông báo trạng thái
        this.updateStatusMessage(runningOrder);
        
        // Cập nhật timer nếu có
        if (runningOrder && typeof startProductionTimer === 'function') {
            startProductionTimer(runningOrder.startTime);
        }
    }

    // Cập nhật trạng thái các nút bắt đầu
    updateStartButtonsState(runningOrder) {
        const tableRows = document.querySelectorAll('#stageTableBody tr');
        
        tableRows.forEach(row => {
            const orderId = parseInt(row.getAttribute('data-order-id'));
            const startButton = row.querySelector('.btn-start-production');
            
            if (startButton) {
                if (runningOrder && runningOrder.orderId !== orderId) {
                    // Vô hiệu hóa nút nếu có lệnh khác đang chạy
                    startButton.disabled = true;
                    startButton.title = `Không thể bắt đầu vì lệnh ${runningOrder.productionOrder} đang chạy`;
                    startButton.classList.add('btn-secondary');
                    startButton.classList.remove('btn-primary');
                } else if (runningOrder && runningOrder.orderId === orderId) {
                    // Nút của lệnh đang chạy
                    startButton.disabled = true;
                    startButton.title = 'Lệnh đang chạy';
                    startButton.classList.add('btn-warning');
                    startButton.classList.remove('btn-primary');
                } else {
                    // Không có lệnh nào đang chạy, kiểm tra trạng thái lệnh
                    const order = ordersData.find(o => o.id === orderId);
                    if (order) {
                        const statusField = `${this.stage}_status`;
                        const endTimeField = `${this.stage}_end_time`;
                        
                        if (order[statusField] === 'completed' || order[endTimeField]) {
                            startButton.disabled = true;
                            startButton.title = 'Lệnh đã hoàn thành';
                            startButton.classList.add('btn-secondary');
                            startButton.classList.remove('btn-primary');
                        } else {
                            startButton.disabled = false;
                            startButton.title = 'Bắt đầu sản xuất';
                            startButton.classList.add('btn-primary');
                            startButton.classList.remove('btn-secondary', 'btn-warning');
                        }
                    }
                }
            }
        });
        
        // Cập nhật nút trong sidebar
        this.updateSidebarButton(runningOrder);
    }

    // Cập nhật nút trong sidebar
    updateSidebarButton(runningOrder) {
        const sidebarStartButton = document.querySelector('.detail-section .btn-primary');
        if (sidebarStartButton && currentEditingOrder) {
            if (runningOrder && runningOrder.orderId !== currentEditingOrder.id) {
                sidebarStartButton.disabled = true;
                sidebarStartButton.title = `Không thể bắt đầu vì lệnh ${runningOrder.productionOrder} đang chạy`;
            } else if (runningOrder && runningOrder.orderId === currentEditingOrder.id) {
                sidebarStartButton.disabled = true;
                sidebarStartButton.title = 'Lệnh đang chạy';
            } else {
                const statusField = `${this.stage}_status`;
                const endTimeField = `${this.stage}_end_time`;
                
                if (currentEditingOrder[statusField] === 'completed' || currentEditingOrder[endTimeField]) {
                    sidebarStartButton.disabled = true;
                    sidebarStartButton.title = 'Lệnh đã hoàn thành';
                } else {
                    sidebarStartButton.disabled = false;
                    sidebarStartButton.title = 'Bắt đầu sản xuất';
                }
            }
        }
    }

    // Cập nhật thông báo trạng thái
    updateStatusMessage(runningOrder) {
        const statusElement = document.getElementById('running-status-message');
        if (statusElement) {
            if (runningOrder) {
                statusElement.innerHTML = `
                    <div class="alert alert-warning">
                        <i class="bi bi-exclamation-triangle"></i>
                        <strong>Lệnh ${runningOrder.productionOrder}</strong> đang chạy
                        <br><small>Bắt đầu lúc: ${new Date(runningOrder.startTime).toLocaleString()}</small>
                    </div>
                `;
                statusElement.style.display = 'block';
            } else {
                statusElement.style.display = 'none';
            }
        }
    }

    // Lên lịch kết nối lại
    scheduleReconnect() {
        if (this.reconnectAttempts < this.maxReconnectAttempts) {
            this.reconnectAttempts++;
            console.log(`🔄 Scheduling reconnect attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts}`);
            
            setTimeout(() => {
                this.connect(this.stage);
            }, this.reconnectDelay * this.reconnectAttempts);
        } else {
            console.error('❌ Max reconnect attempts reached');
            showNotification('Mất kết nối với server. Vui lòng refresh trang.', 'error');
        }
    }

    // Ngắt kết nối
    disconnect() {
        if (this.ws) {
            this.ws.close();
            this.ws = null;
        }
    }
}

// Global WebSocket manager instance
let productionWS = null;

// Khởi tạo WebSocket khi trang load
function initializeWebSocket(stage) {
    if (productionWS) {
        productionWS.disconnect();
    }
    
    productionWS = new ProductionWebSocketManager();
    
    // Thiết lập callbacks
    productionWS.onOrderStatusChange = (order) => {
        console.log('📊 Order status changed:', order);
        // Có thể thêm logic xử lý thêm ở đây
    };
    
    productionWS.onRunningOrderUpdate = (runningOrder) => {
        console.log('🏃 Running order updated:', runningOrder);
        // Có thể thêm logic xử lý thêm ở đây
    };
    
    // Kết nối
    productionWS.connect(stage);
}

// Hàm bắt đầu sản xuất qua WebSocket
async function startProductionViaWebSocket(orderId, workerName, machineName, note) {
    if (!productionWS) {
        showNotification('❌ WebSocket chưa kết nối', 'error');
        return false;
    }
    
    try {
        productionWS.requestStartProduction(orderId, workerName, machineName, note);
        return true;
    } catch (error) {
        console.error('❌ Lỗi bắt đầu sản xuất qua WebSocket:', error);
        showNotification('Lỗi bắt đầu sản xuất: ' + error.message, 'error');
        return false;
    }
}

// Hàm kết thúc sản xuất qua WebSocket
async function endProductionViaWebSocket(orderId, outputQuantity, goodQuantity, ngQuantity) {
    if (!productionWS) {
        showNotification('❌ WebSocket chưa kết nối', 'error');
        return false;
    }
    
    try {
        productionWS.requestEndProduction(orderId, outputQuantity, goodQuantity, ngQuantity);
        return true;
    } catch (error) {
        console.error('❌ Lỗi kết thúc sản xuất qua WebSocket:', error);
        showNotification('Lỗi kết thúc sản xuất: ' + error.message, 'error');
        return false;
    }
}

// Export cho sử dụng global
window.ProductionWebSocketManager = ProductionWebSocketManager;
window.initializeWebSocket = initializeWebSocket;
window.startProductionViaWebSocket = startProductionViaWebSocket;
window.endProductionViaWebSocket = endProductionViaWebSocket; 