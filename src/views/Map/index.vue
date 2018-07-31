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
            <i class="icon iconfont" @click="IsTypeShow(1)" :class="hotShow? 'icon-chakan-copy' : 'icon-yanjing'"></i>用电人口分布热力图</span>
        </p>
        <li class="card-list" v-for="item in hotList" :key="item" @click="changeType(item, 1)">
          <span>
            <i class="icon iconfont icon-dangqianweizhi1" :style="hotActive === item ? '':'color:white;'"></i>{{item}}</span>
        </li>
      </ul>
      <ul class="card" :style="numShow? '': 'opacity: 0.4;'">
        <p class="card-title">
          <span>
            <i class="icon iconfont" @click="IsTypeShow(2)" :class="numShow? 'icon-chakan-copy' : 'icon-yanjing'"></i>用电人口分布数量图</span>
        </p>
        <li class="card-list" v-for="item in numList" :key="item" @click="changeType(item, 2)">
          <span>
            <i class="icon iconfont icon-dangqianweizhi1" :style="numActive === item ? '':'color:white;'"></i>{{item}}</span>
        </li>
      </ul>
    </div>

    <div id="allmap" class="allmap"></div>

    <div class="map-button">
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
            <div class="select-content">
              <div v-for="(item,index) in cityList" :key="index">
                <span class="s-title" @click="changeCity(item.name)">{{item.name}}：</span>
                <span class="s-txt" v-for="iChild in item.children" :key="iChild" @click="changeCity(iChild)">{{iChild}}</span>
              </div>
            </div>
          </el-card>
        </el-option>
      </el-select>
    </div>
    <div class="map-date">
      <Date></Date>
    </div>
    <div class="tip-img"><img src="../../assets/img/density.png" /></div>
  </div>
</template>

<script>
/* global BMap */
/* global BMapLib */

import MP from './map';
import dataList from './data';
import Date from './../../components/Date';

