import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  },
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  }
})

// Authentication helpers
export const signIn = async ({ email, password }) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  })
  return { data, error }
}

export const signUp = async ({ email, password }) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password
  })
  return { data, error }
}

export const signOut = async () => {
  const { error } = await supabase.auth.signOut()
  return { error }
}

// Database helpers
export const createRecord = async (table, data) => {
  const { data: record, error } = await supabase
    .from(table)
    .insert(data)
    .select()
    .single()
  return { data: record, error }
}

export const updateRecord = async (table, id, data) => {
  const { data: record, error } = await supabase
    .from(table)
    .update(data)
    .eq('id', id)
    .select()
    .single()
  return { data: record, error }
}

export const deleteRecord = async (table, id) => {
  const { error } = await supabase
    .from(table)
    .delete()
    .eq('id', id)
  return { error }
}

export const getRecord = async (table, id) => {
  const { data, error } = await supabase
    .from(table)
    .select()
    .eq('id', id)
    .single()
  return { data, error }
}

export const queryRecords = async (table, query = {}) => {
  let builder = supabase.from(table).select()
  
  // Apply filters if provided
  if (query.filters) {
    Object.entries(query.filters).forEach(([key, value]) => {
      builder = builder.eq(key, value)
    })
  }
  
  // Apply sorting
  if (query.orderBy) {
    builder = builder.order(query.orderBy.column, {
      ascending: query.orderBy.ascending
    })
  }
  
  // Apply pagination
  if (query.limit) {
    builder = builder.limit(query.limit)
  }
  if (query.offset) {
    builder = builder.range(query.offset, query.offset + (query.limit || 10) - 1)
  }
  
  const { data, error } = await builder
  return { data, error }
}

// Realtime subscription helper
export const subscribeToChanges = (table, callback) => {
  return supabase
    .channel(`${table}-changes`)
    .on('postgres_changes', { event: '*', schema: 'public', table }, callback)
    .subscribe()
}
