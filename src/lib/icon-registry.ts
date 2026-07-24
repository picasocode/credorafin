/**
 * Icon registry — maps a string key (stored in the DB for hero slides &
 * blog posts) to a lucide-react icon component.
 *
 * Used so that admin-managed content can reference icons by name without
 * shipping component references through the API.
 */
import {
  ShieldCheck,
  CreditCard,
  Building2,
  IndianRupee,
  FileText,
  TrendingUp,
  Shield,
  BadgeCheck,
  Briefcase,
  Globe,
  Landmark,
  Settings,
  Sparkles,
  Star,
  BookOpen,
  Newspaper,
  PiggyBank,
  LineChart,
  Banknote,
  Coins,
  type LucideIcon,
} from "lucide-react";

export const iconMap: Record<string, LucideIcon> = {
  ShieldCheck,
  CreditCard,
  Building2,
  IndianRupee,
  FileText,
  TrendingUp,
  Shield,
  BadgeCheck,
  Briefcase,
  Globe,
  Landmark,
  Settings,
  Sparkles,
  Star,
  BookOpen,
  Newspaper,
  PiggyBank,
  LineChart,
  Banknote,
  Coins,
};

/** List of icon names available in the admin picker. */
export const ICON_OPTIONS = Object.keys(iconMap);

/** Resolve an icon name to a component (falls back to FileText). */
export function getIcon(name?: string | null): LucideIcon {
  if (name && iconMap[name]) return iconMap[name];
  return FileText;
}
