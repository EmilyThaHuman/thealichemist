import { NavLink, Link, useLocation } from "react-router-dom";
import PropTypes from "prop-types";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu.jsx";
import { AlichemistLogo } from "@/components/AlichemistLogo";

export const Navigation = ({
  navLinks = [
    { href: "#", text: "OUR WORK" },
    { href: "#", text: "ABOUT US" },
    { href: "#", text: "CONTACT" },
  ],
}) => {
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  return (
    <div className="fixed top-0 w-full z-50 p-8">
      <div className="relative flex justify-end">
        {/* Logo on the left - hidden on homepage */}
        {!isHomePage && (
          <div className="absolute left-0 top-0">
            <Link to="/" className="w-[300px]">
              <AlichemistLogo className="hover:opacity-80 transition-opacity" />
            </Link>
          </div>
        )}

        {/* Navigation on the right */}
        <NavigationMenu>
          <NavigationMenuList className="flex space-x-8">
            {navLinks.map((link, index) => (
              <NavigationMenuItem key={index}>
                <NavLink
                  to={link.href}
                  className={({ isActive }) =>
                    `text-zinc-800 hover:text-zinc-600 transition-colors ${
                      isActive ? "font-medium" : ""
                    }`
                  }
                >
                  {link.text}
                </NavLink>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </div>
  );
};

Navigation.propTypes = {
  navLinks: PropTypes.arrayOf(
    PropTypes.shape({
      href: PropTypes.string.isRequired,
      text: PropTypes.string.isRequired,
    })
  ),
};

Navigation.displayName = "Navigation";

export default Navigation;
