# Hurricane & Weather Monitor

A real-time weather alert system that helps users stay informed about severe weather conditions across the United States.

## 🌟 Overview

This application provides real-time weather alerts and warnings through an interactive map interface and email notifications. Users can:
- View current weather alerts on an interactive map
- Subscribe to receive email notifications for specific states
- Get detailed information about weather events
- Track severe weather conditions in their area

## 📱 User Interface

### Home Page (`/`)
The main landing page that introduces users to the weather alert system. It features:
- A hero section explaining the service
- Key features and benefits
- Call-to-action buttons for subscribing
- Visual examples of the alert system

### Alerts Page (`/alerts`)
The interactive map page where users can:
- View all current weather alerts on a map
- Filter alerts by state
- Click on alerts to see detailed information
- See the severity and type of each weather event
- View the affected areas and timing of alerts

### Subscribe Page (`/subscribe`)
Where users can:
- Enter their email address
- Select which states they want to monitor
- Choose their alert preferences
- Manage their subscription settings

## 🏗️ Project Structure

### Frontend Components
- `app/layout.tsx`: The main layout component that wraps all pages
- `app/page.tsx`: The home page component
- `app/alerts/page.tsx`: The alerts page with map and alert list
- `app/subscribe/page.tsx`: The subscription management page
- `components/Map.tsx`: Interactive map component using Leaflet.js
- `components/WarningsList.tsx`: List of current weather warnings
- `components/Navbar.tsx`: Navigation bar component
- `components/Footer.tsx`: Footer component

### Backend Services
- `lib/weatherService.ts`: Handles weather data fetching and processing
- `lib/emailService.ts`: Manages email notifications and subscriptions
- `lib/db.ts`: Database connection and operations

### Configuration Files
- `next.config.js`: Next.js configuration
- `package.json`: Project dependencies and scripts
- `tsconfig.json`: TypeScript configuration
- `.env`: Environment variables (not committed to git)

## 🔧 Technical Details

### Data Sources
- National Weather Service (NWS) API
- NOAA weather data
- OpenStreetMap for map tiles

### Key Technologies
- Next.js 14: React framework for server-side rendering
- TypeScript: Type-safe JavaScript
- Leaflet.js: Interactive maps
- Tailwind CSS: Styling
- MongoDB: Database
- Nodemailer: Email service

### API Integration
The application integrates with:
- NOAA/NWS API for weather data
- Email service providers for notifications
- Map services for visualization

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- MongoDB database
- Email service credentials

### Installation
1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   ```bash
   cp .env.example .env
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

### Environment Variables
- `MONGODB_URI`: MongoDB connection string
- `EMAIL_SERVICE`: Email service provider
- `EMAIL_USER`: Email account username
- `EMAIL_PASSWORD`: Email account password
- `NEXT_PUBLIC_MAPBOX_TOKEN`: Mapbox API token

## 📧 Email Notifications

The system sends two types of emails:
1. Welcome Email: When users first subscribe
2. Alert Emails: When severe weather is detected in their selected states

Email templates include:
- Event type and severity
- Affected areas
- Timing information
- Safety instructions
- Links to more information

## 🗺️ Map Features

The interactive map includes:
- Real-time weather alert markers
- Different colors for different alert types
- Clickable markers with detailed information
- Zoom and pan controls
- State boundaries
- Automatic centering on selected alerts

## 🔍 Alert Types

The system monitors for:
- Severe Thunderstorms
- Tornadoes
- Floods
- Winter Storms
- Hurricanes
- Tropical Storms
- Heat Waves
- Wildfires

## 🛠️ Development

### Available Scripts
- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm start`: Start production server
- `npm test`: Run tests
- `npm run lint`: Run linter

### Code Style
- ESLint for code quality
- Prettier for formatting
- TypeScript for type safety

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- National Weather Service for weather data
- OpenStreetMap for map tiles
- NOAA for weather information
- All contributors to the project

## 📞 Support

For support, please:
1. Check the documentation
2. Search existing issues
3. Create a new issue if needed

## 📈 Future Improvements

Planned features:
- Mobile app version
- SMS notifications
- Custom alert thresholds
- Historical data analysis
- More detailed weather information
- Social media integration
