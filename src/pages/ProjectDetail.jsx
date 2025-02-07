import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { projects } from "@/components/ProjectGrid";
import { motion } from "framer-motion";

export default function ProjectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [project, setProject] = useState(null);

  useEffect(() => {
    const currentProject = projects.find(p => p.id === id);
    if (!currentProject) {
      navigate("/projects", { replace: true });
      return;
    }
    setProject(currentProject);
  }, [id, navigate]);

  if (!project) return null;

  const projectImages = [
    project.image,
    // Add more images specific to this project
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop",
  ];

  const nextImage = () => {
    setCurrentImageIndex((prev) =>
      prev === projectImages.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? projectImages.length - 1 : prev - 1
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen pt-24 bg-background"
    >
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          <Link
            to="/projects"
            className="inline-flex items-center gap-2 mb-8 text-sm hover:text-primary transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Projects
          </Link>

          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">
              {project.title} {project.location}
            </h1>
            <p className="text-muted-foreground">{project.description}</p>
          </div>

          <div className="relative aspect-[16/9] bg-muted rounded-lg overflow-hidden mb-8">
            <motion.img
              key={currentImageIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              src={projectImages[currentImageIndex]}
              alt={`${project.title} ${currentImageIndex + 1}`}
              className="w-full h-full object-cover"
            />

            <Button
              variant="secondary"
              size="icon"
              onClick={prevImage}
              className="absolute left-4 top-1/2 -translate-y-1/2"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>

            <Button
              variant="secondary"
              size="icon"
              onClick={nextImage}
              className="absolute right-4 top-1/2 -translate-y-1/2"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>

            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              {projectImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentImageIndex ? "bg-white" : "bg-white/50"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Project Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-xl font-semibold mb-4">Project Details</h2>
              <dl className="space-y-2">
                <dt className="text-muted-foreground">Location</dt>
                <dd className="font-medium">{project.location}</dd>
                <dt className="text-muted-foreground mt-4">Year</dt>
                <dd className="font-medium">{project.year}</dd>
              </dl>
            </div>
            <div>
              <h2 className="text-xl font-semibold mb-4">Description</h2>
              <p className="text-muted-foreground">{project.description}</p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

ProjectDetail.displayName = "ProjectDetail";
