// Application state
let currentUrl = '';
let isLoading = false;

// DOM elements
const urlInput = document.getElementById('device-url');
const pairForm = document.getElementById('pair-form');
const pairButton = document.getElementById('pair-button');
const videoThumbnail = document.getElementById('video-thumbnail');
const videoModal = document.getElementById('video-modal');
const modalOverlay = document.getElementById('modal-overlay');
const modalClose = document.getElementById('modal-close');
const demoVideo = document.getElementById('demo-video');
const loadingSpinner = document.getElementById('loading-spinner');
const toast = document.getElementById('toast');
const toastMessage = document.getElementById('toast-message');
const toastClose = document.getElementById('toast-close');

// Initialize application
document.addEventListener('DOMContentLoaded', function() {
    // Ensure loading spinner is hidden on page load
    if (loadingSpinner) {
        loadingSpinner.classList.add('hidden');
    }
    
    // Ensure modal is hidden on page load
    if (videoModal) {
        videoModal.classList.add('hidden');
    }
    
    // Ensure toast is hidden on page load
    if (toast) {
        toast.classList.add('hidden');
    }
    
    // Initialize the rest of the application
    initializeEventListeners();
    animateElements();
    updatePairButtonState();
    
    console.log('NIRBHAYA IOT Safety System initialized successfully');
});

// Event Listeners
function initializeEventListeners() {
    // URL input change handler
    if (urlInput) {
        urlInput.addEventListener('input', function(e) {
            handleUrlChange(e);
            debouncedValidation(e.target.value.trim());
        });
    }

    if (pairForm) {
        pairForm.addEventListener('submit', function(event) {
            event.preventDefault();
            handlePairDevice();
        });
    }

    if (pairButton) {
        
        // Add visual feedback for button interactions
        pairButton.addEventListener('mousedown', function() {
            if (!this.disabled) {
                this.style.transform = 'translateY(1px)';
            }
        });

        pairButton.addEventListener('mouseup', function() {
            this.style.transform = '';
        });

        pairButton.addEventListener('mouseleave', function() {
            this.style.transform = '';
        });
    }
    
    // Video thumbnail click handler
    if (videoThumbnail) {
        videoThumbnail.addEventListener('click', openVideoModal);
    }
    
    // Modal close handlers
    if (modalClose) {
        modalClose.addEventListener('click', closeVideoModal);
    }
    if (modalOverlay) {
        modalOverlay.addEventListener('click', closeVideoModal);
    }
    
    // Toast close handler
    if (toastClose) {
        toastClose.addEventListener('click', closeToast);
    }
    
    // Keyboard handlers
    document.addEventListener('keydown', handleKeydown);
}

// URL Input Handler
function handleUrlChange(event) {
    currentUrl = event.target.value.trim();
    updatePairButtonState();
}

// Update pair button state based on URL validity
function updatePairButtonState() {
    if (!pairButton) return;
    
    const isValidUrl = isValidURL(currentUrl);
    pairButton.disabled = !isValidUrl || isLoading;
    
    if (isValidUrl && !isLoading) {
        pairButton.classList.remove('disabled');
    } else {
        pairButton.classList.add('disabled');
    }
}

// URL validation
function isValidURL(string) {
    return Boolean(window.WiseUrl && window.WiseUrl.validateDeviceUrl(string).valid);
}

// Device Pairing Handler
async function handlePairDevice() {
    if (!currentUrl || isLoading) return;
    
    const validation = window.WiseUrl.validateDeviceUrl(currentUrl);
    if (!validation.valid) {
        showToast(validation.reason, 'error');
        return;
    }

    const finalUrl = validation.url;
    
    try {
        setLoadingState(true);
        
        // Add timeout to prevent hanging requests
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 8000); // 8 second timeout
        
        await fetch(finalUrl, {
            method: 'GET',
            signal: controller.signal,
            mode: 'no-cors'
        });
        
        clearTimeout(timeoutId);
        
        // An opaque no-cors response confirms dispatch, not device-side processing.
        console.log('Device pairing request sent to:', finalUrl);
        showToast('Pairing request sent. Confirm the result on your device.', 'success');
        
    } catch (error) {
        console.error('Device pairing error:', error);
        
        let errorMessage = 'Error occurred while pairing device';
        
        if (error.name === 'AbortError') {
            errorMessage = 'Request timed out. Please check your device connection.';
        } else if (error.message.includes('fetch') || error.name === 'TypeError') {
            errorMessage = 'Could not reach the device. Check the URL and local network.';
        }
        
        showToast(errorMessage, 'error');
    } finally {
        setLoadingState(false);
    }
}

