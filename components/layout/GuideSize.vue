<script setup lang="ts">
const isVisible = ref(false);
const selectedUnit = ref<'cm' | 'in'>('cm');
const selectedSize = ref(38);

const sizes = [32, 34, 36, 38, 40, 42, 44];

const measurementRows = computed(() => [
  { label: useI18n().t('component.guidesize.waist.label'), key: 'waist' },
  { label: useI18n().t('component.guidesize.hip.label'), key: 'hip' },
]);

const measurements: Record<number, { waist: number; hip: number }> = {
  32: { waist: 58, hip: 86 },
  34: { waist: 62, hip: 90 },
  36: { waist: 66, hip: 94 },
  38: { waist: 70, hip: 98 },
  40: { waist: 74, hip: 102 },
  42: { waist: 78, hip: 106 },
  44: { waist: 82, hip: 110 },
};

const equivalences = computed(() => [
  {
    region: useI18n().t('component.guidesize.regions.europe'),
    sizes: { 32: 32, 34: 34, 36: 36, 38: 38, 40: 40, 42: 42, 44: 44 },
  },
  {
    region: useI18n().t('component.guidesize.regions.italy'),
    sizes: { 32: 36, 34: 38, 36: 40, 38: 42, 40: 44, 42: 46, 44: 48 },
  },
  {
    region: useI18n().t('component.guidesize.regions.uk'),
    sizes: { 32: 4, 34: 6, 36: 8, 38: 10, 40: 12, 42: 14, 44: 16 },
  },
  {
    region: useI18n().t('component.guidesize.regions.usa'),
    sizes: { 32: 0, 34: 2, 36: 4, 38: 6, 40: 8, 42: 10, 44: 12 },
  },
  {
    region: useI18n().t('component.guidesize.regions.mexico'),
    sizes: { 32: 0, 34: 1, 36: 3, 38: 5, 40: 7, 42: 9, 44: 11 },
  },
  {
    region: useI18n().t('component.guidesize.regions.china'),
    sizes: {
      32: '150/56A',
      34: '155/60A',
      36: '160/64A',
      38: '165/68A',
      40: '170/72A',
      42: '175/76A',
      44: '180/80A',
    },
  },
  {
    region: useI18n().t('component.guidesize.regions.korea'),
    sizes: { 32: 22, 34: 24, 36: 26, 38: 28, 40: 30, 42: 32, 44: 34 },
  },
]);

const formatValue = (val: number | string) => {
  if (typeof val === 'string') return val;
  if (selectedUnit.value === 'in') {
    return (val / 2.54).toFixed(1) + ' in';
  }
  return val + ' cm';
};

const visibleTableSizes = computed(() => {
  const index = sizes.indexOf(selectedSize.value);
  const result: number[] = [];
  if (index !== -1) {
    const prev = sizes[index - 1];
    const curr = sizes[index];
    const next = sizes[index + 1];
    if (prev !== undefined) result.push(prev!);
    if (curr !== undefined) result.push(curr!);
    if (next !== undefined) result.push(next!);
  }
  return result;
});

const getMeasurementValue = (size: number, key: string) => {
  const m = measurements[size];
  if (!m) return '';
  return formatValue((m as any)[key]);
};

const getEquivalenceValue = (
  eq: (typeof equivalences.value)[number],
  size: number
) => {
  return (eq.sizes as any)[size] ?? '';
};
</script>

