<template>
  <el-drawer
    v-model="visible"
    title="渔船管理中心"
    direction="ltr"
    size="90%"
    :with-header="true"
    :before-close="handleClose"
    :destroy-on-close="false"
    :size-drag="true"
    class="ship-drawer"
  >
    <div class="drawer-content">
      <div class="header">
        <h2>渔船数据分析中心</h2>
        <el-button @click="closeDrawer" type="primary" size="small">返回主页</el-button>
      </div>

      <el-tabs v-model="activeTab" type="card">
        <!-- 第一分页：渔船详情 -->
        <el-tab-pane label="渔船详情" name="info">
          <div class="filter-container">
            <el-input
              v-model="shipSearchQuery"
              placeholder="输入关键词查询渔船信息"
              clearable
              style="width: 300px; margin-right: 15px;"
              @clear="handleShipSearchClear"
              @keyup.enter="handleShipSearch"
            />

            <el-select
              v-model="selectedCompany"
              placeholder="选择所属公司"
              clearable
              style="width: 250px;"
              @change="handleCompanyChange"
            >
              <el-option
                v-for="company in companies"
                :key="company"
                :label="company"
                :value="company"
              />
            </el-select>
          </div>

          <el-table
            :data="paginatedShipData"
            border
            style="width: 100%"
            height="500"
            v-loading="shipLoading"
          >
            <el-table-column prop="ship_id" label="渔船编号" width="120" />
            <el-table-column prop="ship_name" label="渔船名称" width="150" />
            <el-table-column prop="ship_master" label="船长" width="100" />
            <el-table-column prop="ship_type" label="渔船类型" width="150" />
            <el-table-column prop="ship_company" label="所属公司" width="200" />
            <el-table-column prop="ship_power" label="动力类型" width="120" />
            <el-table-column prop="ship_material" label="船体材质" width="120" />
            <el-table-column prop="ship_length" label="船长(米)" width="100" />
            <el-table-column prop="ship_load" label="载重(吨)" width="100" />
            <el-table-column prop="ship_tonage" label="吨位(吨)" width="100" />
            <el-table-column prop="ship_range" label="航程(海里)" width="120" />
            <el-table-column prop="ship_equip" label="设备配置" />
            <el-table-column prop="ship_tel" label="联系电话" width="150" />
          </el-table>

          <el-pagination
            :current-page="shipCurrentPage"
            :page-size="shipPageSize"
            :total="filteredShipData.length"
            layout="total, sizes, prev, pager, next, jumper"
            :page-sizes="[10, 20, 50, 100]"
            @update:current-page="shipCurrentPage = $event"
            @update:page-size="shipPageSize = $event"
          />
        </el-tab-pane>

        <!-- 第二分页：捕捞记录 -->
        <el-tab-pane label="捕捞记录" name="records">
          <div class="filter-container">
            <el-input
              v-model="catchSearchQuery"
              placeholder="输入关键词查询捕捞记录"
              clearable
              style="width: 300px; margin-right: 15px;"
              @clear="handleCatchSearchClear"
              @keyup.enter="handleCatchSearch"
            />

            <el-select
              v-model="catchYear"
              placeholder="选择年份"
              clearable
              style="width: 150px; margin-right: 15px;"
              @change="handleCatchYearChange"
            >
              <el-option
                v-for="year in catchYearOptions"
                :key="year"
                :label="`${year}年`"
                :value="year"
              />
            </el-select>

            <el-select
              v-model="catchMonth"
              placeholder="选择月份"
              clearable
              :disabled="!catchYear"
              style="width: 150px; margin-right: 15px;"
              @change="handleCatchMonthChange"
            >
              <el-option
                v-for="month in catchMonthOptions"
                :key="month"
                :label="`${month}月`"
                :value="month"
              />
            </el-select>

            <el-select
              v-model="catchDay"
              placeholder="选择日期"
              clearable
              :disabled="!catchMonth"
              style="width: 150px;"
              @change="handleCatchDayChange"
            >
              <el-option
                v-for="day in catchDayOptions"
                :key="day"
                :label="`${day}日`"
                :value="day"
              />
            </el-select>
          </div>

          <el-table
            :data="paginatedCatchData"
            border
            style="width: 100%"
            height="500"
            v-loading="catchLoading"
          >
            <el-table-column prop="catch_fishery" label="渔场" width="120" />
            <el-table-column prop="catch_ship" label="渔船编号" width="120" />
            <el-table-column prop="catch_dock" label="停靠码头" width="150" />
            <el-table-column prop="catch_company" label="所属公司" width="200" />
            <el-table-column prop="catch_year" label="年" width="80" />
            <el-table-column prop="catch_month" label="月" width="80" />
            <el-table-column prop="catch_day" label="日" width="80" />
            <el-table-column prop="catch_hour" label="时" width="80" />
            <el-table-column prop="catch_type" label="海产类别" width="120" />
            <el-table-column prop="catch_name" label="海产名称" width="120" />
            <el-table-column prop="catch_weight" label="重量(公斤)" width="120" />
            <el-table-column prop="catch_date" label="捕捞日期" width="120" />
            <el-table-column prop="catch_time" label="捕捞时间" width="140" />
          </el-table>

          <el-pagination
            :current-page="catchCurrentPage"
            :page-size="catchPageSize"
            :total="filteredCatchData.length"
            layout="total, sizes, prev, pager, next, jumper"
            :page-sizes="[10, 20, 50, 100]"
            @update:current-page="catchCurrentPage = $event"
            @update:page-size="catchPageSize = $event"
          />
        </el-tab-pane>

        <!-- 第三分页：捕捞分析 -->
        <el-tab-pane label="捕捞分析" name="analysis">
          <div class="filter-container">
            <el-select
              v-model="chartYear"
              placeholder="选择年份"
              clearable
              style="width: 150px; margin-right: 15px;"
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
              style="width: 150px; margin-right: 15px;"
              @change="handleChartMonthChange"
            >
              <el-option
                v-for="month in monthOptions"
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
              style="width: 150px; margin-right: 15px;"
              @change="updateCharts"
            >
              <el-option
                v-for="day in dayOptions"
                :key="day"
                :label="`${day}日`"
                :value="day"
              />
            </el-select>

            <el-select
              v-model="selectedChartCompany"
              placeholder="选择公司(海产品饼图)"
              clearable
              style="width: 250px;"
              @change="updateProductPieChart"
            >
              <el-option
                v-for="company in companies"
                :key="company"
                :label="company"
                :value="company"
              />
            </el-select>
          </div>

          <div class="chart-container">
            <!-- 公司捕捞量柱状图 -->
            <div class="chart-wrapper">
              <div class="chart-title">公司捕捞量统计</div>
              <div ref="companyBarChart" style="width: 140vh; height: 500px;"></div>
            </div>

            <!-- 饼图水平并列容器 -->
            <div class="pie-charts-container">
              <!-- 公司捕捞量饼图 -->
              <div class="chart-wrapper pie-chart">
                <div class="chart-title">公司捕捞量比例</div>
                <div ref="companyPieChart" style="width: 100%; height: 400px;"></div>
              </div>

              <!-- 海产品捕捞量饼图 -->
              <div class="chart-wrapper pie-chart">
                <div class="chart-title">海产品捕捞量比例</div>
                <div ref="productPieChart" style="width: 100%; height: 400px;"></div>
              </div>
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

