<template>
  <div class="fishery-dashboard">
    <!--  导航  -->

    <!-- 上半部分 -->
    <div class="upper-section">
      <!-- 左侧 (7份) -->
      <div class="left-panel">
        <!--  渔场信息  -->
        <div class="horizontal-container" >
          <div class="vertical-container" style="height: 48vh; width:26vh" @click="openDrawer('fishery')">
            <!-- 渔场信息缩略表 改为今日捕捞 -->
            <div class="card">
              <h3>今日捕捞</h3>
              <div class="table-scroll-container">
                <!--  今日捕捞量统计表  -->
                <table>
                  <thead>
                  <tr>
                    <th>渔场名称</th>
                    <th>捕捞量(kg)</th>
                  </tr>
                  </thead>
                  <tbody>
                  <tr v-for="(item, index) in todayCatchByFishery" :key="'catch-'+index">
                    <td>{{ item.catch_fishery }}</td>
                    <td>{{ item.catch_today.toFixed(2) }}</td>
                  </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <!-- 渔场产量饼图 改为今日海产品捕捞量占比 -->
            <div class="card">
              <h3>今日海产品占比</h3>
              <div ref="catchTypePieChart" class="chart"></div>
            </div>
          </div>

          <!--  水质信息  -->
          <div class="vertical-container" style="height: 48vh; width:26vh " @click="openDrawer('water')">
            <!-- 水质信息表 -->
            <div class="card" style="width: 26vh">
              <h3>水质信息</h3>
              <div class="table-scroll-container">
                <table>
                  <thead>
                  <tr>
                    <th>数据项</th>
                    <th>实时值</th>
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
            </div>
            <!-- 水质记录统计柱状图 -->
            <div class="card " style="width: 26vh">
              <h3>今日水质统计</h3>
              <div ref="todayWaterQualityChart" class="chart"></div>
            </div>
          </div>
        </div>

      </div>


      <!-- 中间 (9份) - 地图 -->
      <div class="center-panel">
        <div class="card map-container">
          <h3 class="centered-title">实时地图 <span class="current-time">{{ currentDateTime }}</span></h3>
          <div id="openstreetmap" ref="mapContainer"></div>
          <div class="map-legend">
            <div><span class="legend-icon fishery"></span> 渔场</div>
            <div><span class="legend-icon boat"></span> 渔船</div>
            <div><span class="legend-icon fleet"></span> 车队</div>
            <div><span class="legend-icon terminal"></span> 码头</div>
            <div><span class="legend-icon factory"></span> 工厂</div>
            <div><span class="legend-icon fish"></span> 鱼群</div>
          </div>
        </div>
      </div>


      <!-- 右侧 (7份) -->
      <div class="right-panel">
        <div class="horizontal-container">
          <!-- 车队互联消息记录 -->
          <div class="card-row" style="width: 24vh; height: 48vh" >
            <h3>车船互联-消息中心</h3>
            <div class="message-center">
              <!-- 消息列表视图 -->
              <div v-if="!currentChat" class="message-tabs">
                <!-- 标签页导航 -->
                <div class="tab-nav">
                  <div
                      v-for="tab in messageTabs"
                      :key="tab.id"
                      :class="['tab-item', { active: currentTab === tab.id }]"
                      @click="currentTab = tab.id"
                  >
                    {{ tab.name }}
                  </div>
                </div>

                <!-- 消息列表 -->
                <div class="message-list">
                  <div
                      v-for="msg in filteredMessages"
                      :key="msg.id"
                      class="message-item"
                      @click="openChat(msg)"
                  >
                    <div class="message-avatar">
                      <img :src="msg.avatar" :alt="msg.sender">
                      <div v-if="msg.unread" class="unread-badge">{{ msg.unread }}</div>
                    </div>
                    <div class="message-info">
                      <div class="message-header">
                        <span class="sender-name">{{ msg.sender }}</span>
                        <span class="message-time">{{ msg.time }}</span>
                      </div>
                      <div class="message-preview">{{ msg.preview }}</div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- 聊天室视图 -->
              <div v-else class="chat-room">
                <!-- 聊天室头部 -->
                <div class="chat-header">
                  <div class="back-button" @click="closeChat">
                    <span>&lt;</span>
                  </div>
                  <div class="chat-title">{{ currentChat.sender }}</div>
                </div>

                <!-- 聊天内容区域 -->
                <div class="chat-messages" ref="chatMessages">
                  <div
                      v-for="(msg, index) in currentChat.messages"
                      :key="index"
                      :class="['chat-message', { 'message-self': msg.isSelf }]"
                  >
                    <div class="message-avatar" v-if="!msg.isSelf">
                      <img :src="currentChat.avatar" :alt="currentChat.sender">
                    </div>
                    <div class="message-bubble">
                      <div class="message-content" v-html="msg.content"></div>
                      <div class="message-time">{{ msg.time }}</div>
                    </div>
                    <div class="message-avatar" v-if="msg.isSelf">
                      <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23007AFF'%3E%3Cpath d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z'/%3E%3C/svg%3E" alt="我">
                    </div>
                  </div>
                </div>

                <!-- 输入区域 -->
                <div class="chat-input">
                      <textarea
                          v-model="newMessage"
                          placeholder="输入消息..."
                          @keyup.enter.prevent="sendMessage"
                      ></textarea>
                  <button @click="sendMessage">发送</button>
                </div>
              </div>
            </div>
          </div>

          <div class="vertical-separator">
            <!-- 鱼群预测表格 -->
            <div class="card" style="width: 28vh; height: 19vh" >
              <h3>鱼情预测</h3>
              <div class="table-scroll-container">
                <table>
                  <thead>
                  <tr>
                    <th>海产类别</th>
                    <th>产量估测</th>
                    <th>移动趋势</th>
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
            </div>
            <div class="card" style="width: 28vh; height: 28vh">
              <h3>市场预测</h3>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 下半部分 -->
    <div class="lower-section">
      <!-- 左侧 (8份) -->
      <div class="left-panel" @click="openDrawer('ship')">
        <!-- 船舶信息表 -->
        <div class="card">
          <h3>今日船务</h3>
          <div class="table-scroll-container">
            <table>
              <thead>
              <tr>
                <th>渔船编号</th>
                <th>所属公司</th>
                <th>作业状态</th>
                <th>捕捞量</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="(ship, index) in todayShipOperations" :key="'ship-'+index">
                <td>{{ ship.today_ship_id }}</td>
                <td>{{ ship.today_ship_company }}</td>
                <td>{{ ship.today_ship_status }}</td>
                <td>{{ ship.today_ship_catch ? ship.today_ship_catch.toFixed(2) : '0.00' }}kg</td>
              </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- 船只捕鱼产量面积图 -->
        <div class="horizontal-container">
          <div class="card-row" style="width: 28vh">
            <h3>渔船捕捞统计</h3>
            <div ref="shipCaptureChart" class="chart"></div>
          </div>

          <div class="card-row" style="width: 29vh">
            <h3>海产品捕捞比例</h3>
            <div ref="productPieChart" class="chart"></div>
          </div>
        </div>
      </div>


      <!-- 中间 (8份) -->
      <div class="center-panel" @click="openDrawer('dock')">
        <!-- 码头信息表 -->
        <div class="card">
          <h3>今日码头</h3>
          <div class="table-scroll-container">
            <table>
              <thead>
              <tr>
                <th>码头名称</th>
                <th>入港量(吨)</th>
                <th>出港量(吨)</th>
                <th>码头状态</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="(dock, index) in todayDockInfo" :key="'dock-'+index">
                <td>{{ dock.today_dock_name }}</td>
                <td>{{ dock.today_dock_input.toFixed(2) }}</td>
                <td>{{ dock.today_dock_output.toFixed(2) }}</td>
                <td>{{ dock.today_dock_status }}</td>
              </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- 码头周转量统计图 -->
        <div class="horizontal-container">
          <div class="card-row" style="width: 28vh">
            <h3>各公司出港统计</h3>
            <div ref="dockTransChart" class="chart"></div>
          </div>
          <div class="card-row" style="width: 29vh">
            <h3>各类产品出港量</h3>
            <div ref="dockCategoryChart" class="chart"></div>
          </div>
        </div>
      </div>

      <!-- 右侧 (8份) -->
      <div class="right-panel">
        <!-- 车队信息表 -->
        <div class="card" @click="openDrawer('tran')">
          <h3>今日车队</h3>
          <div class="table-scroll-container">
            <table>
              <thead>
              <tr>
                <th>车队编号</th>
                <th>车队名称</th>
                <th>车队状态</th>
                <th>准时率</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="(fleet, index) in todayFleetData" :key="'fleet-'+index">
                <td>{{ fleet.today_fleet_id }}</td>
                <td>{{ fleet.today_fleet_name }}</td>
                <td>{{ fleet.today_fleet_status }}</td>
                <td>{{ fleet.today_fleet_pre > 0 ? fleet.today_fleet_pre.toFixed(1) : '0.0' }}</td>
              </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- 车队运输量统计图 -->
        <div class="horizontal-container">
          <div class="card-row" style="width: 28vh">
            <h3>车队运输量统计</h3>
            <div id="fleet-transport-chart" class="chart"></div>
          </div>
          <div class="card-row" style="width: 29vh">
            <h3>车队准时率</h3>
            <div id="fleet-punctuality-chart" class="chart"></div>
          </div>
        </div>
      </div>
    </div>

    <!---->
    <DrawerFisheryCenter v-model="drawerFisheryCenter" />
    <DrawerWaterCenter v-model="drawerWaterCenter" />
    <DrawerTranCenter v-model="drawerTranCenter" />
    <DrawerDockCenter v-model="drawerDockCenter" />
    <DrawerShipCenter v-model="drawerShipCenter" />
    <DrawerMessCenter v-model="drawerMessCenter" />



  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, reactive, nextTick, computed } from 'vue'
