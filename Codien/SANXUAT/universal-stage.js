/**
 * Universal Stage Management System JavaScript
 * Quản lý công đoạn sản xuất thùng carton
 */

// Current stage and data
let currentStage = 'xa';
let stageData = {};
let editingOrderId = null;

// Stage configurations
const STAGE_CONFIG = {
  xa: {
    title: 'Công đoạn XẢ',
    description: 'Xả giấy cuộn - Quản lý chi tiết',
    icon: 'bi-bullseye',
    machines: ['Xả', 'Xả 1', 'Xả 2'],
    fields: [
      { key: 'paperType', label: 'Loại giấy', type: 'select', options: ['BC', 'CO', 'DP', 'KR'] },
      { key: 'paperWeight', label: 'Định lượng (g/m²)', type: 'number' },
      { key: 'length', label: 'Dài (mm)', type: 'number' },
      { key: 'width', label: 'Rộng (mm)', type: 'number' },
      { key: 'pcsPerSheet', label: 'Số phôi/tờ', type: 'number' },
      { key: 'sheetLength', label: 'Dài phôi (mm)', type: 'number' },
      { key: 'sheetWidth', label: 'Rộng phôi (mm)', type: 'number' }
    ],
    extraQuantityFields: [
      { key: 'ngStartEndQty', label: 'SL NG đầu/cuối' },
      { key: 'returnQty', label: 'SL Tồn trả' }
    ]
  },
  xen: {
    title: 'Công đoạn XÉN',
    description: 'Xén giấy - Quản lý chi tiết',
    icon: 'bi-scissors',
    machines: ['Xén 1', 'Xén 2', 'Xén 3'],
    fields: [
      { key: 'paperType', label: 'Loại giấy', type: 'select', options: ['BC', 'CO', 'DP', 'KR'] },
      { key: 'paperWeight', label: 'Định lượng (g/m²)', type: 'number' },
      { key: 'cutLength', label: 'Khổ cắt dài (mm)', type: 'number' },
      { key: 'cutWidth', label: 'Khổ cắt rộng (mm)', type: 'number' },
      { key: 'pcsPerSheet', label: 'Số phôi/tờ', type: 'number' },
      { key: 'totalSheets', label: 'Tổng số tờ', type: 'number' }
    ],
    extraQuantityFields: [
      { key: 'ngStartEndQty', label: 'SL NG đầu/cuối' },
      { key: 'returnQty', label: 'SL Tồn trả' }
    ]
  },
  in: {
    title: 'Công đoạn IN',
    description: 'In ấn - Quản lý chi tiết',
    icon: 'bi-printer',
    machines: ['Offset 1', 'Offset 2', 'Digital 1', 'Digital 2'],
    fields: [
      { key: 'colorCount', label: 'Số màu', type: 'number' },
      { key: 'inkType', label: 'Loại mực', type: 'select', options: ['UV', 'Oil', 'Water'] },
      { key: 'printSpeed', label: 'Tốc độ in (tờ/h)', type: 'number' }
    ],
    extraQuantityFields: []
  },
  boi: {
    title: 'Công đoạn BỒI',
    description: 'Bồi giấy - Quản lý chi tiết',
    icon: 'bi-file-text',
    machines: ['Bồi 1', 'Bồi 2'],
    fields: [
      { key: 'glueType', label: 'Loại keo', type: 'select', options: ['PVA', 'Hot Melt', 'Cold Glue'] },
      { key: 'layerCount', label: 'Số lớp', type: 'number' }
    ],
    extraQuantityFields: []
  },
  be: {
    title: 'Công đoạn BẾ',
    description: 'Bế hộp - Quản lý chi tiết',
    icon: 'bi-knife',
    machines: ['Bế 1', 'Bế 2'],
    fields: [
      { key: 'dieType', label: 'Loại dao bế', type: 'text' },
      { key: 'complexity', label: 'Độ phức tạp', type: 'select', options: ['Đơn giản', 'Trung bình', 'Phức tạp'] }
    ],
    extraQuantityFields: []
  },
  dan: {
    title: 'Công đoạn DÁN',
    description: 'Dán hộp - Quản lý chi tiết',
    icon: 'bi-link',
    machines: ['Dán 1', 'Dán 2'],
    fields: [
      { key: 'glueType', label: 'Loại keo dán', type: 'select', options: ['PVA', 'Hot Melt'] },
      { key: 'dryTime', label: 'Thời gian khô (phút)', type: 'number' }
    ],
    extraQuantityFields: []
  },
  kho: {
    title: 'KHO THÀNH PHẨM',
    description: 'Quản lý kho thành phẩm',
    icon: 'bi-building',
    machines: ['Kho A', 'Kho B'],
    fields: [
      { key: 'storageLocation', label: 'Vị trí lưu kho', type: 'text' },
      { key: 'packageType', label: 'Loại đóng gói', type: 'select', options: ['Thùng carton', 'Pallet', 'Bao PE'] }
    ],
    extraQuantityFields: []
  }
};

// Utility functions
function generateId() {
  return currentStage + '_' + Date.now().toString(36) + Math.random().toString(36).substr(2);
}

function formatNumber(num) {
  if (!num && num !== 0) return '';
  return new Intl.NumberFormat('vi-VN').format(num);
}

function formatDate(date) {
  if (!date) return '';
  return new Date(date).toLocaleDateString('vi-VN');
}

function getOrderTypeBadge(type) {
  const badges = {
    'Thường': 'secondary',
    'Gấp': 'danger',
    'Mẫu': 'warning',
    'Bù': 'info'
  };
  return badges[type] || 'secondary';
}

function showToast(message, type = 'info') {
  // Simple toast implementation
  const toast = document.createElement('div');
  toast.className = `alert alert-${type} position-fixed`;
  toast.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 300px;';
  toast.innerHTML = `
    ${message}
    <button type="button" class="btn-close" onclick="this.parentElement.remove()"></button>
  `;
  document.body.appendChild(toast);
  
  setTimeout(() => {
    if (toast.parentElement) toast.remove();
  }, 3000);
}

// Initialize when DOM is ready
if (typeof module !== 'undefined' && module.exports) {
  // Node.js environment
  module.exports = {
    STAGE_CONFIG,
    generateId,
    formatNumber,
    formatDate,
    getOrderTypeBadge,
    showToast
  };
}
