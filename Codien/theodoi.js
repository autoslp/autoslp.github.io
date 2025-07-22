// N8N API Configuration
const N8N_BASE_URL = 'https://autoslp.duckdns.org:5678/webhook';
const ENDPOINTS = {
  GET_WORKS: `${N8N_BASE_URL}/get-congviec`,
  GET_USERS: `${N8N_BASE_URL}/get-users`,
  UPDATE_WORK: `${N8N_BASE_URL}/update-work`,
  ASSIGN_WORKER: `${N8N_BASE_URL}/assign-worker`,
  CONFIRM_WORK: `${N8N_BASE_URL}/confirm-work`
};

let allWorks = [];
let filteredWorks = [];

// Hàm hiển thị popup đăng nhập
function showLoginPopup() {
  let popup = document.getElementById('loginPopup');
  if (!popup) {
    popup = document.createElement('div');
    popup.id = 'loginPopup';
    popup.style.position = 'fixed';
    popup.style.top = '0';
    popup.style.left = '0';
    popup.style.width = '100vw';
    popup.style.height = '100vh';
    popup.style.background = 'rgba(0,0,0,0.3)';
    popup.style.display = 'flex';
    popup.style.alignItems = 'center';
    popup.style.justifyContent = 'center';
    popup.innerHTML = `
      <div style="background:#fff;padding:32px 24px;border-radius:12px;min-width:320px;box-shadow:0 2px 16px #0002;max-width:90vw;">
        <h4 class="mb-3 text-center">Đăng nhập nhân viên</h4>
        <form id="loginForm">
          <div class="mb-3">
            <label for="usercode" class="form-label">Mã nhân viên</label>
            <input type="text" class="form-control" id="usercode" required autofocus autocomplete="off">
          </div>
          <div class="mb-3">
            <label for="password" class="form-label">Mật khẩu</label>
            <input type="password" class="form-control" id="password" required autocomplete="off">
          </div>
          <div class="mb-2" id="userNameDisplay" style="font-weight:600;color:#007bff;"></div>
          <button type="submit" class="btn btn-primary w-100">Đăng nhập</button>
          <div id="loginError" class="text-danger mt-2" style="display:none;"></div>
        </form>
      </div>
    `;
    document.body.appendChild(popup);
  }
  popup.style.display = 'flex';
  document.body.style.overflow = 'hidden';
}

function hideLoginPopup() {
  let popup = document.getElementById('loginPopup');
  if (popup) popup.style.display = 'none';
  document.body.style.overflow = '';
}

