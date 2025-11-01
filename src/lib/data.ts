'use server';
import fs from 'fs/promises';
import path from 'path';
import type { Car, Booking } from './types';

// In a serverless environment, only the /tmp directory is writable.
// For local development, we'll fall back to the original src/data directory.
const dataDirectory = process.env.VERCEL ? path.join('/tmp') : path.join(process.cwd(), 'src', 'data');
const carsFilePath = path.join(dataDirectory, 'cars.json');
const bookingsFilePath = path.join(dataDirectory, 'bookings.json');

// Function to initialize data if it doesn't exist in /tmp
async function initializeData<T>(filePath: string, sourcePath: string): Promise<T> {
  try {
    // Check if the file exists in the destination
    await fs.access(filePath);
  } catch (e) {
    // If not, copy it from the source
    const sourceContent = await fs.readFile(sourcePath, 'utf8');
    await fs.mkdir(path.dirname(filePath), { recursive: true });
    await fs.writeFile(filePath, sourceContent, 'utf8');
  }
  const fileContent = await fs.readFile(filePath, 'utf8');
  return JSON.parse(fileContent);
}

async function readJsonFile<T>(filePath: string, sourcePath: string): Promise<T> {
  try {
     if (process.env.VERCEL) {
      return await initializeData<T>(filePath, sourcePath);
    }
    const fileContent = await fs.readFile(filePath, 'utf8');
    return JSON.parse(fileContent);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      // File doesn't exist, return empty array for lists
      if (filePath.includes('cars') || filePath.includes('bookings')) {
        return [] as T;
      }
    }
    throw error;
  }
}

async function writeJsonFile<T>(filePath: string, data: T): Promise<void> {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf8');
}

const localCarsPath = path.join(process.cwd(), 'src', 'data', 'cars.json');
const localBookingsPath = path.join(process.cwd(), 'src', 'data', 'bookings.json');

export async function getCars(): Promise<Car[]> {
  return readJsonFile<Car[]>(carsFilePath, localCarsPath);
}

export async function getAvailableCars(): Promise<Car[]> {
  const cars = await getCars();
  return cars.filter(car => car.available);
}

export async function getCarById(id: number): Promise<Car | undefined> {
    const cars = await getCars();
    return cars.find(car => car.id === id);
}

export async function saveCars(cars: Car[]): Promise<void> {
  return writeJsonFile(carsFilePath, cars);
}

export async function getBookings(): Promise<Booking[]> {
  return readJsonFile<Booking[]>(bookingsFilePath, localBookingsPath);
}

export async function getBookingById(bookingId: string): Promise<Booking | undefined> {
    const bookings = await getBookings();
    return bookings.find(b => b.booking_id === bookingId);
}

export async function saveBookings(bookings: Booking[]): Promise<void> {
  return writeJsonFile(bookingsFilePath, bookings);
}
