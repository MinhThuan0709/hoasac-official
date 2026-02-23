const fs = require('fs');
const path = require('path');

const baseUrl = 'd:/web/assets/images/products';

// Cấu trúc Categories chuẩn xác theo dự án (MEN & WOMEN)
const categories = {
    women: [
        { name: 'outerwear', variations: ['trench coat', 'wool coat', 'blazer', 'cape', 'cashmere coat'] },
        { name: 'dresses', variations: ['evening gown', 'silk slip', 'cocktail dress', 'midi dress', 'wrap dress'] },
        { name: 'tops', variations: ['silk blouse', 'camisole', 'knitwear', 'corset', 'cotton shirt'] },
        { name: 'bottoms', variations: ['tailored trousers', 'palazzo pants', 'pencil skirt', 'silk skirt', 'wide leg pants'] }
    ],
    men: [
        { name: 'suits', variations: ['full suit', 'tuxedo', 'sport coat', 'waistcoat', 'double breasted suit'] },
        { name: 'shirts', variations: ['dress shirt', 'oxford shirt', 'linen shirt', 'mandarin collar', 'polo shirt'] },
        { name: 'outerwear', variations: ['overcoat', 'leather jacket', 'bomber jacket', 'field jacket', 'trench coat'] },
        { name: 'bottoms', variations: ['dress trousers', 'chinos', 'raw denim', 'gurkha pants', 'cargo pants'] }
    ]
};

const images = [];

for (const [gender, cats] of Object.entries(categories)) {
    for (const cat of cats) {
        for (const item of cat.variations) {
            const fileName = item.replace(/ /g, '-');
            images.push({
                path: `${gender}/${cat.name}/${fileName}-01.jpg`,
                query: `minimalist luxury fashion ${gender} wearing ${item}`,
                index: 0
            });
            images.push({
                path: `${gender}/${cat.name}/${fileName}-02.jpg`,
                query: `fashion editorial ${gender} ${item} detail shot`,
                index: 1 // Lấy hình thứ 2 trong kết quả tìm kiếm
            });
        }
    }
}

async function searchUnsplash(query, index) {
    const url = `https://unsplash.com/napi/search/photos?query=${encodeURIComponent(query)}&per_page=5`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Status ${res.status}`);
    const data = await res.json();
    if (data.results && data.results.length > index) {
        // Ưu tiên ảnh dọc (portrait)
        let best = data.results[index];
        for (let i = index; i < data.results.length; i++) {
            if (data.results[i].height > data.results[i].width) {
                best = data.results[i];
                break;
            }
        }
        return best.urls.regular;
    }
    // Fallback nếu không đủ ảnh
    if (data.results && data.results.length > 0) return data.results[0].urls.regular;
    throw new Error('No image found for query');
}

async function downloadConcurrent(tasks, limit) {
    let i = 0;

    const worker = async () => {
        while (i < tasks.length) {
            const index = i++;
            const img = tasks[index];
            const fullPath = path.join(baseUrl, img.path);
            const dir = path.dirname(fullPath);

            if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

            if (fs.existsSync(fullPath) && fs.statSync(fullPath).size > 1000) {
                console.log(`[${index + 1}/${tasks.length}] Skipped (Already exists): ${img.path}`);
                continue;
            }

            try {
                // Bước 1: Tìm kiếm URL ảnh thật từ Unsplash
                const imageUrl = await searchUnsplash(img.query, img.index);

                // Bước 2: Tải ảnh về
                const res = await fetch(imageUrl);
                if (!res.ok) throw new Error('Download Status ' + res.status);
                const buffer = await res.arrayBuffer();
                fs.writeFileSync(fullPath, Buffer.from(buffer));
                console.log(`[${index + 1}/${tasks.length}] Downloaded (${Math.round(buffer.byteLength / 1024)}KB): ${img.path}`);
            } catch (e) {
                console.error(`[${index + 1}/${tasks.length}] Failed ${img.path}:`, e.message);
            }
            // Delay nhẹ để tránh bị Rate Limit của API Unsplash
            await new Promise(r => setTimeout(r, 500));
        }
    };

    const workers = Array.from({ length: limit }, worker);
    await Promise.all(workers);
}

console.log(`Bắt đầu tìm kiếm và tải ${images.length} hình ảnh thời trang thực tế từ Unsplash...`);
downloadConcurrent(images, 3).then(() => {
    console.log('HOÀN TẤT TẢI DỮ LIỆU SẢN PHẨM TỪ UNSPLASH!');
});
