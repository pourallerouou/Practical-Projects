<template>
  <el-drawer
      v-model="visible"
      title="渔场信息及捕捞数据中心"
      direction="ltr"
      size="90%"
      destroy-on-close
      class="fishery-center-drawer"
  >
    <div class="drawer-content">

      <el-tabs v-model="activeTab" type="card">
        <el-tab-pane label="渔场详细信息" name="info">
          <!---->
          <div class="search-filter">
            <el-input
                v-model="searchQuery"
                placeholder="输入任意字段进行模糊查询"
                clearable
                @clear="handleSearchClear"
                @input="handleSearch"
            >
              <template #append>
                <el-button @click="handleSearch">
                  <el-icon><search /></el-icon>
                </el-button>
              </template>
            </el-input>
          </div>

          <el-table
              :data="paginatedFisheryData"
              border
              style="width: 100%"
              height="300"
              v-loading="loading"
              @row-click="handleRowClick"
              highlight-current-row
          >
            <el-table-column prop="fsy_id" label="渔场编号" />
            <el-table-column prop="fsy_name" label="渔场名"/>
            <el-table-column prop="fsy_area" label="面积" />
            <el-table-column prop="fsy_deep" label="水深" />
            <el-table-column prop="fsy_bottom" label="底质" />
            <el-table-column prop="fsy_resource" label="鱼类资源" />
            <el-table-column prop="fsy_opeart" label="营业模式" />
            <el-table-column prop="fsy_output" label="产量" />
            <el-table-column prop="fsy_value" label="产值" />
            <el-table-column prop="fsy_admin" label="管理员" />
            <el-table-column prop="fsy_phone" label="电话" />
          </el-table>

          <el-pagination
              v-model:current-page="currentPage"
              v-model:page-size="pageSize"
              :total="filteredFisheryData.length"
              :page-sizes="[10, 20, 50, 100]"
              layout="total, sizes, prev, pager, next, jumper"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
          />

          <div class="fishery-detail" v-if="selectedFishery">
            <el-tabs v-model="detailTab" type="card" class="fishery-detail-tabs">
              <el-tab-pane
                  v-for="fishery in fisheryData"
                  :key="fishery.fsy_id"
                  :label="fishery.fsy_name"
                  :name="fishery.fsy_id"
              >
                <el-descriptions
                    :title="fishery.fsy_name + '详细信息'"
                    :column="2"
                    border
                >
                  <el-descriptions-item label="渔场编号">{{ fishery.fsy_id }}</el-descriptions-item>
                  <el-descriptions-item label="面积">{{ fishery.fsy_area }}</el-descriptions-item>
                  <el-descriptions-item label="水深">{{ fishery.fsy_deep }}</el-descriptions-item>
                  <el-descriptions-item label="底质">{{ fishery.fsy_bottom }}</el-descriptions-item>
                  <el-descriptions-item label="鱼类资源">{{ fishery.fsy_resource }}</el-descriptions-item>
                  <el-descriptions-item label="营业模式">{{ fishery.fsy_opeart }}</el-descriptions-item>
                  <el-descriptions-item label="产量">{{ fishery.fsy_output }}</el-descriptions-item>
                  <el-descriptions-item label="产值">{{ fishery.fsy_value }}</el-descriptions-item>
                  <el-descriptions-item label="管理员">{{ fishery.fsy_admin }}</el-descriptions-item>
                  <el-descriptions-item label="电话">{{ fishery.fsy_phone }}</el-descriptions-item>
                </el-descriptions>

                <div class="detail-content">
                  <div class="image-section">
                    <el-image
                        :src="fishery.imageUrl || defaultImage"
                        fit="cover"
                        :preview-src-list="[fishery.imageUrl || defaultImage]"
                    />
                  </div>
                  <div class="info-section">
                    <div class="description-text">
                      {{ fishery.description || '暂无详细描述' }}
                    </div>
                  </div>
                </div>
              </el-tab-pane>
            </el-tabs>
          </div>
        </el-tab-pane>

        <el-tab-pane label="捕捞量统计" name="stats">
          <el-tabs v-model="statsTab">
            <!-- 历史统计表格 -->
            <el-tab-pane label="历史统计" name="history">
              <!-- 历史数据搜索框 -->
              <div class="search-filter">
                <el-input
                    v-model="catchSearchQuery"
                    placeholder="输入关键字搜索历史数据"
                    clearable
                    style="width: 300px"
                    @clear="handleCatchSearchClear"
                >
                  <template #append>
                    <el-button>
                      <el-icon><search /></el-icon>
                    </el-button>
                  </template>
                </el-input>
              </div>

              <el-table
                  :data="paginatedCatchData"
                  border
                  style="width: 100%"
                  height="500"
              >
                <el-table-column prop="catch_fishery" label="渔场名称" width="100"></el-table-column>
                <el-table-column prop="catch_ship" label="渔船编号" width="100"></el-table-column>
                <el-table-column prop="catch_dock" label="停靠码头" width="170"></el-table-column>
                <el-table-column prop="catch_company" label="捕捞公司" width="170"></el-table-column>
                <el-table-column prop="catch_year" label="年" width="60"></el-table-column>
                <el-table-column prop="catch_month" label="月" width="50"></el-table-column>
                <el-table-column prop="catch_day" label="日" width="50"></el-table-column>
                <el-table-column prop="catch_week" label="周" width="50"></el-table-column>
                <el-table-column prop="catch_date" label="日期" width="130"></el-table-column>
                <el-table-column prop="catch_hour" label="时" width="50"></el-table-column>
                <el-table-column prop="catch_time" label="时间" width="130"></el-table-column>
                <el-table-column prop="catch_type" label="海产类别"></el-table-column>
                <el-table-column prop="catch_name" label="海产名称"></el-table-column>
                <el-table-column prop="catch_weight" label="重量/kg" width="130"></el-table-column>
                <el-table-column prop="catch_other" label="备注"></el-table-column>
              </el-table>

              <el-pagination
                  v-model:current-page="catchCurrentPage"
                  v-model:page-size="catchPageSize"
                  :total="filteredCatchData.length"
                  :page-sizes="[10, 20, 50, 100]"
                  layout="total, sizes, prev, pager, next, jumper"
                  @size-change="handleCatchSizeChange"
                  @current-change="handleCatchCurrentChange"
                  class="pagination"
              />
            </el-tab-pane>

            <!-- 预测数据表格 -->
            <el-tab-pane label="预测数据" name="predict">
              <!-- 预测数据搜索框 -->
              <div class="search-filter">
                <el-input
                    v-model="predictSearchQuery"
                    placeholder="输入关键字搜索预测数据"
                    clearable
                    style="width: 300px"
                    @clear="handlePredictSearchClear"
                >
                  <template #append>
                    <el-button>
                      <el-icon><search /></el-icon>
                    </el-button>
                  </template>
                </el-input>
              </div>

              <el-table
                  :data="paginatedPredictData"
                  border
                  style="width: 100%"
                  height="500"
              >
                <el-table-column prop="catch_Date" label="预测日期" />
                <el-table-column prop="catch_Time" label="预测时间" />
                <el-table-column prop="catch_Type" label="捕捞类型" />
                <el-table-column prop="catch_Weight" label="预测重量(kg)" />
                <el-table-column prop="catch_Ship" label="捕捞船只" />
                <el-table-column prop="catch_Dock" label="靠泊码头" width="200" />
                <el-table-column prop="catch_Fishery" label="所属渔场" />
                <el-table-column prop="catch_Name" label="海产品名称" />
                <el-table-column prop="catch_Other" label="备注" min-width="200" />
              </el-table>

              <el-pagination
                  v-model:current-page="predictCurrentPage"
                  v-model:page-size="predictPageSize"
                  :total="filteredPredictData.length"
                  :page-sizes="[10, 20, 50, 100]"
                  layout="total, sizes, prev, pager, next, jumper"
                  @size-change="handlePredictSizeChange"
                  @current-change="handlePredictCurrentChange"
                  class="pagination"
              />
            </el-tab-pane>
          </el-tabs>
        </el-tab-pane>

        <el-tab-pane label="图表展示" name="charts">
          <div class="chart-container" v-loading="loading">
            <!-- 时间范围选择 -->
            <div class="time-selector">
              <el-select v-model="selectedYear" placeholder="选择年份" @change="handleTimeChange" clearable>
                <el-option
                    v-for="year in yearOptions"
                    :key="year.value"
                    :label="year.label"
                    :value="year.value"
                />
              </el-select>
              <el-select v-model="selectedMonth" placeholder="选择月份" @change="handleTimeChange" clearable>
                <el-option
                    v-for="month in monthOptions"
                    :key="month.value"
                    :label="month.label"
                    :value="month.value"
                />
              </el-select>
              <el-select v-model="selectedDay" placeholder="选择日期" @change="handleTimeChange" clearable>
                <el-option
                    v-for="day in dayOptions"
                    :key="day.value"
                    :label="day.label"
                    :value="day.value"
                />
              </el-select>
            </div>

            <!-- 图表容器 -->
            <div class="charts-wrapper">
              <div class="chart-row top-chart">
                <div ref="chartRef" style="width: 140vh; height: 500px;"></div>
              </div>
              <div class="chart-row bottom-charts">
                <div ref="pieChartRef" style="width: 70vh; height: 400px;"></div>
                <div class="right-chart">
                  <div class="fishery-selector">
                    <el-select v-model="selectedFisheryForType" placeholder="选择渔场" clearable @change="handleFisheryChange">
                      <el-option
                          v-for="fishery in fisheryOptions"
                          :key="fishery.value"
                          :label="fishery.label"
                          :value="fishery.value"
                      />
                    </el-select>
                  </div>
                  <div ref="typePieChartRef" style="width: 70vh; height: 400px;"></div>
                </div>
              </div>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="捕捞量预测" name="prediction">
          <div>这里是捕鱼量预测图表</div>
        </el-tab-pane>
      </el-tabs>

    </div>
  </el-drawer>
