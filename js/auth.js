document.addEventListener('DOMContentLoaded', () => {

    const loginPanel = document.getElementById('login-panel');
    const registerPanel = document.getElementById('register-panel');
    const toggleReg = document.getElementById('toggle-register');
    const toggleLog = document.getElementById('toggle-login');

    const authImg = document.getElementById('auth-img');
    const authQuote = document.getElementById('auth-quote');
    const authAuthor = document.getElementById('auth-author');

    // HIỆU ỨNG CHUYỂN TRANG LOGIN/REGISTER
    toggleReg.addEventListener('click', () => {
        loginPanel.classList.add('hidden');
        setTimeout(() => registerPanel.classList.remove('hidden'), 300);

        // Đổi hình ảnh Cinematic nghệ thuật bên trái
        authImg.style.opacity = '0';
        authImg.style.transform = 'scale(1.05)';
        setTimeout(() => {
            authImg.src = 'https://images.pexels.com/photos/1926769/pexels-photo-1926769.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1';
            authQuote.textContent = '"Để không ai có thể thay thế, bạn phải luôn luôn khác biệt."';
            authAuthor.textContent = 'Coco Chanel';
            authImg.style.opacity = '0.85';
            authImg.style.transform = 'scale(1)';
        }, 500);
    });

    toggleLog.addEventListener('click', () => {
        registerPanel.classList.add('hidden');
        setTimeout(() => loginPanel.classList.remove('hidden'), 300);

        // Trả hình ảnh Cinematic cũ
        authImg.style.opacity = '0';
        authImg.style.transform = 'scale(1.05)';
        setTimeout(() => {
            authImg.src = 'assets/images/editorial/editorial-main.jpg';
            authQuote.textContent = '"Thời trang là kiến trúc: vấn đề nằm ở tỷ lệ."';
            authAuthor.textContent = 'Coco Chanel';
            authImg.style.opacity = '0.85';
            authImg.style.transform = 'scale(1)';
        }, 500);
    });

    // --- HỆ THỐNG XÁC THỰC GIẢ LẬP (LOCALSTORAGE LOCAL DATABASE) ---

    // Hàm tạo Admin mặc định nếu chưa tồn tại
    const initDefaultAdmin = () => {
        let users = JSON.parse(localStorage.getItem('hoa_sac_users')) || [];
        const adminExists = users.find(u => u.username === 'admin');
        if (!adminExists) {
            users.push({
                fullname: 'Trưởng Cửa Hàng',
                username: 'admin',
                password: '123', // Mật khẩu mẫu
                role: 'admin'
            });
            localStorage.setItem('hoa_sac_users', JSON.stringify(users));
        }
    }
    initDefaultAdmin();

    // 1. ĐĂNG KÝ HỘI VIÊN MỚI
    const btnRegister = document.getElementById('btn-register');
    const regError = document.getElementById('reg-error');

    btnRegister.addEventListener('click', () => {
        const name = document.getElementById('reg-name').value.trim();
        const user = document.getElementById('reg-email').value.trim();
        const pass = document.getElementById('reg-pass').value.trim();

        if (!name || !user || !pass) {
            regError.textContent = 'Vui lòng điền đầy đủ thông tin.';
            regError.style.display = 'block';
            return;
        }

        let users = JSON.parse(localStorage.getItem('hoa_sac_users')) || [];

        // Kiểm tra trùng lặp User
        if (users.find(u => u.username === user)) {
            regError.textContent = 'Tên đăng nhập này đã tồn tại!';
            regError.style.display = 'block';
            return;
        }

        users.push({
            fullname: name,
            username: user,
            password: pass,
            role: 'customer' // Mặc định tất cả người đăng ký mới là Khách
        });

        localStorage.setItem('hoa_sac_users', JSON.stringify(users));
        regError.style.color = '#5cb85c';
        regError.textContent = 'Gia nhập thành công! Đang chuyển hướng...';
        regError.style.display = 'block';

        // Tự động chuyển qua tab Đăng nhập
        setTimeout(() => { toggleLog.click(); regError.style.display = 'none'; }, 1500);
    });

    // 2. ĐĂNG NHẬP VÀ PHÂN QUYỀN
    const btnLogin = document.getElementById('btn-login');
    const logError = document.getElementById('login-error');

    btnLogin.addEventListener('click', () => {
        const user = document.getElementById('login-email').value.trim();
        const pass = document.getElementById('login-pass').value.trim();

        if (!user || !pass) {
            logError.textContent = 'Vui lòng nhập Tên đăng nhập và Mật khẩu.';
            logError.style.display = 'block';
            return;
        }

        let users = JSON.parse(localStorage.getItem('hoa_sac_users')) || [];
        const foundUser = users.find(u => u.username === user && u.password === pass);

        if (foundUser) {
            // LƯU PHIÊN ĐĂNG NHẬP VÀO SESSION STORAGE (Đóng trình duyệt là Đăng xuất)
            sessionStorage.setItem('hoa_sac_active_user', JSON.stringify({
                fullname: foundUser.fullname,
                username: foundUser.username,
                role: foundUser.role
            }));

            logError.style.color = '#5cb85c';
            logError.textContent = 'Xác thực thành công. Đang kết nối...';
            logError.style.display = 'block';

            setTimeout(() => {
                if (foundUser.role === 'admin') {
                    window.location.href = 'admin.html'; // Chuyển trang Quản Trị
                } else {
                    window.location.href = 'index.html'; // Chuyến trang Khách truy cập
                }
            }, 800);
        } else {
            logError.style.color = '#d9534f';
            logError.textContent = 'Thông tin xác thực không chính xác.';
            logError.style.display = 'block';
        }
    });

});
