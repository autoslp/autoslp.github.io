// Login Popup Component - Có thể tái sử dụng
class LoginPopup {
    constructor(options = {}) {
        this.options = {
            apiUrl: 'https://api.autoslp.com/api',
            onLoginSuccess: null,
            onLoginError: null,
            onLogout: null,
            autoShow: false,
            ...options
        };
        
        this.modal = null;
        this.isInitialized = false;
        this.init();
    }
    
    init() {
        if (this.isInitialized) return;
        
        this.createModal();
        this.bindEvents();
        this.isInitialized = true;
        
        if (this.options.autoShow) {
            this.show();
        }
    }
    
    createModal() {
        const modalHTML = `
            <div class="modal fade login-popup-modal" id="loginPopupModal" tabindex="-1">
                <div class="modal-dialog modal-dialog-centered">
                    <div class="modal-content">
                        <div class="modal-header">
                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                            <div class="w-100">
                                <i class="fas fa-industry fa-2x mb-3"></i>
                                <h5>Đăng nhập hệ thống</h5>
                                <p>Vui lòng nhập thông tin đăng nhập</p>
                            </div>
                        </div>
                        <div class="modal-body">
                            <div id="loginAlertMessage"></div>
                            
                            <form id="loginPopupForm">
                                <div class="form-floating">
                                    <input type="text" class="form-control" id="loginUsername" placeholder="Tên đăng nhập" required>
                                    <label for="loginUsername">
                                        <i class="fas fa-user me-2"></i>Tên đăng nhập
                                    </label>
                                </div>
                                
                                <div class="form-floating">
                                    <input type="password" class="form-control" id="loginPassword" placeholder="Mật khẩu" required>
                                    <label for="loginPassword">
                                        <i class="fas fa-lock me-2"></i>Mật khẩu
                                    </label>
                                </div>
                                
                                <div class="form-check mb-3">
                                    <input class="form-check-input" type="checkbox" id="loginRememberMe">
                                    <label class="form-check-label" for="loginRememberMe">
                                        Ghi nhớ đăng nhập
                                    </label>
                                </div>
                                
                                <button type="submit" class="btn btn-primary btn-login" id="loginPopupBtn">
                                    <span class="loading">
                                        <span class="spinner-border spinner-border-sm me-2" role="status"></span>
                                        Đang đăng nhập...
                                    </span>
                                    <span class="normal">
                                        <i class="fas fa-sign-in-alt me-2"></i>Đăng nhập
                                    </span>
                                </button>
                            </form>
                            
                            <div class="text-center mt-4">
                                <small class="text-muted">
                                    <i class="fas fa-info-circle me-1"></i>
                                    Sử dụng mã nhân viên và mật khẩu để đăng nhập
                                </small>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Thêm modal vào body nếu chưa có
        if (!document.getElementById('loginPopupModal')) {
            document.body.insertAdjacentHTML('beforeend', modalHTML);
        }
        
        // Thêm CSS styles
        this.addStyles();
        
        // Khởi tạo Bootstrap modal
        this.modal = new bootstrap.Modal(document.getElementById('loginPopupModal'));
    }
    
    addStyles() {
        if (document.getElementById('loginPopupStyles')) return;
        
        const styles = `
            <style id="loginPopupStyles">
                .login-popup-modal .modal-content {
                    border: none;
                    border-radius: 15px;
                    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
                }
                
                .login-popup-modal .modal-header {
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    border-radius: 15px 15px 0 0;
                    border: none;
                    padding: 30px;
                    text-align: center;
                }
                
                .login-popup-modal .modal-header .btn-close {
                    filter: invert(1);
                    opacity: 0.8;
                }
                
                .login-popup-modal .modal-header h5 {
                    margin: 0;
                    font-weight: 600;
                }
                
                .login-popup-modal .modal-header p {
                    margin: 10px 0 0 0;
                    opacity: 0.9;
                }
                
                .login-popup-modal .modal-body {
                    padding: 40px;
                }
                
                .login-popup-modal .form-floating {
                    margin-bottom: 20px;
                }
                
                .login-popup-modal .form-control {
                    border: 2px solid #e9ecef;
                    border-radius: 10px;
                    padding: 12px 15px;
                    transition: all 0.3s ease;
                }
                
                .login-popup-modal .form-control:focus {
                    border-color: #667eea;
                    box-shadow: 0 0 0 0.2rem rgba(102, 126, 234, 0.25);
                }
                
                .login-popup-modal .btn-login {
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    border: none;
                    border-radius: 10px;
                    padding: 12px;
                    font-weight: 600;
                    width: 100%;
                    transition: all 0.3s ease;
                }
                
                .login-popup-modal .btn-login:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
                }
                
