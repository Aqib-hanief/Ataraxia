// Note: CONFIG is loaded from config.js

const SELECTORS = {
    weatherButton: '.jsCurrentWeather',
    temperature: '.temperature',
    tempIcon: '.weather-icon',
    tempValue: '.temp',
    locationName: '.current-location',
    quote: '.quote',
    author: '.author',
    hourHand: '#hr',
    minuteHand: '#mn',
    secondHand: '#sc'
};

// Utility Functions
const Utils = {
    getElement(selector) {
        const element = document.querySelector(selector);
        if (!element) {
            console.warn(`Element not found: ${selector}`);
        }
        return element;
    },

    showElement(selector) {
        const element = this.getElement(selector);
        if (element) {
            element.classList.remove('hidden');
        }
    },

    hideElement(selector) {
        const element = this.getElement(selector);
        if (element) {
            element.classList.add('hidden');
        }
    },

    isExpired(expiryDate) {
        return new Date() >= new Date(expiryDate);
    },

    createExpiryDate(hours = CONFIG.APP.CACHE_EXPIRY_HOURS) {
        const date = new Date();
        date.setHours(date.getHours() + hours);
        return date;
    }
};

// Weather icon mapping
const WeatherIcons = {
    // OpenWeatherMap conditions to Weather Icons font classes
    getIconClass(weatherCondition, isDay = true) {
        const condition = weatherCondition.toLowerCase();
        const timePrefix = isDay ? 'wi-day-' : 'wi-night-';
        
        const iconMap = {
            'clear': isDay ? 'wi-day-sunny' : 'wi-night-clear',
            'clouds': isDay ? 'wi-day-cloudy' : 'wi-night-alt-cloudy',
            'rain': 'wi-rain',
            'drizzle': 'wi-sprinkle',
            'thunderstorm': 'wi-thunderstorm',
            'snow': 'wi-snow',
            'mist': 'wi-fog',
            'fog': 'wi-fog',
            'haze': 'wi-day-haze',
            'dust': 'wi-dust',
            'sand': 'wi-sandstorm',
            'ash': 'wi-volcano',
            'squall': 'wi-strong-wind',
            'tornado': 'wi-tornado'
        };
        
        return iconMap[condition] || 'wi-na';
    },
    
    getColorClass(weatherCondition) {
        const condition = weatherCondition.toLowerCase();
        const colorMap = {
            'clear': 'clear',
            'clouds': 'clouds',
            'rain': 'rain',
            'drizzle': 'rain',
            'thunderstorm': 'thunderstorm',
            'snow': 'snow',
            'mist': 'mist',
            'fog': 'fog'
        };
        
        return colorMap[condition] || '';
    }
};

