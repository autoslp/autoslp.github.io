// Settings Data Manager - Enhanced với Database Integration
class SettingsManager {
    constructor() {
        this.apiBaseUrl = 'https://api.autoslp.com/api/data';
        this.webhookBaseUrl = 'https://api.autoslp.com:5678/webhook';
        
        this.data = {
            acTypes: [],
            areas: [],
            locations: [],
            brands: []
        };
        this.loadFromLocalStorage();
    }

    // Load data from localStorage
    loadFromLocalStorage() {
        try {
            const saved = localStorage.getItem('ac_settings_data');
            if (saved) {
                this.data = JSON.parse(saved);
            } else {
                this.loadDefaultData();
            }
        } catch (error) {
            console.error('Error loading settings:', error);
            this.loadDefaultData();
        }
    }

    // Save data to localStorage
    saveToLocalStorage() {
        try {
            localStorage.setItem('ac_settings_data', JSON.stringify(this.data));
        } catch (error) {
            console.error('Error saving settings:', error);
        }
    }

    // Load default sample data
    loadDefaultData() {
        this.data = {
            acTypes: [
                { id: 1, name: 'Điều hòa Split', code: 'split', status: 'active', count: 15 },
                { id: 2, name: 'Điều hòa Multi', code: 'multi', status: 'active', count: 8 },
                { id: 3, name: 'Điều hòa Trung tâm', code: 'central', status: 'active', count: 3 },
                { id: 4, name: 'Điều hòa Âm trần', code: 'cassette', status: 'active', count: 5 }
            ],
            areas: [
                { id: 1, name: 'Tầng 1', description: 'Tầng trệt - Khu vực tiếp khách và văn phòng', count: 8 },
                { id: 2, name: 'Tầng 2', description: 'Tầng 2 - Phòng họp và làm việc', count: 12 },
                { id: 3, name: 'Tầng 3', description: 'Tầng 3 - Phòng giám đốc và hành chính', count: 6 },
                { id: 4, name: 'Xưởng sản xuất', description: 'Khu vực sản xuất và kho bãi', count: 5 }
            ],
            locations: [
                { id: 1, area: 'Tầng 1', name: 'Phòng tiếp khách', code: 'T1-TK', count: 2 },
                { id: 2, area: 'Tầng 1', name: 'Phòng chờ', code: 'T1-CHO', count: 1 },
                { id: 3, area: 'Tầng 1', name: 'Văn phòng 1', code: 'T1-VP1', count: 3 },
                { id: 4, area: 'Tầng 2', name: 'Phòng họp lớn', code: 'T2-HOP', count: 2 },
                { id: 5, area: 'Tầng 2', name: 'Văn phòng 2', code: 'T2-VP2', count: 4 },
                { id: 6, area: 'Tầng 3', name: 'Phòng giám đốc', code: 'T3-GD', count: 1 },
                { id: 7, area: 'Xưởng sản xuất', name: 'Khu vực máy cắt', code: 'XSX-CAT', count: 3 }
            ],
            brands: [
                { id: 1, name: 'Daikin', country: 'Nhật Bản', website: 'https://www.daikin.com.vn', count: 12 },
                { id: 2, name: 'Mitsubishi Electric', country: 'Nhật Bản', website: 'https://www.mitsubishielectric.com.vn', count: 8 },
                { id: 3, name: 'LG', country: 'Hàn Quốc', website: 'https://www.lg.com/vn', count: 6 },
                { id: 4, name: 'Panasonic', country: 'Nhật Bản', website: 'https://www.panasonic.com/vn', count: 5 }
            ]
        };
        this.saveToLocalStorage();
    }

    // Getter methods
    getACTypes() {
        return this.data.acTypes.filter(type => type.status === 'active');
    }

    getAreas() {
        return this.data.areas;
    }

    getLocations(area = null) {
        if (area) {
            return this.data.locations.filter(loc => loc.area === area);
        }
        return this.data.locations;
    }

    getBrands() {
        return this.data.brands;
    }

    // Setter methods
    setACTypes(types) {
        this.data.acTypes = types;
        this.saveToLocalStorage();
    }

    setAreas(areas) {
        this.data.areas = areas;
        this.saveToLocalStorage();
    }

