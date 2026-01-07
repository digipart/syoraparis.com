import FaqService from '~/services/cms/FaqService';
import type {
  CmsFaqCategoryType,
  CmsFaqType,
  CmsGetFaqCategoryType,
} from '~/types/cms/FaqType';

export const useFaqStore = defineStore('faqStore', () => {
  const faqCategories = ref<CmsFaqCategoryType[]>([]);
  const termToSearch = ref('');
  const currentFaq = ref<CmsFaqType | null>(null);

  const faqHighlight = computed(() => {
    const faqs: CmsFaqType[] = [];

    faqCategories.value.map((fatCat) => {
      fatCat.faqs?.map((faq) => {
        faqs.push(faq);
      });
    });

    return faqs;
  });

  const fetchFaqPage = (locale: string): Promise<CmsFaqCategoryType[]> => {
    const faqService = new FaqService();

    if (faqCategories.value.length) {
      return Promise.resolve(faqCategories.value);
    }

    return faqService
      .fetch({ locale })
      .then((data) => {
        faqCategories.value = data || [];
        return data || [];
      })
      .catch((error) => {
        throw error;
      });
  };
  
  const fetchSingleFaqPage = (locale: string, documentId: string): Promise<CmsFaqType | null> => {
    const faqService = new FaqService();
    
    // First check if we already have the FAQ in our categories
    if (faqCategories.value.length) {
      for (const category of faqCategories.value) {
        if (category.faqs) {
          const foundFaq = category.faqs.find(faq => faq.documentId === documentId);
          if (foundFaq) {
            currentFaq.value = foundFaq;
            return Promise.resolve(foundFaq);
          }
        }
      }
    }
    
    // If not found in local state, fetch it from the API
    return faqService
      .fetchSingle({ locale, documentId })
      .then((data) => {
        if (data) {
          currentFaq.value = data;
        } else {
          currentFaq.value = null;
        }
        return currentFaq.value;
      })
      .catch((error) => {
        currentFaq.value = null;
        throw error;
      });
  };

  return { faqCategories, faqHighlight, termToSearch, fetchFaqPage, fetchSingleFaqPage, currentFaq };
});
