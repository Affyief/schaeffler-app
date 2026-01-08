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
});
