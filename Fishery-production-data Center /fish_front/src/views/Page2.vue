<template>
  <div class="fishery-dashboard">
    <!-- 上半部分 -->
    <div class="upper-section">
      <!-- 左侧 (7份) -->
      <div class="left-panel">
        <!-- 渔场信息卡片 -->
        <div class="card">
          <h3>渔场信息</h3>
          <div class="card-content">
            <div class="table-container">
              <table>
                <thead>
                <tr>
                  <th>渔场</th>
                  <th>产量(吨)</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="(fishery, index) in fisheries" :key="'fishery-'+index">
                  <td>{{ fishery.name }}</td>
                  <td>{{ fishery.output }}</td>
                </tr>
                </tbody>
              </table>
            </div>
            <div ref="fisheryOutputChart" class="chart-container"></div>
          </div>
        </div>

        <!-- 水质信息卡片 -->
        <div class="card">
          <h3>水质信息</h3>
          <div class="card-content">
            <div class="table-container">
              <table>
                <thead>
                <tr>
                  <th>指标</th>
                  <th>数值</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="(item, index) in waterQuality" :key="'water-'+index">
                  <td>{{ item.name }}</td>
                  <td>{{ item.value }}</td>
                </tr>
                </tbody>
              </table>
            </div>
            <div ref="waterQualityChart" class="chart-container"></div>
          </div>
        </div>
      </div>

      <!-- 中间 (9份) - 地图 -->
      <div class="center-panel">
        <div class="card">
          <h3>实时地图</h3>
          <div id="map-container" ref="mapContainer"></div>
          <div class="map-legend">
            <div><span class="legend-icon fishery"></span> 渔场位置</div>
            <div><span class="legend-icon boat"></span> 渔船位置</div>
          </div>
        </div>
      </div>

      <!-- 右侧 (7份) -->
      <div class="right-panel">
        <!-- 消息通知卡片 -->
        <div class="card">
          <h3>车船互联-消息通知</h3>
          <div class="card-content">
            <div class="message-container">
              <div v-for="(msg, index) in messages" :key="'msg-'+index" class="message-item">
                <div class="message-time">{{ msg.time }}</div>
                <div class="message-content">{{ msg.content }}</div>
              </div>
            </div>
            <div ref="messageTrendChart" class="chart-container"></div>
          </div>
        </div>

        <!-- 鱼情预测卡片 -->
        <div class="card">
          <h3>鱼情预测</h3>
          <div class="card-content">
            <div class="table-container">
              <table>
                <thead>
                <tr>
                  <th>品种</th>
                  <th>产量(吨)</th>
                  <th>趋势</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="(fish, index) in fishPrediction" :key="'fish-'+index">
                  <td>{{ fish.category }}</td>
                  <td>{{ fish.estimate }}</td>
                  <td>{{ fish.trend }}</td>
                </tr>
                </tbody>
              </table>
            </div>
            <div ref="fishPredictionChart" class="chart-container"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- 下半部分 -->
    <div class="lower-section">
      <!-- 左侧 (8份) -->
      <div class="left-panel">
        <!-- 船舶信息卡片 -->
        <div class="card">
          <h3>船舶信息</h3>
          <div class="card-content">
            <div class="table-container">
              <table>
                <thead>
                <tr>
                  <th>编号</th>
                  <th>概况</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="(ship, index) in ships" :key="'ship-'+index">
                  <td>{{ ship.id }}</td>
                  <td>{{ ship.info }}</td>
                </tr>
                </tbody>
              </table>
            </div>
            <div ref="shipProductionChart" class="chart-container"></div>
          </div>
        </div>
      </div>

      <!-- 中间 (8份) -->
      <div class="center-panel">
        <!-- 码头信息卡片 -->
        <div class="card">
          <h3>码头信息</h3>
          <div class="card-content">
            <div class="table-container">
              <table>
                <thead>
                <tr>
                  <th>码头</th>
                  <th>状态</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="(dock, index) in docks" :key="'dock-'+index">
                  <td>{{ dock.name }}</td>
                  <td>{{ dock.status }}</td>
                </tr>
                </tbody>
              </table>
            </div>
            <div ref="dockTurnoverChart" class="chart-container"></div>
          </div>
        </div>
      </div>

      <!-- 右侧 (8份) -->
      <div class="right-panel">
        <!-- 车队信息卡片 -->
        <div class="card">
          <h3>车队信息</h3>
          <div class="card-content">
            <div class="table-container">
              <table>
                <thead>
                <tr>
                  <th>编号</th>
                  <th>所属单位</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="(fleet, index) in fleets" :key="'fleet-'+index">
                  <td>{{ fleet.id }}</td>
                  <td>{{ fleet.company }}</td>
                </tr>
                </tbody>
              </table>
            </div>
            <div ref="fleetTransportChart" class="chart-container"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import * as echarts from 'echarts'
