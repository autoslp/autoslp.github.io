// API Configuration cho Production Orders System
// Cấu hình tập trung cho các API endpoints và settings

window.ProductionConfig = {
    // API Endpoints
    API: {
        // Local development
        LOCAL_BASE_URL: 'http://localhost:3000',
        
        // Production/Remote server
        REMOTE_BASE_URL: 'https://autoslp.duckdns.org/api',
        
        // Webhook endpoints (for advanced features)
        WEBHOOK_BASE_URL: 'https://autoslp.duckdns.org:5678/webhook',
        
        // Current environment detection
        getCurrentBaseURL: function() {
            const hostname = window.location.hostname;
            const isLocal = hostname === 'localhost' || hostname === '127.0.0.1' || hostname.startsWith('192.168.');
            return isLocal ? this.LOCAL_BASE_URL : this.REMOTE_BASE_URL;
        }
    },
    
    // Database table và field mappings
    DATABASE: {
        TABLE_NAME: 'production_orders',
        
        // Field mappings từ frontend sang database
        FIELD_MAPPING: {
            'deploymentDate': 'deployment_date',
            'productionOrder': 'production_order',
            'poNumber': 'po_number',
            'salesOrderCode': 'sales_order_code',
            'orderDate': 'order_date',
            'deliveryDate': 'delivery_date',
            'internalProductCode': 'internal_product_code',
            'orderType': 'order_type',
            'customerCode': 'customer_code',
            'customerName': 'customer_name',
            'productName': 'product_name',
            'notDeployedReason': 'not_deployed_reason',
            'salesNote': 'sales_note',
            'customerProductionNote': 'customer_production_note',
            'orderQuantity': 'order_quantity',
            'requiredQuantity': 'required_quantity',
            'deployedQuantity': 'deployed_quantity',
            'offsetWaste': 'offset_waste',
            'sheetCount': 'sheet_count',
            'productLength': 'product_length',
            'productWidth': 'product_width',
            'productHeight': 'product_height',
            'paperLength': 'paper_length',
            'paperWidth': 'paper_width',
            'partCount': 'part_count',
            'colorCount': 'color_count',
            'customerGroup': 'customer_group',
            'paperType': 'paper_type',
            'paperWeight': 'paper_weight',
            'workStage': 'work_stage',
            'createdAt': 'created_at',
            'updatedAt': 'updated_at'
        }
    },
    
    // UI Settings
    UI: {
        // Pagination
        DEFAULT_PAGE_SIZE: 20,
        MAX_PAGE_SIZE: 100,
        
        // Date formats
        DATE_FORMAT: 'dd/mm/yyyy',
        DATETIME_FORMAT: 'dd/mm/yyyy HH:mm',
        
        // Number formats
        NUMBER_LOCALE: 'vi-VN',
        
        // Toast notification settings
        TOAST_DURATION: 5000,
        
        // Loading states
        LOADING_DELAY: 300,
        
        // Table settings
        TABLE_RESPONSIVE_BREAKPOINT: 768,
        
        // Status colors
        STATUS_COLORS: {
            'Chờ triển khai': 'warning',
            'Đang sản xuất': 'info',
            'Hoàn thành': 'success',
            'Đã hủy': 'danger'
        }
    },
    
    // Validation Rules
    VALIDATION: {
        REQUIRED_FIELDS: [
            'production_order',
            'po_number',
            'internal_product_code',
            'customer_code',
            'customer_name',
            'product_name'
        ],
        
        MAX_LENGTHS: {
            'production_order': 50,
            'po_number': 50,
            'sales_order_code': 100,
            'internal_product_code': 100,
            'customer_code': 50,
            'customer_name': 255,
            'product_name': 1000,
            'version': 20,
            'paper_type': 100
        },
        
        NUMERIC_FIELDS: [
            'order_quantity',
            'inventory',
            'required_quantity',
            'deployed_quantity',
            'offset_waste',
            'waste',
            'sheet_count',
            'product_length',
            'product_width',
            'product_height',
            'paper_length',
            'paper_width',
            'part_count',
            'color_count',
            'paper_weight'
        ]
    },
    
    // Business Logic
    BUSINESS: {
        // Order types
        ORDER_TYPES: [
            'Thường',
            'Khẩn',
            'Mẫu',
            'Gia công',
            'Đại trà',
            'Bù'
        ],
        
        // Customer groups
        CUSTOMER_GROUPS: [
            'VIP',
            'Thường',
            'Mới',
            'Chiến lược',
            'Nhóm 2',
            'Nhóm 3',
            'Nhóm 4'
        ],
        
        // Paper types
        PAPER_TYPES: [
            'BC',
            'BE',
            'Kraft',
            'Duplex',
            'Couche',
            'Ivory',
            'Couches TQ - Hikote',
            'Duplex Hanson',
            'Ivory NingBo'
        ],
        
        // Work stages
        WORK_STAGES: [
            'XẢ',
            'XÉN',
            'IN',
            'BỒI',
            'BẾ',
            'DÁN',
            'KHO',
            'Xả-Xén-In-Bế-Dán-Đóng thùng'
        ],
        
        // Order statuses
        ORDER_STATUSES: [
            'Chờ triển khai',
            'Đang sản xuất',
            'Hoàn thành',
            'Đã hủy'
        ],
        
        // Default values
        DEFAULTS: {
            status: 'Chờ triển khai',
            order_quantity: 0,
            inventory: 0,
            required_quantity: 0,
            deployed_quantity: 0,
            offset_waste: 0,
            waste: 0,
            sheet_count: 0,
            part_count: 0,
            color_count: 0
        }
    },
    
    // Feature flags
    FEATURES: {
        ENABLE_EXPORT: true,
        ENABLE_IMPORT: true,
        ENABLE_BATCH_OPERATIONS: true,
        ENABLE_NOTIFICATIONS: true,
        ENABLE_STATISTICS: true,
        ENABLE_FILTERING: true,
        ENABLE_SEARCH: true,
        ENABLE_PAGINATION: true,
        ENABLE_SORTING: true
    },
    
    // Debug settings
    DEBUG: {
        ENABLE_CONSOLE_LOGS: true,
        ENABLE_API_LOGGING: true,
        ENABLE_ERROR_REPORTING: true,
        LOG_LEVEL: 'info' // 'debug', 'info', 'warn', 'error'
    }
};

