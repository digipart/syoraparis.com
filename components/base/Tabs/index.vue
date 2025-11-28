<script setup lang="ts">
const props = defineProps<{
  defaultTab?: string;
}>();

type tabType = {
  name: string;
  label: string;
};

const tabs = ref<tabType[]>([]);
const activeTab = ref<string | null>(null);

const addTab = (tab: { name: string; label: string }) => {
  tabs.value.push(tab);
  if (tabs.value.length === 1 || name === props.defaultTab) {
    activeTab.value = tab.name;
  }
};

const removeTab = (name: string) => {
  const index = tabs.value.findIndex((t) => t.name === name);
  if (index !== -1) {
    tabs.value.splice(index, 1);
    if (activeTab.value === name) {
      if (tabs.value.length) {
        activeTab.value = tabs.value[0].name || null;
      }
    }
  }
};

const switchTab = (name: string) => {
  activeTab.value = name;
};

provide('tabs', { tabs, activeTab, addTab, removeTab, switchTab });
</script>

<template>
  <div class="tabs-component">
    <ul class="tab-list">
      <li
        v-for="tab in tabs"
        :key="tab.name"
        @click="switchTab(tab.name)"
        :class="{ active: activeTab === tab.name }"
      >
        {{ tab.label }}
      </li>
    </ul>
    <div class="tab-content">
      <slot></slot>
    </div>
  </div>
</template>

<style lang="scss">
.tabs-component {
  width: 100%;
  @apply w-full flex flex-col;
}

.tab-list {
  @apply flex border-b border-black;

  li {
    @apply px-4 py-3 cursor-pointer border-r border-black flex-1
    text-center uppercase text-sm;

    &:last-child {
      @apply border-r-0;
    }

    &.active {
      @apply font-medium;
    }
  }
}

.tab-content {
  @apply flex-1;
}
</style>
