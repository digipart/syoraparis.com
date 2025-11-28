<template>
  <span ref="titleWordRef" class="titleWord" :style="{ opacity: opacity }">{{
    currentWord
  }}</span>
</template>

<script setup lang="ts">
const { words } = defineProps({
  words: {
    type: Array as () => string[],
    default: () => [],
  },
});

let currentIndex = 0;

const currentWord = ref(words[currentIndex]);
const opacity = ref(1);

const titleWordRef = ref<HTMLElement | null>(null);

function changeWord() {
  if (currentWord.value) {
    if (titleWordRef.value) {
      titleWordRef.value.style.opacity = '0';
    }

    setTimeout(() => {
      currentIndex = (currentIndex + 1) % words.length;
      currentWord.value = words[currentIndex];
      if (titleWordRef.value) {
        titleWordRef.value.style.opacity = '1';
      }
    }, 500);
  }
}

let interval: number;

onMounted(() => {
  interval = window.setInterval(changeWord, 2000) as unknown as number;
});

onUnmounted(() => {
  clearInterval(interval);
});
</script>

<style scoped>
.titleWord {
  transition: opacity 0.5s;
}
</style>
