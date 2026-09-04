/* ==========================================================================
   A HORA DA NOSSA ESTRELA — INTERATIVIDADE & DESIGN EDITORIAL CÓSMICO
   Progress Bar, Scroll Reveal, Canvas Retina, Áudio Generativo & Oráculo
   Dedicado com afeto a Ale
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    initUniverseCanvas();
    initClickSparkles();
    initSoundSystem();
    initCosmicChronometer();
    initPopoverCloser();
    initMobileDockScrollSpy();
    initReadingProgressBar();
    initScrollReveal();
    initTarotTouchTilt();
    initWaxSealInteractivity();
});

/* ==========================================================================
   1. BARRA DE PROGRESSO DE LEITURA EDITORIAL (CALIANDRAS STYLE)
   ========================================================================== */
function initReadingProgressBar() {
    const progressBar = document.getElementById('reading-progress');
    const dock = document.querySelector('.mobile-bottom-dock');
    let lastScrollY = window.scrollY || 0;

    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        if (progressBar && docHeight > 0) {
            const scrollPercent = (scrollTop / docHeight);
            progressBar.style.transform = `scaleX(${scrollPercent})`;
        }

        // Auto-esconder dock móvel ao descer para leitura 100% desobstruída
        if (dock) {
            if (scrollTop > 80 && scrollTop > lastScrollY + 8) {
                dock.classList.add('dock-hidden');
            } else if (scrollTop < lastScrollY - 6 || scrollTop <= 60) {
                dock.classList.remove('dock-hidden');
            }
            lastScrollY = scrollTop;
        }
    }, { passive: true });
}

/* ==========================================================================
   2. ANIMAÇÕES DE REVELAÇÃO NO SCROLL (SCROLL REVEAL)
   ========================================================================== */
function initScrollReveal() {
    document.body.classList.add('js-loaded');
    const revealElements = document.querySelectorAll('.reveal-item');
    if (!revealElements.length) return;

    if (!('IntersectionObserver' in window)) {
        revealElements.forEach(el => el.classList.add('revealed'));
        return;
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
            }
        });
    }, {
        threshold: 0.05,
        rootMargin: '50px 0px 50px 0px'
    });

    revealElements.forEach((el) => {
        observer.observe(el);
        // Se já estiver na tela ao carregar, revela logo
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
            el.classList.add('revealed');
        }
    });
}

/* ==========================================================================
   3. UNIVERSO ESPIRITUAL & MÍSTICO • SOLS SAGRADOS, LUAS & ESTRELAS DE DIAMANTE
   ========================================================================== */
let canvas, ctx;
let celestialElements = [];
let meteors = [];
let nebulas = [];
let mouse = { x: null, y: null, radius: 160 };
let dpr = 1;
let globalTime = 0;

function initUniverseCanvas() {
    canvas = document.getElementById('universe-canvas');
    if (!canvas) return;
    ctx = canvas.getContext('2d');

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas, { passive: true });

    // Rastreamento suave do mouse/toque
    window.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    }, { passive: true });

    window.addEventListener('touchmove', (e) => {
        if (e.touches.length > 0) {
            mouse.x = e.touches[0].clientX;
            mouse.y = e.touches[0].clientY;
        }
    }, { passive: true });

    window.addEventListener('touchend', () => {
        setTimeout(() => { mouse.x = null; mouse.y = null; }, 800);
    }, { passive: true });

    window.addEventListener('mouseout', () => {
        mouse.x = null;
        mouse.y = null;
    });

    initNebulas();
    createSpiritualCosmos();
    animateSpiritualCosmos();
}

function resizeCanvas() {
    if (!canvas) return;
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    ctx.scale(dpr, dpr);
    initNebulas();
    createSpiritualCosmos();
}

function initNebulas() {
    nebulas = [
        { x: window.innerWidth * 0.2, y: window.innerHeight * 0.25, r: 290, color: 'rgba(92, 13, 31, 0.2)', speed: 0.0006, phase: 0 },
        { x: window.innerWidth * 0.8, y: window.innerHeight * 0.7, r: 350, color: 'rgba(128, 0, 32, 0.16)', speed: 0.0005, phase: Math.PI },
        { x: window.innerWidth * 0.5, y: window.innerHeight * 0.45, r: 260, color: 'rgba(229, 185, 114, 0.07)', speed: 0.0009, phase: Math.PI / 2 }
    ];
}

function createSpiritualCosmos() {
    celestialElements = [];
    const isMobile = window.innerWidth < 768;

    // 1. Sols Místicos Sagrados (Sunbursts estilizados)
    const sunCount = isMobile ? 3 : 5;
    for (let i = 0; i < sunCount; i++) {
        celestialElements.push(new MysticSunSymbol());
    }

    // 2. Luas Crescentes Alquímicas
    const moonCount = isMobile ? 2 : 4;
    for (let i = 0; i < moonCount; i++) {
        celestialElements.push(new MysticMoonSymbol());
    }

    // 3. Estrelas de Diamante 4 & 8 Pontas (Brilhos Celestiais)
    const starCount = isMobile ? 18 : 32;
    for (let i = 0; i < starCount; i++) {
        celestialElements.push(new DiamondStarSymbol());
    }

    // 4. Poeira e Brasas Estelares Douradas
    const emberCount = isMobile ? 24 : 45;
    for (let i = 0; i < emberCount; i++) {
        celestialElements.push(new StardustEmber());
    }
}

