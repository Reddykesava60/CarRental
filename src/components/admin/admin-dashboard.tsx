'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CarManagement } from './car-management';
import { BookingManagement } from './booking-management';
import type { Car, Booking } from '@/lib/types';
import type { ImagePlaceholder } from '@/lib/placeholder-images';

type AdminDashboardProps = {
  initialCars: Car[];
  initialBookings: Booking[];
  images: ImagePlaceholder[];
};

export function AdminDashboard({ initialCars, initialBookings, images }: AdminDashboardProps) {
  return (
    <Tabs defaultValue="cars" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="cars">Manage Cars</TabsTrigger>
        <TabsTrigger value="bookings">View Bookings</TabsTrigger>
      </TabsList>
      <TabsContent value="cars">
        <CarManagement cars={initialCars} images={images} />
      </TabsContent>
      <TabsContent value="bookings">
        <BookingManagement bookings={initialBookings} />
      </TabsContent>
    </Tabs>
  );
}
