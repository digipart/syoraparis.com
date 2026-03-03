<script setup lang="ts">
import type { ErrorObject } from '@vuelidate/core';

const { locale } = useI18n();

interface Props {
  id: string;
  modelValue: string;
  type?:
    | 'text'
    | 'password'
    | 'email'
    | 'tel'
    | 'date'
    | 'datepicker'
    | 'textarea';
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  errors?: ErrorObject[];
  border?: boolean;
  minLength?: number;
  maxLength?: number;
}

const props = defineProps<Props>();
const emit = defineEmits(['update:modelValue', 'input']);

const inputType = ref(props.type);

// datepicker
const inputDateValue = ref(props.modelValue);
const updateDateValue = (value: any) => {
  emit('update:modelValue', formatDateValue(value));
};
const format = (date: Date) => {
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();

  if (locale.value === 'fr') {
    return `${day}/${month}/${year}`;
  } else {
    return `${month}/${day}/${year}`;
  }
};
const formatDateValue = (date: Date) => {
  if (date) {
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    return `${year}-${month}-${day}`;
  }
  return '';
};
const flow = ref(['month', 'year', 'calendar']);
// datepicker

const isFocused = ref(false);

const onInput = (event: Event) => {
  const target = event.target as HTMLInputElement;
  emit('update:modelValue', target.value);
  emit('input', event);
};

const onFocus = () => {
  isFocused.value = true;
};

const onBlur = () => {
  isFocused.value = false;
};
</script>

<template>
  <div
    class="inputText"
    :class="{
      'inputText--focused': isFocused || modelValue || type === 'date',
      error: errors?.length,
      required: required,
      'inputText--border': border,
      'inputText--icon': $slots.icon,
    }"
  >
    <span class="inputText--icon-icon" v-if="$slots.icon">
      <slot name="icon" />
    </span>
    <label v-if="label" :for="id" class="inputText-label">{{ label }}</label>

    <VueDatePicker
      v-if="type === 'datepicker'"
      v-model="inputDateValue"
      :id="id"
      v-bind="$attrs"
      @update:modelValue="updateDateValue"
      hide-input-icon
      :locale="locale"
      :format="format"
      :flow="flow"
    ></VueDatePicker>

    <textarea
      v-else-if="type === 'textarea'"
      :id="id"
      :type="inputType"
      :value="modelValue"
      @input="onInput"
      @focus="onFocus"
      @blur="onBlur"
      :placeholder="isFocused || modelValue ? '' : placeholder"
      :disabled="disabled"
      rows="5"
      :minlength="minLength"
      :maxlength="maxLength"
    ></textarea>
    <input
      v-else
      :id="id"
      :type="inputType"
      :value="modelValue"
      @input="onInput"
      @focus="onFocus"
      @blur="onBlur"
      :placeholder="isFocused || modelValue ? '' : placeholder"
      :disabled="disabled"
      :minlength="minLength"
      :maxlength="maxLength"
    />
    <div class="inputText-error" v-if="errors">
      <span v-for="error in errors" :key="error.$uid">
        {{ error.$message }}
      </span>
    </div>
    <span
      v-if="type === 'password'"
      class="inputText-eye"
      @click="inputType = inputType === 'text' ? 'password' : 'text'"
    >
      <IconEyeNo :size="1.6" v-if="inputType === 'text'" />
      <IconEye :size="1.6" v-else />
    </span>
  </div>
</template>

<style lang="scss">
$inputText: '.inputText';

#{$inputText} {
  @apply w-full relative mb-5 font-light uppercase;

  input,
  textarea {
    // width: 100%;
    // padding: 10px 10px 10px 10px;
    // font-size: 16px;
    // border: 1px solid #ccc;
    // border-radius: 4px;
    @apply border-b border-gray-bbb w-full text-xs pt-3 pb-1.5;

    &:focus {
      outline: none;
      @apply border-primary;
    }
  }

  &.error {
    input,
    textarea {
      @apply border-red-500;
    }
  }

  &-label {
    @apply absolute top-2.5 left-0  z-[1]
    duration-200 ease-linear transition-all 
    pointer-events-none text-xs text-gray-777 font-light;
  }

  &-eye {
    @apply absolute right-2 top-1.5;
  }

  &--focused {
    #{$inputText}-label,
    & input:not(:placeholder-shown) + #{$inputText}-label {
      @apply top-0 text-xxs left-0;
    }

    input,
    textarea {
      @apply border-primary;
    }
  }

  &--border {
    @apply bg-white;
    input,
    textarea {
      @apply border border-gray-888
      px-3  pb-1.5 pt-4 text-sm;
    }
    #{$inputText} {
      &-label {
        @apply left-3 top-3.5;
      }
    }
    &.inputText--focused {
      #{$inputText}-label,
      & input:not(:placeholder-shown) + #{$inputText}-label {
        @apply top-[7px] text-xxs text-zinc-500;
      }
    }
  }
  &--icon {
    input,
    textarea {
      @apply pl-10;
    }
    &-icon {
      @apply absolute top-1/2 -translate-y-1/2 left-3 pointer-events-none;
    }
  }

  &-error {
    @apply absolute -bottom-0.5 left-0 translate-y-full normal-case;
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
