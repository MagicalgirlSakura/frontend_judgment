<template>
  <div id="test">
    <a-modal v-model="showQuality" title="裁判文书质量审查报告" :bodyStyle="bodyStyle" width="1000px">
      <a-button class="PDF" type="primary" @click="toPdf" size="small">下载为PDF</a-button>
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
     toPdf() {
        html2canvas(
        //这个是想要导出的DOM元素的id
            document.getElementById("test"),
            {
                dpi: 172,//导出pdf清晰度
                onrendered: function (canvas) {
                    var contentWidth = canvas.width;
                    var contentHeight = canvas.height;

                    //一页pdf显示html页面生成的canvas高度;
                    var pageHeight = contentWidth / 592.28 * 841.89;
                    //未生成pdf的html页面高度
                    var leftHeight = contentHeight;
                    //pdf页面偏移
                    var position = 0;
                    //html页面生成的canvas在pdf中图片的宽高（a4纸的尺寸[595.28,841.89]）
                    var imgWidth = 595.28;
                    var imgHeight = 592.28 / contentWidth * contentHeight;

                    var pageData = canvas.toDataURL('image/jpeg', 1.0);
                    var pdf = new jsPDF('', 'pt', 'a4');

                    //有两个高度需要区分，一个是html页面的实际高度，和生成pdf的页面高度(841.89)
                    //当内容未超过pdf一页显示的范围，无需分页
                    if (leftHeight < pageHeight) {
                        pdf.addImage(pageData, 'JPEG', 0, 0, imgWidth, imgHeight);
                    } else {
                        while (leftHeight > 0) {
                            pdf.addImage(pageData, 'JPEG', 0, position, imgWidth, imgHeight)
                            leftHeight -= pageHeight;
                            position -= 841.89;
                            //避免添加空白页
                            if (leftHeight > 0) {
                                pdf.addPage();
                            }
                        }
                    }
                    pdf.save('judgment.pdf');
                },
                //背景设为白色（默认为黑色）
                background: "#fff"
            })
    },
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

