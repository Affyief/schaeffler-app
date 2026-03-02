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
            
            // Display thumbnail - first try from product images
            const thumbnailImg = document.getElementById('thumbnail-image');
            const thumbnailPlaceholder = document.getElementById('thumbnail-placeholder');
            
            if (thumbnailImg && thumbnailPlaceholder) {
                // Try to load from product images first
                const productImagesData = localStorage.getItem('dfm_product_images');
                if (productImagesData) {
                    try {
                        const imagesData = JSON.parse(productImagesData);
                        const subAssemblyImages = imagesData[0]; // First sub-assembly
                        if (subAssemblyImages && subAssemblyImages.length > 0) {
                            const firstImage = subAssemblyImages[0];
                            thumbnailImg.src = firstImage.dataUrl;
                            thumbnailImg.style.display = 'block';
                            thumbnailPlaceholder.style.display = 'none';
                            console.log('Loaded image from product images');
                        }
                    } catch (err) {
                        console.log('Could not load from product images:', err);
                    }
                }
                
                // Fallback to thumbnail property if exists
                if (subAssembly.thumbnail && thumbnailImg.style.display !== 'block') {
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
        let statusLabel = '';
        switch(data.overallStatus) {
            case 'no_minor_problem':
                statusClass = 'status-green';
                statusLabel = 'No Minor Problem';
                break;
            case 'medium_risk':
                statusClass = 'status-orange';
                statusLabel = 'Medium Risk';
                break;
            case 'high_risk':
                statusClass = 'status-red';
                statusLabel = 'High Risk';
                break;
            case 'open':
                statusClass = 'status-purple';
                statusLabel = 'Open';
                break;
        }
        
        statusDisplay.innerHTML = `
            <div class="status-badge ${statusClass}">
                <span class="status-indicator"></span>
                <span class="status-text">${statusLabel}</span>
            </div>
        `;
    } catch (error) {
        console.error('Error displaying overall status:', error);
    }
}

// Calculate Statistics from Questionnaire Data
function calculateStatistics() {
    try {
        const questionnaireData = localStorage.getItem('dfm_questionnaire_data');
        
        if (!questionnaireData) {
            displayStatistics({
                ok: 0,
                partially: 0,
                nok: 0,
                open: 0,
                notRelevant: 0,
                total: 0
            });
            return;
        }
        
        const data = JSON.parse(questionnaireData);
        
        // Initialize counters
        const stats = {
            ok: 0,
            partially: 0,
            nok: 0,
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
                    case 'ok':
                        stats.ok++;
                        break;
                    case 'partially':
                        stats.partially++;
                        break;
                    case 'nok':
                        stats.nok++;
                        break;
                    case 'open':
                        stats.open++;
                        break;
                    case 'not_relevant':
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
                <div class="stat-value">${stats.ok}</div>
                <div class="stat-label">OK</div>
            </div>
        </div>
        
        <div class="stat-card stat-orange">
            <div class="stat-icon">⚠</div>
            <div class="stat-content">
                <div class="stat-value">${stats.partially}</div>
                <div class="stat-label">Partially</div>
            </div>
        </div>
        
        <div class="stat-card stat-red">
            <div class="stat-icon">✕</div>
            <div class="stat-content">
                <div class="stat-value">${stats.nok}</div>
                <div class="stat-label">NOK</div>
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
        
        if (data.managementSummary && data.managementSummary.trim()) {
            const p = document.createElement('p');
            p.className = 'summary-content';
            p.textContent = data.managementSummary;
            summaryDisplay.innerHTML = '';
            summaryDisplay.appendChild(p);
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