// Weather Module
const WeatherModule = {
    requestLocation() {
        if (!navigator.geolocation) {
            this.showError('Geolocation is not supported by this browser.');
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => this.handleLocationSuccess(position),
            (error) => this.handleLocationError(error),
            {
                enableHighAccuracy: true,
                timeout: CONFIG.APP.GEOLOCATION_TIMEOUT,
                maximumAge: CONFIG.APP.GEOLOCATION_MAX_AGE
            }
        );
    },

    handleLocationSuccess(position) {
        const location = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        };
        
        localStorage.setItem('location', JSON.stringify(location));
        this.fetchWeatherData(location.latitude, location.longitude);
    },

    handleLocationError(error) {
        let message = 'Unable to retrieve location. ';
        
        switch (error.code) {
            case error.PERMISSION_DENIED:
                message += 'Location access denied by user.';
                break;
            case error.POSITION_UNAVAILABLE:
                message += 'Location information unavailable.';
                break;
            case error.TIMEOUT:
                message += 'Location request timed out.';
                break;
            default:
                message += 'Unknown error occurred.';
                break;
        }
        
        this.showError(message);
    },

    async fetchWeatherData(latitude, longitude) {
        try {
            const url = `${CONFIG.WEATHER.BASE_URL}?lat=${latitude}&lon=${longitude}&cnt=1&units=${CONFIG.WEATHER.UNITS}&appid=${CONFIG.WEATHER.API_KEY}`;
            
            const response = await fetch(url, {
                mode: 'cors'
            });
            
            if (!response.ok) {
                throw new Error(`Weather API error: ${response.status}`);
            }
            
            const data = await response.json();
            
            if (data.list && data.list.length > 0) {
                this.displayWeather(data.list[0]);
            } else {
                throw new Error('No weather data available');
            }
            
        } catch (error) {
            console.error('Weather fetch error:', error);
            this.showError('Unable to fetch weather data. Please check your internet connection.');
        }
    },

    displayWeather(weatherData) {
        try {
            const temperature = Math.round(weatherData.main.temp);
            const location = weatherData.name;
            const weatherType = weatherData.weather[0].main;
            
            // Determine if it's day or night based on current time
            const now = new Date();
            const currentHour = now.getHours();
            const isDay = currentHour >= 6 && currentHour < 18;

            const tempElement = Utils.getElement(SELECTORS.tempValue);
            if (tempElement) {
                tempElement.textContent = `${temperature}°C`;
            }

            const locationElement = Utils.getElement(SELECTORS.locationName);
            if (locationElement) {
                locationElement.textContent = location;
            }

            const iconElement = Utils.getElement(SELECTORS.tempIcon);
            if (iconElement) {
                // Clear existing classes
                iconElement.className = 'weather-icon';
                
                // Add weather-specific icon class
                const iconClass = WeatherIcons.getIconClass(weatherType, isDay);
                iconElement.classList.add(iconClass);
                
                // Add color class
                const colorClass = WeatherIcons.getColorClass(weatherType);
                if (colorClass) {
                    iconElement.classList.add(colorClass);
                }
                
                // Add day/night class
                iconElement.classList.add(isDay ? 'day' : 'night');
                
                // Update aria-label
                iconElement.setAttribute('aria-label', `${weatherType} weather`);
                
                // Make sure the icon is visible
                iconElement.style.display = 'block';
                
                console.log('Weather icon updated:', iconClass, colorClass);
            }

            Utils.showElement(SELECTORS.temperature);
            Utils.hideElement(SELECTORS.weatherButton);

        } catch (error) {
            console.error('Display weather error:', error);
            this.showError('Unable to display weather data');
        }
    },

    showError(message) {
        console.error('Weather error:', message);
        Utils.hideElement(SELECTORS.temperature);
    },

    init() {
        // Set a default weather icon on page load
        this.setDefaultIcon();
        
        const cachedLocation = localStorage.getItem('location');
        if (cachedLocation) {
            try {
                const location = JSON.parse(cachedLocation);
                Utils.hideElement(SELECTORS.weatherButton);
                Utils.showElement(SELECTORS.temperature);
                this.fetchWeatherData(location.latitude, location.longitude);
            } catch (error) {
                console.error('Error parsing cached location:', error);
                localStorage.removeItem('location');
            }
        }

        const weatherButton = Utils.getElement(SELECTORS.weatherButton);
        if (weatherButton) {
            weatherButton.addEventListener('click', () => {
                Utils.hideElement(SELECTORS.weatherButton);
                Utils.showElement(SELECTORS.temperature);
                this.requestLocation();
            });
        }
    },
    
    setDefaultIcon() {
        const iconElement = Utils.getElement(SELECTORS.tempIcon);
        if (iconElement) {
            iconElement.className = 'weather-icon wi-day-sunny clear day';
            iconElement.style.display = 'block';
            iconElement.setAttribute('aria-label', 'Weather icon');
            console.log('Default weather icon set');
        }
    }
};

