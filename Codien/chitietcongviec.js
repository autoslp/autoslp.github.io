// ==== LOGIN HANDLING ====
function showUserInfo() {
  if (localStorage.getItem('slp_user') && localStorage.getItem('slp_name')) {
    // Ưu tiên lấy tên hiển thị (tên thật), fallback sang mã nhân viên nếu không có
    const displayName = localStorage.getItem('slp_display_name') || localStorage.getItem('slp_name');
    const userRole = localStorage.getItem('slp_role') === 'quanly' ? 'Quản lý' : 'Nhân viên';
    
    // Cập nhật thông tin user trong header
    var nameEl = document.getElementById('dropdownUserName');
    var roleEl = document.getElementById('dropdownUserRole');
    if (nameEl) nameEl.textContent = displayName;
    if (roleEl) roleEl.textContent = userRole;
    
    // Cập nhật avatar với màu và ký tự
    updateAvatarDisplay(displayName);
    
    // Hiển thị avatar
    var avatarEl = document.getElementById('userAvatar');
    if (avatarEl) {
      avatarEl.style.display = 'flex';
    }
  }
}

// Hàm tạo màu avatar dựa trên tên
function generateAvatarColor(name) {
  const colors = [
    'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
    'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
    'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)'
  ];
  
  // Tạo hash từ tên để luôn có cùng màu cho cùng tên
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  return colors[Math.abs(hash) % colors.length];
}

// Hàm cập nhật avatar với màu và ký tự
function updateAvatarDisplay(displayName) {
  const firstChar = displayName ? displayName.charAt(0).toUpperCase() : 'U';
  const avatarColor = generateAvatarColor(displayName || 'User');
  
  // Cập nhật avatar chính trong header
  const avatarEl = document.getElementById('userAvatar');
  const avatarTextEl = document.getElementById('avatarText');
  if (avatarEl && avatarTextEl) {
    avatarEl.style.background = avatarColor;
    avatarTextEl.textContent = firstChar;
  }
  
  // Cập nhật avatar trong dropdown
  const dropdownAvatarEl = avatarEl?.nextElementSibling?.querySelector('.avatar');
  const dropdownAvatarTextEl = document.getElementById('dropdownAvatarText');
  if (dropdownAvatarEl && dropdownAvatarTextEl) {
    dropdownAvatarEl.style.background = avatarColor;
    dropdownAvatarTextEl.textContent = firstChar;
  }
}

function logoutSLP() {
  if (window.logoutSLPModule) {
    window.logoutSLPModule();
  } else {
    localStorage.removeItem('slp_user');
    localStorage.removeItem('slp_name');
    localStorage.removeItem('slp_display_name');
    localStorage.removeItem('slp_role');
    window.location.reload();
  }
}

window.addEventListener('DOMContentLoaded', async function() {
  // Kiểm tra đăng nhập sử dụng login-slp.js
  if (window.checkLoginSLP) {
    await window.checkLoginSLP(function(user) {
      // Callback khi đăng nhập thành công
      if (user) {
        console.log('Đăng nhập thành công:', user);
      }
    });
  }
  
  // Hiển thị thông tin user
  showUserInfo();

  // Lấy và hiển thị thống kê công việc
  try {
    const stats = await fetchWorkStatistics();
    updateWorkStatistics(stats);
  } catch (error) {
    console.error('Lỗi khi cập nhật thống kê:', error);
  }

  // Xử lý chi tiết công việc
  if (!stt) return;
  const row = await fetchWorkDetailBySTT(stt);
  if (row) renderWorkDetail(row);
});
// JavaScript for chitietcongviec.html
const urlParams = new URLSearchParams(window.location.search);
const stt = urlParams.get('stt');

// Hàm lấy danh sách nhân viên bộ phận Cơ điện
async function fetchElectricalDepartmentUsers() {
  try {
    const url = "https://autoslp.duckdns.org:5678/webhook/get-users";
    const response = await fetch(url);
    const data = await response.json();
    
    let users = [];
    if (Array.isArray(data)) {
      users = data;
    } else if (typeof data === 'object' && data !== null) {
      users = [data];
    }
    
    // Lọc chỉ nhân viên thuộc bộ phận Cơ điện
    const electricalUsers = users
      .filter(user => user.bo_phan && user.bo_phan.toLowerCase().includes('cơ điện'))
      .map(user => ({
        name: user.ten_nhan_vien?.trim() || '',
        code: user.ma_nhan_vien?.trim() || '',
        department: user.bo_phan?.trim() || '',
        position: user.chuc_vu?.trim() || ''
      }))
      .filter(user => user.name); // Chỉ lấy những user có tên
    
    return electricalUsers;
  } catch (error) {
    console.error('Lỗi khi lấy danh sách nhân viên Cơ điện:', error);
    return [];
  }
}

// Hàm lấy thống kê công việc
async function fetchWorkStatistics() {
  try {
    const url = "https://autoslp.duckdns.org:5678/webhook/get-congviec";
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const allWorks = await response.json();
    console.log('Raw data từ API:', allWorks);
    
    if (!Array.isArray(allWorks)) {
      console.warn('Dữ liệu thống kê không phải là mảng:', allWorks);
      return { totalWorks: 0, completedWorks: 0 };
    }
    
    // Đếm tổng số công việc
    const totalWorks = allWorks.length;
    console.log('📊 Tổng số công việc:', totalWorks);
    
    // Debug: Xem tất cả các trường thời gian bàn giao
    console.log('🔍 Kiểm tra tất cả thời gian bàn giao:');
    allWorks.forEach((work, index) => {
      console.log(`  [${index}] STT: ${work.stt}`);
      console.log(`    - thoiGianBanGiao: "${work.thoiGianBanGiao}" (${typeof work.thoiGianBanGiao})`);
      console.log(`    - thoi_gian_ban_giao: "${work.thoi_gian_ban_giao}" (${typeof work.thoi_gian_ban_giao})`);
    });
    
    // Đếm số công việc đã hoàn thành - LOGIC ĐƠN GIẢN
    const completedWorks = allWorks.filter(work => {
      // Kiểm tra cả hai tên trường có thể có
      const banGiao1 = work.thoiGianBanGiao;        // camelCase
      const banGiao2 = work.thoi_gian_ban_giao;     // snake_case từ database
      
      // Lấy giá trị bất kể tên trường nào
      const thoiGianBanGiao = banGiao1 || banGiao2;
      
      // Chỉ kiểm tra: có giá trị và không rỗng
      const hasValue = thoiGianBanGiao && thoiGianBanGiao.toString().trim() !== '';
      
      if (hasValue) {
        console.log('✅ Công việc hoàn thành:', {
          stt: work.stt,
          thoiGianBanGiao: thoiGianBanGiao,
          may: work.may || 'N/A',
          field_used: banGiao1 ? 'thoiGianBanGiao' : 'thoi_gian_ban_giao'
        });
      }
      
      return hasValue;
    }).length;
    
    console.log(`📈 KẾT QUÁ: ${completedWorks}/${totalWorks} công việc hoàn thành`);
    
    return {
      totalWorks,
      completedWorks
    };
  } catch (error) {
    console.error('Lỗi khi lấy thống kê công việc:', error);
    return { totalWorks: 0, completedWorks: 0 };
  }
}

// Hàm kiểm tra công việc có hoàn thành hay không (dựa trên thời gian bàn giao)
function isWorkCompleted(work) {
  // Kiểm tra cả hai tên trường có thể có
  const banGiao1 = work.thoiGianBanGiao;        // camelCase
  const banGiao2 = work.thoi_gian_ban_giao;     // snake_case từ database
  
  // Lấy giá trị bất kể tên trường nào
  const thoiGianBanGiao = banGiao1 || banGiao2;
  
  // Logic đơn giản: chỉ cần có giá trị và không rỗng
  return thoiGianBanGiao && thoiGianBanGiao.toString().trim() !== '';
}

// Hàm cập nhật hiển thị thống kê
function updateWorkStatistics(stats) {
  console.log('Cập nhật thống kê công việc:', stats);
  
  const completedWorkElement = document.getElementById('taskDone');
  const totalWorkElement = document.getElementById('projectDone');
  
  if (completedWorkElement) {
    completedWorkElement.textContent = stats.completedWorks || '0';
    console.log('✅ Công việc hoàn thành (có thời gian bàn giao):', stats.completedWorks);
  }
  
  if (totalWorkElement) {
    totalWorkElement.textContent = stats.totalWorks || '0';
    console.log('📋 Tổng công việc trong hệ thống:', stats.totalWorks);
  }
  
  // Tính tỷ lệ hoàn thành
  const completionRate = stats.totalWorks > 0 ? 
    ((stats.completedWorks / stats.totalWorks) * 100).toFixed(1) : 0;
  console.log(`📊 Tỷ lệ hoàn thành: ${completionRate}%`);
}

