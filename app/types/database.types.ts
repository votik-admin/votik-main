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
      event_categories: {
        Row: {
          banner_image: string
          category: Database["public"]["Enums"]["EventCategory"]
          description: string
          id: number
          slug: string
          title: string
        }
        Insert: {
          banner_image: string
          category: Database["public"]["Enums"]["EventCategory"]
          description: string
          id?: number
          slug: string
          title: string
        }
        Update: {
          banner_image?: string
          category?: Database["public"]["Enums"]["EventCategory"]
          description?: string
          id?: number
          slug?: string
          title?: string
        }
        Relationships: []
      }
      events: {
        Row: {
          accepted: boolean | null
          category: Database["public"]["Enums"]["EventCategory"] | null
          city: Database["public"]["Enums"]["City"] | null
          created_at: string | null
          description: string | null
          expected_footfall: number | null
          faqs: Json | null
          id: string
          location: string | null
          name: string | null
          organizer_id: string | null
          primary_img: string | null
          search_vector: unknown | null
          secondary_imgs: string[] | null
          slug: string | null
          start_time: string | null
          tnc: Json | null
          venue: string | null
          venue_layout: string | null
        }
        Insert: {
          accepted?: boolean | null
          category?: Database["public"]["Enums"]["EventCategory"] | null
          city?: Database["public"]["Enums"]["City"] | null
          created_at?: string | null
          description?: string | null
          expected_footfall?: number | null
          faqs?: Json | null
          id?: string
          location?: string | null
          name?: string | null
          organizer_id?: string | null
          primary_img?: string | null
          search_vector?: unknown | null
          secondary_imgs?: string[] | null
          slug?: string | null
          start_time?: string | null
          tnc?: Json | null
          venue?: string | null
          venue_layout?: string | null
        }
        Update: {
          accepted?: boolean | null
          category?: Database["public"]["Enums"]["EventCategory"] | null
          city?: Database["public"]["Enums"]["City"] | null
          created_at?: string | null
          description?: string | null
          expected_footfall?: number | null
          faqs?: Json | null
          id?: string
          location?: string | null
          name?: string | null
          organizer_id?: string | null
          primary_img?: string | null
          search_vector?: unknown | null
          secondary_imgs?: string[] | null
          slug?: string | null
          start_time?: string | null
          tnc?: Json | null
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
          addr: string | null
          avatar_url: string | null
          bank_acc_beneficiary_name: string | null
          bank_acc_ifsc: string | null
          bank_acc_number: string | null
          bank_acc_type: Database["public"]["Enums"]["BankAccType"] | null
          created_at: string
          description: string | null
          email: string | null
          gstin_number: string | null
          id: string
          name: string | null
          pan_number: string | null
          phone_number: string | null
          profile_complete: boolean
          slug: string | null
          state: string | null
        }
        Insert: {
          addr?: string | null
          avatar_url?: string | null
          bank_acc_beneficiary_name?: string | null
          bank_acc_ifsc?: string | null
          bank_acc_number?: string | null
          bank_acc_type?: Database["public"]["Enums"]["BankAccType"] | null
          created_at?: string
          description?: string | null
          email?: string | null
          gstin_number?: string | null
          id: string
          name?: string | null
          pan_number?: string | null
          phone_number?: string | null
          profile_complete?: boolean
          slug?: string | null
          state?: string | null
        }
        Update: {
          addr?: string | null
          avatar_url?: string | null
          bank_acc_beneficiary_name?: string | null
          bank_acc_ifsc?: string | null
          bank_acc_number?: string | null
          bank_acc_type?: Database["public"]["Enums"]["BankAccType"] | null
          created_at?: string
          description?: string | null
          email?: string | null
          gstin_number?: string | null
          id?: string
          name?: string | null
          pan_number?: string | null
          phone_number?: string | null
          profile_complete?: boolean
          slug?: string | null
          state?: string | null
        }
        Relationships: []
      }
      ticket_bookings: {
        Row: {
          booked_count: number
          created_at: string
          event_id: string
          id: number
          last_verification_attempt: string | null
          payment_initiated_timestamp: string
          payment_successful_timestamp: string | null
          razorpay_order_id: string
          razorpay_payment_id: string | null
          razorpay_signature: string | null
          status: Database["public"]["Enums"]["TicketStatus"]
          ticket_id: number
          user_id: string
          verification_count: number | null
        }
        Insert: {
          booked_count: number
          created_at?: string
          event_id: string
          id?: number
          last_verification_attempt?: string | null
          payment_initiated_timestamp: string
          payment_successful_timestamp?: string | null
          razorpay_order_id: string
          razorpay_payment_id?: string | null
          razorpay_signature?: string | null
          status: Database["public"]["Enums"]["TicketStatus"]
          ticket_id: number
          user_id?: string
          verification_count?: number | null
        }
        Update: {
          booked_count?: number
          created_at?: string
          event_id?: string
          id?: number
          last_verification_attempt?: string | null
          payment_initiated_timestamp?: string
          payment_successful_timestamp?: string | null
          razorpay_order_id?: string
          razorpay_payment_id?: string | null
          razorpay_signature?: string | null
          status?: Database["public"]["Enums"]["TicketStatus"]
          ticket_id?: number
          user_id?: string
          verification_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "ticket_bookings_ticket_id_fkey"
            columns: ["ticket_id"]
            isOneToOne: false
            referencedRelation: "tickets"
            referencedColumns: ["id"]
          },
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
      tickets: {
        Row: {
          created_at: string
          current_available_count: number
          description: string
          event_id: string
          id: number
          initial_available_count: number
          name: string
          price: number
        }
        Insert: {
          created_at?: string
          current_available_count: number
          description: string
          event_id: string
          id?: number
          initial_available_count: number
          name: string
          price: number
        }
        Update: {
          created_at?: string
          current_available_count?: number
          description?: string
          event_id?: string
          id?: number
          initial_available_count?: number
          name?: string
          price?: number
        }
        Relationships: [
          {
            foreignKeyName: "tickets_event_id_fkey1"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          address_1: string | null
          address_2: string | null
          avatar_url: string | null
          birthday: string | null
          city: string | null
          created_at: string
          email: string | null
          first_name: string | null
          gender: Database["public"]["Enums"]["Gender"] | null
          id: string
          is_organizer: boolean
          landmark: string | null
          last_name: string | null
          middle_name: string | null
          phone_number: string | null
          pincode: string | null
          slug: string | null
          state: string | null
          username: string
        }
        Insert: {
          address_1?: string | null
          address_2?: string | null
          avatar_url?: string | null
          birthday?: string | null
          city?: string | null
          created_at?: string
          email?: string | null
          first_name?: string | null
          gender?: Database["public"]["Enums"]["Gender"] | null
          id?: string
          is_organizer?: boolean
          landmark?: string | null
          last_name?: string | null
          middle_name?: string | null
          phone_number?: string | null
          pincode?: string | null
          slug?: string | null
          state?: string | null
          username: string
        }
        Update: {
          address_1?: string | null
          address_2?: string | null
          avatar_url?: string | null
          birthday?: string | null
          city?: string | null
          created_at?: string
          email?: string | null
          first_name?: string | null
          gender?: Database["public"]["Enums"]["Gender"] | null
          id?: string
          is_organizer?: boolean
          landmark?: string | null
          last_name?: string | null
          middle_name?: string | null
          phone_number?: string | null
          pincode?: string | null
          slug?: string | null
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
          description: string | null
          id: string
          image: string | null
          latitude: number
          longitude: number
          name: string
          search_vector: unknown | null
          slug: string
        }
        Insert: {
          address: string
          city: Database["public"]["Enums"]["City"]
          created_at?: string
          description?: string | null
          id?: string
          image?: string | null
          latitude: number
          longitude: number
          name: string
          search_vector?: unknown | null
          slug: string
        }
        Update: {
          address?: string
          city?: Database["public"]["Enums"]["City"]
          created_at?: string
          description?: string | null
          id?: string
          image?: string | null
          latitude?: number
          longitude?: number
          name?: string
          search_vector?: unknown | null
          slug?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      change_count_dynamically: {
        Args: {
          row_id: number
          change: number
        }
        Returns: undefined
      }
    }
    Enums: {
      BankAccType: "SAVINGS" | "JOINT" | "CURRENT"
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
        | "NIGHTLIFE"
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
      TicketStatus: "BOOKED" | "CANCELED" | "EXPIRED" | "INITIATED" | "USED"
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
