// Google Sheets cấu hình
const SHEET_ID = '18ZLZbC8RjCvSyk_sLBvh3obi-_4TzgIlrDX09LkBXyo';
const API_KEY = 'AIzaSyC1Rsi6v-NoDqTFVDzB_YVCP0g1aHyvMME';
const RANGE = 'Tonghop!A4:Z1000';

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

// Lấy danh sách mã nhân viên, tên, mật khẩu từ Google Sheets
let userList = [];
async function fetchUserListWithPassword() {
  try {
    const API_KEY = 'AIzaSyC1Rsi6v-NoDqTFVDzB_YVCP0g1aHyvMME';
    const SHEET_ID = '18ZLZbC8RjCvSyk_sLBvh3obi-_4TzgIlrDX09LkBXyo';
    const RANGE = 'Data!J2:O100';
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${RANGE}?key=${API_KEY}`;
    const response = await fetch(url);
    const data = await response.json();
    if (data.values) {
      userList = data.values.map(row => ({
        code: row[0]?.trim(),
        name: row[1]?.trim(),
        password: row[5]?.trim()
      }));
    }
  } catch (e) { userList = []; }
}

// Lấy danh sách nhân viên bộ phận Cơ điện
let workerList = [];
async function fetchWorkerList() {
  try {
    const API_KEY = 'AIzaSyC1Rsi6v-NoDqTFVDzB_YVCP0g1aHyvMME';
    const SHEET_ID = '18ZLZbC8RjCvSyk_sLBvh3obi-_4TzgIlrDX09LkBXyo';
    const RANGE = 'Data!J2:O300';
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${RANGE}?key=${API_KEY}`;
    const response = await fetch(url);
    const data = await response.json();
    if (data.values) {
      workerList = data.values.filter(row => (row[3]||'').trim() === 'Cơ điện')
        .map(row => ({ code: row[0]?.trim(), name: row[1]?.trim() }));
    }
  } catch (e) { workerList = []; }
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

// Load danh sách công việc từ Google Sheets
async function loadWorkList() {
  try {
    document.getElementById('loadingSection').style.display = 'block';
    document.getElementById('workListContainer').innerHTML = '';
    document.getElementById('emptyState').style.display = 'none';

    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${RANGE}?key=${API_KEY}`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.values && data.values.length > 0) {
      allWorks = data.values.map(row => {
        const thuchienboy2Val = (row[21] || '').toString().trim();
        const thuchienboy3Val = (row[22] || '').toString().trim();
        return {
          stt: row[0] || '',
          may: row[2] || '',
          thoigianyeucau: row[3] || '',
          hientrangloi: row[4] || '',
          nguoiyeucau: row[5] || '',
          quanlyxacnhan: row[6] || '',
          hientrang: row[12] || '',        // <-- Cột M: Hiện trạng
          nguyennhan: row[13] || '',       // <-- Cột N: Nguyên nhân
          phuonganhxuly: row[14] || '',    // <-- Cột O: Phương án xử lý
          ketqua: row[17] || '',
          thuchienboy1: (row[20] || '').toString().trim(),  // <-- Cột U: Người làm chính
          thuchienboy2: thuchienboy2Val,   // <-- Cột V: Người hỗ trợ 1
          thuchienboy3: thuchienboy3Val,   // <-- Cột W: Người hỗ trợ 2
          quanlyduyet: (row[7] || '').toString().trim(),
          thoigianbangiao: (row[16] || '').toString().trim(),
          hangmuc: row[9] || '',      // J
          phanloai: row[10] || '',    // K
          vitri: row[11] || '',       // L
          vattuthaythe: row[15] || '', // <-- Thêm dòng này
        };
      })
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
    alert('Có lỗi khi tải danh sách công việc. Vui lòng thử lại!');
  } finally {
    document.getElementById('loadingSection').style.display = 'none';
  }
}

// Populate filter options
function populateFilterOptions(rows) {
  const nguoiSet = new Set();
  const maySet = new Set();
  
  rows.forEach(row => {
    const nguoi = (row.nguoiyeucau || '').trim();
    const may = (row.may || '').trim();
    
    if (nguoi) nguoiSet.add(nguoi);
    if (may) maySet.add(may);
  });
  
  const filterNguoi = document.getElementById('filterNguoi');
  filterNguoi.innerHTML = '<option value="">Tất cả</option>';
  Array.from(nguoiSet).sort().forEach(nguoi => {
    filterNguoi.innerHTML += `<option value="${nguoi}">${nguoi}</option>`;
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
          ${!thuchienboy1Val ? (
            `<button class="btn btn-success btn-action assign-main-btn" onclick="assignMainWorker('${work.stt}', this)">
              <i class="bi bi-person-check me-1"></i>Xử lý
            </button>`
          ) : ('')}
          ${(() => {
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
          })()}
          <button class="btn btn-info btn-action" onclick="updateWork('${work.stt}')">
            <i class="bi bi-pencil-square me-1"></i>Cập Nhật
          </button>
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
  const filterNguoi = document.getElementById('filterNguoi').value;
  const filterMay = document.getElementById('filterMay').value;
  const statusFilter = document.getElementById('statusFilter').value;
  const searchInput = document.getElementById('searchInput').value.toLowerCase();
  const sortOrder = document.getElementById('sortOrder').value;
  
  filteredWorks = allWorks.filter(work => {
    const matchNguoi = !filterNguoi || work.nguoiyeucau === filterNguoi;
    const matchMay = !filterMay || work.may === filterMay;
    const matchStatus = !statusFilter || work.hientrang === statusFilter;
    const matchSearch = !searchInput || 
      work.stt.toLowerCase().includes(searchInput) ||
      work.may.toLowerCase().includes(searchInput) ||
      work.nguoiyeucau.toLowerCase().includes(searchInput);
    
    return matchNguoi && matchMay && matchStatus && matchSearch;
  });
  
  // Sắp xếp
  filteredWorks.sort((a, b) => {
    switch(sortOrder) {
      case 'newest':
        const getNumA = parseInt((a.stt || '').replace(/\D/g, '')) || 0;
        const getNumB = parseInt((b.stt || '').replace(/\D/g, '')) || 0;
        return getNumB - getNumA;
      case 'oldest':
        const getNumA2 = parseInt((a.stt || '').replace(/\D/g, '')) || 0;
        const getNumB2 = parseInt((b.stt || '').replace(/\D/g, '')) || 0;
        return getNumA2 - getNumB2;
      case 'priority':
        const priorityOrder = {'Chờ xử lý': 0, 'Đang xử lý': 1, 'Hoàn thành': 2};
        return priorityOrder[a.hientrang] - priorityOrder[b.hientrang];
      default:
        return 0;
    }
  });
  
  displayWorkList();
}

// Xem chi tiết công việc
function viewDetails(stt) {
  const work = allWorks.find(w => w.stt === stt);
  if (!work) return;
  
  let details = `STT: ${work.stt}\n`;
  details += `Máy: ${work.may}\n`;
  details += `Thời gian yêu cầu: ${work.thoigianyeucau}\n`;
  details += `Nội dung công việc: ${work.hientrangloi}\n`;
  details += `Người yêu cầu: ${work.nguoiyeucau}\n`;
  details += `Trạng thái: ${work.hientrang}\n`;
  
  if (work.nguyennhan) details += `Nguyên nhân: ${work.nguyennhan}\n`;
  if (work.phuonganhxuly) details += `Phương án xử lý: ${work.phuonganhxuly}\n`;
  if (work.ketqua) details += `Kết quả: ${work.ketqua}\n`;
  if (work.thuchienboy1) details += `Thực hiện bởi: ${work.thuchienboy1}\n`;
  if (work.thuchienboy2) details += `Hỗ trợ bởi: ${work.thuchienboy2}`;
  
  alert(details);
}

// Gán người làm chính
async function assignMainWorker(stt, buttonElement) {
  const userName = localStorage.getItem('slp_name');
  if (!userName) {
    alert('Vui lòng đăng nhập để thực hiện chức năng này!');
    return;
  }

  try {
    const scriptUrl = 'https://script.google.com/macros/s/AKfycby7H4_PMZD6N9FGTbv-PFOUIaIxxpvz-UxJ1E3bvIXbIWt7hTQG3aaK4loGO9AzWsrH/exec';
    fetch(scriptUrl, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        stt: stt,
        column: 'U',
        value: userName
      })
    });
    // Cập nhật dữ liệu local và render lại giao diện
    const idx = allWorks.findIndex(w => w.stt === stt);
    if (idx !== -1) allWorks[idx].thuchienboy1 = userName;
    const idx2 = filteredWorks.findIndex(w => w.stt === stt);
    if (idx2 !== -1) filteredWorks[idx2].thuchienboy1 = userName;
    displayWorkList();
  } catch (error) {
    console.error('Lỗi khi gửi request:', error);
  }
}

// Gán người hỗ trợ
async function assignSupportWorker(stt, buttonElement) {
  const userName = localStorage.getItem('slp_name');
  if (!userName) {
    alert('Vui lòng đăng nhập để thực hiện chức năng này!');
    return;
  }

  try {
    // Tìm dòng trong dữ liệu
    const idx = allWorks.findIndex(w => w.stt === stt);
    if (idx === -1) {
      alert('Không tìm thấy công việc!');
      return;
    }
    let targetColumn = '';
    if (!allWorks[idx].thuchienboy2) {
      allWorks[idx].thuchienboy2 = userName;
      targetColumn = 'V';
    } else if (!allWorks[idx].thuchienboy3) {
      allWorks[idx].thuchienboy3 = userName;
      targetColumn = 'W';
    } else {
      alert('Đã đủ người hỗ trợ cho công việc này!');
      return;
    }
    // Đồng bộ filteredWorks
    const idx2 = filteredWorks.findIndex(w => w.stt === stt);
    if (idx2 !== -1) {
      if (targetColumn === 'V') filteredWorks[idx2].thuchienboy2 = userName;
      if (targetColumn === 'W') filteredWorks[idx2].thuchienboy3 = userName;
    }
    const scriptUrl = 'https://script.google.com/macros/s/AKfycby7H4_PMZD6N9FGTbv-PFOUIaIxxpvz-UxJ1E3bvIXbIWt7hTQG3aaK4loGO9AzWsrH/exec';
    fetch(scriptUrl, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        stt: stt,
        column: targetColumn,
        value: userName
      })
    });
    displayWorkList();
  } catch (error) {
    console.error('Lỗi khi gửi request:', error);
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
              <div class="row g-3">
                <div class="col-md-4">
                  <label class="form-label" style="color:#888;font-weight:400;">Hạng mục</label>
                  <select name="hangmuc" class="form-select fw-bold" style="color:#374262;">
                    <option value="Sửa chữa">Sửa chữa</option>
                    <option value="Bảo dưỡng">Bảo dưỡng</option>
                  </select>
                </div>
                <div class="col-md-4">
                  <label class="form-label" style="color:#888;font-weight:400;">Phân loại</label>
                  <select name="phanloai" class="form-select fw-bold" style="color:#374262;">
                    <option value="Điện">Điện</option>
                    <option value="Cơ">Cơ</option>
                  </select>
                </div>
                <div class="col-md-4">
                  <label class="form-label" style="color:#888;font-weight:400;">Vị trí</label>
                  <input type="text" name="vitri" class="form-control fw-bold" style="color:#374262;">
                </div>
                <div class="col-md-12">
                  <label class="form-label" style="color:#888;font-weight:400;">Hiện trạng</label>
                  <input type="text" name="hientrang" class="form-control fw-bold" style="color:#374262;">
                </div>
                <div class="col-md-12">
                  <label class="form-label" style="color:#888;font-weight:400;">Nguyên nhân</label>
                  <input type="text" name="nguyennhan" class="form-control fw-bold" style="color:#374262;">
                </div>
                <div class="col-md-12">
                  <label class="form-label" style="color:#888;font-weight:400;">Phương án xử lý</label>
                  <input type="text" name="phuongan" class="form-control fw-bold" style="color:#374262;">
                </div>
                <div class="col-md-12">
                  <label class="form-label" style="color:#888;font-weight:400;">Vật tư thay thế</label>
                  <input type="text" name="vattu" class="form-control fw-bold" style="color:#374262;">
                </div>
                <div class="col-md-4">
                  <label class="form-label" style="color:#888;font-weight:400;">Người xử lý</label>
                  <select name="lamchinh" class="form-select fw-bold" style="color:#374262;"></select>
                </div>
                <div class="col-md-4">
                  <label class="form-label" style="color:#888;font-weight:400;">Người hỗ trợ</label>
                  <select name="lamphu1" class="form-select fw-bold" style="color:#374262;"></select>
                </div>
                <div class="col-md-4">
                  <label class="form-label" style="color:#888;font-weight:400;">Người hỗ trợ</label>
                  <select name="lamphu2" class="form-select fw-bold" style="color:#374262;"></select>
                </div>
              </div>
              <div id="updateWorkError" class="text-danger mt-2 text-center" style="display:none;"></div>
            </div>
            <div class="modal-footer">
              <button type="submit" class="btn btn-primary px-4">Lưu</button>
              <button type="button" class="btn btn-primary px-4" id="saveAndDeliverBtn">Lưu và Bàn giao</button>
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
    if (hangmucValue === 'Sửa chữa' || hangmucValue === 'Bảo dưỡng') {
      form.hangmuc.value = hangmucValue;
    } else {
      form.hangmuc.value = 'Sửa chữa';
    }
    // Phân loại
    const phanloaiValue = work.phanloai || '';
    if (phanloaiValue === 'Điện' || phanloaiValue === 'Cơ') {
      form.phanloai.value = phanloaiValue;
    } else {
      form.phanloai.value = 'Điện';
    }
    form.vitri.value = work.vitri || '';
    form.hientrang.value = work.hientrang || '';
    form.nguyennhan.value = work.nguyennhan || '';
    form.phuongan.value = work.phuonganhxuly || '';
    form.vattu.value = work.vattuthaythe || '';
    // Người làm chính, phụ 1, phụ 2
    renderWorkerOptions(form.lamchinh, work.thuchienboy1 || '');
    renderWorkerOptions(form.lamphu1, work.thuchienboy2 || '');
    renderWorkerOptions(form.lamphu2, work.thuchienboy3 || '');
  })();

  // Xử lý submit
  const form = modal.querySelector('form');
  form.onsubmit = async function(e) {
    e.preventDefault();
    const data = {
      stt: work.stt,
      hangmuc: form.hangmuc.value,
      phanloai: form.phanloai.value,
      vitri: form.vitri.value,
      hientrang: form.hientrang.value,
      nguyennhan: form.nguyennhan.value,
      phuongan: form.phuongan.value,
      vattu: form.vattu.value,
      lamchinh: form.lamchinh.value,
      lamphu1: form.lamphu1.value,
      lamphu2: form.lamphu2.value
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
      const scriptUrl = 'https://script.google.com/macros/s/AKfycby7H4_PMZD6N9FGTbv-PFOUIaIxxpvz-UxJ1E3bvIXbIWt7hTQG3aaK4loGO9AzWsrH/exec';
      await fetch(scriptUrl, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'updateRow', ...data })
      });
      // Cập nhật local
      work.hangmuc = data.hangmuc;
      work.phanloai = data.phanloai;
      work.vitri = data.vitri;
      work.hientrang = data.hientrang;
      work.nguyennhan = data.nguyennhan;
      work.phuonganhxuly = data.phuongan;
      work.vattuthaythe = data.vattu;
      work.thuchienboy1 = data.lamchinh;
      work.thuchienboy2 = data.lamphu1;
      work.thuchienboy3 = data.lamphu2;
      displayWorkList();
    } catch (err) {
      modal.querySelector('#updateWorkError').textContent = 'Có lỗi khi cập nhật. Vui lòng thử lại!';
      modal.querySelector('#updateWorkError').style.display = '';
    }
  };

  // Xử lý nút Lưu và Bàn giao
  const saveAndDeliverBtn = modal.querySelector('#saveAndDeliverBtn');
  saveAndDeliverBtn.onclick = async function() {
    const data = {
      stt: work.stt,
      hangmuc: form.hangmuc.value,
      phanloai: form.phanloai.value,
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
      const scriptUrl = 'https://script.google.com/macros/s/AKfycby7H4_PMZD6N9FGTbv-PFOUIaIxxpvz-UxJ1E3bvIXbIWt7hTQG3aaK4loGO9AzWsrH/exec';
      await fetch(scriptUrl, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'updateRow', ...data })
      });
      // Cập nhật local
      work.hangmuc = data.hangmuc;
      work.phanloai = data.phanloai;
      work.vitri = data.vitri;
      work.hientrang = data.hientrang;
      work.nguyennhan = data.nguyennhan;
      work.phuonganhxuly = data.phuongan;
      work.vattuthaythe = data.vattu;
      work.thuchienboy1 = data.lamchinh;
      work.thuchienboy2 = data.lamphu1;
      work.thuchienboy3 = data.lamphu2;
      work.thoigianbangiao = data.thoigianbangiao;
      displayWorkList();
    } catch (err) {
      modal.querySelector('#updateWorkError').textContent = 'Có lỗi khi cập nhật. Vui lòng thử lại!';
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
