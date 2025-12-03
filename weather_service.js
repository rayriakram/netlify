const BASE_URL = 'https://api.open-meteo.com/v1/forecast';

export const CITIES = [
    { name: 'Amsterdam', lat: 52.3676, lon: 4.9041 },
    { name: 'Rotterdam', lat: 51.9225, lon: 4.4792 },
    { name: 'Utrecht', lat: 52.0908, lon: 5.1222 },
    { name: 'The Hague', lat: 52.0705, lon: 4.3007 },
    { name: 'Eindhoven', lat: 51.4416, lon: 5.4697 },
    { name: 'Groningen', lat: 53.2194, lon: 6.5665 },
    { name: 'Maastricht', lat: 50.8514, lon: 5.6910 },
    { name: 'Leeuwarden', lat: 53.2012, lon: 5.7999 }
];

export async function fetchWeatherData(lat, lon) {
    try {
        const params = new URLSearchParams({
            latitude: lat,
            longitude: lon,
            current: 'temperature_2m,relative_humidity_2m,is_day,precipitation,rain,weather_code,wind_speed_10m,wind_direction_10m,apparent_temperature',
            daily: 'weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max',
            timezone: 'auto',
            forecast_days: 8
        });

        const response = await fetch(`${BASE_URL}?${params.toString()}`);
        
        if (!response.ok) throw new Error('Weather data fetch failed');
        
        return await response.json();
    } catch (error) {
        console.error("API Error:", error);
        return null;
    }
}

export async function fetchMultiCityTemps() {


    const promises = CITIES.map(async city => {
        const data = await fetchWeatherData(city.lat, city.lon);
        return {
            name: city.name,
            lat: city.lat,
            lon: city.lon,
            temp: data?.current?.temperature_2m || '-',
            weatherCode: data?.current?.weather_code || 0
        };
    });
    return Promise.all(promises);
}
