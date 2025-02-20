import { ProjectGrid, PROJECT_TYPES } from "@/components/ProjectGrid";

export default function RentalsPage() {
  return (
    <div className="container mx-auto px-4">
      <h1 className="text-3xl font-bold mb-8">Luxury Rentals at Cerritos Beach</h1>
      <div className="mb-8">
        <h2 className="text-2xl mb-4">Experience Beachfront Living in Baja California Sur</h2>
        <p className="text-lg mb-4">
          Discover our architect-designed luxury properties at Cerritos Beach. 
          Perfect for surfing enthusiasts and those seeking a premium beach getaway.
        </p>
      </div>
      <ProjectGrid projectType={PROJECT_TYPES.RENTALS} />
    </div>
  );
} 