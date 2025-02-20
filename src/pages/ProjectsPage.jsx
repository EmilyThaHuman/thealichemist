import ProjectGrid from "@/components/ProjectGrid";
import { motion } from "framer-motion";

export default function ProjectsPage() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="w-full -mt-36"
    >
      <div className="px-4">
        <div className="max-w-2xl mb-4">
          <h1 className="text-4xl font-bold mb-1">Our Projects</h1>
          <p className="text-muted-foreground text-sm">
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
