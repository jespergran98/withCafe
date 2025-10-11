// Cafe Map Initialization
document.addEventListener('DOMContentLoaded', function() {
    // Check if Leaflet is loaded
    if (typeof L === 'undefined') {
        console.error('Leaflet library not loaded');
        return;
    }

    // WITH brød & kaffe coordinates
    const cafeLocation = {
        lat: 59.26694458677926,
        lng: 10.40858159245786
    };

    // Initialize map
    const map = L.map('cafe-map', {
        center: [cafeLocation.lat, cafeLocation.lng],
        zoom: 16,
        zoomControl: true,
        scrollWheelZoom: false,
        dragging: true,
        tap: true,
        minZoom: 12,
        maxZoom: 18
    });

    // Add tile layer (light theme to match cafe aesthetic)
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
        subdomains: 'abcd'
    }).addTo(map);

    // Create custom SVG marker icon - Coffee cup pin design
    const customIcon = L.divIcon({
        className: 'custom-marker-wrapper',
        html: `
            <svg class="custom-marker-icon" width="96" height="128" viewBox="0 0 48 64" fill="none" xmlns="http://www.w3.org/2000/svg">

                
                <!-- Pin body -->
                <path d="M24 2C15.716 2 9 8.716 9 17C9 28.25 24 48 24 48C24 48 39 28.25 39 17C39 8.716 32.284 2 24 2Z" 
                      fill="#1C1410" stroke="#D9A856" stroke-width="1.5"/>
                
                <!-- Inner circle background -->
                <circle cx="24" cy="17" r="10" fill="#FBF8F2"/>
                
                <!-- Coffee cup design -->
                <g transform="translate(24, 17)">
                    <!-- Cup body -->
                    <path d="M-4 -3 L-4 3 C-4 4.5 -2.5 5 0 5 C2.5 5 4 4.5 4 3 L4 -3 Z" 
                          fill="#1C1410" stroke="#D9A856" stroke-width="0.8"/>
                    
                    <!-- Coffee surface -->
                    <ellipse cx="0" cy="-3" rx="4" ry="1.2" fill="#D9A856"/>
                    
                    <!-- Steam lines -->
                    <path d="M-2 -5 Q-2 -6.5 -1.5 -7" stroke="#D9A856" stroke-width="0.6" 
                          stroke-linecap="round" fill="none" opacity="0.7"/>
                    <path d="M0 -5.5 Q0 -7 0.5 -7.5" stroke="#D9A856" stroke-width="0.6" 
                          stroke-linecap="round" fill="none" opacity="0.7"/>
                    <path d="M2 -5 Q2 -6.5 1.5 -7" stroke="#D9A856" stroke-width="0.6" 
                          stroke-linecap="round" fill="none" opacity="0.7"/>
                    
                    <!-- Cup handle -->
                    <path d="M4 -1 Q6.5 -1 6.5 1 Q6.5 3 4 3" stroke="#1C1410" 
                          stroke-width="0.8" fill="none" stroke-linecap="round"/>
                </g>
                
                <!-- Decorative accent circle -->
                <circle cx="24" cy="17" r="11.5" fill="none" stroke="#D9A856" 
                        stroke-width="0.5" opacity="0.5"/>
            </svg>
        `,
        iconSize: [48, 128],
        iconAnchor: [48, 96],
        popupAnchor: [0, -96]
    });

    // Add marker to map
    const marker = L.marker([cafeLocation.lat, cafeLocation.lng], {
        icon: customIcon,
        title: 'WITH brød & kaffe',
        riseOnHover: true
    }).addTo(map);

    // Create popup content
    const popupContent = `
        <div class="marker-popup">
            <h3 class="marker-popup-title">WITH brød & kaffe</h3>
            <p class="marker-popup-address">
                Storgata 29<br>
                3126 Tønsberg
            </p>
            <a href="https://maps.app.goo.gl/5giPNg4azWkEryim8" 
               target="_blank" 
               rel="noopener noreferrer"
               class="marker-popup-link">
                åpne i google maps →
            </a>
        </div>
    `;

    // Bind popup to marker
    marker.bindPopup(popupContent, {
        maxWidth: 300,
        closeButton: true,
        className: 'custom-popup',
        offset: [0, -5]
    });

    // Enable scroll wheel zoom when user clicks on map
    map.on('click', function() {
        map.scrollWheelZoom.enable();
    });

    // Disable scroll wheel zoom when mouse leaves map
    map.on('mouseout', function() {
        map.scrollWheelZoom.disable();
    });

    // Add subtle bounce animation to marker on hover
    let markerElement;
    setTimeout(() => {
        markerElement = document.querySelector('.custom-marker-wrapper');
        if (markerElement) {
            markerElement.style.transition = 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)';
        }
    }, 100);

    // Handle window resize
    let resizeTimer;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function() {
            map.invalidateSize();
        }, 250);
    });

    // Smooth entrance animation - open popup briefly on load
    setTimeout(function() {
        marker.openPopup();
    }, 1000);

    // Auto-close popup after 5 seconds
    setTimeout(function() {
        marker.closePopup();
    }, 6000);

    // Add pulsing animation to marker periodically
    setInterval(function() {
        if (markerElement && !map.isPopupOpen()) {
            markerElement.style.transform = 'translateY(-8px)';
            setTimeout(() => {
                markerElement.style.transform = 'translateY(0)';
            }, 300);
        }
    }, 8000);
});