/* --- CLASSE 1: SOL MÍSTICO SAGRADO (SUNBURST) --- */
class MysticSunSymbol {
    constructor() {
        this.reset(true);
    }

    reset(initial = false) {
        this.x = Math.random() * window.innerWidth;
        this.y = initial ? Math.random() * window.innerHeight : window.innerHeight + 40;
        // Evita nascer diretamente sobre o emblema do herói no topo
        if (initial && this.y < 360 && this.x > window.innerWidth * 0.25 && this.x < window.innerWidth * 0.75) {
            this.y += 350;
        }
        this.radius = Math.random() * 14 + 16;
        this.rays = 8;
        this.vy = -(Math.random() * 0.18 + 0.08);
        this.vx = (Math.random() - 0.5) * 0.12;
        this.angle = Math.random() * Math.PI * 2;
        this.rotSpeed = (Math.random() * 0.004 + 0.002) * (Math.random() > 0.5 ? 1 : -1);
        this.baseAlpha = Math.random() * 0.28 + 0.18;
        this.alpha = this.baseAlpha;
        this.pulseSpeed = Math.random() * 0.015 + 0.006;
    }

    update() {
        this.y += this.vy;
        this.x += this.vx;
        this.angle += this.rotSpeed;
        this.alpha = this.baseAlpha + Math.sin(globalTime * this.pulseSpeed) * 0.12;

        if (this.y < -50 || this.x < -50 || this.x > window.innerWidth + 50) {
            this.reset();
        }
    }

    draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);

        // Anel central do Sol
        ctx.beginPath();
        ctx.arc(0, 0, this.radius * 0.42, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(229, 185, 114, ${this.alpha * 0.85})`;
        ctx.lineWidth = 1;
        ctx.stroke();

        // Ponto central
        ctx.beginPath();
        ctx.arc(0, 0, 1.8, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(229, 185, 114, ${this.alpha * 0.95})`;
        ctx.fill();

        // Raios do Sol
        for (let i = 0; i < this.rays; i++) {
            const a = (i * 2 * Math.PI) / this.rays;
            const r1 = this.radius * 0.55;
            const r2 = i % 2 === 0 ? this.radius : this.radius * 0.78;
            ctx.beginPath();
            ctx.moveTo(Math.cos(a) * r1, Math.sin(a) * r1);
            ctx.lineTo(Math.cos(a) * r2, Math.sin(a) * r2);
            ctx.strokeStyle = `rgba(229, 185, 114, ${this.alpha * 0.75})`;
            ctx.lineWidth = 1;
            ctx.stroke();
        }

        ctx.restore();
    }
}

/* --- CLASSE 2: LUA CRESCENTE ALQUÍMICA --- */
class MysticMoonSymbol {
    constructor() {
        this.reset(true);
    }

    reset(initial = false) {
        this.x = Math.random() * window.innerWidth;
        this.y = initial ? Math.random() * window.innerHeight : window.innerHeight + 30;
        this.radius = Math.random() * 9 + 12;
        this.vy = -(Math.random() * 0.15 + 0.06);
        this.vx = (Math.random() - 0.5) * 0.1;
        this.angle = Math.random() * Math.PI * 2;
        this.rotSpeed = (Math.random() * 0.002 + 0.001) * (Math.random() > 0.5 ? 1 : -1);
        this.baseAlpha = Math.random() * 0.25 + 0.16;
        this.alpha = this.baseAlpha;
    }

    update() {
        this.y += this.vy;
        this.x += this.vx;
        this.angle += this.rotSpeed;

        if (this.y < -40 || this.x < -40 || this.x > window.innerWidth + 40) {
            this.reset();
        }
    }

    draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);

        ctx.beginPath();
        ctx.arc(0, 0, this.radius, -Math.PI / 2, Math.PI / 2, false);
        ctx.arc(this.radius * 0.45, 0, this.radius * 0.85, Math.PI / 2, -Math.PI / 2, true);
        ctx.closePath();
        ctx.fillStyle = `rgba(229, 185, 114, ${this.alpha * 0.8})`;
        ctx.shadowBlur = 8;
        ctx.shadowColor = 'rgba(229, 185, 114, 0.4)';
        ctx.fill();

        ctx.restore();
    }
}

/* --- CLASSE 3: ESTRELA DE DIAMANTE 4 & 8 PONTAS (DIFFRACTION SPIKES) --- */
class DiamondStarSymbol {
    constructor() {
        this.reset(true);
    }

    reset(initial = false) {
        this.x = Math.random() * window.innerWidth;
        this.y = initial ? Math.random() * window.innerHeight : window.innerHeight + 20;
        this.points = Math.random() > 0.6 ? 8 : 4;
        this.outerRadius = Math.random() * 8 + 6;
        this.innerRadius = this.outerRadius * 0.22;
        this.vy = -(Math.random() * 0.22 + 0.1);
        this.vx = (Math.random() - 0.5) * 0.15;
        this.angle = Math.random() * Math.PI;
        this.rotSpeed = Math.random() * 0.006 + 0.002;
        this.baseAlpha = Math.random() * 0.4 + 0.25;
        this.alpha = this.baseAlpha;
        this.pulseFreq = Math.random() * 0.03 + 0.01;
        
        const isRuby = Math.random() > 0.65;
        this.color = isRuby ? { r: 255, g: 110, b: 130 } : { r: 229, g: 185, b: 114 };
    }

