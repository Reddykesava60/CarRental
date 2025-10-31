import Image from 'next/image';
import type { Car } from '@/lib/types';
import { getPlaceholderImage } from '@/lib/placeholder-images';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { BookCarDialog } from './book-car-dialog';
import { CarIcon, Gauge, Calendar, Package } from 'lucide-react';
import { Badge } from '../ui/badge';

type CarCardProps = {
  car: Car;
};

export function CarCard({ car }: CarCardProps) {
  const placeholder = getPlaceholderImage(car.image);

  return (
    <Card className="flex flex-col overflow-hidden transition-all hover:shadow-lg">
      <CardHeader className="p-0">
        <div className="relative aspect-[3/2] w-full">
          {placeholder && (
            <Image
              src={placeholder.imageUrl}
              alt={car.name}
              fill
              className="object-cover"
              data-ai-hint={placeholder.imageHint}
            />
          )}
          <Badge className="absolute top-2 right-2">
            {car.quantity} Available
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="flex-1 p-6">
        <CardTitle className="font-headline text-xl mb-2">{car.name}</CardTitle>
        <div className="text-muted-foreground space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <CarIcon className="h-4 w-4" />
            <span>{car.name}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>Model: {car.model}</span>
          </div>
          <div className="flex items-center gap-2">
            <Gauge className="h-4 w-4" />
            <span className="font-semibold text-foreground">
              ₹{car.price.toLocaleString()}{' '}
              <span className="font-normal text-muted-foreground">/ day</span>
            </span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-6 pt-0">
        <BookCarDialog car={car} />
      </CardFooter>
    </Card>
  );
}
