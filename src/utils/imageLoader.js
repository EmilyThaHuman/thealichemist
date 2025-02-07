export function importAll(r) {
  let images = {};
  r.keys().forEach((item) => { 
    images[item.replace('./', '')] = r(item);
  });
  return images;
}

// Import all images from the src/assets directory
export const buenosAiresImages = Object.values(import.meta.glob('../assets/projects/BUENOS_AIRES/*.{png,jpg,jpeg,svg}', { 
  eager: true,
}));

export const fishingLodgeImages = Object.values(import.meta.glob('../assets/projects/FISHING_LODGE/*.{png,jpg,jpeg,svg}', {
  eager: true,
}));

export const chateauMarmotImages = Object.values(import.meta.glob('../assets/projects/CHATEAU_MARMOT/*.{png,jpg,jpeg,svg}', {
  eager: true,
}));

export const studioImages = Object.values(import.meta.glob('../assets/projects/STUDIO/*.{png,jpg,jpeg,svg}', {
  eager: true,
}));

export const seattleHouseImages = Object.values(import.meta.glob('../assets/projects/SEATTLE_HOUSE/*.{png,jpg,jpeg,svg}', {
  eager: true,
}));

export const casaMalibuImages = Object.values(import.meta.glob('../assets/projects/CASA_MALIBU/*.{png,jpg,jpeg,svg}', {
  eager: true,
}));

export const sandCastleImages = Object.values(import.meta.glob('../assets/projects/SAND_CASTLE/*.{png,jpg,jpeg,svg}', {
  eager: true,
})); 