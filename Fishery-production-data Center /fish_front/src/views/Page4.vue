<template>
  <div class="app-container">
    <div class="button-group">
      <button @click="openLeftDrawer" class="action-button">渔场信息</button>
      <button @click="openRightDrawer" class="action-button">水质信息</button>
    </div>

    <!-- 左侧抽屉 - 渔场信息 -->
    <el-drawer
        v-model="leftDrawer"
        title="渔场详细信息"
        direction="ltr"
        :size="leftDrawerSize"
        :before-close="handleLeftClose"
        custom-class="custom-drawer"
        :wrapperClosable="false"
        destroy-on-close
    >
      <div class="drawer-content">
        <div class="drawer-header">
          <h2>渔场数据分析</h2>
          <el-button @click="closeLeftDrawer" type="primary" size="small">返回主页</el-button>
        </div>

        <div class="time-selector">
          <el-radio-group v-model="fisheryTimeRange" @change="updateFisheryCharts">
            <el-radio-button label="day">日</el-radio-button>
            <el-radio-button label="week">周</el-radio-button>
            <el-radio-button label="month">月</el-radio-button>
            <el-radio-button label="year">年</el-radio-button>
          </el-radio-group>
        </div>

        <div class="content-section">
          <h3>渔场详细信息表</h3>
          <el-table :data="fisheryTableData" border style="width: 100%" height="250">
            <el-table-column prop="name" label="渔场名称" width="180" />
            <el-table-column prop="location" label="位置" width="180" />
            <el-table-column prop="area" label="面积(公顷)" />
            <el-table-column prop="fishType" label="主要鱼种" />
            <el-table-column prop="yield" label="产量(吨)" />
          </el-table>
        </div>

        <div class="content-section">
          <h3>捕鱼量统计表</h3>
          <el-table :data="fisheryStatsTableData" border style="width: 100%" height="250">
            <el-table-column prop="date" label="日期" width="180" />
            <el-table-column prop="totalYield" label="总产量(吨)" />
            <el-table-column prop="avgYield" label="平均产量(吨)" />
            <el-table-column prop="maxYield" label="最高产量(吨)" />
            <el-table-column prop="minYield" label="最低产量(吨)" />
          </el-table>
        </div>

        <div class="content-section">
          <h3>捕鱼量统计图</h3>
          <div ref="fisheryChart" style="width: 100%; height: 400px;"></div>
        </div>
      </div>
    </el-drawer>

    <!-- 右侧抽屉 - 水质信息 -->
    <el-drawer
        v-model="rightDrawer"
        title="水质质量信息"
        direction="rtl"
        :size="rightDrawerSize"
        :before-close="handleRightClose"
        custom-class="custom-drawer"
        :wrapperClosable="false"
        destroy-on-close
    >
      <div class="drawer-content">
        <div class="drawer-header">
          <h2>水质数据分析</h2>
          <el-button @click="closeRightDrawer" type="primary" size="small">返回主页</el-button>
        </div>

        <div class="time-selector">
          <el-radio-group v-model="waterTimeRange" @change="updateWaterCharts">
            <el-radio-button label="day">日</el-radio-button>
            <el-radio-button label="week">周</el-radio-button>
            <el-radio-button label="month">月</el-radio-button>
            <el-radio-button label="year">年</el-radio-button>
          </el-radio-group>
        </div>

        <div class="content-section">
          <h3>水质质量分数表</h3>
          <el-table :data="waterQualityTableData" border style="width: 100%" height="250">
            <el-table-column prop="location" label="监测点" width="180" />
            <el-table-column prop="ph" label="PH值" />
            <el-table-column prop="oxygen" label="溶解氧(mg/L)" />
            <el-table-column prop="nitrogen" label="总氮(mg/L)" />
            <el-table-column prop="phosphorus" label="总磷(mg/L)" />
            <el-table-column prop="score" label="水质评分" />
          </el-table>
        </div>

        <div class="content-section">
          <h3>水质统计表</h3>
          <el-table :data="waterStatsTableData" border style="width: 100%" height="250">
            <el-table-column prop="date" label="日期" width="180" />
            <el-table-column prop="avgScore" label="平均评分" />
            <el-table-column prop="maxScore" label="最高评分" />
            <el-table-column prop="minScore" label="最低评分" />
            <el-table-column prop="goodDays" label="优良天数" />
          </el-table>
        </div>

        <div class="content-section">
          <h3>水质统计图</h3>
          <div ref="waterChart" style="width: 100%; height: 400px;"></div>
        </div>


      </div>
    </el-drawer>
    <!---->

  </div>