// 关闭抽屉
const closeDrawer = () => {
  emit('update:modelValue', false)
}

// 关闭前确认
const handleClose = (done) => {
  console.log('关闭抽屉')
  done()
}

// 公司选项
const companies = ref([
  '中国水产舟山海洋渔业有限公司',
  '舟山广龙船务有限公司',
  '舟山海盈船务有限公司',
  '舟山市南海宝庆船务有限公司',
  '舟山军华船务有限公司'
])

// 基础状态
const activeTab = ref('info')
const isFirstLoad = ref(true)
const dataLoadStatus = ref({
  ships: false,
  catches: false,
  charts: false
})

// 第一分页：渔船详情
const shipSearchQuery = ref('')
const selectedCompany = ref('')
const shipCurrentPage = ref(1)
const shipPageSize = ref(20)
const shipLoading = ref(false)
const shipData = ref([])

// 第二分页：捕捞记录
const catchSearchQuery = ref('')
const catchYear = ref('')
const catchMonth = ref('')
const catchDay = ref('')
const catchCurrentPage = ref(1)
const catchPageSize = ref(20)
const catchLoading = ref(false)
const catchData = ref([])

// 第三分页：捕捞分析
const chartYear = ref('')
const chartMonth = ref('')
const chartDay = ref('')
const selectedChartCompany = ref('')
const companyBarChart = ref(null)
const companyPieChart = ref(null)
const productPieChart = ref(null)
let barChartInstance = null
let companyPieInstance = null
let productPieInstance = null
const chartsInitialized = ref(false)

