<template>
  <div class="production-container">
    <el-row :gutter="20" class="full-height">
      <!-- 左侧仓库卡片 -->
      <el-col :span="8">
        <el-card class="box-card full-height">
          <template #header>
            <div class="card-header">
              <span>今日仓库</span>
              <div class="header-actions">
                <el-tag type="success" size="small">运转正常</el-tag>
                <el-button class="button" text>查看详情</el-button>
              </div>
            </div>
          </template>
          <div class="card-content">
            <!-- 上半部分：数据仪表 -->
            <div class="metrics-section">
              <div class="metrics-grid">
                <div class="metric-item">
                  <div class="metric-value">844</div>
                  <div class="metric-label">品类数量(种)</div>
                  <div class="metric-trend up">+2.3%</div>
                </div>
                <div class="metric-item">
                  <div class="metric-value">3541吨</div>
                  <div class="metric-label">总储量</div>
                  <div class="metric-trend up">+1.5%</div>
                </div>
                <div class="metric-item">
                  <div class="metric-value">64</div>
                  <div class="metric-label">仓储压力指数</div>
                  <div class="metric-trend down">-0.8%</div>
                </div>
                <div class="metric-item">
                  <div class="metric-value">4.12</div>
                  <div class="metric-label">平均周转周期(日)</div>
                  <div class="metric-trend stable">持平</div>
                </div>
              </div>
              <div class="brief-report">
                <div class="brief-title">仓库情况简报</div>
                <div class="brief-content">今日仓库运转正常，总储量3541吨，较昨日增长2.3%。A区、B区存储压力较大，建议及时调整存储策略。C区新到货物已全部完成入库，D区正在进行月度盘点。整体仓储压力指数64，处于可控范围。</div>
              </div>
              <div class="area-status">
                <div class="area-title">区域状态</div>
                <div class="area-grid">
                  <div class="area-item">
                    <div class="area-name">A区</div>
                    <el-progress :percentage="85" :color="customColors" />
                    <div class="area-detail">存储率 85%</div>
                  </div>
                  <div class="area-item">
                    <div class="area-name">B区</div>
                    <el-progress :percentage="92" :color="customColors" />
                    <div class="area-detail">存储率 92%</div>
                  </div>
                  <div class="area-item">
                    <div class="area-name">C区</div>
                    <el-progress :percentage="65" :color="customColors" />
                    <div class="area-detail">存储率 65%</div>
                  </div>
                  <div class="area-item">
                    <div class="area-name">D区</div>
                    <el-progress :percentage="78" :color="customColors" />
                    <div class="area-detail">存储率 78%</div>
                  </div>
                </div>
              </div>
            </div>
            <!-- 下半部分：告警信息 -->
            <div class="alerts-section">
              <div class="section-title">仓库异常告警</div>
              <div class="alert-list">
                <div class="alert-item warning">
                  <el-icon><WarningFilled /></el-icon>
                  <span>A3区域温度超出正常范围，建议检查</span>
                  <span class="alert-time">10:23</span>
                </div>
                <div class="alert-item error">
                  <el-icon><CircleCloseFilled /></el-icon>
                  <span>B2区域湿度过高，需要及时处理</span>
                  <span class="alert-time">09:45</span>
                </div>
                <div class="alert-item info">
                  <el-icon><InfoFilled /></el-icon>
                  <span>日常库存盘点提醒</span>
                  <span class="alert-time">08:30</span>
                </div>
                <div class="alert-item warning">
                  <el-icon><WarningFilled /></el-icon>
                  <span>C区货物堆放不规范，需要整理</span>
                  <span class="alert-time">08:15</span>
                </div>
                <div class="alert-item info">
                  <el-icon><InfoFilled /></el-icon>
                  <span>D区新到货物待验收</span>
                  <span class="alert-time">08:00</span>
                </div>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>

      <!-- 中间生产车间卡片 -->
      <el-col :span="8">
        <el-card class="box-card full-height">
          <template #header>
            <div class="card-header">
              <span>生产车间</span>
              <div class="header-actions">
                <el-tag type="warning" size="small">部分异常</el-tag>
                <el-button class="button" text>查看详情</el-button>
              </div>
            </div>
          </template>
          <div class="card-content">
            <!-- 上半部分：数据仪表 -->
            <div class="metrics-section">
              <div class="metrics-grid">
                <div class="metric-item">
                  <div class="metric-value">89%</div>
                  <div class="metric-label">生产计划完成率</div>
                  <div class="metric-trend down">-2.1%</div>
                </div>
                <div class="metric-item">
                  <div class="metric-value">95%</div>
                  <div class="metric-label">设备运转率</div>
                  <div class="metric-trend up">+1.2%</div>
                </div>
                <div class="metric-item">
                  <div class="metric-value">92%</div>
                  <div class="metric-label">产品合格率</div>
                  <div class="metric-trend up">+0.8%</div>
                </div>
                <div class="metric-item">
                  <div class="metric-value">85%</div>
                  <div class="metric-label">产能利用率</div>
                  <div class="metric-trend stable">持平</div>
                </div>
              </div>
              <div class="brief-report">
                <div class="brief-title">车间情况简报</div>
                <div class="brief-content">今日生产计划完成率89%，设备运转率95%，整体运行良好。1号生产线因设备维护暂停2小时，已及时调整生产计划。2号生产线产品合格率提升至94%，创近期新高。建议加强3号生产线质量控制，合格率略有下降。</div>
              </div>
              <div class="production-lines">
                <div class="lines-title">生产线状态</div>
                <div class="lines-grid">
                  <div class="line-item">
                    <div class="line-header">
                      <span class="line-name">1号线</span>
                      <el-tag size="small" type="warning">维护中</el-tag>
                    </div>
                    <el-progress :percentage="75" :color="customColors" />
                    <div class="line-detail">
                      <span>计划完成率 75%</span>
                      <span>合格率 96%</span>
                    </div>
                  </div>
                  <div class="line-item">
                    <div class="line-header">
                      <span class="line-name">2号线</span>
                      <el-tag size="small" type="success">运行中</el-tag>
                    </div>
                    <el-progress :percentage="92" :color="customColors" />
                    <div class="line-detail">
                      <span>计划完成率 92%</span>
                      <span>合格率 94%</span>
                    </div>
                  </div>
                  <div class="line-item">
                    <div class="line-header">
                      <span class="line-name">3号线</span>
                      <el-tag size="small" type="danger">异常</el-tag>
                    </div>
                    <el-progress :percentage="65" :color="customColors" />
                    <div class="line-detail">
                      <span>计划完成率 65%</span>
                      <span>合格率 88%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <!-- 下半部分：告警信息 -->
            <div class="alerts-section">
              <div class="section-title">生产异常告警</div>
              <div class="alert-list">
                <div class="alert-item error">
                  <el-icon><CircleCloseFilled /></el-icon>
                  <span>2号生产线设备故障，需要维修</span>
                  <span class="alert-time">11:05</span>
                </div>
                <div class="alert-item warning">
                  <el-icon><WarningFilled /></el-icon>
                  <span>1号生产线产能不足，建议调整</span>
                  <span class="alert-time">10:30</span>
                </div>
                <div class="alert-item info">
                  <el-icon><InfoFilled /></el-icon>
                  <span>设备例行维护提醒</span>
                  <span class="alert-time">09:00</span>
                </div>
                <div class="alert-item warning">
                  <el-icon><WarningFilled /></el-icon>
                  <span>3号线原材料库存不足</span>
                  <span class="alert-time">08:45</span>
                </div>
                <div class="alert-item error">
                  <el-icon><CircleCloseFilled /></el-icon>
                  <span>2号线产品质量异常</span>
                  <span class="alert-time">08:30</span>
                </div>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>

      <!-- 右侧市场销售卡片 -->
      <el-col :span="8">
        <el-card class="box-card full-height">
          <template #header>
            <div class="card-header">
              <span>市场销售</span>
              <div class="header-actions">
                <el-tag type="success" size="small">增长中</el-tag>
                <el-button class="button" text>查看详情</el-button>
              </div>
            </div>
          </template>
          <div class="card-content">
            <!-- 上半部分：数据仪表 -->
            <div class="metrics-section">
              <div class="metrics-grid">
                <div class="metric-item">
                  <div class="metric-value">¥89,432</div>
                  <div class="metric-label">今日销售额</div>
                  <div class="metric-trend up">+12.5%</div>
                </div>
                <div class="metric-item">
                  <div class="metric-value">156</div>
                  <div class="metric-label">订单数量</div>
                  <div class="metric-trend up">+8.3%</div>
                </div>
                <div class="metric-item">
                  <div class="metric-value">95%</div>
                  <div class="metric-label">客户满意度</div>
                  <div class="metric-trend up">+2.1%</div>
                </div>
                <div class="metric-item">
                  <div class="metric-value">372/353</div>
                  <div class="metric-label">出/入库量(吨)</div>
                  <div class="metric-trend stable">持平</div>
                </div>
              </div>
              <div class="brief-report">
                <div class="brief-title">市场销售简报</div>
                <div class="brief-content">今日销售额89,432元，较昨日增长12.5%，订单量156单，客户满意度95%。鱼类销量领先，B产品库存告急，建议及时补货。新客户占比15%，老客户复购率提升至78%。线上渠道销售额占比首次超过线下，达到52%。</div>
              </div>
              <div class="sales-channels">
                <div class="channels-title">销售渠道分析</div>
                <div class="channels-grid">
                  <div class="channel-item">
                    <div class="channel-name">线上渠道</div>
                    <div class="channel-value">52%</div>
                    <el-progress :percentage="52" :color="customColors" />
                  </div>
                  <div class="channel-item">
                    <div class="channel-name">线下渠道</div>
                    <div class="channel-value">48%</div>
                    <el-progress :percentage="48" :color="customColors" />
                  </div>
                </div>
              </div>
              <div class="chart-container">
                <h5>今日销售分布</h5>
                <div ref="salesChart" style="width: 100%; height: 240px;"></div>
              </div>
            </div>
            <!-- 下半部分：告警信息 -->
            <div class="alerts-section">
              <div class="section-title">销售异常告警</div>
              <div class="alert-list">
                <div class="alert-item error">
                  <el-icon><CircleCloseFilled /></el-icon>
                  <span>冻干海带库存不足，影响销售</span>
                  <span class="alert-time">11:30</span>
                </div>
                <div class="alert-item warning">
                  <el-icon><WarningFilled /></el-icon>
                  <span>鲑鱼销量下滑，需要关注</span>
                  <span class="alert-time">10:15</span>
                </div>
                <div class="alert-item info">
                  <el-icon><InfoFilled /></el-icon>
                  <span>新产品上市提醒</span>
                  <span class="alert-time">09:20</span>
                </div>
                <div class="alert-item warning">
                  <el-icon><WarningFilled /></el-icon>
                  <span>线上渠道订单处理延迟</span>
                  <span class="alert-time">09:00</span>
                </div>
                <div class="alert-item error">
                  <el-icon><CircleCloseFilled /></el-icon>
                  <span>客户投诉率上升</span>
                  <span class="alert-time">08:45</span>
                </div>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import * as echarts from 'echarts'
