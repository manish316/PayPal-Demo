import { X } from "lucide-react";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { sendMoneySchema, type SendMoney } from "@shared/schema";
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

interface SendMoneyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SendMoneyModal({ isOpen, onClose }: SendMoneyModalProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<SendMoney>({
    resolver: zodResolver(sendMoneySchema),
    defaultValues: {
      recipientEmail: "",
      amount: "",
      note: "",
    },
  });

  const sendMoneyMutation = useMutation({
    mutationFn: async (data: SendMoney) => {
      const response = await apiRequest("POST", "/api/send-money", data);
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Money Sent Successfully",
        description: data.message,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
      queryClient.invalidateQueries({ queryKey: ["/api/transactions"] });
      form.reset();
      onClose();
    },
    onError: (error: any) => {
      toast({
        title: "Failed to Send Money",
        description: error.message || "An error occurred while sending money",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: SendMoney) => {
    sendMoneyMutation.mutate(data);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md mx-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-paypal-dark">Send Money</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="recipientEmail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-paypal-dark">Send to</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Email or phone number"
                      className="border-gray-300 focus:ring-paypal-secondary focus:border-transparent"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
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
            
            <FormField
              control={form.control}
              name="note"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-paypal-dark">Note (optional)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="What's this for?"
                      className="border-gray-300 focus:ring-paypal-secondary focus:border-transparent"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <Button
              type="submit"
              disabled={sendMoneyMutation.isPending}
              className="w-full bg-paypal-secondary text-white hover:bg-paypal-primary transition-colors"
            >
              {sendMoneyMutation.isPending ? "Sending..." : "Send Money"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
