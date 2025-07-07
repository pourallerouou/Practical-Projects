<template>
  <el-drawer
      v-model="visible"
      title="车队管理中心"
      direction="rtl"
      size="80%"
      :with-header="true"
      :before-close="handleClose"
      :destroy-on-close="false"
      :size-drag="true"
      class="fleet-drawer"
  >
    <div class="drawer-content">
      <div class="header">
        <h2>车队数据分析中心</h2>
        <el-button @click="closeDrawer" type="primary" size="small">返回主页</el-button>
      </div>

      <el-tabs v-model="activeTab" type="card">
        <!-- 第一分页：车队运输记录表 -->
        <el-tab-pane label="车队运输记录" name="records">
          <div class="filter-container">
            <el-input
                v-model="searchQuery"
                placeholder="输入关键词查询车队信息"
                clearable
                style="width: 300px; margin-right: 15px;"
                @clear="handleSearchClear"
                @keyup.enter="handleSearch"
            />

            <div class="date-filters">
              <el-select
                  v-model="selectedYear"
                  placeholder="选择年份"
                  clearable
                  @change="handleYearChange"
                  style="width: 120px; margin-right: 10px;"
              >
                <el-option
                    v-for="year in yearOptions"
                    :key="year"
                    :label="year + '年'"
                    :value="year"
                />
              </el-select>

              <el-select
                  v-model="selectedMonth"
                  placeholder="选择月份"
                  clearable
                  :disabled="!selectedYear"
                  @change="handleMonthChange"
                  style="width: 120px; margin-right: 10px;"
              >
                <el-option
                    v-for="month in monthOptions"
                    :key="month"
                    :label="month + '月'"
                    :value="month"
                />
              </el-select>

              <el-select
                  v-model="selectedDay"
                  placeholder="选择日期"
                  clearable
                  :disabled="!selectedMonth"
                  @change="handleDateChange"
                  style="width: 120px; margin-right: 10px;"
              >
                <el-option
                    v-for="day in dayOptions"
                    :key="day"
                    :label="day + '日'"
                    :value="day"
                />
              </el-select>

              <el-button @click="resetFilters">重置</el-button>
            </div>
          </div>

          <el-alert
              v-if="loadError"
              :title="errorMessage"
              type="error"
              :closable="false"
              show-icon
              style="margin-bottom: 15px;"
          />

          <el-table
              :data="paginatedFleetData"
              border
              style="width: 100%"
              height="500"
              v-loading="dataLoading"
          >
            <template #empty>
              <el-empty description="暂无数据" />
            </template>
            <el-table-column prop="id" label="ID" width="80" />
            <el-table-column prop="dock_out_year" label="年份" width="80" />
            <el-table-column prop="dock_out_month" label="月份" width="80" />
            <el-table-column prop="dock_out_day" label="日期" width="80" />
            <el-table-column prop="dock_out_hour" label="小时" width="80" />
            <el-table-column prop="dock_out_time" label="出发时间" width="180" />
            <el-table-column prop="dock_out_fleet" label="车队编号" width="150" />
            <el-table-column prop="dock_out_company" label="所属公司" width="200" />
            <el-table-column prop="dock_out_name" label="运输货物" width="120" />
            <el-table-column prop="dock_out_type" label="货物类型" width="120" />
            <el-table-column label="重量(吨)" width="100">
              <template #default="scope">
                {{ scope.row.dock_out_weight ? scope.row.dock_out_weight.toFixed(2) : '0.00' }}
              </template>
            </el-table-column>
            <el-table-column prop="dock_out_other" label="备注" min-width="120" />
          </el-table>

          <div class="pagination-container">
            <el-pagination
                v-model:current-page="currentPage"
                v-model:page-size="pageSize"
                :page-sizes="[10, 20, 50, 100]"
                layout="total, sizes, prev, pager, next, jumper"
                :total="filteredFleetData.length"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
            />
          </div>
        </el-tab-pane>

        <!-- 第二分页：车队分析图表 -->
        <el-tab-pane label="车队分析图表" name="charts">
          <div class="charts-container">
            <div class="filter-container">
              <div class="date-filters">
                <el-select
                    v-model="chartSelectedYear"
                    placeholder="选择年份"
                    clearable
                    @change="handleChartYearChange"
                    style="width: 120px; margin-right: 10px;"
                >
                  <el-option
                      v-for="year in yearOptions"
                      :key="year"
                      :label="year + '年'"
                      :value="year"
                  />
                </el-select>

                <el-select
                    v-model="chartSelectedMonth"
                    placeholder="选择月份"
                    clearable
                    :disabled="!chartSelectedYear"
                    @change="handleChartMonthChange"
                    style="width: 120px; margin-right: 10px;"
                >
                  <el-option
                      v-for="month in monthOptions"
                      :key="month"
                      :label="month + '月'"
                      :value="month"
                  />
                </el-select>

                <el-select
                    v-model="chartSelectedDay"
                    placeholder="选择日期"
                    clearable
                    :disabled="!chartSelectedMonth"
                    @change="updateTransportChart"
                    style="width: 120px;"
                >
                  <el-option
                      v-for="day in dayOptions"
                      :key="day"
                      :label="day + '日'"
                      :value="day"
                  />
                </el-select>
              </div>
            </div>

            <!-- 运输量统计图 -->
            <div class="chart-container">
              <div ref="transportVolumeChart" style="width: 100%; height: 600px;"></div>
            </div>
          </div>
        </el-tab-pane>

        <!-- 第三分页（预留） -->
        <el-tab-pane label="车队信息管理" name="manage">
          <div class="manage-container">
            <h3>车队信息管理功能开发中...</h3>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </el-drawer>
