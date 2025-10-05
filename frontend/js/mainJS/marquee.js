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
            
            while (totalWidth < viewportWidth + 500) {
                const item = createItem(itemData[currentIndex % itemData.length]);
                track.appendChild(item);
                currentIndex++;
                totalWidth += item.offsetWidth + gap;
            }
        }
        
        // Animation loop
        function animate() {
            const firstItem = track.firstElementChild;
            if (!firstItem) return;
            
            // Move left (adjust this value for speed: higher = faster)
            currentX -= 1;
            track.style.transform = `translateX(${currentX}px)`;
            
            // Check if first item is completely off screen
            const firstItemRect = firstItem.getBoundingClientRect();
            if (firstItemRect.right < 0) {
                const gap = getGap();
                
                // Remove first item
                const removedWidth = firstItemRect.width + gap;
                track.removeChild(firstItem);
                
                // Add new item at the end
                const newItem = createItem(itemData[currentIndex % itemData.length]);
                track.appendChild(newItem);
                currentIndex++;
                
                // Adjust transform to account for removed item
                currentX += removedWidth;
                track.style.transform = `translateX(${currentX}px)`;
            }
            
            requestAnimationFrame(animate);
        }
        
        // Initialize
        fillViewport();
        animate();
        
        // Handle resize
        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                track.innerHTML = '';
                currentIndex = 0;
                currentX = 0;
                track.style.transform = 'translateX(0)';
                fillViewport();
            }, 250);
        });
    }
})();