import { WarningFilled, CircleCloseFilled, InfoFilled } from '@element-plus/icons-vue'

const warehouseChart = ref(null)
const productionChart = ref(null)
const salesChart = ref(null)

const customColors = [
  {color: '#67c23a', percentage: 60},
  {color: '#e6a23c', percentage: 80},
  {color: '#f56c6c', percentage: 100}
]

onMounted(() => {
  // 初始化销售图表
  const sales = echarts.init(salesChart.value)
  sales.setOption({
    title: {
      text: '',
      left: 'center',
      top: 10,
      textStyle: {
        fontSize: 16,
        fontWeight: 'normal',
        color: '#2c3e50'
      }
    },
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c}% ({d}%)',
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      borderColor: '#eee',
      borderWidth: 1,
      textStyle: {
        color: '#666'
      },
      padding: [8, 12]
    },
    legend: {
      orient: 'vertical',
      left: '5%',
      top: 'middle',
      itemWidth: 10,
      itemHeight: 10,
      itemGap: 16,
      textStyle: {
        color: '#606266',
        fontSize: 12
      }
    },
    series: [{
      name: '销售分布',
      type: 'pie',
      radius: ['40%', '70%'],
      center: ['60%', '50%'],
      avoidLabelOverlap: true,
      itemStyle: {
        borderRadius: 6,
        borderColor: '#fff',
        borderWidth: 2
      },
      label: {
        show: false
      },
      emphasis: {
        label: {
          show: true,
          fontSize: 14,
          fontWeight: 'bold',
          color: '#2c3e50'
        },
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.2)'
        }
      },
      data: [
        {
          value: 35,
          name: '鱼类',
          itemStyle: { color: '#409EFF' }
        },
        {
          value: 25,
          name: '藻类',
          itemStyle: { color: '#67C23A' }
        },
        {
          value: 20,
          name: '软体类',
          itemStyle: { color: '#E6A23C' }
        },
        {
          value: 15,
          name: '甲壳类',
          itemStyle: { color: '#F56C6C' }
        },
        {
          value: 5,
          name: '棘皮类',
          itemStyle: { color: '#909399' }
        }
      ]
    }]
  })

  // 监听窗口大小变化，调整图表大小
  window.addEventListener('resize', () => {
    sales.resize()
  })
})
</script>

