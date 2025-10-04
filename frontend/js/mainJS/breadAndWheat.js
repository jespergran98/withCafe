// Optimized Bread and Wheat Background Pattern
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
            this.draw();
        });

        window.addEventListener('resize', this.debounce(() => this.handleResize(), 250));
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
            opacity: '0.1',
            zIndex: '0'
        });

        featuresSection.style.position = 'relative';
        featuresSection.insertBefore(this.canvas, featuresSection.firstChild);

        this.ctx = this.canvas.getContext('2d', { alpha: true, desynchronized: true });
        this.updateCanvasSize();
    }

    updateCanvasSize() {
        const rect = this.canvas.parentElement.getBoundingClientRect();
        const dpr = Math.min(window.devicePixelRatio, 2); // Cap at 2x for performance
        
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
        const iconSize = 80;
        const spacing = 140;
        const rows = Math.ceil(this.canvasHeight / spacing) + 2;
        const cols = Math.ceil(this.canvasWidth / spacing) + 2;

        this.pattern = [];
        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                const isCoffee = (row + col) % 2 === 0;
                
                this.pattern.push({
                    x: col * spacing + (Math.random() - 0.5) * 20,
                    y: row * spacing + (Math.random() - 0.5) * 20,
                    icon: isCoffee ? this.icons.coffee : this.icons.wheat,
                    rotation: Math.random() * Math.PI * 2,
                    scale: 0.8 + Math.random() * 0.4,
                    size: iconSize
                });
            }
        }
    }

    draw() {
        if (!this.ctx) return;

        this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);

        // Draw static pattern once
        this.pattern.forEach(item => {
            this.ctx.save();
            this.ctx.translate(item.x, item.y);
            this.ctx.rotate(item.rotation);
            this.ctx.scale(item.scale, item.scale);
            this.ctx.globalAlpha = 0.6;
            this.ctx.filter = 'sepia(100%) saturate(50%) hue-rotate(20deg) brightness(1.3)';
            
            this.ctx.drawImage(item.icon, -item.size / 2, -item.size / 2, item.size, item.size);
            
            this.ctx.restore();
        });
    }

    handleResize() {
        this.updateCanvasSize();
        this.generatePattern();
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

// Initialize
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => new BackgroundPattern());
} else {
    new BackgroundPattern();
}