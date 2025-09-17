// Configuration file for API keys and settings
// TODO: In production, use environment variables or a secure key management system

const CONFIG = {
    // Weather API configuration
    WEATHER: {
        API_KEY: '063b4f1d2a05dd2976b6117f61413b5a', // TODO: Move to environment variable
        BASE_URL: 'https://api.openweathermap.org/data/2.5/find',
        UNITS: 'metric'
    },
    
    // Quotes API configuration
    QUOTES: {
        API_KEY: 'sxBiYnl1aZ8Vt7RuJGN/Xw==NVU7pJi6eX7v1YkW', // TODO: Move to environment variable
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
