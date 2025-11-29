/* ========================================
   BOOK NAVIGATION LOGIC
   Page-turning system with swipe support
   ======================================== */

class BookNavigation {
    constructor() {
        this.currentPage = 0;
        this.totalPages = 0;
        this.isAnimating = false;
        this.pagesSpreads = [];
        this.touchStartX = 0;
        this.touchEndX = 0;

        this.init();
    }

    init() {
        // Get all page spreads
        this.pageSpreads = document.querySelectorAll('.page-spread');
        this.totalPages = this.pageSpreads.length;

        if (this.totalPages === 0) return;

        // Show first page
        this.showPage(0);

        // Setup navigation buttons
        this.setupButtons();

        // Setup page indicators
        this.setupIndicators();

        // Setup touch/swipe
        this.setupSwipe();

        // Setup keyboard navigation
        this.setupKeyboard();
    }

    setupButtons() {
        const prevBtn = document.getElementById('prev-btn');
        const nextBtn = document.getElementById('next-btn');

        if (prevBtn) {
            prevBtn.addEventListener('click', () => this.prevPage());
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => this.nextPage());
        }

        this.updateButtons();
    }

    setupIndicators() {
        const indicator = document.querySelector('.page-indicator');
        if (!indicator) return;

        // Clear existing dots
        indicator.innerHTML = '';

        // Create dots
        for (let i = 0; i < this.totalPages; i++) {
            const dot = document.createElement('div');
            dot.className = `page-dot ${i === 0 ? 'active' : ''}`;
            dot.addEventListener('click', () => this.goToPage(i));
            indicator.appendChild(dot);
        }
    }

    setupSwipe() {
        const book = document.querySelector('.book');
        if (!book) return;

        book.addEventListener('touchstart', (e) => {
            this.touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        book.addEventListener('touchend', (e) => {
            this.touchEndX = e.changedTouches[0].screenX;
            this.handleSwipe();
        }, { passive: true });
    }

    handleSwipe() {
        const swipeThreshold = 50;
        const diff = this.touchStartX - this.touchEndX;

        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                // Swipe left - next page
                this.nextPage();
            } else {
                // Swipe right - prev page
                this.prevPage();
            }
        }
    }

    setupKeyboard() {
        document.addEventListener('keydown', (e) => {
            if (this.isAnimating) return;

            if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
                e.preventDefault();
                this.nextPage();
            } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
                e.preventDefault();
                this.prevPage();
            }
        });
    }

    showPage(index) {
        if (index < 0 || index >= this.totalPages) return;

        const currentSpread = this.pageSpreads[this.currentPage];
        const newSpread = this.pageSpreads[index];

        // Create color gradient overlay
        this.createColorTransition(() => {
            if (currentSpread) {
                currentSpread.classList.remove('active');
            }

            newSpread.classList.add('active');
            this.currentPage = index;
            this.updateIndicators();
            this.updateButtons();
            this.updatePageNumbers();
            this.isAnimating = false;
        });
    }

    createColorTransition(callback) {
        // Create gradient overlay element
        const overlay = document.createElement('div');
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 9999;
            pointer-events: none;
        `;

        // Color sequence for gradient (clean girl palette)
        const colors = [
            '#E8B4B8', // Rose poudré
            '#F5E6E8', // Beige rosé
            '#C8D5B9', // Vert sauge
            '#FDFCFA', // Blanc cassé
            '#E8D4E0'  // Rose lunaire (night)
        ];

        // Create gradient stripes (HORIZONTAL)
        let gradientStops = '';
        const stripeWidth = 100 / colors.length;
        colors.forEach((color, i) => {
            const start = i * stripeWidth;
            const end = (i + 1) * stripeWidth;
            gradientStops += `${color} ${start}%, ${color} ${end}%${i < colors.length - 1 ? ', ' : ''}`;
        });

        overlay.style.background = `linear-gradient(to right, ${gradientStops})`;
        overlay.style.transform = 'translateX(-100%)';
        overlay.style.transition = 'transform 0.8s cubic-bezier(0.65, 0, 0.35, 1)';

        document.body.appendChild(overlay);

        // Animate from left to right
        requestAnimationFrame(() => {
            overlay.style.transform = 'translateX(0)';
        });

        // Switch content at midpoint
        setTimeout(() => {
            callback();
        }, 400);

        // Continue to the right
        setTimeout(() => {
            overlay.style.transform = 'translateX(100%)';
        }, 400);

        // Remove overlay
        setTimeout(() => {
            overlay.remove();
        }, 1200);
    }

    nextPage() {
        if (this.isAnimating || this.currentPage >= this.totalPages - 1) return;
        this.isAnimating = true;
        this.showPage(this.currentPage + 1);
        this.playPageTurnSound();
    }

    prevPage() {
        if (this.isAnimating || this.currentPage <= 0) return;
        this.isAnimating = true;
        this.showPage(this.currentPage - 1);
        this.playPageTurnSound();
    }

    goToPage(index) {
        if (this.isAnimating || index === this.currentPage) return;
        this.isAnimating = true;
        this.showPage(index);
        this.playPageTurnSound();
    }

    updateIndicators() {
        const dots = document.querySelectorAll('.page-dot');
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === this.currentPage);
        });
    }

    updateButtons() {
        const prevBtn = document.getElementById('prev-btn');
        const nextBtn = document.getElementById('next-btn');

        if (prevBtn) {
            prevBtn.disabled = this.currentPage === 0;
        }

        if (nextBtn) {
            nextBtn.disabled = this.currentPage === this.totalPages - 1;
        }
    }

    updatePageNumbers() {
        const leftNumbers = document.querySelectorAll('.page-number.left');
        const rightNumbers = document.querySelectorAll('.page-number.right');

        const leftPage = this.currentPage * 2 + 1;
        const rightPage = this.currentPage * 2 + 2;

        leftNumbers.forEach(num => num.textContent = leftPage);
        rightNumbers.forEach(num => num.textContent = rightPage);
    }

    playPageTurnSound() {
        // Subtle page turn sound (to be added)
        const audio = new Audio('assets/sounds/page-turn.mp3');
        audio.volume = 0.2;
        audio.play().catch(() => { }); // Ignore autoplay errors
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.bookNav = new BookNavigation();
});
