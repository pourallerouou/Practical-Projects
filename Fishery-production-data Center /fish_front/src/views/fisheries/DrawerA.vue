<template>
  <el-drawer
      v-model="visible"
      title="渔场信息及捕捞统计中心"
      direction="ltr"
      size="80%"
      :with-header="true"
      destroy-on-close
  >
    <div class="drawer-content" ref="content">
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
          <el-tab-pane label="渔场信息" name="info">
            <el-table :data="fisheryData" border style="width: 100%">
              <el-table-column prop="name" label="渔场名称" width="180"></el-table-column>
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
            <el-table :data="fishingStats" border style="width: 100%">
              <el-table-column prop="fishery" label="渔场名称"></el-table-column>
              <el-table-column prop="total" label="总捕鱼量(吨)"></el-table-column>
              <el-table-column prop="avg" label="平均捕鱼量(吨)"></el-table-column>
              <el-table-column prop="max" label="最大捕鱼量(吨)"></el-table-column>
              <el-table-column prop="min" label="最小捕鱼量(吨)"></el-table-column>
            </el-table>
          </el-tab-pane>

          <el-tab-pane label="统计图表" name="charts">
            <div class="chart-container">
              <div class="chart-item">
                <div ref="catchChart" style="width: 140vh; height:40vh;"></div>
              </div>
              <div class="chart-item">
                <div ref="trendChart" style="width: 140vh; height: 40vh;"></div>
              </div>
            </div>
          </el-tab-pane>
        </el-tabs>

        <!-- 可拖动调整宽度的把手 -->
        <div class="drawer-resize" @mousedown="startResize"></div>

      </div>
    </div>
  </el-drawer>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch, nextTick } from 'vue'
import * as echarts from 'echarts'

const props = defineProps({
  modelValue: Boolean
})

const emit = defineEmits(['update:modelValue'])

const visible = computed({
  get() {
    return props.modelValue
  },
  set(value) {
    emit('update:modelValue', value)
  }
})


const content = ref(null)


//添加在这里
const showDrawer_fishery = ref(false)
const drawerWidth = ref(window.innerWidth * 0.8)
const isResizing = ref(false)
const startX = ref(0)
const startWidth = ref(0)

// 渔场数据
const activeTab = ref('info')
const timeRange = ref('month')
const fisheryData = ref([
  { name: '东海渔场', location: '东经122°, 北纬30°', area: '1200', fishTypes: '带鱼, 黄鱼, 鲳鱼', status: '正常' },
  { name: '南海渔场', location: '东经115°, 北纬18°', area: '2500', fishTypes: '金枪鱼, 马鲛鱼', status: '正常' },
  { name: '渤海渔场', location: '东经120°, 北纬39°', area: '800', fishTypes: '对虾, 梭子蟹', status: '维护中' },
  { name: '黄海渔场', location: '东经124°, 北纬35°', area: '1500', fishTypes: '鲅鱼, 鲐鱼', status: '正常' }
])
const fishingStats = ref([
  { fishery: '东海渔场', total: '1250', avg: '104.2', max: '180', min: '75' },
  { fishery: '南海渔场', total: '980', avg: '81.7', max: '150', min: '60' },
  { fishery: '渤海渔场', total: '720', avg: '60', max: '90', min: '45' },
  { fishery: '黄海渔场', total: '1100', avg: '91.7', max: '160', min: '70' }
])

// 图表引用
const catchChart = ref(null)
const trendChart = ref(null)
const catchChartRef = ref(null)
const trendChartRef = ref(null)

// 抽屉调整大小方法
const startResize = (e) => {
  isResizing.value = true
  startX.value = e.clientX
  startWidth.value = drawerWidth.value
  document.addEventListener('mousemove', handleResizeMove)
  document.addEventListener('mouseup', stopResize)
  e.preventDefault()
}

const handleResizeMove = (e) => {
  if (!isResizing.value) return
  const deltaX = e.clientX - startX.value
  const newWidth = startWidth.value + deltaX
  // 限制最小和最大宽度
  drawerWidth.value = Math.max(300, Math.min(window.innerWidth - 50, newWidth))
}

const stopResize = () => {
  isResizing.value = false
  document.removeEventListener('mousemove', handleResizeMove)
  document.removeEventListener('mouseup', stopResize)
}

// 图表方法
const initCharts = () => {
  catchChart.value = echarts.init(catchChartRef.value)
  trendChart.value = echarts.init(trendChartRef.value)
  updateCharts()
}

const updateCharts = () => {
  // 模拟不同时间范围的数据
  let xData, seriesData
  const fisheries = fisheryData.value.map(item => item.name)

  if (timeRange.value === 'day') {
    xData = ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00']
    seriesData = [
      [120, 132, 101, 134, 90, 230],
      [220, 182, 191, 234, 290, 330],
      [150, 232, 201, 154, 190, 330],
      [320, 332, 301, 334, 390, 330]
    ]
  } else if (timeRange.value === 'week') {
    xData = ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
    seriesData = [
      [120, 132, 101, 134, 90, 230, 210],
      [220, 182, 191, 234, 290, 330, 310],
      [150, 232, 201, 154, 190, 330, 410],
      [320, 332, 301, 334, 390, 330, 320]
    ]
  } else if (timeRange.value === 'month') {
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
  catchChart.value.setOption({
    title: {
      text: '各渔场捕鱼量对比',
      left: 'center'
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    legend: {
      data: fisheries,
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
    series: fisheries.map((name, index) => ({
      name,
      type: 'bar',
      data: seriesData[index]
    }))
  })

  // 捕鱼趋势折线图
  trendChart.value.setOption({
    title: {
      text: '捕鱼量趋势',
      left: 'center'
    },
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      data: fisheries,
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
    series: fisheries.map((name, index) => ({
      name,
      type: 'line',
      data: seriesData[index],
      smooth: true
    }))
  })
}

const handleResize = () => {
  if (catchChart.value) {
    catchChart.value.resize()
  }
  if (trendChart.value) {
    trendChart.value.resize()
  }
}

// 生命周期钩子
onMounted(() => {
  window.addEventListener('resize', handleResize)
  nextTick(initCharts)
})

onBeforeUnmount(() => {
  if (catchChart.value) {
    catchChart.value.dispose()
  }
  if (trendChart.value) {
    trendChart.value.dispose()
  }

  window.removeEventListener('resize', handleResize)
  document.removeEventListener('mousemove', handleResizeMove)
  document.removeEventListener('mouseup', stopResize)
})

// 监听器
watch(showDrawer_fishery, (newVal) => {
  if (newVal) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
})

watch(timeRange, () => {
  updateCharts()
})
</script>

<style scoped>
.drawer-content {
  padding: 20px;
  height: 100%;
  overflow-y: auto;
  position: relative;
}

.time-filter {
  margin-bottom: 20px;
  display: flex;
  justify-content: center;
}

.fishery-info {
  height: 100%;
}

/* 保留原有的调整宽度把手样式 */
.drawer-resize {
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  width: 5px;
  cursor: col-resize;
  background-color: #f0f0f0;
}

.drawer-resize:hover {
  background-color: #409EFF;
}
</style>