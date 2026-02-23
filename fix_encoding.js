/**
 * FIX ENCODING — Chuyển tất cả file HTML sang UTF-8 with BOM
 * UTF-8 BOM giúp trình duyệt và server nhận diện đúng encoding.
 */
const fs = require('fs');
const path = require('path');

const dir = __dirname;
const BOM = '\uFEFF';

fs.readdirSync(dir)
    .filter(f => f.endsWith('.html'))
    .forEach(file => {
        const fp = path.join(dir, file);
        let content = fs.readFileSync(fp, 'utf-8');

        // Xóa BOM cũ nếu có
        if (content.charCodeAt(0) === 0xFEFF) {
            content = content.slice(1);
        }

        // Ghi lại với UTF-8 BOM
        fs.writeFileSync(fp, BOM + content, 'utf-8');
        console.log('✅', file);
    });

console.log('\nHoàn tất! Tất cả file đã được chuyển sang UTF-8 with BOM.');
