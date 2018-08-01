/**
 * 公共转换js
 */

//  将日期时间转成时间戳格式
const dateTime = (str) => {
  if (!str) {
    return new Date();
  }
  const reg = new RegExp(/(\d{4})-(\d{2})-(\d{2}).(\d{2}):(\d{2}):(\d{2})/);
  const msg = str.match(reg);
  const yy = msg[1];
  const MM = msg[2];
  const dd = msg[3];
  const HH = msg[4];
  const mm = msg[5];
  const SS = msg[6];
  const time = new Date(`${yy}-${MM}-${dd}`).getTime() - 8 * 60 * 60 * 1000;
  const ret = time + (parseInt(HH, 0) * 60 * 60 + parseInt(mm, 0) * 60 + parseInt(SS, 0)) * 1000;
  return ret;
};

/**
 *  转出 YYYY-MM-DD 的时间格式
 *  type 什么都不传  返回 YYYY-MM-SS
 *  type === 1 YYYY-MM-DD hh:mm:ss
 *  type === 2 不是时间的会返回null
 */
const convertDate = (date, type) => {
  if (!date && type === 2) {
    return null;
  }
  const reg = new RegExp(/(\d{4})-(\d{2})-(\d{2}).(\d{2}):(\d{2}):(\d{2})/);
  let dd = new Date(date);
  if (reg.test(date)) {
    dd = new Date(dateTime(date));
  }
  if (dd.toString() === 'Invalid Date') {
    dd = new Date();
  }
  let m = (dd.getMonth() + 1).toString();
  let d = dd.getDate().toString();
  let hh = dd.getHours().toString();
  let mm = dd.getMinutes().toString();
  let ss = dd.getSeconds().toString();
  if (m.length < 2) {
    m = `0${m}`;
  }
  if (d.length < 2) {
    d = `0${d}`;
  }
  if (hh.length < 2) {
    hh = `0${hh}`;
  }
  if (mm.length < 2) {
    mm = `0${mm}`;
  }
  if (ss.length < 2) {
    ss = `0${ss}`;
  }
  if (type === 1) {
    return `${dd.getFullYear()}-${m}-${d} ${hh}:${mm}:${ss}`;
  }
  return `${dd.getFullYear()}-${m}-${d}`;
};

//  转出 YYYY/MM/DD 的时间格式
const convertDateOther = (date, type) => {
  const dd = new Date(date);
  if (dd.toString() === 'Invalid Date') {
    return null;
  }
  let m = (dd.getMonth() + 1).toString();
  let d = dd.getDate().toString();
  if (m.length < 2) {
    m = `0${m}`;
  }
  if (d.length < 2) {
    d = `0${d}`;
  }
  if (type === 1) {
    return `${dd.getFullYear()}`; // 转出年份
  }
  return `${dd.getFullYear()}/${m}/${d}`;
};

//  转出 YYYY 年 MM 月 DD日 的时间格式
const convertDateNew = (date, type) => {
  let dd = new Date(date);
  if (dd.toString() === 'Invalid Date') {
    dd = new Date();
  }
  let m = (dd.getMonth() + 1).toString();
  let d = dd.getDate().toString();
  let hh = dd.getHours().toString();
  let mm = dd.getMinutes().toString();
  let ss = dd.getSeconds().toString();
  if (m.length < 2) {
    m = `0${m}`;
  }
  if (d.length < 2) {
    d = `0${d}`;
  }
  if (hh.length < 2) {
    hh = `0${hh}`;
  }
  if (mm.length < 2) {
    mm = `0${mm}`;
  }
  if (ss.length < 2) {
    ss = `0${ss}`;
  }
  if (type === 1) {
    return `${dd.getFullYear()}-${m}-${d} ${hh}:${mm}:${ss}`;
  }
  return `${dd.getFullYear()} 年 ${m} 月 ${d} 日`;
};

//  涉及到被转义的文本转json
const getJSON = (str) => {
  if (!str) {
    return [];
  }
  let ret = '';
  const fn = (s) => {
    if (typeof s === 'string') {
      try {
        const retstr = JSON.parse(s);
        ret = retstr;
        fn(retstr);
      } catch (error) {
        ret = s;
      }
    }
  };
  fn(str);
  return ret;
};

// 获取区域下拉分类
const getCity = (data) => {
  const arr = [];
  const arrs = [];
  for (let i = 0; i < data.length; i += 1) {
    const item = data[i];
    item.children = [];
    if (item.rank === '一级') {
      arr.push(item);
    }
  }
  for (let j = 0; j < arr.length; j += 1) {
    for (let m = 0; m < data.length; m += 1) {
      const childItem = data[m];
      if (childItem.class === arr[j].class) {
        arr[j].children.push(childItem);
      }
    }
  }
  return arr;
};

export default {
  dateTime,
  convertDate,
  convertDateOther,
  getJSON,
  convertDateNew,
  getCity,
};
