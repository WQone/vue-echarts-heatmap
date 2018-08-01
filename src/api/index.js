/**
 * axios初始化配置
 * --------------------------------------
 * 大部分接口以这个为基础
 */

import axios from 'axios';
import { Message } from 'element-ui';
import config from '../config';

const instance = axios.create({
  baseURL: config.apiHost,
  withCredentials: true,
  params: {},
});

instance.interceptors.request.use((request) => {
  const axiosRequest = {
    ...request,
    params: {
      ...request.params,
    },
  };
  return axiosRequest;
});

instance.interceptors.response.use(
  (response) => {
    if (response.data.code !== '0') {
      Message({
        message: response.data.message,
        type: 'warning',
      });
      console.log(response.data.message);
    }
    return response;
  },
  (error) => {
    console.log(error.message);
    return Promise.reject(error);
  },
);
export default instance;