// Add these computed properties and data
const yearOptions = computed(() => {
  // Get unique years from catch data
  return [...new Set(catchData.value.map(item => item.catch_year))].sort()
})

const monthOptions = computed(() => {
  if (!chartYear.value) return []

  // Get unique months for the selected year
  return [...new Set(catchData.value
    .filter(item => item.catch_year == chartYear.value)
    .map(item => item.catch_month))]
    .sort((a, b) => a - b)
})

const dayOptions = computed(() => {
  if (!chartYear.value || !chartMonth.value) return []

  // Get unique days for the selected year and month
  return [...new Set(catchData.value
    .filter(item => item.catch_year == chartYear.value && item.catch_month == chartMonth.value)
    .map(item => item.catch_day))]
    .sort((a, b) => a - b)
})

// Add computed properties for catch record time selectors
const catchYearOptions = computed(() => {
  // Get unique years from catch data
  return [...new Set(catchData.value.map(item => item.catch_year))].sort()
})

const catchMonthOptions = computed(() => {
  if (!catchYear.value) return []

  // Get unique months for the selected year
  return [...new Set(catchData.value
    .filter(item => item.catch_year == catchYear.value)
    .map(item => item.catch_month))]
    .sort((a, b) => a - b)
})

const catchDayOptions = computed(() => {
  if (!catchYear.value || !catchMonth.value) return []

  // Get unique days for the selected year and month
  return [...new Set(catchData.value
    .filter(item => item.catch_year == catchYear.value && item.catch_month == catchMonth.value)
    .map(item => item.catch_day))]
    .sort((a, b) => a - b)
})

// 监听抽屉可见性，当打开时预加载所有数据
watch(() => visible.value, (newVal) => {
  if (newVal) { // 抽屉打开
    console.log('抽屉打开，预加载数据')
    preloadAllData()
  }
}, { immediate: true })

// 预加载所有数据函数
const preloadAllData = async () => {
  if (isFirstLoad.value) {
    console.log('首次加载，预加载所有标签页数据')

    // 同时发起所有数据加载请求
    Promise.all([
      fetchShipData(),
      fetchCatchData()
    ]).then(() => {
      console.log('所有数据加载完成')
      isFirstLoad.value = false

      // 在DOM更新后初始化图表
      nextTick(() => {
        if (activeTab.value === 'analysis') {
          initCharts()
        }
      })
    }).catch(err => {
      console.error('预加载数据出错:', err)
      alert('数据加载失败，请重试')
    })
  }
}

// 获取渔船数据
const fetchShipData = async () => {
  if (dataLoadStatus.value.ships) {
    console.log('渔船数据已加载，跳过')
    return Promise.resolve()
  }

  shipLoading.value = true
  console.log('开始加载渔船数据')

  try {
    const response = await axios.get('http://localhost:8080/ship')
    shipData.value = response.data
    console.log(`获取到${shipData.value.length}条渔船数据`)
    dataLoadStatus.value.ships = true
    return Promise.resolve()
  } catch (error) {
    console.error('获取渔船数据失败:', error)
    return Promise.reject(error)
  } finally {
    shipLoading.value = false
  }
}

// 获取捕捞记录数据
const fetchCatchData = async () => {
  if (dataLoadStatus.value.catches) {
    console.log('捕捞记录已加载，跳过')
    return Promise.resolve()
  }

  catchLoading.value = true
  console.log('开始加载捕捞记录数据')

  try {
    const response = await axios.get('http://localhost:8080/catch')
    catchData.value = response.data
    console.log(`获取到${catchData.value.length}条捕捞记录`)
    dataLoadStatus.value.catches = true
    return Promise.resolve()
  } catch (error) {
    console.error('获取捕捞记录数据失败:', error)
    return Promise.reject(error)
  } finally {
    catchLoading.value = false
  }
}

