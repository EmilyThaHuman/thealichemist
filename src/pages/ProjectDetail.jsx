import { useState } from "react";
import { useParams } from "react-router-dom";
import { projects } from "@/components/ProjectGrid";
import { motion, AnimatePresence } from "framer-motion";

const ProjectDetail = () => {
  const { id } = useParams();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const project = projects.find((p) => p.id === id);

  if (!project) {
    return <div>Project not found</div>;
  }

  const projectImages = [
    project.image,
    "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c",
    "https://images.unsplash.com/photo-1600607687644-c7171b42498a",
    "https://images.unsplash.com/photo-1600607687920-4e2a09cf159e",
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c",
    "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9",
    "https://images.unsplash.com/photo-1600607688969-a5bfcd646154",
    "https://images.unsplash.com/photo-1600607688960-761c0c6b3c1d",
  ];

  const getCurrentPair = () => {
    return [
      projectImages[currentIndex],
      projectImages[currentIndex + 1],
    ].filter(Boolean);
  };

  const currentPair = getCurrentPair();

  const goToNext = () => {
    setDirection(1);
    setCurrentIndex(prev => {
      if (prev >= projectImages.length - 1) return 0;
      if (prev === projectImages.length - 2) return projectImages.length - 1;
      return prev + 1;
    });
  };

  const goToPrevious = () => {
    setDirection(-1);
    setCurrentIndex(prev => {
      if (prev === 0) return projectImages.length - 1;
      return prev - 1;
    });
  };

  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0
    })
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="bg-background"
    >
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto py-8">
          <h1 className="text-2xl font-medium">
            {project.title}
          </h1>
          <div className="mt-2 space-y-4">
            <p className="text-lg text-muted-foreground">
              {project.year}
            </p>
            <p className="text-lg">
              {project.description}
            </p>
          </div>
        </div>
      </div>

      <div className="flex justify-center w-full overflow-hidden">
        <div className="relative w-[75%] group">
          <div className="aspect-[16/9] w-full relative bg-background">
            <AnimatePresence initial={false} custom={direction}>
              <motion.div
                key={currentIndex}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: "spring", stiffness: 300, damping: 30 },
                  opacity: { duration: 0.2 }
                }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <img
                  src={projectImages[currentIndex]}
                  alt={`${project.title} ${currentIndex + 1}`}
                  className="w-full h-full object-contain"
                />
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

          <div className="absolute -bottom-16 left-0 right-0 flex justify-center px-4">
            <div className="flex gap-2 overflow-x-auto pb-4 max-w-full">
              {projectImages.map((image, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setDirection(index > currentIndex ? 1 : -1);
                    setCurrentIndex(index);
                  }}
                  className={`relative flex-shrink-0 w-20 h-20 overflow-hidden rounded-sm transition-all duration-300 ${
                    index === currentIndex 
                      ? 'ring-2 ring-white' 
                      : 'opacity-50 hover:opacity-75'
                  }`}
                >
                  <img
                    src={image}
                    alt={`Thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 mt-24">
        <div className="max-w-3xl mx-auto py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-lg font-medium mb-4">Project Details</h2>
              <dl className="space-y-2">
                <dt className="text-muted-foreground">Location</dt>
                <dd className="font-medium">{project.location}</dd>
                <dt className="text-muted-foreground mt-4">Year</dt>
                <dd className="font-medium">{project.year}</dd>
              </dl>
            </div>
            <div>
              <h2 className="text-lg font-medium mb-4">Description</h2>
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
