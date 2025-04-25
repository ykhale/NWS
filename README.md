# NOAA Weather Service App

A web application that provides real-time weather alerts and notifications for severe weather conditions across the United States.

## Features

- Subscribe to weather alerts for specific states
- Receive email notifications for severe weather events
- View current and historical weather data
- Interactive maps showing weather patterns
- User-friendly dashboard for managing subscriptions

## Tech Stack

- **Frontend**: Next.js, React, TailwindCSS
- **Backend**: Next.js API Routes
- **Database**: MySQL with Prisma ORM
- **Email**: Resend API
- **Weather Data**: NOAA API

## Environment Variables

The following environment variables need to be set up:

```
# Database
DATABASE_URL="mysql://username:password@host:port/database"

# Email
RESEND_API_KEY="your-resend-api-key"
EMAIL_FROM="alerts@yourdomain.com"

# Next.js
NEXT_PUBLIC_APP_URL="https://your-app-domain.com"
```

## Development

1. Clone the repository:
```bash
git clone https://github.com/yourusername/nws.git
cd nws
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
- Create a `.env.local` file with the required environment variables

4. Set up the database:
```bash
npm run prisma:generate
npm run db:push
```

5. Run the development server:
```bash
npm run dev
```

## Deployment

This application is configured for deployment on Vercel:

1. Connect your GitHub repository to Vercel
2. Set up the required environment variables in your Vercel project settings
3. Deploy with the default settings

## API Documentation

### POST /api/subscriptions
- Subscribe to weather alerts for specific states
- Request body: `{ email: string, states: string[] }`

### GET /api/subscriptions
- Get all subscriptions or a specific subscription by email
- Query parameters: `email` (optional)

### POST /api/email
- Send a test email alert
- Request body: `{ email: string, alert: object }`

## License

MIT
