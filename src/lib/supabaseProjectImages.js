import { supabase } from './supabase'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// Project paths configuration
const PROJECT_PATHS = {
  BUENOS_AIRES: 'BUENOS_AIRES',
  FISHING_LODGE: 'FISHING_LODGE',
  CHATEAU_MARMOT: 'CHATEAU_MARMOT',
  STUDIO: 'STUDIO',
  SEATTLE_HOUSE: 'SEATTLE_HOUSE',
  CASA_MALIBU: 'CASA_MALIBU',
  SAND_CASTLE: 'SAND_CASTLE',
  ALI_WOOD: 'ALI_WOOD',
  FIT_TO_BE_TIED: 'FIT_TO_BE_TIED',
  VW_VANS: 'VW_VANS',
  MOCHILAS: 'MOCHILAS'
}

// Image counts for each project
const PROJECT_IMAGE_COUNTS = {
  BUENOS_AIRES: 26,
  FISHING_LODGE: 15,
  CHATEAU_MARMOT: 20,
  STUDIO: 12,
  SEATTLE_HOUSE: 18,
  CASA_MALIBU: 22,
  SAND_CASTLE: 16,
  ALI_WOOD: 10,
  FIT_TO_BE_TIED: 10,
  VW_VANS: 10,
  MOCHILAS: 10
}

// Helper function to check if file exists in Supabase storage
const checkImageExists = async (projectPath, number, ext) => {
  try {
    const path = `${projectPath}/${number}.${ext}`
    const { data } = await supabase.storage
      .from('projects')
      .getPublicUrl(path)

    const response = await fetch(data.publicUrl, { method: 'HEAD' })
    return response.ok ? data.publicUrl : null
  } catch {
    return null
  }
}

// Helper function to try loading image with different extensions
const tryLoadImage = async (projectPath, number, extensions) => {
  for (const ext of extensions) {
    const url = await checkImageExists(projectPath, number, ext)
    if (url) {
      return url
    }
  }
  console.warn(`Image ${number} not found in ${projectPath} with extensions:`, extensions)
  return null
}

// Helper function to create array of numbered images
const createNumberedImageArray = async (projectPath, extensions, count) => {
  const extensionsArray = Array.isArray(extensions) ? extensions : [extensions]
  
  const imagePromises = Array.from({ length: count }, (_, i) => {
    const number = i + 1
    return tryLoadImage(projectPath, number, extensionsArray)
  })

  const images = await Promise.all(imagePromises)
  return images.filter(Boolean)
}

// Zustand store for project images
export const useProjectImagesStore = create(
  persist(
    (set, get) => ({
      // Image arrays for each project
      images: {},
      loading: true,
      error: null,

      // Initialize all project images
      initializeImages: async () => {
        set({ loading: true, error: null })
        try {
          const extensions = ['jpg', 'jpeg', 'JPG', 'JPEG']
          const imagePromises = Object.entries(PROJECT_PATHS).map(async ([key, path]) => {
            const images = await createNumberedImageArray(
              path,
              extensions,
              PROJECT_IMAGE_COUNTS[key]
            )
            return [key.toLowerCase() + 'Images', images]
          })

          const results = await Promise.all(imagePromises)
          const imagesObject = Object.fromEntries(results)
          
          set({
            images: imagesObject,
            loading: false
          })

          return imagesObject
        } catch (error) {
          set({ error: error.message, loading: false })
          return null
        }
      },

      // Upload a new image to a project
      uploadProjectImage: async (projectPath, imageNumber, file) => {
        try {
          const fileExt = file.name.split('.').pop().toLowerCase()
          const path = `${projectPath}/${imageNumber}.${fileExt}`

          const { error: uploadError } = await supabase.storage
            .from('projects')
            .upload(path, file, {
              cacheControl: '3600',
              upsert: true
            })

          if (uploadError) throw uploadError

          // Refresh the specific project's images
          await get().refreshProjectImages(projectPath)

          return { success: true }
        } catch (error) {
          console.error('Error uploading image:', error)
          return { error: error.message }
        }
      },

      // Refresh images for a specific project
      refreshProjectImages: async (projectPath) => {
        try {
          const extensions = ['jpg', 'jpeg', 'JPG', 'JPEG']
          const projectKey = Object.keys(PROJECT_PATHS)
            .find(key => PROJECT_PATHS[key] === projectPath)
          
          if (!projectKey) throw new Error('Invalid project path')

          const images = await createNumberedImageArray(
            projectPath,
            extensions,
            PROJECT_IMAGE_COUNTS[projectKey]
          )

          set(state => ({
            images: {
              ...state.images,
              [projectKey.toLowerCase() + 'Images']: images
            }
          }))

          return images
        } catch (error) {
          console.error('Error refreshing project images:', error)
          return null
        }
      },

      // Delete a project image
      deleteProjectImage: async (projectPath, imageNumber) => {
        try {
          const { data: files, error: listError } = await supabase.storage
            .from('projects')
            .list(projectPath)

          if (listError) throw listError

          const fileToDelete = files.find(file => 
            file.name.startsWith(`${imageNumber}.`)
          )

          if (!fileToDelete) throw new Error('Image not found')

          const { error: deleteError } = await supabase.storage
            .from('projects')
            .remove([`${projectPath}/${fileToDelete.name}`])

          if (deleteError) throw deleteError

          // Refresh the project images after deletion
          await get().refreshProjectImages(projectPath)

          return { success: true }
        } catch (error) {
          console.error('Error deleting image:', error)
          return { error: error.message }
        }
      }
    }),
    {
      name: 'project-images-storage',
      partialize: (state) => ({
        images: state.images
      })
    }
  )
)

export default useProjectImagesStore