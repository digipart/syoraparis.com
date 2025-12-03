<template>
  <div
    class="inputRadio"
    :class="{
      error: errors?.length,
      checked: modelValue == value,
    }"
  >
    <input
      :id="id"
      type="radio"
      :value="value"
      @change="onChange($event)"
      :disabled="disabled"
      :required="required"
      :checked="modelValue == value"
    />

    <label :for="id" class="inputRadio-label">
      <span class="inputRadio-span">
        <!-- <IconCheck color="white" :size="1" /> -->
      </span>
      <slot />
    </label>

    <div class="inputRadio-error" v-if="errors">
      <span v-for="error in errors" :key="error.$uid">
        {{ error.$message }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import type { ErrorObject } from '@vuelidate/core';

interface Props {
  id?: string;
  modelValue: string | number;
  value: string | number;
  disabled?: boolean;
  required?: boolean;
  errors?: ErrorObject[];
}

const props = defineProps<Props>();
const emit = defineEmits(['update:modelValue']);

const isFocused = ref(false);

const onChange = (event: Event) => {
  const input = event.target as HTMLInputElement;

  emit('update:modelValue', input.value);
};
</script>

<style lang="scss">
$inputRadio: '.inputRadio';

#{$inputRadio} {
  @apply relative font-light cursor-pointer;

  input {
    @apply absolute opacity-0;
    &:checked {
      ~ #{$inputRadio} {
        &-label {
          > span {
            @apply bg-black;
            &::after {
              @apply border-white;
            }
          }
        }
      }
    }
  }

  &-span {
    @apply inline-block bg-transparent relative h-4 w-4 rounded-full duration-150 translate-y-0.5 mr-2;

    &::after {
      content: '';
      @apply absolute border border-black left-[1px] top-[1px] duration-150 rounded-full;
      height: calc(100% - 2px);
      width: calc(100% - 2px);
    }

    .icon {
      @apply absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2;
    }
  }

  &.error {
    input {
      @apply border-red-500;
    }
  }

  &-label {
    @apply text-sm cursor-pointer;
  }

  &-error {
    @apply absolute bottom-0 translate-y-full normal-case;
    span {
      @apply text-red-500 text-xxs flex flex-col;
    }
  }
}
</style>
