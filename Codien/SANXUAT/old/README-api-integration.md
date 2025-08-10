# Production Orders API Integration Guide

## Overview

Hệ thống API cho quản lý lệnh sản xuất đã được tích hợp và tối ưu hóa dựa trên cấu trúc của Smart AC API để phù hợp với quy trình sản xuất carton.

## Files Structure

```
SANXUAT/
├── production-orders.html          # Main UI
├── production-orders-api.js        # API Manager (tương tự smart-ac-api.js)
├── production-config.js           # Configuration & Settings
├── server.js                      # Backend Node.js Server
├── production_orders_database.sql # Database Schema
├── test-api.html                  # API Testing Interface
└── README-api-integration.md      # This file
```

## API Architecture

### 1. Configuration Layer (`production-config.js`)
- **API Endpoints**: Auto-detect local vs remote
- **Database Mappings**: Frontend ↔ Database field mapping
- **Business Rules**: Order types, statuses, validation rules
- **UI Settings**: Date formats, pagination, notifications
- **Feature Flags**: Enable/disable features

### 2. API Layer (`production-orders-api.js`)
- **ProductionOrdersAPI Class**: Main API manager
- **ProductionAPI Global Object**: Simplified interface
- **Error Handling**: Comprehensive error management
- **Data Transformation**: API ↔ Frontend format conversion

### 3. Backend Layer (`server.js`)
- **RESTful APIs**: Full CRUD operations
- **Statistics**: Real-time data analytics
- **Filtering**: Advanced search capabilities
- **Database**: MySQL integration with proper indexing

## Quick Start

### 1. Setup Database
```sql
-- Run the SQL file
SOURCE production_orders_database.sql;
```

### 2. Start Backend Server
```bash
# Install dependencies
npm install express mysql2 cors

# Start server
node server.js
```

### 3. Open Frontend
```bash
# Open in browser
open production-orders.html

# Or test API first
open test-api.html
```

## API Usage Examples

### Basic Operations

```javascript
// Get all orders
const orders = await ProductionAPI.getOrders();

// Get orders with filters
const filteredOrders = await ProductionAPI.getOrders({
    status: 'Đang sản xuất',
    customer_name: 'Dorco vina',
    deployment_date: '2025-03-04'
});

// Get single order
const order = await ProductionAPI.getOrder(123);

// Create new order
const newOrder = {
    deployment_date: '2025-03-04',
    production_order: '01-2503-00070',
    po_number: '25.03.010.01',
    // ... other fields
};
const result = await ProductionAPI.saveOrder(newOrder);

// Update existing order
const updatedOrder = { ...existingOrder, status: 'Hoàn thành' };
const result = await ProductionAPI.saveOrder(updatedOrder, true, order.id);

// Delete order
await ProductionAPI.deleteOrder(123);
```

### Statistics & Analytics

```javascript
// Get overall statistics
const stats = await ProductionAPI.getStats();
console.log(stats);
// {
//   total_orders: 150,
//   total_quantity: 50000,
//   pending_orders: 20,
//   in_progress_orders: 80,
//   completed_orders: 45,
//   cancelled_orders: 5
// }

// Get customer statistics
const customerStats = await ProductionAPI.getCustomerStats();

// Get monthly statistics
const monthlyStats = await ProductionAPI.getMonthlyStats();

// Get customers list
const customers = await ProductionAPI.getCustomers();
```

### Utility Functions

```javascript
// Format numbers (Vietnamese locale)
const formatted = ProductionAPI.formatNumber(16688); // "16,688"

// Format dates
const formatted = ProductionAPI.formatDate('2025-03-04'); // "04/03/2025"

// Get today's date
const today = ProductionAPI.getToday(); // "2025-03-04"

// Validate order data
const validation = ProductionAPI.validateOrder(orderData);
if (!validation.isValid) {
    console.log('Errors:', validation.errors);
}

// Show notifications
ProductionAPI.showNotification('Order saved successfully!', 'success');
ProductionAPI.showNotification('Error occurred!', 'error');
```

## Configuration

### Environment Detection
API tự động phát hiện môi trường:
- **Local**: `http://localhost:3000` (development)
- **Remote**: `https://api.autoslp.com/api` (production)

