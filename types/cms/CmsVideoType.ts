export type CmsVideoType = {
  id?: string;
  mobile?: VideoUrl;
  tablet?: VideoUrl;
  desktop?: VideoUrl;
};

type VideoUrl = {
  url?: string;
  aspectRatio?: string;
};
