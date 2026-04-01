<script setup lang="ts">
import type { CarrierGenre } from '~/types/ShippingType';

const { carrierSelected } = defineProps({
  carrierSelected: {
    type: Object as PropType<CarrierGenre>,
  },
});

const shippingStore = useShippingStore();
const { relayPointSelected } = toRefs(shippingStore);

const emit = defineEmits(['onSelectPointRelay']);

const sideRelayPointsVisible = ref(false);

const selectPointRelay = (rpId: string) => {
  emit('onSelectPointRelay', rpId);
};
</script>

<template>
  <div class="flex flex-wrap gap-4 w-full justify-between items-start">
    <div class="flex flex-col text-xs flex-1">
      <span v-if="relayPointSelected?.Name" class="font-normal mb-1">
        {{ relayPointSelected?.Name }}
      </span>

      <span v-if="relayPointSelected?.Address1">
        {{ relayPointSelected?.Address1 }}
      </span>
      <span v-if="relayPointSelected?.Address2">
        {{ relayPointSelected?.Address2 }}
      </span>
      <span v-if="relayPointSelected?.Address3">
        {{ relayPointSelected?.Address3 }}
      </span>
      <span v-if="relayPointSelected?.Postcode">
        {{ relayPointSelected?.Postcode }}
        <span v-if="relayPointSelected?.City">
          {{ relayPointSelected?.City }}
        </span>
      </span>

      <div class="mt-3 flex gap-5">
        <span
          v-if="relayPointSelected?.Location?.DistanceFromAddress"
          class="font-normal"
        >
          {{
            Number(
              relayPointSelected?.Location?.DistanceFromAddress || 0
            ).toFixed(2)
          }}m
        </span>

        <span v-if="relayPointSelected?.OpeningHours" class="font-normal">
          <CardShippingRelayPointSchedules
            :relayPointSelected="relayPointSelected"
          />
        </span>
      </div>
    </div>
    <div>
      <BaseButton
        plain
        type="primary"
        size="small"
        @click.stop="sideRelayPointsVisible = true"
      >
        {{ $t('button.choose_another_relay_point') }}
      </BaseButton>

      <CardShippingRelayPointDrawer
        v-model="sideRelayPointsVisible"
        :carrierSelected="carrierSelected"
        @onSelectPointRelay="selectPointRelay"
      />
    </div>
  </div>
</template>
