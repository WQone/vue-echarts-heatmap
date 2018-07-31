/* eslint-disable */

const MP = (ak) => {
  return new Promise((resolve, reject) => {
    const scriptMap = document.createElement('script');
    scriptMap.type = 'text/javascript';
    scriptMap.src = 'http://api.map.baidu.com/api?v=2.0&ak=' + ak + '&callback=init';
    scriptMap.onerror = reject;
    document.head.appendChild(scriptMap);

    window.onload = () => {
      let index = 0;
      const jsSrc = [
        './static/DrawingManager_min.js',
        './static/Heatmap_min.js',
        './static/GeoUtils_min.js',
        './static/TextIconOverlay_min.js',
        './static/MarkerClusterer_min.js',
        './static/RectangleZoom_min.js',
      ];
      const callback = () => {
        index += 1;
        if (index === jsSrc.length) {
          resolve(BMap);
        }
      };

      for (let i = 0; i < jsSrc.length; i += 1) {
        const src = jsSrc[i];
        const $script = document.createElement('script');
        $script.type = 'text/javascript';
        $script.src = src;
        $script.onerror = reject;
        $script.onload = callback;
        document.head.appendChild($script);
      }
    };
  });
};
export default MP;
