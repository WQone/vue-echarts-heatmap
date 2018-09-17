<template>
  <div id="Map">

    <div class="leftnav">

      <p class="title">
        <span>
          <i class="icon iconfont icon-ditu"></i>人口分布数量/热力图</span>
      </p>

      <ul class="card" :style="hotShow? '': 'opacity: 0.4;'">
        <p class="card-title">
          <span>
            <i class="icon iconfont" @click="IsTypeShow(1)" :class="hotShow? 'icon-chakan-copy' : 'icon-yanjing'"></i>热力图</span>
        </p>
        <li class="card-list" v-for="item in hotList" :key="item" @click="changeType(item, 1)">
          <span>
            <i class="icon iconfont icon-dangqianweizhi1" :style="hotActive === item ? '':'color:white;'"></i>{{item}}</span>
        </li>
      </ul>
      <ul class="card" :style="numShow? '': 'opacity: 0.4;'" style="margin-bottom: 15px;">
        <p class="card-title">
          <span>
            <i class="icon iconfont" @click="IsTypeShow(2)" :class="numShow? 'icon-chakan-copy' : 'icon-yanjing'"></i>数量图</span>
        </p>
        <li class="card-list" v-for="item in numList" :key="item" @click="changeType(item, 2)">
          <span>
            <i class="icon iconfont icon-dangqianweizhi1" :style="numActive === item ? '':'color:white;'"></i>{{item}}</span>
        </li>
      </ul>

      <el-button class="btn-clear" @click="btnClear" :disabled="!overlayTools.length">清除图形</el-button>

    </div>
    <div v-show="!menuActive">
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
                  <span @click="getBoundary('绵阳市')">全市</span>
                  <span v-for="(item,index) in cityList" :key="index" @click="changeCity(item)">{{item.from}}</span>
                </p>
              </div>
              <div class="select-content">
                <div v-for="(item,index) in cityList" :key="index">
                  <span class="s-title" @click="changeCity(item)">{{item.from}}：</span>
                  <span class="s-txt" v-for="(iChild,indexC) in item.children" :key="indexC" @click="changeCity(iChild, 1)">{{iChild.name}}</span>
                </div>
                <div>
                  <span class="s-title">自定义供电区：</span>
                  <span class="s-txt" v-for="(item,index) in customCity" :key="index" @click="toCustomCity(item)">{{item.name}}</span>
                </div>
              </div>
            </el-card>
          </el-option>
        </el-select>
      </div>
      <div class="map-date">
        <Date @selectValue="selectValue"></Date>
      </div>
      <div class="tip-img"><img src="../../assets/img/density.png" /></div>
    </div>

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
  created() {
    this.dataList = this.convert.getCity(dataList, 1);
    this.cityList = this.convert.getCity(dataList);
    this.mapWidth = `width:${window.innerWidth - 400}px;`;
    window.onresize = () => {
      this.mapWidth = `width:${window.innerWidth - 400}px;`;
    };
  },
  watch: {
    overlayTools() {
      console.log('我监听到了');
    },
  },
  mounted() {
    this.$nextTick(() => {
      // 在此调用api
      MP(this.ak).then((BMap) => {
        this.map = new BMap.Map('allmap', { enableMapClick: false }); // 构造底图时，关闭底图可点功能
        this.map.centerAndZoom(new BMap.Point(104.676361, 31.468489), 11); // 初始化地图，设置中心点坐标和地图级别
        const mapStyle = {
          // features: ['road', 'building', 'water', 'land'], // 隐藏地图上的poi
          style: 'dark', // 设置地图风格为高端黑
        };
        this.map.setMapStyle(mapStyle);
        this.map.enableScrollWheelZoom(true); // 开启鼠标滚轮缩放

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

        this.initClick(); //  初始化绘制工具鼠标点击事件

        this.map.addEventListener('click', this.mapClick);
        this.map.addEventListener('mousemove', this.mapMouseMove);
      });
    });
  },
  data() {
    return {
      mapWidth: '', // 地图宽度
      ak: '1y2hRgyFgIGGkM9m9vmrmsLGsHvwnsUU',
      hotList: ['常驻人口', '工作人口', '实时人口'],
      numList: ['常驻人口', '工作人口', '实时人口'],
      menuActive: '',
      dialogVisible: false,
      hotActive: '常驻人口',
      numActive: '常驻人口',
      hotShow: true,
      numShow: true,
      dataList: [], // 基础所有数据
      cityList: [], // 城市集合
      city: '绵阳市',
      customCity: [
        {
          name: '区域1',
          myAddress: [
            { lng: 104.775993, lat: 31.631984 },
            { lng: 105.16, lat: 31.631984 },
            { lng: 104.780593, lat: 31.275146 },
          ],
        },
      ], // 自定义供电区0
      labelStyle: {
        //  label样式
        color: 'black',
        backgroundColor: 'rgba(255,255,255,.9)',
        padding: '5px',
        border: 'none',
        zIndex: 999,
      },
      // 标注信息窗口样式
      optStyle: {
        width: 50, // 信息窗口宽度
        height: 10, // 信息窗口高度
        enableMessage: true, // 设置允许信息窗发送短息
      },
      map: '',
      heatmapOverlay: '',
      markerClusterer: null, //  点聚合
      drawingManager: null,
      markerArr: [], // 标注点数组
      overlayTools: [], // 画图工具集合
      overlay: [], //  圆形选框/自定义选框
      mousePoint: { lng: 0, lat: 0 }, //  鼠标移动坐标
      circleLabel: null, //  绘制圆形标签 即半径显示
      myDrag: '',
      tipsLabel: null, //  鼠标提示标签
      isPolygonDraw: false, //  是否正在画多边形
      isPolygonIndex: 0, //  画多边形路上点击了多少次

      wuqian: [],
      infoWindowQ: '',
    };
  },
  methods: {
    // 短信菜单
    msgChange(val) {
      console.log(val);
      if (val === '正文模板' || val === '发送短信') {
        this.dialogVisible = true;
        this.menuActive = val;
      } else {
        this.dialogVisible = false;
        this.menuActive = val;
      }
    },
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
      this.menuActive = '';
      this.dataList = this.convert.getCity(dataList, 1);
      this.map.closeInfoWindow(this.infoWindowQ);
      if (type === 1) {
        if (!this.hotShow || this.hotActive === val) {
          return;
        }
        this.heatmapOverlay.setDataSet({ data: this.dataList, max: 80000 });
        if (this.numShow) {
          this.markerClusterer.clearMarkers();

          this.markerShow(this.dataList);
        }
        this.hotActive = val;
      } else {
        if (!this.numShow || this.numActive === val) {
          return;
        }
        this.markerClusterer.clearMarkers();

        this.markerShow(this.dataList);
        this.numActive = val;
      }
      for (let i = 0; i < this.overlayTools.length; i += 1) {
        this.map.removeOverlay(this.overlayTools[i].val);
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
          this.markerClusterer.clearMarkers();
          // for (let i = 0; i < this.markerArr.length; i += 1) {
          //   this.map.removeOverlay(this.markerArr[i]);
          // }
        } else {
          for (let i = 0; i < this.markerArr.length; i += 1) {
            const item = this.markerArr[i];
            if (this.overlayTools.length === 0) {
              this.markerClusterer.addMarker(item);
            } else if (this.overlayTools[0].type === 'polygon') {
              const polygon = new BMap.Polygon(this.overlayTools[0].val.getPath(), {
                strokeWeight: this.overlayTools[0].val.getStrokeWeight(),
              });
              if (BMapLib.GeoUtils.isPointInPolygon(item.point, polygon)) {
                this.markerClusterer.addMarker(item);
              }
            } else {
              const circle = new BMap.Circle(
                this.overlayTools[0].val.getCenter(),
                this.overlayTools[0].val.getRadius(),
                {
                  strokeWeight: this.overlayTools[0].val.getStrokeWeight(),
                },
              );
              if (BMapLib.GeoUtils.isPointInCircle(item.point, circle)) {
                this.markerClusterer.addMarker(item);
              }
            }
          }
        }
      }
    },
    // 改变当前地区
    changeCity(item, type) {
      console.log(item, this.city);
      this.getBoundary(item.class);
      this.map.closeInfoWindow(this.infoWindowQ);
      if (!type) {
        this.city = item.from;
        this.map.setZoom(11);
        return;
      }
      this.city = item.name;
      this.map.setZoom(14);
      const gc = new BMap.Geocoder();
      gc.getPoint(
        item.addr, // 根据具体地址查找经纬度
        (res) => {
          if (res) {
            this.map.panTo(new BMap.Point(res.lng, res.lat));
            const point = new BMap.Point(res.lng, res.lat);
            this.infoWindowQ = new BMap.InfoWindow(`${item.addr}-${item.count}人`, this.optStyle); // 创建信息窗口对象
            this.map.openInfoWindow(this.infoWindowQ, point); // 开启信息窗口
          } else {
            this.$message.error('没有找到当前的区域位置，请调整后重试哦~');
          }
          console.log(res);
        },
        '四川省',
      );
    },
    //  画圆回调
    circlecomplete(e) {
      if (!e.getRadius()) {
        this.drawingManager.close();
        return;
      }

      this.map.removeOverlay(this.tipsLabel);
      this.map.removeOverlay(this.overlay);
      this.overlay = e;
      this.saveMenu(this.overlay); // 创建右键菜单

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
      for (let i = 0; i < this.dataList.length; i += 1) {
        const item = this.dataList[i];
        if (BMapLib.GeoUtils.isPointInCircle(new BMap.Point(item.lng, item.lat), circle)) {
          arr.push(item);
        }
      }
      this.heatmapOverlay.setDataSet({ data: arr, max: 60000 });

      this.drawingManager.close();

      //  画结果的半径标签
      this.map.removeOverlay(this.circleLabel);
      this.circleLabel = new BMap.Label(
        `${(e.getRadius() / 1000).toFixed(1)} KM`, // 为lable填写内容
        {
          offset: new BMap.Size(0, 0), // label的偏移量，为了让label的中心显示在点上
          position: new BMap.Point(this.mousePoint.lng, this.mousePoint.lat),
        },
      ); // label的位置
      this.circleLabel.setStyle(this.labelStyle); // 为label添加鼠标提示
      this.map.addOverlay(this.circleLabel); // 把label添加到地图上
    },
    //  多边形回调
    polygoncomplete(e) {
      this.isPolygonDraw = true;
      this.isPolygonIndex = 0;
      this.map.removeOverlay(this.circleLabel);
      this.map.removeOverlay(this.tipsLabel);

      console.log('polygoncomplete', e);
      this.map.removeOverlay(this.overlay);
      this.overlay = e;
      // 监听鼠标在圆圈内，显示label
      // this.overlay.addEventListener('mouseover', (e) => {
      //   console.log(e);
      //   this.tipsLabel.setContent('点击右键可以保存该区域');
      //   this.map.addOverlay(this.tipsLabel); // 把label添加到地图上
      // });
      // // 否则移除label
      // this.overlay.addEventListener('mouseout', (e) => {
      //   console.log(e);
      //   this.map.removeOverlay(this.tipsLabel);
      // });
      this.overlay.disableEditing(); // 多边形不可编辑

      this.saveMenu(this.overlay); // 创建右键菜单

      const polygon = new BMap.Polygon(e.getPath(), {
        strokeWeight: e.getStrokeWeight(),
      });
      e.setStrokeStyle('solid');

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
      for (let i = 0; i < this.dataList.length; i += 1) {
        const item = this.dataList[i];
        if (BMapLib.GeoUtils.isPointInPolygon(new BMap.Point(item.lng, item.lat), polygon)) {
          arr.push(item);
        }
      }
      this.heatmapOverlay.setDataSet({ data: arr, max: 60000 });
    },
    overlaycomplete(e) {
      console.log(444, e.drawingMode);
      for (let i = 0; i < this.overlayTools.length; i += 1) {
        this.map.removeOverlay(this.overlayTools[i].val);
      }
      this.map.closeInfoWindow(this.infoWindowQ);
      this.overlayTools = [];
      this.overlayTools.push({ val: e.overlay, type: e.drawingMode });
    },
    // 向地图添加标注
    markerShow(val) {
      this.markerArr = [];
      const pointArray = [];
      for (let i = 0; i < this.dataList.length; i += 1) {
        const item = this.dataList[i];
        const marker = new BMap.Marker(new BMap.Point(item.lng, item.lat), {
          // 设置Marker的icon属性为Symbol-样式与偏移
          // eslint-disable-next-line
          icon: new BMap.Symbol(BMap_Symbol_SHAPE_POINT, {
            scale: 1, // 图标缩放大小
            fillColor: 'red', // 填充颜色
            fillOpacity: 0.8, // 填充透明度
          }),
          // 设置标注的标题，当鼠标移至标注上时显示此标题
          title: `${item.addr}-${item.count}人`,
        }); // 创建标注
        pointArray[i] = new BMap.Point(item.lng, item.lat);
        // this.map.addOverlay(marker); // 将标注添加到地图中
        const label = new BMap.Label(`${item.count}人`, { offset: new BMap.Size(-20, -20) });
        marker.setLabel(label);
        this.addClickHandler(item.count, item.addr, marker);
        this.markerArr.push(marker);
      }
      this.markerClusterer = new BMapLib.MarkerClusterer(this.map, { markers: this.markerArr }); // 点聚合

      // this.map.setViewport(pointArray); // 让所有点在视野范围内
    },
    // 标注点击事件
    addClickHandler(count, addr, marker) {
      marker.addEventListener('click', (e) => {
        this.openInfo(count, addr, e);
      });
    },
    // 标注信息窗口
    openInfo(count, addr, e) {
      const p = e.target;
      const point = new BMap.Point(p.getPosition().lng, p.getPosition().lat);
      const infoWindow = new BMap.InfoWindow(`${addr}-${count}人`, this.optStyle); // 创建信息窗口对象
      this.map.openInfoWindow(infoWindow, point); // 开启信息窗口
    },
    // 加载热力图
    heatmapShow() {
      this.heatmapOverlay = new BMapLib.HeatmapOverlay({ radius: 20 });
      this.map.addOverlay(this.heatmapOverlay);
      this.heatmapOverlay.setDataSet({ data: this.dataList, max: 80000 });

      this.heatmapOverlay.setOptions({
        gradient: {
          0: 'blue',
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
      const circleOptions = {
        strokeColor: '#9B506F', // 边线颜色。
        fillColor: '#9B506F', // 填充颜色。当参数为空时，圆形将没有填充效果。
        strokeWeight: 3, // 边线的宽度，以像素为单位。
        strokeOpacity: 0.8, // 边线透明度，取值范围0 - 1。
        fillOpacity: 0.3, // 填充的透明度，取值范围0 - 1。
        strokeStyle: 'solid', // 边线的样式，solid或dashed。
      };
      const polygonOptions = {
        strokeColor: '#9B506F', // 边线颜色。
        fillColor: '#9B506F', // 填充颜色。当参数为空时，圆形将没有填充效果。
        strokeWeight: 3, // 边线的宽度，以像素为单位。
        strokeOpacity: 0.8, // 边线透明度，取值范围0 - 1。
        fillOpacity: 0.3, // 填充的透明度，取值范围0 - 1。
        strokeStyle: 'dashed', // 边线的样式，solid或dashed。
        enableEditing: false,
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
        circleOptions, // 圆的样式
        // polylineOptions: styleOptionsLine, // 线的样式
        polygonOptions, // 多边形的样式
        // rectangleOptions: styleOptions, // 矩形的样式
      });
      // 添加鼠标绘制工具监听事件，用于获取绘制结果
      this.drawingManager.addEventListener('overlaycomplete', this.overlaycomplete);
      this.drawingManager.addEventListener('circlecomplete', this.circlecomplete);
      this.drawingManager.addEventListener('polygoncomplete', this.polygoncomplete);
    },
    // 覆盖物上添加右键菜单
    saveMenu(overlay) {
      const saveMarker = () => {
        console.log(overlay.getPath());
        let a = '';
        const b = [];
        for (let i = 0; i < overlay.getPath().length; i += 1) {
          a += `（${overlay.getPath()[i].lat}，${overlay.getPath()[i].lng}）`;
          b.push({ lat: overlay.getPath()[i].lat, lng: overlay.getPath()[i].lng });
        }
        a = `<div class="dg-message">您创建的${
          overlay.getPath().length
        }个坐标点分别为：<br/>${a}<br/><br/></div>请输入自定义的供电区名称`;
        this.$prompt(a, '自定义供电区', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          dangerouslyUseHTMLString: true,
        })
          .then(({ value }) => {
            this.$message({
              type: 'success',
              message: '保存成功',
            });
            console.log(value, b);
            this.customCity.push({ name: value, myAddress: b, val: overlay });
            this.btnClear();
          })
          .catch(() => {});
      };
      const markerMenu = new BMap.ContextMenu();
      markerMenu.addItem(new BMap.MenuItem('保存', saveMarker.bind(overlay)));
      overlay.addContextMenu(markerMenu);
    },

    btnClear() {
      for (let i = 0; i < this.overlayTools.length; i += 1) {
        this.map.removeOverlay(this.overlayTools[i].val);
      }
      this.overlayTools = [];
      this.markerClusterer.clearMarkers();
      this.markerShow(); // 标注
      this.heatmapShow(); // 热力图
      this.map.removeOverlay(this.circleLabel);
      this.map.closeInfoWindow(this.infoWindowQ);
    },
    //  地图移动事件
    mapMouseMove(e) {
      this.mousePoint = e.point;
      if (this.tipsLabel) {
        this.tipsLabel.setPosition(new BMap.Point(this.mousePoint.lng, this.mousePoint.lat));
      }
    },
    //  初始化绘制工具鼠标点击事件
    initClick() {
      //  初始化圆形
      const $BMapLibCircle = document.querySelector('.BMapLib_box.BMapLib_circle');
      $BMapLibCircle.onclick = (e) => {
        this.tipsLabel = new BMap.Label(
          '选中一点按紧拖放进行画图,可右键保存该区域', // 为lable填写内容
          {
            offset: new BMap.Size(0, 0), // label的偏移量，为了让label的中心显示在点上
            position: new BMap.Point(this.mousePoint.lng, this.mousePoint.lat),
          },
        ); // label的位置
        this.tipsLabel.setStyle(this.labelStyle); // 为label添加鼠标提示
        this.map.addOverlay(this.tipsLabel); // 把label添加到地图上
      };

      //  初始化多边形的
      const $BMapLibPolygon = document.querySelector('.BMapLib_box.BMapLib_polygon');
      $BMapLibPolygon.onclick = (e) => {
        this.isPolygonDraw = true;
        this.isPolygonIndex = 0;
        this.tipsLabel = new BMap.Label(
          '点击开始绘制区域', // 为lable填写内容
          {
            offset: new BMap.Size(0, 0), // label的偏移量，为了让label的中心显示在点上
            position: new BMap.Point(this.mousePoint.lng, this.mousePoint.lat),
          },
        ); // label的位置
        this.tipsLabel.setStyle(this.labelStyle); // 为label添加鼠标提示
        this.map.addOverlay(this.tipsLabel); // 把label添加到地图上
      };
    },
    //  监听地图点击事件
    mapClick(e) {
      this.isPolygonIndex += 1;
      if (this.tipsLabel && this.isPolygonIndex === 1) {
        this.tipsLabel.setContent('点击继续绘制');
      } else if (this.tipsLabel && this.isPolygonIndex) {
        this.tipsLabel.setContent('双击完成绘制,可右键保存该区域');
      }
    },
    // 日期搜索值
    selectValue(val) {
      console.log(val);
      this.dataList = this.convert.getCity(dataList, 1);
      this.heatmapOverlay.setDataSet({ data: this.dataList, max: 80000 });
      this.markerClusterer.clearMarkers();
      for (let i = 0; i < this.overlayTools.length; i += 1) {
        this.map.removeOverlay(this.overlayTools[i].val);
      }
      this.map.closeInfoWindow(this.infoWindowQ);
      this.markerShow(this.dataList);
    },
    // 跳转自定义区域
    toCustomCity(val) {
      console.log(val);
      const PolygonArr = [];
      console.log(this.overlayTools);
      for (let i = 0; i < this.overlayTools.length; i += 1) {
        this.map.removeOverlay(this.overlayTools[i].val);
      }
      this.overlayTools = [];
      for (let i = 0; i < val.myAddress.length; i += 1) {
        const item = val.myAddress[i];
        PolygonArr.push(new BMap.Point(item.lng, item.lat));
      }
      const polygon = new BMap.Polygon(PolygonArr, {
        strokeColor: '#9B506F', // 边线颜色。
        fillColor: '#9B506F', // 填充颜色。当参数为空时，圆形将没有填充效果。
        strokeWeight: 3, // 边线的宽度，以像素为单位。
        strokeOpacity: 0.8, // 边线透明度，取值范围0 - 1。
        fillOpacity: 0.3, // 填充的透明度，取值范围0 - 1。
        strokeStyle: 'solid', // 边线的样式，solid或dashed。
      }); // 创建多边形
      this.map.addOverlay(polygon); // 增加多边形
      this.overlayTools.push({ val: polygon, type: 'polygon' });
      this.getMakerLess(this.markerArr, this.dataList, polygon);
    },
    // 添加行政区划边界框
    getBoundary(val) {
      const bdary = new BMap.Boundary();
      this.markerClusterer.clearMarkers();
      this.wuqian = [];
      for (let i = 0; i < this.overlayTools.length; i += 1) {
        this.map.removeOverlay(this.overlayTools[i].val);
      }
      this.overlayTools = [];
      bdary.get(val, (rs) => {
        // 获取行政区域
        // this.map.clearOverlays(); // 清除地图覆盖物
        const count = rs.boundaries.length; // 行政区域的点有多少个
        if (count === 0) {
          this.$message.error('未能获取当前输入行政区域');
          return;
        }
        let pointArray = [];
        for (let i = 0; i < count; i += 1) {
          const ply = new BMap.Polygon(rs.boundaries[i], {
            strokeWeight: 2,
            strokeColor: '#ff0000',
            fillOpacity: 0.2, // 填充透明度
          }); // 建立多边形覆盖物
          this.map.addOverlay(ply); // 添加覆盖物
          this.overlayTools.push({ val: ply, type: 'polygon' });
          pointArray = pointArray.concat(ply.getPath());

          const mypolygon = new BMap.Polygon(ply.getPath(), {
            strokeWeight: ply.getStrokeWeight(),
          });
          console.log(mypolygon);
          //  标点
          for (let j = 0; j < this.markerArr.length; j += 1) {
            const item = this.markerArr[j];
            if (BMapLib.GeoUtils.isPointInPolygon(item.point, mypolygon)) {
              this.markerClusterer.addMarker(item);
            }
          }

          //  热力图
          for (let m = 0; m < this.dataList.length; m += 1) {
            const item = this.dataList[m];
            if (BMapLib.GeoUtils.isPointInPolygon(new BMap.Point(item.lng, item.lat), mypolygon)) {
              this.wuqian.push(item);
            }
          }
        }
        this.map.setViewport(pointArray); // 调整视野
        console.log(this.wuqian);
        this.heatmapOverlay.setDataSet({ data: this.wuqian, max: 80000 });
      });
    },
    // 加载覆盖物内的标注和热力图
    // markerData-所有标注点数据集合
    // hotData-所有点数据
    // mypolygon-覆盖物数据
    getMakerLess(markerData, hotData, mypolygon) {
      const arr = [];
      this.markerClusterer.clearMarkers();
      //  标点
      for (let j = 0; j < markerData.length; j += 1) {
        const item = markerData[j];
        if (BMapLib.GeoUtils.isPointInPolygon(item.point, mypolygon)) {
          this.markerClusterer.addMarker(item);
        }
      }
      //  热力图
      for (let m = 0; m < hotData.length; m += 1) {
        const item = hotData[m];
        if (BMapLib.GeoUtils.isPointInPolygon(new BMap.Point(item.lng, item.lat), mypolygon)) {
          arr.push(item);
        }
      }
      console.log('444', arr);
      this.heatmapOverlay.setDataSet({ data: arr, max: 60000 });
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.btn-clear {
  width: 100%;
  margin-top: 20px;
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
  overflow: hidden;
  margin: 0 auto;
}
.allmap {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  right: 0;
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
  overflow-y: auto;
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
.el-submenu__title {
  padding-left: 25px !important;
}
.el-submenu .el-menu-item {
  padding-left: 90px !important;
}
.dg-message {
  max-height: 120px;
  overflow-y: auto;
}
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
  width: 474px;
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
