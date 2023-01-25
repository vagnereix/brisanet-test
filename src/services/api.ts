import axios from 'axios';

export const api = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL,
});

api.interceptors.request.use(async (config) => {
  config.url = `${
    config.url?.includes('?') ? config.url + '&' : config.url + '?'
  }ts=${process.env.REACT_APP_TIME_STAMP}&apikey=${
    process.env.REACT_APP_API_KEY
  }&hash=${process.env.REACT_APP_HASH}`;

  return config;
});
