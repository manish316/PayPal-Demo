import { ArrowDown, ArrowUp, ShoppingCart, Plus } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import type { Transaction } from "@shared/schema";

export function RecentActivity() {
  const { data: transactions = [] } = useQuery<Transaction[]>({
    queryKey: ["/api/transactions"],
  });

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case "receive":
        return { icon: ArrowDown, bg: "bg-green-100", color: "text-green-600" };
      case "send":
        return { icon: ArrowUp, bg: "bg-red-100", color: "text-red-600" };
      case "purchase":
        return { icon: ShoppingCart, bg: "bg-blue-100", color: "text-blue-600" };
      case "add_money":
        return { icon: Plus, bg: "bg-purple-100", color: "text-purple-600" };
      default:
        return { icon: ArrowUp, bg: "bg-gray-100", color: "text-gray-600" };
    }
  };

  const getTransactionTitle = (transaction: Transaction) => {
    switch (transaction.type) {
      case "receive":
        return "Payment Received";
      case "send":
        return `Sent to ${transaction.recipientName}`;
      case "purchase":
        return `${transaction.merchantName} Purchase`;
      case "add_money":
        return "Added Money";
      default:
        return transaction.description;
    }
  };

  const getTransactionSubtitle = (transaction: Transaction) => {
    switch (transaction.type) {
      case "receive":
        return `From ${transaction.recipientName}`;
      case "send":
        return transaction.description;
      case "purchase":
        return `Order ${transaction.orderId}`;
      case "add_money":
        return "From Bank of America";
      default:
        return "";
    }
  };

  const formatAmount = (amount: string, type: string) => {
    const num = parseFloat(amount);
    const formatted = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(num);

    const isPositive = type === "receive" || type === "add_money";
    return {
      amount: isPositive ? `+${formatted}` : `-${formatted}`,
      color: isPositive ? "text-green-600" : "text-red-600",
    };
  };

  const formatDate = (date: Date) => {
    return formatDistanceToNow(new Date(date), { addSuffix: true });
  };

  return (
    <div className="px-4 mt-8 pb-24">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-paypal-dark">Recent Activity</h3>
        <button className="text-paypal-secondary text-sm font-medium hover:text-paypal-primary transition-colors">
          View All
        </button>
      </div>
      
      <div className="space-y-4">
        {transactions.slice(0, 4).map((transaction) => {
          const { icon: Icon, bg, color } = getTransactionIcon(transaction.type);
          const { amount, color: amountColor } = formatAmount(transaction.amount, transaction.type);
          
          return (
            <div
              key={transaction.id}
              className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 ${bg} rounded-full flex items-center justify-center`}>
                    <Icon className={`w-5 h-5 ${color}`} />
                  </div>
                  <div>
                    <p className="font-medium text-paypal-dark">{getTransactionTitle(transaction)}</p>
                    <p className="text-sm text-gray-500">{getTransactionSubtitle(transaction)}</p>
                    <p className="text-xs text-gray-400">{formatDate(transaction.createdAt)}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-semibold ${amountColor}`}>{amount}</p>
                  <p className="text-xs text-gray-500 capitalize">{transaction.status}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
