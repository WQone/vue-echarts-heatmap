<template>
  <div class="Map">
    <div class="leftnav" :style="windowHeight">
      <p class="title">用电人口数量/热力图</p>
      <ul class="card">
        <p class="card-title">用电人口分布热力图</p>
        <li class="card-list" v-for="item in cardList" :key="item">{{item}}</li>
      </ul>
    </div>
    <div id="allmap" class="allmap" :style="windowHeight"></div>
  </div>
</template>

<script>
import BMap from 'BMap';

export default {
  name: 'Map',
  mounted() {
    console.log(window.innerHeight);
    this.windowHeight = `height:${window.innerHeight}px;`;
    const map = new BMap.Map('allmap', { enableMapClick: true });
    map.centerAndZoom(new BMap.Point(116.404269, 39.916042), 12);

    const mapStyle = {
      features: ['road', 'building', 'water', 'land'], // 隐藏地图上的poi
      style: 'dark', // 设置地图风格为高端黑
    };
    map.setMapStyle(mapStyle);
    map.enableScrollWheelZoom(true); // 开启鼠标滚轮缩放
    this.checkhHtml5();
  },
  data() {
    return {
      windowHeight: '',
      cardList: ['常驻人口', '工作人口', '实时人口'],
    };
  },
  methods: {
    checkhHtml5() {
      if (typeof Worker === 'undefined') {
        if (navigator.userAgent.indexOf('MSIE 9.0') <= 0) {
          console.log(
            '定制个性地图示例：IE9以下不兼容，推荐使用百度浏览器、chrome、firefox、safari、IE10',
          );
        }
      }
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.allmap {
  width: 80%;
  float: right;
}
.leftnav {
  background: #fff;
  width: 200px;
  float: left;
  color: #585858;
}
.title {
  width: 100%;
  font-size: 16px;
  padding: 0 20px;
  border-bottom: 2px solid #ccc;
  height: 42px;
  line-height: 42px;
}
.card {
  margin-top: 20px;
  background: green;
}
.card-title {
  width: 100%;
  font-size: 15px;
  padding: 0 20px;
  height: 40px;
  line-height: 40px;
  background: #f5f7fa;
  border-bottom: 1px solid #ccc;
  border-top: 1px solid #ccc;
}
.card-list {
  width: 100%;
  padding: 5px 40px;
  font-size: 14px;
}
</style>
