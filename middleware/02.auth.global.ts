export default defineNuxtRouteMiddleware(async (to, from) => {
  const ignoreAuth = to.meta.ignoreAuth;
  if (ignoreAuth) {
    return;
  }
  const auth = useAuth();
  const { isLoggedIn, isGuest, token } = toRefs(auth);
  const { refresh } = auth;
  const localePath = useLocalePath();
  // Check if route requires authentication

  const requiresAuth = to.meta.requireAuth;

  // Check if route is for guests only
  const guestOnly = to.meta.guestOnly;

  // Redirect authenticated users from guest routes

  try {
    await refresh();
  } catch (error) {}

  
  if (guestOnly && token.value) {
    return navigateTo(localePath({ name: 'account-profil' }));
  }

  // Redirect unauthenticated users from protected routes
  if (requiresAuth && !token.value) {
    return navigateTo(localePath({ name: 'account-login' }));
  }
});