    update() {
        this.y += this.vy;
        this.x += this.vx;
        this.angle += this.rotSpeed;
        this.alpha = this.baseAlpha + Math.sin(globalTime * this.pulseFreq) * 0.2;

        if (this.y < -30 || this.x < -30 || this.x > window.innerWidth + 30) {
            this.reset();
        }
    }

    draw() {
        const { r, g, b } = this.color;
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);

        ctx.beginPath();
        for (let i = 0; i < this.points * 2; i++) {
            const rad = i % 2 === 0 ? this.outerRadius : this.innerRadius;
            const a = (i * Math.PI) / this.points;
            const px = Math.cos(a) * rad;
            const py = Math.sin(a) * rad;
            if (i === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${Math.max(0.05, this.alpha)})`;
        ctx.shadowBlur = 10;
        ctx.shadowColor = `rgba(${r}, ${g}, ${b}, 0.6)`;
        ctx.fill();

        ctx.restore();
    }
}

/* --- CLASSE 4: BRASA ESTELAR CÓSMICA --- */
class StardustEmber {
    constructor() {
        this.reset(true);
    }

    reset(initial = false) {
        this.x = Math.random() * window.innerWidth;
        this.y = initial ? Math.random() * window.innerHeight : window.innerHeight + 15;
        this.size = Math.random() * 2 + 0.8;
        this.vy = -(Math.random() * 0.3 + 0.12);
        this.vx = (Math.random() - 0.5) * 0.2;
        this.waveFreq = Math.random() * 0.02 + 0.008;
        this.timeOffset = Math.random() * 100;
        this.alpha = Math.random() * 0.5 + 0.2;
    }

    update() {
        this.y += this.vy;
        this.x += this.vx + Math.sin(globalTime * this.waveFreq + this.timeOffset) * 0.4;
        this.alpha = 0.35 + Math.sin(globalTime * 0.02 + this.timeOffset) * 0.25;

        // Gravidade com toque
        if (mouse.x !== null && mouse.y !== null) {
            const dx = mouse.x - this.x;
            const dy = mouse.y - this.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < mouse.radius && dist > 5) {
                const force = (1 - dist / mouse.radius) * 0.35;
                this.x += (dx / dist) * force;
                this.y += (dy / dist) * force;
            }
        }

        if (this.y < -20 || this.x < -20 || this.x > window.innerWidth + 20) {
            this.reset();
        }
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(229, 185, 114, ${Math.max(0, this.alpha)})`;
        ctx.shadowBlur = 6;
        ctx.shadowColor = 'rgba(229, 185, 114, 0.7)';
        ctx.fill();
        ctx.shadowBlur = 0;
    }
}

/* --- CLASSE 5: METEORO / ESTRELA CADENTE --- */
class ShootingStar {
    constructor() {
        this.reset();
    }

    reset() {
        this.x = Math.random() * window.innerWidth * 0.85;
        this.y = Math.random() * window.innerHeight * 0.35;
        this.len = Math.random() * 95 + 60;
        this.speed = Math.random() * 7 + 6;
        this.size = Math.random() * 1.6 + 1;
        this.angle = Math.PI / 4 + (Math.random() - 0.5) * 0.2;
        this.vx = Math.cos(this.angle) * this.speed;
        this.vy = Math.sin(this.angle) * this.speed;
        this.opacity = 1;
        this.fadeSpeed = Math.random() * 0.02 + 0.015;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.opacity -= this.fadeSpeed;
    }

    draw() {
        if (this.opacity <= 0) return;
        const tailX = this.x - Math.cos(this.angle) * this.len;
        const tailY = this.y - Math.sin(this.angle) * this.len;

        const grad = ctx.createLinearGradient(tailX, tailY, this.x, this.y);
        grad.addColorStop(0, 'rgba(229, 185, 114, 0)');
        grad.addColorStop(1, `rgba(255, 255, 255, ${this.opacity})`);

        ctx.beginPath();
        ctx.moveTo(tailX, tailY);
        ctx.lineTo(this.x, this.y);
        ctx.strokeStyle = grad;
        ctx.lineWidth = this.size;
        ctx.stroke();
    }
}

function animateSpiritualCosmos() {
    globalTime += 1;
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

    // 1. Nébulas Vivas em Movimento Lento
    for (let n of nebulas) {
        const cx = n.x + Math.sin(globalTime * n.speed + n.phase) * 45;
        const cy = n.y + Math.cos(globalTime * n.speed + n.phase) * 30;
        const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, n.r);
        grad.addColorStop(0, n.color);
        grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = grad;
        ctx.fillRect(cx - n.r, cy - n.r, n.r * 2, n.r * 2);
    }

    // 2. Elementos Celestiais Espirituais (Sols, Luas, Estrelas de Diamante, Brasas)
    for (let el of celestialElements) {
        el.update();
        el.draw();
    }

    // 3. Meteoros Ocasionais
    if (Math.random() < 0.004 && meteors.length < 2) {
        meteors.push(new ShootingStar());
    }

    for (let i = meteors.length - 1; i >= 0; i--) {
        meteors[i].update();
        meteors[i].draw();
        if (meteors[i].opacity <= 0) {
            meteors.splice(i, 1);
        }
    }

    requestAnimationFrame(animateSpiritualCosmos);
}

