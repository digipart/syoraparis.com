<template>
  <div class="input-number">
    <BaseButton
      icon
      @click="decrement"
      size="small"
      :disabled="modelValue <= min"
    >
      <IconMinus :size="1.1" :color="modelValue >= max ? '#cccccc' : 'black'" />
    </BaseButton>
    <input
      :value="internalValue"
      @input="onInput"
      :min="min"
      :max="max"
      readonly
    />
    <BaseButton
      icon
      @click="increment"
      size="small"
      :disabled="modelValue >= max || readOnly"
    >
      <IconPlus :size="1.3" :color="modelValue >= max ? '#cccccc' : 'black'" />
    </BaseButton>
  </div>
</template>

<script setup lang="ts">
// Define props
const { modelValue, min, max } = defineProps({
  modelValue: {
    type: Number,
    default: 0,
  },
  min: {
    type: Number,
    default: -Infinity,
  },
  max: {
    type: Number,
    default: Infinity,
  },
  readOnly: {
    type: Boolean,
    default: false,
  },
});

// Define emits
const emit = defineEmits<{
  (e: 'update:modelValue', value: number): void;
  (e: 'change', value: number): void;
}>();

// Internal value state
const internalValue = ref(modelValue);

// Watch for prop changes to sync internal value
watch(
  () => modelValue,
  (newValue) => {
    internalValue.value = newValue;
  }
);

// Handle input event
const onInput = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const value = parseFloat(target.value);
  if (!isNaN(value) && value >= min && value <= max) {
    internalValue.value = value;
    emit('update:modelValue', value);
  }
};

// Increment and decrement functions
const increment = () => {
  if (internalValue.value < max) {
    internalValue.value++;
    emit('update:modelValue', internalValue.value);
    emit('change', internalValue.value);
  }
};

const decrement = () => {
  if (internalValue.value > min) {
    internalValue.value--;
    emit('update:modelValue', internalValue.value);
    emit('change', internalValue.value);
  }
};
</script>

<style scoped lang="scss">
.input-number {
  @apply flex items-center max-w-28 border;
}

input {
  @apply text-sm w-12 text-center flex-1;
}
</style>
