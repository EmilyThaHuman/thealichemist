export { useAuthStore } from './authStore'
export { useUIStore } from './uiStore'
export { useAIStore } from './aiStore'

// Helper to combine multiple stores
export const useStore = (selector) => {
  const auth = useAuthStore(selector)
  const ui = useUIStore(selector)
  const ai = useAIStore(selector)
  
  return {
    auth,
    ui,
    ai
  }
}