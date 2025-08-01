// API Configuration
const API_CONFIG = {
    // Base URL cho API
    BASE_URL: 'https://autoslp.duckdns.org',
    
    // API Endpoints
    ENDPOINTS: {
        // Machine Management
        AVAILABLE_MACHINES: '/api/data/available_machines',
        MACHINE_STATUS: '/api/data/machine_status',
        START_ORDER_ON_MACHINE: '/api/data/start_order_on_machine',
        END_ORDER_ON_MACHINE: '/api/data/end_order_on_machine',
        CHECK_MACHINE: '/api/data/check_machine',
        
        // Production Orders
        PRODUCTION_ORDERS: '/api/data/production_orders',
        PRODUCTION_ORDER_BY_ID: '/api/data/production_orders'
    },
    
    // Helper function để tạo URL đầy đủ
    getUrl: function(endpoint) {
        return this.BASE_URL + endpoint;
    },
    
    // Helper function để tạo URL với parameters
    getUrlWithParams: function(endpoint, params = {}) {
        const url = new URL(this.BASE_URL + endpoint);
        Object.keys(params).forEach(key => {
            url.searchParams.append(key, params[key]);
        });
        return url.toString();
    }
};

// Export cho Node.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = API_CONFIG;
}

// Export cho browser
if (typeof window !== 'undefined') {
    window.API_CONFIG = API_CONFIG;
} 