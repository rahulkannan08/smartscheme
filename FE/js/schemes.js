// Schemes page functionality

// Global variables for schemes page
let schemesData = [];
let currentPage = 1;
let totalPages = 1;
let totalSchemes = 0;
let currentFilters = {};

// Load schemes on page load
async function loadSchemes() {
    showLoading();
    hideError();
    hideNoResults();
    
    try {
        // Check for category filter from homepage
        const selectedCategory = localStorage.getItem('selectedCategory');
        if (selectedCategory) {
            document.getElementById('category-filter').value = selectedCategory;
            currentFilters.category = selectedCategory;
            localStorage.removeItem('selectedCategory');
        }
        
        // Apply current filters
        await applyFilters();
    } catch (error) {
        showError();
        console.error('Error loading schemes:', error);
    }
}

// Show loading state
function showLoading() {
    document.getElementById('loading').classList.remove('hidden');
    document.getElementById('schemes-container').classList.add('hidden');
    document.getElementById('pagination').classList.add('hidden');
}

// Hide loading state
function hideLoading() {
    document.getElementById('loading').classList.add('hidden');
    document.getElementById('schemes-container').classList.remove('hidden');
}

// Show error state
function showError() {
    document.getElementById('error').classList.remove('hidden');
    document.getElementById('loading').classList.add('hidden');
    document.getElementById('schemes-container').classList.add('hidden');
    document.getElementById('pagination').classList.add('hidden');
}

// Hide error state
function hideError() {
    document.getElementById('error').classList.add('hidden');
}

// Show no results state
function showNoResults() {
    document.getElementById('no-results').classList.remove('hidden');
    document.getElementById('schemes-container').classList.add('hidden');
    document.getElementById('pagination').classList.add('hidden');
}

// Hide no results state
function hideNoResults() {
    document.getElementById('no-results').classList.add('hidden');
}

// Apply filters
async function applyFilters() {
    showLoading();
    hideError();
    hideNoResults();
    
    try {
        // Get filter values
        const searchValue = document.getElementById('search-input').value.trim();
        const categoryValue = document.getElementById('category-filter').value;
        const districtValue = document.getElementById('district-filter').value;
        const levelValue = document.getElementById('level-filter').value;

        // Build filters object (match backend keys)
        currentFilters = {};
        if (searchValue) currentFilters.search = searchValue;
        if (categoryValue) currentFilters.category = categoryValue;
        if (districtValue) currentFilters.district = districtValue;
        if (levelValue) currentFilters.level = levelValue;

        // If no filters, fetch all schemes
        const isNoFilter = !searchValue && !categoryValue && !districtValue && !levelValue;
        let response;
        if (isNoFilter) {
            response = await window.API.schemes.getFilteredSchemes({}, currentPage, 9);
        } else {
            response = await window.API.schemes.getFilteredSchemes(currentFilters, currentPage, 9);
        }

        // Update global variables (match backend response)
        schemesData = (response.data && response.data.schemes) ? response.data.schemes : [];
        totalPages = (response.data && response.data.pagination && response.data.pagination.totalPages) ? response.data.pagination.totalPages : 1;
        totalSchemes = (response.data && response.data.pagination && response.data.pagination.totalSchemes) ? response.data.pagination.totalSchemes : 0;

        // Render schemes
        renderSchemes();
        renderPagination();

        hideLoading();

        // Show no results if no schemes found
        if (schemesData.length === 0) {
            showNoResults();
        }

    } catch (error) {
        showError();
        console.error('Error applying filters:', error);
    }
}

// Clear all filters
function clearFilters() {
    document.getElementById('search-input').value = '';
    document.getElementById('category-filter').value = '';
    document.getElementById('district-filter').value = '';
    document.getElementById('level-filter').value = '';
    
    currentFilters = {};
    currentPage = 1;
    
    loadSchemes();
}

