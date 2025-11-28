export function scrollToElement(element: HTMLElement | null, offset = 0): void {
  if (element) {
    const elementPosition =
      element.getBoundingClientRect().top + window.pageYOffset - offset;
    window.scrollTo({ top: elementPosition, behavior: 'smooth' });
  }
}

export const scrollToElementContainer = (
  element: HTMLElement | null,
  behavior: ScrollBehavior = 'smooth',
  block: ScrollLogicalPosition = 'start'
) => {
  if (element) {
    element.scrollIntoView({ behavior, block });
  }
};
