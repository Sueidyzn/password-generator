const canvas = document.getElementById("stars-canvas");
const ctx = canvas.getContext("2d");

let starsNear = [];
let starsMid = [];
let starsFar = [];

function createStars(count, minSize, maxSize, minSpeed, maxSpeed) {
    return Array.from({ length: count }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * (maxSize - minSize) + minSize,
        speed: Math.random() * (maxSpeed - minSpeed) + minSpeed,
        opacity: Math.random() * 0.8 + 0.2
    }));
}

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    starsFar = createStars(200, 1, 1, 0.1, 0.1);
    starsMid = createStars(1, 2, 2, 5, 5);
    starsNear = createStars(20, 2, 2, 0.2, 0.2);
}

function drawLayer(layer) {
    layer.forEach(star => {
        ctx.beginPath();
        ctx.fillStyle = `rgba(255,255,255,${star.opacity})`;

        ctx.arc(
            star.x,
            star.y,
            star.size,
            0,
            Math.PI * 2
        );

        ctx.fill();

        star.y -= star.speed;

        if (star.y < -star.size) {
            star.y = canvas.height + star.size;
            star.x = Math.random() * canvas.width;
        }
    });
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawLayer(starsFar);
    drawLayer(starsMid);
    drawLayer(starsNear);

    requestAnimationFrame(animate);
}

window.addEventListener("resize", resizeCanvas);

resizeCanvas();
animate();