// Streamlined Infinite Marquee
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
        
        // Get actual gap from CSS
        function getGap() {
            const computedStyle = getComputedStyle(track);
            return parseFloat(computedStyle.gap) || 64;
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
            
            item.appendChild(text);
            item.appendChild(icon);
            
            return item;
        }
        
        // Add initial items to fill viewport
        function fillViewport() {
            const viewportWidth = window.innerWidth;
            const gap = getGap();
            let totalWidth = 0;
            
            // Create items and measure them
            const tempItems = [];
            while (totalWidth < viewportWidth + 1000) {
                const item = createItem(itemData[currentIndex % itemData.length]);
                track.appendChild(item);
                tempItems.push(item);
                currentIndex++;
                
                // Force reflow to get accurate measurements
                item.offsetHeight;
                totalWidth += item.offsetWidth + gap;
            }
            
            // Ensure we have enough buffer
            if (tempItems.length < 3) {
                for (let i = 0; i < 5; i++) {
                    const item = createItem(itemData[currentIndex % itemData.length]);
                    track.appendChild(item);
                    currentIndex++;
                }
            }
        }
        
        // Animation loop
        function animate() {
            const firstItem = track.firstElementChild;
            if (!firstItem) {
                animationFrame = requestAnimationFrame(animate);
                return;
            }
            
            // Move left (adjust this value for speed: higher = faster)
            currentX -= 1;
            track.style.transform = `translateX(${currentX}px)`;
            
            // Get current position and dimensions
            const trackRect = track.getBoundingClientRect();
            const firstItemRect = firstItem.getBoundingClientRect();
            const gap = getGap();
            
            // Check if first item is completely off screen (with buffer)
            if (firstItemRect.right < trackRect.left - 10) {
                // Calculate the width of the removed item
                const removedWidth = firstItem.offsetWidth + gap;
                
                // Remove first item
                track.removeChild(firstItem);
                
                // Add new item at the end
                const newItem = createItem(itemData[currentIndex % itemData.length]);
                track.appendChild(newItem);
                currentIndex++;
                
                // Force reflow for accurate measurement
                newItem.offsetHeight;
                
                // Adjust transform to account for removed item
                currentX += removedWidth;
                track.style.transform = `translateX(${currentX}px)`;
            }
            
            // Ensure we always have enough items
            const lastItem = track.lastElementChild;
            if (lastItem) {
                const lastItemRect = lastItem.getBoundingClientRect();
                const viewportRight = window.innerWidth;
                
                // If last item is getting close to viewport, add more
                if (lastItemRect.right < viewportRight + 500) {
                    const newItem = createItem(itemData[currentIndex % itemData.length]);
                    track.appendChild(newItem);
                    currentIndex++;
                }
            }
            
            animationFrame = requestAnimationFrame(animate);
        }
        
        // Stop animation
        function stopAnimation() {
            if (animationFrame) {
                cancelAnimationFrame(animationFrame);
                animationFrame = null;
            }
        }
        
        // Initialize
        fillViewport();
        
        // Small delay to ensure DOM is ready
        setTimeout(() => {
            animate();
        }, 100);
        
        // Handle resize
        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                stopAnimation();
                track.innerHTML = '';
                currentIndex = 0;
                currentX = 0;
                track.style.transform = 'translateX(0)';
                fillViewport();
                setTimeout(() => {
                    animate();
                }, 100);
            }, 250);
        });
    }
})();