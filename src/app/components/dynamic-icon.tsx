import {
  Home,
  User,
  Settings,
  LayoutDashboard,
  Bell,
  Shield,
  Mail,
} from "lucide-react";

export const iconMap = {
  Home,
  User,
  Settings,
  Shield,
  LayoutDashboard,
  Bell,
  Mail,
};

export type IconName = keyof typeof iconMap;

type Props = {
  name: IconName;
  size?: number;
  className?: string;
};

export default function DynamicIcon({ name, size = 20, className }: Props) {
  const Icon = iconMap[name];

  if (!Icon) return null;

  return <Icon size={size} className={className} />;
}
