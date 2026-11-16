import axios from 'axios';

const proxyUrl = 'https://allorigins.hexlet.app/get';

const getRss = (url) => {
  const requestUrl = new window.URL(proxyUrl);
  requestUrl.searchParams.set('disableCache', 'true');
  requestUrl.searchParams.set('url', url);

  return axios
    .get(requestUrl.toString(), { timeout: 10000 })
    .then(({ data }) => data.contents);
};

export default getRss;
