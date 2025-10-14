/**
 * Hero Section - Interactive animations and parallax effects
 */

(function () {
  "use strict";

  const CONFIG = {
    parallaxStrength: 15,
    parallaxSmooth: 0.1,
    scrollFadeStart: 100,
    scrollFadeEnd: 400,
  };

  let ticking = false;
  let currentY = 0;
  let targetY = 0;

  /**
   * Initialize hero animations
   */
  function init() {
    const hero = document.querySelector(".hero");
    if (!hero) return;

    initParallax();
    initScrollFade();
    initButtonRipples();
  }

  /**
   * Subtle mouse parallax effect on hero content
   */
  function initParallax() {
    const heroContent = document.querySelector(".hero-content");
    const hero = document.querySelector(".hero");
    if (!heroContent || !hero) return;

    heroContent.classList.add("parallax-active");

    hero.addEventListener("mousemove", (e) => {
      if (window.innerWidth < 768) return; // Disable on mobile

      const rect = hero.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;

      targetY = y * CONFIG.parallaxStrength;

      if (!ticking) {
        requestAnimationFrame(() => {
          animateParallax(heroContent, x * CONFIG.parallaxStrength);
          ticking = false;
        });
        ticking = true;
      }
    });

    // Reset on mouse leave
    hero.addEventListener("mouseleave", () => {
      targetY = 0;
      if (!ticking) {
        requestAnimationFrame(() => {
          animateParallax(heroContent, 0);
          ticking = false;
        });
        ticking = true;
      }
    });
  }

  /**
   * Smooth parallax animation with easing
   */
  function animateParallax(element, targetX) {
    currentY += (targetY - currentY) * CONFIG.parallaxSmooth;

    element.style.transform = `translate(${targetX}px, ${currentY}px)`;
  }

  /**
   * Fade out hero content on scroll
   */
  function initScrollFade() {
    const heroContent = document.querySelector(".hero-content");
    const scrollIndicator = document.querySelector(".scroll-indicator");
    if (!heroContent) return;

    let scrollTicking = false;

    window.addEventListener("scroll", () => {
      if (scrollTicking) return;

      scrollTicking = true;
      requestAnimationFrame(() => {
        const scrollY = window.scrollY;

        // Calculate opacity based on scroll position
        let opacity = 1;
        if (scrollY > CONFIG.scrollFadeStart) {
          const fadeProgress =
            (scrollY - CONFIG.scrollFadeStart) /
            (CONFIG.scrollFadeEnd - CONFIG.scrollFadeStart);
          opacity = Math.max(0, 1 - fadeProgress);
        }

        heroContent.style.opacity = opacity;
        heroContent.style.transform = `translateY(${scrollY * 0.3}px)`;

        // Fade scroll indicator
        if (scrollIndicator) {
          scrollIndicator.style.opacity = Math.max(0, 1 - scrollY / 200);
        }

        scrollTicking = false;
      });
    });
  }

  /**
   * Enhanced button ripple effects
   */
  function initButtonRipples() {
    const buttons = document.querySelectorAll(".hero .btn");

    buttons.forEach((button) => {
      button.addEventListener("click", function (e) {
        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Create ripple element
        const ripple = document.createElement("span");
        ripple.style.cssText = `
                    position: absolute;
                    width: 20px;
                    height: 20px;
                    border-radius: 50%;
                    background: rgba(255, 255, 255, 0.6);
                    transform: translate(-50%, -50%) scale(0);
                    animation: rippleEffect 0.6s ease-out;
                    pointer-events: none;
                    left: ${x}px;
                    top: ${y}px;
                    z-index: 100;
                `;

        this.appendChild(ripple);

        // Remove ripple after animation
        setTimeout(() => ripple.remove(), 600);
      });
    });
  }

  // Add ripple animation styles
  const style = document.createElement("style");
  style.textContent = `
        @keyframes rippleEffect {
            to {
                transform: translate(-50%, -50%) scale(25);
                opacity: 0;
            }
        }
    `;
  document.head.appendChild(style);

  // Initialize when DOM is ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
