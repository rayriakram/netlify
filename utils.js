export function formatDate(dateStr) {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('en-US', { weekday: 'short' }).format(date);
}

export function formatTime(date = new Date()) {
    return new Intl.DateTimeFormat('nl-NL', { 
        hour: '2-digit', 
        minute: '2-digit', 
        hour12: false 
    }).format(date);
}

export function getWindDirection(degrees) {
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    return directions[Math.round(degrees / 45) % 8];
}

export function getWeatherIconName(wmoCode, isDay = 1) {


    const map = {
        0: isDay ? 'sun' : 'moon',
        1: isDay ? 'cloud-sun' : 'cloud-moon',
        2: 'cloud',
        3: 'cloud',
        45: 'cloud-fog',
        48: 'cloud-fog',
        51: 'cloud-drizzle',
        53: 'cloud-drizzle',
        55: 'cloud-drizzle',
        61: 'cloud-rain',
        63: 'cloud-rain',
        65: 'cloud-rain-wind',
        71: 'snowflake',
        73: 'snowflake',
        75: 'snowflake',
        77: 'snowflake',
        80: 'cloud-rain',
        81: 'cloud-rain',
        82: 'cloud-lightning',
        95: 'cloud-lightning',
        96: 'cloud-lightning',
        99: 'cloud-lightning'
    };
    return map[wmoCode] || 'cloud';
}

export function mapRange(value, inMin, inMax, outMin, outMax) {
    return (value - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
}
