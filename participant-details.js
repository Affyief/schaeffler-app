// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    // Add initial 5 rows
    for (let i = 0; i < 5; i++) {
        addParticipantRow();
    }
    
    // Update participant count
    updateParticipantCount();
});

// Add a new participant row
function addParticipantRow() {
    const tbody = document.getElementById('participantsTableBody');
    const rowCount = tbody.children.length + 1;
    
    const row = document.createElement('tr');
    row.innerHTML = `
        <td class="col-number">
            <span class="row-number">${rowCount}</span>
        </td>
        <td class="col-firstname">
            <input 
                type="text" 
                placeholder="Enter first name" 
                data-field="firstname"
                oninput="validateParticipant(this)"
                required
            >
        </td>
        <td class="col-lastname">
            <input 
                type="text" 
                placeholder="Enter last name" 
                data-field="lastname"
                oninput="validateParticipant(this)"
                required
            >
        </td>
        <td class="col-location">
            <input 
                type="text" 
                placeholder="e.g., Herzogenaurach, Germany" 
                data-field="location"
                oninput="validateParticipant(this)"
                required
            >
        </td>
        <td class="col-organization">
            <input 
                type="text" 
                placeholder="e.g., Schaeffler AG" 
                data-field="organization"
                oninput="validateParticipant(this)"
                required
            >
        </td>
        <td class="col-role">
            <input 
                type="text" 
                placeholder="e.g., Design Engineer" 
                data-field="role"
                oninput="validateParticipant(this)"
                required
            >
        </td>
        <td class="col-actions">
            <button class="btn-delete" onclick="deleteParticipantRow(this)" title="Delete participant">
                <svg viewBox="0 0 24 24" width="20" height="20">
                    <path fill="currentColor" d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                </svg>
            </button>
        </td>
    `;
    
    tbody.appendChild(row);
    updateParticipantCount();
    updateRowNumbers();
    
    // Add entrance animation
    row.style.animation = 'slideUp 0.4s ease';
}

// Delete a participant row
function deleteParticipantRow(button) {
    const row = button.closest('tr');
    const tbody = document.getElementById('participantsTableBody');
    
    // Don't allow deletion if only one row remains with data
    const filledRows = Array.from(tbody.querySelectorAll('tr')).filter(r => {
        const inputs = r.querySelectorAll('input');
        return Array.from(inputs).some(input => input.value.trim() !== '');
    });
    
    if (filledRows.length === 1 && filledRows[0] === row) {
        alert('At least one participant must remain. Cannot delete the last filled participant.');
        return;
    }
    
    // Add fade out animation
    row.style.opacity = '0';
    row.style.transform = 'translateX(-20px)';
    
    setTimeout(() => {
        row.remove();
        updateRowNumbers();
        updateParticipantCount();
        checkFormValidity();
    }, 300);
}

// Update row numbers after addition/deletion
function updateRowNumbers() {
    const tbody = document.getElementById('participantsTableBody');
    const rows = tbody.querySelectorAll('tr');
    
    rows.forEach((row, index) => {
        const numberBadge = row.querySelector('.row-number');
        if (numberBadge) {
            numberBadge.textContent = index + 1;
        }
    });
}

// Validate participant input field
function validateParticipant(input) {
    const value = input.value.trim();
    
    // Remove any previous validation classes
    input.classList.remove('valid', 'invalid');
    
    // Validate based on field type
    if (value.length > 0) {
        if (value.length < 2) {
            input.classList.add('invalid');
        } else {
            input.classList.add('valid');
        }
    }
    
    // Check overall form validity
    checkFormValidity();
}

// Update participant count display
function updateParticipantCount() {
    const tbody = document.getElementById('participantsTableBody');
    const rows = tbody.querySelectorAll('tr');
    
    // Count rows with at least one filled field
    let filledCount = 0;
    rows.forEach(row => {
        const inputs = row.querySelectorAll('input');
        const hasData = Array.from(inputs).some(input => input.value.trim() !== '');
        if (hasData) {
            filledCount++;
        }
    });
    
    document.getElementById('participantCount').textContent = filledCount;
}

// Check if form is valid to enable proceed button
function checkFormValidity() {
    const tbody = document.getElementById('participantsTableBody');
    const rows = tbody.querySelectorAll('tr');
    const proceedBtn = document.getElementById('proceedBtn');
    
    let hasAtLeastOneComplete = false;
    
    // Check if at least one row is completely filled
    rows.forEach(row => {
        const inputs = row.querySelectorAll('input');
        const allFilled = Array.from(inputs).every(input => {
            const value = input.value.trim();
            return value.length >= 2;
        });
        
        // Check if any field in this row has data
        const hasAnyData = Array.from(inputs).some(input => input.value.trim() !== '');
        
        if (allFilled && hasAnyData) {
            hasAtLeastOneComplete = true;
        }
    });
    
    // Enable button if at least one complete participant exists
    proceedBtn.disabled = !hasAtLeastOneComplete;
    
    // Update count
    updateParticipantCount();
}

