import { Link } from "react-router-dom";

const Navigation = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white">
      <div className="container mx-auto px-16 py-8 flex justify-between items-start">
        {/* Logo */}
        <Link to="/" className="text-[40px] leading-[0.9] font-bold">
          THE<br />ALCH-<br />EMISTS
        </Link>

        {/* Navigation Links */}
        <div className="flex gap-12 text-[13px]">
          <Link to="/work" className="hover:opacity-70">
            OUR WORK
          </Link>
          <Link to="/about" className="hover:opacity-70">
            ABOUT US
          </Link>
          <Link to="/press" className="hover:opacity-70">
            PRESS & AWARDS
          </Link>
          <Link to="/contact" className="hover:opacity-70">
            CONTACT
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navigation; 