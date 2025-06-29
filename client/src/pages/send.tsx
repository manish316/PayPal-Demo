import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { sendMoneySchema, type SendMoney } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { MobileContainer } from "@/components/layout/mobile-container";
import { BottomNavigation } from "@/components/layout/bottom-navigation";
import { ArrowLeft } from "lucide-react";
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

export default function Send() {
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
    <MobileContainer>
      <header className="bg-paypal-primary text-white p-4">
        <div className="flex items-center space-x-3">
          <button className="p-2 rounded-full bg-white bg-opacity-20 hover:bg-opacity-30 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-semibold">Send Money</h1>
        </div>
      </header>

      <div className="px-4 py-6 pb-24">
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="recipientEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-paypal-dark">Send to</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Email or phone number"
                        className="h-12 border-gray-300 focus:ring-paypal-secondary focus:border-transparent rounded-xl"
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
                        <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 text-lg">$</span>
                        <Input
                          type="number"
                          step="0.01"
                          placeholder="0.00"
                          className="h-12 pl-10 border-gray-300 focus:ring-paypal-secondary focus:border-transparent rounded-xl text-lg"
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
                        className="h-12 border-gray-300 focus:ring-paypal-secondary focus:border-transparent rounded-xl"
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
                className="w-full h-12 bg-paypal-secondary text-white hover:bg-paypal-primary transition-colors rounded-xl text-lg font-semibold"
              >
                {sendMoneyMutation.isPending ? "Sending..." : "Send Money"}
              </Button>
            </form>
          </Form>
        </div>
      </div>

      <BottomNavigation />
    </MobileContainer>
  );
}
