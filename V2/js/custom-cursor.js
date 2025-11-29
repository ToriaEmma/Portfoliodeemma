/* ========================================
   CUSTOM CURSOR CONTROLLER
   Handles cursor movement and states
   ======================================== */

class CustomCursor {
    constructor() {
        this.cursor = null;
        this.cursorDot = null;
        this.cursorOuter = null;
        this.isHovering = false;
        this.isClicking = false;

        this.mouse = {
            x: 0,
            y: 0
        };

        this.cursorPos = {
            x: 0,
            y: 0
        };

        this.init();
    }

    init() {
        this.createCursor();
        this.addEventListeners();
        this.animate();
    }

    createCursor() {
        this.cursor = document.createElement('div');
        this.cursor.className = 'custom-cursor';

        // Create flower icon for day theme
        const flowerIcon = document.createElement('div');
        flowerIcon.className = 'cursor-icon-day';
        for (let i = 0; i < 5; i++) {
            const petal = document.createElement('div');
            petal.className = 'petal';
            petal.style.setProperty('--rotation', `${i * 72}deg`);
            flowerIcon.appendChild(petal);
        }

        // Create star icon for night theme
        const starIcon = document.createElement('div');
        starIcon.className = 'cursor-icon-night';
        starIcon.innerHTML = `
            <svg viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
        `;

        // Create cursor elements
        this.cursorDot = document.createElement('div');
        this.cursorDot.className = 'cursor-dot';

        this.cursorOuter = document.createElement('div');
        this.cursorOuter.className = 'cursor-outer';

        this.cursor.appendChild(flowerIcon);
        this.cursor.appendChild(starIcon);
        this.cursor.appendChild(this.cursorDot);
        this.cursor.appendChild(this.cursorOuter);

        document.body.appendChild(this.cursor);
    }

    addEventListeners() {
        // Mouse movement
        document.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;

            // Show cursor
            document.body.classList.remove('cursor-hidden');
        });

        // Mouse leave window
        document.addEventListener('mouseleave', () => {
            document.body.classList.add('cursor-hidden');
        });

        // Click events
        document.addEventListener('mousedown', () => {
            this.isClicking = true;
            this.cursor.classList.add('clicking');
        });

        document.addEventListener('mouseup', () => {
            this.isClicking = false;
            this.cursor.classList.remove('clicking');
        });

        // Hover detection on interactive elements
        const interactiveElements = 'a, button, input, textarea, select, [role="button"], .clickable';

        document.addEventListener('mouseover', (e) => {
            if (e.target.closest(interactiveElements)) {
                this.isHovering = true;
                this.cursor.classList.add('hovering', 'pointer');
            }
        });

        document.addEventListener('mouseout', (e) => {
            if (!e.relatedTarget || !e.relatedTarget.closest(interactiveElements)) {
                this.isHovering = false;
                this.cursor.classList.remove('hovering', 'pointer');
            }
        });

        // Text selection
        document.addEventListener('selectstart', () => {
            this.cursor.classList.add('text-select');
        });

        document.addEventListener('selectionchange', () => {
            const selection = window.getSelection();
            if (!selection || selection.toString().length === 0) {
                this.cursor.classList.remove('text-select');
            }
        });
    }

    animate() {
        // Direct cursor movement for better responsiveness
        this.cursor.style.transform = `translate(${this.mouse.x}px, ${this.mouse.y}px)`;

        requestAnimationFrame(() => this.animate());
    }

    setLoading(isLoading) {
        this.cursor.classList.toggle('loading', isLoading);
    }
}

// Initialize cursor when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Only initialize on non-touch devices
    if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
        window.customCursor = new CustomCursor();
    }
});
