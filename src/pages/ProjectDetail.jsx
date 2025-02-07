import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const ProjectDetail = () => {
  const { id } = useParams();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const projectImages = [
    "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2075&auto=format&fit=crop",
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
    <div className="min-h-screen pt-24 bg-background">
      <div className="container mx-auto px-4">
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 mb-8 text-sm hover:text-primary transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Projects
        </Link>
        
        <div className="relative aspect-[16/9] bg-muted rounded-lg overflow-hidden">
          <img
            src={projectImages[currentImageIndex]}
            alt={`Project image ${currentImageIndex + 1}`}
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
      </div>
    </div>
  );
};

export default ProjectDetail; 