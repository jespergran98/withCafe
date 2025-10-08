// Streamlined Infinite Marquee - Mobile Optimized
(function() {
    'use strict';
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initMarquee);
    } else {
        initMarquee();
    }
    
    function initMarquee() {
        const track = document.querySelector('.marquee-track');
        if (!track) return;
        
        // Store original items as template
        const items = Array.from(track.children);
        const itemData = items.map(item => ({
            text: item.querySelector('.marquee-text')?.textContent || '',
            icon: item.querySelector('.marquee-icon')?.src || ''
        }));
        
        // Clear track
        track.innerHTML = '';
        
        let currentIndex = 0;
        let currentX = 0;
        let animationFrame = null;
        let isAnimating = false;
        
        // Cache measurements to avoid recalculations during scroll
        let cachedItemWidths = [];
        let cachedGap = 0;
        let viewportWidth = 0;
        let lastUpdateTime = 0;
        
        // Get actual gap from CSS
        function getGap() {
            const computedStyle = getComputedStyle(track);
            return parseFloat(computedStyle.gap) || 64;
        }
        
        // Update cached measurements
        function updateMeasurements() {
            cachedGap = getGap();
            viewportWidth = window.innerWidth;
            
            // Measure all items
            cachedItemWidths = Array.from(track.children).map(item => item.offsetWidth);
        }
        
        // Create an item element
        function createItem(data) {
            const item = document.createElement('div');
            item.className = 'marquee-item';
            
            const text = document.createElement('span');
            text.className = 'marquee-text';
            text.textContent = data.text;
            
            const icon = document.createElement('img');
            icon.className = 'marquee-icon';
            icon.src = data.icon;
            icon.alt = '';
            icon.loading = 'eager';
            
            item.appendChild(text);
            item.appendChild(icon);
            
            return item;
        }
        
        // Add initial items to fill viewport
        function fillViewport() {
            const gap = getGap();
            let totalWidth = 0;
            
            // Create items and measure them
            while (totalWidth < viewportWidth + 1000) {
                const item = createItem(itemData[currentIndex % itemData.length]);
                track.appendChild(item);
                currentIndex++;
                
                // Force reflow to get accurate measurements
                item.offsetHeight;
                totalWidth += item.offsetWidth + gap;
            }
            
            // Ensure we have enough buffer
            const itemCount = track.children.length;
            if (itemCount < 5) {
                for (let i = 0; i < 5; i++) {
                    const item = createItem(itemData[currentIndex % itemData.length]);
                    track.appendChild(item);
                    currentIndex++;
                }
            }
            
            // Update cached measurements after filling
            updateMeasurements();
        }
        
        // Animation loop - optimized to avoid getBoundingClientRect during scroll
        function animate(timestamp) {
            if (!isAnimating) return;
            
            const deltaTime = timestamp - lastUpdateTime;
            lastUpdateTime = timestamp;
            
            // Move left (adjust this value for speed: higher = faster)
            // Use time-based movement for consistent speed
            const speed = 1; // pixels per frame at 60fps
            currentX -= speed;
            
            // Use transform3d for better mobile performance
            track.style.transform = `translate3d(${currentX}px, 0, 0)`;
            
            const firstItem = track.firstElementChild;
            if (!firstItem) {
                animationFrame = requestAnimationFrame(animate);
                return;
            }
            
            // Calculate position without getBoundingClientRect
            // Use cached width and current transform position
            const firstItemWidth = cachedItemWidths[0] || firstItem.offsetWidth;
            const itemLeftPosition = currentX;
            
            // Check if first item is completely off screen (with buffer)
            // Item is off-screen when its right edge (left + width) is less than -10
            if (itemLeftPosition + firstItemWidth < -10) {
                // Calculate the width of the removed item
                const removedWidth = firstItemWidth + cachedGap;
                
                // Remove first item
                track.removeChild(firstItem);
                
                // Add new item at the end
                const newItem = createItem(itemData[currentIndex % itemData.length]);
                track.appendChild(newItem);
                currentIndex++;
                
                // Force reflow for accurate measurement
                newItem.offsetHeight;
                
                // Update cached measurements
                cachedItemWidths.shift();
                cachedItemWidths.push(newItem.offsetWidth);
                
                // Adjust transform to account for removed item
                currentX += removedWidth;
                track.style.transform = `translate3d(${currentX}px, 0, 0)`;
            }
            
            // Ensure we always have enough items
            // Calculate last item position using cached measurements
            let totalWidth = currentX;
            for (let i = 0; i < cachedItemWidths.length; i++) {
                totalWidth += cachedItemWidths[i] + cachedGap;
            }
            
            // If last item is getting close to viewport, add more
            if (totalWidth < viewportWidth + 500) {
                const newItem = createItem(itemData[currentIndex % itemData.length]);
                track.appendChild(newItem);
                currentIndex++;
                
                // Force reflow
                newItem.offsetHeight;
                
                // Update cache
                cachedItemWidths.push(newItem.offsetWidth);
            }
            
            animationFrame = requestAnimationFrame(animate);
        }
        
        // Start animation
        function startAnimation() {
            if (isAnimating) return;
            isAnimating = true;
            lastUpdateTime = performance.now();
            animationFrame = requestAnimationFrame(animate);
        }
        
        // Stop animation
        function stopAnimation() {
            isAnimating = false;
            if (animationFrame) {
                cancelAnimationFrame(animationFrame);
                animationFrame = null;
            }
        }
        
        // Initialize
        fillViewport();
        
        // Small delay to ensure DOM is ready
        setTimeout(() => {
            startAnimation();
        }, 100);
        
        // Handle resize - debounced to prevent issues during mobile scroll
        let resizeTimer;
        let lastWidth = window.innerWidth;
        
        window.addEventListener('resize', () => {
            const newWidth = window.innerWidth;
            
            // Only reset if width actually changed (not just scroll on mobile)
            if (Math.abs(newWidth - lastWidth) < 10) {
                return;
            }
            
            lastWidth = newWidth;
            clearTimeout(resizeTimer);
            
            resizeTimer = setTimeout(() => {
                stopAnimation();
                track.innerHTML = '';
                currentIndex = 0;
                currentX = 0;
                cachedItemWidths = [];
                track.style.transform = 'translate3d(0, 0, 0)';
                fillViewport();
                setTimeout(() => {
                    startAnimation();
                }, 100);
            }, 250);
        });
        
        // Ensure animation continues even if page visibility changes
        document.addEventListener('visibilitychange', () => {
            if (!document.hidden && !isAnimating) {
                lastUpdateTime = performance.now();
                startAnimation();
            }
        });
    }
})();