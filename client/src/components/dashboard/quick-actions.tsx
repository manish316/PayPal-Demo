import { Plus, Receipt } from "lucide-react";
import type { QuickAction } from "@/lib/types";

interface QuickActionsProps {
  onAddMoney?: () => void;
}

export function QuickActions({ onAddMoney }: QuickActionsProps) {
  const quickActions: QuickAction[] = [
    {
      id: "add-money",
      label: "Add Money",
      description: "From bank",
      icon: "Plus",
      bgColor: "bg-green-100",
      iconColor: "text-green-600",
      action: () => onAddMoney?.(),
    },
    {
      id: "pay-bills",
      label: "Pay Bills",
      description: "Quick pay",
      icon: "Receipt",
      bgColor: "bg-blue-100",
      iconColor: "text-blue-600",
      action: () => console.log("Pay bills clicked"),
    },
  ];

  const iconMap = {
    Plus,
    Receipt,
  };

  return (
    <div className="px-4 mt-6">
      <div className="grid grid-cols-2 gap-4">
        {quickActions.map((action) => {
          const Icon = iconMap[action.icon as keyof typeof iconMap];
          
          return (
            <button
              key={action.id}
              onClick={action.action}
              className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-3 hover:shadow-md transition-shadow"
            >
              <div className={`w-10 h-10 ${action.bgColor} rounded-full flex items-center justify-center`}>
                <Icon className={`w-5 h-5 ${action.iconColor}`} />
              </div>
              <div className="text-left">
                <p className="font-medium text-paypal-dark">{action.label}</p>
                <p className="text-xs text-gray-500">{action.description}</p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
