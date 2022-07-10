<template>

  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
import resize from './mixins/resize'
import {getChartData} from "@/api/product/category/category";

export default {
  mixins: [resize],
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '310px'
    }
  },
  data() {
    return {
      chart: null,
      charData:[]
    }
  },
  mounted() {

    this.$nextTick(() => {
      this.initChart()
    })
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    initChart() {
      getChartData().then(  res =>{
         this.charData = res.data;
        this.chart = echarts.init(this.$el, 'macarons')
        let names = this.charData.map(item =>{
          return item.name
        })
        this.chart.setOption({
          tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b} : {c} ({d}%)'
          },
          legend: {
            left: 'center',
            bottom: '10',
            data: names
          },
          series: [
            {
              name: '商品分类',
              type: 'pie',
              roseType: 'radius',
              radius: [15, 95],
              center: ['50%', '38%'],
              data:  this.charData,
              animationEasing: 'cubicInOut',
              animationDuration: 2600
            }
          ]
        })
      })

    }
  }
}
</script>
