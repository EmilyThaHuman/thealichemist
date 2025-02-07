import { Link } from "react-router-dom";
import PropTypes from "prop-types";

const projects = [
  {
    id: "buenos-aires",
    title: "BUENOS AIRES,",
    location: "ARGENTINA",
    image: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d",
    description: "Modern urban residence with traditional influences",
    year: "2023",
  },
  {
    id: "fishing-lodge",
    title: "FISHING LODGE,",
    location: "MONTANA",
    image: "https://images.unsplash.com/photo-1600607687644-c7171b42498b",
    description: "Rustic luxury retreat",
    year: "2022",
  },
  {
    id: "ali-wood",
    title: "ALI WOOD,",
    location: "CALIFORNIA",
    image: "https://images.unsplash.com/photo-1600607688969-a5bfcd646154",
    description: "Contemporary woodland estate",
    year: "2023",
  },
  {
    id: "chateau-marmot",
    title: "CHATEAU MARMOT,",
    location: "FRANCE",
    image: "https://images.unsplash.com/photo-1600607688960-761c0c6b3c1d",
    description: "Historic chateau renovation",
    year: "2022",
  },
  {
    id: "studio",
    title: "STUDIO,",
    location: "NEW YORK",
    image: "https://images.unsplash.com/photo-1600607688939-a5bfcd646154",
    description: "Urban artist loft conversion",
    year: "2023",
  },
  {
    id: "seattle-house",
    title: "SEATTLE HOUSE,",
    location: "WASHINGTON",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c",
    description: "Pacific Northwest modern home",
    year: "2023",
  },
  {
    id: "casa-malibu",
    title: "CASA MALIBU,",
    location: "CALIFORNIA",
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9",
    description: "Oceanfront contemporary villa",
    year: "2022",
  },
  {
    id: "sand-castle",
    title: "THE SAND CASTLE,",
    location: "HAMPTONS",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c",
    description: "Beachfront modern estate",
    year: "2023",
  },
];

const ProjectCard = ({ id, title, location, image, year }) => (
  <Link 
    to={`/projects/${id}`}
    className="group block transition-all duration-300 hover:opacity-90"
  >
    <div className="relative aspect-[0.4] mb-2 overflow-hidden">
      <img
        src={image}
        alt={`${title} ${location}`}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
    </div>
    <div className="space-y-1">
      <h3 className="text-xs font-medium">
        {title} {location}
      </h3>
      <p className="text-[10px] text-muted-foreground">{year}</p>
    </div>
  </Link>
);

ProjectCard.propTypes = {
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  location: PropTypes.string.isRequired,
  image: PropTypes.string.isRequired,
  year: PropTypes.string.isRequired,
};

const ProjectGrid = () => {
  return (
    <div className="w-full overflow-x-auto pb-6">
      <div className="flex gap-4 min-w-max px-4">
        {projects.map((project) => (
          <div key={project.id} className="w-[120px]">
            <ProjectCard {...project} />
          </div>
        ))}
      </div>
    </div>
  );
};

export { projects };
export default ProjectGrid; 