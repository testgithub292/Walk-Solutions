// Sample card data with external links
const cardData = [
    {
        // tag: "Design",
        title: "Business Wire",
        // date: "2 days ago",
        description: "Walk Solutions announced it has started a banking relationship with Old Glory Bank. Walk offers payment.....",
        link: "Learn More",
        url: "https://www.businesswire.com/news/home/20250808782659/en/Walk-Solutions-Announces-Banking-Relationship-with-Old-Glory-Bank",
        image: "images/media-section-img-1.webp",
    },
  

  
];

document.addEventListener('DOMContentLoaded', function() {
    const track = document.getElementById('carouselTrack');
    const dotsContainer = document.getElementById('carouselDots');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    const autoPlayToggle = document.getElementById('auto-play');
    const mediaSection = document.querySelector('.media-section');
    
    let currentIndex = 0;
    let cardWidth = 0;
    let autoPlayInterval;
    const autoPlayDelay = 4000; // 4 seconds
    let cards = [];
    let isDragging = false;
    let startPos = 0;
    let currentTranslate = 0;
    let prevTranslate = 0;
    let animationID;
    
    // Initialize with all cards
    renderCards();
    updateLayout();
    initCarousel();
    
    // Create card HTML
    function createCard(cardData) {
        return `
            <div class="carousel-card">
                <div class="card">
                    <div class="card-img">
                        <img src="${cardData.image}" alt="${cardData.title}">
                    </div>
                    <div class="card-content">
                        
                        <h3 class="card-title">${cardData.title}</h3>
                        
                        <p class="card-description">${cardData.description}</p>
                        <a href="${cardData.url}" target="_blank" class="card-link">
                            ${cardData.link} <i class="fas fa-arrow-right"></i>
                        </a>
                    </div>
                </div>
            </div>
        `;
    }
    
    // Render cards
    function renderCards() {
        track.innerHTML = '';
        cards = [];
        
        cardData.forEach(data => {
            const cardHTML = createCard(data);
            track.innerHTML += cardHTML;
        });
        
        cards = document.querySelectorAll('.carousel-card');
    }
    
    // Update layout based on number of cards
    function updateLayout() {
        mediaSection.classList.remove('single-card', 'two-cards');
        
        if (cards.length === 1) {
            mediaSection.classList.add('single-card');
        } else if (cards.length === 2) {
            mediaSection.classList.add('two-cards');
        }
    }
    
    // Initialize dots
    function initDots() {
        dotsContainer.innerHTML = '';
        const totalSlides = Math.ceil(cards.length / getVisibleCards());
        
        for (let i = 0; i < totalSlides; i++) {
            const dot = document.createElement('div');
            dot.classList.add('dot');
            if (i === currentIndex) dot.classList.add('active');
            dot.addEventListener('click', () => goToSlide(i));
            dotsContainer.appendChild(dot);
        }
    }
    
    // Update carousel position
    function updateCarousel() {
        if (cards.length > 0) {
            cardWidth = cards[0].offsetWidth + 20; // Including gap
            
            if (cards.length <= 2) {
                // Center the cards when 1 or 2 cards
                track.style.transform = `translateX(0)`;
            } else {
                // Normal carousel behavior for 3+ cards
                track.style.transform = `translateX(-${currentIndex * cardWidth}px)`;
            }
            
            // Update dots
            const dots = document.querySelectorAll('.dot');
            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === currentIndex);
            });
            
            // Update button states
            const totalSlides = Math.ceil(cards.length / getVisibleCards());
            prevBtn.disabled = currentIndex === 0;
            nextBtn.disabled = currentIndex === totalSlides - 1;
        }
    }
    
    // Get number of visible cards based on screen size
    function getVisibleCards() {
        if (cards.length <= 2) return cards.length;
        
        if (window.innerWidth >= 992) return 3;
        if (window.innerWidth >= 576) return 2;
        return 1;
    }
    
    // Go to specific slide
    function goToSlide(index) {
        if (cards.length > 2) {
            currentIndex = index;
            updateCarousel();
        }
    }
    
    // Next slide
    function nextSlide() {
        if (cards.length > 2) {
            const totalSlides = Math.ceil(cards.length / getVisibleCards());
            if (currentIndex < totalSlides - 1) {
                currentIndex++;
                updateCarousel();
            } else {
                // Loop back to start
                currentIndex = 0;
                updateCarousel();
            }
        }
    }
    
    // Previous slide
    function prevSlide() {
        if (cards.length > 2) {
            if (currentIndex > 0) {
                currentIndex--;
                updateCarousel();
            } else {
                // Loop to end
                const totalSlides = Math.ceil(cards.length / getVisibleCards());
                currentIndex = totalSlides - 1;
                updateCarousel();
            }
        }
    }
    
    // Start auto play
    function startAutoPlay() {
        if (cards.length > 2 && cards.length > getVisibleCards()) {
            autoPlayInterval = setInterval(nextSlide, autoPlayDelay);
        }
    }
    
    // Stop auto play
    function stopAutoPlay() {
        clearInterval(autoPlayInterval);
    }
    
    // Mouse and Touch Events for Dragging
    function getPositionX(event) {
        return event.type.includes('mouse') ? event.pageX : event.touches[0].clientX;
    }
    
    function setSliderPosition() {
        if (cards.length > 2) {
            track.style.transform = `translateX(${currentTranslate}px)`;
        }
    }
    
    function animation() {
        setSliderPosition();
        if (isDragging) requestAnimationFrame(animation);
    }
    
    function touchStart(index) {
        return function(event) {
            if (cards.length > 2) {
                currentIndex = index;
                startPos = getPositionX(event);
                isDragging = true;
                animationID = requestAnimationFrame(animation);
                track.classList.add('grabbing');
                stopAutoPlay();
            }
        }
    }
    
    function touchMove(event) {
        if (isDragging && cards.length > 2) {
            const currentPosition = getPositionX(event);
            currentTranslate = prevTranslate + currentPosition - startPos;
        }
    }
    
    function touchEnd() {
        if (isDragging && cards.length > 2) {
            isDragging = false;
            cancelAnimationFrame(animationID);
            track.classList.remove('grabbing');
            
            const movedBy = currentTranslate - prevTranslate;
            
            if (movedBy < -100 && currentIndex < Math.ceil(cards.length / getVisibleCards()) - 1) {
                currentIndex += 1;
            }
            
            if (movedBy > 100 && currentIndex > 0) {
                currentIndex -= 1;
            }
            
            setPositionByIndex();
            
            if (autoPlayToggle.checked) {
                startAutoPlay();
            }
        }
    }
    
    function setPositionByIndex() {
        if (cards.length > 2) {
            currentTranslate = currentIndex * -cardWidth;
            prevTranslate = currentTranslate;
            setSliderPosition();
            
            // Update dots
            const dots = document.querySelectorAll('.dot');
            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === currentIndex);
            });
        }
    }
    
    // Initialize carousel
    function initCarousel() {
        if (cards.length > 0) {
            cardWidth = cards[0].offsetWidth + 20;
            initDots();
            updateCarousel();
            
            // Add event listeners for drag functionality
            cards.forEach((card, index) => {
                // Mouse events
                card.addEventListener('mousedown', touchStart(index));
                card.addEventListener('mouseup', touchEnd);
                card.addEventListener('mouseleave', touchEnd);
                card.addEventListener('mousemove', touchMove);
                
                // Touch events
                card.addEventListener('touchstart', touchStart(index));
                card.addEventListener('touchend', touchEnd);
                card.addEventListener('touchmove', touchMove);
            });
            
            if (autoPlayToggle.checked && cards.length > 2 && cards.length > getVisibleCards()) {
                startAutoPlay();
            }
        }
    }
    
    // Event listeners
    prevBtn.addEventListener('click', prevSlide);
    nextBtn.addEventListener('click', nextSlide);
    
    autoPlayToggle.addEventListener('change', function() {
        if (this.checked && cards.length > 2 && cards.length > getVisibleCards()) {
            startAutoPlay();
        } else {
            stopAutoPlay();
        }
    });
    
    // Pause auto play on hover
    track.addEventListener('mouseenter', stopAutoPlay);
    track.addEventListener('mouseleave', function() {
        if (autoPlayToggle.checked && cards.length > 2 && cards.length > getVisibleCards()) {
            startAutoPlay();
        }
    });
    
    // Handle window resize
    window.addEventListener('resize', function() {
        if (cards.length > 0) {
            cardWidth = cards[0].offsetWidth + 20;
            initDots();
            updateCarousel();
        }
    });
});