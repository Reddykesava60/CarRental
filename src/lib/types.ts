export type Car = {
  id: number;
  name: string;
  model: string;
  price: number; // Price per day
  available: boolean;
  image: string;
};

export type Booking = {
  booking_id: string;
  car_id: number;
  car_name: string;
  customer_name: string;
  duration_days: number;
  booking_date: string;
  status: 'booked' | 'returned';
};