// Hàm refresh thống kê công việc (có thể gọi từ bên ngoài)
async function refreshWorkStatistics() {
  try {
    const stats = await fetchWorkStatistics();
    updateWorkStatistics(stats);
    return stats;
  } catch (error) {
    console.error('Lỗi khi refresh thống kê:', error);
    return null;
  }
}

// Export hàm để có thể gọi từ bên ngoài
window.refreshWorkStatistics = refreshWorkStatistics;
window.isWorkCompleted = isWorkCompleted;

// Hàm test để kiểm tra thống kê trực tiếp
window.testWorkStatistics = async function() {
  console.log('🧪 Test thống kê công việc...');
  const stats = await fetchWorkStatistics();
  console.log('📊 Kết quả test:', stats);
  return stats;
};

// Hàm lấy danh sách vị trí lỗi theo tên máy
async function fetchViTriLoiByMachine(tenMay) {
  try {
    const url = "https://autoslp.duckdns.org:5678/webhook/get-khuvuc-may";
    const response = await fetch(url);
    const data = await response.json();
    
    if (!Array.isArray(data)) {
      console.error('Dữ liệu vị trí không phải là mảng:', data);
      return [];
    }
    
    // Tìm máy theo tên
    const machine = data.find(item => 
      (item.ten_may || '').toLowerCase() === (tenMay || '').toLowerCase()
    );
    
    if (!machine || !machine.vi_tri_loi) {
      console.log('Không tìm thấy vị trí lỗi cho máy:', tenMay);
      return [];
    }
    
    // Tách chuỗi vị trí lỗi thành mảng, loại bỏ khoảng trắng thừa
    const viTriList = machine.vi_tri_loi
      .split(',')
      .map(item => item.trim())
      .filter(item => item.length > 0);
    
    console.log('Danh sách vị trí lỗi cho máy', tenMay, ':', viTriList);
    return viTriList;
  } catch (error) {
    console.error('Lỗi khi lấy danh sách vị trí lỗi:', error);
    return [];
  }
}

// Hàm đổ danh sách nhân viên vào select
function populateUserSelects(users) {
  const selectIds = ['updateNguoiLamChinh', 'updateNguoiLamPhu1', 'updateNguoiLamPhu2'];
  
  selectIds.forEach(selectId => {
    const selectElement = document.getElementById(selectId);
    if (selectElement) {
      // Xóa các option cũ (trừ option đầu tiên)
      while (selectElement.children.length > 1) {
        selectElement.removeChild(selectElement.lastChild);
      }
      
      // Thêm các option mới
      users.forEach(user => {
        const option = document.createElement('option');
        option.value = user.name;
        option.textContent = `${user.name} (${user.code})`;
        selectElement.appendChild(option);
      });
    }
  });
}

// Hàm đổ danh sách vị trí vào select
function populateViTriSelect(viTriList) {
  const selectElement = document.getElementById('updateViTri');
  if (!selectElement) {
    console.error('Không tìm thấy element updateViTri');
    return;
  }
  
  // Xóa các option cũ (trừ option đầu tiên)
  while (selectElement.children.length > 1) {
    selectElement.removeChild(selectElement.lastChild);
  }
  
  // Thêm các option mới từ danh sách vị trí
  viTriList.forEach(viTri => {
    const option = document.createElement('option');
    option.value = viTri;
    option.textContent = viTri;
    selectElement.appendChild(option);
  });
  
  console.log('Đã đổ', viTriList.length, 'vị trí vào select dropdown');
}

async function fetchWorkDetailBySTT(stt) {
  try {
    // Lấy dữ liệu từ n8n webhook (SQL)
    const url = 'https://autoslp.duckdns.org:5678/webhook/get-congviec';
    const res = await fetch(url);
    const data = await res.json();
    
    if (!Array.isArray(data) || data.length === 0) {
      console.error('Không có dữ liệu từ API');
      return null;
    }
    
    // Lưu toàn bộ dữ liệu để sử dụng cho thống kê
    window.allWorkRows = data;
    
    // Tìm công việc theo STT
    const row = data.find(r => (r.stt || '').toString() === stt.toString());
    if (!row) {
      console.error('Không tìm thấy công việc với STT:', stt);
      return null;
    }
    
    // Map dữ liệu từ SQL sang format cũ để tương thích
    return {
      stt: row.stt || '',
      khuVuc: row.khu_vuc || '',
      may: row.may || '',
      thoiGianYeuCau: row.thoi_gian_yeu_cau || '',
      hienTrangLoi: row.hien_trang_loi || '',
      nguoiYeuCau: row.nguoi_yeu_cau || '',
      quanLyXacNhan: row.ql_xac_nhan || '',
      quanLyDuyet: row.ql_duyet || '',
      hinhAnh: row.hinh_anh || '',
      hangMuc: row.hang_muc || '',
      phanLoai: row.phan_loai || '',
      viTri: row.vi_tri || '',
      hienTrang: row.hien_trang || '',
      nguyenNhan: row.nguyen_nhan || '',
      phuongAnXuLy: row.phuong_an_xu_ly || '',
      vatTuThayThe: row.vat_tu_thay_the || '',
      thoiGianBanGiao: row.thoi_gian_ban_giao || '',
      losstime: row.losstime || '',
      ketQua: row.ket_qua || '',
      sxXacNhan: row.san_xuat_xac_nhan || '', // Sản xuất xác nhận
      baoDuong: row.bao_duong || '', // Bảo dưỡng
      nguoiLamChinh: row.nguoi_lam_chinh || '',
      nguoiLamPhu1: row.nguoi_lam_phu_1 || '',
      nguoiLamPhu2: row.nguoi_lam_phu_2 || '',
      quanLyXacNhan2: row.ql_xac_nhan_lai || '',
      ghiChu: row.ghi_chu || '',
      codeZaloSend: row.code_zalo_send || '',
      banDoMay: row.ban_do_may || '', // Thêm trường ban_do_may
      deXuatAI: row.de_xuat_ai || '', // Thêm trường đề xuất AI
      trangThai: row.hien_trang || 'Đang xử lý',
      lichSuDeXuat: row.de_xuat_lich_su || '', // Thêm trường lịch sử đề xuất
      thoigianbatdaulam: row.thoi_gian_bat_dau_lam || '', // Thêm trường thời gian bắt đầu làm

    };
  } catch (error) {
    console.error('Lỗi khi lấy dữ liệu:', error);
    return null;
  }
}

async function fetchKhuVucMayData() {
  // Hàm này chỉ gọi API nếu chưa có dữ liệu, nếu có rồi thì trả về luôn
  if (window.khuVucMayData && Array.isArray(window.khuVucMayData) && window.khuVucMayData.length > 0) {
    return window.khuVucMayData;
  }
  try {
    const url = 'https://autoslp.duckdns.org:5678/webhook/get-khuvuc-may';
    const res = await fetch(url);
    const data = await res.json();
    if (Array.isArray(data) && data.length > 0) {
      window.khuVucMayData = data;
      return data;
    } else {
      window.khuVucMayData = [];
      return [];
    }
  } catch (error) {
    console.error('Lỗi khi lấy dữ liệu máy theo khu vực:', error);
    window.khuVucMayData = [];
    return [];
  }
}

// Hàm lấy object máy theo khu vực (dùng cho progress bar)
async function fetchMayTheoKhuVuc() {
  const data = await fetchKhuVucMayData();
  if (!Array.isArray(data) || data.length === 0) {
    return {};
  }
  const mayTheoKhuVuc = {};
  data.forEach(row => {
    const khuVuc = row.khu_vuc || '';
    const tenMay = row.ten_may || '';
    if (khuVuc && tenMay) {
      if (!mayTheoKhuVuc[khuVuc]) {
        mayTheoKhuVuc[khuVuc] = [];
      }
      if (!mayTheoKhuVuc[khuVuc].includes(tenMay.trim())) {
        mayTheoKhuVuc[khuVuc].push(tenMay.trim());
      }
    }
  });
  return mayTheoKhuVuc;
}

