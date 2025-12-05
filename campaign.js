/* --- THE VOID: HYBRID ENGINE --- */

// 1. CURSOR
const cursor = document.querySelector('.camp-cursor');
document.addEventListener('mousemove', (e) => {
    if(cursor) { cursor.style.left = e.clientX + 'px'; cursor.style.top = e.clientY + 'px'; }
});

// 2. SCROLL LOGIC (Sợi chỉ & Reveal)
const threadGlow = document.querySelector('.thread-glow');
const threadPoint = document.querySelector('.thread-point');
const cards = document.querySelectorAll('.liquid-card');

window.addEventListener('scroll', () => {
    // Tính % cuộn trang
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = window.scrollY / totalHeight;
    const percent = Math.min(progress * 100, 100);

    // Cập nhật sợi chỉ
    if(threadGlow) {
        threadGlow.style.height = `${percent}%`;
        threadPoint.style.top = `${percent}%`;
    }
});

// Intersection Observer cho hiệu ứng Card trồi lên
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if(entry.isIntersecting) {
            entry.target.classList.add('active');
        }
    });
}, { threshold: 0.2 });

cards.forEach(card => observer.observe(card));


// 3. THREE.JS LIQUID ORB (NỀN 3D)
try {
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x000000, 0.02);

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({
        canvas: document.querySelector('#webgl-canvas'),
        antialias: true, alpha: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;

    // Ánh sáng
    const ambientLight = new THREE.AmbientLight(0x404040, 3);
    scene.add(ambientLight);
    const pLight1 = new THREE.PointLight(0x0088ff, 3, 50); pLight1.position.set(-5, 3, 5); scene.add(pLight1);
    const pLight2 = new THREE.PointLight(0xff0088, 3, 50); pLight2.position.set(5, -3, 5); scene.add(pLight2);
    const dLight = new THREE.DirectionalLight(0xffffff, 3); dLight.position.set(0, 10, 10); scene.add(dLight);

    // Quả cầu lỏng
    const geometry = new THREE.IcosahedronGeometry(1.8, 30); // Giảm size chút để không che nội dung
    const material = new THREE.MeshPhysicalMaterial({
        color: 0xffffff, metalness: 0.1, roughness: 0,
        transmission: 1, thickness: 1.5,
        envMapIntensity: 1, clearcoat: 1, ior: 1.2
    });
    const sphere = new THREE.Mesh(geometry, material);
    scene.add(sphere);

    // Animation Lỏng
    const simplex = new SimplexNoise();
    const originalPositions = geometry.attributes.position.array.slice(); 

    function animateLiquid(time) {
        const positionAttribute = geometry.attributes.position;
        const vertex = new THREE.Vector3();
        for (let i = 0; i < positionAttribute.count; i++) {
            vertex.fromArray(originalPositions, i * 3);
            const noise = simplex.noise3D(vertex.x*0.4+time*0.0003, vertex.y*0.4+time*0.0003, vertex.z*0.4+time*0.0003);
            vertex.multiplyScalar(1 + noise * 0.25);
            positionAttribute.setXYZ(i, vertex.x, vertex.y, vertex.z);
        }
        geometry.computeVertexNormals();
        positionAttribute.needsUpdate = true;
    }

    // Tương tác chuột xoay cầu
    let mouseX = 0; let mouseY = 0;
    window.addEventListener('mousemove', (e) => {
        mouseX = (e.clientX / window.innerWidth) * 2 - 1;
        mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
    });

    function animate() {
        requestAnimationFrame(animate);
        const time = performance.now();
        animateLiquid(time);
        
        // Cầu tự xoay + xoay theo chuột
        sphere.rotation.y += 0.002;
        sphere.rotation.x += (mouseY * 0.2 - sphere.rotation.x) * 0.05;
        sphere.rotation.z += (mouseX * 0.2 - sphere.rotation.z) * 0.05;

        // Đẩy quả cầu ra xa hoặc mờ đi khi cuộn xuống (Optional - Hiệu ứng chiều sâu)
        // sphere.position.z = -window.scrollY * 0.002; 

        renderer.render(scene, camera);
    }
    animate();

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

} catch (e) { console.error(e); }