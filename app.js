// Authentication check
document.addEventListener('DOMContentLoaded', function() {
    // Check if user is authenticated
    const isAuthenticated = sessionStorage.getItem('isAuthenticated');
    
    if (!isAuthenticated || isAuthenticated !== 'true') {
        // Redirect to login page if not authenticated
        window.location.href = 'login.html';
        return;
    }

    // Check session expiry (24 hours)
    const loginTime = new Date(sessionStorage.getItem('loginTime'));
    const now = new Date();
    const hoursSinceLogin = (now - loginTime) / (1000 * 60 * 60);
    
    if (hoursSinceLogin > 24) {
        // Session expired
        sessionStorage.clear();
        window.location.href = 'login.html';
        return;
    }

    // Update user display
    const username = sessionStorage.getItem('username');
    const loginTextElement = document.querySelector('.login-text');
    if (loginTextElement && username) {
        loginTextElement.textContent = username;
    }

    const sidebar = document.getElementById('sidebar');
    const sidebarToggle = document.getElementById('sidebarToggle');
    
    sidebarToggle.addEventListener('click', function() {
        sidebar.classList.toggle('collapsed');
    });
    
    // Placeholder for navigation items
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            // Remove active class from all items
            navItems.forEach(nav => nav.classList.remove('active'));
            // Add active class to clicked item
            this.classList.add('active');
            
            // Placeholder for future navigation logic
            console.log('Navigating to:', this.querySelector('.nav-text').textContent);
        });
    });
    
    // Placeholder for icon cards
    const iconCards = document.querySelectorAll('.icon-card');
    iconCards.forEach(card => {
        card.addEventListener('click', function() {
            const caption = this.querySelector('.icon-caption').textContent;
            console.log('Icon clicked:', caption);
            
            // Navigate to specific pages based on card clicked
            if (caption === 'Design for Manufacturing') {
                window.location.href = 'dfm.html';
            } else {
                // Placeholder for future pages
                console.log('Navigation to', caption, 'page - coming soon');
            }
        });
    });
    
    // Placeholder for login icon
    const loginIcon = document.querySelector('.login-icon');
    loginIcon.addEventListener('click', function() {
        console.log('Login icon clicked');
        // Show logout confirmation
        const confirmLogout = confirm('Are you sure you want to logout?');
        if (confirmLogout) {
            sessionStorage.clear();
            window.location.href = 'login.html';
        }
    });
    
    // Logo image error handling
    const logoImage = document.querySelector('.logo-image');
    const logoPlaceholder = document.querySelector('.logo-placeholder');
    
    if (logoImage) {
        let currentAttempt = 0;
        const fallbackUrl = 'https://acam.rwth-campus.com/wp-content/uploads/sites/11/2024/05/Schaeffler-Logo.jpg';
        
        logoImage.addEventListener('error', function handleLogoError() {
            currentAttempt++;
            
            if (currentAttempt === 1) {
                // First error: try external URL
                console.log('Local logo not found, attempting to load from external URL');
                this.src = fallbackUrl;
            } else {
                // Second error or beyond: show placeholder
                console.log('External logo failed to load, showing placeholder');
                this.style.display = 'none';
                if (logoPlaceholder) {
                    logoPlaceholder.style.display = 'block';
                }
            }
        });
    }
});
