# Weatherio 🌤️

**Weatherio** is a web application that provides accurate, up-to-date weather information for cities worldwide. You can search for your city's weather, view current conditions, forecast data, and other weather highlights.

## Features

- **Search by City**: Enter the name of any city to get current weather details, including temperature, weather description, and time.
- **Current Location**: Automatically detect your location and display the current weather.
- **Today's Highlights**: Get a quick view of essential weather metrics like wind speed, sunrise/sunset times, humidity, pressure, visibility, and "feels like" temperature.
- **5-Day Forecast**: View an extended forecast to plan your week effectively.

## Built With

- **HTML & CSS** (using TailwindCSS for styling)
- **JavaScript**
- **Font Awesome** (for icons)
- **OpenWeather API** (for fetching weather data)

## Screenshots

*Add screenshots of your application in action to give potential users a visual understanding of your project.*

## Getting Started

To run this project locally, follow these steps:

### Prerequisites

1. Make sure you have **Node.js** and **npm** installed.
2. Sign up for an [OpenWeather API key](https://openweathermap.org/) if you don’t have one already.

### Installation

1. **Clone the repository**:

    ```bash
    git clone https://github.com/Sahil-Bhowmick/weatherio.git
    ```

2. **Navigate to the project directory**:

    ```bash
    cd weatherio
    ```

3. **Install dependencies** (if any packages are specified):

    ```bash
    npm install
    ```

4. **Add your API key**: Create a `.env` file in the root directory and add your OpenWeather API key:

    ```env
    REACT_APP_OPENWEATHER_API_KEY=your_api_key_here
    ```

5. **Run the application**:

    Open `index.html` in your browser, or use a local server like Live Server in Visual Studio Code.

## Usage

1. **Search for a city**: Type in a city name to get its current weather and forecast.
2. **Use the current location** button to get the weather for your present location.
3. **Explore the highlights** and see additional details about the weather.

## Folder Structure

weatherio/ ├── assets/ # Icons and images ├── css/ # CSS files ├── js/ # JavaScript files ├── index.html # Main HTML file ├── README.md # Project README