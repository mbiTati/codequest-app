import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://jslbfkaujahihvjdxcjg.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpzbGJma2F1amFoaWh2amR4Y2pnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM2MDM0MzEsImV4cCI6MjA1OTE3OTQzMX0.placeholder';

// NOTE: Replace SUPABASE_ANON_KEY with your real anon key from
// Supabase Dashboard → Settings → API → Project API keys → anon/public

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
