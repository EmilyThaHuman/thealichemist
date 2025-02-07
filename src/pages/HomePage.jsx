import { NavLink } from "react-router-dom";
import PropTypes from "prop-types";

const HomePage = ({
  navLinks = [
    { href: "#", text: "OUR WORK" },
    { href: "#", text: "ABOUT US" },
    { href: "#", text: "PRESS & AWARDS" },
    { href: "#", text: "CONTACT" },
  ],
}) => {
  return (
    <div className="relative min-h-screen bg-white text-black overflow-hidden">
      <nav className="absolute top-0 right-0 mt-8 mr-8 z-10">
        <ul className="flex space-x-8">
          {navLinks.map((link, index) => (
            <NavLink key={index} href={link.href}>
              {link.text}
            </NavLink>
          ))}
        </ul>
      </nav>

      <div className="absolute inset-0 flex items-center justify-center">
        <div className="-mt-24 -ml-32" style={{ transform: "scale(1.5)" }}>
          <h1
            style={{
              fontSize: "11.25vw",
              fontWeight: "bold",
              lineHeight: "0.85",
              letterSpacing: "-0.02em",
              whiteSpace: "nowrap",
            }}
          >
            THE
            <br />
            <span style={{ display: "block" }}>ALICH-</span>
            <span style={{ display: "block" }}>EMISTS</span>
          </h1>
          <p
            className="mt-8"
            style={{ fontSize: "0.7rem", letterSpacing: "0.1em" }}
          >
            <span className="text-red-600">WEBSITE</span> / JOBSITE
          </p>
        </div>
      </div>
    </div>
  );
};

HomePage.propTypes = {
  navLinks: PropTypes.arrayOf(
    PropTypes.shape({
      href: PropTypes.string.isRequired,
      text: PropTypes.string.isRequired,
    })
  ),
};

export default HomePage;
