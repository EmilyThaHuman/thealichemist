// Helper function to get base URL for images based on environment
const getBaseUrl = () => {
  if (import.meta.env.PROD) {
    // In production, use the GitHub URL
    return import.meta.env.VITE_GIT_PROJECT_URL || 'https://github.com/EmilyThaHuman/thealichemist/blob/main/src/assets/projects';
  }
  // In development, use local assets
  return '../assets/projects';
};

// Helper function to check if file exists with specific extension
const checkImageExists = async (projectPath, number, ext) => {
  try {
    const baseUrl = getBaseUrl();
    const url = import.meta.env.PROD
      ? `${baseUrl}/${projectPath}/${number}.${ext}?raw=true` // Add ?raw=true for GitHub raw content
      : new URL(`${projectPath}/${number}.${ext}`, import.meta.url).href;
      
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
    aliWoodImages,
    fitToBeTiedImages,
    vwVansImages,
    mochilasImages,
  ] = await Promise.all([
    createNumberedImageArray('BUENOS_AIRES', extensions, 26),
    createNumberedImageArray('FISHING_LODGE', extensions, 15),
    createNumberedImageArray('CHATEAU_MARMOT', extensions, 20),
    createNumberedImageArray('STUDIO', extensions, 12),
    createNumberedImageArray('SEATTLE_HOUSE', extensions, 18),
    createNumberedImageArray('CASA_MALIBU', extensions, 22),
    createNumberedImageArray('SAND_CASTLE', extensions, 16),
    createNumberedImageArray('ALI_WOOD', extensions, 10),
    createNumberedImageArray('FIT_TO_BE_TIED', extensions, 10),
    createNumberedImageArray('VW_VANS', extensions, 10),
    createNumberedImageArray('MOCHILAS', extensions, 10)
  ]);

  return {
    buenosAiresImages,
    fishingLodgeImages,
    chateauMarmotImages,
    studioImages,
    seattleHouseImages,
    casaMalibuImages,
    sandCastleImages,
    aliWoodImages,
    fitToBeTiedImages,
    vwVansImages,
    mochilasImages
  };
};

export default initializeImages; 