import { subscribe } from 'valtio/vanilla';

const baseInputClasses = 'w-full rounded-lg border bg-white px-4 py-3 text-slate-900 shadow-sm focus:outline-none focus:ring-2';
const validInputClasses = 'border-slate-300 focus:border-blue-500 focus:ring-blue-200';
const invalidInputClasses = 'border-red-500 focus:border-red-500 focus:ring-red-200';

const renderForm = (state, input, submit, feedback, i18next) => {
  const hasError = Boolean(state.form.error);
  const isSending = state.form.processState === 'sending';
  input.className = `${baseInputClasses} ${hasError ? invalidInputClasses : validInputClasses}`;
  feedback.className = `min-h-5 text-sm ${hasError ? 'text-red-600' : 'text-slate-600'}`;
  input.setAttribute('aria-invalid', String(hasError));
  input.disabled = isSending;
  submit.disabled = isSending;
  submit.textContent = i18next.t(isSending ? 'form.sending' : 'form.submit');
  feedback.textContent = isSending
    ? i18next.t('form.sending')
    : state.form.error ? i18next.t(state.form.error) : '';
};

const renderFeeds = (feeds, container) => {
  const elements = feeds.map((feed) => {
    const item = document.createElement('article');
    const title = document.createElement('h3');
    const description = document.createElement('p');

    item.className = 'rounded-lg border border-slate-200 bg-white p-4 shadow-sm';
    title.className = 'text-lg font-semibold text-slate-900';
    description.className = 'mt-1 text-slate-600';
    title.textContent = feed.title;
    description.textContent = feed.description;
    item.append(title, description);
    return item;
  });

  container.replaceChildren(...elements);
};

const renderPosts = (posts, container) => {
  const elements = posts.map((post) => {
    const item = document.createElement('li');
    const link = document.createElement('a');

    link.className = 'text-blue-700 underline hover:text-blue-900';
    link.href = post.link;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.textContent = post.title;
    item.append(link);
    return item;
  });

  container.replaceChildren(...elements);
};

export default (state, i18next) => {
  const app = document.querySelector('#app');

  app.innerHTML = `
    <main class="min-h-screen bg-slate-50 px-4 py-12">
      <div class="mx-auto max-w-2xl">
        <h1 class="mb-3 text-3xl font-bold text-slate-900">${i18next.t('page.title')}</h1>
        <p class="mb-8 text-slate-600">${i18next.t('page.subtitle')}</p>

        <form class="space-y-3" novalidate>
          <label class="block text-sm font-medium text-slate-700" for="url">${i18next.t('form.label')}</label>
          <div class="flex flex-col gap-3 sm:flex-row">
            <input
              id="url"
              type="text"
              name="url"
              placeholder="${i18next.t('form.placeholder')}"
              aria-describedby="url-feedback"
              class="${baseInputClasses} ${validInputClasses}"
            >
            <button
              type="submit"
              class="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-200"
            >
              ${i18next.t('form.submit')}
            </button>
          </div>
          <p id="url-feedback" class="min-h-5 text-sm text-red-600" role="alert"></p>
        </form>

        <section class="mt-10">
          <h2 class="mb-4 text-2xl font-bold text-slate-900">${i18next.t('sections.feeds')}</h2>
          <div class="space-y-3" data-feeds></div>
        </section>

        <section class="mt-10">
          <h2 class="mb-4 text-2xl font-bold text-slate-900">${i18next.t('sections.posts')}</h2>
          <ul class="space-y-2" data-posts></ul>
        </section>
      </div>
    </main>
  `;

  const form = app.querySelector('form');
  const input = app.querySelector('input[name="url"]');
  const submit = app.querySelector('button[type="submit"]');
  const feedback = app.querySelector('#url-feedback');
  const feeds = app.querySelector('[data-feeds]');
  const posts = app.querySelector('[data-posts]');

  subscribe(state.form, () => renderForm(state, input, submit, feedback, i18next));
  subscribe(state.feeds, () => renderFeeds(state.feeds, feeds));
  subscribe(state.posts, () => renderPosts(state.posts, posts));
  renderForm(state, input, submit, feedback, i18next);
  renderFeeds(state.feeds, feeds);
  renderPosts(state.posts, posts);

  return { form, input };
};
