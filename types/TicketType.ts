import type { Media } from './ProductType';

export type BoughtProductsType = TicketProduct[];

export type TicketType = {
  Status?: string;
  IdTicket?: number;
  Title?: string;
  DateAdd?: Date;
  TicketRating?: number;
  ProductTicket?: boolean;
  Product?: TicketProduct;
  LastMessage?: LastMessage;
  Messages?: Message[];
  CustomerFirstname?: string;
  MemberFirstname?: string;
};

export type TicketProduct = {
  IdProduct: number;
  IdOrder?: string;
  DateAdd?: Date | string;
  Reference?: string;
  Description: {
    Title: string;
  };
  Color?: string | null;
  Size?: string | null;
  IdProductAttribute?: number;
  Media: Media;
};

export type LastMessage = {
  SentDate?: Date;
  SentByCustomer?: boolean;
  SentByMember?: boolean;
  Message?: string;
  CustomerFirstname?: string;
  MemberFirstname?: string;
};

type Message = {
  Message?: string;
  SentByCustomer?: boolean;
  SentByMember?: boolean;
  SentDate?: Date;
};
