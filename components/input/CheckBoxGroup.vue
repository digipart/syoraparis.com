<template>
  <div>
    <InputCheckBox
      v-for="(option, index) in options"
      :key="option.id"
      :id="option.id"
      :modelValue="selectedValues.includes(option.id)"
      @update:modelValue="(checked:any) => onCheckboxChange(option.id, checked)"
    >
      {{ option.label }}
    </InputCheckBox>
  </div>
</template>

<script setup lang="ts">
import type { ErrorObject } from '@vuelidate/core';
import { ref, defineProps, defineEmits } from 'vue';

interface Option {
  id: string;
  label: string;
}

const props = defineProps<{
  options: Option[];
  modelValue: string[];
  errors?: Record<string, ErrorObject[]>;
}>();
const emit = defineEmits(['update:modelValue']);

const selectedValues = ref([...props.modelValue]);

const onCheckboxChange = (id: string, checked: boolean) => {
  if (checked) {
    selectedValues.value.push(id);
  } else {
    selectedValues.value = selectedValues.value.filter((value) => value !== id);
  }
  emit('update:modelValue', selectedValues.value);
};
</script>
