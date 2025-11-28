<template>
  <div class="step-wizard">
    <!-- Step Indicators -->
    <div class="step-indicators flex items-center relative">
      <div
        class="step-line absolute top-1/2 w-full h-px bg-gray-300 -z-10"
      ></div>
      <div
        v-for="(step, index) in steps"
        :key="index"
        :class="[
          'step',
          {
            active: modelValue === index + 1,
            completed: index + 1 < modelValue,
          },
        ]"
        class="relative text-center flex-1"
      >
        <div
          :class="[
            'step-circle',
            modelValue === index + 1
              ? 'bg-blue-500 text-white'
              : 'bg-white border border-gray-300',
          ]"
        >
          {{ index + 1 }}
        </div>
        <div class="step-title mt-2 text-gray-600">
          {{ step.title }}
        </div>
      </div>
    </div>

    <!-- Step Content -->
    <div class="step-content my-6">
      <slot :currentStep="modelValue" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';

interface Step {
  title: string;
}

const props = defineProps<{
  steps: Step[];
  modelValue: number;
}>();
const emit = defineEmits(['update:modelValue', 'step-change', 'finish']);

// Navigate directly to a step
const goToStep = (step: number) => {
  emit('update:modelValue', step);
  emit('step-change', step);
};
</script>

<style scoped lang="scss">
.step-wizard {
  @apply w-full;
}

.step-indicators {
  @apply flex justify-between relative mb-8;
}

.step-line {
  @apply absolute top-5 h-px bg-gray-300 w-full;
  z-index: -1;
}

.step {
  @apply flex flex-col items-center flex-1;

  .step-circle {
    @apply w-10 h-10 rounded-full flex items-center justify-center font-bold relative z-10;
  }

  &.active .step-circle {
    @apply bg-white text-black border-black border;
  }

  &.completed .step-circle {
    @apply bg-primary text-white border-black;
  }

  .step-title {
    @apply mt-2 text-sm text-gray-600;
  }
}
</style>
