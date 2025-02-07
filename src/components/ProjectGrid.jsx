import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import {
  buenosAiresImages,
  fishingLodgeImages,
  chateauMarmotImages,
  studioImages,
  seattleHouseImages,
  casaMalibuImages,
  sandCastleImages
} from "@/utils/projectImages";

const getFirstImage = (images) => {
  return images && images.length > 0 ? images[0] : null;
};

const projects = [
  {
    id: "buenos-aires",
    title: "BUENOS AIRES,",
    location: "ARGENTINA",
    image: getFirstImage(buenosAiresImages),
    description: "Modern urban residence with traditional influences",
    year: "2023",
  },
  {
    id: "fishing-lodge",
    title: "FISHING LODGE,",
    location: "MONTANA",
    image: getFirstImage(fishingLodgeImages),
    description: "Rustic luxury retreat",
    year: "2022",
  },
  {
    id: "ali-wood",
    title: "ALI WOOD,",
    location: "CALIFORNIA",
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9",
    description: "Contemporary woodland estate",
    year: "2023",
  },
  {
    id: "chateau-marmot",
    title: "CHATEAU MARMOT,",
    location: "FRANCE",
    image: getFirstImage(chateauMarmotImages),
    description: "Historic chateau renovation",
    year: "2022",
  },
  {
    id: "studio",
    title: "STUDIO,",
    location: "NEW YORK",
    image: getFirstImage(studioImages),
    description: "Urban artist loft conversion",
    year: "2023",
  },
  {
    id: "seattle-house",
    title: "SEATTLE HOUSE,",
    location: "WASHINGTON",
    image: getFirstImage(seattleHouseImages),
    description: "Pacific Northwest modern home",
    year: "2023",
  },
  {
    id: "casa-malibu",
    title: "CASA MALIBU,",
    location: "CALIFORNIA",
    image: getFirstImage(casaMalibuImages),
    description: "Oceanfront contemporary villa",
    year: "2022",
  },
  {
    id: "sand-castle",
    title: "THE SAND CASTLE,",
    location: "HAMPTONS",
    image: getFirstImage(sandCastleImages),
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
      <div className="flex justify-center gap-4 min-w-max px-4">
        <div className="flex gap-4 max-w-6xl">
          {projects.map((project) => (
            <div key={project.id} className="w-[120px]">
              <ProjectCard {...project} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export { projects };
export default ProjectGrid; 