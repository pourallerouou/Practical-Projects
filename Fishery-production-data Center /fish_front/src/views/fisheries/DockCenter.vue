<template>
  <el-drawer
      v-model="visible"
      title="码头管理中心"
      direction="rtl"
      size="90%"
      :with-header="true"
      :before-close="handleClose"
      :destroy-on-close="false"
      :size-drag="true"
      class="dock-drawer"
  >
    <div class="drawer-content">
      <div class="header">
        <h2>码头数据分析中心</h2>
        <el-button @click="closeDrawer" type="primary" size="small">返回主页</el-button>
      </div>

      <el-tabs v-model="activeTab" type="card">
        <!-- 第一分页：码头详情 -->
        <el-tab-pane label="码头详情" name="info">
          <div class="filter-container">
            <el-input
                v-model="dockSearchQuery"
                placeholder="输入关键词查询码头信息"
                clearable
                style="width: 300px; margin-right: 15px;"
                @clear="handleDockSearchClear"
                @keyup.enter="handleDockSearch"
            />
          </div>

          <el-table
              :data="paginatedDockData"
              border
              style="width: 100%"
              height="500"
              v-loading="dockLoading"
          >
            <el-table-column prop="dock_name" label="码头名称" width="150" />
            <el-table-column prop="dock_loca" label="码头位置" width="200" />
            <el-table-column prop="dock_berths" label="泊位数" width="100" />
            <el-table-column prop="dock_line" label="岸线长度(米)" width="120" />
            <el-table-column prop="dock_deep" label="水深(米)" width="100" />
            <el-table-column prop="dock_equip" label="设施配置" />
            <el-table-column prop="dock_area" label="占地面积(㎡)" width="120" />
            <el-table-column prop="dock_capa" label="年吞吐量(吨)" width="120" />
            <el-table-column prop="dock_state" label="运营状态" width="100" />
            <el-table-column prop="dock_tel" label="联系电话" width="150" />
          </el-table>

          <el-pagination
              :current-page="dockCurrentPage"
              :page-size="dockPageSize"
              :total="filteredDockData.length"
              layout="total, sizes, prev, pager, next, jumper"
              :page-sizes="[10, 20, 50, 100]"
              @update:current-page="dockCurrentPage = $event"
              @update:page-size="dockPageSize = $event"
          />
        </el-tab-pane>

        <!-- 第二分页：出入港记录 -->
        <el-tab-pane label="出入港记录" name="records">
          <el-tabs v-model="recordSubTab" type="border-card">
            <!-- 小分页1：捕捞记录 -->
            <el-tab-pane label="捕捞记录" name="catch">
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
                    style="width: 150px; margin-right: 15px;"
                    @change="handleCatchDayChange"
                >
                  <el-option
                      v-for="day in catchDayOptions"
                      :key="day"
                      :label="`${day}日`"
                      :value="day"
                  />
                </el-select>

                <el-select
                    v-model="selectedDock"
                    placeholder="选择码头"
                    clearable
                    style="width: 200px;"
                    @change="handleDockChange"
                >
                  <el-option
                      v-for="dock in dockOptions"
                      :key="dock"
                      :label="dock"
                      :value="dock"
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

            <!-- 小分页2：车运出港 -->
            <el-tab-pane label="车运出港" name="trans">
              <div class="filter-container">
                <el-input
                    v-model="transSearchQuery"
                    placeholder="输入关键词查询车运记录"
                    clearable
                    style="width: 300px; margin-right: 15px;"
                    @clear="handleTransSearchClear"
                    @keyup.enter="handleTransSearch"
                />

                <el-select
                    v-model="transYear"
                    placeholder="选择年份"
                    clearable
                    style="width: 150px; margin-right: 15px;"
                    @change="handleTransYearChange"
                >
                  <el-option
                      v-for="year in transYearOptions"
                      :key="year"
                      :label="`${year}年`"
                      :value="year"
                  />
                </el-select>

                <el-select
                    v-model="transMonth"
                    placeholder="选择月份"
                    clearable
                    :disabled="!transYear"
                    style="width: 150px; margin-right: 15px;"
                    @change="handleTransMonthChange"
                >
                  <el-option
                      v-for="month in transMonthOptions"
                      :key="month"
                      :label="`${month}月`"
                      :value="month"
                  />
                </el-select>

                <el-select
                    v-model="transDay"
                    placeholder="选择日期"
                    clearable
                    :disabled="!transMonth"
                    style="width: 150px; margin-right: 15px;"
                    @change="handleTransDayChange"
                >
                  <el-option
                      v-for="day in transDayOptions"
                      :key="day"
                      :label="`${day}日`"
                      :value="day"
                  />
                </el-select>

                <el-select
                    v-model="selectedTransCompany"
                    placeholder="选择物流公司"
                    clearable
                    style="width: 200px;"
                    @change="handleTransCompanyChange"
                >
                  <el-option
                      v-for="company in transCompanyOptions"
                      :key="company"
                      :label="company"
                      :value="company"
                  />
                </el-select>
              </div>

              <el-table
                  :data="paginatedTransData"
                  border
                  style="width: 100%"
                  height="500"
                  v-loading="transLoading"
              >
                <el-table-column prop="dock_out_year" label="年" width="80" />
                <el-table-column prop="dock_out_month" label="月" width="80" />
                <el-table-column prop="dock_out_day" label="日" width="80" />
                <el-table-column prop="dock_out_hour" label="时" width="80" />
                <el-table-column prop="dock_out_time" label="出港日期" width="120" />
                <el-table-column prop="dock_out_fleet" label="车队编号" width="150" />
                <el-table-column prop="dock_out_company" label="物流公司" width="200" />
                <el-table-column prop="dock_out_name" label="产品名称" width="120" />
                <el-table-column prop="dock_out_type" label="产品类型" width="120" />
                <el-table-column prop="dock_out_weight" label="重量(公斤)" width="120" />
                <el-table-column prop="dock_out_other" label="备注" />
              </el-table>

              <el-pagination
                  :current-page="transCurrentPage"
                  :page-size="transPageSize"
                  :total="filteredTransData.length"
                  layout="total, sizes, prev, pager, next, jumper"
                  :page-sizes="[10, 20, 50, 100]"
                  @update:current-page="transCurrentPage = $event"
                  @update:page-size="transPageSize = $event"
              />
            </el-tab-pane>

            <!-- 小分页3：直销出港 -->
            <el-tab-pane label="直销出港" name="direct">
              <div class="filter-container">
                <el-input
                    v-model="directSearchQuery"
                    placeholder="输入关键词查询直销记录"
                    clearable
                    style="width: 300px; margin-right: 15px;"
                    @clear="handleDirectSearchClear"
                    @keyup.enter="handleDirectSearch"
                />

                <el-select
                    v-model="directYear"
                    placeholder="选择年份"
                    clearable
                    style="width: 150px; margin-right: 15px;"
                    @change="handleDirectYearChange"
                >
                  <el-option
                      v-for="year in directYearOptions"
                      :key="year"
                      :label="`${year}年`"
                      :value="year"
                  />
                </el-select>

                <el-select
                    v-model="directMonth"
                    placeholder="选择月份"
                    clearable
                    :disabled="!directYear"
                    style="width: 150px; margin-right: 15px;"
                    @change="handleDirectMonthChange"
                >
                  <el-option
                      v-for="month in directMonthOptions"
                      :key="month"
                      :label="`${month}月`"
                      :value="month"
                  />
                </el-select>

                <el-select
                    v-model="directDay"
                    placeholder="选择日期"
                    clearable
                    :disabled="!directMonth"
                    style="width: 150px;"
                    @change="handleDirectDayChange"
                >
                  <el-option
                      v-for="day in directDayOptions"
                      :key="day"
                      :label="`${day}日`"
                      :value="day"
                  />
                </el-select>
              </div>

              <el-table
                  :data="paginatedDirectData"
                  border
                  style="width: 100%"
                  height="500"
                  v-loading="directLoading"
              >
                <el-table-column prop="dock_out_year" label="年" width="80" />
                <el-table-column prop="dock_out_month" label="月" width="80" />
                <el-table-column prop="dock_out_day" label="日" width="80" />
                <el-table-column prop="dock_out_hour" label="时" width="80" />
                <el-table-column prop="dock_out_time" label="出港日期" width="120" />
                <el-table-column prop="dock_out_name" label="产品名称" width="120" />
                <el-table-column prop="dock_out_type" label="产品类型" width="120" />
                <el-table-column prop="dock_out_weight" label="重量(公斤)" width="120" />
                <el-table-column prop="dock_out_buyinfo" label="购买信息" />
              </el-table>

              <el-pagination
                  :current-page="directCurrentPage"
                  :page-size="directPageSize"
                  :total="filteredDirectData.length"
                  layout="total, sizes, prev, pager, next, jumper"
                  :page-sizes="[10, 20, 50, 100]"
                  @update:current-page="directCurrentPage = $event"
                  @update:page-size="directPageSize = $event"
              />
            </el-tab-pane>
          </el-tabs>
        </el-tab-pane>

        <!-- 第三分页：码头分析 -->
        <el-tab-pane label="码头分析" name="analysis">
          <div class="filter-container">
            <el-select
                v-model="chartYear"
                placeholder="选择年份"
                clearable
                style="width: 150px; margin-right: 15px;"
                @change="handleChartYearChange"
            >
              <el-option
                  v-for="year in chartYearOptions"
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
                style="width: 150px; margin-right: 15px;"
                @change="handleChartDayChange"
            >
              <el-option
                  v-for="day in chartDayOptions"
                  :key="day"
                  :label="`${day}日`"
                  :value="day"
              />
            </el-select>

            <el-select
                v-model="selectedChartCompany"
                placeholder="选择公司(产品饼图)"
                clearable
                style="width: 250px;"
                @change="handleChartCompanyChange"
            >
              <el-option
                  v-for="company in transCompanyOptions"
                  :key="company"
                  :label="company"
                  :value="company"
              />
            </el-select>
          </div>

          <div class="chart-container">
            <!-- 公司运输量面积图 -->
            <div class="chart-wrapper">
              <div class="chart-title">公司运输量统计</div>
              <div ref="areaChartRef" style="width: 140vh; height: 500px;"></div>
            </div>

            <!-- 饼图水平并列容器 -->
            <div class="pie-charts-container">
              <!-- 公司运输量饼图 -->
              <div class="chart-wrapper pie-chart">
                <div class="chart-title">公司运输量比例</div>
                <div ref="companyPieRef" style="width: 100%; height: 400px;"></div>
              </div>

              <!-- 产品运输量饼图 -->
              <div class="chart-wrapper pie-chart">
                <div class="chart-title">产品运输量比例</div>
                <div ref="productPieRef" style="width: 100%; height: 400px;"></div>
              </div>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </el-drawer>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue'
