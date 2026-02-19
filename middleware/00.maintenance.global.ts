export default defineNuxtRouteMiddleware((to, from) => {
  const config = useRuntimeConfig();
  // Check if maintenance mode is enabled (supports 'true', true, 'enabled')
  const maintenance = config.public.maintenance;
  const isMaintenance =
    maintenance === 'true' || maintenance === true || maintenance === 'enabled';

  const localePath = useLocalePath();

  // Get the maintenance page path for the current locale
  // We use try-catch or simple check because localePath might return empty string if route not found
  const maintenanceRoute = localePath('maintenance');

  if (isMaintenance) {
    // If maintenance is on, and we are NOT on the maintenance page, redirect to it.
    // We check to.path against the maintenance route path.
    if (maintenanceRoute && to.path !== maintenanceRoute) {
      return navigateTo(maintenanceRoute);
    }
  } else {
    // If maintenance is off, and we ARE on the maintenance page, redirect to home.
    if (maintenanceRoute && to.path === maintenanceRoute) {
      return navigateTo(localePath('index'));
    }
  }
});