// 过滤渔船数据
const filteredShipData = computed(() => {
  let filtered = [...shipData.value]

  // 按搜索词筛选
  if (shipSearchQuery.value) {
    const query = shipSearchQuery.value.toLowerCase()
    filtered = filtered.filter(item =>
      (item.ship_id && item.ship_id.toLowerCase().includes(query)) ||
      (item.ship_name && item.ship_name.toLowerCase().includes(query)) ||
      (item.ship_master && item.ship_master.toLowerCase().includes(query)) ||
      (item.ship_type && item.ship_type.toLowerCase().includes(query)) ||
      (item.ship_company && item.ship_company.toLowerCase().includes(query)) ||
      (item.ship_power && item.ship_power.toLowerCase().includes(query)) ||
      (item.ship_material && item.ship_material.toLowerCase().includes(query)) ||
      (item.ship_equip && item.ship_equip.toLowerCase().includes(query))
    )
  }

  // 按公司筛选
  if (selectedCompany.value) {
    filtered = filtered.filter(item => item.ship_company === selectedCompany.value)
  }

  return filtered
})

// 渔船数据分页
const paginatedShipData = computed(() => {
  const start = (shipCurrentPage.value - 1) * shipPageSize.value
  const end = start + shipPageSize.value
  return filteredShipData.value.slice(start, end)
})

// 过滤捕捞记录数据
const filteredCatchData = computed(() => {
  let filtered = [...catchData.value]

  // 按搜索词筛选
  if (catchSearchQuery.value) {
    const query = catchSearchQuery.value.toLowerCase()
    filtered = filtered.filter(item =>
      (item.catch_fishery && item.catch_fishery.toLowerCase().includes(query)) ||
      (item.catch_ship && item.catch_ship.toLowerCase().includes(query)) ||
      (item.catch_dock && item.catch_dock.toLowerCase().includes(query)) ||
      (item.catch_company && item.catch_company.toLowerCase().includes(query)) ||
      (item.catch_type && item.catch_type.toLowerCase().includes(query)) ||
      (item.catch_name && item.catch_name.toLowerCase().includes(query))
    )
  }

  // 按年筛选
  if (catchYear.value) {
    filtered = filtered.filter(item => item.catch_year == catchYear.value)

    // 按月筛选
    if (catchMonth.value) {
      filtered = filtered.filter(item => item.catch_month == catchMonth.value)

      // 按日筛选
      if (catchDay.value) {
        filtered = filtered.filter(item => item.catch_day == catchDay.value)
      }
    }
  }

  return filtered
})

// 捕捞记录分页
const paginatedCatchData = computed(() => {
  const start = (catchCurrentPage.value - 1) * catchPageSize.value
  const end = start + catchPageSize.value
  return filteredCatchData.value.slice(start, end)
})

// 渔船搜索处理
const handleShipSearch = () => {
  shipCurrentPage.value = 1
}

const handleShipSearchClear = () => {
  shipSearchQuery.value = ''
  shipCurrentPage.value = 1
}

const handleCompanyChange = () => {
  shipCurrentPage.value = 1
}

// 捕捞记录搜索处理
const handleCatchSearch = () => {
  catchCurrentPage.value = 1
}

const handleCatchSearchClear = () => {
  catchSearchQuery.value = ''
  catchCurrentPage.value = 1
}

// 捕捞记录时间筛选
const handleCatchYearChange = () => {
  catchMonth.value = ''
  catchDay.value = ''
  catchCurrentPage.value = 1
}

const handleCatchMonthChange = () => {
  catchDay.value = ''
  catchCurrentPage.value = 1
}

const handleCatchDayChange = () => {
  catchCurrentPage.value = 1
}

// 图表时间筛选
const handleChartYearChange = () => {
  chartMonth.value = ''
  chartDay.value = ''
  updateCharts()
}

const handleChartMonthChange = () => {
  chartDay.value = ''
  updateCharts()
}

// 标签页切换处理
watch(activeTab, (newTab) => {
  console.log('切换到标签页:', newTab)

  if (newTab === 'analysis' && !chartsInitialized.value) {
    nextTick(() => {
      initCharts()
    })
  }
})