// Lấy danh sách mã nhân viên, tên, mật khẩu từ N8N/SQL
let userList = [];
async function fetchUserListWithPassword() {
  try {
    const response = await fetch(ENDPOINTS.GET_USERS, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    if (data && Array.isArray(data)) {
      userList = data.map(user => ({
        code: user.ma_nhan_vien?.trim(),
        name: user.ten_nhan_vien?.trim(),
        bophan: user.bo_phan?.trim(),
        password: user.mat_khau?.trim(),
        chucvu: user.chuc_vu?.trim()
      }));
    }
  } catch (e) {
    console.error('Lỗi khi lấy danh sách user:', e);
    userList = [];
  }
}


// Lấy danh sách nhân viên bộ phận Cơ điện
let workerList = [];
async function fetchWorkerList() {
  try {
    const response = await fetch(`${ENDPOINTS.GET_USERS}?bophan=Cơ điện`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    if (data && Array.isArray(data)) {
      workerList = data
        .filter(user => (user.bo_phan || '').trim() === 'Cơ điện')
        .map(user => ({ 
          code: user.ma_nhan_vien?.trim(), 
          name: user.ten_nhan_vien?.trim() 
        }));
    }
  } catch (e) {
    console.error('Lỗi khi lấy danh sách worker:', e);
    workerList = [];
  }
}


// Kiểm tra đăng nhập
async function checkLogin() {
  if (!localStorage.getItem('slp_user') || !localStorage.getItem('slp_name')) {
    await fetchUserListWithPassword();
    showLoginPopup();
    setTimeout(() => {
      const userInput = document.getElementById('usercode');
      const passInput = document.getElementById('password');
      const nameDisplay = document.getElementById('userNameDisplay');
      userInput.addEventListener('input', function() {
        const val = userInput.value.trim();
        const found = userList.find(u => u.code && u.code.toUpperCase() === val.toUpperCase());
        if (found) {
          nameDisplay.textContent = found.name;
          nameDisplay.style.color = '#007bff';
        } else {
          nameDisplay.textContent = '';
        }
      });
      document.getElementById('loginForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const val = userInput.value.trim();
        const pass = passInput.value.trim();
        const found = userList.find(u => u.code && u.code.toUpperCase() === val.toUpperCase());
        if (found && found.password === pass) {
          localStorage.setItem('slp_user', found.code);
          localStorage.setItem('slp_name', found.name);
          localStorage.setItem('slp_bophan', found.bophan || '');
          if (found.chucvu && found.chucvu.trim().toLowerCase() === 'quản lý') {
            localStorage.setItem('slp_role', 'quanly');
          } else {
            localStorage.setItem('slp_role', 'nhanvien');
          }
          hideLoginPopup();
          window.location.reload();
        } else {
          document.getElementById('loginError').textContent = 'Mã nhân viên hoặc mật khẩu không hợp lệ!';
          document.getElementById('loginError').style.display = '';
        }
      });
    }, 300);
  } else {
    hideLoginPopup();
  }
}

// Đăng xuất
function logoutSLP() {
  localStorage.removeItem('slp_user');
  localStorage.removeItem('slp_name');
  window.location.reload();
}

// Hiển thị tên nhân viên đã đăng nhập
function showUserInfo() {
  if (localStorage.getItem('slp_user') && localStorage.getItem('slp_name')) {
    const userName = localStorage.getItem('slp_name');
    const userInitial = userName.charAt(0).toUpperCase();
    
    // Tìm header section và thêm user info vào đó
    const headerSection = document.querySelector('.header-section');
    if (headerSection) {
      // Kiểm tra xem đã có user info chưa
      let existingUserInfo = headerSection.querySelector('.header-user-info');
      if (!existingUserInfo) {
        const userInfoHTML = `
        <div class="header-user-info d-flex align-items-center justify-content-center gap-3">
          <div class="user-avatar">${userInitial}</div>
          <div class="user-name">${userName} - Nhân viên</div>
          <button onclick="logoutSLP()" class="logout-btn">
            Đăng xuất
          </button>
        </div>
        `;
        headerSection.insertAdjacentHTML('beforeend', userInfoHTML);
      }
    }
  }
}

// Load danh sách công việc khi trang được tải
document.addEventListener('DOMContentLoaded', function() {
  loadWorkList();
});

// Load danh sách công việc từ N8N/SQL
async function loadWorkList() {
  try {
    document.getElementById('loadingSection').style.display = 'block';
    document.getElementById('workListContainer').innerHTML = '';
    document.getElementById('emptyState').style.display = 'none';

    const response = await fetch(ENDPOINTS.GET_WORKS, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data && Array.isArray(data) && data.length > 0) {
      allWorks = data.map(work => ({
        stt: work.stt || '',
        may: work.may || '',
        thoigianyeucau: work.thoi_gian_yeu_cau || '',
        hientrangloi: work.hien_trang_loi || '',
        nguoiyeucau: work.nguoi_yeu_cau || '',
        quanlyxacnhan: work.ql_xac_nhan || '',
        hientrang: work.hien_trang || '',
        nguyennhan: work.nguyen_nhan || '',
        phuonganhxuly: work.phuong_an_xu_ly || '',
        ketqua: work.ket_qua || '',
        thuchienboy1: (work.nguoi_lam_chinh || '').toString().trim(),
        thuchienboy2: (work.nguoi_lam_phu_1 || '').toString().trim(),
        thuchienboy3: (work.nguoi_lam_phu_2 || '').toString().trim(),
        quanlyduyet: (work.ql_duyet || '').toString().trim(),
        thoigianbangiao: (work.thoi_gian_ban_giao || '').toString().trim(),
        hangmuc: work.hang_muc || '',
        phanloai: work.phan_loai || '',
        vitri: work.vi_tri || '',
        vattuthaythe: work.vat_tu_thay_the || '',
        xacnhan: work.san_xuat_xac_nhan || '',
      }))
      .filter(work => {
        const quanlyduyet = (work.quanlyduyet || '').trim().toLowerCase();
        return quanlyduyet === 'đã duyệt';
      });
      
      allWorks.sort((a, b) => {
        const getNum = r => parseInt((r.stt || '').replace(/\D/g, '')) || 0;
        return getNum(b) - getNum(a);
      });
      
      populateFilterOptions(allWorks);
      filteredWorks = [...allWorks];
      displayWorkList();
    } else {
      document.getElementById('emptyState').style.display = 'block';
    }
    
  } catch (error) {
    console.error('Lỗi khi load danh sách công việc:', error);
    document.getElementById('emptyState').style.display = 'block';
    // alert('Có lỗi khi tải danh sách công việc. Vui lòng thử lại!');
  } finally {
    document.getElementById('loadingSection').style.display = 'none';
  }
}

// Populate filter options
function populateFilterOptions(rows) {
  const maySet = new Set();
  
  rows.forEach(row => {
    const may = (row.may || '').trim();
    if (may) maySet.add(may);
  });
  
  const filterMay = document.getElementById('filterMay');
  filterMay.innerHTML = '<option value="">Tất cả</option>';
  Array.from(maySet).sort().forEach(may => {
    filterMay.innerHTML += `<option value="${may}">${may}</option>`;
  });
}

// Hiển thị danh sách công việc
function displayWorkList() {
  const container = document.getElementById('workListContainer');
  const userBophan = localStorage.getItem('slp_bophan');
  
  if (filteredWorks.length === 0) {
    document.getElementById('emptyState').style.display = 'block';
    return;
  }
  
  document.getElementById('emptyState').style.display = 'none';
  
  container.innerHTML = filteredWorks.map(work => {
    const thuchienboy1Val = (work.thuchienboy1 || '').toString().trim();
    const thuchienboy2Val = (work.thuchienboy2 || '').toString().trim();
    const thuchienboy3Val = (work.thuchienboy3 || '').toString().trim();
    const userName = localStorage.getItem('slp_name');

    function getLastName(fullName) {
      if (!fullName) return '';
      const parts = fullName.trim().split(/\s+/);
      return parts[parts.length - 1];
    }

    function getLastNames(multiNames) {
      if (!multiNames) return [];
      const separators = /,|;|-|và/gi;
      const names = multiNames.split(separators).map(n => n.trim()).filter(n => n.length > 0);
      const lastNames = names.map(name => {
        const parts = name.trim().split(/\s+/);
        return parts[parts.length - 1];
      });
      return lastNames;
    }

    let nguoiXuLy = thuchienboy1Val ? `Mr ${getLastName(thuchienboy1Val)} - Xử lý` : 'Chưa phân công';
    let nguoiHoTroArr = [];
    if (thuchienboy2Val) {
      const lastNames = getLastNames(thuchienboy2Val);
      nguoiHoTroArr = nguoiHoTroArr.concat(lastNames.map(n => `Mr ${n}`));
    }
    if (thuchienboy3Val) {
      const lastNames = getLastNames(thuchienboy3Val);
      nguoiHoTroArr = nguoiHoTroArr.concat(lastNames.map(n => `Mr ${n}`));
    }
    let nguoiHoTro = nguoiHoTroArr.length > 0 ? nguoiHoTroArr.join(' và ') + ' - Hỗ trợ' : '';

    const hasWorkers = thuchienboy1Val || thuchienboy2Val || thuchienboy3Val;
    const hasBangGiao = work.thoigianbangiao && work.thoigianbangiao.trim() !== '';
    
    let displayStatus, statusClass, headerClass;
    if (hasBangGiao) {
      displayStatus = 'Đã bàn giao';
      statusClass = 'status-completed';
      headerClass = 'header-completed';
    } else if (hasWorkers) {
      displayStatus = 'Đang xử lý';
      statusClass = 'status-in-progress';
      headerClass = 'header-in-progress';
    } else {
      displayStatus = 'Đợi xử lý';
      statusClass = 'status-pending';
      headerClass = 'header-pending';
    }

    return `
    <div class="work-card" data-stt="${work.stt}">
      <div class="work-header ${headerClass} d-flex justify-content-between align-items-center">
        <div>
          <strong>${work.stt}</strong> - ${work.may}
        </div>
        <span class="status-badge ${statusClass}">${displayStatus}</span>
      </div>
      <div class="work-body">
      ${(() => {
        // Đếm số trường chi tiết có dữ liệu
        let detailCount = 0;
        if (work.hientrangloi) detailCount++;
        if (work.hientrang) detailCount++;
        if (work.nguyennhan) detailCount++;
        if (work.phuonganhxuly) detailCount++;
        if (detailCount === 0) return '';
        // Nếu là mobile, không set grid-template-columns động
        let isMobile = false;
        if (typeof window !== 'undefined') {
          isMobile = window.innerWidth <= 768;
        }
        let style = isMobile ? '' : `grid-template-columns: repeat(${detailCount}, 1fr);`;
        return `<div class=\"work-detail\" style=\"${style}\">`
          + (work.hientrangloi ? `<div class=\"info-item\"><div class=\"info-label\"><i class=\"bi bi-journal-text me-1\" style=\"color:#17a2b8;font-size:1em;\"></i>Nội dung công việc</div><div class=\"info-value\">${work.hientrangloi}</div></div>` : '')
          + (work.hientrang ? `<div class=\"info-item\"><div class=\"info-label\"><i class=\"bi bi-exclamation-triangle me-1\" style=\"color:#17a2b8;font-size:1em;\"></i>Hiện trạng</div><div class=\"info-value\">${work.hientrang}</div></div>` : '')
          + (work.nguyennhan ? `<div class=\"info-item\"><div class=\"info-label\"><i class=\"bi bi-search me-1\" style=\"color:#17a2b8;font-size:1em;\"></i>Nguyên nhân</div><div class=\"info-value\">${work.nguyennhan}</div></div>` : '')
          + (work.phuonganhxuly ? `<div class=\"info-item\"><div class=\"info-label\"><i class=\"bi bi-lightbulb me-1\" style=\"color:#17a2b8;font-size:1em;\"></i>Phương án xử lý</div><div class=\"info-value\">${work.phuonganhxuly}</div></div>` : '')
          + '</div>';
      })()}
      <div class="work-info d-none d-md-grid">
          <div class="info-item">
            <div class="info-label">Thời gian yêu cầu</div>
            <div class="info-value">${work.thoigianyeucau}</div>
          </div>
          <div class="info-item">
            <div class="info-label">Người yêu cầu</div>
            <div class="info-value">${work.nguoiyeucau}</div>
          </div>
          <div class="info-item">
            <div class="info-label">Người xử lý</div>
            <div class="info-value main-worker-display">${nguoiXuLy}<br>${nguoiHoTro || ''}</div>
          </div>
          <div class="info-item">
            <div class="info-label">Thời gian bàn giao</div>
            <div class="info-value">${work.thoigianbangiao ? work.thoigianbangiao : 'Chưa bàn giao'}</div>
          </div>
        </div>
        
        
        ${work.ketqua ? `
          <div class="mb-3">
            <span class="info-label">Kết quả: </span>
            <span class="info-value">${work.ketqua}</span>
          </div>
        ` : ''}
        
        <div class="d-flex flex-wrap justify-content-end">
          ${localStorage.getItem('slp_role') === 'quanly' && work.thoigianbangiao ? `
            <div class="dropdown me-2">
              <button class="btn btn-outline-primary btn-action dropdown-toggle" style="width: 98%;" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                <i class="bi bi-check2-circle me-1"></i>${work.xacnhan ? work.xacnhan : 'Xác nhận'}
              </button>
              <ul class="dropdown-menu">
                <li><a class="dropdown-item" href="#" onclick="confirmWork('${work.stt}', this, 'OK', event)">OK</a></li>
                <li><a class="dropdown-item" href="#" onclick="confirmWork('${work.stt}', this, 'NG', event)">NG</a></li>
                <li><a class="dropdown-item" href="#" onclick="confirmWork('${work.stt}', this, 'Tạm thời', event)">Tạm thời</a></li>
              </ul>
            </div>
          ` : ''}
          ${userBophan === 'Cơ điện' ?
            (!thuchienboy1Val ? (
              `<button class="btn btn-success btn-action assign-main-btn" onclick="assignMainWorker('${work.stt}', this)">
                <i class="bi bi-person-check me-1"></i>Xử lý
              </button>`
            ) : ('')) +
            (() => {
              // Ẩn nút nếu đã đủ 2 người hỗ trợ
              const bothSupportFilled = thuchienboy2Val && thuchienboy3Val;
              // Chỉ hiển thị nếu còn slot hỗ trợ và user chưa là người hỗ trợ
              if (!bothSupportFilled && ![thuchienboy2Val, thuchienboy3Val].includes(userName)) {
                return `<button class="btn btn-warning btn-action" onclick="assignSupportWorker('${work.stt}', this)">
                  <i class="bi bi-person-plus me-1"></i>Hỗ trợ
                </button>`;
              } else if (thuchienboy1Val) { // Nếu đã có người làm chính, ẩn nút hỗ trợ
                return '';
              }
              return '';
            })() +
            `<button class="btn btn-info btn-action" onclick="updateWork('${work.stt}')">
              <i class="bi bi-pencil-square me-1"></i>Cập Nhật
            </button>`
          : ''}
          <button class="btn btn-outline-secondary btn-action d-block d-md-none" onclick="toggleWorkInfo(this)">
            <i class="bi bi-eye me-1"></i>Chi Tiết
          </button>
        </div>
      </div>
    </div>
  `;
  }).join('');
}

// Lọc và tìm kiếm công việc
function filterWorks() {
  const filterMay = document.getElementById('filterMay').value;
  const statusFilter = document.getElementById('statusFilter').value;
  
  filteredWorks = allWorks.filter(work => {
    const matchMay = !filterMay || work.may === filterMay;
    
    // Calculate display status for filtering
    const thuchienboy1Val = (work.thuchienboy1 || '').toString().trim();
    const thuchienboy2Val = (work.thuchienboy2 || '').toString().trim();
    const thuchienboy3Val = (work.thuchienboy3 || '').toString().trim();
    const hasWorkers = thuchienboy1Val || thuchienboy2Val || thuchienboy3Val;
    const hasBangGiao = work.thoigianbangiao && work.thoigianbangiao.trim() !== '';
    
    let displayStatus;
    if (hasBangGiao) {
      displayStatus = 'Đã bàn giao';
    } else if (hasWorkers) {
      displayStatus = 'Đang xử lý';
    } else {
      displayStatus = 'Đợi xử lý';
    }
    
    const matchStatus = !statusFilter || displayStatus === statusFilter;
    
    return matchMay && matchStatus;
  });
  
  // Sắp xếp
  filteredWorks.sort((a, b) => {
    // Sort by newest (highest STT number) by default
    const getNumA = parseInt((a.stt || '').replace(/\D/g, '')) || 0;
    const getNumB = parseInt((b.stt || '').replace(/\D/g, '')) || 0;
    return getNumB - getNumA;
  });
  
  displayWorkList();
}


// Gán người làm chính
async function assignMainWorker(stt, buttonElement) {
  const userName = localStorage.getItem('slp_name');
  if (!userName) {
    alert('Vui lòng đăng nhập để thực hiện chức năng này!');
    return;
  }

  // Hiệu ứng nút ngay lập tức
  const originalText = buttonElement.innerHTML;
  buttonElement.innerHTML = '<i class="bi bi-check-circle me-1"></i>Đã nhận';
  buttonElement.classList.remove('btn-success');
  buttonElement.classList.add('btn-secondary');
  buttonElement.disabled = true;

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
      // Cập nhật dữ liệu local và render lại giao diện
      const idx = allWorks.findIndex(w => w.stt === stt);
      if (idx !== -1) allWorks[idx].thuchienboy1 = userName;
      const idx2 = filteredWorks.findIndex(w => w.stt === stt);
      if (idx2 !== -1) filteredWorks[idx2].thuchienboy1 = userName;
      
      // Cập nhật hiển thị người xử lý mà không reload toàn bộ list
      updateWorkerDisplay(stt);
    } else {
      // Khôi phục nút nếu lỗi
      buttonElement.innerHTML = originalText;
      buttonElement.classList.remove('btn-secondary');
      buttonElement.classList.add('btn-success');
      buttonElement.disabled = false;
      console.error('Lỗi khi gán người làm chính');
      alert('Lỗi từ server khi nhận xử lý công việc');
    }
  } catch (error) {
    // Khôi phục nút nếu lỗi
    buttonElement.innerHTML = originalText;
    buttonElement.classList.remove('btn-secondary');
    buttonElement.classList.add('btn-success');
    buttonElement.disabled = false;
    console.error('Lỗi khi gửi request:', error);
    alert('Lỗi khi nhận xử lý công việc: ' + error.message);
  }
}

// Gán người hỗ trợ
async function assignSupportWorker(stt, buttonElement) {
  const userName = localStorage.getItem('slp_name');
  if (!userName) {
    alert('Vui lòng đăng nhập để thực hiện chức năng này!');
    return;
  }

  // Hiệu ứng nút ngay lập tức
  const originalText = buttonElement.innerHTML;
  buttonElement.innerHTML = '<i class="bi bi-check-circle me-1"></i>Đã nhận';
  buttonElement.classList.remove('btn-warning');
  buttonElement.classList.add('btn-secondary');
  buttonElement.disabled = true;

  try {
    // Tìm dòng trong dữ liệu
    const idx = allWorks.findIndex(w => w.stt === stt);
    if (idx === -1) {
      // Khôi phục nút nếu lỗi
      buttonElement.innerHTML = originalText;
      buttonElement.classList.remove('btn-secondary');
      buttonElement.classList.add('btn-warning');
      buttonElement.disabled = false;
      alert('Không tìm thấy công việc!');
      return;
    }
    
    let updateField = '';
    if (!allWorks[idx].thuchienboy2 || allWorks[idx].thuchienboy2.trim() === '') {
      updateField = 'nguoi_lam_phu_1';
    } else if (!allWorks[idx].thuchienboy3 || allWorks[idx].thuchienboy3.trim() === '') {
      updateField = 'nguoi_lam_phu_2';
    } else {
      // Khôi phục nút nếu đã đủ người
      buttonElement.innerHTML = originalText;
      buttonElement.classList.remove('btn-secondary');
      buttonElement.classList.add('btn-warning');
      buttonElement.disabled = false;
      alert('Đã đủ người hỗ trợ cho công việc này!');
      return;
    }

    // Lấy thời gian hiện tại
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
        [updateField]: userName,
        thoi_gian_bat_dau_lam: currentTime,
        action: 'support'
      })
    });

    if (response.ok) {
      // Cập nhật dữ liệu local
      if (updateField === 'nguoi_lam_phu_1') {
        allWorks[idx].thuchienboy2 = userName;
      } else {
        allWorks[idx].thuchienboy3 = userName;
      }
      
      // Đồng bộ filteredWorks
      const idx2 = filteredWorks.findIndex(w => w.stt === stt);
      if (idx2 !== -1) {
        if (updateField === 'nguoi_lam_phu_1') {
          filteredWorks[idx2].thuchienboy2 = userName;
        } else {
          filteredWorks[idx2].thuchienboy3 = userName;
        }
      }
      
      // Cập nhật hiển thị người xử lý mà không reload toàn bộ list
      updateWorkerDisplay(stt);
    } else {
      // Khôi phục nút nếu lỗi
      buttonElement.innerHTML = originalText;
      buttonElement.classList.remove('btn-secondary');
      buttonElement.classList.add('btn-warning');
      buttonElement.disabled = false;
      console.error('Lỗi khi gán người hỗ trợ');
      alert('Lỗi từ server khi đăng ký hỗ trợ');
    }
  } catch (error) {
    // Khôi phục nút nếu lỗi
    buttonElement.innerHTML = originalText;
    buttonElement.classList.remove('btn-secondary');
    buttonElement.classList.add('btn-warning');
    buttonElement.disabled = false;
    console.error('Lỗi khi gửi request:', error);
    alert('Lỗi khi đăng ký hỗ trợ: ' + error.message);
  }
}

// Hàm cập nhật hiển thị người xử lý mà không reload toàn bộ danh sách
function updateWorkerDisplay(stt) {
  const workCard = document.querySelector(`[data-stt="${stt}"]`);
  if (!workCard) return;
  
  const work = filteredWorks.find(w => w.stt === stt);
  if (!work) return;
  
  const thuchienboy1Val = (work.thuchienboy1 || '').toString().trim();
  const thuchienboy2Val = (work.thuchienboy2 || '').toString().trim();
  const thuchienboy3Val = (work.thuchienboy3 || '').toString().trim();
  
  function getLastName(fullName) {
    if (!fullName) return '';
    const parts = fullName.trim().split(/\s+/);
    return parts[parts.length - 1];
  }

  function getLastNames(multiNames) {
    if (!multiNames) return [];
    const separators = /,|;|-|và/gi;
    const names = multiNames.split(separators).map(n => n.trim()).filter(n => n.length > 0);
    const lastNames = names.map(name => {
      const parts = name.trim().split(/\s+/);
      return parts[parts.length - 1];
    });
    return lastNames;
  }

  let nguoiXuLy = thuchienboy1Val ? `Mr ${getLastName(thuchienboy1Val)} - Xử lý` : 'Chưa phân công';
  let nguoiHoTroArr = [];
  if (thuchienboy2Val) {
    const lastNames = getLastNames(thuchienboy2Val);
    nguoiHoTroArr = nguoiHoTroArr.concat(lastNames.map(n => `Mr ${n}`));
  }
  if (thuchienboy3Val) {
    const lastNames = getLastNames(thuchienboy3Val);
    nguoiHoTroArr = nguoiHoTroArr.concat(lastNames.map(n => `Mr ${n}`));
  }
  let nguoiHoTro = nguoiHoTroArr.length > 0 ? nguoiHoTroArr.join(' và ') + ' - Hỗ trợ' : '';
  
  // Cập nhật text hiển thị người xử lý
  const workerDisplay = workCard.querySelector('.main-worker-display');
  if (workerDisplay) {
    workerDisplay.innerHTML = `${nguoiXuLy}<br>${nguoiHoTro || ''}`;
  }
  
  // Cập nhật status badge
  const hasWorkers = thuchienboy1Val || thuchienboy2Val || thuchienboy3Val;
  const hasBangGiao = work.thoigianbangiao && work.thoigianbangiao.trim() !== '';
  
  let displayStatus, statusClass, headerClass;
  if (hasBangGiao) {
    displayStatus = 'Đã bàn giao';
    statusClass = 'status-completed';
    headerClass = 'header-completed';
  } else if (hasWorkers) {
    displayStatus = 'Đang xử lý';
    statusClass = 'status-in-progress';
    headerClass = 'header-in-progress';
  } else {
    displayStatus = 'Đợi xử lý';
    statusClass = 'status-pending';
    headerClass = 'header-pending';
  }
  
  const statusBadge = workCard.querySelector('.status-badge');
  const workHeader = workCard.querySelector('.work-header');
  if (statusBadge) {
    statusBadge.textContent = displayStatus;
    statusBadge.className = `status-badge ${statusClass}`;
  }
  if (workHeader) {
    workHeader.className = `work-header ${headerClass} d-flex justify-content-between align-items-center`;
  }
}

// Hiển thị popup cập nhật công việc
function updateWork(stt) {
  const work = allWorks.find(w => w.stt === stt);
  if (!work) return;

  // Nếu modal chưa có thì tạo
  let modal = document.getElementById('updateWorkModal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'updateWorkModal';
    modal.className = 'modal fade';
    modal.tabIndex = -1;
    modal.innerHTML = `
      <div class="modal-dialog modal-lg modal-dialog-centered">
        <div class="modal-content">
          <form id="updateWorkForm">
            <div class="modal-header">
              <h5 class="modal-title">Cập nhật - ${work.stt} - ${work.may}</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Đóng"></button>
            </div>
            <div class="modal-body">
              <div class="d-flex justify-content-center align-items-center gap-4 mb-3" style="margin-bottom:18px;">
                <div class="hangmuc-btn-group" style="text-align:center;">
                  <div class="info-label" style="margin-bottom: 4px;">Hạng mục</div>
                  <div class="btn-group" role="group" aria-label="Hangmuc Switch">
                    <input type="radio" class="btn-check" name="hangmuc" id="hangmucSC" value="Sửa chữa" autocomplete="off" checked>
                    <label class="btn btn-hangmuc" for="hangmucSC">Sửa chữa</label>
                    <input type="radio" class="btn-check" name="hangmuc" id="hangmucBD" value="Bảo dưỡng" autocomplete="off">
                    <label class="btn btn-hangmuc" for="hangmucBD">Bảo dưỡng</label>
                    <input type="radio" class="btn-check" name="hangmuc" id="hangmucSX" value="Sản xuất" autocomplete="off">
                    <label class="btn btn-hangmuc" for="hangmucSX">Sản xuất</label>
                    <input type="radio" class="btn-check" name="hangmuc" id="hangmucKS" value="Khảo sát" autocomplete="off">
                    <label class="btn btn-hangmuc" for="hangmucKS">Khảo sát</label>
                  </div>
                </div>
                <div class="phanloai-btn-group" style="text-align:center;">
                  <div class="info-label" style="margin-bottom: 4px;">Phân loại</div>
                  <div class="btn-group" role="group" aria-label="Phanloai Switch">
                    <input type="radio" class="btn-check" name="phanloai" id="phanloaiDien" value="Điện" autocomplete="off" checked>
                    <label class="btn btn-phanloai" for="phanloaiDien">Điện</label>
                    <input type="radio" class="btn-check" name="phanloai" id="phanloaiCo" value="Cơ" autocomplete="off">
                    <label class="btn btn-phanloai" for="phanloaiCo">Cơ</label>
                  </div>
                </div>
              </div>
              <div class="work-update-info work-update-info-2col">
                <div class="info-item">
                  <div class="info-label">Vị trí</div>
                  <select name="vitri" id="updateViTri" class="info-value form-select">
                    <option value="">-- Chọn vị trí --</option>
                  </select>
                </div>
                <div class="info-item">
                  <div class="info-label">Kết quả</div>
                  <select name="ketqua" id="updateKetQua" class="info-value form-select">
                    <option value="">-- Chọn kết quả --</option>
                  </select>
                </div>
              </div>
              
              <div class="work-update-info work-update-info-2col">
                <div class="info-item">
                  <div class="info-label">Hiện trạng</div>
                  <input type="text" name="hientrang" class="info-value form-control">
                </div>
                <div class="info-item">
                  <div class="info-label">Nguyên nhân</div>
                  <input type="text" name="nguyennhan" class="info-value form-control">
                </div>
                <div class="info-item">
                  <div class="info-label">Phương án xử lý</div>
                  <input type="text" name="phuongan" class="info-value form-control">
                </div>
                <div class="info-item">
                  <div class="info-label">Vật tư thay thế</div>
                  <input type="text" name="vattu" class="info-value form-control">
                </div>
              </div>
              
              <div class="toggle-row" style="margin-bottom: 2px;">
                <button class="btn-toggle-collapse" type="button" onclick="toggleSection(this)">
                  <span class="arrow-down"></span>
                </button>
              </div>
              <div class="work-update-info work-update-info-3col" id="workWorkerSection" style="display:none;">
                <div class="info-item">
                  <div class="info-label">Người xử lý</div>
                  <select name="lamchinh" class="info-value form-select"></select>
                </div>
                <div class="info-item">
                  <div class="info-label">Người hỗ trợ 1</div>
                  <select name="lamphu1" class="info-value form-select"></select>
                </div>
                <div class="info-item">
                  <div class="info-label">Người hỗ trợ 2</div>
                  <select name="lamphu2" class="info-value form-select"></select>
                </div>
              </div>
              <div id="updateWorkError" class="text-danger mt-2 text-center" style="display:none;"></div>
            </div>
            <div class="modal-footer">
              <button type="submit" class="btn btn-success">Lưu</button>
              <button type="button" class="btn btn-success" id="saveAndDeliverBtn">Lưu và Bàn giao</button>
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Đóng</button>
            </div>
          </form>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
  }

  // Hàm render option cho select người làm
  function renderWorkerOptions(selectEl, selectedName) {
    // Chuẩn hóa tên: lấy tên đầu tiên, trim, lowerCase
    let selected = (selectedName||'').split(/,|;| và /)[0].trim().toLowerCase();
    selectEl.innerHTML = '<option value="">-- Chọn --</option>' +
      workerList.map(w => {
        const workerName = (w.name||'').trim();
        const isSelected = workerName.toLowerCase() === selected ? ' selected' : '';
        return `<option value="${workerName}"${isSelected}>${workerName}</option>`;
      }).join('');
  }

  // Gán giá trị vào form (bổ sung await fetchWorkerList)
  (async () => {
    await fetchWorkerList();
    const form = modal.querySelector('form');
    
    // Hạng mục
    const hangmucValue = work.hangmuc || '';
    // Reset tất cả các radio button
    form.hangmucSC.checked = false;
    form.hangmucBD.checked = false;
    form.hangmucSX.checked = false;
    form.hangmucKS.checked = false;
    
    // Set radio button dựa trên giá trị
    if (hangmucValue === 'Bảo dưỡng') {
      form.hangmucBD.checked = true;
    } else if (hangmucValue === 'Sản xuất') {
      form.hangmucSX.checked = true;
    } else if (hangmucValue === 'Khảo sát') {
      form.hangmucKS.checked = true;
    } else {
      form.hangmucSC.checked = true; // Mặc định "Sửa chữa"
    }
    
    // Phân loại
    if (work.phanloai === 'Cơ') {
      form.phanloaiCo.checked = true;
      form.phanloaiDien.checked = false;
    } else {
      form.phanloaiCo.checked = false;
      form.phanloaiDien.checked = true;
    }
    form.vitri.value = work.vitri || '';
    
    // Populate position and result dropdowns with current values
    await populatePositionAndResultDropdowns(work.may || '', work.vitri || '', work.ketqua || '');
    
    form.hientrang.value = work.hientrang || '';
    form.nguyennhan.value = work.nguyennhan || '';
    form.phuongan.value = work.phuonganhxuly || '';
    form.vattu.value = work.vattuthaythe || '';
    // Người làm chính, phụ 1, phụ 2
    renderWorkerOptions(form.lamchinh, work.thuchienboy1 || '');
    renderWorkerOptions(form.lamphu1, work.thuchienboy2 || '');
    renderWorkerOptions(form.lamphu2, work.thuchienboy3 || '');

    // Gán giá trị ban đầu cho switch
    // const hangmucSwitch = form.querySelector('#hangmucSwitch'); // This line is no longer needed
    // if (work.hangmuc === 'Bảo dưỡng') { // This line is no longer needed
    //   hangmucSwitch.checked = true; // This line is no longer needed
    // } else { // This line is no longer needed
    //   hangmucSwitch.checked = false; // This line is no longer needed
    // } // This line is no longer needed
  })();

  // Xử lý submit
  const form = modal.querySelector('form');
  form.onsubmit = async function(e) {
    e.preventDefault();
    const data = {
      stt: work.stt,
      hangmuc: form.querySelector('input[name="hangmuc"]:checked').value,
      phanloai: form.querySelector('input[name="phanloai"]:checked').value,
      vitri: form.vitri.value,
      ketqua: form.ketqua.value,
      hientrang: form.hientrang.value,
      nguyennhan: form.nguyennhan.value,
      phuongan: form.phuongan.value,
      vattu: form.vattu.value,
      lamchinh: form.lamchinh.value,
      lamphu1: form.lamphu1.value,
      lamphu2: form.lamphu2.value,
      // Thêm dòng này:
      thoigianbangiao: work.thoigianbangiao || ''
    };
    // Hiệu ứng nút Lưu -> Đã lưu NGAY LẬP TỨC, sau 2s khôi phục lại
    const saveBtn = form.querySelector('button[type="submit"]');
    const oldText = saveBtn.textContent;
    saveBtn.textContent = 'Đã lưu';
    saveBtn.classList.remove('btn-primary');
    saveBtn.classList.add('btn-secondary');
    saveBtn.disabled = true;
    setTimeout(() => {
      saveBtn.textContent = oldText;
      saveBtn.classList.remove('btn-secondary');
      saveBtn.classList.add('btn-primary');
      saveBtn.disabled = false;
    }, 2000);
    try {
      const response = await fetch('https://autoslp.duckdns.org:5678/webhook/update-congviec', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          stt: work.stt,
          hang_muc: data.hangmuc,
          phan_loai: data.phanloai,
          vi_tri: data.vitri,
          ket_qua: data.ketqua,
          hien_trang: data.hientrang,
          nguyen_nhan: data.nguyennhan,
          phuong_an_xu_ly: data.phuongan,
          vat_tu_thay_the: data.vattu,
          nguoi_lam_chinh: data.lamchinh,
          nguoi_lam_phu_1: data.lamphu1,
          nguoi_lam_phu_2: data.lamphu2,
          action: 'update'
        })
      });

      if (response.ok) {
        // Cập nhật local
        work.hangmuc = data.hangmuc;
        work.phanloai = data.phanloai;
        work.vitri = data.vitri;
        work.ketqua = data.ketqua;
        work.hientrang = data.hientrang;
        work.nguyennhan = data.nguyennhan;
        work.phuonganhxuly = data.phuongan;
        work.vattuthaythe = data.vattu;
        work.thuchienboy1 = data.lamchinh;
        work.thuchienboy2 = data.lamphu1;
        work.thuchienboy3 = data.lamphu2;
        displayWorkList();
      } else {
        throw new Error('Lỗi từ server');
      }
    } catch (err) {
      console.error('Lỗi khi cập nhật:', err);
      modal.querySelector('#updateWorkError').textContent = 'Có lỗi khi cập nhật: ' + err.message;
      modal.querySelector('#updateWorkError').style.display = '';
    }
  };

  // Xử lý nút Lưu và Bàn giao
  const saveAndDeliverBtn = modal.querySelector('#saveAndDeliverBtn');
  saveAndDeliverBtn.onclick = async function() {
    const data = {
      stt: work.stt,
      hangmuc: form.querySelector('input[name="hangmuc"]:checked').value,
      phanloai: form.querySelector('input[name="phanloai"]:checked').value,
      vitri: form.vitri.value,
      hientrang: form.hientrang.value,
      nguyennhan: form.nguyennhan.value,
      phuongan: form.phuongan.value,
      vattu: form.vattu.value,
      lamchinh: form.lamchinh.value,
      lamphu1: form.lamphu1.value,
      lamphu2: form.lamphu2.value,
      thoigianbangiao: getCurrentDateTimeVN()
    };
    // Hiệu ứng nút Lưu và Bàn giao
    const oldText = saveAndDeliverBtn.textContent;
    saveAndDeliverBtn.textContent = 'Đã lưu và bàn giao';
    saveAndDeliverBtn.classList.remove('btn-primary');
    saveAndDeliverBtn.classList.add('btn-secondary');
    saveAndDeliverBtn.disabled = true;
    setTimeout(() => {
      saveAndDeliverBtn.textContent = oldText;
      saveAndDeliverBtn.classList.remove('btn-secondary');
      saveAndDeliverBtn.classList.add('btn-primary');
      saveAndDeliverBtn.disabled = false;
    }, 2000);
    try {
      const response = await fetch('https://autoslp.duckdns.org:5678/webhook/update-congviec', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          stt: work.stt,
          hang_muc: data.hangmuc,
          phan_loai: data.phanloai,
          vi_tri: data.vitri,
          ket_qua: data.ketqua,
          hien_trang: data.hientrang,
          nguyen_nhan: data.nguyennhan,
          phuong_an_xu_ly: data.phuongan,
          vat_tu_thay_the: data.vattu,
          nguoi_lam_chinh: data.lamchinh,
          nguoi_lam_phu_1: data.lamphu1,
          nguoi_lam_phu_2: data.lamphu2,
          thoi_gian_ban_giao: data.thoigianbangiao,
          action: 'update_and_handover'
        })
      });

      if (response.ok) {
        // Cập nhật local
        work.hangmuc = data.hangmuc;
        work.phanloai = data.phanloai;
        work.vitri = data.vitri;
        work.ketqua = data.ketqua;
        work.hientrang = data.hientrang;
        work.nguyennhan = data.nguyennhan;
        work.phuonganhxuly = data.phuongan;
        work.vattuthaythe = data.vattu;
        work.thuchienboy1 = data.lamchinh;
        work.thuchienboy2 = data.lamphu1;
        work.thuchienboy3 = data.lamphu2;
        work.thoigianbangiao = data.thoigianbangiao;
        displayWorkList();
      } else {
        throw new Error('Lỗi từ server');
      }
    } catch (err) {
      console.error('Lỗi khi lưu và bàn giao:', err);
      modal.querySelector('#updateWorkError').textContent = 'Có lỗi khi lưu và bàn giao: ' + err.message;
      modal.querySelector('#updateWorkError').style.display = '';
    }
  };

