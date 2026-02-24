/* =========================================
   js/lang.js — VI / EN Language Toggle
   Dùng chung cho tất cả các trang.
   ========================================= */

(function initLang() {
    const langToggle = document.getElementById('lang-toggle');
    let currentLang = localStorage.getItem('hoasac_lang') || 'vi';

    function applyLanguage(lang) {
        currentLang = lang;
        localStorage.setItem('hoasac_lang', lang);

        const activeUserStr = sessionStorage.getItem('hoa_sac_active_user');

        document.querySelectorAll('[data-vi][data-en]').forEach(el => {
            // Không ghi đè nút Account nếu đã đăng nhập
            if (activeUserStr && el.classList.contains('account-btn')) return;
            el.innerHTML = lang === 'en' ? el.dataset.en : el.dataset.vi;
        });

        // Highlight active lang button
        if (langToggle) {
            langToggle.querySelectorAll('.lang-opt').forEach(opt => {
                opt.classList.toggle('active', opt.dataset.lang === lang);
            });
        }

        // Update html lang attribute
        document.documentElement.lang = lang === 'en' ? 'en' : 'vi';
    }

    if (langToggle) {
        langToggle.querySelectorAll('.lang-opt').forEach(opt => {
            opt.addEventListener('click', () => applyLanguage(opt.dataset.lang));
        });
    }

    // Apply saved language on load
    applyLanguage(currentLang);

    // Expose for other scripts
    window.applyLanguage = applyLanguage;
})();
