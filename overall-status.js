// Overall Status - JavaScript

document.addEventListener('DOMContentLoaded', function() {
    loadSavedData();
});

// Load saved data from localStorage
function loadSavedData() {
    const savedData = localStorage.getItem('dfm_overall_status');
    if (savedData) {
        const data = JSON.parse(savedData);
        
        // Set radio button
        const radio = document.querySelector(`input[name="overallStatus"][value="${data.status}"]`);
        if (radio) {
            radio.checked = true;
            toggleWarning();
        }
        
        // Set management summary
        const summaryField = document.getElementById('managementSummary');
        if (summaryField && data.summary) {
            summaryField.value = data.summary;
        }
    }
}

// Toggle warning message based on selected status
function toggleWarning() {
    const selectedStatus = document.querySelector('input[name="overallStatus"]:checked');
    const warningDiv = document.getElementById('highRiskWarning');
    
    if (selectedStatus && selectedStatus.value === 'High Risk') {
        warningDiv.style.display = 'flex';
    } else {
        warningDiv.style.display = 'none';
    }
}

// Handle form submission
function handleSubmit(event) {
    event.preventDefault();
    
    const selectedStatus = document.querySelector('input[name="overallStatus"]:checked');
    const managementSummary = document.getElementById('managementSummary').value.trim();
    
    // Validate status selection
    if (!selectedStatus) {
        alert('Please select an overall status.');
        return;
    }
    
    // Validate management summary for High Risk
    if (selectedStatus.value === 'High Risk' && !managementSummary) {
        alert('Management summary is mandatory for high-risk status.');
        return;
    }
    
    // Save to localStorage
    const overallStatusData = {
        status: selectedStatus.value,
        summary: managementSummary,
        timestamp: new Date().toISOString()
    };
    
    localStorage.setItem('dfm_overall_status', JSON.stringify(overallStatusData));
    
    // Navigate to assessment summary page
    window.location.href = 'assessment-summary.html';
}

// Go back to previous page
function goBack() {
    window.location.href = 'questionnaire-full.html';
}
