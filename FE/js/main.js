// Main JavaScript file for SMART THITTAM

// Global variables
// Removed duplicate currentPage declaration (handled in schemes.js)
// Removed duplicate totalPages declaration (handled in schemes.js)
// Removed duplicate currentFilters declaration (handled in schemes.js)

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

// Initialize the application
function initializeApp() {
    setupMobileMenu();
    setupEventListeners();
    
    // Load schemes if on schemes page
    if (window.location.pathname.includes('schemes.html')) {
        loadSchemes();
    }
}

// Setup mobile menu functionality
function setupMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', function() {
            mobileMenu.classList.toggle('hidden');
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!mobileMenuBtn.contains(event.target) && !mobileMenu.contains(event.target)) {
                mobileMenu.classList.add('hidden');
            }
        });
    }
}

// Setup event listeners
function setupEventListeners() {
    // Search input event listener
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                applyFilters();
            }
        });
    }
    
    
}

// FAQ Toggle functionality
function toggleFAQ(button) {
    const content = button.nextElementSibling;
    const icon = button.querySelector('.material-icons');
    
    if (content.classList.contains('hidden')) {
        content.classList.remove('hidden');
        icon.textContent = 'expand_less';
    } else {
        content.classList.add('hidden');
        icon.textContent = 'expand_more';
    }
}

// Filter by category (for homepage)
function filterByCategory(category) {
    // Store the category filter and redirect to schemes page
    localStorage.setItem('selectedCategory', category);
    window.location.href = 'schemes.html';
}

// Show toast notification
function showToast(message, type = 'success') {
    const toastContainer = document.getElementById('toast-container');
    if (!toastContainer) return;
    
    const toast = document.createElement('div');
    toast.className = `bg-${type === 'success' ? 'green' : 'red'}-500 text-white px-6 py-3 rounded-lg shadow-lg mb-2 transform transition-all duration-300 translate-x-0`;
    toast.textContent = message;
    
    toastContainer.appendChild(toast);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        toast.classList.add('translate-x-full', 'opacity-0');
        setTimeout(() => {
            toastContainer.removeChild(toast);
        }, 300);
    }, 3000);
}

// Smooth scroll to section
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
    }
}

// Handle navigation links
function handleNavigation(link) {
    // Add active state to navigation
    const navLinks = document.querySelectorAll('nav a');
    navLinks.forEach(navLink => {
        navLink.classList.remove('text-green-200');
    });
    link.classList.add('text-green-200');
}

// Utility function to format text
function formatText(text, maxLength = 150) {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
}

// Utility function to format date
function formatDate(dateString) {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN');
}

// Utility function to get category color
function getCategoryColor(category) {
    const colors = {
        'Education': 'blue',
        'Agriculture': 'green',
        'Healthcare': 'red',
        'Women Empowerment': 'pink',
        'Transport': 'purple',
        'Farmer Support': 'orange',
        'Student Support': 'indigo'
    };
    return colors[category] || 'gray';
}

// Export functions for use in other files
window.SMART_THITTAM = {
    showToast,
    scrollToSection,
    handleNavigation,
    formatText,
    formatDate,
    getCategoryColor,
    toggleFAQ,
    filterByCategory
}; 