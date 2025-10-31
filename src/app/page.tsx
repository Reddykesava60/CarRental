import { getAvailableCars } from '@/lib/data';
import { CarCard } from '@/components/customer/car-card';

export default async function Home() {
  const availableCars = await getAvailableCars();

  return (
    <div className="container mx-auto px-4 py-8">
      <section className="text-center mb-12">
        <h1 className="font-headline text-4xl md:text-5xl font-bold tracking-tight">
          Find Your Perfect Ride
        </h1>
        <p className="text-lg text-muted-foreground mt-2">
          Browse our selection of available cars and book your journey today.
        </p>
      </section>

      {availableCars.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {availableCars.map((car) => (
            <CarCard key={car.id} car={car} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 border-2 border-dashed rounded-lg">
          <p className="text-muted-foreground text-lg">
            We're sorry, but there are no cars available for rent at the moment.
          </p>
          <p className="text-muted-foreground">Please check back later.</p>
        </div>
      )}
    </div>
  );
}
