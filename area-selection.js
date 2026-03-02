// Area Selection Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Get DOM elements
    const areaCheckboxes = document.querySelectorAll('input[name="area"]');
    const selectionSummary = document.getElementById('selectionSummary');
    const questionnaireType = document.getElementById('questionnaireType');
    const subAreaSelect = document.getElementById('subAreaSelect');
    const subAreaCard = document.getElementById('subAreaCard');
    const submitBtn = document.getElementById('submitBtn');
    const notification = document.getElementById('notification');

    // Load saved data if exists
    loadSavedData();

    // Auto-save every 30 seconds
    setInterval(saveData, 30000);

    // Event Listeners
    areaCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', handleAreaChange);
    });
    questionnaireType.addEventListener('change', handleQuestionnaireTypeChange);
    subAreaSelect.addEventListener('change', validateForm);
    submitBtn.addEventListener('click', handleSubmit);

    // Handle Area Selection Change
    function handleAreaChange() {
        const selectedAreas = getSelectedAreas();
        
        // Update summary
        updateSelectionSummary(selectedAreas.length);
        
        if (selectedAreas.length > 0) {
            // Enable questionnaire type dropdown
            questionnaireType.disabled = false;
            questionnaireType.parentElement.parentElement.parentElement.classList.remove('disabled');
            
            // Save data
            saveData();
            
            // Validate form
            validateForm();
        } else {
            // Disable downstream dropdowns
            questionnaireType.disabled = true;
            questionnaireType.value = '';
            questionnaireType.classList.remove('valid');
            questionnaireType.parentElement.parentElement.parentElement.classList.add('disabled');
            
            subAreaSelect.disabled = true;
            subAreaSelect.value = '';
            subAreaSelect.classList.remove('valid');
            subAreaCard.classList.add('disabled');
            subAreaCard.classList.remove('enabled');
            
            validateForm();
        }
    }
    
    // Get Selected Areas
    function getSelectedAreas() {
        const selected = [];
        areaCheckboxes.forEach(checkbox => {
            if (checkbox.checked) {
                selected.push(checkbox.value);
            }
        });
        return selected;
    }
    
    // Update Selection Summary
    function updateSelectionSummary(count) {
        const summaryText = selectionSummary.querySelector('.summary-text');
        if (count === 0) {
            summaryText.textContent = '0 areas selected';
            summaryText.style.color = '#dc3545';
        } else if (count === 1) {
            summaryText.textContent = '1 area selected';
            summaryText.style.color = '#08954C';
        } else {
            summaryText.textContent = `${count} areas selected`;
            summaryText.style.color = '#08954C';
        }
    }

    // Handle Questionnaire Type Change
    function handleQuestionnaireTypeChange() {
        const typeValue = questionnaireType.value;
        
        if (typeValue) {
            questionnaireType.classList.add('valid');
            
            if (typeValue === 'sub_area') {
                // Enable sub-area dropdown
                subAreaSelect.disabled = false;
                subAreaCard.classList.remove('disabled');
                subAreaCard.classList.add('enabled');
            } else {
                // Disable and reset sub-area dropdown for full questionnaire
                subAreaSelect.disabled = true;
                subAreaSelect.value = '';
                subAreaSelect.classList.remove('valid');
                subAreaCard.classList.remove('enabled');
                subAreaCard.classList.add('disabled');
            }
            
            // Save data
            saveData();
            
            // Validate form
            validateForm();
        } else {
            questionnaireType.classList.remove('valid');
            subAreaSelect.disabled = true;
            subAreaSelect.value = '';
            subAreaSelect.classList.remove('valid');
            subAreaCard.classList.remove('enabled');
            subAreaCard.classList.add('disabled');
            
            validateForm();
        }
    }

    // Validate Form
    function validateForm() {
        const selectedAreas = getSelectedAreas();
        const typeValue = questionnaireType.value;
        const subAreaValue = subAreaSelect.value;

        let isValid = false;

        if (selectedAreas.length > 0 && typeValue) {
            if (typeValue === 'full') {
                // For full questionnaire, areas and type are enough
                isValid = true;
            } else if (typeValue === 'sub_area') {
                // For sub-area questionnaire, need sub-area selection too
                isValid = subAreaValue !== '';
                
                // Add valid class to sub-area if selected
                if (subAreaValue) {
                    subAreaSelect.classList.add('valid');
                } else {
                    subAreaSelect.classList.remove('valid');
                }
            }
        }

        // Enable/disable submit button
        submitBtn.disabled = !isValid;

        return isValid;
    }

    // Handle Submit
    function handleSubmit() {
        if (!validateForm()) {
            return;
        }

        // Save data
        saveData();

        // Show saving state
        submitBtn.classList.add('saving');
        submitBtn.textContent = 'Saving...';
        submitBtn.disabled = true;

        const typeValue = questionnaireType.value;

        // Simulate save and navigate
        setTimeout(() => {
            // Show success notification
            notification.classList.add('show');

            setTimeout(() => {
                notification.classList.remove('show');
                
                // Navigate to appropriate questionnaire page
                if (typeValue === 'full') {
                    window.location.href = 'questionnaire-full.html';
                } else if (typeValue === 'sub_area') {
                    // Placeholder for sub-area questionnaire page
                    window.location.href = 'questionnaire-subarea.html';
                }
            }, 800);
        }, 500);
    }

    // Save Data to localStorage
    function saveData() {
        const selectedAreas = getSelectedAreas();
        const data = {
            areas: selectedAreas, // Changed from 'area' to 'areas' (array)
            questionnaireType: questionnaireType.value,
            subArea: subAreaSelect.value,
            timestamp: new Date().toISOString()
        };

        try {
            localStorage.setItem('dfm_area_selection', JSON.stringify(data));
            console.log('Area selection data saved:', data);
        } catch (e) {
            console.error('Error saving area selection data:', e);
        }
    }

    // Load Saved Data
    function loadSavedData() {
        try {
            const savedData = localStorage.getItem('dfm_area_selection');
            if (savedData) {
                const data = JSON.parse(savedData);
                
                // Restore area selections (handle both old single value and new array format)
                if (data.areas && Array.isArray(data.areas)) {
                    // New format: array of areas
                    areaCheckboxes.forEach(checkbox => {
                        if (data.areas.includes(checkbox.value)) {
                            checkbox.checked = true;
                        }
                    });
                    updateSelectionSummary(data.areas.length);
                    handleAreaChange();
                } else if (data.area) {
                    // Old format: single area value - convert to new format
                    areaCheckboxes.forEach(checkbox => {
                        if (checkbox.value === data.area) {
                            checkbox.checked = true;
                        }
                    });
                    updateSelectionSummary(1);
                    handleAreaChange();
                }

                // Restore questionnaire type
                if (data.questionnaireType) {
                    setTimeout(() => {
                        questionnaireType.value = data.questionnaireType;
                        questionnaireType.classList.add('valid');
                        handleQuestionnaireTypeChange();

                        // Restore sub-area if applicable
                        if (data.subArea && data.questionnaireType === 'sub_area') {
                            setTimeout(() => {
                                subAreaSelect.value = data.subArea;
                                subAreaSelect.classList.add('valid');
                                validateForm();
                            }, 100);
                        }
                    }, 100);
                }

                console.log('Area selection data loaded:', data);
            }
        } catch (e) {
            console.error('Error loading area selection data:', e);
        }
    }

    // Initialize form validation
    validateForm();
});