</template>

<script setup>
import { ref, onMounted, computed, watch, nextTick, onUnmounted } from 'vue'
import * as echarts from 'echarts'
import axios from 'axios'

// 抽屉可见性
const visible = ref(false)
const activeTab = ref('records')

// 数据加载状态
const dataLoading = ref(false)
const loadError = ref(false)
const errorMessage = ref('')

// 运输数据
const fleetData = ref([])
const searchQuery = ref('')

// 表格分页
const currentPage = ref(1)
const pageSize = ref(20)

// 日期筛选选项
const yearOptions = ref([2022, 2023, 2024])
const monthOptions = ref([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12])
const dayOptions = ref(Array.from({ length: 31 }, (_, i) => i + 1))

// 表格筛选选中值
const selectedYear = ref(null)
const selectedMonth = ref(null)
const selectedDay = ref(null)

// 图表筛选选中值
const chartSelectedYear = ref(null)
const chartSelectedMonth = ref(null)
const chartSelectedDay = ref(null)

// 图表引用
const transportVolumeChart = ref(null)
let chartInstance = null

// 添加数据加载状态管理
const dataLoadStatus = ref({
  fleet: false
})

// 添加数据验证计算属性
const isValidData = computed(() => {
  return fleetData.value.length > 0 && fleetData.value.every(item => {
    return typeof item === 'object' &&
        item !== null &&
        'dock_out_weight' in item &&
        'dock_out_company' in item
  })
})

// 添加 axios 配置
const axiosConfig = {
  timeout: 10000, // 10 秒超时
  headers: {
    'Content-Type': 'application/json'
  }
}

// 处理抽屉打开
const open = () => {
  visible.value = true
  loadData()
}

// 处理抽屉关闭
const closeDrawer = () => {
  visible.value = false
}

// 处理关闭前确认
const handleClose = (done) => {
  done()
}

// 修改数据加载函数
const loadData = async () => {
  if (dataLoadStatus.value.fleet) return

  dataLoading.value = true
  loadError.value = false
  errorMessage.value = ''

  try {
    const response = await axios.get('http://localhost:8080/trans')
    if (!response.data) {
      throw new Error('No data received')
    }

    // 格式化数据
    fleetData.value = Array.isArray(response.data) ? response.data.map(item => ({
      id: item.id,
      dock_out_year: parseInt(item.dock_out_year),
      dock_out_month: parseInt(item.dock_out_month),
      dock_out_day: parseInt(item.dock_out_day),
      dock_out_hour: parseInt(item.dock_out_hour),
      dock_out_time: item.dock_out_time,
      dock_out_fleet: item.dock_out_fleet,
      dock_out_company: item.dock_out_company,
      dock_out_name: item.dock_out_name,
      dock_out_type: item.dock_out_type,
      dock_out_weight: parseFloat(item.dock_out_weight || 0),
      dock_out_other: item.dock_out_other
    })) : []

    dataLoadStatus.value.fleet = true
    console.log('Fleet data loaded:', fleetData.value.length, 'records')

    // 如果当前是图表页面，初始化图表
    if (activeTab.value === 'charts') {
      nextTick(() => {
        initChart()
      })
    }
  } catch (error) {
    console.error('Failed to load fleet data:', error)
    errorMessage.value = error.response ?
        `Server error: ${error.response.status}` :
        `Request failed: ${error.message}`
    loadError.value = true
    fleetData.value = []
  } finally {
    dataLoading.value = false
  }
}

