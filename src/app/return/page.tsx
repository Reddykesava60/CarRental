import { ReturnCarForm } from "@/components/customer/return-car-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function ReturnCarPage() {
  return (
    <div className="container mx-auto px-4 py-8 flex justify-center items-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="font-headline text-2xl">Return a Car</CardTitle>
          <CardDescription>
            Enter your booking ID to complete your rental return.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ReturnCarForm />
        </CardContent>
      </Card>
    </div>
  );
}
