// Opening Hours Status Checker for WITH brød & kaffe
// Displays real-time status: "Åpner om..." or "Stenger om..."

(function() {
    'use strict';

    // Opening hours configuration
    const OPENING_HOURS = {
        weekday: { open: 8, close: 18 }, // Monday-Friday: 08:00 - 18:00
        weekend: { open: 9, close: 18 }  // Saturday-Sunday: 09:00 - 18:00
    };

    /**
     * Get current opening hours based on day of week
     * @param {number} dayOfWeek - 0 (Sunday) to 6 (Saturday)
     * @returns {Object} Opening hours for the day
     */
    function getHoursForDay(dayOfWeek) {
        // Sunday = 0, Saturday = 6
        return (dayOfWeek === 0 || dayOfWeek === 6) 
            ? OPENING_HOURS.weekend 
            : OPENING_HOURS.weekday;
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
     * @returns {Date} Next opening time
     */
    function getNextOpeningTime(now) {
        const nextDay = new Date(now);
        nextDay.setDate(nextDay.getDate() + 1);
        
        let daysChecked = 0;
        while (daysChecked < 7) {
            const dayOfWeek = nextDay.getDay();
            const hours = getHoursForDay(dayOfWeek);
            
            nextDay.setHours(hours.open, 0, 0, 0);
            
            if (nextDay > now) {
                return nextDay;
            }
            
            nextDay.setDate(nextDay.getDate() + 1);
            daysChecked++;
        }
        
        return nextDay;
    }

    /**
     * Check if café is currently open and generate status message
     * @returns {Object} Status object with message and isOpen flag
     */
    function getCafeStatus() {
        const now = new Date();
        const dayOfWeek = now.getDay();
        const currentHour = now.getHours();
        const currentMinute = now.getMinutes();
        const currentTimeInMinutes = currentHour * 60 + currentMinute;

        const hours = getHoursForDay(dayOfWeek);
        const openTimeInMinutes = hours.open * 60;
        const closeTimeInMinutes = hours.close * 60;

        const isOpen = currentTimeInMinutes >= openTimeInMinutes && 
                      currentTimeInMinutes < closeTimeInMinutes;

        let message = '';
        let statusClass = '';

        if (isOpen) {
            // Café is open - calculate closing time
            const closingTime = new Date(now);
            closingTime.setHours(hours.close, 0, 0, 0);
            
            message = formatTimeMessage(now, closingTime, false);
            statusClass = 'status-open';
        } else {
            // Café is closed - calculate next opening time
            let openingTime;
            
            if (currentTimeInMinutes < openTimeInMinutes) {
                // Opening today
                openingTime = new Date(now);
                openingTime.setHours(hours.open, 0, 0, 0);
            } else {
                // Opening tomorrow or later
                openingTime = getNextOpeningTime(now);
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
     */
    function updateStatus() {
        const statusItem = document.querySelector('.status-item');
        
        if (!statusItem) return;

        const { message, isOpen, statusClass } = getCafeStatus();
        
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
     * Add dynamic styles for status element
     */
    function injectStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .status-item {
                margin-top: 1rem !important;
                padding: 1.25rem 1rem !important;
                background: rgba(255, 255, 255, 0.05) !important;
                border: 1px solid rgba(255, 255, 255, 0.08) !important;
                position: relative;
                overflow: hidden;
            }

            .status-item::before {
                content: '';
                position: absolute;
                left: 0;
                top: 0;
                bottom: 0;
                width: 4px;
                transition: transform 0.3s ease;
            }

            .status-item.status-open::before {
                background: linear-gradient(180deg, #4ade80 0%, #22c55e 100%);
                transform: scaleY(1);
            }

            .status-item.status-closed::before {
                background: linear-gradient(180deg, #fb923c 0%, #f97316 100%);
                transform: scaleY(1);
            }

            .status-text {
                font-size: 1.0625rem;
                font-weight: 600;
                color: var(--cream);
                letter-spacing: 0.3px;
                text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
                flex: 1;
            }

            .status-item.status-open .status-text {
                color: #4ade80;
            }

            .status-item.status-closed .status-text {
                color: #fb923c;
            }

            .status-indicator {
                display: flex;
                align-items: center;
                justify-content: center;
                width: 28px;
                height: 28px;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.1);
                transition: all 0.3s ease;
            }

            .status-indicator svg {
                width: 16px;
                height: 16px;
            }

            .status-item.status-open .status-indicator {
                background: rgba(74, 222, 128, 0.15);
                color: #4ade80;
                box-shadow: 0 0 12px rgba(74, 222, 128, 0.3);
            }

            .status-item.status-closed .status-indicator {
                background: rgba(251, 146, 60, 0.15);
                color: #fb923c;
                box-shadow: 0 0 12px rgba(251, 146, 60, 0.3);
            }

            .status-item:hover .status-indicator {
                transform: scale(1.1);
            }

            @media (max-width: 480px) {
                .status-item {
                    padding: 1rem 0.875rem !important;
                }

                .status-text {
                    font-size: 0.9375rem;
                }

                .status-indicator {
                    width: 24px;
                    height: 24px;
                }

                .status-indicator svg {
                    width: 14px;
                    height: 14px;
                }
            }

            @media (prefers-reduced-motion: reduce) {
                .status-item,
                .status-indicator {
                    transition: none;
                }

                .status-item:hover .status-indicator {
                    transform: none;
                }
            }
        `;
        document.head.appendChild(style);
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

        // Inject styles
        injectStyles();

        // Create status element
        const statusElement = createStatusElement();
        
        if (!statusElement) return;

        // Initial update
        updateStatus();

        // Update every minute
        setInterval(updateStatus, 60000);

        console.log('✓ Opening hours status checker initialized');
    }

    // Start initialization
    init();

})();