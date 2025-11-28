<script setup lang="ts">
const props = defineProps<{
  name: string;
  label: string;
}>();

const { addTab, removeTab, activeTab } = inject('tabs') as {
  addTab: (tab: { name: string; label: string }) => void;
  removeTab: (name: string) => void;
  activeTab: Ref<string | null>;
};

onMounted(() => addTab({ name: props.name, label: props.label }));
onUnmounted(() => removeTab(props.name));
</script>

<template>
  <div v-show="activeTab === name">
    <slot></slot>
  </div>
</template>
