/**
 * Utility Functions
 * 
 * This file contains utility functions used throughout the application.
 * - cn: A utility function for merging class names
 */

import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Merges class names using clsx and tailwind-merge
 * @param inputs - Class names to merge
 * @returns Merged class names string
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
} 