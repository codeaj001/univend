// profile.js
document.addEventListener('DOMContentLoaded', function() {
    // Tab switching
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabPanes = document.querySelectorAll('.tab-pane');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tabId = button.dataset.tab;

            // Update active states
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabPanes.forEach(pane => pane.classList.remove('active'));

            button.classList.add('active');
            document.getElementById(tabId).classList.add('active');
        });
    });

    // Settings modal
    const settingsButton = document.querySelector('.action-button:nth-child(2)');
    const settingsModal = document.getElementById('settingsModal');
    const closeModal = document.querySelector('.close-modal');

    settingsButton.addEventListener('click', () => {
        settingsModal.classList.add('active');
    });

    closeModal.addEventListener('click', () => {
        settingsModal.classList.remove('active');
    });

    settingsModal.addEventListener('click', (e) => {
        if (e.target === settingsModal) {
            settingsModal.classList.remove('active');
        }
    });

    // Edit avatar
    const editAvatarButton = document.querySelector('.edit-avatar');
    editAvatarButton.addEventListener('click', () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.click();

        input.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    document.querySelector('.profile-avatar').src = e.target.result;
                };
                reader.readAsDataURL(file);
            }
        };
    });

    // Listing options
    const editListingButtons = document.querySelectorAll('.edit-listing');
    editListingButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.stopPropagation();
            // Show listing options menu
            const options = ['Edit', 'Mark as Sold', 'Delete'];
            showOptionsMenu(e.clientX, e.clientY, options);
        });
    });

    function showOptionsMenu(x, y, options) {
        const menu = document.createElement('div');
        menu.className = 'options-menu';
        menu.style.position = 'fixed';
        menu.style.left = `${x}px`;
        menu.style.top = `${y}px`;
        menu.style.background = 'white';
        menu.style.borderRadius = '12px';
        menu.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
        menu.style.zIndex = '1000';

        options.forEach(option => {
            const button = document.createElement('button');
            button.textContent = option;
            button.style.display = 'block';
            button.style.width = '100%';
            button.style.padding = '0.75rem 1rem';
            button.style.border = 'none';
            button.style.background = 'none';
            button.style.textAlign = 'left';
            button.style.fontSize = '0.875rem';

            if (option === 'Delete') {
                button.style.color = 'var(--danger-color)';
            }

            button.addEventListener('click', () => {
                handleListingOption(option);
                menu.remove();
            });

            menu.appendChild(button);
        });

        document.body.appendChild(menu);

        // Close menu when clicking outside
        const closeMenu = (e) => {
            if (!menu.contains(e.target)) {
                menu.remove();
                document.removeEventListener('click', closeMenu);
            }
        };

        setTimeout(() => {
            document.addEventListener('click', closeMenu);
        }, 0);
    }

    function handleListingOption(option) {
        switch (option) {
            case 'Edit':
                console.log('Edit listing');
                break;
            case 'Mark as Sold':
                console.log('Mark as sold');
                break;
            case 'Delete':
                if (confirm('Are you sure you want to delete this listing?')) {
                    console.log('Delete listing');
                }
                break;
        }
    }

    // Bottom navigation
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            if (!item.classList.contains('active')) {
                const section = item.querySelector('.nav-text').textContent.toLowerCase();
                window.location.href = `${section}.html`;
            }
        });
    });
});