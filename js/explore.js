// explore.js

document.addEventListener('DOMContentLoaded', function() {
    const categoryCards = document.querySelectorAll('.category-card');
    const categoriesContainer = document.querySelector('.categories-container');
    const categoryItemsSection = document.querySelector('.category-items-section');
    const backToCategoriesBtn = document.querySelector('.back-to-categories');
    const categoryTitle = document.getElementById('selected-category-title');
    const categoryItems = document.getElementById('category-items');

    // Sample data for items in each category
    const categoryData = {
        'books': [
            { title: 'Calculus Textbook', price: '$45', image: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e', description: 'Used, good condition' },
            { title: 'Physics Collection', price: '$60', image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f', description: 'Complete set' },
        ],
        'electronics': [
            { title: 'MacBook Pro', price: '$899', image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8', description: '2019 Model' },
            { title: 'iPad Air', price: '$400', image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0', description: 'Like new' },
        ],
        'tutoring': [
            { title: 'Math Tutoring', price: '$30/hr', image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173', description: 'Advanced calculus' },
            { title: 'Chemistry Help', price: '$25/hr', image: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d', description: 'Organic chemistry' },
        ],
        // Add more categories as needed
    };

    categoryCards.forEach(card => {
        card.addEventListener('click', () => {
            const category = card.dataset.category;
            showCategoryItems(category);
        });
    });

    backToCategoriesBtn.addEventListener('click', () => {
        categoryItemsSection.style.display = 'none';
        categoriesContainer.style.display = 'block';
    });

    function showCategoryItems(category) {
        categoryTitle.textContent = category.charAt(0).toUpperCase() + category.slice(1);
        categoryItems.innerHTML = ''; // Clear existing items

        // Get items for the selected category
        const items = categoryData[category] || [];

        // Create and append item cards
        items.forEach(item => {
            const itemCard = createItemCard(item);
            categoryItems.appendChild(itemCard);
        });

        categoriesContainer.style.display = 'none';
        categoryItemsSection.style.display = 'block';
    }

    function createItemCard(item) {
        const div = document.createElement('div');
        div.className = 'item-card';
        div.innerHTML = `
            <img src="${item.image}" alt="${item.title}" class="item-image">
            <div class="item-content">
                <h3>${item.title}</h3>
                <p>${item.description}</p>
                <span class="item-price">${item.price}</span>
            </div>
        `;
        return div;
    }

    // Search functionality
    const searchInput = document.querySelector('.search-bar input');
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        categoryCards.forEach(card => {
            const title = card.querySelector('h3').textContent.toLowerCase();
            const description = card.querySelector('p').textContent.toLowerCase();
            const isVisible = title.includes(searchTerm) || description.includes(searchTerm);
            card.style.display = isVisible ? 'block' : 'none';
        });
    });
});