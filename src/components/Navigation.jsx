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
  subNavLinks = [
    { href: "/projects/architecture", text: "ARCHITECTURE & INTERIOR DESIGN" },
    { href: "/projects/production", text: "PRODUCT DESIGN" },
    { href: "/projects/clothing", text: "CLOTHING DESIGN" },
    { href: "/projects/rentals", text: "RENTALS" },
  ],
}) => {
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  return (
    <div className="w-full z-50">
      <div className="p-8 relative flex justify-end">
        {/* Logo on the left - hidden on homepage */}
        {!isHomePage && (
          <div className="absolute left-0 top-8">
            <Link to="/" className="w-[300px]">
              <AlichemistLogo className="hover:opacity-80 transition-opacity" />
            </Link>
          </div>
        )}

        {/* Main Navigation on the right */}
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

      {/* Updated secondary navigation with bolder text and navy blue colors */}
      {!isHomePage && (
        <div className="flex justify-end px-8 pb-4">
          <NavigationMenu>
            <NavigationMenuList className="flex flex-col items-end space-y-2">
              {subNavLinks.map((link, index) => (
                <NavigationMenuItem key={index}>
                  <NavLink
                    to={link.href}
                    className={({ isActive }) =>
                      `font-medium text-zinc-800 hover:text-navy-600 transition-colors text-sm ${
                        isActive ? "text-[#000080]" : ""
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
      )}
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
  subNavLinks: PropTypes.arrayOf(
    PropTypes.shape({
      href: PropTypes.string.isRequired,
      text: PropTypes.string.isRequired,
    })
  ),
};

Navigation.displayName = "Navigation";

export default Navigation;
