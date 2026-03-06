/* ============================
   BIRTHDAY WEBSITE — SCRIPT.JS
   Interactive logic & animations
   ============================ */

// ---- DOM ELEMENTS ----
const sections = document.querySelectorAll('.section');
const envelope = document.getElementById('envelope');
const envelopeWrapper = document.getElementById('envelope-wrapper');
const greetingNext = document.getElementById('greeting-next');
const messagesNext = document.getElementById('messages-next');
const galleryNext = document.getElementById('gallery-next');
const restartBtn = document.getElementById('restart-btn');
const musicToggle = document.getElementById('music-toggle');
const audio = document.getElementById('birthday-audio');
const particlesCanvas = document.getElementById('particles-canvas');
const typedTextEl = document.getElementById('typed-text');
const landingSection = document.getElementById('landing');

let currentSection = 0;
let isTransitioning = false;

// ---- BIRTH TIMER LOGIC ----
const birthDate = new Date('2003-03-07T19:00:00');

function updateBirthTimer() {
    const now = new Date();
    let diff = now - birthDate;

    let years = now.getFullYear() - birthDate.getFullYear();
    let months = now.getMonth() - birthDate.getMonth();
    let days = now.getDate() - birthDate.getDate();
    let hours = now.getHours() - birthDate.getHours();
    let minutes = now.getMinutes() - birthDate.getMinutes();
    let seconds = now.getSeconds() - birthDate.getSeconds();

    // Adjust for negative values
    if (seconds < 0) { seconds += 60; minutes--; }
    if (minutes < 0) { minutes += 60; hours--; }
    if (hours < 0) { hours += 24; days--; }
    if (days < 0) {
        const lastMonth = new Date(now.getFullYear(), now.getMonth(), 0);
        days += lastMonth.getDate();
        months--;
    }
    if (months < 0) { months += 12; years--; }

    // Update DOM
    const elements = {
        years: document.getElementById('timer-years'),
        months: document.getElementById('timer-months'),
        days: document.getElementById('timer-days'),
        hours: document.getElementById('timer-hours'),
        minutes: document.getElementById('timer-minutes'),
        seconds: document.getElementById('timer-seconds')
    };

    if (elements.years) elements.years.textContent = years.toString().padStart(2, '0');
    if (elements.months) elements.months.textContent = months.toString().padStart(2, '0');
    if (elements.days) elements.days.textContent = days.toString().padStart(2, '0');
    if (elements.hours) elements.hours.textContent = hours.toString().padStart(2, '0');
    if (elements.minutes) elements.minutes.textContent = minutes.toString().padStart(2, '0');
    if (elements.seconds) elements.seconds.textContent = seconds.toString().padStart(2, '0');
}

// ---- MIDNIGHT CELEBRATION LOGIC ----
let birthdayCelebrated = false;

