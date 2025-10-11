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
        tap: true
    });

    // Add tile layer (light theme to match cafe aesthetic)
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
        subdomains: 'abcd'
    }).addTo(map);

    // Create custom marker icon
    const customIcon = L.divIcon({
        className: 'custom-marker',
        iconSize: [40, 40],
        iconAnchor: [20, 40],
        popupAnchor: [0, -40]
    });

    // Add marker to map
    const marker = L.marker([cafeLocation.lat, cafeLocation.lng], {
        icon: customIcon,
        title: 'WITH brød & kaffe'
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
                åpne i google maps
            </a>
        </div>
    `;

    // Bind popup to marker
    marker.bindPopup(popupContent, {
        maxWidth: 300,
        closeButton: true,
        className: 'custom-popup'
    });

    // Enable scroll wheel zoom when user clicks on map
    map.on('click', function() {
        map.scrollWheelZoom.enable();
    });

    // Disable scroll wheel zoom when mouse leaves map
    map.on('mouseout', function() {
        map.scrollWheelZoom.disable();
    });

    // Handle window resize
    window.addEventListener('resize', function() {
        map.invalidateSize();
    });

    // Add subtle animation to marker on load
    setTimeout(function() {
        marker.openPopup();
    }, 800);

    // Auto-close popup after 4 seconds
    setTimeout(function() {
        marker.closePopup();
    }, 4800);
});