import * as echarts from 'echarts'
import '../assets/leaflet/leaflet.css'
import axios from 'axios'


import DrawerFisheryCenter from './fisheries/FisheryCenter.vue'
import DrawerWaterCenter from './fisheries/WaterCenter.vue'
import DrawerTranCenter from './fisheries/TranCenter.vue'
import DrawerDockCenter from './fisheries/DockCenter.vue'
import DrawerShipCenter from './fisheries/ShipCenter.vue'
import DrawerMessCenter from './fisheries/MessCenter.vue'

// 数据定义
const fisheries = ref([])

const waterQuality = ref([
  { name: '高锰酸钾', value: '1.65mg/L' },
  { name: 'PH', value: '8.43' },
  { name: '溶解氧', value: '0.04mg/L' },
  { name: '总氧', value: '0.68mg/L' },
  { name: '水温', value: '30.19°C' }
])

const messages = ref([])

const fishPrediction = ref([
  { category: '小黄鱼', estimate: 28, trend: 'Northwest' },
  { category: '带鱼', estimate: 30, trend: 'East' },
  { category: '鲳鱼', estimate: 70, trend: 'East' }
])

const ships = ref([])

const docks = ref([])

const fleets = ref([])

// 新增数据定义
const todayCatchByFishery = ref([])
const todayCatchByType = ref([])
const DEFAULT_DATE = {
  year: 2024,
  month: 12,
  day: 1
}

// 获取今日捕捞数据
const fetchTodayCatchData = async () => {
  try {
    const response = await axios.get('http://localhost:8080/catch')
    const catchData = response.data
    processCatchData(catchData)
    // 数据处理完毕后立即更新图表
    nextTick(() => {
      updateCatchTypePieChart()
    })
  } catch (error) {
    console.error('获取今日捕捞数据失败:', error)
  }
}

// 处理捕捞数据
const processCatchData = (data) => {
  // 筛选今日数据 (2024年12月1日)
  const todayData = data.filter(item =>
      item.catch_year === DEFAULT_DATE.year &&
      item.catch_month === DEFAULT_DATE.month &&
      item.catch_day === DEFAULT_DATE.day
  )

  console.log('筛选后的今日捕捞数据:', todayData)

  // 按渔场分组统计今日捕捞量
  const fisheryMap = new Map()
  todayData.forEach(item => {
    const fishery = item.catch_fishery
    const weight = parseFloat(item.catch_weight || 0)

    if (fisheryMap.has(fishery)) {
      fisheryMap.set(fishery, fisheryMap.get(fishery) + weight)
    } else {
      fisheryMap.set(fishery, weight)
    }
  })

  // 转换为数组格式
  todayCatchByFishery.value = Array.from(fisheryMap.entries()).map(([catch_fishery, catch_today]) => ({
    catch_fishery,
    catch_today
  }))

  // 按照产品类型统计
  const typeMap = new Map()
  todayData.forEach(item => {
    const type = item.catch_type || '其他'
    const weight = parseFloat(item.catch_weight || 0)
    if (typeMap.has(type)) {
      typeMap.set(type, typeMap.get(type) + weight)
    } else {
      typeMap.set(type, weight)
    }
  })

  // 转换为饼图需要的格式
  todayCatchByType.value = Array.from(typeMap.entries()).map(([name, value]) => ({
    name,
    value: parseFloat(value.toFixed(2))
  }))
}

// 更新海产品类型饼图
const updateCatchTypePieChart = () => {
  if (catchTypePieChart.value) {
    // 检查数据源是否有效
    if (!todayCatchByType.value || todayCatchByType.value.length === 0) {
      console.warn('海产品类型数据为空')
      const chart = echarts.init(catchTypePieChart.value)
      chart.setOption({
        title: {
          text: '暂无数据',
          left: 'center',
          top: 'center'
        }
      })
      return
    }

    console.log('更新海产品类型饼图，数据:', todayCatchByType.value)
    const chart = echarts.init(catchTypePieChart.value)
    chart.setOption({
      tooltip: {
        trigger: 'item',
        formatter: function(params) {
          return `${params.name}: ${params.value.toFixed(2)}kg (${params.percent.toFixed(2)}%)`;
        },
        position: function(pos, params, dom, rect, size) {
          return {top: pos[1] - 10, left: pos[0] + 10};
        },
        confine: true
      },
      // 更新为更加鲜艳的彩虹色系
      color: ['#FF3B30', '#FF9500', '#FFCC00', '#4CD964', '#5AC8FA', '#007AFF', '#5856D6', '#FF2D55', '#8A2BE2'],
      series: [{
        name: '海产品捕捞量',
        type: 'pie',
        // 修改为空心饼图（甜甜圈图）
        radius: ['15%', '65%'],
        center: ['50%', '50%'],
        data: todayCatchByType.value,
        // 添加光滑圆角过渡效果
        itemStyle: {
          borderRadius: 4,
          borderColor: '#fff',
          borderWidth: 2
        },
        // 添加轻微放大的动画效果
        animationType: 'scale',
        animationEasing: 'elasticOut',
        emphasis: {
          itemStyle: {
            shadowBlur: 15,
            shadowOffsetX: 2,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        },
        label: {
          formatter: function(params) {
            return `${params.name}\n${params.percent.toFixed(2)}%`;
          },
          position: 'outside',
          fontSize: 10
        },
        // 添加引导线
        labelLine: {
          length: 3,
          length2: 3,
          smooth: true
        }
      }]
    })

    // 将图表实例添加到全局图表实例列表
    if (typeof chartInstances !== 'undefined') {
      chartInstances.push(chart)
    }
  } else {
    console.error('找不到海产品类型饼图容器')
  }
}

// 图表引用
const fisheryPieChart = ref(null)
const waterQualityChart = ref(null)
const shipProductionChart = ref(null)
const dockTurnoverChart = ref(null)
const fleetTransportChart = ref(null)
const mapContainer = ref(null)
const catchTypePieChart = ref(null)

// 初始化所有图表
const initCharts = () => {
  // 渔场产量饼图
  if (fisheryPieChart.value) {
    const chart = echarts.init(fisheryPieChart.value)
    chart.setOption({
      tooltip: {
        trigger: 'item',
        formatter: function(params) {
          return `${params.seriesName} <br/>${params.name}: ${params.value.toFixed(2)} (${params.percent.toFixed(2)}%)`;
        },
        position: function(pos, params, dom, rect, size) {
          return {top: pos[1] - 10, left: pos[0] + 10};
        },
        confine: true
      },
      series: [{
        name: '渔场产量',
        type: 'pie',
        radius: '60%',
        data: fisheries.value.map(item => ({
          value: item.output,
          name: item.name
        }))
      }]
    })
  }

  // 水质记录统计柱状图
  if (waterQualityChart.value) {
    const chart = echarts.init(waterQualityChart.value)
    chart.setOption({
      tooltip: {
        trigger: 'axis',
        formatter: function(params) {
          return `${params[0].name}<br/>${params[0].seriesName}: ${params[0].value.toFixed(2)}`;
        },
        position: function(pos, params, dom, rect, size) {
          return {top: pos[1] - 10, left: pos[0] + 10};
        },
        confine: true
      },
      xAxis: {
        type: 'category',
        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
      },
      yAxis: {
        type: 'value'
      },
      series: [{
        name: '水质指数',
        type: 'bar',
        data: [120, 200, 150, 80, 70, 110, 130]
      }]
    })
  }

  // 船只捕鱼产量面积图
  if (shipProductionChart.value) {
    const chart = echarts.init(shipProductionChart.value)
    chart.setOption({
      tooltip: {
        trigger: 'axis',
        formatter: function(params) {
          return `${params[0].name}<br/>${params[0].seriesName}: ${params[0].value.toFixed(2)}`;
        },
        position: function(pos, params, dom, rect, size) {
          return {top: pos[1] - 10, left: pos[0] + 10};
        },
        confine: true
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月']
      },
      yAxis: {
        type: 'value'
      },
      series: [{
        name: '捕鱼量',
        type: 'line',
        stack: '总量',
        areaStyle: {},
        data: [120, 132, 101, 134, 90, 230, 210]
      }]
    })
  }

  // 码头周转量统计图
  if (dockTurnoverChart.value) {
    const chart = echarts.init(dockTurnoverChart.value)
    chart.setOption({
      tooltip: {
        trigger: 'axis',
        formatter: function(params) {
          return `${params[0].name}<br/>${params[0].seriesName}: ${params[0].value.toFixed(2)}`;
        },
        position: function(pos, params, dom, rect, size) {
          return {top: pos[1] - 10, left: pos[0] + 10};
        },
        confine: true
      },
      xAxis: {
        type: 'category',
        data: ['普陀', '定海', '岱山', '沈家门', '朱家尖']
      },
      yAxis: {
        type: 'value'
      },
      series: [{
        name: '周转量',
        type: 'bar',
        data: [500, 450, 380, 620, 480]
      }]
    })
  }

  // 车队运输量统计图
  if (fleetTransportChart.value) {
    const chart = echarts.init(fleetTransportChart.value)
    chart.setOption({
      tooltip: {
        trigger: 'axis',
        formatter: function(params) {
          return `${params[0].name}<br/>${params[0].seriesName}: ${params[0].value.toFixed(2)}`;
        },
        position: function(pos, params, dom, rect, size) {
          return {top: pos[1] - 10, left: pos[0] + 10};
        },
        confine: true
      },
      xAxis: {
        type: 'category',
        data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月']
      },
      yAxis: {
        type: 'value'
      },
      series: [{
        name: '运输量',
        type: 'line',
        data: [820, 932, 901, 934, 1290, 1330, 1320]
      }]
    })
  }

  // 今日海产品捕捞量占比饼图
  if (catchTypePieChart.value && todayCatchByType.value.length > 0) {
    updateCatchTypePieChart()
  }
}

//使用开源地图（Leaflet + OpenStreetMap）
// 在onMounted外部定义map变量以便在unmount时访问
let map = null

const initOpenStreetMap = () => {
  // 动态加载Leaflet库
  const script = document.createElement('script')
  script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
  script.integrity = 'sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo='
  script.crossOrigin = ''
  script.async = true
  script.onload = () => {
    if (mapContainer.value && window.L) {
      // 初始化地图
      map = window.L.map(mapContainer.value).setView([29.985, 122.207], 10)

      // 添加OpenStreetMap底图
      window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 18
      }).addTo(map)

      // 添加渔场标记（根据您的数据动态添加）
      const fisheries = [
        { name: '普陀渔场', lat: 29.985, lng: 122.207 },
        { name: '定海渔场', lat: 30.015, lng: 122.1 },
        { name: '岱山渔场', lat: 30.25, lng: 122.2 }
      ]

      fisheries.forEach(fishery => {
        window.L.marker([fishery.lat, fishery.lng])
            .addTo(map)
            .bindPopup(`<b>${fishery.name}</b>`)
      })

      // 添加渔船位置标记（模拟数据）
      window.L.marker([29.98, 122.2], {
        icon: window.L.divIcon({
          className: 'boat-marker',
          html: '🛥️',
          iconSize: [24, 24]
        })
      }).addTo(map).bindPopup('浙渔001号')
    }
  }
  document.head.appendChild(script)
}

