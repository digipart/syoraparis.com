import type { AddressType } from './AddressType';

export type RelayPointsType = {
  Address?: AddressType;
  Carrier?: Carrier;
  RelayPoints?: RelayPointType[];
};

export type Carrier = {
  IdCarrier?: number;
  CarrierName?: string;
  CarrierType?: string;
};

export type RelayPointType = {
  Id?: string;
  RelayPointType?: string;
  Name?: string;
  Address1?: string;
  Address2?: string;
  Address3?: string;
  Postcode?: string;
  City?: string;
  Country?: string;
  Location?: Location;
  OpeningHours?: OpeningHours[];
};

export type Location = {
  Latitude?: string;
  Longitude?: string;
  DistanceFromAddress?: string;
};

export type OpeningHours = {
  Day?: string;
  TimeSlots?: TimeSlot[];
};

export type TimeSlot = {
  TimeSlotStart?: string;
  TimeSlotEnd?: string;
};
