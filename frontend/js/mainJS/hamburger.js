// Hamburger Menu Functionality
(function() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-menu a');
    const body = document.body;

    if (!hamburger || !navMenu) return;

    // Toggle menu
    function toggleMenu() {
        const isActive = hamburger.classList.contains('active');
        
        if (isActive) {
            closeMenu();
        } else {
            openMenu();
        }
    }

    // Open menu
    function openMenu() {
        hamburger.classList.add('active');
        navMenu.classList.add('active');
        body.classList.add('menu-open');
        hamburger.setAttribute('aria-expanded', 'true');
    }

    // Close menu
    function closeMenu() {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        body.classList.remove('menu-open');
        hamburger.setAttribute('aria-expanded', 'false');
    }

    // Event listeners
    hamburger.addEventListener('click', toggleMenu);

    // Close menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 640) {
                closeMenu();
            }
        });
    });

    // Close menu when clicking on overlay
    document.addEventListener('click', (e) => {
        if (navMenu.classList.contains('active') && 
            !navMenu.contains(e.target) && 
            !hamburger.contains(e.target)) {
            closeMenu();
        }
    });

    // Close menu on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navMenu.classList.contains('active')) {
            closeMenu();
        }
    });

    // Handle window resize - close menu if resized above mobile breakpoint
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            if (window.innerWidth > 640 && navMenu.classList.contains('active')) {
                closeMenu();
            }
        }, 250);
    });
})();