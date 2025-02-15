import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { supabase, signIn, signUp, signOut } from '@/lib/supabase'

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      session: null,
      loading: false,
      error: null,

      setUser: (user) => set({ user }),
      setSession: (session) => set({ session }),
      setLoading: (loading) => set({ loading }),
      setError: (error) => set({ error }),

      initialize: async () => {
        const { data: { session } } = await supabase.auth.getSession()
        if (session) {
          set({
            user: session.user,
            session
          })
        }

        // Set up auth state change listener
        supabase.auth.onAuthStateChange((_event, session) => {
          set({
            user: session?.user ?? null,
            session
          })
        })
      },

      login: async (credentials) => {
        set({ loading: true, error: null })
        try {
          const { data, error } = await signIn(credentials)
          if (error) throw error
          set({
            user: data.user,
            session: data.session
          })
          return { data }
        } catch (error) {
          set({ error: error.message })
          return { error }
        } finally {
          set({ loading: false })
        }
      },

      register: async (credentials) => {
        set({ loading: true, error: null })
        try {
          const { data, error } = await signUp(credentials)
          if (error) throw error
          return { data }
        } catch (error) {
          set({ error: error.message })
          return { error }
        } finally {
          set({ loading: false })
        }
      },

      logout: async () => {
        set({ loading: true, error: null })
        try {
          const { error } = await signOut()
          if (error) throw error
          set({
            user: null,
            session: null
          })
        } catch (error) {
          set({ error: error.message })
        } finally {
          set({ loading: false })
        }
      }
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        session: state.session
      })
    }
  )
)