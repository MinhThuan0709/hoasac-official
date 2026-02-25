const fs = require('fs');
const path = require('path');
const { Readable } = require('stream');
const { finished } = require('stream/promises');
require('dotenv').config();

const API_KEY = process.env.PEXELS_API_KEY;
const HEADERS = { 'Authorization': API_KEY };

const IMAGE_DIR = path.join(__dirname, 'assets', 'images', 'pexels');
const VIDEO_DIR = path.join(__dirname, 'assets', 'videos', 'pexels');

// Ensure directories exist
[IMAGE_DIR, VIDEO_DIR].forEach(dir => {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

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

async function searchAndDownloadImages(query, limit = 15) {
    console.log(`\n🔍 Searching Images for: "${query}"...`);
    const res = await fetch(`https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=${limit}&orientation=portrait`, { headers: HEADERS });
    const data = await res.json();

    if (!data.photos || data.photos.length === 0) {
        console.log(`No images found for ${query}.`);
        return;
    }

    for (let i = 0; i < data.photos.length; i++) {
        const photo = data.photos[i];
        const url = photo.src.large2x || photo.src.large;
        const dest = path.join(IMAGE_DIR, `photo_${photo.id}.jpg`);
        console.log(`[Image ${i + 1}/${data.photos.length}] Downloading ${photo.id}...`);
        await downloadFile(url, dest);
    }
}

async function searchAndDownloadVideos(query, limit = 5) {
    console.log(`\n🔍 Searching Videos for: "${query}"...`);
    const res = await fetch(`https://api.pexels.com/videos/search?query=${encodeURIComponent(query)}&per_page=${limit}&orientation=portrait`, { headers: HEADERS });
    const data = await res.json();

    if (!data.videos || data.videos.length === 0) {
        console.log(`No videos found for ${query}.`);
        return;
    }

    for (let i = 0; i < data.videos.length; i++) {
        const video = data.videos[i];
        // Find highest quality MP4 or fallback to first
        let bestFile = video.video_files.find(f => f.quality === 'hd' && f.file_type === 'video/mp4');
        if (!bestFile) bestFile = video.video_files[0];

        const dest = path.join(VIDEO_DIR, `video_${video.id}.mp4`);
        console.log(`[Video ${i + 1}/${data.videos.length}] Downloading ${video.id}...`);
        await downloadFile(bestFile.link, dest);
    }
}

async function run() {
    console.log('🚀 Pexels Downloader Started...');

    await searchAndDownloadImages('fashion runway', 10);
    await searchAndDownloadImages('minimalist luxury fashion', 10);
    await searchAndDownloadImages('vogue editorial', 10);

    await searchAndDownloadVideos('fashion show runway', 5);
    await searchAndDownloadVideos('minimalist luxury', 3);

    console.log('\n✅ All downloads completed successfully!');
    console.log(`📁 Images saved to ${IMAGE_DIR}`);
    console.log(`📁 Videos saved to ${VIDEO_DIR}`);
}

run().catch(console.error);
