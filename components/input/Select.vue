<template>
  <div
    class="v-select v-select-input"
    :class="{
      'v-select--focused': isFocused || internalValue,
      error: errors?.length,
      required: required,
      'v-select--border': border,
    }"
  >
    <v-select
      :id="id"
      v-model="internalValue"
      :options="selectOptions"
      @focus="onFocus"
      @blur="onBlur"
      :disabled="disabled"
      :required="required"
      :placeholder="placeholder"
      :reduce="(option:any) => option.value"
      class="v-select-input"
      :multiple="multiple"
      :searchable="searchable"
    />
    <label v-if="label" :for="id" class="v-select-label">{{ label }}</label>
    <div class="v-select-error" v-if="errors">
      <span v-for="error in errors" :key="error.$uid">
        {{ error.$message }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import type { ErrorObject } from '@vuelidate/core';

interface Props {
  id: string;
  modelValue: string | number | (string | number)[];
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  multiple?: boolean;
  searchable?: boolean;
  errors?: ErrorObject[];
  selectOptions: {
    label: string | undefined;
    value: string | number | undefined;
  }[];
  border?: boolean;
}

const props = defineProps<Props>();
const emit = defineEmits(['update:modelValue', 'change']);

const isFocused = ref(false);
const internalValue = ref(props.modelValue);

const onFocus = () => {
  isFocused.value = true;
};

const onBlur = () => {
  isFocused.value = false;
};

watch(internalValue, (newValue) => {
  emit('change', newValue);
  emit('update:modelValue', newValue);
});
</script>

<style lang="scss">
.v-select-input {
  &.v-select {
    border-top-width: 0 !important;
    border-right-width: 0 !important;
    border-left-width: 0 !important;

    @apply w-full  relative mb-5 font-light uppercase border-b border-gray-bbb pt-3 pb-1.5;

    .v-select-input {
      @apply w-full text-xs pt-0 pb-0;

      &:focus {
        outline: none;
        @apply border-primary;
      }
    }
    .vs__search,
    .vs__search:focus {
      @apply p-0 m-0;
    }
    .vs__selected {
      padding: 0;
      margin: 0;
    }
    .v-select-input {
      @apply mb-0 border-0;
    }

    &.error {
      .v-select-input {
        @apply border-red-500;
      }
    }

    .v-select-label {
      @apply absolute top-1/2 left-0 -translate-y-1/2
      duration-200 ease-linear transition-all
      pointer-events-none text-xs text-gray-777 font-light block;
    }

    &--focused,
    &.vs--searching {
      .v-select-label,
      & .v-select-input:not(:placeholder-shown) + .v-select-label,
      & ~ .v-select-label {
        @apply top-0 text-xxs left-0 text-primary;
      }

      .v-select-input {
        @apply border-primary;
      }
    }
    &--border {
      @apply bg-white border-gray-888 border pr-3 pl-[8px]  pb-1.5 pt-4 text-sm;
      border-top-width: 1px !important;
      border-right-width: 1px !important;
      border-left-width: 1px !important;

      .v-select-label {
        @apply left-3 top-[22px];
      }

      &.v-select--focused {
        .v-select-label,
        & .v-select-input:not(:placeholder-shown) + .v-select-label,
        & ~ .v-select-label {
          @apply top-[11px] left-3 text-xxs text-zinc-500;
        }
      }

      .vs__dropdown-toggle {
        padding-bottom: 0.1px
      }
      .vs__actions {
        @apply -translate-y-1.5
      }
    }
  }
}
.v-select {
  &-error {
    @apply absolute bottom-0 translate-y-full normal-case;
    span {
      @apply text-red-500 text-xxs flex flex-col;
    }
  }
  &.required {
    label::after {
      content: ' * ';
    }
  }
}
</style>
