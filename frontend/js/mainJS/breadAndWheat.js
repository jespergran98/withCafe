// Enhanced Static Background Pattern
class BackgroundPattern {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.icons = { coffee: null, wheat: null };
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
        const featuresSection = document.querySelector('.features');
        if (!featuresSection) return;

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

        featuresSection.style.position = 'relative';
        featuresSection.insertBefore(this.canvas, featuresSection.firstChild);

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
            this.loadImage('assets/images/coffee-icon.png'),
            this.loadImage('assets/images/wheat-icon.png')
        ]).then(([coffee, wheat]) => {
            this.icons.coffee = coffee;
            this.icons.wheat = wheat;
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
                const isCoffee = (row + col) % 2 === 0;
                const randomOffset = {
                    x: (Math.random() - 0.5) * 30,
                    y: (Math.random() - 0.5) * 30
                };
                
                this.pattern.push({
                    x: col * spacing + randomOffset.x,
                    y: row * spacing + randomOffset.y,
                    icon: isCoffee ? this.icons.coffee : this.icons.wheat,
                    rotation: Math.random() * Math.PI * 2,
                    scale: 0.75 + Math.random() * 0.5,
                    size: iconSize,
                    opacity: 0.2 + Math.random() * 0.2
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

        const featuresSection = document.querySelector('.features');
        if (featuresSection) {
            observer.observe(featuresSection);
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
            
            // Warm, sophisticated filter
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
            new BackgroundPattern();
        } catch (error) {
            console.warn('Background pattern initialization failed:', error);
        }
    });
} else {
    try {
        new BackgroundPattern();
    } catch (error) {
        console.warn('Background pattern initialization failed:', error);
    }
}