// 筛选数据
const filteredFleetData = computed(() => {
  console.log('Filtering data:', {
    total: fleetData.value.length,
    searchQuery: searchQuery.value,
    year: selectedYear.value,
    month: selectedMonth.value,
    day: selectedDay.value
  })

  let result = fleetData.value

  // 按关键词筛选
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(item =>
        (item.id && item.id.toString().includes(query)) ||
        (item.dock_out_fleet && item.dock_out_fleet.toLowerCase().includes(query)) ||
        (item.dock_out_company && item.dock_out_company.toLowerCase().includes(query)) ||
        (item.dock_out_name && item.dock_out_name.toLowerCase().includes(query)) ||
        (item.dock_out_type && item.dock_out_type.toLowerCase().includes(query)) ||
        (item.dock_out_other && item.dock_out_other.toLowerCase().includes(query))
    )
  }

  // 按日期筛选
  if (selectedYear.value) {
    result = result.filter(item => item.dock_out_year === selectedYear.value)

    if (selectedMonth.value) {
      result = result.filter(item => item.dock_out_month === selectedMonth.value)

      if (selectedDay.value) {
        result = result.filter(item => item.dock_out_day === selectedDay.value)
      }
    }
  }

  console.log('Filtered result:', result.length)
  return result
})

// 分页数据
const paginatedFleetData = computed(() => {
  const startIndex = (currentPage.value - 1) * pageSize.value
  return filteredFleetData.value.slice(startIndex, startIndex + pageSize.value)
})

// 处理页面大小变更
const handleSizeChange = (size) => {
  pageSize.value = size
  currentPage.value = 1
}

// 处理当前页变更
const handleCurrentChange = (page) => {
  currentPage.value = page
}

// 处理搜索
const handleSearch = () => {
  currentPage.value = 1
}

// 处理搜索清除
const handleSearchClear = () => {
  searchQuery.value = ''
  currentPage.value = 1
}

// 处理年份变化
const handleYearChange = () => {
  selectedMonth.value = null
  selectedDay.value = null
  currentPage.value = 1
}

// 处理月份变化
const handleMonthChange = () => {
  selectedDay.value = null
  currentPage.value = 1
}

// 处理日期筛选
const handleDateChange = () => {
  currentPage.value = 1
}

// 处理筛选按钮点击
const handleFilter = () => {
  currentPage.value = 1
}

// 重置筛选条件
const resetFilters = () => {
  selectedYear.value = null
  selectedMonth.value = null
  selectedDay.value = null
  searchQuery.value = ''
  currentPage.value = 1
}

// 图表相关处理函数
const handleChartYearChange = () => {
  chartSelectedMonth.value = null
  chartSelectedDay.value = null
  updateTransportChart()
}

const handleChartMonthChange = () => {
  chartSelectedDay.value = null
  updateTransportChart()
}

// 重置图表筛选
const resetChartFilters = () => {
  chartSelectedYear.value = null
  chartSelectedMonth.value = null
  chartSelectedDay.value = null
  updateTransportChart()
}