function showError(msg) {
  alert(msg);
}

function fillFields(fields) {
  for (const id in fields) {
    const el = document.getElementById(id);
    if (el) {
      el.textContent = fields[id] || '-';
    } else {
      console.warn(`Element with id '${id}' not found in DOM`);
    }
  }
}

function setWorkStatus(status) {
  const el = document.getElementById('workStatus');
  el.textContent = status;
  el.classList.remove('bg-primary', 'bg-success', 'bg-warning', 'bg-danger');
  if (status === 'Hoàn thành') {
    el.classList.add('bg-success');
  } else if (status === 'Tạm dừng' || status === 'Đang chờ') {
    el.classList.add('bg-warning');
  } else if (status === 'Lỗi' || status === 'Hủy') {
    el.classList.add('bg-danger');
  } else {
    el.classList.add('bg-primary');
  }
}

function setWorkStatusByRow(row) {
  const el = document.getElementById('workStatus');
  let status = '';
  el.classList.remove('bg-primary', 'bg-success', 'bg-warning', 'bg-danger');
  if (row.thoiGianBanGiao && row.thoiGianBanGiao.trim() !== '') {
    status = 'Hoàn thành';
    el.classList.add('bg-success');
  } else if (
    (row.nguoiLamChinh && row.nguoiLamChinh.trim() !== '') ||
    (row.nguoiLamPhu1 && row.nguoiLamPhu1.trim() !== '') ||
    (row.nguoiLamPhu2 && row.nguoiLamPhu2.trim() !== '')
  ) {
    status = 'Đang xử lý';
    el.classList.add('bg-warning');
  } else {
    status = 'Chờ xử lý';
    el.classList.add('bg-danger');
  }
  el.textContent = status;
}

function parseDate(str) {
  if (!str) return null;
  str = str.trim();
  let m = str.match(/^(\d{1,2}:\d{2}:\d{2})\s+(\d{2})\/(\d{2})\/(\d{4})$/);
  if (m) {
    const [h, mi, s] = m[1].split(":");
    return new Date(+m[4], +m[3] - 1, +m[2], +h, +mi, +s);
  }
  m = str.match(/^(\d{2})\/(\d{2})\/(\d{4})\s+(\d{1,2}:\d{2}:\d{2})$/);
  if (m) {
    const [h, mi, s] = m[4].split(":");
    return new Date(+m[3], +m[2] - 1, +m[1], +h, +mi, +s);
  }
  m = str.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (m) {
    return new Date(+m[3], +m[2] - 1, +m[1]);
  }
  m = str.match(/^(\d{4})-(\d{2})-(\d{2})\s+(\d{1,2}:\d{2}:\d{2})$/);
  if (m) {
    const [h, mi, s] = m[4].split(":");
    return new Date(+m[1], +m[2] - 1, +m[3], +h, +mi, +s);
  }
  m = str.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (m) {
    return new Date(+m[1], +m[2] - 1, +m[3]);
  }
  const d = new Date(str);
  if (!isNaN(d.getTime())) return d;
  return null;
}

