import type { Tables } from "./database.types";

export type Product = Tables<"products">;
export type ProductVariant = Tables<"product_variants">;
export type Review = Tables<"reviews">;
export type OrderRequest = Tables<"order_requests">;
export type OrderRequestItem = Tables<"order_request_items">;
export type OrderStatusHistory = Tables<"order_status_history">;
export type SiteSettings = Tables<"site_settings">;
export type Profile = Tables<"profiles">;
export type ActivityLog = Tables<"activity_log">;
export type CustomRequest = Tables<"custom_product_requests">;
export type TrackingSession = Tables<"tracking_sessions">;
export type TrackingEvent = Tables<"tracking_events">;
export type SupportTicket = Tables<"support_tickets">;
export type SupportMessage = Tables<"support_messages">;

export type ProductWithVariants = Product & {
  product_variants: ProductVariant[];
};

export const CATEGORIES: { value: string; label: string }[] = [
  { value: "soin", label: "Soins" },
  { value: "coiffage", label: "Coiffage" },
];

export function categoryLabel(value: string): string {
  return CATEGORIES.find((c) => c.value === value)?.label ?? value;
}

export function productImages(p: Pick<Product, "images">): string[] {
  if (Array.isArray(p.images)) return p.images as string[];
  return [];
}
