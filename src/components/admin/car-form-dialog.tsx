'use client';

import { useEffect, useState, useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { useToast } from '@/hooks/use-toast';
import { addCar, updateCar } from '@/lib/actions';
import type { Car } from '@/lib/types';
import type { ImagePlaceholder } from '@/lib/placeholder-images';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

type CarFormDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  car?: Car;
  images: ImagePlaceholder[];
};

const initialState = {
  message: '',
  error: false,
};

function SubmitButton({ isEdit }: { isEdit: boolean }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
      {isEdit ? 'Save Changes' : 'Add Car'}
    </Button>
  );
}

export function CarFormDialog({ open, onOpenChange, car, images }: CarFormDialogProps) {
  const isEdit = !!car;
  const action = isEdit ? updateCar : addCar;
  const [state, formAction] = useActionState(action, initialState);
  const { toast } = useToast();

  useEffect(() => {
    if (state.message) {
      toast({
        variant: state.error ? 'destructive' : 'default',
        title: state.error ? 'Action Failed' : 'Action Successful',
        description: state.message,
      });
      if (!state.error) {
        onOpenChange(false);
      }
    }
  }, [state, toast, onOpenChange]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="font-headline">{isEdit ? 'Edit Car' : 'Add New Car'}</DialogTitle>
          <DialogDescription>
            {isEdit ? 'Update the details of the car.' : 'Fill in the details to add a new car.'}
          </DialogDescription>
        </DialogHeader>
        <form action={formAction}>
          {isEdit && <input type="hidden" name="id" value={car.id} />}
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Car Name</Label>
              <Input id="name" name="name" defaultValue={car?.name} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="model">Model Year</Label>
              <Input id="model" name="model" defaultValue={car?.model} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="price">Price / Day</Label>
              <Input id="price" name="price" type="number" defaultValue={car?.price} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="image">Car Image</Label>
               <Select name="image" defaultValue={car?.image}>
                <SelectTrigger id="image">
                  <SelectValue placeholder="Select an image" />
                </SelectTrigger>
                <SelectContent>
                  {images.map((img) => (
                    <SelectItem key={img.id} value={img.id}>
                      {img.description}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <SubmitButton isEdit={isEdit} />
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
