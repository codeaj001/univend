// add-listing.js
document.addEventListener('DOMContentLoaded', function() {
            let currentStep = 1;
            const totalSteps = 4;
            let listingType = null;
            let listingData = {
                type: null,
                title: '',
                category: '',
                price: '',
                priceType: 'fixed',
                condition: '',
                images: [],
                description: '',
                tags: [],
                location: null,
                meetingPreference: [],
                availability: {
                    days: [],
                    timeFrom: '',
                    timeTo: ''
                }
            };

            // Initialize UI elements
            const typeCards = document.querySelectorAll('.type-card');
            const nextButton = document.getElementById('nextStep');
            const prevButton = document.getElementById('prevStep');
            const stepDots = document.querySelectorAll('.dot');
            const stepText = document.querySelector('.step-text');

            // Type Selection
            typeCards.forEach(card => {
                card.addEventListener('click', () => {
                    typeCards.forEach(c => c.classList.remove('selected'));
                    card.classList.add('selected');
                    listingType = card.dataset.type;
                    listingData.type = listingType;
                    nextButton.disabled = false;
                });
            });

            // Navigation
            nextButton.addEventListener('click', () => {
                if (currentStep < totalSteps) {
                    if (validateStep(currentStep)) {
                        currentStep++;
                        updateUI();
                    }
                } else {
                    showPreview();
                }
            });

            prevButton.addEventListener('click', () => {
                if (currentStep > 1) {
                    currentStep--;
                    updateUI();
                } else {
                    if (confirm('Are you sure you want to discard this listing?')) {
                        window.location.href = 'profile.html';
                    }
                }
            });

            function updateUI() {
                // Update step indicator
                stepDots.forEach((dot, index) => {
                    dot.classList.toggle('active', index + 1 === currentStep);
                });
                stepText.textContent = `Step ${currentStep} of ${totalSteps}`;

                // Show/hide steps
                document.querySelectorAll('.listing-step').forEach((step, index) => {
                    step.classList.toggle('active', index + 1 === currentStep);
                });

                // Update button text
                nextButton.textContent = currentStep === totalSteps ? 'Preview' : 'Next';

                // Update button visibility
                prevButton.style.display = currentStep === 1 ? 'none' : 'block';
            }

            function validateStep(step) {
                switch (step) {
                    case 1:
                        return listingType !== null;
                    case 2:
                        return validateBasicInfo();
                    case 3:
                        return validateMediaAndDescription();
                    case 4:
                        return validateLocationAndAvailability();
                    default:
                        return true;
                }
                // Continuing add-listing.js...
            }
            // Image Upload Handling
            const uploadBoxes = document.querySelectorAll('.upload-box');
            uploadBoxes.forEach(box => {
                const input = box.querySelector('input[type="file"]');

                box.addEventListener('click', () => {
                    input.click();
                });

                input.addEventListener('change', (e) => {
                    const file = e.target.files[0];
                    if (file) {
                        const reader = new FileReader();
                        reader.onload = (e) => {
                            box.classList.add('has-image');
                            box.innerHTML = `
                        <img src="${e.target.result}" alt="Uploaded image">
                        <button class="remove-image">
                            <span class="material-icons-round">close</span>
                        </button>
                    `;
                            listingData.images.push(e.target.result);
                        };
                        reader.readAsDataURL(file);
                    }
                });

                // Remove image
                box.addEventListener('click', (e) => {
                    if (e.target.closest('.remove-image')) {
                        const index = Array.from(uploadBoxes).indexOf(box);
                        listingData.images = listingData.images.filter((_, i) => i !== index);
                        resetUploadBox(box);
                    }
                });
            });

            function resetUploadBox(box) {
                box.classList.remove('has-image');
                box.innerHTML = `
            <input type="file" accept="image/*" hidden>
            <span class="material-icons-round">add</span>
        `;
            }

            // Tags Input
            const tagsInput = document.querySelector('.tags-input input');
            const tagsContainer = document.querySelector('.tags-container');

            tagsInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' && tagsInput.value.trim()) {
                    e.preventDefault();
                    const tag = tagsInput.value.trim();
                    if (!listingData.tags.includes(tag)) {
                        addTag(tag);
                        listingData.tags.push(tag);
                        tagsInput.value = '';
                    }
                }
            });

            function addTag(text) {
                const tag = document.createElement('div');
                tag.className = 'tag';
                tag.innerHTML = `
            ${text}
            <span class="remove-tag material-icons-round">close</span>
        `;

                tag.querySelector('.remove-tag').addEventListener('click', () => {
                    tag.remove();
                    listingData.tags = listingData.tags.filter(t => t !== text);
                });

                tagsContainer.appendChild(tag);
            }

            // Add this after the updateUI function in add-listing.js

            // Category Selection
            // Category Selection
            const categorySelect = document.getElementById('categorySelect');
            const productCategories = document.querySelector('.product-categories');
            const serviceCategories = document.querySelector('.service-categories');

            // Update visible categories based on listing type
            function updateCategoryOptions() {
                if (listingType === 'product') {
                    productCategories.style.display = '';
                    serviceCategories.style.display = 'none';
                } else if (listingType === 'service') {
                    productCategories.style.display = 'none';
                    serviceCategories.style.display = '';
                }
            }

            // Listen for category selection
            categorySelect.addEventListener('change', (e) => {
                listingData.category = e.target.value;
            });

            // Update categories when listing type changes
            typeCards.forEach(card => {
                card.addEventListener('click', () => {
                    // ... (existing type selection code)
                    updateCategoryOptions();
                });
            });

            // Condition Selection
            const conditionButtons = document.querySelectorAll('.condition-btn');
            conditionButtons.forEach(button => {
                button.addEventListener('click', () => {
                    // Remove selected class from all condition buttons
                    conditionButtons.forEach(btn => btn.classList.remove('selected'));
                    // Add selected class to clicked button
                    button.classList.add('selected');
                    // Update listing data
                    listingData.condition = button.dataset.condition;
                });
            });

            // Location Picker
            let map, marker;

            function initMap() {
                const defaultLocation = { lat: 40.7128, lng: -74.0060 }; // Default to NYC
                map = new google.maps.Map(document.getElementById('locationMap'), {
                    zoom: 13,
                    center: defaultLocation,
                });

                marker = new google.maps.Marker({
                    position: defaultLocation,
                    map: map,
                    draggable: true
                });

                // Update location when marker is dragged
                marker.addListener('dragend', () => {
                    const position = marker.getPosition();
                    listingData.location = {
                        lat: position.lat(),
                        lng: position.lng()
                    };
                    updateLocationInput(position);
                });

                // Initialize Places Autocomplete
                const input = document.querySelector('.location-search input');
                const autocomplete = new google.maps.places.Autocomplete(input);
                autocomplete.addListener('place_changed', () => {
                    const place = autocomplete.getPlace();
                    if (place.geometry) {
                        map.setCenter(place.geometry.location);
                        marker.setPosition(place.geometry.location);
                        listingData.location = {
                            lat: place.geometry.location.lat(),
                            lng: place.geometry.location.lng()
                        };
                    }
                });
            }

            // Availability Modal
            const availabilityButton = document.querySelector('.day-selector');
            const availabilityModal = document.getElementById('availabilityModal');
            const saveAvailability = document.querySelector('.save-availability');

            availabilityButton.addEventListener('click', () => {
                availabilityModal.classList.add('active');
            });

            saveAvailability.addEventListener('click', () => {
                const selectedDays = Array.from(document.querySelectorAll('.day-checkbox input:checked'))
                    .map(input => input.closest('.day-checkbox').querySelector('span').textContent);

                const timeFrom = document.querySelector('.time-range input[type="time"]:first-of-type').value;
                const timeTo = document.querySelector('.time-range input[type="time"]:last-of-type').value;

                listingData.availability = {
                    days: selectedDays,
                    timeFrom,
                    timeTo
                };

                updateAvailabilityDisplay();
                availabilityModal.classList.remove('active');
            });

            function updateAvailabilityDisplay() {
                const availabilityText = document.querySelector('.selected-availability');
                if (listingData.availability.days.length > 0) {
                    availabilityText.textContent = `Available ${listingData.availability.days.join(', ')} from ${formatTime(listingData.availability.timeFrom)} to ${formatTime(listingData.availability.timeTo)}`;
                }
            }

            function formatTime(time) {
                return new Date(`2000-01-01T${time}`).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
            }

            // Form Validation
            function validateBasicInfo() {
                const title = document.querySelector('input[placeholder="Enter a clear, descriptive title"]').value;
                const price = document.querySelector('.price-input input[type="number"]').value;

                if (!title.trim()) {
                    showError('Please enter a title');
                    return false;
                }

                // if (!listingData.category) {
                //     showError('Please select a category');
                //     return false;
                // }

                if (!price && listingData.priceType !== 'free') {
                    showError('Please enter a price');
                    return false;
                }

                listingData.title = title;
                listingData.price = price;
                return true;
            }

            function validateMediaAndDescription() {
                const description = document.querySelector('textarea').value;



                if (!description.trim()) {
                    showError('Please add a description');
                    return false;
                }

                listingData.description = description;
                return true;
            }

            function validateLocationAndAvailability() {
                if (!listingData.location) {
                    showError('Please select a location');
                    return false;
                }

                if (listingData.availability.days.length === 0) {
                    showError('Please set your availability');
                    return false;
                }

                return true;
            }

            // Preview Modal
            function showPreview() {
                const previewModal = document.getElementById('previewModal');
                const previewContent = previewModal.querySelector('.preview-content');

                previewContent.innerHTML = `
            <div class="preview-images">
                ${listingData.images.map(img => `
                    <img src="${img}" alt="Listing image">
                `).join('')}
            </div>
            <div class="preview-details">
                <h2>${listingData.title}</h2>
                <div class="preview-price">
                    ${listingData.priceType === 'free' ? 'Free' : `$${listingData.price}`}
                    ${listingData.priceType === 'hourly' ? '/hour' : ''}
                </div>
                <div class="preview-category">
                    <span class="material-icons-round">category</span>
                    ${listingData.category}
                </div>
                <p class="preview-description">${listingData.description}</p>
                <div class="preview-tags">
                    ${listingData.tags.map(tag => `
                        <span class="tag">${tag}</span>
                    `).join('')}
                </div>
                <div class="preview-availability">
                    <h3>Availability</h3>
                    <p>${listingData.availability.days.join(', ')}</p>
                    <p>${formatTime(listingData.availability.timeFrom)} - ${formatTime(listingData.availability.timeTo)}</p>
                </div>
            </div>
        `;

        previewModal.classList.add('active');

        // Handle publish button
        previewModal.querySelector('.primary').addEventListener('click', publishListing);
    }

    function publishListing() {
        // Show loading state
        const publishButton = document.querySelector('.primary');
        const originalText = publishButton.textContent;
        publishButton.textContent = 'Publishing...';
        publishButton.disabled = true;

        // Simulate API call
        setTimeout(() => {
            // Show success message
            showSuccess('Listing published successfully!');
            
            // Redirect to profile page
            setTimeout(() => {
                window.location.href = 'profile.html';
            }, 1500);
        }, 2000);
    }

    // Error Handling
    function showError(message) {
        const toast = document.createElement('div');
        toast.className = 'error-toast';
        toast.textContent = message;
        document.body.appendChild(toast);

        setTimeout(() => {
            toast.remove();
        }, 3000);
    }

    function showSuccess(message) {
        const toast = document.createElement('div');
        toast.className = 'success-toast';
        toast.textContent = message;
        document.body.appendChild(toast);

        setTimeout(() => {
            toast.remove();
        }, 3000);
    }

    // Initialize map when the page loads
    window.initMap = initMap;
});