    setLocations(locations) {
        this.data.locations = locations;
        this.saveToLocalStorage();
    }

    setBrands(brands) {
        this.data.brands = brands;
        this.saveToLocalStorage();
    }

    // Update dropdown options in forms
    updateFormDropdowns() {
        this.updateACTypeDropdown();
        this.updateAreaDropdown();
        this.updateBrandDropdown();
    }

    updateACTypeDropdown() {
        const dropdown = document.getElementById('acType');
        if (dropdown) {
            const currentValue = dropdown.value;
            dropdown.innerHTML = '<option value="">Chọn loại</option>' + 
                this.getACTypes().map(type => 
                    `<option value="${type.code}">${type.name}</option>`
                ).join('');
            dropdown.value = currentValue;
        }

        // Update filter dropdown
        const filterDropdown = document.getElementById('filterType');
        if (filterDropdown) {
            const currentValue = filterDropdown.value;
            filterDropdown.innerHTML = '<option value="">Tất cả loại</option>' + 
                this.getACTypes().map(type => 
                    `<option value="${type.code}">${type.name}</option>`
                ).join('');
            filterDropdown.value = currentValue;
        }
    }

    updateAreaDropdown() {
        const dropdown = document.getElementById('acArea');
        if (dropdown) {
            const currentValue = dropdown.value;
            dropdown.innerHTML = '<option value="">Chọn khu vực</option>' + 
                this.getAreas().map(area => 
                    `<option value="${area.name}">${area.name}</option>`
                ).join('');
            dropdown.value = currentValue;
        }

        // Update filter dropdown
        const filterDropdown = document.getElementById('filterArea');
        if (filterDropdown) {
            const currentValue = filterDropdown.value;
            filterDropdown.innerHTML = '<option value="">Tất cả khu vực</option>' + 
                this.getAreas().map(area => 
                    `<option value="${area.name}">${area.name}</option>`
                ).join('');
            filterDropdown.value = currentValue;
        }
    }

    updateBrandDropdown() {
        // Brand is usually a text input, but we can provide suggestions
        const input = document.getElementById('acBrand');
        if (input) {
            // Add datalist for autocomplete
            let datalist = document.getElementById('brandsList');
            if (!datalist) {
                datalist = document.createElement('datalist');
                datalist.id = 'brandsList';
                input.parentNode.appendChild(datalist);
                input.setAttribute('list', 'brandsList');
            }
            
            datalist.innerHTML = this.getBrands().map(brand => 
                `<option value="${brand.name}">${brand.name}</option>`
            ).join('');
        }
    }

    // Area change handler for location dropdown
    onAreaChange(areaValue) {
        const locationInput = document.getElementById('acLocation');
        if (locationInput) {
            // Add datalist for locations in selected area
            let datalist = document.getElementById('locationsList');
            if (!datalist) {
                datalist = document.createElement('datalist');
                datalist.id = 'locationsList';
                locationInput.parentNode.appendChild(datalist);
                locationInput.setAttribute('list', 'locationsList');
            }
            
            const locations = this.getLocations(areaValue);
            datalist.innerHTML = locations.map(loc => 
                `<option value="${loc.name}">${loc.name}</option>`
            ).join('');
        }
   }

    // API Methods for Database Integration
    async fetchFromAPI(endpoint) {
        try {
            const response = await fetch(`${this.apiBaseUrl}/${endpoint}`);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            return await response.json();
        } catch (error) {
            console.error(`Error fetching ${endpoint}:`, error);
            throw error;
        }
    }

