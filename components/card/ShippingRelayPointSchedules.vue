<script setup lang="ts">
import type { RelayPointType } from '~/types/RelayPointsType';

const scheduleIsVisible = ref(false);
const { relayPointSelected } = defineProps({
  relayPointSelected: {
    type: {} as PropType<RelayPointType>,
    required: true,
  },
});
</script>

<template>
  <div>
    <span
      @click.stop="scheduleIsVisible = true"
      class="underline cursor-pointer"
    >
      {{ $t('button.schedules_and_info') }}
    </span>
    <div>
      <BaseModal
        class="languageModal-Modal"
        v-model="scheduleIsVisible"
        size="420px"
      >
        <template #header>
          <span class="text-base uppercase font-medium">
            {{ $t('button.schedules_and_info') }}
          </span>
        </template>
        <div class="flex flex-col -m-5" v-if="relayPointSelected?.OpeningHours">
          <div
            v-for="(hour, groupName, index) in relayPointSelected?.OpeningHours"
            class="flex text-sm border-black"
            :class="{
              'border-b':
                index <
                Object.keys(relayPointSelected?.OpeningHours).length - 1,
            }"
          >
            <span class="min-w-32 font-light border-r border-black py-2 px-5">
              {{ groupName }} :
            </span>
            <span class="font-normal py-2 px-5">
              {{ hour }}
            </span>
          </div>
        </div>
      </BaseModal>
    </div>
  </div>
</template>

<style scoped></style>
