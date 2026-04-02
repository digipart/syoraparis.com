<script setup lang="ts">
import type { RelayPointType } from '~/types/RelayPointsType';
import type { CarrierGenre } from '~/types/ShippingType';

const { relayPointSelected, buttonText, carrierSelected } = defineProps<{
  relayPointSelected: RelayPointType;
  carrierSelected: CarrierGenre;
  buttonText?: string;
}>();

const emit = defineEmits(['onRelayPointSelected']);

const sideRelayPointsVisible = ref(false);

const selectPointRelay = (rpId: string) => {
  emit('onRelayPointSelected', rpId);
};
</script>

<template>
  <div class="relay-point-card">
    <div class="flex items-center gap-2">
      <div
        class="h-10 w-10 flex items-center justify-center border border-gray-200 bg-slate-100"
      >
        <IconLocation :size="3" />
      </div>
      <div class="flex-1">
        <div>
          <span class="font-medium text-black text-sm mr-1"
            >{{ relayPointSelected?.Name }}
          </span>
          <span>
            {{
              Number(
                relayPointSelected?.Location?.DistanceFromAddress || 0
              ).toFixed(3)
            }}m
          </span>
          <br />
          <span>{{ relayPointSelected?.Address1 }}</span>
          <span v-if="relayPointSelected?.Postcode"
            >, {{ relayPointSelected?.Postcode }}
          </span>
          <span v-if="relayPointSelected?.City"
            >&nbsp;{{ relayPointSelected?.City }}
          </span>
        </div>
      </div>
    </div>

    <div class="flex justify-between items-center">
      <CheckoutRelayPointHours
        :relayPointSelected="relayPointSelected"
        class="mt-1"
      />
      <div v-if="buttonText">
        <span
          class="cursor-pointer underline"
          :title="buttonText"
          @click="sideRelayPointsVisible = true"
        >
          {{ buttonText }}
        </span>
      </div>
    </div>

    <CardShippingRelayPointDrawer
      v-model="sideRelayPointsVisible"
      :carrierSelected="carrierSelected"
      @onSelectPointRelay="selectPointRelay"
    />
  </div>
</template>

<style scoped lang="scss">
.relay-point-card {
  @apply border border-gray-300 bg-white/80 p-3 text-xs text-gray-700 normal-case font-normal;
  @apply flex flex-col gap-2;
}
</style>
