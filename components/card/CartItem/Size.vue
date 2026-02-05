<script setup lang="ts">
import type { Attribute, ProductType, Variant } from '~/types/ProductType';

const cartStore = useCartStore();
const { updateProductInCart } = cartStore;

const { product, editable = true } = defineProps<{
  editable?: boolean;
  product?: ProductType;
}>();

const loading = ref(false);

type Option = {
  label: string | undefined;
  value: number | undefined;
  disabled: boolean;
};

const selectedOption = computed<Option>(() => {
  if (product?.Variant) {
    const selectedProduct = product.Variant.find((variant) => variant.Selected);
    if (selectedProduct?.Combination) {
      if (selectedProduct?.Combination?.Attributes) {
        const sizeAttribute = selectedProduct?.Combination?.Attributes.find(
          (attr: Attribute) => attr.GroupName === 'Size'
        );
        return {
          label: sizeAttribute?.AttributeName,
          value: selectedProduct.Combination.IdProductAttribute,
          disabled: !selectedProduct.Available,
        };
      }
    }
  }
  return {
    label: undefined,
    value: undefined,
    disabled: false,
  };
});
const selected = ref<Option>(selectedOption.value);

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

const isOptionSelectable = (option: Option) => !option.disabled;

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
      :selectable="isOptionSelectable"
      @update:modelValue="handleChange"
      :class="{
        readOnly: !editable,
        'is-unavailable': selected?.disabled,
      }"
    ></v-select>
    <div v-if="selected?.disabled" class="text-error text-[10px] mt-1">
      {{ $t('cart.product_unavailable') }}
    </div>
  </div>
</template>

<style lang="scss">
$cartItemSize: '.cartItemSize';

#{$cartItemSize} {
  .text-error {
    color: #ff0000;
    @apply font-medium;
  }
}

.is-unavailable {
  .vs__dropdown-toggle {
    @apply border-red-500;
  }
  .vs__selected {
    @apply text-error;
  }
}

.readOnly {
  @apply pointer-events-none cursor-not-allowed;

  .vs__actions {
    display: none;
  }
}
</style>
