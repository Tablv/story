import axios from "axios";
import { ResultJSON } from "glaway-bi-util/AxiosUtil";

/**
 * Axios 请求拦截器
 */
axios.interceptors.request.use(
  config => {
    // const token = window.localStorage.getItem("token");
    // token && (config.headers.Authorization = token);
    return config;
  },
  error => {
    console.error(error);
    return Promise.reject(error);
  }
);

/**
 * Axios 响应拦截器
 */
axios.interceptors.response.use(
  config => {
    const result = config.data as ResultJSON;
    if (!result.success) return Promise.reject("接口返回错误");

    return config;
  },
  error => {
    console.error(error);
    return Promise.reject(error);
  }
);
