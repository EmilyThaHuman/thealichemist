import { supabase } from '@/lib/supabase'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// Project configuration
export const PROJECT_CONFIG = {
  BUENOS_AIRES: { path: 'BUENOS_AIRES', count: 26 },
  FISHING_LODGE: { path: 'FISHING_LODGE', count: 15 },
  CHATEAU_MARMOT: { path: 'CHATEAU_MARMOT', count: 20 },
  STUDIO: { path: 'STUDIO', count: 12 },
  SEATTLE_HOUSE: { path: 'SEATTLE_HOUSE', count: 18 },
  CASA_MALIBU: { path: 'CASA_MALIBU', count: 22 },
  SAND_CASTLE: { path: 'SAND_CASTLE', count: 16 },
  ALI_WOOD: { path: 'ALI_WOOD', count: 10 },
  FIT_TO_BE_TIED: { path: 'FIT_TO_BE_TIED', count: 10 },
  VW_VANS: { path: 'VW_VANS', count: 10 },
  MOCHILAS: { path: 'MOCHILAS', count: 10 },
  SCHUYLERS_HOUSE: { path: 'SCHUYLERS_HOUSE', count: 10 },
  MIKES_HOUSE: { path: 'MIKES_HOUSE', count: 10 }
}

// Cache configuration
const CACHE_DURATION = 30 * 60 * 1000 // 30 minutes

// Helper to check if cache is valid
const isCacheValid = (timestamp) => {
  return timestamp && (Date.now() - timestamp) < CACHE_DURATION
}

// Helper function to get public URL for a file
const getPublicUrl = async (path) => {
  try {
    console.log('Getting public URL for path:', path)
    const { data } = await supabase.storage
      .from('projects')
      .getPublicUrl(path)
    
    console.log('Public URL result:', data?.publicUrl)
    return data?.publicUrl || null
  } catch (error) {
    console.error(`Error getting public URL for ${path}:`, error)
    return null
  }
}

// Helper function to list files in a project folder
const listProjectFiles = async (projectPath) => {
  try {
    console.log('Listing files for project path:', projectPath)
    const { data: files, error } = await supabase.storage
      .from('projects')
      .list(projectPath, {
        sortBy: { column: 'name', order: 'asc' }
      })

    if (error) throw error
    console.log('Files found:', files?.length || 0)
    return files || []
  } catch (error) {
    console.error(`Error listing files for ${projectPath}:`, error)
    return []
  }
}

// Helper function to batch process files
const processBatch = async (files, projectPath, count, startIdx, batchSize) => {
  const endIdx = Math.min(startIdx + batchSize, count)
  const results = []

  for (let i = startIdx; i < endIdx; i++) {
    const file = files[i]
    if (file && file.name) {
      const path = `${projectPath}/${file.name}`
      const url = await getPublicUrl(path)
      if (url) {
        console.log(`Successfully got URL for ${path}:`, url)
        results.push({ index: i + 1, url })
      }
    }
  }

  return results
}

// Helper function to create array of numbered images with batching
const createNumberedImageArray = async (projectPath, count, onProgress) => {
  try {
    console.log('Creating numbered image array for:', projectPath)
    const files = await listProjectFiles(projectPath)
    if (!files.length) {
      console.warn(`No files found for project: ${projectPath}`)
      return []
    }

    // Sort files by numeric order
    const sortedFiles = files.sort((a, b) => {
      const numA = parseInt(a.name.split('.')[0])
      const numB = parseInt(b.name.split('.')[0])
      return numA - numB
    })

    console.log(`Found ${sortedFiles.length} files for ${projectPath}`)
    const BATCH_SIZE = 5 // Process 5 images at a time
    const images = []
    
    // Use the actual number of files instead of the specified count
    const actualCount = sortedFiles.length
    
    for (let i = 0; i < actualCount; i += BATCH_SIZE) {
      // Process in batches using the actual files we have
      const batchResults = await Promise.all(
        sortedFiles.slice(i, i + BATCH_SIZE).map(async (file) => {
          if (file && file.name) {
            const path = `${projectPath}/${file.name}`
            const url = await getPublicUrl(path)
            if (url) {
              console.log(`Successfully got URL for ${path}:`, url)
              // Extract the actual number from the filename to maintain correct indexing
              const fileNumber = parseInt(file.name.split('.')[0])
              return { index: fileNumber, url }
            }
          }
          return null
        })
      )
      
      // Filter out null results and add to images array
      const validResults = batchResults.filter(Boolean)
      images.push(...validResults.map(r => r.url))
      
      // Report progress
      if (onProgress) {
        onProgress({
          project: projectPath,
          loaded: Math.min(i + BATCH_SIZE, actualCount),
          total: actualCount
        })
      }
    }
    
    console.log(`Successfully loaded ${images.length} images for ${projectPath}`)
    return images
  } catch (error) {
    console.error(`Error creating image array for ${projectPath}:`, error)
    return []
  }
}

