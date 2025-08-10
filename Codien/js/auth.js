// Auth Manager - Quản lý authentication cho hệ thống
class AuthManager {
    constructor() {
        this.session = this.getSession();
        this.API_BASE_URL = 'https://api.autoslp.com/api';
    }
    
    // Lấy session từ localStorage
    getSession() {
        const sessionStr = localStorage.getItem('user_session');
        if (!sessionStr) return null;
        
        try {
            const session = JSON.parse(sessionStr);
            const now = new Date();
            const expiresAt = new Date(session.expires_at);
            
            if (now > expiresAt) {
                localStorage.removeItem('user_session');
                this.session = null;
                return null;
            }
            
            return session;
        } catch (error) {
            console.error('Error parsing session:', error);
            localStorage.removeItem('user_session');
            this.session = null;
            return null;
        }
    }
    
    // Kiểm tra đã đăng nhập chưa
    isLoggedIn() {
        return !!this.session;
    }
    
    // Lấy thông tin user hiện tại
    getUser() {
        return this.session;
    }
    
    // Refresh session từ localStorage
    refreshSession() {
        this.session = this.getSession();
        return this.session;
    }
    
    // Kiểm tra role
    hasRole(role) {
        return this.session?.role === role;
    }
    
    // Kiểm tra có phải admin không
    isAdmin() {
        return this.hasRole('Quản lý') || this.session?.username === 'SL04205';
    }
    
    // Kiểm tra có phải manager không
    isManager() {
        return this.hasRole('Quản lý') || this.isAdmin();
    }
    
    // Kiểm tra auth và hiển thị force login nếu cần
    checkAuthAndShowLogin() {
        if (!this.isLoggedIn()) {
            if (window.showForceLoginPopup) {
                window.showForceLoginPopup();
            } else if (window.showLoginPopup) {
                window.showLoginPopup();
            }
            return false;
        }
        return true;
    }
    
    // Force login check - không cho phép tắt popup
    forceLoginCheck() {
        if (!this.isLoggedIn()) {
            if (window.showForceLoginPopup) {
                const forceLoginPopup = window.showForceLoginPopup({
                    onLoginSuccess: (data) => {
                        // Refresh session sau khi đăng nhập thành công
                        this.refreshSession();
                        console.log('Force login successful:', data);
                        
                        // Gọi callback nếu có
                        if (window.onAuthSuccess) {
                            window.onAuthSuccess(data);
                        }
                    },
                    onLoginError: (error) => {
                        console.error('Force login failed:', error);
                        
                        // Gọi callback nếu có
                        if (window.onAuthError) {
                            window.onAuthError(error);
                        }
                    }
                });
                return false;
            }
        }
        return true;
    }
    
    // Tạo force login popup với custom options
    createForceLoginPopup(options = {}) {
        if (window.showForceLoginPopup) {
            return window.showForceLoginPopup({
                onLoginSuccess: (data) => {
                    this.refreshSession();
                    if (options.onLoginSuccess) {
                        options.onLoginSuccess(data);
                    }
                },
                onLoginError: (error) => {
                    if (options.onLoginError) {
                        options.onLoginError(error);
                    }
                },
                ...options
            });
        }
        return null;
    }
    
    // Đăng xuất
    logout() {
        localStorage.removeItem('user_session');
        this.session = null;
        
        // Gọi custom logout handler nếu có
        if (window.handleLogout) {
            window.handleLogout();
        } else {
            // Fallback: hiển thị force login popup
            if (window.showForceLoginPopup) {
                window.showForceLoginPopup();
            } else if (window.showLoginPopup) {
                window.showLoginPopup();
            }
        }
    }
}

// Khởi tạo Auth Manager
const auth = new AuthManager();

// Tự động kiểm tra auth khi load trang
document.addEventListener('DOMContentLoaded', function() {
    // Chỉ kiểm tra nếu chưa có LoginPopup nào được khởi tạo
    if (!auth.isLoggedIn() && !window.loginPopupInstance) {
        auth.forceLoginCheck();
    }
});

// Export cho sử dụng global
window.auth = auth;
