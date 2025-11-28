import type { PageLegalNoticesType } from '~/types/cms/PageLegalNoticesType';
import gql from 'graphql-tag';
import CmsService from './CmsService';

export default class PageLegalNoticesService extends CmsService {
  async fetch({ locale }: { locale: string }) {
    const query = gql`
      query PageLegalNotice($locale: I18NLocaleCode) {
        pageLegalNotice(locale: $locale) {
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

    const { data } = await this.client.query<PageLegalNoticesType>({
      query,
      variables: { locale: locale },
    });
    return data.pageLegalNotice;
  }
}
