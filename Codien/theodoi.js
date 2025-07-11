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
          thoigianbangiao: (row[16] || '').toString().trim()
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
        <div class="work-info">
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
            <div class="info-value">${work.thoigianbangiao || ''}</div>
          </div>
        </div>
        
        ${work.hientrangloi ? `
        <div class="mb-1">
          <span class="info-label">Hiện trạng lỗi: </span>
          <span class="info-value">${work.hientrangloi}</span>
        </div>
        ` : ''}
        ${work.hientrang ? `
        <div class="mb-1">
          <span class="info-label">Hiện trạng: </span>
          <span class="info-value">${work.hientrang}</span>
        </div>
        ` : ''}
        ${work.nguyennhan ? `
        <div class="mb-1">
          <span class="info-label">Nguyên nhân: </span>
          <span class="info-value">${work.nguyennhan}</span>
        </div>
        ` : ''}
        ${work.phuonganhxuly ? `
          <div class="mb-1">
            <span class="info-label">Phương án xử lý: </span>
            <span class="info-value">${work.phuonganhxuly}</span>
          </div>
        ` : ''}
        
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
          <button class="btn btn-outline-secondary btn-action" onclick="viewDetails('${work.stt}')">
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
  details += `Hiện trạng lỗi: ${work.hientrangloi}\n`;
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
    const scriptUrl = 'https://script.google.com/macros/s/AKfycbynttAirDmYcB12gWVNIUSfqvXYR-c_uBFguLPWeNKSjLimRYDmH9eoBZ5GfGGQqXs-/exec';
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
    const scriptUrl = 'https://script.google.com/macros/s/AKfycbynttAirDmYcB12gWVNIUSfqvXYR-c_uBFguLPWeNKSjLimRYDmH9eoBZ5GfGGQqXs-/exec';
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


window.addEventListener('DOMContentLoaded', async function() {
  await checkLogin();
  showUserInfo();
});
