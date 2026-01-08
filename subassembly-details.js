// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    // Add initial 5 rows
    for (let i = 0; i < 5; i++) {
        addSubAssemblyRow();
    }
    
    // Update sub-assembly count
    updateSubAssemblyCount();
});

// Add a new sub-assembly row
function addSubAssemblyRow() {
    const tbody = document.getElementById('subassembliesTableBody');
    const rowCount = tbody.children.length + 1;
    
    const row = document.createElement('tr');
    row.innerHTML = `
        <td class="col-number">
            <span class="row-number">${rowCount}</span>
        </td>
        <td class="col-name">
            <input 
                type="text" 
                placeholder="Enter sub-assembly name" 
                data-field="name"
                oninput="validateSubAssembly(this)"
                required
            >
        </td>
        <td class="col-category">
            <input 
                type="text" 
                placeholder="e.g., Mechanical, Electrical, Housing" 
                data-field="category"
                oninput="validateSubAssembly(this)"
                required
            >
        </td>
        <td class="col-process">
            <input 
                type="text" 
                placeholder="e.g., Casting, Forging, Machining" 
                data-field="process1"
                oninput="validateSubAssembly(this)"
                required
            >
        </td>
        <td class="col-process">
            <input 
                type="text" 
                placeholder="e.g., Heat Treatment, Grinding" 
                data-field="process2"
                oninput="validateSubAssembly(this)"
                required
            >
        </td>
        <td class="col-process">
            <input 
                type="text" 
                placeholder="e.g., Surface Treatment, Assembly" 
                data-field="process3"
                oninput="validateSubAssembly(this)"
                required
            >
        </td>
        <td class="col-actions">
            <button class="btn-delete" onclick="deleteSubAssemblyRow(this)" title="Delete sub-assembly">
                <svg viewBox="0 0 24 24" width="18" height="18">
                    <path fill="currentColor" d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                </svg>
            </button>
        </td>
    `;
    
    // Add entrance animation
    row.style.animation = 'slideIn 0.3s ease-out';
    tbody.appendChild(row);
    
    // Scroll to the new row
    setTimeout(() => {
        row.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 100);
    
    // Update row numbers
    updateRowNumbers();
    updateSubAssemblyCount();
}

// Delete a sub-assembly row
function deleteSubAssemblyRow(button) {
    const tbody = document.getElementById('subassembliesTableBody');
    const row = button.closest('tr');
    
    // Check if this is the last row with data
    const allRows = Array.from(tbody.children);
    const filledRows = allRows.filter(r => isRowFilled(r));
    
    if (filledRows.length === 1 && isRowFilled(row)) {
        alert('Cannot delete the last sub-assembly with data. At least one sub-assembly must be defined.');
        return;
    }
    
    // Add exit animation
    row.style.animation = 'fadeOut 0.3s ease-out';
    setTimeout(() => {
        row.remove();
        updateRowNumbers();
        updateSubAssemblyCount();
        validateForm();
    }, 300);
}

// Check if a row has any filled fields
function isRowFilled(row) {
    const inputs = row.querySelectorAll('input');
    return Array.from(inputs).some(input => input.value.trim().length > 0);
}

// Check if a row is complete (all fields filled)
function isRowComplete(row) {
    const inputs = row.querySelectorAll('input');
    return Array.from(inputs).every(input => input.value.trim().length >= 2);
}

// Update row numbers
function updateRowNumbers() {
    const tbody = document.getElementById('subassembliesTableBody');
    const rows = tbody.children;
    
    Array.from(rows).forEach((row, index) => {
        const numberCell = row.querySelector('.row-number');
        if (numberCell) {
            numberCell.textContent = index + 1;
        }
    });
}

// Update sub-assembly count
function updateSubAssemblyCount() {
    const tbody = document.getElementById('subassembliesTableBody');
    const rows = Array.from(tbody.children);
    const completeRows = rows.filter(row => isRowComplete(row));
    
    const counter = document.getElementById('subassemblyCounter');
    counter.textContent = `${completeRows.length} sub-assembly(ies) added`;
}

// Validate sub-assembly input
function validateSubAssembly(input) {
    const row = input.closest('tr');
    const value = input.value.trim();
    
    // Validate minimum length
    if (value.length > 0 && value.length < 2) {
        input.classList.add('invalid');
        input.classList.remove('valid');
    } else if (value.length >= 2) {
        input.classList.add('valid');
        input.classList.remove('invalid');
    } else {
        input.classList.remove('valid', 'invalid');
    }
    
    // Update count and validate form
    updateSubAssemblyCount();
    validateForm();
}

// Validate the entire form
function validateForm() {
    const tbody = document.getElementById('subassembliesTableBody');
    const rows = Array.from(tbody.children);
    const completeRows = rows.filter(row => isRowComplete(row));
    
    const submitBtn = document.getElementById('submitBtn');
    
    // Enable button only if at least one complete sub-assembly
    if (completeRows.length > 0) {
        submitBtn.disabled = false;
        submitBtn.classList.add('enabled');
    } else {
        submitBtn.disabled = true;
        submitBtn.classList.remove('enabled');
    }
}

// Handle form submission
function handleSubmit() {
    const tbody = document.getElementById('subassembliesTableBody');
    const rows = Array.from(tbody.children);
    const completeRows = rows.filter(row => isRowComplete(row));
    
    if (completeRows.length === 0) {
        alert('Please add at least one complete sub-assembly before proceeding.');
        return;
    }
    
    // Collect sub-assembly data
    const subassemblies = completeRows.map(row => {
        const inputs = row.querySelectorAll('input');
        return {
            name: inputs[0].value.trim(),
            category: inputs[1].value.trim(),
            process1: inputs[2].value.trim(),
            process2: inputs[3].value.trim(),
            process3: inputs[4].value.trim()
        };
    });
    
    // Save to localStorage
    localStorage.setItem('dfm_subassemblies', JSON.stringify(subassemblies));
    
    // Show success message
    const submitBtn = document.getElementById('submitBtn');
    submitBtn.textContent = 'Saved! Redirecting...';
    submitBtn.disabled = true;
    
    // Navigate to next page (placeholder for now)
    setTimeout(() => {
        // TODO: Navigate to next workflow step
        alert('Sub-assembly details saved successfully! Ready for next workflow step.');
        // window.location.href = 'next-page.html';
    }, 1500);
}

// Auto-save functionality
let autoSaveTimer;
function startAutoSave() {
    // Clear existing timer
    if (autoSaveTimer) {
        clearInterval(autoSaveTimer);
    }
    
    // Auto-save every 30 seconds
    autoSaveTimer = setInterval(() => {
        const tbody = document.getElementById('subassembliesTableBody');
        const rows = Array.from(tbody.children);
        const completeRows = rows.filter(row => isRowComplete(row));
        
        if (completeRows.length > 0) {
            const subassemblies = completeRows.map(row => {
                const inputs = row.querySelectorAll('input');
                return {
                    name: inputs[0].value.trim(),
                    category: inputs[1].value.trim(),
                    process1: inputs[2].value.trim(),
                    process2: inputs[3].value.trim(),
                    process3: inputs[4].value.trim()
                };
            });
            
            localStorage.setItem('dfm_subassemblies_draft', JSON.stringify(subassemblies));
            console.log('Auto-saved sub-assembly details');
        }
    }, 30000);
}

// Start auto-save when page loads
startAutoSave();

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Ctrl/Cmd + Enter to submit
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        const submitBtn = document.getElementById('submitBtn');
        if (!submitBtn.disabled) {
            handleSubmit();
        }
    }
    
    // Ctrl/Cmd + Plus to add row
    if ((e.ctrlKey || e.metaKey) && (e.key === '+' || e.key === '=')) {
        e.preventDefault();
        addSubAssemblyRow();
    }
});
