import ProjectGrid from "@/components/ProjectGrid";
import { motion } from "framer-motion";

export default function ProjectsPage() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="w-full -mt-10"
    >
      <div className="container mx-auto">
        <div className="max-w-2xl mb-12 px-4">
          <h1 className="text-4xl font-bold mb-4">Our Projects</h1>
          <p className="text-muted-foreground">
            Explore our portfolio of architectural projects, each uniquely designed
            to transform spaces and enhance lives.
          </p>
        </div>
        <ProjectGrid />
      </div>
    </motion.div>
  );
}

ProjectsPage.displayName = "ProjectsPage";