// 添加今日渔船作业相关数据和函数
const todayShipOperations = ref([])
const shipCaptureChart = ref(null)
const productPieChart = ref(null)

// 获取今日渔船作业数据
const fetchTodayShipOperations = async () => {
  try {
    const response = await axios.get('http://localhost:8080/todayship')
    todayShipOperations.value = response.data
    console.log('今日渔船作业数据:', todayShipOperations.value)
  } catch (error) {
    console.error('获取今日渔船作业数据失败:', error)
    todayShipOperations.value = []
  }
}

// 添加回原来的图表数据获取函数，仅用于下方两个图表
const todayShipData = ref([])

// 获取今日渔船捕捞图表数据 - 使用原来的数据源
const fetchTodayShipData = async () => {
  try {
    // 使用原来的数据源，按船舶筛选和分组
    const response = await axios.get('http://localhost:8080/catch')
    const data = response.data

    if (Array.isArray(data)) {
      // 筛选今日数据
      const todayData = data.filter(item =>
          item.catch_year === DEFAULT_DATE.year &&
          item.catch_month === DEFAULT_DATE.month &&
          item.catch_day === DEFAULT_DATE.day
      )

      console.log('筛选后的今日船舶数据:', todayData)

      // 按船舶分组聚合数据
      const shipMap = new Map()

      todayData.forEach(item => {
        const shipId = item.catch_ship
        // 如果数据中没有ship_company，使用catch_dock替代或设为'未知'
        const company = item.catch_dock || '未知公司'
        const weight = parseFloat(item.catch_weight || 0)

        if (shipMap.has(shipId)) {
          const shipData = shipMap.get(shipId)
          shipMap.set(shipId, {
            ...shipData,
            catch_weight: shipData.catch_weight + weight,
            // 这里保留最新状态，可能需要根据实际情况调整
            ship_status: shipData.ship_status
          })
        } else {
          shipMap.set(shipId, {
            ship_id: shipId,
            ship_company: company,
            ship_status: '在航', // 默认状态，可能需要根据实际情况调整
            catch_weight: weight,
            catch_type: item.catch_type
          })
        }
      })

      // 转换为数组格式
      todayShipData.value = Array.from(shipMap.values())
    } else {
      console.error('获取的船舶数据格式不正确:', data)
      todayShipData.value = []
    }

    // 数据加载完成后立即更新图表
    nextTick(() => {
      updateShipCaptureChart()
      updateProductPieChart()
    })
  } catch (error) {
    console.error('获取今日船舶图表数据失败:', error)
    todayShipData.value = []

    // 即使没有数据，也尝试更新图表
    nextTick(() => {
      updateShipCaptureChart()
      updateProductPieChart()
    })
  }
}

// 更新渔船捕捞统计图表 - 对应ship_new.vue中第三分页第一个图
const updateShipCaptureChart = () => {
  if (shipCaptureChart.value) {
    const chart = echarts.init(shipCaptureChart.value)

    // 从原始捕捞数据中按小时统计
    axios.get('http://localhost:8080/catch').then(response => {
      const data = response.data

      // 筛选今日数据
      const todayData = data.filter(item =>
          item.catch_year === DEFAULT_DATE.year &&
          item.catch_month === DEFAULT_DATE.month &&
          item.catch_day === DEFAULT_DATE.day
      )

      // 按小时分组统计
      const hourlyData = {}

      todayData.forEach(item => {
        const hour = item.catch_hour || 0
        if (!hourlyData[hour]) {
          hourlyData[hour] = 0
        }
        hourlyData[hour] += parseFloat(item.catch_weight || 0)
      })

      // 转换为图表需要的格式
      const hours = Object.keys(hourlyData).sort((a, b) => parseInt(a) - parseInt(b))
      const catchData = hours.map(hour => hourlyData[hour])

      // 格式化小时标签
      const hourLabels = hours.map(hour => `${hour}:00`)

      // 设置图表
      setShipCaptureChartOptions(chart, hourLabels, catchData)
    }).catch(error => {
      console.error('获取按小时统计数据失败:', error)
      // 显示空图表
      setShipCaptureChartOptions(chart, [], [])
    })
  }
}

// 提取设置图表选项的函数，以便复用
const setShipCaptureChartOptions = (chart, hourLabels, catchData) => {
  if (!hourLabels || hourLabels.length === 0) {
    chart.setOption({
      title: {
        text: '暂无数据',
        left: 'center',
        top: 'center'
      }
    })
    return
  }

  chart.setOption({
    tooltip: {
      trigger: 'axis',
      formatter: function(params) {
        return `${params[0].name}时<br/>捕捞量: ${params[0].value.toFixed(2)}kg`;
      },
      position: function(pos, params, dom, rect, size) {
        return {top: pos[1] - 10, left: pos[0] + 10};
      },
      confine: true
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: hourLabels.map(hourLabel => hourLabel.split(':')[0]),
      axisLabel: {
        interval: 0
      }
    },
    yAxis: {
      type: 'value',
      name: '捕捞量(kg)'
    },
    series: [{
      name: '捕捞量',
      data: catchData,
      type: 'bar',
      itemStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: '#5470c6' },
          { offset: 0.5, color: '#91cc75' },
          { offset: 1, color: '#fac858' }
        ])
      },
      emphasis: {
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: '#ee6666' },
            { offset: 0.7, color: '#73c0de' },
            { offset: 1, color: '#3ba272' }
          ])
        }
      }
    }]
  })

  // 将图表实例添加到全局图表实例列表
  if (typeof chartInstances !== 'undefined' && !chartInstances.includes(chart)) {
    chartInstances.push(chart)
  }
}

