


export function generateNarrative(current) {
    const temp = current.temperature_2m;
    const feelsLike = current.apparent_temperature;
    const code = current.weather_code;
    const wind = current.wind_speed_10m;
    const rain = current.precipitation;
    

    if (wind > 45) {
        const windy = [
            "Code Orange vibes. Your umbrella is now a conceptual art piece.",
            "The wind is currently reorganizing the entire country's infrastructure.",
            "Perfect weather for flying kites, or small children.",
            "Cycling headwind: The national gym of the Netherlands.",
            "Horizontal hair styling, provided free of charge by nature.",
            "Hold onto your Stroopwafels. It's getting biblical out here."
        ];
        return pickRandom(windy);
    }


    if (rain > 2.0 || (code >= 63 && code <= 65)) {
        const rainy = [
            "It's not just raining, it's attacking. Stay inside.",
            "Vertical water is so mainstream. Enjoy the horizontal spray.",
            "Accept your fate. You will be wet.",
            "Dutch summer has arrived! Oh wait, just liquid depression.",
            "Checking the radar won't help. It's everywhere.",
            "Maximum wetness achieved. Amphibious vehicles recommended."
        ];
        return pickRandom(rainy);
    }


    if (code >= 51 && code <= 55) {
        const drizzle = [
            "That specific Dutch mist that penetrates your soul.",
            "Not quite rain, just really aggressive humidity.",
            "50 shades of grey sky. Today is shade #42.",
            "Just wet enough to be annoying. Classic.",
            "The air itself is sweating. Gross.",
            "Glasses wearers: Good luck seeing anything today."
        ];
        return pickRandom(drizzle);
    }


    if (feelsLike < 2) {
        const cold = [
            "Bitterly cold. 'Gezelligheid' is now mandatory for survival.",
            "Your breath is now a special effect.",
            "Crisp. Cold. The kind of weather that hates your ears.",
            "It's freezing. Time to complain about the trains.",
            "Emotional warmth required. Physical warmth unavailable.",
            "Don't be fooled by the sun. It's a trap."
        ];
        return pickRandom(cold);
    }


    if (temp > 24) {
        const hot = [
            "Terrace weather detected. Productivity dropping to 0%.",
            "Actually sunny? In this economy?",
            "The entire nation is now wearing shorts. Look away.",
            "Panic buying of BBQ supplies has commenced.",
            "Rare footage of the sun. Take a picture.",
            "It's warm. Expect complaints about the heat within the hour."
        ];
        return pickRandom(hot);
    }
    

    if (code <= 2) {
        const good = [
            "Suspiciously nice weather. What are they planning?",
            "Blue skies? A system error has occurred.",
            "Go outside before the clouds remember their job.",
            "Ideal conditions for doing absolutely nothing.",
            "A rare blessing from the weather gods. Enjoy it.",
            "Standard Dutch calm. Nothing to see here."
        ];
        return pickRandom(good);
    }

    return "Just another day in the Polder. Keep cycling.";
}

function pickRandom(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

export function getWeatherDescription(code) {
    const descriptions = {
        0: "Clear sky", 1: "Mainly clear", 2: "Partly cloudy", 3: "Overcast",
        45: "Fog", 48: "Rime fog",
        51: "Light drizzle", 53: "Drizzle", 55: "Dense drizzle",
        56: "Freezing drizzle", 57: "Dense freezing drizzle",
        61: "Slight rain", 63: "Rain", 65: "Heavy rain",
        66: "Freezing rain", 67: "Heavy freezing rain",
        71: "Snow light", 73: "Snow", 75: "Heavy snow",
        77: "Snow grains",
        80: "Showers", 81: "Mod. showers", 82: "Violent showers",
        85: "Snow showers", 86: "Heavy snow showers",
        95: "Thunderstorm", 96: "Thunder & hail", 99: "Heavy thunder"
    };
    return descriptions[code] || "Variable";
}
