const fs = require('fs');
const path = require('path');

const dir = 'd:/web';

// Cấu trúc Footer gốc xác định từ index.html
const footerStartStr = '<footer class="site-footer">';
const footerEndStr = '</footer>';

// Đọc index.html để lấy mẫu footer chuẩn
const indexHtml = fs.readFileSync(path.join(dir, 'index.html'), 'utf8');
const startIndex = indexHtml.indexOf(footerStartStr);
const endIndex = indexHtml.indexOf(footerEndStr, startIndex) + footerEndStr.length;

if (startIndex === -1 || endIndex === -1) {
    console.error("Không tìm thấy footer trong index.html");
    process.exit(1);
}

const standardFooter = indexHtml.substring(startIndex, endIndex);

// Các file cần quét
const htmlFiles = [
    'about.html',
    'admin.html',
    'campaign.html',
    'cart.html',
    'collections.html',
    'contact.html',
    'men.html',
    'product-detail.html',
    'stories.html',
    'women.html'
];

let updatedCount = 0;

for (const file of htmlFiles) {
    const filePath = path.join(dir, file);
    if (!fs.existsSync(filePath)) continue;

    let content = fs.readFileSync(filePath, 'utf8');

    // Tìm vị trí footer hiện tại
    const startLoc = content.indexOf(footerStartStr);
    if (startLoc !== -1) {
        const endLoc = content.indexOf(footerEndStr, startLoc) + footerEndStr.length;

        const currentFooter = content.substring(startLoc, endLoc);

        // Thay thế bằng footer chuẩn
        if (currentFooter !== standardFooter) {
            content = content.substring(0, startLoc) + standardFooter + content.substring(endLoc);
            fs.writeFileSync(filePath, content, 'utf8');
            console.log(`Đã đồng bộ footer cho: ${file}`);
            updatedCount++;
        } else {
            console.log(`Footer đã đồng bộ từ trước: ${file}`);
        }
    } else {
        console.log(`Không tìm thấy thẻ <footer class="site-footer"> trong: ${file}`);
    }
}

console.log(`Hoàn tất. Đã cập nhật ${updatedCount} file.`);
