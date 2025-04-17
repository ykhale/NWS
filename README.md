# Hurricane Monitor (NWS Weather Alert System)

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
    - `/api/weather/route.ts`: Handles fetching data from NOAA
    - `/api/email/route.ts`: Handles email subscriptions
    - `/api/subscriptions/route.ts`: Manages alert subscriptions

- **`/components`**: Reusable React components
  - `Map.tsx`: Leaflet map component for visualizing alerts
  - `WarningsList.tsx`: Displays the list of weather alerts
  - `Filters.tsx`: Provides filtering options for alerts
  - `WeatherChart.tsx`: Displays weather data in chart form

- **`/lib`**: Utility functions and shared code
  - `noaa.ts`: Functions for interacting with NOAA API
  - `noaaService.ts`: Service layer for processing NOAA data
  - `db.ts`: Database connection and utility functions
  - `emailService.ts`: Email notification functionality

- **`/prisma`**: Database schema and migrations
  - `schema.prisma`: Defines database models
  - `/migrations`: Database migration files

- **`/public`**: Static assets including images and icons

- **`/styles`**: Global styles including TailwindCSS configuration
  - `globals.css`: Global CSS and Tailwind imports

### Configuration Files

- `next.config.js`: Next.js configuration including image domains
- `postcss.config.js`: PostCSS configuration for TailwindCSS
- `tailwind.config.js`: TailwindCSS configuration
- `tsconfig.json`: TypeScript configuration
- `.env/.env.local`: Environment variables

## How the App Works

### Data Flow

1. **Data Fetching**: 
   - The application fetches weather alert data from the NOAA API through `/app/api/weather/route.ts`
   - This data is then processed and formatted by functions in `/lib/noaaService.ts`

2. **Alert Display**:
   - The main alerts page (`/app/alerts/page.tsx`) receives the processed data
   - Alerts are displayed in a filterable list via the `WarningsList` component
   - Users can filter alerts by state using the `Filters` component

3. **Map Visualization**:
   - When an alert is selected, its geographic data is passed to the `Map` component
   - The Map component (`/components/Map.tsx`) renders this data as GeoJSON on a Leaflet map
   - The map automatically centers on the selected alert's location

4. **Subscriptions**:
   - Users can subscribe to alerts via the Subscribe page (`/app/subscribe/page.tsx`)
   - Subscription requests are processed by `/app/api/subscriptions/route.ts`
   - Subscriber data is stored in the database via Prisma models

## Guide for Contributors

### Adding a New Feature

1. **New Component**:
   - Add new React components to the `/components` directory
   - Follow the existing naming conventions and code style
   - Import the component where needed

2. **New API Endpoint**:
   - Add new API routes in the `/app/api` directory
   - Use the existing pattern of route.ts files
   - Implement proper error handling and response formatting

3. **New Page**:
   - Create a new directory under `/app` with a `page.tsx` file
   - The name of the directory will be the URL path

### Modifying Existing Features

1. **Map Customization**:
   - To change map appearance or behavior, modify `/components/Map.tsx`
   - Map styling options are defined in the `style` object
   - Map initialization and tile layers are in the MapContainer component

2. **Alert Display Changes**:
   - Modify `/components/WarningsList.tsx` to change how alerts are displayed
   - Style changes can be made via Tailwind classes or inline styles

3. **Filter Modifications**:
   - To add or change filter options, update `/components/Filters.tsx`
   - Add new filter state in the parent component and pass as props

4. **API Changes**:
   - To change how data is fetched from NOAA, modify `/lib/noaaService.ts`
   - For changes to API endpoints, update files in `/app/api/`

### Database Changes

1. **Schema Changes**:
   - Modify the schema in `/prisma/schema.prisma`
   - Run `npx prisma migrate dev --name migration_name` to create a migration
   - Update related service functions in `/lib/db.ts`

2. **Adding Models**:
   - Add new models to `/prisma/schema.prisma`
   - Generate the migration as above
   - Create corresponding service functions in `/lib/db.ts`

### Environment Variables

The following environment variables are required:
- `DATABASE_URL`: Connection string for your database
- `EMAIL_SERVICE`: Email service provider (e.g., SendGrid)
- `EMAIL_API_KEY`: API key for the email service
- `NEXT_PUBLIC_SITE_URL`: Public URL of the deployed site

Set these in `.env.local` for development or in your hosting environment for production.

## Common Tasks

### Adding a New Alert Type

1. Update the type definitions in `lib/noaa.ts`
2. Add processing logic in `lib/noaaService.ts`
3. Update the display in `components/WarningsList.tsx`
4. Add map styling in `components/Map.tsx` if needed

### Adding a New Filter Option

1. Add the filter state in `app/alerts/page.tsx`
2. Update the `Filters.tsx` component to include the new option
3. Implement the filtering logic in the page component

### Changing Map Provider

1. Update the TileLayer URL in `components/Map.tsx`
2. Update attribution information
3. Adjust any styling specific to the map provider

### Creating a New Page

1. Create a new directory under `/app` (e.g., `/app/history`)
2. Add a `page.tsx` file with your component
3. Link to it from other parts of the application

## Deployment

The application is currently deployed on [insert deployment platform]. To deploy changes:

1. Push changes to the main branch of the GitHub repository
2. The deployment platform will automatically build and deploy the changes
3. Verify the deployment by checking the live site

## Development Workflow

1. Clone the repository:
   ```bash
   git clone https://github.com/ykhale/NWS.git
   cd NWS
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Make your changes
   
5. Test your changes locally at http://localhost:3000

6. Commit and push your changes:
   ```bash
   git add .
   git commit -m "Description of changes"
   git push
   ```

## License

[MIT License](LICENSE)

## Acknowledgements

- NOAA Weather Service for providing the weather alert API
- OpenStreetMap for map data
- Next.js team for the incredible framework
