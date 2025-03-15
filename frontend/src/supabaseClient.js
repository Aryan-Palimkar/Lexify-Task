// src/supabaseClient.js
import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const key = import.meta.env.VITE_SUPABASE_KEY

const supabaseUrl = url
const supabaseKey = key

const supabase = createClient(supabaseUrl, supabaseKey)

export { supabase }