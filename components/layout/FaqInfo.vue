<script setup lang="ts">
const isVisible = ref(false);

const windowWidth = ref(typeof window !== 'undefined' ? window.innerWidth : 0);
</script>

<template>
  <div class="faqInfo">
    <div class="flex" @click="isVisible = true">
      <div class="mr-1">
        <IconPlus :size="1.4" />
      </div>
      <div class="flex flex-col text-xs font-normal pt-0.5">
        <span>{{ $t('component.faq.title') }}</span>
      </div>
    </div>
    <BaseModal
      v-model="isVisible"
      size="100%"
      :to="windowWidth > 991 ? '#pageProductInformations-teleport' : 'body'"
      :inside="windowWidth > 991"
    >
      <template #header>
        <span class="text-base uppercase font-medium">
          {{ $t('component.faq.title') }}
        </span>
      </template>
      <PerfectScrollbar class="faqInfo-body">
        <div class="cms">
          <h3>Free European Shipping</h3>
          <p>
            Plus, no import duties or customs charges/taxes to EU countries.
          </p>

          <br />

          <h3>Germany</h3>
          <p>DHL Paket (2-3 business days) - Free</p>
          <p>DHL Express (1-2 business days) - €20</p>

          <br />
          <h3>Netherlands</h3>
          <p>PostNL (1-2 working days) - Free</p>

          <br />
          <h3>Austria</h3>
          <p>Austria Post (3-4 business days) - Free</p>
          <p>DHL Express (1-2 business days) - €20</p>

          <br />
          <h3>Belgium</h3>
          <p>Bpost (1-2 business days) - Free</p>

          <br />
          <h3>Czech Republic</h3>
          <p>DPD Standard (2-4 business days) - Free</p>
          <p>DHL Express (1-2 business days) - €12</p>

          <br />
          <h3>France</h3>
          <p>Colissimo (2-3 business days) - Free</p>
          <p>DHL Express (1-2 business days) - €20</p>

          <br />
          <h3>EU Returns</h3>
          <p>
            Easy returns. If something is not quite right, you’ve got 14 days to
            send back your items for a full refund. All we ask is that items are
            in an unused, unaltered condition and returned with their tags and
            packaging.
          </p>
          <br />
          <h3>EU Returns</h3>
          <p>
            Easy returns. If something is not quite right, you’ve got 14 days to
            send back your items for a full refund. All we ask is that items are
            in an unused, unaltered condition and returned with their tags and
            packaging.
          </p>
          <br />
          <h3>EU Returns</h3>
          <p>
            Easy returns. If something is not quite right, you’ve got 14 days to
            send back your items for a full refund. All we ask is that items are
            in an unused, unaltered condition and returned with their tags and
            packaging.
          </p>
          <br />
          <h3>EU Returns</h3>
          <p>
            Easy returns. If something is not quite right, you’ve got 14 days to
            send back your items for a full refund. All we ask is that items are
            in an unused, unaltered condition and returned with their tags and
            packaging.
          </p>
        </div>
      </PerfectScrollbar>
    </BaseModal>
  </div>
</template>

<style lang="scss">
.faqInfo {
  @apply cursor-pointer;

  &-body {
    @apply w-full h-full;
  }
}
</style>

<style lang="scss">
// .modal {
//   @apply flex flex-col border border-black;

//   &-header {
//     @apply p-5 min-h-16;
//   }
//   &-body {
//     height: calc(100% - 4rem);
//     @apply bg-white p-5 pt-0;
//   }
// }
</style>
