// Questionnaire Full - JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Filter questions by selected areas first
    filterQuestionsBySelectedAreas();
    
    // Initialize
    loadSavedData();
    setupEventListeners();
    updateProgress();
    
    // Auto-save every 30 seconds
    setInterval(autoSave, 30000);
});

// Filter Questions by Selected Areas
function filterQuestionsBySelectedAreas() {
    try {
        // Get selected areas from localStorage
        const areaSelection = localStorage.getItem('dfm_area_selection');
        if (!areaSelection) {
            console.log('No area selection found, showing all questions');
            return;
        }
        
        const data = JSON.parse(areaSelection);
        const selectedAreas = data.areas || [];
        
        if (selectedAreas.length === 0) {
            console.log('No areas selected, showing all questions');
            return;
        }
        
        console.log('Selected areas:', selectedAreas);
        
        // Map area values to question prefixes
        const areaToPrefix = {
            'general': 'GE',
            'pcb': 'PCB',
            'bare_die': 'BD',
            'assembly': 'AS',
            'material': 'MAT',
            'test': 'TE',
            'results': 'RS',
            'others': 'OT'
        };
        
        // Get prefixes for selected areas
        const selectedPrefixes = selectedAreas.map(area => areaToPrefix[area]).filter(Boolean);
        console.log('Selected prefixes:', selectedPrefixes);
        
        // Get all section groups
        const sectionGroups = document.querySelectorAll('.section-group');
        
        sectionGroups.forEach(group => {
            // Get the section header to determine the area
            const sectionHeader = group.querySelector('.section-header h2');
            if (!sectionHeader) return;
            
            const sectionText = sectionHeader.textContent.trim();
            
            // Check if this section matches any selected area
            let shouldShow = false;
            
            for (const prefix of selectedPrefixes) {
                // Check if section contains questions with this prefix
                const questionsInSection = group.querySelectorAll('.question-number');
                for (const questionNum of questionsInSection) {
                    if (questionNum.textContent.trim().startsWith(prefix)) {
                        shouldShow = true;
                        break;
                    }
                }
                if (shouldShow) break;
            }
            
            // Hide or show the section
            if (!shouldShow) {
                group.style.display = 'none';
                console.log('Hiding section:', sectionText);
            } else {
                group.style.display = 'block';
                console.log('Showing section:', sectionText);
            }
        });
        
        // Update the visible questions count
        setTimeout(() => {
            updateProgress();
        }, 100);
        
    } catch (e) {
        console.error('Error filtering questions:', e);
    }
}

// Setup Event Listeners
function setupEventListeners() {
    const form = document.getElementById('questionnaireForm');
    const saveDraftBtn = document.getElementById('saveDraftBtn');
    const radioButtons = document.querySelectorAll('input[type="radio"]');
    
    // Form submission
    form.addEventListener('submit', handleSubmit);
    
    // Save draft button
    saveDraftBtn.addEventListener('click', saveDraft);
    
    // Radio button changes
    radioButtons.forEach(radio => {
        radio.addEventListener('change', function() {
            updateQuestionCard(this);
            updateProgress();
            checkAndShowSoftWarning();
            autoSave();
        });
    });
    
    // Input changes for auto-save
    const inputs = form.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        input.addEventListener('change', autoSave);
    });
}

// Update Question Card Status
function updateQuestionCard(radio) {
    const questionCard = radio.closest('.question-card');
    if (questionCard && radio.checked) {
        questionCard.classList.add('completed');
    }
}

// Update Progress
function updateProgress() {
    // Only count visible question cards (not hidden by area filter)
    const allQuestionCards = document.querySelectorAll('.question-card');
    const visibleQuestionCards = Array.from(allQuestionCards).filter(card => {
        const sectionGroup = card.closest('.section-group');
        return !sectionGroup || sectionGroup.style.display !== 'none';
    });
    
    const totalQuestions = visibleQuestionCards.length;
    const completedQuestions = visibleQuestionCards.filter(card => card.classList.contains('completed')).length;
    const percentage = totalQuestions > 0 ? Math.round((completedQuestions / totalQuestions) * 100) : 0;
    
    // Update progress bar
    const progressFill = document.getElementById('progressFill');
    progressFill.style.width = percentage + '%';
    
    // Update text
    document.getElementById('progressText').textContent = 
        `${completedQuestions} of ${totalQuestions} questions completed`;
    document.getElementById('progressPercent').textContent = percentage + '%';
}

// Get Form Data
function getFormData() {
    const form = document.getElementById('questionnaireForm');
    const formData = new FormData(form);
    const data = {};
    
    for (let [key, value] of formData.entries()) {
        data[key] = value;
    }
    
    return data;
}

// Save Draft
function saveDraft() {
    const data = getFormData();
    
    try {
        localStorage.setItem('dfm_questionnaire_full_draft', JSON.stringify(data));
        localStorage.setItem('dfm_questionnaire_full_timestamp', new Date().toISOString());
        
        showNotification('Draft saved successfully!');
    } catch (error) {
        console.error('Error saving draft:', error);
        showNotification('Error saving draft', true);
    }
}

