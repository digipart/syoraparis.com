<script setup lang="ts">
interface Item {
  label: string;
  value?: any;
  id?: any;
  selected?: boolean;
}

interface Props {
  items: Item[];
  title?: string;
  labelKey?: string;
  valueKey?: string;
  modelValue?: any; // Changed to array for multi-select
  maxDisplayValues?: number;
  search?: boolean; // New prop to enable/disable search
  multiple?: boolean; // New prop to enable/disable multi-select
}

const props = withDefaults(defineProps<Props>(), {
  labelKey: 'label',
  valueKey: 'value',
  maxDisplayValues: 2,
  modelValue: () => [], // Default to empty array
  search: true, // Search enabled by default
  multiple: true, // Multi-select enabled by default
});

const emit = defineEmits(['update:modelValue', 'change']);

const { t } = useI18n();

// State
const isOpen = ref(false);
const searchQuery = ref('');
const dropdownRef = ref<HTMLDivElement | null>(null);
const triggerRef = ref<HTMLDivElement | null>(null);
const openAtTop = ref(false);

// Computed
const filteredItems = computed(() => {
  return props.items.filter((item) =>
    String(item.label).toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

// Normalize item value to handle both id and value properties
const getItemValue = (item: Item): any => {
  return item.id !== undefined ? item.id : item.value;
};

const selectedLabels = computed(() => {
  const selected = props.items.filter((item) =>
    props.modelValue.includes(getItemValue(item))
  );
  if (selected.length === 0) return props.title || 'Select Items';

  if (selected.length <= props.maxDisplayValues) {
    return selected.map((item) => item.label).join(', ');
  }

  return `${selected
    .slice(0, 2)
    .map((item) => item.label)
    .join(', ')}, (+${selected.length - 2})`;
});

// Methods
const toggleDropdown = () => {
  isOpen.value = !isOpen.value;
  if (isOpen.value) {
    calculatePosition();
  }
};

const calculatePosition = () => {
  if (!triggerRef.value) return;

  const triggerRect = triggerRef.value.getBoundingClientRect();
  const windowHeight = window.innerHeight;
  const spaceBelow = windowHeight - triggerRect.bottom;
  const spaceAbove = triggerRect.top;

  openAtTop.value = spaceBelow < 300 && spaceAbove > spaceBelow;
};

const reset = () => {
  searchQuery.value = '';
  emit('update:modelValue', []);
  emit('change', []);
};

const selectItem = (item: Item) => {
  const itemValue = getItemValue(item);
  
  if (props.multiple) {
    // Multi-select logic
    const newSelection = [...props.modelValue];
    const index = newSelection.indexOf(itemValue);

    if (index === -1) {
      newSelection.push(itemValue);
    } else {
      newSelection.splice(index, 1);
    }

    emit('update:modelValue', newSelection);
    emit(
      'change',
      props.items.filter((item) => newSelection.includes(getItemValue(item)))
    );
  } else {
    // Single select logic
    emit('update:modelValue', [itemValue]);
    // For single select, pass just the value to make it easier to use
    emit('change', itemValue);
    isOpen.value = false;
  }
};

const isSelected = (item: Item): boolean => {
  return props.modelValue.includes(getItemValue(item));
};

const handleClickOutside = (event: MouseEvent) => {
  if (
    dropdownRef.value &&
    !dropdownRef.value.contains(event.target as Node) &&
    !triggerRef.value?.contains(event.target as Node)
  ) {
    isOpen.value = false;
  }
};

// Lifecycle
onMounted(() => {
  document.addEventListener('click', handleClickOutside);
  window.addEventListener('scroll', calculatePosition);
  window.addEventListener('resize', calculatePosition);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
  window.removeEventListener('scroll', calculatePosition);
  window.removeEventListener('resize', calculatePosition);
});
</script>

<template>
  <div class="relative text-sm">
    <!-- Trigger -->
    <div
      ref="triggerRef"
      @click="toggleDropdown"
      class="cursor-pointer border border-black p-2 flex justify-between items-center bg-white"
    >
      <span class="truncate">{{ selectedLabels }}</span>
      <span class="transform" :class="{ 'rotate-180': isOpen }">
        <IconChevronDown :size="1.2" />
      </span>
    </div>

    <!-- Dropdown -->
    <div
      v-if="isOpen"
      ref="dropdownRef"
      :class="{
        'bottom-full mb-1': openAtTop,
        'top-full mt-1': !openAtTop,
      }"
      class="absolute left-0 bg-white border border-black w-full shadow-lg z-50"
    >
      <!-- Search and Reset (Conditional) -->
      <div v-if="search" class="p-3 border-b border-black flex gap-3">
        <input
          v-model="searchQuery"
          type="text"
          :placeholder="t('label.search')"
          class="w-full h-11 p-2 border border-black"
        />
        <BaseButton
          size="medium"
          @click="reset"
          class="w-12"
          type="primary"
          plain
        >
          <IconRefresh :size="2" />
        </BaseButton>
      </div>

      <!-- Items List -->
      <div class="max-h-60 overflow-y-auto bg-gray-100">
        <div class="flex flex-col gap-3 p-2">
          <div
            v-for="item in filteredItems"
            :key="item.value"
            @click="selectItem(item)"
            class="p-3 hover:bg-black hover:text-white duration-150 cursor-pointer flex items-center bg-white border"
            :class="{ 'border-black': isSelected(item) }"
          >
            <span>{{ item.label }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.transform {
  transition: transform 0.2s;
}
</style>
