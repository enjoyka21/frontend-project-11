import './style.css';

document.querySelector('#app').innerHTML = `
  <main class="min-h-screen bg-slate-50 px-4 py-12">
    <div class="mx-auto max-w-2xl">
      <h1 class="mb-3 text-3xl font-bold text-slate-900">
        RSS Reader
      </h1>

      <p class="mb-8 text-slate-600">
        Stay up to date with your favorite websites
      </p>

      <form class="flex flex-col gap-3 sm:flex-row">
        <input
          type="url"
          name="url"
          placeholder="Enter RSS feed URL"
          class="min-w-0 flex-1 rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
        >

        <button
          type="submit"
          class="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
        >
          Add
        </button>
      </form>
    </div>
  </main>
`;
