<script lang="ts" setup>
import type { ProductType, Variant } from '~/types/ProductType';
import Drawer from '~/components/base/Drawer.vue';
import type { GiftCardPayload } from '~/types/CartType';

const windowStore = useWindowStore();
const { windowWidth } = toRefs(windowStore);

const cartStore = useCartStore();
const { addToCart } = cartStore;

const appStore = useAppStore();
const { miniCartVisible, languageIsoCode } = toRefs(appStore);

const { product, choseSizeBtn } = defineProps({
  product: {
    type: {} as PropType<ProductType>,
  },
  choseSizeBtn: {
    type: Boolean,
    default: true,
  },
});

const noSizeSelectedError = ref(false);

const emit = defineEmits(['onVariantSelected']);

const indexActive = ref<number>();
const variantSelected = ref<Variant>();

const containers = ref<HTMLElement[] | null>(null);
const lines = ref<HTMLElement[] | null>(null);

const isVisible = ref(false);
const backInStockVisible = ref(false);
const drawerComponent = ref(markRaw(Drawer));

const variants = computed(() => {
  return product?.Variant;
});

const isDrawer = computed(() => {
  return windowWidth.value < 992;
});

const isGiftCard = computed(() => {
  return product?.ProductType === 'e-giftcard';
});

const selectVariant = (index: number, variant: Variant) => {
  variantSelected.value = variant;
  indexActive.value = index;
  if (variant?.Quantity) {
    backInStockVisible.value = false;

    if (isDrawer.value) {
      isVisible.value = false;
      addToCartHandler();
    }

    emit('onVariantSelected', { variant });
  } else {
    backInStockVisible.value = true;
  }
};
const addToCartHandler = (giftCardPayload?: GiftCardPayload) => {
  noSizeSelectedError.value = false;
  if (variantSelected.value) {
    const idProductAttributeSelected =
      variantSelected.value?.Combination?.IdProductAttribute;
    if (product?.IdProduct && idProductAttributeSelected) {
      let params = {
        idProduct: product?.IdProduct,
        idProductAttribute: idProductAttributeSelected,
      };
      if (giftCardPayload) {
        params = {
          ...params,
          ...giftCardPayload,
        };
      }
      addToCart(params).then(() => {
        miniCartVisible.value = true;
      });
    }
  } else {
    noSizeSelectedError.value = true;
  }
};
const addToCartClickHandler = () => {
  if (!isDrawer.value) {
    addToCartHandler();
  } else {
    isVisible.value = true;
  }
};

const AddToCartGiftCard = (payload: GiftCardPayload) => {
  // this.addToCart(payload);
  console.log('payload', {
    ...payload,
    productType: 'e-giftcard',
    languageIsoCode: languageIsoCode.value,
  });

  addToCartHandler({
    ...payload,
    productType: 'e-giftcard',
    languageIsoCode: languageIsoCode.value,
  });
};

onMounted(() => {
  if (variants.value && variants.value.length > 0) {
    if (variants.value[0]) {
      selectVariant(0, variants.value[0]);
    }
  }
});
</script>

<template>
  <div class="pageProduct-sizes">
    <component
      :is="isDrawer ? drawerComponent : 'div'"
      v-model="isVisible"
      size="auto"
      position="bottom"
      :closeButton="false"
      :class="{ 'pageProduct-sizes-drawer': isDrawer }"
      bodyPadding="0px"
    >
      <div class="pageProduct-sizes-content relative">
        <div class="flex lg:hidden items-center justify-between px-5 mb-3">
          <div class="text-xs uppercase font-normal">
            {{ $t('titles.select_a_size') }}
          </div>

          <LayoutGuideSize />
        </div>

        <span
          v-if="noSizeSelectedError && !variantSelected"
          class="absolute top-0 text-xs text-red-500 -translate-y-full"
        >
          {{ $t('messages.please_select_size') }}
        </span>
        <ul class="pageProduct-sizes-body">
          <li
            v-for="(variant, index) in variants"
            :key="index"
            class="pageProduct-sizes-cel"
            @click="selectVariant(index, variant)"
            :class="{
              active: indexActive === index,
              disabled: !variant.Quantity,
            }"
            ref="containers"
          >
            <!-- <span v-if="!variant.Quantity" ref="lines" class="line"></span> -->
            <template v-for="attr in variant?.Combination?.Attributes">
              <div
                v-if="attr.GroupName === 'Size'"
                class="flex items-center justify-center"
              >
                {{ attr.AttributeName }}
                <IconNotif
                  v-if="!variant.Quantity"
                  class="ml-2"
                  color="#bbbbbb"
                />
              </div>
            </template>
          </li>
        </ul>
      </div>
    </component>
    <div>
      <!-- <BaseButton
        v-if="isDrawer && choseSizeBtn"
        type="primary"
        plain
        class="w-full mb-3"
        @click="addToCartClickHandler"
        size="small"
      >
        {{ $t('button.choose_your_size') }}
      </BaseButton> -->
      <div v-if="!isGiftCard" class="flex gap-3">
        <BaseButton
          v-if="!backInStockVisible"
          type="primary"
          class="w-full"
          @click="addToCartClickHandler"
          :size="'medium'"
          :title="$t('button.add_to_cart')"
        >
          {{ $t('button.add_to_cart') }}
        </BaseButton>
        <LayoutBackInStock
          v-else-if="
            backInStockVisible &&
            product &&
            variantSelected?.Combination?.IdProductAttribute
          "
          class="w-full"
          :product="product"
          :idProductAttribute="variantSelected?.Combination?.IdProductAttribute"
        />
        <CardProductAddToFavorite
          :product="product"
          type="primary"
          class="!min-w-11 !lg:min-w-11"
          colorIcon="black"
          plain
        />
      </div>
      <FormGiftCard v-else @onSuccess="AddToCartGiftCard($event)" />
    </div>
  </div>
