import type { CategoryType } from '~/types/CategoryType';
import type { Attribute, ProductType, Variant } from '~/types/ProductType';
import { CategoryHelper } from './CategoryHelper';
import type { ProductOrderType } from '~/types/OrderType';

export class ProductHelper {
  private product: ProductType | ProductOrderType;

  constructor($product: ProductType | ProductOrderType) {
    this.product = $product;
  }

  static getSize(variant: Variant) {
    return variant?.Combination?.Attributes?.find(
      (attr) => attr.GroupName === 'Size'
    )?.AttributeName;
  }
  static getColor(variant: Variant) {
    return variant?.Combination?.Attributes?.find(
      (attr) => attr.GroupName === 'Color'
    )?.AttributeName;
  }
  static getFirstImage(product: ProductType) {
    if (product) {
      const images = product?.Media?.Images?.product_medium;
      if (images) {
        return images[0]?.Src;
      }
    }
    return null;
  }

  // const size = computed(() => {
  //   return product?.Variant?.Combination?.Attributes?.find(
  //     (attr) => attr.GroupName === 'Size'
  //   )?.AttributeName;
  // });

  // const color = computed(() => {
  //   return product?.Variant?.Combination?.Attributes?.find(
  //     (attr) => attr.GroupName === 'Color'
  //   )?.AttributeName;
  // });

  getSeo() {
    const appStore = useAppStore();
    const { languageIsoCode } = toRefs(appStore);

    if (Array.isArray(this.product.SEO)) {
      const productSeo = this.product.SEO?.find(
        (p) =>
          p?.LanguageIsoCode?.toLocaleLowerCase() ===
          languageIsoCode.value.toLocaleLowerCase()
      );

      return productSeo;
    } else {
      const productSeo = this.product.SEO;
      return productSeo;
    }
  }

  getUrl(category?: CategoryType) {
    if (category) {
      const categoryHelper = new CategoryHelper(category);

      const categoryUrl = categoryHelper.getUrl();

      return `${categoryUrl}/${this.getSeo()?.URL}`;
    }
    return `/product-s/${this.getSeo()?.URL}`;
  }
}