// 图表初始化
const initCharts = () => {
  if (chartsInitialized.value) {
    console.log('图表已初始化，跳过')
    return
  }

  console.log('初始化图表...')

  // 获取DOM元素
  const barChartContainer = companyBarChart.value
  const companyPieContainer = companyPieChart.value
  const productPieContainer = productPieChart.value

  if (!barChartContainer || !companyPieContainer || !productPieContainer) {
    console.error('图表容器未找到，将在下次DOM更新后重试')
    return
  }

  // 清理之前的实例
  if (barChartInstance) {
    barChartInstance.dispose()
  }
  if (companyPieInstance) {
    companyPieInstance.dispose()
  }
  if (productPieInstance) {
    productPieInstance.dispose()
  }

  // 创建新实例
  barChartInstance = echarts.init(barChartContainer)
  companyPieInstance = echarts.init(companyPieContainer)
  productPieInstance = echarts.init(productPieContainer)

  // 设置窗口大小调整监听
  const handleResize = () => {
    if (barChartInstance) barChartInstance.resize()
    if (companyPieInstance) companyPieInstance.resize()
    if (productPieInstance) productPieInstance.resize()
  }
  window.addEventListener('resize', handleResize)

  // 标记为已初始化
  chartsInitialized.value = true

  console.log('图表初始化完成')

  // 更新图表数据
  updateCharts()
}

// 更新图表
const updateCharts = () => {
  if (!barChartInstance || !companyPieInstance || !productPieInstance) return

  console.log('更新图表数据...')

  // 更新柱状图和公司饼图
  updateBarAndCompanyPieCharts()

  // 更新海产品饼图
  updateProductPieChart()
}

