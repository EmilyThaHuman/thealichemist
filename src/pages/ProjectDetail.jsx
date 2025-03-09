import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { initialProjects } from "@/components/ProjectGrid";
import { motion, AnimatePresence } from "framer-motion";
import { useProjectImagesStore } from "@/utils/projectImages";

// Helper function to preload an image
const preloadImage = (src) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
};

// Convert project ID to storage key format
const getProjectKey = (projectId) => {
  if (!projectId) return null;
  return projectId.toUpperCase().replace(/-/g, '_');
};

const ProjectDetail = () => {
  const { id } = useParams();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [imageErrors, setImageErrors] = useState({});
  const [preloadedImages, setPreloadedImages] = useState({});
  const [error, setError] = useState(null);
  const { loadProject, getProjectImages } = useProjectImagesStore();
  
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
      
      try {
        const key = getProjectKey(project.id);
        if (!key) {
          throw new Error('Invalid project ID');
        }
        console.log('Loading project with key:', key); // Debug log
        await loadProject(key);
        setError(null);
      } catch (err) {
        console.error('Error loading project:', err);
        setError(err.message);
      }
    };
    
    loadImages();
  }, [project, loadProject]);

  // Preload images effect
  useEffect(() => {
    const preloadNextImages = async () => {
      if (!project?.id) return;
      
      try {
        const key = getProjectKey(project.id);
        if (!key) return;
        
        const images = getProjectImages(key);
        if (!images?.length) return;

        // Preload next 4 images (2 pairs)
        const nextIndexes = [
          (currentIndex + 1) % images.length,
          (currentIndex + 2) % images.length,
          (currentIndex + 3) % images.length,
          (currentIndex + 4) % images.length,
        ];

        await Promise.all(
          nextIndexes.map(async (index) => {
            const imageUrl = images[index];
            if (imageUrl && !preloadedImages[imageUrl]) {
              await preloadImage(imageUrl);
              setPreloadedImages(prev => ({ ...prev, [imageUrl]: true }));
            }
          })
        );
      } catch (error) {
        console.error('Error preloading images:', error);
      }
    };

    preloadNextImages();
  }, [currentIndex, project, getProjectImages, preloadedImages]);

  // Filter out images that have errors
  useEffect(() => {
    if (Object.keys(imageErrors).length > 0) {
      // If errors occurred, we need to refresh the current pair
      const currentPair = getCurrentPair();
      
      // Check if any images in the current pair have errors
      const hasErrors = currentPair.some(img => imageErrors[img]);
      
      // If there are errors, move to the next set of images
      if (hasErrors) {
        goToNext();
      }
    }
  }, [imageErrors]);

  if (!project) {
    return <div>Project not found</div>;
  }

  if (error) {
    return <div>Error loading images: {error}</div>;
  }

  const projectKey = getProjectKey(project.id);
  if (!projectKey) {
    return <div>Invalid project configuration</div>;
  }

  const projectImages = getProjectImages(projectKey);

  if (!projectImages || projectImages.length === 0) {
    return <div>Loading images...</div>;
  }

  const getCurrentPair = () => {
    // Only use the available images without placeholders
    const firstImageIndex = currentIndex % projectImages.length;
    const secondImageIndex = (currentIndex + 1) % projectImages.length;
    
    // Create the pair using the available images
    const pair = [];
    
    // Only add images that exist and don't have loading errors
    if (projectImages[firstImageIndex] && !imageErrors[projectImages[firstImageIndex]]) {
      pair.push(projectImages[firstImageIndex]);
    }
    
    // Only add the second image if it exists and we have enough images
    if (projectImages.length > 1 && 
        projectImages[secondImageIndex] && 
        !imageErrors[projectImages[secondImageIndex]]) {
      pair.push(projectImages[secondImageIndex]);
    }
    
    return pair;
  };

  const currentPair = getCurrentPair();

  const goToNext = () => {
    setDirection(1);
    // Skip by the actual number of images shown (could be 1 or 2)
    const increment = currentPair.length;
    setCurrentIndex(prev => (prev + increment) % projectImages.length);
  };

  const goToPrevious = () => {
    setDirection(-1);
    // Skip by the actual number of images shown in the current pair
    const increment = currentPair.length;
    setCurrentIndex(prev => 
      prev < increment ? projectImages.length - increment : prev - increment
    );
  };

  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.95
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1
    },
    exit: (direction) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.95
    })
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
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
        <div className="relative w-[90%] max-w-7xl group">
          <div className="h-[60vh] min-h-[400px] w-full relative bg-background">
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
                    stiffness: 200,
                    damping: 25,
                    mass: 0.8,
                    restDelta: 0.001,
                    restSpeed: 0.001,
                    velocity: 0
                  },
                  opacity: { 
                    duration: 0.4,
                    ease: [0.4, 0, 0.2, 1]
                  },
                  scale: {
                    duration: 0.4,
                    ease: [0.4, 0, 0.2, 1]
                  }
                }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <div className={`flex justify-center w-full h-full px-2 ${currentPair.length === 1 ? 'items-center' : ''}`}>
                  {currentPair.length === 0 ? (
                    <div className="flex items-center justify-center text-gray-500">
                      No images available
                    </div>
                  ) : (
                    currentPair.map((image, index) => (
                      <div 
                        key={index} 
                        className={`relative h-full bg-background/50 flex items-center justify-center px-1 ${
                          currentPair.length === 1 ? 'w-1/2 mx-auto' : ''
                        }`}
                      >
                        <div className="w-full h-full relative flex items-center justify-center">
                          <img
                            src={image}
                            alt={`${project.title} ${currentIndex + index + 1}`}
                            className="max-w-full max-h-full object-contain mx-auto"
                            onError={(e) => {
                              console.warn(`Failed to load image: ${image}`);
                              setImageErrors(prev => ({
                                ...prev,
                                [image]: true
                              }));
                            }}
                          />
                        </div>
                      </div>
                    ))
                  )}
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
