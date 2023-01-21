import 'react-native-url-polyfill/auto' // Added per issue 8464 supabase
import { createClient } from '@supabase/supabase-js'
import AsyncStorage from "@react-native-async-storage/async-storage";

export const supabase = createClient("https://cnvjtsokjoozcriivkqf.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNudmp0c29ram9vemNyaWl2a3FmIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NzQyNjE0MTQsImV4cCI6MTk4OTgzNzQxNH0.OEe4Ar7iCOLdjO1b5dEjfo0QiK1v6J2xZwC-3DGZeEs", {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});