/* ==========================================================================
   4. EFEITO ETÉREO DE LUZ ESTELAR & RIPPLE CELESTE (SEM EMOJIS)
   ========================================================================== */
function createCelestialStardust(x, y, count = 7) {
    // 1. Anel de onda luminosa etérea
    const ripple = document.createElement('div');
    ripple.className = 'celestial-ripple-ring';
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;
    document.body.appendChild(ripple);
    setTimeout(() => ripple.remove(), 800);

    // 2. Micro-faíscas de luz e poeira cósmica
    for (let i = 0; i < count; i++) {
        const spark = document.createElement('div');
        spark.className = 'stardust-spark-point';
        spark.style.left = `${x}px`;
        spark.style.top = `${y}px`;
        
        const angle = Math.random() * Math.PI * 2;
        const dist = Math.random() * (window.innerWidth < 768 ? 55 : 80) + 12;
        const tx = Math.cos(angle) * dist;
        const ty = Math.sin(angle) * dist;
        const size = Math.random() * 3.5 + 2;
        
        // Cores de luz: Dourado champagne ou rubi estelar
        const isGold = Math.random() > 0.4;
        spark.style.background = isGold 
            ? 'radial-gradient(circle, #fff3d1 0%, #e5b972 60%, rgba(229,185,114,0) 100%)' 
            : 'radial-gradient(circle, #ff85a1 0%, #e63946 60%, rgba(230,57,70,0) 100%)';
        spark.style.boxShadow = isGold ? '0 0 8px #e5b972' : '0 0 8px #e63946';
        
        spark.style.width = `${size}px`;
        spark.style.height = `${size}px`;
        spark.style.setProperty('--tx', `${tx}px`);
        spark.style.setProperty('--ty', `${ty}px`);
        
        document.body.appendChild(spark);
        setTimeout(() => spark.remove(), 950);
    }
}

/* ==========================================================================
   5. BRILHOS ETÉREOS AO TOCAR NA TELA (MOBILE & DESKTOP)
   ========================================================================== */
let lastTouchTime = 0;

function initClickSparkles() {
    window.addEventListener('touchstart', (e) => {
        if (e.target.closest('.btn-hug') || e.target.closest('.dock-item') || e.target.closest('.nav-audio-widget')) return;
        lastTouchTime = Date.now();
        if (e.touches.length > 0) {
            createCelestialStardust(e.touches[0].clientX, e.touches[0].clientY, 5);
        }
    }, { passive: true });

    window.addEventListener('click', (e) => {
        if (Date.now() - lastTouchTime < 400) return;
        if (e.target.closest('.btn-hug') || e.target.closest('.dock-item') || e.target.closest('.nav-audio-widget')) return;
        createCelestialStardust(e.clientX, e.clientY, 6);
    });
}

/* ==========================================================================
   7. TARÔ DAS ESTRELAS & ARCANOS (LITERATURA & DESTINO)
   ========================================================================== */
