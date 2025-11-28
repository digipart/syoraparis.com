import { defineStore } from 'pinia';
import { ref, onMounted, onUnmounted } from 'vue';

export const useHeaderStore = defineStore('headerStore', () => {
  const menuBackground = ref('white');
  const menuLogo = ref<'svg' | 'text'>('svg');
  const headerHeight = ref(0);

  const appStore = useAppStore();
  const { sideMenuVisible } = toRefs(appStore);

  const backClick = () => {};

  //   onMounted(() => {});

  //   onUnmounted(() => {});

  const route = useRoute();
  const { locale } = useI18n();

  const pageShoulBeBlackColor = ['index'];

  const menuColor = computed(() => {
    const isOk = pageShoulBeBlackColor.some(
      (item) => `${item}___${locale.value}` === route.name
    );

    return isOk && !sideMenuVisible.value ? 'white' : 'primary';
  });

  return { menuBackground, menuLogo, menuColor, backClick, headerHeight };
});