import * as echarts from 'echarts'
import axios from 'axios'

// 抽屉属性
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
  console.log('关闭码头管理抽屉')
  done()
}

// 标签页状态
const activeTab = ref('info')
const recordSubTab = ref('catch')

// 数据加载状态
const dataLoadStatus = ref({
  docks: false,
  catches: false,
  trans: false,
  direct: false
})

// 码头详情数据
const dockData = ref([])
const dockSearchQuery = ref('')
const dockCurrentPage = ref(1)
const dockPageSize = ref(20)
const dockLoading = ref(false)

// 捕捞记录数据
const catchData = ref([])
const catchSearchQuery = ref('')
const catchCurrentPage = ref(1)
const catchPageSize = ref(20)
const catchLoading = ref(false)
const catchYear = ref('')
const catchMonth = ref('')
const catchDay = ref('')
const selectedDock = ref('')

// 车运出港数据
const transData = ref([])
const transSearchQuery = ref('')
const transCurrentPage = ref(1)
const transPageSize = ref(20)
const transLoading = ref(false)
const transYear = ref('')
const transMonth = ref('')
const transDay = ref('')
const selectedTransCompany = ref('')

// 直销出港数据
const directData = ref([])
const directSearchQuery = ref('')
const directCurrentPage = ref(1)
const directPageSize = ref(20)
const directLoading = ref(false)
const directYear = ref('')
const directMonth = ref('')
const directDay = ref('')