const tarotArcana = [
    {
        numeral: "XVII",
        title: "L'ÉTOILE",
        sub: "A ESTRELA",
        icon: "fa-solid fa-star-and-crescent",
        keywords: ["Esperança", "Luz Própria", "Clarice Lispector", "O Sim"],
        quote: "A Estrela representa a sua presença: um ponto de luz sereno e límpido que guia e encanta sem fazer esforço.",
        tag: "✦ Arcano Consagrado a Ale ✦"
    },
    {
        numeral: "VI",
        title: "LES AMOUREUX",
        sub: "OS ENAMORADOS",
        icon: "fa-solid fa-heart",
        keywords: ["Fio Vermelho", "Sintonia", "Destino", "Déjà Vu"],
        quote: "O encontro de duas almas destinadas a se cruzar. O laço invisível que atravessa eras e aponta com clareza para você.",
        tag: "✦ Conexão Atemporal & Inquebrável ✦"
    },
    {
        numeral: "XIX",
        title: "LE SOLEIL",
        sub: "O SOL",
        icon: "fa-solid fa-sun",
        keywords: ["Aurora", "Alegria", "Calor", "Sorriso Radiante"],
        quote: "O Sol simboliza a vitalidade do seu sorriso: uma força doce que dissipa qualquer inverno com facilidade.",
        tag: "✦ Brilho Próprio & Raro ✦"
    },
    {
        numeral: "II",
        title: "LA PAPESSE",
        sub: "A ALTA SACERDOTISA",
        icon: "fa-solid fa-book-open",
        keywords: ["Literatura", "Sabedoria", "Intuição", "Mistério"],
        quote: "A profundidade dos grandes livros e a sensibilidade rara que traduzem o indizível com nobreza e inteligência.",
        tag: "✦ Mente Brilhante & Singular ✦"
    },
    {
        numeral: "III",
        title: "L'IMPÉRATRICE",
        sub: "A IMPERATRIZ",
        icon: "fa-solid fa-crown",
        keywords: ["Elegância", "Nobreza", "Graça", "Autenticidade"],
        quote: "A personificação da beleza soberana e da elegância natural: você reina em delicadeza, afeto e presença.",
        tag: "✦ Soberania da Graça ✦"
    },
    {
        numeral: "XXI",
        title: "LE MONDE",
        sub: "O MUNDO",
        icon: "fa-solid fa-earth-americas",
        keywords: ["Plenitude", "Harmonia", "Universo", "Abraço"],
        quote: "A totalidade cósmica: encontrar em você um refúgio de paz onde o tempo desacelera e tudo faz sentido.",
        tag: "✦ Infinito em um Olhar ✦"
    },
    {
        numeral: "X",
        title: "LA ROUE DE FORTUNE",
        sub: "A RODA DA FORTUNA",
        icon: "fa-solid fa-timeline",
        keywords: ["Sincronicidade", "Jung", "Ciclos", "Tempo Certo"],
        quote: "O universo conspirou por séculos para que nossas trajetórias se encontrassem na sincronia mais perfeita.",
        tag: "✦ Gravidade Quântica ✦"
    },
    {
        numeral: "XIV",
        title: "LA TEMPÉRANCE",
        sub: "A TEMPERANÇA",
        icon: "fa-solid fa-wand-magic-sparkles",
        keywords: ["Calmaria", "Alquimia", "Ressonância", "Paz"],
        quote: "A alquimia da sua presença: uma tranquilidade que conforta o coração e desperta o melhor em mim.",
        tag: "✦ Frequência 1000Hz ✦"
    },
    {
        numeral: "I",
        title: "LE BATELEUR",
        sub: "O MAGO",
        icon: "fa-solid fa-feather-pointed",
        keywords: ["Criação", "Inspiração", "Arte", "Começo"],
        quote: "A faísca mágica que transforma instantes simples em poesia viva. Estar contigo desperta a minha melhor versão.",
        tag: "✦ O Poder da Inspiração ✦"
    },
    {
        numeral: "VIII",
        title: "LA FORCE",
        sub: "A FORÇA",
        icon: "fa-solid fa-gem",
        keywords: ["Suavidade", "Coragem", "Carinho", "Constância"],
        quote: "A verdadeira força não impõe; ela acolhe com paciência e vence qualquer tempestade com doçura.",
        tag: "✦ Coragem Gentil ✦"
    },
    {
        numeral: "IX",
        title: "L'HERMITE",
        sub: "O EREMITA",
        icon: "fa-solid fa-feather",
        keywords: ["Reflexão", "Luz Interior", "Poesia", "Essência"],
        quote: "A lanterna que ilumina a busca pelo que é essencial: a beleza das conversas sinceras e da cumplicidade.",
        tag: "✦ Luz Guia ✦"
    },
    {
        numeral: "0",
        title: "LE MAT",
        sub: "O VIAJANTE DAS ESTRELAS",
        icon: "fa-solid fa-compass",
        keywords: ["Coragem", "Liberdade", "Aventura", "Salto de Fé"],
        quote: "A coragem de se lançar nas histórias mais bonitas da vida sem medo de sentir o afeto por inteiro.",
        tag: "✦ Salto Estelar ✦"
    }
];

let currentTarotIndex = 0;
let isTarotFlipped = false;

function selectTarotCard(cardIdx) {
    const miniCards = document.querySelectorAll('.tarot-mini-card');
    miniCards.forEach((c, idx) => {
        if (idx === cardIdx) {
            c.classList.add('active-card');
        } else {
            c.classList.remove('active-card');
        }
    });

    const chosenArcanumIndex = cardIdx % tarotArcana.length;
    revealTarotArcanum(chosenArcanumIndex);
}

function revealTarotArcanum(index) {
    currentTarotIndex = index;
    const arcanum = tarotArcana[index];
    const card3D = document.getElementById('tarot-card');
    if (!card3D) return;

    // Atualizar dados
    document.getElementById('tarot-numeral').textContent = arcanum.numeral;
    document.getElementById('tarot-arcane-title').textContent = arcanum.title;
    document.getElementById('tarot-arcane-sub').textContent = arcanum.sub;
    document.getElementById('tarot-quote').textContent = `"${arcanum.quote}"`;
    document.getElementById('tarot-tag').textContent = arcanum.tag;

    // Ícone do Arcano
    const glyphEl = document.getElementById('tarot-glyph');
    if (glyphEl) {
        glyphEl.innerHTML = `<i class="${arcanum.icon}"></i>`;
    }

    // Keywords
    const keywordsEl = document.getElementById('tarot-keywords');
    if (keywordsEl) {
        keywordsEl.innerHTML = arcanum.keywords.map(kw => `<span>${kw}</span>`).join('');
    }

    // Fazer a animação de flip
    card3D.classList.add('flipped');
    isTarotFlipped = true;

    // Efeitos de brilho e som
    const rect = card3D.getBoundingClientRect();
    createCelestialStardust(rect.left + rect.width / 2, rect.top + rect.height / 2, 14);
    playChimeSound('tarot');
}

function flipCurrentTarot() {
    const card3D = document.getElementById('tarot-card');
    if (!card3D) return;

    if (card3D.classList.contains('flipped')) {
        card3D.classList.remove('flipped');
        isTarotFlipped = false;
        playChimeSound('tarot-flip');
    } else {
        card3D.classList.add('flipped');
        isTarotFlipped = true;
        const rect = card3D.getBoundingClientRect();
        createCelestialStardust(rect.left + rect.width / 2, rect.top + rect.height / 2, 12);
        playChimeSound('tarot');
    }
}

