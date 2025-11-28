import { defineStore } from 'pinia';

export const useNewsletterPopUpStore = defineStore(
  'newsletterPopUpStore',
  () => {
    const newsletterVisible = ref<boolean>(false);
    const newsletterStateCookie = useCookie('NEWSLETTER_POPUP', {
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    // Add page visits counter cookie
    const pageVisitsCookie = useCookie('PAGE_VISITS', {
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    // Initialize page visits if not set
    if (!pageVisitsCookie.value) {
      pageVisitsCookie.value = '0';
    }

    // Check newsletter state
    if (String(newsletterStateCookie.value) === '1') {
      newsletterVisible.value = false;
    } else {
      // Only show newsletter if visited 5 or more pages
      newsletterVisible.value = Number(pageVisitsCookie.value) >= 5;
    }

    const closeNewsletterPopUp = () => {
      newsletterStateCookie.value = '1';
      newsletterVisible.value = false;
    };

    const incrementPageVisits = () => {
      const currentVisits = Number(pageVisitsCookie.value);
      pageVisitsCookie.value = String(currentVisits + 1);

      // Show newsletter if hits 5 visits and hasn't been closed before
      if (
        currentVisits + 1 >= 5 &&
        String(newsletterStateCookie.value) !== '1'
      ) {
        newsletterVisible.value = true;
      }
    };

    return {
      newsletterVisible,
      closeNewsletterPopUp,
      incrementPageVisits,
    };
  }
);
