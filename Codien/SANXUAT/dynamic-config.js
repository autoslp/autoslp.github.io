// Dynamic Stage Configuration - chỉ cần thay đổi JSON này
window.DYNAMIC_STAGE_CONFIG = {
  // Layout cố định - không đổi
  layout: {
    sidebar: {
      brand: "Carton Manager",
      footer: "© 2025 Carton Manager"
    },
    navigation: [
      { id: "dashboard", icon: "bi-house", text: "Trang chủ", type: "page" },
      { id: "production-orders", icon: "bi-clipboard-data", text: "Lệnh sản xuất", type: "page" },
      { id: "progress", icon: "bi-lightning", text: "Quản lý tiến độ", type: "page" },
      { id: "materials", icon: "bi-box-seam", text: "Vật tư", type: "page" },
      { id: "workflow", icon: "bi-arrow-repeat", text: "Công đoạn", type: "page" },
      { id: "reports", icon: "bi-graph-up", text: "Báo cáo", type: "page" },
      { id: "xa", icon: "bi-bullseye", text: "Công đoạn XẢ", type: "stage" },
      { id: "xen", icon: "bi-scissors", text: "Công đoạn XÉN", type: "stage" },
      { id: "in", icon: "bi-printer", text: "Công đoạn IN", type: "stage" },
      { id: "boi", icon: "bi-file-text", text: "Công đoạn BỒI", type: "stage" },
      { id: "be", icon: "bi-knife", text: "Công đoạn BẾ", type: "stage" },
      { id: "dan", icon: "bi-link", text: "Công đoạn DÁN", type: "stage" },
      { id: "kho", icon: "bi-building", text: "KHO THÀNH PHẨM", type: "stage" }
    ]
  },

  // Chỉ phần này thay đổi giữa các stage
  stages: {
    xa: {
      title: "Công đoạn XẢ",
      description: "Xả giấy cuộn - Quản lý chi tiết",
      icon: "bi-bullseye",
      color: "#28a745",
      
      // Cấu hình bộ lọc
      filters: {
        machines: ["Xả"],
        shifts: ["Ca 1", "Ca 2", "Ca 3"],
        customFilters: []
      },

      // Cấu hình bảng - CHỈ PHẦN NÀY KHÁC NHAU
      table: {
        columns: [
          { key: "date", label: "Ngày SX", width: "100px", type: "date" },
          { key: "shift", label: "Ca", width: "80px", type: "text" },
          { key: "machine", label: "Máy", width: "80px", type: "text" },
          { key: "orderCode", label: "Mã lệnh", width: "120px", type: "text", searchable: true },
          { key: "orderType", label: "Loại lệnh", width: "100px", type: "text" },
          { key: "productCode", label: "Mã SP", width: "120px", type: "text", searchable: true },
          { key: "productName", label: "Tên sản phẩm", width: "200px", type: "text", searchable: true },
          { key: "planQty", label: "SL Triển khai", width: "100px", type: "number", cssClass: "quantity-display" },
          { key: "paperType", label: "Loại giấy", width: "80px", type: "text" },
          { key: "paperWeight", label: "Định lượng", width: "80px", type: "number" },
          { key: "length", label: "Dài", width: "80px", type: "number" },
          { key: "width", label: "Rộng", width: "80px", type: "number" },
          { key: "pcsPerSheet", label: "Số phôi", width: "80px", type: "number" },
          { key: "sheetLength", label: "Dài phôi", width: "80px", type: "number" },
          { key: "sheetWidth", label: "Rộng phôi", width: "80px", type: "number" },
          { key: "turn", label: "Lượt", width: "80px", type: "number" },
          { key: "requiredQty", label: "SL Yêu cầu", width: "100px", type: "number", cssClass: "quantity-display" },
          { key: "goodQty", label: "SL Đạt", width: "100px", type: "number", cssClass: "quantity-display" },
          { key: "ngQty", label: "SL NG", width: "100px", type: "number", cssClass: "quantity-display" },
          { key: "ngStartEndQty", label: "SL NG đầu/cuối", width: "100px", type: "number", cssClass: "quantity-display" },
          { key: "returnQty", label: "SL Tồn trả", width: "100px", type: "number", cssClass: "quantity-display" },
          { key: "startTime", label: "Giờ bắt đầu", width: "100px", type: "time" },
          { key: "endTime", label: "Giờ kết thúc", width: "100px", type: "time" },
          { key: "worker", label: "Thợ", width: "120px", type: "text" }
        ],
        actions: [
          { key: "editQuantity", label: "Nhập SL", icon: "bi-pencil", cssClass: "btn-primary" },
          { key: "edit", label: "Sửa", icon: "bi-pencil-square", cssClass: "btn-info" },
          { key: "delete", label: "Xóa", icon: "bi-trash", cssClass: "btn-danger" }
        ]
      },

      // API endpoint
      api: {
        endpoint: "work_history.php",
        stage: "xa"
      },

      // Dữ liệu mẫu
      sampleData: [
        {
          orderCode: "LSX001",
          date: "2025-07-29",
          shift: "Ca 1",
          machine: "Xả",
          orderType: "Thường",
          productCode: "SP001",
          productName: "Hộp giày Nike Air Max",
          planQty: 1000,
          paperType: "BC",
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
          startTime: "08:00",
          endTime: "12:00",
          worker: "Nguyễn Văn A"
        }
      ]
    },

    xen: {
      title: "Công đoạn XÉN",
      description: "Xén giấy - Quản lý chi tiết", 
      icon: "bi-scissors",
      color: "#dc3545",
      
      filters: {
        machines: ["Xén 1", "Xén 2"],
        shifts: ["Ca 1", "Ca 2", "Ca 3"],
        customFilters: []
      },

      // CHỈ BẢNG NÀY KHÁC - các phần khác giống hệt
      table: {
        columns: [
          { key: "date", label: "Ngày SX", width: "100px", type: "date" },
          { key: "shift", label: "Ca", width: "80px", type: "text" },
          { key: "machine", label: "Máy", width: "80px", type: "text" },
          { key: "orderCode", label: "Mã lệnh", width: "120px", type: "text", searchable: true },
          { key: "orderType", label: "Loại lệnh", width: "100px", type: "text" },
          { key: "productCode", label: "Mã SP", width: "120px", type: "text", searchable: true },
          { key: "productName", label: "Tên sản phẩm", width: "200px", type: "text", searchable: true },
          { key: "planQty", label: "SL Triển khai", width: "100px", type: "number", cssClass: "quantity-display" },
          { key: "paperType", label: "Loại giấy", width: "80px", type: "text" },
          { key: "paperWeight", label: "Định lượng", width: "80px", type: "number" },
          { key: "cutLength", label: "Khổ cắt dài", width: "100px", type: "number" },
          { key: "cutWidth", label: "Khổ cắt rộng", width: "100px", type: "number" },
          { key: "pcsPerSheet", label: "Số phôi/tờ", width: "80px", type: "number" },
          { key: "totalSheets", label: "Tổng số tờ", width: "100px", type: "number" },
          { key: "goodQty", label: "SL Đạt", width: "100px", type: "number", cssClass: "quantity-display" },
          { key: "ngQty", label: "SL NG", width: "100px", type: "number", cssClass: "quantity-display" },
          { key: "ngStartEndQty", label: "SL NG đầu/cuối", width: "100px", type: "number", cssClass: "quantity-display" },
          { key: "returnQty", label: "SL Tồn trả", width: "100px", type: "number", cssClass: "quantity-display" },
          { key: "startTime", label: "Giờ bắt đầu", width: "100px", type: "time" },
          { key: "endTime", label: "Giờ kết thúc", width: "100px", type: "time" },
          { key: "worker", label: "Thợ", width: "120px", type: "text" }
        ],
        actions: [
          { key: "editQuantity", label: "Nhập SL", icon: "bi-pencil", cssClass: "btn-primary" },
          { key: "edit", label: "Sửa", icon: "bi-pencil-square", cssClass: "btn-info" },
          { key: "delete", label: "Xóa", icon: "bi-trash", cssClass: "btn-danger" }
        ]
      },

      api: {
        endpoint: "work_history.php",
        stage: "xen"
      },

      sampleData: [
        {
          orderCode: "LSX002",
          date: "2025-07-29",
          shift: "Ca 1", 
          machine: "Xén 1",
          orderType: "Thường",
          productCode: "SP002",
          productName: "Hộp điện thoại iPhone",
          planQty: 800,
          paperType: "Ivory",
          paperWeight: 300,
          cutLength: 280,
          cutWidth: 160,
          pcsPerSheet: 4,
          totalSheets: 200,
          goodQty: 780,
          ngQty: 15,
          ngStartEndQty: 5,
          returnQty: 0,
          startTime: "08:00",
          endTime: "11:30",
          worker: "Trần Văn B"
        }
      ]
    },

    in: {
      title: "Công đoạn IN",
      description: "In ấn - Quản lý chi tiết",
      icon: "bi-printer", 
      color: "#0d6efd",
      
      filters: {
        machines: ["Offset 1", "Offset 2", "Digital 1"],
        shifts: ["Ca 1", "Ca 2", "Ca 3"],
        customFilters: []
      },

      table: {
        columns: [
          { key: "date", label: "Ngày SX", width: "100px", type: "date" },
          { key: "shift", label: "Ca", width: "80px", type: "text" },
          { key: "machine", label: "Máy", width: "100px", type: "text" },
          { key: "orderCode", label: "Mã lệnh", width: "120px", type: "text", searchable: true },
          { key: "productCode", label: "Mã SP", width: "120px", type: "text", searchable: true },
          { key: "productName", label: "Tên sản phẩm", width: "200px", type: "text", searchable: true },
          { key: "planQty", label: "SL Triển khai", width: "100px", type: "number", cssClass: "quantity-display" },
          { key: "colorCount", label: "Số màu", width: "80px", type: "number" },
          { key: "inkType", label: "Loại mực", width: "100px", type: "text" },
          { key: "printSpeed", label: "Tốc độ in", width: "100px", type: "number" },
          { key: "paperType", label: "Loại giấy", width: "80px", type: "text" },
          { key: "goodQty", label: "SL Đạt", width: "100px", type: "number", cssClass: "quantity-display" },
          { key: "ngQty", label: "SL NG", width: "100px", type: "number", cssClass: "quantity-display" },
          { key: "startTime", label: "Giờ bắt đầu", width: "100px", type: "time" },
          { key: "endTime", label: "Giờ kết thúc", width: "100px", type: "time" },
          { key: "worker", label: "Thợ", width: "120px", type: "text" }
        ],
        actions: [
          { key: "editQuantity", label: "Nhập SL", icon: "bi-pencil", cssClass: "btn-primary" },
          { key: "edit", label: "Sửa", icon: "bi-pencil-square", cssClass: "btn-info" },
          { key: "delete", label: "Xóa", icon: "bi-trash", cssClass: "btn-danger" }
        ]
      },

      api: {
        endpoint: "work_history.php", 
        stage: "in"
      },

      sampleData: [
        {
          orderCode: "LSX003",
          date: "2025-07-29",
          shift: "Ca 1",
          machine: "Offset 1", 
          productCode: "SP003",
          productName: "Bao bì mỹ phẩm Chanel",
          planQty: 500,
          colorCount: 4,
          inkType: "UV",
          printSpeed: 8000,
          paperType: "Art Paper",
          goodQty: 485,
          ngQty: 15,
          startTime: "08:00",
          endTime: "10:30",
          worker: "Lê Văn C"
        }
      ]
    },

    // Có thể thêm các stage khác...
    boi: {
      title: "Công đoạn BỒI",
      description: "Bồi giấy - Quản lý chi tiết",
      icon: "bi-file-text",
      color: "#ffc107",
      
      filters: {
        machines: ["Bồi 1", "Bồi 2"],
        shifts: ["Ca 1", "Ca 2", "Ca 3"]
      },

      table: {
        columns: [
          { key: "date", label: "Ngày SX", width: "100px", type: "date" },
          { key: "shift", label: "Ca", width: "80px", type: "text" },
          { key: "machine", label: "Máy", width: "80px", type: "text" },
          { key: "orderCode", label: "Mã lệnh", width: "120px", type: "text", searchable: true },
          { key: "productName", label: "Tên sản phẩm", width: "200px", type: "text", searchable: true },
          { key: "planQty", label: "SL Triển khai", width: "100px", type: "number", cssClass: "quantity-display" },
          { key: "glueType", label: "Loại keo", width: "100px", type: "text" },
          { key: "layerCount", label: "Số lớp", width: "80px", type: "number" },
          { key: "goodQty", label: "SL Đạt", width: "100px", type: "number", cssClass: "quantity-display" },
          { key: "ngQty", label: "SL NG", width: "100px", type: "number", cssClass: "quantity-display" },
          { key: "worker", label: "Thợ", width: "120px", type: "text" }
        ],
        actions: [
          { key: "editQuantity", label: "Nhập SL", icon: "bi-pencil", cssClass: "btn-primary" },
          { key: "edit", label: "Sửa", icon: "bi-pencil-square", cssClass: "btn-info" },
          { key: "delete", label: "Xóa", icon: "bi-trash", cssClass: "btn-danger" }
        ]
      },

      api: {
        endpoint: "work_history.php",
        stage: "boi"
      },

      sampleData: []
    }
  }
};
