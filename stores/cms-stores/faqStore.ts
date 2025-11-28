import FaqService from '~/services/cms/FaqService';
import type {
  CmsFaqCategoryType,
  CmsFaqType,
  CmsGetFaqCategoryType,
} from '~/types/cms/FaqType';

export const useFaqStore = defineStore('faqStore', () => {
  const faqCategories = ref<CmsFaqCategoryType[]>([]);
  const termToSearch = ref('');

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

  return { faqCategories, faqHighlight, termToSearch, fetchFaqPage };
});
