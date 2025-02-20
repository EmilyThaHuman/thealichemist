import { Outlet, useLocation } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import Footer from "@/components/Footer";
import { Navigation } from "@/components/Navigation";

export default function Root() {
  const location = useLocation();
  const excludePadding = location.pathname === "/" || location.pathname === "/projects";

  const navLinks = [
    { href: "/projects/architecture", text: "OUR WORK" },
    { href: "/about", text: "ABOUT US" },
    { href: "/contact", text: "CONTACT" },
  ];
  
  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <div className="relative min-h-screen flex flex-col">
        <Navigation navLinks={navLinks} />
        <main className={`flex-grow ${!excludePadding ? "pt-[50px]" : ""}`}>
          <Outlet />
        </main>
        <Footer />
      </div>
    </ThemeProvider>
  );
}