</template>

<script setup>
import { ref, computed, onMounted, watch, nextTick, onUnmounted } from 'vue'
import { Search } from '@element-plus/icons-vue'
import * as echarts from 'echarts'
import axios from "axios";
import { ElMessage } from 'element-plus'

const props = defineProps({
  modelValue: Boolean
})

const emit = defineEmits(['update:modelValue'])

// 控制抽屉显示
const visible = ref(false)

// 监听 props 变化
watch(() => props.modelValue, (newVal) => {
  visible.value = newVal
})

// 监听 visible 变化
watch(visible, (newVal) => {
  // 保持双向绑定
  emit('update:modelValue', newVal)

  if (newVal) {
    // 抽屉打开时
    nextTick(async () => {
      try {
        loading.value = true

        // 1. 初始化所有图表实例
        if (chartRef.value) {
          chartInstance = echarts.init(chartRef.value)
        }
        if (pieChartRef.value) {
          pieChartInstance = echarts.init(pieChartRef.value)
        }
        if (typePieChartRef.value) {
          typePieChartInstance = echarts.init(typePieChartRef.value)
        }

        // 2. 检查并获取数据
        const currentTime = Date.now()
        if (!catchDataCache.value || !lastFetchTime.value ||
            (currentTime - lastFetchTime.value >= CACHE_DURATION)) {
          // 如果没有缓存或缓存过期，重新获取数据
          await fetchAndUpdateCharts()
        } else {
          // 使用缓存数据更新图表
          updateChart(catchDataCache.value)
          updatePieChart(catchDataCache.value)
          updateTypePieChart(catchDataCache.value)
        }
      } catch (error) {
        console.error('初始化图表失败:', error)
        ElMessage.error('初始化图表失败')
      } finally {
        loading.value = false
      }
    })
  } else {
    // 关闭抽屉时销毁图表实例
    if (chartInstance) {
      chartInstance.dispose()
      chartInstance = null
    }
    if (pieChartInstance) {
      pieChartInstance.dispose()
      pieChartInstance = null
    }
    if (typePieChartInstance) {
      typePieChartInstance.dispose()
      typePieChartInstance = null
    }
  }
})

