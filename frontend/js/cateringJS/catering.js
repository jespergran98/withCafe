// Catering Description Section Animation
document.addEventListener('DOMContentLoaded', function() {
    
    // Intersection Observer options
    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -80px 0px'
    };

    // Create intersection observer for catering cards
    const cardObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                // Optionally unobserve after animation
                cardObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe all catering cards
    const cateringCards = document.querySelectorAll('.catering-card');
    cateringCards.forEach(card => {
        cardObserver.observe(card);
    });

    // Animate intro section
    const introObserverOptions = {
        threshold: 0.2,
        rootMargin: '0px 0px -50px 0px'
    };

    const introObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                introObserver.unobserve(entry.target);
            }
        });
    }, introObserverOptions);

    // Observe intro section
    const cateringIntro = document.querySelector('.catering-intro');
    if (cateringIntro) {
        introObserver.observe(cateringIntro);
    }

    // Animate list items within cards with stagger effect
    const animateListItems = () => {
        const listItems = document.querySelectorAll('.catering-list li');
        listItems.forEach((item, index) => {
            item.style.opacity = '0';
            item.style.transform = 'translateX(-20px)';
            item.style.transition = `all 0.5s ease ${index * 0.1}s`;
        });

        const listObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const items = entry.target.querySelectorAll('li');
                    items.forEach(item => {
                        item.style.opacity = '1';
                        item.style.transform = 'translateX(0)';
                    });
                    listObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });

        const lists = document.querySelectorAll('.catering-list');
        lists.forEach(list => {
            listObserver.observe(list);
        });
    };

    // Initialize list animations
    animateListItems();

    // Add smooth scroll behavior for any anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href !== '#' && href !== '') {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });

    // Add hover effect enhancement for cards on desktop
    if (window.innerWidth > 768) {
        cateringCards.forEach(card => {
            card.addEventListener('mouseenter', function() {
                this.style.zIndex = '10';
            });
            
            card.addEventListener('mouseleave', function() {
                this.style.zIndex = '1';
            });
        });
    }

    // Parallax effect for decoration element
    const decoration = document.querySelector('.catering-decoration');
    if (decoration && window.innerWidth > 768) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const rate = scrolled * 0.3;
            decoration.style.transform = `translate(0, ${rate}px)`;
        });
    }

    // Add loading class to body when everything is ready
    setTimeout(() => {
        document.body.classList.add('catering-loaded');
    }, 100);

    // Handle window resize
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            // Re-initialize animations if needed
            const cards = document.querySelectorAll('.catering-card');
            cards.forEach(card => {
                if (!card.classList.contains('animate-in')) {
                    const rect = card.getBoundingClientRect();
                    const windowHeight = window.innerHeight;
                    if (rect.top < windowHeight * 0.85) {
                        card.classList.add('animate-in');
                    }
                }
            });
        }, 250);
    });

    // Add enhanced hover effect for contact links
    const contactLinks = document.querySelectorAll('.catering-contact-link');
    contactLinks.forEach(link => {
        link.addEventListener('mouseenter', function() {
            this.style.letterSpacing = '0.5px';
        });
        
        link.addEventListener('mouseleave', function() {
            this.style.letterSpacing = '0';
        });
    });

    // Console log for debugging
    console.log('Catering animations initialized');
    console.log(`Found ${cateringCards.length} catering cards to animate`);
});