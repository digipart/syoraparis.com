<template>
  <div class="inputRange">
    <!-- Label Section -->
    <div class="mb-2 flex items-center justify-between">
      <label v-if="label" :for="id" class="text-sm font-medium text-gray-700">
        {{ label }}
      </label>
    </div>

    <!-- Slider Section -->
    <Slider
      :id="id"
      v-model="localValue"
      v-bind="$attrs"
      :min="min"
      :max="max"
      :step="step"
      :tooltips="tooltips"
      :format="format"
      class="inputRange__input"
      @update:model-value="handleUpdate"
    />

    <span v-if="showValue" class="flex justify-center text-xs mt-2">
      {{ displayValue }}
    </span>
    <!-- Optional Help Text -->
    <p v-if="helpText" class="mt-2 text-sm text-gray-500">
      {{ helpText }}
    </p>
  </div>
</template>

<script setup lang="ts">
interface Props {
  modelValue: number | number[];
  label?: string;
  min?: number;
  max?: number;
  step?: number;
  tooltips?: boolean | boolean[];
  showValue?: boolean;
  helpText?: string;
  suffix?: string;
  id?: string;
  format?: {
    prefix?: string;
    suffix?: string;
    decimals?: number;
  };
}

const props = withDefaults(defineProps<Props>(), {
  min: 0,
  max: 100,
  step: 1,
  tooltips: true,
  showValue: true,
  id: () => `slider-${Math.random().toString(36).substr(2, 9)}`,
  format: () => ({ decimals: 0 }),
});

const emit = defineEmits(['update:modelValue']);

const localValue = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
});

const displayValue = computed(() => {
  const value = props.modelValue;
  const formatValue = (num: number) => {
    const formatted = Number(num).toFixed(props.format.decimals);
    return `${props.format.prefix || ''}${formatted}${
      props.format.suffix || ''
    }`;
  };

  return Array.isArray(value)
    ? `${formatValue(value[0])} - ${formatValue(value[1])}`
    : formatValue(value);
});

const handleUpdate = (value: number | number[]) => {
  emit('update:modelValue', value);
};
</script>

<!-- <style lang="scss">
.inputRange__input .slider-connect {
  background-color: #00dc82; /* Nuxt green, you can change this */
}

.inputRange__input .slider-tooltip {
  background-color: #00dc82;
  border-color: #00dc82;
  color: white;
  font-size: 0.875rem;
  padding: 2px 6px;
  border-radius: 4px;
}

.inputRange__input .slider-handle {
  border-color: #00dc82;
}

/* Optional: Add focus styles */
.inputRange__input .slider-handle:focus {
  box-shadow: 0 0 0 3px rgba(0, 220, 130, 0.2);
}
</style> -->

<style lang="scss">
.inputRange {
  --slider-tooltip-bg: var(--color-primary);
  --slider-connect-bg: var(--color-primary);
  --slider-tooltip-radius: 0px;
  --slider-height: 4px;
  --slider-tooltip-font-size: 12px;
  --slider-tooltip-font-weight: 400;
}
</style>
