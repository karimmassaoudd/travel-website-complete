// JavaScript for booking functionality
document.addEventListener('DOMContentLoaded', function() {
    // DOM elements
    const bookingSteps = document.querySelectorAll('.booking-step');
    const bookingSections = document.querySelectorAll('.booking-section');
    const nextButtons = document.querySelectorAll('.btn-next');
    const prevButtons = document.querySelectorAll('.btn-prev');
    const destinationOptions = document.querySelectorAll('.destination-option');
    const packageOptions = document.querySelectorAll('.package-option');
    const paymentMethods = document.querySelectorAll('.payment-method');
    
    // Selected values
    let selectedDestination = null;
    let selectedPackage = null;
    let selectedPaymentMethod = null;
    
    // Initialize booking form
    function initBooking() {
        // Set up event listeners for step navigation
        nextButtons.forEach(button => {
            button.addEventListener('click', function() {
                const nextStep = this.getAttribute('data-next');
                if (nextStep) {
                    goToStep(nextStep);
                }
            });
        });
        
        prevButtons.forEach(button => {
            button.addEventListener('click', function() {
                const prevStep = this.getAttribute('data-prev');
                if (prevStep) {
                    goToStep(prevStep);
                }
            });
        });
        
        // Set up destination selection
        destinationOptions.forEach(option => {
            option.addEventListener('click', function() {
                // Remove selected class from all options
                destinationOptions.forEach(opt => opt.classList.remove('selected'));
                // Add selected class to clicked option
                this.classList.add('selected');
                // Store selected destination
                selectedDestination = this.getAttribute('data-destination');
                // Update summary
                updateSummary();
                // Enable next button
                document.querySelector('#step-1 .btn-next').removeAttribute('disabled');
            });
        });
        
        // Set up package selection
        packageOptions.forEach(option => {
            option.addEventListener('click', function() {
                // Remove selected class from all options
                packageOptions.forEach(opt => opt.classList.remove('selected'));
                // Add selected class to clicked option
                this.classList.add('selected');
                // Store selected package
                selectedPackage = this.getAttribute('data-package');
                // Update summary
                updateSummary();
            });
        });
        
        // Set up payment method selection
        paymentMethods.forEach(method => {
            method.addEventListener('click', function() {
                // Remove selected class from all methods
                paymentMethods.forEach(m => m.classList.remove('selected'));
                // Add selected class to clicked method
                this.classList.add('selected');
                // Store selected payment method
                selectedPaymentMethod = this.getAttribute('data-payment');
                // Show/hide credit card form
                if (selectedPaymentMethod === 'credit-card') {
                    document.getElementById('credit-card-form').style.display = 'block';
                } else {
                    document.getElementById('credit-card-form').style.display = 'none';
                }
            });
        });
        
        // Set up date inputs with min date of today
        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const dd = String(today.getDate()).padStart(2, '0');
        const todayStr = `${yyyy}-${mm}-${dd}`;
        
        document.getElementById('travel-date').min = todayStr;
        document.getElementById('return-date').min = todayStr;
        
        // Set up date change listeners
        document.getElementById('travel-date').addEventListener('change', function() {
            document.getElementById('return-date').min = this.value;
            updateSummary();
        });
        
        document.getElementById('return-date').addEventListener('change', updateSummary);
        document.getElementById('adults').addEventListener('change', updateSummary);
        document.getElementById('children').addEventListener('change', updateSummary);
        
        // Check for destination in URL parameters
        const urlParams = new URLSearchParams(window.location.search);
        const destinationParam = urlParams.get('destination');
        if (destinationParam) {
            const destinationElement = document.querySelector(`.destination-option[data-destination="${destinationParam}"]`);
            if (destinationElement) {
                destinationElement.click();
            }
        }
        
        // Set up form validation
        document.querySelector('#step-4 .btn-next').addEventListener('click', function(e) {
            if (!document.getElementById('terms-checkbox').checked) {
                alert('Please agree to the Terms and Conditions to complete your booking.');
                e.preventDefault();
                return false;
            }
            
            if (selectedPaymentMethod === 'credit-card') {
                const cardName = document.getElementById('card-name').value;
                const cardNumber = document.getElementById('card-number').value;
                const expiryDate = document.getElementById('expiry-date').value;
                const cvv = document.getElementById('cvv').value;
                
                if (!cardName || !cardNumber || !expiryDate || !cvv) {
                    alert('Please fill in all credit card details.');
                    e.preventDefault();
                    return false;
                }
            }
            
            // Generate booking reference
            const bookingRef = generateBookingReference();
            document.getElementById('booking-reference').textContent = bookingRef;
            
            // Update booking details
            document.getElementById('booking-destination').textContent = document.getElementById('summary-destination').textContent;
            document.getElementById('booking-dates').textContent = document.getElementById('summary-dates').textContent;
            document.getElementById('booking-package').textContent = document.getElementById('summary-package').textContent;
            document.getElementById('booking-total').textContent = document.getElementById('summary-total-price').textContent;
            
            // Submit booking to API
            submitBooking();
        });
    }
    
    // Navigate to a specific step
    function goToStep(stepNumber) {
        // Update step indicators
        bookingSteps.forEach(step => {
            const stepNum = step.getAttribute('data-step');
            step.classList.remove('active', 'completed');
            
            if (stepNum < stepNumber) {
                step.classList.add('completed');
            } else if (stepNum === stepNumber) {
                step.classList.add('active');
            }
        });
        
        // Show the correct section
        bookingSections.forEach(section => {
            section.classList.remove('active');
        });
        document.getElementById(`step-${stepNumber}`).classList.add('active');
        
        // Scroll to top of the section
        document.querySelector('.booking-container').scrollIntoView({ behavior: 'smooth' });
    }
    
    // Update booking summary
    function updateSummary() {
        // Update destination
        if (selectedDestination) {
            const destinationElement = document.querySelector(`.destination-option[data-destination="${selectedDestination}"]`);
            if (destinationElement) {
                const destinationTitle = destinationElement.querySelector('.destination-option-title').textContent;
                document.getElementById('summary-destination').textContent = destinationTitle;
                document.getElementById('booking-destination').textContent = destinationTitle;
            }
        }
        
        // Update dates
        const travelDate = document.getElementById('travel-date').value;
        const returnDate = document.getElementById('return-date').value;
        if (travelDate && returnDate) {
            const formattedTravelDate = formatDate(travelDate);
            const formattedReturnDate = formatDate(returnDate);
            const dateText = `${formattedTravelDate} - ${formattedReturnDate}`;
            document.getElementById('summary-dates').textContent = dateText;
            document.getElementById('booking-dates').textContent = dateText;
        }
        
        // Update travelers
        const adults = document.getElementById('adults').value;
        const children = document.getElementById('children').value;
        const travelersText = `${adults} Adults, ${children} Children`;
        document.getElementById('summary-travelers').textContent = travelersText;
        
        // Update package
        if (selectedPackage) {
            const packageElement = document.querySelector(`.package-option[data-package="${selectedPackage}"]`);
            if (packageElement) {
                const packageTitle = packageElement.querySelector('.package-title').textContent;
                const packagePrice = packageElement.querySelector('.package-price').textContent.match(/\$[\d,]+/)[0];
                document.getElementById('summary-package').textContent = packageTitle;
                document.getElementById('summary-price-per-person').textContent = packagePrice;
                document.getElementById('booking-package').textContent = packageTitle;
                
                // Calculate total price
                const pricePerPerson = parseInt(packagePrice.replace(/[$,]/g, ''));
                const totalTravelers = parseInt(adults) + parseInt(children);
                const totalPrice = pricePerPerson * totalTravelers;
                document.getElementById('summary-total-price').textContent = `$${totalPrice.toLocaleString()}`;
                document.getElementById('booking-total').textContent = `$${totalPrice.toLocaleString()}`;
            }
        }
    }
    
    // Format date for display
    function formatDate(dateString) {
        const date = new Date(dateString);
        const options = { month: 'short', day: 'numeric', year: 'numeric' };
        return date.toLocaleDateString('en-US', options);
    }
    
    // Generate a random booking reference
    function generateBookingReference() {
        const prefix = 'TW';
        const year = new Date().getFullYear();
        const randomNum = Math.floor(10000 + Math.random() * 90000);
        return `${prefix}-${year}-${randomNum}`;
    }
    
    // Submit booking to API
    function submitBooking() {
        // Get form data
        const bookingData = {
            destination: selectedDestination,
            travelDate: document.getElementById('travel-date').value,
            returnDate: document.getElementById('return-date').value,
            adults: document.getElementById('adults').value,
            children: document.getElementById('children').value,
            package: selectedPackage,
            firstName: document.getElementById('first-name').value,
            lastName: document.getElementById('last-name').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            address: document.getElementById('address').value,
            city: document.getElementById('city').value,
            country: document.getElementById('country').value,
            specialRequests: document.getElementById('special-requests').value,
            paymentMethod: selectedPaymentMethod,
            bookingReference: document.getElementById('booking-reference').textContent,
            totalPrice: document.getElementById('summary-total-price').textContent
        };
        
        // Send booking data to API
        fetch('/api/bookings', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(bookingData)
        })
        .then(response => response.json())
        .then(data => {
            console.log('Booking successful:', data);
            // Booking is already confirmed in the UI, no need for additional action
        })
        .catch(error => {
            console.error('Error submitting booking:', error);
            // Even if API call fails, show confirmation to user
            // In a real app, you might want to handle this differently
        });
    }
    
    // Initialize booking functionality
    initBooking();
});