// 更新运输量图表
const updateTransportChart = () => {
  if (!chartInstance || !fleetData.value.length) {
    console.log('No chart instance or no data')
    return
  }

  console.log('Updating chart with data:', {
    year: chartSelectedYear.value,
    month: chartSelectedMonth.value,
    day: chartSelectedDay.value
  })

  let filteredData = fleetData.value
  let xAxisData = []
  let xAxisName = ''

  if (chartSelectedYear.value) {
    filteredData = filteredData.filter(item => item.dock_out_year === chartSelectedYear.value)

    if (chartSelectedMonth.value) {
      filteredData = filteredData.filter(item => item.dock_out_month === chartSelectedMonth.value)

      if (chartSelectedDay.value) {
        // 按小时统计
        filteredData = filteredData.filter(item => item.dock_out_day === chartSelectedDay.value)
        xAxisData = Array.from({length: 24}, (_, i) => i)
        xAxisName = '小时'

        const hourlyCompanyData = {}
        filteredData.forEach(item => {
          const company = item.dock_out_company || '未知公司'
          const hour = item.dock_out_hour || 0
          const weight = item.dock_out_weight || 0

          if (!hourlyCompanyData[company]) {
            hourlyCompanyData[company] = Array(24).fill(0)
          }
          hourlyCompanyData[company][hour] += weight
        })

        const series = Object.keys(hourlyCompanyData).map(company => ({
          name: company,
          emphasis: { focus: 'series' },
          data: hourlyCompanyData[company].map(val => parseFloat(val.toFixed(2)))
        }))

        setChartOption(
            xAxisData.map(hour => `${hour}时`),
            series,
            `${chartSelectedYear.value}年${chartSelectedMonth.value}月${chartSelectedDay.value}日各公司运输量统计`,
            xAxisName
        )
      } else {
        // 按日统计
        xAxisData = Array.from({length: 31}, (_, i) => i + 1)
        xAxisName = '日期'

        const dailyCompanyData = {}
        filteredData.forEach(item => {
          const company = item.dock_out_company || '未知公司'
          const day = item.dock_out_day || 1
          const weight = item.dock_out_weight || 0

          if (!dailyCompanyData[company]) {
            dailyCompanyData[company] = Array(31).fill(0)
          }
          dailyCompanyData[company][day - 1] += weight
        })

        const series = Object.keys(dailyCompanyData).map(company => ({
          name: company,
          type: 'line',
          smooth: true,
          emphasis: { focus: 'series' },
          areaStyle: {},
          data: dailyCompanyData[company].map(val => parseFloat(val.toFixed(2)))
        }))

        setChartOption(
            xAxisData.map(day => `${day}日`),
            series,
            `${chartSelectedYear.value}年${chartSelectedMonth.value}月各公司运输量统计`,
            xAxisName
        )
      }
    } else {
      // 按月统计
      xAxisData = Array.from({length: 12}, (_, i) => i + 1)
      xAxisName = '月份'

      const monthlyCompanyData = {}
      filteredData.forEach(item => {
        const company = item.dock_out_company || '未知公司'
        const month = item.dock_out_month || 1
        const weight = item.dock_out_weight || 0

        if (!monthlyCompanyData[company]) {
          monthlyCompanyData[company] = Array(12).fill(0)
        }
        monthlyCompanyData[company][month - 1] += weight
      })

      const series = Object.keys(monthlyCompanyData).map(company => ({
        name: company,
        type: 'bar',
        emphasis: { focus: 'series' },
        data: monthlyCompanyData[company].map(val => parseFloat(val.toFixed(2)))
      }))

      setChartOption(
          xAxisData.map(month => `${month}月`),
          series,
          `${chartSelectedYear.value}年各公司月度运输量统计`,
          xAxisName
      )
    }
  } else {
    chartInstance.setOption({
      title: {
        text: '请选择年份查看运输量统计',
        left: 'center',
        top: 'center',
        textStyle: {
          fontSize: 16,
          fontWeight: 'bold'
        }
      },
      xAxis: { show: false },
      yAxis: { show: false },
      series: []
    })
  }
}

// 设置图表选项
const setChartOption = (xAxisData, series, title, xAxisName) => {
  // 更鲜艳的颜色配置
  const colors = [
    '#FF6B6B', // 鲜红色
    '#4ECDC4', // 青绿色
    '#45B7D1', // 天蓝色
    '#96CEB4', // 薄荷绿
    '#FFD93D', // 明黄色
    '#FF8C42', // 橙色
    '#D741A7', // 玫红色
    '#6C5CE7', // 靛蓝色
    '#A8E6CF'  // 浅绿色
  ]

  chartInstance.setOption({
    color: colors,
    title: {
      text: title,
      left: 'center',
      top: 10,
      textStyle: {
        fontSize: 18,
        fontWeight: 'bold'
      }
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross'
      },
      formatter: function(params) {
        let result = params[0].axisValue + '<br/>'
        let total = 0

        params.forEach(param => {
          total += param.value
          result += `${param.marker} ${param.seriesName}: ${param.value.toFixed(2)}吨<br/>`
        })

        result += `<b>总计: ${total.toFixed(2)}吨</b>`
        return result
      }
    },
    legend: {
      type: 'scroll',
      orient: 'horizontal',
      top: 50,
      left: 'center'
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      top: 100,
      containLabel: true
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      name: xAxisName,
      data: xAxisData,
      axisLabel: {
        interval: 0,
        rotate: xAxisData.length > 12 ? 45 : 0
      }
    },
    yAxis: {
      type: 'value',
      name: '运输量(吨)',
      axisLabel: {
        formatter: '{value} 吨'
      }
    },
    series: series.map(item => ({
      ...item,
      type: 'line',
      smooth: true,
      lineStyle: {
        width: 3
      },
      areaStyle: {
        opacity: 0.3,  // 增加填充不透明度
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [{
            offset: 0,
            color: 'rgba(255, 255, 255, 0)'  // 渐变起始色
          }, {
            offset: 1,
            color: 'rgba(255, 255, 255, 0.3)'  // 渐变结束色
          }]
        }
      },
      emphasis: {
        focus: 'series',
        areaStyle: {
          opacity: 0.8  // 鼠标悬停时的不透明度
        }
      },
      symbol: 'circle',
      symbolSize: 8,
      showSymbol: false  // 默认不显示数据点，鼠标悬停时显示
    }))
  })
}