// Zustand store for project images
export const useProjectImagesStore = create(
  persist(
    (set, get) => ({
      images: {},
      loadingProjects: {},
      projectCache: {}, // Cache timestamps for each project
      error: null,
      progress: {},

      loadProject: async (projectKey) => {
        const state = get()
        
        // Check if project is already loading
        if (state.loadingProjects[projectKey]) {
          return state.images[`${projectKey.toLowerCase()}Images`] || []
        }

        // Check cache validity
        const cache = state.projectCache[projectKey]
        if (cache && isCacheValid(cache.timestamp)) {
          return state.images[`${projectKey.toLowerCase()}Images`] || []
        }

        try {
          set(state => ({
            loadingProjects: { ...state.loadingProjects, [projectKey]: true }
          }))

          const config = PROJECT_CONFIG[projectKey]
          if (!config) throw new Error('Invalid project key')

          const images = await createNumberedImageArray(
            config.path,
            config.count,
            (progress) => {
              set(state => ({
                progress: { ...state.progress, [projectKey]: progress }
              }))
            }
          )

          set(state => ({
            images: {
              ...state.images,
              [`${projectKey.toLowerCase()}Images`]: images
            },
            projectCache: {
              ...state.projectCache,
              [projectKey]: { timestamp: Date.now() }
            },
            loadingProjects: {
              ...state.loadingProjects,
              [projectKey]: false
            }
          }))

          return images
        } catch (error) {
          console.error(`Error loading project ${projectKey}:`, error)
          set(state => ({
            loadingProjects: {
              ...state.loadingProjects,
              [projectKey]: false
            },
            error: error.message
          }))
          return []
        }
      },

      isProjectLoading: (projectKey) => {
        return get().loadingProjects[projectKey] || false
      },

      getProjectProgress: (projectKey) => {
        return get().progress[projectKey] || null
      },

      clearProjectCache: (projectKey) => {
        if (projectKey) {
          set(state => ({
            projectCache: {
              ...state.projectCache,
              [projectKey]: null
            }
          }))
        } else {
          set({ projectCache: {} })
        }
      },

      uploadProjectImage: async (projectKey, file, index) => {
        try {
          const config = PROJECT_CONFIG[projectKey]
          if (!config) throw new Error('Invalid project key')

          const fileExt = file.name.split('.').pop().toUpperCase()
          const path = `${config.path}/${index}.${fileExt}`

          const { error: uploadError } = await supabase.storage
            .from('projects')
            .upload(path, file, {
              cacheControl: '3600',
              upsert: true
            })

          if (uploadError) throw uploadError

          // Clear cache and reload project
          await get().clearProjectCache(projectKey)
          await get().loadProject(projectKey)
          
          return { success: true }
        } catch (error) {
          console.error('Error uploading image:', error)
          return { error: error.message }
        }
      },

      getProjectImages: (projectKey) => {
        const storeKey = `${projectKey.toLowerCase()}Images`
        return get().images[storeKey] || []
      }
    }),
    {
      name: 'project-images-storage',
      partialize: (state) => ({
        images: state.images,
        projectCache: state.projectCache
      })
    }
  )
)

// Export default initializer function for backward compatibility
const initializeImages = async (projectKey) => {
  const store = useProjectImagesStore.getState()
  return store.loadProject(projectKey)
}

export default initializeImages