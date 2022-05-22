<template>
  <div id="test">
    <a-modal v-model="showQuality" title="裁判文书质量审查报告" :bodyStyle="bodyStyle" width="1000px">
      
      <div id="judgment" class="cha" ref="chart"></div>
    </a-modal>
  </div>
</template>

<script>
import html2Canvas from 'html2canvas'
import JsPDF from 'jspdf'

const echarts = require("echarts");
export default {
  data() {
    return {
      showQuality: false,
      bodyStyle: {
        height: '500px',
        width: '1000px'
      }
    };
  },
  methods: {
     
    showComponent() {
      this.showQuality = true;
      this.$nextTick(() => {this.initCharts()});
    },
    hideComponent() {
      this.showQuality = false;
    },
    initCharts() {
      // 初始化echarts实例
      console.log(this.$refs.chart)
      let myChart = echarts.init(this.$refs.chart);
      // 绘制图表
      myChart.setOption({
        title: {},
        tooltip: {},
        xAxis: {
          data: ["完整性", "一致性", "准确性", "法律条文适用", "审判偏离"],
        },
        yAxis: {},
        series: [
          {
            name: "评估结果",
            type: "bar",
            data: [50, 70, 86, 60, 100, 20],
          },
        ],
      });
    },
  },
  //加载页面就调用
  mounted() {
    this.initCharts();
  },
};
</script>
<style>
.cha {
  width: 1000px;
  height: 500px;
  margin: auto;
}
</style>

