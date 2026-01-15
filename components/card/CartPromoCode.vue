<script setup lang="ts">
import CodepromoService from '~/services/CodepromoService';
import type { CartPromoCode } from '~/types/CartType';

const appStore = useAppStore();
const { currencySign } = toRefs(appStore);
const loading = ref(false);

const useCart = useCartStore();
const { cartId } = toRefs(useCart);

const { promocode } = defineProps({
  promocode: {
    type: {} as PropType<CartPromoCode>,
    required: true,
  },
  size: {
    type: String as () => 'small' | 'medium',
    default: 'medium',
  },
  editable: {
    type: Boolean,
    default: true,
  },
});


const emit = defineEmits(['onCodeRemoved']);

const removeCodePromo = () => {
  const codepromoService = new CodepromoService();
  if (cartId.value && promocode?.IdPromoCode) {
    loading.value = true;
    codepromoService
      .delete({
        IdCart: cartId.value,
        IdPromoCode: promocode?.IdPromoCode,
      })
      .then(async () => {
        emit('onCodeRemoved');

      })
      .finally(() => {
        loading.value = false;
      });
  }
};
</script>

<template>
  <div class="cartCodePromo" :class="size">
    <div class="flex-1">
      <BaseHeadLine class="cartCodePromo-title">
        {{ promocode.Title }}
        <small class="block font-light">{{ promocode.Description }}</small>
      </BaseHeadLine>
    </div>
    <div class="cartCodePromo-right">
      <b>
        - {{ promocode?.Reduction?.Value?.TaxIncl?.toFixed(2) }}
        {{ currencySign }}
      </b>
      <small
        v-if="editable"
        class="uppercase underline cursor-pointer"
        v-loading="loading"
        @click="removeCodePromo"
      >
        <span v-if="size === 'medium'">{{ $t('button.remove') }}</span>
        <IconX :size="1.6" />
      </small>
    </div>
  </div>
</template>

<style lang="scss">
$cartCodePromo: '.cartCodePromo';

#{$cartCodePromo} {
  @apply border border-black/50 p-3 flex gap-3 justify-between;

  &-title {
    @apply font-normal;
  }
  &-right {
    @apply flex flex-col items-end min-w-[80px];
  }

  &.small {
    #{$cartCodePromo} {
      &-title {
        @apply text-xs;
      }
      &-right {
        @apply text-xs flex-row flex items-center gap-2;
      }
    }
  }
}
</style>
