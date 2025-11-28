// plugins/googleAuth.client.ts

import { gapi, loadGapiInsideDOM } from 'gapi-script';

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig();

  const initClient = () => {
    return new Promise((resolve, reject) => {
      gapi.load('auth2', () => {
        gapi.auth2
          .init({
            client_id: config.public.googleClientId,
          })
          .then(() => {
            resolve(gapi.auth2.getAuthInstance());
          })
          .catch((error: any) => {
            reject(error);
          });
      });
    });
  };

  return {
    provide: {
      googleAuth: {
        initClient,
        signIn() {
          return initClient().then((auth: any) => auth.signIn());
        },
        signOut() {
          return initClient().then((auth: any) => auth.signOut());
        },
        isSignedIn() {
          return initClient().then((auth: any) => auth.isSignedIn.get());
        },
        currentUser() {
          return initClient().then((auth: any) => auth.currentUser.get());
        },
      },
    },
  };
});