// 修改海产品饼图，确保没有数据时不使用虚拟数据
const updateProductPieChart = () => {
  if (productPieChart.value) {
    console.log('开始更新公司捕捞量饼图')
    const chart = echarts.init(productPieChart.value)

    // 直接从捕捞数据中按公司统计
    axios.get('http://localhost:8080/catch').then(response => {
      const data = response.data

      // 筛选今日数据
      const todayData = data.filter(item =>
          item.catch_year === DEFAULT_DATE.year &&
          item.catch_month === DEFAULT_DATE.month &&
          item.catch_day === DEFAULT_DATE.day
      )

      // 按公司分组统计捕捞量
      const companyMap = new Map()

      todayData.forEach(item => {
        // 仅使用catch_company字段
        const company = item.catch_company || '其他渔业公司'

        const weight = parseFloat(item.catch_weight || 0)

        if (companyMap.has(company)) {
          companyMap.set(company, companyMap.get(company) + weight)
        } else {
          companyMap.set(company, weight)
        }
      })

      // 转换为饼图需要的格式
      const companyData = Array.from(companyMap.entries()).map(([name, value]) => ({
        name,
        value: parseFloat(value.toFixed(2))
      }))

      console.log('处理后的公司捕捞数据:', companyData)

      // 如果没有数据，显示提示信息
      if (companyData.length === 0) {
        chart.setOption({
          title: {
            text: '暂无数据',
            left: 'center',
            top: 'center'
          }
        })
        return
      }

      // 设置图表选项
      chart.setOption({
        tooltip: {
          trigger: 'item',
          formatter: function(params) {
            return `${params.name}: ${params.value.toFixed(2)}kg (${params.percent.toFixed(2)}%)`;
          },
          position: function(pos, params, dom, rect, size) {
            return {top: pos[1] - 10, left: pos[0] + 10};
          },
          confine: true
        },
        // 更新为更加流行的渐变色系
        color: [
          new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {offset: 0, color: '#83a4d4'},
            {offset: 1, color: '#b6fbff'}
          ]),
          new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {offset: 0, color: '#fa709a'},
            {offset: 1, color: '#fee140'}
          ]),
          new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {offset: 0, color: '#667eea'},
            {offset: 1, color: '#764ba2'}
          ]),
          new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {offset: 0, color: '#f5576c'},
            {offset: 1, color: '#f093fb'}
          ]),
          new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {offset: 0, color: '#4facfe'},
            {offset: 1, color: '#00f2fe'}
          ]),
          new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {offset: 0, color: '#43e97b'},
            {offset: 1, color: '#38f9d7'}
          ])
        ],
        series: [{
          name: '公司捕捞量',
          type: 'pie',
          // 修改为空心饼图
          radius: ['25%', '65%'],
          center: ['50%', '50%'],
          data: companyData,
          // 添加圆角和边框
          itemStyle: {
            borderRadius: 5,
            borderColor: '#fff',
            borderWidth: 2
          },
          // 旋转效果的动画
          animationType: 'scale',
          animationEasing: 'elasticOut',
          emphasis: {
            itemStyle: {
              shadowBlur: 15,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          },
          label: {
            formatter: function(params) {
              return `${params.name}\n${params.percent.toFixed(2)}%`;
            },
            position: 'outside',
            fontSize: 10
          },
          // 添加引导线
          labelLine: {
            show: true,
            length: 12,
            length2: 16,
            smooth: true,
            lineStyle: {
              width: 1,
              type: 'solid'
            }
          }
        }]
      })

      // 将图表实例添加到全局图表实例列表
      if (typeof chartInstances !== 'undefined' && !chartInstances.includes(chart)) {
        chartInstances.push(chart)
      }
    }).catch(error => {
      console.error('获取公司捕捞数据失败:', error)
      // 显示空图表
      chart.setOption({
        title: {
          text: '暂无数据',
          left: 'center',
          top: 'center'
        }
      })
    })
  } else {
    console.error('找不到公司捕捞量饼图容器')
  }
}

// 在 data 部分添加引用和数据变量
const todayWaterQualityChart = ref(null)
const todayWaterData = ref([])

// 获取今日水质数据
const fetchTodayWaterQuality = async () => {
  try {
    const response = await axios.get('http://localhost:8080/water')
    const data = response.data

    // 筛选今日数据
    const todayData = data.filter(item =>
        item.water_year === DEFAULT_DATE.year &&
        item.water_month === DEFAULT_DATE.month &&
        item.water_day === DEFAULT_DATE.day
    )

    todayWaterData.value = todayData
    console.log('今日水质数据:', todayWaterData.value)

    // 数据加载完成后更新图表
    nextTick(() => {
      updateTodayWaterQualityChart()
    })
  } catch (error) {
    console.error('获取今日水质数据失败:', error)
    todayWaterData.value = []

    // 即使没有数据，也尝试更新图表
    nextTick(() => {
      updateTodayWaterQualityChart()
    })
  }
}

// 更新今日水质统计图表
const updateTodayWaterQualityChart = () => {
  if (todayWaterQualityChart.value) {
    console.log('更新今日水质统计图表')
    const chart = echarts.init(todayWaterQualityChart.value)

    // 检查数据是否为空
    if (!todayWaterData.value || todayWaterData.value.length === 0) {
      chart.setOption({
        title: {
          text: '暂无数据',
          left: 'center',
          top: 'center'
        }
      })
      return
    }

    // 按小时分组计算平均值
    const hourlyData = {}
    // 更新为所有需要的水质参数
    const parameters = [
      'T', 'MN', 'PH', 'DO', 'TCL', 'HCL', 'temp',
      'TN', 'NO2', 'NO3', 'TP', 'S', 'SS', 'HM', 'mark'
    ]

    // 初始化小时数据存储
    todayWaterData.value.forEach(item => {
      const hour = item.water_hour || 0
      if (!hourlyData[hour]) {
        hourlyData[hour] = {
          count: 0,
          // 初始化所有参数值为0
          T: 0, MN: 0, PH: 0, DO: 0, TCL: 0,
          HCL: 0, temp: 0, TN: 0, NO2: 0, NO3: 0,
          TP: 0, S: 0, SS: 0, HM: 0, mark: 0
        }
      }

      // 累加各参数值
      hourlyData[hour].count++
      parameters.forEach(param => {
        hourlyData[hour][param] += parseFloat(item[`water_${param}`] || 0)
      })
    })

    // 计算每小时平均值
    const hours = Object.keys(hourlyData).sort((a, b) => parseInt(a) - parseInt(b))
    const seriesData = {}

    parameters.forEach(param => {
      seriesData[param] = hours.map(hour => {
        const data = hourlyData[hour]
        return data.count > 0 ? (data[param] / data.count).toFixed(2) : 0
      })
    })

    // 设置图表选项
    chart.setOption({
      tooltip: {
        trigger: 'axis',
        formatter: function(params) {
          let result = `${params[0].name}时<br/>`
          params.forEach(param => {
            // 为参数添加单位和参考值（如果有）
            let label = param.seriesName
            result += `${label}: ${param.value}<br/>`
          })
          return result
        }
      },
      grid: {
        left: '5%',
        right: '5%',
        bottom: '8%',
        top: '5%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: hours.map(hour => hour),
        axisLabel: {
          interval: 2,
          fontSize: 11,
          margin: 8
        }
      },
      yAxis: {
        type: 'value',
        axisLabel: {
          formatter: '{value}'
        },
        splitLine: {
          show: true,
          lineStyle: {
            color: '#eee',
            type: 'dashed'
          }
        }
      },
      animation: true,
      animationDuration: 1000,
      animationEasing: 'cubicOut',
      series: [
        {
          name: 'water_T 浊度(参考值0.1)',
          type: 'line',
          data: seriesData.T,
          smooth: true,
          lineStyle: { width: 1.5 },
          symbol: 'circle',
          symbolSize: 4,
          areaStyle: { opacity: 0.1 }
        },
        {
          name: 'water_MN 高锰酸钾指数(参考值1.65mg/L)',
          type: 'line',
          data: seriesData.MN,
          smooth: true,
          lineStyle: { width: 1.5 },
          symbol: 'circle',
          symbolSize: 4,
          areaStyle: { opacity: 0.1 }
        },
        {
          name: 'water_PH PH值',
          type: 'line',
          data: seriesData.PH,
          smooth: true,
          lineStyle: { width: 1.5 },
          symbol: 'circle',
          symbolSize: 4,
          areaStyle: { opacity: 0.1 }
        },
        {
          name: 'water_DO 溶解氧',
          type: 'line',
          data: seriesData.DO,
          smooth: true,
          lineStyle: { width: 1.5 },
          symbol: 'circle',
          symbolSize: 4,
          areaStyle: { opacity: 0.1 }
        },
        {
          name: 'water_TCL 总氯',
          type: 'line',
          data: seriesData.TCL,
          smooth: true,
          lineStyle: { width: 1.5 },
          symbol: 'circle',
          symbolSize: 4,
          areaStyle: { opacity: 0.1 }
        },
        {
          name: 'water_HCL 氢氯',
          type: 'line',
          data: seriesData.HCL,
          smooth: true,
          lineStyle: { width: 1.5 },
          symbol: 'circle',
          symbolSize: 4,
          areaStyle: { opacity: 0.1 }
        },
        {
          name: 'water_temp 水温(22度)',
          type: 'line',
          data: seriesData.temp,
          smooth: true,
          lineStyle: { width: 1.5 },
          symbol: 'circle',
          symbolSize: 4,
          areaStyle: { opacity: 0.1 }
        },
        {
          name: 'water_TN 总氮',
          type: 'line',
          data: seriesData.TN,
          smooth: true,
          lineStyle: { width: 1.5 },
          symbol: 'circle',
          symbolSize: 4,
          areaStyle: { opacity: 0.1 }
        },
        {
          name: 'water_NO2 亚硝酸盐',
          type: 'line',
          data: seriesData.NO2,
          smooth: true,
          lineStyle: { width: 1.5 },
          symbol: 'circle',
          symbolSize: 4,
          areaStyle: { opacity: 0.1 }
        },
        {
          name: 'water_NO3 硝酸盐',
          type: 'line',
          data: seriesData.NO3,
          smooth: true,
          lineStyle: { width: 1.5 },
          symbol: 'circle',
          symbolSize: 4,
          areaStyle: { opacity: 0.1 }
        },
        {
          name: 'water_TP 总磷',
          type: 'line',
          data: seriesData.TP,
          smooth: true,
          lineStyle: { width: 1.5 },
          symbol: 'circle',
          symbolSize: 4,
          areaStyle: { opacity: 0.1 }
        },
        {
          name: 'water_S 盐度',
          type: 'line',
          data: seriesData.S,
          smooth: true,
          lineStyle: { width: 1.5 },
          symbol: 'circle',
          symbolSize: 4,
          areaStyle: { opacity: 0.1 }
        },
        {
          name: 'water_SS 悬浮物',
          type: 'line',
          data: seriesData.SS,
          smooth: true,
          lineStyle: { width: 1.5 },
          symbol: 'circle',
          symbolSize: 4,
          areaStyle: { opacity: 0.1 }
        },
        {
          name: 'water_HM 重金属',
          type: 'line',
          data: seriesData.HM,
          smooth: true,
          lineStyle: { width: 1.5 },
          symbol: 'circle',
          symbolSize: 4,
          areaStyle: { opacity: 0.1 }
        },
        {
          name: 'water_mark 水质分数',
          type: 'line',
          data: seriesData.mark,
          smooth: true,
          lineStyle: { width: 1.5 },
          symbol: 'circle',
          symbolSize: 4,
          areaStyle: { opacity: 0.1 }
        }
      ],
      color: [
        '#5470c6', '#91cc75', '#fac858', '#ee6666', '#73c0de',
        '#3ba272', '#fc8452', '#9a60b4', '#ea7ccc', '#ff7f50',
        '#87cefa', '#32cd32', '#9370db', '#daa520', '#ff69b4'
      ]
    })

    // 确保图表缩放适应容器尺寸
    window.addEventListener('resize', () => {
      chart.resize()
    })

    // 初始调整一次尺寸以确保正确显示
    setTimeout(() => {
      chart.resize()
    }, 200)

    // 将图表实例添加到全局图表实例列表
    if (typeof chartInstances !== 'undefined' && !chartInstances.includes(chart)) {
      chartInstances.push(chart)
    }
  } else {
    console.error('找不到今日水质统计图表容器')
  }
}