// 图表相关数据
const chartYear = ref('')
const chartMonth = ref('')
const chartDay = ref('')
const selectedChartCompany = ref('')

// 图表实例
let areaChartInstance = null
let companyPieInstance = null
let productPieInstance = null

// 图表引用
const areaChartRef = ref(null)
const companyPieRef = ref(null)
const productPieRef = ref(null)

// 计算属性：经过筛选的码头数据
const filteredDockData = computed(() => {
  if (!dockSearchQuery.value) return dockData.value

  const query = dockSearchQuery.value.toLowerCase()
  return dockData.value.filter(item => {
    return Object.keys(item).some(key => {
      const value = item[key]
      return value !== null &&
          value !== undefined &&
          String(value).toLowerCase().includes(query)
    })
  })
})

// 计算属性：分页后的码头数据
const paginatedDockData = computed(() => {
  const start = (dockCurrentPage.value - 1) * dockPageSize.value
  const end = start + dockPageSize.value
  return filteredDockData.value.slice(start, end)
})

// 码头选项
const dockOptions = computed(() => {
  return [...new Set(catchData.value.map(item => item.catch_dock))].sort()
})

// 计算属性：经过筛选的捕捞记录数据
const filteredCatchData = computed(() => {
  let filtered = catchData.value

  // 按关键词筛选
  if (catchSearchQuery.value) {
    const query = catchSearchQuery.value.toLowerCase()
    filtered = filtered.filter(item => {
      return Object.keys(item).some(key => {
        const value = item[key]
        return value !== null &&
            value !== undefined &&
            String(value).toLowerCase().includes(query)
      })
    })
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

  // 按码头筛选
  if (selectedDock.value) {
    filtered = filtered.filter(item => item.catch_dock === selectedDock.value)
  }

  return filtered
})

// 计算属性：分页后的捕捞记录数据
const paginatedCatchData = computed(() => {
  const start = (catchCurrentPage.value - 1) * catchPageSize.value
  const end = start + catchPageSize.value
  return filteredCatchData.value.slice(start, end)
})

// 计算属性：经过筛选的车运出港数据
const filteredTransData = computed(() => {
  let filtered = transData.value

  // 按关键词筛选
  if (transSearchQuery.value) {
    const query = transSearchQuery.value.toLowerCase()
    filtered = filtered.filter(item => {
      return Object.keys(item).some(key => {
        const value = item[key]
        return value !== null &&
            value !== undefined &&
            String(value).toLowerCase().includes(query)
      })
    })
  }

  // 按年筛选
  if (transYear.value) {
    filtered = filtered.filter(item => item.dock_out_year == transYear.value)

    // 按月筛选
    if (transMonth.value) {
      filtered = filtered.filter(item => item.dock_out_month == transMonth.value)

      // 按日筛选
      if (transDay.value) {
        filtered = filtered.filter(item => item.dock_out_day == transDay.value)
      }
    }
  }

  // 按公司筛选
  if (selectedTransCompany.value) {
    filtered = filtered.filter(item => item.dock_out_company === selectedTransCompany.value)
  }

  return filtered
})

// 计算属性：分页后的车运出港数据
const paginatedTransData = computed(() => {
  const start = (transCurrentPage.value - 1) * transPageSize.value
  const end = start + transPageSize.value
  return filteredTransData.value.slice(start, end)
})

// 物流公司选项
const transCompanyOptions = computed(() => {
  return [...new Set(transData.value.map(item => item.dock_out_company))].sort()
})

// 计算属性：经过筛选的直销出港数据
const filteredDirectData = computed(() => {
  let filtered = directData.value

  // 按关键词筛选
  if (directSearchQuery.value) {
    const query = directSearchQuery.value.toLowerCase()
    filtered = filtered.filter(item => {
      return Object.keys(item).some(key => {
        const value = item[key]
        return value !== null &&
            value !== undefined &&
            String(value).toLowerCase().includes(query)
      })
    })
  }

  // 按年筛选
  if (directYear.value) {
    filtered = filtered.filter(item => item.dock_out_year == directYear.value)

    // 按月筛选
    if (directMonth.value) {
      filtered = filtered.filter(item => item.dock_out_month == directMonth.value)

      // 按日筛选
      if (directDay.value) {
        filtered = filtered.filter(item => item.dock_out_day == directDay.value)
      }
    }
  }

  return filtered
})

// 计算属性：分页后的直销出港数据
const paginatedDirectData = computed(() => {
  const start = (directCurrentPage.value - 1) * directPageSize.value
  const end = start + directPageSize.value
  return filteredDirectData.value.slice(start, end)
})

// 计算属性：捕捞记录年份选项
const catchYearOptions = computed(() => {
  return [...new Set(catchData.value.map(item => item.catch_year))].sort()
})

// 计算属性：捕捞记录月份选项
const catchMonthOptions = computed(() => {
  if (!catchYear.value) return []

  return [...new Set(catchData.value
      .filter(item => item.catch_year == catchYear.value)
      .map(item => item.catch_month))]
      .sort((a, b) => a - b)
})

// 计算属性：捕捞记录日期选项
const catchDayOptions = computed(() => {
  if (!catchYear.value || !catchMonth.value) return []

  return [...new Set(catchData.value
      .filter(item => item.catch_year == catchYear.value && item.catch_month == catchMonth.value)
      .map(item => item.catch_day))]
      .sort((a, b) => a - b)
})

// 计算属性：车运出港年份选项
const transYearOptions = computed(() => {
  return [...new Set(transData.value.map(item => item.dock_out_year))].sort()
})

// 计算属性：车运出港月份选项
const transMonthOptions = computed(() => {
  if (!transYear.value) return []

  return [...new Set(transData.value
      .filter(item => item.dock_out_year == transYear.value)
      .map(item => item.dock_out_month))]
      .sort((a, b) => a - b)
})

// 计算属性：车运出港日期选项
const transDayOptions = computed(() => {
  if (!transYear.value || !transMonth.value) return []

  return [...new Set(transData.value
      .filter(item => item.dock_out_year == transYear.value && item.dock_out_month == transMonth.value)
      .map(item => item.dock_out_day))]
      .sort((a, b) => a - b)
})

// 计算属性：直销出港年份选项
const directYearOptions = computed(() => {
  return [...new Set(directData.value.map(item => item.dock_out_year))].sort()
})

// 计算属性：直销出港月份选项
const directMonthOptions = computed(() => {
  if (!directYear.value) return []

  return [...new Set(directData.value
      .filter(item => item.dock_out_year == directYear.value)
      .map(item => item.dock_out_month))]
      .sort((a, b) => a - b)
})

// 计算属性：直销出港日期选项
const directDayOptions = computed(() => {
  if (!directYear.value || !directMonth.value) return []

  return [...new Set(directData.value
      .filter(item => item.dock_out_year == directYear.value && item.dock_out_month == directMonth.value)
      .map(item => item.dock_out_day))]
      .sort((a, b) => a - b)
})

// 计算属性：图表年份选项
const chartYearOptions = computed(() => {
  return [...new Set(transData.value.map(item => item.dock_out_year))].sort()
})

// 计算属性：图表月份选项
const chartMonthOptions = computed(() => {
  if (!chartYear.value) return []

  return [...new Set(transData.value
      .filter(item => item.dock_out_year == chartYear.value)
      .map(item => item.dock_out_month))]
      .sort((a, b) => a - b)
})

// 计算属性：图表日期选项
const chartDayOptions = computed(() => {
  if (!chartYear.value || !chartMonth.value) return []

  return [...new Set(transData.value
      .filter(item => item.dock_out_year == chartYear.value && item.dock_out_month == chartMonth.value)
      .map(item => item.dock_out_day))]
      .sort((a, b) => a - b)
})

// 获取码头数据
const fetchDockData = async () => {
  if (dataLoadStatus.value.docks) return

  dockLoading.value = true
  try {
    const response = await axios.get('http://localhost:8080/dock')
    dockData.value = response.data || []
    dataLoadStatus.value.docks = true
  } catch (error) {
    console.error('获取码头数据失败:', error)
  } finally {
    dockLoading.value = false
  }
}

// 获取捕捞记录数据
const fetchCatchData = async () => {
  if (dataLoadStatus.value.catches) return

  catchLoading.value = true
  try {
    const response = await axios.get('http://localhost:8080/catch')
    catchData.value = response.data || []
    dataLoadStatus.value.catches = true
  } catch (error) {
    console.error('获取捕捞记录失败:', error)
  } finally {
    catchLoading.value = false
  }
}

// 获取车运出港数据
const fetchTransData = async () => {
  if (dataLoadStatus.value.trans) return

  transLoading.value = true
  try {
    const response = await axios.get('http://localhost:8080/trans')
    transData.value = response.data || []
    dataLoadStatus.value.trans = true

    // Set the most recent date from the loaded data
    if (transData.value.length > 0) {
      setMostRecentDate()
    }
  } catch (error) {
    console.error('获取车运出港数据失败:', error)
  } finally {
    transLoading.value = false
  }
}

// 获取直销出港数据
const fetchDirectData = async () => {
  if (dataLoadStatus.value.direct) return

  directLoading.value = true
  try {
    const response = await axios.get('http://localhost:8080/direct')
    directData.value = response.data || []
    dataLoadStatus.value.direct = true
  } catch (error) {
    console.error('获取直销出港数据失败:', error)
  } finally {
    directLoading.value = false
  }
}

// 码头搜索处理函数
const handleDockSearch = () => {
  dockCurrentPage.value = 1
}

// 码头搜索清除函数
const handleDockSearchClear = () => {
  dockSearchQuery.value = ''
  dockCurrentPage.value = 1
}

// 捕捞记录搜索处理函数
const handleCatchSearch = () => {
  catchCurrentPage.value = 1
}

// 捕捞记录搜索清除函数
const handleCatchSearchClear = () => {
  catchSearchQuery.value = ''
  catchCurrentPage.value = 1
}

// 捕捞记录年份变更函数
const handleCatchYearChange = () => {
  catchMonth.value = ''
  catchDay.value = ''
  catchCurrentPage.value = 1
}

// 捕捞记录月份变更函数
const handleCatchMonthChange = () => {
  catchDay.value = ''
  catchCurrentPage.value = 1
}

// 捕捞记录日期变更函数
const handleCatchDayChange = () => {
  catchCurrentPage.value = 1
}

// 码头选择变更函数
const handleDockChange = () => {
  catchCurrentPage.value = 1
}

// 车运出港搜索处理函数
const handleTransSearch = () => {
  transCurrentPage.value = 1
}

// 车运出港搜索清除函数
const handleTransSearchClear = () => {
  transSearchQuery.value = ''
  transCurrentPage.value = 1
}

// 车运出港年份变更函数
const handleTransYearChange = () => {
  transMonth.value = ''
  transDay.value = ''
  transCurrentPage.value = 1
}

// 车运出港月份变更函数
const handleTransMonthChange = () => {
  transDay.value = ''
  transCurrentPage.value = 1
}

// 车运出港日期变更函数
const handleTransDayChange = () => {
  transCurrentPage.value = 1
}

// 公司选择变更函数
const handleTransCompanyChange = () => {
  transCurrentPage.value = 1
}

// 直销出港搜索处理函数
const handleDirectSearch = () => {
  directCurrentPage.value = 1
}

// 直销出港搜索清除函数
const handleDirectSearchClear = () => {
  directSearchQuery.value = ''
  directCurrentPage.value = 1
}

// 直销出港年份变更函数
const handleDirectYearChange = () => {
  directMonth.value = ''
  directDay.value = ''
  directCurrentPage.value = 1
}

// 直销出港月份变更函数
const handleDirectMonthChange = () => {
  directDay.value = ''
  directCurrentPage.value = 1
}

// 直销出港日期变更函数
const handleDirectDayChange = () => {
  directCurrentPage.value = 1
}

// 图表年份变更处理函数
const handleChartYearChange = () => {
  chartMonth.value = ''
  chartDay.value = ''
  updateCharts()
}

// 图表月份变更处理函数
const handleChartMonthChange = () => {
  chartDay.value = ''
  updateCharts()
}

// 图表日期变更处理函数
const handleChartDayChange = () => {
  updateCharts()
}

// 图表公司变更处理函数
const handleChartCompanyChange = () => {
  updateProductPieChart()
}

// 初始化图表
const initCharts = () => {
  console.log('Initializing charts...')
  console.log('Chart refs:', areaChartRef.value, companyPieRef.value, productPieRef.value)

  // 确保图表容器元素存在
  if (!areaChartRef.value || !companyPieRef.value || !productPieRef.value) {
    console.error('Chart container elements not found')
    // 在下一个tick尝试再次初始化
    nextTick(() => {
      if (areaChartRef.value && companyPieRef.value && productPieRef.value) {
        console.log('Retrying chart initialization...')
        initCharts()
      }
    })
    return
  }

  try {
    // 销毁现有实例（如果存在）
    if (areaChartInstance) {
      areaChartInstance.dispose()
    }
    if (companyPieInstance) {
      companyPieInstance.dispose()
    }
    if (productPieInstance) {
      productPieInstance.dispose()
    }

    // 初始化面积图
    areaChartInstance = echarts.init(areaChartRef.value)

    // 初始化公司饼图
    companyPieInstance = echarts.init(companyPieRef.value)

    // 初始化产品饼图
    productPieInstance = echarts.init(productPieRef.value)

    console.log('Charts initialized successfully:', areaChartInstance, companyPieInstance, productPieInstance)

    // 更新图表数据
    updateCharts()

    // 监听窗口大小变化
    window.addEventListener('resize', handleResize)
  } catch (error) {
    console.error('Error initializing charts:', error)
  }
}

// 更新所有图表
const updateCharts = () => {
  console.log('Updating charts with data...')

  // 更新面积图和公司饼图
  updateAreaAndCompanyPieCharts()

  // 更新产品饼图
  updateProductPieChart()
}

// 更新面积图和公司饼图
const updateAreaAndCompanyPieCharts = () => {
  if (!areaChartInstance || !companyPieInstance) return

  // 准备数据
  let filtered = [...transData.value]

  // 按时间筛选
  if (chartYear.value) {
    filtered = filtered.filter(item => item.dock_out_year == chartYear.value)

    if (chartMonth.value) {
      filtered = filtered.filter(item => item.dock_out_month == chartMonth.value)

      if (chartDay.value) {
        filtered = filtered.filter(item => item.dock_out_day == chartDay.value)
      }
    }
  }

  // 确定x轴类型和数据
  let xAxisType = 'year'
  let xAxisData = []

  if (chartYear.value && !chartMonth.value) {
    // 当只选了年时，x轴显示月份
    xAxisType = 'month'
    xAxisData = Array.from({length: 12}, (_, i) => i + 1) // 1-12月
  } else if (chartYear.value && chartMonth.value && !chartDay.value) {
    // 当选了年和月时，x轴显示日期
    xAxisType = 'day'
    const daysInMonth = new Date(chartYear.value, chartMonth.value, 0).getDate()
    xAxisData = Array.from({length: daysInMonth}, (_, i) => i + 1) // 1-31日（或更少）
  } else if (chartYear.value && chartMonth.value && chartDay.value) {
    // 当选了年、月和日时，x轴显示小时
    xAxisType = 'hour'
    xAxisData = Array.from({length: 24}, (_, i) => i) // 0-23小时
  } else {
    // 默认情况下显示所有年份
    xAxisType = 'year'
    xAxisData = [...new Set(transData.value.map(item => item.dock_out_year))].sort()
  }

  // 计算公司数据用于饼图
  const companyData = []
  const companies = [...new Set(filtered.map(item => item.dock_out_company))]
  companies.forEach(company => {
    const companyCatches = filtered.filter(item => item.dock_out_company === company)
    const totalWeight = companyCatches.reduce((sum, item) => sum + Number(item.dock_out_weight || 0), 0)
    companyData.push({
      name: company,
      value: parseFloat(totalWeight.toFixed(2))
    })
  })

  // 准备面积图系列数据
  const seriesData = []
  companies.forEach((company, index) => {
    const data = []

    for (const x of xAxisData) {
      let companyFiltered = filtered.filter(item => item.dock_out_company === company)

      if (xAxisType === 'month') {
        companyFiltered = companyFiltered.filter(item => item.dock_out_month == x)
      } else if (xAxisType === 'day') {
        companyFiltered = companyFiltered.filter(item => item.dock_out_day == x)
      } else if (xAxisType === 'hour') {
        companyFiltered = companyFiltered.filter(item => item.dock_out_hour == x)
      } else if (xAxisType === 'year') {
        companyFiltered = companyFiltered.filter(item => item.dock_out_year == x)
      }

      const totalWeight = companyFiltered.reduce((sum, item) =>
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
        width: 3 // 更粗的线
      },
      areaStyle: {
        opacity: 0.8
      },
      emphasis: {
        focus: 'series'
      },
      data: data
    })
  })

  // 格式化x轴标签
  let xAxisLabels = xAxisData
  if (xAxisType === 'month') {
    xAxisLabels = xAxisData.map(month => `${month}月`)
  } else if (xAxisType === 'day') {
    xAxisLabels = xAxisData.map(day => `${day}日`)
  } else if (xAxisType === 'hour') {
    xAxisLabels = xAxisData.map(hour => `${hour}时`)
  } else if (xAxisType === 'year') {
    xAxisLabels = xAxisData.map(year => `${year}年`)
  }

  // 颜色配置 - 更鲜艳的颜色
  const vibrantColors = [
    '#FF6B6B', // 鲜红色
    '#4BC0C0', // 青色
    '#9966FF', // 紫色
    '#FFCE56', // 黄色
    '#36A2EB', // 蓝色
    '#FF9F40', // 橙色
    '#2ECC71', // 绿色
    '#F653A6', // 粉色
    '#7C4DFF', // 深紫色
    '#5AD8A6', // 薄荷绿
    '#FF8A80', // 浅红色
    '#64B5F6'  // 浅蓝色
  ]

  // 时间范围文本
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

  // 面积图配置
  const areaOption = {
    color: vibrantColors,
    title: {
      text: `${timeRangeText}公司运输量统计`,
      left: 'center',
      textStyle: {
        fontSize: 18,
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
      }
    },
    legend: {
      data: companies,
      top: '40px'
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      top: '80px',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: xAxisLabels,
      axisLabel: {
        interval: 0,
        rotate: xAxisLabels.length > 12 ? 45 : 0,
        fontSize: 12
      }
    },
    yAxis: {
      type: 'value',
      name: '运输量(公斤)',
      nameTextStyle: {
        fontSize: 14,
        padding: [0, 0, 0, 40]
      }
    },
    series: seriesData
  }

  // 公司饼图配置
  const companyPieOption = {
    color: vibrantColors,
    title: {
      text: `${timeRangeText}公司运输量比例`,
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
      name: '公司运输量',
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

  // 设置图表选项
  areaChartInstance.setOption(areaOption, true)
  companyPieInstance.setOption(companyPieOption, true)
}

// 更新产品饼图
const updateProductPieChart = () => {
  if (!productPieInstance) return

  // 准备数据
  let filtered = [...transData.value]

  // 按时间筛选
  if (chartYear.value) {
    filtered = filtered.filter(item => item.dock_out_year == chartYear.value)

    if (chartMonth.value) {
      filtered = filtered.filter(item => item.dock_out_month == chartMonth.value)

      if (chartDay.value) {
        filtered = filtered.filter(item => item.dock_out_day == chartDay.value)
      }
    }
  }

  // 产品运输量数据
  let productData = []
  let calculatedCatches = filtered

  // 如果选择了公司，则按公司筛选，否则使用所有数据
  if (selectedChartCompany.value) {
    calculatedCatches = filtered.filter(item => item.dock_out_company === selectedChartCompany.value)
  }

  // 获取唯一的产品类型并计算总量
  const productTypes = [...new Set(calculatedCatches.map(item => item.dock_out_type))]

  productData = productTypes.map(type => {
    const typeCatches = calculatedCatches.filter(item => item.dock_out_type === type)
    const totalWeight = typeCatches.reduce((sum, item) => sum + Number(item.dock_out_weight || 0), 0)
    return {
      name: type,
      value: parseFloat(totalWeight.toFixed(2))
    }
  }).filter(item => item.value > 0)

  // 颜色配置 - 更鲜艳的颜色
  const vibrantColors = [
    '#FF6B6B', // 鲜红色
    '#4BC0C0', // 青色
    '#9966FF', // 紫色
    '#FFCE56', // 黄色
    '#36A2EB', // 蓝色
    '#FF9F40', // 橙色
    '#2ECC71', // 绿色
    '#F653A6', // 粉色
    '#7C4DFF', // 深紫色
    '#5AD8A6', // 薄荷绿
    '#FF8A80', // 浅红色
    '#64B5F6'  // 浅蓝色
  ]

  // 时间范围文本
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

  // 产品饼图标题
  const productPieTitle = selectedChartCompany.value
      ? `${timeRangeText} ${selectedChartCompany.value} 产品运输量比例`
      : `${timeRangeText}所有公司产品运输量比例`;

  const productPieOption = {
    color: vibrantColors,
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
      name: '产品运输量',
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

  // 设置图表选项
  productPieInstance.setOption(productPieOption, true)
}

// Add this function to identify the most recent date in the dataset
const setMostRecentDate = () => {
  if (transData.value && transData.value.length > 0) {
    // Sort data by date (descending)
    const sortedData = [...transData.value].sort((a, b) => {
      const dateA = new Date(a.dock_out_year, a.dock_out_month - 1, a.dock_out_day);
      const dateB = new Date(b.dock_out_year, b.dock_out_month - 1, b.dock_out_day);
      return dateB - dateA; // Sort in descending order (newest first)
    });

    // Set values from the most recent record
    const mostRecent = sortedData[0];
    chartYear.value = mostRecent.dock_out_year;
    chartMonth.value = mostRecent.dock_out_month;
    chartDay.value = mostRecent.dock_out_day;

    console.log(`Set default date to: ${chartYear.value}-${chartMonth.value}-${chartDay.value}`);
  }
};

// 监听抽屉可见性
watch(visible, (val) => {
  if (val) {
    // 当抽屉打开时，加载数据
    fetchDockData()
    fetchCatchData()
    fetchTransData()
    fetchDirectData()

    // 延迟初始化图表，确保DOM已加载
    nextTick(() => {
      setTimeout(() => {
        if (activeTab.value === 'analysis') {
          initCharts()
        }
      }, 500) // Give more time (500ms) for DOM to render
    })
  }
})

// 监听活动标签变化
watch(activeTab, (val) => {
  if (val === 'analysis') {
    nextTick(() => {
      setTimeout(() => {
        initCharts()
      }, 500) // Give more time (500ms) for DOM to render
    })
  }
})

// 监听过滤器变化
watch([chartYear, chartMonth, chartDay], () => {
  if (activeTab.value === 'analysis') {
    updateCharts()
  }
})

// 监听选定公司变化
watch(selectedChartCompany, () => {
  if (activeTab.value === 'analysis') {
    updateProductPieChart()
  }
})

// 监听窗口大小变化的处理函数
const handleResize = () => {
  if (areaChartInstance && visible.value) {
    areaChartInstance.resize()
  }
  if (companyPieInstance && visible.value) {
    companyPieInstance.resize()
  }
  if (productPieInstance && visible.value) {
    productPieInstance.resize()
  }
}

// 生命周期钩子 - 组件卸载
onUnmounted(() => {
  // 清理图表实例
  if (areaChartInstance) {
    areaChartInstance.dispose()
    areaChartInstance = null
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

// 组件挂载时设置默认活动标签
onMounted(() => {
  // 默认显示第一个标签
  activeTab.value = 'info'
  recordSubTab.value = 'catch'
})
</script>

<style scoped>
.dock-drawer {
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