// Assessment Summary - JavaScript

document.addEventListener('DOMContentLoaded', function() {
    displaySubAssemblyInfo();
    displayOverallStatus();
    calculateStatistics();
    displayManagementSummary();
});

// Display Sub-Assembly Information
function displaySubAssemblyInfo() {
    try {
        const subAssembliesData = localStorage.getItem('dfm_subassemblies');
        
        if (!subAssembliesData) {
            console.log('No sub-assembly data found');
            return;
        }
        
        const subAssemblies = JSON.parse(subAssembliesData);
        
        let subAssembliesArray = [];
        if (Array.isArray(subAssemblies)) {
            subAssembliesArray = subAssemblies;
        } else if (subAssemblies.subAssemblies && Array.isArray(subAssemblies.subAssemblies)) {
            subAssembliesArray = subAssemblies.subAssemblies;
        }
        
        if (subAssembliesArray.length > 0) {
            const subAssembly = subAssembliesArray[0];
            
            // Display name
            const nameElement = document.getElementById('subassembly-name');
            if (nameElement) {
                nameElement.textContent = subAssembly.name || 'Unnamed Sub-assembly';
            }
            
            // Display thumbnail
            if (subAssembly.thumbnail) {
                const thumbnailImg = document.getElementById('thumbnail-image');
                const thumbnailPlaceholder = document.getElementById('thumbnail-placeholder');
                
                if (thumbnailImg && thumbnailPlaceholder) {
                    thumbnailImg.src = subAssembly.thumbnail;
                    thumbnailImg.style.display = 'block';
                    thumbnailPlaceholder.style.display = 'none';
                }
            }
        }
    } catch (error) {
        console.error('Error displaying sub-assembly info:', error);
    }
}

// Display Overall Status
function displayOverallStatus() {
    try {
        const statusData = localStorage.getItem('dfm_overall_status');
        const statusDisplay = document.getElementById('overallStatusDisplay');
        
        if (!statusData) {
            statusDisplay.innerHTML = '<p class="no-data">No overall status selected</p>';
            return;
        }
        
        const data = JSON.parse(statusData);
        
        // Determine status color class
        let statusClass = '';
        switch(data.status) {
            case 'No Minor Problem':
                statusClass = 'status-green';
                break;
            case 'Medium Risk':
                statusClass = 'status-orange';
                break;
            case 'High Risk':
                statusClass = 'status-red';
                break;
            case 'Open':
                statusClass = 'status-purple';
                break;
        }
        
        statusDisplay.innerHTML = `
            <div class="status-badge ${statusClass}">
                <span class="status-indicator"></span>
                <span class="status-text">${data.status}</span>
            </div>
        `;
    } catch (error) {
        console.error('Error displaying overall status:', error);
    }
}

// Calculate Statistics from Questionnaire Data
function calculateStatistics() {
    try {
        const questionnaireData = localStorage.getItem('dfm_questionnaire');
        
        if (!questionnaireData) {
            displayStatistics({
                noMinorProblem: 0,
                mediumRisk: 0,
                highRisk: 0,
                open: 0,
                notRelevant: 0,
                total: 0
            });
            return;
        }
        
        const data = JSON.parse(questionnaireData);
        
        // Initialize counters
        const stats = {
            noMinorProblem: 0,
            mediumRisk: 0,
            highRisk: 0,
            open: 0,
            notRelevant: 0,
            total: 0
        };
        
        // Count each status type
        Object.keys(data).forEach(key => {
            if (key.startsWith('status_')) {
                const status = data[key];
                stats.total++;
                
                switch(status) {
                    case 'No Minor Problem':
                        stats.noMinorProblem++;
                        break;
                    case 'Medium Risk':
                        stats.mediumRisk++;
                        break;
                    case 'High Risk':
                        stats.highRisk++;
                        break;
                    case 'Open':
                        stats.open++;
                        break;
                    case 'Not Relevant':
                        stats.notRelevant++;
                        break;
                }
            }
        });
        
        displayStatistics(stats);
    } catch (error) {
        console.error('Error calculating statistics:', error);
    }
}

// Display Statistics
function displayStatistics(stats) {
    const statisticsDisplay = document.getElementById('statisticsDisplay');
    
    statisticsDisplay.innerHTML = `
        <div class="stat-card stat-green">
            <div class="stat-icon">✓</div>
            <div class="stat-content">
                <div class="stat-value">${stats.noMinorProblem}</div>
                <div class="stat-label">No Minor Problem</div>
            </div>
        </div>
        
        <div class="stat-card stat-orange">
            <div class="stat-icon">⚠</div>
            <div class="stat-content">
                <div class="stat-value">${stats.mediumRisk}</div>
                <div class="stat-label">Medium Risk</div>
            </div>
        </div>
        
        <div class="stat-card stat-red">
            <div class="stat-icon">✕</div>
            <div class="stat-content">
                <div class="stat-value">${stats.highRisk}</div>
                <div class="stat-label">High Risk</div>
            </div>
        </div>
        
        <div class="stat-card stat-purple">
            <div class="stat-icon">◐</div>
            <div class="stat-content">
                <div class="stat-value">${stats.open}</div>
                <div class="stat-label">Open</div>
            </div>
        </div>
        
        <div class="stat-card stat-gray">
            <div class="stat-icon">−</div>
            <div class="stat-content">
                <div class="stat-value">${stats.notRelevant}</div>
                <div class="stat-label">Not Relevant</div>
            </div>
        </div>
        
        <div class="stat-card stat-total">
            <div class="stat-icon">Σ</div>
            <div class="stat-content">
                <div class="stat-value">${stats.total}</div>
                <div class="stat-label">Total Questions</div>
            </div>
        </div>
    `;
}

// Display Management Summary
function displayManagementSummary() {
    try {
        const statusData = localStorage.getItem('dfm_overall_status');
        const summaryDisplay = document.getElementById('managementSummaryDisplay');
        
        if (!statusData) {
            summaryDisplay.innerHTML = '<p class="no-data">No management summary provided</p>';
            return;
        }
        
        const data = JSON.parse(statusData);
        
        if (data.summary && data.summary.trim()) {
            summaryDisplay.innerHTML = `<p class="summary-content">${data.summary}</p>`;
        } else {
            summaryDisplay.innerHTML = '<p class="no-data">No management summary provided</p>';
        }
    } catch (error) {
        console.error('Error displaying management summary:', error);
    }
}

// Finish Assessment and Return to Home
function finishAssessment() {
    // Optional: Show confirmation
    if (confirm('Are you sure you want to finish the assessment and return to home?')) {
        window.location.href = 'index.html';
    }
}
