// Main JavaScript file for the website
document.addEventListener('DOMContentLoaded', function() {
    // Initialize authentication
    initAuth();
    
    // Mobile menu toggle
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const nav = document.querySelector('nav');
    
    if (mobileMenuToggle && nav) {
        mobileMenuToggle.addEventListener('click', function() {
            nav.classList.toggle('active');
        });
    }
    
    // Testimonial slider
    const testimonialSlider = document.querySelector('.testimonial-slider');
    const testimonialPrev = document.querySelector('.testimonial-prev');
    const testimonialNext = document.querySelector('.testimonial-next');
    
    if (testimonialSlider && testimonialPrev && testimonialNext) {
        let currentSlide = 0;
        const slides = testimonialSlider.querySelectorAll('.testimonial-card');
        
        if (slides.length > 0) {
            testimonialPrev.addEventListener('click', function() {
                currentSlide = (currentSlide - 1 + slides.length) % slides.length;
                updateSlider();
            });
            
            testimonialNext.addEventListener('click', function() {
                currentSlide = (currentSlide + 1) % slides.length;
                updateSlider();
            });
            
            function updateSlider() {
                testimonialSlider.style.transform = `translateX(-${currentSlide * 100}%)`;
            }
        }
    }
    
    // FAQ accordion
    const faqItems = document.querySelectorAll('.faq-item');
    
    if (faqItems.length > 0) {
        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            
            question.addEventListener('click', function() {
                item.classList.toggle('active');
            });
        });
    }
    
    // Booking form steps
    const bookingSteps = document.querySelectorAll('.booking-step');
    const bookingForms = document.querySelectorAll('.booking-form');
    const nextButtons = document.querySelectorAll('.btn-next');
    const prevButtons = document.querySelectorAll('.btn-prev');
    
    if (bookingSteps.length > 0 && bookingForms.length > 0) {
        nextButtons.forEach(button => {
            button.addEventListener('click', function() {
                const nextStep = this.getAttribute('data-next');
                
                if (nextStep) {
                    // Hide all forms
                    bookingForms.forEach(form => {
                        form.classList.remove('active');
                    });
                    
                    // Show the next form
                    document.getElementById(`booking-step-${nextStep}`).classList.add('active');
                    
                    // Update steps
                    bookingSteps.forEach(step => {
                        step.classList.remove('active');
                        
                        if (step.getAttribute('data-step') === nextStep) {
                            step.classList.add('active');
                        }
                    });
                    
                    // Scroll to top of form
                    window.scrollTo({
                        top: document.querySelector('.booking-steps').offsetTop - 100,
                        behavior: 'smooth'
                    });
                }
            });
        });
        
        prevButtons.forEach(button => {
            button.addEventListener('click', function() {
                const prevStep = this.getAttribute('data-prev');
                
                if (prevStep) {
                    // Hide all forms
                    bookingForms.forEach(form => {
                        form.classList.remove('active');
                    });
                    
                    // Show the previous form
                    document.getElementById(`booking-step-${prevStep}`).classList.add('active');
                    
                    // Update steps
                    bookingSteps.forEach(step => {
                        step.classList.remove('active');
                        
                        if (step.getAttribute('data-step') === prevStep) {
                            step.classList.add('active');
                        }
                    });
                    
                    // Scroll to top of form
                    window.scrollTo({
                        top: document.querySelector('.booking-steps').offsetTop - 100,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
    
    // Destination selection in booking form
    const destinationSelect = document.getElementById('destination');
    const previewContent = document.querySelector('.preview-content');
    const previewPlaceholder = document.querySelector('.preview-placeholder');
    
    if (destinationSelect && previewContent && previewPlaceholder) {
        destinationSelect.addEventListener('change', function() {
            const selectedValue = this.value;
            
            if (selectedValue) {
                // Show preview content and hide placeholder
                previewContent.style.display = 'flex';
                previewPlaceholder.style.display = 'none';
                
                // Update preview content based on selection
                // This would typically fetch data from the API
                const destinations = {
                    '1': {
                        name: 'Bali, Indonesia',
                        image: 'images/bali.jpg',
                        description: 'Experience the perfect blend of beautiful beaches, vibrant culture, and spiritual retreats.',
                        rating: 4.8,
                        price: 'From $899'
                    },
                    '2': {
                        name: 'Paris, France',
                        image: 'images/paris.jpg',
                        description: 'Discover the city of love with its iconic landmarks, world-class cuisine, and artistic heritage.',
                        rating: 4.7,
                        price: 'From $1,099'
                    },
                    '3': {
                        name: 'Santorini, Greece',
                        image: 'images/santorini.jpg',
                        description: 'Enjoy breathtaking sunsets, white-washed buildings, and crystal-clear waters on this magical island.',
                        rating: 4.9,
                        price: 'From $1,299'
                    },
                    '4': {
                        name: 'Tokyo, Japan',
                        image: 'images/tokyo.jpg',
                        description: 'Experience the perfect blend of traditional culture and futuristic technology in Japan\'s vibrant capital.',
                        rating: 4.8,
                        price: 'From $1,299'
                    },
                    '5': {
                        name: 'New York, USA',
                        image: 'images/newyork.jpg',
                        description: 'Experience the vibrant energy of the Big Apple with its iconic skyline and diverse culture.',
                        rating: 4.6,
                        price: 'From $999'
                    },
                    '6': {
                        name: 'Rome, Italy',
                        image: 'images/rome.jpg',
                        description: 'Explore the ancient ruins, Renaissance masterpieces, and delicious cuisine in the Eternal City.',
                        rating: 4.7,
                        price: 'From $999'
                    }
                };
                
                const destination = destinations[selectedValue];
                
                if (destination) {
                    const previewImage = previewContent.querySelector('.preview-image');
                    const previewName = previewContent.querySelector('.preview-name');
                    const previewRating = previewContent.querySelector('.preview-rating');
                    const previewDescription = previewContent.querySelector('.preview-description');
                    const previewPrice = previewContent.querySelector('.preview-price');
                    
                    previewImage.src = destination.image;
                    previewImage.alt = destination.name;
                    previewName.textContent = destination.name;
                    
                    // Create rating stars
                    let ratingHTML = '';
                    for (let i = 0; i < 5; i++) {
                        if (i < Math.floor(destination.rating)) {
                            ratingHTML += '<i class="fas fa-star"></i>';
                        } else if (i < destination.rating) {
                            ratingHTML += '<i class="fas fa-star-half-alt"></i>';
                        } else {
                            ratingHTML += '<i class="far fa-star"></i>';
                        }
                    }
                    ratingHTML += ` <span>${destination.rating}</span>`;
                    previewRating.innerHTML = ratingHTML;
                    
                    previewDescription.textContent = destination.description;
                    previewPrice.textContent = destination.price;
                }
            } else {
                // Hide preview content and show placeholder
                previewContent.style.display = 'none';
                previewPlaceholder.style.display = 'block';
            }
        });
    }
    
    // Update booking summary
    const arrivalDate = document.getElementById('arrival-date');
    const departureDate = document.getElementById('departure-date');
    const travelers = document.getElementById('travelers');
    const accommodation = document.getElementById('accommodation');
    const activities = document.querySelectorAll('input[name="activities"]');
    
    const summaryDestination = document.getElementById('summary-destination');
    const summaryDates = document.getElementById('summary-dates');
    const summaryTravelers = document.getElementById('summary-travelers');
    const summaryAccommodation = document.getElementById('summary-accommodation');
    const summaryBasePrice = document.getElementById('summary-base-price');
    const summaryActivities = document.getElementById('summary-activities');
    const summaryTaxes = document.getElementById('summary-taxes');
    const summaryTotal = document.getElementById('summary-total');
    
    // Confirmation summary elements
    const confirmDestination = document.getElementById('confirm-destination');
    const confirmDates = document.getElementById('confirm-dates');
    const confirmTravelers = document.getElementById('confirm-travelers');
    const confirmAccommodation = document.getElementById('confirm-accommodation');
    const confirmTotal = document.getElementById('confirm-total');
    
    function updateBookingSummary() {
        if (destinationSelect && arrivalDate && departureDate && travelers && accommodation && 
            summaryDestination && summaryDates && summaryTravelers && summaryAccommodation && 
            summaryBasePrice && summaryActivities && summaryTaxes && summaryTotal) {
            
            // Get selected destination
            const selectedDestination = destinationSelect.options[destinationSelect.selectedIndex]?.text || 'Not selected';
            summaryDestination.textContent = selectedDestination;
            
            // Format dates
            let formattedArrival = 'Not selected';
            let formattedDeparture = 'Not selected';
            
            if (arrivalDate.value && departureDate.value) {
                const arrivalObj = new Date(arrivalDate.value);
                const departureObj = new Date(departureDate.value);
                
                const options = { year: 'numeric', month: 'short', day: 'numeric' };
                formattedArrival = arrivalObj.toLocaleDateString('en-US', options);
                formattedDeparture = departureObj.toLocaleDateString('en-US', options);
            }
            
            summaryDates.textContent = `${formattedArrival} - ${formattedDeparture}`;
            
            // Get number of travelers
            const selectedTravelers = travelers.options[travelers.selectedIndex]?.text || '1 Traveler';
            summaryTravelers.textContent = selectedTravelers;
            
            // Get accommodation type
            const selectedAccommodation = accommodation.options[accommodation.selectedIndex]?.text || 'Not selected';
            summaryAccommodation.textContent = selectedAccommodation;
            
            // Calculate base price (this would typically come from the API)
            const basePrice = 899 * parseInt(travelers.value || 1);
            summaryBasePrice.textContent = `$${basePrice.toFixed(2)}`;
            
            // Calculate activities price
            let activitiesPrice = 0;
            activities.forEach(activity => {
                if (activity.checked) {
                    activitiesPrice += 50; // $50 per activity
                }
            });
            summaryActivities.textContent = `$${activitiesPrice.toFixed(2)}`;
            
            // Calculate taxes (10% of base price + activities)
            const taxesPrice = (basePrice + activitiesPrice) * 0.1;
            summaryTaxes.textContent = `$${taxesPrice.toFixed(2)}`;
            
            // Calculate total
            const totalPrice = basePrice + activitiesPrice + taxesPrice;
            summaryTotal.textContent = `$${totalPrice.toFixed(2)}`;
            
            // Update confirmation summary if elements exist
            if (confirmDestination) confirmDestination.textContent = selectedDestination;
            if (confirmDates) confirmDates.textContent = `${formattedArrival} - ${formattedDeparture}`;
            if (confirmTravelers) confirmTravelers.textContent = selectedTravelers;
            if (confirmAccommodation) confirmAccommodation.textContent = selectedAccommodation;
            if (confirmTotal) confirmTotal.textContent = `$${totalPrice.toFixed(2)}`;
        }
    }
    
    // Add event listeners to update summary
    if (destinationSelect) destinationSelect.addEventListener('change', updateBookingSummary);
    if (arrivalDate) arrivalDate.addEventListener('change', updateBookingSummary);
    if (departureDate) departureDate.addEventListener('change', updateBookingSummary);
    if (travelers) travelers.addEventListener('change', updateBookingSummary);
    if (accommodation) accommodation.addEventListener('change', updateBookingSummary);
    
    if (activities.length > 0) {
        activities.forEach(activity => {
            activity.addEventListener('change', updateBookingSummary);
        });
    }
    
    // Initialize booking summary
    updateBookingSummary();
    
    // Newsletter form submission
    const newsletterForms = document.querySelectorAll('.newsletter-form');
    
    if (newsletterForms.length > 0) {
        newsletterForms.forEach(form => {
            form.addEventListener('submit', function(e) {
                e.preventDefault();
                
                const emailInput = this.querySelector('input[type="email"]');
                const email = emailInput.value;
                
                if (email) {
                    // This would typically send the email to the API
                    alert(`Thank you for subscribing with ${email}! You will now receive our latest travel deals and inspiration.`);
                    emailInput.value = '';
                }
            });
        });
    }
});

// Initialize authentication
function initAuth() {
    // Check if user is logged in
    const authToken = localStorage.getItem('authToken');
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    
    // Update UI based on authentication status
    updateAuthUI(authToken, user);
}

// Update UI based on authentication status
function updateAuthUI(token, user) {
    const userActions = document.querySelector('.user-actions');
    if (userActions) {
        if (token) {
            // User is logged in
            userActions.innerHTML = `
                <div class="user-profile">
                    <span>Welcome, ${user.name || 'User'}</span>
                    <button id="logout-btn" class="btn-logout">Logout</button>
                </div>
            `;
            
            // Add logout event listener
            const logoutBtn = document.getElementById('logout-btn');
            if (logoutBtn) {
                logoutBtn.addEventListener('click', function() {
                    // Clear localStorage
                    localStorage.removeItem('authToken');
                    localStorage.removeItem('user');
                    
                    // Redirect to home page
                    window.location.href = 'index.html';
                });
            }
        } else {
            // User is not logged in
            userActions.innerHTML = `
                <button class="btn-login" onclick="window.location.href='login.html'">Login</button>
                <button class="btn-signup" onclick="window.location.href='signup.html'">Sign Up</button>
            `;
        }
    }
}
