/**
 * =================================================================
 * SIDEBAR GENERATOR - TẠO SIDEBAR MENU ĐỘNG
 * =================================================================
 * Tạo sidebar menu bên trái có thể tái sử dụng cho tất cả các trang
 * Reusable left sidebar menu generator for all pages
 */

class SidebarGenerator {
    constructor() {
        this.menuItems = [
            {
                href: 'dashboard.html',
                icon: 'bi-house',
                text: 'Trang chủ',
                active: false
            },
            {
                href: 'production-orders.html',
                icon: 'bi-clipboard-data',
                text: 'Lệnh sản xuất',
                active: false
            },
            {
                href: 'progress.html',
                icon: 'bi-lightning',
                text: 'Quản lý tiến độ',
                active: false
            },
            {
                href: 'materials.html',
                icon: 'bi-box-seam',
                text: 'Vật tư',
                active: false
            },
            {
                href: 'workflow.html',
                icon: 'bi-arrow-repeat',
                text: 'Công đoạn',
                active: false
            },
            {
                href: 'reports.html',
                icon: 'bi-graph-up',
                text: 'Báo cáo',
                active: false
            },
            {
                href: 'xa-stage.html',
                icon: 'bi-bullseye',
                text: 'Công đoạn XẢ',
                active: false
            },
            {
                href: 'xen-stage.html',
                icon: 'bi-scissors',
                text: 'Công đoạn XÉN',
                active: false
            },
            {
                href: 'in-stage.html',
                icon: 'bi-printer',
                text: 'Công đoạn IN',
                active: false
            },
            {
                href: 'boi-stage.html',
                icon: 'bi-file-text',
                text: 'Công đoạn BỒI',
                active: false
            },
            {
                href: 'be-stage.html',
                icon: 'bi-knife',
                text: 'Công đoạn BẾ',
                active: false
            },
            {
                href: 'dan-stage.html',
                icon: 'bi-link',
                text: 'Công đoạn DÁN',
                active: false
            },
            {
                href: 'kho-stage.html',
                icon: 'bi-building',
                text: 'KHO THÀNH PHẨM',
                active: false
            }
        ];
    }

    /**
     * Tạo sidebar HTML
     */
    generateSidebar() {
        // Xác định trang hiện tại để đánh dấu active
        this.setActivePage();
        
        const sidebarHTML = `
            <div class="sidebar collapsed" id="sidebar">
                <div class="sidebar-content">
                    <div class="sidebar-header">
                        <div class="sidebar-brand">
                            <div class="bg-primary text-white rounded d-flex align-items-center justify-content-center" style="width:32px;height:32px;">
                                <i class="bi bi-box"></i>
                            </div>
                            <h5 class="mb-0 text-primary">Carton Manager</h5>
                        </div>
                        <button class="btn btn-primary sidebar-toggle" onclick="toggleSidebar()" id="toggleBtn" title="Thu nhỏ/Mở rộng">
                            <span id="toggleIcon"><i class="bi bi-chevron-right"></i></span>
                        </button>
                    </div>
                    
                    <nav class="sidebar-nav">
                        ${this.generateMenuItems()}
                    </nav>
                    
                    <div class="sidebar-footer">
                        © 2025 Carton Manager
                    </div>
                </div>
            </div>
        `;
        
        return sidebarHTML;
    }

    /**
     * Tạo các menu items
     */
    generateMenuItems() {
        return this.menuItems.map(item => `
            <a href="${item.href}" class="nav-link ${item.active ? 'active' : ''}">
                <i class="bi ${item.icon}"></i>
                <span class="nav-text">${item.text}</span>
            </a>
        `).join('');
    }

    /**
     * Xác định trang hiện tại và đánh dấu active
     */
    setActivePage() {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        
        this.menuItems.forEach(item => {
            if (item.href === currentPage) {
                item.active = true;
            } else {
                item.active = false;
            }
        });
    }

    /**
     * Render sidebar vào container
     */
    render(containerId = 'sidebarContainer') {
        const container = document.getElementById(containerId);
        if (container) {
            container.innerHTML = this.generateSidebar();
        } else {
            console.error(`Container with id '${containerId}' not found`);
        }
    }

    /**
     * Render sidebar vào body (trước main content)
     */
    renderToBody() {
        const sidebarHTML = this.generateSidebar();
        const mainContent = document.querySelector('.main-content');
        
        if (mainContent) {
            mainContent.insertAdjacentHTML('beforebegin', sidebarHTML);
        } else {
            // Nếu không tìm thấy main-content, thêm vào đầu body
            document.body.insertAdjacentHTML('afterbegin', sidebarHTML);
        }
    }
}

/**
 * =================================================================
 * SIDEBAR TOGGLE FUNCTIONS - HÀM ĐIỀU KHIỂN SIDEBAR
 * =================================================================
 */

/**
 * Toggle sidebar (thu nhỏ/mở rộng)
 */
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const mainContent = document.getElementById('mainContent');
    const toggleIcon = document.getElementById('toggleIcon');

    if (sidebar.classList.contains('collapsed')) {
        // Mở rộng sidebar
        sidebar.classList.remove('collapsed');
        mainContent.classList.remove('sidebar-collapsed');
        toggleIcon.innerHTML = '<i class="bi bi-chevron-left"></i>';
    } else {
        // Thu nhỏ sidebar
        sidebar.classList.add('collapsed');
        mainContent.classList.add('sidebar-collapsed');
        toggleIcon.innerHTML = '<i class="bi bi-chevron-right"></i>';
    }
}

/**
 * =================================================================
 * UTILITY FUNCTIONS - HÀM TIỆN ÍCH
 * =================================================================
 */

/**
 * Khởi tạo sidebar tự động
 */
function initSidebar() {
    const sidebarGenerator = new SidebarGenerator();
    sidebarGenerator.renderToBody();
}

/**
 * Khởi tạo sidebar với container tùy chỉnh
 */
function initSidebarWithContainer(containerId) {
    const sidebarGenerator = new SidebarGenerator();
    sidebarGenerator.render(containerId);
}

// Export functions for global access
window.SidebarGenerator = SidebarGenerator;
window.toggleSidebar = toggleSidebar;
window.initSidebar = initSidebar;
window.initSidebarWithContainer = initSidebarWithContainer;

// Auto-initialize if DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSidebar);
} else {
    initSidebar();
} 