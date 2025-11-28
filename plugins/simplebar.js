import SimpleBar from 'simplebar-vue';
import 'simplebar-vue/dist/simplebar.min.css';

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.component('SimpleBar', SimpleBar);
});
