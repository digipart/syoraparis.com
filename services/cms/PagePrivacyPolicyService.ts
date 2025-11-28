import type { PagePrivacyPolicyType } from '~/types/cms/PagePrivacyPolicyType';
import gql from 'graphql-tag';
import CmsService from './CmsService';

export default class PagePrivacyPolicyService extends CmsService {
  async fetch({ locale }: { locale: string }) {
    const query = gql`
      query PagePrivacyPolicy($locale: I18NLocaleCode) {
        pagePrivacyPolicy(locale: $locale) {
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

    const { data } = await this.client.query<PagePrivacyPolicyType>({
      query,
      variables: { locale: locale },
    });
    return data.pagePrivacyPolicy;
  }
}