// 数据相关
const activeTab = ref('info')
const statsTab = ref('history')
const currentPage = ref(1)
const pageSize = ref(20)
const searchQuery = ref('')
const loading = ref(false)
const loadingPredict = ref(false)

// 渔场信息数据
const fisheryData = ref([])
const selectedFishery = ref(null)
const detailTab = ref('')

// 新增的响应式数据
const filterForm = ref({
  dateRange: [],
  catchType: '',
  catchFishery: '',
  catchDock: '',
  searchQuery: ''
})

const catchData = ref([])
const predictData = ref([])
const catchCurrentPage = ref(1)
const catchPageSize = ref(20)
const predictCurrentPage = ref(1)
const predictPageSize = ref(20)

// 下拉选项数据
const catchTypes = ref([])
const fisheries = ref([])
const docks = ref([])

// 图表相关的响应式数据
const chartRef = ref(null)
const pieChartRef = ref(null)
let chartInstance = null
let pieChartInstance = null

// 时间选择相关
const selectedYear = ref('2024')
const selectedMonth = ref('12')
const selectedDay = ref('')

// 保留年月日选项
const yearOptions = ref(Array.from({ length: 10 }, (_, i) => ({
  value: (new Date().getFullYear() - i).toString(),
  label: `${new Date().getFullYear() - i}年`
})))

const monthOptions = ref(Array.from({ length: 12 }, (_, i) => ({
  value: (i + 1).toString(),
  label: `${i + 1}月`
})))

const dayOptions = ref(Array.from({ length: 31 }, (_, i) => ({
  value: (i + 1).toString(),
  label: `${i + 1}日`
})))

// 添加数据缓存
const fisheryDataCache = ref(null)
const catchDataCache = ref(null)
const predictDataCache = ref(null)
const lastFetchTime = ref(null)
const CACHE_DURATION = 5 * 60 * 1000 // 缓存5分钟

// 添加搜索相关的响应式数据
const catchSearchQuery = ref('')
const predictSearchQuery = ref('')

// 修改过滤逻辑
const filteredFisheryData = computed(() => {
  if (!searchQuery.value) return fisheryData.value

  const query = searchQuery.value.toLowerCase().trim()
  return fisheryData.value.filter(item => {
    return Object.values(item).some(value =>
        String(value).toLowerCase().includes(query)
    )
  })
})

// 添加分页数据计算
const paginatedFisheryData = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredFisheryData.value.slice(start, end)
})

// 修改搜索处理函数
const handleSearch = () => {
  currentPage.value = 1
  predictCurrentPage.value = 1
}

