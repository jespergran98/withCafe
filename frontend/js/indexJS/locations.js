/**
 * Locations Section - Elegant scroll animations
 */

(function() {
    'use strict';

    const CONFIG = {
        threshold: 0.15,
        staggerDelay: 150,
        rootMargin: '-80px'
    };

    let hasAnimated = false;


    /**
     * Initialize location animations
     */
    function init() {
        const section = document.querySelector('.locations');
        if (!section) return;

        // Wait for images to load before initializing animations, with timeout fallback
        const imageLoadPromise = preloadImages();
        const timeoutPromise = new Promise(resolve => setTimeout(resolve, 2000)); // 2 second max wait

        Promise.race([imageLoadPromise, timeoutPromise]).then(() => {
            observeCards();
            addParallaxDecoration();
        });
    }

    /**
     * Preload all location images
     */
    function preloadImages() {
        const images = document.querySelectorAll('.location-image img');
        if (!images.length) return Promise.resolve();

        const imagePromises = Array.from(images).map(img => {
            return new Promise((resolve) => {
                if (img.complete) {
                    resolve();
                } else {
                    img.addEventListener('load', resolve);
                    img.addEventListener('error', resolve); // Resolve even on error to not block animation
                }
            });
        });

        return Promise.all(imagePromises);
    }

    /**
     * Animate cards on scroll into view
     */
    function observeCards() {
        const cards = document.querySelectorAll('.location-card');
        if (!cards.length) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !hasAnimated) {
                    cards.forEach((card, i) => {
                        setTimeout(() => {
                            card.classList.add('animate-in');
                        }, i * CONFIG.staggerDelay);
                    });
                    hasAnimated = true;
                    observer.disconnect();
                }
            });
        }, {
            threshold: CONFIG.threshold,
            rootMargin: CONFIG.rootMargin
        });

        observer.observe(cards[0]);
    }

    /**
     * Add subtle parallax to decoration blob
     */
    function addParallaxDecoration() {
        const decoration = document.querySelector('.locations-decoration');
        const section = document.querySelector('.locations');
        if (!decoration || !section) return;

        let ticking = false;

        window.addEventListener('scroll', () => {
            if (ticking) return;
            
            ticking = true;
            requestAnimationFrame(() => {
                const rect = section.getBoundingClientRect();
                const viewportHeight = window.innerHeight;
                
                // Only animate when section is in view
                if (rect.top < viewportHeight && rect.bottom > 0) {
                    const scrollProgress = (viewportHeight - rect.top) / (viewportHeight + rect.height);
                    const offset = scrollProgress * 100;
                    decoration.style.transform = `translateY(${offset}px) rotate(${offset * 0.2}deg)`;
                }
                
                ticking = false;
            });
        });
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();