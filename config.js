// Configuration file for API keys and settings
// TODO: In production, use environment variables or a secure key management system

const CONFIG = {
   
   WEATHER: {
        API_KEY: 'YOUR_OPENWEATHER_API_KEY_HERE', // Get free key at: https://openweathermap.org/api
        BASE_URL: 'https://api.openweathermap.org/data/2.5/find',
        UNITS: 'metric'
    },
    
    QUOTES: {
        API_KEY: 'YOUR_API_NINJAS_KEY_HERE', // Get free key at: https://api.api-ninjas.com/
        BASE_URL: 'https://api.api-ninjas.com/v1/quotes',
        CATEGORY: 'knowledge'
    },
    
    // Application settings
    APP: {
        CACHE_EXPIRY_HOURS: 24,
        DEGREES_PER_SECOND: 6,
        DEGREES_PER_MINUTE: 6,
        DEGREES_PER_HOUR: 30,
        GEOLOCATION_TIMEOUT: 10000,
        GEOLOCATION_MAX_AGE: 600000
    }
};

// Export for ES6 modules (if used)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
}

