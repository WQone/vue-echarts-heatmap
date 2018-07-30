/* eslint-disable */

const init = (map) => {
  const styleOptions = {
    strokeColor: '#009688', // 边线颜色。
    fillColor: 'pink', // 填充颜色。当参数为空时，圆形将没有填充效果。
    strokeWeight: 3, // 边线的宽度，以像素为单位。
    strokeOpacity: 0.8, // 边线透明度，取值范围0 - 1。
    fillOpacity: 0.3, // 填充的透明度，取值范围0 - 1。
    strokeStyle: 'solid', // 边线的样式，solid或dashed。
  };
  //实例化鼠标绘制工具
  return new BMapLib.DrawingManager(map, {
    isOpen: false, // 是否开启绘制模式
    enableDrawingTool: true, // 是否显示工具栏
    drawingToolOptions: {
      anchor: BMAP_ANCHOR_TOP_RIGHT, //位置
			offset: new BMap.Size(5, 5), //偏离值
			scale: 0.8, //工具栏缩放比例
			drawingModes: [
				BMAP_DRAWING_CIRCLE
			]
    },
    circleOptions: styleOptions, // 圆的样式
    polylineOptions: styleOptions, // 线的样式
    polygonOptions: styleOptions, // 多边形的样式
    rectangleOptions: styleOptions, // 矩形的样式
  });
};

export default {
  init,
};
