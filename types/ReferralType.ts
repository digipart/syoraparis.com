export type SponsorCodeType = {
  LanguageIsoCode?: string;
  IdSponsor?: number;
  Firstname?: string;
  Lastname?: string;
  Code?: string;
  Link?: string;
  TotalSponsored?: number;
  Date?: string;
};

export type SponsoredPromoCodeType = {
  LanguageIsoCode?: string;
  IdSponsored?: string;
  Email?: string;
  Firstname?: string;
  Lastname?: string;
  Newletter?: boolean;
  IsCustomer?: boolean;
  Promocode?: PromocodeType;
  Sponsor?: Sponsor;
};

export type ReferralInvitedType = {
  LanguageIsoCode?: string;
  IdSponsor?: number;
  Firstname?: string;
  Lastname?: string;
  Code?: string;
  Link?: string;
  Total?: Total;
  Sponsored?: SponsoredType[];
};

export type SponsoredType = {
  IdSponsored?: number;
  Email?: string;
  Firstname?: string;
  Lastname?: string;
  State?: SponsoredState;
  Promocode?: Promocode;
};

 type Promocode = {
  Code?: string;
  StartDate?: Date;
  EndDate?: Date;
  Type?: string;
  State?: PromocodeState;
  Reduction?: Reduction;
};

 type PromocodeState = {
  Active?: boolean;
  Expired?: boolean;
  Used?: boolean;
  DateUsed?: null;
};

 type SponsoredState = {
  Code?: number;
  Label?: string;
};

 type Total = {
  pending?: number;
  complete?: number;
};

type PromocodeType = {
  IdPromoCode?: string;
  Code?: string;
  Title?: string;
  Description?: string;
  StartDate?: Date;
  EndDate?: Date;
  Type?: string;
  State?: State;
  Reduction?: Reduction;
  message?: string;
};

type Reduction = {
  Value?: Value;
};

type Value = {
  TaxExcl?: number;
  TaxIncl?: number;
};

type State = {
  Active?: boolean;
  Used?: boolean;
  DateUsed?: string;
};

type Sponsor = {
  IdSponsor?: number;
  Code?: string;
};
