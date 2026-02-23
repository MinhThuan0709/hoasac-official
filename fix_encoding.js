/**
 * CONVERT VIETNAMESE → HTML ENTITIES
 * Chuyển đổi tất cả ký tự tiếng Việt có dấu thành HTML entities (&#xxxx;)
 * Đây là cách duy nhất CHẮC CHẮN không bị lỗi encoding trên mọi server.
 */
const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const files = fs.readdirSync(ROOT).filter(f => f.endsWith('.html'));

// Regex bắt mọi ký tự Unicode ngoài ASCII (bao gồm tiếng Việt)
const NON_ASCII = /[^\x00-\x7F]/g;

files.forEach(file => {
    const fp = path.join(ROOT, file);
    const buf = fs.readFileSync(fp);

    // Thử đọc UTF-8 trước
    let content = buf.toString('utf-8');

    // Nếu có BOM, xóa
    if (content.charCodeAt(0) === 0xFEFF) content = content.slice(1);

    // Đếm ký tự non-ASCII
    const matches = content.match(NON_ASCII);
    if (!matches || matches.length === 0) {
        console.log(`⏭️  ${file} — không có ký tự đặc biệt`);
        return;
    }

    // Chuyển tất cả ký tự non-ASCII thành HTML entities
    const converted = content.replace(NON_ASCII, char => {
        return '&#' + char.charCodeAt(0) + ';';
    });

    fs.writeFileSync(fp, converted, 'ascii');
    console.log(`✅ ${file} — ${matches.length} ký tự đã chuyển thành entities`);
});

console.log('\nHoàn tất! Mọi ký tự Việt giờ ở dạng &#xxxx; — không thể lỗi encoding.');
