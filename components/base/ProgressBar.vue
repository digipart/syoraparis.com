<template>
  <div
    class="progress-bar-container"
    :style="{ backgroundColor: backgroundColor }"
  >
    <div
      class="progress-bar-fill"
      :style="{ width: progressWidth + '%', backgroundColor: color }"
    ></div>
  </div>
</template>

<script setup lang="ts">
import { computed, defineProps } from 'vue';

const props = defineProps<{
  progress: number;
  color?: string;
  backgroundColor?: string;
}>();

const progressWidth = computed(() =>
  Math.min(Math.max(props.progress, 0), 100)
);
const color = props.color || 'black'; // Default to green if no color prop is provided
const backgroundColor = props.backgroundColor || '#e0e0e0'; // Default light gray background
</script>

<style scoped>
.progress-bar-container {
  width: 100%;
  height: 8px;
  overflow: hidden;
}

.progress-bar-fill {
  height: 100%;
  transition: width 0.3s ease;
}
</style>
