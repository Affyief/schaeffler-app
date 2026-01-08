// Project Details Page - Form Handling and Validation
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('projectDetailsForm');
    const submitBtn = document.getElementById('submitBtn');

    // Form validation state
    const formState = {
        isValid: false,
        touchedFields: new Set()
    };

    // Get all form inputs
    const inputs = form.querySelectorAll('input[required]');

    // Initialize form
    function init() {
        // Add validation listeners to all inputs
        inputs.forEach(input => {
            // Mark field as touched on blur
            input.addEventListener('blur', function() {
                formState.touchedFields.add(this.id);
                validateField(this);
            });

            // Real-time validation on input
            input.addEventListener('input', function() {
                if (formState.touchedFields.has(this.id)) {
                    validateField(this);
                }
                updateSubmitButton();
            });

            // Special handling for date inputs
            if (input.type === 'date') {
                input.addEventListener('change', function() {
                    validateDateFields();
                });
            }
        });

        // Form submission handler
        form.addEventListener('submit', handleSubmit);

        // Set minimum date for all date inputs to today
        const today = new Date().toISOString().split('T')[0];
        form.querySelectorAll('input[type="date"]').forEach(input => {
            input.setAttribute('min', today);
        });
    }

    // Validate individual field
    function validateField(field) {
        const fieldContainer = field.closest('.form-field');
        
        if (!field.checkValidity()) {
            fieldContainer.classList.add('error');
            fieldContainer.classList.remove('success');
            return false;
        } else {
            fieldContainer.classList.remove('error');
            fieldContainer.classList.add('success');
            return true;
        }
    }

    // Validate date logic (start before completion)
    function validateDateFields() {
        // Validate G40 dates
        const startG40 = document.getElementById('startDateG40');
        const completionG40 = document.getElementById('completionDateG40');
        
        if (startG40.value && completionG40.value) {
            if (new Date(startG40.value) >= new Date(completionG40.value)) {
                showNotification('G40 completion date must be after start date', 'warning');
                completionG40.setCustomValidity('Completion date must be after start date');
            } else {
                completionG40.setCustomValidity('');
            }
        }

        // Validate G50 dates
        const startG50 = document.getElementById('startDateG50');
        const completionG50 = document.getElementById('completionDateG50');
        
        if (startG50.value && completionG50.value) {
            if (new Date(startG50.value) >= new Date(completionG50.value)) {
                showNotification('G50 completion date must be after start date', 'warning');
                completionG50.setCustomValidity('Completion date must be after start date');
            } else {
                completionG50.setCustomValidity('');
            }
        }

        // Validate G50 starts after G40 completes (recommended)
        if (completionG40.value && startG50.value) {
            if (new Date(startG50.value) < new Date(completionG40.value)) {
                showNotification('Note: G50 typically starts after G40 completion', 'info');
            }
        }
    }

    // Update submit button state
    function updateSubmitButton() {
        const allValid = Array.from(inputs).every(input => input.checkValidity());
        
        if (allValid) {
            submitBtn.disabled = false;
            submitBtn.style.opacity = '1';
            submitBtn.style.cursor = 'pointer';
        } else {
            submitBtn.disabled = true;
            submitBtn.style.opacity = '0.6';
            submitBtn.style.cursor = 'not-allowed';
        }
    }

    // Handle form submission
    function handleSubmit(e) {
        e.preventDefault();

        // Mark all fields as touched
        inputs.forEach(input => {
            formState.touchedFields.add(input.id);
            validateField(input);
        });

        // Final validation
        validateDateFields();

        if (!form.checkValidity()) {
            showNotification('Please fill in all required fields correctly', 'error');
            return;
        }

        // Collect form data
        const formData = {};
        const formElements = form.elements;
        
        for (let i = 0; i < formElements.length; i++) {
            const element = formElements[i];
            if (element.name) {
                formData[element.name] = element.value;
            }
        }

        // Log form data (in production, this would be sent to server)
        console.log('Project Details Submitted:', formData);

        // Show success message
        showNotification('Project details saved successfully!', 'success');

        // Simulate saving and navigation
        setTimeout(() => {
            alert('Project Details Saved Successfully!\n\nProject Type: ' + formData.projectType +
                  '\nNPLM Number: ' + formData.nplmNumber +
                  '\nCustomer: ' + formData.customerName +
                  '\n\nProceeding to next step...');
            
            // Navigate to next page (placeholder)
            // window.location.href = 'next-step.html';
        }, 500);
    }

    // Show notification (simple implementation)
    function showNotification(message, type) {
        // Remove existing notifications
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }

        // Create notification
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        // Style notification
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 16px 24px;
            border-radius: 8px;
            background: ${type === 'success' ? '#27ae60' : type === 'error' ? '#e74c3c' : type === 'warning' ? '#f39c12' : '#3498db'};
            color: white;
            font-weight: 600;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            z-index: 10000;
            animation: slideInRight 0.3s ease-out;
        `;

        document.body.appendChild(notification);

        // Auto-remove after 4 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease-out';
            setTimeout(() => notification.remove(), 300);
        }, 4000);
    }

    // Add animation styles
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInRight {
            from {
                transform: translateX(400px);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes slideOutRight {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(400px);
                opacity: 0;
            }
        }

        .form-field.error input {
            border-color: #e74c3c !important;
            animation: shake 0.4s;
        }

        .form-field.success input {
            border-color: #27ae60 !important;
        }

        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-10px); }
            75% { transform: translateX(10px); }
        }
    `;
    document.head.appendChild(style);

    // Initialize the page
    init();
    updateSubmitButton();
});
