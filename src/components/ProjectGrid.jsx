import { Link } from "react-router-dom";

const projects = [
  {
    id: "martorell",
    title: "MARTORELL,",
    location: "MALLORCA",
    image: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d",
  },
  {
    id: "buger",
    title: "BUGER,",
    location: "MALLORCA",
    image: "https://images.unsplash.com/photo-1600607687644-c7171b42498b",
  },
  {
    id: "ponc-hug",
    title: "PONC HUG,",
    location: "MALLORCA",
    image: "https://images.unsplash.com/photo-1600607688969-a5bfcd646154",
  },
  {
    id: "consell",
    title: "CONSELL DE CENT,",
    location: "BARCELONA",
    image: "https://images.unsplash.com/photo-1600607688960-761c0c6b3c1d",
  },
  {
    id: "main-road",
    title: "MAIN ROAD,",
    location: "EAST MARION",
    image: "https://images.unsplash.com/photo-1600607688939-a5bfcd646154",
  },
];

const ProjectCard = ({ title, location, image }) => (
  <div className="group">
    <div className="aspect-[0.75] mb-2 overflow-hidden">
      <img
        src={image}
        alt={`${title} ${location}`}
        className="w-full h-full object-cover"
      />
    </div>
    <div className="text-[13px] leading-tight">
      {title} {location}
    </div>
  </div>
);

const ProjectGrid = () => {
  return (
    <div className="grid grid-cols-5 gap-4 mb-20">
      {projects.map((project) => (
        <ProjectCard key={project.id} {...project} />
      ))}
    </div>
  );
};

export default ProjectGrid; 