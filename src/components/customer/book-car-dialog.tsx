'use client';

import { useState, useEffect, useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { useToast } from '@/hooks/use-toast';
import { bookCar } from '@/lib/actions';
import type { Car } from '@/lib/types';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';

type BookCarDialogProps = {
  car: Car;
};

const initialState = {
  message: '',
  bookingId: '',
  error: false,
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
      {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
      Confirm Booking
    </Button>
  );
}

export function BookCarDialog({ car }: BookCarDialogProps) {
  const [open, setOpen] = useState(false);
  const [state, formAction] = useActionState(bookCar, initialState);
  const { toast } = useToast();

  useEffect(() => {
    if (state.message && !state.error) {
      // Keep dialog open to show success message
    } else if (state.message && state.error) {
      toast({
        variant: 'destructive',
        title: 'Booking Failed',
        description: state.message,
      });
    }
  }, [state, toast]);

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      // Reset form state when dialog closes
      state.message = '';
      state.error = false;
      state.bookingId = '';
    }
    setOpen(isOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">Book Now</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        {state.message && !state.error ? (
          <div className="text-center py-8">
            <DialogHeader>
              <DialogTitle className="font-headline text-2xl">Booking Confirmed!</DialogTitle>
              <DialogDescription>
                Your booking ID is <strong className="text-primary">{state.bookingId}</strong>. Please save it for your records.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="mt-4">
              <DialogClose asChild>
                <Button type="button" variant="secondary" className="w-full">
                  Close
                </Button>
              </DialogClose>
            </DialogFooter>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="font-headline">Book: {car.name}</DialogTitle>
              <DialogDescription>
                Enter your details to finalize your booking. Price is ₹{car.price}/day.
              </DialogDescription>
            </DialogHeader>
            <form action={formAction}>
              <input type="hidden" name="carId" value={car.id} />
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="customer_name" className="text-right">
                    Name
                  </Label>
                  <Input id="customer_name" name="customer_name" className="col-span-3" required />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="duration_days" className="text-right">
                    Duration (Days)
                  </Label>
                  <Input id="duration_days" name="duration_days" type="number" min="1" defaultValue="1" className="col-span-3" required />
                </div>
              </div>
              <DialogFooter>
                <SubmitButton />
              </DialogFooter>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