const handleSearchClear = () => {
  searchQuery.value = ''
  currentPage.value = 1
  predictCurrentPage.value = 1
}

// 分页处理函数
const handleSizeChange = (val) => {
  pageSize.value = val
  currentPage.value = 1
}

const handleCurrentChange = (val) => {
  currentPage.value = val
}

// 修改行点击处理函数
const handleRowClick = (row) => {
  selectedFishery.value = row
  detailTab.value = row.fsy_id // 设置当前选中的标签页
  // 获取详细信息
  getFisheryDetail(row.fsy_id)
}

// 新增获取渔场详情的函数
const getFisheryDetail = async (fisheryId) => {
  try {
    loading.value = true
    const response = await axios.get(`http://localhost:8080/fishery/detail/${fisheryId}`)
    if (response.data) {
      // 更新对应渔场的详细信息
      const index = fisheryData.value.findIndex(item => item.fsy_id === fisheryId)
      if (index !== -1) {
        fisheryData.value[index] = {
          ...fisheryData.value[index],
          imageUrl: response.data.imageUrl,
          description: response.data.description
        }
      }
    }
  } catch (error) {
    console.error('获取渔场详情失败:', error)
    ElMessage.error('获取渔场详情失败')
  } finally {
    loading.value = false
  }
}

// 修改获取渔场数据的函数
const fetchFisheryData = async () => {
  try {
    loading.value = true
    const currentTime = Date.now()

    // 检查缓存是否有效
    if (fisheryDataCache.value && lastFetchTime.value &&
        (currentTime - lastFetchTime.value < CACHE_DURATION)) {
      fisheryData.value = fisheryDataCache.value
      return
    }

    const response = await axios.get("http://localhost:8080/select")
    fisheryData.value = response.data
    fisheryDataCache.value = response.data
    lastFetchTime.value = currentTime
  } catch (error) {
    console.error('获取渔场基础数据失败:', error)
    ElMessage.error('获取渔场基础数据失败')
  } finally {
    loading.value = false
  }
}

// 获取数据函数
const fetchData = async () => {
  try {
    loading.value = true
    const currentTime = Date.now()

    // 检查缓存是否有效
    if (catchDataCache.value && lastFetchTime.value &&
        (currentTime - lastFetchTime.value < CACHE_DURATION)) {
      catchData.value = catchDataCache.value
      return
    }

    const response = await axios.get('http://localhost:8080/catch')
    catchData.value = response.data || []
    catchDataCache.value = response.data || []
    lastFetchTime.value = currentTime
  } catch (error) {
    console.error('获取捕捞数据失败:', error)
    ElMessage.error('获取捕捞数据失败')
    catchData.value = []
  } finally {
    loading.value = false
  }
}

// 获取预测数据函数
const fetchPredictData = async () => {
  try {
    loadingPredict.value = true
    const currentTime = Date.now()

    // 检查缓存是否有效
    if (predictDataCache.value && lastFetchTime.value &&
        (currentTime - lastFetchTime.value < CACHE_DURATION)) {
      predictData.value = predictDataCache.value
      return
    }

    const response = await axios.get('http://localhost:8080/catchpre')
    predictData.value = response.data || []
    predictDataCache.value = response.data || []
    lastFetchTime.value = currentTime
  } catch (error) {
    console.error('获取预测数据失败:', error)
    ElMessage.error('获取预测数据失败')
    predictData.value = []
  } finally {
    loadingPredict.value = false
  }
}

// 修改生命周期钩子
onMounted(async () => {
  try {
    loading.value = true
    // 并行获取数据
    await Promise.all([
      fetchFisheryData(),
      fetchData(),
      fetchPredictData()
    ])
  } catch (error) {
    console.error('初始化数据失败:', error)
    ElMessage.error('初始化数据失败')
  } finally {
    loading.value = false
  }
})

// 修改时间变化处理函数
const handleTimeChange = () => {
  // 重置其他选择器
  if (!selectedYear.value) {
    selectedMonth.value = ''
    selectedDay.value = ''
  }
  if (!selectedMonth.value) {
    selectedDay.value = ''
  }

  // 更新日选项
  if (selectedYear.value && selectedMonth.value) {
    const daysInMonth = new Date(parseInt(selectedYear.value), parseInt(selectedMonth.value), 0).getDate()
    dayOptions.value = Array.from({ length: daysInMonth }, (_, i) => ({
      value: (i + 1).toString(),
      label: `${i + 1}日`
    }))
  } else {
    dayOptions.value = Array.from({ length: 31 }, (_, i) => ({
      value: (i + 1).toString(),
      label: `${i + 1}日`
    }))
  }

  // 如果选择的日期超出当月天数，重置日期选择
  if (selectedDay.value && selectedYear.value && selectedMonth.value) {
    const daysInMonth = new Date(parseInt(selectedYear.value), parseInt(selectedMonth.value), 0).getDate()
    if (parseInt(selectedDay.value) > daysInMonth) {
      selectedDay.value = ''
    }
  }

  // 立即更新图表
  nextTick(() => {
    if (catchDataCache.value) {
      updateChart(catchDataCache.value)
      updatePieChart(catchDataCache.value)
      updateTypePieChart(catchDataCache.value)
    } else {
      fetchAndUpdateCharts()
    }
  })
}

