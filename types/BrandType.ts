import type { ImageType } from './ImageType';

export type BrandType = {
  IdBrand: number;
  Name: string;
  ShortDescription: string;
  Description: string;
  Logo: ImageType;
  Cover: ImageType;
  Seo: {
    MetaTitle: string;
    MetaDescription: string;
    FriendlyURL?: string;
  };
};
