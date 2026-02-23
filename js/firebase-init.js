// ==========================================
// FIREBASE INIT - CDN Compat Mode
// ==========================================
// firebase-app-compat.js, firebase-firestore-compat.js, firebase-auth-compat.js
// phải được nạp TRƯỚC file này qua thẻ <script> trong HTML.

const firebaseConfig = {
    apiKey: "AIzaSyC68_VsWqCIfuAmdY7KpMzhcdWtlPJCpIQ",
    authDomain: "hoasac-web.firebaseapp.com",
    projectId: "hoasac-web",
    storageBucket: "hoasac-web.firebasestorage.app",
    messagingSenderId: "368211737391",
    appId: "1:368211737391:web:cc07c7844e657402a43fda",
    measurementId: "G-V32N62Q8TY"
};

// Chỉ khởi tạo nếu chưa có app nào
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

console.log('✅ Firebase đã khởi tạo thành công (Compat CDN)');
