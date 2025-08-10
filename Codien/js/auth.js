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
    
    // Đăng xuất
    logout() {
        localStorage.removeItem('user_session');
        this.session = null;
        
        // Gọi custom logout handler nếu có
        if (window.handleLogout) {
            window.handleLogout();
        } else {
            // Fallback: hiển thị login popup
            if (window.showLoginPopup) {
                window.showLoginPopup();
            }
        }
    }
}

// Khởi tạo Auth Manager
const auth = new AuthManager();

// Export cho sử dụng global
window.auth = auth;
