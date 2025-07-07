<template>
  <div class="page-container">
    <!-- 内容区域 -->
    <div class="content-area">
      <!-- 标题 -->
      <div class="title-container">
        <h2 class="page-title">{{ currentTab.title }}</h2>
      </div>

      <!-- 子分页 -->
      <div class="sub-tabs-container">
        <el-tabs v-model="activeSubTab" type="card">
          <el-tab-pane
              v-for="subTab in currentTab.subTabs"
              :key="subTab.name"
              :label="subTab.label"
              :name="subTab.name"
          >
            <!-- 数据源选择 -->
            <div class="data-source-container">
              <el-select
                  v-model="dataSource[subTab.name]"
                  placeholder="数据源"
                  clearable
                  class="data-source-select"
              >
                <el-option label="硬件采集" value="hardware" />
                <el-option label="手动导入" value="manual" />
                <el-option label="第三方数据源" value="third-party" />
              </el-select>
            </div>

            <!-- 子分页内容区域 -->
            <div class="sub-tab-content">
              <!-- 水质数据表格 -->
              <div v-if="subTab.name === 'fishery-1'" class="water-quality-table">
                <el-table
                    :data="waterQualityData"
                    style="width: 100%"
                    height="calc(150vh)"
                    border
                    v-loading="loading"
                    element-loading-text="加载中..."
                    :row-key="row => row.id"
                    :default-sort="{ prop: 'id', order: 'descending' }"
                    :max-height="500"
                    :virtual-scroll="virtualScroll"
                    :row-height="rowHeight"
                    :visible-rows="visibleRows"
                >
                  <el-table-column prop="id" label="ID" width="80" />
                  <el-table-column prop="water_fishery" label="采样渔场" width="120" />
                  <el-table-column label="采样时间" width="200">
                    <template #default="scope">
                      {{ `${scope.row.water_year}-${scope.row.water_month}-${scope.row.water_day} ${scope.row.water_hour}:00` }}
                    </template>
                  </el-table-column>
                  <el-table-column prop="water_T" label="浊度" width="100">
                    <template #default="scope">
                      <span :class="{ 'warning-text': scope.row.water_T > 0.1 }">
                        {{ scope.row.water_T }}
                      </span>
                    </template>
                  </el-table-column>
                  <el-table-column prop="water_MN" label="高锰酸钾指数(mg/L)" width="160">
                    <template #default="scope">
                      <span :class="{ 'warning-text': scope.row.water_MN > 1.65 }">
                        {{ scope.row.water_MN }}
                      </span>
                    </template>
                  </el-table-column>
                  <el-table-column prop="water_PH" label="PH值" width="100" />
                  <el-table-column prop="water_DO" label="溶解氧" width="100" />
                  <el-table-column prop="water_TCL" label="总氯" width="100" />
                  <el-table-column prop="water_HCL" label="氢氯" width="100" />
                  <el-table-column prop="water_temp" label="水温(℃)" width="120">
                    <template #default="scope">
                      <span :class="{ 'warning-text': Math.abs(scope.row.water_temp - 22) > 2 }">
                        {{ scope.row.water_temp }}
                      </span>
                    </template>
                  </el-table-column>
                  <el-table-column prop="water_TN" label="总氮" width="100" />
                  <el-table-column prop="water_NO2" label="亚硝酸盐" width="120" />
                  <el-table-column prop="water_NO3" label="硝酸盐" width="100" />
                  <el-table-column prop="water_TP" label="总磷" width="100" />
                  <el-table-column prop="water_S" label="盐度" width="100" />
                  <el-table-column prop="water_SS" label="悬浮物" width="100" />
                  <el-table-column prop="water_HM" label="重金属" width="100" />
                  <el-table-column prop="water_mark" label="水质分数" width="100">
                    <template #default="scope">
                      <el-tag :type="getWaterQualityLevel(scope.row.water_mark)">
                        {{ scope.row.water_mark }}
                      </el-tag>
                    </template>
                  </el-table-column>
                </el-table>

                <!-- 分页器 -->
                <div class="pagination-container">
                  <el-pagination
                      :current-page="currentPage"
                      :page-size="pageSize"
                      :page-sizes="[10, 20, 50, 100]"
                      :total="total"
                      layout="total, sizes, prev, pager, next, jumper"
                      @size-change="handleSizeChange"
                      @current-change="handleCurrentChange"
                  />
                </div>
              </div>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>

    <!-- 底部主分页栏 -->
    <div class="main-tabs-container">
      <el-tabs v-model="activeMainTab" @tab-click="handleMainTabClick">
        <el-tab-pane
            v-for="tab in mainTabs"
            :key="tab.name"
            :label="tab.label"
            :name="tab.name"
        />
      </el-tabs>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, watch } from 'vue'
