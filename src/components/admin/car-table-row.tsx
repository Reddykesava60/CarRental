'use client';

import { useState, useTransition } from 'react';
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';
import type { Car } from '@/lib/types';
import type { ImagePlaceholder } from '@/lib/placeholder-images';
import { getPlaceholderImage } from '@/lib/placeholder-images';
import { toggleCarAvailability } from '@/lib/actions';
import { Button } from '@/components/ui/button';
import { TableCell, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { CarFormDialog } from './car-form-dialog';
import { Edit } from 'lucide-react';

type CarTableRowProps = {
  car: Car;
  images: ImagePlaceholder[];
};

export function CarTableRow({ car, images }: CarTableRowProps) {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const placeholder = getPlaceholderImage(car.image);
  const [dialogOpen, setDialogOpen] = useState(false);


  const handleToggleAvailability = () => {
    startTransition(async () => {
      const result = await toggleCarAvailability(car.id);
      toast({
        variant: result.error ? 'destructive' : 'default',
        title: result.error ? 'Update Failed' : 'Update Successful',
        description: result.message,
      });
    });
  };

  return (
    <TableRow>
      <TableCell>
        {placeholder && (
          <Image
            src={placeholder.imageUrl}
            alt={car.name}
            width={80}
            height={53}
            className="rounded-md object-cover"
            data-ai-hint={placeholder.imageHint}
          />
        )}
      </TableCell>
      <TableCell className="font-medium">{car.name}</TableCell>
      <TableCell>{car.model}</TableCell>
      <TableCell>₹{car.price.toLocaleString()}</TableCell>
      <TableCell>
        <div className="flex flex-col gap-1">
          <Badge variant={car.available ? 'default' : 'secondary'}>
            {car.available ? 'Available' : 'Unavailable'}
          </Badge>
          <span className="text-xs text-muted-foreground">({car.quantity} in stock)</span>
        </div>
      </TableCell>
      <TableCell className="text-right space-x-2">
        <div className="flex items-center justify-end gap-2">
            <Switch
              checked={car.available}
              onCheckedChange={handleToggleAvailability}
              disabled={isPending || car.quantity === 0}
              aria-label="Toggle car availability"
            />
            <Button variant="ghost" size="icon" onClick={() => setDialogOpen(true)}>
                <Edit className="h-4 w-4" />
                <span className="sr-only">Edit Car</span>
            </Button>
            <CarFormDialog 
                open={dialogOpen} 
                onOpenChange={setDialogOpen}
                car={car}
                images={images}
            />
        </div>
      </TableCell>
    </TableRow>
  );
}