// 添加当前时间变量
const currentDateTime = ref('')

// 更新时间的函数
const updateCurrentTime = () => {
  const now = new Date()

  // 格式化日期和时间
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  const hours = String(now.getHours()).padStart(2, '0')
  const minutes = String(now.getMinutes()).padStart(2, '0')
  const seconds = String(now.getSeconds()).padStart(2, '0')

  // 更新显示的时间
  currentDateTime.value = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
}

// 添加今日码头周转数据引用
const todayDockInfo = ref([])

// 获取今日码头周转数据
const fetchTodayDockInfo = async () => {
  try {
    const response = await axios.get('http://localhost:8080/todaydock')
    todayDockInfo.value = response.data
    console.log('今日码头周转数据:', todayDockInfo.value)
  } catch (error) {
    console.error('获取今日码头周转数据失败:', error)
    todayDockInfo.value = []
  }
}

// 添加今日码头数据引用
const todayDockData = ref([])
const dockTransChart = ref(null)
const dockCategoryChart = ref(null)

// 获取今日码头数据 (仅用于图表)
const fetchTodayDockData = async () => {
  try {
    // 修改数据源为trans API
    const response = await axios.get('http://localhost:8080/trans')
    let dockData = response.data

    // 筛选2024年12月1日的数据
    todayDockData.value = dockData.filter(item =>
        item.dock_out_year === 2024 &&
        item.dock_out_month === 12 &&
        item.dock_out_day === 1
    )

    console.log('今日码头数据:', todayDockData.value)

    // 数据加载完成后更新图表
    nextTick(() => {
      updateDockTransChart()
      updateDockCategoryChart()
    })
  } catch (error) {
    console.error('获取今日码头数据失败:', error)
    todayDockData.value = []
  }
}

// 更新码头运输量统计图表
const updateDockTransChart = () => {
  if (!dockTransChart.value) {
    console.error('找不到码头运输量统计图表容器')
    return
  }

  const chart = echarts.init(dockTransChart.value)

  // 检查是否有数据
  if (!todayDockData.value || todayDockData.value.length === 0) {
    chart.setOption({
      title: {
        text: '暂无数据',
        left: 'center',
        top: 'center'
      }
    })
    return
  }

  // 按公司分组数据
  const companyMap = new Map()
  const hourlyData = new Map()

  // 初始化小时数据 (0-23)
  for (let hour = 0; hour < 24; hour++) {
    hourlyData.set(hour, [])
  }

  // 分组数据
  todayDockData.value.forEach(item => {
    const hour = item.dock_out_hour || 0
    const company = item.dock_out_company || '其他'

    if (!hourlyData.has(hour)) {
      hourlyData.set(hour, [])
    }

    hourlyData.get(hour).push(item)

    if (!companyMap.has(company)) {
      companyMap.set(company, [])
    }

    companyMap.get(company).push(item)
  })

  // 获取公司列表
  const companies = Array.from(companyMap.keys())

  // 准备系列数据
  const seriesData = []
  companies.forEach(company => {
    const data = []

    // 对每个小时，计算该公司的运输总量
    for (let hour = 0; hour < 24; hour++) {
      const hourItems = hourlyData.get(hour) || []
      const companyItems = hourItems.filter(item => (item.dock_out_company || '其他') === company)
      const totalWeight = companyItems.reduce((sum, item) =>
          sum + Number(item.dock_out_weight || 0), 0
      )
      data.push(parseFloat(totalWeight.toFixed(2)))
    }

    seriesData.push({
      name: company,
      type: 'line',
      stack: 'Total',
      smooth: true,
      lineStyle: {
        width: 0
      },
      showSymbol: false,
      areaStyle: {
        opacity: 0.8
      },
      emphasis: {
        focus: 'series'
      },
      data: data
    })
  })

  // 创建小时标签 (0-23)
  const hourLabels = Array.from({length: 24}, (_, i) => `${i}时`)

  // 使用更鲜艳的颜色
  const vibrantColors = [
    '#5470c6', '#91cc75', '#fac858', '#ee6666', '#73c0de',
    '#3ba272', '#fc8452', '#9a60b4', '#ea7ccc', '#ff7f50'
  ]

  // 设置图表选项
  chart.setOption({
    color: vibrantColors,
    title: {
      text: '2024年12月1日',
      left: 'center',
      textStyle: {
        fontSize: 14,
        fontWeight: 'bold'
      }
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
        label: {
          backgroundColor: '#6a7985'
        }
      },
      formatter: function(params) {
        let result = `${params[0].axisValue}<br/>`
        let total = 0

        params.forEach(param => {
          const value = parseFloat(param.value)
          result += `${param.seriesName}: ${value.toFixed(2)}吨<br/>`
          total += value
        })

        result += `<b>总计: ${total.toFixed(2)}吨</b>`
        return result
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      top: '30px',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: hourLabels,
      axisLabel: {
        interval: 1,
        fontSize: 10
      }
    },
    yAxis: {
      type: 'value',
      name: '运输量(吨)',
      nameTextStyle: {
        fontSize: 10
      },
      axisLabel: {
        fontSize: 10
      }
    },
    series: seriesData
  })

  // 将图表实例添加到全局图表实例列表
  if (typeof chartInstances !== 'undefined' && !chartInstances.includes(chart)) {
    chartInstances.push(chart)
  }
}

