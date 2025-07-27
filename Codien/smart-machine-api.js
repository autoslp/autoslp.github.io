// Smart Machine Management - API Manager
// Quản lý tất cả các API calls và webhook cho hệ thống máy móc

class SmartMachineAPI {
    constructor() {
        this.API_BASE_URL = 'https://autoslp.duckdns.org/api/data';
        this.WEBHOOK_BASE_URL = 'https://autoslp.duckdns.org:5678/webhook';
    }

    // === MACHINES API ===
    async getMachines() {
        try {
            const response = await fetch(`${this.API_BASE_URL}/machines`);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const data = await response.json();
            return Array.isArray(data) ? data : [];
        } catch (error) {
            console.error('Error fetching machines:', error);
            throw error;
        }
    }

    async getMachine(id) {
        try {
            const response = await fetch(`${this.API_BASE_URL}/machines/${id}`);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            return await response.json();
        } catch (error) {
            console.error('Error fetching machine:', error);
            throw error;
        }
    }

    async saveMachine(data, isEdit = false, id = null) {
        try {
            const webhookData = {
                action: isEdit ? 'update' : 'create',
                data: this.transformToAPIFormat(data),
                id: id,
                timestamp: new Date().toISOString()
            };

            const response = await fetch(`${this.WEBHOOK_BASE_URL}/machine`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(webhookData)
            });

            if (!response.ok) {
                throw new Error(`Webhook error! status: ${response.status}`);
            }

            return { success: true, data: await response.json() };
        } catch (error) {
            console.error('Error saving machine:', error);
            throw error;
        }
    }

    // === WORK HISTORY API ===
    async getWorkHistory(machineId = null, machineCode = null) {
        try {
            // Since you're not using PHP backend, we need to filter work history by Machine ID
            // Get all work history first, then filter by machine_id
            const allWorkHistory = await this.getAllWorkHistory();
            
            if (!machineId && machineCode) {
                // If only machineCode provided, find Machine first to get ID
                const machineList = await this.getMachines();
                const machine = machineList.find(machine => {
                    const code = machine.code || machine.ma_may;
                    return code === machineCode;
                });
                if (machine) {
                    machineId = machine.id;
                }
            }
            
            if (!machineId) {
                return [];
            }
            
            // Filter work history by machine_id
            const filteredHistory = allWorkHistory.filter(work => {
                return work.machine_id == machineId || work.may_id == machineId;
            });
            
            return filteredHistory;
            
        } catch (error) {
            console.error('Error fetching work history:', error);
            return [];
        }
    }
    
    // Get all work history records
    async getAllWorkHistory() {
        try {
            const response = await fetch(`${this.API_BASE_URL}/machine_work_history`);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const data = await response.json();
            return Array.isArray(data) ? data : [];
        } catch (error) {
            console.error('Error fetching all work history:', error);
            return [];
        }
    }

    async saveWorkHistory(workData) {
        try {
            const webhookData = {
                action: 'create_work',
                data: workData,
                timestamp: new Date().toISOString()
            };

            const response = await fetch(`${this.WEBHOOK_BASE_URL}/machine_work_history`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(webhookData)
            });

            if (!response.ok) {
                throw new Error(`Webhook error! status: ${response.status}`);
            }

            return { success: true, data: await response.json() };
        } catch (error) {
            console.error('Error saving work history:', error);
            throw error;
        }
    }

    // === MAINTENANCE & REPAIR ===
    async performMaintenance(machineData) {
        try {
            const maintenanceData = {
                action: 'maintenance',
                machine: machineData.machine,
                work_data: {
                    work_date: new Date().toISOString().split('T')[0],
                    type: 'maintenance',
                    description: machineData.description || 'Bảo dưỡng định kỳ',
                    worker_name: machineData.worker_name || 'Nhân viên kỹ thuật',
                    status: 'completed',
                    notes: machineData.notes || 'Thực hiện bảo dưỡng qua hệ thống'
                },
                timestamp: new Date().toISOString()
            };

            const response = await fetch(`${this.WEBHOOK_BASE_URL}/machine_maintenance`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(maintenanceData)
            });

            if (!response.ok) {
                throw new Error(`Webhook error! status: ${response.status}`);
            }

            return { success: true, data: await response.json() };
        } catch (error) {
            console.error('Error performing maintenance:', error);
            throw error;
        }
    }

    async performRepair(machineData) {
        try {
            const repairData = {
                action: 'repair',
                machine: machineData.machine,
                work_data: {
                    work_date: new Date().toISOString().split('T')[0],
                    type: 'repair',
                    description: machineData.description || 'Sửa chữa hỏng hóc',
                    worker_name: machineData.worker_name || 'Nhân viên kỹ thuật',
                    status: 'completed',
                    notes: machineData.notes || 'Thực hiện sửa chữa qua hệ thống'
                },
                timestamp: new Date().toISOString()
            };

            const response = await fetch(`${this.WEBHOOK_BASE_URL}/machine_repair`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(repairData)
            });

            if (!response.ok) {
                throw new Error(`Webhook error! status: ${response.status}`);
            }

            return { success: true, data: await response.json() };
        } catch (error) {
            console.error('Error performing repair:', error);
            throw error;
        }
    }

    // === CONTRACTORS API ===
    async getContractors(activeOnly = true) {
        try {
            let url = `${this.API_BASE_URL}/contractors`;
            if (activeOnly) url += '?active=true';
            
            const response = await fetch(url);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const data = await response.json();
            return Array.isArray(data) ? data : [];
        } catch (error) {
            console.error('Error fetching contractors:', error);
            throw error;
        }
    }

    // === STATISTICS ===
    async getStatistics() {
        try {
            const response = await fetch(`${this.API_BASE_URL}/machine_statistics`);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            return await response.json();
        } catch (error) {
            console.error('Error fetching statistics:', error);
            // Return empty stats as fallback
            return {
                machine_by_status: {},
                total_machines: 0,
                upcoming_maintenance: [],
                work_by_type: [],
                monthly_works: []
            };
        }
    }

    // === UTILITY FUNCTIONS ===
    transformToAPIFormat(data) {
        return {
            ma_may: data.code,
            loai: data.type,
            khu_vuc: data.area,
            vi_tri: data.location,
            cong_suat: data.capacity,
            hang: data.brand,
            ngay_lap_dat: data.install_date,
            ngay_bao_hanh: data.warranty_date,
            trang_thai: data.status,
            bao_duong_tiep_theo: data.next_maintenance,
            ghi_chu: data.notes,
            serial: data.serial
        };
    }

    transformFromAPIFormat(data) {
        return {
            id: data.id,
            code: data.code || data.ma_may,
            type: data.type || data.loai,
            area: data.area || data.khu_vuc,
            location: data.location || data.vi_tri,
            capacity: data.capacity || data.cong_suat,
            brand: data.brand || data.hang,
            installDate: data.install_date || data.ngay_lap_dat,
            warrantyDate: data.warranty_date || data.ngay_bao_hanh,
            status: data.status || data.trang_thai,
            lastMaintenance: data.last_maintenance || data.bao_duong_gan_nhat,
            nextMaintenance: data.next_maintenance || data.bao_duong_tiep_theo,
            notes: data.notes || data.ghi_chu || ''
        };
    }

    // === BATCH OPERATIONS ===
    async batchUpdateStatus(ids, newStatus) {
        try {
            const batchData = {
                action: 'batch_update_status',
                ids: ids,
                status: newStatus,
                timestamp: new Date().toISOString()
            };

            const response = await fetch(`${this.WEBHOOK_BASE_URL}/machine_batch_update`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(batchData)
            });

            if (!response.ok) {
                throw new Error(`Webhook error! status: ${response.status}`);
            }

            return { success: true, data: await response.json() };
        } catch (error) {
            console.error('Error batch updating status:', error);
            throw error;
        }
    }

    // === FILE UPLOAD ===
    async uploadImage(file, machineId, imageType = 'general') {
        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('machine_id', machineId);
            formData.append('type', imageType);
            formData.append('timestamp', new Date().toISOString());

            const response = await fetch(`${this.WEBHOOK_BASE_URL}/machine_upload_image`, {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                throw new Error(`Upload error! status: ${response.status}`);
            }

            return { success: true, data: await response.json() };
        } catch (error) {
            console.error('Error uploading image:', error);
            throw error;
        }
    }
}