import '../assets/leaflet/leaflet.css'

// 数据定义
const fisheries = ref([
  { name: '普陀渔场', output: 630 },
  { name: '朱家尖渔场', output: 680 },
  { name: '高亭渔场', output: 270 },
  { name: '南洞渔场', output: 230 }
])

const waterQuality = ref([
  { name: '溶解氧', value: '6.5 mg/L' },
  { name: 'PH值', value: '7.8' },
  { name: '氨氮', value: '0.2 mg/L' },
  { name: '浊度', value: '15 NTU' }
])

const messages = ref([
  { time: '10:30', content: '舟山国际: 渔船已到达普陀渔场' },
  { time: '11:45', content: '舟山兴业: 开始捕捞作业' },
  { time: '13:20', content: '舟山农业: 发现鱼群聚集' }
])

const fishPrediction = ref([
  { category: '小黄鱼', estimate: 28, trend: 'Northwest' },
  { category: '带鱼', estimate: 30, trend: 'East' },
  { category: '鲳鱼', estimate: 70, trend: 'East' }
])

const ships = ref([
  { id: '浙渔001', info: '舟山国际' },
  { id: '浙渔002', info: '舟山兴业' },
  { id: '浙渔003', info: '舟山农业' }
])

const docks = ref([
  { name: '普陀码头', status: '运行中' },
  { name: '定海码头', status: '运行中' },
  { name: '岱山码头', status: '维护中' }
])

const fleets = ref([
  { id: '车队001', company: '舟山国际' },
  { id: '车队002', company: '舟山兴业' },
  { id: '车队003', company: '舟山农业' }
])

// 图表引用
const fisheryOutputChart = ref(null)
const waterQualityChart = ref(null)
const messageTrendChart = ref(null)
const fishPredictionChart = ref(null)
const shipProductionChart = ref(null)
const dockTurnoverChart = ref(null)
const fleetTransportChart = ref(null)
const mapContainer = ref(null)

let map = null
let charts = []

// 初始化所有图表
const initCharts = () => {
  // 渔场产量柱状图
  charts.push(initChart(fisheryOutputChart, {
    tooltip: { trigger: 'axis' },
    xAxis: {
      type: 'category',
      data: fisheries.value.map(f => f.name)
    },
    yAxis: { type: 'value' },
    series: [{
      data: fisheries.value.map(f => f.output),
      type: 'bar',
      itemStyle: { color: '#5470C6' }
    }]
  }))

  // 水质指标雷达图
  charts.push(initChart(waterQualityChart, {
    tooltip: { trigger: 'item' },
    radar: {
      indicator: waterQuality.value.map(item => ({
        name: item.name,
        max: 10
      }))
    },
    series: [{
      type: 'radar',
      data: [{
        value: [6.5, 7.8, 0.2, 15],
        name: '水质指标'
      }]
    }]
  }))

  // 消息趋势折线图
  charts.push(initChart(messageTrendChart, {
    tooltip: { trigger: 'axis' },
    xAxis: {
      type: 'category',
      data: messages.value.map(m => m.time)
    },
    yAxis: { type: 'value' },
    series: [{
      data: [1, 2, 3], // 模拟消息数量
      type: 'line',
      smooth: true
    }]
  }))

  // 鱼情预测饼图
  charts.push(initChart(fishPredictionChart, {
    tooltip: { trigger: 'item' },
    series: [{
      type: 'pie',
      radius: '70%',
      data: fishPrediction.value.map(f => ({
        value: f.estimate,
        name: f.category
      }))
    }]
  }))

  // 船只产量面积图
  charts.push(initChart(shipProductionChart, {
    tooltip: { trigger: 'axis' },
    xAxis: {
      type: 'category',
      data: ['1月', '2月', '3月', '4月', '5月']
    },
    yAxis: { type: 'value' },
    series: [{
      data: [120, 200, 150, 80, 70],
      type: 'line',
      areaStyle: {}
    }]
  }))

  // 码头周转柱状图
  charts.push(initChart(dockTurnoverChart, {
    tooltip: { trigger: 'axis' },
    xAxis: {
      type: 'category',
      data: docks.value.map(d => d.name)
    },
    yAxis: { type: 'value' },
    series: [{
      data: [500, 450, 380],
      type: 'bar'
    }]
  }))

  // 车队运输折线图
  charts.push(initChart(fleetTransportChart, {
    tooltip: { trigger: 'axis' },
    xAxis: {
      type: 'category',
      data: ['1月', '2月', '3月', '4月', '5月']
    },
    yAxis: { type: 'value' },
    series: [{
      data: [820, 932, 901, 934, 1290],
      type: 'line'
    }]
  }))
}

