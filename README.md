# Car Rental Simplified

This project is a modern, full-stack web application designed as a simplified prototype for a car rental service. It provides a seamless user experience for customers to browse and book cars, and a comprehensive dashboard for administrators to manage the vehicle fleet and view all rental bookings.

## Key Features

### Customer-Facing Interface
- **Browse Available Cars**: A clean, responsive grid displays all cars currently available for rent.
- **Detailed Car Information**: Each car listing includes a photo, name, model year, and daily rental price.
- **Simple Booking Process**: Users can easily book a car by providing their name and desired rental duration through an intuitive dialog.
- **Booking Confirmation**: Upon successful booking, the user receives a unique booking ID for their records.
- **Car Return**: A dedicated page allows customers to return a car by entering their booking ID.

### Administrative Dashboard (`/admin`)
- **Car Management**: A powerful table view lists all cars in the fleet. Admins can:
    - View car details including image, name, model, price, and availability status.
    - Toggle a car's availability with a single click.
    - Edit existing car details.
    - Add new cars to the fleet through a form dialog.
- **Booking Management**: A separate tab displays all bookings (both active and returned). Admins can:
    - View details for every booking, including booking ID, customer name, car, duration, and status.
    - Manually mark an active booking as "Returned."
- **Real-time Counts**: The dashboard shows at-a-glance counts of available cars and active bookings.

## Technology Stack

This application is built with a modern, robust technology stack, prioritizing developer experience and performance.

- **Framework**: [Next.js](https://nextjs.org/) (with App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **UI Library**: [React](https://react.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [ShadCN UI](https://ui.shadcn.com/)
- **Server Logic**: Next.js Server Actions
- **Data Persistence**: Local JSON files (`src/data/`) are used as a mock database.
- **AI Integration**: [Firebase Genkit](https://firebase.google.com/docs/genkit) for potential AI features.
# CarRental