<style scoped>
.production-container {
  padding: 10px;
  height: 100vh;
  background-color: #f5f7fa;
}

.full-height {
  height: 100%;
}

.box-card {
  height: 100%;
  margin-bottom: 10px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-content {
  height: calc(100% - 55px);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.metrics-section {
  flex: 6;
  min-height: 0;
  overflow-y: auto;
  padding: 16px;
  border-bottom: 1px solid #ebeef5;
}

.alerts-section {
  flex: 4;
  min-height: 0;
  overflow-y: auto;
  padding: 16px;
}

/* 自定义滚动条样式 */
.metrics-section::-webkit-scrollbar,
.alerts-section::-webkit-scrollbar {
  width: 6px;
}

.metrics-section::-webkit-scrollbar-thumb,
.alerts-section::-webkit-scrollbar-thumb {
  background-color: #c0c4cc;
  border-radius: 3px;
}

.metrics-section::-webkit-scrollbar-track,
.alerts-section::-webkit-scrollbar-track {
  background-color: #f5f7fa;
}

/* 确保内容不会被滚动条遮挡 */
.metrics-section > *,
.alerts-section > * {
  padding-right: 6px;
}

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  margin-bottom: 20px;
}

.metric-item {
  text-align: center;
  padding: 12px;
  background-color: #f8f9fa;
  border-radius: 4px;
}

.metric-value {
  font-size: 24px;
  font-weight: bold;
  color: #409EFF;
  margin-bottom: 4px;
}

.metric-label {
  font-size: 14px;
  color: #666;
}

.status-section {
  margin: 16px 0;
}

.status-box {
  background-color: #f8f9fa;
  border-radius: 4px;
  padding: 12px;
}

.status-title {
  font-weight: bold;
  margin-bottom: 8px;
}

.status-content {
  font-size: 14px;
  color: #666;
}

.section-title {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 16px;
}

.alert-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.alert-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px;
  border-radius: 4px;
  background-color: #f8f9fa;
  margin-bottom: 0;
}