async function renderWorkDetail(row) {
  // Store current work data globally for use in other functions
  window.currentWorkData = row;
  
  // Debug: Log dữ liệu row để kiểm tra
  console.log('=== renderWorkDetail called ===');
  console.log('Full row data:', row);
  console.log('Key time fields:', {
    thoiGianYeuCau: row.thoiGianYeuCau,
    thoigianbatdaulam: row.thoigianbatdaulam,
    thoiGianBanGiao: row.thoiGianBanGiao
  });
  
  // Debug: Kiểm tra định dạng thời gian
  console.log('Thời gian bắt đầu làm raw:', row.thoigianbatdaulam);
  console.log('Thời gian bàn giao raw:', row.thoiGianBanGiao);
  
  // Debug: Kiểm tra các element tồn tại
  console.log('Element check:', {
    tabInfoBatDau: !!document.getElementById('tabInfoBatDau'),
    tabInfoBanGiao: !!document.getElementById('tabInfoBanGiao'),
    leftDetailBatDau: !!document.getElementById('leftDetailBatDau')
  });
  
  // Hiển thị ảnh đính kèm trong tabFileList (tab-files)
  const fileListUl = document.getElementById('tabFileList');
  if (fileListUl) {
    fileListUl.innerHTML = '';
    if (row.hinhAnh && row.hinhAnh.trim() !== '') {
      // Có thể là nhiều link, phân tách bởi dấu phẩy hoặc xuống dòng
      let links = row.hinhAnh.split(/,|\n/).map(s => s.trim()).filter(Boolean);
      links.forEach((url, idx) => {
        // Nếu là link ảnh hợp lệ
        if (/^https?:\/\//.test(url)) {
          const li = document.createElement('li');
          li.style.marginBottom = '12px';
          li.innerHTML = `
            <div style="display:flex;align-items:center;gap:16px;">
              <img src="${url}" alt="Ảnh đính kèm ${idx+1}" style="border-radius:8px;border:1px solid #eee;object-fit:cover;">
            </div>
          `;
          fileListUl.appendChild(li);
        }
      });
      if (fileListUl.children.length === 0) {
        fileListUl.innerHTML = '<li class="text-muted">Không có ảnh đính kèm hợp lệ.</li>';
      }
    } else {
      fileListUl.innerHTML = '<li class="text-muted">Không có ảnh đính kèm.</li>';
    }
  }
  // Đổ dữ liệu các trường chi tiết lỗi vào đúng vị trí
  document.getElementById('tabLoiHangMuc') && (document.getElementById('tabLoiHangMuc').textContent = row.hangMuc || '-');
  document.getElementById('tabLoiPhanLoai') && (document.getElementById('tabLoiPhanLoai').textContent = row.phanLoai || '-');
  document.getElementById('tabLoiViTri') && (document.getElementById('tabLoiViTri').textContent = row.viTri || row.viTriLoi || '-');
  document.getElementById('tabLoiHienTrang') && (document.getElementById('tabLoiHienTrang').textContent = row.hienTrang || '-');
  document.getElementById('tabLoiNguyenNhan') && (document.getElementById('tabLoiNguyenNhan').textContent = row.nguyenNhan || '-');
  document.getElementById('tabLoiHuongXuLy') && (document.getElementById('tabLoiHuongXuLy').textContent = row.phuongAnXuLy || '-');
  document.getElementById('tabLoiVatTu') && (document.getElementById('tabLoiVatTu').textContent = row.vatTuThayThe || '-');

  // Gọi hàm hiển thị thông tin người làm chính/phụ vào tab Chi tiết
  if (window.renderNguoiLamInfo) {
    window.renderNguoiLamInfo(row);
  }
  
  // Kiểm tra và set textContent an toàn cho các tab chính
  const tabInfoElements = [
    {id: 'tabInfoKhuVuc', value: row.khuVuc},
    {id: 'tabInfoMay', value: row.may},
    {id: 'tabInfoThoiGian', value: row.thoiGianYeuCau},
    {id: 'tabInfoNguoi', value: row.nguoiYeuCau},
    {id: 'tabInfoBatDau', value: row.thoigianbatdaulam},
    {id: 'tabInfoBanGiao', value: row.thoiGianBanGiao},
    {id: 'tabInfoGhiChu', value: row.ghiChu},
    {id: 'tabInfoLoiMay', value: row.hienTrangLoi},
    {id: 'tabInfoLoiMay2', value: row.hienTrangLoi}
  ];
  
  tabInfoElements.forEach(item => {
    const element = document.getElementById(item.id);
    if (element) {
      element.textContent = item.value || '-';
    }
  });

  // Cập nhật tên máy vào tiêu đề timeline
  var machineNameHeader = document.getElementById('machineNameHeader');
  if(machineNameHeader) machineNameHeader.textContent = row.may ? ` - ${row.may}` : '';

  // Tiến độ Người yêu cầu: số công việc của người này / tổng số công việc, có progress bar
  (function() {
    const nguoi = row.nguoiYeuCau ? row.nguoiYeuCau.trim().toLowerCase() : '';
    const el = document.getElementById('tabInfoNguoiProgress');
    if (!nguoi || !el || !window.allWorkRows || !Array.isArray(window.allWorkRows)) {
      if (el) el.innerHTML = '';
      return;
    }
    const total = window.allWorkRows.length;
    const count = window.allWorkRows.filter(r => (r.nguoi_yeu_cau||'').trim().toLowerCase() === nguoi).length;
    const percent = total > 0 ? Math.round((count/total)*100) : 0;
    el.innerHTML = `
      <div style="display:flex;align-items:center;gap:10px;width:100%;">
        <div style="width:80px;flex-shrink:0;">
          <div style='height:6px;background:#edeafd;border-radius:6px;overflow:hidden;'>
            <div style='height:6px;width:${percent}%;background:#726bff;border-radius:6px;transition:width 0.4s;'></div>
          </div>
        </div>
        <span style='font-weight:500;color:#726bff;min-width:38px;text-align:right;'>${percent}%</span>
        <i class='bi bi-info-circle' style='color:#726bff;cursor:pointer;font-size:1.15em;margin-left:4px;' data-bs-toggle='tooltip' data-bs-placement='top' title='(${count} việc do người này yêu cầu / ${total} công việc)'></i>
      </div>
    `;
  })();

  // Tiến độ tháng cho ngày bàn giao (cột Q - index 16)
  (function() {
    const banGiaoStr = row.thoiGianBanGiao;
    const el = document.getElementById('tabInfoBanGiaoProgress');
    if (!banGiaoStr || !el) {
      el.innerHTML = '';
      return;
    }
    const dateObj = parseDate(banGiaoStr);
    if (!dateObj || isNaN(dateObj.getTime())) {
      el.innerHTML = '<span style="color:#f00">Không xác định ngày</span>';
      return;
    }
    const now = new Date();
    const year = now.getFullYear();
    const month = dateObj.getMonth() + 1;
    let countMonth = 0;
    let countYear = 0;
    window.allWorkRows.forEach(r => {
      const dYeuCau = parseDate(r.thoi_gian_yeu_cau || '');
      if (dYeuCau && dYeuCau.getFullYear() === year) {
        countYear++;
      }
      const dBanGiao = parseDate(r.thoi_gian_ban_giao || '');
      if (dBanGiao && dBanGiao.getFullYear() === year && dBanGiao.getMonth() + 1 === month) {
        countMonth++;
      }
    });
    const percent = countYear > 0 ? Math.round((countMonth/countYear)*100) : 0;
    el.innerHTML = `
      <div style="display:flex;align-items:center;gap:10px;width:100%;">
        <div style="width:80px;flex-shrink:0;">
          <div style='height:6px;background:#edeafd;border-radius:6px;overflow:hidden;'>
            <div style='height:6px;width:${percent}%;background:#726bff;border-radius:6px;transition:width 0.4s;'></div>
          </div>
        </div>
        <span style='font-weight:500;color:#726bff;min-width:38px;text-align:right;'>${percent}%</span>
        <i class='bi bi-info-circle' style='color:#726bff;cursor:pointer;font-size:1.15em;margin-left:4px;' data-bs-toggle='tooltip' data-bs-placement='top' title='(${countMonth} việc bàn giao trong tháng này / ${countYear} công việc năm ${year})'></i>
      </div>
    `;
  })();

  // Tiến độ khu vực: tính % số công việc trong khu vực / tổng công việc
  (function() {
    const khuVuc = row.khuVuc || '';
    const el = document.getElementById('tabInfoKhuVucProgress');
    if (!window.allWorkRows || !Array.isArray(window.allWorkRows)) {
      if (el) el.innerHTML = '';
      return;
    }
    const total = window.allWorkRows.length;
    const count = window.allWorkRows.filter(r => (r.khu_vuc||'').toLowerCase() === khuVuc.toLowerCase()).length;
    const percent = total > 0 ? Math.round((count/total)*100) : 0;
    el.innerHTML = `
      <div style="display:flex;align-items:center;gap:10px;width:100%;">
        <div style="width:80px;flex-shrink:0;">
          <div style='height:6px;background:#edeafd;border-radius:6px;overflow:hidden;'>
            <div style='height:6px;width:${percent}%;background:#726bff;border-radius:6px;transition:width 0.4s;'></div>
          </div>
        </div>
        <span style='font-weight:500;color:#726bff;min-width:38px;text-align:right;'>${percent}%</span>
        <i class='bi bi-info-circle' style='color:#726bff;cursor:pointer;font-size:1.15em;margin-left:4px;' data-bs-toggle='tooltip' data-bs-placement='top' title='(${count} việc trong khu vực / ${total} công việc)'></i>
      </div>
    `;
  })();

  // Tiến độ máy: số công việc của máy trong khu vực / tổng công việc của khu vực
  (async function() {
    const khuVuc = row.khuVuc || '';
    const may = row.may || '';
    const el = document.getElementById('tabInfoMayProgress');
    if (!window.allWorkRows || !Array.isArray(window.allWorkRows)) {
      if (el) el.innerHTML = '';
      return;
    }
    if (!window.mayTheoKhuVuc) window.mayTheoKhuVuc = await fetchMayTheoKhuVuc();
    const totalKhuVuc = window.allWorkRows.filter(r => (r.khu_vuc||'').toLowerCase() === khuVuc.toLowerCase()).length;
    const countMay = window.allWorkRows.filter(r => (r.khu_vuc||'').toLowerCase() === khuVuc.toLowerCase() && (r.may||'').toLowerCase() === may.toLowerCase()).length;
    const percentMay = totalKhuVuc > 0 ? Math.round((countMay/totalKhuVuc)*100) : 0;
    el.innerHTML = `
      <div style="display:flex;align-items:center;gap:10px;width:100%;">
        <div style="width:80px;flex-shrink:0;">
          <div style='height:6px;background:#edeafd;border-radius:6px;overflow:hidden;'>
            <div style='height:6px;width:${percentMay}%;background:#726bff;border-radius:6px;transition:width 0.4s;'></div>
          </div>
        </div>
        <span style='font-weight:500;color:#726bff;min-width:38px;text-align:right;'>${percentMay}%</span>
        <i class='bi bi-info-circle' style='color:#726bff;cursor:pointer;font-size:1.15em;margin-left:4px;' data-bs-toggle='tooltip' data-bs-placement='top' title='(${countMay} việc của máy này / ${totalKhuVuc} công việc khu vực)'></i>
      </div>
    `;
  })();

  // Tiến độ thời gian yêu cầu: tổng số công việc trong tháng / tổng công việc của năm đó
  (function() {
    const el = document.getElementById('tabInfoThoiGianProgress');
    if (!window.allWorkRows || !Array.isArray(window.allWorkRows) || !row.thoiGianYeuCau) {
      if (el) el.innerHTML = '';
      return;
    }
    const dateObj = parseDate(row.thoiGianYeuCau);
    if (!dateObj || isNaN(dateObj.getTime())) {
      el.innerHTML = '<span style="color:#f00">Không xác định ngày</span>';
      return;
    }
    const year = dateObj.getFullYear();
    const month = dateObj.getMonth() + 1;
    let countMonth = 0;
    let countYear = 0;
    window.allWorkRows.forEach(r => {
      const d = parseDate(r.thoi_gian_yeu_cau || '');
      if (d && d.getMonth() + 1 === month && d.getFullYear() === year) countMonth++;
      if (d && d.getFullYear() === year) countYear++;
    });
    const percent = countYear > 0 ? Math.round((countMonth/countYear)*100) : 0;
    el.innerHTML = `
      <div style="display:flex;align-items:center;gap:10px;width:100%;">
        <div style="width:80px;flex-shrink:0;">
          <div style='height:6px;background:#edeafd;border-radius:6px;overflow:hidden;'>
            <div style='height:6px;width:${percent}%;background:#726bff;border-radius:6px;transition:width 0.4s;'></div>
          </div>
        </div>
        <span style='font-weight:500;color:#726bff;min-width:38px;text-align:right;'>${percent}%</span>
        <i class='bi bi-info-circle' style='color:#726bff;cursor:pointer;font-size:1.15em;margin-left:4px;' data-bs-toggle='tooltip' data-bs-placement='top' title='(${countMonth} việc trong tháng này / ${countYear} công việc năm ${year})'></i>
      </div>
    `;
  })();

  // Hình ảnh (nếu có vùng tabHinhAnh)
  const hinhAnhDiv = document.getElementById('tabHinhAnh');
  if (hinhAnhDiv) {
    hinhAnhDiv.innerHTML = row.hinhAnh ? `<img src='${row.hinhAnh}' alt='Hình ảnh' style='max-width:100%;border-radius:8px;'>` : '';
  }

  // Đề xuất AI (nếu có vùng dexuatAI)
  const deXuatAIDiv = document.getElementById('dexuatAI');
  if (deXuatAIDiv) {
    // Mục 1: Đề xuất dựa trên lịch sử lỗi máy (từ SQL, trường lichSuDeXuat hoặc lich_su_de_xuat)
    let lichSuDeXuat = '';
    let val = '';
    if (row.lichSuDeXuat && row.lichSuDeXuat.trim() !== '') {
      val = row.lichSuDeXuat.trim();
    } else if (row.lich_su_de_xuat && row.lich_su_de_xuat.trim() !== '') {
      val = row.lich_su_de_xuat.trim();
    }
    if (val) {
      if (val.includes('<')) {
        lichSuDeXuat = val;
      } else {
        lichSuDeXuat = val.replace(/\n/g, '<br>');
      }
    } else {
      lichSuDeXuat = '<span class="text-muted">Chưa có đề xuất lịch sử lỗi máy cho công việc này.</span>';
    }

    // Mục 2: Đề xuất AI từ trường SQL (de_xuat_ai)
    let aiDeXuat = '';
    if (row.deXuatAI && row.deXuatAI.trim() !== '') {
      const val = row.deXuatAI.trim();
      if (val.includes('<')) {
        aiDeXuat = val;
      } else {
        aiDeXuat = val.replace(/\n/g, '<br>');
      }
    } else {
      aiDeXuat = '<span class="text-muted">Chưa có đề xuất AI cho công việc này.</span>';
    }

    deXuatAIDiv.innerHTML = `
      <div style="margin-bottom:18px;">
        <div style="font-weight:600;color:#726bff;margin-bottom:6px;"><i class="bi bi-clock-history me-1"></i>Đề xuất dựa trên lịch sử lỗi máy</div>
        <div>${lichSuDeXuat}</div>
      </div>
      <!--AI_SUGGESTION_SPLIT-->
      <div>
        <div style="font-weight:600;color:#726bff;margin-bottom:6px;"><i class="bi bi-robot me-1"></i>Đề xuất AI (từ trường SQL)</div>
        <div>${aiDeXuat}</div>
      </div>
    `;
  }

  // Sau khi render các trường thông tin, có thể render timeline lỗi máy thực tế ở đây
  // Nếu có dữ liệu thực tế, thay thế renderMachineErrorTimeline() bằng render từ row hoặc window.allWorkRows
  renderMachineErrorTimelineFromSheet(row);
  
  // Render bản đồ máy
  renderMachineMap(row);

  // Đổi màu timeline trạng thái bằng data từ webhook
  if (typeof updateTimelineStatusColor === 'function') {
    updateTimelineStatusColor(row);
  }

  // Cập nhật hiển thị thời gian với log để debug
  if (typeof window.updateTimeDisplay === 'function') {
    console.log('Calling updateTimeDisplay with row:', row);
    window.updateTimeDisplay(row);
  } else {
    console.log('updateTimeDisplay function not found!');
  }

  // Cập nhật trạng thái công việc
  if (typeof window.updateWorkStatus === 'function') {
    window.updateWorkStatus(row);
  }

  // Cập nhật trạng thái hiển thị các nút action
  updateActionButtonsVisibility(row);
}

