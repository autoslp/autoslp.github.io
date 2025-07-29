// Production Orders Management - API Manager
// Quản lý tất cả các API calls cho hệ thống lệnh sản xuất

class ProductionOrdersAPI {
    constructor() {
        // API Configuration - có thể chuyển đổi giữa local và remote
        this.API_BASE_URL = window.location.hostname === 'localhost' ? 
            'http://localhost:3000' : 
            'https://autoslp.duckdns.org/api';
        this.WEBHOOK_BASE_URL = 'https://autoslp.duckdns.org:5678/webhook';
    }

    // === PRODUCTION ORDERS API ===
    async getProductionOrders(filters = {}) {
        try {
            let url = `${this.API_BASE_URL}/data/production_orders`;
            const params = new URLSearchParams();
            
            // Thêm filters vào query params
            if (filters.deployment_date) params.append('deployment_date', filters.deployment_date);
            if (filters.status) params.append('status', filters.status);
            if (filters.customer_name) params.append('customer_name', filters.customer_name);
            if (filters.search) params.append('search', filters.search);
            if (filters.limit) params.append('limit', filters.limit);
            if (filters.offset) params.append('offset', filters.offset);
            
            if (params.toString()) {
                url += '?' + params.toString();
            }
            
            console.log('Fetching production orders from:', url);
            const response = await fetch(url);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const data = await response.json();
            return Array.isArray(data) ? data : [];
        } catch (error) {
            console.error('Error fetching production orders:', error);
            throw error;
        }
    }

    async getProductionOrder(id) {
        try {
            const response = await fetch(`${this.API_BASE_URL}/data/production_orders/${id}`);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            return await response.json();
        } catch (error) {
            console.error('Error fetching production order:', error);
            throw error;
        }
    }

    async saveProductionOrder(data, isEdit = false, id = null) {
        try {
            const method = isEdit ? 'PUT' : 'POST';
            const url = isEdit ? 
                `${this.API_BASE_URL}/data/production_orders/${id}` : 
                `${this.API_BASE_URL}/data/production_orders`;
            
            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error saving production order:', error);
            throw error;
        }
    }

