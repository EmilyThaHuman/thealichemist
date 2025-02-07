import { useTheme } from "@/contexts/ThemeContext";
import { cn } from "@/lib/utils";

export function LogoV1({ className, ...props }) {
  const { theme } = useTheme();

  return (
    <img
      src={`/images/logo/${theme === "dark" ? "dark" : "light"}.png`}
      alt="ReedAI Logo"
      className={cn("h-10 w-auto", className)}
      {...props}
    />
  );
}

export default LogoV1;
