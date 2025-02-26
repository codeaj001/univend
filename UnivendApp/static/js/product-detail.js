// product-detail.js
document.addEventListener('DOMContentLoaded', function() {
    // Image Slider
    const sliderContainer = document.querySelector('.slider-container');
    const dots = document.querySelectorAll('.dot');
    const images = document.querySelectorAll('.slider-container img');
    let currentIndex = 0;

    // Touch handling for slider
    let startX = 0;
    let currentX = 0;

    sliderContainer.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
    });

    sliderContainer.addEventListener('touchmove', (e) => {
        currentX = e.touches[0].clientX;
        const diff = startX - currentX;
        if (Math.abs(diff) > 50) {
            if (diff > 0 && currentIndex < images.length - 1) {
                updateSlider(currentIndex + 1);
            } else if (diff < 0 && currentIndex > 0) {
                updateSlider(currentIndex - 1);
            }
            startX = currentX;
        }
    });

    function updateSlider(index) {
        currentIndex = index;
        sliderContainer.style.transform = `translateX(-${index * 100}%)`;
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });
    }

    // Back button
    document.querySelector('.back-button').addEventListener('click', () => {
        history.back();
    });

    // Share button
    document.querySelector('.share-button').addEventListener('click', () => {
        if (navigator.share) {
            navigator.share({
                title: 'MacBook Pro 2021',
                text: 'Check out this MacBook Pro on UniVend!',
                url: window.location.href
            });
        }
    });

    // Follow button
    const followButton = document.querySelector('.follow-button');
    followButton.addEventListener('click', () => {
        followButton.textContent = followButton.textContent === 'Follow' ? 'Following' : 'Follow';
        followButton.classList.toggle('following');
    });

    // Message button
    document.querySelector('.message-button').addEventListener('click', () => {
        // Implement chat functionality
        console.log('Open chat');
    });

    // Buy button
    document.querySelector('.buy-button').addEventListener('click', () => {
        // Implement purchase flow
        console.log('Start purchase');
    });

    // Report functionality
    let reportTimeout;
    const reportModal = document.getElementById('reportModal');

    // Long press to report
    const productInfo = document.querySelector('.product-info');
    productInfo.addEventListener('touchstart', () => {
        reportTimeout = setTimeout(() => {
            reportModal.classList.add('active');
        }, 800);
    });

    productInfo.addEventListener('touchend', () => {
        clearTimeout(reportTimeout);
    });

    // Close report modal
    document.querySelector('.cancel-button').addEventListener('click', () => {
        reportModal.classList.remove('active');
    });
});