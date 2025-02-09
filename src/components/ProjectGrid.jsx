import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import initializeImages from "@/utils/projectImages";

const getFirstImage = (images) => {
  return images && images.length > 0 ? images[0] : null;
};

const createProjects = (images) => [
  {
    id: "buenos-aires",
    title: "BUENOS AIRES,",
    location: "ARGENTINA",
    image: images ? getFirstImage(images.buenosAiresImages) : null,
    description: "Modern urban residence with traditional influences",
    year: "2023",
  },
  {
    id: "fishing-lodge",
    title: "FISHING LODGE,",
    location: "MONTANA",
    image: images ? getFirstImage(images.fishingLodgeImages) : null,
    description: "Rustic luxury retreat",
    year: "2022",
  },
  {
    id: "ali-wood",
    title: "ALI WOOD,",
    location: "CALIFORNIA",
    image: images ? getFirstImage(images.aliWoodImages) : null,
    description: "Contemporary woodland estate",
    year: "2023",
  },
  {
    id: "chateau-marmot",
    title: "CHATEAU MARMOT,",
    location: "FRANCE",
    image: images ? getFirstImage(images.chateauMarmotImages) : null,
    description: "Historic chateau renovation",
    year: "2022",
  },
  {
    id: "studio",
    title: "STUDIO,",
    location: "NEW YORK",
    image: images ? getFirstImage(images.studioImages) : null,
    description: "Urban artist loft conversion",
    year: "2023",
  },
  {
    id: "seattle-house",
    title: "SEATTLE HOUSE,",
    location: "WASHINGTON",
    image: images ? getFirstImage(images.seattleHouseImages) : null,
    description: "Pacific Northwest modern home",
    year: "2023",
  },
  {
    id: "casa-malibu",
    title: "CASA MALIBU,",
    location: "CALIFORNIA",
    image: images ? getFirstImage(images.casaMalibuImages) : null,
    description: "Oceanfront contemporary villa",
    year: "2022",
  },
  {
    id: "sand-castle",
    title: "THE SAND CASTLE,",
    location: "HAMPTONS",
    image: images ? getFirstImage(images.sandCastleImages) : null,
    description: "Beachfront modern estate",
    year: "2023",
  },
];

export const projects = createProjects(null);

const LoadingSpinner = () => (
  <div className="flex items-center justify-center w-full h-full">
    <div className="w-8 h-8 border-4 border-gray-200 border-t-gray-800 rounded-full animate-spin" />
  </div>
);

export const ProjectGrid = () => {
  const [loadedProjects, setLoadedProjects] = useState(projects);

  useEffect(() => {
    const loadImages = async () => {
      const imageArrays = await initializeImages();
      setLoadedProjects(createProjects(imageArrays));
    };
    
    loadImages();
  }, []);

  if (!loadedProjects) return (
    <div className="w-full h-[50vh] flex items-center justify-center">
      <LoadingSpinner />
    </div>
  );

  const ProjectCard = ({ id, title, location, image, year }) => (
    <Link 
      to={`/projects/${id}`}
      className="group block transition-all duration-300 hover:opacity-90"
    >
      <div className="relative aspect-[0.4] mb-2 overflow-hidden">
        {image ? (
          <img
            src={image}
            alt={`${title} ${location}`}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-gray-100 flex items-center justify-center">
            <LoadingSpinner />
          </div>
        )}
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
    image: PropTypes.string,
    year: PropTypes.string.isRequired,
  };

  return (
    <div className="w-full overflow-x-auto pb-6">
      <div className="flex justify-center gap-4 min-w-max px-4">
        <div className="flex gap-4 max-w-6xl">
          {loadedProjects.map((project) => (
            <div key={project.id} className="w-[120px]">
              <ProjectCard {...project} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProjectGrid; 