function drawRandomTarot() {
    let nextIndex;
    do {
        nextIndex = Math.floor(Math.random() * tarotArcana.length);
    } while (nextIndex === currentTarotIndex && tarotArcana.length > 1);

    const shuffleBtn = document.querySelector('.btn-tarot-shuffle');
    if (shuffleBtn) {
        const btnRect = shuffleBtn.getBoundingClientRect();
        createCelestialStardust(btnRect.left + btnRect.width / 2, btnRect.top + btnRect.height / 2, 10);
    }

    const miniCards = document.querySelectorAll('.tarot-mini-card');
    const randomFanIndex = Math.floor(Math.random() * miniCards.length);
    miniCards.forEach((c, idx) => {
        if (idx === randomFanIndex) c.classList.add('active-card');
        else c.classList.remove('active-card');
    });

    const card3D = document.getElementById('tarot-card');
    if (card3D && card3D.classList.contains('flipped')) {
        card3D.classList.remove('flipped');
        playChimeSound('tarot-flip');
        setTimeout(() => {
            revealTarotArcanum(nextIndex);
        }, 450);
    } else {
        revealTarotArcanum(nextIndex);
    }
}

/* ==========================================================================
   8. INTERAÇÃO HOLOGRÁFICA & TILT TÁTIL DO TARÔ (MOBILE & TOUCH)
   ========================================================================== */
function initTarotTouchTilt() {
    const card = document.getElementById('tarot-card');
    if (!card) return;

    function handleMove(clientX, clientY) {
        const rect = card.getBoundingClientRect();
        const x = clientX - rect.left;
        const y = clientY - rect.top;
        const px = Math.max(0, Math.min(1, x / rect.width));
        const py = Math.max(0, Math.min(1, y / rect.height));

        card.style.setProperty('--holo-x', `${(px * 100).toFixed(1)}%`);
        card.style.setProperty('--holo-y', `${(py * 100).toFixed(1)}%`);
        card.style.setProperty('--holo-angle', `${((px - 0.5) * 60).toFixed(1)}deg`);
    }

    card.addEventListener('mousemove', (e) => {
        handleMove(e.clientX, e.clientY);
    });

    card.addEventListener('touchmove', (e) => {
        if (e.touches.length > 0) {
            handleMove(e.touches[0].clientX, e.touches[0].clientY);
        }
    }, { passive: true });

    function resetTilt() {
        card.style.setProperty('--holo-x', '50%');
        card.style.setProperty('--holo-y', '50%');
        card.style.setProperty('--holo-angle', '0deg');
    }

    card.addEventListener('mouseleave', resetTilt);
    card.addEventListener('touchend', () => setTimeout(resetTilt, 600));
}

/* ==========================================================================
   INTERAÇÃO DO SELO DE CERA (FOLHETO 03 • CAPÍTULO III)
   ========================================================================== */
function initWaxSealInteractivity() {
    const seals = document.querySelectorAll('.wax-seal-mini');
    seals.forEach((seal) => {
        seal.addEventListener('click', (e) => {
            const rect = seal.getBoundingClientRect();
            createCelestialStardust(rect.left + rect.width / 2, rect.top + rect.height / 2, 12);
            playChimeSound('seal');
        });
    });
}

/* ==========================================================================
   FILTROS DA GALERIA HAUTE-COUTURE (CAPÍTULO V)
   ========================================================================== */
function filterGallery(category, btnEl) {
    const buttons = document.querySelectorAll('.gallery-filter-btn');
    buttons.forEach(b => b.classList.remove('active'));
    if (btnEl) btnEl.classList.add('active');

    playChimeSound('filter');

    const items = document.querySelectorAll('.polaroid-item');
    items.forEach((item) => {
        const itemCat = item.getAttribute('data-category');
        if (category === 'all' || itemCat === category) {
            item.classList.remove('filter-hidden');
        } else {
            item.classList.add('filter-hidden');
        }
    });
}

/* ==========================================================================
   9. LIGHTBOX MODAL PARA AS FOTOS (TOUCH OPTIMIZED)
   ========================================================================== */
function openLightbox(src, title, desc) {
    const modal = document.getElementById('lightbox');
    const img = document.getElementById('lightbox-img');
    const titleEl = document.getElementById('lightbox-title');
    const descEl = document.getElementById('lightbox-desc');

    if (!modal || !img || !titleEl || !descEl) return;

    img.src = src;
    titleEl.textContent = title;
    descEl.textContent = desc;

    modal.classList.add('active');
    playChimeSound('polaroid');
}

function closeLightbox(e) {
    if (e.target.id === 'lightbox' || e.target.classList.contains('lightbox-close') || e.target.closest('.lightbox-close')) {
        const modal = document.getElementById('lightbox');
        if (modal) modal.classList.remove('active');
    }
}

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        const modal = document.getElementById('lightbox');
        if (modal) modal.classList.remove('active');
    }
});

/* ==========================================================================
   10. SISTEMA DE ÁUDIO AMBIENTE & SINTETIZADOR DUAL (COSMIC & LANA DEL REY)
   ========================================================================== */
let audioCtx = null;
let isMusicPlaying = false;
let musicInterval = null;
let currentSoundTrack = 'cosmic'; // 'cosmic' | 'lana'
let lanaChordIndex = 0;

function initSoundSystem() {
    const musicBtn = document.getElementById('music-toggle');
    if (musicBtn) {
        musicBtn.addEventListener('click', toggleCosmicMusic);
    }
}

