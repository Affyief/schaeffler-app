// Sidebar toggle functionality
document.addEventListener('DOMContentLoaded', function() {
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
            // Placeholder for future action
        });
    });
    
    // Placeholder for login icon
    const loginIcon = document.querySelector('.login-icon');
    loginIcon.addEventListener('click', function() {
        console.log('Login icon clicked');
        // Placeholder for future login functionality
    });
    
    // Logo image error handling
    const logoImage = document.querySelector('.logo-image');
    const logoPlaceholder = document.querySelector('.logo-placeholder');
    
    if (logoImage) {
        let errorCount = 0;
        const maxRetries = 1;
        
        logoImage.addEventListener('error', function handleLogoError() {
            errorCount++;
            
            // Prevent infinite loops
            if (errorCount > maxRetries) {
                // Show placeholder after max retries
                this.style.display = 'none';
                if (logoPlaceholder) {
                    logoPlaceholder.style.display = 'block';
                }
                return;
            }
            
            // First error: try external URL
            if (this.src.includes('assets/')) {
                console.log('Local logo not found, attempting to load from external URL');
                this.src = 'https://acam.rwth-campus.com/wp-content/uploads/sites/11/2024/05/Schaeffler-Logo.jpg';
            } else {
                // Second error: show placeholder
                console.log('External logo failed to load, showing placeholder');
                this.style.display = 'none';
                if (logoPlaceholder) {
                    logoPlaceholder.style.display = 'block';
                }
            }
        });
    }
});
