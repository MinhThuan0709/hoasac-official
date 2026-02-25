const fs = require('fs');
const path = require('path');
const { Readable } = require('stream');
const { finished } = require('stream/promises');
require('dotenv').config();

const UNSPLASH_KEY = process.env.UNSPLASH_ACCESS_KEY;
const HEADERS = { 'Authorization': `Client-ID ${UNSPLASH_KEY}` };

const IMAGE_DIR = path.join(__dirname, 'assets', 'images', 'unsplash');

// Ensure directory exists
if (!fs.existsSync(IMAGE_DIR)) {
    fs.mkdirSync(IMAGE_DIR, { recursive: true });
}

async function downloadFile(url, dest) {
    try {
        const res = await fetch(url);
        if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.statusText}`);
        const fileStream = fs.createWriteStream(dest);
        await finished(Readable.fromWeb(res.body).pipe(fileStream));
    } catch (err) {
        console.error(`Error downloading ${url}:`, err.message);
    }
}

async function searchAndDownloadUnsplash(query, perPage = 10, orientation = 'portrait') {
    console.log(`\n📸 Searching Unsplash for: "${query}"...`);
    const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=${perPage}&orientation=${orientation}&content_filter=high`;

    try {
        const res = await fetch(url, { headers: HEADERS });
        const data = await res.json();

        if (res.status !== 200) {
            console.error(`Error from Unsplash API: ${data.errors ? data.errors.join(', ') : res.statusText}`);
            return;
        }

        if (!data.results || data.results.length === 0) {
            console.log(`No images found for ${query}.`);
            return;
        }

        for (let i = 0; i < data.results.length; i++) {
            const photo = data.results[i];
            // Download the 'regular' size which is width 1080 (very good quality, fast download).
            // Or 'raw'/'full' for massive sizes, but regular is perfect for web.
            const dlUrl = photo.urls.regular;

            const dest = path.join(IMAGE_DIR, `unsplash_${photo.id}.jpg`);
            console.log(`[Image ${i + 1}/${data.results.length}] Downloading ${photo.id}...`);
            await downloadFile(dlUrl, dest);

            // Tell Unsplash we downloaded it (API requirement for tracking)
            if (photo.links && photo.links.download_location) {
                fetch(photo.links.download_location, { headers: HEADERS }).catch(() => { });
            }
        }
    } catch (error) {
        console.error('Fetch error:', error);
    }
}

async function run() {
    console.log('🚀 Unsplash Downloader Started...');

    await searchAndDownloadUnsplash('minimalist luxury fashion', 15, 'portrait');
    await searchAndDownloadUnsplash('vogue magazine photography', 15, 'portrait');
    await searchAndDownloadUnsplash('brutalist architecture fashion', 10, 'portrait');
    await searchAndDownloadUnsplash('monochrome silk fashion', 10, 'portrait');

    console.log('\n✅ All Unsplash downloads completed successfully!');
    console.log(`📁 Images saved to ${IMAGE_DIR}`);
}

run().catch(console.error);
