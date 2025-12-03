let map = null;
let markers = [];
let radarLayer = null;


const RAINVIEWER_API = 'https://api.rainviewer.com/public/weather-maps.json';
const TILE_SIZE = 256;

export function initMap(elementId, onCitySelect) {
    map = L.map(elementId, {
        zoomControl: false,
        attributionControl: false,
        minZoom: 6,
        maxZoom: 12
    }).setView([52.1326, 5.2913], 8);


    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; OSM &copy; CARTO',
        subdomains: 'abcd',
        maxZoom: 19
    }).addTo(map);

    L.control.zoom({
        position: 'bottomright'
    }).addTo(map);

    return map;
}

export async function updateRadarLayer() {
    if (!map) return;

    try {

        const response = await fetch(RAINVIEWER_API);
        const data = await response.json();
        

        if (data.radar && data.radar.past && data.radar.past.length > 0) {
            const latest = data.radar.past[data.radar.past.length - 1];
            const timestamp = latest.time;
            

            if (radarLayer) {
                map.removeLayer(radarLayer);
            }




            radarLayer = L.tileLayer(`https://tile.rainviewer.com/img/radar/${timestamp}/${TILE_SIZE}/{z}/{x}/{y}/2/1_1.png`, {
                opacity: 0.6,
                zIndex: 100
            }).addTo(map);
        }
    } catch (e) {
        console.warn("Failed to load radar overlay", e);
    }
}

export function updateMapMarkers(cityData, activeCityName, onMarkerClick) {
    markers.forEach(m => map.removeLayer(m));
    markers = [];

    cityData.forEach(city => {
        const isActive = city.name === activeCityName;
        
        const html = `
            <div class="marker-pin ${isActive ? 'active' : ''}"></div>
            <div class="marker-temp" style="color: ${isActive ? '#FF6B00' : '#1A1A1A'}">${Math.round(city.temp)}°</div>
        `;

        const icon = L.divIcon({
            className: 'custom-marker',
            html: html,
            iconSize: [30, 42],
            iconAnchor: [15, 42]
        });

        const marker = L.marker([city.lat, city.lon], { icon: icon })
            .addTo(map)
            .on('click', () => onMarkerClick(city.name));
        
        markers.push(marker);
    });
}

export function flyToCity(lat, lon) {
    if (map) {
        map.flyTo([lat, lon], 9, {
            animate: true,
            duration: 1.2
        });
    }
}

export function resizeMap() {
    if(map) map.invalidateSize();
}
