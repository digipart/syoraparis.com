export type StoreReservationProductType = {
  IdProduct?: number;
  Reference?: string;
  Attributes?: Attributes;
  StockInStore?: StockInStoreType[];
};

type Attributes = {
  Size?: string;
  Color?: string;
};

export type StockInStoreType = {
  IdStore?: number;
  StoreCode?: string;
  StoreName?: string;
  StoreOpeningHours?: StoreOpeningHoursType;
  StoreGoogleMapsUrl?: string;
  StoreAddress1?: string;
  StoreAddress2?: string;
  StorePostalCode?: string;
  StoreCity?: string;
  StorePhone?: string;
  StoreEmail?: string;
  Quantity?: number;
  StockStatus?: string;
  StoreLatitude?: string;
  StoreLongitude?: string;
  Schedules?: Schedule[];
};

export type StoreOpeningHoursType = {
  Tuesday?: string;
  Wednesday?: string;
  Thursday?: string;
  Friday?: string;
  Saturday?: string;
  Monday?: string;
};

export type Schedule = {
  Day?: string;
  TimeSlots?: TimeSlot[];
};

export type TimeSlot = {
  TimeSlotStart?: string;
  TimeSlotEnd?: string;
};
