// Global variables
let subassemblies = [];
let currentSubAssemblyIndex = null;
let uploadedImages = {};

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    loadSubAssemblies();
    renderSubAssemblies();
    validateForm();
    setupAutoSave();
});

// Load sub-assemblies from localStorage
function loadSubAssemblies() {
    const saved = localStorage.getItem('dfm_subassemblies');
    if (saved) {
        try {
            subassemblies = JSON.parse(saved);
        } catch (e) {
            console.error('Error loading sub-assemblies:', e);
            subassemblies = [];
        }
    }
    
    // Load previously uploaded images
    const savedImages = localStorage.getItem('dfm_product_images');
    if (savedImages) {
        try {
            uploadedImages = JSON.parse(savedImages);
        } catch (e) {
            console.error('Error loading images:', e);
            uploadedImages = {};
        }
    }
}

// Render sub-assemblies cards
function renderSubAssemblies() {
    const container = document.getElementById('subassembliesContainer');
    
    if (subassemblies.length === 0) {
        container.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 3rem;">
                <p style="color: #666; font-size: 1.2rem;">No sub-assemblies found. Please complete the Sub-Assembly Details page first.</p>
                <button onclick="window.location.href='subassembly-details.html'" style="margin-top: 1rem; padding: 0.75rem 2rem; background: #08954C; color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 1rem;">
                    Go to Sub-Assembly Details
                </button>
            </div>
        `;
        return;
    }
    
    container.innerHTML = subassemblies.map((subassembly, index) => `
        <div class="subassembly-card" style="animation-delay: ${index * 0.1}s">
            <div class="card-header">
                <div class="card-number">${index + 1}</div>
                <div class="card-title">
                    <h3>${subassembly.name}</h3>
                    <p>${subassembly.category}</p>
                </div>
            </div>
            <div class="card-body">
                <div class="card-info">
                    <span class="card-info-label">1st Process:</span>
                    <span class="card-info-value">${subassembly.process1}</span>
                </div>
                <div class="card-info">
                    <span class="card-info-label">2nd Process:</span>
                    <span class="card-info-value">${subassembly.process2}</span>
                </div>
                <div class="card-info">
                    <span class="card-info-label">3rd Process:</span>
                    <span class="card-info-value">${subassembly.process3}</span>
                </div>
            </div>
            <div class="upload-section">
                <div class="uploaded-images" id="images-${index}">
                    ${renderUploadedImages(index)}
                </div>
                <div class="image-count ${uploadedImages[index] && uploadedImages[index].length > 0 ? 'has-images' : ''}">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
                    </svg>
                    <span>${uploadedImages[index] ? uploadedImages[index].length : 0} image(s) uploaded</span>
                </div>
                <button class="upload-button" onclick="openUploadModal(${index})">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM14 13v4h-4v-4H7l5-5 5 5h-3z"/>
                    </svg>
                    ${uploadedImages[index] && uploadedImages[index].length > 0 ? 'Add More Images' : 'Upload Images'}
                </button>
            </div>
        </div>
    `).join('');
}

// Render uploaded images for a sub-assembly
function renderUploadedImages(index) {
    if (!uploadedImages[index] || uploadedImages[index].length === 0) {
        return '';
    }
    
    return uploadedImages[index].map((image, imgIndex) => `
        <div class="image-preview">
            <img src="${image.dataUrl}" alt="Image ${imgIndex + 1}">
            <button class="remove-image" onclick="removeImage(${index}, ${imgIndex})" title="Remove image">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                </svg>
            </button>
        </div>
    `).join('');
}

// Open upload modal
function openUploadModal(index) {
    currentSubAssemblyIndex = index;
    const subassembly = subassemblies[index];
    document.getElementById('modalTitle').textContent = `Upload Image for "${subassembly.name}"`;
    document.getElementById('uploadModal').classList.add('active');
}

// Close upload modal
function closeUploadModal() {
    document.getElementById('uploadModal').classList.remove('active');
    currentSubAssemblyIndex = null;
}

// Select upload method
function selectUploadMethod(method) {
    switch(method) {
        case 'gallery':
            document.getElementById('fileInput').click();
            break;
        case 'camera':
            document.getElementById('cameraInput').click();
            break;
        case 'sharepoint':
            handleSharePointUpload();
            break;
        case 'catalogue':
            handleCatalogueUpload();
            break;
    }
}

// Handle file selection from gallery or camera
function handleFileSelect(event) {
    const files = event.target.files;
    if (!files || files.length === 0 || currentSubAssemblyIndex === null) return;
    
    Array.from(files).forEach(file => {
        if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = function(e) {
                addImageToSubAssembly(currentSubAssemblyIndex, {
                    dataUrl: e.target.result,
                    name: file.name,
                    size: file.size,
                    type: file.type,
                    source: 'gallery'
                });
            };
            reader.readAsDataURL(file);
        }
    });
    
    // Reset file input
    event.target.value = '';
    
    // Close modal after short delay
    setTimeout(() => {
        closeUploadModal();
    }, 500);
}

// Handle SharePoint upload
function handleSharePointUpload() {
    // Simulate SharePoint integration
    alert('SharePoint Integration:\n\nThis feature would connect to your SharePoint library to import product images.\n\nFor demonstration purposes, you can use the Gallery option to upload images.');
    
    // In a real implementation, this would:
    // 1. Open SharePoint file picker
    // 2. Allow user to select files
    // 3. Download and process selected files
}

// Handle Catalogue upload
function handleCatalogueUpload() {
    // Simulate Schaeffler Catalogue integration
    alert('Schaeffler Catalogue Integration:\n\nThis feature would connect to the official Schaeffler product catalogue to select images.\n\nFor demonstration purposes, you can use the Gallery option to upload images.');
    
    // In a real implementation, this would:
    // 1. Open catalogue browser
    // 2. Allow searching/filtering products
    // 3. Select and import product images
}

// Add image to sub-assembly
function addImageToSubAssembly(index, imageData) {
    if (!uploadedImages[index]) {
        uploadedImages[index] = [];
    }
    
    uploadedImages[index].push(imageData);
    
    // Save to localStorage
    saveImages();
    
    // Re-render the specific card
    renderSubAssemblies();
    validateForm();
}

// Remove image from sub-assembly
function removeImage(subassemblyIndex, imageIndex) {
    if (!uploadedImages[subassemblyIndex]) return;
    
    if (confirm('Are you sure you want to remove this image?')) {
        uploadedImages[subassemblyIndex].splice(imageIndex, 1);
        
        // Clean up empty arrays
        if (uploadedImages[subassemblyIndex].length === 0) {
            delete uploadedImages[subassemblyIndex];
        }
        
        // Save and re-render
        saveImages();
        renderSubAssemblies();
        validateForm();
    }
}

// Save images to localStorage
function saveImages() {
    try {
        localStorage.setItem('dfm_product_images', JSON.stringify(uploadedImages));
    } catch (e) {
        console.error('Error saving images:', e);
        alert('Warning: Unable to save images. Please try again or reduce image sizes.');
    }
}

// Validate form
function validateForm() {
    const submitBtn = document.getElementById('submitBtn');
    
    // Check if all sub-assemblies have at least one image
    const allHaveImages = subassemblies.every((_, index) => {
        return uploadedImages[index] && uploadedImages[index].length > 0;
    });
    
    if (allHaveImages && subassemblies.length > 0) {
        submitBtn.disabled = false;
    } else {
        submitBtn.disabled = true;
    }
}

// Setup auto-save
function setupAutoSave() {
    // Auto-save every 30 seconds
    setInterval(() => {
        saveImages();
    }, 30000);
}

// Handle form submission
document.getElementById('submitBtn').addEventListener('click', function() {
    if (this.disabled) return;
    
    // Validate one more time
    const allHaveImages = subassemblies.every((_, index) => {
        return uploadedImages[index] && uploadedImages[index].length > 0;
    });
    
    if (!allHaveImages) {
        alert('Please upload at least one image for each sub-assembly before proceeding.');
        return;
    }
    
    // Save final data
    saveImages();
    
    // Show success message
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 90px;
        right: 20px;
        background: linear-gradient(135deg, #08954C 0%, #0ab05e 100%);
        color: white;
        padding: 1rem 2rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(8, 149, 76, 0.3);
        z-index: 3000;
        animation: slideInRight 0.3s ease;
    `;
    notification.innerHTML = `
        <div style="display: flex; align-items: center; gap: 0.5rem;">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
            </svg>
            <span>Product images saved! Proceeding...</span>
        </div>
    `;
    document.body.appendChild(notification);
    
    // Navigate to next page after short delay
    setTimeout(() => {
        window.location.href = 'area-selection.html';
    }, 800);
});

// Close modal when clicking outside
document.getElementById('uploadModal').addEventListener('click', function(e) {
    if (e.target === this) {
        closeUploadModal();
    }
});

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Escape key closes modal
    if (e.key === 'Escape') {
        closeUploadModal();
    }
});
