import fs from 'fs/promises';
import path from 'path';
import type { Car, Booking } from './types';

const dataDirectory = path.join(process.cwd(), 'src', 'data');
const carsFilePath = path.join(dataDirectory, 'cars.json');
const bookingsFilePath = path.join(dataDirectory, 'bookings.json');

async function readJsonFile<T>(filePath: string): Promise<T> {
  try {
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
  await fs.mkdir(dataDirectory, { recursive: true });
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf8');
}

export async function getCars(): Promise<Car[]> {
  return readJsonFile<Car[]>(carsFilePath);
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
  return readJsonFile<Booking[]>(bookingsFilePath);
}

export async function getBookingById(bookingId: string): Promise<Booking | undefined> {
    const bookings = await getBookings();
    return bookings.find(b => b.booking_id === bookingId);
}

export async function saveBookings(bookings: Booking[]): Promise<void> {
  return writeJsonFile(bookingsFilePath, bookings);
}
