const fs = require('fs');
const path = require('path');

const dir = 'd:/web';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html') && f !== 'auth.html');

for (const file of files) {
    const filePath = path.join(dir, file);
    let html = fs.readFileSync(filePath, 'utf-8');

    // Check if it already has account-btn
    if (html.includes('class="account-btn"')) continue;

    // Inject before cart using regex
    const regex = /(<!-- Cart -->[\s\S]*?<a href=".*?cart.*?class="cart-btn".*?>)/;

    if (regex.test(html)) {
        html = html.replace(regex, '<!-- Account -->\n                <a href="auth.html" class="account-btn" data-vi="Tài Khoản" data-en="Sign In">Tài Khoản</a>\n\n                $1');
        fs.writeFileSync(filePath, html);
        console.log(`Tiêm nút 'Tài Khoản' thành công vào: ${file}`);
    }
}
console.log('Quá trình đồng bộ Navigation bằng Regex hoàn tất!');