export default {
  name: 'Map',
  components: {
    Date,
  },
  mounted() {
    this.$nextTick(() => {
      // 在此调用api
      MP(this.ak).then((BMap) => {
        this.map = new BMap.Map('allmap', { enableMapClick: false }); // 构造底图时，关闭底图可点功能
        this.map.centerAndZoom(new BMap.Point(104.73, 31.47), 14); // 初始化地图，设置中心点坐标和地图级别
        const mapStyle = {
          // features: ['road', 'building', 'water', 'land'], // 隐藏地图上的poi
          style: 'dark', // 设置地图风格为高端黑
        };
        this.map.setMapStyle(mapStyle);
        this.map.enableScrollWheelZoom(true); // 开启鼠标滚轮缩放
        // 自定义图片控件
        // eslint-disable-next-line
        // const myControl = new BMap.CopyrightControl({ anchor: BMAP_ANCHOR_BOTTOM_RIGHT }); // 设置版权控件位置
        // this.map.addControl(myControl); // 添加版权控件
        // myControl.addCopyright({
        //   id: 1,
        //   content: "<a href='#' style='font-size:100px;background:yellow'>我是自定义版权控件呀</a>",
        //   bounds: this.map.getBounds(),
        // });
        this.map.addControl(
          // 平移缩放控件
          new BMap.NavigationControl({
            // eslint-disable-next-line
            type: BMAP_NAVIGATION_CONTROL_SMALL,
            // eslint-disable-next-line
            anchor: BMAP_ANCHOR_BOTTOM_RIGHT,
            offset: new BMap.Size(15, 15),
          }),
        );
        this.checkhHtml5();
        this.markerShow(); // 标注
        this.heatmapShow(); // 热力图
        this.drawingShow(); // 画图功能
      });
    });
  },
  data() {
    return {
      map: '',
      heatmapOverlay: '',
      markerClusterer: null, //  点聚合
      drawingManager: null,
      markerArr: [], // 标注点数组
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
      overlay: [], //  圆形选框/自定义选框
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
    // 改变热力图1/数量图2-类型
    changeType(val, type) {
      if (type === 1) {
        if (!this.hotShow) {
          return;
        }
        this.hotActive = val;
      } else {
        if (!this.numShow) {
          return;
        }
        this.numActive = val;
      }
      console.log(val);
    },
    // 显示隐藏热力1/数量2-图
    IsTypeShow(type) {
      if (type === 1) {
        this.hotShow = !this.hotShow;
        if (!this.hotShow) {
          this.heatmapOverlay.hide();
        } else {
          this.heatmapOverlay.show();
        }
      } else {
        this.numShow = !this.numShow;
        if (!this.numShow) {
          for (let i = 0; i < this.markerArr.length; i += 1) {
            this.map.removeOverlay(this.markerArr[i]);
          }
        } else {
          for (let i = 0; i < this.markerArr.length; i += 1) {
            this.map.addOverlay(this.markerArr[i]);
          }
        }
      }
    },
    // 改变当前地区
    changeCity(val) {
      console.log(val, this.city);
      this.city = val;
    },
    //  画圆回调
    circlecomplete(e) {
      this.map.removeOverlay(this.overlay);
      this.overlay = e;

      const circle = new BMap.Circle(e.getCenter(), e.getRadius(), {
        strokeWeight: e.getStrokeWeight(),
      });

      //  标点
      this.markerClusterer.clearMarkers();
      for (let i = 0; i < this.markerArr.length; i += 1) {
        const item = this.markerArr[i];
        if (BMapLib.GeoUtils.isPointInCircle(item.point, circle)) {
          this.markerClusterer.addMarker(item);
        }
      }

      //  热力图
      const arr = [];
      for (let i = 0; i < dataList.length; i += 1) {
        const item = dataList[i];
        if (BMapLib.GeoUtils.isPointInCircle(new BMap.Point(item.lng, item.lat), circle)) {
          arr.push(item);
        }
      }
      this.heatmapOverlay.setDataSet({ data: arr, max: 100 });
    },
    //  多边形回调
    polygoncomplete(e) {
      this.map.removeOverlay(this.overlay);
      this.overlay = e;

      const polygon = new BMap.Polygon(e.getPath(), {
        strokeWeight: e.getStrokeWeight(),
      });

      //  标点
      this.markerClusterer.clearMarkers();
      for (let i = 0; i < this.markerArr.length; i += 1) {
        const item = this.markerArr[i];
        if (BMapLib.GeoUtils.isPointInPolygon(item.point, polygon)) {
          this.markerClusterer.addMarker(item);
        }
      }

      //  热力图
      const arr = [];
      for (let i = 0; i < dataList.length; i += 1) {
        const item = dataList[i];
        if (BMapLib.GeoUtils.isPointInPolygon(new BMap.Point(item.lng, item.lat), polygon)) {
          arr.push(item);
        }
      }
      this.heatmapOverlay.setDataSet({ data: arr, max: 100 });
    },
    // 随机向地图添加25个标注
    markerShow() {
      this.markerArr = [];
      const pointArray = [];
      for (let i = 0; i < dataList.length; i += 1) {
        const item = dataList[i];
        const marker = new BMap.Marker(new BMap.Point(item.lng, item.lat), {
          // 设置Marker的icon属性为Symbol-样式与偏移
          // eslint-disable-next-line
          icon: new BMap.Symbol(BMap_Symbol_SHAPE_POINT, {
            scale: 1, // 图标缩放大小
            fillColor: 'red', // 填充颜色
            fillOpacity: 0.8, // 填充透明度
          }),
          // 设置标注的标题，当鼠标移至标注上时显示此标题
          title: item.count,
        }); // 创建标注
        pointArray[i] = new BMap.Point(item.lng, item.lat);
        // this.map.addOverlay(marker); // 将标注添加到地图中
        this.addClickHandler(item.count, marker);
        this.markerArr.push(marker);
      }
      this.markerClusterer = new BMapLib.MarkerClusterer(this.map, { markers: this.markerArr }); // 点聚合

      // this.map.setViewport(pointArray); // 让所有点在视野范围内
    },
    // 标注点击事件
    addClickHandler(content, marker) {
      marker.addEventListener('click', (e) => {
        this.openInfo(content, e);
      });
    },
    // 标注信息窗口
    openInfo(content, e) {
      const opts = {
        width: 50, // 信息窗口宽度
        height: 10, // 信息窗口高度
        title: '信息窗口', // 信息窗口标题
        enableMessage: true, // 设置允许信息窗发送短息
      };
      const p = e.target;
      const point = new BMap.Point(p.getPosition().lng, p.getPosition().lat);
      const infoWindow = new BMap.InfoWindow(content.toString(), opts); // 创建信息窗口对象
      this.map.openInfoWindow(infoWindow, point); // 开启信息窗口
    },
    // 加载热力图
    heatmapShow() {
      this.heatmapOverlay = new BMapLib.HeatmapOverlay({ radius: 20 });
      this.map.addOverlay(this.heatmapOverlay);
      this.heatmapOverlay.setDataSet({ data: dataList, max: 100 });

      this.heatmapOverlay.setOptions({
        gradient: {
          0.05: 'blue',
          0.2: 'rgb(117,211,248)',
          0.5: 'rgb(0, 255, 0)',
          0.7: '#ffea00',
          1.0: 'red',
        },
      });
      this.heatmapOverlay.show();
    },
    // 加载画图功能
    drawingShow() {
      // const myDrag = new BMapLib.RectangleZoom(this.map, {
      //   followText: '拖拽鼠标进行操作',
      // });
      // myDrag.open(); //开启拉框放大
      const getOptions = (Edit) => {
        const styleOptions = {
          strokeColor: '#9B506F', // 边线颜色。
          fillColor: '#9B506F', // 填充颜色。当参数为空时，圆形将没有填充效果。
          strokeWeight: 3, // 边线的宽度，以像素为单位。
          strokeOpacity: 0.8, // 边线透明度，取值范围0 - 1。
          fillOpacity: 0.3, // 填充的透明度，取值范围0 - 1。
          strokeStyle: 'solid', // 边线的样式，solid或dashed。
          enableEditing: Edit,
        };
        return styleOptions;
      };
      this.drawingManager = new BMapLib.DrawingManager(this.map, {
        isOpen: false, // 是否开启绘制模式
        enableDrawingTool: true, // 是否显示工具栏
        drawingToolOptions: {
          // eslint-disable-next-line
          anchor: BMAP_ANCHOR_TOP_RIGHT, // 位置
          offset: new BMap.Size(5, 5), // 偏离值
          scale: 0.8, // 工具栏缩放比例
          // eslint-disable-next-line
          drawingModes: [BMAP_DRAWING_CIRCLE, BMAP_DRAWING_POLYGON],
        },
        circleOptions: getOptions(), // 圆的样式
        // polylineOptions: styleOptionsLine, // 线的样式
        polygonOptions: getOptions(false), // 多边形的样式
        // rectangleOptions: styleOptions, // 矩形的样式
      });
      this.drawingManager.addEventListener('circlecomplete', this.circlecomplete);
      this.drawingManager.addEventListener('polygoncomplete', this.polygoncomplete);
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
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
.tip-img {
  position: absolute;
  z-index: 10;
  left: 320px;
  bottom: 6px;
  width: auto;
  height: 60px;
}
.tip-img img {
  height: 100%;
}
.map-date {
  position: absolute;
  z-index: 10;
  left: 470px;
  top: 6px;
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
  width: 400px;
  padding: 5px 0px;
  box-sizing: content-box;
  margin-left: 12px;
}
.map-select .el-card__header {
  padding: 0px 7px;
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
  cursor: auto;
}
.select-tip .history {
  overflow: hidden;
  padding: 4px 0;
}
.select-tip .history span {
  padding: 0px 5px;
  float: left;
  color: #3d6dcc;
  height: 28px;
  line-height: 28px;
}
.select-card {
  font-weight: normal !important;
  font-size: 13px;
}
.select-content {
  height: 240px;
  overflow-y: auto;
}
.select-content div {
  padding: 2px 5px;
  overflow: hidden;
}
.select-content .s-title {
  font-weight: bold;
  float: left;
  color: #3d6dcc;
}
.select-content .s-txt {
  padding: 0px 5px;
  float: left;
  color: #3d6dcc;
  font-size: 12px;
}
</style>
