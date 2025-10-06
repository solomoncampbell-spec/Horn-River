// Presentation navigation and interactivity
class PresentationController {
    constructor() {
        this.currentSlide = 1;
        this.totalSlides = 8;
        this.init();
    }

    init() {
        this.updateSlideDisplay();
        this.updateNavButtons();
        this.setupKeyboardNavigation();
        this.setupTouchNavigation();
    }

    nextSlide() {
        if (this.currentSlide < this.totalSlides) {
            this.currentSlide++;
            this.updateSlideDisplay();
            this.updateNavButtons();
            this.scrollToTop();
        }
    }

    previousSlide() {
        if (this.currentSlide > 1) {
            this.currentSlide--;
            this.updateSlideDisplay();
            this.updateNavButtons();
            this.scrollToTop();
        }
    }

    goToSlide(slideNumber) {
        if (slideNumber >= 1 && slideNumber <= this.totalSlides) {
            this.currentSlide = slideNumber;
            this.updateSlideDisplay();
            this.updateNavButtons();
            this.scrollToTop();
        }
    }

    updateSlideDisplay() {
        // Hide all slides
        const slides = document.querySelectorAll('.slide');
        slides.forEach(slide => {
            slide.classList.remove('active');
        });

        // Show current slide
        const currentSlideElement = document.getElementById(`slide-${this.currentSlide}`);
        if (currentSlideElement) {
            currentSlideElement.classList.add('active');
        }

        // Update slide counter
        const currentSlideCounter = document.getElementById('current-slide');
        if (currentSlideCounter) {
            currentSlideCounter.textContent = this.currentSlide;
        }

        // Update indicators
        this.updateIndicators();
    }

    updateIndicators() {
        const indicators = document.querySelectorAll('.indicator');
        indicators.forEach((indicator, index) => {
            if (index + 1 === this.currentSlide) {
                indicator.classList.add('active');
            } else {
                indicator.classList.remove('active');
            }
        });
    }

    updateNavButtons() {
        const prevBtn = document.getElementById('prev-btn');
        const nextBtn = document.getElementById('next-btn');

        if (prevBtn) {
            prevBtn.disabled = this.currentSlide === 1;
        }

        if (nextBtn) {
            nextBtn.disabled = this.currentSlide === this.totalSlides;
        }
    }

    setupKeyboardNavigation() {
        document.addEventListener('keydown', (event) => {
            switch (event.key) {
                case 'ArrowRight':
                case ' ': // Spacebar
                    event.preventDefault();
                    this.nextSlide();
                    break;
                case 'ArrowLeft':
                    event.preventDefault();
                    this.previousSlide();
                    break;
                case 'Home':
                    event.preventDefault();
                    this.goToSlide(1);
                    break;
                case 'End':
                    event.preventDefault();
                    this.goToSlide(this.totalSlides);
                    break;
                default:
                    // Handle number keys 1-8
                    const slideNumber = parseInt(event.key);
                    if (slideNumber >= 1 && slideNumber <= this.totalSlides) {
                        event.preventDefault();
                        this.goToSlide(slideNumber);
                    }
                    break;
            }
        });
    }

    setupTouchNavigation() {
        let startX = 0;
        let startY = 0;

        document.addEventListener('touchstart', (event) => {
            startX = event.touches[0].clientX;
            startY = event.touches[0].clientY;
        });

        document.addEventListener('touchend', (event) => {
            if (!startX || !startY) {
                return;
            }

            const endX = event.changedTouches[0].clientX;
            const endY = event.changedTouches[0].clientY;

            const deltaX = startX - endX;
            const deltaY = startY - endY;

            // Only process horizontal swipes that are longer than vertical ones
            if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
                if (deltaX > 0) {
                    // Swipe left - next slide
                    this.nextSlide();
                } else {
                    // Swipe right - previous slide
                    this.previousSlide();
                }
            }

            startX = 0;
            startY = 0;
        });
    }

    scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }
}

// Animation utilities
class AnimationUtils {
    static fadeIn(element, duration = 300) {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = `opacity ${duration}ms ease, transform ${duration}ms ease`;
        
        // Force reflow
        element.offsetHeight;
        
        element.style.opacity = '1';
        element.style.transform = 'translateY(0)';
    }

    static slideInFromRight(element, duration = 400) {
        element.style.opacity = '0';
        element.style.transform = 'translateX(50px)';
        element.style.transition = `opacity ${duration}ms ease, transform ${duration}ms ease`;
        
        // Force reflow
        element.offsetHeight;
        
        element.style.opacity = '1';
        element.style.transform = 'translateX(0)';
    }

