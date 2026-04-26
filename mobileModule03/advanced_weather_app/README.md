# Advanced Weather App 🌦️

A React Native weather application built with a modular, service-oriented architecture.

## 🏗️ Architecture Overview

### Core Layers:
1.  **Context (State Management)**: Centralized state using React Context API.
2.  **Services (Data Access)**: API communication logic.
3.  **Hooks (Logic)**: Custom hooks for geocoding, location tracking, and forecast management.
4.  **Components (UI)**: Atomic and composite UI components with a shared design system.
5.  **Utils (Helpers)**: Pure functions for data mapping, formatting, and responsive scaling.

---

## 📁 Folder Structure

```text
advanced_weather_app/
├── assets/             # Fonts, static images, and Lottie animations
├── components/         # UI Components
│   ├── common/         # Atomic components (Cards, Skeletons, Glassmorphism)
│   ├── views/          # Main screen layouts and composite views (TopBar, Tabs)
│   └── weather/        # Weather-specific UI (Charts, Headers)
├── constants/          # Global configuration, theme colors, and static messages
├── context/            # WeatherContext for global state persistence
├── hooks/              # Custom React Hooks
│   ├── api/            # Low-level hooks for API interaction (useGeocoding, useLocation)
│   └── useWeatherManager.js # Main orchestrator hook for app logic
├── services/           # weatherService.js for direct API calls to Open-Meteo
└── utils/              # Helper functions (Responsive scaling, Data mappers)
```

---

## 🚀 Key Modules & Logic

### 1. The Orchestrator: `useWeatherManager`
Located in `hooks/useWeatherManager.js`, this is the "brain" of the app. It coordinates:
*   User search input and suggestions.
*   GPS Geolocation requests.
*   Fetching and caching forecast data.
*   Error handling and loading state synchronization.

### 2. Data Mapping: `weatherDataMapper`
Located in `utils/weatherDataMapper.js`, this utility transforms raw, complex responses from the Open-Meteo API into clean, consistent objects used throughout the UI. It handles unit conversions and weather description mapping.

### 3. Visualization: `BaseWeatherChart`
Located in `components/weather/BaseWeatherChart.js`, this is a generic wrapper around `victory-native`. It handles:
*   Responsive chart sizing.
*   Consistent axis styling and positioning.
*   Cross-platform rendering optimizations (iOS/Android).

### 4. Global State: `WeatherContext`
Located in `context/WeatherContext.js`, it provides:
*   The current forecast object.
*   A mechanism to trigger updates from any component.
*   Search history or cached data persistence.

---

## 🔄 Core Flows

### Search Flow:
1.  User types in `TopBar`.
2.  `useGeocoding` debounces the input and fetches suggestions from Open-Meteo.
3.  Selecting a suggestion triggers `handleSuggestionPress` in `useWeatherManager`.
4.  The app instantly updates the search bar, clears suggestions, and fetches the forecast.

### Geolocation Flow:
1.  User taps the GPS icon.
2.  `useLocation` requests permissions and fetches the current coordinates.
3.  The coordinates are converted to a readable city name via reverse geocoding.
4.  The forecast is fetched and the UI updates smoothly without flickering.

---

## ✨ Design Principles
*   **Glassmorphism**: Uses `GlassCard` for a premium, semi-transparent aesthetic.
*   **Responsive Scaling**: All fonts and margins are calculated via `utils/responsive.js` to ensure the app looks perfect on all screen sizes.
*   **Performance**: Extensive use of `useMemo` and `useCallback` to prevent redundant re-renders, especially during intensive operations like chart drawing or real-time searching.
