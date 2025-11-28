import { defineStore } from 'pinia';

const breakpoints = {
  xs: 0,
  sm: 640,
  md: 768,
  lg: 992,
  xl: 1280,
  xxl: 1574,
};

export const useWindowStore = defineStore('windowStore', {
  state: () => ({
    windowWidth: typeof window !== 'undefined' ? window.innerWidth : 0,
    breakpoint: 'xs' as 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl',
  }),
  actions: {
    updateWidth() {

      if (typeof window !== 'undefined') {
        this.windowWidth = window.innerWidth;
      }
      if (this.windowWidth >= breakpoints.xxl) {
        this.breakpoint = 'xxl';
      }
      if (this.windowWidth >= breakpoints.xl) {
        this.breakpoint = 'xl';
      } else if (this.windowWidth >= breakpoints.lg) {
        this.breakpoint = 'lg';
      } else if (this.windowWidth >= breakpoints.md) {
        this.breakpoint = 'md';
      } else if (this.windowWidth >= breakpoints.sm) {
        this.breakpoint = 'sm';
      } else {
        this.breakpoint = 'xs';
      }
    },
    initWindowsStore() {
      this.updateWidth();

      if (typeof window !== 'undefined') {
        window.addEventListener('resize', this.updateWidth);
        this.updateWidth(); // Initial check
      }
    },
  },
});
