import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

async function main() {
  // First, create all states
  const states = [
    { id: 'AL', name: 'Alabama' },
    { id: 'AK', name: 'Alaska' },
    { id: 'AZ', name: 'Arizona' },
    { id: 'AR', name: 'Arkansas' },
    { id: 'CA', name: 'California' },
    { id: 'FL', name: 'Florida' },
    { id: 'OK', name: 'Oklahoma' },
    { id: 'NY', name: 'New York' },
    { id: 'TX', name: 'Texas' },
    { id: 'LA', name: 'Louisiana' }
  ];

  console.log('Creating states...');
  for (const state of states) {
    await prisma.state.upsert({
      where: { id: state.id },
      update: {},
      create: state,
    });
  }

  // Example zip codes
  const zipCodes = [
    { id: '1', code: '90210', city: 'Beverly Hills', stateId: 'CA', latitude: 34.0901, longitude: -118.4065 },
    { id: '2', code: '10001', city: 'New York', stateId: 'NY', latitude: 40.7506, longitude: -73.9971 },
    { id: '3', code: '33101', city: 'Miami', stateId: 'FL', latitude: 25.7743, longitude: -80.1937 },
    { id: '4', code: '73101', city: 'Oklahoma City', stateId: 'OK', latitude: 35.4676, longitude: -97.5164 },
    { id: '5', code: '70112', city: 'New Orleans', stateId: 'LA', latitude: 29.9511, longitude: -90.0715 }
  ];

  console.log('Creating zip codes...');
  for (const zipCode of zipCodes) {
    await prisma.zipCode.upsert({
      where: { id: zipCode.id },
      update: {},
      create: zipCode,
    });
  }

  console.log('Adding additional ZIP coverage...');
  await prisma.zipCode.createMany({
    data: [
      // West Coast
      { id: 'w1', code: '90001', city: 'Los Angeles', stateId: 'CA', latitude: 33.9731, longitude: -118.2479 },
      { id: 'w2', code: '94103', city: 'San Francisco', stateId: 'CA', latitude: 37.7739, longitude: -122.4312 },
      { id: 'w3', code: '97201', city: 'Portland', stateId: 'OR', latitude: 45.5122, longitude: -122.6587 },
      { id: 'w4', code: '98101', city: 'Seattle', stateId: 'WA', latitude: 47.6101, longitude: -122.3344 },

      // Southwest
      { id: 'sw1', code: '85001', city: 'Phoenix', stateId: 'AZ', latitude: 33.4484, longitude: -112.0740 },
      { id: 'sw2', code: '87501', city: 'Santa Fe', stateId: 'NM', latitude: 35.6869, longitude: -105.9378 },
      { id: 'sw3', code: '79901', city: 'El Paso', stateId: 'TX', latitude: 31.7587, longitude: -106.4869 },

      // Midwest
      { id: 'mw1', code: '60601', city: 'Chicago', stateId: 'IL', latitude: 41.8853, longitude: -87.6229 },
      { id: 'mw2', code: '48201', city: 'Detroit', stateId: 'MI', latitude: 42.3439, longitude: -83.0586 },
      { id: 'mw3', code: '55401', city: 'Minneapolis', stateId: 'MN', latitude: 44.9833, longitude: -93.2700 },

      // South
      { id: 's1', code: '73301', city: 'Austin', stateId: 'TX', latitude: 30.2672, longitude: -97.7431 },
      { id: 's2', code: '30301', city: 'Atlanta', stateId: 'GA', latitude: 33.7490, longitude: -84.3880 },
      { id: 's3', code: '70112', city: 'New Orleans', stateId: 'LA', latitude: 29.9511, longitude: -90.0715 },
      { id: 's4', code: '33101', city: 'Miami', stateId: 'FL', latitude: 25.7617, longitude: -80.1918 },

      // Northeast
      { id: 'ne1', code: '10001', city: 'New York', stateId: 'NY', latitude: 40.7128, longitude: -74.0060 },
      { id: 'ne2', code: '19104', city: 'Philadelphia', stateId: 'PA', latitude: 39.9526, longitude: -75.1652 },
      { id: 'ne3', code: '02108', city: 'Boston', stateId: 'MA', latitude: 42.3601, longitude: -71.0589 },
      { id: 'ne4', code: '20001', city: 'Washington', stateId: 'DC', latitude: 38.9072, longitude: -77.0369 },

      // Central
      { id: 'c1', code: '64101', city: 'Kansas City', stateId: 'MO', latitude: 39.0997, longitude: -94.5786 },
      { id: 'c2', code: '73102', city: 'Oklahoma City', stateId: 'OK', latitude: 35.4676, longitude: -97.5164 },
      { id: 'c3', code: '80202', city: 'Denver', stateId: 'CO', latitude: 39.7392, longitude: -104.9903 },

      // Alaska & Hawaii
      { id: 'ak1', code: '99501', city: 'Anchorage', stateId: 'AK', latitude: 61.2175, longitude: -149.8584 },
      { id: 'hi1', code: '96801', city: 'Honolulu', stateId: 'HI', latitude: 21.3069, longitude: -157.8583 }
    ],
    skipDuplicates: true,
  });

  // Add example weather events
  const events = [
    {
      type: 'HURRICANE' as const,
      severity: 'EXTREME' as const,
      date: new Date('2023-09-15'),
      description: 'Hurricane making landfall in Florida',
      stateId: 'FL',
      data: { windSpeed: 150, pressure: 950, category: 4 },
    },
    {
      type: 'TORNADO' as const,
      severity: 'SEVERE' as const,
      date: new Date('2023-05-20'),
      description: 'F3 Tornado touchdown in Oklahoma',
      stateId: 'OK',
      data: { windSpeed: 165, path: '2.5 miles', fatalities: 0 },
    },
    {
      type: 'FLOOD' as const,
      severity: 'MODERATE' as const,
      date: new Date('2023-08-10'),
      description: 'Flash flooding in New Orleans',
      stateId: 'LA',
      data: { rainfall: 12, affectedAreas: ['Downtown', 'French Quarter'] },
    },
    {
      type: 'STORM' as const,
      severity: 'SEVERE' as const,
      date: new Date('2023-07-05'),
      description: 'Severe thunderstorm in California',
      stateId: 'CA',
      data: { windSpeed: 75, hailSize: 1.5 },
    }
  ];

  console.log('Creating example events...');
  for (const event of events) {
    await prisma.event.create({
      data: event,
    });
  }

  console.log('Seeding completed.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 