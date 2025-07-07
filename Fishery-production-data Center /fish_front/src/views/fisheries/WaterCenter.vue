<template>
  <el-drawer
      v-model="visible"
      title="水质监测中心"
      direction="ttb"
      size="90%"
      :with-header="true"
      :before-close="handleClose"
      :destroy-on-close="false"
      class="water-monitor-drawer"
  >
    <div class="drawer-content">
      <el-tabs v-model="activeTab" type="card" @tab-click="handleTabClick">
        <!-- 第一分页：今日水质指数 -->
        <el-tab-pane label="今日水质" name="today">
          <el-tabs v-model="activeFisheryTab" type="card" class="fishery-tabs">
            <el-tab-pane
                v-for="fishery in fisheries"
                :key="fishery"
                :label="fishery"
                :name="fishery"
            >
              <div class="water-table-container">
                <el-table
                    :data="paginatedTodayData(fishery)"
                    border
                    style="width: 100%"
                    height="500"
                    v-loading="loading"
                >
                  <el-table-column prop="water_fishery" label="采样渔场" width="120" />
                  <el-table-column prop="water_year" label="采样年" width="80" />
                  <el-table-column prop="water_month" label="采样月" width="80" />
                  <el-table-column prop="water_day" label="采样日" width="80" />
                  <el-table-column prop="water_hour" label="采样时" width="80" />
                  <el-table-column prop="water_T" label="浊度" />
                  <el-table-column prop="water_MN" label="高锰酸钾指数" />
                  <el-table-column prop="water_PH" label="PH值" />
                  <el-table-column prop="water_DO" label="溶解氧" />
                  <el-table-column prop="water_TCL" label="总氯" />
                  <el-table-column prop="water_HCL" label="氢氯" />
                  <el-table-column prop="water_temp" label="水温(22度)" />
                  <el-table-column prop="water_TN" label="总氮" />
                  <el-table-column prop="water_NO2" label="亚硝酸盐" />
                  <el-table-column prop="water_NO3" label="硝酸盐" />
                  <el-table-column prop="water_TP" label="总磷" />
                  <el-table-column prop="water_S" label="盐度" />
                  <el-table-column prop="water_SS" label="悬浮物" />
                  <el-table-column prop="water_HM" label="重金属" />
                  <el-table-column prop="water_mark" label="水质分数" />
                </el-table>

                <el-pagination
                    v-model:current-page="todayCurrentPage"
                    v-model:page-size="todayPageSize"
                    :total="filterTodayData(fishery).length"
                    layout="total, sizes, prev, pager, next, jumper"
                    :page-sizes="[10, 20, 50, 100]"
                    @size-change="handleTodaySizeChange"
                    @current-change="handleTodayCurrentChange"
                />

                <div class="pikachu-container">
                  <div class="pikachu" :class="getPikachuState(fishery)">
                    <div class="speech-bubble">{{ getPikachuMessage(fishery) }}</div>
                  </div>
                </div>
              </div>
            </el-tab-pane>
          </el-tabs>
        </el-tab-pane>

        <!-- 第二分页：水质记录 -->
        <el-tab-pane label="水质记录" name="records">
          <div class="filter-container">
            <el-select
                v-model="selectedFishery"
                placeholder="选择渔场"
                clearable
                style="width: 200px; margin-right: 15px;"
                @change="handleFilterChange"
            >
              <el-option
                  v-for="fishery in fisheries"
                  :key="fishery"
                  :label="fishery"
                  :value="fishery"
              />
            </el-select>

            <el-select
                v-model="selectedYear"
                placeholder="选择年份"
                clearable
                style="width: 120px; margin-right: 15px;"
                @change="handleYearChange"
            >
              <el-option
                  v-for="year in yearOptions"
                  :key="year"
                  :label="`${year}年`"
                  :value="year"
              />
            </el-select>

            <el-select
                v-model="selectedMonth"
                placeholder="选择月份"
                clearable
                :disabled="!selectedYear"
                style="width: 120px; margin-right: 15px;"
                @change="handleMonthChange"
            >
              <el-option
                  v-for="month in monthOptions"
                  :key="month"
                  :label="`${month}月`"
                  :value="month"
              />
            </el-select>

            <el-select
                v-model="selectedDay"
                placeholder="选择日期"
                clearable
                :disabled="!selectedMonth"
                style="width: 120px;"
                @change="handleFilterChange"
            >
              <el-option
                  v-for="day in dayOptions"
                  :key="day"
                  :label="`${day}日`"
                  :value="day"
              />
            </el-select>
          </div>

          <el-table
              :data="paginatedRecords"
              border
              style="width: 100%"
              height="600"
              v-loading="loading"
          >
            <el-table-column prop="water_fishery" label="采样渔场" width="120" />
            <el-table-column prop="water_year" label="采样年" width="80" />
            <el-table-column prop="water_month" label="采样月" width="80" />
            <el-table-column prop="water_day" label="采样日" width="80" />
            <el-table-column prop="water_hour" label="采样时" width="80" />
            <el-table-column prop="water_T" label="浊度" />
            <el-table-column prop="water_MN" label="高锰酸钾指数" />
            <el-table-column prop="water_PH" label="PH值" />
            <el-table-column prop="water_DO" label="溶解氧" />
            <el-table-column prop="water_TCL" label="总氯" />
            <el-table-column prop="water_HCL" label="氢氯" />
            <el-table-column prop="water_temp" label="水温" />
            <el-table-column prop="water_TN" label="总氮" />
            <el-table-column prop="water_NO2" label="亚硝酸盐" />
            <el-table-column prop="water_NO3" label="硝酸盐" />
            <el-table-column prop="water_TP" label="总磷" />
            <el-table-column prop="water_S" label="盐度" />
            <el-table-column prop="water_SS" label="悬浮物" />
            <el-table-column prop="water_HM" label="重金属" />
            <el-table-column prop="water_mark" label="水质分数" />
          </el-table>

          <el-pagination
              v-model:current-page="currentPage"
              v-model:page-size="pageSize"
              :total="filteredRecords.length"
              layout="total, sizes, prev, pager, next, jumper"
              :page-sizes="[10, 20, 50, 100]"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
          />
        </el-tab-pane>

        <!-- 第三分页：水质图表 -->
        <el-tab-pane label="水质图表" name="charts">
          <div class="chart-container">
            <div class="chart-filter">
              <el-select
                  v-model="chartFishery"
                  placeholder="选择渔场"
                  clearable
                  style="width: 200px; margin-right: 15px;"
                  @change="handleChartFilterChange"
              >
                <el-option
                    v-for="fishery in fisheries"
                    :key="fishery"
                    :label="fishery"
                    :value="fishery"
                />
              </el-select>

              <el-select
                  v-model="chartYear"
                  placeholder="选择年份"
                  clearable
                  style="width: 120px; margin-right: 15px;"
                  @change="handleChartYearChange"
              >
                <el-option
                    v-for="year in yearOptions"
                    :key="year"
                    :label="`${year}年`"
                    :value="year"
                />
              </el-select>

              <el-select
                  v-model="chartMonth"
                  placeholder="选择月份"
                  clearable
                  :disabled="!chartYear"
                  style="width: 120px; margin-right: 15px;"
                  @change="handleChartMonthChange"
              >
                <el-option
                    v-for="month in chartMonthOptions"
                    :key="month"
                    :label="`${month}月`"
                    :value="month"
                />
              </el-select>

              <el-select
                  v-model="chartDay"
                  placeholder="选择日期"
                  clearable
                  :disabled="!chartMonth"
                  style="width: 120px;"
                  @change="handleChartFilterChange"
              >
                <el-option
                    v-for="day in chartDayOptions"
                    :key="day"
                    :label="`${day}日`"
                    :value="day"
                />
              </el-select>
            </div>

            <div class="chart-wrapper">