    static staggeredAnimation(elements, delay = 100) {
        elements.forEach((element, index) => {
            setTimeout(() => {
                this.fadeIn(element);
            }, index * delay);
        });
    }
}

// Presentation enhancement features
class PresentationEnhancements {
    constructor(controller) {
        this.controller = controller;
        this.init();
    }

    init() {
        this.setupSlideAnimations();
        this.setupProgressBar();
        this.setupFullscreenMode();
        this.setupSlideTimers();
    }

    setupSlideAnimations() {
        // Add entrance animations when slides become active
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                    const target = mutation.target;
                    if (target.classList.contains('slide') && target.classList.contains('active')) {
                        this.animateSlideContent(target);
                    }
                }
            });
        });

        document.querySelectorAll('.slide').forEach(slide => {
            observer.observe(slide, { attributes: true });
        });
    }

    animateSlideContent(slide) {
        const animatableElements = slide.querySelectorAll('.highlight-item, .phase-card, .asset-section, .advantage-card, .exit-strategy-card');
        
        if (animatableElements.length > 0) {
            AnimationUtils.staggeredAnimation(Array.from(animatableElements), 150);
        }

        // Animate charts and images
        const charts = slide.querySelectorAll('.timeline-chart, .financial-chart');
        charts.forEach(chart => {
            setTimeout(() => {
                AnimationUtils.slideInFromRight(chart, 600);
            }, 200);
        });
    }

    setupProgressBar() {
        const progressBar = document.createElement('div');
        progressBar.className = 'progress-bar';
        progressBar.innerHTML = '<div class="progress-fill"></div>';
        
        const styles = `
            .progress-bar {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 3px;
                background: rgba(var(--color-brown-600-rgb), 0.2);
                z-index: 1000;
            }
            .progress-fill {
                height: 100%;
                background: var(--color-teal-300);
                transition: width 300ms ease;
                width: ${(this.controller.currentSlide / this.controller.totalSlides) * 100}%;
            }
        `;
        
        const styleSheet = document.createElement('style');
        styleSheet.textContent = styles;
        document.head.appendChild(styleSheet);
        document.body.appendChild(progressBar);

        // Update progress on slide change
        const originalGoToSlide = this.controller.goToSlide.bind(this.controller);
        this.controller.goToSlide = (slideNumber) => {
            originalGoToSlide(slideNumber);
            const progressFill = document.querySelector('.progress-fill');
            if (progressFill) {
                progressFill.style.width = `${(slideNumber / this.controller.totalSlides) * 100}%`;
            }
        };
    }

    setupFullscreenMode() {
        // Add fullscreen toggle button
        const fullscreenBtn = document.createElement('button');
        fullscreenBtn.innerHTML = '⛶';
        fullscreenBtn.className = 'fullscreen-btn';
        fullscreenBtn.title = 'Toggle Fullscreen (F11)';
        
        const styles = `
            .fullscreen-btn {
                position: fixed;
                top: 20px;
                right: 20px;
                background: var(--color-teal-500);
                color: var(--color-btn-primary-text);
                border: none;
                width: 40px;
                height: 40px;
                border-radius: 50%;
                cursor: pointer;
                font-size: 16px;
                z-index: 1000;
                transition: all 200ms ease;
            }
            .fullscreen-btn:hover {
                background: var(--color-teal-400);
                transform: scale(1.1);
            }
        `;
        
        const styleSheet = document.createElement('style');
        styleSheet.textContent = styles;
        document.head.appendChild(styleSheet);
        document.body.appendChild(fullscreenBtn);

        fullscreenBtn.addEventListener('click', () => {
            this.toggleFullscreen();
        });

        // F11 key handler
        document.addEventListener('keydown', (event) => {
            if (event.key === 'F11') {
                event.preventDefault();
                this.toggleFullscreen();
            }
        });
    }

    toggleFullscreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(err => {
                console.log('Error attempting to enable fullscreen:', err.message);
            });
        } else {
            document.exitFullscreen();
        }
    }

    setupSlideTimers() {
        let slideStartTime = Date.now();
        const slideTimings = [];

        const originalGoToSlide = this.controller.goToSlide.bind(this.controller);
        this.controller.goToSlide = (slideNumber) => {
            // Record time spent on previous slide
            const timeSpent = Date.now() - slideStartTime;
            slideTimings[this.controller.currentSlide - 1] = timeSpent;
            
            originalGoToSlide(slideNumber);
            slideStartTime = Date.now();
        };

        // Add presentation summary at the end
        window.addEventListener('beforeunload', () => {
            const totalTime = slideTimings.reduce((sum, time) => sum + (time || 0), 0);
            console.log('Presentation Summary:', {
                totalSlides: this.controller.totalSlides,
                totalTime: Math.round(totalTime / 1000) + ' seconds',
                slideTimings: slideTimings.map((time, index) => ({
                    slide: index + 1,
                    timeSpent: Math.round((time || 0) / 1000) + 's'
                }))
            });
        });
    }
}