// Auto Save
function autoSave() {
    const data = getFormData();
    
    try {
        localStorage.setItem('dfm_questionnaire_full_draft', JSON.stringify(data));
        localStorage.setItem('dfm_questionnaire_full_timestamp', new Date().toISOString());
    } catch (error) {
        console.error('Error auto-saving:', error);
    }
}

// Load Saved Data
function loadSavedData() {
    try {
        const savedData = localStorage.getItem('dfm_questionnaire_full_draft');
        
        if (savedData) {
            const data = JSON.parse(savedData);
            const form = document.getElementById('questionnaireForm');
            
            // Populate form fields
            Object.keys(data).forEach(key => {
                const element = form.elements[key];
                if (element) {
                    if (element.type === 'radio') {
                        const radio = form.querySelector(`input[name="${key}"][value="${data[key]}"]`);
                        if (radio) {
                            radio.checked = true;
                            updateQuestionCard(radio);
                        }
                    } else {
                        element.value = data[key];
                    }
                }
            });
            
            updateProgress();
            
            // Show notification that draft was restored
            setTimeout(() => {
                showNotification('Draft restored from previous session');
            }, 500);
        }
    } catch (error) {
        console.error('Error loading saved data:', error);
    }
}

// Handle Form Submission
function handleSubmit(event) {
    event.preventDefault();
    
    const form = event.target;
    
    // Validate that all status fields are filled
    const allStatusFields = document.querySelectorAll('input[type="radio"][name$="_status"]');
    const statusGroups = {};
    
    allStatusFields.forEach(radio => {
        const groupName = radio.name;
        if (!statusGroups[groupName]) {
            statusGroups[groupName] = false;
        }
        if (radio.checked) {
            statusGroups[groupName] = true;
        }
    });
    
    const allCompleted = Object.values(statusGroups).every(status => status === true);
    
    if (!allCompleted) {
        showNotification('Please complete all required status selections', true);
        return;
    }
    
    // Get form data
    const formData = getFormData();
    
    // Add metadata
    formData.submittedAt = new Date().toISOString();
    formData.totalQuestions = document.querySelectorAll('.question-card').length;
    formData.completedQuestions = document.querySelectorAll('.question-card.completed').length;
    
    // Save to localStorage
    try {
        localStorage.setItem('dfm_questionnaire_full', JSON.stringify(formData));
        
        // Clear draft
        localStorage.removeItem('dfm_questionnaire_full_draft');
        localStorage.removeItem('dfm_questionnaire_full_timestamp');
        
        // Show success notification
        showNotification('Assessment submitted successfully! Proceeding...');
        
        // Navigate to next page after delay
        setTimeout(() => {
            // Placeholder: Navigate to next step in workflow
            window.location.href = 'index.html'; // Replace with actual next page
        }, 1500);
        
    } catch (error) {
        console.error('Error submitting form:', error);
        showNotification('Error submitting assessment', true);
    }
}

// Check and Show Soft Warning
let warningTimeout = null;

function checkAndShowSoftWarning() {
    const allStatusFields = document.querySelectorAll('input[type="radio"][name$="_status"]:checked');
    let hasNonOkSelection = false;
    
    allStatusFields.forEach(radio => {
        if (radio.value !== 'ok') {
            hasNonOkSelection = true;
        }
    });
    
    const overlay = document.getElementById('softWarningOverlay');
    
    if (hasNonOkSelection) {
        // Show the soft warning
        overlay.classList.add('show');
        
        // Clear any existing timeout
        if (warningTimeout) {
            clearTimeout(warningTimeout);
        }
        
        // Auto-hide after 4 seconds
        warningTimeout = setTimeout(() => {
            overlay.classList.remove('show');
        }, 4000);
    }
}

// Show Notification
function showNotification(message, isError = false) {
    const notification = document.getElementById('notification');
    const notificationText = document.getElementById('notificationText');
    
    notificationText.textContent = message;
    
    if (isError) {
        notification.style.background = 'linear-gradient(135deg, #f44336 0%, #e53935 100%)';
    } else {
        notification.style.background = 'linear-gradient(135deg, #08954C 0%, #0ab05e 100%)';
    }
    
    notification.classList.add('show');
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

// Keyboard Shortcuts
document.addEventListener('keydown', function(event) {
    // Ctrl/Cmd + S to save draft
    if ((event.ctrlKey || event.metaKey) && event.key === 's') {
        event.preventDefault();
        saveDraft();
    }
});

// Soft warning overlay click-to-dismiss
document.addEventListener('DOMContentLoaded', function() {
    const overlay = document.getElementById('softWarningOverlay');
    if (overlay) {
        overlay.addEventListener('click', function() {
            // Clear timeout and immediately hide
            if (warningTimeout) {
                clearTimeout(warningTimeout);
                warningTimeout = null;
            }
            overlay.classList.remove('show');
        });
    }
});

// Export functionality (for future use)
function exportToJSON() {
    const data = getFormData();
    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'dfm-questionnaire-full-' + new Date().toISOString().split('T')[0] + '.json';
    link.click();
    
    URL.revokeObjectURL(url);
}

// Print functionality (for future use)
function printQuestionnaire() {
    window.print();
}
