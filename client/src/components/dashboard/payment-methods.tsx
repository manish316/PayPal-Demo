import { ChevronRight, CreditCard, Building } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import type { PaymentMethod } from "@shared/schema";

export function PaymentMethods() {
  const { data: paymentMethods = [] } = useQuery<PaymentMethod[]>({
    queryKey: ["/api/payment-methods"],
  });

  const getCardIcon = (provider: string) => {
    switch (provider.toLowerCase()) {
      case "visa":
        return "bg-gradient-to-r from-blue-600 to-blue-400";
      case "mastercard":
        return "bg-gradient-to-r from-red-600 to-orange-400";
      default:
        return "bg-gradient-to-r from-gray-600 to-gray-400";
    }
  };

  const getProviderName = (provider: string) => {
    switch (provider.toLowerCase()) {
      case "visa":
        return "Visa";
      case "mastercard":
        return "Mastercard";
      default:
        return provider;
    }
  };

  return (
    <div className="px-4 mt-8">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-paypal-dark">Payment Methods</h3>
        <button className="text-paypal-secondary text-sm font-medium hover:text-paypal-primary transition-colors">
          Manage
        </button>
      </div>
      
      <div className="space-y-3">
        {paymentMethods.map((method) => (
          <div
            key={method.id}
            className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between hover:shadow-md transition-shadow"
          >
            <div className="flex items-center space-x-3">
              {method.type === "card" ? (
                <div className={`w-12 h-8 ${getCardIcon(method.provider)} rounded flex items-center justify-center`}>
                  <CreditCard className="w-5 h-5 text-white" />
                </div>
              ) : (
                <div className="w-12 h-8 bg-paypal-primary rounded flex items-center justify-center">
                  <Building className="w-4 h-4 text-white" />
                </div>
              )}
              <div>
                {method.type === "card" ? (
                  <>
                    <p className="font-medium text-paypal-dark">•••• {method.lastFour}</p>
                    <p className="text-xs text-gray-500">Expires {method.expiryDate}</p>
                  </>
                ) : (
                  <>
                    <p className="font-medium text-paypal-dark">{method.bankName}</p>
                    <p className="text-xs text-gray-500">•••• {method.lastFour}</p>
                  </>
                )}
              </div>
            </div>
            <div className="text-right">
              {method.isPrimary ? (
                <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full">
                  Primary
                </span>
              ) : (
                <ChevronRight className="w-4 h-4 text-gray-400" />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