// 修改图表数据处理方法
const processChartData = (data) => {
  if (!Array.isArray(data) || data.length === 0) {
    return { labels: [], seriesData: [] }
  }

  // 获取所有渔场
  const fisheries = [...new Set(data.map(item => item.catch_fishery))]

  // 根据选择的时间范围处理数据
  let labels = []
  let seriesData = []

  if (selectedYear.value && !selectedMonth.value && !selectedDay.value) {
    // 只选择了年份，按月份统计
    labels = Array.from({ length: 12 }, (_, i) => `${i + 1}月`)
    seriesData = fisheries.map(fishery => {
      const monthlyData = new Array(12).fill(0)
      data.filter(item => item.catch_fishery === fishery).forEach(item => {
        if (item.catch_year.toString() === selectedYear.value) {
          monthlyData[parseInt(item.catch_month) - 1] += parseFloat(item.catch_weight || 0)
        }
      })
      return {
        name: fishery,
        type: 'bar',
        stack: 'total',
        data: monthlyData.map(val => (val / 1000).toFixed(2)) // 转换为吨
      }
    })
  } else if (selectedYear.value && selectedMonth.value && !selectedDay.value) {
    // 选择了年份和月份，按天统计
    const daysInMonth = new Date(parseInt(selectedYear.value), parseInt(selectedMonth.value), 0).getDate()
    labels = Array.from({ length: daysInMonth }, (_, i) => `${i + 1}日`)
    seriesData = fisheries.map(fishery => {
      const dailyData = new Array(daysInMonth).fill(0)
      data.filter(item => item.catch_fishery === fishery).forEach(item => {
        if (item.catch_year.toString() === selectedYear.value &&
            item.catch_month.toString() === selectedMonth.value) {
          dailyData[parseInt(item.catch_day) - 1] += parseFloat(item.catch_weight || 0)
        }
      })
      return {
        name: fishery,
        type: 'bar',
        stack: 'total',
        data: dailyData.map(val => (val / 1000).toFixed(2)) // 转换为吨
      }
    })
  } else if (selectedYear.value && selectedMonth.value && selectedDay.value) {
    // 选择了完整时间范围，按小时统计
    labels = Array.from({ length: 24 }, (_, i) => `${i}:00`)
    seriesData = fisheries.map(fishery => {
      const hourlyData = new Array(24).fill(0)
      data.filter(item => item.catch_fishery === fishery).forEach(item => {
        if (item.catch_year.toString() === selectedYear.value &&
            item.catch_month.toString() === selectedMonth.value &&
            item.catch_day.toString() === selectedDay.value) {
          const hour = parseInt(item.catch_hour || 0)
          hourlyData[hour] += parseFloat(item.catch_weight || 0)
        }
      })
      return {
        name: fishery,
        type: 'bar',
        stack: 'total',
        data: hourlyData.map(val => val.toFixed(2)) // 保持kg单位
      }
    })
  }

  return { labels, seriesData }
}

// 获取数据并更新图表
const fetchAndUpdateCharts = async () => {
  try {
    loading.value = true
    const currentTime = Date.now()

    // 检查缓存是否有效
    if (catchDataCache.value && lastFetchTime.value &&
        (currentTime - lastFetchTime.value < CACHE_DURATION)) {
      updateChart(catchDataCache.value)
      updatePieChart(catchDataCache.value)
      updateTypePieChart(catchDataCache.value)
      return
    }

    const response = await axios.get('http://localhost:8080/catch')
    catchDataCache.value = response.data
    lastFetchTime.value = currentTime

    // 确保在更新图表之前已经有数据
    if (response.data) {
      updateChart(response.data)
      updatePieChart(response.data)
      updateTypePieChart(response.data)
    }
  } catch (error) {
    console.error('获取数据失败:', error)
    ElMessage.error('获取数据失败')
  } finally {
    loading.value = false
  }
}

// 更新图表
const updateChart = (data) => {
  if (!chartRef.value) return

  if (!chartInstance) {
    chartInstance = echarts.init(chartRef.value)
  }

  if (!selectedYear.value) {
    return
  }

  try {
    const { labels, seriesData } = processChartData(data)

    const option = {
      title: {
        text: '各渔场捕捞量统计',
        left: 'center'
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        },
        formatter: (params) => {
          let result = params[0].name + '<br/>'
          let total = 0
          params.forEach(param => {
            result += `${param.seriesName}: ${param.value}${selectedDay.value ? 'kg' : '吨'}<br/>`
            total += parseFloat(param.value)
          })
          result += `<br/>总计: ${total.toFixed(2)}${selectedDay.value ? 'kg' : '吨'}`
          return result
        }
      },
      legend: {
        data: seriesData.map(item => item.name),
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
        data: labels,
        axisLabel: {
          interval: 0,
          rotate: selectedMonth.value ? 30 : 0
        }
      },
      yAxis: {
        type: 'value',
        name: selectedDay.value ? '捕捞量(kg)' : '捕捞量(吨)'
      },
      series: seriesData
    }

    chartInstance.setOption(option)
  } catch (error) {
    console.error('处理数据失败:', error)
    ElMessage.error('处理数据失败')
  }
}

