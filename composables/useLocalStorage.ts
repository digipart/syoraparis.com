export const useLocalStorage = (key: string, initialValue: any) => {
  const data = ref(initialValue);

  if (typeof window !== 'undefined') {
    const storedValue = localStorage.getItem(key);
    if (storedValue !== null) {
      data.value = JSON.parse(storedValue);
    }

    watch(data, (newValue) => {
      localStorage.setItem(key, JSON.stringify(newValue));
    });
  }

  return data;
};
