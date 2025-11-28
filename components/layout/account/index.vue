<script setup lang="ts"></script>

<template>
  <LayoutContainer full class="mt-8 mb-8">
    <LayoutAccountMenu class="mb-5" />
    <slot></slot>
  </LayoutContainer>
</template>

<style lang="scss">
$accountLayout: '.accountLayout';

#{$accountLayout} {
}
</style>
