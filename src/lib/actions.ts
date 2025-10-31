'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { getCars, getBookings, saveCars, saveBookings, getCarById, getBookingById } from './data';
import type { Car, Booking } from './types';

const bookCarSchema = z.object({
  carId: z.coerce.number(),
  customer_name: z.string().min(3, 'Name must be at least 3 characters'),
  duration_days: z.coerce.number().min(1, 'Duration must be at least 1 day'),
});

export async function bookCar(prevState: any, formData: FormData) {
  const validatedFields = bookCarSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!validatedFields.success) {
    return {
      message: validatedFields.error.flatten().fieldErrors.customer_name?.[0] || validatedFields.error.flatten().fieldErrors.duration_days?.[0] || 'Invalid data',
      error: true,
      bookingId: '',
    };
  }

  const { carId, customer_name, duration_days } = validatedFields.data;

  try {
    const cars = await getCars();
    const bookings = await getBookings();
    const carToBook = cars.find(c => c.id === carId);

    if (!carToBook || !carToBook.available) {
      return { message: 'This car is not available for booking.', error: true, bookingId: '' };
    }

    carToBook.available = false;

    const newBooking: Booking = {
      booking_id: `BK-${Date.now()}`,
      car_id: carId,
      car_name: carToBook.name,
      customer_name,
      duration_days,
      booking_date: new Date().toISOString(),
      status: 'booked',
    };

    bookings.unshift(newBooking);

    await saveCars(cars);
    await saveBookings(bookings);

    revalidatePath('/');
    revalidatePath('/admin');

    return { message: 'Booking successful!', error: false, bookingId: newBooking.booking_id };
  } catch (e) {
    return { message: 'Server error: Could not complete booking.', error: true, bookingId: '' };
  }
}

const returnCarSchema = z.object({
    bookingId: z.string().min(1, 'Booking ID is required'),
});

export async function returnCar(prevState: any, formData: FormData) {
    const validatedFields = returnCarSchema.safeParse(Object.fromEntries(formData.entries()));

    if (!validatedFields.success) {
        return { message: 'Invalid Booking ID.', error: true };
    }

    const { bookingId } = validatedFields.data;

    try {
        const bookings = await getBookings();
        const bookingToReturn = bookings.find(b => b.booking_id === bookingId);

        if (!bookingToReturn) {
            return { message: 'Booking ID not found.', error: true };
        }
        if(bookingToReturn.status === 'returned') {
            return { message: 'This car has already been returned.', error: true };
        }
        
        bookingToReturn.status = 'returned';

        const cars = await getCars();
        const carToMakeAvailable = cars.find(c => c.id === bookingToReturn.car_id);
        if (carToMakeAvailable) {
            carToMakeAvailable.available = true;
            await saveCars(cars);
        }

        await saveBookings(bookings);

        revalidatePath('/');
        revalidatePath('/return');
        revalidatePath('/admin');


        return { message: `Booking ${bookingId} has been marked as returned.`, error: false };

    } catch (e) {
        return { message: 'Server error: Could not process return.', error: true };
    }
}


const carSchema = z.object({
  id: z.coerce.number().optional(),
  name: z.string().min(1, 'Name is required'),
  model: z.string().min(4, 'Model year is required'),
  price: z.coerce.number().min(1, 'Price must be a positive number'),
  image: z.string().min(1, 'Image is required'),
});


export async function addCar(prevState: any, formData: FormData) {
    const validatedFields = carSchema.safeParse(Object.fromEntries(formData.entries()));

    if (!validatedFields.success) {
        return { message: 'Invalid car data.', error: true };
    }

    try {
        const cars = await getCars();
        const newId = cars.length > 0 ? Math.max(...cars.map(c => c.id)) + 1 : 1;
        const newCar: Car = {
            ...validatedFields.data,
            id: newId,
            available: true,
        };

        cars.push(newCar);
        await saveCars(cars);
        revalidatePath('/admin');
        return { message: `Car "${newCar.name}" added successfully.`, error: false };
    } catch (e) {
        return { message: 'Server error: Could not add car.', error: true };
    }
}


export async function updateCar(prevState: any, formData: FormData) {
    const validatedFields = carSchema.safeParse(Object.fromEntries(formData.entries()));

    if (!validatedFields.success || !validatedFields.data.id) {
        return { message: 'Invalid car data.', error: true };
    }
    const { id, ...carData } = validatedFields.data;

    try {
        const cars = await getCars();
        const carIndex = cars.findIndex(c => c.id === id);

        if (carIndex === -1) {
            return { message: 'Car not found.', error: true };
        }
        
        cars[carIndex] = { ...cars[carIndex], ...carData };

        await saveCars(cars);
        revalidatePath('/admin');
        return { message: `Car "${carData.name}" updated successfully.`, error: false };
    } catch (e) {
        return { message: 'Server error: Could not update car.', error: true };
    }
}


export async function toggleCarAvailability(carId: number) {
    try {
        const cars = await getCars();
        const car = cars.find(c => c.id === carId);

        if (!car) {
            return { message: 'Car not found.', error: true };
        }

        car.available = !car.available;
        await saveCars(cars);

        revalidatePath('/admin');
        revalidatePath('/');
        return { message: `Availability for "${car.name}" updated.`, error: false };
    } catch (e) {
        return { message: 'Server error: Could not update availability.', error: true };
    }
}
