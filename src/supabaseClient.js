// src/supabaseClient.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://oyyojpczrdejugmfqilj.supabase.co';
const supabaseKey = process.env.REACT_APP_SUPABASE_KEY; // make sure your key is in .env
export const supabase = createClient(supabaseUrl, supabaseKey);
