<script setup lang="ts">
import type { ProductType } from '~/types/ProductType';

const appStore = useAppStore();

const productStore = useProductStore();
const { fetchShopTheLook } = productStore;
const { productsAssociation } = toRefs(productStore);

const { product } = defineProps({
  product: {
    type: {} as PropType<ProductType>,
  },
});

const loading = ref(false);

const isVisisble = ref(false);

const getLooks = () => {
  if (product?.IdProduct) {
    if (!productsAssociation.value.length) {
      loading.value = true;
      fetchShopTheLook(product?.IdProduct)
        .then((data) => {})
        .catch((error) => {})
        .finally(() => {
          loading.value = false;
        });
    }
  }
};

onMounted(() => {
  getLooks();
});
const open = () => {
  isVisisble.value = true;
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
      <span class="hidden lg:block">
        {{ $t('button.shopthelook') }}
      </span>
      <span class="lg:hidden">
        {{ $t('Look') }}
      </span>
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
        <!-- <CardProduct
          :product="product"
          image-size="small"
          direction="horizontal"
          :hasBorder="false"
          :btnRemoveFromCart="true"
          :openCartAfterAddProduct="false"
        />
        <hr class="my-4" /> -->
        <div
          class="shopthelook-item"
          v-for="(product, index) in productsAssociation"
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
          <hr class="my-4" v-if="index < productsAssociation.length - 1" />
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