// Quotes Module
const QuotesModule = {
    async getQuote() {
        const cachedQuote = localStorage.getItem('quote');
        
        if (cachedQuote) {
            try {
                const quoteData = JSON.parse(cachedQuote);
                
                if (!Utils.isExpired(quoteData.expiryDate)) {
                    this.displayQuote(quoteData.text, quoteData.author);
                    return;
                }
            } catch (error) {
                console.error('Error parsing cached quote:', error);
                localStorage.removeItem('quote');
            }
        }
        
        await this.fetchNewQuote();
    },

    async fetchNewQuote() {
        try {
            const url = `${CONFIG.QUOTES.BASE_URL}?category=${CONFIG.QUOTES.CATEGORY}`;
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'X-Api-Key': CONFIG.QUOTES.API_KEY
                },
                mode: 'cors'
            });

            if (!response.ok) {
                throw new Error(`Quotes API error: ${response.status}`);
            }

            const data = await response.json();
            
            if (data && data.length > 0) {
                const quote = data[0];
                
                const cacheData = {
                    text: quote.quote,
                    author: quote.author,
                    expiryDate: Utils.createExpiryDate()
                };
                
                localStorage.setItem('quote', JSON.stringify(cacheData));
                this.displayQuote(quote.quote, quote.author);
            } else {
                throw new Error('No quote data received');
            }

        } catch (error) {
            console.error('Quote fetch error:', error);
            // If API fails, use local quotes
            this.displayRandomLocalQuote();
        }
    },

    displayQuote(text, author) {
        const quoteElement = Utils.getElement(SELECTORS.quote);
        const authorElement = Utils.getElement(SELECTORS.author);

        if (quoteElement) {
            quoteElement.textContent = `"${text}"`;
        }

        if (authorElement) {
            authorElement.textContent = `— ${author}`;
        }
    },

    displayRandomLocalQuote() {
        const localQuotes = [
            { quote: "The only true wisdom is in knowing you know nothing.", author: "Socrates" },
            { quote: "In the middle of difficulty lies opportunity.", author: "Albert Einstein" },
            { quote: "The journey of a thousand miles begins with one step.", author: "Lao Tzu" },
            { quote: "Life is what happens to you while you're busy making other plans.", author: "John Lennon" },
            { quote: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt" },
            { quote: "It is during our darkest moments that we must focus to see the light.", author: "Aristotle" },
            { quote: "The only impossible journey is the one you never begin.", author: "Tony Robbins" },
            { quote: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill" },
            { quote: "The way to get started is to quit talking and begin doing.", author: "Walt Disney" },
            { quote: "Innovation distinguishes between a leader and a follower.", author: "Steve Jobs" },
            { quote: "Your time is limited, so don't waste it living someone else's life.", author: "Steve Jobs" },
            { quote: "If you look at what you have in life, you'll always have more.", author: "Oprah Winfrey" },
            { quote: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
            { quote: "Life is really simple, but we insist on making it complicated.", author: "Confucius" },
            { quote: "The purpose of our lives is to be happy.", author: "Dalai Lama" }
        ];
        
        const randomQuote = localQuotes[Math.floor(Math.random() * localQuotes.length)];
        
        // Cache the local quote too
        const cacheData = {
            text: randomQuote.quote,
            author: randomQuote.author,
            expiryDate: Utils.createExpiryDate(1) // Cache for 1 hour only for local quotes
        };
        
        localStorage.setItem('quote', JSON.stringify(cacheData));
        this.displayQuote(randomQuote.quote, randomQuote.author);
    },

    displayFallbackQuote() {
        this.displayRandomLocalQuote();
    }
};

// Clock Module
const ClockModule = {
    updateTime() {
        const now = new Date();
        const hours = now.getHours() % 12;
        const minutes = now.getMinutes();
        const seconds = now.getSeconds();

        const hourAngle = (hours * CONFIG.APP.DEGREES_PER_HOUR) + (minutes * CONFIG.APP.DEGREES_PER_HOUR / 60);
        const minuteAngle = minutes * CONFIG.APP.DEGREES_PER_MINUTE;
        const secondAngle = seconds * CONFIG.APP.DEGREES_PER_SECOND;

        const hourHand = Utils.getElement(SELECTORS.hourHand);
        const minuteHand = Utils.getElement(SELECTORS.minuteHand);
        const secondHand = Utils.getElement(SELECTORS.secondHand);

        if (hourHand) {
            hourHand.style.transform = `rotateZ(${hourAngle}deg)`;
        }

        if (minuteHand) {
            minuteHand.style.transform = `rotateZ(${minuteAngle}deg)`;
        }

        if (secondHand) {
            secondHand.style.transform = `rotateZ(${secondAngle}deg)`;
        }
    },

    init() {
        this.updateTime();
setInterval(() => {
            this.updateTime();
        }, 1000);
    }
};

// Application Initialization
const App = {
    init() {
        try {
            ClockModule.init();
            QuotesModule.getQuote();
            WeatherModule.init();
            
            console.log('Ataraxia app initialized successfully');
        } catch (error) {
            console.error('Error initializing app:', error);
        }
    }
};

// Start the application
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => App.init());
} else {
    App.init();
}