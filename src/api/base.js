import api from './index';
import config from '../config';

const path = {
  apiAdd: '/api/add', // 新增API
  getInfo: '/api/detail', // API详情
  accountList: '/api/account/list', // 对账列表
  accountExport: '/api/account/export', // 对账导出
  routeTest: '/api/route/test', // 调用API
};

// 新增API
const apiAdd = (form) => api.post(path.apiAdd, form);

const getInfo = (id) => api.get(`${path.getInfo}/${id}`);

// 获取数据
const accountList = (page, count, factoryName) =>
  api.get(path.accountList, {
    params: {
      page,
      count,
      factoryName,
    },
  });

// 文件导出
const accountExport = (form) => {
  let url = `${config.apiHost}${path.accountExport}?`;
  const keys = Object.keys(form);
  for (let i = 0; i < keys.length; i += 1) {
    const key = keys[i];
    url += `&${key}=${form[key]}`;
  }
  return encodeURI(url);
};

const routeTest = (apiId, params) =>
  api.get(path.routeTest, {
    params: {
      apiId,
      params,
    },
  });

export default {
  apiAdd,
  getInfo,
  accountList,
  accountExport,
  routeTest,
};
