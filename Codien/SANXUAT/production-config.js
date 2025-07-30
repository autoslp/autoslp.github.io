// Production Configuration

// API Configuration
const API = {
  baseUrl: 'https://autoslp.duckdns.org/api',
  
  formatNumber: function(num) {
    return new Intl.NumberFormat('vi-VN').format(num || 0);
  },
  
  showNotification: function(message, type = 'info') {
    // Simple notification
    const alertClass = type === 'error' ? 'danger' : type;
    const alert = document.createElement('div');
    alert.className = `alert alert-${alertClass} alert-dismissible fade show position-fixed`;
    alert.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 300px;';
    alert.innerHTML = `
      ${message}
      <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    document.body.appendChild(alert);
    
    setTimeout(() => {
      if (alert.parentNode) {
        alert.remove();
      }
    }, 5000);
  },
  
  showLoading: function() {
    const overlay = document.getElementById('loadingOverlay');
    if (!overlay) {
      // Tạo overlay nếu chưa tồn tại
      const loadingOverlay = document.createElement('div');
      loadingOverlay.id = 'loadingOverlay';
      loadingOverlay.style.cssText = 'display: flex; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 9999; justify-content: center; align-items: center;';
      
      const loadingContent = document.createElement('div');
      loadingContent.className = 'text-center text-white';
      loadingContent.innerHTML = `
        <div class="spinner-border" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
        <div class="mt-2">Đang tải dữ liệu từ API...</div>
      `;
      
      loadingOverlay.appendChild(loadingContent);
      document.body.appendChild(loadingOverlay);
    } else {
      overlay.style.display = 'flex';
    }
  },
  
  hideLoading: function() {
    const overlay = document.getElementById('loadingOverlay');
    if (overlay) {
      overlay.style.display = 'none';
    }
  },
  
  getToday: function() {
    return new Date().toISOString().split('T')[0];
  },
  
  formatDate: function(dateStr) {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('vi-VN');
  }
};

// Export API to global scope
window.API = API;
