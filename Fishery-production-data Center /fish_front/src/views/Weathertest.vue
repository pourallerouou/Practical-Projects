<template>
  <div class="ocean-weather">
    <h2>海洋气象智能预测</h2>

    <!-- 海域选择 -->
    <div class="location-selector">
      <label>选择海域：</label>
      <select v-model="selectedLocation" @change="fetchData">
        <option value="21.31,122.18">台湾东部海域</option>
        <option value="18.12,109.46">南海北部海域</option>
      </select>
    </div>

    <!-- 加载状态 -->
    <div v-if="loading" class="loading">数据加载中...</div>

    <!-- 天气卡片组 -->
    <div v-else class="weather-cards">
      <!-- 短期预测卡片 -->
      <div class="weather-card">
        <h3>⏱️ 未来6小时</h3>
        <ul>
          <li v-for="hour in hourlyData" :key="hour.time">
            <span class="time">{{ hour.time }}</span>
            <span class="wave">🌊 {{ hour.waveHeight }}m</span>
            <span class="wind">🌬️ {{ hour.windSpeed }}m/s</span>
            <span class="temp">🌡️ {{ hour.temperature }}°C</span>
          </li>
        </ul>
      </div>

      <!-- 中期预测卡片 -->
      <div class="weather-card">
        <h3>📅 未来7天</h3>
        <ul>
          <li v-for="day in dailyData" :key="day.date">
            <span class="date">{{ day.date }}</span>
            <span class="wave">🌊 最大 {{ day.maxWave }}m</span>
            <span class="wind">🧭 {{ day.windDirection }}风</span>
          </li>
        </ul>
      </div>

      <!-- 长期趋势卡片 -->
      <div class="weather-card trend-card">
        <h3>📈 月度趋势</h3>
        <div class="trend-item">
          <span>平均浪高：</span>
          <strong>{{ monthlyData.avgWaveHeight }}m</strong>
        </div>
        <div class="trend-item">
          <span>预计风暴天数：</span>
          <strong>{{ monthlyData.stormDays }}天</strong>
        </div>
        <div class="trend-item">
          <span>主要趋势：</span>
          <strong>{{ monthlyData.trend }}</strong>
        </div>
      </div>
    </div>

    <!-- 数据更新时间 -->
    <div v-if="!loading" class="update-time">
      最后更新：{{ new Date().toLocaleString() }}
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

// 使用模拟数据（实际项目替换为真实API调用）
const selectedLocation = ref('21.31,122.18')
const loading = ref(true)
const hourlyData = ref([])
const dailyData = ref([])
const monthlyData = ref({})

// 模拟API数据获取
const fetchData = async () => {
  loading.value = true
  try {
    // 这里应该是真实的API调用，示例使用模拟数据
    await new Promise(resolve => setTimeout(resolve, 800))

    // 生成模拟的短期数据
    hourlyData.value = Array.from({ length: 6 }, (_, i) => ({
      time: `${new Date().getHours() + i}:00`,
      waveHeight: (1 + Math.random() * 2).toFixed(1),
      windSpeed: (5 + Math.random() * 10).toFixed(1),
      temperature: (22 + Math.random() * 8).toFixed(1)
    }))

    // 生成模拟的中期数据
    dailyData.value = Array.from({ length: 7 }, (_, i) => {
      const date = new Date()
      date.setDate(date.getDate() + i)
      return {
        date: date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' }),
        maxWave: (1.5 + Math.random() * 3).toFixed(1),
        windDirection: ['东', '东南', '南', '西南', '西', '西北', '北'][Math.floor(Math.random() * 7)]
      }
    })

    // 生成模拟的长期数据
    monthlyData.value = {
      avgWaveHeight: (1.8 + Math.random() * 1.5).toFixed(1),
      stormDays: Math.floor(Math.random() * 5),
      trend: ['平稳', '逐渐增强', '波动较大'][Math.floor(Math.random() * 3)]
    }

  } catch (error) {
    console.error('获取数据失败:', error)
  } finally {
    loading.value = false
  }
}

onMounted(fetchData)
</script>

<style scoped>
.ocean-weather {
  max-width: 900px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'Arial', sans-serif;
}

.location-selector {
  margin: 20px 0;
}

.location-selector select {
  padding: 8px 12px;
  border-radius: 4px;
  border: 1px solid #ddd;
  font-size: 16px;
}

.loading {
  padding: 40px;
  text-align: center;
  color: #666;
}

.weather-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.weather-card {
  background: white;
  border-radius: 8px;
  padding: 15px 20px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.weather-card h3 {
  margin-top: 0;
  color: #2c3e50;
  border-bottom: 1px solid #eee;
  padding-bottom: 10px;
}

.weather-card ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.weather-card li {
  padding: 10px 0;
  border-bottom: 1px solid #f5f5f5;
  display: flex;
  justify-content: space-between;
}

.weather-card li:last-child {
  border-bottom: none;
}

.weather-card .time,
.weather-card .date {
  font-weight: bold;
  min-width: 60px;
}

.trend-card .trend-item {
  padding: 8px 0;
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid #f5f5f5;
}

.trend-card .trend-item:last-child {
  border-bottom: none;
}

.update-time {
  margin-top: 20px;
  text-align: right;
  color: #666;
  font-size: 14px;
}

@media (max-width: 768px) {
  .weather-cards {
    grid-template-columns: 1fr;
  }
}
</style>