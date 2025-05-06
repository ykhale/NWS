/**
 * Heat Index Page Route
 * 
 * This file defines the route for the heat index map.
 */

import HeatIndexPage from '@/app/heat-index/HeatIndexPage';

export const metadata = {
  title: 'Heat Index Map | Weather Alert System',
  description: 'View current heat index levels across the United States with our interactive heat map.',
};

export default function HeatIndex() {
  return <HeatIndexPage />;
}