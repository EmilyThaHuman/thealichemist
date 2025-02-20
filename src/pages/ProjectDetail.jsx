import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { initialProjects } from "@/components/ProjectGrid";
import { motion, AnimatePresence } from "framer-motion";
import { useProjectImagesStore } from "@/utils/projectImages";

const ProjectDetail = () => {
  const { id } = useParams();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [imageErrors, setImageErrors] = useState({});
  const [images, setImages] = useState(null);
  const { loadProject } = useProjectImagesStore();
  
  // Find project across all project types
  const project = Object.values(initialProjects)
    .flat()
    .find((p) => p.id === id);

  useEffect(() => {
    const loadImages = async () => {
      if (!project?.id) {
        console.warn('Project ID not available');
        return;
      }
      
      // Convert project ID to the correct format for PROJECT_CONFIG
      const projectKey = project.id.toUpperCase().replace(/-/g, '_');
      
      try {
        const projectImages = await loadProject(projectKey);
        if (projectImages?.length) {
          setImages({ [`${project.id.toLowerCase()}Images`]: projectImages });
        } else {
          // Fallback to just using the main project image
          setImages({ [`${project.id.toLowerCase()}Images`]: [project.image] });
        }
      } catch (error) {
        console.error('Error loading images:', error);
        // Fallback to just using the main project image
        setImages({ [`${project.id.toLowerCase()}Images`]: [project.image] });
      }
    };
    
    loadImages();
  }, [project, loadProject]); // Add loadProject as a dependency

  if (!project) {
    return <div>Project not found</div>;
  }

  if (!images) return <div>Loading...</div>;

  const getProjectImages = (projectId) => {
    if (!images) return [project.image];

    switch (projectId) {
      case "buenos-aires":
        return images.buenosAiresImages || [project.image];
      case "fishing-lodge":
        return images.fishingLodgeImages || [project.image];
      case "ali-wood":
        return [
          project.image,
          "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c",
          "https://images.unsplash.com/photo-1600607687644-c7171b42498a",
        ];
      case "chateau-marmot":
        return images.chateauMarmotImages || [project.image];
      case "studio":
        return images.studioImages || [project.image];
      case "seattle-house":
        return images.seattleHouseImages || [project.image];
      case "casa-malibu":
        return images.casaMalibuImages || [project.image];
      case "sand-castle":
        return images.sandCastleImages || [project.image];
      case "vw-vans":
        return images.vwVansImages || [project.image];
      case "mochilas":
        return images.mochilasImages || [project.image];
      case "fit-to-be-tied":
        return images.fitToBeTiedImages || [project.image];
      default:
        return [project.image];
    }
  };

  const projectImages = getProjectImages(id);

  const getCurrentPair = () => {
    return [
      projectImages[currentIndex],
      projectImages[(currentIndex + 1) % projectImages.length],
    ].filter(Boolean);
  };

  const currentPair = getCurrentPair();

  const goToNext = () => {
    setDirection(1);
    setCurrentIndex(prev => (prev + 1) % projectImages.length);
  };

  const goToPrevious = () => {
    setDirection(-1);
    setCurrentIndex(prev => 
      prev === 0 ? projectImages.length - 1 : prev - 1
    );
  };

  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? 500 : -500,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction) => ({
      zIndex: 0,
      x: direction < 0 ? 500 : -500,
      opacity: 0
    })
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="bg-background pt-4"
    >
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto pb-4">
          <h1 className="text-2xl font-medium mb-1">
            {project.title}
          </h1>
          <div className="space-y-1">
            <p className="text-lg text-muted-foreground">
              {project.year}
            </p>
            <p className="text-lg">
              {project.description}
            </p>
          </div>
        </div>
      </div>

      <div className="flex justify-center w-full overflow-hidden mb-4">
        <div className="relative w-[75%] group">
          <div className="aspect-[16/5] w-full relative bg-background">
            <AnimatePresence initial={false} custom={direction}>
              <motion.div
                key={currentIndex}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { 
                    type: "spring", 
                    stiffness: 300,
                    damping: 30,
                    mass: 1,
                    restDelta: 0.01,
                    restSpeed: 0.01,
                    velocity: 0
                  },
                  opacity: { 
                    duration: 0.2,
                    ease: [0.4, 0, 0.2, 1]
                  }
                }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <div className="grid grid-cols-2 gap-4 w-full h-full px-4">
                  {currentPair.map((image, index) => (
                    <div key={index} className="relative h-full">
                      {!imageErrors[image] ? (
                        <img
                          src={image}
                          alt={`${project.title} ${currentIndex + index + 1}`}
                          className="w-full h-full object-contain"
                          onError={(e) => {
                            if (e.target.src !== project.image) {
                              console.warn(`Failed to load image: ${image}, falling back to thumbnail`);
                              e.target.src = project.image;
                              setImageErrors(prev => ({
                                ...prev,
                                [image]: true
                              }));
                            }
                          }}
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                          <img
                            src={project.image}
                            alt={`${project.title} thumbnail`}
                            className="w-full h-full object-contain"
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>

            <div className="absolute inset-0 flex items-center justify-between z-10">
              <button
                onClick={goToPrevious}
                className="ml-4 w-10 h-10 rounded-full bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-black/70 cursor-pointer"
                aria-label="Previous image"
              >
                <svg 
                  className="w-6 h-6 text-white pointer-events-none"
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M15 19l-7-7 7-7" 
                  />
                </svg>
              </button>
              <button
                onClick={goToNext}
                className="mr-4 w-10 h-10 rounded-full bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-black/70 cursor-pointer"
                aria-label="Next image"
              >
                <svg 
                  className="w-6 h-6 text-white pointer-events-none"
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M9 5l7 7-7 7" 
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-lg font-medium mb-2">Project Details</h2>
              <dl className="space-y-1">
                <dt className="text-muted-foreground">Location</dt>
                <dd className="font-medium">{project.location}</dd>
                <dt className="text-muted-foreground mt-2">Year</dt>
                <dd className="font-medium">{project.year}</dd>
              </dl>
            </div>
            <div>
              <h2 className="text-lg font-medium mb-2">Description</h2>
              <p className="text-muted-foreground">{project.description}</p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProjectDetail;

ProjectDetail.displayName = "ProjectDetail";
