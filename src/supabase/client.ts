import { createClient } from "@supabase/supabase-js";
import { Database } from "./database.types";

export const URL = import.meta.env.VITE_SUPABASE_URL;
export const API_KEY = import.meta.env.VITE_SUPABASE_KEY;

export const BUCKET_KEY = 'https://cobnjvyhgqvaownxctzp.supabase.co/storage/v1/object/public/';
export const CREATOR_IMAGES = 'creator-images/';
export const TEMP_IMAGES = 'temp-images/';


const supabase = createClient<Database>(URL, API_KEY);
export default supabase;
