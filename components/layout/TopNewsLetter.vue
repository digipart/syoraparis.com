<template>
  <Transition
    enter-active-class="transition-all duration-300 ease-out"
    enter-from-class="translate-x-full opacity-0"
    enter-to-class="translate-x-0 opacity-100"
    leave-active-class="transition-all duration-300 ease-in"
    leave-from-class="translate-x-0 opacity-100"
    leave-to-class="translate-x-full opacity-0"
  >
    <div v-if="newsletterVisible" class="topNewsletter">
      <BaseButton
        @click="close"
        class="topNewsletter-close"
        size="small"
        icon
        :title="$t('button.close')"
        aria-label="Close newsletter popup"
        type="white"
      >
        <IconX />
      </BaseButton>

      <!-- Progress steps -->
      <div class="topNewsletter-steps">
        <div
          v-for="i in 2"
          :key="i"
          :class="[
            'topNewsletter-step',
            { 'topNewsletter-step--active': step === i },
          ]"
        ></div>
      </div>

      <!-- Step 1: Newsletter Form -->
      <Transition name="fade" mode="out-in">
        <div v-if="step === 1" class="topNewsletter-content">
          <h2 class="topNewsletter-title">
            {{ $t('component.newsletter_popup.title') }}
          </h2>
          <FormNewsLetter @onSubmitSuccess="submit" />
        </div>

        <!-- Step 2: Thank You Message -->
        <div v-else class="topNewsletter-content">
          <h2 class="topNewsletter-title topNewsletter-title--success">
            {{ $t('component.newsletter_popup.thank') }}
          </h2>
          <p class="topNewsletter-description">
            {{ $t('component.newsletter_popup.info') }}
          </p>
        </div>
      </Transition>
    </div>
  </Transition>
</template>

<script setup lang="ts">
const newsletterPopUpStore = useNewsletterPopUpStore();
const { closeNewsletterPopUp } = newsletterPopUpStore;
const { newsletterVisible } = storeToRefs(newsletterPopUpStore);

const step = ref(1);
let closeTimeout: NodeJS.Timeout;

// Close popup handler
const close = () => {
  if (closeTimeout) {
    clearTimeout(closeTimeout);
  }
  closeNewsletterPopUp();
};

// Submit success handler
const submit = () => {
  step.value = 2;

  // Close after 5 seconds
  closeTimeout = setTimeout(() => {
    closeNewsletterPopUp();
  }, 5000);
};

// Clean up on component unmount
onUnmounted(() => {
  if (closeTimeout) {
    clearTimeout(closeTimeout);
  }
});
</script>

<style lang="scss">
.topNewsletter {
  @apply fixed bottom-10 right-10 z-50
      bg-white shadow-lg
      w-full max-w-[420px] p-6 
      border border-black;

  @screen mdMax {
    @apply right-5 bottom-5;
    max-width: calc(100% - 40px);
  }

  &-close {
    @apply absolute -top-3 -right-3 
        bg-white 
        hover:bg-gray-50 !border !border-black
        transition-colors;
  }

  &-steps {
    @apply flex gap-2 mb-4;
  }

  &-step {
    @apply h-1 flex-1 bg-gray-200 
        transition-colors duration-300;

    &--active {
      @apply bg-primary;
    }
  }

  &-content {
    @apply relative;
  }

  &-title {
    @apply text-sm font-medium mb-4;

    &--success {
      @apply text-base uppercase;
    }
  }

  &-description {
    @apply text-sm text-gray-600;
  }
}
</style>