// Hàm lấy thời gian hiện tại định dạng VN
function getCurrentDateTimeVN() {
  const now = new Date();
  const pad = n => n.toString().padStart(2, '0');
  return `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())} ${pad(now.getDate())}/${pad(now.getMonth()+1)}/${now.getFullYear()}`;
}

  // Hiển thị modal
  const bsModal = new bootstrap.Modal(modal);
  bsModal.show();

  // // Sau khi render form, thêm JS toggle:
  // const toggleWorkerBtn = modal.querySelector('.toggle-worker-btn');
  // const workerSection = modal.querySelector('#workWorkerSection');
  // const toggleWorkerIcon = modal.querySelector('#toggleWorkerIcon');
  // toggleWorkerBtn.addEventListener('click', function() {
  //   if (workerSection.style.display === 'none') {
  //     workerSection.style.display = '';
  //     toggleWorkerIcon.innerHTML = '&#9650;';
  //   } else {
  //     workerSection.style.display = 'none';
  //     toggleWorkerIcon.innerHTML = '&#9660;';
  //   }
  // });
}
window.updateWork = updateWork;


window.addEventListener('DOMContentLoaded', async function() {
  await checkLogin();
  showUserInfo();
});

window.toggleWorkInfo = function(btn) {
  const card = btn.closest('.work-card');
  const info = card.querySelector('.work-info');
  if (info) info.classList.toggle('d-none');
}