// Hàm cập nhật trạng thái hiển thị các nút action
function updateActionButtonsVisibility(row) {
  const processBtn = document.getElementById('processBtn');
  const confirmBtn = document.getElementById('confirmBtn');
  const supportBtn = document.getElementById('supportBtn');
  const updateBtn = document.getElementById('updateBtn');

  if (!row) return;

  // Lấy thông tin user để kiểm tra phân quyền
  const userRole = localStorage.getItem('slp_role');
  const userDepartment = localStorage.getItem('slp_bo_phan');
  const userPosition = localStorage.getItem('slp_chuc_vu');

  // Debug: Log để kiểm tra dữ liệu
  console.log('=== updateActionButtonsVisibility ===');
  console.log('nguoiLamChinh:', row.nguoiLamChinh);
  console.log('san_xuat_xac_nhan:', row.sxXacNhan);
  console.log('nguoiLamPhu1:', row.nguoiLamPhu1);
  console.log('nguoiLamPhu2:', row.nguoiLamPhu2);
  console.log('User role:', userRole);
  console.log('User department:', userDepartment);
  console.log('User position:', userPosition);
  console.log('thoiGianBanGiao:', row.thoiGianBanGiao);

  // Ẩn nút "Xử lý" nếu đã có người làm chính HOẶC user không thuộc bộ phận Cơ điện
  if (processBtn) {
    const hasMainWorker = row.nguoiLamChinh && row.nguoiLamChinh.trim() !== '';
    const isElectricalDept = userDepartment && userDepartment.toLowerCase().includes('cơ điện');
    
    if (hasMainWorker || !isElectricalDept) {
      processBtn.style.display = 'none';
      console.log('Ẩn nút Xử lý - Có người làm chính:', hasMainWorker, '- Không phải Cơ điện:', !isElectricalDept);
    } else {
      processBtn.style.display = 'inline-block';
      console.log('Hiện nút Xử lý');
    }
  }

  // Ẩn nút "Xác nhận" nếu đã xác nhận HOẶC user không phải Quản lý HOẶC chưa có thời gian bàn giao
  if (confirmBtn) {
    const hasConfirmation = row.sxXacNhan && row.sxXacNhan.trim() !== '';
    const isManager = userPosition && userPosition.toLowerCase().includes('quản lý');
    const hasHandoverTime = row.thoiGianBanGiao && row.thoiGianBanGiao.trim() !== '';
    
    if (hasConfirmation || !isManager || !hasHandoverTime) {
      confirmBtn.style.display = 'none';
      console.log('Ẩn nút Xác nhận - Đã xác nhận:', hasConfirmation, '- Không phải Quản lý:', !isManager, '- Chưa bàn giao:', !hasHandoverTime);
    } else {
      confirmBtn.style.display = 'inline-block';
      console.log('Hiện nút Xác nhận');
    }
  }

  // Ẩn nút "Hỗ trợ" nếu đã đủ 2 người hỗ trợ HOẶC user không thuộc bộ phận Cơ điện
  if (supportBtn) {
    const hasHelper1 = row.nguoiLamPhu1 && row.nguoiLamPhu1.trim() !== '';
    const hasHelper2 = row.nguoiLamPhu2 && row.nguoiLamPhu2.trim() !== '';
    const isElectricalDept = userDepartment && userDepartment.toLowerCase().includes('cơ điện');
    
    if ((hasHelper1 && hasHelper2) || !isElectricalDept) {
      supportBtn.style.display = 'none';
      console.log('Ẩn nút Hỗ trợ - Đủ người:', (hasHelper1 && hasHelper2), '- Không phải Cơ điện:', !isElectricalDept);
    } else {
      supportBtn.style.display = 'inline-block';
      console.log('Hiện nút Hỗ trợ');
    }
  }

  // Nút "Cập nhật" chỉ hiển thị cho bộ phận Cơ điện
  if (updateBtn) {
    const isElectricalDept = userDepartment && userDepartment.toLowerCase().includes('cơ điện');
    
    if (isElectricalDept) {
      updateBtn.style.display = 'inline-block';
      console.log('Hiện nút Cập nhật - Thuộc bộ phận Cơ điện');
    } else {
      updateBtn.style.display = 'none';
      console.log('Ẩn nút Cập nhật - Không thuộc bộ phận Cơ điện');
    }
  }
}