// Loading state management
function setLoadingState(loading) {
    isLoading = loading;
    
    if (!loadingSpinner || !pairButton) return;
    
    if (loading) {
        loadingSpinner.classList.remove('hidden');
        pairButton.disabled = true;
        pairButton.innerHTML = `
            <span class="button-text">Pairing...</span>
            <div style="width: 16px; height: 16px; border: 2px solid rgba(255,255,255,0.3); border-top: 2px solid #fff; border-radius: 50%; animation: spin 1s linear infinite; margin-left: 8px;"></div>
        `;
    } else {
        loadingSpinner.classList.add('hidden');
        pairButton.innerHTML = `
            <span class="button-text">Pair Device</span>
            <span class="arrow">→</span>
        `;
        updatePairButtonState();
    }
}

// Video Modal Functions
function openVideoModal() {
    if (!videoModal) return;
    
    videoModal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    
    // Auto-play video when modal opens
    setTimeout(() => {
        if (demoVideo) {
            demoVideo.currentTime = 0;
            demoVideo.play().catch(error => {
                console.log('Video autoplay prevented by browser:', error);
            });
        }
    }, 300);
    
    // Add modal open animation
    videoModal.style.opacity = '0';
    videoModal.style.transform = 'scale(0.95)';
    
    requestAnimationFrame(() => {
        videoModal.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        videoModal.style.opacity = '1';
        videoModal.style.transform = 'scale(1)';
    });
}

function closeVideoModal() {
    if (!videoModal) return;
    
    // Add modal close animation
    videoModal.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    videoModal.style.opacity = '0';
    videoModal.style.transform = 'scale(0.95)';
    
    setTimeout(() => {
        videoModal.classList.add('hidden');
        document.body.style.overflow = '';
        
        // Pause video when modal closes
        if (demoVideo) {
            demoVideo.pause();
        }
        
        // Reset styles
        videoModal.style.transition = '';
        videoModal.style.opacity = '';
        videoModal.style.transform = '';
    }, 300);
}

// Toast Notification Functions
function showToast(message, type = 'info') {
    if (!toast || !toastMessage) return;
    
    toastMessage.textContent = message;
    
    // Remove existing type classes
    toast.classList.remove('success', 'error', 'info');
    
    // Add new type class
    if (type) {
        toast.classList.add(type);
    }
    
    toast.classList.remove('hidden');
    
    // Auto-hide toast after 5 seconds
    setTimeout(() => {
        if (toast && !toast.classList.contains('hidden')) {
            closeToast();
        }
    }, 5000);
}

function closeToast() {
    if (!toast) return;
    
    toast.style.transition = 'transform 0.3s ease, opacity 0.3s ease';
    toast.style.transform = 'translateX(100%)';
    toast.style.opacity = '0';
    
    setTimeout(() => {
        toast.classList.add('hidden');
        toast.style.transition = '';
        toast.style.transform = '';
        toast.style.opacity = '';
    }, 300);
}

// Keyboard Event Handler
function handleKeydown(event) {
    // Close modal with Escape key
    if (event.key === 'Escape') {
        if (videoModal && !videoModal.classList.contains('hidden')) {
            closeVideoModal();
        }
        if (toast && !toast.classList.contains('hidden')) {
            closeToast();
        }
    }
    
    // Open video modal with Space or Enter key when thumbnail is focused
    if ((event.key === ' ' || event.key === 'Enter') && 
        document.activeElement === videoThumbnail) {
        event.preventDefault();
        openVideoModal();
    }
}

// Animation Functions
function animateElements() {
    if (!videoThumbnail) return;
    
    // Add accessibility attributes
    videoThumbnail.setAttribute('tabindex', '0');
    videoThumbnail.setAttribute('role', 'button');
    videoThumbnail.setAttribute('aria-label', 'Open demo video');
    
    // Add focus styles for keyboard navigation
    videoThumbnail.addEventListener('focus', function() {
        this.style.outline = '2px solid #3b82f6';
        this.style.outlineOffset = '2px';
    });
    
    videoThumbnail.addEventListener('blur', function() {
        this.style.outline = '';
        this.style.outlineOffset = '';
    });
}

// Utility Functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Add input validation with debounced feedback
const debouncedValidation = debounce((value) => {
    if (!urlInput) return;
    
    if (value && !isValidURL(value)) {
        urlInput.style.borderColor = '#ef4444';
        urlInput.style.boxShadow = '0 0 0 3px rgba(239, 68, 68, 0.2)';
    } else {
        urlInput.style.borderColor = '';
        urlInput.style.boxShadow = '';
    }
}, 500);

// Video error handling
if (demoVideo) {
    demoVideo.addEventListener('error', function() {
        console.error('Video failed to load');
        showToast('Video could not be loaded', 'error');
    });
    
    demoVideo.addEventListener('loadstart', function() {
        console.log('Video loading started');
    });
    
    demoVideo.addEventListener('canplaythrough', function() {
        console.log('Video ready to play');
    });
}

// Network status monitoring
window.addEventListener('online', function() {
    showToast('Connection restored', 'success');
});

window.addEventListener('offline', function() {
    showToast('Connection lost - device pairing unavailable', 'error');
});
