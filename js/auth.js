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

    // ==========================================
    // FIREBASE AUTHENTICATION (REST API)
    // Mật khẩu được Google mã hoá & bảo vệ
    // ==========================================

    const FIREBASE_API_KEY = 'AIzaSyC68_VsWqCIfuAmdY7KpMzhcdWtlPJCpIQ';
    const FIREBASE_PROJECT = 'hoasac-web';
    const AUTH_SIGNUP_URL = `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${FIREBASE_API_KEY}`;
    const AUTH_LOGIN_URL = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${FIREBASE_API_KEY}`;
    const FIRESTORE_URL = `https://firestore.googleapis.com/v1/projects/${FIREBASE_PROJECT}/databases/(default)/documents`;

    // Hàm dịch lỗi Firebase sang tiếng Việt
    function translateError(code) {
        const errors = {
            'EMAIL_EXISTS': 'Email này đã được đăng ký trước đó.',
            'INVALID_EMAIL': 'Địa chỉ email không hợp lệ.',
            'WEAK_PASSWORD': 'Mật khẩu phải có ít nhất 6 ký tự.',
            'WEAK_PASSWORD : Password should be at least 6 characters': 'Mật khẩu phải có ít nhất 6 ký tự.',
            'EMAIL_NOT_FOUND': 'Email này chưa được đăng ký.',
            'INVALID_PASSWORD': 'Mật khẩu không chính xác.',
            'INVALID_LOGIN_CREDENTIALS': 'Email hoặc mật khẩu không đúng.',
            'USER_DISABLED': 'Tài khoản này đã bị vô hiệu hóa.',
            'TOO_MANY_ATTEMPTS_TRY_LATER': 'Quá nhiều lần thử. Vui lòng đợi và thử lại sau.',
            'OPERATION_NOT_ALLOWED': 'Phương thức đăng nhập Email chưa được bật. Hãy vào Firebase Console > Authentication > Sign-in method > Bật Email/Password.'
        };
        console.error('Firebase Auth Error Code:', code);
        return errors[code] || `Lỗi: ${code}`;
    }

    // 1. ĐĂNG KÝ HỘI VIÊN MỚI (Firebase Auth + Firestore Profile)
    const btnRegister = document.getElementById('btn-register');
    const regError = document.getElementById('reg-error');

    btnRegister.addEventListener('click', async () => {
        const name = document.getElementById('reg-name').value.trim();
        const email = document.getElementById('reg-email').value.trim();
        const pass = document.getElementById('reg-pass').value.trim();

        if (!name || !email || !pass) {
            regError.textContent = 'Vui lòng điền đầy đủ thông tin.';
            regError.style.color = '#d9534f';
            regError.style.display = 'block';
            return;
        }

        if (pass.length < 6) {
            regError.textContent = 'Mật khẩu phải có ít nhất 6 ký tự.';
            regError.style.color = '#d9534f';
            regError.style.display = 'block';
            return;
        }

        btnRegister.disabled = true;
        btnRegister.textContent = 'Đang tạo tài khoản...';

        try {
            // Bước 1: Tạo tài khoản trên Firebase Authentication
            const authRes = await fetch(AUTH_SIGNUP_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: email,
                    password: pass,
                    returnSecureToken: true
                })
            });

            const authData = await authRes.json();

            if (!authRes.ok) {
                throw new Error(authData.error?.message || 'UNKNOWN_ERROR');
            }

            // Bước 2: Lưu hồ sơ người dùng lên Firestore (KHÔNG lưu mật khẩu)
            await fetch(`${FIRESTORE_URL}/users`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authData.idToken}`
                },
                body: JSON.stringify({
                    fields: {
                        uid: { stringValue: authData.localId },
                        fullname: { stringValue: name },
                        email: { stringValue: email },
                        role: { stringValue: 'customer' },
                        createdAt: { stringValue: new Date().toISOString() }
                    }
                })
            });

            console.log('Tài khoản Firebase đã tạo:', authData.localId);

            regError.style.color = '#5cb85c';
            regError.textContent = 'Gia nhập thành công! Đang chuyển hướng...';
            regError.style.display = 'block';

            setTimeout(() => {
                btnRegister.disabled = false;
                btnRegister.textContent = 'Gia Nhập';
                toggleLog.click();
                regError.style.display = 'none';
            }, 1500);

        } catch (err) {
            regError.style.color = '#d9534f';
            regError.textContent = translateError(err.message);
            regError.style.display = 'block';
            btnRegister.disabled = false;
            btnRegister.textContent = 'Gia Nhập';
        }
    });

    // 2. ĐĂNG NHẬP VÀ PHÂN QUYỀN
    const btnLogin = document.getElementById('btn-login');
    const logError = document.getElementById('login-error');

    btnLogin.addEventListener('click', async () => {
        const email = document.getElementById('login-email').value.trim();
        const pass = document.getElementById('login-pass').value.trim();

        if (!email || !pass) {
            logError.textContent = 'Vui lòng nhập Email và Mật khẩu.';
            logError.style.color = '#d9534f';
            logError.style.display = 'block';
            return;
        }

        btnLogin.disabled = true;
        btnLogin.textContent = 'Đang xác thực...';

        try {
            // Bước 1: Đăng nhập Firebase Authentication
            const authRes = await fetch(AUTH_LOGIN_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: email,
                    password: pass,
                    returnSecureToken: true
                })
            });

            const authData = await authRes.json();

            if (!authRes.ok) {
                throw new Error(authData.error?.message || 'UNKNOWN_ERROR');
            }

            // Bước 2: Tìm hồ sơ trên Firestore để lấy role + fullname
            let role = 'customer';
            let fullname = authData.email.split('@')[0]; // Fallback tên

            try {
                const queryRes = await fetch(`${FIRESTORE_URL}:runQuery`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${authData.idToken}`
                    },
                    body: JSON.stringify({
                        structuredQuery: {
                            from: [{ collectionId: 'users' }],
                            where: {
                                fieldFilter: {
                                    field: { fieldPath: 'uid' },
                                    op: 'EQUAL',
                                    value: { stringValue: authData.localId }
                                }
                            },
                            limit: 1
                        }
                    })
                });
                const queryData = await queryRes.json();

                if (queryData[0]?.document?.fields) {
                    const fields = queryData[0].document.fields;
                    role = fields.role?.stringValue || 'customer';
                    fullname = fields.fullname?.stringValue || fullname;
                }
            } catch (profileErr) {
                console.warn('Không tải được hồ sơ, dùng giá trị mặc định:', profileErr);
            }

            // Bước 3: Lưu phiên đăng nhập vào SessionStorage
            sessionStorage.setItem('hoa_sac_active_user', JSON.stringify({
                fullname: fullname,
                username: authData.email,
                role: role,
                uid: authData.localId,
                token: authData.idToken
            }));

            logError.style.color = '#5cb85c';
            logError.textContent = 'Xác thực thành công. Đang kết nối...';
            logError.style.display = 'block';

            setTimeout(() => {
                if (role === 'admin') {
                    window.location.href = 'admin.html';
                } else {
                    window.location.href = 'index.html';
                }
            }, 800);

        } catch (err) {
            logError.style.color = '#d9534f';
            logError.textContent = translateError(err.message);
            logError.style.display = 'block';
            btnLogin.disabled = false;
            btnLogin.textContent = 'Vào Trong';
        }
    });

});