function toggleSection(btn) {
  btn.classList.toggle('active');
  const section = btn.closest('.toggle-row').nextElementSibling;
  const isHidden = window.getComputedStyle(section).display === 'none';
  if (isHidden) {
    section.style.display = '';
  } else {
    section.style.display = 'none';
  }
}

// Thêm hàm xác nhận công việc cho quản lý
window.confirmWork = async function(stt, buttonElement, action, event) {
  if (event) event.preventDefault();
  
  const userName = localStorage.getItem('slp_name');
  if (!userName) {
    alert('Vui lòng đăng nhập để thực hiện chức năng này!');
    return;
  }

  // Đổi text trên nút dropdown thành lựa chọn vừa chọn NGAY LẬP TỨC
  const dropdown = buttonElement.closest('.dropdown');
  if (dropdown) {
    const btn = dropdown.querySelector('.dropdown-toggle');
    if (btn) {
      btn.innerHTML = `<i class='bi bi-check2-circle me-1'></i>${action}`;
      btn.classList.remove('btn-outline-primary');
      btn.classList.add('btn-secondary');
      btn.disabled = true;
    }
  }

  try {
    const response = await fetch('https://autoslp.duckdns.org:5678/webhook/update-congviec', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        stt: stt,
        san_xuat_xac_nhan: action,
        ten_nguoi_xn: userName,
        action: 'confirm'
      })
    });

    if (response.ok) {
      // Cập nhật local và render lại giao diện
      const idx = allWorks.findIndex(w => w.stt === stt);
      if (idx !== -1) {
        allWorks[idx].xacnhan = action;
        allWorks[idx].nguoiXacNhan = userName;
      }
      const idx2 = filteredWorks.findIndex(w => w.stt === stt);
      if (idx2 !== -1) {
        filteredWorks[idx2].xacnhan = action;
        filteredWorks[idx2].nguoiXacNhan = userName;
      }
      // Không gọi displayWorkList() để giữ trạng thái nút đã chọn
      // displayWorkList();
    } else {
      // Khôi phục nút nếu lỗi
      const dropdown = buttonElement.closest('.dropdown');
      if (dropdown) {
        const btn = dropdown.querySelector('.dropdown-toggle');
        if (btn) {
          btn.innerHTML = `<i class='bi bi-check2-circle me-1'></i>Xác nhận`;
          btn.classList.remove('btn-secondary');
          btn.classList.add('btn-outline-primary');
          btn.disabled = false;
        }
      }
      throw new Error('Lỗi từ server');
    }
  } catch (error) {
    // Khôi phục nút nếu lỗi
    const dropdown = buttonElement.closest('.dropdown');
    if (dropdown) {
      const btn = dropdown.querySelector('.dropdown-toggle');
      if (btn) {
        btn.innerHTML = `<i class='bi bi-check2-circle me-1'></i>Xác nhận`;
        btn.classList.remove('btn-secondary');
        btn.classList.add('btn-outline-primary');
        btn.disabled = false;
      }
    }
    console.error('Lỗi khi xác nhận công việc:', error);
    alert('Lỗi khi xác nhận công việc: ' + error.message);
  }
}

