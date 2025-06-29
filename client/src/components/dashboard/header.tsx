import { Bell, Settings } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import type { User } from "@shared/schema";

export function Header() {
  const { data: user } = useQuery<User>({
    queryKey: ["/api/user"],
  });

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  return (
    <header className="bg-paypal-primary text-white p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-paypal-primary to-paypal-secondary opacity-90"></div>
      <div className="relative z-10 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center overflow-hidden">
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt="User profile"
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                <span className="text-gray-600 text-sm font-medium">
                  {user?.name?.charAt(0) || "U"}
                </span>
              </div>
            )}
          </div>
          <div>
            <p className="text-sm opacity-90">{getGreeting()}</p>
            <p className="font-semibold">{user?.name || "Loading..."}</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <button className="p-2 rounded-full bg-white bg-opacity-20 hover:bg-opacity-30 transition-colors">
            <Bell className="w-5 h-5" />
          </button>
          <button className="p-2 rounded-full bg-white bg-opacity-20 hover:bg-opacity-30 transition-colors">
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
}
