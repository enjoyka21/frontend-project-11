import { subscribe } from 'valtio/vanilla';

const baseInputClasses = 'w-full rounded-lg border bg-white px-4 py-3 text-slate-900 shadow-sm focus:outline-none focus:ring-2';
const validInputClasses = 'border-slate-300 focus:border-blue-500 focus:ring-blue-200';
const invalidInputClasses = 'border-red-500 focus:border-red-500 focus:ring-red-200';

const renderForm = (state, input, feedback, i18next) => {
  const hasError = Boolean(state.form.error);
  input.className = `${baseInputClasses} ${hasError ? invalidInputClasses : validInputClasses}`;
  input.setAttribute('aria-invalid', String(hasError));
  feedback.textContent = state.form.error ? i18next.t(state.form.error) : '';
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
      </div>
    </main>
  `;

  const form = app.querySelector('form');
  const input = app.querySelector('input[name="url"]');
  const feedback = app.querySelector('#url-feedback');

  subscribe(state.form, () => renderForm(state, input, feedback, i18next));
  renderForm(state, input, feedback, i18next);

  return { form, input };
};