// Change the updateBarAndCompanyPieCharts function to use proper x-axis labels
const updateBarAndCompanyPieCharts = () => {
  if (!barChartInstance || !companyPieInstance) return

  // Prepare data
  let filtered = [...catchData.value]

  // Filter by time
  if (chartYear.value) {
    filtered = filtered.filter(item => item.catch_year == chartYear.value)

    if (chartMonth.value) {
      filtered = filtered.filter(item => item.catch_month == chartMonth.value)

      if (chartDay.value) {
        filtered = filtered.filter(item => item.catch_day == chartDay.value)
      }
    }
  }

  // Determine x-axis type based on selected filters
  let xAxisType = 'year'
  let xAxisData = []

  if (chartYear.value && !chartMonth.value) {
    // When only year is selected, x-axis shows months
    xAxisType = 'month'
    xAxisData = Array.from({length: 12}, (_, i) => i + 1) // Months 1-12
  } else if (chartYear.value && chartMonth.value && !chartDay.value) {
    // When year and month are selected, x-axis shows days
    xAxisType = 'day'
    const daysInMonth = new Date(chartYear.value, chartMonth.value, 0).getDate()
    xAxisData = Array.from({length: daysInMonth}, (_, i) => i + 1) // Days 1-31 (or less)
  } else if (chartYear.value && chartMonth.value && chartDay.value) {
    // When year, month, and day are selected, x-axis shows hours
    xAxisType = 'hour'
    xAxisData = Array.from({length: 24}, (_, i) => i) // Hours 0-23
  } else {
    // Default - show all years
    xAxisType = 'year'
    xAxisData = [...new Set(catchData.value.map(item => item.catch_year))].sort()
  }

  // Prepare series data by company
  const seriesData = []

  // Calculate total catch by company for the pie chart
  const companyData = companies.value.map(company => {
    const companyCatches = filtered.filter(item => item.catch_company === company)
    const totalWeight = companyCatches.reduce((sum, item) => sum + Number(item.catch_weight || 0), 0)
    return {
      name: company,
      value: parseFloat(totalWeight.toFixed(2))
    }
  }).filter(item => item.value > 0);

  companies.value.forEach(company => {
    const data = []

    for (const x of xAxisData) {
      let companyFiltered = filtered.filter(item => item.catch_company === company)

      if (xAxisType === 'month') {
        companyFiltered = companyFiltered.filter(item => item.catch_month == x)
      } else if (xAxisType === 'day') {
        companyFiltered = companyFiltered.filter(item => item.catch_day == x)
      } else if (xAxisType === 'hour') {
        companyFiltered = companyFiltered.filter(item => item.catch_hour == x)
      } else if (xAxisType === 'year') {
        companyFiltered = companyFiltered.filter(item => item.catch_year == x)
      }

      const totalWeight = companyFiltered.reduce((sum, item) =>
        sum + Number(item.catch_weight || 0), 0
      )
      data.push(parseFloat(totalWeight.toFixed(2)))
    }

    seriesData.push({
      name: company,
      type: 'bar',
      // Remove stack property to make bars individual
      barWidth: 14, // Make bars narrower to fit side by side
      barGap: '10%', // Space between bars
      emphasis: {
        focus: 'series'
      },
      data: data
    })
  })

  // Format x-axis labels
  const xAxisLabels = xAxisData.map(x => {
    if (xAxisType === 'month') return `${x}月`
    if (xAxisType === 'day') return `${x}日`
    if (xAxisType === 'hour') return `${x}时`
    return `${x}年`
  })

  // Colors
  const colors = [
    '#5470C6', '#91CC75', '#EE6666', '#FAC858', '#73C0DE',
    '#3BA272', '#FC8452', '#9A60B4', '#ea7ccc', '#4EC5D5'
  ]

  // Time range text
  let timeRangeText = ''
  if (chartYear.value) {
    timeRangeText = `${chartYear.value}年`
    if (chartMonth.value) {
      timeRangeText += `${chartMonth.value}月`
      if (chartDay.value) {
        timeRangeText += `${chartDay.value}日`
      }
    }
  } else {
    timeRangeText = '全部时间'
  }

  // Bar chart option
  const barOption = {
    color: colors,
    title: {
      text: `${timeRangeText}公司捕捞量统计`,
      left: 'center',
      textStyle: {
        fontSize: 18,
        fontWeight: 'bold'
      }
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    legend: {
      data: companies.value,
      top: '40px'
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '10%',
      top: '80px',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: xAxisLabels,
      axisLabel: {
        interval: 0,
        rotate: xAxisLabels.length > 12 ? 45 : 0,
        fontSize: 12
      }
    },
    yAxis: {
      type: 'value',
      name: '捕捞量(公斤)',
      nameTextStyle: {
        fontSize: 14,
        padding: [0, 0, 0, 40]
      }
    },
    series: seriesData
  }

  // Company pie chart configuration
  const companyPieOption = {
    color: colors,
    title: {
      text: `${timeRangeText}公司捕捞量比例`,
      left: 'center',
      textStyle: {
        fontSize: 18,
        fontWeight: 'bold'
      }
    },
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c} 公斤 ({d}%)'
    },
    legend: {
      orient: 'vertical',
      left: 'left',
      top: 'middle',
      data: companyData.map(item => item.name)
    },
    series: [{
      name: '公司捕捞量',
      type: 'pie',
      radius: ['40%', '70%'],
      center: ['60%', '50%'],
      avoidLabelOverlap: false,
      itemStyle: {
        borderRadius: 10,
        borderColor: '#fff',
        borderWidth: 2
      },
      label: {
        show: true,
        formatter: '{b}: {c} 公斤'
      },
      emphasis: {
        label: {
          show: true,
          fontSize: 16,
          fontWeight: 'bold'
        },
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      },
      data: companyData.length > 0 ? companyData : [{ name: '暂无数据', value: 1 }]
    }]
  }

  // Set chart options
  barChartInstance.setOption(barOption, true)
  companyPieInstance.setOption(companyPieOption, true)
}

