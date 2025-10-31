import { getCars, getBookings } from '@/lib/data';
import { AdminDashboard } from '@/components/admin/admin-dashboard';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  const cars = await getCars();
  const bookings = await getBookings();
  const images = PlaceHolderImages;

  return (
    <div className="container mx-auto py-8">
      <h1 className="font-headline text-3xl font-bold mb-6">Admin Dashboard</h1>
      <AdminDashboard initialCars={cars} initialBookings={bookings} images={images} />
    </div>
  );
}