                .login-popup-modal .form-check-input:checked {
                    background-color: #667eea;
                    border-color: #667eea;
                }
                
                .login-popup-modal .alert {
                    border-radius: 10px;
                    border: none;
                }
                
                .login-popup-modal .loading {
                    display: none;
                }
                
                .login-popup-modal .spinner-border-sm {
                    width: 1rem;
                    height: 1rem;
                }
            </style>
        `;
        
        document.head.insertAdjacentHTML('beforeend', styles);
    }
    
    bindEvents() {
        const form = document.getElementById('loginPopupForm');
        if (!form) return;
        
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            await this.handleLogin();
        });
        
        // Enter key to submit
        document.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && document.getElementById('loginPopupModal').classList.contains('show')) {
                form.dispatchEvent(new Event('submit'));
            }
        });
        
        // Auto focus username field when modal shows
        document.getElementById('loginPopupModal').addEventListener('shown.bs.modal', () => {
            document.getElementById('loginUsername').focus();
        });
    }
    
    async handleLogin() {
        const username = document.getElementById('loginUsername').value.trim();
        const password = document.getElementById('loginPassword').value;
        const rememberMe = document.getElementById('loginRememberMe').checked;
        
        if (!username || !password) {
            this.showAlert('Vui lòng nhập đầy đủ thông tin đăng nhập');
            return;
        }
        
        this.setLoading(true);
        
        try {
            const response = await fetch(`${this.options.apiUrl}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password, rememberMe })
            });
            
            const data = await response.json();
            
            if (response.ok) {
                // Login thành công
                localStorage.setItem('user_session', JSON.stringify(data));
                
                this.showAlert('Đăng nhập thành công!', 'success');
                
                // Gọi callback nếu có
                if (this.options.onLoginSuccess) {
                    this.options.onLoginSuccess(data);
                }
                
                // Đóng modal sau 1 giây
                setTimeout(() => {
                    this.hide();
                }, 1000);
            } else {
                // Login thất bại
                this.showAlert(data.error || 'Đăng nhập thất bại!');
                
                if (this.options.onLoginError) {
                    this.options.onLoginError(data.error);
                }
            }
        } catch (error) {
            console.error('Login error:', error);
            this.showAlert('Lỗi kết nối! Vui lòng thử lại.');
            
            if (this.options.onLoginError) {
                this.options.onLoginError('Lỗi kết nối!');
            }
        } finally {
            this.setLoading(false);
        }
    }
    
    showAlert(message, type = 'danger') {
        const alertDiv = document.getElementById('loginAlertMessage');
        if (!alertDiv) return;
        
        alertDiv.innerHTML = `
            <div class="alert alert-${type} alert-dismissible fade show" role="alert">
                <i class="fas fa-${type === 'danger' ? 'exclamation-triangle' : 'check-circle'} me-2"></i>
                ${message}
                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
            </div>
        `;
    }
    
    setLoading(loading) {
        const btn = document.getElementById('loginPopupBtn');
        if (!btn) return;
        
        const loadingSpan = btn.querySelector('.loading');
        const normalSpan = btn.querySelector('.normal');
        
        if (loading) {
            loadingSpan.style.display = 'inline';
            normalSpan.style.display = 'none';
            btn.disabled = true;
        } else {
            loadingSpan.style.display = 'none';
            normalSpan.style.display = 'inline';
            btn.disabled = false;
        }
    }
    
    show() {
        if (this.modal) {
            this.modal.show();
        }
    }
    
    hide() {
        if (this.modal) {
            this.modal.hide();
        }
    }
    
    destroy() {
        if (this.modal) {
            this.modal.dispose();
        }
        
        const modalElement = document.getElementById('loginPopupModal');
        if (modalElement) {
            modalElement.remove();
        }
        
        const stylesElement = document.getElementById('loginPopupStyles');
        if (stylesElement) {
            stylesElement.remove();
        }
        
        this.isInitialized = false;
    }
}

// Global function để dễ sử dụng
window.showLoginPopup = function(options = {}) {
    const loginPopup = new LoginPopup(options);
    loginPopup.show();
    return loginPopup;
};

// Export cho module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = LoginPopup;
}