    async deleteProductionOrder(id) {
        try {
            const response = await fetch(`${this.API_BASE_URL}/data/production_orders/${id}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error deleting production order:', error);
            throw error;
        }
    }

    // === STATISTICS API ===
    async getProductionOrdersStats() {
        try {
            const response = await fetch(`${this.API_BASE_URL}/data/production_orders_stats`);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            return await response.json();
        } catch (error) {
            console.error('Error fetching production orders stats:', error);
            // Return empty stats as fallback
            return {
                total_orders: 0,
                total_quantity: 0,
                pending_orders: 0,
                in_progress_orders: 0,
                completed_orders: 0,
                cancelled_orders: 0
            };
        }
    }

    async getCustomerOrdersStats() {
        try {
            const response = await fetch(`${this.API_BASE_URL}/data/customer_orders_stats`);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            return await response.json();
        } catch (error) {
            console.error('Error fetching customer orders stats:', error);
            return [];
        }
    }

    async getMonthlyOrdersStats() {
        try {
            const response = await fetch(`${this.API_BASE_URL}/data/monthly_orders_stats`);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            return await response.json();
        } catch (error) {
            console.error('Error fetching monthly orders stats:', error);
            return [];
        }
    }

    // === CUSTOMERS API ===
    async getCustomers() {
        try {
            const response = await fetch(`${this.API_BASE_URL}/data/customers`);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const data = await response.json();
            return Array.isArray(data) ? data : [];
        } catch (error) {
            console.error('Error fetching customers:', error);
            return [];
        }
    }

    // === UTILITY FUNCTIONS ===
    transformToAPIFormat(data) {
        // Transform frontend form data to API format
        return {
            deployment_date: data.deploymentDate,
            production_order: data.productionOrder,
            po_number: data.poNumber,
            sales_order_code: data.salesOrderCode,
            order_date: data.orderDate,
            delivery_date: data.deliveryDate,
            internal_product_code: data.internalProductCode,
            order_type: data.orderType,
            customer_code: data.customerCode,
            customer_name: data.customerName,
            product_name: data.productName,
            version: data.version,
            not_deployed_reason: data.notDeployedReason,
            sales_note: data.salesNote,
            customer_production_note: data.customerProductionNote,
            order_quantity: data.orderQuantity,
            inventory: data.inventory,
            required_quantity: data.requiredQuantity,
            deployed_quantity: data.deployedQuantity,
            offset_waste: data.offsetWaste,
            waste: data.waste,
            sheet_count: data.sheetCount,
            product_length: data.productLength,
            product_width: data.productWidth,
            product_height: data.productHeight,
            paper_length: data.paperLength,
            paper_width: data.paperWidth,
            part_count: data.partCount,
            color_count: data.colorCount,
            customer_group: data.customerGroup,
            paper_type: data.paperType,
            paper_weight: data.paperWeight,
            work_stage: data.workStage,
            status: data.status
        };
    }

    transformFromAPIFormat(apiData) {
        // Transform API data to frontend format
        if (!apiData) return null;
        
        return {
            id: apiData.id,
            deploymentDate: apiData.deployment_date,
            productionOrder: apiData.production_order,
            poNumber: apiData.po_number,
            salesOrderCode: apiData.sales_order_code,
            orderDate: apiData.order_date,
            deliveryDate: apiData.delivery_date,
            internalProductCode: apiData.internal_product_code,
            orderType: apiData.order_type,
            customerCode: apiData.customer_code,
            customerName: apiData.customer_name,
            productName: apiData.product_name,
            version: apiData.version,
            notDeployedReason: apiData.not_deployed_reason,
            salesNote: apiData.sales_note,
            customerProductionNote: apiData.customer_production_note,
            orderQuantity: apiData.order_quantity,
            inventory: apiData.inventory,
            requiredQuantity: apiData.required_quantity,
            deployedQuantity: apiData.deployed_quantity,
            offsetWaste: apiData.offset_waste,
            waste: apiData.waste,
            sheetCount: apiData.sheet_count,
            productLength: apiData.product_length,
            productWidth: apiData.product_width,
            productHeight: apiData.product_height,
            paperLength: apiData.paper_length,
            paperWidth: apiData.paper_width,
            partCount: apiData.part_count,
            colorCount: apiData.color_count,
            customerGroup: apiData.customer_group,
            paperType: apiData.paper_type,
            paperWeight: apiData.paper_weight,
            workStage: apiData.work_stage,
            status: apiData.status,
            createdAt: apiData.created_at,
            updatedAt: apiData.updated_at
        };
    }

    // === BATCH OPERATIONS ===
    async batchUpdateStatus(ids, newStatus) {
        try {
            // Thực hiện cập nhật từng item một vì chưa có batch API
            const promises = ids.map(id => 
                this.saveProductionOrder({ status: newStatus }, true, id)
            );
            
            const results = await Promise.all(promises);
            return { success: true, results: results };
        } catch (error) {
            console.error('Error batch updating status:', error);
            throw error;
        }
    }

    // === EXPORT/IMPORT ===
    async exportToExcel(filters = {}) {
        try {
            const orders = await this.getProductionOrders(filters);
            // Implement Excel export logic here
            return { success: true, data: orders };
        } catch (error) {
            console.error('Error exporting to Excel:', error);
            throw error;
        }
    }

    async importFromExcel(file) {
        try {
            // Implement Excel import logic here
            const formData = new FormData();
            formData.append('file', file);
            
            const response = await fetch(`${this.API_BASE_URL}/data/production_orders/import`, {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                throw new Error(`Import error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error importing from Excel:', error);
            throw error;
        }
    }
}

// Create global instance for easy access
window.ProductionOrdersAPI = new ProductionOrdersAPI();

// Also create a simplified global API object similar to SmartACAPI
window.ProductionAPI = {
    // API Configuration
    API_BASE_URL: window.location.hostname === 'localhost' ? 
        'http://localhost:3000' : 
        'https://autoslp.duckdns.org/api',

    // === PRODUCTION ORDERS CRUD ===
    getOrders: async function(filters = {}) {
        return await window.ProductionOrdersAPI.getProductionOrders(filters);
    },

    getOrder: async function(id) {
        return await window.ProductionOrdersAPI.getProductionOrder(id);
    },

    saveOrder: async function(data, isEdit = false, id = null) {
        return await window.ProductionOrdersAPI.saveProductionOrder(data, isEdit, id);
    },

    deleteOrder: async function(id) {
        return await window.ProductionOrdersAPI.deleteProductionOrder(id);
    },

    // === STATISTICS ===
    getStats: async function() {
        return await window.ProductionOrdersAPI.getProductionOrdersStats();
    },

    getCustomerStats: async function() {
        return await window.ProductionOrdersAPI.getCustomerOrdersStats();
    },

    getMonthlyStats: async function() {
        return await window.ProductionOrdersAPI.getMonthlyOrdersStats();
    },

    // === CUSTOMERS ===
    getCustomers: async function() {
        return await window.ProductionOrdersAPI.getCustomers();
    },

    // === UTILITY ===
    formatNumber: function(num) {
        if (!num && num !== 0) return '';
        return new Intl.NumberFormat('vi-VN').format(num);
    },

    formatDate: function(date, format = 'dd/mm/yyyy') {
        if (!date) return '';
        const d = new Date(date);
        const day = String(d.getDate()).padStart(2, '0');
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const year = d.getFullYear();
        
        return format
            .replace('dd', day)
            .replace('mm', month)
            .replace('yyyy', year);
    },

    getToday: function() {
        return new Date().toISOString().split('T')[0];
    },

    // === VALIDATION ===
    validateOrder: function(data) {
        const errors = [];
        
        if (!data.production_order) errors.push('Lệnh sản xuất không được để trống');
        if (!data.po_number) errors.push('Số PO không được để trống');
        if (!data.internal_product_code) errors.push('Mã code SP nội bộ không được để trống');
        if (!data.customer_code) errors.push('Mã code khách hàng không được để trống');
        if (!data.customer_name) errors.push('Tên khách hàng không được để trống');
        if (!data.product_name) errors.push('Tên sản phẩm không được để trống');
        
        return {
            isValid: errors.length === 0,
            errors: errors
        };
    },

    // === NOTIFICATIONS ===
    showNotification: function(message, type = 'success') {
        const toast = document.createElement('div');
        toast.className = `alert alert-${type === 'error' ? 'danger' : 'success'} position-fixed`;
        toast.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 300px; animation: slideInRight 0.3s ease;';
        toast.innerHTML = `
            <div class="d-flex align-items-center">
                <i class="bi bi-${type === 'error' ? 'exclamation-triangle' : 'check-circle'} me-2"></i>
                <span>${message}</span>
                <button type="button" class="btn-close ms-auto" onclick="this.parentElement.parentElement.remove()"></button>
            </div>
        `;
        document.body.appendChild(toast);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            if (toast.parentElement) {
                toast.style.animation = 'slideOutRight 0.3s ease';
                setTimeout(() => toast.remove(), 300);
            }
        }, 5000);
    },

    showLoading: function() {
        const loading = document.getElementById('loadingOverlay');
        if (loading) loading.style.display = 'flex';
    },

    hideLoading: function() {
        const loading = document.getElementById('loadingOverlay');
        if (loading) loading.style.display = 'none';
    }
};

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ProductionOrdersAPI, ProductionAPI: window.ProductionAPI };
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOutRight {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);

console.log('Production Orders API initialized successfully');
