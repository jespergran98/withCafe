// Initialize map centered on Tønsberg
let map;
let markers = {};

function initMap() {
    // Create map centered on Tønsberg
    map = L.map('map').setView([59.2682, 10.4075], 16);

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
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
            address: 'Storgaten 28, 3126 Tønsberg',
            hours: 'Man-Fre: 08:00-16:00<br>Lør-Søn: 09:00-16:00'
        },
        {
            name: 'WITH bok og kaffe',
            type: 'bok og kaffe',
            lat: 59.2658847584103,
            lng: 10.409450787493633,
            address: 'Nedre Langgate 32, 3126 Tønsberg',
            hours: 'Man-Fre: 08:00-16:00<br>Lør-Søn: 09:00-16:00'
        },
        {
            name: 'WITH brunsj og kaffe',
            type: 'brunsj og kaffe',
            lat: 59.269995481439274,
            lng: 10.407405253049253,
            address: 'Ollebukta 3, 3118 Tønsberg',
            hours: 'Man-Fre: 08:00-16:00<br>Lør-Søn: 09:00-17:00'
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

        const popupContent = `
            <div style="font-family: 'Inter', sans-serif;">
                <div style="font-family: 'Bowlby One SC', cursive; font-size: 1.1rem; color: #2c1810; margin-bottom: 0.25rem;">
                    WITH
                </div>
                <div style="font-family: 'Skranji', cursive; font-size: 0.95rem; color: #d4a373; margin-bottom: 0.75rem;">
                    ${location.type}
                </div>
                <div style="font-size: 0.85rem; color: #5a4a3a; line-height: 1.6;">
                    <strong>Adresse:</strong><br>${location.address}<br><br>
                    <strong>Åpningstider:</strong><br>${location.hours}
                </div>
            </div>
        `;

        marker.bindPopup(popupContent, {
            maxWidth: 250,
            className: 'custom-popup'
        });

        markers[location.name] = marker;
    });
}

// Function to focus on a specific location
function focusLocation(lat, lng, name) {
    map.setView([lat, lng], 16, {
        animate: true,
        duration: 1
    });

    // Open the popup for this location
    if (markers[name]) {
        markers[name].openPopup();
    }
}

// Initialize map when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMap);
} else {
    initMap();
}