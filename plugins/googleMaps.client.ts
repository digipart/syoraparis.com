export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig();

  const appStore = useAppStore();
  const { languageIsoCode } = toRefs(appStore);

  const script = document.createElement('script');
  script.src = `https://maps.googleapis.com/maps/api/js?key=${config.public.googleMapKey}&libraries=places&language=${languageIsoCode.value}`;
  script.async = true;
  script.defer = true;
  document.head.appendChild(script);
});
