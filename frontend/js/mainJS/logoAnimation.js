// Enhanced Logo Animation - Smooth, cozy transitions for WITH café
const createLogoAnimation = (logoSelector) => {
    const logo = document.querySelector(logoSelector);
    if (!logo) return;
    
    const logoTop = logo.querySelector('.logo-top');
    const logoBottom = logo.querySelector('.logo-bottom');
    
    const names = [
        'brød <span class="accent">&</span> kaffe',
        'bok <span class="accent">&</span> kaffe',
        'brunsj <span class="accent">&</span> kaffe'
    ];
    
    let currentIndex = 0;
    let isAnimating = false;
    
    const animateCycle = () => {
        if (isAnimating) return;
        isAnimating = true;
        
        // Phase 1: Gently lift WITH with elastic easing
        logoTop.style.transition = 'transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)';
        logoTop.style.transform = 'translateY(-12px)';
        
        // Phase 2: Fade in first location name with slide up
        setTimeout(() => {
            logoBottom.style.transition = 'opacity 0.5s ease-out, transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)';
            logoBottom.innerHTML = names[0];
            logoBottom.style.opacity = '1';
            logoBottom.style.transform = 'translateX(-50%) translateY(0)';
        }, 350);
        
        // Phase 3: Cycle through location names with crossfade
        setTimeout(() => {
            let cycleCount = 1;
            const totalCycles = names.length;
            
            const cycleInterval = setInterval(() => {
                if (cycleCount >= totalCycles) {
                    clearInterval(cycleInterval);
                    
                    // Phase 4: Elegant exit - fade out and return WITH to center
                    setTimeout(() => {
                        logoBottom.style.transition = 'opacity 0.4s ease-in, transform 0.4s ease-in';
                        logoBottom.style.opacity = '0';
                        logoBottom.style.transform = 'translateX(-50%) translateY(8px)';
                        
                        setTimeout(() => {
                            logoTop.style.transition = 'transform 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
                            logoTop.style.transform = 'translateY(0)';
                            
                            setTimeout(() => {
                                currentIndex = 0;
                                isAnimating = false;
                                // Reset bottom text position for next cycle
                                logoBottom.style.transform = 'translateX(-50%) translateY(8px)';
                            }, 700);
                        }, 150);
                    }, 1800);
                    return;
                }
                
                // Crossfade effect: fade out current, fade in next
                logoBottom.style.transition = 'opacity 0.35s ease-in-out, transform 0.35s ease-in-out';
                logoBottom.style.opacity = '0';
                logoBottom.style.transform = 'translateX(-50%) translateY(-4px)';
                
                setTimeout(() => {
                    // Update text while invisible
                    currentIndex = (currentIndex + 1) % names.length;
                    logoBottom.innerHTML = names[currentIndex];
                    logoBottom.style.transform = 'translateX(-50%) translateY(4px)';
                    
                    // Fade in with gentle bounce
                    setTimeout(() => {
                        logoBottom.style.transition = 'opacity 0.45s ease-out, transform 0.45s cubic-bezier(0.34, 1.4, 0.64, 1)';
                        logoBottom.style.opacity = '1';
                        logoBottom.style.transform = 'translateX(-50%) translateY(0)';
                    }, 50);
                }, 350);
                
                cycleCount++;
            }, 2000);
        }, 1600);
    };
    
    return animateCycle;
};

// Initialize animations with staggered timing
const initLogoAnimations = () => {
    // Header animation - starts first
    const headerAnimation = createLogoAnimation('header .logo');
    if (headerAnimation) {
        setTimeout(() => {
            headerAnimation();
            setInterval(headerAnimation, 15000); // Slightly longer for comfortable reading
        }, 1500);
    }
    
    // Footer animation - elegantly staggered
    const footerAnimation = createLogoAnimation('footer .footer-logo');
    if (footerAnimation) {
        setTimeout(() => {
            footerAnimation();
            setInterval(footerAnimation, 15000);
        }, 9000); // Offset creates visual interest without overwhelming
    }
};

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initLogoAnimations);
} else {
    initLogoAnimations();
}