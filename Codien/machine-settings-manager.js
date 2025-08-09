// Machine Settings Manager
// Quản lý cài đặt cho hệ thống máy móc

class MachineSettingsManager {
    constructor() {
        this.settings = {
            machineTypes: [],
            areas: [],
            locations: [],
            brands: []
        };
        
        this.API_BASE_URL = 'https://api.autoslp.com/api/data';
        this.WEBHOOK_BASE_URL = 'https://api.autoslp.com:5678/webhook';
        
        // Khởi tạo dữ liệu
        this.loadFromLocalStorage();
    }
    
    // === STORAGE FUNCTIONS ===
    loadFromLocalStorage() {
        try {
            const storedSettings = localStorage.getItem('machineSettings');
            if (storedSettings) {
                this.settings = JSON.parse(storedSettings);
            } else {
                this.loadDefaultData();
            }
        } catch (error) {
            console.error('Error loading settings from localStorage:', error);
            this.loadDefaultData();
        }
    }
    
    saveToLocalStorage() {
        try {
            localStorage.setItem('machineSettings', JSON.stringify(this.settings));
        } catch (error) {
            console.error('Error saving settings to localStorage:', error);
        }
    }
    
    loadDefaultData() {
        this.settings = {
            machineTypes: [
                { id: 1, name: 'Máy cắt', value: 'cutting' },
                { id: 2, name: 'Máy khoan', value: 'drilling' },
                { id: 3, name: 'Máy hàn', value: 'welding' },
                { id: 4, name: 'Máy phay', value: 'milling' },
                { id: 5, name: 'Máy tiện', value: 'lathe' },
                { id: 6, name: 'Máy ép', value: 'pressing' },
                { id: 7, name: 'Máy đúc', value: 'casting' },
                { id: 8, name: 'Máy đo', value: 'measuring' }
            ],
            areas: [
                { id: 1, name: 'Xưởng sản xuất 1', value: 'workshop1' },
                { id: 2, name: 'Xưởng sản xuất 2', value: 'workshop2' },
                { id: 3, name: 'Xưởng sản xuất 3', value: 'workshop3' },
                { id: 4, name: 'Khu vực kiểm tra', value: 'testing' },
                { id: 5, name: 'Khu vực đóng gói', value: 'packaging' }
            ],
            locations: [
                { id: 1, name: 'Dây chuyền 1', value: 'line1', area: 'workshop1' },
                { id: 2, name: 'Dây chuyền 2', value: 'line2', area: 'workshop1' },
                { id: 3, name: 'Dây chuyền 3', value: 'line3', area: 'workshop2' },
                { id: 4, name: 'Dây chuyền 4', value: 'line4', area: 'workshop2' },
                { id: 5, name: 'Khu vực kiểm tra chất lượng', value: 'qa', area: 'testing' },
                { id: 6, name: 'Khu vực đóng gói sản phẩm', value: 'pack', area: 'packaging' }
            ],
            brands: [
                { id: 1, name: 'Mitsubishi', value: 'mitsubishi' },
                { id: 2, name: 'Siemens', value: 'siemens' },
                { id: 3, name: 'ABB', value: 'abb' },
                { id: 4, name: 'Schneider', value: 'schneider' },
                { id: 5, name: 'Omron', value: 'omron' },
                { id: 6, name: 'Fanuc', value: 'fanuc' },
                { id: 7, name: 'Yaskawa', value: 'yaskawa' },
                { id: 8, name: 'Bosch', value: 'bosch' }
            ]
        };
        
        this.saveToLocalStorage();
    }
    
    // === GETTERS ===
    getMachineTypes() {
        return this.settings.machineTypes;
    }
    
    getAreas() {
        return this.settings.areas;
    }
    
    getLocations(area = null) {
        if (area) {
            return this.settings.locations.filter(location => location.area === area);
        }
        return this.settings.locations;
    }
    
    getBrands() {
        return this.settings.brands;
    }
    
    // === SETTERS ===
    setMachineTypes(types) {
        this.settings.machineTypes = types;
        this.saveToLocalStorage();
    }
    
