import { setLocale, string } from 'yup';
import { proxy } from 'valtio/vanilla';
import './style.css';
import i18next, { initI18next } from './i18n.js';
import initView from './view.js';

await initI18next();

document.title = i18next.t('page.title');
document
  .querySelector('meta[name="description"]')
  .setAttribute('content', i18next.t('page.description'));

setLocale({
  mixed: {
    required: 'errors.required',
  },
  string: {
    url: 'errors.url',
  },
});

const state = proxy({
  feeds: [],
  form: {
    error: null,
  },
});

const urlSchema = string()
  .trim()
  .required()
  .url();

const validateUrl = (url, feeds) => urlSchema
  .notOneOf(feeds, 'errors.duplicate')
  .validate(url);

const { form, input } = initView(state, i18next);

form.addEventListener('submit', async (event) => {
  event.preventDefault();

  const formData = new window.FormData(event.target);
  const url = formData.get('url');

  try {
    const validUrl = await validateUrl(url, state.feeds);
    state.feeds.push(validUrl);
    state.form.error = null;
    event.target.reset();
    input.focus();
  } catch (error) {
    state.form.error = error.message;
  }
});
