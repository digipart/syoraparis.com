<script setup lang="ts">
import ProductService from '~/services/ProductService';
import type { ProductType } from '~/types/ProductType';

const appStore = useAppStore();
const { currencyIsoCode, languageIsoCode } = toRefs(appStore);

const { product } = defineProps({
  product: {
    type: {} as PropType<ProductType>,
  },
});

const products = ref<ProductType[]>([]);

const loading = ref(false);

const isVisisble = ref(false);

const productService = new ProductService();

const getLooks = () => {
  if (product?.IdProduct) {
    if (!products.value.length) {
      loading.value = true;
      productService
        .fetchShopTheLook(product?.IdProduct, {
          CurrencyIsoCode: currencyIsoCode.value,
          LanguageIsoCode: languageIsoCode.value,
        })
        .then((data) => {
          isVisisble.value = true;
          products.value = data;
        })
        .catch((error) => {})
        .finally(() => {
          loading.value = false;
        });
    } else {
      isVisisble.value = true;
    }
  }
};

const open = () => {
  getLooks();
};
</script>

<template>
  <div class="buttonShopTheLook">
    <BaseButton
      type="primary"
      plain
      size="small"
      @click="open()"
      :title="$t('button.shopthelook')"
      v-loading="loading"
      :disabled="loading"
    >
      {{ $t('button.shopthelook') }}
    </BaseButton>

    <BaseDrawer
      v-model="isVisisble"
      size="100%"
      maxSize="600px"
      position="right"
      :closeButton="true"
      class="sideMenu-drawer"
    >
      <template #header>
        <span class="uppercase font-normal">
          {{ $t('button.shopthelook') }}
        </span>
      </template>
      <div>
        <CardProduct
          :product="product"
          image-size="small"
          direction="horizontal"
          :hasBorder="false"
          :btnRemoveFromCart="true"
          :openCartAfterAddProduct="false"
        />
        <hr class="my-4" />
        <div
          class="shopthelook-item"
          v-for="product in products"
          :key="product.IdProductAttribute"
        >
          <CardProduct
            :product="product"
            image-size="small"
            direction="horizontal"
            :hasBorder="false"
            :btnRemoveFromCart="true"
            :openCartAfterAddProduct="false"
          />
          <hr class="my-4" />
        </div>
      </div>
    </BaseDrawer>
  </div>
</template>

<style lang="scss">
$buttonShopTheLook: '.buttonShopTheLook';

#{buttonShopTheLook} {
}
</style>
