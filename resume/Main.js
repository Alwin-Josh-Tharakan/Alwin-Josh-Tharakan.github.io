/* main.js — Portfolio interactions & circuit canvas */

// ===========================
// CIRCUIT CANVAS BACKGROUND
// ===========================
(function initCircuit() {
    const canvas = document.getElementById('circuit-canvas');
    const ctx = canvas.getContext('2d');
    const GREEN = '#3dff8f';

    let nodes = [];
    let w, h;

    function resize() {
        w = canvas.width  = window.innerWidth;
        h = canvas.height = window.innerHeight;
    }

    function createNodes(count) {
        nodes = [];
        for (let i = 0; i < count; i++) {
            nodes.push({
                x: Math.random() * w,
                y: Math.random() * h,
                vx: (Math.random() - 0.5) * 0.25,
                vy: (Math.random() - 0.5) * 0.25,
                r: Math.random() * 2 + 1
            });
        }
    }

    function drawSegment(ax, ay, bx, by, alpha) {
        // Only draw orthogonal traces (circuit board style)
        ctx.globalAlpha = alpha;
        ctx.strokeStyle = GREEN;
        ctx.lineWidth = 0.6;
        ctx.beginPath();
        ctx.moveTo(ax, ay);
        // Elbow at midpoint
        const mx = (ax + bx) / 2;
        ctx.lineTo(mx, ay);
        ctx.lineTo(mx, by);
        ctx.lineTo(bx, by);
        ctx.stroke();
    }

    function drawNode(x, y, alpha) {
        ctx.globalAlpha = alpha * 0.8;
        ctx.fillStyle = GREEN;
        ctx.beginPath();
        ctx.arc(x, y, 2, 0, Math.PI * 2);
        ctx.fill();
    }

    function tick() {
        ctx.clearRect(0, 0, w, h);

        // Move nodes
        for (const n of nodes) {
            n.x += n.vx;
            n.y += n.vy;
            if (n.x < 0 || n.x > w) n.vx *= -1;
            if (n.y < 0 || n.y > h) n.vy *= -1;
        }

        // Draw connections
        const maxDist = 160;
        for (let i = 0; i < nodes.length; i++) {
            for (let j = i + 1; j < nodes.length; j++) {
                const dx = nodes[i].x - nodes[j].x;
                const dy = nodes[i].y - nodes[j].y;
                const d  = Math.sqrt(dx * dx + dy * dy);
                if (d < maxDist) {
                    const alpha = (1 - d / maxDist) * 0.5;
                    drawSegment(nodes[i].x, nodes[i].y, nodes[j].x, nodes[j].y, alpha);
                }
            }
        }

        // Draw nodes on top
        for (const n of nodes) {
            drawNode(n.x, n.y, 0.6);
        }

        ctx.globalAlpha = 1;
        requestAnimationFrame(tick);
    }

    resize();
    createNodes(55);
    tick();

    window.addEventListener('resize', () => {
        resize();
        createNodes(55);
    });
})();


// ===========================
// NAVBAR SCROLL EFFECT
// ===========================
(function initNavbar() {
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 60);
    });
})();


// ===========================
// SCROLL REVEAL
// ===========================
(function initReveal() {
    const els = document.querySelectorAll('.reveal');
    const io = new IntersectionObserver(
        entries => {
            entries.forEach(e => {
                if (e.isIntersecting) {
                    e.target.classList.add('visible');
                    io.unobserve(e.target);
                }
            });
        },
        { threshold: 0.1 }
    );
    els.forEach(el => io.observe(el));
})();


// ===========================
// SMOOTH ACTIVE NAV LINK
// ===========================
(function initActiveNav() {
    const sections = document.querySelectorAll('section[id]');
    const links    = document.querySelectorAll('.nav-links a');

    const io = new IntersectionObserver(
        entries => {
            entries.forEach(e => {
                if (e.isIntersecting) {
                    const id = e.target.getAttribute('id');
                    links.forEach(l => l.classList.remove('active'));
                    const active = document.querySelector(`.nav-links a[href="#${id}"]`);
                    if (active) active.classList.add('active');
                }
            });
        },
        { rootMargin: '-40% 0px -50%', threshold: 0 }
    );
    sections.forEach(s => io.observe(s));
})();


// ===========================
// STAGGERED PROJECT CARD REVEAL
// ===========================
(function staggerCards() {
    const cards = document.querySelectorAll('.project-card, .tl-card, .skill-block, .cert-item');
    const io = new IntersectionObserver(
        entries => {
            entries.forEach((e, i) => {
                if (e.isIntersecting) {
                    setTimeout(() => {
                        e.target.style.opacity = '1';
                        e.target.style.transform = 'none';
                    }, i * 80);
                    io.unobserve(e.target);
                }
            });
        },
        { threshold: 0.05 }
    );
    cards.forEach(c => {
        c.style.opacity = '0';
        c.style.transform = 'translateY(20px)';
        c.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        io.observe(c);
    });
})();