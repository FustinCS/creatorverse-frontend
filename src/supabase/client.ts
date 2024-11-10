import { createClient } from "@supabase/supabase-js";
import { Database } from "./database.types";

export const URL = import.meta.env.VITE_SUPABASE_URL;
export const API_KEY = import.meta.env.VITE_SUPABASE_KEY;
const supabase = createClient<Database>(URL, API_KEY);
export default supabase;
