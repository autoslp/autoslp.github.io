// login-slp.js
// Đăng nhập SLP dùng chung cho nhiều trang

(function(){
  // Hàm hiển thị popup đăng nhập mới
  function showLoginPopup() {
    let popup = document.getElementById("loginPopup");
    if (!popup) {
      popup = document.createElement("div");
      popup.id = "loginPopup";
      popup.style.position = "fixed";
      popup.style.top = "0";
      popup.style.left = "0";
      popup.style.width = "100vw";
      popup.style.height = "100vh";
      popup.style.background = "rgba(0,0,0,0.25)";
      popup.style.display = "flex";
      popup.style.alignItems = "center";
      popup.style.justifyContent = "center";
      popup.style.zIndex = "9999";
      popup.innerHTML = `
        <div class="login-modal">
          <div class="login-header">
            <i class="bi bi-person-circle login-icon"></i>
            <h4>Đăng nhập nhân viên</h4>
          </div>
          <form id="loginForm" autocomplete="off">
            <div class="mb-3">
              <label for="usercode" class="form-label">Mã nhân viên</label>
              <input type="text" class="form-control" id="usercode" required autofocus autocomplete="off">
            </div>
            <div class="mb-3">
              <label for="password" class="form-label">Mật khẩu</label>
              <input type="password" class="form-control" id="password" required autocomplete="off">
            </div>
            <div class="mb-2" id="userNameDisplay" style="font-weight:600;color:#007bff;"></div>
            <button type="submit" class="btn btn-primary w-100" id="loginBtn">
              <i class="bi bi-box-arrow-in-right me-1"></i>Đăng nhập
            </button>
            <div id="loginError" class="text-danger mt-2" style="display:none;"></div>
          </form>
        </div>
        <style>
          .login-modal { background: #fff; border-radius: 18px; box-shadow: 0 8px 32px rgba(0,0,0,0.18); padding: 36px 28px 28px 28px; min-width: 340px; max-width: 95vw; animation: popupFadeIn 0.4s; position: relative; }
          .login-header { text-align: center; margin-bottom: 18px; }
          .login-icon { font-size: 3rem; color: #6a5acd; margin-bottom: 8px; }
          #loginForm .form-control { border-radius: 10px; border: 2px solid #e9ecef; font-size: 1.1rem; }
          #loginForm .form-control:focus { border-color: #6a5acd; box-shadow: 0 0 0 0.15rem rgba(106,90,205,0.15); }
          #loginBtn { border-radius: 10px; font-weight: 600; background: linear-gradient(135deg, #6a5acd, #ffc107); border: none; }
          #loginBtn:hover { background: linear-gradient(135deg, #ffc107, #6a5acd); }
          @keyframes popupFadeIn { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        </style>
      `;
      document.body.appendChild(popup);
    }
    popup.style.display = "flex";
    document.body.style.overflow = "hidden";
  }

  function hideLoginPopup() {
    let popup = document.getElementById("loginPopup");
    if (popup) popup.style.display = "none";
    document.body.style.overflow = "";
  }

  // Lấy danh sách mã nhân viên, tên, mật khẩu từ API n8n (SQL trung gian)
  let userList = [];
  async function fetchUserListWithPassword() {
    try {
      const url = "https://autoslp.duckdns.org:5678/webhook/get-users";
      const response = await fetch(url);
      const data = await response.json();
      let arr = [];
      if (Array.isArray(data)) {
        arr = data;
      } else if (typeof data === 'object' && data !== null) {
        arr = [data];
      }
      userList = arr.map((row) => ({
        code: row.ma_nhan_vien?.trim(),
        name: row.ten_nhan_vien?.trim(),
        password: row.mat_khau?.trim(),
        manager: row.nguoi_quan_ly?.trim(),
        department: row.bo_phan?.trim(),
        position: row.chuc_vu?.trim(),
      }));
    } catch (e) {
      userList = [];
    }
  }

  // Kiểm tra đăng nhập
  async function checkLoginSLP(callback) {
    if (!localStorage.getItem("slp_user") || !localStorage.getItem("slp_name")) {
      await fetchUserListWithPassword();
      showLoginPopup();
      setTimeout(() => {
        const userInput = document.getElementById("usercode");
        const passInput = document.getElementById("password");
        const nameDisplay = document.getElementById("userNameDisplay");
        userInput.addEventListener("input", function () {
          const val = userInput.value.trim();
          const found = userList.find(
            (u) => u.code && u.code.trim().toUpperCase() === val.toUpperCase()
          );
          if (found) {
            nameDisplay.textContent = found.name;
            nameDisplay.style.color = "#007bff";
          } else {
            nameDisplay.textContent = "";
          }
        });
        document.getElementById("loginForm").addEventListener("submit", function (e) {
          e.preventDefault();
          const val = userInput.value.trim();
          const pass = passInput.value;
          const found = userList.find(
            (u) => u.code && u.code.trim().toUpperCase() === val.toUpperCase()
          );
          if (found && found.password && found.password.trim() === pass.trim()) {
          localStorage.setItem("slp_user", found.code);
          localStorage.setItem("slp_name", found.name);
          localStorage.setItem("slp_display_name", found.name);
          localStorage.setItem("slp_role", found.position || '');
          localStorage.setItem("slp_bo_phan", found.department || '');
          localStorage.setItem("slp_chuc_vu", found.position || '');
          hideLoginPopup();
          if (typeof callback === 'function') callback(found);
          window.location.reload();
          } else {
            document.getElementById("loginError").textContent = "Mã nhân viên hoặc mật khẩu không đúng!";
            document.getElementById("loginError").style.display = "";
          }
        });
      }, 300);
    } else {
      hideLoginPopup();
      if (typeof callback === 'function') callback();
    }
  }

  function logoutSLP() {
    localStorage.removeItem("slp_user");
    localStorage.removeItem("slp_name");
    localStorage.removeItem("slp_display_name");
    localStorage.removeItem("slp_role");
    localStorage.removeItem("slp_bo_phan");
    localStorage.removeItem("slp_chuc_vu");
    window.location.reload();
  }

  function showUserInfoSLP(btnId) {
    if (localStorage.getItem("slp_user") && localStorage.getItem("slp_name")) {
      if (btnId && document.getElementById(btnId)) document.getElementById(btnId).style.display = "";
    } else {
      if (btnId && document.getElementById(btnId)) document.getElementById(btnId).style.display = "none";
    }
  }

  // Expose global
  window.checkLoginSLP = checkLoginSLP;
  window.logoutSLP = logoutSLP;
  window.showUserInfoSLP = showUserInfoSLP;
})();
