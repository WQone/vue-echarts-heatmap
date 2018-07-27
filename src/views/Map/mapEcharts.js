/* eslint-disable */
const data = [
  { name: '北京航空航天大学', value: [3887, 3035, 852], radius: ['63.2%', '48.5%'] },
  { name: '北京大学', value: [2819, 1692, 1127], radius: ['28%', '30%'] },
  { name: '清华大学', value: [3800, 2533, 1267], radius: ['43.5%', '12%'] },
  { name: '北京理工大学', value: [3760, 2507, 1253], radius: ['32%', '84%'] },
  { name: '中国人民大学', value: [2824, 1130, 1694], radius: ['30%', '65%'] },
  { name: '中国政法大学', value: [2141, 777, 1364], radius: ['66.6%', '76.5%'] },
  { name: '中国地质大学', value: [2050, 1397, 653], radius: ['64%', '33%'] },
  { name: '北京师范大学', value: [2026, 608, 1418], radius: ['82.7%', '82.5%'] },
  { name: '中央财经大学', value: [2467, 953, 1514], radius: ['58.7%', '86.5%'] },
  { name: '北京邮电大学', value: [3180, 1993, 1187], radius: ['73%', '81.5%'] },
];
let series = [];
for (var i = 0; i < data.length; i++) {
  series.push({
    name: data[i].name,
    type: 'pie',
    center: data[i].radius,
    roseType: 'radius',
    radius: [0, data[i].value[0] / 100],
    itemStyle: {
      normal: {
        opacity: 0.5,
      },
    },
    label: {
      normal: {
        show: false,
        formatter: '{d}%',
      },
    },
    data: [
      {
        name: '女',
        value: data[i].value[2],
      },
      {
        name: '男',
        value: data[i].value[1],
      },
    ],
  });
}
const mapOption = {
  tooltip: {
    formatter: '{a}<br/>{b}: {c}人 ({d}%)',
  },
  legend: {
    data: ['男', '女'],
    left: '38%',
    top: '30%',
  },
  title: [
    {
      text: data[3].name,
      left: data[3].radius[0],
      top: data[3].radius[1],
      textStyle: {
        fontSize: 12,
        fontWeight: 'light',
      },
    },
    {
      text: data[7].name,
      left: data[7].radius[0],
      top: data[7].radius[1],
      textStyle: {
        fontSize: 9,
        fontWeight: 'light',
      },
    },
    {
      text: data[8].name,
      left: data[8].radius[0],
      top: data[8].radius[1],
      textStyle: {
        fontSize: 12,
        fontWeight: 'light',
      },
    },
  ],

  bmap: {
    center: [116.340331, 39.98667],
    zoom: 14,
    roam: true,
    mapStyle: {
      styleJson: [{}],
    },
  },
  series: series,
};

export default {
  mapOption,
};
