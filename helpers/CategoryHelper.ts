import type { CategoryType } from '~/types/CategoryType';

export class CategoryHelper {
  private category: CategoryType;

  constructor($category: CategoryType) {
    this.category = $category;
  }

  getSeo() {
    const appStore = useAppStore();
    const { languageIsoCode } = toRefs(appStore);

    const productSeo = this.category.SEO?.find(
      (cat) =>
        cat?.LanguageIsoCode?.toLocaleLowerCase() ===
        languageIsoCode.value.toLocaleLowerCase()
    );

    return productSeo;
  }

  getUrl() {
    return `/${this.getSeo()?.URL||''}`;
  }
}
