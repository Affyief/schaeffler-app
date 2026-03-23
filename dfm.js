// DFM page specific functionality
document.addEventListener('DOMContentLoaded', function() {
    // Get option cards
    const newProcessCard = document.getElementById('newProcessCard');
    const modifyProcessCard = document.getElementById('modifyProcessCard');
    
    // Handle new process button click
    if (newProcessCard) {
        newProcessCard.addEventListener('click', function() {
            console.log('Starting new DFM process...');
            // Navigate to DFM configuration page
            window.location.href = 'dfm-config.html';
        });
    }
    
    // Handle modify existing process button click
    if (modifyProcessCard) {
        modifyProcessCard.addEventListener('click', function() {
            console.log('Modifying existing DFM process...');
            // Placeholder for future navigation
            alert('Modify Existing DFM Process - This will show a list of existing processes (coming soon)');
        });
    }
});
