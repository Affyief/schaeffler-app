// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    // Add initial 5 rows
    for (let i = 0; i < 5; i++) {
        addParticipantRow();
    }
    
    // Update participant count
    updateParticipantCount();
    
    // Initialize address book contacts
    initializeAddressBook();
});

// Address book contacts data
const addressBookContacts = [
    {
        firstName: "Dr. Sarah",
        lastName: "Mitchell",
        title: "Senior Design Engineer",
        department: "Product Development",
        email: "sarah.mitchell@schaeffler.com",
        phone: "+49 9132 82-4521",
        location: "Herzogenaurach, Germany",
        organization: "Schaeffler AG",
        role: "Design Engineer",
        avatar: "SM"
    },
    {
        firstName: "Michael",
        lastName: "Anderson",
        title: "Manufacturing Process Manager",
        department: "Production Engineering",
        email: "michael.anderson@schaeffler.com",
        phone: "+49 9132 82-3892",
        location: "Schweinfurt, Germany",
        organization: "Schaeffler Technologies AG & Co. KG",
        role: "Process Manager",
        avatar: "MA"
    },
    {
        firstName: "Lisa",
        lastName: "Chen",
        title: "Quality Assurance Lead",
        department: "Quality Management",
        email: "lisa.chen@schaeffler.com",
        phone: "+49 9132 82-2156",
        location: "Bühl, Germany",
        organization: "Schaeffler AG",
        role: "Quality Engineer",
        avatar: "LC"
    },
    {
        firstName: "Prof. James",
        lastName: "Rodriguez",
        title: "Chief Technical Architect",
        department: "Research & Development",
        email: "james.rodriguez@schaeffler.com",
        phone: "+49 9132 82-1743",
        location: "Herzogenaurach, Germany",
        organization: "Schaeffler AG",
        role: "Technical Architect",
        avatar: "JR"
    },
    {
        firstName: "Emma",
        lastName: "Schneider",
        title: "Project Coordinator",
        department: "Project Management Office",
        email: "emma.schneider@schaeffler.com",
        phone: "+49 9132 82-5678",
        location: "Erlangen, Germany",
        organization: "Schaeffler Technologies AG & Co. KG",
        role: "Project Coordinator",
        avatar: "ES"
    }
];

// Initialize address book with contacts
function initializeAddressBook() {
    const contactsGrid = document.getElementById('contactsGrid');
    if (!contactsGrid) return;
    
    contactsGrid.innerHTML = '';
    
    addressBookContacts.forEach((contact, index) => {
        const contactCard = createContactCard(contact, index);
        contactsGrid.appendChild(contactCard);
    });
}

// Create a contact card element
function createContactCard(contact, index) {
    const card = document.createElement('div');
    card.className = 'contact-card';
    card.innerHTML = `
        <div class="contact-header">
            <div class="contact-avatar">${contact.avatar}</div>
            <div class="contact-info">
                <h3 class="contact-name">${contact.firstName} ${contact.lastName}</h3>
                <p class="contact-title">${contact.title}</p>
            </div>
        </div>
        <div class="contact-details">
            <div class="contact-detail">
                <svg viewBox="0 0 24 24" width="16" height="16">
                    <path fill="currentColor" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                </svg>
                <span>${contact.location}</span>
            </div>
            <div class="contact-detail">
                <svg viewBox="0 0 24 24" width="16" height="16">
                    <path fill="currentColor" d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                </svg>
                <span>${contact.email}</span>
            </div>
            <div class="contact-detail">
                <svg viewBox="0 0 24 24" width="16" height="16">
                    <path fill="currentColor" d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
                </svg>
                <span>${contact.phone}</span>
            </div>
            <div class="contact-detail">
                <svg viewBox="0 0 24 24" width="16" height="16">
                    <path fill="currentColor" d="M12 7V3H2v18h20V7H12zM6 19H4v-2h2v2zm0-4H4v-2h2v2zm0-4H4V9h2v2zm0-4H4V5h2v2zm4 12H8v-2h2v2zm0-4H8v-2h2v2zm0-4H8V9h2v2zm0-4H8V5h2v2zm10 12h-8v-2h2v-2h-2v-2h2v-2h-2V9h8v10zm-2-8h-2v2h2v-2zm0 4h-2v2h2v-2z"/>
                </svg>
                <span>${contact.department}</span>
            </div>
            <div class="contact-detail">
                <svg viewBox="0 0 24 24" width="16" height="16">
                    <path fill="currentColor" d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                </svg>
                <span>${contact.role}</span>
            </div>
            <div class="contact-detail">
                <svg viewBox="0 0 24 24" width="16" height="16">
                    <path fill="currentColor" d="M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm0 4c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm6 12H6v-1.4c0-2 4-3.1 6-3.1s6 1.1 6 3.1V19z"/>
                </svg>
                <span>${contact.organization}</span>
            </div>
        </div>
        <button class="btn-select-contact" onclick="selectContact(${index})">
            <svg viewBox="0 0 24 24" width="18" height="18">
                <path fill="currentColor" d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
            </svg>
            Select this contact
        </button>
    `;
    
    return card;
}

// Open address book modal
function openAddressBook() {
    const modal = document.getElementById('addressBookModal');
    if (modal) {
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
        
        // Add animation class
        setTimeout(() => {
            modal.classList.add('active');
        }, 10);
    }
}

// Close address book modal
function closeAddressBook(event) {
    const modal = document.getElementById('addressBookModal');
    if (modal && (!event || event.target === modal)) {
        modal.classList.remove('active');
        document.body.style.overflow = ''; // Restore scrolling
        
        setTimeout(() => {
            modal.style.display = 'none';
        }, 300);
    }
}

// Select a contact from address book
function selectContact(index) {
    const contact = addressBookContacts[index];
    
    // Find the first empty row or add a new one
    const tbody = document.getElementById('participantsTableBody');
    const rows = tbody.querySelectorAll('tr');
    let targetRow = null;
    
    // Look for an empty row
    for (let row of rows) {
        const inputs = row.querySelectorAll('input');
        const isEmpty = Array.from(inputs).every(input => input.value.trim() === '');
        if (isEmpty) {
            targetRow = row;
            break;
        }
    }
    
    // If no empty row found, add a new one
    if (!targetRow) {
        addParticipantRow();
        const newRows = tbody.querySelectorAll('tr');
        targetRow = newRows[newRows.length - 1];
    }
    
    // Populate the row with contact data
    if (targetRow) {
        targetRow.querySelector('[data-field="firstname"]').value = contact.firstName;
        targetRow.querySelector('[data-field="lastname"]').value = contact.lastName;
        targetRow.querySelector('[data-field="location"]').value = contact.location;
        targetRow.querySelector('[data-field="organization"]').value = contact.organization;
        targetRow.querySelector('[data-field="role"]').value = contact.role;
        
        // Validate all fields
        targetRow.querySelectorAll('input').forEach(input => {
            validateParticipant(input);
        });
        
        // Highlight the row briefly
        targetRow.style.background = '#d4edda';
        setTimeout(() => {
            targetRow.style.background = '';
        }, 2000);
    }
    
    // Close the modal
    closeAddressBook();
}


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
