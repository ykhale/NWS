# Heat Map Feature Documentation

--

## Overview
The Heat Map visualizes current heat index levels across the United States using real-time data from the NOAA API. It allows users to filter by state and see heat risk for major US cities.

---

## Main Files

### 1. **Frontend**

#### `app/heat-index/HeatIndexPage.tsx`
- **Purpose:** Main React component for the Heat Index Map page.
- **Key Features:**
  - Renders the map and UI controls (state filter, legend, etc.).
  - Handles state selection and map zoom/center logic.
  - Fetches heat zone data from the backend API and passes it to the map.
  - Uses a lookup table to center/zoom the map for each state.

#### `components/HeatMap.tsx`
- **Purpose:** React component that renders the interactive Leaflet map.
- **Key Features:**
  - Receives `center`, `zoom`, and `heatZones` as props.
  - Draws rectangles for each heat zone (city) with color/opacity based on heat level.
  - Shows tooltips with city/region and heat level info.

---

### 2. **Backend/API**

#### `app/api/weather/heatrisk/route.ts`
- **Purpose:** API route that fetches and returns heat index data for major US cities.
- **Key Features:**
  - Contains a hardcoded list of major US cities with lat/lon.
  - For each city, fetches NOAA gridpoint data and extracts the apparent temperature (heat index proxy).
  - Uses batching/parallelization to speed up API calls while respecting NOAA rate limits.
  - Returns an array of heat zone objects to the frontend.

---

### 3. **Helpers/Utilities**

#### `lib/heatService.ts`
- **Purpose:** Utility functions for heat index color, opacity, and description.
- **Key Features:**
  - Provides color and opacity mappings for heat levels.
  - Used by the HeatMap component for consistent visuals.

---

## Data Flow
1. **User visits the Heat Index Map page.**
2. `HeatIndexPage.tsx` fetches heat zone data from `/api/weather/heatrisk`.
3. The API route fetches real-time data from NOAA for each major city, processes it, and returns heat levels.
4. The frontend displays the data on the map, coloring each city by heat risk.
5. When a user selects a state, the map zooms to that state using the lookup table.

---

## Setup & Customization
- **Add/Remove Cities:** Edit the `majorCities` array in `route.ts` to change which cities are shown.
- **Change State Centers/Zooms:** Edit the `stateCenters` object in `HeatIndexPage.tsx`.
- **Adjust Colors/Levels:** Edit `lib/heatService.ts` for color/opacity mappings.
- **Batch Size/Delay:** Tune batching in `route.ts` for speed vs. rate limit safety.

---

## Notes
- The map only shows data for the cities in the `majorCities` list.

---

## Related Files
- `app/heat-index/page.tsx` — Next.js route file for the Heat Index page.
- `lib/heatService.ts` — Utility functions for heat map visuals.
- `components/HeatMap.tsx` — Map rendering logic.
- `app/api/weather/heatrisk/route.ts` — API logic for fetching and serving heat data.