.alert-item.error {
  border-left: 4px solid #f56c6c;
}

.alert-item.warning {
  border-left: 4px solid #e6a23c;
}

.alert-item.info {
  border-left: 4px solid #909399;
}

.alert-item .el-icon {
  font-size: 18px;
}

.alert-item.error .el-icon {
  color: #f56c6c;
}

.alert-item.warning .el-icon {
  color: #e6a23c;
}

.alert-item.info .el-icon {
  color: #909399;
}

.alert-time {
  margin-left: auto;
  font-size: 12px;
  color: #909399;
}

.chart-container {
  margin: 16px 0;
  height: 200px;
}

.chart-container > div {
  height: 100%;
}

.brief-report {
  margin: 12px 0;
  padding: 12px;
  background-color: #f8f9fa;
  border-radius: 8px;
  border-left: 4px solid #409EFF;
}

.brief-title {
  font-size: 16px;
  font-weight: bold;
  color: #2c3e50;
  margin-bottom: 12px;
}

.brief-content {
  font-size: 14px;
  color: #606266;
  line-height: 1.6;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.metric-trend {
  font-size: 12px;
  margin-top: 4px;
}

.metric-trend.up {
  color: #67c23a;
}

.metric-trend.down {
  color: #f56c6c;
}

.metric-trend.stable {
  color: #909399;
}

.area-status,
.production-lines,
.sales-channels {
  margin: 16px 0;
  padding: 16px;
  background-color: #f8f9fa;
  border-radius: 8px;
}

.area-title,
.lines-title,
.channels-title {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 16px;
  color: #2c3e50;
}

.area-grid,
.lines-grid,
.channels-grid {
  display: grid;
  gap: 16px;
}

.area-grid {
  grid-template-columns: repeat(2, 1fr);
}

.lines-grid {
  grid-template-columns: 1fr;
}

.channels-grid {
  grid-template-columns: repeat(2, 1fr);
}

.area-item,
.line-item,
.channel-item {
  background-color: #fff;
  padding: 12px;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.area-name,
.line-name,
.channel-name {
  font-weight: bold;
  margin-bottom: 8px;
}

.line-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.line-detail {
  display: flex;
  justify-content: space-between;
  margin-top: 8px;
  font-size: 12px;
  color: #606266;
}

.channel-value {
  font-size: 20px;
  font-weight: bold;
  color: #409EFF;
  margin: 8px 0;
}
</style>