export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      admin_users: {
        Row: {
          created_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          user_id?: string
        }
        Relationships: []
      }
      artist_profiles: {
        Row: {
          artist_type: string
          bio: string
          cities: string[] | null
          created_at: string | null
          id: string
          instagram_handle: string | null
          name: string
          portfolio_images: string[] | null
          profile_picture: string | null
          spotify_handle: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          artist_type: string
          bio: string
          cities?: string[] | null
          created_at?: string | null
          id?: string
          instagram_handle?: string | null
          name: string
          portfolio_images?: string[] | null
          profile_picture?: string | null
          spotify_handle?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          artist_type?: string
          bio?: string
          cities?: string[] | null
          created_at?: string | null
          id?: string
          instagram_handle?: string | null
          name?: string
          portfolio_images?: string[] | null
          profile_picture?: string | null
          spotify_handle?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      banners: {
        Row: {
          button_link: string | null
          button_text: string | null
          created_at: string | null
          has_button: boolean | null
          id: string
          image_url: string
          title: string
          updated_at: string | null
        }
        Insert: {
          button_link?: string | null
          button_text?: string | null
          created_at?: string | null
          has_button?: boolean | null
          id?: string
          image_url: string
          title: string
          updated_at?: string | null
        }
        Update: {
          button_link?: string | null
          button_text?: string | null
          created_at?: string | null
          has_button?: boolean | null
          id?: string
          image_url?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      bookings: {
        Row: {
          amount: number
          booking_id: string
          created_at: string | null
          event_date: string
          event_id: string | null
          event_name: string
          form_details: Json
          id: string
          payment_id: string | null
          payment_status: string | null
          tickets: number
          user_email: string
          user_id: string | null
          user_name: string
        }
        Insert: {
          amount: number
          booking_id: string
          created_at?: string | null
          event_date: string
          event_id?: string | null
          event_name: string
          form_details: Json
          id?: string
          payment_id?: string | null
          payment_status?: string | null
          tickets: number
          user_email: string
          user_id?: string | null
          user_name: string
        }
        Update: {
          amount?: number
          booking_id?: string
          created_at?: string | null
          event_date?: string
          event_id?: string | null
          event_name?: string
          form_details?: Json
          id?: string
          payment_id?: string | null
          payment_status?: string | null
          tickets?: number
          user_email?: string
          user_id?: string | null
          user_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "bookings_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      event_artists: {
        Row: {
          artist_name: string
          created_at: string | null
          event_id: string | null
          id: string
        }
        Insert: {
          artist_name: string
          created_at?: string | null
          event_id?: string | null
          id?: string
        }
        Update: {
          artist_name?: string
          created_at?: string | null
          event_id?: string | null
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "event_artists_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          artist_id: string | null
          category: string
          city: string
          created_at: string | null
          date: string
          description: string
          id: string
          image_url: string | null
          location: string
          max_capacity: number
          price: number
          time: string
          title: string
          updated_at: string | null
        }
        Insert: {
          artist_id?: string | null
          category: string
          city: string
          created_at?: string | null
          date: string
          description: string
          id?: string
          image_url?: string | null
          location: string
          max_capacity: number
          price: number
          time: string
          title: string
          updated_at?: string | null
        }
        Update: {
          artist_id?: string | null
          category?: string
          city?: string
          created_at?: string | null
          date?: string
          description?: string
          id?: string
          image_url?: string | null
          location?: string
          max_capacity?: number
          price?: number
          time?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      experiences: {
        Row: {
          city: string
          created_at: string | null
          description: string
          duration: number
          duration_unit: string
          id: string
          image_url: string | null
          price_max: number
          price_min: number
          title: string
          type: string
          updated_at: string | null
        }
        Insert: {
          city: string
          created_at?: string | null
          description: string
          duration: number
          duration_unit: string
          id?: string
          image_url?: string | null
          price_max: number
          price_min: number
          title: string
          type: string
          updated_at?: string | null
        }
        Update: {
          city?: string
          created_at?: string | null
          description?: string
          duration?: number
          duration_unit?: string
          id?: string
          image_url?: string | null
          price_max?: number
          price_min?: number
          title?: string
          type?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      memberships: {
        Row: {
          amount: number
          created_at: string
          expires_at: string | null
          id: string
          is_active: boolean
          payment_id: string
          tier: string
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          expires_at?: string | null
          id?: string
          is_active?: boolean
          payment_id: string
          tier: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          expires_at?: string | null
          id?: string
          is_active?: boolean
          payment_id?: string
          tier?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_admin: {
        Args: { user_id: string }
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
