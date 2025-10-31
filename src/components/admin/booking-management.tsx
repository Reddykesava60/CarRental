'use client';

import { useTransition } from 'react';
import { useToast } from '@/hooks/use-toast';
import type { Booking } from '@/lib/types';
import { returnCar } from '@/lib/actions';
import {
  Table,
  TableBody,
  TableCaption,
TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '../ui/button';
import { Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

type BookingManagementProps = {
  bookings: Booking[];
};

function ReturnButton({ bookingId, status }: { bookingId: string, status: string }) {
    const [isPending, startTransition] = useTransition();
    const { toast } = useToast();

    const handleReturn = () => {
        const formData = new FormData();
        formData.append('bookingId', bookingId);
        startTransition(async () => {
            const result = await returnCar({}, formData);
            toast({
                variant: result.error ? 'destructive' : 'default',
                title: result.error ? 'Action Failed' : 'Action Successful',
                description: result.message,
            });
        });
    }

    if(status === 'returned') {
        return <Button variant="outline" size="sm" disabled>Returned</Button>
    }

    return (
        <Button onClick={handleReturn} disabled={isPending} size="sm">
            {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Mark as Returned
        </Button>
    )
}

export function BookingManagement({ bookings }: BookingManagementProps) {

  return (
    <Card>
        <CardHeader>
            <CardTitle>All Bookings</CardTitle>
        </CardHeader>
        <CardContent>
            <Table>
            <TableHeader>
                <TableRow>
                <TableHead>Booking ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Car</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {bookings.map((booking) => (
                <TableRow key={booking.booking_id}>
                    <TableCell className="font-mono text-xs">{booking.booking_id}</TableCell>
                    <TableCell className="font-medium">{booking.customer_name}</TableCell>
                    <TableCell>{booking.car_name}</TableCell>
                    <TableCell>{booking.duration_days} days</TableCell>
                    <TableCell>
                    <Badge variant={booking.status === 'booked' ? 'destructive' : 'default'}>
                        {booking.status}
                    </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                        <ReturnButton bookingId={booking.booking_id} status={booking.status} />
                    </TableCell>
                </TableRow>
                ))}
            </TableBody>
            {bookings.length === 0 && (
                <TableCaption>No bookings have been made yet.</TableCaption>
            )}
            </Table>
        </CardContent>
    </Card>
  );
}
