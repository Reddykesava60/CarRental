'use client';

import { useEffect } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { useToast } from '@/hooks/use-toast';
import { returnCar } from '@/lib/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';

const initialState = {
  message: '',
  error: false,
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
      Process Return
    </Button>
  );
}

export function ReturnCarForm() {
  const [state, formAction] = useFormState(returnCar, initialState);
  const { toast } = useToast();

  useEffect(() => {
    if (state.message) {
      toast({
        variant: state.error ? 'destructive' : 'default',
        title: state.error ? 'Return Failed' : 'Return Successful',
        description: state.message,
      });
    }
  }, [state, toast]);

  return (
    <form action={formAction} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="bookingId">Booking ID</Label>
        <Input
          id="bookingId"
          name="bookingId"
          placeholder="e.g., BK-1234567890"
          required
        />
      </div>
      <SubmitButton />
    </form>
  );
}
