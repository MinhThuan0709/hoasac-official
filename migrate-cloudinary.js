const fs = require('fs');
const glob = require('glob');
const path = require('path');
const cloudinary = require('cloudinary').v2;
require('dotenv').config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

async function uploadAndReplace() {
    console.log('Starting migration to Cloudinary...');

    // 1. Scan for all HTML files
    const htmlFiles = glob.sync('**/*.html', { ignore: 'node_modules/**' });
    console.log(`Found ${htmlFiles.length} HTML files.`);

    // 2. Scan for all local images and videos
    const assets = glob.sync('assets/**/*.{jpg,jpeg,png,svg,mp4,webm}');
    console.log(`Found ${assets.length} local assets in assets/ directory.`);

    const assetMap = new Map(); // local path -> cloudinary url

    // 3. Upload assets
    for (let i = 0; i < assets.length; i++) {
        const localPath = assets[i];

        // Convert path to POSIX for consistent matching
        const posixPath = localPath.split(path.sep).join('/');

        // We want the public_id to preserve the folder structure so it doesn't collide
        // e.g. "assets/images/lookbook/look-01.jpg" -> "hoasac/images/lookbook/look-01"

        // Extract everything after 'assets/' to use as folder structure
        const relativePath = posixPath.replace(/^assets\//, '');
        const folder = path.dirname(relativePath);
        const filenameNoExt = path.parse(relativePath).name;
        const publicId = `hoasac/${folder}/${filenameNoExt}`.replace(/\/+/g, '/');

        try {
            console.log(`[${i + 1}/${assets.length}] Uploading ${localPath} ...`);
            const isVideo = posixPath.endsWith('.mp4') || posixPath.endsWith('.webm');

            const result = await cloudinary.uploader.upload(localPath, {
                resource_type: isVideo ? 'video' : 'image',
                public_id: publicId,
                overwrite: true
            });

            // Construct optimized URL
            // Use f_auto,q_auto for standard auto-optimization
            const optUrl = result.secure_url.replace(
                '/upload/',
                '/upload/f_auto,q_auto/'
            );

            assetMap.set(posixPath, optUrl);
            console.log(`  -> ${optUrl}`);
        } catch (e) {
            console.error(`  -> Failed to upload ${localPath}:`, e.message);
        }
    }

    console.log('\nUpload complete! Now updating HTML files...');

    // 4. Update HTML files
    let totalReplaced = 0;

    htmlFiles.forEach(file => {
        let content = fs.readFileSync(file, 'utf8');
        let fileChanged = false;

        // We need to resolve relative paths
        // e.g. in index.html, it's "assets/images/..."
        // in lookbook/urban-elegance.html it's "../assets/images/..."

        for (const [localPosixPath, cloudUrl] of assetMap) {
            // Create regexes to match possible variations of the path in the HTML

            // The original regexes handled both single and double quotes.
            // The new string splitting approach needs to handle both explicitly.
            const relPath = localPosixPath.replace(/^assets\//, '');

            const targets = [
                `"${localPosixPath}"`,
                `'${localPosixPath}'`,
                `"../assets/${relPath}"`,
                `'../assets/${relPath}'`
            ];

            for (const target of targets) {
                if (content.includes(target)) {
                    content = content.split(target).join(`"${cloudUrl}"`);
                    fileChanged = true;
                    // Increment totalReplaced by the number of occurrences replaced
                    // This is a simplification; a regex replacement would count accurately.
                    // For simplicity, we'll just increment by 1 per unique target found.
                    totalReplaced++;
                }
            }
        }

        if (fileChanged) {
            fs.writeFileSync(file, content, 'utf8');
            console.log(`  Updated ${file}`);
        }
    });

    console.log(`\nMigration complete! Replaced ${totalReplaced} asset links across ${htmlFiles.length} HTML files.`);
}

uploadAndReplace().catch(console.error);
