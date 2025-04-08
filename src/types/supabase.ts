
import { Json } from "@/integrations/supabase/types";

export interface ArtistProfile {
  id: string;
  user_id: string;
  name: string;
  artist_type: string;
  bio: string;
  profile_picture?: string;
  instagram_handle?: string;
  spotify_handle?: string;
  portfolio_images?: string[];
  cities?: string[];
  created_at?: string;
  updated_at?: string;
}

export interface Booking {
  id: string;
  user_id?: string;
  event_id?: string;
  event_name: string;
  event_date: string;
  tickets: number;
  amount: number;
  form_details: Record<string, any>;
  booking_id: string;
  user_name: string;
  user_email: string;
  payment_id?: string;
  payment_status?: string;
  created_at?: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  city: string;
  category: string;
  price: number;
  max_capacity: number;
  artist_id?: string;
  image_url?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Membership {
  id: string;
  user_id: string;
  tier: 'Premium V1' | 'Premium V2' | 'Premium V3';
  amount: number;
  payment_id: string;
  created_at: string;
  expires_at?: string;
  is_active: boolean;
}
