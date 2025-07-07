<!--艺术字，统计和彩色标签-->

<template>
  <div class="catch-trans-container">
    <!-- 上半部分 -->
    <div class="upper-section">
      <!-- 今日渔场卡片 (7) -->
      <div class="card fishery-card">
        <div class="card-header">
          <div class="header-left">
            <h3>今日渔场</h3>
            <el-select
                v-model="currentFishery"
                placeholder="选择渔场"
                size="small"
                class="fishery-select"
            >
              <el-option
                  v-for="fishery in fisheries"
                  :key="fishery.id"
                  :label="fishery.name"
                  :value="fishery.id"
              />
            </el-select>
          </div>
          <span class="update-time">更新于: {{ currentTime }}</span>
        </div>
        <div class="card-content">
          <!-- 左侧数据面板 -->
          <div class="left-panel">
            <div class="panel-section">
              <div class="section-title">实时水质</div>
              <div class="data-display">
                <div class="main-data">
                  <div class="big-number">{{ waterQuality.score }}</div>
                  <div class="data-label">水质综合分数</div>
                </div>
                <div class="sub-data">
                  <div class="data-row">
                    <span class="data-value">{{ waterQuality.status }}</span><br>
                    <span class="data-label">水质表现</span>
                  </div>
                  <div class="data-row">
                    <span class="data-value">{{ waterQuality.variation }}</span><br>
                    <span class="data-label">波动指数</span>
                  </div>
                </div>
              </div>
              <div class="brief-report">
                <div class="brief-title">水质简报</div>
                <div class="brief-content">今日水质表现良好，溶解氧含量保持稳定，pH值在正常范围内，水温适宜，适合鱼类生长</div>
              </div>
            </div>
            <div class="panel-section">
              <div class="section-title">海洋气象</div>
              <div class="weather-data">
                <div class="weather-item">
                  <span class="weather-value">{{ oceanWeather.waveHeight }}</span><br>
                  <span class="weather-label">平均浪高</span>
                </div>
                <div class="weather-item">
                  <span class="weather-value">{{ oceanWeather.windSpeed }}</span><br>
                  <span class="weather-label">地面风速</span>
                </div>
                <div class="weather-item">
                  <span class="weather-value">{{ oceanWeather.windDirection }}</span><br>
                  <span class="weather-label">地面风向</span>
                </div>
              </div>
              <div class="brief-report">
                <div class="brief-title">气象简报</div>
                <div class="brief-content">今天天气晴，浪高1.2米，西北风3级，湿度偏大，行船作业过程应注意防暑</div>
              </div>
            </div>
          </div>
          <!-- 右侧警告面板 -->
          <div class="right-panel">
            <div class="panel-section">
              <div class="section-title">水质异常告警</div>
              <div class="alert-list">
                <div
                    v-for="alert in waterQualityAlerts"
                    :key="alert.id"
                    :class="['alert-item', alert.level]"
                >
                  <i class="el-icon-warning-outline"></i>
                  <span>{{ alert.content }}</span>
                </div>
              </div>
            </div>
            <div class="panel-section">
              <div class="section-title">海洋气象告警</div>
              <div class="alert-list">
                <div
                    v-for="alert in weatherAlerts"
                    :key="alert.id"
                    :class="['alert-item', alert.level]"
                >
                  <i class="el-icon-warning-outline"></i>
                  <span>{{ alert.content }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 实时地图卡片 (10) -->
      <div class="card map-card">
        <div class="card-header">
          <div class="header-left">
            <h3>实时地图</h3>
          </div>
          <span class="update-time">{{ currentTime }}</span>
        </div>
        <div class="card-content">
          <div id="openstreetmap" ref="mapContainer"></div>
        </div>
        <div class="map-legend">
          <div><span class="legend-icon fishery"></span> 渔场</div>
          <div><span class="legend-icon boat"></span> 渔船</div>
          <div><span class="legend-icon fleet"></span> 车队</div>
          <div><span class="legend-icon terminal"></span> 码头</div>
          <div><span class="legend-icon factory"></span> 工厂</div>
          <div><span class="legend-icon fish"></span> 鱼群</div>
        </div>
      </div>

      <!-- 鱼群追踪卡片 (7) -->
      <div class="card fish-tracking-card">
        <div class="card-header">
          <div class="header-left">
            <h3>鱼群追踪</h3>
          </div>
          <span class="update-time">更新于: {{ currentTime }}</span>
        </div>
        <div class="card-content">
          <div class="tracking-content">
            <div class="brief-report">
              <div class="brief-title">追踪简报</div>
              <div class="brief-content">今日共发现8处鱼群聚集区域，其中大黄鱼3处，带鱼2处，青鱼3处，建议渔船优先前往东经122.5°北纬30.2°海域作业</div>
            </div>
            <div class="tracking-table-container">
              <div class="section-title">实时位置</div>
              <div class="table-wrapper">
                <table class="tracking-table">
                  <thead>
                  <tr>
                    <th>鱼群坐标</th>
                    <th>类别</th>
                  </tr>
                  </thead>
                  <tbody>
                  <tr v-for="location in fishLocations" :key="location.id">
                    <td>{{ location.coordinates }}</td>
                    <td>{{ location.type }}</td>
                  </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 下半部分 -->
    <div class="lower-section">
      <!-- 今日渔船卡片 -->
      <div class="card boat-card">
        <div class="card-header">
          <div class="header-left">
            <h3>今日渔船</h3>
          </div>
          <span class="update-time">更新于: {{ currentTime }}</span>
        </div>
        <div class="card-content">
          <!-- 左侧数据面板 -->
          <div class="left-panel">
            <div class="panel-section">
              <div class="section-title">航船动态</div>
              <div class="data-display">
                <div class="sub-data">
                  <div class="data-row">
                    <span class="data-value">{{ boatStats.totalBoats }}</span><br>
                    <span class="data-label">在航渔船</span>
                  </div>
                  <div class="data-row">
                    <span class="data-value">{{ boatStats.workingBoats }}</span><br>
                    <span class="data-label">作业渔船</span>
                  </div>
                </div>
                <div class="sub-data">
                  <div class="data-row">
                    <span class="data-value">{{ boatStats.efficiency }}%</span><br>
                    <span class="data-label">作业效率</span>
                  </div>
                  <div class="data-row">
                    <span class="data-value">{{ boatStats.workingBoats }}</span><br>
                    <span class="data-label">路径规划率</span>
                  </div>
                </div>
              </div>
              <div class="brief-report">
                <div class="brief-title">航船简报</div>
                <div class="brief-content">当前在航渔船86艘，其中65艘正在作业，整体作业效率92%，路径规划执行情况良好</div>
              </div>
            </div>
            <div class="panel-section">
              <div class="section-title">捕捞分析</div>
              <div class="data-display">
                <div class="sub-data">
                  <div class="data-row">
                    <span class="data-value">{{ boatStats.fuelLevel }}%</span><br>
                    <span class="data-label">平均油量</span>
                  </div>
                  <div class="data-row">
                    <span class="data-value">{{ boatStats.engineStatus }}%</span><br>
                    <span class="data-label">引擎状态</span>
                  </div>
                </div>
              </div>
              <div class="brief-report">
                <div class="brief-title">捕捞简报</div>
                <div class="brief-content">今日捕捞量达到预期目标，平均油耗控制良好，设备运行正常，建议保持当前作业状态</div>
              </div>
            </div>
          </div>
          <!-- 右侧警告面板 -->
          <div class="right-panel">
            <div class="panel-section">
              <div class="section-title">渔船预警</div>
              <div class="alert-list">
                <div v-for="alert in boatAlerts" :key="alert.id" :class="['alert-item', alert.level]">
                  <i class="el-icon-warning-outline"></i>
                  <span>{{ alert.content }}</span>
                </div>
              </div>
            </div>
            <div class="panel-section">
              <div class="section-title">渔船预警</div>
              <div class="alert-list">
                <div v-for="alert in boatAlerts" :key="alert.id" :class="['alert-item', alert.level]">
                  <i class="el-icon-warning-outline"></i>
                  <span>{{ alert.content }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 今日码头卡片 -->
      <div class="card dock-card">
        <div class="card-header">
          <div class="header-left">
            <h3>今日码头</h3>
          </div>
          <span class="update-time">更新于: {{ currentTime }}</span>
        </div>
        <div class="card-content">
          <!-- 左侧数据面板 -->
          <div class="left-panel">
            <div class="panel-section">
              <div class="section-title">泊船分析</div>
              <div class="data-display">
                <div class="main-data">
                  <div class="big-number">{{ dockStats.totalDocks }}</div>
                  <div class="data-label">泊位船只数量</div>
                </div>
                <div class="sub-data">
                  <div class="data-row">
                    <span class="data-value">{{ dockStats.dockedBoats }}</span><br>
                    <span class="data-label">停靠渔船</span>
                  </div>
                  <div class="data-row">
                    <span class="data-value">{{ dockStats.cargoVolume }}</span><br>
                    <span class="data-label">卸货量(吨)</span>
                  </div>
                </div>
              </div>
              <div class="brief-report">
                <div class="brief-title">泊船简报</div>
                <div class="brief-content">目前泊位使用率76%，共停靠渔船45艘，装卸作业有序进行，码头运营状况良好</div>
              </div>
            </div>
            <div class="panel-section">
              <div class="section-title">卸货分析</div>
              <div class="data-display">
                <div class="sub-data">
                  <div class="data-row">
                    <span class="data-value">{{ dockStats.loadingRate }}%</span><br>
                    <span class="data-label">装卸效率</span>
                  </div>
                  <div class="data-row">
                    <span class="data-value">{{ dockStats.utilization }}%</span><br>
                    <span class="data-label">泊位利用率</span>
                  </div>
                </div>
              </div>
              <div class="brief-report">
                <div class="brief-title">卸货简报</div>
                <div class="brief-content">今日卸货量2860吨，装卸效率88%，各码头作业有序，建议加强1号码头人员配置</div>
              </div>
            </div>
          </div>
          <!-- 右侧警告面板 -->
          <div class="right-panel">
            <div class="panel-section">
              <div class="section-title">码头预警</div>
              <div class="alert-list">
                <div v-for="alert in dockAlerts" :key="alert.id" :class="['alert-item', alert.level]">
                  <i class="el-icon-warning-outline"></i>
                  <span>{{ alert.content }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 今日车队卡片 -->
      <div class="card fleet-card">
        <div class="card-header">
          <div class="header-left">
            <h3>今日车队</h3>
          </div>
          <span class="update-time">更新于: {{ currentTime }}</span>
        </div>
        <div class="card-content">
          <!-- 左侧数据面板 -->
          <div class="left-panel">
            <div class="panel-section">
              <div class="section-title">车运动态</div>
              <div class="data-display">
                <div class="main-data">
                  <div class="big-number">{{ fleetStats.totalTrucks }}</div>
                  <div class="data-label">运输车队总数</div>
                </div>
                <div class="sub-data">
                  <div class="data-row">
                    <span class="data-value">{{ fleetStats.onRoad }}</span><br>
                    <span class="data-label">在途车队</span>
                  </div>
                  <div class="data-row">
                    <span class="data-value">{{ fleetStats.deliveryRate }}%</span><br>
                    <span class="data-label">准时率</span>
                  </div>
                </div>
              </div>
              <div class="brief-report">
                <div class="brief-title">车运简报</div>
                <div class="brief-content">当前运输车队38辆，在途26辆，准时率95%，整体运输效率良好，路况通畅</div>
              </div>
            </div>
            <div class="panel-section">
              <div class="section-title">货物分析</div>
              <div class="data-display">
                <div class="sub-data">
                  <div class="data-row">
                    <span class="data-value">{{ fleetStats.fuelEfficiency }}</span><br>
                    <span class="data-label">油耗(L/100km)</span>
                  </div>
                  <div class="data-row">
                    <span class="data-value">{{ fleetStats.avgSpeed }}</span><br>
                    <span class="data-label">平均车速(km/h)</span>
                  </div>
                </div>
              </div>
              <div class="brief-report">
                <div class="brief-title">货运简报</div>
                <div class="brief-content">平均油耗32.5L/100km，车速保持在68km/h，货物运输安全可控，配送计划执行顺利</div>
              </div>
            </div>
          </div>
          <!-- 右侧警告面板 -->
          <div class="right-panel">
            <div class="panel-section">
              <div class="section-title">车队预警</div>
              <div class="alert-list">
                <div v-for="alert in fleetAlerts" :key="alert.id" :class="['alert-item', alert.level]">
                  <i class="el-icon-warning-outline"></i>
                  <span>{{ alert.content }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { ZoomIn, ZoomOut, Refresh } from '@element-plus/icons-vue'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

// 响应式数据
const currentTime = ref(new Date().toLocaleTimeString())
const currentFishery = ref('fishery1')

// 渔场列表
const fisheries = ref([
  { id: 'fishery1', name: '普陀渔场' },
  { id: 'fishery2', name: '沈家湾渔场' },
  { id: 'fishery3', name: '南洞渔场' },
  { id: 'fishery4', name: '朱家尖渔场' },
  { id: 'fishery5', name: '岱山渔场' },
  { id: 'fishery6', name: '高亭渔场' },
  { id: 'fishery7', name: '定海渔场' }
])

// 水质数据
const waterQuality = ref({
  score: 86,
  status: '良好',
  variation: 0.22
})

// 海洋气象数据
const oceanWeather = ref({
  waveHeight: '1.2米',
  windSpeed: '3级',
  windDirection: '西北'
})

// 警告数据
const waterQualityAlerts = ref([
  {
    id: 1,
    content: '高温度警告: 可能增室鱼类，降低光合作用，请增加水体循环',
    level: 'warning'
  },
  {
    id: 2,
    content: '溶解氧偏低: 当前值5.2mg/L，低于安全值，建议开启增氧设备',
    level: 'error'
  },
  {
    id: 3,
    content: 'pH值波动: 24小时内波动超过0.5，建议检查水质调节系统',
    level: 'warning'
  }
])

const weatherAlerts = ref([
  {
    id: 1,
    content: '风力预警: 预计未来12小时内风力可能增至7级，请做好防范',
    level: 'error'
  },
  {
    id: 2,
    content: '浪高注意: 当前浪高1.2米，预计继续上升，建议关注',
    level: 'warning'
  }
])

// 切换渔场
const switchFishery = (fisheryId) => {
  currentFishery.value = fisheryId
  // 这里可以添加获取对应渔场数据的逻辑
}

// 更新时间
onMounted(() => {
  setInterval(() => {
    currentTime.value = new Date().toLocaleTimeString()
  }, 1000)
})

// 渔船统计数据
const boatStats = ref({
  totalBoats: 86,
  workingBoats: 65,
  efficiency: 92,
  fuelLevel: 78,
  engineStatus: 95
})

// 渔船警告信息
const boatAlerts = ref([
  {
    id: 1,
    content: '渔船A1253油量不足20%，建议及时补充燃料',
    level: 'warning'
  },
  {
    id: 2,
    content: '渔船B789引擎温度异常，需要立即检查',
    level: 'error'
  },
  {
    id: 3,
    content: '渔船C456已超出指定作业区域范围',
    level: 'warning'
  }
])

// 码头统计数据
const dockStats = ref({
  totalDocks: 12,
  dockedBoats: 45,
  cargoVolume: 2860,
  loadingRate: 88,
  utilization: 76
})

// 码头警告信息
const dockAlerts = ref([
  {
    id: 1,
    content: '3号码头装卸设备需要维护保养',
    level: 'warning'
  },
  {
    id: 2,
    content: '1号码头泊位拥堵，建议调整停靠计划',
    level: 'error'
  },
  {
    id: 3,
    content: '2号码头卸货区即将达到存储上限',
    level: 'warning'
  },
  {
    id: 4,
    content: '4号码头照明系统故障，影响夜间作业',
    level: 'error'
  },
  {
    id: 5,
    content: '5号码头防波堤需要加固维护',
    level: 'warning'
  },
  {
    id: 6,
    content: '码头区域监控系统部分摄像头离线',
    level: 'warning'
  },
  {
    id: 7,
    content: '6号码头消防设备需要更新',
    level: 'error'
  }
])

// 车队统计数据
const fleetStats = ref({
  totalTrucks: 38,
  onRoad: 26,
  deliveryRate: 95,
  fuelEfficiency: 32.5,
  avgSpeed: 68
})

// 车队警告信息
const fleetAlerts = ref([
  {
    id: 1,
    content: '车辆T789维护到期，请安排年检',
    level: 'warning'
  },
  {
    id: 2,
    content: '车辆K456轮胎磨损严重，需要更换',
    level: 'error'
  },
  {
    id: 3,
    content: '车辆M123行驶时间过长，建议更换司机',
    level: 'warning'
  },
  {
    id: 4,
    content: '车辆P567 GPS信号异常，需要检查',
    level: 'error'
  },
  {
    id: 5,
    content: '车辆Q890超速行驶，请及时处理',
    level: 'error'
  },
  {
    id: 6,
    content: '车辆R234油耗异常，建议检查发动机',
    level: 'warning'
  },
  {
    id: 7,
    content: '车辆S678偏离预定路线，请确认',
    level: 'warning'
  },
  {
    id: 8,
    content: '车辆U901制动系统需要检修',
    level: 'error'
  }
])

// 鱼群位置数据
const fishLocations = ref([
  {
    id: 1,
    coordinates: '东经122.5° 北纬30.2°',
    type: '大黄鱼'
  },
  {
    id: 2,
    coordinates: '东经122.8° 北纬30.5°',
    type: '带鱼'
  },
  {
    id: 3,
    coordinates: '东经123.1° 北纬30.1°',
    type: '青鱼'
  },
  {
    id: 4,
    coordinates: '东经122.3° 北纬30.4°',
    type: '大黄鱼'
  },
  {
    id: 5,
    coordinates: '东经122.9° 北纬30.3°',
    type: '青鱼'
  },
  {
    id: 6,
    coordinates: '东经123.2° 北纬30.6°',
    type: '带鱼'
  },
  {
    id: 7,
    coordinates: '东经122.6° 北纬30.7°',
    type: '大黄鱼'
  },
  {
    id: 8,
    coordinates: '东经122.7° 北纬30.8°',
    type: '青鱼'
  }
])

// 地图相关
const mapContainer = ref(null)
let map = null

// 地图数据
const mapData = {
  center: [30.0, 122.0], // 地图中心点
  zoom: 9, // 初始缩放级别
  markers: {
    fisheries: [
      { id: 1, name: '普陀渔场', position: [30.2, 122.5] },
      { id: 2, name: '沈家湾渔场', position: [30.4, 122.3] },
      { id: 3, name: '南洞渔场', position: [30.1, 122.7] }
    ],
    boats: [
      { id: 1, name: '渔船A1253', position: [30.25, 122.45] },
      { id: 2, name: '渔船B789', position: [30.35, 122.25] },
      { id: 3, name: '渔船C456', position: [30.15, 122.65] }
    ],
    docks: [
      { id: 1, name: '1号码头', position: [30.3, 122.2] },
      { id: 2, name: '2号码头', position: [30.32, 122.22] },
      { id: 3, name: '3号码头', position: [30.34, 122.24] }
    ],
    fleets: [
      { id: 1, name: '车队T789', position: [30.28, 122.18] },
      { id: 2, name: '车队K456', position: [30.31, 122.21] }
    ],
    factories: [
      { id: 1, name: '加工厂A', position: [30.29, 122.19] },
      { id: 2, name: '加工厂B', position: [30.33, 122.23] }
    ],
    fishSchools: fishLocations.value.map(location => ({
      id: location.id,
      name: `${location.type}鱼群`,
      position: convertCoordinates(location.coordinates)
    }))
  }
}

// 转换坐标字符串为数组
function convertCoordinates(coordStr) {
  const match = coordStr.match(/东经(\d+\.\d+)° 北纬(\d+\.\d+)°/)
  return match ? [parseFloat(match[2]), parseFloat(match[1])] : null
}

// 初始化地图
function initMap() {
  if (!mapContainer.value) return

  // 创建地图实例
  map = L.map(mapContainer.value).setView(mapData.center, mapData.zoom)

  // 添加OpenStreetMap图层
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
  }).addTo(map)

  // 添加各类标记
  addMarkers('fisheries', 'fishery', '渔场')
  addMarkers('boats', 'boat', '渔船')
  addMarkers('docks', 'dock', '码头')
  addMarkers('fleets', 'fleet', '车队')
  addMarkers('factories', 'factory', '工厂')
  addMarkers('fishSchools', 'fish', '鱼群')
}

// 添加标记
function addMarkers(type, iconClass, label) {
  mapData.markers[type].forEach(item => {
    const marker = L.marker(item.position, {
      icon: L.divIcon({
        className: `map-marker ${iconClass}`,
        html: `<div class="marker-icon"></div>`,
        iconSize: [24, 24]
      })
    })

    marker.bindPopup(`${label}: ${item.name}`)
    marker.addTo(map)
  })
}

// 生命周期钩子
onMounted(() => {
  initMap()
})

onUnmounted(() => {
  if (map) {
    map.remove()
    map = null
  }
})
</script>

<style scoped>
.catch-trans-container {
  font-family: 'Arial', sans-serif;
  width: 100%;
  height: 100vh;
  margin: 0;
  padding: 10px;
  color: #333;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
}

/* 通用卡片样式 */
.card {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  height: 100%; /* 修改为100%以适应容器 */
}

.card-header {
  padding: 15px 20px;
  background-color: #f8f9fa;
  border-bottom: 1px solid #e9ecef;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 10px;
}

.header-left h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #2c3e50;
}

.fishery-select {
  width: 140px;
}

:deep(.el-select .el-input__wrapper) {
  background-color: #fff;
}

.card-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #2c3e50;
}

