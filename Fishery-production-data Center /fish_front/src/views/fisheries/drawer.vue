<template>
  <div>
    <!-- 触发抽屉的链接 -->
    <a @click="showDrawer = true" class="drawer-trigger">查看渔场详情</a>

    <!-- 抽屉组件 -->
    <el-drawer
        title="渔场详细信息"
        :visible.sync="showDrawer"
        direction="ltr"
        :size="drawerWidth"
        :wrapperClosable="false"
        custom-class="fishery-drawer"
    >
      <!-- 抽屉头部 -->
      <div slot="title" class="drawer-header">
        <span class="drawer-title">渔场详细信息</span>
        <el-button type="text" @click="closeDrawer" class="close-btn">
          <i class="el-icon-close"></i> 关闭
        </el-button>
      </div>

      <!-- 抽屉内容 -->
      <div class="drawer-content" ref="drawerContent">
        <!-- 渔场基本信息表格 -->
        <div class="section">
          <h3 class="section-title">渔场基本信息</h3>
          <el-table :data="fisheryInfo" border style="width: 100%">
            <el-table-column prop="name" label="渔场名称" width="150"></el-table-column>
            <el-table-column prop="location" label="地理位置"></el-table-column>
            <el-table-column prop="area" label="面积(平方公里)" width="120"></el-table-column>
            <el-table-column prop="fishTypes" label="主要鱼种"></el-table-column>
            <el-table-column prop="manager" label="负责人" width="120"></el-table-column>
            <el-table-column prop="contact" label="联系方式" width="150"></el-table-column>
          </el-table>
        </div>

        <!-- 捕鱼量统计控制区 -->
        <div class="section">
          <h3 class="section-title">捕鱼量统计</h3>
          <div class="stat-controls">
            <el-radio-group v-model="timeRange" @change="updateChart">
              <el-radio-button label="day">日统计</el-radio-button>
              <el-radio-button label="week">周统计</el-radio-button>
              <el-radio-button label="month">月统计</el-radio-button>
              <el-radio-button label="year">年统计</el-radio-button>
            </el-radio-group>

            <el-date-picker
                v-model="selectedDate"
                type="date"
                placeholder="选择日期"
                style="margin-left: 15px;"
                @change="updateChart"
                v-if="timeRange === 'day'"
            ></el-date-picker>

            <el-date-picker
                v-model="selectedWeek"
                type="week"
                format="yyyy 第 WW 周"
                placeholder="选择周"
                style="margin-left: 15px;"
                @change="updateChart"
                v-if="timeRange === 'week'"
            ></el-date-picker>

            <el-date-picker
                v-model="selectedMonth"
                type="month"
                placeholder="选择月份"
                style="margin-left: 15px;"
                @change="updateChart"
                v-if="timeRange === 'month'"
            ></el-date-picker>

            <el-date-picker
                v-model="selectedYear"
                type="year"
                placeholder="选择年份"
                style="margin-left: 15px;"
                @change="updateChart"
                v-if="timeRange === 'year'"
            ></el-date-picker>
          </div>

          <!-- 捕鱼量统计表格 -->
          <el-table :data="fishingData" border style="width: 100%; margin-top: 15px;">
            <el-table-column prop="date" label="日期" width="120"></el-table-column>
            <el-table-column prop="fishType" label="鱼种" width="120"></el-table-column>
            <el-table-column prop="quantity" label="数量(公斤)" width="120"></el-table-column>
            <el-table-column prop="value" label="价值(元)" width="120"></el-table-column>
            <el-table-column prop="boatCount" label="渔船数量" width="100"></el-table-column>
            <el-table-column prop="fishermanCount" label="渔民数量" width="100"></el-table-column>
          </el-table>
        </div>

        <!-- 统计图表 -->
        <div class="section">
          <h3 class="section-title">捕鱼量统计图表</h3>
          <div class="chart-container">
            <div id="fishingChart" style="width: 100%; height: 400px;"></div>
          </div>
        </div>
      </div>
    </el-drawer>
  </div>
</template>

<script>
import * as echarts from 'echarts';

