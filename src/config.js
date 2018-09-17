// 配置文件
//  (地址配置均以/结尾，后续无需再加)

// 开发环境 (dev)
let apiHost = `${location.protocol}//${location.host}/api/`;

if (process.env.NODE_ENV && process.env.NODE_ENV === 'production') {
  apiHost = `${location.protocol}//${location.host}/api/`;
}

console.log(process.env.NODE_ENV);

export default {
  apiHost,
};