function initPopoverCloser() {
    document.addEventListener('click', (e) => {
        const popover = document.getElementById('audio-selector-popover');
        const trigger = document.getElementById('track-selector-btn');
        if (popover && popover.classList.contains('active')) {
            if (!popover.contains(e.target) && !trigger.contains(e.target)) {
                popover.classList.remove('active');
            }
        }
    });
}

function toggleTrackSelector(e) {
    if (e) e.stopPropagation();
    const popover = document.getElementById('audio-selector-popover');
    if (popover) {
        popover.classList.toggle('active');
    }
}

function selectAudioTrack(track) {
    currentSoundTrack = track;
    const btnCosmic = document.getElementById('track-cosmic');
    const btnLana = document.getElementById('track-lana');
    const label = document.getElementById('audio-track-label');

    if (btnCosmic && btnLana) {
        btnCosmic.classList.toggle('active', track === 'cosmic');
        btnLana.classList.toggle('active', track === 'lana');
    }

    if (track === 'lana') {
        if (label && isMusicPlaying) label.textContent = 'Lana (Piano) ♪';
        playLanaNote();
    } else {
        if (label && isMusicPlaying) label.textContent = 'Celestial ♪';
        playGenerativeNote();
    }

    // Fecha o popover
    const popover = document.getElementById('audio-selector-popover');
    if (popover) popover.classList.remove('active');

    // Se estiver tocando, reinicia com a nova atmosfera
    if (isMusicPlaying) {
        if (musicInterval) clearInterval(musicInterval);
        startGenerativeAmbience();
    }
}

function getAudioContext() {
    if (!audioCtx) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        audioCtx = new AudioContext();
    }
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
    return audioCtx;
}

function toggleCosmicMusic() {
    const ctx = getAudioContext();
    const btn = document.getElementById('music-toggle');
    if (!btn) return;

    const label = document.getElementById('audio-track-label') || btn.querySelector('.audio-label');

    if (!isMusicPlaying) {
        isMusicPlaying = true;
        if (label) label.textContent = currentSoundTrack === 'lana' ? 'Lana (Piano) ♪' : 'Tocando ♪';
        btn.classList.add('is-playing');
        startGenerativeAmbience();
    } else {
        isMusicPlaying = false;
        if (label) label.textContent = 'Trilha Sonora';
        btn.classList.remove('is-playing');
        
        if (musicInterval) {
            clearInterval(musicInterval);
            musicInterval = null;
        }
    }
}

/* --- TRILHA 1: SINOS CÓSMICOS & HARPAS PENTATÔNICAS --- */
const cosmicNotes = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25, 587.33, 659.25];

function playGenerativeNote() {
    if (!isMusicPlaying || !audioCtx) return;
    
    const note = cosmicNotes[Math.floor(Math.random() * cosmicNotes.length)];
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(note, audioCtx.currentTime);

    gain.gain.setValueAtTime(0.001, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.035, audioCtx.currentTime + 1.2);
    gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 4.5);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start();
    osc.stop(audioCtx.currentTime + 4.6);
}

/* --- TRILHA 2: LANA DEL REY (PIANO LÍRICO & CORDAS VINTAGE) --- */
/* Progressão cinematográfica nostálgica (Dm -> Bb -> F -> C) */
const lanaChords = [
    { root: 146.83, notes: [293.66, 349.23, 440.00, 587.33] }, // Dm
    { root: 116.54, notes: [233.08, 293.66, 349.23, 466.16] }, // Bb
    { root: 174.61, notes: [261.63, 349.23, 440.00, 523.25] }, // F
    { root: 130.81, notes: [196.00, 261.63, 329.63, 392.00] }  // C
];

function playLanaNote() {
    if (!isMusicPlaying || !audioCtx) return;

    const chord = lanaChords[lanaChordIndex % lanaChords.length];
    lanaChordIndex++;
    const now = audioCtx.currentTime;

    // 1. Baixo aveludado (warm cello/bass drone)
    const bassOsc = audioCtx.createOscillator();
    const bassGain = audioCtx.createGain();
    bassOsc.type = 'triangle';
    bassOsc.frequency.setValueAtTime(chord.root, now);
    bassGain.gain.setValueAtTime(0.001, now);
    bassGain.gain.exponentialRampToValueAtTime(0.04, now + 0.8);
    bassGain.gain.exponentialRampToValueAtTime(0.0001, now + 4.2);
    bassOsc.connect(bassGain);
    bassGain.connect(audioCtx.destination);
    bassOsc.start(now);
    bassOsc.stop(now + 4.3);

    // 2. Arpejo de Piano Vintage (Rhodes/felt style com ataque delicado)
    chord.notes.forEach((freq, idx) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        const filter = audioCtx.createBiquadFilter();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.28);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(1200, now);

        gain.gain.setValueAtTime(0.001, now + idx * 0.28);
        gain.gain.exponentialRampToValueAtTime(0.045, now + idx * 0.28 + 0.08);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.28 + 3.2);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(audioCtx.destination);

        osc.start(now + idx * 0.28);
        osc.stop(now + idx * 0.28 + 3.3);
    });
}

function startGenerativeAmbience() {
    if (currentSoundTrack === 'lana') {
        playLanaNote();
        musicInterval = setInterval(() => {
            playLanaNote();
        }, 3400);
    } else {
        playGenerativeNote();
        musicInterval = setInterval(() => {
            if (Math.random() > 0.35) {
                playGenerativeNote();
            }
        }, 2000);
    }
}

