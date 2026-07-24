import { createElement } from "react";
import type { LucideIcon } from "lucide-react";
import { getIcon } from "@/lib/icon-registry";

type IconProps = { name?: string | null } & React.ComponentProps<LucideIcon>;

/**
 * Renders a lucide icon by name (resolved through the icon registry).
 *
 * Uses `React.createElement` instead of a `const Cmp = getIcon(...)` +
 * `<Cmp />` pattern so the `react-hooks/static-components` lint rule
 * does not flag a dynamic component variable being "created during
 * render". The resolved icon is a stable module-level reference, so
 * this is safe and state-preserving.
 */
export function DynamicIcon({ name, ...props }: IconProps) {
  return createElement(getIcon(name), props);
}

export default DynamicIcon;
