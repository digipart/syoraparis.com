import type { CmsLookBookCategoriesType } from '~/types/cms/LookBookType';
import gql from 'graphql-tag';
import CmsService from './CmsService';

export default class LookBookService extends CmsService {
  async fetchCategories({ locale }: { locale: string }) {
    const query = gql`
      query LookBookCategory($locale: I18NLocaleCode) {
        lookBookCategories(locale: $locale) {
          documentId
          title
          image {
            desktop {
              url
            }
            mobile {
              url
            }
            tablet {
              url
            }
          }
          seo {
            id
            title
            permalink
            description
          }
        }
      }
    `;

    const { data } = await this.client.query<CmsLookBookCategoriesType>({
      query,
      variables: { locale: locale },
    });
    return data.lookBookCategories;
  }

  async fetchLookbooks({
    locale,
    categoryId,
  }: {
    locale: string;
    categoryId: string;
  }) {
    const query = gql`
      query LookBookCategory($categoryId: ID!, $locale: I18NLocaleCode) {
        lookBookCategories(
          locale: $locale
          filters: { documentId: { eq: $categoryId } }
        ) {
          documentId
          title
          image {
            desktop {
              url
            }
            mobile {
              url
            }
            tablet {
              url
            }
          }
          seo {
            id
            title
            permalink
            description
          }
          lookbooks {
            ... on ComponentBlockLookBook {
              id
              banner {
                id
                title
                type
                image {
                  desktop {
                    url
                  }
                  mobile {
                    url
                  }
                  tablet {
                    url
                  }
                }
                video {
                  id
                  mobile {
                    id
                    url
                    aspectRatio
                  }
                  tablet {
                    id
                    url
                    aspectRatio
                  }
                  desktop {
                    id
                    url
                    aspectRatio
                  }
                }
                cta {
                  id
                  text
                  link
                }
                column {
                  id
                  mobile
                  tablet
                  desktop
                }
                subTitle
              }
              products {
                id
                url
                top
                left
              }
            }
          }
        }
      }
    `;

    const { data } = await this.client.query<CmsLookBookCategoriesType>({
      query,
      variables: { locale: locale },
    });
    return data.lookBookCategories;
  }
}
