<script lang="ts" setup>
import { ProductHelper } from '~/helpers/ProductHelper';
import ProductService from '~/services/ProductService';
import type { CategoryType } from '~/types/CategoryType';
import type { ProductType } from '~/types/ProductType';
import { trackProductView } from '~/utils/gtm';

const windowStore = useWindowStore();
const { windowWidth } = toRefs(windowStore);

const productStore = useProductStore();
const { fetchProduct } = productStore;

const cartStore = useCartStore();
const { cart } = toRefs(cartStore);

const localePath = useLocalePath();
const { locale } = useI18n();

const router = useRouter();

const {
  product,
  category,
  favorite,
  body,
  addToCart,
  direction,
  hasBorder,
  size,
} = defineProps({
  product: {
    type: {} as PropType<ProductType>,
  },

  category: {
    type: {} as PropType<CategoryType>,
  },
  favorite: {
    type: Boolean,
    default: true,
  },
  body: {
    type: Boolean,
    default: true,
  },
  addToCart: {
    type: Boolean,
    default: true,
  },
  imageSize: {
    type: String as () => 'xsmall' | 'small' | 'medium',
    default: 'medium',
  },
  direction: {
    type: String as () => 'horizontal' | 'vertical',
    default: 'vertical',
  },
  slider: {
    type: Boolean,
    default: true,
  },
  hasBorder: {
    type: Boolean,
    default: true,
  },
  shopthelook: {
    type: Boolean,
    default: false,
  },
  btnRemoveFromCart: {
    type: Boolean,
    default: false,
  },
  openCartAfterAddProduct: {
    type: Boolean,
    default: true,
  },
  hovered: {
    type: Boolean,
    default: false,
  },
  size: {
    type: String as () => 'small' | 'medium',
    default: 'medium',
  },
});

const getLink = computed(() => {
  if (product) {
    const productHelper = new ProductHelper(product);
    return localePath(productHelper.getUrl(category));
  }
  return localePath('/#');
});

const redirect = (event: any) => {
  event.preventDefault();
  // Track product view event when user clicks on the product
  if (currentProduct.value) {
    trackProductView(currentProduct.value);
  }
  router.push(getLink.value);
};

const imagesLarge = computed(() => {
  const image = currentProduct.value?.Media?.Images?.product_large;

  if (image) {
    return image;
  } else {
    return null;
  }
});

const loadMedias = () => {
  const productService = new ProductService();
  if (currentProduct.value?.IdProduct) {
    if (!currentProduct.value.Variant) {
      productService
        .fetchVariant(currentProduct.value.IdProduct)
        .then((data: any) => {
          if (currentProduct.value) {
            currentProduct.value.Variant = data;
          }
        })
        .finally(() => {});
    } else {
    }

    if (!currentProduct.value.Media?.Images?.product_small) {
      productService
        .fetchMedias(currentProduct.value.IdProduct)
        .then((data: any) => {
          if (currentProduct.value) {
            currentProduct.value.Media = data;
          }
        });
    }
  }

  // Track product impression when user hovers over the product
  if (currentProduct.value) {
    trackProductView(currentProduct.value);
  }
};

const loadingProductRealaionShip = ref(false);

const currentProduct = ref<ProductType | undefined>(product);

const setDefaultProduct = () => {
  if (currentProduct.value?.IdProduct !== product?.IdProduct) {
    loadingProductRealaionShip.value = true;
    setTimeout(() => {
      currentProduct.value = product;
      loadingProductRealaionShip.value = false;
    }, 100);
  }
};

const colorClickHandler = async ($product: ProductType) => {
  if ($product.IdProduct) {
    if ($product.IdProduct !== product?.IdProduct) {
      loadingProductRealaionShip.value = true;
      try {
        $product = await fetchProduct($product.IdProduct);
        currentProduct.value = $product;
      } catch (error) {}
      loadingProductRealaionShip.value = false;
    } else {
      setDefaultProduct();
    }
  }
};

const productInCart = () => {
  return cart.value.Products?.find((p) => p.IdProduct === product?.IdProduct);
};

const variantSelected = () => {
  const vSelected = productInCart()?.Variant?.find((v) => v.Selected === true);

  return vSelected?.Combination?.Attributes?.find(
    (a) => a.GroupName === 'Size'
  );
};

// const currentProduct = computed(() => {
//   if (productReationShip.value) {
//     return productReationShip.value;
//   }
//   return product;
// });
</script>