    async saveToAPI(endpoint, data, method = 'POST') {
        try {
            const response = await fetch(`${this.webhookBaseUrl}/${endpoint}`, {
                method: method,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    action: method.toLowerCase() === 'post' ? 'create' : 'update',
                    data: data,
                    timestamp: new Date().toISOString()
                })
            });
            
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            return await response.json();
        } catch (error) {
            console.error(`Error saving to ${endpoint}:`, error);
            throw error;
        }
    }

    async deleteFromAPI(endpoint, id) {
        try {
            const response = await fetch(`${this.webhookBaseUrl}/${endpoint}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    action: 'delete',
                    id: id,
                    timestamp: new Date().toISOString()
                })
            });
            
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            return await response.json();
        } catch (error) {
            console.error(`Error deleting from ${endpoint}:`, error);
            throw error;
        }
    }

    // AC Types API Methods
    async loadACTypesFromAPI() {
        try {
            const data = await this.fetchFromAPI('air_ac_types');
            this.data.acTypes = Array.isArray(data) ? data.map(item => ({
                id: item.id,
                name: item.ten_loai || item.name,
                code: item.ma_loai || item.code,
                status: item.trang_thai || item.status || 'active',
                count: item.so_luong || item.count || 0
            })) : this.data.acTypes;
            this.saveToLocalStorage();
            return this.data.acTypes;
        } catch (error) {
            console.error('Error loading AC types from API:', error);
            return this.data.acTypes;
        }
    }

    async saveACTypeToAPI(acType, isEdit = false) {
        try {
            const apiData = {
                ten_loai: acType.name,
                ma_loai: acType.code,
                trang_thai: acType.status,
                so_luong: acType.count || 0
            };
            
            if (isEdit) {
                apiData.id = acType.id;
            }
            
            await this.saveToAPI('air_ac_types', apiData, isEdit ? 'PUT' : 'POST');
            return { success: true };
        } catch (error) {
            console.error('Error saving AC type:', error);
            throw error;
        }
    }

    async deleteACTypeFromAPI(id) {
        try {
            await this.deleteFromAPI('air_ac_types', id);
            return { success: true };
        } catch (error) {
            console.error('Error deleting AC type:', error);
            throw error;
        }
    }

    // Areas API Methods
    async loadAreasFromAPI() {
        try {
            const data = await this.fetchFromAPI('air_areas');
            this.data.areas = Array.isArray(data) ? data.map(item => ({
                id: item.id,
                name: item.ten_khu_vuc || item.name,
                description: item.mo_ta || item.description || '',
                count: item.so_luong || item.count || 0
            })) : this.data.areas;
            this.saveToLocalStorage();
            return this.data.areas;
        } catch (error) {
            console.error('Error loading areas from API:', error);
            return this.data.areas;
        }
    }

    async saveAreaToAPI(area, isEdit = false) {
        try {
            const apiData = {
                ten_khu_vuc: area.name,
                mo_ta: area.description,
                so_luong: area.count || 0
            };
            
            if (isEdit) {
                apiData.id = area.id;
            }
            
            await this.saveToAPI('air_areas', apiData, isEdit ? 'PUT' : 'POST');
            return { success: true };
        } catch (error) {
            console.error('Error saving area:', error);
            throw error;
        }
    }

    async deleteAreaFromAPI(id) {
        try {
            await this.deleteFromAPI('air_areas', id);
            return { success: true };
        } catch (error) {
            console.error('Error deleting area:', error);
            throw error;
        }
    }

    // Locations API Methods
    async loadLocationsFromAPI() {
        try {
            const data = await this.fetchFromAPI('air_locations');
            this.data.locations = Array.isArray(data) ? data.map(item => ({
                id: item.id,
                area: item.khu_vuc || item.area,
                name: item.ten_vi_tri || item.name,
                code: item.ma_vi_tri || item.code,
                count: item.so_luong || item.count || 0
            })) : this.data.locations;
            this.saveToLocalStorage();
            return this.data.locations;
        } catch (error) {
            console.error('Error loading locations from API:', error);
            return this.data.locations;
        }
    }

    async saveLocationToAPI(location, isEdit = false) {
        try {
            const apiData = {
                khu_vuc: location.area,
                ten_vi_tri: location.name,
                ma_vi_tri: location.code,
                so_luong: location.count || 0
            };
            
            if (isEdit) {
                apiData.id = location.id;
            }
            
            await this.saveToAPI('air_locations', apiData, isEdit ? 'PUT' : 'POST');
            return { success: true };
        } catch (error) {
            console.error('Error saving location:', error);
            throw error;
        }
    }

    async deleteLocationFromAPI(id) {
        try {
            await this.deleteFromAPI('air_locations', id);
            return { success: true };
        } catch (error) {
            console.error('Error deleting location:', error);
            throw error;
        }
    }

    // Brands API Methods
    async loadBrandsFromAPI() {
        try {
            const data = await this.fetchFromAPI('air_brands');
            this.data.brands = Array.isArray(data) ? data.map(item => ({
                id: item.id,
                name: item.ten_hang || item.name,
                country: item.quoc_gia || item.country || '',
                website: item.website || '',
                count: item.so_luong || item.count || 0
            })) : this.data.brands;
            this.saveToLocalStorage();
            return this.data.brands;
        } catch (error) {
            console.error('Error loading brands from API:', error);
            return this.data.brands;
        }
    }

    async saveBrandToAPI(brand, isEdit = false) {
        try {
            const apiData = {
                ten_hang: brand.name,
                quoc_gia: brand.country,
                website: brand.website,
                so_luong: brand.count || 0
            };
            
            if (isEdit) {
                apiData.id = brand.id;
            }
            
            await this.saveToAPI('air_brands', apiData, isEdit ? 'PUT' : 'POST');
            return { success: true };
        } catch (error) {
            console.error('Error saving brand:', error);
            throw error;
        }
    }

    async deleteBrandFromAPI(id) {
        try {
            await this.deleteFromAPI('air_brands', id);
            return { success: true };
        } catch (error) {
            console.error('Error deleting brand:', error);
            throw error;
        }
    }

    // Sync Methods
    async syncWithAPI() {
        try {
            console.log('Syncing settings with API...');
            
            const results = await Promise.allSettled([
                this.loadACTypesFromAPI(),
                this.loadAreasFromAPI(),
                this.loadLocationsFromAPI(),
                this.loadBrandsFromAPI()
            ]);
            
            const failed = results.filter(result => result.status === 'rejected');
            if (failed.length > 0) {
                console.warn('Some sync operations failed:', failed);
            }
            
            console.log('Settings sync completed');
            return { success: true, failedCount: failed.length };
        } catch (error) {
            console.error('Error syncing with API:', error);
            return { success: false, error: error.message };
        }
    }

    // Utility Methods
    updateCounts(airConditioners) {
        // Reset counts
        this.data.acTypes.forEach(type => type.count = 0);
        this.data.areas.forEach(area => area.count = 0);
        this.data.locations.forEach(location => location.count = 0);
        this.data.brands.forEach(brand => brand.count = 0);

        // Count usage
        airConditioners.forEach(ac => {
            // Count by type
            const type = this.data.acTypes.find(t => t.code === ac.type);
            if (type) type.count++;

            // Count by area
            const area = this.data.areas.find(a => a.name === ac.area);
            if (area) area.count++;

            // Count by location
            const location = this.data.locations.find(l => l.name === ac.location);
            if (location) location.count++;

            // Count by brand
            const brand = this.data.brands.find(b => b.name === ac.brand);
            if (brand) brand.count++;
        });

        this.saveToLocalStorage();
    }

    // Get options for dropdowns
    getACTypeOptions() {
        return this.data.acTypes
            .filter(type => type.status === 'active')
            .map(type => ({ value: type.code, text: type.name }));
    }

    getAreaOptions() {
        return this.data.areas
            .map(area => ({ value: area.name, text: area.name }));
    }

    getLocationOptions(area = null) {
        let locations = this.data.locations;
        if (area) {
            locations = locations.filter(loc => loc.area === area);
        }
        return locations.map(location => ({ 
            value: location.name, 
            text: location.name,
            area: location.area 
        }));
    }

    getBrandOptions() {
        return this.data.brands
            .map(brand => ({ value: brand.name, text: brand.name }));
    }

    // Import/Export Methods  
    exportAllSettings() {
        const exportData = {
            ...this.data,
            exportDate: new Date().toISOString(),
            version: '1.0'
        };
        
        const jsonString = JSON.stringify(exportData, null, 2);
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `caidat_hethong_${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        return { success: true };
    }

    importSettings(fileContent) {
        try {
            const importData = JSON.parse(fileContent);
            
            if (importData.acTypes) this.data.acTypes = importData.acTypes;
            if (importData.areas) this.data.areas = importData.areas;
            if (importData.locations) this.data.locations = importData.locations;
            if (importData.brands) this.data.brands = importData.brands;
            
            this.saveToLocalStorage();
            return { success: true };
        } catch (error) {
            console.error('Error importing settings:', error);
            return { success: false, error: error.message };
        }
    }
}

// Create global instance
const settingsManager = new SettingsManager();

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SettingsManager;
}
