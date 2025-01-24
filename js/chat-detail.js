// chat-detail.js
document.addEventListener('DOMContentLoaded', function() {
    const messageInput = document.getElementById('messageInput');
    const sendButton = document.querySelector('.send-button');
    const chatMessages = document.getElementById('chatMessages');
    const attachmentMenu = document.getElementById('attachmentMenu');
    const attachmentButton = document.querySelector('.attachment-button');

    // Enable/disable send button based on input
    messageInput.addEventListener('input', () => {
        sendButton.disabled = !messageInput.value.trim();
    });

    // Send message
    sendButton.addEventListener('click', () => {
        const message = messageInput.value.trim();
        if (message) {
            sendMessage(message);
            messageInput.value = '';
            sendButton.disabled = true;
        }
    });

    // Enter key to send
    messageInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendButton.click();
        }
    });

    // Toggle attachment menu
    attachmentButton.addEventListener('click', () => {
        attachmentMenu.classList.toggle('active');
    });

    // Close attachment menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.attachment-menu') &&
            !e.target.closest('.attachment-button')) {
            attachmentMenu.classList.remove('active');
        }
    });

    // Back button
    document.querySelector('.back-button').addEventListener('click', () => {
        window.location.href = 'chat-list.html';
    });

    // View order details
    document.querySelector('.order-card').addEventListener('click', () => {
        // Navigate to order details
        window.location.href = 'product-detail.html?id=1';
    });

    // Attachment options
    document.querySelectorAll('.attachment-option').forEach(option => {
        option.addEventListener('click', () => {
            const type = option.querySelector('span').textContent.toLowerCase();
            handleAttachment(type);
        });
    });

    function sendMessage(text) {
        const template = `
            <div class="message-wrapper sent">
                <div class="message">
                    <p>${text}</p>
                    <span class="message-time">${getCurrentTime()}</span>
                    <span class="message-status">
                        <span class="material-icons-round">done</span>
                    </span>
                </div>
            </div>
        `;

        chatMessages.insertAdjacentHTML('beforeend', template);
        scrollToBottom();

        // Simulate message status updates
        setTimeout(() => {
            const status = document.querySelector('.message-wrapper:last-child .message-status');
            status.innerHTML = '<span class="material-icons-round">done_all</span>';
        }, 1000);

        // Simulate reply
        setTimeout(() => {
            simulateTyping();
        }, 2000);
    }

    function simulateTyping() {
        const typing = document.querySelector('.typing');
        typing.style.display = 'flex';
        scrollToBottom();

        setTimeout(() => {
            typing.style.display = 'none';
            const replies = [
                "Sounds good! When would be a good time?",
                "Could you tell me more about the condition?",
                "Perfect, I'll get back to you soon!"
            ];
            const reply = replies[Math.floor(Math.random() * replies.length)];

            const template = `
                <div class="message-wrapper received">
                    <img src="https://i.pravatar.cc/150?img=1" alt="Sarah" class="message-avatar">
                    <div class="message">
                        <p>${reply}</p>
                        <span class="message-time">${getCurrentTime()}</span>
                    </div>
                </div>
            `;

            chatMessages.insertAdjacentHTML('beforeend', template);
            scrollToBottom();
        }, 2000);
    }

    function handleAttachment(type) {
        switch (type) {
            case 'gallery':
                // Open gallery picker
                const input = document.createElement('input');
                input.type = 'file';
                input.accept = 'image/*';
                input.click();
                input.onchange = (e) => {
                    const file = e.target.files[0];
                    if (file) {
                        sendImageMessage(URL.createObjectURL(file));
                    }
                };
                break;
            case 'camera':
                // Open camera
                break;
            case 'document':
                // Open document picker
                break;
            case 'location':
                // Open location picker
                break;
        }
        attachmentMenu.classList.remove('active');
    }

    function sendImageMessage(imageUrl) {
        const template = `
            <div class="message-wrapper sent">
                <div class="message">
                    <div class="image-message">
                        <img src="${imageUrl}" alt="Sent image">
                    </div>
                    <span class="message-time">${getCurrentTime()}</span>
                    <span class="message-status">
                        <span class="material-icons-round">done</span>
                    </span>
                </div>
            </div>
        `;

        chatMessages.insertAdjacentHTML('beforeend', template);
        scrollToBottom();
    }

    function getCurrentTime() {
        const now = new Date();
        return now.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });
    }

    function scrollToBottom() {
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // Initial scroll to bottom
    scrollToBottom();
});