// 更新饼图
const updatePieChart = (data) => {
  if (!pieChartRef.value) return

  if (!pieChartInstance) {
    pieChartInstance = echarts.init(pieChartRef.value)
  }

  if (!selectedYear.value) {
    return
  }

  try {
    const { seriesData } = processPieChartData(data)

    const option = {
      title: {
        text: '各渔场捕捞量占比',
        left: 'center'
      },
      tooltip: {
        trigger: 'item',
        formatter: (params) => {
          return `${params.name}: ${params.value}${selectedDay.value ? 'kg' : '吨'} (${params.percent}%)`
        }
      },
      legend: {
        orient: 'vertical',
        left: 'left',
        top: 'middle'
      },
      series: [
        {
          name: '捕捞量占比',
          type: 'pie',
          radius: '50%',
          data: seriesData,
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
      ]
    }

    pieChartInstance.setOption(option)
  } catch (error) {
    console.error('处理数据失败:', error)
    ElMessage.error('处理数据失败')
  }
}

// 监听窗口大小变化
window.addEventListener('resize', () => {
  if (chartInstance && visible.value) {
    chartInstance.resize()
  }
  if (pieChartInstance && visible.value) {
    pieChartInstance.resize()
  }
  if (typePieChartInstance && visible.value) {
    typePieChartInstance.resize()
  }
})

// 组件卸载时清理
onUnmounted(() => {
  if (chartInstance) {
    chartInstance.dispose()
    chartInstance = null
  }
  if (pieChartInstance) {
    pieChartInstance.dispose()
    pieChartInstance = null
  }
  if (typePieChartInstance) {
    typePieChartInstance.dispose()
    typePieChartInstance = null
  }
  window.removeEventListener('resize', handleResize)
})

// 添加resize事件处理函数
const handleResize = () => {
  if (chartInstance && visible.value) {
    chartInstance.resize()
  }
  if (pieChartInstance && visible.value) {
    pieChartInstance.resize()
  }
  if (typePieChartInstance && visible.value) {
    typePieChartInstance.resize()
  }
}

// 修改窗口大小变化的监听
window.addEventListener('resize', handleResize)

// 添加过滤后的数据计算属性
const filteredCatchData = computed(() => {
  if (!catchData.value) return []
  if (!catchSearchQuery.value) return catchData.value

  const query = catchSearchQuery.value.toLowerCase().trim()
  return catchData.value.filter(item => {
    return Object.values(item).some(val =>
        val && String(val).toLowerCase().includes(query)
    )
  })
})

const filteredPredictData = computed(() => {
  if (!predictData.value) return []
  if (!predictSearchQuery.value) return predictData.value

  const query = predictSearchQuery.value.toLowerCase().trim()
  return predictData.value.filter(item => {
    return Object.values(item).some(val =>
        val && String(val).toLowerCase().includes(query)
    )
  })
})

// 分页后的捕捞数据
const paginatedCatchData = computed(() => {
  const startIndex = (catchCurrentPage.value - 1) * catchPageSize.value
  return filteredCatchData.value.slice(startIndex, startIndex + catchPageSize.value)
})

// 分页后的预测数据
const paginatedPredictData = computed(() => {
  const startIndex = (predictCurrentPage.value - 1) * predictPageSize.value
  return filteredPredictData.value.slice(startIndex, startIndex + predictPageSize.value)
})

// 搜索处理函数
const handleCatchSearchClear = () => {
  catchSearchQuery.value = ''
  catchCurrentPage.value = 1
}

const handlePredictSearchClear = () => {
  predictSearchQuery.value = ''
  predictCurrentPage.value = 1
}

// 分页处理函数
const handleCatchSizeChange = (val) => {
  catchPageSize.value = val
  catchCurrentPage.value = 1
}

const handleCatchCurrentChange = (val) => {
  catchCurrentPage.value = val
}

const handlePredictSizeChange = (val) => {
  predictPageSize.value = val
  predictCurrentPage.value = 1
}

const handlePredictCurrentChange = (val) => {
  predictCurrentPage.value = val
}

// 处理饼图数据的方法
const processPieChartData = (data) => {
  if (!Array.isArray(data) || data.length === 0) {
    return { seriesData: [] }
  }

  // 获取所有渔场
  const fisheries = [...new Set(data.map(item => item.catch_fishery))]

  // 根据选择的时间范围处理数据
  let seriesData = []

  // 根据选择的时间范围处理数据
  if (selectedYear.value && !selectedMonth.value && !selectedDay.value) {
    // 只选择了年份，统计该年总捕捞量
    seriesData = fisheries.map(fishery => {
      const totalWeight = data
          .filter(item =>
              item.catch_fishery === fishery &&
              item.catch_year.toString() === selectedYear.value
          )
          .reduce((sum, item) => sum + parseFloat(item.catch_weight || 0), 0)
      return {
        name: fishery,
        value: (totalWeight / 1000).toFixed(2) // 转换为吨
      }
    })
  } else if (selectedYear.value && selectedMonth.value && !selectedDay.value) {
    // 选择了年份和月份，统计该月总捕捞量
    seriesData = fisheries.map(fishery => {
      const totalWeight = data
          .filter(item =>
              item.catch_fishery === fishery &&
              item.catch_year.toString() === selectedYear.value &&
              item.catch_month.toString() === selectedMonth.value
          )
          .reduce((sum, item) => sum + parseFloat(item.catch_weight || 0), 0)
      return {
        name: fishery,
        value: (totalWeight / 1000).toFixed(2) // 转换为吨
      }
    })
  } else if (selectedYear.value && selectedDay.value) {
    // 选择了完整时间范围，统计该天总捕捞量
    seriesData = fisheries.map(fishery => {
      const totalWeight = data
          .filter(item =>
              item.catch_fishery === fishery &&
              item.catch_year.toString() === selectedYear.value &&
              item.catch_month.toString() === selectedMonth.value &&
              item.catch_day.toString() === selectedDay.value
          )
          .reduce((sum, item) => sum + parseFloat(item.catch_weight || 0), 0)
      return {
        name: fishery,
        value: totalWeight.toFixed(2) // 保持kg单位
      }
    })
  }

  return { seriesData }
}

// 渔场选择相关
const selectedFisheryForType = ref('')
const typePieChartRef = ref(null)
let typePieChartInstance = null

// 渔场选项
const fisheryOptions = ref([
  { value: '普陀渔场', label: '普陀渔场' },
  { value: '定海渔场', label: '定海渔场' },
  { value: '岱山渔场', label: '岱山渔场' },
  { value: '沈家门渔场', label: '沈家门渔场' },
  { value: '朱家尖渔场', label: '朱家尖渔场' },
  { value: '南洞渔场', label: '南洞渔场' },
  { value: '高亭渔场', label: '高亭渔场' }
])

// 海产品类别常量
const CATCH_TYPES = ['鱼类', '甲壳类', '棘皮类', '软体类', '藻类']

// 处理渔场选择变化
const handleFisheryChange = () => {
  if (!selectedFisheryForType.value) {
    // 当清空选择时，重置为所有渔场的数据
    if (catchDataCache.value) {
      updateTypePieChart(catchDataCache.value)
    }
  } else {
    // 当选择具体渔场时，更新图表
    if (catchDataCache.value) {
      updateTypePieChart(catchDataCache.value)
    }
  }
}

// 处理海产品类型饼图数据
const processTypePieChartData = (data) => {
  if (!Array.isArray(data) || data.length === 0) {
    return { seriesData: [] }
  }

  // 根据选择的渔场筛选数据
  let filteredData = data
  if (selectedFisheryForType.value) {
    filteredData = data.filter(item => item.catch_fishery === selectedFisheryForType.value)
  }

  // 根据选择的时间范围筛选数据
  let timeFilteredData = filteredData
  if (selectedYear.value) {
    timeFilteredData = timeFilteredData.filter(item =>
        item.catch_year.toString() === selectedYear.value
    )

    if (selectedMonth.value) {
      timeFilteredData = timeFilteredData.filter(item =>
          item.catch_month.toString() === selectedMonth.value
      )

      if (selectedDay.value) {
        timeFilteredData = timeFilteredData.filter(item =>
            item.catch_day.toString() === selectedDay.value
        )
      }
    }
  }

  // 统计各类海产品的捕捞量
  const typeData = CATCH_TYPES.map(type => {
    const totalWeight = timeFilteredData
        .filter(item => item.catch_type === type)
        .reduce((sum, item) => sum + parseFloat(item.catch_weight || 0), 0)
    return {
      name: type,
      value: (totalWeight / 1000).toFixed(2) // 转换为吨
    }
  })

  return { seriesData: typeData }
}

// 更新海产品类型饼图
const updateTypePieChart = (data) => {
  if (!typePieChartRef.value) return

  if (!typePieChartInstance) {
    typePieChartInstance = echarts.init(typePieChartRef.value)
  }

  try {
    const { seriesData } = processTypePieChartData(data)

    const option = {
      title: {
        text: '海产品类型捕捞量占比',
        left: 'center',
        top: 30
      },
      tooltip: {
        trigger: 'item',
        formatter: (params) => {
          return `${params.name}: ${params.value}吨 (${params.percent}%)`
        }
      },
      legend: {
        orient: 'vertical',
        left: 'left',
        top: 'middle'
      },
      series: [
        {
          name: '捕捞量占比',
          type: 'pie',
          radius: '50%',
          data: seriesData,
          itemStyle: {
            color: function(params) {
              const colors = [
                '#FF6B6B', // 鲜艳的红色
                '#4ECDC4', // 青绿色
                '#FFD93D', // 明亮的黄色
                '#FF8C42', // 橙色
                '#6C5CE7'  // 紫色
              ];
              return colors[params.dataIndex];
            }
          },
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            },
            scale: true,
            scaleSize: 10
          }
        }
      ]
    }

    typePieChartInstance.setOption(option)
  } catch (error) {
    console.error('处理数据失败:', error)
    ElMessage.error('处理数据失败')
  }
}
</script>

