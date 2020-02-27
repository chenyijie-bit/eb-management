<template>
  <div class="page">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>数据统计</el-breadcrumb-item>
      <el-breadcrumb-item>数据报表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <div id="main" style="width:100%;height:600px;"></div>
    </el-card>
  </div>
</template>

<script>
import echarts from "echarts";
export default {
  name: "",
  components: {},
  data() {
    return {
      options: {
        title: {
          text: "用户来源"
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            label: {
              backgroundColor: "#E9EEF3"
            }
          }
        },
        grid: {
          left: "3%",
          right: "3%",
          bottom: "3%",
          containLabel: true
        },
        xAxis: [{ boundaryGap: false }],
        yAxis: [
          {
            type: "value"
          }
        ]
      }
    };
  },
  created() {},
  async mounted() {
    var mychart = echarts.init(document.getElementById("main"));
    const { data: res } = await this.$http.get("reports/type/1");
    if (res.meta.status !== 200) {
      this.$message({
        message: res.meta.msg,
        type: "error"
      });
      return;
    }
    let result = Object.assign({}, this.options, res.data);
    mychart.setOption(result);
  }
};
</script>

<style scoped lang="less"></style>
