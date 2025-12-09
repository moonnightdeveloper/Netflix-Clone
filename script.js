// --- FAQ ACCORDION INTERACTIVITY ---
document.addEventListener('DOMContentLoaded', () => {
    // FAQ functionality (existing code)
    const faqQuestions = document.querySelectorAll('.faq-question');

    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const faqItem = question.closest('.faq-item');
            
            const isActive = faqItem.classList.contains('active');
            
            document.querySelectorAll('.faq-item.active').forEach(item => {
                item.classList.remove('active');
            });

            if (!isActive) {
                faqItem.classList.add('active');
            }
        });
    });
// Language selector functionality
    const languageBtn = document.querySelector('.language-btn');
    const languageDropdown = document.querySelector('.language-dropdown');
    const languageOptions = document.querySelectorAll('.language-option');
    const languageText = document.querySelector('.language-text');
    const dropdownArrow = document.querySelector('.dropdown-arrow');
    
    if (languageBtn && languageDropdown) {
        // Toggle dropdown on button click
        languageBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            languageDropdown.classList.toggle('show');
            dropdownArrow.style.transform = languageDropdown.classList.contains('show') 
                ? 'rotate(180deg)' 
                : 'rotate(0deg)';
        });
        
        // Handle language selection
        languageOptions.forEach(option => {
            option.addEventListener('click', (e) => {
                e.preventDefault();
                
                // Update selected language
                const selectedLang = option.getAttribute('data-lang');
                const selectedText = option.textContent;
                
                // Update button text
                languageText.textContent = selectedText;
                
                // Update active state
                languageOptions.forEach(opt => opt.classList.remove('active'));
                option.classList.add('active');
                
                // Close dropdown
                languageDropdown.classList.remove('show');
                dropdownArrow.style.transform = 'rotate(0deg)';
                
                // Here you would typically:
                // 1. Save language preference to localStorage
                // 2. Update page content based on selected language
                // 3. Send language preference to server
                
                // Example: Save to localStorage
                localStorage.setItem('netflix-language', selectedLang);
                
                // Show feedback
                console.log(`Language changed to: ${selectedText} (${selectedLang})`);
                
                // For demo purposes, show an alert
                // In production, you would update all text content
                alert(`Language changed to ${selectedText}. In a real implementation, all text would be translated.`);
            });
        });
        
        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!languageBtn.contains(e.target) && !languageDropdown.contains(e.target)) {
                languageDropdown.classList.remove('show');
                dropdownArrow.style.transform = 'rotate(0deg)';
            }
        });
        
        // Set initial language based on localStorage or browser language
        const savedLang = localStorage.getItem('netflix-language') || 'en';
        const initialOption = document.querySelector(`.language-option[data-lang="${savedLang}"]`);
        
        if (initialOption) {
            initialOption.classList.add('active');
            languageText.textContent = initialOption.textContent;
        }
    }
    
    // --- AUTO SLIDER FUNCTIONALITY ---
    const slider = document.querySelector('.posters-container');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    const sliderDotsContainer = document.querySelector('.slider-dots');
    const posterItems = document.querySelectorAll('.poster-item');
    
    let currentSlide = 0;
    let autoSlideInterval;
    const slideIntervalTime = 4000; // 4 seconds
    const slidesPerView = 5; // Number of posters visible at once

    // Create dots based on number of slides
    function createDots() {
        const totalSlides = Math.ceil(posterItems.length / slidesPerView);
        sliderDotsContainer.innerHTML = '';
        
        for (let i = 0; i < totalSlides; i++) {
            const dot = document.createElement('button');
            dot.classList.add('slider-dot');
            dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
            if (i === 0) dot.classList.add('active');
            
            dot.addEventListener('click', () => {
                goToSlide(i);
            });
            
            sliderDotsContainer.appendChild(dot);
        }
    }

    // Go to specific slide
    function goToSlide(slideIndex) {
        const totalSlides = Math.ceil(posterItems.length / slidesPerView);
        
        // Ensure slide index is within bounds
        if (slideIndex < 0) {
            slideIndex = totalSlides - 1;
        } else if (slideIndex >= totalSlides) {
            slideIndex = 0;
        }
        
        currentSlide = slideIndex;
        
        // Calculate scroll position
        const scrollAmount = currentSlide * slider.clientWidth;
        slider.scrollTo({
            left: scrollAmount,
            behavior: 'smooth'
        });
        
        updateDots();
        resetAutoSlide(); // Reset timer when manually navigating
    }

    // Update active dot
    function updateDots() {
        const dots = document.querySelectorAll('.slider-dot');
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentSlide);
        });
    }

    // Next slide
    function nextSlide() {
        const totalSlides = Math.ceil(posterItems.length / slidesPerView);
        goToSlide((currentSlide + 1) % totalSlides);
    }

    // Previous slide
    function prevSlide() {
        const totalSlides = Math.ceil(posterItems.length / slidesPerView);
        goToSlide((currentSlide - 1 + totalSlides) % totalSlides);
    }

    // Start auto sliding
    function startAutoSlide() {
        autoSlideInterval = setInterval(nextSlide, slideIntervalTime);
    }

    // Reset auto slide timer
    function resetAutoSlide() {
        clearInterval(autoSlideInterval);
        startAutoSlide();
    }

    // Handle scroll events to update current slide
    function handleScroll() {
        const scrollPosition = slider.scrollLeft;
        const slideWidth = slider.clientWidth;
        const newSlide = Math.round(scrollPosition / slideWidth);
        
        if (newSlide !== currentSlide) {
            currentSlide = newSlide;
            updateDots();
        }
    }

    // Initialize slider
    function initSlider() {
        // Create dots
        createDots();
        
        // Add event listeners to buttons
        if (prevBtn) prevBtn.addEventListener('click', prevSlide);
        if (nextBtn) nextBtn.addEventListener('click', nextSlide);
        
        // Add scroll event listener
        slider.addEventListener('scroll', handleScroll);
        
        // Pause auto slide on hover
        slider.addEventListener('mouseenter', () => {
            clearInterval(autoSlideInterval);
        });
        
        slider.addEventListener('mouseleave', startAutoSlide);
        
        // Pause on focus for accessibility
        slider.addEventListener('focusin', () => {
            clearInterval(autoSlideInterval);
        });
        
        slider.addEventListener('focusout', startAutoSlide);
        
        // Start auto sliding
        startAutoSlide();
        
        // Responsive handling
        window.addEventListener('resize', () => {
            // Update scroll position on resize
            goToSlide(currentSlide);
        });
    }

    // Initialize the slider if elements exist
    if (slider && posterItems.length > 0) {
        initSlider();
    }

    // Update dots initially
    updateDots();
});