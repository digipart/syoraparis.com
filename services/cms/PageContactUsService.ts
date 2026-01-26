import type { PageContactUsType } from '~/types/cms/PageContactUsType';
import gql from 'graphql-tag';
import CmsService from './CmsService';

export default class PageContactUsService extends CmsService {
  async fetch({ locale }: { locale: string }) {
    const query = gql`
      query PageContactU($locale: I18NLocaleCode) {
        pageContactU(locale: $locale) {
          content
          seo {
            title
            permalink
            description
          }
          locale
        }
      }
    `;

    const { data } = await this.client.query<PageContactUsType>({
      query,
      variables: { locale: locale },
    });
    return data.pageContactU;
  }
}