### Customization
```javascript
// Override API base URL
window.ProductionConfig.API.LOCAL_BASE_URL = 'http://localhost:5000';

// Enable/disable features
window.ProductionConfig.FEATURES.ENABLE_EXPORT = false;

// Modify validation rules
window.ProductionConfig.VALIDATION.REQUIRED_FIELDS.push('new_field');

// Change UI settings
window.ProductionConfig.UI.DEFAULT_PAGE_SIZE = 50;
```

## Error Handling

### API Errors
```javascript
try {
    const orders = await ProductionAPI.getOrders();
} catch (error) {
    console.error('API Error:', error.message);
    ProductionAPI.showNotification(`Error: ${error.message}`, 'error');
}
```

### Validation Errors
```javascript
const orderData = { /* incomplete data */ };
const validation = ProductionAPI.validateOrder(orderData);

if (!validation.isValid) {
    validation.errors.forEach(error => {
        ProductionAPI.showNotification(error, 'error');
    });
}
```

## Testing

### API Testing Interface
Mở `test-api.html` để test các API functions:
- Get Orders
- Get Statistics
- Get Customers  
- Create Test Order

### Manual Testing
```javascript
// Test trong browser console
console.log('API Base URL:', ProductionAPI.API_BASE_URL);

// Test connection
ProductionAPI.getOrders()
    .then(orders => console.log('Orders:', orders))
    .catch(error => console.error('Error:', error));
```

## Performance Optimization

### Pagination
```javascript
// Load orders with pagination
const orders = await ProductionAPI.getOrders({
    limit: 20,
    offset: 0
});
```

### Filtering on Server
```javascript
// Filter trên server để giảm data transfer
const filteredOrders = await ProductionAPI.getOrders({
    status: 'Đang sản xuất',
    search: 'Dorco'
});
```

### Caching
API response có thể được cache ở client side:
```javascript
let cachedOrders = null;
let cacheTime = null;

async function getCachedOrders() {
    const now = Date.now();
    if (cachedOrders && (now - cacheTime) < 300000) { // 5 minutes
        return cachedOrders;
    }
    
    cachedOrders = await ProductionAPI.getOrders();
    cacheTime = now;
    return cachedOrders;
}
```

## Integration with Existing Systems

### Smart AC API Compatibility
API được thiết kế tương tự SmartACAPI để dễ integration:

```javascript
// Tương tự SmartACAPI.getAirConditioners()
const orders = await ProductionAPI.getOrders();

// Tương tự SmartACAPI.saveAirConditioner()
const result = await ProductionAPI.saveOrder(data, isEdit, id);

// Tương tự SmartACAPI.getStatistics()
const stats = await ProductionAPI.getStats();
```

### Webhook Integration (Future)
```javascript
// Webhook support cho real-time updates
const webhookData = {
    action: 'order_created',
    data: orderData,
    timestamp: new Date().toISOString()
};

fetch('https://api.autoslp.com:5678/webhook/production_order', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(webhookData)
});
```

## Troubleshooting

### Common Issues

1. **CORS Error**
   ```javascript
   // Ensure server has CORS enabled
   app.use(cors());
   ```

2. **Database Connection**
   ```javascript
   // Check MySQL connection in server.js
   // Verify database credentials
   ```

3. **API Not Loading**
   ```html
   <!-- Ensure correct script order -->
   <script src="production-config.js"></script>
   <script src="production-orders-api.js"></script>
   ```

4. **Field Mapping Issues**
   ```javascript
   // Check field mappings in production-config.js
   console.log(ProductionConfig.DATABASE.FIELD_MAPPING);
   ```

### Debug Mode
```javascript
// Enable debug logging
window.ProductionConfig.DEBUG.ENABLE_CONSOLE_LOGS = true;
window.ProductionConfig.DEBUG.LOG_LEVEL = 'debug';

// Check logs in browser console
ProductionConfig.Utils.log('debug', 'Testing API', { orders: orders });
```

## Future Enhancements

1. **Real-time Updates**: WebSocket integration
2. **Offline Support**: Service Worker caching
3. **Export/Import**: Excel/CSV support
4. **Notifications**: Email/SMS alerts
5. **Workflow**: Approval processes
6. **Mobile App**: React Native integration

## Support

For technical support or feature requests:
- Check `test-api.html` for API testing
- Review browser console for error messages
- Verify server logs for backend issues
- Check database connection and schema