// Hàm render bản đồ máy
async function renderMachineMap(row) {
  try {
    const khuVuc = row.khuVuc || '';
    const may = row.may || '';
    if (!khuVuc || !may) {
      console.log('Không có thông tin khu vực hoặc máy để hiển thị bản đồ');
      return;
    }
    // Lấy dữ liệu máy theo khu vực từ biến toàn cục (hoặc gọi API nếu chưa có)
    const data = await fetchKhuVucMayData();
    if (!Array.isArray(data) || data.length === 0) {
      console.error('Không có dữ liệu máy theo khu vực');
      return;
    }
    // Tìm máy trong khu vực
    const machineInArea = data.filter(item => 
      (item.khu_vuc || '').toLowerCase() === khuVuc.toLowerCase() &&
      (item.ten_may || '').toLowerCase() === may.toLowerCase()
    );
    if (machineInArea.length === 0) {
      console.log('Không tìm thấy máy trong bản đồ:', may, 'tại khu vực:', khuVuc);
      return;
    }
    // Hiển thị bản đồ máy
    const container = document.getElementById('mapformay');
    if (!container) return;
    // Lấy link ảnh từ dữ liệu máy theo khu vực (webhook)
    let mapImageUrl = '';
    if (machineInArea.length > 0 && machineInArea[0].ban_do_may) {
      mapImageUrl = machineInArea[0].ban_do_may;
    }
    if (!mapImageUrl) {
      container.innerHTML = `
        <div style="text-align: center; padding: 40px; color: #666;">
          <i class="bi bi-image" style="font-size: 3rem; color: #ddd; margin-bottom: 10px;"></i>
          <p>Không có ảnh bản đồ cho máy này</p>
          <small>Ảnh bản đồ đang được cập nhật...</small>
        </div>
      `;
      return;
    }
    container.innerHTML = `
      <div class="machine-map-container" style="text-align: center; padding: 20px;">
        <div class="machine-info" style="margin-bottom: 15px;">
          <h6 style="color: #333; margin-bottom: 10px;">
            <i class="bi bi-geo-alt me-2 text-primary"></i>
            Vị trí: ${khuVuc} - ${may}
          </h6>
          <p style="color: #666; font-size: 0.9em;">
            <i class="bi bi-info-circle me-1"></i>
            Máy được đánh dấu trên bản đồ khu vực
          </p>
        </div>
        <div class="map-image" style="justify-self: center;border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1); max-width: 50%";>
          <img src="${mapImageUrl}" 
               alt="Bản đồ máy ${may} tại ${khuVuc}" 
               style="max-width: 100%; height: auto; display: block;"
               onerror="this.style.display='none'; this.nextElementSibling.style.display='block';">
          <div style="display: none; padding: 40px; background: #f8f9fa; border-radius: 12px; color: #666;">
            <i class="bi bi-image" style="font-size: 3rem; color: #ddd; margin-bottom: 10px;"></i>
            <p>Bản đồ máy ${may} tại ${khuVuc}</p>
            <small>Ảnh bản đồ đang được cập nhật...</small>
          </div>
        </div>
        <div class="machine-details" style="margin-top: 15px; padding: 15px; background: #f8f9fa; border-radius: 8px;">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <span style="font-weight: 500; color: #333;">
              <i class="bi bi-cpu me-1"></i>Máy: ${may}
            </span>
            <span style="font-weight: 500; color: #007bff;">
              <i class="bi bi-geo-alt me-1"></i>Khu vực: ${khuVuc}
            </span>
          </div>
        </div>
      </div>
    `;
  } catch (error) {
    console.error('Lỗi khi render bản đồ máy:', error);
    const container = document.getElementById('mapformay');
    if (container) {
      container.innerHTML = `
        <div style="text-align: center; padding: 40px; color: #666;">
          <i class="bi bi-exclamation-triangle" style="font-size: 2rem; color: #ffc107; margin-bottom: 10px;"></i>
          <p>Không thể tải bản đồ máy</p>
          <small>Vui lòng thử lại sau</small>
        </div>
      `;
    }
  }
}



// Giữ lại hàm renderMachineErrorTimelineFromSheet để render dữ liệu thật từ Google Sheet
function renderMachineErrorTimelineFromSheet(row) {
  if (!window.allWorkRows || !row) return;
  const timelineRows = window.allWorkRows.filter(r =>
    (r.khu_vuc||'').toLowerCase() === (row.khuVuc||'').toLowerCase() &&
    (r.may||'').toLowerCase() === (row.may||'').toLowerCase() &&
    (r.stt||'').toString() !== (row.stt||'').toString()
  );
  timelineRows.sort((a, b) => {
    const da = parseDate(a.thoi_gian_yeu_cau||'');
    const db = parseDate(b.thoi_gian_yeu_cau||'');
    return db - da;
  });
  const mayName = row.may || '';
  // Số lượng mặc định hiển thị
  if (typeof window.machineErrorTimelineShowCount !== 'number') {
    window.machineErrorTimelineShowCount = 4;
  }
  let showCount = window.machineErrorTimelineShowCount;
  const timeline = timelineRows.map(r => {
    const dateObj = parseDate(r.thoi_gian_yeu_cau||'');
    let timeStr = '-';
    if (dateObj && !isNaN(dateObj.getTime())) {
      timeStr = dateObj.toLocaleDateString('vi-VN') + ' ' + dateObj.toLocaleTimeString('vi-VN', {hour:'2-digit',minute:'2-digit'});
    }
    // Lấy danh sách người làm chính và phụ, mỗi người một avatar
    const users = [r.nguoi_lam_chinh, r.nguoi_lam_phu_1, r.nguoi_lam_phu_2].map(u => u && u.trim()).filter(Boolean);
    const avatars = users.length > 0 ? users.map((name, idx) => ({
      name,
      url: `https://randomuser.me/api/portraits/${idx % 2 === 0 ? 'men' : 'women'}/${32 + idx}.jpg`
    })) : [{name: '', url: 'https://randomuser.me/api/portraits/lego/1.jpg'}];
    return {
      title: (mayName ? `[${mayName}] - ` : '') + (r.hien_trang_loi || 'Không rõ lỗi'),
      nguyenNhan: r.nguyen_nhan || '',
      phuongAn: r.phuong_an_xu_ly || '',
      time: timeStr,
      avatars
    };
  });
  const container = document.getElementById('machineErrorTimeline');
  if (!container) return;
  if (timeline.length === 0) {
    container.innerHTML = '<div class="text-muted small">Không có lịch sử lỗi máy khác.</div>';
    return;
  }
  // Render chỉ 4 dòng đầu tiên, nếu còn thì hiện nút Xem thêm
  const renderItems = timeline.slice(0, showCount).map((item) => {
    let avatarHtml = '';
    if (item.avatars.length > 3) {
      avatarHtml = item.avatars.slice(0,3).map((avt, i) => `
        <img class="activity-timeline-avatar" src="${avt.url}" alt="${avt.name}" title="${avt.name}" style="width:32px;height:32px;border-radius:50%;object-fit:cover;${i>0?'margin-left:-10px;':''};border:2px solid #fff;" />
      `).join('') + `
        <span class="activity-timeline-avatar-more" style="width:32px;height:32px;display:inline-flex;align-items:center;justify-content:center;border-radius:50%;background:#edeafd;color:#444;font-weight:500;font-size:0.98em;margin-left:-10px;">+${item.avatars.length-3}</span>
      `;
    } else {
      avatarHtml = item.avatars.map((avt, i) => `
        <img class="activity-timeline-avatar" src="${avt.url}" alt="${avt.name}" title="${avt.name}" style="width:32px;height:32px;border-radius:50%;object-fit:cover;${i>0?'margin-left:-10px;':''};border:2px solid #fff;" />
      `).join('');
    }
    return `
    <li class="activity-timeline-item">
      <div class="activity-timeline-dot"></div>
      <div class="activity-timeline-line"></div>
      <div class="activity-timeline-content">
        <div class="activity-timeline-title">${item.title}</div>
        <div class="activity-timeline-desc" style="font-size:0.93em;">
          <p class="activity-timeline-desc" style="margin-bottom:2px;">Nguyên nhân: ${item.nguyenNhan || '-'}</p>
          <p class="activity-timeline-desc" style="margin-bottom:0;">Phương án xử lý: ${item.phuongAn || '-'}</p>
        </div>
      </div>
      <div style="display:flex;flex-direction:column;align-items:flex-end;">
        <div class="activity-timeline-time">${item.time}</div>
        <div class="activity-timeline-avatar-group" style="display:flex;align-items:center;gap:0;margin-top:6px;">
          ${avatarHtml}
        </div>
      </div>
    </li>
    `;
  }).join('');
  let loadMoreBtn = '';
  if (timeline.length > showCount) {
    loadMoreBtn = `<div style="text-align:center;margin-top:10px;">
      <button id="btnLoadMoreMachineError" class="btn btn-outline-primary btn-sm">Xem thêm</button>
    </div>`;
  }
  container.innerHTML = `
    <ul class="activity-timeline-list">
      ${renderItems}
    </ul>
    ${loadMoreBtn}
  `;
  // Gán sự kiện cho nút Xem thêm
  if (timeline.length > showCount) {
    const btn = document.getElementById('btnLoadMoreMachineError');
    if (btn) {
      btn.onclick = function() {
        window.machineErrorTimelineShowCount += 4;
        renderMachineErrorTimelineFromSheet(row);
      };
    }
  }
  // Reset lại biến khi load lại timeline mới (ví dụ chuyển máy khác)
  if (showCount === 4) {
    window.machineErrorTimelineShowCount = 4;
  }
}

