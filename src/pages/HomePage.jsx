import PropTypes from "prop-types";

export default function HomePage() {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-white">
      {/* Main content container */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Text container with proper positioning */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 p-8">
          <h1 className="text-8xl sm:text-9xl md:text-[12rem] font-bold leading-none tracking-tighter text-zinc-900">
            <span className="block">THE</span>
            <span className="block">ALICH-</span>
            <span className="block">EMIST</span>
          </h1>
          <p className="mt-12 text-base sm:text-lg tracking-widest">
            <span className="text-red-600">WEBSITE</span>{" "}
            <span className="text-zinc-600">/ JOBSITE</span>
          </p>
        </div>
      </div>
    </div>
  );
}

HomePage.propTypes = {
  navLinks: PropTypes.arrayOf(
    PropTypes.shape({
      href: PropTypes.string.isRequired,
      text: PropTypes.string.isRequired,
    })
  ),
};

HomePage.displayName = "HomePage";
