// Mobile navigation toggle
const navToggleButton = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');
if (navToggleButton && navMenu) {
	navToggleButton.addEventListener('click', () => {
		const isOpen = navMenu.classList.toggle('open');
		navToggleButton.setAttribute('aria-expanded', String(isOpen));
	});
}

// Smooth scroll for in-page links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
	anchor.addEventListener('click', evt => {
		const targetId = anchor.getAttribute('href');
		if (!targetId || targetId === '#') return;
		const target = document.querySelector(targetId);
		if (!target) return;
		evt.preventDefault();
		target.scrollIntoView({ behavior: 'smooth', block: 'start' });
		// Close mobile menu on navigation
		navMenu?.classList.remove('open');
		navToggleButton?.setAttribute('aria-expanded', 'false');
	});
});

// Intersection-based reveal animations
const animated = document.querySelectorAll('[data-animate]');
if (animated.length) {
	const observer = new IntersectionObserver((entries) => {
		entries.forEach(entry => {
			if (entry.isIntersecting) {
				const el = entry.target;
				const delay = el.getAttribute('data-animate-delay');
				if (delay) {
					setTimeout(() => el.classList.add('animate-in'), parseInt(delay, 10));
				} else {
					el.classList.add('animate-in');
				}
				observer.unobserve(el);
			}
		});
	}, { threshold: 0.2 });

	animated.forEach(el => observer.observe(el));
}

// Dynamic year in footer
const yearEl = document.getElementById('year');
if (yearEl) {
	yearEl.textContent = String(new Date().getFullYear());
}

// Optional: Simple parallax effect for hero image
// Moves background image subtly based on scroll to create depth
const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const heroImg = document.querySelector('.hero-media img');
if (heroImg && !reduceMotion) {
	window.addEventListener('scroll', () => {
		const scrolled = window.scrollY;
		// Limit shift for performance and subtlety
		const shift = Math.min(scrolled * 0.06, 60);
		heroImg.style.transform = `translateY(${shift}px) scale(1.05)`;
	}, { passive: true });
}

// Audio player with playlist
// Audio player with playlist
const tracks = [
    { title: 'Rasathi Unnai', src: 'assets/rasathi-unnai.mp3' },
    { title: 'Akkam Pakkam', src: 'assets/akkam-pakkam.mp3' },
    { title: 'Venilave Venilave', src: 'assets/venilave-venilave.mp3' }
];
let currentIndex = 0;
let isShuffling = false;

const audioEl = document.getElementById('player');
const rainAudioEl = document.getElementById('rain-audio');
const playBtn = document.getElementById('play-btn');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const shuffleBtn = document.getElementById('shuffle-btn');
const titleEl = document.getElementById('track-title');
const volumeSlider = document.getElementById('volume');
const rainToggle = document.getElementById('rain-toggle');
const rainAudioToggle = document.getElementById('rain-audio-toggle');

function loadTrack(index) {
    const track = tracks[index];
    if (!track) return;
    audioEl.src = track.src;
    titleEl.textContent = track.title;
    audioEl.currentTime = 0; // reset to start
    audioEl.load(); // ensure the file is loaded before playing
}

function play() {
    audioEl.play().then(() => {
        playBtn.textContent = '⏸︎';
    }).catch(err => {
        console.error("Playback failed:", err);
    });
}

function pause() {
    audioEl.pause();
    playBtn.textContent = '▶︎';
}

function togglePlay() {
    if (audioEl.paused) {
        play();
    } else {
        pause();
    }
}

function next() {
    if (isShuffling) {
        currentIndex = Math.floor(Math.random() * tracks.length);
    } else {
        currentIndex = (currentIndex + 1) % tracks.length;
    }
    loadTrack(currentIndex);
    play();
}

function prev() {
    currentIndex = (currentIndex - 1 + tracks.length) % tracks.length;
    loadTrack(currentIndex);
    play();
}

if (audioEl) {
    loadTrack(currentIndex);
    // Initialize volume from slider for immediate effect
    if (volumeSlider) {
        audioEl.volume = Number(volumeSlider.value);
    } else {
        audioEl.volume = 0.8;
    }
    playBtn?.addEventListener('click', togglePlay);
    prevBtn?.addEventListener('click', prev);
    nextBtn?.addEventListener('click', next);
    shuffleBtn?.addEventListener('click', () => {
        isShuffling = !isShuffling;
        shuffleBtn.setAttribute('aria-pressed', String(isShuffling));
    });
    volumeSlider?.addEventListener('input', () => {
        audioEl.volume = Number(volumeSlider.value);
    });
    audioEl.addEventListener('ended', next);
    audioEl.addEventListener('error', () => {
        const bad = tracks[currentIndex];
        titleEl.textContent = 'Could not load: ' + (bad?.title || (audioEl.currentSrc?.split('/').pop() || 'audio file'));
        playBtn.textContent = '▶︎';
        // Try to skip to next available track to keep the flow
        const start = currentIndex;
        for (let i = 0; i < tracks.length - 1; i++) {
            currentIndex = (currentIndex + 1) % tracks.length;
            if (currentIndex === start) break;
            loadTrack(currentIndex);
            // Attempt to play; if it errors again, handler will run again
            audioEl.play().catch(() => {});
            break;
        }
    });

    // Playlist UI removed per request
}

