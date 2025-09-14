// Validate Email
function validateEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

// Store email function
function storeEmail (email) {
    // localStorage
    localStorage.setItem('userEmail', email);

    // sessionStorage
    sessionStorage.setItem('sessionEmail', email);

    // cookie expiration 
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + 30); // 30 days from now
    document.cookie = `userEmail=${email}; expires=${expirationDate.toUTCString()}; path=/`;
}

// get stored email form localStorage, sessionStorage, or cookies
function getStoredEmail() {
    // First check cookies
    const cookieMatch = document.cookie.match('(^|;)\\s*userEmail=([^;]+)');
    if (cookieMatch) return cookieMatch[2];

    // Check sessionStorage
    const sessionEmail = sessionStorage.getItem('sessionEmail');
    if (sessionEmail) return sessionEmail;

    // Check localStorage
    return localStorage.getItem('userEmail');
}

// Handle Newsletter Form Submission
function initializeNewsletterValidation() {
    const newsletterForm = document.getElementById("newsletter-form");
    if (newsletterForm) {
        newsletterForm.addEventListener("submit", function (e) {
            const emailInput = newsletterForm.querySelector('input[type="email"]');
            const email = emailInput.value.trim();

            if (!validateEmail(email)) {
                e.preventDefault();
                alert("Please enter a valid email address.");
                emailInput.focus();
            } else {
                // If valid email, store it in localStorage, sessionStorage, and/or cookies
                storeEmail(email);
                alert("Subscription successful! Your email has been saved.");
            }
        });
    } else {
        console.warn("Newsletter form not found. Skipping validation setup.");
    }
}

// Carousel Function
function initializeCarousel(containerSelector) {
    const container = $(containerSelector);
    const wrapper = container.find('.carousel-wrapper');
    const items = container.find('.news-item');
    const totalItems = items.length;
    const itemWidth = items.outerWidth();
    let currentIndex = 0;

    // Update carousel position
    function updateCarousel() {
        const offset = -currentIndex * itemWidth;
        wrapper.css('transform', `translateX(${offset}px)`);
    }

    // Left arrow click event
    container.find('.left-arrow').click(function () {
        currentIndex = (currentIndex - 1 + totalItems) % totalItems;
        updateCarousel();
    });

    // Right arrow click event
    container.find('.right-arrow').click(function () {
        currentIndex = (currentIndex + 1) % totalItems;
        updateCarousel();
    });
}

// Load Achievements
function loadAchievements() {
    const achievementsContainer = document.getElementById("achievements-container");

    // Fetch achievements JSON
    fetch('assets/data/achievements.json')
        .then(response => {
            if (!response.ok) {
                throw new Error("Failed to load achievements data.");
            }
            return response.json();
        })
        .then(data => {
            // Populate achievements
            data.forEach(achievement => {
                const achievementItem = document.createElement("div");
                achievementItem.classList.add("achievement-item");

                const img = document.createElement("img");
                img.src = achievement.image;
                img.alt = achievement.title;

                const title = document.createElement("h3");
                title.textContent = achievement.title;

                const description = document.createElement("p");
                description.textContent = achievement.description;

                achievementItem.appendChild(img);
                achievementItem.appendChild(title);
                achievementItem.appendChild(description);

                achievementsContainer.appendChild(achievementItem);
            });
        })
        .catch(error => {
            console.error("Error loading achievements:", error);
            achievementsContainer.innerHTML = "<p>Failed to load achievements. Please try again later.</p>";
        });
}

// Initialize All Scripts
function initializeScripts() {
    initializeNewsletterValidation();
    loadAchievements();
}

// Run Initialization on Page Load
document.addEventListener("DOMContentLoaded", initializeScripts);

// Initialize the carousel when the page is ready
$(document).ready(function () {
    initializeCarousel('.news-carousel');
});

