<script setup lang="ts">
import type { Attribute, ProductType } from '~/types/ProductType';
const cartStore = useCartStore();
const { updateProductInCart } = cartStore;

const { product, editable = true } = defineProps<{
  editable?: boolean;
  product?: ProductType;
}>();

const loading = ref(false);
const quantity = ref(product?.Quantity);

const variantSelected = computed(() => {
  if (product?.Variant) {
    const selectedProduct = product.Variant.find((variant) => variant.Selected);
    // if (selectedProduct?.Combination) {
    //   //   return selectedProduct
    //   //     ? selectedProduct?.Combination.IdProductAttribute
    //   //     : null;
    //   if (selectedProduct?.Combination?.Attributes) {
    //     const sizeAttribute = selectedProduct?.Combination?.Attributes.find(
    //       (attr: Attribute) => attr.GroupName === 'Size'
    //     );
    //     return sizeAttribute;
    //   }
    // }

    return selectedProduct;
  }
  return {};
});
let timerUpdateQuantity: any;
const handleChange = (qte: number) => {
  clearTimeout(timerUpdateQuantity);
  timerUpdateQuantity = setTimeout(async () => {
    loading.value = true;
    if (product?.IdProduct && product.IdProductAttribute) {
      updateProductInCart({
        idProduct: product?.IdProduct,
        idProductAttribute: product.IdProductAttribute,
        quantity: qte,
      }).finally(() => {
        loading.value = false;
      });
    }
  }, 1000);
};
</script>
<template>
  <div>
    <InputNumber
      v-model="quantity"
      @change="handleChange($event)"
      :min="1"
      :max="variantSelected?.Quantity"
      v-loading="loading"
      :readOnly="!editable"
    />
  </div>
</template>

<style scoped></style>
