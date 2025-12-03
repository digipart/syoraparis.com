<template>
  <div
    class="inputCheckbox"
    :class="{ error: errors?.length, switch: props.switch }"
  >
    <input
      :id="id"
      type="checkbox"
      :value="value"
      @change="onChange($event)"
      :disabled="disabled"
      :required="required"
      :name="name"
      :checked="isChecked"
    />

    <label :for="id" class="inputCheckbox-label">
      <span class="inputCheckbox-span">
      </span>
      <div class="flex-1">
        <slot />
      </div>
    </label>

    <div class="inputCheckbox-error" v-if="errors">
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
  id: string;
  name?: string;
  switch?: boolean;
  modelValue: string[] | boolean;
  value?: string | number | boolean;
  disabled?: boolean;
  required?: boolean;
  errors?: ErrorObject[];
  group?: boolean;
}

const props = defineProps<Props>();
const emit = defineEmits(['update:modelValue']);

const isFocused = ref(false);

const isChecked = computed(() => {
  if (props.group) {
    return (
      (props.modelValue as string[]).indexOf((props.value as string) || '') !==
      -1
    );
  } else {
    return props.modelValue as boolean;
  }
});

const onChange = (event: Event) => {
  const input = event.target as HTMLInputElement;

  if (props.group) {
    if (Array.isArray(props.modelValue)) {
      const index = props.modelValue.indexOf(input.value);
      if (index > -1) {
        props.modelValue.splice(index, 1);
      } else {
        props.modelValue.push(input.value);
      }

      emit('update:modelValue', props.modelValue);
    }
  } else {
    emit('update:modelValue', input.checked);
  }
};
</script>

<style scoped lang="scss">
$inputCheckbox: '.inputCheckbox';

#{$inputCheckbox} {
  @apply w-full relative font-light cursor-pointer;

  input {
    @apply absolute opacity-0;
    &:checked {
      ~ #{$inputCheckbox} {
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
    @apply inline-block bg-transparent relative h-4 w-4 duration-150  translate-y-0.5 mr-2;

    &::after {
      content: '';
      @apply absolute border border-black left-[1px] top-[1px] duration-150;
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
    @apply text-sm cursor-pointer flex;
  }

  &-error {
    @apply absolute bottom-0 translate-y-full normal-case;
    span {
      @apply text-red-500 text-xxs flex flex-col;
    }
  }

  &.switch {
    #{$inputCheckbox} {
      &-span {
        @apply border border-black rounded-full w-8 h-4;

        &:after {
          @apply rounded-full w-5 h-5 top-[-3px] left-[-3px] bg-white duration-150;
        }
      }
    }
    input {
      @apply absolute opacity-0;
      &:checked {
        ~ #{$inputCheckbox} {
          &-label {
            > span {
              @apply bg-black;
              &::after {
                @apply border-black left-[calc(100%_+_3px)] -translate-x-full;
              }
            }
          }
        }
      }
    }
  }
}
</style>
