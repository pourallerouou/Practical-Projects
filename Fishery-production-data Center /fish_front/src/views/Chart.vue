<template>
  <div class="dashboard-container">
    <!-- 渔场信息表格 -->
    <div style="height: 50vh" class="card">
      <div class="table-scroll-container">
        <h2>各渔场信息表</h2>
        <table v-if="fisheries.length">
          <thead>
          <tr>
            <th>渔场名</th>
            <th>产量(吨)</th>
            <th>渔场编号</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(fishery, index) in fisheries" :key="'fishery-'+index">
            <td>{{ fishery.fsy_name }}</td>
            <td>{{ fishery.fsy_output }}</td>
            <td>{{ fishery.fsy_id }}</td>
          </tr>
          </tbody>
        </table>
        <div v-else class="loading">加载中...</div>
      </div>
    </div>

    <!-- 渔船信息表格 -->
    <div class="card">
      <div  class="table-scroll-container">
        <h2>各渔船信息表</h2>
        <table v-if="boats.length">
          <thead>
          <tr>
            <th>渔船名</th>
            <th>排水量</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(boat, index) in boats" :key="'boat-'+index">
            <td>{{ boat.boat_name }}</td>
            <td>{{ boat.boat_tonage }}</td>
          </tr>
          </tbody>
        </table>
        <div v-else class="loading">加载中...</div>
      </div>
    </div>

    <!-- 渔场产量分布饼图 -->
    <div class="card chart-card">
      <h2>各渔场产量分布</h2>
      <div ref="fisheryChart" class="chart"></div>
    </div>

    <!-- 渔船捕鱼量分布饼图 -->
    <div class="card chart-card">
      <h2>各渔船捕鱼量分布</h2>
      <div ref="boatChart" class="chart"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import * as echarts from 'echarts'
import axios from 'axios'

// 响应式数据
const fisheries = ref([])
const boats = ref([])
const fisheryChart = ref(null)
const boatChart = ref(null)
let fisheryChartInstance = null
let boatChartInstance = null

// 获取渔场数据
const fetchFisheryData = async () => {
  try {
    const response = await axios.get('http://localhost:8080/select')
    fisheries.value = response.data || []
    renderFisheryChart()
  } catch (error) {
    console.error('渔场数据获取失败:', error)
  }
}

// 获取渔船数据
const fetchBoatData = async () => {
  try {
    const response = await axios.get('http://localhost:8080/boat')
    boats.value = response.data || []
    renderBoatChart()
  } catch (error) {
    console.error('渔船数据获取失败:', error)
  }
}

// 渲染渔场图表
const renderFisheryChart = () => {
  if (!fisheryChart.value || !fisheries.value.length) return

  fisheryChartInstance = echarts.init(fisheryChart.value)
  fisheryChartInstance.setOption({
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c}吨 ({d}%)'
    },
    legend: {
      orient: 'vertical',
      right: 10,
      top: 'center',
      data: fisheries.value.map(item => item.fsy_name)
    },
    series: [{
      name: '渔场产量',
      type: 'pie',
      radius: ['50%', '70%'],
      data: fisheries.value.map(item => ({
        value: item.fsy_output,
        name: item.fsy_name
      }))
    }]
  })
}

// 渲染渔船图表
const renderBoatChart = () => {
  if (!boatChart.value || !boats.value.length) return

  boatChartInstance = echarts.init(boatChart.value)
  boatChartInstance.setOption({
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c}吨 ({d}%)'
    },
    legend: {
      orient: 'vertical',
      right: 10,
      top: 'center',
      data: boats.value.map(item => item.boat_name)
    },
    series: [{
      name: '渔船捕鱼量',
      type: 'pie',
      radius: ['50%', '70%'],
      data: boats.value.map(item => ({
        value: item.boat_tonage,
        name: item.boat_name
      }))
    }]
  })
}

// 窗口大小变化时重绘图表
const handleResize = () => {
  fisheryChartInstance?.resize()
  boatChartInstance?.resize()
}

// 生命周期钩子
onMounted(() => {
  fetchFisheryData()
  fetchBoatData()
  window.addEventListener('resize', handleResize)
})

onBeforeUnmount(() => {
  // 清理资源
  fisheryChartInstance?.dispose()
  boatChartInstance?.dispose()
  window.removeEventListener('resize', handleResize)
})
</script>

<style scoped>
/* 保持原有的样式不变 */
.dashboard-container {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.card {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  padding: 20px;
}

.chart-card {
  display: flex;
  flex-direction: column;
}

.chart {
  width: 100%;
  height: 400px;
  margin-top: 10px;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 15px;
}

th, td {
  padding: 12px 15px;
  text-align: left;
  border-bottom: 1px solid #eaeaea;
}

th {
  background-color: #f8f9fa;
  font-weight: 600;
}

tr:hover {
  background-color: #f5f5f5;
}

h2 {
  margin: 0 0 15px 0;
  color: #333;
  font-size: 18px;
}

.loading {
  padding: 20px;
  text-align: center;
  color: #666;
}

@media (max-width: 768px) {
  .dashboard-container {
    grid-template-columns: 1fr;
  }
}
</style>