// Global functions for HTML onclick handlers
function nextSlide() {
    if (window.presentationController) {
        window.presentationController.nextSlide();
    }
}

function previousSlide() {
    if (window.presentationController) {
        window.presentationController.previousSlide();
    }
}

function goToSlide(slideNumber) {
    if (window.presentationController) {
        window.presentationController.goToSlide(slideNumber);
    }
}

// Initialize presentation when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Create and initialize presentation controller
    window.presentationController = new PresentationController();
    
    // Add enhancements
    new PresentationEnhancements(window.presentationController);
    
    // Add accessibility improvements
    setupAccessibility();
    
    // Add print functionality
    setupPrintMode();
    
    console.log('Horn River Investment Presentation loaded successfully');
    console.log('Navigation: Use arrow keys, spacebar, or number keys 1-8');
    console.log('Fullscreen: Press F11 or click the fullscreen button');
});

// Accessibility enhancements
function setupAccessibility() {
    // Add ARIA labels and roles
    const slides = document.querySelectorAll('.slide');
    slides.forEach((slide, index) => {
        slide.setAttribute('role', 'tabpanel');
        slide.setAttribute('aria-label', `Slide ${index + 1} of ${slides.length}`);
    });

    // Add skip navigation
    const skipNav = document.createElement('a');
    skipNav.href = '#main-content';
    skipNav.textContent = 'Skip to main content';
    skipNav.className = 'skip-nav';
    
    const skipNavStyles = `
        .skip-nav {
            position: absolute;
            top: -40px;
            left: 6px;
            background: var(--color-teal-500);
            color: var(--color-btn-primary-text);
            padding: 8px;
            text-decoration: none;
            border-radius: 4px;
            z-index: 1001;
            transition: top 200ms ease;
        }
        .skip-nav:focus {
            top: 6px;
        }
    `;
    
    const styleSheet = document.createElement('style');
    styleSheet.textContent = skipNavStyles;
    document.head.appendChild(styleSheet);
    document.body.insertBefore(skipNav, document.body.firstChild);

    // Add main content landmark
    const presentationContainer = document.querySelector('.presentation-container');
    if (presentationContainer) {
        presentationContainer.setAttribute('id', 'main-content');
        presentationContainer.setAttribute('role', 'main');
    }
}

// Print mode functionality
function setupPrintMode() {
    // Add print styles and functionality
    const printBtn = document.createElement('button');
    printBtn.innerHTML = '🖨️';
    printBtn.className = 'print-btn';
    printBtn.title = 'Print Presentation (Ctrl+P)';
    
    const styles = `
        .print-btn {
            position: fixed;
            top: 70px;
            right: 20px;
            background: var(--color-secondary);
            color: var(--color-text);
            border: 1px solid var(--color-border);
            width: 40px;
            height: 40px;
            border-radius: 50%;
            cursor: pointer;
            font-size: 16px;
            z-index: 1000;
            transition: all 200ms ease;
        }
        .print-btn:hover {
            background: var(--color-secondary-hover);
            transform: scale(1.1);
        }
        @media print {
            .print-btn, .fullscreen-btn, .progress-bar {
                display: none !important;
            }
        }
    `;
    
    const styleSheet = document.createElement('style');
    styleSheet.textContent = styles;
    document.head.appendChild(styleSheet);
    document.body.appendChild(printBtn);

    printBtn.addEventListener('click', () => {
        window.print();
    });
}

// Utility functions for data formatting
class DataFormatter {
    static formatCurrency(amount, precision = 1) {
        if (amount >= 1000000) {
            return `$${(amount / 1000000).toFixed(precision)}M`;
        } else if (amount >= 1000) {
            return `$${(amount / 1000).toFixed(precision)}K`;
        } else {
            return `$${amount.toFixed(precision)}`;
        }
    }

    static formatPercentage(value, precision = 1) {
        return `${value.toFixed(precision)}%`;
    }

    static formatCapacity(mw) {
        return `${mw} MW`;
    }

    static formatReserves(tcf) {
        return `${tcf} TCF`;
    }
}

// Export for potential external use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        PresentationController,
        AnimationUtils,
        DataFormatter
    };
}