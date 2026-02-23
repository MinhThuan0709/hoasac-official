const fs = require('fs');

// Inject CSS
let style = fs.readFileSync('style.css', 'utf8');
if (!style.includes('.trend-popup')) {
    style += `\n/* ============================================
   TREND POPUP (BOTTOM RIGHT)
   ============================================ */
.trend-popup {
    position: fixed;
    bottom: 30px;
    right: 30px;
    width: 290px;
    background: #fff;
    border-radius: 12px;
    box-shadow: 0 10px 40px rgba(0,0,0,0.08);
    z-index: 1000;
    padding: 15px;
    transform: translateY(30px) scale(0.95);
    opacity: 0;
    pointer-events: none;
    transition: transform 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275), opacity 0.6s ease;
    border: 1px solid #f0f0f0;
}

.trend-popup.show {
    transform: translateY(0) scale(1);
    opacity: 1;
    pointer-events: auto;
}

.trend-popup-close {
    position: absolute;
    top: 8px;
    right: 12px;
    font-size: 1.2rem;
    color: #999;
    cursor: pointer;
    line-height: 1;
    transition: color 0.3s;
}

.trend-popup-close:hover {
    color: #1a1a1a;
}

.trend-popup-content {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 12px;
    margin-top: 5px;
}

.trend-popup-content img {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    object-fit: cover;
}

.trend-popup-text strong {
    font-family: 'Poppins', sans-serif;
    font-size: 0.85rem;
    color: #1a1a1a;
    display: block;
    margin-bottom: 3px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

.trend-popup-text p {
    font-family: 'Poppins', sans-serif;
    font-size: 0.75rem;
    color: #666;
    margin: 0;
    line-height: 1.3;
}

.trend-popup-link {
    display: block;
    text-align: center;
    font-family: 'Poppins', sans-serif;
    font-size: 0.75rem;
    font-weight: 600;
    color: #1a1a1a;
    text-decoration: none;
    text-transform: uppercase;
    letter-spacing: 1px;
    padding-top: 10px;
    border-top: 1px solid #f0f0f0;
    transition: color 0.3s;
}

.trend-popup-link:hover {
    color: #777;
}

@media (max-width: 768px) {
    .trend-popup {
        bottom: 20px;
        right: 20px;
        left: 20px;
        width: auto;
    }
}
`;
    fs.writeFileSync('style.css', style);
    console.log("Appended CSS to style.css");
} else {
    console.log("CSS already exists.");
}

// Inject JS
let mainJS = fs.readFileSync('main.js', 'utf8');
const searchReg = /\}\);\s*\/\* =========================================\s*GLOBAL DATA HANDLER/;
if (!mainJS.includes('14. TREND POPUP')) {
    mainJS = mainJS.replace(searchReg, `
    /* --- 14. TREND POPUP (FASHION SUGGESTION) --- */
    const popupClosed = sessionStorage.getItem('hoa_sac_trend_closed');
    if (!popupClosed) {
        // Mảng gợi ý thời trang
        const ideas = [
            { img: 'assets/images/lookbook/look-01.jpg', title: 'Xu Hướng Mới', desc: 'Thử phối Monochrome để tôn vinh sự tối giản.' },
            { img: 'assets/images/lookbook/look-02.jpg', title: 'Must Have', desc: 'Chất liệu lụa mỏng nhẹ cho lối sống thanh lịch.' },
            { img: 'assets/images/lookbook/look-03.jpg', title: 'Bespoke', desc: 'Trang phục may đo riêng biệt cho thời đại mới.' },
            { img: 'assets/images/editorial/editorial-1.jpg', title: 'Phối Đồ', desc: 'Kết hợp Layering tĩnh lặng nhưng sắc sảo.' }
        ];
        const randomIdea = ideas[Math.floor(Math.random() * ideas.length)];

        // Tạo Popup
        const popup = document.createElement('div');
        popup.className = 'trend-popup';
        popup.innerHTML = \`
            <div class="trend-popup-close" title="Đóng">&times;</div>
            <div class="trend-popup-content">
                <img src="\${randomIdea.img}" alt="Trend">
                <div class="trend-popup-text">
                    <strong>\${randomIdea.title}</strong>
                    <p>\${randomIdea.desc}</p>
                </div>
            </div>
            <a href="collections.html" class="trend-popup-link" data-vi="Khám phá ngay" data-en="Discover Now">Khám phá ngay</a>
        \`;

        document.body.appendChild(popup);

        // Hiệu ứng vào (delay 5s)
        setTimeout(() => {
            popup.classList.add('show');
        }, 5000);

        // Xử lý đóng
        popup.querySelector('.trend-popup-close').addEventListener('click', () => {
            popup.classList.remove('show');
            sessionStorage.setItem('hoa_sac_trend_closed', 'true'); // Chỉ đóng trong phiên này
        });
    }
});
/* =========================================
   GLOBAL DATA HANDLER`);
    fs.writeFileSync('main.js', mainJS);
    console.log("Appended JS logic to main.js");
} else {
    console.log("JS Logic already exists.");
}