<!--              <div class="chart-title">水质指标趋势</div>-->
              <div ref="waterTrendChart" style="width: 100%; height: 500px;"></div>
            </div>

            <div class="chart-wrapper">
<!--              <div class="chart-title">水质分数比例</div>-->
              <div ref="waterPieChart" style="width: 100%; height: 400px;"></div>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </el-drawer>
</template>

<script setup>
import { ref, computed, onMounted, watch, nextTick, onUnmounted } from 'vue'
import * as echarts from 'echarts'
import axios from 'axios'
import { ElMessage } from 'element-plus'

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
    default: false
  }
})

const emit = defineEmits(['update:modelValue'])

// 控制抽屉显示
const visible = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

// 添加默认今日日期
const defaultDate = {
  year: 2024,
  month: 12,
  day: 1
}

// 修改基础状态
const activeTab = ref('today')
const activeFisheryTab = ref('普陀渔场')
const loading = ref(false)
const error = ref(null)

// 渔场选项
const fisheries = ref(["普陀渔场", "定海渔场", "岱山渔场", "沈家门渔场", "朱家尖渔场", "南洞渔场", "高亭渔场"])

// 数据状态
const todayData = ref([])
const waterRecords = ref([])
const total = ref(0)

// 分页状态
const currentPage = ref(1)
const pageSize = ref(20)

// 筛选状态
const selectedFishery = ref('')
const selectedYear = ref('')
const selectedMonth = ref('')
const selectedDay = ref('')

// 图表相关状态
const chartFishery = ref('')
const chartYear = ref('')
const chartMonth = ref('')
const chartDay = ref('')
const waterTrendChart = ref(null)
const waterPieChart = ref(null)