<template>
  <div class="guidesize">
    <label
      class="font-normal text-xxs lg:text-sm uppercase tracking-wider"
      @click="isVisible = true"
    >
      {{ $t('component.guidesize.label') }}
    </label>
    <BaseDrawer v-model="isVisible" size="600px">
      <template #header>
        <h2 class="text-sm font-bold uppercase tracking-widest">
          {{ $t('component.guidesize.label') }}
        </h2>
      </template>
      <div class="guidesize-content py-6 lg:py-10">
        <!-- Header -->
        <div class="flex justify-between items-center mb-8">
          <h2 class="text-sm font-bold uppercase tracking-widest">
            {{ $t('component.guidesize.regions.europe') }}
          </h2>
          <div class="flex gap-4">
            <button
              class="text-xs font-bold uppercase tracking-widest pb-0.5 border-b-2 transition-all duration-300"
              :class="
                selectedUnit === 'cm'
                  ? 'border-black text-black'
                  : 'border-transparent text-gray-400'
              "
              @click="selectedUnit = 'cm'"
            >
              cm
            </button>
            <button
              class="text-xs font-bold uppercase tracking-widest pb-0.5 border-b-2 transition-all duration-300"
              :class="
                selectedUnit === 'in'
                  ? 'border-black text-black'
                  : 'border-transparent text-gray-400'
              "
              @click="selectedUnit = 'in'"
            >
              in
            </button>
          </div>
        </div>

        <!-- Size Selection Grid -->
        <div class="grid grid-cols-6 mb-8">
          <button
            v-for="size in sizes"
            :key="size"
            class="h-11 border border-gray-200 -ml-[1px] -mt-[1px] flex items-center justify-center text-xs transition-all duration-200"
            :class="
              selectedSize === size
                ? 'border-black z-10 ring-1 ring-black font-bold'
                : 'hover:bg-gray-50'
            "
            @click="selectedSize = size"
          >
            {{ size }}
          </button>
        </div>

        <!-- Measurement Table -->
        <div class="mb-8 overflow-x-auto">
          <table class="w-full text-left">
            <thead>
              <tr>
                <th class="w-1/3"></th>
                <th
                  v-for="size in visibleTableSizes"
                  :key="size"
                  class="py-2.5 text-center text-xs font-medium"
                  :class="
                    selectedSize === size
                      ? 'text-black font-bold'
                      : 'text-gray-400'
                  "
                >
                  {{ size }}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="row in measurementRows"
                :key="row.key"
                class="border-t border-gray-50"
              >
                <td class="py-2.5 text-xs font-bold">{{ row.label }}</td>
                <td
                  v-for="size in visibleTableSizes"
                  :key="size"
                  class="py-2.5 text-center text-xs"
                  :class="
                    selectedSize === size ? 'text-black' : 'text-gray-400'
                  "
                >
                  {{ getMeasurementValue(size, row.key) }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- International Equivalences -->
        <div class="mb-12">
          <BaseCollapsible>
            <BaseCollapsibleItem :index="0" :close-others="false">
              <template #header>
                <span class="text-sm">
                  {{ $t('component.guidesize.international_equivalence') }}
                </span>
              </template>
              <template #content>
                <div class="px-5 py-3 overflow-x-auto">
                  <table class="w-full text-left">
                    <tbody>
                      <tr
                        v-for="eq in equivalences"
                        :key="eq.region"
                        class="border-b border-gray-50 last:border-0"
                      >
                        <td class="py-2 text-xs font-bold pr-4">
                          {{ eq.region }}
                        </td>
                        <td
                          v-for="size in visibleTableSizes"
                          :key="size"
                          class="py-2 text-center text-xs"
                          :class="
                            selectedSize === size
                              ? 'font-bold'
                              : 'text-gray-400'
                          "
                        >
                          {{ getEquivalenceValue(eq, size) }}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </template>
            </BaseCollapsibleItem>
          </BaseCollapsible>
        </div>

        <!-- How to Measure -->
        <div class="mt-8">
          <h3 class="text-base font-medium mb-5">
            {{ $t('component.guidesize.how_to_measure') }}
          </h3>
          <div class="flex flex-col md:flex-row gap-10 items-start">
            <div
              class="w-full md:w-1/2 aspect-[3/4] bg-gray-100 relative overflow-hidden"
            >
              <img
                src="https://media.mango.com/is/image/punto/measurements_body_woman_waist_hip?wid=800"
                alt="Guide mesures"
                class="absolute inset-0 w-full h-full object-cover"
              />
            </div>
            <div class="w-full md:w-1/2">
              <ol class="space-y-8">
                <li class="flex flex-col gap-2">
                  <span class="text-sm font-bold">
                    1. {{ $t('component.guidesize.waist.title') }}
                  </span>
                  <p class="text-xs text-gray-600 leading-relaxed">
                    {{ $t('component.guidesize.waist.description') }}
                  </p>
                </li>
                <li class="flex flex-col gap-2">
                  <span class="text-sm font-bold">
                    2. {{ $t('component.guidesize.hip.title') }}
                  </span>
                  <p class="text-xs text-gray-600 leading-relaxed">
                    {{ $t('component.guidesize.hip.description') }}
                  </p>
                </li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </BaseDrawer>
  </div>
</template>

<style lang="scss">
.guidesize {
  @apply cursor-pointer;

  &-content {
    background: white;

    table {
      border-collapse: collapse;
      width: 100%;
    }

    th,
    td {
      white-space: nowrap;
    }
  }
}
</style>
