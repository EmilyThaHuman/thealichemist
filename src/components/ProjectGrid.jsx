import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import PropTypes from "prop-types"
import { useProjectImagesStore } from "@/utils/projectImages"

// Project type constants
export const PROJECT_TYPES = {
  ARCHITECTURE: 'architecture',
  PRODUCT: 'product',
  CLOTHING: 'clothing',
  RENTALS: 'rentals'
}

// Project creators for each type (for initial state before loading)
const projectCreators = {
  [PROJECT_TYPES.ARCHITECTURE]: () => [
    {
      id: "buenos-aires",
      type: PROJECT_TYPES.ARCHITECTURE,
      title: "BUENOS AIRES,",
      location: "ARGENTINA",
      description: "Design and build of all furniture and interior",
      year: "2012",
    },
    {
      id: "fishing-lodge",
      type: PROJECT_TYPES.ARCHITECTURE,
      title: "FISHING LODGE,",
      location: "TWISP, WASHINGTON",
      description: "Complete reconstruction and decoration of a 1970s cabin into a Western turn-of-the-century lodge",
      year: "2022",
    },
    {
      id: "ali-wood",
      type: PROJECT_TYPES.ARCHITECTURE,
      title: "ALIWOOD,",
      location: "TWISP, WASHINGTON",
      description: "Conversion of a massive three-bay garage into an Argentine estancia with a pool",
      year: "2018",
    },
    {
      id: "chateau-marmot",
      type: PROJECT_TYPES.ARCHITECTURE,
      title: "CHATEAU MARMOT,",
      location: "TWISP, WASHINGTON",
      description: "Interior design transformation of a former craftsman home into a richer, more interesting space",
      year: "2023",
    },
    {
      id: "studio",
      type: PROJECT_TYPES.ARCHITECTURE,
      title: "STUDIO,",
      location: "TWISP, WASHINGTON",
      description: "Transformation of a garage bay into a new artist's loft in New York City",
      year: "2023",
    },
    {
      id: "seattle-house",
      type: PROJECT_TYPES.ARCHITECTURE,
      title: "SEATTLE HOUSE,",
      location: "SEATTLE, WASHINGTON",
      description: "Complete renovation and interior design of a family home",
      year: "2020",
    },
    {
      id: "casa-malibu",
      type: PROJECT_TYPES.ARCHITECTURE,
      title: "CASA MALIBU,",
      location: "MALIBU, CALIFORNIA",
      description: "Beachfront modern home with understated elegance",
      year: "2019",
    },
    {
      id: "sand-castle",
      type: PROJECT_TYPES.ARCHITECTURE,
      title: "SAND CASTLE,",
      location: "HAMPTONS, NEW YORK",
      description: "Summer retreat designed for relaxation and entertainment",
      year: "2021",
    },
    {
      id: "schuylers-house",
      type: PROJECT_TYPES.ARCHITECTURE,
      title: "SCHUYLERS HOUSE,",
      location: "TWISP, WASHINGTON",
      description: "Renovation and interior design of a mountain retreat",
      year: "2022",
    },
    {
      id: "mikes-house",
      type: PROJECT_TYPES.ARCHITECTURE,
      title: "MIKES HOUSE,",
      location: "TWISP, WASHINGTON",
      description: "Modern rustic cabin renovation with custom details",
      year: "2021",
    },
  ],
  
  [PROJECT_TYPES.PRODUCT]: () => [
    {
      id: "vw-vans",
      type: PROJECT_TYPES.PRODUCT,
      title: "VW VANS,",
      location: "TWISP, WASHINGTON",
      description: "Custom restoration and design of vintage Volkswagen vans",
      year: "2023",
    },
    {
      id: "mochilas",
      type: PROJECT_TYPES.PRODUCT,
      title: "MOCHILAS,",
      location: "COLOMBIA",
      description: "Traditional Colombian bag designs with modern interpretations",
      year: "2024",
    },
  ],
  
  [PROJECT_TYPES.CLOTHING]: () => [
    {
      id: "fit-to-be-tied",
      type: PROJECT_TYPES.CLOTHING,
      title: "FIT TO BE TIED,",
      location: "TWISP, WASHINGTON",
      description: "Bespoke western wear and custom leather goods",
      year: "2023",
    },
  ],
  
  [PROJECT_TYPES.RENTALS]: () => [
    {
      id: "rental-1",
      type: PROJECT_TYPES.RENTALS,
      title: "RENTAL ONE,",
      location: "TWISP, WASHINGTON",
      description: "Rental property",
      year: "2024",
    },
  ],
}

// Export initial projects for each type
export const initialProjects = Object.fromEntries(
  Object.entries(projectCreators).map(([type, creator]) => [type, creator()])
)

const LoadingSpinner = () => (
  <div className="flex items-center justify-center w-full h-full">
    <div className="w-8 h-8 border-4 border-gray-200 border-t-gray-800 rounded-full animate-spin" />
  </div>
)

