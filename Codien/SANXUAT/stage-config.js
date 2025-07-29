// Cấu hình cho các công đoạn sản xuất
window.STAGE_CONFIG = {
  // Công đoạn XẢ
  xa: {
    name: 'XẢ',
    icon: 'bi-bullseye',
    description: 'Xả giấy cuộn - Quản lý chi tiết',
    machines: ['Xả'],
    tableColumns: [
      { field: 'date', label: 'Ngày SX', width: '100px' },
      { field: 'shift', label: 'Ca', width: '80px' },
      { field: 'machine', label: 'Máy', width: '80px' },
      { field: 'orderCode', label: 'Mã lệnh', width: '120px' },
      { field: 'orderType', label: 'Loại lệnh', width: '100px' },
      { field: 'productCode', label: 'Mã SP', width: '120px' },
      { field: 'productName', label: 'Tên sản phẩm', width: '200px' },
      { field: 'planQty', label: 'SL Triển khai', width: '100px', format: (val) => `<span class="quantity-display">${val || 0}</span>` },
      { field: 'paperType', label: 'Loại giấy', width: '80px' },
      { field: 'paperWeight', label: 'Định lượng', width: '80px' },
      { field: 'length', label: 'Dài', width: '80px' },
      { field: 'width', label: 'Rộng', width: '80px' },
      { field: 'pcsPerSheet', label: 'Số phôi', width: '80px' },
      { field: 'sheetLength', label: 'Dài phôi', width: '80px' },
      { field: 'sheetWidth', label: 'Rộng phôi', width: '80px' },
      { field: 'turn', label: 'Lượt', width: '80px' },
      { field: 'requiredQty', label: 'SL Yêu cầu', width: '100px', format: (val) => `<span class="quantity-display">${val || 0}</span>` },
      { field: 'goodQty', label: 'SL Đạt', width: '100px', format: (val) => `<span class="quantity-display">${val || 0}</span>` },
      { field: 'ngQty', label: 'SL NG', width: '100px', format: (val) => `<span class="quantity-display">${val || 0}</span>` },
      { field: 'ngStartEndQty', label: 'SL NG đầu/cuối', width: '100px', format: (val) => `<span class="quantity-display">${val || 0}</span>` },
      { field: 'returnQty', label: 'SL Tồn trả', width: '100px', format: (val) => `<span class="quantity-display">${val || 0}</span>` },
      { field: 'startTime', label: 'Giờ bắt đầu', width: '100px' },
      { field: 'endTime', label: 'Giờ kết thúc', width: '100px' },
      { field: 'worker', label: 'Thợ', width: '120px' }
    ],
    formFields: [
      { field: 'productionDate', label: 'Ngày sản xuất', type: 'date', required: true },
      { field: 'shift', label: 'Ca', type: 'select', options: ['Ca 1', 'Ca 2', 'Ca 3'], required: true },
      { field: 'machine', label: 'Máy', type: 'select', options: ['Xả'], required: true },
      { field: 'orderCode', label: 'Mã lệnh', type: 'text', required: true },
      { field: 'orderType', label: 'Loại lệnh', type: 'select', options: ['Thường', 'Gấp', 'Mẫu'], required: true },
      { field: 'productCode', label: 'Mã sản phẩm', type: 'text', required: true },
      { field: 'productName', label: 'Tên sản phẩm', type: 'text', required: true, colSpan: 12 },
      { field: 'planQty', label: 'SL Triển khai', type: 'number', required: true },
      { field: 'paperType', label: 'Loại giấy', type: 'text', required: true },
      { field: 'paperWeight', label: 'Định lượng', type: 'number', required: true },
      { field: 'length', label: 'Dài', type: 'number', required: true },
      { field: 'width', label: 'Rộng', type: 'number', required: true },
      { field: 'pcsPerSheet', label: 'Số phôi', type: 'number', required: true },
      { field: 'sheetLength', label: 'Dài phôi', type: 'number', required: true },
      { field: 'sheetWidth', label: 'Rộng phôi', type: 'number', required: true }
    ],
    quantityFields: [
      { field: 'goodQty', label: 'Số lượng đạt', type: 'number', required: true },
      { field: 'ngQty', label: 'Số lượng NG', type: 'number', required: true },
      { field: 'ngStartEndQty', label: 'Số lượng NG đầu/cuối', type: 'number', required: true },
      { field: 'returnQty', label: 'Số lượng tồn trả', type: 'number', required: true },
      { field: 'worker', label: 'Thợ', type: 'text', required: true },
      { field: 'note', label: 'Ghi chú', type: 'textarea', rows: 3 }
    ],
    sampleData: [
      {
        orderCode: 'LSX001',
        date: new Date().toISOString().split('T')[0],
        shift: 'Ca 1',
        machine: 'Xả',
        orderType: 'Thường',
        productCode: 'SP001',
        productName: 'Hộp giày Nike Air Max',
        planQty: 1000,
        paperType: 'BC',
        paperWeight: 350,
        length: 320,
        width: 180,
        pcsPerSheet: 2,
        sheetLength: 350,
        sheetWidth: 200,
        requiredQty: 500,
        goodQty: 450,
        ngQty: 30,
        ngStartEndQty: 10,
        returnQty: 10,
        startTime: '08:00',
        endTime: '12:00',
        worker: 'Nguyễn Văn A',
        note: 'Hoàn thành tốt'
      }
    ]
  },

  // Công đoạn XÉN
  xen: {
    name: 'XÉN',
    icon: 'bi-scissors',
    description: 'Xén giấy - Quản lý chi tiết',
    machines: ['Xén 1', 'Xén 2'],
    tableColumns: [
      { field: 'date', label: 'Ngày SX', width: '100px' },
      { field: 'shift', label: 'Ca', width: '80px' },
      { field: 'machine', label: 'Máy', width: '80px' },
      { field: 'orderCode', label: 'Mã lệnh', width: '120px' },
      { field: 'orderType', label: 'Loại lệnh', width: '100px' },
      { field: 'productCode', label: 'Mã SP', width: '120px' },
      { field: 'productName', label: 'Tên sản phẩm', width: '200px' },
      { field: 'planQty', label: 'SL Triển khai', width: '100px', format: (val) => `<span class="quantity-display">${val || 0}</span>` },
      { field: 'paperType', label: 'Loại giấy', width: '80px' },
      { field: 'paperWeight', label: 'Định lượng', width: '80px' },
      { field: 'cutLength', label: 'Khổ cắt dài', width: '100px' },
      { field: 'cutWidth', label: 'Khổ cắt rộng', width: '100px' },
      { field: 'pcsPerSheet', label: 'Số phôi/tờ', width: '80px' },
      { field: 'totalSheets', label: 'Tổng số tờ', width: '100px' },
      { field: 'goodQty', label: 'SL Đạt', width: '100px', format: (val) => `<span class="quantity-display">${val || 0}</span>` },
      { field: 'ngQty', label: 'SL NG', width: '100px', format: (val) => `<span class="quantity-display">${val || 0}</span>` },
      { field: 'ngStartEndQty', label: 'SL NG đầu/cuối', width: '100px', format: (val) => `<span class="quantity-display">${val || 0}</span>` },
      { field: 'returnQty', label: 'SL Tồn trả', width: '100px', format: (val) => `<span class="quantity-display">${val || 0}</span>` },
      { field: 'startTime', label: 'Giờ bắt đầu', width: '100px' },
      { field: 'endTime', label: 'Giờ kết thúc', width: '100px' },
      { field: 'worker', label: 'Thợ', width: '120px' }
    ],
    formFields: [
      { field: 'productionDate', label: 'Ngày sản xuất', type: 'date', required: true },
      { field: 'shift', label: 'Ca', type: 'select', options: ['Ca 1', 'Ca 2', 'Ca 3'], required: true },
      { field: 'machine', label: 'Máy', type: 'select', options: ['Xén 1', 'Xén 2'], required: true },
      { field: 'orderCode', label: 'Mã lệnh', type: 'text', required: true },
      { field: 'orderType', label: 'Loại lệnh', type: 'select', options: ['Thường', 'Gấp', 'Mẫu'], required: true },
      { field: 'productCode', label: 'Mã sản phẩm', type: 'text', required: true },
      { field: 'productName', label: 'Tên sản phẩm', type: 'text', required: true, colSpan: 12 },
      { field: 'planQty', label: 'SL Triển khai', type: 'number', required: true },
      { field: 'paperType', label: 'Loại giấy', type: 'text', required: true },
      { field: 'paperWeight', label: 'Định lượng', type: 'number', required: true },
      { field: 'cutLength', label: 'Khổ cắt dài', type: 'number', required: true },
      { field: 'cutWidth', label: 'Khổ cắt rộng', type: 'number', required: true },
      { field: 'pcsPerSheet', label: 'Số phôi/tờ', type: 'number', required: true },
      { field: 'totalSheets', label: 'Tổng số tờ', type: 'number', required: true }
    ],
    quantityFields: [
      { field: 'goodQty', label: 'Số lượng đạt', type: 'number', required: true },
      { field: 'ngQty', label: 'Số lượng NG', type: 'number', required: true },
      { field: 'ngStartEndQty', label: 'Số lượng NG đầu/cuối', type: 'number', required: true },
      { field: 'returnQty', label: 'Số lượng tồn trả', type: 'number', required: true },
      { field: 'worker', label: 'Thợ', type: 'text', required: true },
      { field: 'note', label: 'Ghi chú', type: 'textarea', rows: 3 }
    ],
    sampleData: [
      {
        orderCode: 'LSX002',
        date: new Date().toISOString().split('T')[0],
        shift: 'Ca 1',
        machine: 'Xén 1',
        orderType: 'Thường',
        productCode: 'SP002',
        productName: 'Hộp điện thoại iPhone',
        planQty: 800,
        paperType: 'Ivory',
        paperWeight: 300,
        cutLength: 280,
        cutWidth: 160,
        pcsPerSheet: 4,
        totalSheets: 200,
        goodQty: 780,
        ngQty: 15,
        ngStartEndQty: 5,
        returnQty: 0,
        startTime: '08:00',
        endTime: '11:30',
        worker: 'Trần Văn B',
        note: 'OK'
      }
    ]
  },

  // Công đoạn IN
  in: {
    name: 'IN',
    icon: 'bi-printer',
    description: 'In ấn - Quản lý chi tiết',
    machines: ['Offset 1', 'Offset 2', 'Digital 1'],
    tableColumns: [
      { field: 'date', label: 'Ngày SX', width: '100px' },
      { field: 'shift', label: 'Ca', width: '80px' },
      { field: 'machine', label: 'Máy', width: '80px' },
      { field: 'orderCode', label: 'Mã lệnh', width: '120px' },
      { field: 'productCode', label: 'Mã SP', width: '120px' },
      { field: 'productName', label: 'Tên sản phẩm', width: '200px' },
      { field: 'planQty', label: 'SL Triển khai', width: '100px', format: (val) => `<span class="quantity-display">${val || 0}</span>` },
      { field: 'colorCount', label: 'Số màu', width: '80px' },
      { field: 'inkType', label: 'Loại mực', width: '100px' },
      { field: 'printSpeed', label: 'Tốc độ in', width: '100px' },
      { field: 'goodQty', label: 'SL Đạt', width: '100px', format: (val) => `<span class="quantity-display">${val || 0}</span>` },
      { field: 'ngQty', label: 'SL NG', width: '100px', format: (val) => `<span class="quantity-display">${val || 0}</span>` },
      { field: 'worker', label: 'Thợ', width: '120px' }
    ],
    // ... thêm formFields, quantityFields, sampleData tương tự
  },

  // Công đoạn BỒI
  boi: {
    name: 'BỒI',
    icon: 'bi-file-text',
    description: 'Bồi giấy - Quản lý chi tiết',
    machines: ['Bồi 1', 'Bồi 2'],
    // ... định nghĩa tương tự
  },

  // Công đoạn BẾ
  be: {
    name: 'BẾ',
    icon: 'bi-knife',
    description: 'Bế hộp - Quản lý chi tiết',
    machines: ['Bế 1', 'Bế 2', 'Bế 3'],
    // ... định nghĩa tương tự
  },

  // Công đoạn DÁN
  dan: {
    name: 'DÁN',
    icon: 'bi-link',
    description: 'Dán hộp - Quản lý chi tiết',
    machines: ['Dán 1', 'Dán 2'],
    // ... định nghĩa tương tự
  },

  // KHO THÀNH PHẨM
  kho: {
    name: 'KHO THÀNH PHẨM',
    icon: 'bi-building',
    description: 'Quản lý kho thành phẩm',
    machines: ['Kho A', 'Kho B'],
    // ... định nghĩa tương tự
  }
};

