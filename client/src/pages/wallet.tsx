import { ChevronRight, CreditCard, Building, Plus } from "lucide-react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { MobileContainer } from "@/components/layout/mobile-container";
import { BottomNavigation } from "@/components/layout/bottom-navigation";
import { AddMoneyModal } from "@/components/modals/add-money-modal";
import type { PaymentMethod, User } from "@shared/schema";

export default function Wallet() {
  const [isAddMoneyModalOpen, setIsAddMoneyModalOpen] = useState(false);
  const { data: paymentMethods = [] } = useQuery<PaymentMethod[]>({
    queryKey: ["/api/payment-methods"],
  });

  const { data: user } = useQuery<User>({
    queryKey: ["/api/user"],
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

  const formatBalance = (balance: string | undefined) => {
    if (!balance) return "$0.00";
    const num = parseFloat(balance);
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(num);
  };

  return (
    <MobileContainer>
      <header className="bg-paypal-primary text-white p-4">
        <h1 className="text-xl font-semibold">Wallet</h1>
      </header>

      <div className="px-4 py-6 pb-24 space-y-6">
        {/* Balance Card */}
        <div className="bg-gradient-to-r from-paypal-secondary to-paypal-primary rounded-2xl p-6 text-white">
          <div className="text-center">
            <p className="text-sm opacity-90 mb-2">PayPal Balance</p>
            <h2 className="text-3xl font-bold">{formatBalance(user?.balance)}</h2>
            <p className="text-sm opacity-90 mt-1">Available to spend</p>
          </div>
        </div>

        {/* Payment Methods */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-paypal-dark">Payment Methods</h3>
            <button className="text-paypal-secondary text-sm font-medium hover:text-paypal-primary transition-colors">
              Add New
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
            
            {/* Add Payment Method Button */}
            <button className="w-full bg-white p-4 rounded-xl shadow-sm border border-gray-200 border-dashed flex items-center justify-center space-x-3 hover:shadow-md hover:border-paypal-secondary transition-all text-paypal-secondary">
              <Plus className="w-5 h-5" />
              <span className="font-medium">Add Payment Method</span>
            </button>
          </div>
        </div>

        {/* Quick Actions */}
        <div>
          <h3 className="text-lg font-semibold text-paypal-dark mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-3">
            <button 
              onClick={() => setIsAddMoneyModalOpen(true)}
              className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 text-center hover:shadow-md transition-shadow"
            >
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <Plus className="w-5 h-5 text-blue-600" />
              </div>
              <p className="font-medium text-paypal-dark text-sm">Add Money</p>
            </button>
            <button className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 text-center hover:shadow-md transition-shadow">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <Building className="w-5 h-5 text-green-600" />
              </div>
              <p className="font-medium text-paypal-dark text-sm">Transfer</p>
            </button>
          </div>
        </div>
      </div>

      <BottomNavigation />
      
      <AddMoneyModal
        isOpen={isAddMoneyModalOpen}
        onClose={() => setIsAddMoneyModalOpen(false)}
      />
    </MobileContainer>
  );
}
