export interface NavigationItem {
  id: string;
  label: string;
  icon: string;
  path: string;
}

export interface QuickAction {
  id: string;
  label: string;
  description: string;
  icon: string;
  bgColor: string;
  iconColor: string;
  action: () => void;
}
