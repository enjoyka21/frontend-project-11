import { subscribe } from 'valtio/vanilla';

const baseInputClasses = 'w-full rounded-lg border bg-white px-4 py-3 text-slate-900 shadow-sm focus:outline-none focus:ring-2';
const validInputClasses = 'border-slate-300 focus:border-blue-500 focus:ring-blue-200';
const invalidInputClasses = 'border-red-500 focus:border-red-500 focus:ring-red-200';

const renderForm = (state, input, submit, feedback, i18next) => {
  const hasError = Boolean(state.form.error);
  const isSending = state.form.processState === 'sending';
  const isSuccess = state.form.processState === 'success';
  input.className = `${baseInputClasses} ${hasError ? invalidInputClasses : validInputClasses}`;
  feedback.className = `min-h-5 text-sm ${hasError ? 'text-red-600' : isSuccess ? 'text-green-600' : 'text-slate-600'}`;
  input.setAttribute('aria-invalid', String(hasError));
  input.disabled = isSending;
  submit.disabled = isSending;
  submit.textContent = i18next.t(isSending ? 'form.sending' : 'form.submit');
  feedback.textContent = isSending
    ? i18next.t('form.sending')
    : state.form.error ? i18next.t(state.form.error) : isSuccess ? i18next.t('messages.success') : '';
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

const renderPosts = (posts, container, i18next) => {
  const elements = posts.map((post) => {
    const item = document.createElement('li');
    const link = document.createElement('a');
    const previewButton = document.createElement('button');

    item.className = 'flex items-center justify-between gap-4';
    item.dataset.seen = String(post.seen);
    link.className = `text-blue-700 underline hover:text-blue-900 ${post.seen ? 'font-normal' : 'font-bold'}`;
    link.href = post.link;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.textContent = post.title;
    link.dataset.seen = String(post.seen);
    previewButton.type = 'button';
    previewButton.className = 'shrink-0 rounded border border-blue-600 px-3 py-1 text-sm font-medium text-blue-700 hover:bg-blue-50';
    previewButton.dataset.postId = post.id;
    previewButton.textContent = i18next.t('modal.preview');
    item.append(link, previewButton);
    return item;
  });

  container.replaceChildren(...elements);
};

const renderModal = (state, dialog, body, fullPostLink) => {
  const post = state.posts.find((item) => item.id === state.ui.modalPostId);

  if (!post) {
    return;
  }

  const title = document.createElement('h3');
  const description = document.createElement('p');
  title.className = 'text-xl font-bold text-slate-900';
  description.className = 'mt-3 text-slate-600';
  title.textContent = post.title;
  description.textContent = post.description;
  body.replaceChildren(title, description);
  fullPostLink.href = post.link;

  if (!dialog.open) {
    dialog.showModal();
  }
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

    <dialog class="w-full max-w-lg rounded-xl border border-slate-200 p-0 shadow-xl">
      <div class="p-6">
        <div data-test="modal-body"></div>
        <div class="mt-6 flex justify-end gap-3">
          <a
            class="rounded bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700"
            data-full-post-link
            target="_blank"
            rel="noopener noreferrer"
          >${i18next.t('modal.readMore')}</a>
          <button
            class="rounded border border-slate-300 px-4 py-2 font-semibold text-slate-700 hover:bg-slate-50"
            type="button"
            data-close-modal
          >${i18next.t('modal.close')}</button>
        </div>
      </div>
    </dialog>
  `;

  const form = app.querySelector('form');
  const input = app.querySelector('input[name="url"]');
  const submit = app.querySelector('button[type="submit"]');
  const feedback = app.querySelector('#url-feedback');
  const feeds = app.querySelector('[data-feeds]');
  const postList = app.querySelector('[data-posts]');
  const dialog = app.querySelector('dialog');
  const modalBody = app.querySelector('[data-test="modal-body"]');
  const fullPostLink = app.querySelector('[data-full-post-link]');
  const closeModal = app.querySelector('[data-close-modal]');

  subscribe(state.form, () => renderForm(state, input, submit, feedback, i18next));
  subscribe(state.feeds, () => renderFeeds(state.feeds, feeds));
  subscribe(state.posts, () => renderPosts(state.posts, postList, i18next));
  subscribe(state.ui, () => renderModal(state, dialog, modalBody, fullPostLink));
  renderForm(state, input, submit, feedback, i18next);
  renderFeeds(state.feeds, feeds);
  renderPosts(state.posts, postList, i18next);

  closeModal.addEventListener('click', () => dialog.close());
  dialog.addEventListener('close', () => {
    state.ui.modalPostId = null;
  });

  return { form, input, postList };
};
