// Global state (Singleton)
const mollieInstance = ref<any>(null);
const isLoaded = ref(false);
const isLoading = ref(false);
let loadingPromise: Promise<any> | null = null;

export const useMollie = () => {
  const loadMollie = (profileId: string, testMode: boolean = true) => {
    // If already loaded, return immediately
    if (mollieInstance.value) {
      return Promise.resolve(mollieInstance.value);
    }

    // If loading is already in progress, return the existing promise
    if (loadingPromise) {
      return loadingPromise;
    }

    loadingPromise = new Promise((resolve, reject) => {
      // Check if script is already in DOM (from another component or pre-rendering)
      if (document.querySelector('script[src="https://js.mollie.com/v1/mollie.js"]')) {
        const checkInterval = setInterval(() => {
          if ((window as any).Mollie) {
            clearInterval(checkInterval);
            initMollie(profileId, testMode);
            resolve(mollieInstance.value);
          }
        }, 100);
        // Set a timeout for the check
        setTimeout(() => {
          clearInterval(checkInterval);
          if (!mollieInstance.value) reject(new Error('Mollie script found but failed to initialize'));
        }, 5000);
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://js.mollie.com/v1/mollie.js';
      script.async = true;

      script.onload = () => {
        if ((window as any).Mollie) {
          initMollie(profileId, testMode);
          resolve(mollieInstance.value);
        } else {
          loadingPromise = null;
          reject(new Error('Mollie available in window after load'));
        }
      };

      script.onerror = () => {
        loadingPromise = null;
        reject(new Error('Failed to load Mollie script'));
      };

      document.head.appendChild(script);
    });

    return loadingPromise;
  };

  const initMollie = (profileId: string, testMode: boolean) => {
    if (!mollieInstance.value && (window as any).Mollie) {
      console.log('Initializing Global Mollie Instance');
      mollieInstance.value = (window as any).Mollie(profileId, {
        locale: 'fr_FR', // Could be made dynamic
        testmode: testMode,
      });
      isLoaded.value = true;
      // Store globally on window just in case, though module state is preferred
      (window as any).mollieInstance = mollieInstance.value;
    }
  };

  return {
    mollie: mollieInstance,
    isLoaded,
    loadMollie,
  };
};