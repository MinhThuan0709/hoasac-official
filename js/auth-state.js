/* =========================================
   js/auth-state.js — Auth Session UI
   Cập nhật header dựa trên trạng thái đăng nhập.
   Dùng chung cho tất cả các trang.
   ========================================= */

(function initAuthState() {
    const activeUserStr = sessionStorage.getItem('hoa_sac_active_user');
    if (!activeUserStr) return;

    try {
        const activeUser = JSON.parse(activeUserStr);
        const displayName = activeUser.fullname
            ? activeUser.fullname.split(' ').pop()
            : activeUser.username || 'User';

        document.querySelectorAll('.account-btn').forEach(btn => {
            btn.innerHTML = `<span style="text-transform:none">Hi, ${displayName}</span> <span style="opacity:0.5;margin-left:3px;font-size:9px">(Tho&#225;t)</span>`;
            btn.href = '#';

            btn.addEventListener('click', e => {
                e.preventDefault();
                if (activeUser.role === 'admin') {
                    const goAdmin = confirm('PHIÊN BẢN QUẢN TRỊ VIÊN\n\n[OK] Chuyển tới Admin Dashboard.\n[Cancel] Để Đăng Xuất.');
                    if (goAdmin) {
                        window.location.href = 'admin.html';
                    } else {
                        sessionStorage.removeItem('hoa_sac_active_user');
                        window.location.reload();
                    }
                } else {
                    if (confirm('Bạn có chắc chắn muốn đăng xuất?')) {
                        sessionStorage.removeItem('hoa_sac_active_user');
                        window.location.reload();
                    }
                }
            });
        });
    } catch (e) {
        console.warn('[auth-state] Parse error:', e);
    }
})();
