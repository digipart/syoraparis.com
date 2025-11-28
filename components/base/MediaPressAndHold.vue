<template>
  <div class="mediaPressAndHold">
    <div
      @touchstart="onTouchStart"
      @touchmove="onTouchMove"
      @touchend="onTouchEnd"
      @touchcancel="onTouchCancel"
      @click="onClick"
      @contextmenu.prevent
    >
      <slot />
    </div>
    <Teleport to="body">
      <Transition name="fade">
        <div v-if="showMedia" class="mediaPressAndHold-media">
          <NuxtImg v-if="type === 'image'" class="max-w-full" :src="src" />
          <video
            v-else-if="type === 'video'"
            class="max-w-full"
            :src="src"
            autoplay
            loop
            muted
          />
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { setHtmlStyle } from '~/utils/document';

const props = defineProps({
  src: {
    type: String,
    required: true,
  },
  type: {
    type: String as () => 'image' | 'video',
    default: 'image',
  },
});

const emit = defineEmits(['click', 'onHold']);

const toggleBlurTo__nuxt = () => {
  if (typeof window !== 'undefined') {
    const element = document.getElementById('__nuxt');
    if (element) {
      element.classList.toggle('blur');
    }
  }
};

const showMedia = ref(false);

let touchTimer: ReturnType<typeof setTimeout> | null = null;
let isLongPress = false;
let isTouch = false;
let touchStartY = 0;
let isMoved = false;

const onTouchStart = (event: TouchEvent) => {
  isTouch = true;
  isLongPress = false;
  isMoved = false;
  touchStartY = event.touches[0].clientY;
  touchTimer = setTimeout(() => {
    if (!isMoved) {
      isLongPress = true;
      showMedia.value = true;
      setHtmlStyle({
        overflow: 'hidden',
      });

      emit('onHold', event);

      toggleBlurTo__nuxt();
    }
  }, 500);
};

const onTouchMove = (event: TouchEvent) => {
  if (Math.abs(event.touches[0].clientY - touchStartY) > 10) {
    isMoved = true;
    if (touchTimer) clearTimeout(touchTimer);
  }
};

const onTouchEnd = () => {
  if (touchTimer) clearTimeout(touchTimer);
  if (isLongPress) {
    showMedia.value = false;
    setHtmlStyle({
      overflow: '',
    });
    toggleBlurTo__nuxt();
  }
  // Reset isTouch after a short delay
  setTimeout(() => {
    isTouch = false;
  }, 0);
};

const onTouchCancel = () => {
  if (touchTimer) clearTimeout(touchTimer);
  showMedia.value = false;
  setHtmlStyle({
    overflow: '',
  });
  toggleBlurTo__nuxt();
  isTouch = false;
};

const onClick = (event: MouseEvent) => {
  if (!isTouch) {
    emit('click', event);
  }
};
</script>

<style lang="scss">
#__nuxt {
  transition-duration: 0.3s;
  &.blur {
    filter: blur(5px);
  }
}
</style>

<style scoped>
.mediaPressAndHold-media {
  @apply fixed top-0 right-0 bottom-0 left-0 z-[1000]
    pointer-events-none
    flex justify-center items-center
    p-5;
}

.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: scale(0.7);
}
</style>
