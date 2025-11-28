import type { DirectiveBinding } from 'vue';

const createSpinner = () => {
  const spinner = document.createElement('div');
  spinner.className = 'v-loading-spinner';
  return spinner;
};

const vLoading = {
  mounted(el: HTMLElement, binding: DirectiveBinding) {
    const spinner = createSpinner();
    if (binding.value) {
      el.style.position = 'relative';
      el.appendChild(spinner);
      el.setAttribute('disabled', 'true');
    }

    el.__spinner__ = spinner;
  },
  updated(el: HTMLElement, binding: DirectiveBinding) {
    const spinner = el.__spinner__;
    if (binding.value) {
      if (!el.contains(spinner)) {
        el.style.position = 'relative';
        el.appendChild(spinner);
      }
      el.setAttribute('disabled', 'true');
    } else {
      if (el.contains(spinner)) {
        el.removeChild(spinner);
      }
      el.removeAttribute('disabled');
    }
  },
  unmounted(el: HTMLElement) {
    const spinner = el.__spinner__;
    if (el.contains(spinner)) {
      el.removeChild(spinner);
    }
    el.removeAttribute('disabled');
  },
};

export default vLoading;
