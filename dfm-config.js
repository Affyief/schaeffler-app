// DFM Configuration Page - Sequential Dropdown Logic
document.addEventListener('DOMContentLoaded', function() {
    // Configuration state
    const config = {
        currentStep: 0,
        totalSteps: 7,
        selections: {
            dfmType: '',
            division: '',
            businessDivision: '',
            regions: '',
            country: '',
            location: '',
            projectType: ''
        }
    };

    // Get all select elements
    const selects = {
        dfmType: document.getElementById('dfmType'),
        division: document.getElementById('division'),
        businessDivision: document.getElementById('businessDivision'),
        regions: document.getElementById('regions'),
        country: document.getElementById('country'),
        location: document.getElementById('location'),
        projectType: document.getElementById('projectType')
    };

    // Get form groups
    const groups = {
        1: document.getElementById('group-1'),
        2: document.getElementById('group-2'),
        3: document.getElementById('group-3'),
        4: document.getElementById('group-4'),
        5: document.getElementById('group-5'),
        6: document.getElementById('group-6'),
        7: document.getElementById('group-7')
    };

    // Get progress elements
    const progressFill = document.getElementById('progressFill');
    const progressText = document.getElementById('progressText');
    const proceedBtn = document.getElementById('proceedBtn');

    // Initialize first dropdown
    function init() {
        // Enable first dropdown
        selects.dfmType.disabled = false;
        groups[1].classList.add('active');
        
        // Add event listeners to all selects
        Object.keys(selects).forEach((key, index) => {
            selects[key].addEventListener('change', function() {
                handleSelection(index + 1, this.value, key);
            });
        });

        // Proceed button click handler
        proceedBtn.addEventListener('click', function() {
            if (config.currentStep === config.totalSteps) {
                console.log('All selections completed:', config.selections);
                alert('Configuration complete! Proceeding to next step...\n\n' + JSON.stringify(config.selections, null, 2));
                // Here you would navigate to the next page
                // window.location.href = 'next-page.html';
            }
        });
    }

    // Handle selection for each dropdown
    function handleSelection(step, value, key) {
        if (!value) return;

        // Store selection
        config.selections[key] = value;
        
        // Mark current group as completed
        groups[step].classList.remove('active');
        groups[step].classList.add('completed');

        // Update current step
        config.currentStep = step;
        
        // Enable next dropdown if available
        if (step < config.totalSteps) {
            const nextStep = step + 1;
            const nextSelectKey = Object.keys(selects)[nextStep - 1];
            selects[nextSelectKey].disabled = false;
            groups[nextStep].classList.add('active');
            
            // Scroll to next field smoothly
            setTimeout(() => {
                groups[nextStep].scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 100);
        }

        // Update progress
        updateProgress();

        // Check if all selections are complete
        checkCompletion();
    }

    // Update progress bar
    function updateProgress() {
        const percentage = (config.currentStep / config.totalSteps) * 100;
        progressFill.style.width = percentage + '%';
        progressText.textContent = `Step ${config.currentStep} of ${config.totalSteps} completed`;
    }

    // Check if all selections are complete
    function checkCompletion() {
        const allSelected = Object.values(config.selections).every(val => val !== '');
        
        if (allSelected) {
            proceedBtn.disabled = false;
            proceedBtn.style.animation = 'pulse 2s infinite';
        } else {
            proceedBtn.disabled = true;
            proceedBtn.style.animation = 'none';
        }
    }

    // Initialize the page
    init();
});