// Render schemes
function renderSchemes() {
    const container = document.getElementById('schemes-container');
    
    if (schemesData.length === 0) {
        container.innerHTML = '';
        return;
    }
    
    const schemesHTML = schemesData.map(scheme => createSchemeCard(scheme)).join('');
    container.innerHTML = schemesHTML;
}

// Create scheme card HTML
function createSchemeCard(scheme) {
    const category = scheme.category ? scheme.category : 'General';
    const categoryColor = window.SMART_THITTAM.getCategoryColor(category);
    const description = window.SMART_THITTAM.formatText(scheme.description, 120);
    
    return `
        <div class="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer" onclick="viewSchemeDetails('${scheme._id}')">
            <div class="p-6">
                <div class="flex justify-between items-start mb-4">
                    <div class="flex-1">
                        <h3 class="text-xl font-semibold text-gray-800 mb-2">${scheme.title}</h3>
                        <p class="text-gray-600 text-sm mb-3">${description}</p>
                    </div>
                </div>
                
                <div class="flex flex-wrap gap-2 mb-4">
                    <span class="bg-${categoryColor}-100 text-${categoryColor}-800 px-2 py-1 rounded-full text-xs font-medium">
                        ${category}
                    </span>
                    <span class="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs font-medium">
                        ${scheme.district || 'N/A'}
                    </span>
                </div>
                
                <div class="flex justify-between items-center">
                    <span class="text-sm text-gray-500">
                        <span class="material-icons text-sm mr-1">location_on</span>
                        Tamil Nadu
                    </span>
                    <a href="scheme-details.html?id=${scheme._id}" class="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm">
                        View Details
                    </a>
                </div>
            </div>
        </div>
    `;
}

// Render pagination
function renderPagination() {
    const pagination = document.getElementById('pagination');
    const pageInfo = document.getElementById('page-info');
    const prevBtn = document.getElementById('prev-page');
    const nextBtn = document.getElementById('next-page');
    
    if (totalPages <= 1) {
        pagination.classList.add('hidden');
        return;
    }
    
    pagination.classList.remove('hidden');
    pageInfo.textContent = `Page ${currentPage} of ${totalPages} (${totalSchemes} schemes)`;
    
    // Update button states
    prevBtn.disabled = currentPage <= 1;
    nextBtn.disabled = currentPage >= totalPages;
    
    if (prevBtn.disabled) {
        prevBtn.classList.add('opacity-50', 'cursor-not-allowed');
    } else {
        prevBtn.classList.remove('opacity-50', 'cursor-not-allowed');
    }
    
    if (nextBtn.disabled) {
        nextBtn.classList.add('opacity-50', 'cursor-not-allowed');
    } else {
        nextBtn.classList.remove('opacity-50', 'cursor-not-allowed');
    }
}

// Change page
async function changePage(direction) {
    const newPage = currentPage + direction;
    
    if (newPage < 1 || newPage > totalPages) {
        return;
    }
    
    currentPage = newPage;
    await applyFilters();
    
    // Scroll to top of schemes section
    document.querySelector('#schemes-container').scrollIntoView({ behavior: 'smooth' });
}

// View scheme details
function viewSchemeDetails(schemeId) {
    const user = localStorage.getItem('user');
    if (!user) {
        alert('Please login or register to view scheme details.');
        window.location.href = 'login.html';
        return;
    }
    window.location.href = `scheme-details.html?id=${schemeId}`;
}

// Search schemes (debounced)
let searchTimeout;
function searchSchemes() {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
        currentPage = 1; // Reset to first page
        applyFilters();
    }, 500);
}

// Add event listeners for search
document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.addEventListener('input', searchSchemes);
    }
    // Load all schemes by default on page load
    window.schemesFunctions.loadSchemes();
});

// Export functions for global access
window.schemesFunctions = {
    loadSchemes,
    applyFilters,
    clearFilters,
    changePage,
    viewSchemeDetails,
    searchSchemes
};