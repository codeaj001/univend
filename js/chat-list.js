// chat-list.js
document.addEventListener('DOMContentLoaded', function() {
    // Filter buttons
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            filterChats(button.textContent.toLowerCase());
        });
    });

    // Chat items click handler
    const chatItems = document.querySelectorAll('.chat-item');
    chatItems.forEach(item => {
        item.addEventListener('click', () => {
            const chatId = item.dataset.chatId;
            // Navigate to individual chat
            window.location.href = `chat-detail.html?id=${chatId}`;
        });
    });

    // Bottom navigation
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            if (!item.classList.contains('active')) {
                // Navigate to respective section
                const section = item.querySelector('.nav-text').textContent.toLowerCase();
                if (section !== 'messages') {
                    window.location.href = `${section}.html`;
                }
            }
        });
    });

    // Search button handler
    document.querySelector('.action-button').addEventListener('click', () => {
        // Implement search functionality
        console.log('Search clicked');
    });

    function filterChats(filter) {
        const chats = document.querySelectorAll('.chat-item');
        chats.forEach(chat => {
            switch (filter) {
                case 'unread':
                    chat.style.display = chat.classList.contains('unread') ? 'flex' : 'none';
                    break;
                case 'active orders':
                    chat.style.display = chat.classList.contains('active-order') ? 'flex' : 'none';
                    break;
                default:
                    chat.style.display = 'flex';
            }
        });
    }

    // Add touch feedback
    const addTouchFeedback = (element) => {
        element.addEventListener('touchstart', () => {
            element.style.backgroundColor = 'rgba(0,0,0,0.05)';
        });

        element.addEventListener('touchend', () => {
            element.style.backgroundColor = '';
        });
    };

    chatItems.forEach(addTouchFeedback);
});