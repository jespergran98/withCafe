/**
 * Menu Scroll Animations - Streamlined & Optimized
 * Animates menu categories as they scroll into view
 */

(function() {
    'use strict';

    // Configuration
    const CONFIG = {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px',
        animationClass: 'animate-in'
    };

    // Check for reduced motion preference
    const prefersReducedMotion = () => {
        return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    };

    // Intersection Observer for menu categories
    const observeMenuCategories = () => {
        const menuCategories = document.querySelectorAll('.menu-category');
        
        if (!menuCategories.length) {
            return;
        }

        // If reduced motion, show everything immediately
        if (prefersReducedMotion()) {
            menuCategories.forEach(category => {
                category.classList.add(CONFIG.animationClass);
                category.style.opacity = '1';
                category.style.transform = 'translateY(0)';
            });
            return;
        }

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add(CONFIG.animationClass);
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: CONFIG.threshold,
            rootMargin: CONFIG.rootMargin
        });

        menuCategories.forEach(category => {
            observer.observe(category);
        });
    };

    // Smooth scroll for navigation links
    const initSmoothScroll = () => {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                if (href === '#' || href === '') return;
                
                const target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    target.scrollIntoView({
                        behavior: prefersReducedMotion() ? 'auto' : 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    };

    // Initialize all functionality
    const init = () => {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', init);
            return;
        }

        try {
            observeMenuCategories();
            initSmoothScroll();
        } catch (error) {
            console.error('Error initializing menu:', error);
            
            // Fallback: show all content
            document.querySelectorAll('.menu-category').forEach(category => {
                category.classList.add(CONFIG.animationClass);
                category.style.opacity = '1';
                category.style.transform = 'translateY(0)';
            });
        }
    };

    // Start initialization
    init();

})();