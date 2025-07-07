<template>
  <div class="app-container">
    <!-- 主页面按钮 -->
    <div class="button-group">
      <button
          v-for="btn in buttons"
          :key="btn.type"
          class="nav-btn"
          :style="{ backgroundColor: btn.color }"
          @click="openDrawer(btn.type)"
      >
        {{ btn.label }}
      </button>
    </div>

    <!-- 抽屉遮罩 -->
    <div class="drawer-mask" v-if="activeDrawer" @click="closeDrawer"></div>

    <!-- 抽屉主体 -->
    <div
        class="drawer"
        :class="{ 'drawer-open': activeDrawer }"
        :style="{
        width: drawerWidth + 'px',
        transform: `translateX(${activeDrawer ? 0 : -drawerWidth}px)`,
        zIndex: 1000 + activeTabIndex
      }"
    >
      <div class="drawer-header">
        <h3>{{ activeDrawer ? buttons.find(b => b.type === activeDrawer).label : '' }}</h3>
        <button class="close-btn" @click="closeDrawer">×</button>
      </div>

      <div class="drawer-content" ref="content">
        <!-- 动态内容区域 -->
        <div class="info-container">
          <div class="time-filter">
            <el-radio-group v-model="timeRange" @change="updateCharts">
              <el-radio-button label="day">日</el-radio-button>
              <el-radio-button label="week">周</el-radio-button>
              <el-radio-button label="month">月</el-radio-button>
              <el-radio-button label="year">年</el-radio-button>
            </el-radio-group>
          </div>

          <el-tabs v-model="activeTab" type="card">
            <el-tab-pane label="基本信息" name="info">
              <el-table :data="currentData" border style="width: 100%">
                <el-table-column
                    v-for="col in currentColumns"
                    :key="col.prop"
                    :prop="col.prop"
                    :label="col.label"
                    :width="col.width"
                >
                  <template #default="{row}" v-if="col.prop === 'status'">
                    <el-tag :type="row.status === '正常' ? 'success' : 'danger'">
                      {{ row.status }}
                    </el-tag>
                  </template>
                </el-table-column>
              </el-table>
            </el-tab-pane>

            <el-tab-pane label="统计信息" name="stats">
              <el-table :data="currentStats" border style="width: 100%">
                <el-table-column
                    v-for="col in currentStatColumns"
                    :key="col.prop"
                    :prop="col.prop"
                    :label="col.label"
                ></el-table-column>
              </el-table>
            </el-tab-pane>

            <el-tab-pane label="统计图表" name="charts">
              <div class="chart-container">
                <div class="chart-item">
                  <div ref="barChart" style="width: 100vh; height: 40vh;"></div>
                </div>
                <div class="chart-item">
                  <div ref="lineChart" style="width: 100vh; height: 40vh;"></div>
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
  name: 'MultiDrawerSystem',
  data() {
    return {
      activeDrawer: '',
      activeTabIndex: 0,
      drawerWidth: window.innerWidth * 0.8,
      isResizing: false,
      startX: 0,
      startWidth: 0,

      // 按钮配置
      buttons: [
        { type: 'fishery', label: '渔场信息', color: '#409EFF' },
        { type: 'water', label: '水质信息', color: '#67C23A' },
        { type: 'fleet', label: '车队信息', color: '#E6A23C' },
        { type: 'boat', label: '渔船信息', color: '#F56C6C' },
        { type: 'dock', label: '码头信息', color: '#909399' }
      ],

      // 数据展示相关
      activeTab: 'info',
      timeRange: 'month',

      // 各类型数据配置
      dataConfig: {
        fishery: {
          columns: [
            { prop: 'name', label: '渔场名称', width: '180' },
            { prop: 'location', label: '位置' },
            { prop: 'area', label: '面积(平方公里)' },
            { prop: 'fishTypes', label: '主要鱼种' },
            { prop: 'status', label: '状态' }
          ],
          data: [
            { name: '东海渔场', location: '东经122°, 北纬30°', area: '1200', fishTypes: '带鱼, 黄鱼, 鲳鱼', status: '正常' },
            { name: '南海渔场', location: '东经115°, 北纬18°', area: '2500', fishTypes: '金枪鱼, 马鲛鱼', status: '正常' },
            { name: '渤海渔场', location: '东经120°, 北纬39°', area: '800', fishTypes: '对虾, 梭子蟹', status: '维护中' },
            { name: '黄海渔场', location: '东经124°, 北纬35°', area: '1500', fishTypes: '鲅鱼, 鲐鱼', status: '正常' }
          ],
          statColumns: [
            { prop: 'fishery', label: '渔场名称' },
            { prop: 'total', label: '总捕鱼量(吨)' },
            { prop: 'avg', label: '平均捕鱼量(吨)' },
            { prop: 'max', label: '最大捕鱼量(吨)' },
            { prop: 'min', label: '最小捕鱼量(吨)' }
          ],
          stats: [
            { fishery: '东海渔场', total: '1250', avg: '104.2', max: '180', min: '75' },
            { fishery: '南海渔场', total: '980', avg: '81.7', max: '150', min: '60' },
            { fishery: '渤海渔场', total: '720', avg: '60', max: '90', min: '45' },
            { fishery: '黄海渔场', total: '1100', avg: '91.7', max: '160', min: '70' }
          ]
        },
        water: {
          columns: [
            { prop: 'location', label: '监测点', width: '180' },
            { prop: 'ph', label: 'PH值' },
            { prop: 'oxygen', label: '溶解氧(mg/L)' },
            { prop: 'nitrogen', label: '氨氮(mg/L)' },
            { prop: 'status', label: '水质等级' }
          ],
          data: [
            { location: '东海监测点1', ph: '7.8', oxygen: '6.5', nitrogen: '0.2', status: '正常' },
            { location: '南海监测点2', ph: '8.1', oxygen: '7.2', nitrogen: '0.3', status: '正常' },
            { location: '渤海监测点3', ph: '7.5', oxygen: '5.8', nitrogen: '0.5', status: '警告' },
            { location: '黄海监测点4', ph: '7.9', oxygen: '6.8', nitrogen: '0.4', status: '正常' }
          ],
          statColumns: [
            { prop: 'location', label: '监测点' },
            { prop: 'avgPh', label: '平均PH值' },
            { prop: 'avgOxygen', label: '平均溶解氧' },
            { prop: 'avgNitrogen', label: '平均氨氮' },
            { prop: 'exceedDays', label: '超标天数' }
          ],
          stats: [
            { location: '东海监测点1', avgPh: '7.7', avgOxygen: '6.3', avgNitrogen: '0.25', exceedDays: '2' },
            { location: '南海监测点2', avgPh: '8.0', avgOxygen: '7.0', avgNitrogen: '0.32', exceedDays: '1' },
            { location: '渤海监测点3', avgPh: '7.6', avgOxygen: '5.5', avgNitrogen: '0.48', exceedDays: '8' },
            { location: '黄海监测点4', avgPh: '7.8', avgOxygen: '6.5', avgNitrogen: '0.35', exceedDays: '3' }
          ]
        },
        fleet: {
          columns: [
            { prop: 'name', label: '车队名称', width: '180' },
            { prop: 'manager', label: '负责人' },
            { prop: 'vehicleCount', label: '车辆数量' },
            { prop: 'type', label: '车辆类型' },
            { prop: 'status', label: '运营状态' }
          ],
          data: [
            { name: '东海运输一队', manager: '张三', vehicleCount: '12', type: '冷藏车', status: '正常' },
            { name: '南海运输二队', manager: '李四', vehicleCount: '8', type: '普通货车', status: '正常' },
            { name: '渤海运输三队', manager: '王五', vehicleCount: '15', type: '冷藏车', status: '维护中' },
            { name: '黄海运输四队', manager: '赵六', vehicleCount: '10', type: '普通货车', status: '正常' }
          ],
          statColumns: [
            { prop: 'fleet', label: '车队名称' },
            { prop: 'totalTrips', label: '总运输次数' },
            { prop: 'avgLoad', label: '平均载重(吨)' },
            { prop: 'maxLoad', label: '最大载重(吨)' },
            { prop: 'minLoad', label: '最小载重(吨)' }
          ],
          stats: [
            { fleet: '东海运输一队', totalTrips: '125', avgLoad: '8.2', maxLoad: '12', minLoad: '5' },
            { fleet: '南海运输二队', totalTrips: '98', avgLoad: '6.7', maxLoad: '10', minLoad: '4' },
            { fleet: '渤海运输三队', totalTrips: '172', avgLoad: '9.5', maxLoad: '15', minLoad: '6' },
            { fleet: '黄海运输四队', totalTrips: '110', avgLoad: '7.8', maxLoad: '12', minLoad: '5' }
          ]
        },
        boat: {
          columns: [
            { prop: 'name', label: '渔船名称', width: '180' },
            { prop: 'captain', label: '船长' },
            { prop: 'tonnage', label: '吨位' },
            { prop: 'type', label: '渔船类型' },
            { prop: 'status', label: '状态' }
          ],
          data: [
            { name: '浙渔001', captain: '张船长', tonnage: '120', type: '拖网渔船', status: '正常' },
            { name: '浙渔002', captain: '李船长', tonnage: '150', type: '围网渔船', status: '正常' },
            { name: '浙渔003', captain: '王船长', tonnage: '80', type: '刺网渔船', status: '维修中' },
            { name: '浙渔004', captain: '赵船长', tonnage: '200', type: '拖网渔船', status: '正常' }
          ],
          statColumns: [
            { prop: 'boat', label: '渔船名称' },
            { prop: 'totalCatch', label: '总捕鱼量(吨)' },
            { prop: 'avgCatch', label: '平均捕鱼量(吨)' },
            { prop: 'maxCatch', label: '最大捕鱼量(吨)' },
            { prop: 'minCatch', label: '最小捕鱼量(吨)' }
          ],
          stats: [
            { boat: '浙渔001', totalCatch: '520', avgCatch: '43.3', maxCatch: '65', minCatch: '32' },
            { boat: '浙渔002', totalCatch: '480', avgCatch: '40.0', maxCatch: '60', minCatch: '30' },
            { boat: '浙渔003', totalCatch: '380', avgCatch: '31.7', maxCatch: '45', minCatch: '25' },
            { boat: '浙渔004', totalCatch: '620', avgCatch: '51.7', maxCatch: '75', minCatch: '40' }
          ]
        },
        dock: {
          columns: [
            { prop: 'name', label: '码头名称', width: '180' },
            { prop: 'location', label: '位置' },
            { prop: 'berthCount', label: '泊位数量' },
            { prop: 'capacity', label: '吞吐量(吨/年)' },
            { prop: 'status', label: '运营状态' }
          ],
          data: [
            { name: '东海码头', location: '东经122°, 北纬30°', berthCount: '8', capacity: '50000', status: '正常' },
            { name: '南海码头', location: '东经115°, 北纬18°', berthCount: '12', capacity: '80000', status: '正常' },
            { name: '渤海码头', location: '东经120°, 北纬39°', berthCount: '6', capacity: '30000', status: '维护中' },
            { name: '黄海码头', location: '东经124°, 北纬35°', berthCount: '10', capacity: '60000', status: '正常' }
          ],
          statColumns: [
            { prop: 'dock', label: '码头名称' },
            { prop: 'totalShips', label: '总停靠船只' },
            { prop: 'avgStay', label: '平均停留(小时)' },
            { prop: 'maxStay', label: '最长停留(小时)' },
            { prop: 'minStay', label: '最短停留(小时)' }
          ],
          stats: [
            { dock: '东海码头', totalShips: '1250', avgStay: '24', maxStay: '48', minStay: '12' },
            { dock: '南海码头', totalShips: '1800', avgStay: '30', maxStay: '72', minStay: '18' },
            { dock: '渤海码头', totalShips: '980', avgStay: '20', maxStay: '36', minStay: '10' },
            { dock: '黄海码头', totalShips: '1500', avgStay: '26', maxStay: '60', minStay: '15' }
          ]
        }
      },

      // 图表实例
      barChart: null,
      lineChart: null
    }
  },
  computed: {
    currentColumns() {
      return this.activeDrawer ? this.dataConfig[this.activeDrawer].columns : []
    },
    currentData() {
      return this.activeDrawer ? this.dataConfig[this.activeDrawer].data : []
    },
    currentStatColumns() {
      return this.activeDrawer ? this.dataConfig[this.activeDrawer].statColumns : []
    },
    currentStats() {
      return this.activeDrawer ? this.dataConfig[this.activeDrawer].stats : []
    }
  },
  mounted() {
    this.initCharts()
    window.addEventListener('resize', this.handleResize)
  },
  beforeDestroy() {
    if (this.barChart) {
      this.barChart.dispose()
    }
    if (this.lineChart) {
      this.lineChart.dispose()
    }
    window.removeEventListener('resize', this.handleResize)
    document.removeEventListener('mousemove', this.handleResizeMove)
    document.removeEventListener('mouseup', this.stopResize)
  },
  methods: {
    // 抽屉控制方法
    openDrawer(type) {
      this.activeDrawer = type
      this.activeTabIndex++
      this.$nextTick(() => {
        this.updateCharts()
      })
    },
    closeDrawer() {
      this.activeDrawer = ''
      document.body.style.overflow = ''
    },
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
    Resize() {
      this.isResizing = false
      document.removeEventListener('mousemove', this.handleResizeMove)
      document.removeEventListener('mouseup', this.stopResize)
    },

// 图表方法
    initCharts() {
      this.barChart = echarts.init(this.$refs.barChart)
      this.lineChart = echarts.init(this.$refs.lineChart)
    },
    updateCharts() {
      if (!this.activeDrawer) return

      // 模拟不同时间范围的数据
      let xData, seriesData
      const items = this.currentData.map(item => item.name || item.location)

      if (this.timeRange === 'day') {
        xData = ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00']
        seriesData = items.map(() =>
            Array.from({ length: 6 }, () => Math.floor(Math.random() * 200) + 50)
        )
      } else if (this.timeRange === 'week') {
        xData = ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
        seriesData = items.map(() =>
            Array.from({ length: 7 }, () => Math.floor(Math.random() * 200) + 50)
        )
      } else if (this.timeRange === 'month') {
        xData = Array.from({ length: 30 }, (_, i) => `${i + 1}日`)
        seriesData = items.map(() =>
            Array.from({ length: 30 }, () => Math.floor(Math.random() * 200) + 50)
        )
      } else { // year
        xData = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
        seriesData = items.map(() =>
            Array.from({ length: 12 }, () => Math.floor(Math.random() * 200) + 50)
        )
      }

      // 根据不同类型设置图表标题
      let barTitle = '', lineTitle = '', yAxisName = ''
      switch(this.activeDrawer) {
        case 'fishery':
          barTitle = '各渔场捕鱼量对比'
          lineTitle = '捕鱼量趋势'
          yAxisName = '捕鱼量(吨)'
          break
        case 'water':
          barTitle = '各监测点水质指标对比'
          lineTitle = '水质变化趋势'
          yAxisName = '指标值'
          break
        case 'fleet':
          barTitle = '各车队运输量对比'
          lineTitle = '运输量趋势'
          yAxisName = '运输量(吨)'
          break
        case 'boat':
          barTitle = '各渔船捕鱼量对比'
          lineTitle = '捕鱼量趋势'
          yAxisName = '捕鱼量(吨)'
          break
        case 'dock':
          barTitle = '各码头吞吐量对比'
          lineTitle = '吞吐量趋势'
          yAxisName = '吞吐量(吨)'
          break
      }

      // 柱状图配置
      this.barChart.setOption({
        title: {
          text: barTitle,
          left: 'center'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        legend: {
          data: items,
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
          name: yAxisName
        },
        series: items.map((name, index) => ({
          name,
          type: 'bar',
          data: seriesData[index]
        }))
      })

      // 折线图配置
      this.lineChart.setOption({
        title: {
          text: lineTitle,
          left: 'center'
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: items,
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
          name: yAxisName
        },
        series: items.map((name, index) => ({
          name,
          type: 'line',
          data: seriesData[index],
          smooth: true
        }))
      })
    },
    handleResize() {
      if (this.barChart) {
        this.barChart.resize()
      }
      if (this.lineChart) {
        this.lineChart.resize()
      }
    }
  },
  watch: {
    activeDrawer(newVal) {
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

.app-container
{ padding: 20px; }

.button-group
{ display: flex;
  flex-wrap: wrap;
  gap: 15px;
  margin-bottom: 20px; }

.nav-btn
{ padding: 12px 24px;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  transition: all 0.3s;
  min-width: 120px; }

.nav-btn:hover
{ transform: translateY(-3px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); }

.drawer-mask
{ position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1000; }

.drawer
{ position: fixed;
  top: 0;
  left: 0;
  height: 100%;
  background-color: #fff;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.15);
  transition: transform 0.3s ease;
  display: flex;
  flex-direction: column; }

.drawer-header
{ padding: 16px 24px;
  border-bottom: 1px solid #f0f0f0;
  display: flex;
  justify-content: space-between;
  align-items: center; }

.close-btn
{ font-size: 24px;
  background: none;
  border: none;
  cursor: pointer;
  color: #999;
  padding: 0;
  line-height: 1; }

.close-btn:hover
{ color: #333; }

.drawer-content
{ flex: 1;
  overflow-y: auto;
  padding: 16px 24px; }

.drawer-resize
{ position: absolute;
  top: 0;
  right: -4px;
  width: 8px;
  height: 100%;
  cursor: col-resize;
  z-index: 1; }

.drawer-resize:hover
{ background-color: rgba(0, 0, 0, 0.1); }

/* 信息容器样式 */
.info-container
{ height: 100%;
  display: flex;
  flex-direction: column; }

.time-filter
{ margin-bottom: 20px;
  text-align: center; }

.chart-container
{ display: flex;
  flex-direction: column;
  gap: 30px; }

.chart-item
{ background-color: #fff;
  padding: 15px;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1); }

</style>