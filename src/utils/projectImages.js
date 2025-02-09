// Helper function to check if file exists with specific extension
const checkImageExists = async (projectPath, number, ext) => {
  try {
    const url = new URL(`${projectPath}/${number}.${ext}`, import.meta.url).href;
    const response = await fetch(url, { method: 'HEAD' });
    return response.ok ? url : null;
  } catch {
    return null;
  }
};

// Helper function to try loading image with different extensions
const tryLoadImage = async (projectPath, number, extensions) => {
  for (const ext of extensions) {
    const url = await checkImageExists(projectPath, number, ext);
    if (url) {
      return url;
    }
  }
  console.warn(`Image ${number} not found in ${projectPath} with extensions:`, extensions);
  return null;
};

// Helper function to create array of numbered images
const createNumberedImageArray = async (projectPath, extensions, count) => {
  const extensionsArray = Array.isArray(extensions) ? extensions : [extensions];
  
  const imagePromises = Array.from({ length: count }, (_, i) => {
    const number = i + 1;
    return tryLoadImage(projectPath, number, extensionsArray);
  });

  const images = await Promise.all(imagePromises);
  return images.filter(Boolean); // Remove any null values if image loading failed
};

// Create and export image arrays
const initializeImages = async () => {
  const extensions = ['jpg', 'jpeg', 'JPG', 'JPEG'];

  const [
    buenosAiresImages,
    fishingLodgeImages,
    chateauMarmotImages,
    studioImages,
    seattleHouseImages,
    casaMalibuImages,
    sandCastleImages,
    aliWoodImages
  ] = await Promise.all([
    createNumberedImageArray('../assets/projects/BUENOS_AIRES', extensions, 26),
    createNumberedImageArray('../assets/projects/FISHING_LODGE', extensions, 15),
    createNumberedImageArray('../assets/projects/CHATEAU_MARMOT', extensions, 20),
    createNumberedImageArray('../assets/projects/STUDIO', extensions, 12),
    createNumberedImageArray('../assets/projects/SEATTLE_HOUSE', extensions, 18),
    createNumberedImageArray('../assets/projects/CASA_MALIBU', extensions, 22),
    createNumberedImageArray('../assets/projects/SAND_CASTLE', extensions, 16),
    createNumberedImageArray('../assets/projects/ALI_WOOD', extensions, 10)
  ]);

  return {
    buenosAiresImages,
    fishingLodgeImages,
    chateauMarmotImages,
    studioImages,
    seattleHouseImages,
    casaMalibuImages,
    sandCastleImages,
    aliWoodImages
  };
};

export default initializeImages; 