// Xử lý chi tiết công việc sau khi đăng nhập
window.addEventListener('DOMContentLoaded', async function() {
  // Kiểm tra đăng nhập sử dụng login-slp.js
  if (window.checkLoginSLP) {
    await window.checkLoginSLP(function(user) {
      // Callback khi đăng nhập thành công
      if (user) {
        console.log('Đăng nhập thành công:', user);
      }
    });
  }
  
  // Hiển thị thông tin user
  showUserInfo();

  // Xử lý chi tiết công việc
  if (!stt) return;
  const row = await fetchWorkDetailBySTT(stt);
  if (row) renderWorkDetail(row);

  // Khởi tạo xử lý các nút action
  initActionButtons();
});

// Khởi tạo xử lý các nút action
function initActionButtons() {
  // Nút Xác nhận
  const confirmBtn = document.getElementById('confirmBtn');
  if (confirmBtn) {
    confirmBtn.addEventListener('click', handleConfirmWork);
  }

  // Nút Xử lý
  const processBtn = document.getElementById('processBtn');
  if (processBtn) {
    processBtn.addEventListener('click', handleProcessWork);
  }

  // Nút Hỗ trợ
  const supportBtn = document.getElementById('supportBtn');
  if (supportBtn) {
    supportBtn.addEventListener('click', handleSupportWork);
  }

  // Nút Cập nhật
  const updateBtn = document.getElementById('updateBtn');
  if (updateBtn) {
    updateBtn.addEventListener('click', handleUpdateWork);
  }

  // Nút Lưu trong modal
  const saveUpdateBtn = document.getElementById('saveUpdateBtn');
  if (saveUpdateBtn) {
    saveUpdateBtn.addEventListener('click', handleSaveUpdate);
  }

  // Nút Lưu và bàn giao trong modal
  const saveAndHandoverBtn = document.getElementById('saveAndHandoverBtn');
  if (saveAndHandoverBtn) {
    saveAndHandoverBtn.addEventListener('click', handleSaveAndHandover);
  }
}

// Xử lý nút Xác nhận
async function handleConfirmWork() {
  const userName = localStorage.getItem('slp_display_name') || localStorage.getItem('slp_name');
  if (!userName) {
    alert('Không thể xác định tên người dùng. Vui lòng đăng nhập lại.');
    return;
  }

  if (!confirm(`Xác nhận công việc bằng tài khoản: ${userName}?`)) {
    return;
  }

  try {
    const response = await fetch('https://autoslp.duckdns.org:5678/webhook/update-congviec', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        stt: stt,
        ten_nguoi_xn: userName,
        action: 'confirm'
      })
    });

    if (response.ok) {
      alert('Xác nhận công việc thành công!');
      // Reload lại dữ liệu
      const row = await fetchWorkDetailBySTT(stt);
      if (row) renderWorkDetail(row);
    } else {
      throw new Error('Lỗi từ server');
    }
  } catch (error) {
    console.error('Lỗi khi xác nhận công việc:', error);
    alert('Lỗi khi xác nhận công việc: ' + error.message);
  }
}

// Xử lý nút Xử lý
async function handleProcessWork() {
  const userName = localStorage.getItem('slp_display_name') || localStorage.getItem('slp_name');
  if (!userName) {
    alert('Không thể xác định tên người dùng. Vui lòng đăng nhập lại.');
    return;
  }

  if (!confirm(`Nhận xử lý công việc bằng tài khoản: ${userName}?`)) {
    return;
  }

  try {
    // Lấy thời gian hiện tại theo format DD/MM/YYYY HH:MM:SS
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = now.getFullYear();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const currentTime = `${hours}:${minutes}:${seconds} ${day}/${month}/${year}`;

    const response = await fetch('https://autoslp.duckdns.org:5678/webhook/update-congviec', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        stt: stt,
        nguoi_lam_chinh: userName,
        thoi_gian_bat_dau_lam: currentTime,
        action: 'process'
      })
    });

    if (response.ok) {
      alert('Nhận xử lý công việc thành công!');
      // Reload lại dữ liệu
      const row = await fetchWorkDetailBySTT(stt);
      if (row) renderWorkDetail(row);
    } else {
      throw new Error('Lỗi từ server');
    }
  } catch (error) {
    console.error('Lỗi khi nhận xử lý công việc:', error);
    alert('Lỗi khi nhận xử lý công việc: ' + error.message);
  }
}

// Xử lý nút Hỗ trợ
async function handleSupportWork() {
  const userName = localStorage.getItem('slp_display_name') || localStorage.getItem('slp_name');
  if (!userName) {
    alert('Không thể xác định tên người dùng. Vui lòng đăng nhập lại.');
    return;
  }

  if (!confirm(`Đăng ký hỗ trợ công việc bằng tài khoản: ${userName}?`)) {
    return;
  }

  try {
    // Lấy dữ liệu hiện tại để kiểm tra người làm phụ nào còn trống
    const currentRow = await fetchWorkDetailBySTT(stt);
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = now.getFullYear();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const currentTime = `${hours}:${minutes}:${seconds} ${day}/${month}/${year}`;
    let updateField = '';
    
    if (!currentRow.nguoiLamPhu1 || currentRow.nguoiLamPhu1.trim() === '') {
      updateField = 'nguoi_lam_phu_1';
    } else if (!currentRow.nguoiLamPhu2 || currentRow.nguoiLamPhu2.trim() === '') {
      updateField = 'nguoi_lam_phu_2';
    } else {
      alert('Đã đủ người hỗ trợ cho công việc này!');
      return;
    }

    const response = await fetch('https://autoslp.duckdns.org:5678/webhook/update-congviec', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        stt: stt,
        [updateField]: userName,
         thoi_gian_bat_dau_lam: currentTime,

        action: 'support'
      })
    });

    if (response.ok) {
      alert('Đăng ký hỗ trợ công việc thành công!');
      // Reload lại dữ liệu
      const row = await fetchWorkDetailBySTT(stt);
      if (row) renderWorkDetail(row);
    } else {
      throw new Error('Lỗi từ server');
    }
  } catch (error) {
    console.error('Lỗi khi đăng ký hỗ trợ:', error);
    alert('Lỗi khi đăng ký hỗ trợ: ' + error.message);
  }
}

// Xử lý nút Cập nhật - hiển thị modal
async function handleUpdateWork() {
  // Lấy danh sách nhân viên Cơ điện và đổ vào select
  const electricalUsers = await fetchElectricalDepartmentUsers();
  populateUserSelects(electricalUsers);
  
  // Lấy dữ liệu hiện tại để đổ vào form
  const currentRow = await fetchWorkDetailBySTT(stt);
  if (currentRow) {
    // Lấy danh sách vị trí lỗi theo tên máy và đổ vào select
    const tenMay = currentRow.may || '';
    if (tenMay) {
      const viTriList = await fetchViTriLoiByMachine(tenMay);
      populateViTriSelect(viTriList);
    }
    
    // Xử lý Hạng mục - radio buttons
    const hangMucValue = currentRow.hangMuc || '';
    const hangMucRadios = document.querySelectorAll('input[name="updateHangMuc"]');
    hangMucRadios.forEach(radio => {
      radio.checked = radio.value === hangMucValue;
    });
    
    // Xử lý Phân loại - radio buttons
    const phanLoaiValue = currentRow.phanLoai || '';
    const phanLoaiRadios = document.querySelectorAll('input[name="updatePhanLoai"]');
    phanLoaiRadios.forEach(radio => {
      radio.checked = radio.value === phanLoaiValue;
    });
    
    // Đổ dữ liệu vào các trường khác
    document.getElementById('updateViTri').value = currentRow.viTri || ''; // select dropdown (dynamic from SQL)
    document.getElementById('updateKetQua').value = currentRow.ketQua || ''; // select dropdown
    document.getElementById('updateHienTrang').value = currentRow.hienTrang || ''; // textarea
    document.getElementById('updateNguyenNhan').value = currentRow.nguyenNhan || ''; // textarea
    document.getElementById('updatePhuongAnXuLy').value = currentRow.phuongAnXuLy || ''; // textarea
    document.getElementById('updateVatTuThayThe').value = currentRow.vatTuThayThe || ''; // textarea
    document.getElementById('updateNguoiLamChinh').value = currentRow.nguoiLamChinh || ''; // select dropdown
    document.getElementById('updateNguoiLamPhu1').value = currentRow.nguoiLamPhu1 || ''; // select dropdown
    document.getElementById('updateNguoiLamPhu2').value = currentRow.nguoiLamPhu2 || ''; // select dropdown
  }

  // Hiển thị modal
  const modal = new bootstrap.Modal(document.getElementById('updateModal'));
  modal.show();
}

