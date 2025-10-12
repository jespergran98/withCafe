// Opening Hours Status Checker - Dynamic Version
// Reads opening hours from HTML and displays real-time status

(function() {
    'use strict';

    /**
     * Parse time string (e.g., "08:00", "18:00") to minutes since midnight
     * @param {string} timeStr - Time in HH:MM format
     * @returns {number} Minutes since midnight
     */
    function parseTimeToMinutes(timeStr) {
        const [hour, minute] = timeStr.split(':').map(Number);
        return hour * 60 + minute;
    }

    /**
     * Parse opening hours from HTML
     * @returns {Object} Parsed opening hours by day (0=Sunday, 1=Monday, etc.)
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
                open: parseTimeToMinutes(openTime),
                close: parseTimeToMinutes(closeTime)
            };

            // Map day names to day numbers (0=Sunday, 1=Monday, etc.)
            const daysLower = daysText.toLowerCase();
            
            // Handle all possible day range combinations
            if (daysLower.includes('mandag') && daysLower.includes('fredag')) {
                // Monday-Friday (1-5)
                for (let day = 1; day <= 5; day++) {
                    schedule[day] = hours;
                }
            } else if (daysLower.includes('mandag') && daysLower.includes('torsdag')) {
                // Monday-Thursday (1-4)
                for (let day = 1; day <= 4; day++) {
                    schedule[day] = hours;
                }
            } else if (daysLower.includes('mandag') && daysLower.includes('lørdag')) {
                // Monday-Saturday (1-6)
                for (let day = 1; day <= 6; day++) {
                    schedule[day] = hours;
                }
            } else if (daysLower.includes('fredag') && daysLower.includes('lørdag')) {
                // Friday-Saturday (5-6)
                schedule[5] = hours;
                schedule[6] = hours;
            } else if (daysLower.includes('lørdag') && daysLower.includes('søndag')) {
                // Saturday-Sunday (6, 0)
                schedule[6] = hours;
                schedule[0] = hours;
            } else if (daysLower.includes('mandag')) {
                // Monday only
                schedule[1] = hours;
            } else if (daysLower.includes('tirsdag')) {
                // Tuesday only
                schedule[2] = hours;
            } else if (daysLower.includes('onsdag')) {
                // Wednesday only
                schedule[3] = hours;
            } else if (daysLower.includes('torsdag')) {
                // Thursday only
                schedule[4] = hours;
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
     * Format time difference into human-readable text
     * @param {number} minutes - Minutes until event
     * @returns {string} Formatted time string
     */
    function formatTimeDifference(minutes) {
        if (minutes < 60) {
            return `${minutes} minutt${minutes !== 1 ? 'er' : ''}`;
        }
        
        const hours = Math.round(minutes / 60);
        return `${hours} time${hours !== 1 ? 'r' : ''}`;
    }

    /**
     * Get the next opening time when café is closed
     * @param {Date} now - Current date/time
     * @param {Object} schedule - Opening hours schedule
     * @returns {Date|null} Next opening date/time, or null if not found
     */
    function getNextOpeningTime(now, schedule) {
        const nowMinutes = now.getHours() * 60 + now.getMinutes();
        const currentDay = now.getDay();
        
        // Check if opening later today
        const todayHours = schedule[currentDay];
        if (todayHours && nowMinutes < todayHours.open) {
            const openingTime = new Date(now);
            openingTime.setHours(Math.floor(todayHours.open / 60), todayHours.open % 60, 0, 0);
            return openingTime;
        }
        
        // Check next 7 days
        for (let i = 1; i <= 7; i++) {
            const checkDate = new Date(now);
            checkDate.setDate(checkDate.getDate() + i);
            const checkDay = checkDate.getDay();
            const hours = schedule[checkDay];
            
            if (hours) {
                checkDate.setHours(Math.floor(hours.open / 60), hours.open % 60, 0, 0);
                return checkDate;
            }
        }
        
        return null;
    }

    /**
     * Check if café is currently open and generate status message
     * @param {Object} schedule - Opening hours schedule
     * @returns {Object} Status object with message, isOpen flag, and statusClass
     */
    function getCafeStatus(schedule) {
        if (!schedule || Object.keys(schedule).length === 0) {
            return { 
                message: 'Åpningstider ikke tilgjengelig', 
                isOpen: false, 
                statusClass: 'status-closed' 
            };
        }

        const now = new Date();
        const dayOfWeek = now.getDay();
        const currentMinutes = now.getHours() * 60 + now.getMinutes();
        const hours = schedule[dayOfWeek];
        
        // Check if café has hours today
        if (!hours) {
            // Closed today - find next opening
            const nextOpening = getNextOpeningTime(now, schedule);
            if (nextOpening) {
                const diffMs = nextOpening - now;
                const diffMinutes = Math.floor(diffMs / (1000 * 60));
                const message = `Åpner om ${formatTimeDifference(diffMinutes)}`;
                return { message, isOpen: false, statusClass: 'status-closed' };
            }
            return { 
                message: 'Åpner snart', 
                isOpen: false, 
                statusClass: 'status-closed' 
            };
        }

        // Check if currently open
        const isOpen = currentMinutes >= hours.open && currentMinutes < hours.close;

        if (isOpen) {
            // Calculate minutes until closing
            const minutesUntilClose = hours.close - currentMinutes;
            const message = `Stenger om ${formatTimeDifference(minutesUntilClose)}`;
            return { message, isOpen: true, statusClass: 'status-open' };
        } else if (currentMinutes < hours.open) {
            // Opening later today
            const minutesUntilOpen = hours.open - currentMinutes;
            const message = `Åpner om ${formatTimeDifference(minutesUntilOpen)}`;
            return { message, isOpen: false, statusClass: 'status-closed' };
        } else {
            // Closed for today - find next opening
            const nextOpening = getNextOpeningTime(now, schedule);
            if (nextOpening) {
                const diffMs = nextOpening - now;
                const diffMinutes = Math.floor(diffMs / (1000 * 60));
                const message = `Åpner om ${formatTimeDifference(diffMinutes)}`;
                return { message, isOpen: false, statusClass: 'status-closed' };
            }
            return { 
                message: 'Åpner snart', 
                isOpen: false, 
                statusClass: 'status-closed' 
            };
        }
    }

    /**
     * Create and inject status element into the DOM
     * @returns {HTMLElement|null} Created status element or null
     */
    function createStatusElement() {
        const hoursList = document.querySelector('.hours-list');
        
        if (!hoursList) {
            console.warn('Opening hours list not found');
            return null;
        }

        // Check if status item already exists
        let statusItem = hoursList.querySelector('.status-item');
        if (statusItem) {
            return statusItem;
        }

        // Create status item
        statusItem = document.createElement('li');
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
        
        if (!statusItem) {
            console.warn('Status item not found');
            return;
        }

        const { message, isOpen, statusClass } = getCafeStatus(schedule);
        
        const statusText = statusItem.querySelector('.status-text');
        const statusIndicator = statusItem.querySelector('.status-indicator');

        if (statusText && statusIndicator) {
            statusText.textContent = message;
            
            // Update classes
            statusItem.className = `hours-item status-item ${statusClass}`;
            
            // Update indicator icon
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
        
        if (!schedule || Object.keys(schedule).length === 0) {
            console.warn('Could not parse opening hours from HTML');
            return;
        }

        console.log('Parsed schedule:', schedule);

        // Create status element
        const statusElement = createStatusElement();
        
        if (!statusElement) {
            console.warn('Could not create status element');
            return;
        }

        // Initial update
        updateStatus(schedule);

        // Update every minute
        setInterval(() => updateStatus(schedule), 60000);

        console.log('✓ Opening hours status checker initialized');
    }

    // Start initialization
    init();

})();