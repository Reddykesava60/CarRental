'use client';

import { useState } from 'react';
import type { Car } from '@/lib/types';
import type { ImagePlaceholder } from '@/lib/placeholder-images';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { PlusCircle } from 'lucide-react';
import { CarTableRow } from './car-table-row';
import { CarFormDialog } from './car-form-dialog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';

type CarManagementProps = {
  cars: Car[];
  images: ImagePlaceholder[];
};

export function CarManagement({ cars, images }: CarManagementProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const availableCarsCount = cars.filter(car => car.available).length;
  const totalCars = cars.length;

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
            <div>
                <CardTitle>All Cars</CardTitle>
                <CardDescription>
                    {availableCarsCount} of {totalCars} cars available.
                </CardDescription>
            </div>
          <Button onClick={() => setDialogOpen(true)}>
            <PlusCircle className="mr-2 h-4 w-4" /> Add New Car
          </Button>
          <CarFormDialog 
            open={dialogOpen} 
            onOpenChange={setDialogOpen} 
            images={images} 
          />
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Image</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Model</TableHead>
              <TableHead>Price/Day</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {cars.map((car) => (
              <CarTableRow key={car.id} car={car} images={images} />
            ))}
          </TableBody>
          {cars.length === 0 && (
            <TableCaption>No cars found. Add one to get started.</TableCaption>
          )}
        </Table>
      </CardContent>
    </Card>
  );
}
