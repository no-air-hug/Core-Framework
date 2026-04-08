export type DeliveryOption = {
  delivery_method: string;
  delivery_routes?: unknown[];
  destination?: unknown;
  carbon_footprint?: number;
  cost?: number;
  shipment_number?: number;
  line_items?: { item_id: string; qty: number }[];
  reason?:
    | "no_stock"
    | "missing_config"
    | "beyond_time_limit"
    | "no_eligible_route"
    | "estimation_degraded_mode"
    | "failed_parcel_constraints"
    | "future_arrival_exceeds_limit"
    | "invalid_item"
    | "exceeds_authorized_shipment_number";
  cutoff?: number;
  eta_end?: number;
  eta_start?: number;
  status:
    | "valid"
    | "valid_estimation"
    | "partial"
    | "partial_estimation"
    | "none";
};

export type DeliveryPromise = {
  source: "onestock";
  canDeliver: boolean;
  canCollect: boolean;
  options: Record<string, DeliveryOption>;
};

export enum DeliveryType {
  Delivery = "delivery",
  ClickCollect = "click-collect",
}

export const DELIVERY_METHOD_TITLES = {
  STANDARD: "Standard Delivery",
  EXPRESS: "Express Shipping",
  CLICK_AND_COLLECT: "Click and Collect",
} as const;
