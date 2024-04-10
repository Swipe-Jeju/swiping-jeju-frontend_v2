import axios from 'axios';

export const BASE_URL = process.env.NEXT_PUBLIC_API_SERVER;

// create an axios instance
export const instance = axios.create({
  baseURL: BASE_URL,
  timeout: 1000,
});
// request interceptor
instance.interceptors.request.use(
  (config) => {
    // do something before request is sent
    return config;
  },
  (error) => {
    // do something with request error
    return Promise.reject(error);
  },
);

instance.interceptors.response.use(
  (response) => {
    // do something with response data
    return response;
  },
  (error) => {
    // do something with response error
    return Promise.reject(error);
  },
);
