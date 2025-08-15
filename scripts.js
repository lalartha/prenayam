// Wait for DOM to be fully loaded before running any JavaScript
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing website...');
    
    // Mobile navigation toggle
    const navToggleButton = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    if (navToggleButton && navMenu) {
        navToggleButton.addEventListener('click', () => {
            const isOpen = navMenu.classList.toggle('open');
            navToggleButton.setAttribute('aria-expanded', String(isOpen));
        });
    }

    // Music Language Toggle Functionality
    let currentMusicLanguage = 'malayalam'; // Default language
    const musicLanguages = ['malayalam', 'tamil'];
    const musicLanguageNames = {
        malayalam: 'മലയാളം',
        tamil: 'தமிழ்'
    };

    // Separate music playlists for each language
    const malayalamTracks = [
        { title: 'Varamanjalaadiya', src: 'assets/varamanjalaadiya.mp3' },
        { title: 'Nilaavinte Neelabhasma', src: 'assets/nilaavinte-neelabhasma.mp3' },
        { title: 'Avani Ponnunjal Aadikamkottaram', src: 'assets/avani-ponnunjal-aadikamkottaram.mp3' },
        { title: 'Ariyathe Ariyathe', src: 'assets/ariyathe-ariyathe.mp3' },
        { title: 'Ambalappuzhe Unnikkannanodu', src: 'assets/ambalappuzhe-unnikkannanodu.mp3' },
        { title: 'Aaro Viral Neetti', src: 'assets/aaro-viral-neetti.mp3' }
    ];

    const tamilTracks = [
        { title: 'Venilave Venilave', src: 'assets/venilave-venilave.mp3' },
        { title: 'Rasathi Unnai', src: 'assets/rasathi-unnai.mp3' },
        { title: 'Akkam Pakkam', src: 'assets/akkam-pakkam.mp3' },
        { title: 'Enna Solla Pogirai', src: 'assets/enna-solla-pogirai.mp3' },
        { title: 'Ennodu Nee Irunthal', src: 'assets/ennodu-nee-irunthal.mp3' },
        { title: 'Kochadaiiyaan Manamaganin Sathiyam', src: 'assets/kochadaiiyaan-manamaganin-sathiyam.mp3' },
        { title: 'Mariyan Innum Konjam Neram', src: 'assets/mariyan-innum-konjam-neram.mp3' },
        { title: 'Saami Kitta Solli', src: 'assets/saami-kitta-solli.mp3' },
        { title: 'Unnai Kaanadhu Naan', src: 'assets/unnai-kaanadhu-naan.mp3' },
        { title: 'Vaseegara', src: 'assets/vaseegara.mp3' },

    ];

    let tracks = malayalamTracks; // Current active playlist
    let currentIndex = 0;
    let isShuffling = false;

    // Audio player functionality
    const audioEl = document.getElementById('player');
    const rainAudioEl = document.getElementById('rain-audio');
    const playBtn = document.getElementById('play-btn');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const skipBackwardBtn = document.getElementById('skip-backward-btn');
    const skipForwardBtn = document.getElementById('skip-forward-btn');
    const shuffleBtn = document.getElementById('shuffle-btn');
    const titleEl = document.getElementById('track-title');
    const volumeSlider = document.getElementById('volume');
    const rainToggle = document.getElementById('rain-toggle');
    const rainAudioToggle = document.getElementById('rain-audio-toggle');
    const langToggle = document.getElementById('lang-toggle');
    const langText = document.querySelector('.lang-text');

    // Debug logging
    console.log('Audio elements found:', {
        audioEl: !!audioEl,
        titleEl: !!titleEl,
        playBtn: !!playBtn,
        tracks: tracks.length
    });

    function loadTrack(index) {
        const track = tracks[index];
        if (!track) {
            console.error('No track found at index:', index);
            if (titleEl) titleEl.textContent = 'No track';
            return;
        }
        if (!audioEl || !titleEl) {
            console.error('Audio or title element not found');
            return;
        }
        
        console.log('Loading track:', track.title, 'from:', track.src);
        
        // Fade out the title first
        if (titleEl) {
            titleEl.style.opacity = '0';
        }
        
        // Update the title after a brief fade
        setTimeout(() => {
            if (titleEl) {
                titleEl.textContent = track.title;
                titleEl.style.opacity = '1';
            }
        }, 150);
        
        audioEl.src = track.src;
        audioEl.currentTime = 0;
        audioEl.load();
        
        // Add error handling for audio loading
        audioEl.addEventListener('error', function() {
            console.error('Error loading audio:', track.src);
            if (titleEl) {
                titleEl.textContent = 'Error: ' + track.title;
                titleEl.style.opacity = '1';
            }
            // Try to load next track after a short delay
            setTimeout(() => {
                if (currentIndex < tracks.length - 1) {
                    currentIndex++;
                    loadTrack(currentIndex);
                }
            }, 2000);
        }, { once: true });
    }

    function play() {
        if (!audioEl) return;
        audioEl.play().then(() => {
            if (playBtn) playBtn.textContent = '⏸︎';
        }).catch(err => {
            console.error("Playback failed:", err);
        });
    }

    function pause() {
        if (!audioEl) return;
        audioEl.pause();
        if (playBtn) playBtn.textContent = '▶︎';
    }

    function togglePlay() {
        if (!audioEl) return;
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

    function skipBackward() {
        if (!audioEl) return;
        if (audioEl.currentTime > 10) {
            audioEl.currentTime -= 10;
        } else {
            audioEl.currentTime = 0;
        }
    }

    function skipForward() {
        if (!audioEl) return;
        if (audioEl.duration && audioEl.currentTime < audioEl.duration - 10) {
            audioEl.currentTime += 10;
        } else {
            audioEl.currentTime = audioEl.duration || 0;
        }
    }

    function updateMusicLanguage(lang) {
        currentMusicLanguage = lang;
        
        // Update language button text
        if (langText) {
            langText.textContent = musicLanguageNames[lang];
        }
        
        // Switch to appropriate playlist
        if (lang === 'malayalam') {
            tracks = malayalamTracks;
        } else if (lang === 'tamil') {
            tracks = tamilTracks;
        }
        
        // Reset to first track of new language
        currentIndex = 0;
        loadTrack(currentIndex);
        
        // Store current music language preference
        localStorage.setItem('prenayam.musicLanguage', lang);
    }

    // Initialize audio player
    if (audioEl && titleEl) {
        // Set initial volume
        if (volumeSlider) {
            audioEl.volume = Number(volumeSlider.value);
        } else {
            audioEl.volume = 0.8;
        }
        
        // Add smooth transition for track titles
        titleEl.style.transition = 'opacity 0.3s ease-in-out';
        
        // Load the first track
        if (tracks.length > 0) {
            loadTrack(currentIndex);
        } else {
            titleEl.textContent = 'No tracks available';
        }
        
        // Add event listeners
        if (playBtn) playBtn.addEventListener('click', togglePlay);
        if (prevBtn) prevBtn.addEventListener('click', prev);
        if (nextBtn) nextBtn.addEventListener('click', next);
        if (skipBackwardBtn) skipBackwardBtn.addEventListener('click', skipBackward);
        if (skipForwardBtn) skipForwardBtn.addEventListener('click', skipForward);
        if (shuffleBtn) {
            shuffleBtn.addEventListener('click', () => {
                isShuffling = !isShuffling;
                shuffleBtn.setAttribute('aria-pressed', String(isShuffling));
            });
        }
        if (volumeSlider) {
            volumeSlider.addEventListener('input', () => {
                audioEl.volume = Number(volumeSlider.value);
            });
        }
        audioEl.addEventListener('ended', next);
        audioEl.addEventListener('error', () => {
            const bad = tracks[currentIndex];
            titleEl.textContent = 'Could not load: ' + (bad?.title || (audioEl.currentSrc?.split('/').pop() || 'audio file'));
            if (playBtn) playBtn.textContent = '▶︎';
            const start = currentIndex;
            for (let i = 0; i < tracks.length - 1; i++) {
                currentIndex = (currentIndex + 1) % tracks.length;
                if (currentIndex === start) break;
                loadTrack(currentIndex);
                audioEl.play().catch(() => {});
                break;
            }
        });
    } else {
        console.error('Audio player elements not found');
    }

    // Initialize music language toggle
    if (langToggle) {
        // Load saved music language preference
        const savedMusicLanguage = localStorage.getItem('prenayam.musicLanguage');
        if (savedMusicLanguage && musicLanguages.includes(savedMusicLanguage)) {
            updateMusicLanguage(savedMusicLanguage);
        }
        
        // Add click handler
        langToggle.addEventListener('click', () => {
            const currentIndex = musicLanguages.indexOf(currentMusicLanguage);
            const nextIndex = (currentIndex + 1) % musicLanguages.length;
            updateMusicLanguage(musicLanguages[nextIndex]);
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
            if (navMenu) navMenu.classList.remove('open');
            if (navToggleButton) navToggleButton.setAttribute('aria-expanded', 'false');
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
    const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const heroImg = document.querySelector('.hero-media img');
    if (heroImg && !reduceMotion) {
        window.addEventListener('scroll', () => {
            const scrolled = window.scrollY;
            const shift = Math.min(scrolled * 0.06, 60);
            heroImg.style.transform = `translateY(${shift}px) scale(1.05)`;
        }, { passive: true });
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
        if (!rainCanvas) return;
        drops = Array.from({ length: 180 }, () => ({
            x: Math.random() * rainCanvas.width,
            y: Math.random() * rainCanvas.height,
            len: 10 + Math.random() * 18,
            speed: 3 + Math.random() * 6,
            opacity: 0.2 + Math.random() * 0.5,
        }));
    }

    function drawRain() {
        if (!ctx || !rainActive || !rainCanvas) return;
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

    if (rainToggle) {
        rainToggle.addEventListener('click', () => {
            const pressed = rainToggle.getAttribute('aria-pressed') === 'true';
            const next = !pressed;
            rainToggle.setAttribute('aria-pressed', String(next));
            enableRainVisuals(next);
        });
    }

    if (rainAudioToggle) {
        rainAudioToggle.addEventListener('click', () => {
            const pressed = rainAudioToggle.getAttribute('aria-pressed') === 'true';
            const next = !pressed;
            rainAudioToggle.setAttribute('aria-pressed', String(next));
            if (next && rainAudioEl) {
                rainAudioEl.volume = 0.3; // Set rain audio to lower volume
                rainAudioEl.play().catch(() => {}); 
            } else if (rainAudioEl) {
                rainAudioEl.pause();
            }
        });
    }

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
        if (!notesList) return;
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

    if (noteForm) {
        noteForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const newNote = { title: noteTitle.value.trim(), body: noteBody.value.trim(), ts: Date.now() };
            const notes = loadLocalNotes();
            notes.unshift(newNote);
            saveLocalNotes(notes);
            noteTitle.value = '';
            noteBody.value = '';
            renderNotes();
        });
    }

    renderNotes();
    
    console.log('Website initialization complete!');
});