// 更新码头类别占比图表
const updateDockCategoryChart = () => {
  if (!dockCategoryChart.value) {
    console.error('找不到产品类别占比图表容器')
    return
  }

  const chart = echarts.init(dockCategoryChart.value)

  // 检查是否有数据
  if (!todayDockData.value || todayDockData.value.length === 0) {
    chart.setOption({
      title: {
        text: '暂无数据',
        left: 'center',
        top: 'center'
      }
    })
    return
  }

  // 按类别分组统计
  const typeMap = new Map()

  todayDockData.value.forEach(item => {
    const type = item.dock_out_type || '其他'
    const weight = parseFloat(item.dock_out_weight || 0)

    if (typeMap.has(type)) {
      typeMap.set(type, typeMap.get(type) + weight)
    } else {
      typeMap.set(type, weight)
    }
  })

  // 转换为饼图需要的格式
  const typeData = Array.from(typeMap.entries()).map(([name, value]) => ({
    name,
    value: parseFloat(value.toFixed(2))
  }))

  // 使用更鲜艳的颜色
  const vibrantColors = [
    '#5470c6', '#91cc75', '#fac858', '#ee6666', '#73c0de',
    '#3ba272', '#fc8452', '#9a60b4', '#ea7ccc', '#ff7f50'
  ]

  // 设置图表选项
  chart.setOption({
    color: vibrantColors,
    title: {
      text: '2024年12月1日',
      left: 'center',
      top: 5,
      textStyle: {
        fontSize: 12,
        fontWeight: 'normal'
      }
    },
    tooltip: {
      trigger: 'item',
      formatter: function(params) {
        return `${params.name}: ${params.value}吨 (${params.percent.toFixed(1)}%)`
      }
    },
    series: [
      {
        name: '产品类别',
        type: 'pie',
        radius: ['15%', '65%'],
        center: ['50%', '55%'],
        itemStyle: {
          borderRadius: 4,
          borderColor: '#fff',
          borderWidth: 2
        },
        label: {
          formatter: '{b}\n{d}%',
          fontSize: 10
        },
        emphasis: {
          label: {
            fontSize: 12,
            fontWeight: 'bold'
          },
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        },
        data: typeData
      }
    ]
  })

  // 将图表实例添加到全局图表实例列表
  if (typeof chartInstances !== 'undefined' && !chartInstances.includes(chart)) {
    chartInstances.push(chart)
  }
}

// 添加今日车队数据引用
const todayFleetData = ref([])

// 获取今日车队数据
const fetchTodayFleetData = async () => {
  try {
    const response = await axios.get('http://localhost:8080/todayfleet')
    todayFleetData.value = response.data
    console.log('今日车队数据:', todayFleetData.value)
  } catch (error) {
    console.error('获取今日车队数据失败:', error)
    todayFleetData.value = []
  }
}

// 更新车队运输量统计图表
const updateFleetTransportChart = () => {
  // 确保容器已经渲染
  nextTick(() => {
    const chartDom = document.getElementById('fleet-transport-chart')
    if (!chartDom) {
      console.error('找不到车队运输量统计图表容器')
      return
    }

    const chart = echarts.init(chartDom)

    // 获取数据
    axios.get('http://localhost:8080/trans').then(response => {
      const data = response.data

      // 筛选2024年12月1日的数据
      const todayData = data.filter(item =>
          item.dock_out_year === 2024 &&
          item.dock_out_month === 12 &&
          item.dock_out_day === 1
      )

      // 按小时分组统计运输量
      const hourlyData = {}
      todayData.forEach(item => {
        const hour = item.dock_out_hour || 0
        if (!hourlyData[hour]) {
          hourlyData[hour] = 0
        }
        hourlyData[hour] += parseFloat(item.dock_out_weight || 0)
      })

      // 转换为图表需要的格式
      const hours = Object.keys(hourlyData).sort((a, b) => parseInt(a) - parseInt(b))
      const weights = hours.map(hour => hourlyData[hour])

      // 设置图表选项
      chart.setOption({
        tooltip: {
          trigger: 'axis',
          formatter: function(params) {
            return `${params[0].name}时<br/>运输量: ${params[0].value.toFixed(2)}吨`
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: hours.map(hour => hour),
          axisLabel: {
            interval: 2,
            formatter: '{value}'
          }
        },
        yAxis: {
          type: 'value',
          name: '运输量(吨)'
        },
        series: [{
          name: '运输量',
          type: 'line',
          smooth: true,
          data: weights,
          lineStyle: {
            width: 3,
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: '#5470c6' },
              { offset: 0.5, color: '#91cc75' },
              { offset: 1, color: '#fac858' }
            ])
          },
          areaStyle: {
            opacity: 0.3,
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: 'rgba(84,112,198,0.3)' },
              { offset: 1, color: 'rgba(84,112,198,0.1)' }
            ])
          },
          symbol: 'circle',
          symbolSize: 6,
          emphasis: {
            focus: 'series',
            itemStyle: {
              borderWidth: 2,
              borderColor: '#fff'
            }
          }
        }]
      })

      // 将图表实例添加到全局图表实例列表
      if (typeof chartInstances !== 'undefined' && !chartInstances.includes(chart)) {
        chartInstances.push(chart)
      }

      // 添加窗口大小改变时的自适应
      window.addEventListener('resize', () => {
        chart.resize()
      })
    }).catch(error => {
      console.error('获取运输数据失败:', error)
      chart.setOption({
        title: {
          text: '暂无数据',
          left: 'center',
          top: 'center'
        }
      })
    })
  })
}

// 更新车队准时率图表
const updateFleetPunctualityChart = () => {
  // 确保容器已经渲染
  nextTick(() => {
    const chartDom = document.getElementById('fleet-punctuality-chart')
    if (!chartDom) {
      console.error('找不到车队准时率图表容器')
      return
    }

    const chart = echarts.init(chartDom)

    // 获取数据
    axios.get('http://localhost:8080/todayfleet').then(response => {
      const data = response.data

      // 统计准时和晚点的数量
      let onTimeCount = 0
      let delayedCount = 0

      data.forEach(item => {
        if (item.today_fleet_status === '晚点') {
          delayedCount++
        } else {
          onTimeCount++
        }
      })

      // 计算总数
      const total = onTimeCount + delayedCount

      // 计算百分比
      const onTimePercentage = total > 0 ? (onTimeCount / total * 100).toFixed(1) : 0
      const delayedPercentage = total > 0 ? (delayedCount / total * 100).toFixed(1) : 0

      // 设置图表选项
      chart.setOption({
        tooltip: {
          trigger: 'item',
          formatter: function(params) {
            return `${params.name}: ${params.value}条 (${params.percent.toFixed(1)}%)`
          }
        },
        legend: {
          orient: 'vertical',
          left: 'left',
          top: 'center'
        },
        series: [
          {
            name: '准时率统计',
            type: 'pie',
            radius: ['40%', '70%'],
            avoidLabelOverlap: false,
            itemStyle: {
              borderRadius: 10,
              borderColor: '#fff',
              borderWidth: 2
            },
            label: {
              show: false,
              position: 'center'
            },
            emphasis: {
              label: {
                show: true,
                fontSize: 20,
                fontWeight: 'bold'
              }
            },
            labelLine: {
              show: false
            },
            data: [
              {
                value: onTimeCount,
                name: '准时',
                itemStyle: { color: '#91cc75' }
              },
              {
                value: delayedCount,
                name: '晚点',
                itemStyle: { color: '#ee6666' }
              }
            ]
          }
        ]
      })

      // 将图表实例添加到全局图表实例列表
      if (typeof chartInstances !== 'undefined' && !chartInstances.includes(chart)) {
        chartInstances.push(chart)
      }

      // 添加窗口大小改变时的自适应
      window.addEventListener('resize', () => {
        chart.resize()
      })
    }).catch(error => {
      console.error('获取车队准时率数据失败:', error)
      chart.setOption({
        title: {
          text: '暂无数据',
          left: 'center',
          top: 'center'
        }
      })
    })
  })
}

// 在组件挂载时获取数据
onMounted(() => {
  // 确保DOM完全渲染后再初始化图表
  nextTick(() => {
    // 初始化当前时间
    updateCurrentTime()

    // 设置定时器，每秒更新一次时间
    const timeInterval = setInterval(updateCurrentTime, 1000)

    console.log('开始初始化图表和数据...')

    // 获取数据
    fetchTodayCatchData()
    fetchTodayShipOperations()
    fetchTodayShipData()
    fetchTodayWaterQuality()
    fetchTodayDockData()
    fetchTodayDockInfo()
    fetchTodayFleetData()

    // 初始化其他图表和地图
    initCharts()
    initOpenStreetMap()

    // 延迟执行车队运输量统计图表的更新，确保容器已经渲染
    setTimeout(() => {
      updateFleetTransportChart()
      updateFleetPunctualityChart()
    }, 100)

    // 在组件卸载时清除定时器
    onBeforeUnmount(() => {
      clearInterval(timeInterval)
    })
  })
})

onBeforeUnmount(() => {
  // 清理地图
  if (map) {
    map.remove()
    map = null
  }
  // 移除Leaflet脚本
  const leafletScript = document.querySelector('script[src*="leaflet"]')
  if (leafletScript) leafletScript.remove()
})


const drawerFisheryCenter = ref(false)
const drawerWaterCenter = ref(false)
const drawerTranCenter = ref(false)
const drawerDockCenter = ref(false)
const drawerShipCenter = ref(false)
const drawerMessCenter = ref(false)

