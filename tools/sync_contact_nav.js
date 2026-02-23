const fs = require('fs');
const path = require('path');

const dir = 'd:/web';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

const additionalNav = `
                    <li class="nav-item">
                        <a href="contact.html" class="nav-link nav-contact">
                            <span class="text" data-vi="Liên Hệ" data-en="Contact">Liên Hệ</span>
                            <svg class="flower-icon" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 2C8 6 4 10 4 14C4 18.4183 7.58172 22 12 22C16.4183 22 20 18.4183 20 14C20 10 16 6 12 2ZM12 8C13.6569 8 15 9.34315 15 11C15 12.6569 13.6569 14 12 14C10.3431 14 9 12.6569 9 11C9 9.34315 10.3431 8 12 8Z"/>
                            </svg>
                        </a>
                    </li>`;

for (const file of files) {
    const filePath = path.join(dir, file);
    let html = fs.readFileSync(filePath, 'utf-8');

    // Check if it already has nav-contact
    if (html.includes('class="nav-link nav-contact"')) continue;

    // Regex to find where to inject: after Stories nav item
    const regex = /(<a href="stories\.html" class="nav-link" data-vi="Stories"[\s\S]*?data-en="Stories">Stories<\/a>\s*<\/li>)/;

    if (regex.test(html)) {
        html = html.replace(regex, `$1${additionalNav}`);
        fs.writeFileSync(filePath, html);
        console.log(`Tiêm mục Liên Hệ thành công vào: ${file}`);
    }
}
console.log('Quá trình đồng bộ thẻ Liên Hệ hoàn tất!');
