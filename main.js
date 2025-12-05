/* =========================================
   FILE: main.js - FULL RESTORED VERSION
   ========================================= */

document.addEventListener('DOMContentLoaded', () => {

    /* --- 0. PRELOADER LOGIC --- */
    const preloader = document.querySelector('.preloader');
    
    // Khóa cuộn trang ngay lập tức khi mới vào
    document.body.style.overflow = 'hidden';

    // Sự kiện: Khi toàn bộ hình ảnh, font chữ đã tải xong
    window.addEventListener('load', () => {
        // Đợi thêm 1.5 giây để người xem kịp ngắm Logo (tạo cảm giác thư thái)
        setTimeout(() => {
            if(preloader) {
                preloader.classList.add('hide-loader'); // Kích hoạt CSS trượt lên
                
                // Mở khóa cuộn lại bình thường
                document.body.style.overflow = ''; 
            }
        }, 1500); // 1500ms = 1.5 giây
    });

    /* --- 1. KÍCH HOẠT SMOOTH SCROLL (LENIS - CẤU HÌNH LUXURY) --- */
    // Chỉ chạy trên máy tính
    if (window.innerWidth > 1024) {
        const lenis = new Lenis({
            duration: 2.0, // Tăng từ 1.2 lên 2.0 -> Cuộn đầm hơn, nặng hơn
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), 
            smooth: true,
            mouseMultiplier: 0.8, // Giảm độ nhạy chuột một chút để người dùng phải cuộn nhiều hơn -> xem kỹ hơn
            smoothTouch: false // Mobile để tự nhiên
        });

        function raf(time) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);

        /* --- PARALLAX EFFECT (HIỆU ỨNG TRÔI ẢNH) --- */
        const parallaxImages = document.querySelectorAll('.look-image img, .cat-img img, .editorial-image img');
        
        window.addEventListener('scroll', () => {
             const scrollY = window.scrollY;
             parallaxImages.forEach(img => {
                 const parent = img.parentElement;
                 const parentTop = parent.offsetTop;
                 const parentHeight = parent.offsetHeight;
                 
                 // Nếu ảnh nằm trong viewport
                 if (scrollY + window.innerHeight > parentTop && scrollY < parentTop + parentHeight) {
                     const distance = scrollY - parentTop;
                     const translateY = distance * 0.1; // Di chuyển 10% tốc độ cuộn
                     
                     if(img.closest('.editorial-image')) {
                         img.style.transform = `translateY(${translateY}px)`;
                     }
                 }
             });
        });
    }

    /* --- 2. HEADER & MENU LOGIC --- */
    const hamburger = document.querySelector('.hamburger-menu');
    const navMenu = document.querySelector('.main-nav');
    const header = document.querySelector('.site-header');

    // Xử lý Hamburger Menu
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        }));
    }

    // Hiệu ứng đổi màu Header khi cuộn
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }

    /* --- 3. ANIMATION SCROLL OBSERVER --- */
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show-item');
            }
        });
    });

    const hiddenElements = document.querySelectorAll('.hidden-item');
    if (hiddenElements.length > 0) {
        hiddenElements.forEach((el) => observer.observe(el));
    }

    /* --- 4. CUSTOM CURSOR --- */
    const cursor = document.querySelector('.custom-cursor');
    if (cursor && window.innerWidth > 1024) {
        // Di chuyển
        document.addEventListener('mousemove', (e) => {
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';
        });

        // Hiệu ứng Hover
        const hoverTargets = document.querySelectorAll('a, button, .hamburger-menu, .product-card, .view-more, .quick-add');
        
        hoverTargets.forEach(link => {
            link.addEventListener('mouseenter', () => {
                cursor.classList.add('hovered');
            });
            link.addEventListener('mouseleave', () => {
                cursor.classList.remove('hovered');
            });
        });

        // Hiệu ứng Click
        document.addEventListener('mousedown', () => {
            cursor.style.transform = "translate(-50%, -50%) scale(0.8)";
        });

        document.addEventListener('mouseup', () => {
            cursor.style.transform = "translate(-50%, -50%) scale(1)";
        });
    }

    /* --- 5. HORIZONTAL SCROLL (RUNWAY & THEME SWITCHER) --- */
    const stickySection = document.querySelector('.scroll-container');
    const track = document.querySelector('.horizontal-track');

    // Chỉ chạy logic này nếu đang ở trang Collections và trên máy tính
    if (stickySection && track && window.innerWidth > 768) {
        let lastScrollTop = 0;
        let isScrolling;
        const body = document.body; 
        let ticking = false;

        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    updateRunway();
                    ticking = false;
                });
                ticking = true;
            }
        });

        function updateRunway() {
            // Tính toán tiến độ
            const scrollDistance = stickySection.offsetHeight - window.innerHeight;
            const scrollTop = window.scrollY - stickySection.offsetTop;
            
            let percentage = scrollTop / scrollDistance;
            percentage = Math.max(0, Math.min(percentage, 1));

            // Cập nhật thanh tiến độ
            const progressBar = document.querySelector('.nav-timeline::after'); // Cập nhật cho thanh mới
            if(progressBar) {
                progressBar.style.width = `${percentage * 100}%`;
            }

            // Di chuyển Track
            const trackWidth = track.scrollWidth - window.innerWidth;
            track.style.transform = `translate3d(-${percentage * trackWidth}px, 0, 0)`;

            // --- NEW CHAMELEON EFFECT (CENTER-BASED DETECTION) ---
            const centerLine = window.innerWidth / 2;
            const items = document.querySelectorAll('.runway-item');
            let activeTheme = 'light'; // Mặc định

            items.forEach(item => {
                const rect = item.getBoundingClientRect();
                if (rect.left < centerLine && rect.right > centerLine) {
                    activeTheme = item.getAttribute('data-theme') || 'light';
                }
            });

            // Áp dụng Theme
            body.classList.remove('dark-mode', 'grey-mode');
            if (activeTheme === 'dark') {
                body.classList.add('dark-mode');
            } else if (activeTheme === 'grey') {
                body.classList.add('grey-mode');
            }
            
            // Skew Effect
            let currentScroll = window.scrollY;
            let speed = currentScroll - (lastScrollTop || 0);
            lastScrollTop = currentScroll;

            let skew = speed * 0.08; 
            skew = Math.min(Math.max(skew, -5), 5);

            const allImages = document.querySelectorAll('.runway-img img, .runway-img video');
            allImages.forEach(img => {
                img.style.transform = `skewX(${skew}deg) scale(1.1)`; 
                img.style.transition = 'transform 0.8s cubic-bezier(0.22, 1, 0.36, 1)';
            });
            
            clearTimeout(isScrolling);
            isScrolling = setTimeout(() => {
                allImages.forEach(img => {
                     img.style.transform = `skewX(0deg) scale(1)`; 
                     img.style.transition = 'transform 0.5s ease';
                });
            }, 100);

            // Magnetic Navigation Logic
            const navItems = document.querySelectorAll('.nav-item');
            if (navItems.length > 0) {
                let activeIndex = Math.round(percentage * (navItems.length - 1));
                activeIndex = Math.max(0, Math.min(activeIndex, navItems.length - 1));
                
                navItems.forEach((nav, idx) => {
                    if (idx === activeIndex) nav.classList.add('active');
                    else nav.classList.remove('active');
                });
            }
        }

        // Click Navigation
        const navItems = document.querySelectorAll('.nav-item');
        navItems.forEach((nav, index) => {
            nav.addEventListener('click', () => {
                const targetPercent = index / (navItems.length - 1);
                const offsetTop = stickySection.parentElement.offsetTop;
                const scrollDistance = stickySection.offsetHeight - window.innerHeight;
                const targetScrollY = offsetTop + (targetPercent * scrollDistance);
                
                window.scrollTo({
                    top: targetScrollY,
                    behavior: 'smooth'
                });
            });
        });
    }

    /* --- 6. SOUNDSCAPE CONTROLLER --- */
    const soundBtn = document.getElementById('sound-toggle');
    const audio = document.getElementById('bg-audio');
    const soundLabel = document.querySelector('.sound-label');

    if (soundBtn && audio) {
        audio.volume = 0.4;
        let isToggling = false;

        soundBtn.addEventListener('click', async () => {
            if (isToggling) return;
            isToggling = true; 

            try {
                if (audio.paused) {
                    await audio.play();
                    soundBtn.classList.add('is-playing');
                    if(soundLabel) soundLabel.textContent = "Sound On";
                } else {
                    audio.pause();
                    soundBtn.classList.remove('is-playing');
                    if(soundLabel) soundLabel.textContent = "Sound Off";
                }
            } catch (error) {
                console.error("Audio Error:", error);
            } finally {
                isToggling = false;
            }
        });
    }

    /* --- 7. STORYTELLING SCROLL LOGIC (ABOUT PAGE) --- */
    const storyTexts = document.querySelectorAll('.text-block');
    const storyImages = document.querySelectorAll('.story-img');

    if (storyTexts.length > 0 && storyImages.length > 0) {
        const storyObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const idx = entry.target.getAttribute('data-img');
                    
                    // Active Image
                    storyImages.forEach(img => img.classList.remove('active'));
                    const activeImg = document.querySelector(`.story-img[data-index="${idx}"]`);
                    if (activeImg) activeImg.classList.add('active');

                    // Active Text
                    storyTexts.forEach(t => t.classList.remove('active-text'));
                    entry.target.classList.add('active-text');
                }
            });
        }, { 
            threshold: 0.5, 
            rootMargin: "0px 0px -20% 0px" 
        });

        storyTexts.forEach(text => storyObserver.observe(text));
    }

    /* --- 8. CONTACT FORM HANDLER (LUXURY MODAL) --- */
    const bookingForm = document.getElementById('booking-form');
    if (bookingForm) {
        bookingForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = bookingForm.querySelector('.btn-submit span');
            const originalText = btn.innerText;
            btn.innerText = "Đang xử lý...";
            
            // Giả lập gửi dữ liệu
            setTimeout(() => {
                // 1. Kích hoạt Modal thay vì Alert
                const modal = document.getElementById('success-modal');
                if (modal) {
                    modal.classList.add('active');
                    
                    // Logic đóng modal
                    const closeBtn = modal.querySelector('.close-modal');
                    if(closeBtn) closeBtn.onclick = () => modal.classList.remove('active');
                    
                    // Đóng khi click ra ngoài
                    window.onclick = (event) => {
                        if (event.target == modal) modal.classList.remove('active');
                    }
                }

                // 2. Reset Form
                bookingForm.reset();
                btn.innerText = "Gửi Thành Công";
                
                setTimeout(() => {
                    btn.innerText = originalText;
                }, 3000);
            }, 1500);
        });
    }

    /* --- 9. MINI CART DRAWER LOGIC (UPDATED) --- */
    
    // 1. Inject HTML
    function injectMiniCart() {
        if (document.querySelector('.cart-drawer')) return;

        const cartHTML = `
            <div class="cart-overlay" id="cart-overlay"></div>
            <div class="cart-drawer" id="cart-drawer">
                <div class="drawer-header">
                    <h2>Giỏ Hàng Của Bạn</h2>
                    <span class="close-drawer" id="close-drawer">&times;</span>
                </div>
                <div class="drawer-body" id="drawer-body"></div>
                <div class="drawer-footer">
                    <div class="total-row">
                        <span>Tổng cộng:</span>
                        <span id="drawer-total">$0.00</span>
                    </div>
                    <a href="cart.html" class="btn-checkout">Thanh Toán</a>
                    <a href="women.html" class="btn-view-cart" onclick="toggleCart(false)">Tiếp Tục Mua Sắm</a>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', cartHTML);

        // Gắn sự kiện đóng
        document.getElementById('close-drawer').onclick = () => toggleCart(false);
        document.getElementById('cart-overlay').onclick = () => toggleCart(false);
    }
    injectMiniCart();

    // 2. Global Cart Logic
    let cart = JSON.parse(localStorage.getItem('hoasac_cart')) || [];
    updateCartBadge();

    // Toggle Drawer
    window.toggleCart = function(open) {
        const drawer = document.getElementById('cart-drawer');
        const overlay = document.getElementById('cart-overlay');
        if(open) {
            drawer.classList.add('open');
            overlay.classList.add('open');
            renderMiniCart();
        } else {
            drawer.classList.remove('open');
            overlay.classList.remove('open');
        }
    }

    // Render Items (CÓ MÀU SẮC)
    function renderMiniCart() {
        const body = document.getElementById('drawer-body');
        const totalEl = document.getElementById('drawer-total');
        
        if(cart.length === 0) {
            body.innerHTML = '<p style="text-align:center; color:#999; margin-top:50px;">Giỏ hàng trống.</p>';
            totalEl.innerText = "$0.00";
            return;
        }

        body.innerHTML = '';
        let total = 0;

        cart.forEach((item, index) => {
            total += item.price * item.quantity;
            
            // Hiển thị chấm màu
            let colorHTML = '';
            if (item.color) {
                colorHTML = `<span style="display:inline-block; width:12px; height:12px; border-radius:50%; background-color:${item.color}; border:1px solid #ddd; margin-left:5px; vertical-align:middle;" title="Màu sắc"></span>`;
            }

            const itemEl = document.createElement('div');
            itemEl.className = 'drawer-item';
            itemEl.innerHTML = `
                <img src="${item.image}" alt="${item.name}">
                <div class="item-details">
                    <h4>${item.name}</h4>
                    <p>Size: ${item.size} ${colorHTML} | SL: ${item.quantity}</p>
                    <span class="item-price">$${new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(item.price * item.quantity)}</span>
                </div>
                <span class="remove-btn" onclick="removeFromDrawer(${index})">&times;</span>
            `;
            body.appendChild(itemEl);
        });

        totalEl.innerText = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(total);
    }

    // Add to Cart Function (CHECK COLOR)
    window.addToCart = function(product) {
        const existingItem = cart.find(item => 
            item.name === product.name && 
            item.size === product.size &&
            item.color === product.color // Phân biệt theo màu
        );
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({
                name: product.name,
                price: product.price,
                image: product.image,
                size: product.size,
                color: product.color, // Lưu màu
                quantity: 1
            });
        }

        saveCart();
        updateCartBadge();
        toggleCart(true); // MỞ MINI CART
    };

    // Remove Item Function
    window.removeFromDrawer = function(index) {
        cart.splice(index, 1);
        saveCart();
        renderMiniCart();
        updateCartBadge();
        if(window.location.pathname.includes('cart.html')) window.location.reload();
    };

    function saveCart() {
        localStorage.setItem('hoasac_cart', JSON.stringify(cart));
    }

    function updateCartBadge() {
        const badges = document.querySelectorAll('.cart-btn');
        const totalQty = cart.reduce((sum, item) => sum + item.quantity, 0);
        badges.forEach(btn => {
            btn.innerText = `Giỏ hàng (${totalQty})`;
        });
    }

    // Header Cart Click -> Open Mini Cart
    document.querySelectorAll('.cart-btn').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault(); 
            toggleCart(true);
        });
    });

    /* --- 10. AUTO PLAY VIDEO ON HOVER --- */
    const runwayItems = document.querySelectorAll('.runway-item');
    runwayItems.forEach(item => {
        const video = item.querySelector('video');
        if(video) {
            item.addEventListener('mouseenter', () => video.play());
            item.addEventListener('mouseleave', () => {
                video.pause();
                video.currentTime = 0; 
            });
        }
    });

    /* --- 11. FOOTER YEAR --- */
    const yearSpan = document.getElementById('year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }
});
/* =========================================
   GLOBAL DATA HANDLER (ADMIN MODE SUPPORT)
   ========================================= */

// H�m n�y s? du?c c�c trang con g?i d? l?y d? li?u m?i nh?t
window.getProductsDB = async function() {
    // 1. Uu ti�n l?y t? LocalStorage (Admin Data)
    const localData = localStorage.getItem('hoasac_products_db');
    if (localData) {
        console.log('�ang s? d?ng d? li?u t? Admin Dashboard');
        return JSON.parse(localData);
    }

    // 2. N?u kh�ng c�, l?y t? file JSON g?c
    try {
        const response = await fetch('assets/data/products.json');
        return await response.json();
    } catch (error) {
        console.error('L?i t?i d? li?u:', error);
        return [];
    }
};