// Helper function để tạo HTML từ cấu hình
window.StageHelper = {
  // Tạo table headers
  generateTableHeaders: function(stageCode) {
    const config = window.STAGE_CONFIG[stageCode];
    if (!config || !config.tableColumns) return '';
    
    let headers = '';
    config.tableColumns.forEach(column => {
      headers += `<th style="width: ${column.width || 'auto'}">${column.label}</th>`;
    });
    headers += '<th style="width: 150px">Thao tác</th>';
    
    return headers;
  },

  // Tạo machine options
  generateMachineOptions: function(stageCode) {
    const config = window.STAGE_CONFIG[stageCode];
    if (!config || !config.machines) return '';
    
    let options = '';
    config.machines.forEach(machine => {
      options += `<option value="${machine}">${machine}</option>`;
    });
    
    return options;
  },

  // Tạo form fields
  generateFormFields: function(stageCode) {
    const config = window.STAGE_CONFIG[stageCode];
    if (!config || !config.formFields) return '';
    
    let fields = '';
    config.formFields.forEach(field => {
      const colSpan = field.colSpan || 4;
      const required = field.required ? 'required' : '';
      
      fields += `<div class="col-md-${colSpan}">`;
      fields += `<label class="form-label">${field.label}:</label>`;
      
      if (field.type === 'select') {
        fields += `<select class="form-control" id="${field.field}" ${required}>`;
        fields += '<option value="">Chọn...</option>';
        field.options.forEach(option => {
          fields += `<option value="${option}">${option}</option>`;
        });
        fields += '</select>';
      } else if (field.type === 'textarea') {
        const rows = field.rows || 3;
        fields += `<textarea class="form-control" id="${field.field}" rows="${rows}" ${required}></textarea>`;
      } else {
        fields += `<input type="${field.type}" class="form-control" id="${field.field}" ${required}>`;
      }
      
      fields += '</div>';
    });
    
    return fields;
  },

  // Tạo quantity fields
  generateQuantityFields: function(stageCode) {
    const config = window.STAGE_CONFIG[stageCode];
    if (!config || !config.quantityFields) return '';
    
    let fields = '';
    config.quantityFields.forEach(field => {
      const required = field.required ? 'required' : '';
      
      fields += '<div class="mb-3">';
      fields += `<label class="form-label">${field.label}:</label>`;
      
      if (field.type === 'textarea') {
        const rows = field.rows || 3;
        fields += `<textarea class="form-control" id="${field.field}" rows="${rows}" ${required}></textarea>`;
      } else {
        fields += `<input type="${field.type}" class="form-control" id="${field.field}" ${required}>`;
      }
      
      fields += '</div>';
    });
    
    return fields;
  }
};
