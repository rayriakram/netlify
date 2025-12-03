import { CITIES, fetchWeatherData, fetchMultiCityTemps } from './weather_service.js';
import { initMap, updateMapMarkers, flyToCity, resizeMap, updateRadarLayer } from './map_component.js';
import { generateNarrative, getWeatherDescription } from './narrative_engine.js';
import { formatDate, formatTime, getWindDirection, getWeatherIconName } from './utils.js';

let state = {
    currentCity: CITIES.find(c => c.name === 'Amsterdam'),
    weatherData: null
};

const els = {
    citySelect: document.getElementById('city-selector'),
    timeDisplay: document.getElementById('current-time'),
    temp: document.getElementById('current-temp'),
    condition: document.getElementById('current-condition'),
    narrative: document.getElementById('narrative-text'),
    windSpeed: document.getElementById('wind-speed'),
    windDir: document.getElementById('wind-dir'),
    rainChance: document.getElementById('rain-chance'),
    feelsLike: document.getElementById('feels-like'),
    iconContainer: document.getElementById('weather-icon-container'),
    forecastContainer: document.getElementById('forecast-container'),
    toggleMapBtn: document.getElementById('toggle-map-btn'),
    closeMapBtn: document.getElementById('close-map-btn'),
    mapSection: document.getElementById('map-section')
};

async function init() {
    populateCitySelector();
    initTimeUpdater();
    

    initMap('map', handleCityChange);
    

    await loadCity(state.currentCity.name);
    

    els.citySelect.addEventListener('change', (e) => handleCityChange(e.target.value));
    
    els.toggleMapBtn.addEventListener('click', openMap);
    els.closeMapBtn.addEventListener('click', closeMap);


    refreshMapData();
    

    setInterval(refreshMapData, 300000); // 5 mins
}

function openMap() {
    els.mapSection.classList.remove('translate-y-[110%]');
    els.mapSection.classList.remove('translate-y-full'); // fallback

    setTimeout(() => resizeMap(), 300);
}

function closeMap() {
    els.mapSection.classList.add('translate-y-[110%]');
}

function populateCitySelector() {
    els.citySelect.innerHTML = CITIES.map(city => 
        `<option value="${city.name}">${city.name}</option>`
    ).join('');
}

function initTimeUpdater() {
    const update = () => els.timeDisplay.textContent = formatTime();
    update();
    setInterval(update, 60000);
}

async function handleCityChange(cityName) {
    els.citySelect.value = cityName;
    await loadCity(cityName);


}

async function loadCity(cityName) {
    const cityObj = CITIES.find(c => c.name === cityName);
    if (!cityObj) return;
    state.currentCity = cityObj;


    const data = await fetchWeatherData(cityObj.lat, cityObj.lon);
    if (!data) return; 

    state.weatherData = data;
    updateUI(data);
    
    flyToCity(cityObj.lat, cityObj.lon);
    refreshMapMarkers(); 
}

async function refreshMapData() {
    await Promise.all([
        refreshMapMarkers(),
        updateRadarLayer()
    ]);
}

async function refreshMapMarkers() {
    const multiCityData = await fetchMultiCityTemps();
    updateMapMarkers(multiCityData, state.currentCity.name, handleCityChange);
}

function updateUI(data) {
    const current = data.current;
    const daily = data.daily;


    els.temp.textContent = `${Math.round(current.temperature_2m)}°`;
    els.condition.textContent = getWeatherDescription(current.weather_code);
    els.narrative.textContent = generateNarrative(current);
    

    const iconName = getWeatherIconName(current.weather_code, current.is_day);
    els.iconContainer.innerHTML = `<i data-lucide="${iconName}" class="w-20 h-20 md:w-24 md:h-24 stroke-1 animate-fade-in"></i>`;
    

    els.windSpeed.textContent = `${Math.round(current.wind_speed_10m)}`;
    els.windDir.textContent = getWindDirection(current.wind_direction_10m);
    els.rainChance.textContent = `${data.daily.precipitation_probability_max[0]}%`;
    els.feelsLike.textContent = `${Math.round(current.apparent_temperature)}°`;


    renderForecast(daily);
    
    lucide.createIcons();
}

function renderForecast(daily) {
    els.forecastContainer.innerHTML = '';
    
    for (let i = 0; i < 7; i++) { // Show today + 6 days
        const dayName = i === 0 ? 'Today' : formatDate(daily.time[i]);
        const maxTemp = Math.round(daily.temperature_2m_max[i]);
        const minTemp = Math.round(daily.temperature_2m_min[i]);
        const rainProb = daily.precipitation_probability_max[i];
        const wCode = daily.weather_code[i];
        const iconName = getWeatherIconName(wCode);

        const card = document.createElement('div');
        card.className = 'glass-card min-w-[85px] w-[14%] md:min-w-[100px] p-3 rounded-2xl flex flex-col items-center justify-between snap-start hover:bg-white/80 transition-colors cursor-default shrink-0';
        

        const rainIndicator = rainProb > 30 
            ? `<div class="w-full h-1 bg-gray-200 rounded-full mt-2 overflow-hidden">
                 <div class="h-full bg-[#4A90E2]" style="width: ${rainProb}%"></div>
               </div>` 
            : `<div class="w-full h-1 mt-2"></div>`;

        card.innerHTML = `
            <span class="font-mono text-[10px] font-bold text-gray-500 uppercase truncate w-full text-center">${dayName}</span>
            <div class="my-2 text-[#1A1A1A]">
                <i data-lucide="${iconName}" class="w-6 h-6"></i>
            </div>
            <div class="flex flex-col items-center w-full">
                <span class="font-bold text-sm leading-none">${maxTemp}°</span>
                <span class="text-[10px] text-gray-400 mt-1">${minTemp}°</span>
                ${rainIndicator}
            </div>
        `;
        
        els.forecastContainer.appendChild(card);
    }
}

document.addEventListener('DOMContentLoaded', init);
