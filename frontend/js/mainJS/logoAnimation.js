// Creative Logo Animation - Dynamic, playful transitions for WITH café
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
        
        // Phase 1: "WITH" rotates and scales up with playful bounce
        logoTop.style.transition = 'transform 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55), opacity 0.4s ease-out';
        logoTop.style.transform = 'translateY(-12px) scale(1.15) rotate(-3deg)';
        
        // Add subtle color shift
        setTimeout(() => {
            logoTop.style.filter = 'brightness(1.1)';
        }, 200);
        
        // Phase 2: First name swoops in from left with rotation
        setTimeout(() => {
            logoBottom.style.transition = 'opacity 0.6s ease-out, transform 0.7s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
            logoBottom.innerHTML = names[0];
            logoBottom.style.opacity = '1';
            logoBottom.style.transform = 'translateX(-50%) translateY(0) rotate(0deg) scale(1)';
        }, 400);
        
        // Phase 3: Cycle through names with creative transitions
        setTimeout(() => {
            let cycleCount = 1;
            const totalCycles = names.length;
            
            const cycleInterval = setInterval(() => {
                if (cycleCount >= totalCycles) {
                    clearInterval(cycleInterval);
                    
                    // Phase 4: Dramatic exit - spin and fade
                    setTimeout(() => {
                        logoBottom.style.transition = 'opacity 0.5s ease-in, transform 0.6s cubic-bezier(0.6, -0.28, 0.735, 0.045)';
                        logoBottom.style.opacity = '0';
                        logoBottom.style.transform = 'translateX(-50%) translateY(20px) rotate(12deg) scale(0.85)';
                        
                        setTimeout(() => {
                            // "WITH" bounces back to center with overshoot
                            logoTop.style.transition = 'transform 0.9s cubic-bezier(0.34, 1.56, 0.64, 1), filter 0.5s ease-out';
                            logoTop.style.transform = 'translateY(0) scale(1) rotate(0deg)';
                            logoTop.style.filter = 'brightness(1)';
                            
                            setTimeout(() => {
                                currentIndex = 0;
                                isAnimating = false;
                                // Reset for next cycle
                                logoBottom.style.transform = 'translateX(-50%) translateY(8px) rotate(0deg) scale(1)';
                            }, 900);
                        }, 200);
                    }, 1600);
                    return;
                }
                
                // Creative transition effects - alternating patterns
                const transitionType = cycleCount % 3;
                
                if (transitionType === 0) {
                    // Flip transition
                    logoBottom.style.transition = 'opacity 0.4s ease-in, transform 0.5s cubic-bezier(0.6, -0.28, 0.735, 0.045)';
                    logoBottom.style.opacity = '0';
                    logoBottom.style.transform = 'translateX(-50%) translateY(0) rotateX(90deg) scale(0.9)';
                } else if (transitionType === 1) {
                    // Zoom out transition
                    logoBottom.style.transition = 'opacity 0.4s ease-in, transform 0.5s cubic-bezier(0.55, 0.055, 0.675, 0.19)';
                    logoBottom.style.opacity = '0';
                    logoBottom.style.transform = 'translateX(-50%) translateY(0) scale(1.4)';
                } else {
                    // Slide with rotation
                    logoBottom.style.transition = 'opacity 0.4s ease-in, transform 0.5s ease-in';
                    logoBottom.style.opacity = '0';
                    logoBottom.style.transform = 'translateX(-30%) translateY(-10px) rotate(-8deg) scale(0.95)';
                }
                
                setTimeout(() => {
                    currentIndex = (currentIndex + 1) % names.length;
                    logoBottom.innerHTML = names[currentIndex];
                    
                    // Set starting position based on transition type
                    if (transitionType === 0) {
                        logoBottom.style.transform = 'translateX(-50%) translateY(0) rotateX(-90deg) scale(0.9)';
                    } else if (transitionType === 1) {
                        logoBottom.style.transform = 'translateX(-50%) translateY(0) scale(0.6)';
                    } else {
                        logoBottom.style.transform = 'translateX(-70%) translateY(10px) rotate(8deg) scale(0.95)';
                    }
                    
                    // Animate in with bounce
                    setTimeout(() => {
                        logoBottom.style.transition = 'opacity 0.5s ease-out, transform 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
                        logoBottom.style.opacity = '1';
                        logoBottom.style.transform = 'translateX(-50%) translateY(0) rotate(0deg) scale(1)';
                    }, 50);
                }, 400);
                
                cycleCount++;
            }, 2200);
        }, 1800);
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