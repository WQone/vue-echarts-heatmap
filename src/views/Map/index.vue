<template>
  <div id="Map">
    <div class="leftnav" :style="windowHeight">
      <p class="title">
        <span>
          <i class="icon iconfont icon-ditu"></i>用电人口数量/热力图</span>
      </p>
      <ul class="card" :style="hotShow? '': 'opacity: 0.4;'">
        <p class="card-title">
          <span>
            <i class="icon iconfont" @click="IsHotShow" :class="hotShow? 'icon-chakan-copy' : 'icon-yanjing'"></i>用电人口分布热力图</span>
        </p>
        <li class="card-list" v-for="item in hotList" :key="item" @click="changeHot(item)">
          <span>
            <i class="icon iconfont icon-dangqianweizhi1" :style="hotActive === item ? '':'color:white;'"></i>{{item}}</span>
        </li>
      </ul>
      <ul class="card" :style="numShow? '': 'opacity: 0.4;'">
        <p class="card-title">
          <span>
            <i class="icon iconfont" @click="IsNumShow" :class="numShow? 'icon-chakan-copy' : 'icon-yanjing'"></i>用电人口分布数量图</span>
        </p>
        <li class="card-list" v-for="item in numList" :key="item" @click="changeNum(item)">
          <span>
            <i class="icon iconfont icon-dangqianweizhi1" :style="numActive === item ? '':'color:white;'"></i>{{item}}</span>
        </li>
      </ul>
    </div>
    <div id="allmap" class="allmap" :style="windowHeight"></div>
    <div class="map-button">
      <el-select v-model="value" placeholder="请选择">
        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
        </el-option>
      </el-select>
    </div>
  </div>
</template>

<script>
import MP from './map';

export default {
  name: 'Map',
  mounted() {
    this.$nextTick(() => {
      // 在此调用api
      MP(this.ak).then((BMap) => {
        const map = new BMap.Map('allmap', { enableMapClick: true });
        map.centerAndZoom(new BMap.Point(104.73, 31.47), 12);
        const mapStyle = {
          features: ['road', 'building', 'water', 'land'], // 隐藏地图上的poi
          style: 'dark', // 设置地图风格为高端黑
        };
        map.setMapStyle(mapStyle);
        map.enableScrollWheelZoom(true); // 开启鼠标滚轮缩放
        map.addControl(new BMap.NavigationControl({
          type: BMAP_NAVIGATION_CONTROL_SMALL,
          anchor: BMAP_ANCHOR_BOTTOM_RIGHT,
          offset: new BMap.Size(50, 50),
        })); // 平移缩放控件
        this.checkhHtml5();
        // 初始化画图
        // const styleOptions = {
        //   strokeColor: 'red', // 边线颜色。
        //   fillColor: 'red', // 填充颜色。当参数为空时，圆形将没有填充效果。
        //   strokeWeight: 3, // 边线的宽度，以像素为单位。
        //   strokeOpacity: 0.8, // 边线透明度，取值范围0 - 1。
        //   fillOpacity: 0.6, // 填充的透明度，取值范围0 - 1。
        //   strokeStyle: 'solid', // 边线的样式，solid或dashed。
        // };
        // // 实例化鼠标绘制工具
        // map.drawingManager = new BMap.DrawingManager(map, {
        //   isOpen: false, // 是否开启绘制模式
        //   enableDrawingTool: true, // 是否显示工具栏
        //   drawingToolOptions: {
        //     anchor: BMAP_ANCHOR_TOP_RIGHT, // 位置
        //     offset: new BMap.Size(5, 5), // 偏离值
        //   },
        //   circleOptions: styleOptions, // 圆的样式
        //   polylineOptions: styleOptions, // 线的样式
        //   polygonOptions: styleOptions, // 多边形的样式
        //   rectangleOptions: styleOptions, // 矩形的样式
        // });
      });
    });
    console.log(window.innerHeight);
    this.windowHeight = `height:${window.innerHeight}px;`;
  },
  data() {
    return {
      ak: '1y2hRgyFgIGGkM9m9vmrmsLGsHvwnsUU',
      windowHeight: '',
      hotList: ['常驻人口', '工作人口', '实时人口'],
      numList: ['常驻人口', '工作人口', '实时人口'],
      hotActive: '常驻人口',
      numActive: '常驻人口',
      hotShow: true,
      numShow: true,
      options: [{
        value: '绵阳市',
      }],
      value: '绵阳市',
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
    changeHot(val) {
      if (!this.hotShow) {
        return;
      }
      this.hotActive = val;
      console.log(val);
    },
    changeNum(val) {
      if (!this.numShow) {
        return;
      }
      this.numActive = val;
      console.log(val);
    },
    IsHotShow() {
      this.hotShow = !this.hotShow;
    },
    IsNumShow() {
      this.numShow = !this.numShow;
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.iconfont {
  color: #0095ff;
  margin-right: 10px;
}
.map-button {
  position: absolute;
  left: 320px;
  top: 6px;
  height: 30px;
  z-index: 1;
}
#Map {
  width: 100%;
  overflow: hidden;
  margin: 0 auto;
}
.allmap {
  margin-left: 300px;
  float: right;
  width: 100%;
  position: absolute;
}
.leftnav {
  position: relative;
  background: #fff;
  width: 300px;
  float: left;
  color: #585858;
}
.title {
  width: 100%;
  font-size: 16px;
  border-bottom: 2px solid #ccc;
  height: 42px;
  line-height: 42px;
}
.title span {
  margin-left: 20px;
}
.card {
  margin-top: 15px;
  border-top: 1px solid #ccc;
  border-bottom: 1px solid #ccc;
  box-shadow: 0 3px 9px 0 rgba(0, 0, 0, 0.15);
  padding-bottom: 15px;
}
.card-title {
  width: 100%;
  font-size: 15px;
  height: 40px;
  line-height: 40px;
  background: #f5f7fa;
  border-bottom: 1px solid #ccc;
}
.card-title span {
  margin-left: 30px;
}
.card-list {
  width: 100%;
  font-size: 14px;
  height: 42px;
  line-height: 42px;
  cursor: pointer;
}
.card-list span {
  margin-left: 60px;
}
</style>
<style>
.map-button .el-select {
  width: 100px;
}
.map-button input {
  font-size: 13px;
  height: 35px;
}
.map-button .el-input__icon {
  line-height: 35px;
}
</style>

