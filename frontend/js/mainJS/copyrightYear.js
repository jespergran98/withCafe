/**
 * Automatically updates the copyright year in the footer
 * This script runs when the page loads and sets the year to the current year
 */

(function() {
    // Get the current year from the user's system
    const currentYear = new Date().getFullYear();
    
    // Find the copyright year element
    const copyrightYearElement = document.getElementById('copyright-year');
    
    // Update the content if the element exists
    if (copyrightYearElement) {
        copyrightYearElement.textContent = currentYear;
    }
})();