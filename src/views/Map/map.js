/* eslint-disable */

const MP = (ak) => {
  return new Promise((resolve, reject) => {
    const scriptMap = document.createElement('script');
    scriptMap.type = 'text/javascript';
    scriptMap.src = 'http://api.map.baidu.com/api?v=2.0&ak=' + ak + '&callback=init';
    scriptMap.onerror = reject;
    document.head.appendChild(scriptMap);

    window.onload = () => {
      const scriptDrawingManager = document.createElement('script');
      scriptDrawingManager.type = 'text/javascript';
      scriptDrawingManager.src = './static/DrawingManager_min.js';
      scriptDrawingManager.onload = () => {
        // 增
        const scriptHeatmap = document.createElement('script');
        scriptHeatmap.type = 'text/javascript';
        scriptHeatmap.src = './static/Heatmap_min.js';
        scriptHeatmap.onload = () => {
          resolve(BMap);
        };
        scriptHeatmap.onerror = reject;
        document.head.appendChild(scriptHeatmap);
      };
      scriptDrawingManager.onerror = reject;
      document.head.appendChild(scriptDrawingManager);
    };
  });
};
export default MP;