<template>
  <a
    :href="getLink"
    @click.prevent=""
    class="cardProduct"
    :class="[direction, { hasBorder }, { hovered }]"
    @mouseenter="loadMedias"
    v-loading="loadingProductRealaionShip"
    @mouseleave="setDefaultProduct()"
  >
    <div class="cardProduct-top relative aspect-[1080/1610]">
      <CardProductMedia
        @click="redirect"
        :product="currentProduct"
        :imageSize="imageSize"
        :slider="slider"
      />
      <div
        v-if="favorite && direction === 'horizontal'"
        class="cardProduct-favorite cardProduct-favorite--horizontal"
      >
        <CardProductAddToFavorite :product="currentProduct" colorIcon="black" />
      </div>

      <CardProductAddToCart
        v-if="addToCart && windowWidth < 992"
        class="showbody"
        :product="currentProduct"
      />
      <div
        v-if="favorite && direction === 'vertical'"
        class="cardProduct-favorite"
      >
        <CardProductAddToFavorite :product="currentProduct" colorIcon="black" />
      </div>

      <ButtonShopTheLook
        v-if="shopthelook && product?.Association"
        :product="product"
        class="cardProduct-shopthelook"
      />
    </div>
    <div v-if="body" class="cardProduct-body">
      <div
        class="pt-1.5 flex items-start gap-x-2"
        :class="{
          'lg:pt-3 pb-2 lg:pb-3 px-2 lg:px-5': size === 'medium',
          'pb-2 px-2 ': size === 'small',
        }"
      >
        <div class="flex-1">
          <CardProductTitle
            @click="redirect"
            :product="currentProduct"
            class="mb-1 lg:mb-0"
          />
          <CardProductPrice :product="currentProduct" :size="size" />
          <div
            v-if="btnRemoveFromCart && productInCart()"
            class="flex items-center mt-2 gap-x-2"
          >
            <span class="text-xs py-1 px-2 border border-black">
              {{ variantSelected()?.AttributeName }}
            </span>
            <ButtonRemoveFromCart :product="productInCart()" />
          </div>
        </div>

        <CardProductColors
          v-if="size === 'medium' && product && direction === 'vertical'"
          :product="product"
          :activeIdProduct="Number(product?.IdProduct)"
          class="mt-0"
        />
      </div>

      <div
        v-if="addToCart && windowWidth >= 992 && size === 'medium'"
        class="cardProduct-variants"
      >
        <PageCatalogVariants
          :product="product"
          @colorClick="colorClickHandler($event)"
          :activeIdProduct="Number(currentProduct?.IdProduct)"
          :openCartAfterAddProduct="openCartAfterAddProduct"
        />
      </div>
    </div>
  </a>
</template>
<style lang="scss">
$cardProduct: '.cardProduct';

#{$cardProduct} {
  @apply relative;
  &.hasBorder {
    &:after {
      content: '';
      box-shadow:
        1px 0 black,
        0 1px black,
        1px 1px black,
        1px 0 black inset,
        0 1px black inset;
      height: 100%;
      left: 0;
      pointer-events: none;
      position: absolute;
      top: 0;
      width: 100%;
      z-index: 10;
    }

    #{$cardProduct} {
      &-body {
        @apply border-t border-black;
      }
    }
  }

  &-image {
    @apply w-full;
  }
  &-body {
    @apply relative overflow-hidden bg-white;
    // @apply pt-3 pb-5 px-2;
    // @screen lg {
    //   @apply px-5;
    // };
  }
  &-price {
    @apply flex items-baseline gap-x-2 flex-wrap;
  }
  &-showbody {
    @apply absolute bottom-2 right-2 z-10;
  }
  &-favorite {
    @apply absolute top-0 right-0 z-10;

    @screen lg {
      @apply opacity-0 pointer-events-none duration-150 top-0 right-0;
    }
  }

  &-variants {
    @apply pt-3 pb-5 px-2 lg:px-5 absolute top-0 left-0 w-full z-10 bg-white
    h-full duration-300 -translate-y-full opacity-0;
  }

  &.hovered,
  &:hover {
    #{$cardProduct} {
      &-favorite {
        @screen lg {
          @apply opacity-100 pointer-events-auto;
        }
      }
      &-variants {
        @apply translate-y-0 opacity-100;
      }
      &-shopthelook {
        @screen lg {
          @apply opacity-100 pointer-events-auto;
        }
      }
    }
  }

  &.hovered {
    #{$cardProduct} {
      &-variants {
        @apply relative translate-y-0 opacity-100;
      }
    }
  }
  &.horizontal {
    @apply flex;
    #{$cardProduct} {
      &-top {
        @apply w-28;
        @screen lg {
          @apply w-40;
        }
      }
      &-body {
        @apply flex-1;
      }
      &-favorite {
        &--horizontal {
          @apply opacity-100 pointer-events-auto;
        }
        @screen lg {
          @apply top-0 right-0;
        }
      }
      &-variants {
        @apply h-auto bottom-0 top-auto translate-y-full pb-3;
      }
    }
    &.hasBorder {
      #{$cardProduct} {
        &-top {
          @apply border-r border-black;
        }
      }
    }
    &:hover {
      #{$cardProduct} {
        &-variants {
          @apply translate-y-0;
        }
      }
    }
  }
  // .v-loading-spinner {
  //   @apply h-12;
  // }
  &-shopthelook {
    @apply absolute bottom-5 right-5 z-10;

    @screen lg {
      @apply opacity-0 pointer-events-none duration-150;
    }
  }
}
</style>
