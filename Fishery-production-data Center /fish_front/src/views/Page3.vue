<template>
  <div class="app-container">
    <!-- 主页面内容 -->
    <button class="open-btn" @click="showDrawer_water = true">打开水质信息</button>

    <!-- 抽屉遮罩 -->
    <div class="drawer-mask" v-if="showDrawer_water" @click="showDrawer_water = false"></div>
    <!-- 渔场信息及捕捞统计中心抽屉主体 -->
    <div
        class="drawer"
        :class="{ 'drawer-open': showDrawer_water }"
        :style="{ width: drawerWidth + 'px', transform: `translateX(${showDrawer_water ? 0 : -drawerWidth}px)` }"
    >
      <div class="drawer-header">
        <h4>水质评估和数据统计中心</h4>
        <button class="close-btn" @click="showDrawer_water = false">×</button>
      </div>

      <div class="drawer-content" ref="content">
        <!-- 水质信息内容 -->
        <div class="fishery-info">
          <div class="time-filter">
            <el-radio-group v-model="timeRange" @change="updateCharts">
              <el-radio-button label="day">日</el-radio-button>
              <el-radio-button label="week">周</el-radio-button>
              <el-radio-button label="month">月</el-radio-button>
              <el-radio-button label="year">年</el-radio-button>
            </el-radio-group>
          </div>

          <el-tabs v-model="activeTab" type="card">
            <el-tab-pane label="水质信息" name="info">
              <el-table :data="waterData" border style="width: 100%">
                <el-table-column prop="name" label="水质状态" width="180"></el-table-column>
                <el-table-column prop="location" label="位置"></el-table-column>
                <el-table-column prop="area" label="面积(平方公里)"></el-table-column>
                <el-table-column prop="fishTypes" label="主要鱼种"></el-table-column>
                <el-table-column prop="status" label="状态">
                  <template #default="{row}">
                    <el-tag :type="row.status === '正常' ? 'success' : 'danger'">
                      {{ row.status }}
                    </el-tag>
                  </template>
                </el-table-column>
              </el-table>
            </el-tab-pane>

            <el-tab-pane label="捕鱼量统计" name="stats">
              <el-table :data="waterStats" border style="width: 100%">
                <el-table-column prop="fishery" label="水质状态"></el-table-column>
                <el-table-column prop="total" label="A指数"></el-table-column>
                <el-table-column prop="avg" label="B指数"></el-table-column>
                <el-table-column prop="max" label="C指数"></el-table-column>
                <el-table-column prop="min" label="D指数"></el-table-column>
              </el-table>
            </el-tab-pane>

            <el-tab-pane label="统计图表" name="charts">
              <div class="chart-container">
                <div class="chart-item">
                  <div ref="catchChart_water" style="width: 100vh; height: 300px;"></div>
                </div>
                <div class="chart-item">
                  <div ref="trendChart_water" style="width: 100vh; height: 300px;"></div>
                </div>
              </div>
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>

      <!-- 可拖动调整宽度的把手 -->
      <div class="drawer-resize" @mousedown="startResize"></div>
    </div>

  </div>
</template>

<script>
import * as echarts from 'echarts'

