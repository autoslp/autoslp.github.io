// App utility functions
const App = {
  // Lưu dữ liệu vào localStorage
  save: function(key, data) {
    try {
      localStorage.setItem(key, JSON.stringify(data));
      return true;
    } catch (e) {
      console.error('Lỗi lưu dữ liệu:', e);
      return false;
    }
  },
  
  // Tải dữ liệu từ localStorage
  load: function(key, defaultValue = null) {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : defaultValue;
    } catch (e) {
      console.error('Lỗi tải dữ liệu:', e);
      return defaultValue;
    }
  },
  
  // Xóa dữ liệu từ localStorage
  remove: function(key) {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (e) {
      console.error('Lỗi xóa dữ liệu:', e);
      return false;
    }
  },
  
  // Format ngày tháng
  formatDate: function(date) {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleDateString('vi-VN');
  },
  
  // Format số
  formatNumber: function(num) {
    if (!num && num !== 0) return '';
    return new Intl.NumberFormat('vi-VN').format(num);
  },
  
  // Tạo ID duy nhất
  generateId: function() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  },
  
  // Hiển thị thông báo
  notify: function(message, type = 'info') {
    // Tạo element thông báo
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Style cho thông báo
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 12px 20px;
      border-radius: 6px;
      color: white;
      font-weight: 500;
      z-index: 9999;
      animation: slideIn 0.3s ease-out;
    `;
    
    // Màu sắc theo loại
    const colors = {
      success: '#10b981',
      error: '#ef4444',
      warning: '#f59e0b',
      info: '#3b82f6'
    };
    
    notification.style.background = colors[type] || colors.info;
    
    // Thêm CSS animation
    if (!document.querySelector('#notification-styles')) {
      const style = document.createElement('style');
      style.id = 'notification-styles';
      style.textContent = `
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOut {
          from { transform: translateX(0); opacity: 1; }
          to { transform: translateX(100%); opacity: 0; }
        }
      `;
      document.head.appendChild(style);
    }
    
    document.body.appendChild(notification);
    
    // Tự động ẩn sau 3 giây
    setTimeout(() => {
      notification.style.animation = 'slideOut 0.3s ease-in';
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 300);
    }, 3000);
  },
  
  // Xác nhận hành động
  confirm: function(message, callback) {
    if (confirm(message)) {
      callback();
    }
  },
  
  // Validate form
  validateForm: function(formElement) {
    const inputs = formElement.querySelectorAll('input[required], select[required], textarea[required]');
    let isValid = true;
    
    inputs.forEach(input => {
      if (!input.value.trim()) {
        input.style.borderColor = '#ef4444';
        isValid = false;
      } else {
        input.style.borderColor = '#e5e7eb';
      }
    });
    
    return isValid;
  },
  
  // Refresh data
  refreshData: function() {
    if (typeof renderData === 'function') {
      renderData();
      App.notify('Dữ liệu đã được làm mới', 'success');
    }
  }
};

// Utility functions cho ngày tháng
const DateUtils = {
  today: function() {
    return new Date().toISOString().split('T')[0];
  },
  
  format: function(date, format = 'dd/mm/yyyy') {
    if (!date) return '';
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    
    return format
      .replace('dd', day)
      .replace('mm', month)
      .replace('yyyy', year);
  }
};

// Export cho global scope
window.App = App;
window.DateUtils = DateUtils;