// Update product pie chart to show all companies data when none selected
const updateProductPieChart = () => {
  if (!productPieInstance) return

  // Prepare data
  let filtered = [...catchData.value]

  // Filter by time
  if (chartYear.value) {
    filtered = filtered.filter(item => item.catch_year == chartYear.value)

    if (chartMonth.value) {
      filtered = filtered.filter(item => item.catch_month == chartMonth.value)

      if (chartDay.value) {
        filtered = filtered.filter(item => item.catch_day == chartDay.value)
      }
    }
  }

  // Marine product catch data - use all data when no company selected
  let productData = []
  let calculatedCatches = filtered

  // If company is selected, filter by company, otherwise use all
  if (selectedChartCompany.value) {
    calculatedCatches = filtered.filter(item => item.catch_company === selectedChartCompany.value)
  }

  // Get unique product types and calculate totals
  const productTypes = [...new Set(calculatedCatches.map(item => item.catch_type))]

  productData = productTypes.map(type => {
    const typeCatches = calculatedCatches.filter(item => item.catch_type === type)
    const totalWeight = typeCatches.reduce((sum, item) => sum + Number(item.catch_weight || 0), 0)
    return {
      name: type,
      value: parseFloat(totalWeight.toFixed(2))
    }
  }).filter(item => item.value > 0)

  // Colors
  const colors = [
    '#5470C6', '#91CC75', '#EE6666', '#FAC858', '#73C0DE',
    '#3BA272', '#FC8452', '#9A60B4', '#ea7ccc', '#4EC5D5'
  ]

  // Time range text
  let timeRangeText = ''
  if (chartYear.value) {
    timeRangeText = `${chartYear.value}年`
    if (chartMonth.value) {
      timeRangeText += `${chartMonth.value}月`
      if (chartDay.value) {
        timeRangeText += `${chartDay.value}日`
      }
    }
  } else {
    timeRangeText = '全部时间'
  }

  // Product pie chart title
  const productPieTitle = selectedChartCompany.value
    ? `${timeRangeText} ${selectedChartCompany.value} 海产品捕捞比例`
    : `${timeRangeText}所有公司海产品捕捞比例`;

  const productPieOption = {
    color: colors,
    title: {
      text: productPieTitle,
      left: 'center',
      textStyle: {
        fontSize: 18,
        fontWeight: 'bold'
      }
    },
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c} 公斤 ({d}%)'
    },
    legend: {
      orient: 'vertical',
      left: 'left',
      top: 'middle',
      data: productData.map(item => item.name)
    },
    series: [{
      name: '海产品捕捞量',
      type: 'pie',
      radius: ['40%', '70%'],
      center: ['60%', '50%'],
      avoidLabelOverlap: false,
      itemStyle: {
        borderRadius: 10,
        borderColor: '#fff',
        borderWidth: 2
      },
      label: {
        show: true,
        formatter: '{b}: {c} 公斤'
      },
      emphasis: {
        label: {
          show: true,
          fontSize: 16,
          fontWeight: 'bold'
        },
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      },
      data: productData.length > 0 ? productData : [{ name: '暂无数据', value: 1 }]
    }]
  }

  // Set chart options
  productPieInstance.setOption(productPieOption, true)
}

// 资源清理
onUnmounted(() => {
  // 清理图表实例
  if (barChartInstance) {
    barChartInstance.dispose()
    barChartInstance = null
  }
  if (companyPieInstance) {
    companyPieInstance.dispose()
    companyPieInstance = null
  }
  if (productPieInstance) {
    productPieInstance.dispose()
    productPieInstance = null
  }

  // 移除事件监听
  window.removeEventListener('resize', handleResize)
})

// 自动调整图表大小函数
const handleResize = () => {
  if (barChartInstance && visible.value) {
    barChartInstance.resize()
  }
  if (companyPieInstance && visible.value) {
    companyPieInstance.resize()
  }
  if (productPieInstance && visible.value) {
    productPieInstance.resize()
  }
}
</script>

<style scoped>
.ship-drawer {
  position: relative;
}

.drawer-content {
  padding: 20px;
  height: 100%;
  overflow-y: auto;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.filter-container {
  margin-bottom: 20px;
  display: flex;
  align-items: center;
}

.el-pagination {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}

.chart-container {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.chart-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;
}

.chart-title {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 10px;
  text-align: center;
}

.pie-charts-container {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
  gap: 20px;
  margin-bottom: 30px;
}

.pie-chart {
  flex: 1;
  min-width: 0; /* 允许饼图容器在必要时缩小 */
  margin-bottom: 0;
}

/* 响应式调整 */
@media (max-width: 1200px) {
  .filter-container {
    flex-wrap: wrap;
    gap: 10px;
  }

  .filter-container > * {
    width: 100% !important;
    margin-right: 0 !important;
  }

  .chart-container {
    gap: 20px;
  }

  .pie-charts-container {
    flex-direction: column;
    gap: 30px;
  }

  .pie-chart {
    width: 100%;
  }
}
</style>