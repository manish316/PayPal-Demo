import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const addMoneySchema = z.object({
  amount: z.string().min(1, "Amount is required").refine((val) => {
    const num = parseFloat(val);
    return !isNaN(num) && num > 0;
  }, "Amount must be greater than 0"),
});

type AddMoney = z.infer<typeof addMoneySchema>;

interface AddMoneyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AddMoneyModal({ isOpen, onClose }: AddMoneyModalProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<AddMoney>({
    resolver: zodResolver(addMoneySchema),
    defaultValues: {
      amount: "",
    },
  });

  const addMoneyMutation = useMutation({
    mutationFn: async (data: AddMoney) => {
      const response = await apiRequest("POST", "/api/add-money", data);
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Money Added Successfully",
        description: data.message,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
      queryClient.invalidateQueries({ queryKey: ["/api/transactions"] });
      form.reset();
      onClose();
    },
    onError: (error: any) => {
      toast({
        title: "Failed to Add Money",
        description: error.message || "An error occurred while adding money",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: AddMoney) => {
    addMoneyMutation.mutate(data);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md mx-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-paypal-dark">Add Money</DialogTitle>
        </DialogHeader>
        
        <div className="mb-4 p-4 bg-paypal-gray rounded-lg">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-paypal-primary rounded flex items-center justify-center">
              <span className="text-white text-xs font-bold">BOA</span>
            </div>
            <div>
              <p className="font-medium text-paypal-dark">Bank of America</p>
              <p className="text-xs text-gray-500">•••• 1234</p>
            </div>
          </div>
        </div>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-paypal-dark">Amount</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        className="pl-8 border-gray-300 focus:ring-paypal-secondary focus:border-transparent"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="text-xs text-gray-500 mt-2">
              No fees • Available instantly
            </div>
            
            <Button
              type="submit"
              disabled={addMoneyMutation.isPending}
              className="w-full bg-paypal-secondary text-white hover:bg-paypal-primary transition-colors"
            >
              {addMoneyMutation.isPending ? "Adding..." : "Add Money"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}