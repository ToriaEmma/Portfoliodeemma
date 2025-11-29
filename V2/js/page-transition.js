/* ========================================
   PAGE TRANSITION HELPER
   Horizontal Color Gradient Transitions
   ======================================== */

class PageTransition {
    static navigate(url) {
        // Create gradient overlay element
        const overlay = document.createElement('div');
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 99999;
            pointer-events: none;
        `;

        // Color sequence for gradient (clean girl palette)
        const colors = [
            '#E8B4B8', // Rose poudré
            '#F5E6E8', // Beige rosé
            '#C8D5B9', // Vert sauge
            '#FDFCFA', // Blanc cassé
            '#E8D4E0'  // Rose lunaire
        ];

        // Create horizontal gradient stripes
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

        // Navigate at midpoint
        setTimeout(() => {
            window.location.href = url;
        }, 400);
    }
}

// Make available globally
window.PageTransition = PageTransition;
