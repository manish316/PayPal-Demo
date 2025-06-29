import { useLocation } from "wouter";
import { Home, List, Send, Wallet, MoreHorizontal } from "lucide-react";
import type { NavigationItem } from "@/lib/types";

const navigationItems: NavigationItem[] = [
  { id: "home", label: "Home", icon: "Home", path: "/" },
  { id: "activity", label: "Activity", icon: "List", path: "/activity" },
  { id: "send", label: "Send", icon: "Send", path: "/send" },
  { id: "wallet", label: "Wallet", icon: "Wallet", path: "/wallet" },
  { id: "more", label: "More", icon: "MoreHorizontal", path: "/more" },
];

const iconMap = {
  Home,
  List,
  Send,
  Wallet,
  MoreHorizontal,
};

export function BottomNavigation() {
  const [location, setLocation] = useLocation();

  const handleNavigation = (path: string) => {
    setLocation(path);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 lg:relative lg:max-w-md lg:mx-auto">
      <div className="flex items-center justify-around py-3 px-4">
        {navigationItems.map((item) => {
          const Icon = iconMap[item.icon as keyof typeof iconMap];
          const isActive = location === item.path;
          
          return (
            <button
              key={item.id}
              onClick={() => handleNavigation(item.path)}
              className={`flex flex-col items-center space-y-1 transition-colors ${
                isActive ? "text-paypal-secondary" : "text-gray-400 hover:text-paypal-secondary"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-xs font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
