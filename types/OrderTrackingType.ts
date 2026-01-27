export type TrackingState = {
  Code: number;
  Label: string;
};

export type Tracking = {
  Number: string;
  URL: string;
  State: TrackingState;
};

export type OrderCarrier = {
  Id: number;
  TrackingNumber: string;
  ShipmentType: number;
};

export type Order = {
  Id: string;
  Name: string;
  Date: string;
};

export type Customer = {
  Firstname: string;
  Lastname: string;
  MobilePhone: string | null;
  Email: string;
};

export type Carrier = {
  Id: number;
  Name: string;
};

export type Site = {
  Name: string;
  Code: string;
  Postcode: string;
};

export type TrackingEvent = {
  Date: string;
  Code: string;
  Label: string;
  Site: Site;
};

export type OrderTrackingType = {
  Tracking: Tracking;
  OrderCarrier: OrderCarrier;
  Order: Order;
  Customer: Customer;
  Carrier: Carrier;
  Events: TrackingEvent[];
};