// 图表实例
let trendChartInstance = null
let pieChartInstance = null

// 添加今日数据分页状态
const todayCurrentPage = ref(1)
const todayPageSize = ref(20)

// 定义API基础URL
const API_BASE_URL = 'http://localhost:8080/water'

// 添加更多响应式缓存
const filteredTodayDataCache = ref({})
const isFirstLoad = ref(true)

// 添加水质记录筛选缓存
const filteredRecordsCache = ref([])
const lastFilterParams = ref({
  fishery: null,
  year: null,
  month: null,
  day: null
})

// 添加图表初始化跟踪状态
const chartsInitialized = ref(false)
const chartDataLoaded = ref(false)
const chartDataCache = ref(null)

// 数据加载状态跟踪
const dataLoadStatus = ref({
  today: false,
  records: false,
  charts: false
})

// 监听抽屉可见性，当打开时预加载所有数据
watch(() => visible.value, (newVal) => {
  if (newVal) { // 抽屉打开
    console.log('抽屉打开，预加载所有数据')
    preloadAllData()
  }
}, { immediate: true })

// 预加载所有数据函数
const preloadAllData = async () => {
  if (isFirstLoad.value) {
    console.log('首次加载，预加载所有标签页数据')

    // 同时发起所有数据加载请求
    Promise.all([
      loadTodayData(),
      loadWaterRecords()
    ]).then(() => {
      console.log('所有数据加载完成')
      isFirstLoad.value = false

      // 在DOM更新后初始化图表
      nextTick(() => {
        if (activeTab.value === 'charts') {
          initCharts()
        }
      })
    }).catch(err => {
      console.error('预加载数据出错:', err)
      ElMessage.error('数据加载失败，请重试')
    })
  }
}

// 今日数据加载函数 - 返回Promise对象
const loadTodayData = () => {
  if (dataLoadStatus.value.today) {
    console.log('今日数据已加载，跳过')
    return Promise.resolve()
  }

  console.log('开始加载今日数据')
  loading.value = true

  return axios.get(API_BASE_URL)
      .then(response => {
        if (response.data && response.data.length > 0) {
          todayData.value = response.data
          console.log(`获取到${todayData.value.length}条水质数据`)

          // 清除筛选缓存
          filteredTodayDataCache.value = {}

          // 标记今日数据已加载
          dataLoadStatus.value.today = true
        } else {
          console.warn('未找到水质数据')
          todayData.value = []
        }
      })
      .catch(err => {
        console.error('获取今日水质数据失败:', err)
        ElMessage.error('获取水质数据失败')
        todayData.value = []
      })
      .finally(() => {
        loading.value = false
      })
}

// 水质记录加载函数 - 返回Promise对象
const loadWaterRecords = () => {
  if (dataLoadStatus.value.records) {
    console.log('水质记录已加载，跳过')
    return Promise.resolve()
  }

  console.log('开始加载水质记录')
  loading.value = true

  return axios.get(API_BASE_URL)
      .then(response => {
        if (response.data && response.data.length > 0) {
          waterRecords.value = response.data
          console.log(`获取到${waterRecords.value.length}条水质记录`)

          // 初始化年份选项
          const years = [...new Set(waterRecords.value.map(item => item.water_year))].sort()
          yearOptions.value = years

          // 标记水质记录已加载
          dataLoadStatus.value.records = true
        } else {
          console.warn('未找到水质记录')
          waterRecords.value = []
        }
      })
      .catch(err => {
        console.error('获取水质记录失败:', err)
        ElMessage.error('获取水质记录失败')
        waterRecords.value = []
      })
      .finally(() => {
        loading.value = false
      })
}

// 图表初始化函数 - 修复DOM引用问题
const initCharts = () => {
  if (chartsInitialized.value) {
    console.log('图表已初始化，跳过')
    return
  }

  console.log('初始化图表...')

  // 获取DOM元素
  const trendChartContainer = waterTrendChart.value
  const pieChartContainer = waterPieChart.value

  if (!trendChartContainer || !pieChartContainer) {
    console.error('图表容器未找到，将在下次DOM更新后重试')
    return
  }

  // 清理之前的实例
  if (trendChartInstance) {
    trendChartInstance.dispose()
  }
  if (pieChartInstance) {
    pieChartInstance.dispose()
  }

  // 创建新实例
  trendChartInstance = echarts.init(trendChartContainer)
  pieChartInstance = echarts.init(pieChartContainer)

  // 显示加载中状态
  trendChartInstance.showLoading({text: '加载中...'})
  pieChartInstance.showLoading({text: '加载中...'})

  // 设置窗口大小调整监听
  const handleResize = () => {
    if (trendChartInstance) trendChartInstance.resize()
    if (pieChartInstance) pieChartInstance.resize()
  }
  window.addEventListener('resize', handleResize)

  // 标记为已初始化
  chartsInitialized.value = true

  console.log('图表初始化完成')

  // 如果水质记录已加载，直接处理图表数据
  if (dataLoadStatus.value.records && waterRecords.value.length > 0) {
    fetchChartData()
    dataLoadStatus.value.charts = true
  }
}