LoadingSpinner.displayName = 'LoadingSpinner'

const getProjectKeysByType = (type) => {
  switch (type) {
    case PROJECT_TYPES.ARCHITECTURE:
      return [
        'BUENOS_AIRES',
        'FISHING_LODGE',
        'ALI_WOOD',
        'CHATEAU_MARMOT',
        'STUDIO',
        'SEATTLE_HOUSE',
        'CASA_MALIBU',
        'SAND_CASTLE',
        'SCHUYLERS_HOUSE',
        'MIKES_HOUSE'
      ]
    case PROJECT_TYPES.PRODUCT:
      return ['VW_VANS', 'MOCHILAS']
    case PROJECT_TYPES.CLOTHING:
      return ['FIT_TO_BE_TIED']
    case PROJECT_TYPES.RENTALS:
      return []  // No rentals configured in the store yet
    default:
      return []
  }
}

// Helper function to preload an image
const preloadImage = (src) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
};

const ProjectCard = ({ id, title, location, imageUrl, year, onMouseEnter }) => {
  const [isImageLoaded, setIsImageLoaded] = useState(false)
  const [imageError, setImageError] = useState(false)

  const handleImageLoad = () => {
    setIsImageLoaded(true)
  }

  const handleImageError = () => {
    setImageError(true)
    setIsImageLoaded(true)
  }

  return (
    <Link 
      to={`/projects/${id}`}
      className="group block transition-all duration-300 hover:opacity-90"
      onMouseEnter={onMouseEnter}
    >
      <div className="relative aspect-[0.4] mb-2 overflow-hidden">
        {!isImageLoaded && !imageError && (
          <div className="w-full h-full bg-gray-100 flex items-center justify-center">
            <LoadingSpinner />
          </div>
        )}
        {imageUrl && !imageError ? (
          <img
            src={imageUrl}
            alt={`${title} ${location}`}
            className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${
              isImageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            onLoad={handleImageLoad}
            onError={handleImageError}
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full bg-gray-100 flex items-center justify-center">
            <span className="text-sm text-gray-500">Image not available</span>
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
  )
}

ProjectCard.propTypes = {
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  location: PropTypes.string.isRequired,
  imageUrl: PropTypes.string,
  year: PropTypes.string.isRequired,
  onMouseEnter: PropTypes.func.isRequired,
}

ProjectCard.displayName = 'ProjectCard'

export const ProjectGrid = ({ projectType }) => {
  const [projects, setProjects] = useState(initialProjects[projectType] || [])
  const { 
    loadProject, 
    getProjectImages,
    error 
  } = useProjectImagesStore()

  // Function to preload project detail images
  const preloadProjectImages = async (projectId) => {
    // Convert project ID to match exact storage keys
    const projectKey = projectId
      .toUpperCase()
      .replace(/-/g, '_');
    
    try {
      await loadProject(projectKey);
      const images = getProjectImages(projectKey);
      
      // Preload first 4 images
      await Promise.all(
        images.slice(0, 4).map(url => preloadImage(url))
      );
    } catch (error) {
      console.error('Error preloading project images:', error);
    }
  };

  useEffect(() => {
    const loadProjects = async () => {
      // Initialize with static data first
      setProjects(initialProjects[projectType] || [])

      const projectKeys = getProjectKeysByType(projectType)
      
      // Load each project's first image
      const loadedProjects = await Promise.all(
        projectKeys.map(async (key) => {
          await loadProject(key)
          const images = getProjectImages(key)
          const firstImage = images[0]
          
          // Find matching initial project data by converting storage key to project ID format
          const projectId = key.toLowerCase().replace(/_/g, '-')
          const initialProject = initialProjects[projectType]?.find(p => p.id === projectId) || {}
          
          // Preload the first image
          if (firstImage) {
            await preloadImage(firstImage);
          }
          
          return {
            ...initialProject,
            imageUrl: firstImage
          }
        })
      )

      setProjects(loadedProjects.filter(Boolean))
    }

    loadProjects()
  }, [projectType, loadProject, getProjectImages])

  if (error) {
    return (
      <div className="w-full h-[50vh] flex items-center justify-center text-red-500">
        Error loading images: {error}
      </div>
    )
  }

  return (
    <div className="w-full overflow-x-auto pb-6">
      <div className="flex justify-center gap-4 min-w-max px-4">
        <div className="flex gap-4 max-w-6xl">
          {projects.map((project) => (
            <div key={`project-${project.id}`} className="w-[120px]">
              <ProjectCard 
                {...project} 
                key={`card-${project.id}`}
                onMouseEnter={() => preloadProjectImages(project.id)}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

ProjectGrid.propTypes = {
  projectType: PropTypes.oneOf(Object.values(PROJECT_TYPES)).isRequired,
}

ProjectGrid.displayName = 'ProjectGrid'

export default ProjectGrid