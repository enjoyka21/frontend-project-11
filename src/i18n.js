import i18next from 'i18next';
import ru from './locales/ru.js';

const initI18next = () => i18next.init({
  lng: 'ru',
  fallbackLng: 'ru',
  resources: {
    ru,
  },
});

export { initI18next };
export default i18next;