    setAreas(areas) {
        this.settings.areas = areas;
        this.saveToLocalStorage();
    }
    
    setLocations(locations) {
        this.settings.locations = locations;
        this.saveToLocalStorage();
    }
    
    setBrands(brands) {
        this.settings.brands = brands;
        this.saveToLocalStorage();
    }
    
    // === FORM DROPDOWN UPDATES ===
    updateFormDropdowns() {
        this.updateMachineTypeDropdown();
        this.updateAreaDropdown();
        this.updateBrandDropdown();
    }
    
    updateMachineTypeDropdown() {
        const typeSelect = document.getElementById('machineType');
        if (!typeSelect) return;
        
        // Lưu lại giá trị đã chọn
        const selectedValue = typeSelect.value;
        
        // Xóa tất cả options trừ option đầu tiên (placeholder)
        while (typeSelect.options.length > 1) {
            typeSelect.remove(1);
        }
        
        // Thêm các options mới
        this.settings.machineTypes.forEach(type => {
            const option = document.createElement('option');
            option.value = type.value;
            option.textContent = type.name;
            typeSelect.appendChild(option);
        });
        
        // Khôi phục giá trị đã chọn nếu có
        if (selectedValue) {
            typeSelect.value = selectedValue;
        }
    }
    
    updateAreaDropdown() {
        const areaSelect = document.getElementById('machineArea');
        if (!areaSelect) return;
        
        // Lưu lại giá trị đã chọn
        const selectedValue = areaSelect.value;
        
        // Xóa tất cả options trừ option đầu tiên (placeholder)
        while (areaSelect.options.length > 1) {
            areaSelect.remove(1);
        }
        
        // Thêm các options mới
        this.settings.areas.forEach(area => {
            const option = document.createElement('option');
            option.value = area.value;
            option.textContent = area.name;
            areaSelect.appendChild(option);
        });
        
        // Khôi phục giá trị đã chọn nếu có
        if (selectedValue) {
            areaSelect.value = selectedValue;
        }
        
        // Cập nhật dropdown vị trí dựa trên khu vực đã chọn
        this.onAreaChange(areaSelect.value);
    }
    
    updateBrandDropdown() {
        const brandSelect = document.getElementById('machineBrand');
        if (!brandSelect) return;
        
        // Lưu lại giá trị đã chọn
        const selectedValue = brandSelect.value;
        
        // Xóa tất cả options trừ option đầu tiên (placeholder)
        while (brandSelect.options.length > 1) {
            brandSelect.remove(1);
        }
        
        // Thêm các options mới
        this.settings.brands.forEach(brand => {
            const option = document.createElement('option');
            option.value = brand.value;
            option.textContent = brand.name;
            brandSelect.appendChild(option);
        });
        
        // Khôi phục giá trị đã chọn nếu có
        if (selectedValue) {
            brandSelect.value = selectedValue;
        }
    }
    
    onAreaChange(areaValue) {
        const locationSelect = document.getElementById('machineLocation');
        if (!locationSelect) return;
        
        // Lưu lại giá trị đã chọn
        const selectedValue = locationSelect.value;
        
        // Xóa tất cả options trừ option đầu tiên (placeholder)
        while (locationSelect.options.length > 1) {
            locationSelect.remove(1);
        }
        
        // Lọc các vị trí theo khu vực
        const filteredLocations = areaValue ? this.getLocations(areaValue) : this.getLocations();
        
        // Thêm các options mới
        filteredLocations.forEach(location => {
            const option = document.createElement('option');
            option.value = location.value;
            option.textContent = location.name;
            locationSelect.appendChild(option);
        });
        
        // Khôi phục giá trị đã chọn nếu có và nếu vẫn tồn tại trong danh sách mới
        if (selectedValue) {
            locationSelect.value = selectedValue;
        }
    }
    
    // === API FUNCTIONS ===
    async fetchFromAPI(endpoint) {
        try {
            const response = await fetch(`${this.API_BASE_URL}/machine_${endpoint}`);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            return await response.json();
        } catch (error) {
            console.error(`Error fetching ${endpoint} from API:`, error);
            throw error;
        }
    }
    
