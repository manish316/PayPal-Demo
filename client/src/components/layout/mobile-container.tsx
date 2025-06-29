interface MobileContainerProps {
  children: React.ReactNode;
}

export function MobileContainer({ children }: MobileContainerProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-paypal-secondary to-paypal-primary lg:p-8">
      <div className="max-w-md mx-auto bg-white min-h-screen lg:min-h-0 lg:rounded-3xl lg:shadow-2xl lg:overflow-hidden">
        {children}
      </div>
    </div>
  );
}
