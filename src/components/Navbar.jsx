import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold tracking-tighter">
          THE ALICH-EMISTS
        </Link>
        <div className="flex gap-8">
          <Link to="/" className="hover:opacity-60 transition-opacity">
            OUR WORK
          </Link>
          <Link to="/about" className="hover:opacity-60 transition-opacity">
            ABOUT US
          </Link>
          <Link to="/press" className="hover:opacity-60 transition-opacity">
            PRESS & AWARDS
          </Link>
          <Link to="/contact" className="hover:opacity-60 transition-opacity">
            CONTACT
          </Link>
        </div>
      </div>
    </nav>
  );
}
