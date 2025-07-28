// app.js - logic chung cho toàn hệ thống
window.App = {
  save(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  },
  load(key, def) {
    try {
      return JSON.parse(localStorage.getItem(key)) || def;
    } catch { return def; }
  },
  remove(key) { localStorage.removeItem(key); },
  now() { return new Date().toISOString(); },
  
  // Khởi tạo dữ liệu mẫu nếu chưa có
  initSampleData() {
    // Khởi tạo vật tư mẫu
    if (!this.load('VAT_TU', null)) {
      const sampleVatTu = [
        {id: 'VT001', name: 'Giấy carton 3 lớp', stock: 5000, unit: 'm²', value: 15000},
        {id: 'VT002', name: 'Giấy carton 5 lớp', stock: 3000, unit: 'm²', value: 25000},
        {id: 'VT003', name: 'Mực in offset đen', stock: 50, unit: 'kg', value: 80000},
        {id: 'VT004', name: 'Mực in offset xanh', stock: 30, unit: 'kg', value: 85000},
        {id: 'VT005', name: 'Keo dán carton', stock: 100, unit: 'kg', value: 45000},
        {id: 'VT006', name: 'Băng keo đóng gói', stock: 200, unit: 'cuộn', value: 25000},
        {id: 'VT007', name: 'Giấy bồi 2 mặt', stock: 1000, unit: 'm²', value: 12000},
        {id: 'VT008', name: 'Lưới in lưới', stock: 50, unit: 'm²', value: 180000}
      ];
      this.save('VAT_TU', sampleVatTu);
    }
    
    // Khởi tạo workflow mẫu
    if (!this.load('workflow', null)) {
      const sampleWorkflow = [
        {name: 'XẢ', desc: 'Xả giấy cuộn'},
        {name: 'XÉN', desc: 'Xén giấy theo kích thước'},
        {name: 'IN OFFSET', desc: 'In offset màu'},
        {name: 'BỒI', desc: 'Bồi giấy'},
        {name: 'BẾ', desc: 'Bế hộp'},
        {name: 'DÁN MÁY', desc: 'Dán hộp bằng máy'},
        {name: 'KHO THÀNH PHẨM', desc: 'Lưu kho thành phẩm'}
      ];
      this.save('workflow', sampleWorkflow);
    }
  },
  
  // Các hàm tiện ích
  formatDate(dateStr) {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleString('vi-VN');
  },
  
  formatNumber(num) {
    return new Intl.NumberFormat('vi-VN').format(num);
  },
  
  generateId(prefix = 'ID') {
    return prefix + Date.now().toString(36).toUpperCase();
  }
};

// Khởi tạo dữ liệu mẫu khi load trang
document.addEventListener('DOMContentLoaded', function() {
  App.initSampleData();
}); 