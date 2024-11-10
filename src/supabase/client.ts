import { createClient } from '@supabase/supabase-js';
import { Database } from './database.types';

const URL = import.meta.env.SUPABASE_URL;

const API_KEY = import.meta.env.SUPABASE_KEY;
const supabase = createClient<Database>(URL, API_KEY);

export default supabase;