.card-content {
  display: flex;
  height: calc(100% - 60px);
  padding: 0;
  overflow: hidden;
}

/* 布局样式 */
.upper-section {
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
  height: calc(50% - 10px); /* 上半部分占据50%减去间距的一半 */
}

.lower-section {
  display: flex;
  gap: 10px;
  height: calc(50% - 10px); /* 下半部分占据50%减去间距的一半 */
}

/* 卡片比例 */
.upper-section > .fishery-card { flex: 7; }
.upper-section > .map-card { flex: 10; }
.upper-section > .fish-tracking-card { flex: 7; }

.lower-section > .boat-card,
.lower-section > .dock-card,
.lower-section > .fleet-card {
  flex: 8;
}

/* 渔场卡片样式 */
.fishery-card {
  display: flex;
  flex-direction: column;
  height: 100%;
}


.left-panel {
  flex: 6;
  padding: 20px;
  border-right: 1px solid #EBEEF5;
  overflow-y: auto;
}

.right-panel {
  flex: 4;
  padding: 20px;
  background-color: #FAFAFA;
  overflow-y: auto;
}

.panel-section {
  margin-bottom: 30px;
}

.section-title {
  font-size: 18px;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 25px;
  position: relative;
  padding-left: 12px;
}

.section-title::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 4px;
  height: 16px;
  background: #409EFF;
  border-radius: 2px;
}

