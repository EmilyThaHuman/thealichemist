import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import initializeImages from "@/utils/projectImages";

// Project type constants
export const PROJECT_TYPES = {
  ARCHITECTURE: 'architecture',
  PRODUCT: 'product',
  CLOTHING: 'clothing',
  RENTALS: 'rentals'
};

const getFirstImage = (images) => {
  return images && images.length > 0 ? images[0] : null;
};

// Project creators for each type
const projectCreators = {
  [PROJECT_TYPES.ARCHITECTURE]: (images) => [
    {
      id: "buenos-aires",
      type: PROJECT_TYPES.ARCHITECTURE,
      title: "BUENOS AIRES,",
      location: "ARGENTINA",
      image: images ? getFirstImage(images.buenosAiresImages) : null,
      description: "Design and build of all furniture and interior",
      year: "2012",
    },
    {
      id: "fishing-lodge",
      type: PROJECT_TYPES.ARCHITECTURE,
      title: "FISHING LODGE,",
      location: "TWISP, WASHINGTON",
      image: images ? getFirstImage(images.fishingLodgeImages) : null,
      description: "Complete reconstruction and decoration of a 1970s cabin into a Western turn-of-the-century lodge",
      year: "2022",
    },
    {
      id: "ali-wood",
      type: PROJECT_TYPES.ARCHITECTURE,
      title: "ALIWOOD,",
      location: "TWISP, WASHINGTON",
      image: images ? getFirstImage(images.aliWoodImages) : null,
      description: "Conversion of a massive three-bay garage into an Argentine estancia with a pool",
      year: "2018",
    },
    {
      id: "chateau-marmot",
      type: PROJECT_TYPES.ARCHITECTURE,
      title: "CHATEAU MARMOT,",
      location: "TWISP, WASHINGTON",
      image: images ? getFirstImage(images.chateauMarmotImages) : null,
      description: "Interior design transformation of a former craftsman home into a richer, more interesting space",
      year: "2023",
    },
    {
      id: "studio",
      type: PROJECT_TYPES.ARCHITECTURE,
      title: "STUDIO,",
      location: "TWISP, WASHINGTON",
      image: images ? getFirstImage(images.studioImages) : null,
      description: "Transformation of a garage bay into a new artist's loft in New York City",
      year: "2023",
    },
    {
      id: "seattle-house",
      type: PROJECT_TYPES.ARCHITECTURE,
      title: "SEATTLE HOUSE,",
      location: "SEATTLE, WASHINGTON",
      image: images ? getFirstImage(images.seattleHouseImages) : null,
      description: "Pacific Northwest traditional home",
      year: "2007",
    },
    {
      id: "casa-malibu",
      type: PROJECT_TYPES.ARCHITECTURE,
      title: "CASA MALIBU,",
      location: "CERRITOS BEACH, BCS, MEXICO",
      image: images ? getFirstImage(images.casaMalibuImages) : null,
      description: "Build-out of an abandoned cinderblock two-bedroom shell into a modern Hollywood Hills-style rambler",
      year: "2022",
    },
    {
      id: "sand-castle",
      type: PROJECT_TYPES.ARCHITECTURE,
      title: "THE SAND CASTLE,",
      location: "RANCHO NUEVO, BCS, MEXICO",
      image: images ? getFirstImage(images.sandCastleImages) : null,
      description: "Complete reconstruction and transformation of a 1990s santa-fe style pink casa into a mediterranean beach house",
      year: "2024",
    },
  ],
  
  [PROJECT_TYPES.PRODUCT]: (images) => [
    {
      id: "vw-vans",
      type: PROJECT_TYPES.PRODUCT,
      title: "VW VANS,",
      location: "TWISP, WASHINGTON",
      image: images ? getFirstImage(images.vwVansImages) : null,
      description: "Custom restoration and design of vintage Volkswagen vans",
      year: "2023",
    },
    {
      id: "mochilas",
      type: PROJECT_TYPES.PRODUCT,
      title: "MOCHILAS,",
      location: "COLOMBIA",
      image: images ? getFirstImage(images.mochilasImages) : null,
      description: "Traditional Colombian bag designs with modern interpretations",
      year: "2024",
    },
  ],
  
  [PROJECT_TYPES.CLOTHING]: (images) => [
    {
      id: "fit-to-be-tied",
      type: PROJECT_TYPES.CLOTHING,
      title: "FIT TO BE TIED,",
      location: "TWISP, WASHINGTON",
      image: images ? getFirstImage(images.fitToBeTiedImages) : null,
      description: "Bespoke western wear and custom leather goods",
      year: "2023",
    },
  ],
  
  [PROJECT_TYPES.RENTALS]: (images) => [
    {
      id: "rental-1",
      type: PROJECT_TYPES.RENTALS,
      title: "RENTAL ONE,",
      location: "TWISP, WASHINGTON",
      image: images ? getFirstImage(images.rentalImages) : null,
      description: "Rental property",
      year: "2024",
    },
  ],
};

// Export initial projects for each type
export const initialProjects = Object.fromEntries(
  Object.entries(projectCreators).map(([type, creator]) => [type, creator(null)])
);

const LoadingSpinner = () => (
  <div className="flex items-center justify-center w-full h-full">
    <div className="w-8 h-8 border-4 border-gray-200 border-t-gray-800 rounded-full animate-spin" />
  </div>
);

export const ProjectGrid = ({ projectType }) => {
  const [loadedProjects, setLoadedProjects] = useState(initialProjects[projectType] || []);

  useEffect(() => {
    const loadImages = async () => {
      const imageArrays = await initializeImages();
      const creator = projectCreators[projectType];
      if (creator) {
        setLoadedProjects(creator(imageArrays));
      }
    };
    
    loadImages();
  }, [projectType]);

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

ProjectGrid.propTypes = {
  projectType: PropTypes.oneOf(Object.values(PROJECT_TYPES)).isRequired,
};

export default ProjectGrid; 