const openDrawer = (type) => {
  switch(type.toLowerCase()) {
    case 'fishery': drawerFisheryCenter.value = true; break
    case 'water': drawerWaterCenter.value = true; break
    case 'tran': drawerTranCenter.value = true; break
    case 'dock': drawerDockCenter.value = true; break
    case 'ship': drawerShipCenter.value = true; break
    case 'mess': drawerMessCenter.value = true; break
  }
}

// 在 script setup 部分添加消息中心相关的数据和方法
const currentTab = ref('notice')
const currentChat = ref(null)
const newMessage = ref('')

// 消息标签页定义
const messageTabs = [
  { id: 'notice', name: '置顶通知' },
  { id: 'hq', name: '总部消息' },
  { id: 'ship', name: '渔船消息' },
  { id: 'fleet', name: '车队消息' },
  { id: 'other', name: '其他消息' }
]

// 虚拟消息数据
const messageData = reactive({
  notice: [
    {
      id: 'n1',
      sender: '系统通知',
      avatar: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23FF9500"%3E%3Cpath d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2zm-2 1H8v-6c0-2.48 1.51-4.5 4-4.5s4 2.02 4 4.5v6z"%3E%3C/path%3E%3C/svg%3E',
      time: '09:30',
      preview: '关于加强渔业安全生产的重要通知',
      unread: 1,
      type: 'notice',
      messages: [
        {
          content: '各单位请注意：<br>1. 严格执行安全生产规程<br>2. 做好防台风准备工作<br>3. 及时报告异常情况',
          time: '09:30',
          isSelf: false
        }
      ]
    },
    {
      id: 'n2',
      sender: '渔业管理处',
      avatar: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%234CD964"%3E%3Cpath d="M20 6h-4V4c0-1.11-.89-2-2-2h-4c-1.11 0-2 .89-2 2v2H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-6 0h-4V4h4v2z"%3E%3C/path%3E%3C/svg%3E',
      time: '10:00',
      preview: '渔业资源保护区域调整公告',
      unread: 0,
      type: 'notice',
      messages: [
        {
          content: '根据最新调查结果，以下区域将划为保护区：<br>1. 北纬30°15′至31°00′<br>2. 东经122°00′至122°45′<br>请各单位严格遵守保护区规定。',
          time: '10:00',
          isSelf: false
        }
      ]
    }
  ],
  hq: [
    {
      id: 'h1',
      sender: '舟山总部',
      avatar: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%235856D6"%3E%3Cpath d="M12 7V3H2v18h20V7H12zM6 19H4v-2h2v2zm0-4H4v-2h2v2zm0-4H4V9h2v2zm0-4H4V5h2v2zm4 12H8v-2h2v2zm0-4H8v-2h2v2zm0-4H8V9h2v2zm0-4H8V5h2v2zm10 12h-8v-2h2v-2h-2v-2h2v-2h-2V9h8v10zm-2-8h-2v2h2v-2zm0 4h-2v2h2v-2z"%3E%3C/path%3E%3C/svg%3E',
      time: '10:15',
      preview: '请各渔船注意，今日14时将进行联合巡查',
      unread: 2,
      type: 'hq',
      messages: [
        {
          content: '请各渔船注意，今日14时将进行联合巡查，请做好准备。',
          time: '10:15',
          isSelf: false
        }
      ]
    }
  ],
  ship: [
    {
      id: 's1',
      sender: '浙渔01号',
      avatar: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23007AFF"%3E%3Cpath d="M20 21c-1.39 0-2.78-.47-4-1.32-2.44 1.71-5.56 1.71-8 0C6.78 20.53 5.39 21 4 21H2v2h2c1.38 0 2.74-.35 4-.99 2.52 1.29 5.48 1.29 8 0 1.26.65 2.62.99 4 .99h2v-2h-2zM3.95 19H4c1.6 0 3.02-.88 4-2 .98 1.12 2.4 2 4 2s3.02-.88 4-2c.98 1.12 2.4 2 4 2h.05l1.89-6.68c.08-.26.06-.54-.06-.78s-.34-.42-.6-.5L20 10.62V6c0-1.1-.9-2-2-2h-3V1H9v3H6c-1.1 0-2 .9-2 2v4.62l-1.29.42c-.26.08-.48.26-.6.5s-.15.52-.06.78L3.95 19zM6 6h12v3.97L12 8 6 9.97V6z"%3E%3C/path%3E%3C/svg%3E',
      time: '11:20',
      preview: '已到达指定海域，开始作业',
      unread: 0,
      type: 'ship',
      messages: [
        {
          content: '已到达指定海域，开始作业。',
          time: '11:20',
          isSelf: false
        }
      ]
    },
    {
      id: 's2',
      sender: '浙渔02号',
      avatar: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23007AFF"%3E%3Cpath d="M20 21c-1.39 0-2.78-.47-4-1.32-2.44 1.71-5.56 1.71-8 0C6.78 20.53 5.39 21 4 21H2v2h2c1.38 0 2.74-.35 4-.99 2.52 1.29 5.48 1.29 8 0 1.26.65 2.62.99 4 .99h2v-2h-2zM3.95 19H4c1.6 0 3.02-.88 4-2 .98 1.12 2.4 2 4 2s3.02-.88 4-2c.98 1.12 2.4 2 4 2h.05l1.89-6.68c.08-.26.06-.54-.06-.78s-.34-.42-.6-.5L20 10.62V6c0-1.1-.9-2-2-2h-3V1H9v3H6c-1.1 0-2 .9-2 2v4.62l-1.29.42c-.26.08-.48.26-.6.5s-.15.52-.06.78L3.95 19zM6 6h12v3.97L12 8 6 9.97V6z"%3E%3C/path%3E%3C/svg%3E',
      time: '11:45',
      preview: '报告：发现大量鱼群，请求支援',
      unread: 1,
      type: 'ship',
      messages: [
        {
          content: '报告：在东经122°30′，北纬30°45′发现大量鱼群，需要支援。',
          time: '11:45',
          isSelf: false
        }
      ]
    },
    {
      id: 's2',
      sender: '浙渔03号',
      avatar: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23007AFF"%3E%3Cpath d="M20 21c-1.39 0-2.78-.47-4-1.32-2.44 1.71-5.56 1.71-8 0C6.78 20.53 5.39 21 4 21H2v2h2c1.38 0 2.74-.35 4-.99 2.52 1.29 5.48 1.29 8 0 1.26.65 2.62.99 4 .99h2v-2h-2zM3.95 19H4c1.6 0 3.02-.88 4-2 .98 1.12 2.4 2 4 2s3.02-.88 4-2c.98 1.12 2.4 2 4 2h.05l1.89-6.68c.08-.26.06-.54-.06-.78s-.34-.42-.6-.5L20 10.62V6c0-1.1-.9-2-2-2h-3V1H9v3H6c-1.1 0-2 .9-2 2v4.62l-1.29.42c-.26.08-.48.26-.6.5s-.15.52-.06.78L3.95 19zM6 6h12v3.97L12 8 6 9.97V6z"%3E%3C/path%3E%3C/svg%3E',
      time: '11:45',
      preview: 'tmd拖鞋掉海里了，捞了一上午',
      unread: 1,
      type: 'ship',
      messages: [
        {
          content: 'tmd拖鞋掉海里了，捞了一上午',
          time: '11:47',
          isSelf: false
        }
      ]
    }
  ],
  fleet: [
    {
      id: 'f1',
      sender: '运输队A组',
      avatar: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23FF3B30"%3E%3Cpath d="M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4zM6 18.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm13.5-9l1.96 2.5H17V9.5h2.5zm-1.5 9c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"%3E%3C/path%3E%3C/svg%3E',
      time: '12:00',
      preview: '货物已装载完毕，准备出发',
      unread: 3,
      type: 'fleet',
      messages: [
        {
          content: '货物已装载完毕，准备出发。',
          time: '12:00',
          isSelf: false
        },
        {
          content: '预计30分钟后到达目的地。',
          time: '12:05',
          isSelf: false
        }
      ]
    }
  ],
  other: [
    {
      id: 'o1',
      sender: '天气预警',
      avatar: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23FF9500"%3E%3Cpath d="M19 15h-2v-2h2v2zm-2-4V9h2v2h-2zm0 8v-2h2v2h-2zm4-12h-2V5h2v2zm0 12v-2h2v2h-2zm0-6h-2v-2h2v2zM3 5h8v8H3V5zm10 0h8v8h-8V5zm-10 10h8v8H3v-8zm10 0h8v8h-8v-8z"%3E%3C/path%3E%3C/svg%3E',
      time: '13:45',
      preview: '未来24小时可能有大风天气',
      unread: 1,
      type: 'other',
      messages: [
        {
          content: '未来24小时可能有大风天气，请各单位注意防范。<br>风力：7-8级<br>风向：东北<br>持续时间：预计12小时',
          time: '13:45',
          isSelf: false
        }
      ]
    }
  ]
})

// 根据当前标签页过滤消息
const filteredMessages = computed(() => {
  return messageData[currentTab.value] || []
})

// 打开聊天室
const openChat = (chat) => {
  currentChat.value = chat
  // 清除未读消息数
  chat.unread = 0
}

