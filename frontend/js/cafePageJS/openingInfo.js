// Opening Hours Status Checker - Dynamic Version
// Reads opening hours from HTML and displays real-time status

(function() {
    'use strict';

    /**
     * Parse time string (e.g., "08:00", "18:00") to hour number
     * @param {string} timeStr - Time in HH:MM format
     * @returns {number} Hour as number
     */
    function parseTimeToHour(timeStr) {
        const [hour] = timeStr.split(':').map(Number);
        return hour;
    }

    /**
     * Parse opening hours from HTML
     * @returns {Object} Parsed opening hours by day
     */
    function parseOpeningHoursFromHTML() {
        const hoursList = document.querySelector('.hours-list');
        if (!hoursList) {
            console.warn('Hours list not found in HTML');
            return null;
        }

        const hoursItems = hoursList.querySelectorAll('.hours-item:not(.status-item)');
        const schedule = {};

        hoursItems.forEach(item => {
            const daysText = item.querySelector('.hours-days')?.textContent.trim();
            const timeText = item.querySelector('.hours-time')?.textContent.trim();

            if (!daysText || !timeText) return;

            // Parse time range (e.g., "08:00 - 18:00")
            const timeMatch = timeText.match(/(\d{2}:\d{2})\s*-\s*(\d{2}:\d{2})/);
            if (!timeMatch) return;

            const [, openTime, closeTime] = timeMatch;
            const hours = {
                open: parseTimeToHour(openTime),
                close: parseTimeToHour(closeTime),
                openMinutes: parseInt(openTime.split(':')[1]) || 0,
                closeMinutes: parseInt(closeTime.split(':')[1]) || 0
            };

            // Map day names to day numbers
            const daysLower = daysText.toLowerCase();
            
            if (daysLower.includes('mandag') && daysLower.includes('fredag')) {
                // Monday-Friday
                [1, 2, 3, 4, 5].forEach(day => schedule[day] = hours);
            } else if (daysLower.includes('mandag') && daysLower.includes('torsdag')) {
                // Monday-Thursday
                [1, 2, 3, 4].forEach(day => schedule[day] = hours);
            } else if (daysLower.includes('fredag') && daysLower.includes('lørdag')) {
                // Friday-Saturday
                [5, 6].forEach(day => schedule[day] = hours);
            } else if (daysLower.includes('lørdag') && daysLower.includes('søndag')) {
                // Saturday-Sunday
                [6, 0].forEach(day => schedule[day] = hours);
            } else if (daysLower.includes('fredag')) {
                // Friday only
                schedule[5] = hours;
            } else if (daysLower.includes('lørdag')) {
                // Saturday only
                schedule[6] = hours;
            } else if (daysLower.includes('søndag')) {
                // Sunday only
                schedule[0] = hours;
            }
        });

        return schedule;
    }

    /**
     * Calculate time difference and format message
     * @param {Date} now - Current time
     * @param {Date} targetTime - Target time (opening or closing)
     * @param {boolean} isOpening - True if calculating opening time
     * @returns {string} Formatted message
     */
    function formatTimeMessage(now, targetTime, isOpening) {
        const diffMs = targetTime - now;
        const diffMinutes = Math.floor(diffMs / (1000 * 60));
        const diffHours = Math.floor(diffMinutes / 60);
        const remainingMinutes = diffMinutes % 60;

        let timeText = '';
        
        if (diffHours > 0) {
            timeText = `${diffHours} time${diffHours > 1 ? 'r' : ''}`;
            if (remainingMinutes > 0) {
                timeText += ` og ${remainingMinutes} minutt${remainingMinutes > 1 ? 'er' : ''}`;
            }
        } else if (diffMinutes > 0) {
            timeText = `${diffMinutes} minutt${diffMinutes > 1 ? 'er' : ''}`;
        } else {
            timeText = 'mindre enn ett minutt';
        }

        return isOpening 
            ? `Åpner om ${timeText}` 
            : `Stenger om ${timeText}`;
    }

    /**
     * Get next opening time when café is closed
     * @param {Date} now - Current time
     * @param {Object} schedule - Opening hours schedule
     * @returns {Date} Next opening time
     */
    function getNextOpeningTime(now, schedule) {
        const nextDay = new Date(now);
        nextDay.setDate(nextDay.getDate() + 1);
        
        let daysChecked = 0;
        while (daysChecked < 7) {
            const dayOfWeek = nextDay.getDay();
            const hours = schedule[dayOfWeek];
            
            if (hours) {
                nextDay.setHours(hours.open, hours.openMinutes || 0, 0, 0);
                
                if (nextDay > now) {
                    return nextDay;
                }
            }
            
            nextDay.setDate(nextDay.getDate() + 1);
            daysChecked++;
        }
        
        return nextDay;
    }

    /**
     * Check if café is currently open and generate status message
     * @param {Object} schedule - Opening hours schedule
     * @returns {Object} Status object with message and isOpen flag
     */
    function getCafeStatus(schedule) {
        if (!schedule) {
            return { message: 'Åpningstider ikke tilgjengelig', isOpen: false, statusClass: 'status-closed' };
        }

        const now = new Date();
        const dayOfWeek = now.getDay();
        const currentHour = now.getHours();
        const currentMinute = now.getMinutes();
        const currentTimeInMinutes = currentHour * 60 + currentMinute;

        const hours = schedule[dayOfWeek];
        
        // Check if café is open today
        if (!hours) {
            const openingTime = getNextOpeningTime(now, schedule);
            const message = formatTimeMessage(now, openingTime, true);
            return { message, isOpen: false, statusClass: 'status-closed' };
        }

        const openTimeInMinutes = hours.open * 60 + (hours.openMinutes || 0);
        const closeTimeInMinutes = hours.close * 60 + (hours.closeMinutes || 0);

        const isOpen = currentTimeInMinutes >= openTimeInMinutes && 
                      currentTimeInMinutes < closeTimeInMinutes;

        let message = '';
        let statusClass = '';

        if (isOpen) {
            // Café is open - calculate closing time
            const closingTime = new Date(now);
            closingTime.setHours(hours.close, hours.closeMinutes || 0, 0, 0);
            
            message = formatTimeMessage(now, closingTime, false);
            statusClass = 'status-open';
        } else {
            // Café is closed - calculate next opening time
            let openingTime;
            
            if (currentTimeInMinutes < openTimeInMinutes) {
                // Opening today
                openingTime = new Date(now);
                openingTime.setHours(hours.open, hours.openMinutes || 0, 0, 0);
            } else {
                // Opening tomorrow or later
                openingTime = getNextOpeningTime(now, schedule);
            }
            
            message = formatTimeMessage(now, openingTime, true);
            statusClass = 'status-closed';
        }

        return { message, isOpen, statusClass };
    }

    /**
     * Create and inject status element into the DOM
     */
    function createStatusElement() {
        const hoursList = document.querySelector('.hours-list');
        
        if (!hoursList) {
            console.warn('Opening hours list not found');
            return null;
        }

        // Create status item
        const statusItem = document.createElement('li');
        statusItem.className = 'hours-item status-item';
        statusItem.setAttribute('aria-live', 'polite');
        statusItem.setAttribute('aria-atomic', 'true');

        const statusText = document.createElement('span');
        statusText.className = 'status-text';

        const statusIndicator = document.createElement('span');
        statusIndicator.className = 'status-indicator';

        statusItem.appendChild(statusText);
        statusItem.appendChild(statusIndicator);

        // Add to DOM
        hoursList.appendChild(statusItem);

        return statusItem;
    }

    /**
     * Update status display
     * @param {Object} schedule - Opening hours schedule
     */
    function updateStatus(schedule) {
        const statusItem = document.querySelector('.status-item');
        
        if (!statusItem) return;

        const { message, isOpen, statusClass } = getCafeStatus(schedule);
        
        const statusText = statusItem.querySelector('.status-text');
        const statusIndicator = statusItem.querySelector('.status-indicator');

        if (statusText && statusIndicator) {
            statusText.textContent = message;
            
            // Update classes
            statusItem.className = `hours-item status-item ${statusClass}`;
            
            // Update indicator
            statusIndicator.innerHTML = isOpen 
                ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>'
                : '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>';
        }
    }

    /**
     * Initialize the status checker
     */
    function init() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', init);
            return;
        }

        // Parse opening hours from HTML
        const schedule = parseOpeningHoursFromHTML();
        
        if (!schedule) {
            console.warn('Could not parse opening hours from HTML');
            return;
        }

        // Create status element
        const statusElement = createStatusElement();
        
        if (!statusElement) return;

        // Initial update
        updateStatus(schedule);

        // Update every minute
        setInterval(() => updateStatus(schedule), 60000);

        console.log('✓ Opening hours status checker initialized');
    }

    // Start initialization
    init();

})();