</template>

<script>
import * as echarts from 'echarts';

export default {

  data() {
    return {
      leftDrawer: false,
      rightDrawer: false,
      leftDrawerSize: '80%',
      rightDrawerSize: '85%',
      fisheryTimeRange: 'month',
      waterTimeRange: 'month',

      // 渔场数据
      fisheryTableData: [
        { name: '东海渔场', location: '东经120°, 北纬30°', area: 1200, fishType: '带鱼, 黄鱼', yield: 4500 },
        { name: '南海渔场', location: '东经115°, 北纬20°', area: 1800, fishType: '金枪鱼, 马鲛鱼', yield: 6800 },
        { name: '渤海渔场', location: '东经118°, 北纬38°', area: 800, fishType: '对虾, 螃蟹', yield: 3200 },
        { name: '黄海渔场', location: '东经122°, 北纬35°', area: 1500, fishType: '鲅鱼, 鲳鱼', yield: 5200 },
        { name: '舟山渔场', location: '东经122°, 北纬30°', area: 2000, fishType: '带鱼, 乌贼', yield: 7500 },
      ],

      fisheryStatsTableData: [],

      // 水质数据
      waterQualityTableData: [
        { location: '东海监测点1', ph: 7.8, oxygen: 6.5, nitrogen: 0.8, phosphorus: 0.05, score: 85 },
        { location: '南海监测点2', ph: 8.1, oxygen: 7.2, nitrogen: 0.6, phosphorus: 0.03, score: 92 },
        { location: '渤海监测点3', ph: 7.5, oxygen: 5.8, nitrogen: 1.2, phosphorus: 0.08, score: 78 },
        { location: '黄海监测点4', ph: 7.9, oxygen: 6.8, nitrogen: 0.9, phosphorus: 0.06, score: 83 },
        { location: '舟山监测点5', ph: 8.0, oxygen: 7.0, nitrogen: 0.7, phosphorus: 0.04, score: 88 },
      ],

      waterStatsTableData: [],

      // 图表实例
      fisheryChart: null,
      waterChart: null
    };
  },
  mounted() {
    this.generateFisheryStatsData();
    this.generateWaterStatsData();
  },
  methods: {
    openLeftDrawer() {
      this.leftDrawer = true;
      this.$nextTick(() => {
        this.initFisheryChart();
      });
    },

    openRightDrawer() {
      this.rightDrawer = true;
      this.$nextTick(() => {
        this.initWaterChart();
      });
    },

    closeLeftDrawer() {
      this.leftDrawer = false;
    },

    closeRightDrawer() {
      this.rightDrawer = false;
    },

    handleLeftClose(done) {
      done();
    },

    handleRightClose(done) {
      done();
    },

    generateFisheryStatsData() {
      const data = [];
      const now = new Date();

      for (let i = 0; i < 12; i++) {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const month = date.getMonth() + 1;
        const year = date.getFullYear();
        const totalYield = Math.floor(Math.random() * 5000) + 3000;

        data.push({
          date: `${year}-${month < 10 ? '0' + month : month}`,
          totalYield: totalYield,
          avgYield: Math.floor(totalYield / 30),
          maxYield: Math.floor(totalYield * 1.2),
          minYield: Math.floor(totalYield * 0.8)
        });
      }

      this.fisheryStatsTableData = data.reverse();
    },

    generateWaterStatsData() {
      const data = [];
      const now = new Date();

      for (let i = 0; i < 12; i++) {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const month = date.getMonth() + 1;
        const year = date.getFullYear();
        const avgScore = Math.floor(Math.random() * 20) + 75;

        data.push({
          date: `${year}-${month < 10 ? '0' + month : month}`,
          avgScore: avgScore,
          maxScore: Math.floor(avgScore * 1.1),
          minScore: Math.floor(avgScore * 0.9),
          goodDays: Math.floor(Math.random() * 20) + 10
        });
      }

      this.waterStatsTableData = data.reverse();
    },

    initFisheryChart() {
      if (this.fisheryChart) {
        this.fisheryChart.dispose();
      }

      this.fisheryChart = echarts.init(this.$refs.fisheryChart);
      this.updateFisheryCharts();
    },

    initWaterChart() {
      if (this.waterChart) {
        this.waterChart.dispose();
      }

      this.waterChart = echarts.init(this.$refs.waterChart);
      this.updateWaterCharts();
    },

    updateFisheryCharts() {
      const option = {
        title: {
          text: '渔场捕鱼量统计 (' + this.getTimeRangeText(this.fisheryTimeRange) + ')',
          left: 'center'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        legend: {
          data: ['总产量', '平均产量'],
          top: 30
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: this.fisheryStatsTableData.map(item => item.date)
        },
        yAxis: {
          type: 'value',
          name: '产量(吨)'
        },
        series: [
          {
            name: '总产量',
            type: 'bar',
            data: this.fisheryStatsTableData.map(item => item.totalYield),
            itemStyle: {
              color: '#5470C6'
            }
          },
          {
            name: '平均产量',
            type: 'line',
            data: this.fisheryStatsTableData.map(item => item.avgYield),
            itemStyle: {
              color: '#91CC75'
            }
          }
        ]
      };

      this.fisheryChart.setOption(option);
    },

    updateWaterCharts() {
      const option = {
        title: {
          text: '水质评分统计 (' + this.getTimeRangeText(this.waterTimeRange) + ')',
          left: 'center'
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
        legend: {
          data: ['平均评分', '最高评分', '最低评分'],
          top: 30
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: this.waterStatsTableData.map(item => item.date)
        },
        yAxis: {
          type: 'value',
          name: '评分',
          min: 50,
          max: 100
        },
        series: [
          {
            name: '平均评分',
            type: 'line',
            stack: 'Total',
            areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: 'rgba(58, 77, 233, 0.8)'
                },
                {
                  offset: 1,
                  color: 'rgba(58, 77, 233, 0.1)'
                }
              ])
            },
            emphasis: {
              focus: 'series'
            },
            data: this.waterStatsTableData.map(item => item.avgScore)
          },
          {
            name: '最高评分',
            type: 'line',
            stack: 'Total',
            areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: 'rgba(255, 191, 0, 0.8)'
                },
                {
                  offset: 1,
                  color: 'rgba(255, 191, 0, 0.1)'
                }
              ])
            },
            emphasis: {
              focus: 'series'
            },
            data: this.waterStatsTableData.map(item => item.maxScore)
          },
          {
            name: '最低评分',
            type: 'line',
            stack: 'Total',
            areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: 'rgba(255, 80, 80, 0.8)'
                },
                {
                  offset: 1,
                  color: 'rgba(255, 80, 80, 0.1)'
                }
              ])
            },
            emphasis: {
              focus: 'series'
            },
            data: this.waterStatsTableData.map(item => item.minScore)
          }
        ]
      };

      this.waterChart.setOption(option);
    },

    getTimeRangeText(range) {
      const map = {
        day: '日',
        week: '周',
        month: '月',
        year: '年'
      };
      return map[range] || '';
    }
  },
  beforeDestroy() {
    if (this.fisheryChart) {
      this.fisheryChart.dispose();
    }
    if (this.waterChart) {
      this.waterChart.dispose();
    }
  }
};
</script>

<style scoped>
.app-container {
  padding: 20px;
}

.button-group {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-bottom: 20px;
}

.action-button {
  padding: 12px 24px;
  font-size: 16px;
  color: white;
  background-color: #409EFF;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.action-button:hover {
  background-color: #66b1ff;
}

.drawer-content {
  padding: 20px;
  height: 100%;
  overflow-y: auto;
}

.drawer-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.time-selector {
  margin: 20px 0;
  display: flex;
  justify-content: center;
}

.content-section {
  margin-bottom: 30px;
}

.content-section h3 {
  margin-bottom: 15px;
  color: #333;
  border-left: 4px solid #409EFF;
  padding-left: 10px;
}

/* 自定义抽屉样式 */
:deep(.custom-drawer) {
  overflow: hidden;
}

:deep(.custom-drawer .el-drawer__body) {
  overflow: hidden;
}

:deep(.custom-drawer .el-drawer__header) {
  margin-bottom: 0;
  padding-bottom: 20px;
  border-bottom: 1px solid #eee;
}
</style>