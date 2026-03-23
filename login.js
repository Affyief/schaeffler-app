// Login Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Get form elements
    const loginForm = document.getElementById('loginForm');
    const loginBtn = document.getElementById('loginBtn');
    const ssoBtn = document.getElementById('ssoBtn');
    const passwordToggle = document.getElementById('passwordToggle');
    const passwordInput = document.getElementById('password');
    const notification = document.getElementById('notification');
    const usernameInput = document.getElementById('username');
    const rememberMeCheckbox = document.getElementById('rememberMe');

    // Check for remembered username
    const rememberedUsername = localStorage.getItem('rememberedUsername');
    if (rememberedUsername) {
        usernameInput.value = rememberedUsername;
        rememberMeCheckbox.checked = true;
    }

    // Password toggle functionality
    passwordToggle.addEventListener('click', function() {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        
        // Update icon
        const eyeIcon = passwordToggle.querySelector('.eye-icon');
        if (type === 'text') {
            eyeIcon.innerHTML = `
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                <line x1="1" y1="1" x2="23" y2="23"></line>
            `;
        } else {
            eyeIcon.innerHTML = `
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                <circle cx="12" cy="12" r="3"></circle>
            `;
        }
    });

    // Form validation
    function validateForm() {
        const username = usernameInput.value.trim();
        const password = passwordInput.value.trim();

        if (!username) {
            showError(usernameInput, 'Username is required');
            return false;
        }

        if (!password) {
            showError(passwordInput, 'Password is required');
            return false;
        }

        if (password.length < 6) {
            showError(passwordInput, 'Password must be at least 6 characters');
            return false;
        }

        return true;
    }

    function showError(input, message) {
        input.focus();
        input.style.borderColor = '#E74C3C';
        
        // Remove existing error message
        const existingError = input.parentElement.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }

        // Add error message
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.style.color = '#E74C3C';
        errorDiv.style.fontSize = '12px';
        errorDiv.style.marginTop = '4px';
        errorDiv.textContent = message;
        input.parentElement.appendChild(errorDiv);

        // Reset border color on input
        input.addEventListener('input', function() {
            input.style.borderColor = '';
            if (errorDiv) {
                errorDiv.remove();
            }
        }, { once: true });
    }

    // Handle form submission
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        // Show loading state
        loginBtn.classList.add('loading');
        loginBtn.disabled = true;

        const username = usernameInput.value.trim();
        const password = passwordInput.value.trim();

        // Handle remember me
        if (rememberMeCheckbox.checked) {
            localStorage.setItem('rememberedUsername', username);
        } else {
            localStorage.removeItem('rememberedUsername');
        }

        // Simulate authentication (in production, this would be an API call)
        setTimeout(function() {
            // Store session (in production, use secure tokens)
            sessionStorage.setItem('isAuthenticated', 'true');
            sessionStorage.setItem('username', username);
            sessionStorage.setItem('loginTime', new Date().toISOString());

            // Show success notification
            showNotification();

            // Redirect to home page after 1.5 seconds
            setTimeout(function() {
                window.location.href = 'index.html';
            }, 1500);
        }, 1500);
    });

    // Handle SSO login
    ssoBtn.addEventListener('click', function() {
        ssoBtn.disabled = true;
        ssoBtn.style.opacity = '0.7';
        ssoBtn.innerHTML = `
            <svg class="sso-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
                <path d="M2 17l10 5 10-5"></path>
                <path d="M2 12l10 5 10-5"></path>
            </svg>
            <span>Connecting to SSO...</span>
        `;

        // Simulate SSO authentication
        setTimeout(function() {
            // Store session
            sessionStorage.setItem('isAuthenticated', 'true');
            sessionStorage.setItem('username', 'sso_user');
            sessionStorage.setItem('loginMethod', 'sso');
            sessionStorage.setItem('loginTime', new Date().toISOString());

            // Show success notification
            showNotification();

            // Redirect to home page
            setTimeout(function() {
                window.location.href = 'index.html';
            }, 1500);
        }, 2000);
    });

    // Show notification
    function showNotification() {
        notification.style.display = 'flex';
        
        setTimeout(function() {
            notification.style.display = 'none';
        }, 3000);
    }

    // Add input animations
    const inputs = document.querySelectorAll('.form-input');
    inputs.forEach(function(input) {
        input.addEventListener('focus', function() {
            this.parentElement.style.transform = 'translateY(-2px)';
            this.parentElement.style.transition = 'transform 0.3s ease';
        });

        input.addEventListener('blur', function() {
            this.parentElement.style.transform = 'translateY(0)';
        });
    });

    // Prevent form resubmission on page reload
    if (window.history.replaceState) {
        window.history.replaceState(null, null, window.location.href);
    }

    // Add keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        // Alt + S for SSO login
        if (e.altKey && e.key === 's') {
            e.preventDefault();
            ssoBtn.click();
        }
    });

    // Add smooth scroll behavior
    document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Check if user is already logged in
    if (sessionStorage.getItem('isAuthenticated') === 'true') {
        const loginTime = new Date(sessionStorage.getItem('loginTime'));
        const now = new Date();
        const hoursSinceLogin = (now - loginTime) / (1000 * 60 * 60);

        // Auto-redirect if logged in within last 24 hours
        if (hoursSinceLogin < 24) {
            showNotification();
            setTimeout(function() {
                window.location.href = 'index.html';
            }, 1000);
        }
    }

    // Add focus to username field on load
    setTimeout(function() {
        if (!usernameInput.value) {
            usernameInput.focus();
        } else {
            passwordInput.focus();
        }
    }, 500);
});

// Add extra visual feedback for form interactions
document.addEventListener('DOMContentLoaded', function() {
    const formGroups = document.querySelectorAll('.form-group');
    
    formGroups.forEach(function(group) {
        const input = group.querySelector('.form-input');
        const label = group.querySelector('.form-label');
        
        if (input && label) {
            input.addEventListener('focus', function() {
                label.style.color = '#08954C';
                label.style.transform = 'translateX(2px)';
                label.style.transition = 'all 0.3s ease';
            });
            
            input.addEventListener('blur', function() {
                if (!input.value) {
                    label.style.color = '';
                    label.style.transform = '';
                }
            });
        }
    });
});
