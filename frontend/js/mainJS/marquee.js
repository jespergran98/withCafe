// Enhanced Marquee functionality
(function() {
    'use strict';
    
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initMarquee);
    } else {
        initMarquee();
    }
    
    function initMarquee() {
        const marqueeTrack = document.querySelector('.marquee-track');
        
        if (!marqueeTrack) return;
        
        // Clone the marquee content multiple times for seamless loop
        const marqueeContent = marqueeTrack.innerHTML;
        // Create enough duplicates to ensure smooth continuous scroll
        marqueeTrack.innerHTML = marqueeContent + marqueeContent + marqueeContent + marqueeContent;
        
        // Calculate and set optimal animation duration
        const adjustAnimationSpeed = () => {
            const trackWidth = marqueeTrack.scrollWidth / 4; // Divide by number of duplicates
            // Speed calculation: higher divisor = slower speed
            const speed = trackWidth / 50; // Adjusted for smoother speed
            marqueeTrack.style.animationDuration = `${speed}s`;
        };
        
        // Initial speed adjustment
        adjustAnimationSpeed();
        
        // Recalculate on window resize with debouncing
        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(adjustAnimationSpeed, 250);
        });
    }
})();