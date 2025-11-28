import type { ProductType } from './ProductType';

export type SearchType = {
  Term?: string;
  Found?: number;
  Offset?: number;
  Limit?: number;
  HasNextPage?: boolean;
  HasPreviousPage?: boolean;
  Products?: ProductType[];
};
