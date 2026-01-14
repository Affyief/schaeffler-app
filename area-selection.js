// Area Selection Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Get DOM elements
    const areaSelect = document.getElementById('areaSelect');
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
    areaSelect.addEventListener('change', handleAreaChange);
    questionnaireType.addEventListener('change', handleQuestionnaireTypeChange);
    subAreaSelect.addEventListener('change', validateForm);
    submitBtn.addEventListener('click', handleSubmit);

    // Handle Area Selection Change
    function handleAreaChange() {
        const areaValue = areaSelect.value;
        
        if (areaValue) {
            // Enable questionnaire type dropdown
            questionnaireType.disabled = false;
            questionnaireType.parentElement.parentElement.parentElement.classList.remove('disabled');
            
            // Add valid class
            areaSelect.classList.add('valid');
            
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
            
            areaSelect.classList.remove('valid');
            
            validateForm();
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
        const areaValue = areaSelect.value;
        const typeValue = questionnaireType.value;
        const subAreaValue = subAreaSelect.value;

        let isValid = false;

        if (areaValue && typeValue) {
            if (typeValue === 'full') {
                // For full questionnaire, area and type are enough
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
        const data = {
            area: areaSelect.value,
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
                
                // Restore area selection
                if (data.area) {
                    areaSelect.value = data.area;
                    areaSelect.classList.add('valid');
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