// Xử lý lưu cập nhật từ modal
async function handleSaveUpdate() {
  try {
    // Lấy giá trị từ radio buttons Hạng mục
    const hangMucRadio = document.querySelector('input[name="updateHangMuc"]:checked');
    const hangMucValue = hangMucRadio ? hangMucRadio.value : '';
    
    // Lấy giá trị từ radio buttons Phân loại
    const phanLoaiRadio = document.querySelector('input[name="updatePhanLoai"]:checked');
    const phanLoaiValue = phanLoaiRadio ? phanLoaiRadio.value : '';
    
    const updateData = {
      stt: stt,
      hang_muc: hangMucValue,
      phan_loai: phanLoaiValue,
      vi_tri: document.getElementById('updateViTri').value,
      ket_qua: document.getElementById('updateKetQua').value,
      hien_trang: document.getElementById('updateHienTrang').value,
      nguyen_nhan: document.getElementById('updateNguyenNhan').value,
      phuong_an_xu_ly: document.getElementById('updatePhuongAnXuLy').value,
      vat_tu_thay_the: document.getElementById('updateVatTuThayThe').value,
      nguoi_lam_chinh: document.getElementById('updateNguoiLamChinh').value,
      nguoi_lam_phu_1: document.getElementById('updateNguoiLamPhu1').value,
      nguoi_lam_phu_2: document.getElementById('updateNguoiLamPhu2').value,
      action: 'update'
    };

    // Kiểm tra xem có ít nhất một trường được điền
    const hasData = Object.values(updateData).some(value => 
      value !== '' && value !== stt && value !== 'update'
    );
    
    if (!hasData) {
      alert('Vui lòng điền ít nhất một thông tin để cập nhật!');
      return;
    }

    console.log('Dữ liệu cập nhật:', updateData);

    const response = await fetch('https://autoslp.duckdns.org:5678/webhook-test/update-congviec', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updateData)
    });

    if (response.ok) {
      alert('Cập nhật thông tin công việc thành công!');
      // Đóng modal
      const modal = bootstrap.Modal.getInstance(document.getElementById('updateModal'));
      modal.hide();
      
      // Reload lại dữ liệu
      const row = await fetchWorkDetailBySTT(stt);
      if (row) renderWorkDetail(row);
      
      // Refresh thống kê công việc
      await refreshWorkStatistics();
    } else {
      throw new Error('Lỗi từ server');
    }
  } catch (error) {
    console.error('Lỗi khi cập nhật:', error);
    alert('Lỗi khi cập nhật: ' + error.message);
  }
}

// Xử lý lưu và bàn giao từ modal
async function handleSaveAndHandover() {
  try {
    // Lấy giá trị từ radio buttons Hạng mục
    const hangMucRadio = document.querySelector('input[name="updateHangMuc"]:checked');
    const hangMucValue = hangMucRadio ? hangMucRadio.value : '';
    
    // Lấy giá trị từ radio buttons Phân loại
    const phanLoaiRadio = document.querySelector('input[name="updatePhanLoai"]:checked');
    const phanLoaiValue = phanLoaiRadio ? phanLoaiRadio.value : '';
    
    // Lấy thời gian hiện tại cho bàn giao
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = now.getFullYear();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const handoverTime = `${hours}:${minutes}:${seconds} ${day}/${month}/${year}`;
    
    // Get current work data from global variable
    const currentData = window.currentWorkData || {};
    
    const updateData = {
      stt: stt,
      hien_trang_loi: currentData.hienTrangLoi || '', // Thêm trường hien_trang_loi
      hien_trang: document.getElementById('updateHienTrang').value || currentData.hienTrang || '',
      nguyen_nhan: document.getElementById('updateNguyenNhan').value || currentData.nguyenNhan || '',
      phuong_an_xu_ly: document.getElementById('updatePhuongAnXuLy').value || currentData.phuongAnXuLy || '',
      khu_vuc: currentData.khuVuc || '', // Thêm trường khu_vuc
      may: currentData.may || '', // Thêm trường may
      thoi_gian_yeu_cau: currentData.thoiGianYeuCau || '', // Thêm trường thoi_gian_yeu_cau
      thoi_gian_ban_giao: handoverTime, // Thời gian bàn giao hiện tại
      code_zalo_send: currentData.codeZaloSend || '', // Thêm trường code_zalo_send
      hang_muc: hangMucValue || currentData.hangMuc || '', // Cập nhật hang_muc
      phan_loai: phanLoaiValue || currentData.phanLoai || '', // Cập nhật phan_loai
      vi_tri: document.getElementById('updateViTri').value || currentData.viTri || '', // Cập nhật vi_tri
      
      // Các trường khác (giữ nguyên)
      ket_qua: document.getElementById('updateKetQua').value,
      vat_tu_thay_the: document.getElementById('updateVatTuThayThe').value,
      nguoi_lam_chinh: document.getElementById('updateNguoiLamChinh').value,
      nguoi_lam_phu_1: document.getElementById('updateNguoiLamPhu1').value,
      nguoi_lam_phu_2: document.getElementById('updateNguoiLamPhu2').value,
      action: 'update_and_handover'
    };

    // Kiểm tra xem có ít nhất một trường được điền (bỏ qua các trường tự động)
    const excludeFields = ['stt', 'action', 'thoi_gian_ban_giao', 'hien_trang_loi', 'khu_vuc', 'may', 'thoi_gian_yeu_cau', 'code_zalo_send'];
    const hasUserInputData = Object.entries(updateData).some(([key, value]) => 
      !excludeFields.includes(key) && value !== ''
    );
    
    if (!hasUserInputData) {
      alert('Vui lòng điền ít nhất một thông tin để cập nhật!');
      return;
    }

    // Xác nhận trước khi bàn giao
    const userName = localStorage.getItem('slp_display_name') || localStorage.getItem('slp_name');
    if (!confirm(`Xác nhận lưu thông tin và bàn giao công việc bằng tài khoản: ${userName}?`)) {
      return;
    }

    console.log('Dữ liệu cập nhật và bàn giao gửi lên n8n:', updateData);
    console.log('Các trường yêu cầu:', {
      STT: updateData.stt,
      hien_trang_loi: updateData.hien_trang_loi,
      hien_trang: updateData.hien_trang,
      nguyen_nhan: updateData.nguyen_nhan,
      phuong_an_xu_ly: updateData.phuong_an_xu_ly,
      khu_vuc: updateData.khu_vuc,
      may: updateData.may,
      thoi_gian_yeu_cau: updateData.thoi_gian_yeu_cau,
      thoi_gian_ban_giao: updateData.thoi_gian_ban_giao,
      code_zalo_send: updateData.code_zalo_send,
      hang_muc: updateData.hang_muc,
      phan_loai: updateData.phan_loai,
      vi_tri: updateData.vi_tri
    });

    const response = await fetch('https://autoslp.duckdns.org:5678/webhook-test/update-congviec', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updateData)
    });

    if (response.ok) {
      alert('Lưu thông tin và bàn giao công việc thành công!');
      // Đóng modal
      const modal = bootstrap.Modal.getInstance(document.getElementById('updateModal'));
      modal.hide();
      
      // Reload lại dữ liệu
      const row = await fetchWorkDetailBySTT(stt);
      if (row) renderWorkDetail(row);
      
      // Refresh thống kê công việc
      await refreshWorkStatistics();
    } else {
      throw new Error('Lỗi từ server');
    }
  } catch (error) {
    console.error('Lỗi khi lưu và bàn giao:', error);
    alert('Lỗi khi lưu và bàn giao: ' + error.message);
  }
}


