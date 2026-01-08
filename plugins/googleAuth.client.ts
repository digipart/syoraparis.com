// plugins/googleAuth.client.ts

type GoogleProfile = {
  sub: string;
  email: string;
  given_name?: string;
  family_name?: string;
  picture?: string;
};

type GoogleTokenResponse = {
  access_token?: string;
  error?: string;
  error_description?: string;
};

type GoogleTokenClient = {
  callback: (response: GoogleTokenResponse) => void;
  requestAccessToken: (options?: { prompt?: string }) => void;
};

type GoogleIdentityServices = {
  accounts: {
    oauth2: {
      initTokenClient: (options: {
        client_id: string;
        scope: string;
        callback: (response: GoogleTokenResponse) => void;
      }) => GoogleTokenClient;
      revoke: (token: string, callback?: () => void) => void;
    };
  };
};

type GoogleWindow = Window & typeof globalThis & { google?: GoogleIdentityServices };

const GOOGLE_SCRIPT_SRC = 'https://accounts.google.com/gsi/client';

const loadGoogleScript = () => {
  if (process.server) {
    return Promise.resolve();
  }

  const existingScript = document.querySelector<HTMLScriptElement>(
    `script[src="${GOOGLE_SCRIPT_SRC}"]`
  );

  if (existingScript) {
    return new Promise<void>((resolve, reject) => {
      const existingGoogle = (window as GoogleWindow).google;
      if (existingGoogle) {
        resolve();
        return;
      }
      existingScript.addEventListener('load', () => resolve());
      existingScript.addEventListener('error', () =>
        reject(new Error('Failed to load Google Identity Services script'))
      );
    });
  }

  return new Promise<void>((resolve, reject) => {
    const script = document.createElement('script');
    script.src = GOOGLE_SCRIPT_SRC;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () =>
      reject(new Error('Failed to load Google Identity Services script'));
    document.head.appendChild(script);
  });
};

const getGoogle = (): GoogleIdentityServices => {
  const google = (window as GoogleWindow).google;

  if (!google?.accounts?.oauth2) {
    throw new Error('Google Identity Services SDK failed to initialize');
  }

  return google;
};

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig();
  const clientId = config.public.googleClientId;

  let loaderPromise: Promise<void> | null = null;
  let tokenClient: GoogleTokenClient | null = null;
  let currentAccessToken: string | null = null;

  const ensureLoader = async () => {
    if (!loaderPromise) {
      loaderPromise = loadGoogleScript();
    }
    await loaderPromise;
    getGoogle();
  };

  const ensureTokenClient = async () => {
    await ensureLoader();

    if (!clientId) {
      throw new Error('Missing GOOGLE_CLIENT_ID runtime configuration');
    }

    if (!tokenClient) {
      tokenClient = getGoogle().accounts.oauth2.initTokenClient({
        client_id: clientId,
        scope: 'openid email profile',
        callback: () => {
          /* Callback overridden per request */
        },
      });
    }

    return tokenClient;
  };

  const fetchGoogleProfile = async (token: string): Promise<GoogleProfile> => {
    const response = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch Google profile');
    }

    return (await response.json()) as GoogleProfile;
  };

  const signIn = async () => {
    const client = await ensureTokenClient();

    return new Promise<{
      profile: GoogleProfile;
      tokenResponse: GoogleTokenResponse;
    }>((resolve, reject) => {
      try {
        client.callback = async (tokenResponse: GoogleTokenResponse) => {
          if (tokenResponse.error) {
            reject(
              new Error(
                tokenResponse.error_description || 'Failed to sign in with Google'
              )
            );
            return;
          }

          const accessToken = tokenResponse.access_token;

          if (!accessToken) {
            reject(new Error('No access token received from Google'));
            return;
          }

          currentAccessToken = accessToken;

          try {
            const profile = await fetchGoogleProfile(accessToken);
            resolve({ profile, tokenResponse });
          } catch (profileError) {
            reject(profileError);
          }
        };

        client.requestAccessToken({ prompt: 'consent' });
      } catch (error) {
        reject(error);
      }
    });
  };

  const signOut = async () => {
    await ensureLoader();

    if (!currentAccessToken) {
      return;
    }

    await new Promise<void>((resolve) => {
      getGoogle().accounts.oauth2.revoke(currentAccessToken as string, () => {
        resolve();
      });
    });

    currentAccessToken = null;
  };

  return {
    provide: {
      googleAuth: {
        signIn,
        signOut,
      },
    },
  };
});