// 优化图表数据获取函数
const fetchChartData = () => {
  if (!trendChartInstance || !pieChartInstance) {
    console.error('图表实例未初始化')
    return
  }

  // 显示加载状态
  trendChartInstance.showLoading({text: '处理数据...'})
  pieChartInstance.showLoading({text: '处理数据...'})

  console.log('处理图表数据...')

  // 使用已加载的数据
  if (waterRecords.value && waterRecords.value.length > 0) {
    // 构建过滤条件
    let filteredData = [...waterRecords.value]

    if (chartFishery.value) {
      filteredData = filteredData.filter(item => item.water_fishery === chartFishery.value)
    }
    if (chartYear.value) {
      filteredData = filteredData.filter(item => item.water_year === chartYear.value)
    }
    if (chartMonth.value) {
      filteredData = filteredData.filter(item => item.water_month === chartMonth.value)
    }
    if (chartDay.value) {
      filteredData = filteredData.filter(item => item.water_day === chartDay.value)
    }

    console.log(`筛选后数据: ${filteredData.length}条记录`)

    // 处理数据并更新图表
    const processedData = processChartData(filteredData)

    // 更新图表
    updateCharts(processedData)
  } else {
    // 如果没有数据，加载数据
    loading.value = true
    console.log('获取水质记录数据用于图表...')

    axios.get(API_BASE_URL)
        .then(response => {
          if (response.data && response.data.length > 0) {
            // 保存完整数据集
            waterRecords.value = response.data
            console.log(`获取到${waterRecords.value.length}条水质记录`)

            // 重新调用数据处理
            fetchChartData()
          } else {
            console.error('获取图表数据失败: 返回数据为空')
            ElMessage.warning('暂无水质数据')
            updateCharts({ trendData: [], timePoints: [], xAxisType: 'year', xAxisLabel: '年份', pieData: [] })
          }
        })
        .catch(err => {
          console.error('获取图表数据失败:', err)
          ElMessage.error(`获取图表数据失败: ${err.message || '未知错误'}`)
          updateCharts({ trendData: [], timePoints: [], xAxisType: 'year', xAxisLabel: '年份', pieData: [] })
        })
        .finally(() => {
          loading.value = false
        })
  }
}

