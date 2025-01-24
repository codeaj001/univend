// kyc.js
document.addEventListener('DOMContentLoaded', function() {
    const forms = document.querySelectorAll('.step-form');
    const progressBar = document.querySelector('.progress-bar');
    const steps = document.querySelectorAll('.step');
    let currentStep = 0;

    // Next button click handlers
    document.querySelectorAll('.btn-next').forEach(button => {
        button.addEventListener('click', () => {
            if (currentStep < forms.length - 1) {
                forms[currentStep].classList.remove('active');
                forms[currentStep + 1].classList.add('active');
                steps[currentStep + 1].classList.add('active');
                currentStep++;
                updateProgress();
            }
        });
    });

    // Back button click handlers
    document.querySelectorAll('.btn-back').forEach(button => {
        button.addEventListener('click', () => {
            if (currentStep > 0) {
                forms[currentStep].classList.remove('active');
                forms[currentStep - 1].classList.add('active');
                steps[currentStep].classList.remove('active');
                currentStep--;
                updateProgress();
            }
        });
    });

    // Upload area click handlers
    document.querySelectorAll('.upload-area').forEach(area => {
        area.addEventListener('click', () => {
            const input = area.querySelector('input[type="file"]');
            input.click();
        });

        // File drop handling
        area.addEventListener('dragover', (e) => {
            e.preventDefault();
            area.classList.add('dragover');
        });

        area.addEventListener('dragleave', () => {
            area.classList.remove('dragover');
        });

        area.addEventListener('drop', (e) => {
            e.preventDefault();
            area.classList.remove('dragover');
            const file = e.dataTransfer.files[0];
            handleFile(file, area);
        });
    });

    // File input change handlers
    document.querySelectorAll('input[type="file"]').forEach(input => {
        input.addEventListener('change', (e) => {
            const file = e.target.files[0];
            handleFile(file, input.parentElement);
        });
    });

    // Complete setup button handler
    document.querySelector('.btn-finish').addEventListener('click', () => {
        // Add completion logic here
        console.log('Profile setup completed!');
        // Redirect to homepage or show success message
    });

    function updateProgress() {
        const progress = ((currentStep + 1) / forms.length) * 100;
        progressBar.style.width = `${progress}%`;
    }

    function handleFile(file, area) {
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (e) => {
                area.style.backgroundImage = `url(${e.target.result})`;
                area.style.backgroundSize = 'cover';
                area.style.backgroundPosition = 'center';
                area.querySelector('p').style.display = 'none';
                area.querySelector('span').style.display = 'none';
            };
            reader.readAsDataURL(file);
        }
    }
});