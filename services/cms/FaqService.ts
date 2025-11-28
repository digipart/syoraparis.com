import type { CmsGetFaqCategoryType } from '~/types/cms/FaqType';
import gql from 'graphql-tag';
import CmsService from './CmsService';

export default class FaqService extends CmsService {
  async fetch({ locale }: { locale: string }) {
    const query = gql`
      query FaqCategories($locale: I18NLocaleCode) {
        faqCategories(locale: $locale) {
          title
          description
          faqs {
            documentId
            question
            answer
          }
        }
      }
    `;

    const { data } = await this.client.query<CmsGetFaqCategoryType>({
      query,
      variables: { locale: locale },
    });
    return data.faqCategories;
  }
}