export default {
  data() {
    return {
      showDrawer: false,
      drawerWidth: '80%',
      timeRange: 'month',
      selectedDate: new Date(),
      selectedWeek: new Date(),
      selectedMonth: new Date(),
      selectedYear: new Date(),
      fisheryInfo: [
        {
          name: '东海渔场',
          location: '中国东海海域',
          area: '1200',
          fishTypes: '带鱼、黄鱼、鲳鱼、墨鱼',
          manager: '张大海',
          contact: '13800138001'
        }
      ],
      fishingData: [],
      fishingChart: null
    };
  },
  mounted() {
    this.generateFishingData();
    this.$nextTick(() => {
      this.initChart();
    });
  },
  beforeDestroy() {
    if (this.fishingChart) {
      this.fishingChart.dispose();
    }
  },
  methods: {
    // 关闭抽屉
    closeDrawer() {
      this.showDrawer = false;
      // 可以在这里添加返回主页的逻辑
      // this.$router.push('/');
    },

    // 生成模拟数据
    generateFishingData() {
      const fishTypes = ['带鱼', '黄鱼', '鲳鱼', '墨鱼'];
      const data = [];

      for (let i = 1; i <= 30; i++) {
        const fishType = fishTypes[Math.floor(Math.random() * fishTypes.length)];
        data.push({
          date: `2023-05-${i < 10 ? '0' + i : i}`,
          fishType,
          quantity: Math.floor(Math.random() * 1000) + 500,
          value: Math.floor(Math.random() * 5000) + 2000,
          boatCount: Math.floor(Math.random() * 10) + 5,
          fishermanCount: Math.floor(Math.random() * 50) + 20
        });
      }

      this.fishingData = data;
    },

    // 初始化图表
    initChart() {
      this.fishingChart = echarts.init(document.getElementById('fishingChart'));
      this.updateChart();
    },

    // 更新图表数据
    updateChart() {
      if (!this.fishingChart) return;

      // 根据选择的时间范围过滤数据
      let filteredData = [];
      const fishTypes = ['带鱼', '黄鱼', '鲳鱼', '墨鱼'];

      if (this.timeRange === 'day') {
        // 日数据 - 显示当天各鱼种数据
        filteredData = this.fishingData
            .filter(item => item.date === this.formatDate(this.selectedDate))
            .reduce((acc, item) => {
              const existing = acc.find(i => i.fishType === item.fishType);
              if (existing) {
                existing.quantity += item.quantity;
                existing.value += item.value;
              } else {
                acc.push({...item});
              }
              return acc;
            }, []);
      } else {
        // 其他时间范围 - 显示汇总数据
        fishTypes.forEach(type => {
          const items = this.fishingData.filter(item => item.fishType === type);
          const total = items.reduce((sum, item) => sum + item.quantity, 0);
          filteredData.push({
            fishType: type,
            quantity: total
          });
        });
      }

      const option = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        legend: {
          data: fishTypes
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: this.timeRange === 'day'
              ? ['各鱼种']
              : filteredData.map(item => item.fishType)
        },
        yAxis: {
          type: 'value',
          name: '数量(公斤)'
        },
        series: fishTypes.map(type => {
          return {
            name: type,
            type: 'bar',
            data: this.timeRange === 'day'
                ? [filteredData.find(item => item.fishType === type)?.quantity || 0]
                : [filteredData.find(item => item.fishType === type)?.quantity || 0],
            itemStyle: {
              color: this.getFishColor(type)
            }
          };
        })
      };

      this.fishingChart.setOption(option);
    },

    // 辅助方法：格式化日期
    formatDate(date) {
      if (!date) return '';
      const d = new Date(date);
      const month = '' + (d.getMonth() + 1);
      const day = '' + d.getDate();
      const year = d.getFullYear();

      return [year, month.padStart(2, '0'), day.padStart(2, '0')].join('-');
    },

    // 辅助方法：获取鱼种颜色
    getFishColor(fishType) {
      const colors = {
        '带鱼': '#5470C6',
        '黄鱼': '#91CC75',
        '鲳鱼': '#FAC858',
        '墨鱼': '#EE6666'
      };
      return colors[fishType] || '#73C0DE';
    }
  }
};
</script>

<style scoped>
.drawer-trigger {
  color: #409EFF;
  text-decoration: none;
  cursor: pointer;
}

.drawer-trigger:hover {
  color: #66b1ff;
  text-decoration: underline;
}

.drawer-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.drawer-title {
  font-size: 18px;
  font-weight: bold;
}

.close-btn {
  padding: 0;
  font-size: 16px;
}

.close-btn:hover {
  color: #F56C6C;
}

.fishery-drawer {
  overflow: hidden;
}

.drawer-content {
  height: 100%;
  overflow-y: auto;
  padding-right: 10px;
}

.section {
  margin-bottom: 30px;
}

.section-title {
  margin-bottom: 15px;
  color: #303133;
  font-size: 16px;
  font-weight: bold;
  border-left: 4px solid #409EFF;
  padding-left: 10px;
}

.stat-controls {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
}

.chart-container {
  margin-top: 15px;
}

/* 自定义滚动条 */
.drawer-content::-webkit-scrollbar {
  width: 6px;
}

.drawer-content::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.drawer-content::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.drawer-content::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
</style>