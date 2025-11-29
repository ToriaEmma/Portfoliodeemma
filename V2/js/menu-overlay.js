/* ========================================
   MENU OVERLAY CONTROLLER
   Handles menu opening/closing
   ======================================== */

document.addEventListener('DOMContentLoaded', function () {
    const hamburgerBtn = document.querySelector('.hamburger-button');
    const closeBtn = document.querySelector('.close-btn');
    const menuOverlay = document.querySelector('.menu-overlay');
    const menuNav = document.querySelector('.menu-nav');
    const menuContact = document.querySelector('.menu-contact');

    if (!hamburgerBtn || !closeBtn || !menuOverlay) {
        console.warn('Menu elements not found');
        return;
    }

    function closeMenu() {
        menuOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    // Open menu
    hamburgerBtn.addEventListener('click', function () {
        menuOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    });

    // Close menu button
    closeBtn.addEventListener('click', closeMenu);

    // Close when clicking on overlay background (not on content)
    menuOverlay.addEventListener('click', function (e) {
        // Check if click is directly on the overlay (not on children)
        if (e.target === menuOverlay) {
            closeMenu();
        }
    });

    // Prevent clicks on menu content from closing
    if (menuNav) {
        menuNav.addEventListener('click', function (e) {
            e.stopPropagation();
        });
    }

    if (menuContact) {
        menuContact.addEventListener('click', function (e) {
            e.stopPropagation();
        });
    }

    // Close on escape key
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && menuOverlay.classList.contains('active')) {
            closeMenu();
        }
    });

    // Close when clicking on a navigation link
    const menuLinks = menuOverlay.querySelectorAll('.menu-nav a');
    menuLinks.forEach(link => {
        link.addEventListener('click', function () {
            // Small delay to allow transition to start
            setTimeout(closeMenu, 100);
        });
    });
});
