// Initialize map centered on Tønsberg
let map;

function initMap() {
    // Create map centered on Tønsberg
    map = L.map('map').setView([59.2682, 10.4075], 15);

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19
    }).addTo(map);

    // Define locations
    const locations = [
        {
            name: 'WITH brød og kaffe',
            type: 'brød og kaffe',
            lat: 59.26694458677926,
            lng: 10.40858159245786,
        },
        {
            name: 'WITH bok og kaffe',
            type: 'bok og kaffe',
            lat: 59.2658847584103,
            lng: 10.409450787493633,
        },
        {
            name: 'WITH brunsj og kaffe',
            type: 'brunsj og kaffe',
            lat: 59.269995481439274,
            lng: 10.407405253049253,
        }
    ];

    // Add markers for each location
    locations.forEach(location => {
        // Create custom marker with styled content
        const customIcon = L.divIcon({
            className: 'custom-marker-container',
            html: `
                <div class="marker-pin">
                    <div class="marker-content">
                        <div class="marker-with">WITH</div>
                        <div class="marker-type">${location.type}</div>
                    </div>
                    <div class="marker-point"></div>
                </div>
            `,
            iconSize: [140, 80],
            iconAnchor: [70, 80],
            popupAnchor: [0, -80]
        });

        const marker = L.marker([location.lat, location.lng], { icon: customIcon })
            .addTo(map);
    });
}

// Initialize map when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMap);
} else {
    initMap();
}