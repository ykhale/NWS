import { PrismaClient } from '@prisma/client';

// Prevent multiple instances of Prisma Client in development
declare global {
  var prisma: PrismaClient | undefined;
}

export const prisma = global.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}

export type WeatherEvent = {
  type: 'HURRICANE' | 'HAIL' | 'TORNADO' | 'FLOOD' | 'STORM' | 'OTHER';
  severity: 'EXTREME' | 'SEVERE' | 'MODERATE' | 'MINOR';
  date: Date;
  description: string;
  stateId: string;
  zipCode?: string;
  data: any;
};

export async function createEvent(event: WeatherEvent) {
  const zipCode = event.zipCode 
    ? await prisma.zipCode.findUnique({ where: { code: event.zipCode } })
    : null;

  return prisma.event.create({
    data: {
      type: event.type,
      severity: event.severity,
      date: event.date,
      description: event.description,
      stateId: event.stateId,
      zipCodeId: zipCode?.id,
      data: event.data,
    },
  });
}

export async function getEventsByState(stateId: string) {
  return prisma.event.findMany({
    where: { stateId },
    include: {
      state: true,
      zipCode: true,
    },
    orderBy: { date: 'desc' },
  });
}

export async function getEventsByZipCode(zipCode: string) {
  const location = await prisma.zipCode.findUnique({
    where: { code: zipCode },
  });

  if (!location) return [];

  return prisma.event.findMany({
    where: { zipCodeId: location.id },
    include: {
      state: true,
      zipCode: true,
    },
    orderBy: { date: 'desc' },
  });
}

export async function getEventsByDateRange(startDate: Date, endDate: Date) {
  return prisma.event.findMany({
    where: {
      date: {
        gte: startDate,
        lte: endDate,
      },
    },
    include: {
      state: true,
      zipCode: true,
    },
    orderBy: { date: 'desc' },
  });
}

export async function getEventStats(stateId?: string) {
  const where = stateId ? { stateId } : {};
  
  return prisma.event.groupBy({
    by: ['type', 'severity'],
    where,
    _count: true,
  });
} 