# Ataraxia - Personal Dashboard

A beautiful Chrome extension that replaces your new tab page with a personal dashboard featuring an analog clock, weather information, and inspirational quotes.

## Features

- 🕒 **Analog Clock**: Beautiful animated analog clock with smooth hand movements
- 🌤️ **Weather Widget**: Current weather information based on your location
- 💭 **Daily Quotes**: Inspirational quotes that refresh daily
- 🎨 **Modern Design**: Glassmorphism design with smooth animations
- 📱 **Responsive**: Works on all screen sizes
- ♿ **Accessible**: WCAG compliant with proper ARIA labels and keyboard navigation

## Installation

1. Clone or download this repository
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" in the top right
4. Click "Load unpacked" and select the project folder
5. The extension will be loaded and your new tab page will be replaced

## Configuration

### API Keys Setup

For the weather and quotes features to work, you need to configure API keys:

1. **Weather API**: Get a free API key from [OpenWeatherMap](https://openweathermap.org/api)
2. **Quotes API**: Get a free API key from [API Ninjas](https://api.api-ninjas.com/)

#### CORS and API Access

**Note**: Due to CORS (Cross-Origin Resource Sharing) policies, some external APIs may not work directly from browser extensions. This extension includes:

- **Fallback System**: If the quotes API fails due to CORS, the app will display inspirational quotes from a local collection
- **Error Handling**: Proper error messages and graceful degradation when APIs are unavailable
- **Local Quotes**: 15+ curated inspirational quotes that work offline

#### Security Recommendations

**Important**: The current implementation stores API keys in the client-side code, which is not secure for production use.

For better security:
- Use environment variables during build time
- Implement a backend proxy for API calls
- Use Chrome extension's secure storage APIs
- Consider using service workers for sensitive operations

### Current Configuration

Edit `config.js` to update your API keys:

```javascript
const CONFIG = {
    WEATHER: {
        API_KEY: 'your_openweather_api_key_here'
    },
    QUOTES: {
        API_KEY: 'your_api_ninjas_key_here'
    }
};
```

## File Structure

```
Ataraxia/
├── index.html          # Main HTML structure
├── script.js          # Application logic
├── style.css          # Styling and responsive design
├── config.js          # Configuration and API keys
├── manifest.json      # Chrome extension manifest
├── images/            # Icons and weather graphics
│   ├── favicon-*.png
│   ├── weather gifs
│   └── social icons
└── README.md          # This file
```

## Development

### Code Structure

The application is organized into modular components:

- **Utils**: Common utility functions
- **WeatherModule**: Handles geolocation and weather API calls
- **QuotesModule**: Manages quote fetching and caching
- **ClockModule**: Updates the analog clock hands
- **App**: Main application initialization

### Key Features

1. **Error Handling**: Comprehensive error handling for API failures and user permissions
2. **Caching**: Smart caching system to reduce API calls
3. **Accessibility**: Full keyboard navigation and screen reader support
4. **Performance**: Optimized with proper loading states and fallbacks

## Browser Compatibility

- Chrome 88+ (Manifest V3 support)
- Microsoft Edge 88+
- Other Chromium-based browsers

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is open source and available under the [MIT License](LICENSE).

## Changelog

### Version 1.0.1
- Updated to Manifest V3
- Improved error handling and user feedback
- Added comprehensive accessibility features
- Implemented responsive design
- Separated configuration for better security
- Added proper semantic HTML structure

### Version 1.0.0
- Initial release with basic functionality

## Credits

- **Author**: Aqib Hanief Bhat
- **Weather Data**: [OpenWeatherMap API](https://openweathermap.org/)
- **Quotes**: [API Ninjas](https://api.api-ninjas.com/)
- **Fonts**: [Google Fonts - Lato](https://fonts.google.com/specimen/Lato)

## Troubleshooting

### Common Issues

1. **Quotes not loading**: 
   - This is normal due to CORS restrictions
   - The app will automatically show local quotes instead
   - No action needed - this is expected behavior

2. **Weather not loading**:
   - Check if location permission is granted
   - Verify your internet connection
   - Ensure the OpenWeatherMap API key is valid

3. **Extension not loading**:
   - Make sure Developer mode is enabled in Chrome
   - Check the console for any error messages
   - Reload the extension from chrome://extensions/

### API Status

- **Weather API**: ✅ Usually works (requires valid API key)
- **Quotes API**: ⚠️ May be blocked by CORS (local fallback available)

## Support

If you encounter any issues or have questions, please open an issue on the GitHub repository.
