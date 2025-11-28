import type { ProductOrderType } from './OrderType';

export type OrderReturnsListType = {
  LanguageIsoCode?: string;
  TotalOrderReturnReason?: number;
  Reasons?: OrderReturnReasonType[];
};

export type OrderReturnReasonType = {
  IdOrderReturnReasonCode: number;
  OrderReturnReasonCodeValue: number;
  OrderReturnReasonCodeDefinition: string;
};

// export type OrderReturnAvailabilityType = {
//   EAN13?: number;
//   Quantity?: number;
//   Available?: boolean;
//   Combination?: CombinationType;
// };
// type CombinationType = {
//   IdProductAttribute?: number;
//   Attributes?: Attribute[];
// };

// type Attribute = {
//   LanguageIsoCode?: string;
//   AttributeName?: string;
//   GroupName?: string;
// };

export type OrderReturnListType = {
  LanguageIsoCode?: string;
  TotalOrderReturn?: number;
  OrderReturnDetailTypes?: OrderReturnDetailTypes;
  OrderReturnStates?: OrderReturnStates;
  ReceptionStates?: ReceptionStates;
  OrderReturns?: OrderReturnType[];
};

type OrderReturnDetailTypes = {
  refund?: number;
  exchange?: number;
};

type OrderReturnStates = {
  pending?: number;
  received?: number;
  'in process'?: number;
  processed?: number;
};

export type OrderReturnType = {
  LanguageIsoCode?: string;
  IdOrderReturn?: number;
  IdOrder?: string;
  ReturnShippingLabelURL?: string;
  ReturnLabelURL?: string;
  ReturnNoticeURL?: string;
  HistoryDate?: HistoryDate;
  State?: State;
  OrderReturnDetail?: OrderReturnDetail[];
};

export type OrderReturnDetail = {
  IdOrderReturnDetail?: number;
  IdOrderReturn?: number;
  IdOrder?: string;
  Quantity?: number;
  OrderReturnNewIdProductAttribute?: string;
  OrderReturnReasonCodeValue?: number;
  Type?: State;
  HistoryDate?: HistoryDate;
  State?: State;
  Product: ProductOrderType;
};
type HistoryDate = {
  Return?: Date;
  Reception?: string;
  Processed?: string;
};

type State = {
  Code?: number;
  Label?: string;
  Value?: string;
};

type ReceptionStates = {
  pending?: number;
  received?: number;
};
