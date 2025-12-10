export const useMollie = () => {
  const mollie = ref<any>(null);
  const isLoaded = ref(false);

  const loadMollie = (profileId: string, testMode: boolean = true) => {
    return new Promise((resolve, reject) => {
      if (mollie.value) {
        resolve(mollie.value);
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://js.mollie.com/v1/mollie.js';
      script.async = true;

      script.onload = () => {
        if (window.Mollie) {
          mollie.value = window.Mollie(profileId, {
            locale: 'en_US',
            testmode: testMode,
          });
          isLoaded.value = true;
          resolve(mollie.value);
        } else {
          reject(new Error('Mollie not available'));
        }
      };

      script.onerror = () => reject(new Error('Failed to load Mollie script'));
      document.head.appendChild(script);
    });
  };

  return {
    mollie,
    isLoaded,
    loadMollie,
  };
};