// Rain visuals (canvas) and sound toggles
const rainCanvas = document.getElementById('rain-canvas');
const ctx = rainCanvas?.getContext('2d');
let rainActive = false;
let drops = [];

function resizeCanvas() {
	if (!rainCanvas) return;
	rainCanvas.width = window.innerWidth;
	rainCanvas.height = window.innerHeight;
}

function createRain() {
	drops = Array.from({ length: 180 }, () => ({
		x: Math.random() * rainCanvas.width,
		y: Math.random() * rainCanvas.height,
		len: 10 + Math.random() * 18,
		speed: 3 + Math.random() * 6,
		opacity: 0.2 + Math.random() * 0.5,
	}));
}

function drawRain() {
	if (!ctx || !rainActive) return;
	ctx.clearRect(0, 0, rainCanvas.width, rainCanvas.height);
	ctx.strokeStyle = 'rgba(255,255,255,0.6)';
	ctx.lineWidth = 1;
	drops.forEach(d => {
		ctx.globalAlpha = d.opacity;
		ctx.beginPath();
		ctx.moveTo(d.x, d.y);
		ctx.lineTo(d.x, d.y + d.len);
		ctx.stroke();
		d.y += d.speed;
		if (d.y > rainCanvas.height) {
			d.y = -20; d.x = Math.random() * rainCanvas.width;
		}
	});
	requestAnimationFrame(drawRain);
}

function enableRainVisuals(enable) {
	rainActive = enable;
	if (rainCanvas) {
		rainCanvas.style.opacity = enable ? '0.9' : '0';
		if (enable) {
			resizeCanvas();
			createRain();
			requestAnimationFrame(drawRain);
		}
	}
}

rainToggle?.addEventListener('click', () => {
	const pressed = rainToggle.getAttribute('aria-pressed') === 'true';
	const next = !pressed;
	rainToggle.setAttribute('aria-pressed', String(next));
	enableRainVisuals(next);
});

rainAudioToggle?.addEventListener('click', () => {
	const pressed = rainAudioToggle.getAttribute('aria-pressed') === 'true';
	const next = !pressed;
	rainAudioToggle.setAttribute('aria-pressed', String(next));
	if (next) rainAudioEl?.play().catch(() => {}); else rainAudioEl?.pause();
});

window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// Notes: local first, optional sync
const noteForm = document.getElementById('note-form');
const noteTitle = document.getElementById('note-title');
const noteBody = document.getElementById('note-body');
const notesList = document.getElementById('notes-list');

function loadLocalNotes() {
	try {
		const raw = localStorage.getItem('prenayam.notes');
		return raw ? JSON.parse(raw) : [];
	} catch { return []; }
}
function saveLocalNotes(notes) {
	localStorage.setItem('prenayam.notes', JSON.stringify(notes));
}
function renderNotes() {
	const notes = loadLocalNotes();
	notesList.innerHTML = '';
	notes.forEach((n, i) => {
		const div = document.createElement('div');
		div.className = 'note-item';
		div.innerHTML = `<h3>${n.title || 'Untitled'}</h3><div>${n.body?.replace(/\n/g,'<br/>') || ''}</div>`;
		const actions = document.createElement('div');
		actions.className = 'note-actions';
		const del = document.createElement('button');
		del.textContent = 'Delete';
		del.className = 'player-btn';
		del.addEventListener('click', () => {
			const all = loadLocalNotes();
			all.splice(i, 1);
			saveLocalNotes(all);
			renderNotes();
		});
		actions.appendChild(del);
		div.appendChild(actions);
		notesList.appendChild(div);
	});
}

noteForm?.addEventListener('submit', (e) => {
	e.preventDefault();
	const newNote = { title: noteTitle.value.trim(), body: noteBody.value.trim(), ts: Date.now() };
	const notes = loadLocalNotes();
	notes.unshift(newNote);
	saveLocalNotes(notes);
	noteTitle.value = '';
	noteBody.value = '';
	renderNotes();
	// TODO: optional sync if signed in
});

renderNotes();