// 关闭聊天室
const closeChat = () => {
  currentChat.value = null
}

// 发送消息
const sendMessage = () => {
  if (!newMessage.value.trim()) return

  const message = {
    content: newMessage.value.replace(/\n/g, '<br>'),
    time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
    isSelf: true
  }

  currentChat.value.messages.push(message)
  newMessage.value = ''

  // 滚动到底部
  nextTick(() => {
    const chatMessages = document.querySelector('.chat-messages')
    if (chatMessages) {
      chatMessages.scrollTop = chatMessages.scrollHeight
    }
  })
}
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
  overflow-y: auto; /* 添加纵向滚动 */
}

/* 上下部分布局 */
.upper-section, .lower-section {
  display: flex;
  flex: 1;
  min-height: 0;
  max-height: 50%;
  gap: 10px;
  margin-bottom: 10px;
  overflow: hidden; /* 防止内容溢出 */
}

/* 上半部分宽度比例 7:9:7 */
.upper-section .left-panel,
.upper-section .right-panel {
  flex: 7;
}

.upper-section .center-panel {
  flex: 9;
}

/* 下半部分宽度比例 8:8:8 */
.lower-section .left-panel,
.lower-section .center-panel,
.lower-section .right-panel {
  flex: 8;
}

/* 通用卡片样式1（子元素纵序排列） */
.card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 15px;
  margin-bottom: 10px;
  height: calc(50% - 5px);
  display: flex;
  flex-direction: column;
}

.card:last-child {
  margin-bottom: 0;
}

.card h3 {
  margin: 0 0 10px 0;
  font-size: 16px;
  color: #333;
}


/* 通用卡片样式2 (子元素横排) */
.card-row {
  background: white;
  border-radius: 8px;
  border: 1px solid #cfcfcf;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 15px;
  margin-bottom: 10px;
  height: calc(96% - 5px);
  display: flex;
  flex-direction: column;
}

.card-row:last-child {
  margin-bottom: 0;
}

.card-row h3 {
  margin: 0 0 10px 0;
  font-size: 16px;
  color: #333;
}




/*小分区内横向布局*/
.horizontal-container {
  display: grid;
  grid-auto-flow: column;  /* 元素横向排列 */
  gap: 10px;  /* 可选：设置元素间距 */
}


/* 表格滚动容器 */
.table-scroll-container {
  flex: 1;
  overflow-y: auto;
  border: 1px solid #eee;
  border-radius: 4px;
}

table {
  width: 100%;
  border-collapse: collapse;
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

/* 图表容器 */
.chart {
  flex: 1;
  width: 100%;
  min-height: 200px;
  display: flex;
  justify-content: center;
  align-items: center;
}

/* 地图容器样式 */
.map-container {
  padding: 10px;
  height: 100%;
}

#openstreetmap {
  width: 100%;
  height: 100%;
  border-radius: 8px;
}

/* 自定义渔船标记样式 */
:deep(.boat-marker) {
  background: transparent;
  border: none;
  font-size: 20px;
}

/**/
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
  background-color: #4d83cc;
}

.legend-icon.boat {
  background-color: #cd3d3d;
}
.legend-icon.fleet {
  background-color: #47cd3d;
}
.legend-icon.terminal {
  background-color: #3dcdc1;
}
.legend-icon.factory {
  background-color: #663dcd;
}
.legend-icon.fish {
  background-color: #cd8f3d;
}


/* 消息列表 */
.message-list {
  flex: 1;
  overflow-y: auto;
}

.message-item {
  padding: 8px 0;
  border-bottom: 1px solid #eee;
}

.message-time {
  font-size: 12px;
  color: #999;
}

.message-content {
  margin-top: 4px;
}

/* 地图标题居中样式 */
.centered-title {
  text-align: center;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 15px;
}

/* 当前时间样式 */
.current-time {
  font-size: 14px;
  color: #666;
  margin-left: 10px;
  font-weight: normal;
}

/* 日期选择器样式 */
.date-filter {
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
}

.date-filter select {
  padding: 4px 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: white;
  font-size: 12px;
}

/* 消息中心样式 */
.message-center {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: #f5f5f5;
  border-radius: 4px;
  height: calc(100% - 30px);
  max-height: calc(100% - 30px); /* 限制最大高度 */
}

.message-tabs {
  display: flex;
  flex-direction: column;
  height: 100%;
}

/* 标签页导航样式 */
.tab-nav {
  display: flex;
  background: #fff;
  border-bottom: 1px solid #eee;
  padding: 0 5px;
  overflow-x: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.tab-nav::-webkit-scrollbar {
  display: none;
}

.tab-item {
  padding: 8px 10px;
  font-size: 11px;
  cursor: pointer;
  position: relative;
  white-space: nowrap;
  flex-shrink: 0;
}

.tab-item.active {
  color: #007AFF;
}

.tab-item.active::after {
  content: '';
  position: absolute;
  bottom: -1px;
  left: 0;
  right: 0;
  height: 2px;
  background: #007AFF;
}

/* 消息列表样式 */
.message-list {
  flex: 1;
  overflow-y: auto;
  padding: 5px;
}

.message-item {
  display: flex;
  padding: 8px;
  background: #fff;
  border-radius: 6px;
  margin-bottom: 5px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.message-item:hover {
  background: #f0f0f0;
  transform: translateX(2px);
}

.message-avatar {
  position: relative;
  width: 32px;
  height: 32px;
  margin-right: 8px;
  flex-shrink: 0;
}

.message-avatar img {
  width: 100%;
  height: 100%;
  border-radius: 4px;
  object-fit: cover;
}

.unread-badge {
  position: absolute;
  top: -5px;
  right: -5px;
  background: #ff3b30;
  color: white;
  font-size: 10px;
  padding: 2px 6px;
  border-radius: 10px;
  min-width: 8px;
  text-align: center;
}

.message-info {
  flex: 1;
  overflow: hidden;
}

.message-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
}

.sender-name {
  font-size: 12px;
}

.message-time {
  font-size: 11px;
  color: #999;
}

.message-preview {
  font-size: 11px;
}

/* 聊天室样式 */
.chat-room {
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.chat-header {
  padding: 8px 12px;  /* 减小上下内边距 */
  background: #fff;
  border-bottom: 1px solid #eee;
  display: flex;
  align-items: center;
  gap: 8px;  /* 减小间距 */
}

.chat-title {
  font-size: 13px;  /* 减小标题字体 */
  font-weight: 500;
  color: #333;
}

.message-avatar {
  position: relative;
  width: 28px;  /* 减小头像尺寸 */
  height: 28px;  /* 减小头像尺寸 */
  margin-right: 6px;
  flex-shrink: 0;
}

.chat-message {
  display: flex;
  margin-bottom: 10px;
  padding: 0 8px;  /* 添加左右内边距 */
}

.message-self {
  justify-content: flex-end;  /* 我方消息靠右对齐 */
}

.message-bubble {
  max-width: 85%;
  padding: 8px 12px;
  border-radius: 12px;
  position: relative;
  margin: 0;  /* 移除水平边距 */
  font-size: 12px;
  background: #fff;  /* 对方消息背景色 */
  border: 1px solid #eee;
}

.message-self .message-bubble {
  background: #007AFF;  /* 我方消息背景色 */
  color: white;
}

.message-self .message-bubble .message-time {
  color: rgba(255, 255, 255, 0.8);  /* 我方消息时间戳颜色 */
}

.chat-messages {
  flex: 1;
  padding: 12px 4px;  /* 减小左右内边距 */
  overflow-y: auto;
  background: #f5f5f5;
}

/* 优化返回按钮 */
.back-button {
  width: 28px;  /* 减小返回按钮尺寸 */
  height: 28px;
  background: #f5f5f5;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.back-button:hover {
  background: #e8e8e8;
  transform: scale(1.05);
}

.back-button span {
  font-size: 16px;  /* 减小返回箭头大小 */
  color: #666;
  line-height: 1;
}

/* 优化消息输入框 */
.chat-input {
  padding: 8px;  /* 减小内边距 */
  background: #fff;
  border-top: 1px solid #eee;
  display: flex;
  align-items: center;
  gap: 8px;
}

.chat-input textarea {
  flex: 1;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  padding: 6px 8px;
  height: 28px;  /* 减小输入框高度 */
  resize: none;
  font-size: 12px;
  line-height: 1.4;
}

.chat-input button {
  padding: 6px 12px;  /* 减小按钮内边距 */
  background: #007AFF;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  transition: all 0.2s ease;
}

.chat-input button:hover {
  background: #0056b3;
  transform: translateY(-1px);
}

/* 滚动条样式 */
.message-list::-webkit-scrollbar,
.chat-messages::-webkit-scrollbar {
  width: 4px;
}

.message-list::-webkit-scrollbar-thumb,
.chat-messages::-webkit-scrollbar-thumb {
  background: #ccc;
  border-radius: 2px;
}

.message-list::-webkit-scrollbar-track,
.chat-messages::-webkit-scrollbar-track {
  background: transparent;
}
</style>

