export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

type FK = { foreignKeyName: string; columns: string[]; isOneToOne: boolean; referencedRelation: string; referencedColumns: string[] }

export type Database = {
  __InternalSupabase: { PostgrestVersion: "14.5" }
  public: {
    Tables: {
      activity_log: {
        Row: { action: string; actor_email: string | null; created_at: string; detail: string | null; id: string }
        Insert: { action: string; actor_email?: string | null; created_at?: string; detail?: string | null; id?: string }
        Update: { action?: string; actor_email?: string | null; created_at?: string; detail?: string | null; id?: string }
        Relationships: []
      }
      carts: {
        Row: { items: Json; updated_at: string; user_id: string }
        Insert: { items?: Json; updated_at?: string; user_id: string }
        Update: { items?: Json; updated_at?: string; user_id?: string }
        Relationships: []
      }
      custom_product_requests: {
        Row: { budget: string | null; created_at: string; description: string; email: string; first_name: string; hair_concerns: string | null; hair_type: string | null; id: string; last_name: string; phone: string | null; reference: string; status: string; user_id: string | null }
        Insert: { budget?: string | null; created_at?: string; description: string; email: string; first_name: string; hair_concerns?: string | null; hair_type?: string | null; id?: string; last_name: string; phone?: string | null; reference?: string; status?: string; user_id?: string | null }
        Update: { budget?: string | null; created_at?: string; description?: string; email?: string; first_name?: string; hair_concerns?: string | null; hair_type?: string | null; id?: string; last_name?: string; phone?: string | null; reference?: string; status?: string; user_id?: string | null }
        Relationships: []
      }
      order_request_items: {
        Row: { id: string; product_id: string | null; product_name: string; quantity: number; request_id: string; unit_price: number; variant_id: string | null; variant_name: string | null }
        Insert: { id?: string; product_id?: string | null; product_name: string; quantity?: number; request_id: string; unit_price?: number; variant_id?: string | null; variant_name?: string | null }
        Update: { id?: string; product_id?: string | null; product_name?: string; quantity?: number; request_id?: string; unit_price?: number; variant_id?: string | null; variant_name?: string | null }
        Relationships: [
          { foreignKeyName: "order_request_items_product_id_fkey"; columns: ["product_id"]; isOneToOne: false; referencedRelation: "products"; referencedColumns: ["id"] },
          { foreignKeyName: "order_request_items_request_id_fkey"; columns: ["request_id"]; isOneToOne: false; referencedRelation: "order_requests"; referencedColumns: ["id"] },
          { foreignKeyName: "order_request_items_variant_id_fkey"; columns: ["variant_id"]; isOneToOne: false; referencedRelation: "product_variants"; referencedColumns: ["id"] }
        ]
      }
      order_requests: {
        Row: { address: string | null; city: string | null; created_at: string; email: string; estimated_delivery: string | null; first_name: string; id: string; is_paid: boolean; last_name: string; note: string | null; paid_at: string | null; phone: string | null; postal_code: string | null; reference: string; shipping_fee: number; status: Database["public"]["Enums"]["order_status"]; total: number; updated_at: string; user_id: string | null; delivery_method: string | null; payment_method: string | null; payment_status: string; stripe_session_id: string | null; stripe_payment_intent: string | null; meetup_point: string | null; delivery_lat: number | null; delivery_lng: number | null; in_local_zone: boolean }
        Insert: { address?: string | null; city?: string | null; created_at?: string; email: string; estimated_delivery?: string | null; first_name: string; id?: string; is_paid?: boolean; last_name: string; note?: string | null; paid_at?: string | null; phone?: string | null; postal_code?: string | null; reference?: string; shipping_fee?: number; status?: Database["public"]["Enums"]["order_status"]; total?: number; updated_at?: string; user_id?: string | null; delivery_method?: string | null; payment_method?: string | null; payment_status?: string; stripe_session_id?: string | null; stripe_payment_intent?: string | null; meetup_point?: string | null; delivery_lat?: number | null; delivery_lng?: number | null; in_local_zone?: boolean }
        Update: { address?: string | null; city?: string | null; created_at?: string; email?: string; estimated_delivery?: string | null; first_name?: string; id?: string; is_paid?: boolean; last_name?: string; note?: string | null; paid_at?: string | null; phone?: string | null; postal_code?: string | null; reference?: string; shipping_fee?: number; status?: Database["public"]["Enums"]["order_status"]; total?: number; updated_at?: string; user_id?: string | null; delivery_method?: string | null; payment_method?: string | null; payment_status?: string; stripe_session_id?: string | null; stripe_payment_intent?: string | null; meetup_point?: string | null; delivery_lat?: number | null; delivery_lng?: number | null; in_local_zone?: boolean }
        Relationships: []
      }
      order_status_history: {
        Row: { created_at: string; id: string; note: string | null; request_id: string; status: Database["public"]["Enums"]["order_status"] }
        Insert: { created_at?: string; id?: string; note?: string | null; request_id: string; status: Database["public"]["Enums"]["order_status"] }
        Update: { created_at?: string; id?: string; note?: string | null; request_id?: string; status?: Database["public"]["Enums"]["order_status"] }
        Relationships: [
          { foreignKeyName: "order_status_history_request_id_fkey"; columns: ["request_id"]; isOneToOne: false; referencedRelation: "order_requests"; referencedColumns: ["id"] }
        ]
      }
      product_variants: {
        Row: { created_at: string; id: string; is_active: boolean; name: string; price: number; product_id: string; sort_order: number; stock: number }
        Insert: { created_at?: string; id?: string; is_active?: boolean; name: string; price?: number; product_id: string; sort_order?: number; stock?: number }
        Update: { created_at?: string; id?: string; is_active?: boolean; name?: string; price?: number; product_id?: string; sort_order?: number; stock?: number }
        Relationships: [
          { foreignKeyName: "product_variants_product_id_fkey"; columns: ["product_id"]; isOneToOne: false; referencedRelation: "products"; referencedColumns: ["id"] }
        ]
      }
      products: {
        Row: { base_price: number; category: string; created_at: string; currency: string; description: string | null; id: string; images: Json; ingredients_note: string | null; is_active: boolean; is_featured: boolean; is_new: boolean; name: string; precautions: string | null; rating: number; reviews_count: number; short_description: string | null; slug: string; sort_order: number; tagline: string | null; updated_at: string; usage_instructions: string | null }
        Insert: { base_price?: number; category?: string; created_at?: string; currency?: string; description?: string | null; id?: string; images?: Json; ingredients_note?: string | null; is_active?: boolean; is_featured?: boolean; is_new?: boolean; name: string; precautions?: string | null; rating?: number; reviews_count?: number; short_description?: string | null; slug: string; sort_order?: number; tagline?: string | null; updated_at?: string; usage_instructions?: string | null }
        Update: { base_price?: number; category?: string; created_at?: string; currency?: string; description?: string | null; id?: string; images?: Json; ingredients_note?: string | null; is_active?: boolean; is_featured?: boolean; is_new?: boolean; name?: string; precautions?: string | null; rating?: number; reviews_count?: number; short_description?: string | null; slug?: string; sort_order?: number; tagline?: string | null; updated_at?: string; usage_instructions?: string | null }
        Relationships: []
      }
      profiles: {
        Row: { created_at: string; email: string | null; full_name: string | null; id: string; role: Database["public"]["Enums"]["user_role"] }
        Insert: { created_at?: string; email?: string | null; full_name?: string | null; id: string; role?: Database["public"]["Enums"]["user_role"] }
        Update: { created_at?: string; email?: string | null; full_name?: string | null; id?: string; role?: Database["public"]["Enums"]["user_role"] }
        Relationships: []
      }
      reviews: {
        Row: { author_name: string; comment: string; created_at: string; id: string; is_approved: boolean; location: string | null; product_id: string | null; rating: number }
        Insert: { author_name: string; comment: string; created_at?: string; id?: string; is_approved?: boolean; location?: string | null; product_id?: string | null; rating: number }
        Update: { author_name?: string; comment?: string; created_at?: string; id?: string; is_approved?: boolean; location?: string | null; product_id?: string | null; rating?: number }
        Relationships: [
          { foreignKeyName: "reviews_product_id_fkey"; columns: ["product_id"]; isOneToOne: false; referencedRelation: "products"; referencedColumns: ["id"] }
        ]
      }
      site_settings: {
        Row: { contact_email: string | null; contact_phone: string | null; facebook_url: string | null; id: number; instagram_url: string | null; maintenance_message: string | null; maintenance_mode: boolean; promo_bar_enabled: boolean; promo_bar_text: string | null; stripe_enabled: boolean; tiktok_url: string | null; whatsapp_url: string | null; shipping_fee: number; free_shipping_threshold: number | null; tax_rate: number; local_delivery_enabled: boolean; team_address: string | null; team_lat: number | null; team_lng: number | null; local_radius_m: number; carrier_enabled: boolean; carrier_name: string; cash_enabled: boolean; updated_at: string }
        Insert: { contact_email?: string | null; contact_phone?: string | null; facebook_url?: string | null; id?: number; instagram_url?: string | null; maintenance_message?: string | null; maintenance_mode?: boolean; promo_bar_enabled?: boolean; promo_bar_text?: string | null; stripe_enabled?: boolean; tiktok_url?: string | null; whatsapp_url?: string | null; shipping_fee?: number; free_shipping_threshold?: number | null; tax_rate?: number; local_delivery_enabled?: boolean; team_address?: string | null; team_lat?: number | null; team_lng?: number | null; local_radius_m?: number; carrier_enabled?: boolean; carrier_name?: string; cash_enabled?: boolean; updated_at?: string }
        Update: { contact_email?: string | null; contact_phone?: string | null; facebook_url?: string | null; id?: number; instagram_url?: string | null; maintenance_message?: string | null; maintenance_mode?: boolean; promo_bar_enabled?: boolean; promo_bar_text?: string | null; stripe_enabled?: boolean; tiktok_url?: string | null; whatsapp_url?: string | null; shipping_fee?: number; free_shipping_threshold?: number | null; tax_rate?: number; local_delivery_enabled?: boolean; team_address?: string | null; team_lat?: number | null; team_lng?: number | null; local_radius_m?: number; carrier_enabled?: boolean; carrier_name?: string; cash_enabled?: boolean; updated_at?: string }
        Relationships: []
      }
      support_tickets: {
        Row: { id: string; user_id: string; subject: string; status: string; last_message_at: string; last_sender_role: string | null; created_at: string }
        Insert: { id?: string; user_id: string; subject: string; status?: string; last_message_at?: string; last_sender_role?: string | null; created_at?: string }
        Update: { id?: string; user_id?: string; subject?: string; status?: string; last_message_at?: string; last_sender_role?: string | null; created_at?: string }
        Relationships: []
      }
      support_messages: {
        Row: { id: string; ticket_id: string; sender_id: string | null; sender_role: string; body: string | null; attachments: Json; created_at: string }
        Insert: { id?: string; ticket_id: string; sender_id?: string | null; sender_role: string; body?: string | null; attachments?: Json; created_at?: string }
        Update: { id?: string; ticket_id?: string; sender_id?: string | null; sender_role?: string; body?: string | null; attachments?: Json; created_at?: string }
        Relationships: [
          { foreignKeyName: "support_messages_ticket_id_fkey"; columns: ["ticket_id"]; isOneToOne: false; referencedRelation: "support_tickets"; referencedColumns: ["id"] }
        ]
      }
      tracking_events: {
        Row: { id: number; page: string | null; scroll: number | null; session_id: string; t: string; target_class: string | null; target_tag: string | null; target_text: string | null; type: string; x: number | null; y: number | null }
        Insert: { id?: never; page?: string | null; scroll?: number | null; session_id: string; t?: string; target_class?: string | null; target_tag?: string | null; target_text?: string | null; type: string; x?: number | null; y?: number | null }
        Update: { id?: never; page?: string | null; scroll?: number | null; session_id?: string; t?: string; target_class?: string | null; target_tag?: string | null; target_text?: string | null; type?: string; x?: number | null; y?: number | null }
        Relationships: [
          { foreignKeyName: "tracking_events_session_id_fkey"; columns: ["session_id"]; isOneToOne: false; referencedRelation: "tracking_sessions"; referencedColumns: ["id"] }
        ]
      }
      tracking_sessions: {
        Row: { anon_id: string | null; click_count: number; country: string | null; current_page: string | null; device: string | null; entry_page: string | null; event_count: number; id: string; last_seen_at: string; referrer: string | null; screen_h: number | null; screen_w: number | null; started_at: string; user_agent: string | null; user_id: string | null; utm_source: string | null; visitor_name: string | null }
        Insert: { anon_id?: string | null; click_count?: number; country?: string | null; current_page?: string | null; device?: string | null; entry_page?: string | null; event_count?: number; id?: string; last_seen_at?: string; referrer?: string | null; screen_h?: number | null; screen_w?: number | null; started_at?: string; user_agent?: string | null; user_id?: string | null; utm_source?: string | null; visitor_name?: string | null }
        Update: { anon_id?: string | null; click_count?: number; country?: string | null; current_page?: string | null; device?: string | null; entry_page?: string | null; event_count?: number; id?: string; last_seen_at?: string; referrer?: string | null; screen_h?: number | null; screen_w?: number | null; started_at?: string; user_agent?: string | null; user_id?: string | null; utm_source?: string | null; visitor_name?: string | null }
        Relationships: []
      }
    }
    Views: { [_ in never]: never }
    Functions: {
      current_role: { Args: never; Returns: Database["public"]["Enums"]["user_role"] }
      is_staff: { Args: never; Returns: boolean }
      is_super_admin: { Args: never; Returns: boolean }
      track_order: { Args: { ref: string }; Returns: Json }
      track_ingest: {
        Args: { p_session: string; p_init?: Json; p_page?: string | null; p_events?: Json }
        Returns: undefined
      }
      mark_order_paid: {
        Args: { p_session_id: string; p_intent?: string | null }
        Returns: undefined
      }
      decrement_stock: {
        Args: { p_variant_id: string | null; p_qty: number }
        Returns: undefined
      }
    }
    Enums: {
      order_status: "prise_en_compte" | "en_fabrication" | "en_livraison" | "livree" | "annulee"
      user_role: "client" | "admin" | "super_admin"
    }
    CompositeTypes: { [_ in never]: never }
  }
}

type PublicSchema = Database["public"]

export type Tables<T extends keyof PublicSchema["Tables"]> = PublicSchema["Tables"][T]["Row"]
export type TablesInsert<T extends keyof PublicSchema["Tables"]> = PublicSchema["Tables"][T]["Insert"]
export type TablesUpdate<T extends keyof PublicSchema["Tables"]> = PublicSchema["Tables"][T]["Update"]
export type Enums<T extends keyof PublicSchema["Enums"]> = PublicSchema["Enums"][T]

// silence "FK unused" without affecting structural typing
export type _FK = FK