function playChimeSound(type = 'tarot') {
    try {
        const ctx = getAudioContext();
        const now = ctx.currentTime;

        if (type === 'tarot') {
            // Harpa Pentatônica de Arcanos Cósmicos (Brilho e Afeto)
            const notes = [523.25, 659.25, 783.99, 1046.50];
            notes.forEach((freq, i) => {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.type = i === 3 ? 'triangle' : 'sine';
                osc.frequency.setValueAtTime(freq, now + i * 0.07);
                gain.gain.setValueAtTime(0.045, now + i * 0.07);
                gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.07 + 1.6);
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.start(now + i * 0.07);
                osc.stop(now + i * 0.07 + 1.65);
            });
        } else if (type === 'tarot-flip') {
            // Som suave de virar a lâmina mística
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(440, now);
            osc.frequency.exponentialRampToValueAtTime(659.25, now + 0.22);
            gain.gain.setValueAtTime(0.05, now);
            gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.7);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(now);
            osc.stop(now + 0.72);
        } else if (type === 'polaroid') {
            // Cristal etéreo & clique delicado de lente vintage
            const osc = ctx.createOscillator();
            const osc2 = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(587.33, now);
            osc2.type = 'sine';
            osc2.frequency.setValueAtTime(1174.66, now);
            gain.gain.setValueAtTime(0.055, now);
            gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.2);
            osc.connect(gain);
            osc2.connect(gain);
            gain.connect(ctx.destination);
            osc.start(now);
            osc2.start(now);
            osc.stop(now + 1.25);
            osc2.stop(now + 1.25);
        } else if (type === 'filter') {
            // Sino de cristal sutil ao filtrar fotos
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(698.46, now);
            gain.gain.setValueAtTime(0.04, now);
            gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.55);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(now);
            osc.stop(now + 0.58);
        } else if (type === 'seal') {
            // Ressonância aveludada do selo de cera
            const chord = [261.63, 392.00, 523.25];
            chord.forEach((freq, idx) => {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.type = 'sine';
                osc.frequency.setValueAtTime(freq, now + idx * 0.05);
                gain.gain.setValueAtTime(0.05, now + idx * 0.05);
                gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.05 + 1.8);
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.start(now + idx * 0.05);
                osc.stop(now + idx * 0.05 + 1.85);
            });
        } else {
            playChime(550);
        }
    } catch (e) {}
}

function playChime(freq = 550) {
    try {
        const ctx = getAudioContext();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(freq * 1.4, ctx.currentTime + 0.3);

        gain.gain.setValueAtTime(0.06, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.6);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start();
        osc.stop(ctx.currentTime + 0.6);
    } catch (e) {}
}

function playHarmonicChord() {
    try {
        const ctx = getAudioContext();
        const chord = [329.63, 392.00, 493.88, 587.33];
        chord.forEach((freq, idx) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.08);
            gain.gain.setValueAtTime(0.04, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 2.5);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(ctx.currentTime + idx * 0.08);
            osc.stop(ctx.currentTime + 2.6);
        });
    } catch (e) {}
}

/* ==========================================================================
   11. SCROLLSPY AUTOMÁTICO PARA O DOCK INFERIOR MOBILE
   ========================================================================== */
function initMobileDockScrollSpy() {
    const dockItems = document.querySelectorAll('.dock-item');
    if (!dockItems.length) return;

    const sections = document.querySelectorAll('header[id], section[id], footer[id]');
    if (!('IntersectionObserver' in window)) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                const currentId = entry.target.getAttribute('id');
                dockItems.forEach((item) => {
                    const itemSection = item.getAttribute('data-section');
                    if (itemSection === currentId) {
                        item.classList.add('active');
                    } else {
                        item.classList.remove('active');
                    }
                });
            }
        });
    }, {
        rootMargin: '-25% 0px -65% 0px',
        threshold: 0
    });

    sections.forEach((section) => observer.observe(section));
}

/* ==========================================================================
   12. CRONÔMETRO CÓSMICO DE EXISTÊNCIA (DESDE 13 DE JUNHO DE 2006)
   ========================================================================== */
function initCosmicChronometer() {
    const elDays = document.getElementById('chrono-days');
    const elHours = document.getElementById('chrono-hours');
    const elMins = document.getElementById('chrono-mins');
    const elSecs = document.getElementById('chrono-secs');
    const elHighlight = document.getElementById('chrono-days-highlight');

    if (!elDays || !elHours || !elMins || !elSecs) return;

    // Data de nascimento de Ale: 13 de Junho de 2006 (00:00:00 GMT-0300)
    const birthDate = new Date('2006-06-13T00:00:00-03:00').getTime();

    function updateChronometer() {
        const now = new Date().getTime();
        const diff = Math.max(0, now - birthDate);

        const totalSeconds = Math.floor(diff / 1000);
        const days = Math.floor(totalSeconds / (3600 * 24));
        const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
        const mins = Math.floor((totalSeconds % 3600) / 60);
        const secs = totalSeconds % 60;

        elDays.textContent = days.toLocaleString('pt-BR');
        elHours.textContent = String(hours).padStart(2, '0');
        elMins.textContent = String(mins).padStart(2, '0');
        elSecs.textContent = String(secs).padStart(2, '0');

        if (elHighlight) {
            elHighlight.textContent = days.toLocaleString('pt-BR');
        }
    }

    updateChronometer();
    setInterval(updateChronometer, 1000);
}
