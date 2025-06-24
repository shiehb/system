import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function AddEstablishment() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Add Establishment</CardTitle>
        <CardDescription>Enter the establishment details</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="name">Name of Establishment</label>
          <Input id="name" placeholder="Enter name" />
        </div>
        <div className="space-y-2">
          <label htmlFor="address">Address</label>
          <Input id="address" placeholder="Enter address" />
        </div>
        <div className="space-y-2">
          <label htmlFor="coordinates">Coordinates</label>
          <Input id="coordinates" placeholder="Enter coordinates" />
        </div>
        <div className="space-y-2">
          <label htmlFor="year">Year of Establishment</label>
          <Input id="year" placeholder="Enter year" type="number" />
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full">Save Establishment</Button>
      </CardFooter>
    </Card>
  );
}
