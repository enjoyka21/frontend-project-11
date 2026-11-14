const getText = (element, selector) => element.querySelector(selector)?.textContent.trim();

const parseRss = (rss) => {
  const document = new window.DOMParser().parseFromString(rss, 'application/xml');
  const channel = document.querySelector('channel');

  if (document.querySelector('parsererror') || !channel) {
    throw new Error('errors.parsing');
  }

  const feed = {
    title: getText(channel, 'title'),
    description: getText(channel, 'description'),
  };

  if (!feed.title || !feed.description) {
    throw new Error('errors.parsing');
  }

  const posts = [...channel.querySelectorAll('item')].map((item) => ({
    title: getText(item, 'title'),
    link: getText(item, 'link'),
  }));

  return { feed, posts };
};

export default parseRss;