// Lấy danh sách vị trí lỗi từ webhook API theo tên máy
let positionList = [];
async function fetchPositionList(tenMay = '') {
  try {
    const response = await fetch(`${N8N_BASE_URL}/get-khuvuc-may`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (!tenMay) {
      // Nếu không có tên máy, trả về danh sách trống
      positionList = [];
      return positionList;
    }
    
    if (!Array.isArray(data)) {
      console.error('Dữ liệu vị trí không phải là mảng:', data);
      positionList = [];
      return positionList;
    }
    
    // Tìm máy theo tên
    const machine = data.find(item => 
      (item.ten_may || '').toLowerCase() === (tenMay || '').toLowerCase()
    );
    
    if (!machine || !machine.vi_tri_loi) {
      console.log('Không tìm thấy vị trí lỗi cho máy:', tenMay);
      positionList = [];
      return positionList;
    }
    
    // Tách chuỗi vị trí lỗi thành mảng, loại bỏ khoảng trắng thừa
    positionList = machine.vi_tri_loi
      .split(',')
      .map(item => item.trim())
      .filter(item => item.length > 0);
    
    console.log('Danh sách vị trí lỗi cho máy', tenMay, ':', positionList);
    return positionList;
  } catch (e) {
    console.error('Lỗi khi lấy danh sách vị trí:', e);
    positionList = [];
    return positionList;
  }
}

// Lấy danh sách kết quả cố định
let resultList = ['OK', 'Not OK', 'Chuyển Bảo Dưỡng'];
async function fetchResultList() {
  // Sử dụng danh sách cố định, không cần gọi API
  console.log('Sử dụng danh sách kết quả cố định:', resultList);
}

// Hàm tạo options cho dropdown từ danh sách
function createOptionsFromList(list, selectedValue = '') {
  let options = '<option value="">-- Chọn --</option>';
  list.forEach(item => {
    const selected = item === selectedValue ? ' selected' : '';
    options += `<option value="${item}"${selected}>${item}</option>`;
  });
  return options;
}

// Hàm populate dropdown cho vị trí và kết quả
async function populatePositionAndResultDropdowns(tenMay = '', selectedVitri = '', selectedKetqua = '') {
  // Fetch position data based on machine name
  await fetchPositionList(tenMay); // Pass machine name to get specific positions
  // Result list is already fixed, no need to fetch
  
  // Populate Vị trí dropdown
  const viTriSelect = document.getElementById('updateViTri');
  if (viTriSelect) {
    viTriSelect.innerHTML = '<option value="">-- Chọn vị trí --</option>';
    positionList.forEach(pos => {
      const selected = pos === selectedVitri ? ' selected' : '';
      viTriSelect.innerHTML += `<option value="${pos}"${selected}>${pos}</option>`;
    });
  }
  
  // Populate Kết quả dropdown với danh sách cố định
  const ketQuaSelect = document.getElementById('updateKetQua');
  if (ketQuaSelect) {
    ketQuaSelect.innerHTML = '<option value="">-- Chọn kết quả --</option>';
    resultList.forEach(result => {
      const selected = result === selectedKetqua ? ' selected' : '';
      ketQuaSelect.innerHTML += `<option value="${result}"${selected}>${result}</option>`;
    });
  }
}