// 优化处理图表数据的函数
const processChartData = (data) => {
  console.time('处理图表数据')

  // 没有数据时返回默认值
  if (!data || data.length === 0) {
    console.timeEnd('处理图表数据')
    return {
      trendData: [],
      timePoints: [],
      xAxisType: 'year',
      xAxisLabel: '年份',
      pieData: [
        { value: 0, name: '水质优秀' },
        { value: 0, name: '水质良好' },
        { value: 0, name: '水质较差' }
      ]
    }
  }

  // 确定X轴类型和数据分组方式
  let xAxisType = 'year' // 默认按年分组
  let xAxisField = 'water_year'
  let xAxisLabel = '年份'

  if (chartYear.value && chartMonth.value && chartDay.value) {
    // 选择了年月日，按小时分组
    xAxisType = 'hour'
    xAxisField = 'water_hour'
    xAxisLabel = '小时'
  } else if (chartYear.value && chartMonth.value) {
    // 选择了年月，按日分组
    xAxisType = 'day'
    xAxisField = 'water_day'
    xAxisLabel = '日期'
  } else if (chartYear.value) {
    // 只选择了年，按月分组
    xAxisType = 'month'
    xAxisField = 'water_month'
    xAxisLabel = '月份'
  }

  // 获取所有可能的时间点
  let timePoints = [...new Set(data.map(item => item[xAxisField]))].sort((a, b) => a - b)

  if (timePoints.length === 0) {
    console.timeEnd('处理图表数据')
    return {
      trendData: [],
      timePoints: [],
      xAxisType,
      xAxisLabel,
      pieData: [
        { value: 0, name: '水质优秀' },
        { value: 0, name: '水质良好' },
        { value: 0, name: '水质较差' }
      ]
    }
  }

  // 需要计算平均值的水质指标
  const waterIndicators = [
    { field: 'water_T', name: '浊度' },
    { field: 'water_MN', name: '高锰酸钾指数' },
    { field: 'water_PH', name: 'PH值' },
    { field: 'water_DO', name: '溶解氧' },
    { field: 'water_TCL', name: '总氯' },
    { field: 'water_HCL', name: '氢氯' },
    { field: 'water_temp', name: '水温' },
    { field: 'water_TN', name: '总氮' },
    { field: 'water_NO2', name: '亚硝酸盐' },
    { field: 'water_NO3', name: '硝酸盐' },
    { field: 'water_TP', name: '总磷' },
    { field: 'water_S', name: '盐度' },
    { field: 'water_SS', name: '悬浮物' },
    { field: 'water_HM', name: '重金属' },
    { field: 'water_mark', name: '水质分数' }
  ]

  // 优化数据计算 - 一次循环计算所有指标
  const indicatorSums = {}
  const indicatorCounts = {}

  // 初始化计数器
  waterIndicators.forEach(indicator => {
    indicatorSums[indicator.field] = {}
    indicatorCounts[indicator.field] = {}

    timePoints.forEach(point => {
      indicatorSums[indicator.field][point] = 0
      indicatorCounts[indicator.field][point] = 0
    })
  })

  // 单次遍历数据计算所有时间点的所有指标
  data.forEach(item => {
    const timePoint = item[xAxisField]

    waterIndicators.forEach(indicator => {
      const value = parseFloat(item[indicator.field]) || 0
      indicatorSums[indicator.field][timePoint] += value
      indicatorCounts[indicator.field][timePoint]++
    })
  })

  // 计算平均值并构建系列数据
  const indicatorSeries = waterIndicators.map(indicator => {
    const seriesData = timePoints.map(timePoint => {
      const count = indicatorCounts[indicator.field][timePoint]
      if (count === 0) return null

      const sum = indicatorSums[indicator.field][timePoint]
      const avg = sum / count
      return parseFloat(avg.toFixed(2)) // 保留两位小数
    })

    return {
      name: indicator.name,
      type: 'line',
      smooth: true,
      data: seriesData
    }
  })

  // 饼图数据 - 按水质分数分类
  const excellent = data.filter(item => item.water_mark >= 80).length
  const good = data.filter(item => item.water_mark >= 60 && item.water_mark < 80).length
  const poor = data.filter(item => item.water_mark < 60).length

  const pieData = [
    { value: excellent, name: '水质优秀' },
    { value: good, name: '水质良好' },
    { value: poor, name: '水质较差' }
  ]

  console.timeEnd('处理图表数据')

  return {
    trendData: indicatorSeries,
    timePoints,
    xAxisType,
    xAxisLabel,
    pieData
  }
}