// 修改可见性监听器
watch(visible, (val) => {
  if (val) {
    // 当抽屉打开时加载数据
    loadData()
  } else {
    // 清理数据
    dataLoadStatus.value.fleet = false
    fleetData.value = []
    if (chartInstance) {
      chartInstance.dispose()
      chartInstance = null
    }
  }
})

// 修改标签页切换监听器
watch(activeTab, (newTab) => {
  if (newTab === 'charts') {
    nextTick(() => {
      // 确保数据已加载
      if (!dataLoadStatus.value.fleet) {
        loadData()
      } else if (fleetData.value.length > 0) {
        setTimeout(() => {
          initChart()
        }, 300)
      }
    })
  }
})

// 添加图表筛选条件监听
watch([chartSelectedYear, chartSelectedMonth, chartSelectedDay], () => {
  if (activeTab.value === 'charts' && chartInstance) {
    updateTransportChart()
  }
})

// 修改图表初始化函数
const initChart = () => {
  console.log('Initializing chart...')

  if (!transportVolumeChart.value) {
    console.error('Chart container not found')
    return
  }

  try {
    if (chartInstance) {
      chartInstance.dispose()
    }
    chartInstance = echarts.init(transportVolumeChart.value)
    console.log('Chart instance created')

    // 设置默认日期为最近的记录
    setMostRecentDate()

    // 更新图表
    updateTransportChart()

    // 添加窗口大小变化监听
    window.addEventListener('resize', handleResize)
  } catch (error) {
    console.error('Chart initialization failed:', error)
  }
}

// 添加设置最近日期函数
const setMostRecentDate = () => {
  if (fleetData.value && fleetData.value.length > 0) {
    const sortedData = [...fleetData.value].sort((a, b) => {
      const dateA = new Date(a.dock_out_year, a.dock_out_month - 1, a.dock_out_day)
      const dateB = new Date(b.dock_out_year, b.dock_out_month - 1, b.dock_out_day)
      return dateB - dateA
    })

    const mostRecent = sortedData[0]
    chartSelectedYear.value = mostRecent.dock_out_year
    chartSelectedMonth.value = mostRecent.dock_out_month
    chartSelectedDay.value = mostRecent.dock_out_day

    console.log('Set default date to:',
        `${chartSelectedYear.value}-${chartSelectedMonth.value}-${chartSelectedDay.value}`)
  }
}

// 添加窗口大小变化处理函数
const handleResize = () => {
  if (chartInstance && visible.value) {
    chartInstance.resize()
  }
}

// 组件挂载
onMounted(() => {
  window.addEventListener('resize', () => {
    if (chartInstance) {
      chartInstance.resize()
    }
  })
})

// 组件卸载
onUnmounted(() => {
  if (chartInstance) {
    chartInstance.dispose()
    chartInstance = null
  }
  window.removeEventListener('resize', handleResize)
})

// 对外暴露方法
defineExpose({
  open
})
</script>

<style scoped>
.fleet-drawer {
  --el-drawer-padding-primary: 0;
}

.drawer-content {
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  padding: 0 20px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid #e4e7ed;
  background-color: #f5f7fa;
  margin: 0 -20px;
}

.header h2 {
  margin: 0;
  font-size: 20px;
  color: #303133;
}

.filter-container {
  margin-bottom: 20px;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  padding: 15px 0;
}

.date-filters {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 10px;
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

.charts-container {
  padding: 20px 0;
  height: 100%;
}

.chart-container {
  border: 1px solid #ebeef5;
  border-radius: 4px;
  padding: 20px;
  margin-top: 20px;
  background-color: white;
  height: calc(100vh - 250px);
  min-height: 600px;
}

.chart-title {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 20px;
  text-align: center;
}

.manage-container {
  padding: 20px;
  text-align: center;
  color: #909399;
  font-size: 16px;
  height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
}

@media (max-width: 1200px) {
  .filter-container {
    flex-direction: column;
  }

  .filter-container > * {
    width: 100% !important;
    margin-right: 0 !important;
  }

  .date-filters {
    width: 100%;
  }
}
</style>