</template>

<style lang="scss">
$pageProduct-sizes: '.pageProduct-sizes';
#{$pageProduct-sizes} {
  &-body {
    @apply flex flex-wrap mb-5;
  }
  &-cel {
    --border-color: var(--color-black);
    @apply relative py-2 px-4 w-auto
      text-center font-light cursor-pointer duration-150 text-sm z-[2];
    flex: 0 0 16.6666%;

    &:after {
      @apply h-full w-full absolute top-0 left-0 pointer-events-none z-10;
      content: '';
      box-shadow: 1px 0 var(--border-color), 0 1px var(--border-color),
        1px 1px var(--border-color), 1px 0 var(--border-color) inset,
        0 1px var(--border-color) inset;
    }

    &.disabled {
      --border-color: var(--color-disabled);
      color: var(--color-disabled);
      @apply z-[1];
      .line {
      }
    }

    &:active,
    &:hover {
      &:not(.disabled) {
        @apply bg-black text-white;
      }
    }

    &.active {
      @apply bg-black text-white;
      &.disabled {
        --border-color: black;
        @apply bg-black/70;
      }
    }
  }

  &-drawer {
    #{$pageProduct-sizes} {
      &-content {
        @apply pt-2 pb-4 overflow-hidden;
      }
      &-body {
        @apply mx-[-1px] mb-0;
      }
      &-cel {
        flex: 0 0 33.33%;
        &:nth-child(3n) {
        }
        @screen lg {
        }

        &.disabled {
          .line {
          }

          &:active,
          &:hover {
            &:not(.disabled) {
            }
          }

          &.active {
            // @apply bg-black text-white;
          }
        }
      }
    }
  }
}

/*

$pageProduct-sizes: '.pageProduct-sizes';
#{$pageProduct-sizes} {
  &-body {
    @apply flex flex-wrap;
  }
  &-cel {
    @apply py-5 px-5 w-auto
    text-center  font-light cursor-pointer
    duration-150
    relative overflow-hidden
     min-w-14 text-xs
     border-black;

    @apply py-2  px-4 mb-[-1px]  mr-[-1px] border w-auto;

    &.disabled {
      @apply cursor-not-allowed text-stone-400 border-stone-400;

      .line {
        @apply absolute top-0 left-0
        block w-full h-full;
        background: linear-gradient(
          to top right,
          transparent 49%,
          #a8a29e 49%,
          #a8a29e 50%,
          transparent 50.5%
        );
      }
    }

    &:active,
    &:hover {
      &:not(.disabled) {
        @apply bg-black text-white;
      }
    }

    &.active {
      @apply bg-black text-white;
    }
  }
  &-drawer {
    #{$pageProduct-sizes} {
      &-body {
        @screen lg {
          @apply border-0;
        }
      }
      &-cel {
        @apply py-5 px-5 w-auto
              text-center  font-light cursor-pointer
              duration-150
              relative overflow-hidden
              min-w-14 text-xs
              border-black
              border-b
              border-r;

        flex: 0 0 33.33%;
        &:nth-child(3n) {
          // @apply border-r-0;
        }
        @screen lg {
          @apply py-2  px-4 mb-[-1px]  mr-[-1px] border w-auto;
          flex: 0 0 auto;
        }

        &.disabled {
          @apply cursor-not-allowed text-stone-400 border-stone-400;

          .line {
            @apply absolute top-0 left-0
        block w-full h-full;
            background: linear-gradient(
              to top right,
              transparent 49%,
              #a8a29e 49%,
              #a8a29e 50%,
              transparent 50.5%
            );
          }
        }

        &:active,
        &:hover {
          &:not(.disabled) {
            @apply bg-black text-white;
          }
        }

        &.active {
          @apply bg-black text-white;
        }
      }
    }
  }
}

*/
</style>
