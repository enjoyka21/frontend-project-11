import axios from 'axios';

const proxyUrl = 'https://allorigins.hexlet.app/raw';

const getRss = (url) => {
  const requestUrl = new window.URL(proxyUrl);
  requestUrl.searchParams.set('url', url);

  return axios
    .get(requestUrl.toString(), { timeout: 10000 })
    .then(({ data }) => data);
};

export default getRss;
