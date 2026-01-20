/* ===== KHỞI TẠO CÁC BIẾN ===== */
const envelope = document.getElementById("envelope-overlay");
const content = document.getElementById("content");
const openBtn = document.getElementById("openBtn");
const music = document.getElementById("bgMusic");
const canvas = document.getElementById("fireworks");
const ctx = canvas ? canvas.getContext("2d") : null;

/* ===== MODULE PHÁO HOA (Liên tục) ===== */
let particles = [];
let fireworksActive = false; // Mặc định tắt, chờ mở rèm mới bắn

if (canvas) {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    window.addEventListener("resize", () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
}

function createFirework() {
    if (!fireworksActive || !canvas) return;

    // Nổ ngẫu nhiên trên màn hình
    const x = Math.random() * (canvas.width - 100) + 50;
    const y = Math.random() * (canvas.height / 2) + 50;
    const colors = ["#ff0044", "#ffd700", "#ff6600", "#00ffcc", "#ffffff"];

    // Tạo 50 hạt mỗi lần nổ
    for (let i = 0; i < 50; i++) {
        particles.push({
            x: x, y: y,
            vx: (Math.random() - 0.5) * 6,
            vy: (Math.random() - 0.5) * 6,
            life: Math.random() * 80 + 40,
            color: colors[Math.floor(Math.random() * colors.length)],
            gravity: 0.05,
            friction: 0.98
        });
    }
}

function updateFireworks() {
    if (!canvas || !ctx) return;
    
    // Tạo vệt mờ đuôi pháo hoa
    ctx.globalCompositeOperation = 'destination-out';
    ctx.fillStyle = "rgba(0, 0, 0, 0.2)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.globalCompositeOperation = 'lighter';

    for (let i = particles.length - 1; i >= 0; i--) {
        let p = particles[i];
        p.vx *= p.friction;
        p.vy *= p.friction;
        p.vy += p.gravity;
        p.x += p.vx;
        p.y += p.vy;
        p.life--;

        if (p.life <= 0) {
            particles.splice(i, 1);
        } else {
            ctx.beginPath();
            ctx.arc(p.x, p.y, Math.random() * 2 + 1, 0, Math.PI * 2);
            ctx.fillStyle = p.color;
            ctx.fill();
        }
    }
    requestAnimationFrame(updateFireworks);
}

// Chạy vòng lặp render
if (canvas) updateFireworks();

/* ===== XỬ LÝ SỰ KIỆN MỞ THƯ ===== */
if (openBtn) {
    openBtn.onclick = () => {
        // 1. Phát nhạc (Nếu có file)
        if (music) {
            music.volume = 0.6;
            music.play().catch(e => console.log("Cần tương tác để phát nhạc"));
        }

        // 2. Kích hoạt hiệu ứng Kéo Rèm
        if (envelope) {
            envelope.classList.add("curtain-open"); // Class này kích hoạt CSS transform
            
            // Sau 1.5 giây (rèm mở xong) thì ẩn hẳn div rèm đi
            setTimeout(() => {
                envelope.style.display = "none";
            }, 1500);
        }

        // 3. Hiện nội dung thiệp
        if (content) {
            content.classList.remove("hidden");
            // Delay 0.5s để rèm mở ra một chút rồi mới hiện thiệp
            setTimeout(() => {
                content.classList.add("show");
            }, 500);
        }

        // 4. Bắn pháo hoa (Liên tục không ngừng)
        fireworksActive = true;
        setInterval(createFirework, 400); // Cứ 0.4s bắn 1 quả
    };
}