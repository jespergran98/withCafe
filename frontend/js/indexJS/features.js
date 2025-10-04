/**
 * Features Section - Elegant scroll animations
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
     * Initialize feature animations
     */
    function init() {
        const section = document.querySelector('.features');
        if (!section) return;

        observeCards();
    }

    /**
     * Animate cards on scroll into view
     */
    function observeCards() {
        const cards = document.querySelectorAll('.feature-card');
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

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();