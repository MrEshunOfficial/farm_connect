import React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ShoppingCart } from "lucide-react";

interface OrderFormData {
  quantity: string;
  message: string;
  phone: string;
}

const PlaceAnOrder = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [formData, setFormData] = React.useState<OrderFormData>({
    quantity: "",
    message: "",
    phone: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Order submitted:", formData);
    setIsOpen(false);
    // Here you would typically send the order to your backend
  };

  return (
    <div className="w-full">
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button
            className="w-full flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white"
            variant="default"
          >
            <ShoppingCart className="w-4 h-4" />
            Place Order
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Place Your Order</DialogTitle>
            <DialogDescription>
              Fill in the details below to place your order. We&apos;ll notify
              the seller immediately.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity</Label>
              <Input
                id="quantity"
                name="quantity"
                type="number"
                min="1"
                className="w-full"
                placeholder="Enter quantity"
                value={formData.quantity}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="message">Message to Seller</Label>
              <Textarea
                id="message"
                name="message"
                className="min-h-[100px]"
                placeholder="Any specific requirements or questions?"
                value={formData.message}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Contact Number</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                className="w-full"
                placeholder="Your contact number"
                value={formData.phone}
                onChange={handleInputChange}
                required
              />
              <p className="text-xs text-gray-500">
                This will be shared with the seller for order coordination
              </p>
            </div>
            <DialogFooter className="flex flex-col sm:flex-row gap-2">
              <Button
                type="button"
                variant="outline"
                className="w-full sm:w-auto"
                onClick={() => setIsOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="w-full sm:w-auto bg-blue-500 hover:bg-blue-600"
              >
                Confirm Order
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PlaceAnOrder;