// Go back to previous page
function goBack() {
    if (confirm('Are you sure you want to go back? Any unsaved changes will be lost.')) {
        window.location.href = 'project-details.html';
    }
}

// Proceed to next page
function proceedToNext() {
    const tbody = document.getElementById('participantsTableBody');
    const rows = tbody.querySelectorAll('tr');
    
    // Collect all valid participants
    const participants = [];
    
    rows.forEach(row => {
        const inputs = row.querySelectorAll('input');
        const hasData = Array.from(inputs).some(input => input.value.trim() !== '');
        
        if (hasData) {
            const participant = {
                firstName: row.querySelector('[data-field="firstname"]').value.trim(),
                lastName: row.querySelector('[data-field="lastname"]').value.trim(),
                location: row.querySelector('[data-field="location"]').value.trim(),
                organization: row.querySelector('[data-field="organization"]').value.trim(),
                role: row.querySelector('[data-field="role"]').value.trim()
            };
            
            // Only add if all fields are filled
            if (Object.values(participant).every(val => val.length >= 2)) {
                participants.push(participant);
            }
        }
    });
    
    if (participants.length === 0) {
        alert('Please add at least one complete participant with all fields filled.');
        return;
    }
    
    // Validate that all added participants are complete
    let incompleteRows = 0;
    rows.forEach(row => {
        const inputs = row.querySelectorAll('input');
        const hasAnyData = Array.from(inputs).some(input => input.value.trim() !== '');
        const allFilled = Array.from(inputs).every(input => input.value.trim().length >= 2);
        
        if (hasAnyData && !allFilled) {
            incompleteRows++;
        }
    });
    
    if (incompleteRows > 0) {
        alert(`Please complete all fields for ${incompleteRows} participant(s) or remove incomplete entries.`);
        return;
    }
    
    // Store data in localStorage
    localStorage.setItem('dfm_participants', JSON.stringify(participants));
    
    // Show success message and navigate
    const proceedBtn = document.getElementById('proceedBtn');
    proceedBtn.textContent = 'Saved! Redirecting...';
    proceedBtn.disabled = true;
    
    console.log('Saved participants:', participants);
    
    // Navigate to sub-assembly details page
    setTimeout(() => {
        window.location.href = 'subassembly-details.html';
    }, 1500);
}

// Logo error handling
function handleLogoError(img) {
    const logoUrl = 'https://acam.rwth-campus.com/wp-content/uploads/sites/11/2024/05/Schaeffler-Logo.jpg';
    
    if (img.src !== logoUrl) {
        img.src = logoUrl;
    } else {
        img.style.display = 'none';
        const logoText = document.createElement('span');
        logoText.textContent = 'Schaeffler';
        logoText.style.cssText = `
            color: #08954C;
            font-weight: 600;
            font-size: 1.2rem;
            padding: 0.5rem 1rem;
            background: white;
            border: 2px solid #08954C;
            border-radius: 4px;
        `;
        img.parentElement.appendChild(logoText);
    }
}

// Add keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Ctrl/Cmd + Enter to proceed
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        const proceedBtn = document.getElementById('proceedBtn');
        if (!proceedBtn.disabled) {
            proceedToNext();
        }
    }
    
    // Ctrl/Cmd + Plus to add row
    if ((e.ctrlKey || e.metaKey) && (e.key === '+' || e.key === '=')) {
        e.preventDefault();
        addParticipantRow();
    }
});

// Auto-save to localStorage every 30 seconds
setInterval(() => {
    const tbody = document.getElementById('participantsTableBody');
    const rows = tbody.querySelectorAll('tr');
    const draftData = [];
    
    rows.forEach(row => {
        const inputs = row.querySelectorAll('input');
        const rowData = {};
        inputs.forEach(input => {
            rowData[input.getAttribute('data-field')] = input.value;
        });
        draftData.push(rowData);
    });
    
    localStorage.setItem('dfm_participants_draft', JSON.stringify(draftData));
}, 30000);

// Load draft data if available
window.addEventListener('load', function() {
    const draftData = localStorage.getItem('dfm_participants_draft');
    if (draftData) {
        try {
            const participants = JSON.parse(draftData);
            const tbody = document.getElementById('participantsTableBody');
            const rows = tbody.querySelectorAll('tr');
            
            participants.forEach((participant, index) => {
                if (rows[index]) {
                    const row = rows[index];
                    Object.keys(participant).forEach(field => {
                        const input = row.querySelector(`[data-field="${field}"]`);
                        if (input && participant[field]) {
                            input.value = participant[field];
                            validateParticipant(input);
                        }
                    });
                }
            });
        } catch (e) {
            console.error('Error loading draft data:', e);
        }
    }
});
