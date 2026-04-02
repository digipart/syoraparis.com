<script setup lang="ts">
import type { RelayPointType } from '~/types/RelayPointsType';
import type { CarrierGenre } from '~/types/ShippingType';

const appStore = useAppStore();
const { currencySign } = toRefs(appStore);
const { carrier, buttonText, relayPointSelected } = defineProps<{
  carrier: CarrierGenre;
  buttonText?: string;
  relayPointSelected: RelayPointType | null;
}>();

const getCarrierImage = (carrier: CarrierGenre) => {
  if (!carrier?.Name) return '';
  if (carrier.Name.includes('Colissimo'))
    return '/assets/images/colissimo-logo.png';
  if (carrier.Name.includes('DHL')) return '/assets/images/dhl-logo.png';
  if (carrier.Name.includes('GLS')) return '/assets/images/gls-logo.svg';
  if (carrier.Name.includes('Chronopost'))
    return '/assets/images/chronopost-logo.png';
  if (carrier.Name.includes('UPS')) return '/assets/images/ups-logo.svg';
  return '';
};

const emit = defineEmits(['onChangeClick', 'onRelayPointSelected']);
</script>

<template>
  <div class="carrier-card">
    <div class="flex items-center gap-x-2">
      <img class="carrier-logo" :src="getCarrierImage(carrier)" alt="" />
      <div class="carrier-body">
        <div class="text-sm font-semibold text-black">
          {{ carrier?.Title || carrier?.Name }}
        </div>
        <div class="text-xs">{{ carrier?.Description }}</div>
      </div>
      <div class="carrier-price">
        {{ carrier?.Price?.TaxIncl }} {{ currencySign }}
      </div>
      <div v-if="buttonText">
        <BaseButton
          type="default"
          size="small"
          :title="buttonText"
          @click="emit('onChangeClick')"
        >
          {{ buttonText }}
          <template #iconRight>
            <IconChevronRight :size="1.4" />
          </template>
        </BaseButton>
      </div>
    </div>

    <div class="mt-[12px]" v-if="relayPointSelected">
      <CheckoutRelayPointCard
        :relayPointSelected="relayPointSelected"
        :buttonText="$t('button.change')"
        :carrierSelected="carrier"
        @onRelayPointSelected="emit('onRelayPointSelected', $event)"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.carrier {
  &-card {
    @apply border border-gray-200 bg-gray-50/50 p-3 text-sm text-gray-600;
  }
  &-logo {
    @apply w-12 h-12 object-contain p-1 border border-gray-200 bg-slate-100;
  }
  &-body {
    @apply flex-1;
  }
  &-price {
    @apply font-semibold text-black w-16 text-center;
  }
}
</style>
