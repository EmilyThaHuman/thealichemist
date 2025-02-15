import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { createRecord, updateRecord, deleteRecord, queryRecords } from '@/lib/supabase'

export const useAIStore = create(
  persist(
    (set, get) => ({
      // Conversations state
      conversations: [],
      activeConversation: null,
      messages: [],
      isProcessing: false,
      error: null,

      // Conversation methods
      setActiveConversation: (conversationId) => {
        set({ activeConversation: conversationId })
        if (conversationId) {
          get().loadMessages(conversationId)
        }
      },

      createConversation: async (title) => {
        set({ isProcessing: true })
        try {
          const { data, error } = await createRecord('conversations', {
            title,
            created_at: new Date().toISOString()
          })
          if (error) throw error
          set((state) => ({
            conversations: [...state.conversations, data],
            activeConversation: data.id
          }))
          return data
        } catch (error) {
          set({ error: error.message })
          return null
        } finally {
          set({ isProcessing: false })
        }
      },

      loadConversations: async () => {
        set({ isProcessing: true })
        try {
          const { data, error } = await queryRecords('conversations', {
            orderBy: { column: 'created_at', ascending: false }
          })
          if (error) throw error
          set({ conversations: data })
        } catch (error) {
          set({ error: error.message })
        } finally {
          set({ isProcessing: false })
        }
      },

      // Messages methods
      addMessage: async (message) => {
        set({ isProcessing: true })
        try {
          const { data, error } = await createRecord('messages', {
            conversation_id: get().activeConversation,
            ...message,
            created_at: new Date().toISOString()
          })
          if (error) throw error
          set((state) => ({
            messages: [...state.messages, data]
          }))
          return data
        } catch (error) {
          set({ error: error.message })
          return null
        } finally {
          set({ isProcessing: false })
        }
      },

      loadMessages: async (conversationId) => {
        set({ isProcessing: true })
        try {
          const { data, error } = await queryRecords('messages', {
            filters: { conversation_id: conversationId },
            orderBy: { column: 'created_at', ascending: true }
          })
          if (error) throw error
          set({ messages: data })
        } catch (error) {
          set({ error: error.message })
        } finally {
          set({ isProcessing: false })
        }
      },

      // File processing state
      uploadedFiles: [],
      processingFiles: [],
      
      addUploadedFile: (file) =>
        set((state) => ({
          uploadedFiles: [...state.uploadedFiles, file]
        })),
        
      removeUploadedFile: (fileId) =>
        set((state) => ({
          uploadedFiles: state.uploadedFiles.filter((f) => f.id !== fileId)
        })),

      // Vector store state
      vectors: [],
      isIndexing: false,
      
      addVectors: (vectors) =>
        set((state) => ({
          vectors: [...state.vectors, ...vectors]
        })),
        
      clearVectors: () =>
        set({ vectors: [] }),

      // Error handling
      setError: (error) => set({ error }),
      clearError: () => set({ error: null })
    }),
    {
      name: 'ai-storage',
      partialize: (state) => ({
        conversations: state.conversations,
        vectors: state.vectors
      })
    }
  )
)