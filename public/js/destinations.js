// JavaScript for destinations page functionality
document.addEventListener('DOMContentLoaded', function() {
    // DOM elements
    const filterForm = document.getElementById('filter-form');
    const resetFiltersBtn = document.getElementById('reset-filters');
    const applyFiltersBtn = document.getElementById('apply-filters');
    const destinationsContainer = document.getElementById('destinations-container');
    const paginationPrev = document.querySelector('.pagination-prev');
    const paginationNext = document.querySelector('.pagination-next');
    const paginationNumbers = document.querySelector('.pagination-numbers');
    
    // State variables
    let currentPage = 1;
    let totalPages = 3; // Default value, will be updated from API
    let destinations = [];
    let filters = {
        region: '',
        type: '',
        budget: '',
        duration: '',
        rating: '',
        search: ''
    };
    
    // Initialize destinations page
    function initDestinations() {
        // Load destinations from API
        fetchDestinations();
        
        // Set up event listeners
        filterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            applyFilters();
        });
        
        resetFiltersBtn.addEventListener('click', resetFilters);
        
        document.getElementById('destination-search').addEventListener('input', function() {
            filters.search = this.value.trim().toLowerCase();
        });
        
        document.getElementById('destination-region').addEventListener('change', function() {
            filters.region = this.value;
        });
        
        document.getElementById('destination-type').addEventListener('change', function() {
            filters.type = this.value;
        });
        
        document.getElementById('destination-budget').addEventListener('change', function() {
            filters.budget = this.value;
        });
        
        document.getElementById('destination-duration').addEventListener('change', function() {
            filters.duration = this.value;
        });
        
        document.getElementById('destination-rating').addEventListener('change', function() {
            filters.rating = this.value;
        });
        
        // Set up pagination
        paginationPrev.addEventListener('click', function() {
            if (currentPage > 1) {
                currentPage--;
                fetchDestinations();
                updatePagination();
            }
        });
        
        paginationNext.addEventListener('click', function() {
            if (currentPage < totalPages) {
                currentPage++;
                fetchDestinations();
                updatePagination();
            }
        });
        
        // Initialize pagination
        updatePagination();
    }
    
    // Fetch destinations from API
    function fetchDestinations() {
        // Build query parameters
        const queryParams = new URLSearchParams();
        queryParams.append('page', currentPage);
        
        if (filters.region) queryParams.append('region', filters.region);
        if (filters.type) queryParams.append('type', filters.type);
        if (filters.budget) queryParams.append('budget', filters.budget);
        if (filters.duration) queryParams.append('duration', filters.duration);
        if (filters.rating) queryParams.append('rating', filters.rating);
        if (filters.search) queryParams.append('search', filters.search);
        
        // Make API request
        fetch(`/api/destinations?${queryParams.toString()}`)
            .then(response => response.json())
            .then(data => {
                destinations = data.destinations || [];
                totalPages = data.totalPages || 3;
                renderDestinations();
                updatePagination();
            })
            .catch(error => {
                console.error('Error fetching destinations:', error);
                // If API fails, use sample data
                useSampleDestinations();
            });
    }
    
    // Use sample destinations if API fails
    function useSampleDestinations() {
        // Sample destinations data
        destinations = [
            {
                id: 'paris',
                name: 'Paris, France',
                region: 'Europe',
                type: 'City',
                price: 1099,
                description: 'Experience the city of love with its iconic landmarks, world-class cuisine, and artistic heritage. Visit the Eiffel Tower, Louvre Museum, and enjoy romantic walks along the Seine River.',
                duration: '5-7 days',
                features: ['Fine Dining', 'Cultural', 'Romantic'],
                rating: 4.7,
                image: 'images/destinations/destination1.jpg'
            },
            {
                id: 'bali',
                name: 'Bali, Indonesia',
                region: 'Asia',
                type: 'Beach',
                price: 899,
                description: 'Experience the perfect blend of beautiful beaches, vibrant culture, and spiritual retreats. Explore ancient temples, lush rice terraces, and enjoy world-class surfing and diving.',
                duration: '7-10 days',
                features: ['Beach', 'Wellness', 'Adventure'],
                rating: 4.8,
                image: 'images/destinations/destination2.jpg'
            },
            {
                id: 'santorini',
                name: 'Santorini, Greece',
                region: 'Europe',
                type: 'Island',
                price: 1299,
                description: 'Enjoy breathtaking sunsets, white-washed buildings, and crystal-clear waters on this magical island. Perfect for romantic getaways and photography enthusiasts.',
                duration: '5-7 days',
                features: ['Romance', 'Scenic Views', 'Beaches'],
                rating: 4.9,
                image: 'images/destinations/destination3.jpg'
            },
            {
                id: 'rome',
                name: 'Rome, Italy',
                region: 'Europe',
                type: 'Historical',
                price: 999,
                description: 'Step back in time and explore the ancient ruins, magnificent architecture, and world-renowned cuisine of the Eternal City. Visit the Colosseum, Vatican City, and throw a coin in the Trevi Fountain.',
                duration: '4-6 days',
                features: ['Historical', 'Cuisine', 'Art'],
                rating: 4.6,
                image: 'images/destinations/destination4.jpg'
            },
            {
                id: 'tokyo',
                name: 'Tokyo, Japan',
                region: 'Asia',
                type: 'City',
                price: 1599,
                description: 'Experience the perfect blend of traditional culture and futuristic technology in Japan\'s vibrant capital. Visit ancient temples, explore bustling markets, and enjoy world-class cuisine.',
                duration: '7-10 days',
                features: ['Cuisine', 'Urban', 'Technology'],
                rating: 4.8,
                image: 'images/tokyo.jpg'
            },
            {
                id: 'newyork',
                name: 'New York, USA',
                region: 'North America',
                type: 'City',
                price: 1299,
                description: 'Discover the city that never sleeps with its iconic skyline, world-class museums, Broadway shows, and diverse neighborhoods. Experience the energy of Times Square and the tranquility of Central Park.',
                duration: '5-7 days',
                features: ['Entertainment', 'Shopping', 'Culture'],
                rating: 4.7,
                image: 'images/newyork.jpg'
            }
        ];
        
        renderDestinations();
    }
    
    // Render destinations to the page
    function renderDestinations() {
        // Clear current destinations
        destinationsContainer.innerHTML = '';
        
        // If no destinations found
        if (destinations.length === 0) {
            destinationsContainer.innerHTML = `
                <div class="no-results">
                    <h3>No destinations found</h3>
                    <p>Try adjusting your filters or search criteria</p>
                </div>
            `;
            return;
        }
        
        // Render each destination
        destinations.forEach(destination => {
            const destinationCard = document.createElement('div');
            destinationCard.className = 'destination-card';
            
            // Create features HTML
            const featuresHTML = destination.features.map(feature => `
                <div class="destination-feature">
                    <i class="fas fa-${getFeatureIcon(feature)}"></i>
                    <span>${feature}</span>
                </div>
            `).join('');
            
            // Create rating HTML
            const ratingHTML = generateRatingStars(destination.rating);
            
            destinationCard.innerHTML = `
                <div class="destination-image">
                    <img src="${destination.image}" alt="${destination.name}">
                    <div class="destination-category">${destination.type}</div>
                </div>
                <div class="destination-content">
                    <div class="destination-header">
                        <div class="destination-title">
                            <h3>${destination.name}</h3>
                            <div class="destination-location">
                                <i class="fas fa-map-marker-alt"></i>
                                <span>${destination.region}</span>
                            </div>
                        </div>
                        <div class="destination-price">From $${destination.price}</div>
                    </div>
                    <p class="destination-description">${destination.description}</p>
                    <div class="destination-features">
                        <div class="destination-feature">
                            <i class="fas fa-calendar-alt"></i>
                            <span>${destination.duration}</span>
                        </div>
                        ${featuresHTML}
                    </div>
                    <div class="destination-footer">
                        <div class="destination-rating">
                            ${ratingHTML}
                            <span>${destination.rating}</span>
                        </div>
                        <a href="booking.html?destination=${destination.id}" class="btn-view-details">View Details</a>
                    </div>
                </div>
            `;
            
            destinationsContainer.appendChild(destinationCard);
        });
    }
    
    // Apply filters
    function applyFilters() {
        currentPage = 1;
        fetchDestinations();
    }
    
    // Reset filters
    function resetFilters() {
        document.getElementById('destination-region').value = '';
        document.getElementById('destination-type').value = '';
        document.getElementById('destination-budget').value = '';
        document.getElementById('destination-duration').value = '';
        document.getElementById('destination-rating').value = '';
        document.getElementById('destination-search').value = '';
        
        filters = {
            region: '',
            type: '',
            budget: '',
            duration: '',
            rating: '',
            search: ''
        };
        
        currentPage = 1;
        fetchDestinations();
    }
    
    // Update pagination
    function updatePagination() {
        // Update prev/next buttons
        paginationPrev.disabled = currentPage <= 1;
        paginationNext.disabled = currentPage >= totalPages;
        
        // Update page numbers
        paginationNumbers.innerHTML = '';
        
        // Determine which page numbers to show
        let startPage = Math.max(1, currentPage - 1);
        let endPage = Math.min(totalPages, startPage + 2);
        
        // Adjust if we're at the end
        if (endPage - startPage < 2) {
            startPage = Math.max(1, endPage - 2);
        }
        
        // Create page number buttons
        for (let i = startPage; i <= endPage; i++) {
            const pageButton = document.createElement('button');
            pageButton.className = 'pagination-number';
            if (i === currentPage) {
                pageButton.classList.add('active');
            }
            pageButton.textContent = i;
            pageButton.addEventListener('click', function() {
                currentPage = i;
                fetchDestinations();
                updatePagination();
            });
            paginationNumbers.appendChild(pageButton);
        }
    }
    
    // Helper function to get icon for feature
    function getFeatureIcon(feature) {
        const iconMap = {
            'Fine Dining': 'utensils',
            'Cultural': 'landmark',
            'Romantic': 'heart',
            'Beach': 'umbrella-beach',
            'Wellness': 'spa',
            'Adventure': 'hiking',
            'Scenic Views': 'camera',
            'Beaches': 'water',
            'Historical': 'monument',
            'Cuisine': 'utensils',
            'Art': 'palette',
            'Urban': 'city',
            'Technology': 'microchip',
            'Entertainment': 'theater-masks',
            'Shopping': 'shopping-bag',
            'Culture': 'book'
        };
        
        return iconMap[feature] || 'check';
    }
    
    // Helper function to generate rating stars
    function generateRatingStars(rating) {
        let starsHTML = '';
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;
        
        // Add full stars
        for (let i = 0; i < fullStars; i++) {
            starsHTML += '<i class="fas fa-star"></i>';
        }
        
        // Add half star if needed
        if (hasHalfStar) {
            starsHTML += '<i class="fas fa-star-half-alt"></i>';
        }
        
        // Add empty stars
        const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
        for (let i = 0; i < emptyStars; i++) {
            starsHTML += '<i class="far fa-star"></i>';
        }
        
        return starsHTML;
    }
    
    // Initialize destinations page
    initDestinations();
});
