# Hurricane Monitor

A real-time weather alert application built with Next.js that displays NOAA weather alerts and allows users to subscribe for notifications.

## Overview
Hurricane Monitor provides real-time weather alerts from the NOAA (National Oceanic and Atmospheric Administration) Weather Service API. The application allows users to view current severe weather alerts across the United States, visualize them on an interactive map, and subscribe to receive future alerts.

## Features

- **Real-time Weather Alerts**: Displays active NOAA alerts with severity indicators
- **Interactive Map**: Visualizes alert areas using Leaflet.js
- **Filtering Capabilities**: Filter alerts by state
- **Alert Details**: View comprehensive information about each alert
- **Subscription Service**: Subscribe to receive alerts for specific regions
- **Responsive Design**: Works on desktop and mobile devices

## Technology Stack

- **Frontend Framework**: Next.js 14.1.0
- **Styling**: Inline styles with design system principles and TailwindCSS 4.1.4
- **Map Visualization**: Leaflet.js with React-Leaflet
- **API Integration**: NOAA Weather Service API
- **Database**: Prisma ORM

## Project Structure

### Core Files and Directories

- **`/app`**: Next.js application routes and pages (App Router)
  - `/alerts`: Main page for displaying weather alerts and map
  - `/subscribe`: Form for subscribing to alerts
  - `/api`: Backend API endpoints

- **`/components`**: Reusable React components
  - `Map.tsx`: Leaflet map component for visualizing alerts

- **`/lib`**: Utility functions and shared code

- **`/prisma`**: Database schema and migrations

- **`/public`**: Static assets

- **`/styles`**: Global styles including TailwindCSS configuration
  - `globals.css`: Global CSS and Tailwind imports

### Configuration Files

- `next.config.js`: Next.js configuration including image domains
- `postcss.config.js`: PostCSS configuration for TailwindCSS
- `tailwind.config.js`: TailwindCSS configuration
- `tsconfig.json`: TypeScript configuration
- `.env/.env.local`: Environment variables

## Key Components

### 1. Map Component (`components/Map.tsx`)

The Map component uses react-leaflet to display a map with weather alert geometries. It supports different types of GeoJSON geometries (Point, Polygon, MultiPolygon).

Features:
- Dynamic map rendering with OpenStreetMap tiles
- GeoJSON visualization of alert areas
- Custom map styling for different alert severities
- Client-side only rendering with Next.js dynamic imports

### 2. Alerts Page (`app/alerts/page.tsx`)

The main page for displaying and interacting with weather alerts.

Features:
- Fetches and displays active weather alerts from NOAA API
- Filters alerts by state
- Displays detailed information for selected alerts
- Visualizes alert areas on an interactive map
- Automatically refreshes data every 5 minutes
- Handles different geometry types (Point, Polygon, MultiPolygon)
- Provides error handling for API failures

### 3. Subscribe Page (`app/subscribe/page.tsx`)

Allows users to subscribe to weather alerts for specific states or regions.

Features:
- Form to collect user information (email, location preferences)
- Sends subscription data to backend API
- Confirmation messages for successful submission
- Modern, responsive design with proper image handling

## Data Flow

1. User visits the alerts page
2. Application fetches active weather alerts from NOAA API
3. Alerts are displayed in a filterable list
4. User selects an alert to view details
5. Map automatically centers on the selected alert's location
6. User can subscribe to similar alerts via the subscribe link

## Error Handling

The application implements robust error handling:
- API fetch errors are displayed to the user
- Map geometry parsing includes fallbacks for different GeoJSON types
- Type safety implemented throughout with TypeScript
- Default views displayed when data is unavailable

## Setup and Installation

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Git

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd hurricane-monitor
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env.local` file with the necessary environment variables (see `.env` for examples)

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

### Building for Production

```bash
npm run build
npm start
```

## License

[MIT License](LICENSE)

## Acknowledgements

- NOAA Weather Service for providing the weather alert API
- OpenStreetMap for map data
- Next.js team for the incredible framework