// Create global instance
window.SmartMachineAPI = {
    // API Configuration
    API_BASE_URL: 'https://autoslp.duckdns.org/api/data',
    WEBHOOK_BASE_URL: 'https://autoslp.duckdns.org:5678/webhook',

    // === MACHINES API ===
    getMachines: async function() {
        try {
            const response = await fetch(`${this.API_BASE_URL}/machines`);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const data = await response.json();
            return Array.isArray(data) ? data : [];
        } catch (error) {
            console.error('Error fetching machines:', error);
            throw error;
        }
    },

    getMachine: async function(id) {
        try {
            const response = await fetch(`${this.API_BASE_URL}/machines/${id}`);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            return await response.json();
        } catch (error) {
            console.error('Error fetching machine:', error);
            throw error;
        }
    },

    saveMachine: async function(data, isEdit = false, id = null) {
        try {
            const webhookData = {
                action: isEdit ? 'update' : 'create',
                data: this.transformToAPIFormat(data),
                id: id,
                timestamp: new Date().toISOString()
            };

            const response = await fetch(`${this.WEBHOOK_BASE_URL}/machine`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(webhookData)
            });

            if (!response.ok) {
                throw new Error(`Webhook error! status: ${response.status}`);
            }

            return { success: true, data: await response.json() };
        } catch (error) {
            console.error('Error saving machine:', error);
            throw error;
        }
    },

    // === WORK HISTORY API ===
    getWorkHistory: async function(machineId = null, machineCode = null) {
        try {
            // Get all work history first, then filter by machine_id
            const allWorkHistory = await this.getAllWorkHistory();
            
            if (!machineId && machineCode) {
                // If only machineCode provided, find Machine first to get ID
                const machineList = await this.getMachines();
                const machine = machineList.find(machine => {
                    const code = machine.code || machine.ma_may;
                    return code === machineCode;
                });
                if (machine) {
                    machineId = machine.id;
                }
            }
            
            if (!machineId) {
                return [];
            }
            
            // Filter work history by machine_id
            const filteredHistory = allWorkHistory.filter(work => {
                return work.machine_id == machineId || work.may_id == machineId;
            });
            
            return filteredHistory;
            
        } catch (error) {
            console.error('Error fetching work history:', error);
            return [];
        }
    },
    
    // Get all work history records
    getAllWorkHistory: async function() {
        try {
            const response = await fetch(`${this.API_BASE_URL}/machine_work_history`);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const data = await response.json();
            return Array.isArray(data) ? data : [];
        } catch (error) {
            console.error('Error fetching all work history:', error);
            return [];
        }
    },

    saveWorkHistory: async function(workData) {
        try {
            const webhookData = {
                action: 'create_work',
                data: workData,
                timestamp: new Date().toISOString()
            };

            const response = await fetch(`${this.WEBHOOK_BASE_URL}/machine_work_history`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(webhookData)
            });

            if (!response.ok) {
                throw new Error(`Webhook error! status: ${response.status}`);
            }

            return { success: true, data: await response.json() };
        } catch (error) {
            console.error('Error saving work history:', error);
            throw error;
        }
    },

    // === MAINTENANCE & REPAIR ===
    performMaintenance: async function(machineData) {
        try {
            const maintenanceData = {
                action: 'maintenance',
                machine: machineData.machine,
                work_data: {
                    work_date: new Date().toISOString().split('T')[0],
                    type: 'maintenance',
                    description: machineData.description || 'Bảo dưỡng định kỳ',
                    worker_name: machineData.worker_name || 'Nhân viên kỹ thuật',
                    status: 'completed',
                    notes: machineData.notes || 'Thực hiện bảo dưỡng qua hệ thống'
                },
                timestamp: new Date().toISOString()
            };

            const response = await fetch(`${this.WEBHOOK_BASE_URL}/machine_maintenance`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(maintenanceData)
            });

            if (!response.ok) {
                throw new Error(`Webhook error! status: ${response.status}`);
            }

            return { success: true, data: await response.json() };
        } catch (error) {
            console.error('Error performing maintenance:', error);
            throw error;
        }
    },

    performRepair: async function(machineData) {
        try {
            const repairData = {
                action: 'repair',
                machine: machineData.machine,
                work_data: {
                    work_date: new Date().toISOString().split('T')[0],
                    type: 'repair',
                    description: machineData.description || 'Sửa chữa hỏng hóc',
                    worker_name: machineData.worker_name || 'Nhân viên kỹ thuật',
                    status: 'completed',
                    notes: machineData.notes || 'Thực hiện sửa chữa qua hệ thống'
                },
                timestamp: new Date().toISOString()
            };

            const response = await fetch(`${this.WEBHOOK_BASE_URL}/machine_repair`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(repairData)
            });

            if (!response.ok) {
                throw new Error(`Webhook error! status: ${response.status}`);
            }

            return { success: true, data: await response.json() };
        } catch (error) {
            console.error('Error performing repair:', error);
            throw error;
        }
    },

    // === CONTRACTORS API ===
    getContractors: async function(activeOnly = true) {
        try {
            let url = `${this.API_BASE_URL}/contractors`;
            if (activeOnly) url += '?active=true';
            
            const response = await fetch(url);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const data = await response.json();
            return Array.isArray(data) ? data : [];
        } catch (error) {
            console.error('Error fetching contractors:', error);
            throw error;
        }
    },

    // === STATISTICS ===
    getStatistics: async function() {
        try {
            const response = await fetch(`${this.API_BASE_URL}/machine_statistics`);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            return await response.json();
        } catch (error) {
            console.error('Error fetching statistics:', error);
            // Return empty stats as fallback
            return {
                machine_by_status: {},
                total_machines: 0,
                upcoming_maintenance: [],
                work_by_type: [],
                monthly_works: []
            };
        }
    },

    // === UTILITY FUNCTIONS ===
    transformToAPIFormat: function(data) {
        return {
            ma_may: data.code,
            loai: data.type,
            khu_vuc: data.area,
            vi_tri: data.location,
            cong_suat: data.capacity,
            hang: data.brand,
            ngay_lap_dat: data.install_date,
            ngay_bao_hanh: data.warranty_date,
            trang_thai: data.status,
            bao_duong_tiep_theo: data.next_maintenance,
            ghi_chu: data.notes,
            serial: data.serial
        };
    },

    // Transform API data to frontend format
    transformFromAPIFormat: function(apiData) {
        // Return immediately if data is null or undefined
        if (!apiData) return null;
        
        // Transform data to match frontend format
        return {
            id: apiData.id,
            code: apiData.ma_may || apiData.code,
            type: apiData.loai || apiData.type,
            area: apiData.khu_vuc || apiData.area,
            location: apiData.vi_tri || apiData.location,
            capacity: apiData.cong_suat || apiData.capacity,
            brand: apiData.hang || apiData.brand,
            installDate: apiData.ngay_lap_dat || apiData.install_date,
            warrantyDate: apiData.ngay_bao_hanh || apiData.warranty_date,
            status: apiData.trang_thai || apiData.status,
            lastMaintenance: apiData.bao_duong_gan_nhat || apiData.last_maintenance,
            nextMaintenance: apiData.bao_duong_tiep_theo || apiData.next_maintenance,
            notes: apiData.ghi_chu || apiData.notes || '',
            
            // Ensure these fields are properly transformed
            serial: apiData.serial || apiData.so_serial || '',
            avatar_url: apiData.avatar_url || '',
            images_urls: apiData.images_urls || [],
            documents_urls: apiData.documents_urls || [],
            
            // Statistics
            totalWorks: apiData.tong_cong_viec || apiData.total_works || 0,
            maintenanceCount: apiData.so_lan_bao_duong || apiData.maintenance_count || 0,
            repairCount: apiData.so_lan_sua_chua || apiData.repair_count || 0,
            totalCost: apiData.tong_chi_phi || apiData.total_cost || 0,
            lastContractorName: apiData.nha_thau_gan_nhat || apiData.last_contractor_name || '',
            workHistory: []
        };
    },

    // === BATCH OPERATIONS ===
    batchUpdateStatus: async function(ids, newStatus) {
        try {
            const batchData = {
                action: 'batch_update_status',
                ids: ids,
                status: newStatus,
                timestamp: new Date().toISOString()
            };

            const response = await fetch(`${this.WEBHOOK_BASE_URL}/machine_batch_update`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(batchData)
            });

            if (!response.ok) {
                throw new Error(`Webhook error! status: ${response.status}`);
            }

            return { success: true, data: await response.json() };
        } catch (error) {
            console.error('Error batch updating status:', error);
            throw error;
        }
    },

    // === FILE UPLOAD ===
    uploadImage: async function(file, machineId, imageType = 'general') {
        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('machine_id', machineId);
            formData.append('type', imageType);
            formData.append('timestamp', new Date().toISOString());

            const response = await fetch(`${this.WEBHOOK_BASE_URL}/machine_upload_image`, {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                throw new Error(`Upload error! status: ${response.status}`);
            }

            return { success: true, data: await response.json() };
        } catch (error) {
            console.error('Error uploading image:', error);
            throw error;
        }
    }
};

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SmartMachineAPI;
} 