function checkMidnightStatus() {
    const now = new Date();
    const currentYear = now.getFullYear();
    const midnight = new Date(currentYear, 2, 7, 0, 0, 0); // March 7th, 00:00:00

    // If it's already March 7th but before the birth time (7pm)
    const isBirthdayDay = now.getMonth() === 2 && now.getDate() === 7;

    const overlay = document.getElementById('midnight-celebration');
    const countdownEl = document.getElementById('midnight-countdown');
    const wishYearsText = document.getElementById('wish-years-text');

    if (now < midnight) {
        // COUNTDOWN PHASE (Show overlay if within 1 hour or manually triggered)
        const diff = midnight - now;
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const secs = Math.floor((diff % (1000 * 60)) / 1000);

        if (countdownEl) {
            countdownEl.textContent = `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        }

        // Auto-show overlay in the last 60 seconds
        if (diff <= 60000 && !overlay.classList.contains('active')) {
            overlay.classList.add('active');
        }

        if (wishYearsText) wishYearsText.textContent = "Almost 23 Years";
    } else if (isBirthdayDay) {
        // CELEBRATION PHASE
        if (!birthdayCelebrated) {
            triggerMidnightCelebration();
            birthdayCelebrated = true;
        }
        if (wishYearsText) wishYearsText.textContent = "23 Years";
    }
}

function triggerMidnightCelebration() {
    const overlay = document.getElementById('midnight-celebration');
    const title = document.getElementById('celebration-title');
    const countdown = document.getElementById('midnight-countdown');
    const subtext = document.getElementById('celebration-subtext');

    overlay.classList.add('active', 'birthday-is-here');
    title.textContent = "IT'S OFFICIALLY YOUR BIRTHDAY!";
    countdown.textContent = "MARCH 7th";
    subtext.textContent = "Let the magic begin, Chandana! ✨";

    // Confetti burst
    fireFinaleConfetti();

    // Close overlay after 10 seconds
    setTimeout(() => {
        overlay.classList.remove('active');
    }, 10000);
}

// Start timer interval
setInterval(() => {
    updateBirthTimer();
    checkMidnightStatus();
}, 1000);

// Initialize components
document.addEventListener('DOMContentLoaded', () => {
    initParticles();
    initFireflies();
    updateBirthTimer();
    checkMidnightStatus();
});

// ---- SECTION NAVIGATION ----
function goToSection(index) {
    if (isTransitioning || index === currentSection) return;
    isTransitioning = true;

    sections[currentSection].classList.remove('active');
    currentSection = index;
    sections[currentSection].classList.add('active');

    setTimeout(() => {
        triggerSectionAnimations(currentSection);
        isTransitioning = false;
    }, 400);
}

function triggerSectionAnimations(sectionIndex) {
    switch (sectionIndex) {
        case 1: fireConfetti(); startTypedText(); break;
        case 2: animateCards(); break;
        case 3: animateGallery(); break;
        case 4: fireFinaleConfetti(); startFloatingHearts(); animateChild(); break;
    }
}

// ---- ENVELOPE INTERACTION ----
if (envelopeWrapper) {
    envelopeWrapper.addEventListener('click', () => {
        if (envelope.classList.contains('open')) return;

        // Stage 1: Brighten candles and levitate envelope
        landingSection.classList.add('brighten');
        envelope.classList.add('levitate');

        const tapHint = document.getElementById('tap-hint');
        if (tapHint) tapHint.style.opacity = '0';

        // Stage 2: Open envelope with golden light
        setTimeout(() => {
            envelope.classList.remove('levitate');
            envelope.classList.add('open');
            fireGoldenBurst();
        }, 1200);

        // Stage 3: Transition to greeting
        setTimeout(() => goToSection(1), 3200);
    });
}

function fireGoldenBurst() {
    const colors = ['#ffd700', '#ffaa00', '#ffffff', '#ffde4a'];
    confetti({
        particleCount: 100,
        spread: 70,
        origin: { x: 0.5, y: 0.5 },
        colors: colors,
        ticks: 300,
        gravity: 0.4,
        scalar: 1.2,
        drift: 0,
        shapes: ['circle']
    });
}

// ---- FIREFLIES ----
function initFireflies() {
    const container = document.getElementById('fireflies-container');
    if (!container) return;

    const count = 20;
    for (let i = 0; i < count; i++) {
        const firefly = document.createElement('div');
        firefly.className = 'firefly';

        // Random start position
        firefly.style.left = Math.random() * 100 + '%';
        firefly.style.top = Math.random() * 100 + '%';

        // Random drift destination
        const x = (Math.random() - 0.5) * 400 + 'px';
        const y = (Math.random() - 0.5) * 400 + 'px';
        firefly.style.setProperty('--x', x);
        firefly.style.setProperty('--y', y);

        // Random duration and delay
        firefly.style.animationDuration = (8 + Math.random() * 12) + 's';
        firefly.style.animationDelay = (Math.random() * 5) + 's';

        container.appendChild(firefly);
    }
}

// ---- BUTTON NAVIGATION ----
greetingNext.addEventListener('click', () => goToSection(2));
messagesNext.addEventListener('click', () => goToSection(3));
galleryNext.addEventListener('click', () => goToSection(4));
restartBtn.addEventListener('click', () => {
    // Reset Envelope
    if (envelope) {
        envelope.classList.remove('open', 'levitate');
    }
    if (landingSection) {
        landingSection.classList.remove('brighten');
    }
    const tapHint = document.getElementById('tap-hint');
    if (tapHint) tapHint.style.opacity = '1';

    const heart = document.getElementById('heart-scene');
    if (heart) heart.style.opacity = '0';

    document.querySelectorAll('.message-card').forEach(card => card.classList.remove('visible'));
    document.querySelectorAll('.gallery-item').forEach(item => item.classList.remove('visible'));
    document.getElementById('floating-hearts').innerHTML = '';

    // Reset child character
    const child = document.getElementById('child-character');
    if (child) child.classList.remove('animate-in');
    const petals = document.getElementById('rose-petals');
    if (petals) petals.innerHTML = '';

    typedTextEl.textContent = '';
    goToSection(0);
});

// ---- CONFETTI ----
function fireConfetti() {
    const duration = 3000;
    const end = Date.now() + duration;
    const colors = ['#ff6fd8', '#cf3bff', '#6f5bff', '#ffd700', '#ff9a56', '#3baaff'];

    (function frame() {
        confetti({ particleCount: 3, angle: 60, spread: 80, origin: { x: 0, y: 0.7 }, colors, ticks: 200, gravity: 0.8, scalar: 1.2, drift: 0.5 });
        confetti({ particleCount: 3, angle: 120, spread: 80, origin: { x: 1, y: 0.7 }, colors, ticks: 200, gravity: 0.8, scalar: 1.2, drift: -0.5 });
        if (Date.now() < end) requestAnimationFrame(frame);
    })();

    setTimeout(() => {
        confetti({ particleCount: 120, spread: 100, origin: { y: 0.6 }, colors, ticks: 300, gravity: 0.6, scalar: 1.5 });
    }, 300);
}

function fireFinaleConfetti() {
    const colors = ['#ff6fd8', '#cf3bff', '#ffd700', '#ff4444', '#ff9a56'];
    for (let i = 0; i < 5; i++) {
        setTimeout(() => {
            confetti({ particleCount: 60, spread: 360, origin: { x: Math.random(), y: Math.random() * 0.5 + 0.2 }, colors, ticks: 250, gravity: 0.5, scalar: 1.3, shapes: ['circle', 'square'] });
        }, i * 500);
    }
    setTimeout(() => {
        confetti({ particleCount: 80, spread: 160, origin: { y: 0.5 }, colors: ['#ffd700', '#ffec8b'], ticks: 400, gravity: 0.3, scalar: 2, shapes: ['star'] });
    }, 800);
}

// ---- TYPED TEXT EFFECT ----
function startTypedText() {
    const text = "Dear Chandana, wishing you a day filled with love, laughter & all the happiness in the world! 🎉";
    let index = 0;
    typedTextEl.textContent = '';
    function typeChar() {
        if (index < text.length) {
            typedTextEl.textContent += text[index];
            index++;
            setTimeout(typeChar, 40 + Math.random() * 30);
        }
    }
    setTimeout(typeChar, 1200);
}

// ---- MESSAGE CARD ANIMATIONS ----
function animateCards() {
    document.querySelectorAll('.message-card').forEach((card, i) => {
        const delay = parseInt(card.dataset.delay) || i * 200;
        setTimeout(() => card.classList.add('visible'), delay + 200);
    });
}

// ---- GALLERY ANIMATIONS ----
function animateGallery() {
    document.querySelectorAll('.gallery-item').forEach((item, i) => {
        const delay = parseInt(item.dataset.delay) || i * 150;
        setTimeout(() => item.classList.add('visible'), delay + 200);
    });
}

// ---- FLOATING HEARTS ----
function startFloatingHearts() {
    const container = document.getElementById('floating-hearts');
    const hearts = ['❤️', '💖', '💕', '💗', '💝', '✨', '⭐', '🌟'];
    let count = 0;
    const maxHearts = 30;

    function createHeart() {
        if (count >= maxHearts) return;
        const heart = document.createElement('span');
        heart.className = 'floating-heart';
        heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
        heart.style.left = Math.random() * 100 + '%';
        heart.style.fontSize = (Math.random() * 1.5 + 0.8) + 'rem';
        heart.style.animationDuration = (Math.random() * 3 + 3) + 's';
        heart.style.animationDelay = '0s';
        container.appendChild(heart);
        count++;
        setTimeout(() => { heart.remove(); count--; }, 6000);
    }

    const heartInterval = setInterval(createHeart, 400);
    setTimeout(() => clearInterval(heartInterval), 15000);
}

// ---- ANIMATED CHILD CHARACTER ----
function animateChild() {
    const child = document.getElementById('child-character');
    if (!child) return;

    // Trigger walk-in after a short delay
    setTimeout(() => {
        child.classList.add('animate-in');
    }, 1000);

    // Spawn rose petals after the child arrives and speech bubble appears
    setTimeout(() => {
        spawnRosePetals();
    }, 3500);
}

function spawnRosePetals() {
    const container = document.getElementById('rose-petals');
    if (!container) return;
    const petals = ['🌹', '🥀', '🌸', '💮', '🏵️'];
    let petalCount = 0;
    const maxPetals = 15;

    function dropPetal() {
        if (petalCount >= maxPetals) return;
        const petal = document.createElement('span');
        petal.className = 'rose-petal';
        petal.textContent = petals[Math.floor(Math.random() * petals.length)];
        petal.style.left = (Math.random() * 80 + 10) + 'px';
        petal.style.fontSize = (Math.random() * 0.6 + 0.7) + 'rem';
        petal.style.animationDuration = (Math.random() * 2 + 2.5) + 's';
        petal.style.animationDelay = '0s';
        container.appendChild(petal);
        petalCount++;
        setTimeout(() => petal.remove(), 5000);
    }

    const petalInterval = setInterval(dropPetal, 350);
    setTimeout(() => clearInterval(petalInterval), 8000);
}

// ---- MUSIC TOGGLE ----
let musicPlaying = false;
musicToggle.addEventListener('click', () => {
    if (musicPlaying) {
        audio.pause();
        musicToggle.classList.remove('playing');
        musicToggle.querySelector('.music-status').textContent = 'OFF';
    } else {
        audio.play().catch(() => console.log('Audio autoplay blocked'));
        musicToggle.classList.add('playing');
        musicToggle.querySelector('.music-status').textContent = 'ON';
    }
    musicPlaying = !musicPlaying;
});

// ==============================
//  STARFIELD BACKGROUND
// ==============================
function initStarfield() {
    const canvas = document.getElementById('starfield-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let stars = [];
    let shootingStars = [];

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    class Star {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 0.3;
            this.twinkleSpeed = Math.random() * 0.02 + 0.005;
            this.opacity = Math.random();
            this.growing = Math.random() > 0.5;
            const hues = [0, 30, 200, 270, 330];
            this.hue = hues[Math.floor(Math.random() * hues.length)];
            this.saturation = Math.random() * 40 + 10;
        }
        update() {
            if (this.growing) {
                this.opacity += this.twinkleSpeed;
                if (this.opacity >= 1) this.growing = false;
            } else {
                this.opacity -= this.twinkleSpeed;
                if (this.opacity <= 0.1) this.growing = true;
            }
        }
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `hsla(${this.hue}, ${this.saturation}%, 90%, ${this.opacity})`;
            ctx.fill();
            if (this.size > 1.2) {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size * 4, 0, Math.PI * 2);
                ctx.fillStyle = `hsla(${this.hue}, ${this.saturation}%, 80%, ${this.opacity * 0.08})`;
                ctx.fill();
            }
        }
    }

    class ShootingStar {
        constructor() { this.reset(); }
        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height * 0.4;
            this.speed = Math.random() * 8 + 4;
            this.angle = Math.PI / 4 + (Math.random() - 0.5) * 0.3;
            this.opacity = 1;
            this.active = true;
            this.trail = [];
        }
        update() {
            if (!this.active) return;
            this.x += Math.cos(this.angle) * this.speed;
            this.y += Math.sin(this.angle) * this.speed;
            this.opacity -= 0.015;
            this.trail.push({ x: this.x, y: this.y, opacity: this.opacity });
            if (this.trail.length > 15) this.trail.shift();
            if (this.opacity <= 0 || this.x > canvas.width || this.y > canvas.height) this.active = false;
        }
        draw() {
            if (!this.active) return;
            for (let i = 0; i < this.trail.length; i++) {
                const t = this.trail[i];
                const o = (i / this.trail.length) * t.opacity * 0.6;
                ctx.beginPath();
                ctx.arc(t.x, t.y, 1.5 * (i / this.trail.length), 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255, 255, 255, ${o})`;
                ctx.fill();
            }
            ctx.beginPath();
            ctx.arc(this.x, this.y, 2, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
            ctx.fill();
            ctx.beginPath();
            ctx.arc(this.x, this.y, 6, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(200, 200, 255, ${this.opacity * 0.15})`;
            ctx.fill();
        }
    }

    const starCount = Math.min(200, Math.floor(canvas.width * canvas.height / 5000));
    for (let i = 0; i < starCount; i++) stars.push(new Star());

    setInterval(() => {
        if (shootingStars.length < 2) shootingStars.push(new ShootingStar());
    }, 3000 + Math.random() * 4000);

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        stars.forEach(s => { s.update(); s.draw(); });
        shootingStars = shootingStars.filter(s => s.active);
        shootingStars.forEach(s => { s.update(); s.draw(); });
        requestAnimationFrame(animate);
    }
    animate();
}

// ==============================
//  PARTICLES BACKGROUND
// ==============================
function initParticles() {
    const canvas = particlesCanvas;
    const ctx = canvas.getContext('2d');
    let particles = [];

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    class Particle {
        constructor() { this.reset(); }
        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2.5 + 0.5;
            this.speedX = (Math.random() - 0.5) * 0.4;
            this.speedY = (Math.random() - 0.5) * 0.4;
            this.opacity = Math.random() * 0.5 + 0.1;
            this.fadeSpeed = Math.random() * 0.005 + 0.002;
            this.growing = Math.random() > 0.5;
            const colors = [[255, 111, 216], [207, 59, 255], [111, 91, 255], [255, 215, 0], [59, 170, 255]];
            this.color = colors[Math.floor(Math.random() * colors.length)];
        }
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            if (this.growing) { this.opacity += this.fadeSpeed; if (this.opacity >= 0.6) this.growing = false; }
            else { this.opacity -= this.fadeSpeed; if (this.opacity <= 0.05) this.growing = true; }
            if (this.x < 0) this.x = canvas.width;
            if (this.x > canvas.width) this.x = 0;
            if (this.y < 0) this.y = canvas.height;
            if (this.y > canvas.height) this.y = 0;
        }
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${this.color[0]}, ${this.color[1]}, ${this.color[2]}, ${this.opacity})`;
            ctx.fill();
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size * 3, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${this.color[0]}, ${this.color[1]}, ${this.color[2]}, ${this.opacity * 0.15})`;
            ctx.fill();
        }
    }

    const count = Math.min(80, Math.floor(window.innerWidth * window.innerHeight / 15000));
    for (let i = 0; i < count; i++) particles.push(new Particle());

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => { p.update(); p.draw(); });
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 120) {
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(207, 59, 255, ${0.06 * (1 - dist / 120)})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
        }
        requestAnimationFrame(animate);
    }
    animate();
}

// ---- INITIALIZE ----
document.addEventListener('DOMContentLoaded', () => {
    initStarfield();
    initParticles();
});
