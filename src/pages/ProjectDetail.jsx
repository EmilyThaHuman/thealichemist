import { useState } from "react";
import { useParams } from "react-router-dom";
import { projects } from "@/components/ProjectGrid";
import { motion, AnimatePresence } from "framer-motion";
import {
  buenosAiresImages,
  fishingLodgeImages,
  chateauMarmotImages,
  studioImages,
  seattleHouseImages,
  casaMalibuImages,
  sandCastleImages
} from "@/utils/projectImages";

const ProjectDetail = () => {
  const { id } = useParams();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [imageError, setImageError] = useState(false);

  const project = projects.find((p) => p.id === id);

  if (!project) {
    return <div>Project not found</div>;
  }

  const getProjectImages = (projectId) => {
    switch (projectId) {
      case "buenos-aires":
        return buenosAiresImages;
      case "fishing-lodge":
        return fishingLodgeImages;
      case "ali-wood":
        return [
          project.image,
          "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c",
          "https://images.unsplash.com/photo-1600607687644-c7171b42498a",
        ];
      case "chateau-marmot":
        return chateauMarmotImages;
      case "studio":
        return studioImages;
      case "seattle-house":
        return seattleHouseImages;
      case "casa-malibu":
        return casaMalibuImages;
      case "sand-castle":
        return sandCastleImages;
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
                      <img
                        src={image}
                        alt={`${project.title} ${currentIndex + index + 1}`}
                        className="w-full h-full object-contain"
                        onError={(e) => {
                          const error = e.target.error;
                          console.error(`Failed to load image: ${image}`, error);
                          setImageError(true);
                        }}
                      />
                      {imageError && (
                        <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
                          <p>Image failed to load: {image}</p>
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