// 优化图表更新函数，添加错误处理
const updateCharts = (chartData) => {
  if (!trendChartInstance || !pieChartInstance) {
    console.error('图表实例未初始化')
    return
  }

  console.log('更新图表数据:', chartData)

  // 隐藏加载状态
  trendChartInstance.hideLoading()
  pieChartInstance.hideLoading()

  // 检查图表数据有效性
  if (!chartData || !chartData.trendData || !chartData.timePoints) {
    console.error('图表数据无效')

    // 显示无数据状态
    trendChartInstance.setOption({
      title: {
        text: '暂无数据',
        left: 'center',
        top: 'center'
      },
      series: []
    }, true)

    pieChartInstance.setOption({
      title: {
        text: '暂无数据',
        left: 'center',
        top: 'center'
      },
      series: []
    }, true)
    return
  }

  try {
    // 颜色配置 - 使用更鲜艳的颜色
    const colors = [
      '#FF4500', '#00CD66', '#1E90FF', '#FFD700', '#FF1493',
      '#00FFFF', '#FF8C00', '#9932CC', '#00FF7F', '#4169E1',
      '#FF00FF', '#00FF00', '#FFA500', '#9400D3', '#FF6347'
    ]

    // 趋势图配置 - 优化美观度
    const trendOption = {
      color: colors,
      title: {
        text: chartFishery.value ? `${chartFishery.value}水质指标趋势` : '水质指标趋势',
        left: 'center',
        textStyle: {
          fontSize: 20,
          fontWeight: 'bold'
        }
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'  // 使用阴影
        },
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        borderColor: '#ccc',
        borderWidth: 1,
        textStyle: {
          color: '#333'
        },
        formatter: function(params) {
          let result = params[0].axisValueLabel + '<br/>';
          params.forEach(param => {
            // 带颜色标记的数据展示
            result += `<div style="display:flex;align-items:center;margin:3px 0;">
                        <span style="display:inline-block;width:12px;height:12px;background:${param.color};margin-right:5px;border-radius:50%;"></span>
                        <span>${param.seriesName}：<b>${param.value || '-'}</b></span>
                      </div>`;
          });
          return result;
        }
      },
      legend: {
        data: chartData.trendData.map(item => item.name),
        type: 'scroll',
        orient: 'horizontal',
        top: 40,
        padding: [5, 10],
        itemGap: 12,
        textStyle: {
          fontSize: 12
        },
        pageIconSize: 12
      },
      grid: {
        left: '3%',
        right: '5%',
        bottom: '5%',
        top: '100px',
        containLabel: true
      },
      toolbox: {
        feature: {
          saveAsImage: {
            title: '保存图片'
          },
          restore: {
            title: '重置'
          }
        },
        right: 20,
        iconStyle: {
          borderColor: '#999'
        }
      },
      // 完全移除缩放功能
      xAxis: {
        type: 'category',
        name: chartData.xAxisLabel,
        data: chartData.timePoints,
        axisLine: {
          lineStyle: {
            color: '#999',
            width: 2
          }
        },
        axisTick: {
          alignWithLabel: true,
          length: 6
        },
        axisLabel: {
          formatter: value => {
            if (chartData.xAxisType === 'month') return `${value}月`
            if (chartData.xAxisType === 'day') return `${value}日`
            if (chartData.xAxisType === 'hour') return `${value}时`
            return value
          },
          margin: 12,
          color: '#333',
          fontSize: 12,
          fontWeight: 'bold'
        },
        nameTextStyle: {
          color: '#333',
          fontSize: 14,
          fontWeight: 'bold'
        }
      },
      yAxis: {
        type: 'value',
        name: '指标值',
        nameTextStyle: {
          color: '#333',
          fontSize: 14,
          fontWeight: 'bold',
          padding: [0, 0, 0, 30]
        },
        axisLine: {
          show: true,
          lineStyle: {
            color: '#999',
            width: 2
          }
        },
        splitLine: {
          lineStyle: {
            type: 'dashed',
            color: '#ddd'
          }
        }
      },
      series: chartData.trendData.map(series => ({
        ...series,
        lineStyle: {
          width: 5,  // 更粗的折线
          shadowColor: 'rgba(0, 0, 0, 0.3)',
          shadowBlur: 12
        },
        symbolSize: 8,  // 更大的数据点
        emphasis: {
          focus: 'series',
          lineStyle: {
            width: 7  // 鼠标悬停时线条更粗
          },
          itemStyle: {
            borderWidth: 3,
            shadowBlur: 10,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        },
        smooth: true  // 平滑曲线
      }))
    }

    // 饼图配置 - 使用相同的明亮色彩
    const pieOption = {
      color: colors,
      title: {
        text: chartFishery.value ? `${chartFishery.value}水质分数比例` : '水质分数比例',
        left: 'center',
        textStyle: {
          fontSize: 20,
          fontWeight: 'bold'
        }
      },
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b}: {c} ({d}%)',
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        borderColor: '#ccc',
        borderWidth: 1,
        textStyle: {
          color: '#333'
        }
      },
      legend: {
        orient: 'horizontal',
        top: 40,
        data: ['水质优秀', '水质良好', '水质较差'],
        itemGap: 25,
        textStyle: {
          fontSize: 14,
          fontWeight: 'bold'
        }
      },
      series: [
        {
          name: '水质分数',
          type: 'pie',
          radius: ['40%', '70%'],
          center: ['50%', '60%'],  // 稍微向下一点
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 12,
            borderColor: '#fff',
            borderWidth: 2,
            shadowBlur: 15,
            shadowColor: 'rgba(0, 0, 0, 0.3)'
          },
          label: {
            show: true,
            formatter: '{b}: {c} ({d}%)',
            fontSize: 14,
            fontWeight: 'bold',
            textShadowBlur: 2,
            textShadowColor: 'rgba(255, 255, 255, 1)'
          },
          emphasis: {
            label: {
              show: true,
              fontSize: 16,
              fontWeight: 'bold',
              shadowBlur: 10,
              shadowColor: 'rgba(0, 0, 0, 0.3)'
            },
            itemStyle: {
              shadowBlur: 20,
              borderWidth: 3
            }
          },
          labelLine: {
            length: 15,
            length2: 12,
            smooth: true,
            lineStyle: {
              width: 2
            }
          },
          data: chartData.pieData
        }
      ],
      animationDuration: 1000,
      animationEasing: 'elasticOut'
    }

    // 更新图表
    trendChartInstance.setOption(trendOption, true)
    pieChartInstance.setOption(pieOption, true)

    console.log('图表更新完成')
  } catch (error) {
    console.error('更新图表出错:', error)
    ElMessage.error('图表更新失败')
  }
}

// 优化标签页切换处理
const handleTabClick = (tab) => {
  const name = tab.props.name
  console.log('切换到标签页:', name)

  if (name === 'today' && !dataLoadStatus.value.today) {
    fetchTodayData()
  } else if (name === 'records' && !dataLoadStatus.value.records) {
    fetchWaterRecords()
  } else if (name === 'charts' && !chartsInitialized.value) {
    // 只有图表需要在DOM更新后初始化
    nextTick(() => {
      initCharts()
    })
  }
}

// 改进图表筛选变化处理
const handleChartFilterChange = () => {
  // 使用缓存减少重新计算
  fetchChartData()
}