/* 左侧数据显示样式 */
.data-display {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.main-data {
  text-align: center;
  padding: 25px;
  background: linear-gradient(145deg, #f8f9fa 0%, #e9ecef 100%);
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.main-data:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
}

.big-number {
  font-size: 56px;
  font-weight: bold;
  background: linear-gradient(45deg, #409EFF, #36cfc9);
  -webkit-background-clip: text;
  color: transparent;
  line-height: 1;
  margin-bottom: 0px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.data-row {
  padding: 20px;
  background: linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%);
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.data-row:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.data-value {
  font-size: 28px;
  font-weight: bold;
  color: #5fcd46;
  margin-bottom: 8px;
}

.data-label {
  font-size: 14px;
  color: #606266;
  font-weight: 500;
}

.sub-data {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;
}

.weather-data {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 5px;
}

.weather-item {
  padding: 10px;
  background: linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%);
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.weather-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.weather-value {
  font-size: 20px;
  font-weight: bold;
  color: #3986d3;
  margin-bottom: 8px;
}

.weather-label {
  font-size: 13px;
  color: #606266;
  font-weight: 500;
}

/* 右侧警告面板样式 */
.alert-list {
  display: flex;
  flex-direction: column;
  gap: 0px;
}

.alert-item {
  padding: 10px;
  background: #fff;
  border-radius: 8px;
  border-left: 4px solid;
  margin-bottom: 12px;
  transition: all 0.3s ease;
}

.alert-item.warning {
  border-left-color: #E6A23C;
  background: rgba(230, 162, 60, 0.1);
}

.alert-item.error {
  border-left-color: #F56C6C;
  background: rgba(245, 108, 108, 0.1);
}

.alert-item i {
  font-size: 18px;
  margin-right: 10px;
}

.alert-item.warning i {
  color: #E6A23C;
}

.alert-item.error i {
  color: #F56C6C;
}

.alert-item span {
  font-size: 11px;
  line-height: 1.6;
}

.alert-item.warning span {
  color: #B88230;
}

.alert-item.error span {
  color: #CF5F5F;
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

/* 鱼群追踪内容布局 */
.tracking-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
  height: 100%;
  padding: 20px;
}

.tracking-table-container {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.table-wrapper {
  height: calc(5 * 44px + 44px); /* 5行数据(每行44px) + 表头高度 */
  overflow-y: auto;
  border: 1px solid #e9ecef;
  border-radius: 8px;
}

.tracking-table {
  width: 100%;
  border-collapse: collapse;
}

.tracking-table th {
  height: 44px;
  background-color: #f8f9fa;
  padding: 12px 16px;
  text-align: left;
  font-weight: 600;
  color: #2c3e50;
  position: sticky;
  top: 0;
  z-index: 1;
  border-bottom: 1px solid #e9ecef;
}

.tracking-table td {
  height: 44px;
  padding: 12px 16px;
  border-bottom: 1px solid #e9ecef;
  color: #606266;
}

.tracking-table tr:last-child td {
  border-bottom: none;
}

.tracking-table tr:hover {
  background-color: #f5f7fa;
}

/* 表格滚动条样式 */
.table-wrapper::-webkit-scrollbar {
  width: 6px;
}

.table-wrapper::-webkit-scrollbar-thumb {
  background: #E4E7ED;
  border-radius: 3px;
}

.table-wrapper::-webkit-scrollbar-track {
  background: #F5F7FA;
}

/* 渔船卡片样式 */
.boat-list {
  height: 100%;
  overflow-y: auto;
}

.boat-item {
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.boat-name {
  flex: 2;
  font-weight: 500;
}

.boat-status {
  flex: 1;
  text-align: center;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
}

.boat-status.作业中 {
  background-color: #f6ffed;
  color: #52c41a;
  border: 1px solid #b7eb8f;
}

.boat-status.返航 {
  background-color: #e6f7ff;
  color: #1890ff;
  border: 1px solid #91d5ff;
}

.boat-status.待命 {
  background-color: #fffbe6;
  color: #faad14;
  border: 1px solid #ffe58f;
}

.boat-status.维修 {
  background-color: #fff2f0;
  color: #ff4d4f;
  border: 1px solid #ffccc7;
}

.boat-location {
  flex: 2;
  text-align: right;
  color: #666;
  font-size: 12px;
}

/* 码头卡片样式 */
.dock-stats {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

.dock-chart {
  flex: 1;
  background-color: #f5f7fa;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 车队卡片样式 */
.fleet-list {
  height: 100%;
  overflow-y: auto;
}

.truck-item {
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.truck-id {
  flex: 1;
  font-weight: 500;
}

.truck-route {
  flex: 2;
  color: #666;
  font-size: 14px;
}

.truck-status {
  flex: 1;
  text-align: center;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
}

.truck-status.运输中 {
  background-color: #e6f7ff;
  color: #1890ff;
  border: 1px solid #91d5ff;
}

.truck-status.待命 {
  background-color: #fffbe6;
  color: #faad14;
  border: 1px solid #ffe58f;
}

.truck-status.已完成 {
  background-color: #f6ffed;
  color: #52c41a;
  border: 1px solid #b7eb8f;
}

/* 其他通用样式 */
.badge {
  background-color: #1890ff;
  color: white;
  padding: 4px 8px;
  border-radius: 10px;
  font-size: 12px;
}

.update-time {
  color: #888;
  font-size: 12px;
}

.chart-placeholder {
  color: #888;
  font-size: 14px;
}

/* 滚动条样式 */
.left-panel::-webkit-scrollbar,
.right-panel::-webkit-scrollbar {
  width: 6px;
}

.left-panel::-webkit-scrollbar-thumb,
.right-panel::-webkit-scrollbar-thumb {
  background: #E4E7ED;
  border-radius: 3px;
}

.left-panel::-webkit-scrollbar-track,
.right-panel::-webkit-scrollbar-track {
  background: #F5F7FA;
}

/* 下半部分卡片样式继承上半部分的样式 */
.lower-section {
  display: flex;
  gap: 10px;
}

.lower-section .card {
  flex: 1;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
}


/* 确保下半部分卡片的数据显示与上半部分一致 */
.lower-section .data-display {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.lower-section .main-data {
  text-align: center;
  padding: 25px;
  background: linear-gradient(145deg, #f8f9fa 0%, #e9ecef 100%);
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.lower-section .big-number {
  font-size: 56px;
  font-weight: bold;
  background: linear-gradient(45deg, #409EFF, #36cfc9);
  -webkit-background-clip: text;
  color: transparent;
  line-height: 1;
  margin-bottom: 0px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.lower-section .data-row {
  padding: 20px;
  background: linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%);
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  text-align: center;
}

.lower-section .data-value {
  font-size: 28px;
  font-weight: bold;
  color: #513f87;
  margin-bottom: 8px;
}

.lower-section .data-label {
  font-size: 14px;
  color: #606266;
  font-weight: 500;
}

/* 继承悬停效果 */
.lower-section .main-data:hover,
.lower-section .data-row:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
}

/* 简报样式 */
.brief-report {
  margin-top: 20px;
  padding: 15px;
  border-radius: 8px;
  background: #f8f9fa;
  border: 1px solid #e9ecef;
}

.brief-title {
  font-size: 16px;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 10px;
  padding-left: 10px;
  border-left: 4px solid #b8a38a;
}

.brief-content {
  font-size: 14px;
  color: #606266;
  line-height: 1.6;
  padding: 0 5px;
}
</style>