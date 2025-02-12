import { ProjectGrid, PROJECT_TYPES } from "@/components/ProjectGrid";

export default function ProductDesignPage() {
  return (
    <div className="container mx-auto px-4">
      <h1 className="text-3xl font-bold mb-8">Product Design</h1>
      <ProjectGrid projectType={PROJECT_TYPES.PRODUCT} />
    </div>
  );
} 