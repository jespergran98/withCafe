// Logo Animation - Cycles through café names with smooth vertical centering
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
        
        // Phase 1: Move WITH up and prepare for text
        logoTop.style.transform = 'translateY(-14px)';
        
        // Phase 2: Show first subtitle after WITH moves
        setTimeout(() => {
            logoBottom.innerHTML = names[0];
            logoBottom.style.opacity = '1';
            logoBottom.style.transform = 'translateY(0)';
        }, 400);
        
        // Phase 3: Cycle through remaining names
        setTimeout(() => {
            let cycleCount = 1;
            const totalCycles = names.length;
            
            const cycleInterval = setInterval(() => {
                if (cycleCount >= totalCycles) {
                    clearInterval(cycleInterval);
                    
                    // Phase 4: Hide text and return WITH to center
                    setTimeout(() => {
                        logoBottom.style.opacity = '0';
                        logoBottom.style.transform = 'translateY(8px)';
                        
                        setTimeout(() => {
                            logoTop.style.transform = 'translateY(0)';
                            
                            setTimeout(() => {
                                currentIndex = 0;
                                isAnimating = false;
                            }, 700);
                        }, 100);
                    }, 1500);
                    return;
                }
                
                // Fade out current name
                logoBottom.style.opacity = '0';
                logoBottom.style.transform = 'translateY(-6px)';
                
                setTimeout(() => {
                    // Update text while invisible
                    currentIndex = (currentIndex + 1) % names.length;
                    logoBottom.innerHTML = names[currentIndex];
                    logoBottom.style.transform = 'translateY(6px)';
                    
                    // Fade in new name
                    setTimeout(() => {
                        logoBottom.style.opacity = '1';
                        logoBottom.style.transform = 'translateY(0)';
                    }, 50);
                }, 400);
                
                cycleCount++;
            }, 1800);
        }, 1500);
    };
    
    return animateCycle;
};

// Initialize animations
const initLogoAnimations = () => {
    // Header animation
    const headerAnimation = createLogoAnimation('header .logo');
    if (headerAnimation) {
        setTimeout(() => {
            headerAnimation();
            setInterval(headerAnimation, 14000);
        }, 2000);
    }
    
    // Footer animation
    const footerAnimation = createLogoAnimation('footer .footer-logo');
    if (footerAnimation) {
        // Stagger footer animation to start later
        setTimeout(() => {
            footerAnimation();
            setInterval(footerAnimation, 14000);
        }, 9000);
    }
};

// Initialize when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initLogoAnimations);
} else {
    initLogoAnimations();
}