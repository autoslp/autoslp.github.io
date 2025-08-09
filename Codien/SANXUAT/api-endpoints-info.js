// API ENDPOINTS SUMMARY FOR api.autoslp.com
// Base URL: https://api.autoslp.com/api

// =============================================
// ✅ CORRECT ENDPOINTS AFTER FIX:
// =============================================

// 1. GET Orders by Stage:
// ✅ https://api.autoslp.com/data/production_orders?current_stage=xa

// 2. GET Order Details:
// ✅ https://api.autoslp.com/data/production_orders/1

// 3. POST Handover to Next Stage:
// ✅ https://api.autoslp.com/api/handover_to_next_stage

// 4. PUT Update Stage Output:
// ✅ https://api.autoslp.com/api/production_orders/1/stage_output

// =============================================
// ❌ WRONG ENDPOINTS (BEFORE FIX):
// =============================================

// ❌ https://api.autoslp.com/api/data/production_orders?current_stage=xa  (extra /api)
// ❌ https://api.autoslp.com/api/data/production_orders/1                 (extra /api)
// ❌ https://api.autoslp.com/api/api/handover_to_next_stage               (double /api)
// ❌ https://api.autoslp.com/api/api/production_orders/1/stage_output     (double /api)

// =============================================
// EXPLANATION:
// =============================================

// The server has two different endpoint groups:
// 1. /data/* endpoints - for basic CRUD operations (don't need /api prefix)
// 2. /api/* endpoints - for complex operations (already include /api in path)

// Our baseURL is 'https://api.autoslp.com/api'
// So we need to:
// - Remove /api for data endpoints: baseURL.replace('/api', '') + '/data/...'
// - Keep /api for api endpoints: baseURL + '/handover_to_next_stage'

console.log('API Endpoints Documentation loaded');
