// API ENDPOINTS SUMMARY FOR autoslp.duckdns.org
// Base URL: https://autoslp.duckdns.org/api

// =============================================
// ✅ CORRECT ENDPOINTS AFTER FIX:
// =============================================

// 1. GET Orders by Stage:
// ✅ https://autoslp.duckdns.org/data/production_orders?current_stage=xa

// 2. GET Order Details:
// ✅ https://autoslp.duckdns.org/data/production_orders/1

// 3. POST Handover to Next Stage:
// ✅ https://autoslp.duckdns.org/api/handover_to_next_stage

// 4. PUT Update Stage Output:
// ✅ https://autoslp.duckdns.org/api/production_orders/1/stage_output

// =============================================
// ❌ WRONG ENDPOINTS (BEFORE FIX):
// =============================================

// ❌ https://autoslp.duckdns.org/api/data/production_orders?current_stage=xa  (extra /api)
// ❌ https://autoslp.duckdns.org/api/data/production_orders/1                 (extra /api)
// ❌ https://autoslp.duckdns.org/api/api/handover_to_next_stage               (double /api)
// ❌ https://autoslp.duckdns.org/api/api/production_orders/1/stage_output     (double /api)

// =============================================
// EXPLANATION:
// =============================================

// The server has two different endpoint groups:
// 1. /data/* endpoints - for basic CRUD operations (don't need /api prefix)
// 2. /api/* endpoints - for complex operations (already include /api in path)

// Our baseURL is 'https://autoslp.duckdns.org/api'
// So we need to:
// - Remove /api for data endpoints: baseURL.replace('/api', '') + '/data/...'
// - Keep /api for api endpoints: baseURL + '/handover_to_next_stage'

console.log('API Endpoints Documentation loaded');
