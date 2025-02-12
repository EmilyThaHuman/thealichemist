import { motion } from "framer-motion";

const AboutPage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="max-w-6xl mx-auto"
      >
        <div className="grid grid-cols-1 md:grid-cols-[1fr,1.5fr] gap-12">
          {/* Image Section */}
          <div className="relative aspect-[3/4] bg-muted rounded-lg overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1974&auto=format&fit=crop"
              alt="Portrait"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Content Section */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-semibold mb-2">Ali Vogt</h1>
              <h2 className="text-xl text-muted-foreground">Principal Architect</h2>
            </div>

            <div className="space-y-4 text-lg leading-relaxed">
              <p>
              I specialize in transforming ordinary spaces and things into extraordinary 
              creations by breathing life into old structures or materials. I love to 
              create sensible floor plans from forgotten buildngs or misbuilt spaces. 
              My experience spans from Buenos Aires, Mexico, and the USA, encompassing 
              architecture, interior design, product design, and the hospitality business.
              </p>
            </div>

            <div className="pt-4">
              <h3 className="text-xl font-medium mb-4">Education</h3>
              <ul className="space-y-2">
                <li>Bachelor of Arts, Colorado College</li>
                <li>Interior Design, Bellevue College</li>
              </ul>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AboutPage; 