// 组件挂载
onMounted(() => {
  console.log('水质监测组件挂载')

  // 如果抽屉已打开，自动加载所有数据
  if (visible.value) {
    preloadAllData()
  }
})

// 资源清理
onUnmounted(() => {
  // 清理图表实例
  if (trendChartInstance) {
    trendChartInstance.dispose()
    trendChartInstance = null
  }
  if (pieChartInstance) {
    pieChartInstance.dispose()
    pieChartInstance = null
  }

  // 移除事件监听
  window.removeEventListener('resize', handleResize)
})

// 关闭抽屉
const closeDrawer = () => {
  console.log('点击关闭按钮')
  emit('update:modelValue', false)
}

// 添加日期选项
const yearOptions = computed(() => {
  const years = [...new Set(waterRecords.value.map(item => item.water_year))];
  // 如果年份过多，只显示最近的10年
  if (years.length > 10) {
    return years.sort((a, b) => b - a).slice(0, 10);
  }
  return years.sort((a, b) => b - a);
})

const monthOptions = computed(() => {
  if (!selectedYear.value) return []

  // 从特定年份的数据中提取所有唯一的月份
  const monthsData = waterRecords.value.filter(item => item.water_year === selectedYear.value)
  const months = [...new Set(monthsData.map(item => item.water_month))]
  return months.sort((a, b) => a - b) // 升序排列
})

const dayOptions = computed(() => {
  if (!selectedYear.value || !selectedMonth.value) return []

  // 从特定年月的数据中提取所有唯一的日期
  const daysData = waterRecords.value.filter(
      item => item.water_year === selectedYear.value && item.water_month === selectedMonth.value
  )
  const days = [...new Set(daysData.map(item => item.water_day))]
  return days.sort((a, b) => a - b) // 升序排列
})

// 图表筛选器选项，与数据记录筛选器使用相同逻辑
const chartMonthOptions = computed(() => {
  if (!chartYear.value) return []

  const monthsData = waterRecords.value.filter(item => item.water_year === chartYear.value)
  const months = [...new Set(monthsData.map(item => item.water_month))]
  return months.sort((a, b) => a - b)
})

const chartDayOptions = computed(() => {
  if (!chartYear.value || !chartMonth.value) return []

  const daysData = waterRecords.value.filter(
      item => item.water_year === chartYear.value && item.water_month === chartMonth.value
  )
  const days = [...new Set(daysData.map(item => item.water_day))]
  return days.sort((a, b) => a - b)
})

// 今日数据分页显示
const paginatedTodayData = (fishery) => {
  const filteredData = filterTodayData(fishery)
  const start = (todayCurrentPage.value - 1) * todayPageSize.value
  const end = start + todayPageSize.value
  return filteredData.slice(start, end)
}

// 优化分页处理函数 - 不重新加载数据
const handleTodaySizeChange = (val) => {
  console.log('今日数据页大小变更:', val)
  todayPageSize.value = val
  todayCurrentPage.value = 1
  // 不重新加载数据，只更新分页
}

const handleTodayCurrentChange = (val) => {
  console.log('今日数据页码变更:', val)
  todayCurrentPage.value = val
  // 不重新加载数据，只更新分页
}

// 关闭前确认
const handleClose = (done) => {
  console.log('关闭抽屉')
  done()
}

// 自动调整图表大小
const handleResize = () => {
  if (trendChartInstance && visible.value) {
    trendChartInstance.resize()
  }
  if (pieChartInstance && visible.value) {
    pieChartInstance.resize()
  }
}

// 修改图表筛选变化处理
const handleChartYearChange = (val) => {
  chartMonth.value = null
  chartDay.value = null
  handleChartFilterChange()
}

const handleChartMonthChange = (val) => {
  chartDay.value = null
  handleChartFilterChange()
}

// 优化今日数据筛选函数 - 使用缓存
const filterTodayData = (fishery) => {
  // 检查缓存中是否已有此渔场的筛选结果
  if (filteredTodayDataCache.value[fishery]) {
    return filteredTodayDataCache.value[fishery]
  }

  // 如果没有缓存，计算筛选结果并缓存
  const filtered = todayData.value.filter(item =>
      item.water_fishery === fishery &&
      item.water_year === defaultDate.year &&
      item.water_month === defaultDate.month &&
      item.water_day === defaultDate.day
  )

  filteredTodayDataCache.value[fishery] = filtered
  return filtered
}

// 更新皮卡丘状态判断
const getPikachuState = (fishery) => {
  const filteredData = filterTodayData(fishery)
  if (filteredData.length === 0) return 'normal'

  // 计算平均水质分数
  const totalScore = filteredData.reduce((sum, item) => sum + item.water_mark, 0)
  const avgScore = totalScore / filteredData.length

  if (avgScore >= 80) return 'happy'
  if (avgScore >= 60) return 'normal'
  return 'sad'
}

