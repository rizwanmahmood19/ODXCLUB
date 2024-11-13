import env from '../../env.json';

export const appendToBaseUrl = (url: string) => {
  const filteredUrl = url[0] === '/' ? url : '/' + url;

  return env.BASE_URL + filteredUrl;
};
