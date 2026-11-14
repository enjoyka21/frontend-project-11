import { setLocale, string } from 'yup';
import { proxy } from 'valtio/vanilla';
import './style.css';
import getRss from './api.js';
import i18next, { initI18next } from './i18n.js';
import parseRss from './parser.js';
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
  posts: [],
  form: {
    error: null,
    processState: 'filling',
  },
});

const urlSchema = string()
  .trim()
  .required()
  .url();

const validateUrl = (url, feeds) => urlSchema
  .notOneOf(feeds.map(({ url: feedUrl }) => feedUrl), 'errors.duplicate')
  .validate(url);

const getErrorCode = (error) => {
  const knownErrorCodes = ['errors.required', 'errors.url', 'errors.duplicate', 'errors.parsing'];
  return knownErrorCodes.includes(error.message) ? error.message : 'errors.network';
};

const saveFeed = (url, { feed, posts }) => {
  const feedId = window.crypto.randomUUID();
  state.feeds.push({ ...feed, id: feedId, url });
  posts.forEach((post) => state.posts.push({
    ...post,
    id: window.crypto.randomUUID(),
    feedId,
  }));
};

const { form, input } = initView(state, i18next);

form.addEventListener('submit', async (event) => {
  event.preventDefault();

  const formData = new window.FormData(event.target);
  const url = formData.get('url');
  state.form.error = null;

  try {
    const validUrl = await validateUrl(url, state.feeds);
    state.form.processState = 'sending';
    const rss = await getRss(validUrl);
    const rssData = parseRss(rss);
    saveFeed(validUrl, rssData);
    state.form.error = null;
    state.form.processState = 'filling';
    event.target.reset();
    input.focus();
  } catch (error) {
    state.form.error = getErrorCode(error);
    state.form.processState = 'failed';
  }
});