export default {
  name_water: 'waterDrawer',
  data() {
    return {
      showDrawer_water: false,
      drawerWidth: window.innerWidth * 0.8,
      isResizing: false,
      startX: 0,
      startWidth: 0,

      // 信息相关数据
      activeTab: 'info',
      timeRange: 'month',
      waterData: [
        { name: '东海', location: '东经122°, 北纬30°', area: '1200', fishTypes: '带鱼, 黄鱼, 鲳鱼', status: '正常' },
        { name: '南海', location: '东经115°, 北纬18°', area: '2500', fishTypes: '金枪鱼, 马鲛鱼', status: '正常' },
        { name: '渤海', location: '东经120°, 北纬39°', area: '800', fishTypes: '对虾, 梭子蟹', status: '维护中' },
        { name: '黄海', location: '东经124°, 北纬35°', area: '1500', fishTypes: '鲅鱼, 鲐鱼', status: '正常' }
      ],
      waterStats: [
        { fishery: '东海', total: '1250', avg: '104.2', max: '180', min: '75' },
        { fishery: '南海', total: '980', avg: '81.7', max: '150', min: '60' },
        { fishery: '渤海', total: '720', avg: '60', max: '90', min: '45' },
        { fishery: '黄海', total: '1100', avg: '91.7', max: '160', min: '70' }
      ],
      catchChart_water: null,
      trendChart_water: null
    }
  },
  mounted() {
    this.initCharts()
    window.addEventListener('resize', this.handleResize)
  },
  beforeDestroy() {
    if (this.catchChart_water) {
      this.catchChart_water.dispose()
    }
    if (this.trendChart_water) {
      this.trendChart_water.dispose()
    }
    window.removeEventListener('resize', this.handleResize)
    document.removeEventListener('mousemove', this.handleResize)
    document.removeEventListener('mouseup', this.stopResize)
  },
  methods: {
    // 抽屉相关方法
    startResize(e) {
      this.isResizing = true
      this.startX = e.clientX
      this.startWidth = this.drawerWidth
      document.addEventListener('mousemove', this.handleResizeMove)
      document.addEventListener('mouseup', this.stopResize)
      e.preventDefault()
    },
    handleResizeMove(e) {
      if (!this.isResizing) return
      const deltaX = e.clientX - this.startX
      const newWidth = this.startWidth + deltaX
      // 限制最小和最大宽度
      this.drawerWidth = Math.max(300, Math.min(window.innerWidth - 50, newWidth))
    },
    stopResize() {
      this.isResizing = false
      document.removeEventListener('mousemove', this.handleResizeMove)
      document.removeEventListener('mouseup', this.stopResize)
    },

    // 图表相关方法
    initCharts() {
      this.catchChart_water = echarts.init(this.$refs.catchChart_water)
      this.trendChart_water = echarts.init(this.$refs.trendChart_water)
      this.updateCharts()
    },
    updateCharts() {
      // 模拟不同时间范围的数据
      let xData, seriesData
      const water = this.waterData.map(item => item.name)

      if (this.timeRange === 'day') {
        xData = ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00']
        seriesData = [
          [120, 132, 101, 134, 90, 230],
          [220, 182, 191, 234, 290, 330],
          [150, 232, 201, 154, 190, 330],
          [320, 332, 301, 334, 390, 330]
        ]
      } else if (this.timeRange === 'week') {
        xData = ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
        seriesData = [
          [120, 132, 101, 134, 90, 230, 210],
          [220, 182, 191, 234, 290, 330, 310],
          [150, 232, 201, 154, 190, 330, 410],
          [320, 332, 301, 334, 390, 330, 320]
        ]
      } else if (this.timeRange === 'month') {
        xData = Array.from({ length: 30 }, (_, i) => `${i + 1}日`)
        seriesData = [
          Array.from({ length: 30 }, () => Math.floor(Math.random() * 200) + 50),
          Array.from({ length: 30 }, () => Math.floor(Math.random() * 200) + 50),
          Array.from({ length: 30 }, () => Math.floor(Math.random() * 200) + 50),
          Array.from({ length: 30 }, () => Math.floor(Math.random() * 200) + 50)
        ]
      } else { // year
        xData = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
        seriesData = [
          [120, 132, 101, 134, 90, 230, 210, 180, 190, 210, 220, 200],
          [220, 182, 191, 234, 290, 330, 310, 280, 290, 310, 320, 300],
          [150, 232, 201, 154, 190, 330, 410, 380, 390, 410, 420, 400],
          [320, 332, 301, 334, 390, 330, 320, 380, 390, 410, 420, 400]
        ]
      }

      // 捕鱼量柱状图
      this.catchChart_water.setOption({
        title: {
          text: '各渔场水质对比',
          left: 'center'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        legend: {
          data: water,
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
          data: xData
        },
        yAxis: {
          type: 'value',
          name: '捕鱼量(吨)'
        },
        series: water.map((name, index) => ({
          name,
          type: 'bar',
          data: seriesData[index]
        }))
      })

      // 捕鱼趋势折线图
      this.trendChart_water.setOption({
        title: {
          text: '捕鱼量趋势',
          left: 'center'
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: water,
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
          data: xData
        },
        yAxis: {
          type: 'value',
          name: '捕鱼量(吨)'
        },
        series: water.map((name, index) => ({
          name,
          type: 'line',
          data: seriesData[index],
          smooth: true
        }))
      })
    },
    handleResize() {
      if (this.catchChart_water) {
        this.catchChart_water.resize()
      }
      if (this.trendChart_water) {
        this.trendChart_water.resize()
      }
    }
  },
  watch: {
    showDrawer_water(newVal) {
      if (newVal) {
        document.body.style.overflow = 'hidden'
      } else {
        document.body.style.overflow = ''
      }
    }
  }
}
</script>

<style scoped>
.app-container {
  padding: 20px;
}

.open-btn {
  padding: 10px 20px;
  background-color: #409eff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
}

.open-btn:hover {
  background-color: #66b1ff;
}

.drawer-mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1000;
}

.drawer {
  position: fixed;
  top: 0;
  left: 0;
  height: 100%;
  background-color: #fff;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.15);
  transition: transform 0.3s ease;
  z-index: 1001;
  display: flex;
  flex-direction: column;
}

.drawer-header {
  padding: 16px 24px;
  border-bottom: 1px solid #f0f0f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.close-btn {
  font-size: 24px;
  background: none;
  border: none;
  cursor: pointer;
  color: #999;
  padding: 0;
  line-height: 1;
}

.close-btn:hover {
  color: #333;
}

.drawer-content {
  flex: 1;
  overflow-y: auto;
  padding: 16px 24px;
}

.drawer-resize {
  position: absolute;
  top: 0;
  right: -4px;
  width: 8px;
  height: 100%;
  cursor: col-resize;
  z-index: 1;
}

.drawer-resize:hover {
  background-color: rgba(0, 0, 0, 0.1);
}

/* 信息样式 */
.fishery-info {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.time-filter {
  margin-bottom: 20px;
  text-align: center;
}

.chart-container {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.chart-item {
  background-color: #fff;
  padding: 15px;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}
</style>