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