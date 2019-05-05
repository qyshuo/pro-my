<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>数据统计</el-breadcrumb-item>
      <el-breadcrumb-item>数据报表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <div id="main" style="width:600px;height:400px;"></div>
    </el-card>
  </div>
</template>

<script>
import echarts from 'echarts'
export default {
  mounted() {
    this.tubiao()
  },
  methods: {
    async tubiao() {
      var myChart = echarts.init(document.getElementById('main'))
      // 获取图标的数据
      const { data: dt } = await this.$http.get('reports/type/1')
      //   console.log(dt)
      const option1 = dt.data

      // 指定图表的配置项和数据

      var option2 = {
        title: {
          text: '用户来源'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#6a7985'
            }
          }
        },

        toolbox: {
          feature: {
            saveAsImage: {}
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        }
      }

      //   let option = { ...option1, ...option2 }
      let options = { ...option1, ...option2 }
      // 使用刚指定的配置项和数据显示图表。
      myChart.setOption(options)
    }
  }
}
</script>

<style lang="less" scoped>
</style>
