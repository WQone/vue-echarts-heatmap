<template>
  <div class="Map">
    {{msg}}
    <!-- <div id="myCharts" ref="myCharts" style="height:500px;"></div> -->
  </div>
</template>

<script>
import echarts from 'echarts';
// import mapEcharts from './mapEcharts';

export default {
  name: 'Map',
  // mounted() {
  //   this.myCharts = echarts.init(this.$refs.myCharts);
  //   this.myCharts.setOption(mapEcharts.mapOption);
  // },
  data() {
    return {
      msg: 'Welcome to Your Vue.js App',
    };
  },
  methods: {},
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
