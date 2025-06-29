import { Send, HandCoins } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import type { User } from "@shared/schema";

interface BalanceCardProps {
  onSendMoney: () => void;
  onRequestMoney: () => void;
}

export function BalanceCard({ onSendMoney, onRequestMoney }: BalanceCardProps) {
  const { data: user } = useQuery<User>({
    queryKey: ["/api/user"],
  });

  const formatBalance = (balance: string | undefined) => {
    if (!balance) return "$0.00";
    const num = parseFloat(balance);
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(num);
  };

  return (
    <div className="px-4 mt-4 relative z-20">
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
        <div className="text-center">
          <p className="text-paypal-dark text-sm font-medium mb-2">Available Balance</p>
          <h2 className="text-3xl font-bold text-paypal-primary">
            {formatBalance(user?.balance)}
          </h2>
          <p className="text-gray-500 text-sm mt-1">USD • Personal Account</p>
        </div>
        
        <div className="flex space-x-3 mt-6">
          <button
            onClick={onSendMoney}
            className="flex-1 bg-paypal-secondary text-white py-3 px-4 rounded-xl font-medium flex items-center justify-center space-x-2 hover:bg-paypal-primary transition-colors"
          >
            <Send className="w-4 h-4" />
            <span>Send</span>
          </button>
          <button
            onClick={onRequestMoney}
            className="flex-1 bg-paypal-gray text-paypal-primary py-3 px-4 rounded-xl font-medium flex items-center justify-center space-x-2 hover:bg-gray-200 transition-colors"
          >
            <HandCoins className="w-4 h-4" />
            <span>Request</span>
          </button>
        </div>
      </div>
    </div>
  );
}
