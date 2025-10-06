let currentSlide = 1;
const totalSlides = 9; // Updated to 9 slides

function showSlide(slideNumber) {
    // Hide all slides
    const slides = document.querySelectorAll('.slide');
    slides.forEach(slide => slide.classList.remove('active'));
    
    // Show target slide
    const targetSlide = document.getElementById(`slide-${slideNumber}`);
    if (targetSlide) {
        targetSlide.classList.add('active');
    }
    
    // Update slide counter
    document.getElementById('current-slide').textContent = slideNumber;
    document.getElementById('total-slides').textContent = totalSlides;
    
    // Update navigation buttons
    updateNavigationButtons(slideNumber);
    
    // Update slide indicators
    updateSlideIndicators(slideNumber);
}

function nextSlide() {
    if (currentSlide < totalSlides) {
        currentSlide++;
        showSlide(currentSlide);
    }
}

function previousSlide() {
    if (currentSlide > 1) {
        currentSlide--;
        showSlide(currentSlide);
    }
}

function goToSlide(slideNumber) {
    if (slideNumber >= 1 && slideNumber <= totalSlides) {
        currentSlide = slideNumber;
        showSlide(currentSlide);
    }
}

function updateNavigationButtons(slideNumber) {
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    
    // Disable/enable previous button
    if (slideNumber === 1) {
        prevBtn.classList.add('disabled');
        prevBtn.disabled = true;
    } else {
        prevBtn.classList.remove('disabled');
        prevBtn.disabled = false;
    }
    
    // Disable/enable next button
    if (slideNumber === totalSlides) {
        nextBtn.classList.add('disabled');
        nextBtn.disabled = true;
    } else {
        nextBtn.classList.remove('disabled');
        nextBtn.disabled = false;
    }
}

function updateSlideIndicators(slideNumber) {
    const indicators = document.querySelectorAll('.indicator');
    indicators.forEach((indicator, index) => {
        if (index + 1 === slideNumber) {
            indicator.classList.add('active');
        } else {
            indicator.classList.remove('active');
        }
    });
}

// Keyboard navigation
document.addEventListener('keydown', function(event) {
    switch(event.key) {
        case 'ArrowLeft':
        case 'ArrowUp':
            previousSlide();
            break;
        case 'ArrowRight':
        case 'ArrowDown':
        case ' ': // Space bar
            nextSlide();
            break;
        case 'Home':
            goToSlide(1);
            break;
        case 'End':
            goToSlide(totalSlides);
            break;
    }
});

// Touch/swipe support
let touchStartX = 0;
let touchEndX = 0;

document.addEventListener('touchstart', function(event) {
    touchStartX = event.changedTouches[0].screenX;
});

document.addEventListener('touchend', function(event) {
    touchEndX = event.changedTouches[0].screenX;
    handleSwipe();
});

function handleSwipe() {
    const swipeThreshold = 50;
    const swipeDistance = touchEndX - touchStartX;
    
    if (Math.abs(swipeDistance) > swipeThreshold) {
        if (swipeDistance > 0) {
            // Swipe right - go to previous slide
            previousSlide();
        } else {
            // Swipe left - go to next slide
            nextSlide();
        }
    }
}

// Initialize presentation
document.addEventListener('DOMContentLoaded', function() {
    showSlide(1);
    
    // Add click handlers to navigation buttons
    document.getElementById('prev-btn').addEventListener('click', previousSlide);
    document.getElementById('next-btn').addEventListener('click', nextSlide);
    
    // Add click handlers to slide indicators
    const indicators = document.querySelectorAll('.indicator');
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', function() {
            goToSlide(index + 1);
        });
    });
});

// Auto-play functionality (optional)
let autoPlay = false;
let autoPlayInterval;

function startAutoPlay(intervalMs = 5000) {
    if (autoPlay) return;
    
    autoPlay = true;
    autoPlayInterval = setInterval(() => {
        if (currentSlide < totalSlides) {
            nextSlide();
        } else {
            goToSlide(1); // Loop back to first slide
        }
    }, intervalMs);
}

function stopAutoPlay() {
    if (!autoPlay) return;
    
    autoPlay = false;
    clearInterval(autoPlayInterval);
}

// Pause auto-play on user interaction
document.addEventListener('click', stopAutoPlay);
document.addEventListener('keydown', stopAutoPlay);
document.addEventListener('touchstart', stopAutoPlay);