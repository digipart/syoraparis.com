<script setup lang="ts">
import type { ProductType, Variant } from '~/types/ProductType';

const { product } = defineProps({
  product: {
    type: {} as PropType<ProductType>,
  },
});

const emit = defineEmits(['onContinue']);

const indexActive = ref<number>();
const variantSelected = ref<Variant>();
const variants = computed(() => {
  return product?.Variant;
});

const selectVariant = (index: number, variant: Variant) => {
  indexActive.value = index;
  variantSelected.value = variant;
};

const next = () => {
  emit('onContinue', variantSelected.value);
};
</script>

<template>
  <div class="reservationInStoreInfo-body pr-1">
    <div class="grid grid-cols-12 gap-5">
      <div class="col-span-12 md:col-span-5">
        <CardProductMedia :product="product" />
      </div>
      <div class="col-span-12 md:col-span-7">
        <BaseHeadLine size="md" class="uppercase font-normal mb-3">
          {{ product?.Description?.Title }}
          <small class="block">
            {{ product?.Reference }}
          </small>
        </BaseHeadLine>
        <CardProductPrice :product="product" size="large" class="mb-5" />

        <div class="justify-between gap-x-4 hidden lg:flex">
          <label class="font-normal text-sm inline-block">
            {{ $t('label.select_size_continue') }} :
          </label>
        </div>
        <div class="w-full" ref="addToCartBox">
          <div class="pageProductInformations-addToCart py-3">
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
        </div>
        <div class="flex justify-end">
          <BaseButton
            type="primary"
            size="small"
            :title="$t('button.continue')"
            @click="next()"
          >
            {{ $t('button.continue') }}
          </BaseButton>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
