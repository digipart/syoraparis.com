export type CmsImageType = {
  id?: string;
  mobile?: ImageType;
  tablet?: ImageType;
  desktop?: ImageType;
};

type ImageType = {
  url?: string;
  width?: number;
};

