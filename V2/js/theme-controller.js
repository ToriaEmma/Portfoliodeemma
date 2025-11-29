/* ========================================
   THEME TOGGLE & AMBIENT SOUNDS
   Day/Night switching with sounds
   ======================================== */

class ThemeController {
    constructor() {
        this.isDayTheme = true;
        this.daySounds = null;
        this.nightSounds = null;
        this.soundsEnabled = false;

        this.init();
    }

    init() {
        // Check saved theme
        this.loadTheme();

        // Setup toggle button
        this.setupToggleButton();

        // Setup sounds
        this.setupSounds();

        // Apply initial theme
        this.applyTheme(false);
    }

    loadTheme() {
        const savedTheme = localStorage.getItem('theme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

        this.isDayTheme = savedTheme ? savedTheme === 'day' : !prefersDark;
    }

    setupToggleButton() {
        const toggleButton = document.getElementById('theme-toggle');
        if (!toggleButton) return;

        toggleButton.addEventListener('click', () => {
            this.toggleTheme();
        });

        // Update button icon
        this.updateToggleButton();
    }

    setupSounds() {
        // Create audio elements
        this.daySounds = new Audio('assets/sounds/birds-day.mp3');
        this.nightSounds = new Audio('assets/sounds/crickets-night.mp3');

        // Configure sounds
        [this.daySounds, this.nightSounds].forEach(audio => {
            audio.loop = true;
            audio.volume = 0.25;
        });

        // Enable sounds after first user interaction
        document.addEventListener('click', () => {
            if (!this.soundsEnabled) {
                this.soundsEnabled = true;
                this.playSounds();
            }
        }, { once: true });
    }

    toggleTheme() {
        this.isDayTheme = !this.isDayTheme;
        this.applyTheme(true);
        this.saveTheme();
    }

    applyTheme(animated = true) {
        const body = document.body;

        if (this.isDayTheme) {
            body.classList.remove('night-theme');
        } else {
            body.classList.add('night-theme');
        }

        // Update visual elements
        this.updateVisualElements(animated);

        // Update sounds
        if (this.soundsEnabled) {
            this.playSounds();
        }

        // Update toggle button
        this.updateToggleButton();
    }

    updateVisualElements(animated) {
        // Mountains visibility (already handled by CSS)

        // Ambient particles/effects
        this.updateAmbientEffects();

        // Page-specific effects
        this.dispatchThemeChangeEvent();
    }

    updateAmbientEffects() {
        const dayParticles = document.querySelector('.day-particles');
        const nightParticles = document.querySelector('.night-particles');

        if (dayParticles) {
            dayParticles.style.opacity = this.isDayTheme ? '1' : '0';
        }

        if (nightParticles) {
            nightParticles.style.opacity = this.isDayTheme ? '0' : '1';
        }
    }

    playSounds() {
        if (this.isDayTheme) {
            this.fadeOutSound(this.nightSounds);
            this.fadeInSound(this.daySounds);
        } else {
            this.fadeOutSound(this.daySounds);
            this.fadeInSound(this.nightSounds);
        }
    }

    fadeInSound(audio) {
        if (!audio) return;

        audio.volume = 0;
        audio.play().catch(() => { });

        let volume = 0;
        const targetVolume = 0.25;
        const interval = setInterval(() => {
            volume += 0.02;
            if (volume >= targetVolume) {
                volume = targetVolume;
                clearInterval(interval);
            }
            audio.volume = volume;
        }, 50);
    }

    fadeOutSound(audio) {
        if (!audio) return;

        let volume = audio.volume;
        const interval = setInterval(() => {
            volume -= 0.02;
            if (volume <= 0) {
                volume = 0;
                audio.pause();
                clearInterval(interval);
            }
            audio.volume = volume;
        }, 50);
    }

    updateToggleButton() {
        const button = document.getElementById('theme-toggle');
        if (!button) return;

        const icon = button.querySelector('.theme-icon');
        if (!icon) return;

        if (this.isDayTheme) {
            // Show moon icon (to switch to night)
            icon.innerHTML = `
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
                </svg>
            `;
        } else {
            // Show sun icon (to switch to day)
            icon.innerHTML = `
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="5"/>
                    <line x1="12" y1="1" x2="12" y2="3"/>
                    <line x1="12" y1="21" x2="12" y2="23"/>
                    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
                    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
                    <line x1="1" y1="12" x2="3" y2="12"/>
                    <line x1="21" y1="12" x2="23" y2="12"/>
                    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
                    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
                </svg>
            `;
        }
    }

    saveTheme() {
        localStorage.setItem('theme', this.isDayTheme ? 'day' : 'night');
    }

    dispatchThemeChangeEvent() {
        const event = new CustomEvent('themechange', {
            detail: { isDayTheme: this.isDayTheme }
        });
        document.dispatchEvent(event);
    }

    // Public method to toggle sound
    toggleSound() {
        this.soundsEnabled = !this.soundsEnabled;

        if (this.soundsEnabled) {
            this.playSounds();
        } else {
            this.daySounds.pause();
            this.nightSounds.pause();
        }
    }
}

// Initialize theme controller
document.addEventListener('DOMContentLoaded', () => {
    window.themeController = new ThemeController();
});
