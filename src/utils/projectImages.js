// Helper function to create array of numbered images
const createNumberedImageArray = (projectPath, extension, count) => {
  return Array.from({ length: count }, (_, i) => {
    const number = i + 1;
    return new URL(`${projectPath}/${number}.${extension}`, import.meta.url).href;
  });
};

// Buenos Aires Images (26 images)
const buenosAiresImages = createNumberedImageArray('../assets/projects/BUENOS_AIRES', 'JPG', 26);

// Fishing Lodge Images (15 images)
const fishingLodgeImages = createNumberedImageArray('../assets/projects/FISHING_LODGE', 'jpg', 15);

// Chateau Marmot Images (20 images)
const chateauMarmotImages = createNumberedImageArray('../assets/projects/CHATEAU_MARMOT', 'jpg', 20);

// Studio Images (12 images)
const studioImages = createNumberedImageArray('../assets/projects/STUDIO', 'jpg', 12);

// Seattle House Images (18 images)
const seattleHouseImages = createNumberedImageArray('../assets/projects/SEATTLE_HOUSE', 'jpg', 18);

// Casa Malibu Images (22 images)
const casaMalibuImages = createNumberedImageArray('../assets/projects/CASA_MALIBU', 'jpg', 22);

// Sand Castle Images (16 images)
const sandCastleImages = createNumberedImageArray('../assets/projects/SAND_CASTLE', 'jpg', 16);

export {
  buenosAiresImages,
  fishingLodgeImages,
  chateauMarmotImages,
  studioImages,
  seattleHouseImages,
  casaMalibuImages,
  sandCastleImages
}; 