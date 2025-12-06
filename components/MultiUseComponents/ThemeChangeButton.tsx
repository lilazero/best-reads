"use client";
import * as React from "react";
import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { cn } from "@/lib/utils";
import { DropdownMenuItem } from "../ui/dropdown-menu";

type ThemeOption = "light" | "dark" | "system";

// Cycles theme between light, dark, and system. When rendered inside a Radix dropdown
// use `asDropdownItem` so `onSelect` drives the change without closing behavior issues.
// Displays the current theme with an icon and a hint for what will come next.

const THEME_ORDER: ThemeOption[] = ["light", "dark", "system"];
const ICONS: Record<
  ThemeOption,
  React.ComponentType<{ className?: string }>
> = {
  light: Sun,
  dark: Moon,
  system: Monitor,
};

const LABELS: Record<ThemeOption, string> = {
  light: "Light",
  dark: "Dark",
  system: "System",
};

type ThemeChangeButtonProps = {
  asDropdownItem?: boolean;
  className?: string;
};

function ThemeChangeButton({
  asDropdownItem = false,
  className,
}: ThemeChangeButtonProps) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => setMounted(true), []);

  // Identify the current theme (fallback to system) and the next one in the rotation.
  const currentTheme: ThemeOption = THEME_ORDER.includes(theme as ThemeOption)
    ? (theme as ThemeOption)
    : "system";
  const nextTheme =
    THEME_ORDER[(THEME_ORDER.indexOf(currentTheme) + 1) % THEME_ORDER.length];
  const Icon = ICONS[currentTheme];

  // Shared click handler used by both render paths.
  const handleClick = () => {
    setTheme(nextTheme);
  };

  // UI snippet reused in dropdown and standalone modes.
  const content = (
    <>
      <span className="flex items-center gap-2">
        <Icon className="size-4" />
        <span>{mounted ? `Theme: ${LABELS[currentTheme]}` : "Theme"}</span>
      </span>
      <span className="text-xs text-muted-foreground">
        Next: {LABELS[nextTheme]}
      </span>
    </>
  );

  // Dropdown path: use onSelect so Radix does not swallow the click before we toggle.
  if (asDropdownItem) {
    return (
      <DropdownMenuItem
        onSelect={(event) => {
          event.preventDefault();
          handleClick();
        }}
        className={cn(
          "flex w-full items-center justify-between px-2 py-1.5 text-sm",
          className
        )}
      >
        {content}
      </DropdownMenuItem>
    );
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className={cn(
        "flex w-full items-center justify-between px-2 py-1.5 text-sm",
        className
      )}
    >
      {content}
    </button>
  );
}

export default ThemeChangeButton;