<style scoped>
.fishery-center-drawer {
  position: relative;
}

.drawer-content {
  margin: 10px;
  height: 100%;
  overflow-y: auto;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.search-filter {
  margin-bottom: 20px;
  padding: 10px;
}

.time-selector {
  margin: 10px 0;
  padding: 5px;
  display: flex;
  justify-content: center;
  gap: 20px;
}

.time-selector :deep(.el-select) {
  width: 150px;
}

.time-selector :deep(.el-select .el-input__wrapper) {
  padding-right: 30px;
}

.time-selector :deep(.el-select .el-input__suffix) {
  right: 5px;
}

.chart-container {
  padding: 20px;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.chart-container > div:last-child {
  flex: 1;
  min-height: 500px;
}

.el-pagination {
  margin-top: 20px;
  padding: 10px 0;
  text-align: center;
}

.fishery-detail {
  margin-top: 20px;
  padding: 20px;
  border: 1px solid #ebeef5;
  border-radius: 4px;
}

.detail-content {
  margin-top: 20px;
  display: flex;
  gap: 20px;
}

.image-section {
  flex: 0 0 300px;
  height: 200px;
  overflow: hidden;
  border-radius: 4px;
}

.image-section .el-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.info-section {
  flex: 1;
}

.charts-container {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}

.chart-item {
  flex: 1;
  min-width: 45%;
  height: 400px;
}

.description-text {
  line-height: 1.8;
  color: #606266;
}

.fishery-detail-tabs {
  margin-top: 20px;
}

.fishery-detail-tabs :deep(.el-tabs__content) {
  padding: 20px;
  border: 1px solid #e4e7ed;
  border-top: none;
  border-radius: 0 0 4px 4px;
}

.fishery-detail-tabs :deep(.el-tabs__nav) {
  border-radius: 4px 4px 0 0;
}

.filter-section {
  margin-bottom: 20px;
  padding: 15px;
  background-color: #f5f7fa;
  border-radius: 4px;
}

.filter-form {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.filter-form .el-form-item {
  margin-bottom: 10px;
  margin-right: 10px;
}

.pagination {
  margin-top: 20px;
  padding: 10px 0;
  text-align: right;
}

/* 确保表格在容器内可以滚动 */
.el-table {
  margin-bottom: 20px;
}

/* 优化日期选择器的样式 */
:deep(.el-date-editor.el-input) {
  width: 260px;
}

:deep(.el-date-editor--daterange) {
  width: 360px;
}

.charts-wrapper {
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
}

.chart-row {
  display: flex;
  width: 100%;
}

.top-chart {
  justify-content: center;
  margin-bottom: 20px;
}

.bottom-charts {
  display: flex;
  justify-content: space-between;
  gap: 20px;
  align-items: flex-start;
}

.right-chart {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.fishery-selector {
  margin-bottom: 10px;
  width: 200px;
}

.fishery-selector :deep(.el-select) {
  width: 100%;
}

.fishery-selector :deep(.el-select .el-input__wrapper) {
  background-color: #fff;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.fishery-selector :deep(.el-select .el-input__wrapper:hover) {
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.2);
}

.fishery-selector :deep(.el-select .el-input__wrapper.is-focus) {
  box-shadow: 0 0 0 1px #409eff;
}

.fishery-selector :deep(.el-select-dropdown) {
  background-color: #fff;
  border: 1px solid #e4e7ed;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.fishery-selector :deep(.el-select-dropdown__item) {
  padding: 0 20px;
  height: 34px;
  line-height: 34px;
}

.fishery-selector :deep(.el-select-dropdown__item.selected) {
  color: #409eff;
  font-weight: bold;
}

.fishery-selector :deep(.el-select-dropdown__item:hover) {
  background-color: #f5f7fa;
}

/* 添加抽屉标题样式 */
:deep(.el-drawer__header) {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 0;
  padding: 20px;
}

/* 添加图表标题样式 */
:deep(.echarts-title) {
  font-size: 18px;
  font-weight: bold;
  text-align: center;
  margin-bottom: 20px;
}
</style>