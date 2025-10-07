/**
 * Menu Scroll Animations
 * Animates menu categories as they scroll into view
 */

(function() {
    'use strict';

    // Configuration
    const CONFIG = {
        threshold: 0.15,           // Trigger when 15% of element is visible
        rootMargin: '0px 0px -50px 0px', // Trigger slightly before element fully enters viewport
        animationClass: 'animate-in',
        observedClass: 'menu-category'
    };

    // Intersection Observer for menu categories
    const observeMenuCategories = () => {
        const menuCategories = document.querySelectorAll('.menu-category');
        
        if (!menuCategories.length) {
            console.warn('No menu categories found to animate');
            return;
        }

        // Create observer with optimized settings
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    // Add a small delay for staggered effect
                    setTimeout(() => {
                        entry.target.classList.add(CONFIG.animationClass);
                    }, index * 50); // 50ms stagger between items

                    // Unobserve after animation to improve performance
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

    // Animate menu items within a category when it becomes visible
    const observeMenuItems = () => {
        const menuItems = document.querySelectorAll('.menu-item');
        
        if (!menuItems.length) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    // Add animation class with slight delay
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
            item.style.transform = 'translateY(20px)';
            item.style.transition = `all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) ${index * 0.08}s`;
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
                    }, 150);
                    
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
            extra.style.transform = 'scale(0.9) translateY(10px)';
            extra.style.transition = `all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) ${index * 0.1}s`;
            observer.observe(extra);
        });
    };

    // Parallax effect for menu images
    const addParallaxEffect = () => {
        const menuImages = document.querySelectorAll('.menu-image');
        
        if (!menuImages.length) return;

        let ticking = false;

        const updateParallax = () => {
            menuImages.forEach(imageContainer => {
                const rect = imageContainer.getBoundingClientRect();
                const scrollPercent = (rect.top / window.innerHeight);
                
                // Only apply parallax when element is in viewport
                if (scrollPercent < 1.2 && scrollPercent > -0.2) {
                    const img = imageContainer.querySelector('img');
                    if (img) {
                        const translateY = scrollPercent * 30; // Adjust for more/less parallax
                        img.style.transform = `translateY(${translateY}px) scale(1)`;
                    }
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

        // Only add parallax on devices that can handle it
        if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            window.addEventListener('scroll', requestParallaxUpdate, { passive: true });
            updateParallax(); // Initial call
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

    // Add badge bounce animation
    const addBadgeAnimation = () => {
        const style = document.createElement('style');
        style.textContent = `
            @keyframes badgeBounce {
                0% {
                    opacity: 0;
                    transform: scale(0.3) rotate(-10deg);
                }
                50% {
                    transform: scale(1.1) rotate(5deg);
                }
                100% {
                    opacity: 1;
                    transform: scale(1) rotate(0deg);
                }
            }
        `;
        document.head.appendChild(style);
    };

    // Smooth scroll for navigation links (if any point to menu sections)
    const initSmoothScroll = () => {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                
                // Only handle internal anchors
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

    // Check if animations should be reduced
    const shouldReduceMotion = () => {
        return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    };

    // Initialize all animations
    const init = () => {
        // Wait for DOM to be fully loaded
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', init);
            return;
        }

        console.log('Initializing menu scroll animations...');

        // Add custom animation styles
        addBadgeAnimation();

        // Check for reduced motion preference
        if (shouldReduceMotion()) {
            console.log('Reduced motion detected - showing all elements immediately');
            document.querySelectorAll('.menu-category').forEach(category => {
                category.classList.add(CONFIG.animationClass);
            });
            return;
        }

        // Initialize all observers and effects
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
            
            // Fallback: show all elements immediately if there's an error
            document.querySelectorAll('.menu-category').forEach(category => {
                category.classList.add(CONFIG.animationClass);
            });
        }
    };

    // Start initialization
    init();

    // Handle page visibility changes (pause animations when tab is hidden)
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            // Pause any ongoing animations
            document.querySelectorAll('.menu-category, .menu-item').forEach(el => {
                el.style.animationPlayState = 'paused';
            });
        } else {
            // Resume animations
            document.querySelectorAll('.menu-category, .menu-item').forEach(el => {
                el.style.animationPlayState = 'running';
            });
        }
    });

})();