import axios from 'axios'
import { ElMessage } from 'element-plus'

// 主分页配置
const mainTabs = [
  {
    name: 'fishery',
    label: '渔场数据',
    title: '渔场数据采集中心',
    subTabs: [
      { name: 'fishery-1', label: '水质数据' },
      { name: 'fishery-2', label: '天气数据' },
      { name: 'fishery-3', label: '生物状态数据' },
      { name: 'fishery-4', label: '设备状态数据' },
      { name: 'fishery-5', label: '员工状态数据' }
    ]
  },
  {
    name: 'ship',
    label: '渔船数据',
    title: '渔船数据采集中心',
    subTabs: [
      { name: 'ship-1', label: '渔船行驶数据' },
      { name: 'ship-2', label: '渔船气象数据' },
      { name: 'ship-3', label: '渔具状态数据' },
      { name: 'ship-4', label: '动力系统数据' },
      { name: 'ship-5', label: '捕捞日志' },
      { name: 'ship-6', label: '船员状态数据' }
    ]
  },
  {
    name: 'dock',
    label: '码头数据',
    title: '码头数据采集中心',
    subTabs: [
      { name: 'dock-1', label: '停泊离港数据' },
      { name: 'dock-2', label: '货物装卸数据' },
      { name: 'dock-3', label: '货物仓储数据' },
      { name: 'dock-4', label: '设备状态数据' },
      { name: 'dock-5', label: '工人状态数据' }
    ]
  },
  {
    name: 'fleet',
    label: '车队数据',
    title: '车队数据采集中心',
    subTabs: [
      { name: 'fleet-1', label: '车辆行驶数据' },
      { name: 'fleet-2', label: '动力系统数据' },
      { name: 'fleet-3', label: '运输日志' },
      { name: 'fleet-4', label: '货物状态数据' },
      { name: 'fleet-5', label: '驾驶员状态数据' }
    ]
  },
  {
    name: 'warehouse',
    label: '仓库数据',
    title: '仓库数据采集中心',
    subTabs: [
      { name: 'warehouse-1', label: '仓储数据' },
      { name: 'warehouse-2', label: '出入库记录' },
      { name: 'warehouse-3', label: '设备状态数据' }
    ]
  },
  {
    name: 'workshop',
    label: '车间数据',
    title: '车间数据采集中心',
    subTabs: [
      { name: 'workshop-1', label: '设备状态数据' },
      { name: 'workshop-2', label: '生产日志' },
      { name: 'workshop-3', label: '工人状态数据' }
    ]
  },
  {
    name: 'market',
    label: '市场销售数据',
    title: '市场销售数据采集中心',
    subTabs: [
      { name: 'market-1', label: '销售订单记录' },
      { name: 'market-2', label: '舆情数据' }
    ]
  },
  {
    name: 'fish',
    label: '鱼群监测数据',
    title: '鱼群监测数据采集中心',
    subTabs: [
      { name: 'fish-1', label: '鱼群位置数据' }
    ]
  }
]

// 当前选中的主分页
const activeMainTab = ref('fishery')
// 当前选中的子分页
const activeSubTab = ref('fishery-1')
// 数据源选择状态
const dataSource = reactive({})

// 水质数据相关
const waterQualityData = ref([])
const currentPage = ref(1)
const pageSize = ref(20)
const total = ref(0)
const loading = ref(false)
const virtualScroll = ref(true)
const rowHeight = 40
const visibleRows = 20
const dataCache = new Map() // 添加数据缓存

// 获取水质数据
const fetchWaterQualityData = async () => {
  const cacheKey = `${currentPage.value}-${pageSize.value}`

  // 检查缓存
  if (dataCache.has(cacheKey)) {
    const cachedData = dataCache.get(cacheKey)
    waterQualityData.value = cachedData.data
    total.value = cachedData.total
    return
  }

  loading.value = true
  try {
    const response = await axios.get('http://localhost:8080/selectwater', {
      params: {
        page: currentPage.value,
        size: pageSize.value
      }
    })

    let data = []
    let totalCount = 0

    if (response.data && Array.isArray(response.data)) {
      data = response.data
      totalCount = response.data.length
    } else if (response.data && response.data.records) {
      data = response.data.records
      totalCount = response.data.total || response.data.records.length
    }

    // 更新数据和缓存
    waterQualityData.value = data
    total.value = totalCount
    dataCache.set(cacheKey, { data, total: totalCount })

    // 限制缓存大小
    if (dataCache.size > 10) {
      const firstKey = dataCache.keys().next().value
      dataCache.delete(firstKey)
    }
  } catch (error) {
    console.error('获取水质数据失败:', error)
    ElMessage.error('获取水质数据失败')
    waterQualityData.value = []
    total.value = 0
  } finally {
    loading.value = false
  }
}

