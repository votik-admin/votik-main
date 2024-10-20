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
      events: {
        Row: {
          accepted: boolean
          category: Database["public"]["Enums"]["EventCategory"]
          city: Database["public"]["Enums"]["City"]
          created_at: string
          description: string
          expected_footfall: number
          id: string
          location: string | null
          name: string
          organizer_id: string
          primary_img: string
          secondary_imgs: string[] | null
          slug: string
          start_time: string
          venue: string | null
          venue_layout: string | null
        }
        Insert: {
          accepted?: boolean
          category: Database["public"]["Enums"]["EventCategory"]
          city: Database["public"]["Enums"]["City"]
          created_at?: string
          description: string
          expected_footfall: number
          id?: string
          location?: string | null
          name: string
          organizer_id?: string
          primary_img: string
          secondary_imgs?: string[] | null
          slug: string
          start_time: string
          venue?: string | null
          venue_layout?: string | null
        }
        Update: {
          accepted?: boolean
          category?: Database["public"]["Enums"]["EventCategory"]
          city?: Database["public"]["Enums"]["City"]
          created_at?: string
          description?: string
          expected_footfall?: number
          id?: string
          location?: string | null
          name?: string
          organizer_id?: string
          primary_img?: string
          secondary_imgs?: string[] | null
          slug?: string
          start_time?: string
          venue?: string | null
          venue_layout?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "events_organizer_id_fkey"
            columns: ["organizer_id"]
            isOneToOne: false
            referencedRelation: "organizers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "events_venue_fkey"
            columns: ["venue"]
            isOneToOne: false
            referencedRelation: "venues"
            referencedColumns: ["id"]
          },
        ]
      }
      identities: {
        Row: {
          created_at: string
          id: string
          identity_type: Database["public"]["Enums"]["IdentityType"]
          organizer_id: string
          status: Database["public"]["Enums"]["IdentityStatus"]
          url: string
        }
        Insert: {
          created_at?: string
          id?: string
          identity_type: Database["public"]["Enums"]["IdentityType"]
          organizer_id?: string
          status: Database["public"]["Enums"]["IdentityStatus"]
          url: string
        }
        Update: {
          created_at?: string
          id?: string
          identity_type?: Database["public"]["Enums"]["IdentityType"]
          organizer_id?: string
          status?: Database["public"]["Enums"]["IdentityStatus"]
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "identities_organizer_id_fkey"
            columns: ["organizer_id"]
            isOneToOne: false
            referencedRelation: "organizers"
            referencedColumns: ["id"]
          },
        ]
      }
      organizers: {
        Row: {
          addr: string
          avatar_url: string | null
          bank_acc_beneficiary_name: string
          bank_acc_ifsc: string
          bank_acc_number: string
          bank_acc_type: string
          created_at: string
          email: string
          gstin_number: string | null
          id: string
          name: string
          pan_number: string
          phone_number: string
          slug: string
          state: string
        }
        Insert: {
          addr: string
          avatar_url?: string | null
          bank_acc_beneficiary_name: string
          bank_acc_ifsc: string
          bank_acc_number: string
          bank_acc_type: string
          created_at?: string
          email: string
          gstin_number?: string | null
          id: string
          name: string
          pan_number: string
          phone_number: string
          slug: string
          state: string
        }
        Update: {
          addr?: string
          avatar_url?: string | null
          bank_acc_beneficiary_name?: string
          bank_acc_ifsc?: string
          bank_acc_number?: string
          bank_acc_type?: string
          created_at?: string
          email?: string
          gstin_number?: string | null
          id?: string
          name?: string
          pan_number?: string
          phone_number?: string
          slug?: string
          state?: string
        }
        Relationships: []
      }
      tickets: {
        Row: {
          created_at: string
          event_id: string
          id: number
          metadata: Json | null
          status: Database["public"]["Enums"]["TicketStatus"]
          type: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          event_id?: string
          id?: number
          metadata?: Json | null
          status?: Database["public"]["Enums"]["TicketStatus"]
          type: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          event_id?: string
          id?: number
          metadata?: Json | null
          status?: Database["public"]["Enums"]["TicketStatus"]
          type?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tickets_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tickets_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          address_1: string | null
          address_2: string | null
          avatar_url: string | null
          birthday: string
          city: string | null
          created_at: string
          email: string
          first_name: string
          gender: Database["public"]["Enums"]["Gender"] | null
          id: string
          landmark: string | null
          last_name: string
          middle_name: string | null
          phone_number: string
          pincode: string | null
          slug: string
          state: string | null
          username: string
        }
        Insert: {
          address_1?: string | null
          address_2?: string | null
          avatar_url?: string | null
          birthday: string
          city?: string | null
          created_at?: string
          email: string
          first_name: string
          gender?: Database["public"]["Enums"]["Gender"] | null
          id?: string
          landmark?: string | null
          last_name: string
          middle_name?: string | null
          phone_number: string
          pincode?: string | null
          slug: string
          state?: string | null
          username: string
        }
        Update: {
          address_1?: string | null
          address_2?: string | null
          avatar_url?: string | null
          birthday?: string
          city?: string | null
          created_at?: string
          email?: string
          first_name?: string
          gender?: Database["public"]["Enums"]["Gender"] | null
          id?: string
          landmark?: string | null
          last_name?: string
          middle_name?: string | null
          phone_number?: string
          pincode?: string | null
          slug?: string
          state?: string | null
          username?: string
        }
        Relationships: []
      }
      venues: {
        Row: {
          address: string
          city: Database["public"]["Enums"]["City"]
          created_at: string
          id: string
          image: string | null
          latitude: number
          longitude: number
          name: string
          slug: string
        }
        Insert: {
          address: string
          city: Database["public"]["Enums"]["City"]
          created_at?: string
          id?: string
          image?: string | null
          latitude: number
          longitude: number
          name: string
          slug: string
        }
        Update: {
          address?: string
          city?: Database["public"]["Enums"]["City"]
          created_at?: string
          id?: string
          image?: string | null
          latitude?: number
          longitude?: number
          name?: string
          slug?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      City: "MUMBAI" | "LUCKNOW" | "DELHI" | "OTHER"
      EventCategory:
        | "ACTIVITIES"
        | "COMEDY"
        | "CULTURE"
        | "MUSIC"
        | "WORKSHOPS"
        | "SPORTS"
        | "EXPERIENCES"
        | "OTHER"
      Gender:
        | "MALE"
        | "FEMALE"
        | "NON_BINARY"
        | "GENDERQUEER"
        | "GENDERFLUID"
        | "AGENDER"
        | "BIGENDER"
        | "TWO_SPIRIT"
        | "TRANSGENDER_MALE"
        | "TRANSGENDER_FEMALE"
        | "CISGENDER_MALE"
        | "CISGENDER_FEMALE"
        | "OTHER"
        | "UNSPECIFIED"
        | "PREFER_NOT_TO_SAY"
      IdentityStatus: "VERIFIED" | "PENDING" | "REJECTED"
      IdentityType: "PAN" | "GSTIN"
      TicketStatus: "BOOKED" | "AVAILABLE"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
