export default defineNuxtRouteMiddleware((to, from) => {
  const runtimeConfig = useRuntimeConfig();
  const localePath = useLocalePath();

  if (runtimeConfig.public.appLoyalty !== 'enabled') {
    const router = useRouter();
    return router.push(localePath({ name: '404' })); // Replace with your 404 route if it's custom
  }
});
