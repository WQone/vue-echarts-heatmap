<template>
  <div id="Map">

    <div class="leftnav">

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

    <div id="allmap" class="allmap"></div>

    <div class="map-button">
      <!-- <div class="el-input--suffix el-input__inner cover-text">{{city}}</div> -->
      <el-select :value="city" popper-class="map-select">
        <el-option :value="city">
          <el-card class="select-card" shadow="never">
            <div slot="header" class="clearfix select-header">
              <span>选择供电区域</span>
              <!-- <el-button style="float: right;margin-right:10px;font-size:20px;" type="text" size="mini">x</el-button> -->
            </div>
            <div class="select-tip">
              <div>当前区域： {{city}}</div>
              <p class="history">
                <span v-for="(item,index) in historyList" :key="index" @click="changeCity(item)">{{item}}</span>
              </p>
            </div>
            <div v-for="(item,index) in cityList" :key="index" class="select-content">
              <span class="s-title" @click="changeCity(item.name)">{{item.name}}：</span>
              <span class="s-txt" v-for="iChild in item.children" :key="iChild" @click="changeCity(iChild)">{{iChild}}</span>
            </div>
          </el-card>
        </el-option>
      </el-select>
    </div>
  </div>
</template>

<script>
import MP from './map';
import drawingManager from './drawingManager';

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
        map.addControl(
          new BMap.NavigationControl({
            // eslint-disable-next-line
            type: BMAP_NAVIGATION_CONTROL_SMALL,
            // eslint-disable-next-line
            anchor: BMAP_ANCHOR_BOTTOM_RIGHT,
            offset: new BMap.Size(50, 50),
          }),
        ); // 平移缩放控件
        this.checkhHtml5();

        this.drawingManager = drawingManager.init(map);

        this.drawingManager.addEventListener('overlaycomplete', this.overlaycomplete);
      });
    });
  },
  data() {
    return {
      ak: '1y2hRgyFgIGGkM9m9vmrmsLGsHvwnsUU',
      hotList: ['常驻人口', '工作人口', '实时人口'],
      numList: ['常驻人口', '工作人口', '实时人口'],
      historyList: [
        '全市',
        '江北供电区',
        '江南供电区',
        '城南供电区',
        '城北供电区',
        '城西供电区',
        '自定义供电区',
      ],
      cityList: [
        { name: '城南供电区', children: ['A片供电区', 'B片供电区', 'C片供电区', 'D片供电区'] },
        { name: '城北供电区', children: ['A片供电区', 'B片供电区', 'C片供电区', 'D片供电区'] },
        { name: '城西供电区', children: ['A片供电区', 'B片供电区', 'C片供电区', 'D片供电区'] },
        { name: '自定义供电区', children: ['A自定义片区', 'B自定义手绘区'] },
      ],
      hotActive: '常驻人口',
      numActive: '常驻人口',
      hotShow: true,
      numShow: true,
      city: '绵阳市',
      drawingManager: null,
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
    // 改变当前地区
    changeCity(val) {
      console.log(val, this.city);
      this.city = val;
    },
    //  操作百度地图工具回调
    overlaycomplete(e) {
      console.log('e', e);
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.cover-text {
  display: inline-block;
  position: absolute;
  z-index: 10;
  height: 35px;
  line-height: 35px;
  font-size: 13px;
  width: 100px;
}
.iconfont {
  color: #0095ff;
  margin-right: 10px;
  font-size: 18px;
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
  height: 100%;
  position: fixed;
  left: 0;
  top: 0;
  overflow: hidden;
  margin: 0 auto;
}
.allmap {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  z-index: 1;
}
.leftnav {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 300px;
  background: #fff;
  color: #585858;
  z-index: 2;
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
  width: 130px;
}
.map-button input {
  font-size: 13px;
  height: 35px;
}
.map-button .el-input__icon {
  line-height: 35px;
}
.map-select .el-select-dropdown__item {
  height: 100%;
  padding: 0px;
}
.map-select .el-select-dropdown__list {
  padding: 0px;
}
.map-select .el-card__body {
  width: 380px;
  padding: 0px;
  height: 320px;
  overflow-y: auto;
  box-sizing: content-box;
  margin-left: 12px;
}
.map-select .el-card__header {
  padding: 0px 5px;
}
.map-select .el-scrollbar__wrap {
  max-height: 600px;
  margin-bottom: 0px !important;
  margin-right: 0px !important;
  overflow: hidden;
}
.map-select .select-tip {
  border-bottom: 1px solid #dadada;
}
.select-tip div {
  padding: 0px 5px;
  border-bottom: 1px solid #dadada;
}
.select-tip .history {
  overflow: hidden;
  padding: 4px 0;
}
.select-tip .history span {
  padding: 0px 5px;
  float: left;
  color: #428bca;
  height: 28px;
  line-height: 28px;
}
.select-card {
  font-weight: normal !important;
  font-size: 13px;
}
.select-content {
  padding: 2px 5px;
  overflow: hidden;
}
.select-content .s-title {
  font-weight: bold;
  float: left;
}
.select-content .s-txt {
  padding: 0px 5px;
  float: left;
}
.el-input__suffix {
  /* z-index: 99; */
}
</style>

