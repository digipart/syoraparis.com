import type { CmsGetFaqCategoryType, CmsFaqType } from '~/types/cms/FaqType';
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
  
  async fetchSingle({ locale, documentId }: { locale: string; documentId: string }) {
    const query = gql`
      query SingleFaq($locale: I18NLocaleCode, $documentId: String!) {
        faqs(locale: $locale, filters: { documentId: { eq: $documentId } }) {
          data {
            attributes {
              documentId
              question
              answer
            }
          }
        }
      }
    `;

    const { data } = await this.client.query({
      query,
      variables: { locale, documentId },
    });
    
    // Extract the FAQ from the response
    const faqData = data.faqs?.data?.[0]?.attributes;
    
    // Return the FAQ if found, otherwise undefined
    return faqData ? {
      documentId: faqData.documentId,
      question: faqData.question,
      answer: faqData.answer
    } : undefined;
  }
}