// Utility functions for configuration
window.ProductionConfig.Utils = {
    // Get current API base URL
    getApiBaseUrl: function() {
        return this.API.getCurrentBaseURL();
    },
    
    // Map frontend field to database field
    mapFieldToDatabase: function(frontendField) {
        return this.DATABASE.FIELD_MAPPING[frontendField] || frontendField;
    },
    
    // Map database field to frontend field
    mapFieldFromDatabase: function(databaseField) {
        for (const [frontend, database] of Object.entries(this.DATABASE.FIELD_MAPPING)) {
            if (database === databaseField) {
                return frontend;
            }
        }
        return databaseField;
    },
    
    // Get status color class
    getStatusColor: function(status) {
        return this.UI.STATUS_COLORS[status] || 'secondary';
    },
    
    // Check if feature is enabled
    isFeatureEnabled: function(featureName) {
        return this.FEATURES[featureName] || false;
    },
    
    // Log debug information
    log: function(level, message, data = null) {
        if (!this.DEBUG.ENABLE_CONSOLE_LOGS) return;
        
        const logLevels = ['debug', 'info', 'warn', 'error'];
        const currentLevelIndex = logLevels.indexOf(this.DEBUG.LOG_LEVEL);
        const messageLevelIndex = logLevels.indexOf(level);
        
        if (messageLevelIndex >= currentLevelIndex) {
            const timestamp = new Date().toISOString();
            const prefix = `[${timestamp}] [${level.toUpperCase()}] Production Orders:`;
            
            if (data) {
                console[level](prefix, message, data);
            } else {
                console[level](prefix, message);
            }
        }
    }
}.bind(window.ProductionConfig);

// Export configuration
if (typeof module !== 'undefined' && module.exports) {
    module.exports = window.ProductionConfig;
}

// Log configuration load
window.ProductionConfig.Utils.log('info', 'Production Orders configuration loaded successfully');
