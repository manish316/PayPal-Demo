import { useState } from "react";
import { MobileContainer } from "@/components/layout/mobile-container";
import { BottomNavigation } from "@/components/layout/bottom-navigation";
import { Header } from "@/components/dashboard/header";
import { BalanceCard } from "@/components/dashboard/balance-card";
import { QuickActions } from "@/components/dashboard/quick-actions";
import { PaymentMethods } from "@/components/dashboard/payment-methods";
import { RecentActivity } from "@/components/dashboard/recent-activity";
import { SendMoneyModal } from "@/components/modals/send-money-modal";
import { AddMoneyModal } from "@/components/modals/add-money-modal";

export default function Dashboard() {
  const [isSendModalOpen, setIsSendModalOpen] = useState(false);
  const [isAddMoneyModalOpen, setIsAddMoneyModalOpen] = useState(false);

  const handleSendMoney = () => {
    setIsSendModalOpen(true);
  };

  const handleRequestMoney = () => {
    // TODO: Implement request money functionality
    console.log("Request money clicked");
  };

  const handleAddMoney = () => {
    setIsAddMoneyModalOpen(true);
  };

  return (
    <MobileContainer>
      <Header />
      <BalanceCard onSendMoney={handleSendMoney} onRequestMoney={handleRequestMoney} />
      <QuickActions onAddMoney={handleAddMoney} />
      <PaymentMethods />
      <RecentActivity />
      <BottomNavigation />
      
      <SendMoneyModal
        isOpen={isSendModalOpen}
        onClose={() => setIsSendModalOpen(false)}
      />
      
      <AddMoneyModal
        isOpen={isAddMoneyModalOpen}
        onClose={() => setIsAddMoneyModalOpen(false)}
      />
    </MobileContainer>
  );
}
