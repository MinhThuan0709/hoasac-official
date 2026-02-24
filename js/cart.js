/* =========================================
   js/cart.js — Mini Cart Drawer Logic
   Giỏ hàng, badge cập nhật, mở/đóng drawer.
   ========================================= */

(function initCart() {
    // Inject cart drawer HTML once
    if (!document.querySelector('.cart-drawer')) {
        document.body.insertAdjacentHTML('beforeend', `
            <div class="cart-overlay" id="cart-overlay"></div>
            <div class="cart-drawer" id="cart-drawer">
                <div class="drawer-header">
                    <h2>Gi&#7887; H&#224;ng C&#7911;a B&#7841;n</h2>
                    <span class="close-drawer" id="close-drawer">&times;</span>
                </div>
                <div class="drawer-body" id="drawer-body"></div>
                <div class="drawer-footer">
                    <div class="total-row">
                        <span>T&#7893;ng c&#7897;ng:</span>
                        <span id="drawer-total">$0.00</span>
                    </div>
                    <a href="cart.html" class="btn-checkout">Thanh To&#225;n</a>
                    <a href="women.html" class="btn-view-cart" onclick="window.toggleCart(false)">Ti&#7871;p T&#7909;c Mua S&#7855;m</a>
                </div>
            </div>
        `);

        document.getElementById('close-drawer').onclick = () => window.toggleCart(false);
        document.getElementById('cart-overlay').onclick = () => window.toggleCart(false);
    }

    let cart = JSON.parse(localStorage.getItem('hoasac_cart')) || [];

    function saveCart() {
        localStorage.setItem('hoasac_cart', JSON.stringify(cart));
    }

    function updateCartBadge() {
        const totalQty = cart.reduce((sum, item) => sum + item.quantity, 0);
        document.querySelectorAll('.cart-btn').forEach(btn => {
            btn.textContent = `Gi&#7887; h&#224;ng (${totalQty})`;
            // Use innerHTML to render entities
            btn.innerHTML = `Gi&#7887; h&#224;ng (${totalQty})`;
        });
    }

    function renderMiniCart() {
        const body = document.getElementById('drawer-body');
        const totalEl = document.getElementById('drawer-total');
        if (!body || !totalEl) return;

        if (cart.length === 0) {
            body.innerHTML = '<p style="text-align:center;color:#999;margin-top:50px">Gi&#7887; h&#224;ng tr&#7889;ng.</p>';
            totalEl.textContent = '$0.00';
            return;
        }

        let total = 0;
        body.innerHTML = '';
        cart.forEach((item, index) => {
            total += item.price * item.quantity;
            const colorDot = item.color
                ? `<span style="display:inline-block;width:12px;height:12px;border-radius:50%;background:${item.color};border:1px solid #ddd;margin-left:5px;vertical-align:middle"></span>`
                : '';
            const el = document.createElement('div');
            el.className = 'drawer-item';
            el.innerHTML = `
                <img src="${item.image}" alt="${item.name}">
                <div class="item-details">
                    <h4>${item.name}</h4>
                    <p>Size: ${item.size} ${colorDot} | SL: ${item.quantity}</p>
                    <span class="item-price">${new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(item.price * item.quantity)}</span>
                </div>
                <span class="remove-btn" onclick="window.removeFromDrawer(${index})">&times;</span>
            `;
            body.appendChild(el);
        });
        totalEl.textContent = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(total);
    }

    // Public API
    window.toggleCart = function (open) {
        const drawer = document.getElementById('cart-drawer');
        const overlay = document.getElementById('cart-overlay');
        if (!drawer) return;
        drawer.classList.toggle('open', open);
        overlay.classList.toggle('open', open);
        if (open) renderMiniCart();
    };

    window.addToCart = function (product) {
        const existing = cart.find(i => i.name === product.name && i.size === product.size && i.color === product.color);
        if (existing) {
            existing.quantity += 1;
        } else {
            cart.push({ ...product, quantity: 1 });
        }
        saveCart();
        updateCartBadge();
        window.toggleCart(true);
    };

    window.removeFromDrawer = function (index) {
        cart.splice(index, 1);
        saveCart();
        renderMiniCart();
        updateCartBadge();
        if (window.location.pathname.includes('cart.html')) window.location.reload();
    };

    // Cart btn → open drawer
    document.querySelectorAll('.cart-btn').forEach(btn => {
        btn.addEventListener('click', e => { e.preventDefault(); window.toggleCart(true); });
    });

    updateCartBadge();
})();