    async saveToAPI(endpoint, data, method = 'POST') {
        try {
            const response = await fetch(`${this.WEBHOOK_BASE_URL}/machine_${endpoint}`, {
                method: method,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    action: method === 'POST' ? 'create' : 'update',
                    data: data,
                    timestamp: new Date().toISOString()
                })
            });
            
            if (!response.ok) {
                throw new Error(`Webhook error! status: ${response.status}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error(`Error saving ${endpoint} to API:`, error);
            throw error;
        }
    }
    
    async deleteFromAPI(endpoint, id) {
        try {
            const response = await fetch(`${this.WEBHOOK_BASE_URL}/machine_${endpoint}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    action: 'delete',
                    id: id,
                    timestamp: new Date().toISOString()
                })
            });
            
            if (!response.ok) {
                throw new Error(`Webhook error! status: ${response.status}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error(`Error deleting ${endpoint} from API:`, error);
            throw error;
        }
    }
    
    // === MACHINE TYPES API ===
    async loadMachineTypesFromAPI() {
        try {
            const data = await this.fetchFromAPI('types');
            if (Array.isArray(data)) {
                this.settings.machineTypes = data.map(item => ({
                    id: item.id,
                    name: item.name || item.ten,
                    value: item.value || item.gia_tri
                }));
                this.saveToLocalStorage();
                this.updateMachineTypeDropdown();
                return this.settings.machineTypes;
            }
            return [];
        } catch (error) {
            console.error('Error loading machine types from API:', error);
            return this.settings.machineTypes;
        }
    }
    
    async saveMachineTypeToAPI(machineType, isEdit = false) {
        try {
            const data = {
                ten: machineType.name,
                gia_tri: machineType.value
            };
            
            if (isEdit && machineType.id) {
                data.id = machineType.id;
            }
            
            const result = await this.saveToAPI('types', data, isEdit ? 'PUT' : 'POST');
            
            // Reload from API to get updated list
            await this.loadMachineTypesFromAPI();
            
            return result;
        } catch (error) {
            console.error('Error saving machine type to API:', error);
            throw error;
        }
    }
    
    async deleteMachineTypeFromAPI(id) {
        try {
            const result = await this.deleteFromAPI('types', id);
            
            // Reload from API to get updated list
            await this.loadMachineTypesFromAPI();
            
            return result;
        } catch (error) {
            console.error('Error deleting machine type from API:', error);
            throw error;
        }
    }
    
    // === AREAS API ===
    async loadAreasFromAPI() {
        try {
            const data = await this.fetchFromAPI('areas');
            if (Array.isArray(data)) {
                this.settings.areas = data.map(item => ({
                    id: item.id,
                    name: item.name || item.ten,
                    value: item.value || item.gia_tri
                }));
                this.saveToLocalStorage();
                this.updateAreaDropdown();
                return this.settings.areas;
            }
            return [];
        } catch (error) {
            console.error('Error loading areas from API:', error);
            return this.settings.areas;
        }
    }
    
    async saveAreaToAPI(area, isEdit = false) {
        try {
            const data = {
                ten: area.name,
                gia_tri: area.value
            };
            
            if (isEdit && area.id) {
                data.id = area.id;
            }
            
            const result = await this.saveToAPI('areas', data, isEdit ? 'PUT' : 'POST');
            
            // Reload from API to get updated list
            await this.loadAreasFromAPI();
            
            return result;
        } catch (error) {
            console.error('Error saving area to API:', error);
            throw error;
        }
    }
    
    async deleteAreaFromAPI(id) {
        try {
            const result = await this.deleteFromAPI('areas', id);
            
            // Reload from API to get updated list
            await this.loadAreasFromAPI();
            
            return result;
        } catch (error) {
            console.error('Error deleting area from API:', error);
            throw error;
        }
    }
    
    // === LOCATIONS API ===
    async loadLocationsFromAPI() {
        try {
            const data = await this.fetchFromAPI('locations');
            if (Array.isArray(data)) {
                this.settings.locations = data.map(item => ({
                    id: item.id,
                    name: item.name || item.ten,
                    value: item.value || item.gia_tri,
                    area: item.area || item.khu_vuc
                }));
                this.saveToLocalStorage();
                return this.settings.locations;
            }
            return [];
        } catch (error) {
            console.error('Error loading locations from API:', error);
            return this.settings.locations;
        }
    }
    
    async saveLocationToAPI(location, isEdit = false) {
        try {
            const data = {
                ten: location.name,
                gia_tri: location.value,
                khu_vuc: location.area
            };
            
            if (isEdit && location.id) {
                data.id = location.id;
            }
            
            const result = await this.saveToAPI('locations', data, isEdit ? 'PUT' : 'POST');
            
            // Reload from API to get updated list
            await this.loadLocationsFromAPI();
            
            return result;
        } catch (error) {
            console.error('Error saving location to API:', error);
            throw error;
        }
    }
    
    async deleteLocationFromAPI(id) {
        try {
            const result = await this.deleteFromAPI('locations', id);
            
            // Reload from API to get updated list
            await this.loadLocationsFromAPI();
            
            return result;
        } catch (error) {
            console.error('Error deleting location from API:', error);
            throw error;
        }
    }
    
    // === BRANDS API ===
    async loadBrandsFromAPI() {
        try {
            const data = await this.fetchFromAPI('brands');
            if (Array.isArray(data)) {
                this.settings.brands = data.map(item => ({
                    id: item.id,
                    name: item.name || item.ten,
                    value: item.value || item.gia_tri
                }));
                this.saveToLocalStorage();
                this.updateBrandDropdown();
                return this.settings.brands;
            }
            return [];
        } catch (error) {
            console.error('Error loading brands from API:', error);
            return this.settings.brands;
        }
    }
    
    async saveBrandToAPI(brand, isEdit = false) {
        try {
            const data = {
                ten: brand.name,
                gia_tri: brand.value
            };
            
            if (isEdit && brand.id) {
                data.id = brand.id;
            }
            
            const result = await this.saveToAPI('brands', data, isEdit ? 'PUT' : 'POST');
            
            // Reload from API to get updated list
            await this.loadBrandsFromAPI();
            
            return result;
        } catch (error) {
            console.error('Error saving brand to API:', error);
            throw error;
        }
    }
    
    async deleteBrandFromAPI(id) {
        try {
            const result = await this.deleteFromAPI('brands', id);
            
            // Reload from API to get updated list
            await this.loadBrandsFromAPI();
            
            return result;
        } catch (error) {
            console.error('Error deleting brand from API:', error);
            throw error;
        }
    }
    
    // === SYNC FUNCTIONS ===
    async syncWithAPI() {
        try {
            // Hiển thị thông báo đang đồng bộ
            const notification = document.createElement('div');
            notification.className = 'alert alert-info position-fixed top-0 end-0 m-3';
            notification.innerHTML = 'Đang đồng bộ dữ liệu...';
            document.body.appendChild(notification);
            
            // Đồng bộ tất cả dữ liệu
            await Promise.all([
                this.loadMachineTypesFromAPI(),
                this.loadAreasFromAPI(),
                this.loadLocationsFromAPI(),
                this.loadBrandsFromAPI()
            ]);
            
            // Cập nhật các dropdown
            this.updateFormDropdowns();
            
            // Xóa thông báo đang đồng bộ
            document.body.removeChild(notification);
            
            // Hiển thị thông báo thành công
            const successNotification = document.createElement('div');
            successNotification.className = 'alert alert-success position-fixed top-0 end-0 m-3';
            successNotification.innerHTML = 'Đồng bộ dữ liệu thành công!';
            document.body.appendChild(successNotification);
            
            // Tự động xóa thông báo sau 3 giây
            setTimeout(() => {
                document.body.removeChild(successNotification);
            }, 3000);
            
            return true;
        } catch (error) {
            console.error('Error syncing with API:', error);
            
            // Hiển thị thông báo lỗi
            const errorNotification = document.createElement('div');
            errorNotification.className = 'alert alert-danger position-fixed top-0 end-0 m-3';
            errorNotification.innerHTML = 'Lỗi khi đồng bộ dữ liệu: ' + error.message;
            document.body.appendChild(errorNotification);
            
            // Tự động xóa thông báo sau 5 giây
            setTimeout(() => {
                document.body.removeChild(errorNotification);
            }, 5000);
            
            return false;
        }
    }
    
    // === UTILITY FUNCTIONS ===
    updateCounts(machines) {
        // Cập nhật số lượng máy móc theo loại
        const typeCounts = {};
        this.settings.machineTypes.forEach(type => {
            typeCounts[type.value] = 0;
        });
        
        // Đếm số lượng máy móc theo loại
        machines.forEach(machine => {
            if (machine.type && typeCounts[machine.type] !== undefined) {
                typeCounts[machine.type]++;
            }
        });
        
        // Cập nhật số lượng vào settings
        this.settings.machineTypes = this.settings.machineTypes.map(type => ({
            ...type,
            count: typeCounts[type.value] || 0
        }));
        
        // Cập nhật số lượng máy móc theo khu vực
        const areaCounts = {};
        this.settings.areas.forEach(area => {
            areaCounts[area.value] = 0;
        });
        
        // Đếm số lượng máy móc theo khu vực
        machines.forEach(machine => {
            if (machine.area && areaCounts[machine.area] !== undefined) {
                areaCounts[machine.area]++;
            }
        });
        
        // Cập nhật số lượng vào settings
        this.settings.areas = this.settings.areas.map(area => ({
            ...area,
            count: areaCounts[area.value] || 0
        }));
        
        this.saveToLocalStorage();
    }
    
    // === OPTIONS GETTERS ===
    getMachineTypeOptions() {
        return this.settings.machineTypes.map(type => ({
            value: type.value,
            text: type.name
        }));
    }
    
    getAreaOptions() {
        return this.settings.areas.map(area => ({
            value: area.value,
            text: area.name
        }));
    }
    
    getLocationOptions(area = null) {
        let locations = this.settings.locations;
        
        if (area) {
            locations = locations.filter(location => location.area === area);
        }
        
        return locations.map(location => ({
            value: location.value,
            text: location.name,
            area: location.area
        }));
    }
    
    getBrandOptions() {
        return this.settings.brands.map(brand => ({
            value: brand.value,
            text: brand.name
        }));
    }
    
    // === EXPORT/IMPORT ===
    exportAllSettings() {
        try {
            const exportData = {
                machineTypes: this.settings.machineTypes,
                areas: this.settings.areas,
                locations: this.settings.locations,
                brands: this.settings.brands,
                exportDate: new Date().toISOString(),
                version: '1.0'
            };
            
            const dataStr = JSON.stringify(exportData, null, 2);
            const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
            
            const exportFileDefaultName = 'machine_settings_export.json';
            
            const linkElement = document.createElement('a');
            linkElement.setAttribute('href', dataUri);
            linkElement.setAttribute('download', exportFileDefaultName);
            linkElement.click();
            
            return true;
        } catch (error) {
            console.error('Error exporting settings:', error);
            return false;
        }
    }
    
    importSettings(fileContent) {
        try {
            const importData = JSON.parse(fileContent);
            
            // Kiểm tra dữ liệu hợp lệ
            if (!importData.machineTypes || !importData.areas || !importData.locations || !importData.brands) {
                throw new Error('Dữ liệu nhập không hợp lệ');
            }
            
            // Cập nhật settings
            this.settings.machineTypes = importData.machineTypes;
            this.settings.areas = importData.areas;
            this.settings.locations = importData.locations;
            this.settings.brands = importData.brands;
            
            // Lưu vào localStorage
            this.saveToLocalStorage();
            
            // Cập nhật các dropdown
            this.updateFormDropdowns();
            
            return true;
        } catch (error) {
            console.error('Error importing settings:', error);
            return false;
        }
    }
}

// Tạo instance toàn cục
window.machineSettingsManager = new MachineSettingsManager(); 