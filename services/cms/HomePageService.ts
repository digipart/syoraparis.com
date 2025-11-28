import gql from 'graphql-tag';
import CmsService from './CmsService';
import type { HomePageType } from '~/types/cms/HomePageType';

export default class HomePageService extends CmsService {
  fetch({ locale }: { locale: string }) {
    const query = gql`
      query HomePageHomePage($locale: I18NLocaleCode) {
        homePage(locale: $locale) {
          documentId
          body {
            ... on ComponentBlockGroupBanner {
              id
              banners {
                id
                title
                subTitle
                type
                image {
                  id
                  mobile {
                    url
                  }
                  tablet {
                    url
                  }
                  desktop {
                    url
                  }
                }
                video {
                  id
                  mobile {
                    url
                    aspectRatio
                  }
                  tablet {
                    url
                    aspectRatio
                  }
                  desktop {
                    url
                    aspectRatio
                  }
                }
                cta {
                  id
                  text
                  link
                }
              }
              column {
                id
                mobile
                tablet
                desktop
              }
            }
            ... on ComponentBlockBanner {
              id
              title
              subTitle
              type
              image {
                id
                mobile {
                  url
                }
                tablet {
                  url
                }
                desktop {
                  url
                }
              }
              video {
                id
                mobile {
                  url
                  aspectRatio
                }
                tablet {
                  url
                  aspectRatio
                }
                desktop {
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
            }
            ... on ComponentBlockBannerText {
              id
              content
              display
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
            }
            ... on ComponentBlockOurSelection {
              __typename
              id
              title
              numberOfProducts
              idCategory
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

    return this.client
      .query<HomePageType>({
        query,
        variables: { locale: locale },
      })
      .then((data) => {
        return data.data.homePage;
      });
  }
}
