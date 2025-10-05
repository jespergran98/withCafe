// Clean Marquee functionality
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
        
        // Store original content
        const originalContent = marqueeTrack.innerHTML;
        
        // Create exactly 3 copies for seamless loop (text icon text icon text icon pattern)
        marqueeTrack.innerHTML = originalContent + originalContent + originalContent;
        
        // Optional: Adjust speed based on screen size
        const adjustSpeed = () => {
            const screenWidth = window.innerWidth;
            let duration = 25; // default
            
            if (screenWidth <= 480) {
                duration = 19;
            } else if (screenWidth <= 768) {
                duration = 21;
            } else if (screenWidth <= 1024) {
                duration = 23;
            }
            
            marqueeTrack.style.animationDuration = `${duration}s`;
        };
        
        // Set initial speed
        adjustSpeed();
        
        // Adjust on resize with debounce
        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(adjustSpeed, 200);
        });
    }
})();