// 更新皮卡丘消息
const getPikachuMessage = (fishery) => {
  const state = getPikachuState(fishery)
  const filteredData = filterTodayData(fishery)

  if (filteredData.length === 0) {
    return `没有${defaultDate.year}年${defaultDate.month}月${defaultDate.day}日的水质数据`
  }

  const totalScore = filteredData.reduce((sum, item) => sum + item.water_mark, 0)
  const avgScore = totalScore / filteredData.length

  if (state === 'happy') return `${fishery}水质优秀(${avgScore.toFixed(1)}分)!`
  if (state === 'normal') return `${fishery}水质良好(${avgScore.toFixed(1)}分)`
  return `${fishery}水质较差(${avgScore.toFixed(1)}分)，需要改善!`
}

// 优化筛选和数据加载
const handleFilterChange = () => {
  console.log('筛选条件变化:', {
    fishery: selectedFishery.value,
    year: selectedYear.value,
    month: selectedMonth.value,
    day: selectedDay.value
  })

  // 重置页码
  currentPage.value = 1

  // 检查是否已加载数据
  if (waterRecords.value.length === 0) {
    fetchWaterRecords()
  }
  // 否则只更新筛选结果，不重新加载
}

const handleYearChange = (val) => {
  console.log('年份变化:', val)
  selectedMonth.value = ''
  selectedDay.value = ''
  handleFilterChange()
}

const handleMonthChange = (val) => {
  console.log('月份变化:', val)
  selectedDay.value = ''
  handleFilterChange()
}

// 优化水质记录筛选逻辑
const filteredRecords = computed(() => {
  // 检查筛选条件是否改变
  const currentParams = {
    fishery: selectedFishery.value,
    year: selectedYear.value,
    month: selectedMonth.value,
    day: selectedDay.value
  }

  // 筛选条件没变且缓存有效，直接用缓存
  if (filteredRecordsCache.value.length > 0 &&
      JSON.stringify(currentParams) === JSON.stringify(lastFilterParams.value)) {
    return filteredRecordsCache.value
  }

  // 筛选条件变化，重新计算
  const filtered = waterRecords.value.filter(item => {
    let match = true
    if (selectedFishery.value) match = match && item.water_fishery === selectedFishery.value
    if (selectedYear.value) match = match && item.water_year === selectedYear.value
    if (selectedMonth.value) match = match && item.water_month === selectedMonth.value
    if (selectedDay.value) match = match && item.water_day === selectedDay.value
    return match
  })

  // 更新缓存和最后的筛选参数
  filteredRecordsCache.value = filtered
  lastFilterParams.value = { ...currentParams }

  return filtered
})

// 优化分页数据计算
const paginatedRecords = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredRecords.value.slice(start, end)
})

// 修改分页处理函数，避免重新加载
const handleSizeChange = (val) => {
  console.log('记录页面大小变更:', val)
  pageSize.value = val
  currentPage.value = 1
  // 不重新加载数据，只更新分页显示
}

const handleCurrentChange = (val) => {
  console.log('记录页码变更:', val)
  currentPage.value = val
  // 不重新加载数据，只更新分页显示
}
</script>

<style scoped>
.water-monitor-drawer {
  position: relative;
}

.drawer-content {
  padding: 20px;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.fishery-tabs {
  flex: 1;
}

.water-table-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: auto;
}

.pikachu-container {
  margin-top: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
}

.pikachu {
  width: 150px;
  height: 150px;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  position: relative;
}

.pikachu.happy {
  background-image: url('fish_front/src/assets/img/happy.jpg');
}

.pikachu.normal {
  background-image: url('fish_front/src/assets/img/peace.webp');
}

.pikachu.sad {
  background-image: url('fish_front/src/assets/img/cry.jpeg');
}

.speech-bubble {
  position: absolute;
  top: -50px;
  left: 50%;
  transform: translateX(-50%);
  background-color: white;
  padding: 8px 12px;
  border-radius: 10px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  white-space: nowrap;
}

.speech-bubble:after {
  content: '';
  position: absolute;
  bottom: -10px;
  left: 50%;
  margin-left: -10px;
  border-width: 10px 10px 0;
  border-style: solid;
  border-color: white transparent transparent;
}

.filter-container {
  margin-bottom: 20px;
  display: flex;
  align-items: center;
}

.chart-container {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.chart-filter {
  margin-bottom: 20px;
  display: flex;
  align-items: center;
}

.chart-wrapper {
  margin-bottom: 30px;
  overflow: auto;
}

.chart-title {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 10px;
  text-align: center;
}

.el-pagination {
  margin-top: 15px;
  margin-bottom: 15px;
  justify-content: center;
}
</style>