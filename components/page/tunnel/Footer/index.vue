<template>
  <footer class="pageTunnelFooter">
    <ul class="flex flex-wrap gap-x-3 gap-y-1">
      <li>
        <PageTunnelFooterLegalNotice />
      </li>
      <li>
        <PageTunnelFooterPrivacyPolicy />
      </li>
      <li>
        <PageTunnelFooterTermsAndConditions />
      </li>
      <li>
        <PageTunnelFooterContactUs />
      </li>
    </ul>
  </footer>
</template>

<script setup></script>

<style lang="scss" scoped>
.pageTunnelFooter {
  @apply mt-10;
}
</style>