// 初始化单个图表
const initChart = (chartRef, option) => {
  if (!chartRef.value) return null
  const chart = echarts.init(chartRef.value)
  chart.setOption(option)
  return chart
}

// 初始化地图
const initMap = () => {
  if (!mapContainer.value) return

  // 动态加载Leaflet
  const script = document.createElement('script')
  script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
  script.onload = () => {
    map = window.L.map(mapContainer.value).setView([29.985, 122.207], 10)
    window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map)

    // 添加渔场标记
    fisheries.value.forEach(f => {
      window.L.marker([29.985 + Math.random()*0.1, 122.207 + Math.random()*0.1])
          .addTo(map)
          .bindPopup(`<b>${f.name}</b><br>产量: ${f.output}吨`)
    })
  }
  document.head.appendChild(script)
}

onMounted(() => {
  initCharts()
  initMap()
})

onBeforeUnmount(() => {
  // 清理图表
  charts.forEach(chart => chart?.dispose())
  // 清理地图
  if (map) map.remove()
  const leafletScript = document.querySelector('script[src*="leaflet"]')
  if (leafletScript) leafletScript.remove()
})
</script>

<style scoped>
.fishery-dashboard {
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  padding: 10px;
  box-sizing: border-box;
  background-color: #f5f7fa;
  overflow: hidden;
}

.upper-section, .lower-section {
  display: flex;
  flex: 1;
  min-height: 0;
  gap: 10px;
  margin-bottom: 10px;
}

.upper-section .left-panel,
.upper-section .right-panel {
  flex: 7;
}

.upper-section .center-panel {
  flex: 9;
}

.lower-section .left-panel,
.lower-section .center-panel,
.lower-section .right-panel {
  flex: 8;
}

.card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 15px;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.card h3 {
  margin: 0 0 10px 0;
  font-size: 16px;
  color: #333;
  padding-bottom: 8px;
  border-bottom: 1px solid #eee;
}

.card-content {
  display: flex;
  flex: 1;
  gap: 10px;
}

.table-container {
  flex: 1;
  overflow-y: auto;
  border: 1px solid #eee;
  border-radius: 4px;
  max-height: 200px;
}

.chart-container {
  flex: 1;
  min-height: 200px;
}

table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}

th, td {
  padding: 8px 12px;
  text-align: left;
  border-bottom: 1px solid #eee;
}

th {
  background-color: #f8f9fa;
  position: sticky;
  top: 0;
}

#map-container {
  flex: 1;
  min-height: 300px;
  border-radius: 4px;
}

.map-legend {
  display: flex;
  gap: 15px;
  margin-top: 10px;
  font-size: 12px;
}

.legend-icon {
  display: inline-block;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  margin-right: 5px;
}

.legend-icon.fishery {
  background-color: #3388ff;
}

.legend-icon.boat {
  background-color: #ff3333;
}

.message-container {
  flex: 1;
  overflow-y: auto;
  max-height: 180px;
}

.message-item {
  padding: 8px 0;
  border-bottom: 1px solid #f0f0f0;
}

.message-time {
  font-size: 12px;
  color: #999;
}

.message-content {
  margin-top: 4px;
  font-size: 14px;
}

@media (max-width: 1200px) {
  .card-content {
    flex-direction: column;
  }

  .table-container,
  .chart-container {
    max-height: none;
  }
}
</style>