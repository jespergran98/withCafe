/**
 * Menu Scroll Animations - Redesigned for Grid Layout
 * Animates menu categories as they scroll into view
 */

(function() {
    'use strict';

    // Configuration
    const CONFIG = {
        threshold: 0.1,
        rootMargin: '0px 0px -80px 0px',
        animationClass: 'animate-in',
        staggerDelay: 100
    };

    // Intersection Observer for menu categories
    const observeMenuCategories = () => {
        const menuCategories = document.querySelectorAll('.menu-category');
        
        if (!menuCategories.length) {
            console.warn('No menu categories found to animate');
            return;
        }

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    // Add animation with slight delay
                    setTimeout(() => {
                        entry.target.classList.add(CONFIG.animationClass);
                    }, 50);

                    // Unobserve after animation
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: CONFIG.threshold,
            rootMargin: CONFIG.rootMargin
        });

        // Observe all menu categories
        menuCategories.forEach(category => {
            observer.observe(category);
        });
    };

    // Animate menu items within a category
    const observeMenuItems = () => {
        const menuItems = document.querySelectorAll('.menu-item');
        
        if (!menuItems.length) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }, 100);
                    
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -30px 0px'
        });

        // Set initial state and observe
        menuItems.forEach((item, index) => {
            item.style.opacity = '0';
            item.style.transform = 'translateY(15px)';
            item.style.transition = `all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) ${index * 0.06}s`;
            observer.observe(item);
        });
    };

    // Animate extras on scroll
    const observeExtras = () => {
        const extras = document.querySelectorAll('.extra-item');
        
        if (!extras.length) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'scale(1) translateY(0)';
                    }, 120);
                    
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.2,
            rootMargin: '0px'
        });

        // Set initial state and observe
        extras.forEach((extra, index) => {
            extra.style.opacity = '0';
            extra.style.transform = 'scale(0.92) translateY(8px)';
            extra.style.transition = `all 0.45s cubic-bezier(0.34, 1.56, 0.64, 1) ${index * 0.08}s`;
            observer.observe(extra);
        });
    };

    // Subtle parallax for images
    const addParallaxEffect = () => {
        const menuImages = document.querySelectorAll('.menu-image img');
        
        if (!menuImages.length) return;

        let ticking = false;

        const updateParallax = () => {
            menuImages.forEach(img => {
                const container = img.closest('.menu-category');
                if (!container) return;

                const rect = container.getBoundingClientRect();
                const scrollPercent = (rect.top / window.innerHeight);
                
                // Apply subtle parallax when in viewport
                if (scrollPercent < 1.2 && scrollPercent > -0.2) {
                    const translateY = scrollPercent * 20;
                    img.style.transform = `translateY(${translateY}px)`;
                }
            });
            
            ticking = false;
        };

        const requestParallaxUpdate = () => {
            if (!ticking) {
                requestAnimationFrame(updateParallax);
                ticking = true;
            }
        };

        // Only add parallax on larger screens
        if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches && 
            window.innerWidth > 768) {
            window.addEventListener('scroll', requestParallaxUpdate, { passive: true });
            updateParallax();
        }
    };

    // Special badge animation
    const animateSpecialBadge = () => {
        const specialBadge = document.querySelector('.special-badge');
        
        if (!specialBadge) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const badge = entry.target.querySelector('span');
                    if (badge) {
                        badge.style.animation = 'badgeBounce 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)';
                    }
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.5
        });

        observer.observe(specialBadge);
    };

    // Add custom animations
    const addCustomAnimations = () => {
        const style = document.createElement('style');
        style.textContent = `
            @keyframes badgeBounce {
                0% {
                    opacity: 0;
                    transform: scale(0.4) rotate(-8deg);
                }
                50% {
                    transform: scale(1.08) rotate(3deg);
                }
                100% {
                    opacity: 1;
                    transform: scale(1) rotate(0deg);
                }
            }
        `;
        document.head.appendChild(style);
    };

    // Smooth scroll for navigation
    const initSmoothScroll = () => {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                if (href === '#' || href === '') return;
                
                const target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    };

    // Check for reduced motion
    const shouldReduceMotion = () => {
        return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    };

    // Initialize all animations
    const init = () => {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', init);
            return;
        }

        console.log('Initializing menu animations...');

        addCustomAnimations();

        // Check for reduced motion
        if (shouldReduceMotion()) {
            console.log('Reduced motion detected - showing all elements immediately');
            document.querySelectorAll('.menu-category').forEach(category => {
                category.classList.add(CONFIG.animationClass);
                category.querySelectorAll('.menu-item, .extra-item').forEach(el => {
                    el.style.opacity = '1';
                    el.style.transform = 'none';
                });
            });
            return;
        }

        // Initialize all observers
        try {
            observeMenuCategories();
            observeMenuItems();
            observeExtras();
            animateSpecialBadge();
            addParallaxEffect();
            initSmoothScroll();
            
            console.log('Menu animations initialized successfully');
        } catch (error) {
            console.error('Error initializing menu animations:', error);
            
            // Fallback
            document.querySelectorAll('.menu-category').forEach(category => {
                category.classList.add(CONFIG.animationClass);
            });
        }
    };

    // Start initialization
    init();

    // Handle page visibility changes
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            document.querySelectorAll('.menu-category, .menu-item').forEach(el => {
                if (el.style.animationPlayState !== undefined) {
                    el.style.animationPlayState = 'paused';
                }
            });
        } else {
            document.querySelectorAll('.menu-category, .menu-item').forEach(el => {
                if (el.style.animationPlayState !== undefined) {
                    el.style.animationPlayState = 'running';
                }
            });
        }
    });

    // Handle window resize for parallax
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            // Reinitialize parallax if needed
            if (window.innerWidth > 768 && !shouldReduceMotion()) {
                addParallaxEffect();
            }
        }, 250);
    });

})()