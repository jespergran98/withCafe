// Enhanced Static Background Pattern for Cafe Map Section
class MapBackgroundPattern {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.icons = { oseberg: null, slottsfjell: null };
        this.pattern = [];
        this.resizeTimeout = null;
        
        this.init();
    }

    init() {
        this.createCanvas();
        this.loadImages().then(() => {
            this.generatePattern();
            this.setupObserver();
            this.setupEventListeners();
        });
    }

    createCanvas() {
        const mapSection = document.querySelector('.cafe-map-section');
        if (!mapSection) return;

        this.canvas = document.createElement('canvas');
        Object.assign(this.canvas.style, {
            position: 'absolute',
            top: '0',
            left: '0',
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
            opacity: '0',
            zIndex: '0',
            transition: 'opacity 0.8s ease-out'
        });

        mapSection.style.position = 'relative';
        mapSection.insertBefore(this.canvas, mapSection.firstChild);

        this.ctx = this.canvas.getContext('2d', { alpha: true, desynchronized: true });
        this.updateCanvasSize();
    }

    updateCanvasSize() {
        const rect = this.canvas.parentElement.getBoundingClientRect();
        const dpr = Math.min(window.devicePixelRatio, 2);
        
        this.canvas.width = rect.width * dpr;
        this.canvas.height = rect.height * dpr;
        this.canvas.style.width = `${rect.width}px`;
        this.canvas.style.height = `${rect.height}px`;
        
        this.ctx.scale(dpr, dpr);
        this.canvasWidth = rect.width;
        this.canvasHeight = rect.height;
    }

    loadImages() {
        return Promise.all([
            this.loadImage('assets/images/oseberg-icon.png'),
            this.loadImage('assets/images/slottsfjell-icon.png')
        ]).then(([oseberg, slottsfjell]) => {
            this.icons.oseberg = oseberg;
            this.icons.slottsfjell = slottsfjell;
        });
    }

    loadImage(src) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.onerror = reject;
            img.src = src;
        });
    }

    generatePattern() {
        const iconSize = 85;
        const spacing = 150;
        const rows = Math.ceil(this.canvasHeight / spacing) + 3;
        const cols = Math.ceil(this.canvasWidth / spacing) + 3;

        this.pattern = [];
        
        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                const isOseberg = (row + col) % 2 === 0;
                const randomOffset = {
                    x: (Math.random() - 0.5) * 30,
                    y: (Math.random() - 0.5) * 30
                };
                
                this.pattern.push({
                    x: col * spacing + randomOffset.x,
                    y: row * spacing + randomOffset.y,
                    icon: isOseberg ? this.icons.oseberg : this.icons.slottsfjell,
                    rotation: Math.random() * Math.PI * 2,
                    scale: 0.75 + Math.random() * 0.5,
                    size: iconSize,
                    opacity: 0.3 + Math.random() * 0.3
                });
            }
        }
    }

    setupObserver() {
        const options = {
            threshold: 0.1,
            rootMargin: '100px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && this.canvas.style.opacity === '0') {
                    this.canvas.style.opacity = '0.12';
                    this.draw();
                }
            });
        }, options);

        const mapSection = document.querySelector('.cafe-map-section');
        if (mapSection) {
            observer.observe(mapSection);
        }
    }

    setupEventListeners() {
        // Resize handling only
        window.addEventListener('resize', this.debounce(() => this.handleResize(), 250));
    }

    draw() {
        if (!this.ctx) return;

        this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);

        // Draw static pattern once - no animations
        this.pattern.forEach(item => {
            this.ctx.save();
            this.ctx.translate(item.x, item.y);
            this.ctx.rotate(item.rotation);
            this.ctx.scale(item.scale, item.scale);
            this.ctx.globalAlpha = item.opacity;
            
            // Warm, sophisticated filter matching the café aesthetic
            this.ctx.filter = 'sepia(35%) saturate(70%) brightness(1.15) contrast(1.05)';
            
            this.ctx.drawImage(
                item.icon,
                -item.size / 2,
                -item.size / 2,
                item.size,
                item.size
            );
            
            this.ctx.restore();
        });
    }

    handleResize() {
        this.updateCanvasSize();
        this.generatePattern();
        this.draw();
    }

    debounce(func, wait) {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    }

    destroy() {
        if (this.canvas?.parentElement) {
            this.canvas.parentElement.removeChild(this.canvas);
        }
        if (this.resizeTimeout) {
            clearTimeout(this.resizeTimeout);
        }
    }
}

// Initialize with error handling
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        try {
            new MapBackgroundPattern();
        } catch (error) {
            console.warn('Map background pattern initialization failed:', error);
        }
    });
} else {
    try {
        new MapBackgroundPattern();
    } catch (error) {
        console.warn('Map background pattern initialization failed:', error);
    }
}