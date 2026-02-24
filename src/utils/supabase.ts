import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// On crée une instance de client Supabase seulement si les clés sont fournies
// au build de Next.js. Sans ça, process.env manque souvent lors du prerendering statique.
export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey) 
  : null as any; // on cast pour éviter les erreurs TS ailleurs, on gèrera le null dans les fetch
