<script setup lang="ts">
import type { Attribute, ProductType, Variant } from '~/types/ProductType';

const cartStore = useCartStore();
const { updateProductInCart } = cartStore;

const { product, editable = true } = defineProps<{
  editable?: boolean;
  product?: ProductType;
}>();

const loading = ref(false);

const selectedOption = computed(() => {
  if (product?.Variant) {
    const selectedProduct = product.Variant.find((variant) => variant.Selected);
    if (selectedProduct?.Combination) {
      //   return selectedProduct
      //     ? selectedProduct?.Combination.IdProductAttribute
      //     : null;
      if (selectedProduct?.Combination?.Attributes) {
        const sizeAttribute = selectedProduct?.Combination?.Attributes.find(
          (attr: Attribute) => attr.GroupName === 'Size'
        );
        return {
          label: sizeAttribute?.AttributeName,
          value: selectedProduct.Combination.IdProductAttribute,
        };
      }
    }
  }
  return {};
});
const selected = ref(selectedOption.value);

const options = computed(() => {
  if (product?.Variant) {
    return product?.Variant.map((variant: Variant) => {
      if (variant?.Combination?.Attributes) {
        const sizeAttribute = variant?.Combination?.Attributes.find(
          (attr: Attribute) => attr.GroupName === 'Size'
        );
        return {
          label: sizeAttribute?.AttributeName,
          value: variant.Combination.IdProductAttribute,
          disabled: !variant.Available,
        };
      }
    });
  }
});

const handleChange = (newValue: any) => {
  loading.value = true;
  if (
    product?.IdProduct &&
    selectedOption.value &&
    selectedOption.value.value
  ) {
    updateProductInCart({
      idProduct: product?.IdProduct,
      idProductAttribute: selectedOption.value.value,
      quantity: product?.Quantity,
      newIdProductAttribute: newValue.value,
    }).finally(() => {
      loading.value = false;
    });
  }
};
</script>

<template>
  <div class="cartItemSize" v-loading="loading">
    <v-select
      v-model="selected"
      :options="options"
      class="centered-select"
      :searchable="false"
      :clearable="false"
      @update:modelValue="handleChange"
      :class="{
        readOnly: !editable,
      }"
    ></v-select>
  </div>
</template>

<style lang="scss">
$cartItemSize: '.cartItemSize';

#{$cartItemSize} {
}

.readOnly {
  @apply pointer-events-none cursor-not-allowed;

  .vs__actions {
    display: none;
  }
}
</style>
