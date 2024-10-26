// header
const bar = document.getElementById("bar");
const nav = document.getElementById("nav");

document.addEventListener('DOMContentLoaded', function() {
    bar.addEventListener('click', function(event) {
        event.stopPropagation(); // Prevent this click from being caught by the document listener
        nav.classList.toggle('show');
    });

    // Close the menu when clicking outside
    document.addEventListener('click', function(event) {
        const isClickInsideNav = nav.contains(event.target);
        const isClickOnBar = bar.contains(event.target);

        if (!isClickInsideNav && !isClickOnBar && nav.classList.contains('show')) {
            nav.classList.remove('show');
        }
    });

    // Close the menu when the screen size changes to desktop view
    window.addEventListener('resize', function() {
        if (window.innerWidth >= 768 && nav.classList.contains('show')) {
            nav.classList.remove('show');
        }
    });

    // Initialize Swiper
    const swiper = new Swiper('.swiper-container', {
        slidesPerView: 1.2, // Show a bit of the next slide
        spaceBetween: 15, // Reduced space between slides for mobile
        loop: true,
        autoplay: {
            delay: 3000,
            disableOnInteraction: false,
        },
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
        breakpoints: {
            // when window width is >= 640px
            640: {
                slidesPerView: 2,
                spaceBetween: 20,
            },
            // when window width is >= 768px
            768: {
                slidesPerView: 3,
                spaceBetween: 30,
            },
            // when window width is >= 1024px
            1024: {
                slidesPerView: 4,
                spaceBetween: 40,
            },
        }
    });
});

// carousel
const carouselContainer = document.querySelector(".carouselContainer");
const indicators = document.querySelectorAll(".indicator");
let currentIndex = 0;

function slideCarousel(index) {
    const carousel = document.querySelector('.carouselContainer');
    const cardWidth = document.querySelector('.eachCarousel').offsetWidth;
    const scrollPosition = index * (cardWidth + 20); // 20 is the margin-right
    carousel.scrollTo({
        left: scrollPosition,
        behavior: 'smooth'
    });
    updateIndicators(index);
}

function updateIndicators(index) {
    indicators.forEach((indicator, i) => {
        if (i === index) {
            indicator.classList.add("activeIndicator");
        } else {
            indicator.classList.remove("activeIndicator");
        }
    });
}

indicators.forEach((indicator, index) => {
    indicator.addEventListener("click", () => slideCarousel(index));
});

// Optional: Auto-scroll functionality
function autoScroll() {
    currentIndex = (currentIndex + 1) % indicators.length;
    slideCarousel(currentIndex);
}

// Uncomment the next line if you want auto-scrolling
// setInterval(autoScroll, 5000); // Change slide every 5 seconds

document.addEventListener('DOMContentLoaded', function() {
    const bar = document.getElementById('bar');
    const nav = document.getElementById('nav');

    bar.addEventListener('click', function(event) {
        event.stopPropagation(); // Prevent this click from being caught by the document listener
        nav.classList.toggle('show');
    });

    // Close the menu when clicking outside
    document.addEventListener('click', function(event) {
        const isClickInsideNav = nav.contains(event.target);
        const isClickOnBar = bar.contains(event.target);

        if (!isClickInsideNav && !isClickOnBar && nav.classList.contains('show')) {
            nav.classList.remove('show');
        }
    });

    // Close the menu when the screen size changes to desktop view
    window.addEventListener('resize', function() {
        if (window.innerWidth >= 768 && nav.classList.contains('show')) {
            nav.classList.remove('show');
        }
    });

    const userIcon = document.getElementById('userIcon');
    const authFormContainer = document.getElementById('authFormContainer');
    const closeAuthForm = document.getElementById('closeAuthForm');

    userIcon.addEventListener('click', () => {
        console.log('User icon clicked'); // Add this line for debugging
        authFormContainer.classList.remove('hidden');
    });

    closeAuthForm.addEventListener('click', () => {
        authFormContainer.classList.add('hidden');
    });

    authFormContainer.addEventListener('click', (e) => {
        if (e.target === authFormContainer) {
            authFormContainer.classList.add('hidden');
        }
    });

    const loginForm = document.getElementById('loginForm');
    
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        
        // Here you would typically send these credentials to your server for verification
        // This is a simplified example
        if (username === 'user' && password === 'password') {
            // Successful login
            window.location.href = 'dashboard.html';
        } else {
            alert('Invalid credentials');
        }
    });

    const carouselWrapper = document.querySelector('.carousel-wrapper');
    const carouselItems = document.querySelectorAll('.carousel-item');
    const indicatorsContainer = document.querySelector('.carousel-indicators');
    let currentIndex = 0;

    // Create indicators
    carouselItems.forEach((_, index) => {
        const indicator = document.createElement('div');
        indicator.classList.add('carousel-indicator');
        if (index === 0) indicator.classList.add('active');
        indicator.addEventListener('click', () => goToSlide(index));
        indicatorsContainer.appendChild(indicator);
    });

    function goToSlide(index) {
        currentIndex = index;
        const offset = carouselItems[index].offsetLeft;
        carouselWrapper.scrollTo({
            left: offset,
            behavior: 'smooth'
        });
        updateIndicators();
    }

    function updateIndicators() {
        const indicators = document.querySelectorAll('.carousel-indicator');
        indicators.forEach((indicator, index) => {
            if (index === currentIndex) {
                indicator.classList.add('active');
            } else {
                indicator.classList.remove('active');
            }
        });
    }

    // Optional: Auto-scroll
    setInterval(() => {
        currentIndex = (currentIndex + 1) % carouselItems.length;
        goToSlide(currentIndex);
    }, 5000);
});
