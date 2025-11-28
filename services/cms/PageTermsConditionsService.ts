import type { PageTermConditionsType } from '~/types/cms/PageTermConditionsType';
import gql from 'graphql-tag';
import CmsService from './CmsService';

export default class PageTermsConditionsService extends CmsService {
  async fetch({ locale }: { locale: string }) {
    const query = gql`
      query PageTermConditions($locale: I18NLocaleCode) {
        pageTermConditions(locale: $locale) {
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

    const { data } = await this.client.query<PageTermConditionsType>({
      query,
      variables: { locale: locale },
    });
    return data.pageTermConditions;
  }
}