// 处理分页大小变化
const handleSizeChange = (val) => {
  pageSize.value = val
  currentPage.value = 1
  fetchWaterQualityData()
}

// 处理页码变化
const handleCurrentChange = (val) => {
  currentPage.value = val
  fetchWaterQualityData()
}

// 获取水质等级
const getWaterQualityLevel = (score) => {
  if (score >= 90) return 'success'
  if (score >= 70) return ''
  if (score >= 60) return 'warning'
  return 'danger'
}

// 监听子分页变化
watch(activeSubTab, (newVal) => {
  if (newVal === 'fishery-1') {
    fetchWaterQualityData()
  }
}, { immediate: true })

// 初始化
onMounted(() => {
  if (activeSubTab.value === 'fishery-1') {
    fetchWaterQualityData()
  }
})

// 计算当前选中的tab信息
const currentTab = computed(() => {
  return mainTabs.find(tab => tab.name === activeMainTab.value)
})

// 处理主分页切换
const handleMainTabClick = () => {
  // 切换主分页时，将子分页重置为第一个
  const newTab = mainTabs.find(tab => tab.name === activeMainTab.value)
  if (newTab && newTab.subTabs.length > 0) {
    activeSubTab.value = newTab.subTabs[0].name
  }
}
</script>

<style scoped>
.page-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100vw;
  background-color: #fff;
}

.content-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  padding: 20px 20px 0;
}

.title-container {
  margin-bottom: 20px;
}

.page-title {
  margin: 0;
  color: #303133;
  font-size: 24px;
  font-weight: bold;
  text-align: center;
}

.sub-tabs-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.data-source-container {
  padding: 16px 0;
  border-bottom: 1px solid #ebeef5;
}

.data-source-select {
  width: 200px;
}

.sub-tab-content {
  flex: 1;
  overflow-y: auto;
  padding: 16px 0;
}

.main-tabs-container {
  border-top: 1px solid #dcdfe6;
  padding: 0 20px;
  background-color: #f5f7fa;
}

:deep(.el-tabs__header) {
  margin: 0;
}

:deep(.el-tabs__nav-wrap) {
  display: flex;
  justify-content: center;
}

:deep(.el-tabs__nav) {
  display: flex;
  width: 100%;
  max-width: 1200px;
}

:deep(.el-tabs__item) {
  flex: 1;
  text-align: center;
  padding: 0 20px;
  height: 40px;
  line-height: 40px;
}

/* 底部主分页特殊样式 */
.main-tabs-container :deep(.el-tabs__nav) {
  display: flex;
  justify-content: space-between;
}

.main-tabs-container :deep(.el-tabs__item) {
  flex: 1;
  min-width: 100px;
  max-width: 150px;
}

.main-tabs-container :deep(.el-tabs__header) {
  border-bottom: none;
}

/* 子分页样式 */
.sub-tabs-container :deep(.el-tabs__header) {
  margin-bottom: 0;
}

.sub-tabs-container :deep(.el-tabs__content) {
  flex: 1;
  overflow: hidden;
}

.sub-tabs-container :deep(.el-tab-pane) {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.water-quality-table {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.pagination-container {
  padding: 15px 0;
  display: flex;
  justify-content: center;
  background-color: #fff;
  border-top: 1px solid #ebeef5;
}

.warning-text {
  color: #E6A23C;
  font-weight: bold;
}

:deep(.el-table) {
  flex: 1;
  will-change: transform;
}

:deep(.el-table__body-wrapper) {
  overflow-x: hidden !important;
}

:deep(.el-table__row) {
  will-change: transform;
}

:deep(.el-pagination) {
  padding: 0;
  font-weight: normal;
}

:deep(.el-pagination .el-select .el-input) {
  width: 100px;
}

:deep(.el-loading-mask) {
  background-color: rgba(255, 255, 255, 0.9);
}

:deep(.el-loading-spinner) {
  margin-top: -20px;
}

:deep(.el-loading-text) {
  color: #409EFF;
  margin: 3px 0;
  font-size: 14px;
}
</style>
