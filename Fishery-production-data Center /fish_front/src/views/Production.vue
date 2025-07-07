<template>
  <div class="warehouse-container">
    <!-- 左侧仓库管理部分 -->
    <div class="left-section">
      <!-- 上半部分：仓库存货表和分布图 -->
      <div class="card-group">
        <el-card class="card-item">
          <div slot="header" class="card-header">
            <span>仓库存货表</span>
          </div>
          <el-table :data="inventoryTable" style="width: 100%" height="250">
            <el-table-column prop="name" label="货物名称"></el-table-column>
            <el-table-column prop="quantity" label="数量"></el-table-column>
            <el-table-column prop="location" label="位置"></el-table-column>
          </el-table>
        </el-card>

        <el-card class="card-item">
          <div slot="header" class="card-header">
            <span>货物存量分布图</span>
          </div>
          <div class="chart-container">
            <!-- 这里放置图表，实际项目中可以使用 ECharts -->
            <div class="mock-chart">
              <div v-for="item in inventoryChartData" :key="item.name" class="chart-item">
                <div class="chart-bar" :style="{height: item.value/10 + 'px'}"></div>
                <div class="chart-label">{{item.name}}</div>
              </div>
            </div>
          </div>
        </el-card>
      </div>

      <!-- 下半部分：进出库记录表和分布图 -->
      <div class="card-group">
        <el-card class="card-item">
          <div slot="header" class="card-header">
            <span>仓库进出库记录表</span>
          </div>
          <el-table :data="inOutRecords" style="width: 100%" height="250">
            <el-table-column prop="date" label="日期"></el-table-column>
            <el-table-column prop="type" label="类型"></el-table-column>
            <el-table-column prop="name" label="货物名称"></el-table-column>
            <el-table-column prop="quantity" label="数量"></el-table-column>
          </el-table>
        </el-card>

        <el-card class="card-item">
          <div slot="header" class="card-header">
            <span>进出库货物分布图</span>
          </div>
          <div class="chart-container">
            <!-- 这里放置图表 -->
            <div class="mock-pie-chart">
              <div class="pie-chart"></div>
              <div class="pie-legend">
                <div v-for="item in inOutChartData" :key="item.name" class="legend-item">
                  <span class="legend-color" :style="{backgroundColor: item.color}"></span>
                  <span>{{item.name}}: {{item.value}}%</span>
                </div>
              </div>
            </div>
          </div>
        </el-card>
      </div>
    </div>

    <!-- 中间工厂车间部分 -->
    <div class="middle-section">
      <div class="workshop-grid">
        <el-card v-for="workshop in workshops" :key="workshop.name" class="workshop-card">
          <div slot="header" class="card-header">
            <span>{{workshop.name}}</span>
          </div>
          <div class="workshop-content">
            <div class="workshop-chart">
              <!-- 车间图表 -->
              <div class="mock-mini-chart"></div>
            </div>
            <el-table :data="workshop.records" style="width: 100%" height="150">
              <el-table-column prop="date" label="日期"></el-table-column>
              <el-table-column prop="quantity" label="产量"></el-table-column>
              <el-table-column prop="worker" label="负责人"></el-table-column>
            </el-table>
          </div>
        </el-card>
      </div>
    </div>

    <!-- 右侧销售和经销商部分 -->
    <div class="right-section">
      <!-- 销售订单 -->
      <div class="card-group">
        <el-card class="card-item">
          <div slot="header" class="card-header">
            <span>销售订单</span>
          </div>
          <el-table :data="salesOrders" style="width: 100%" height="250">
            <el-table-column prop="id" label="订单号"></el-table-column>
            <el-table-column prop="product" label="产品"></el-table-column>
            <el-table-column prop="quantity" label="数量"></el-table-column>
            <el-table-column prop="amount" label="金额"></el-table-column>
          </el-table>
        </el-card>

        <el-card class="card-item">
          <div slot="header" class="card-header">
            <span>本月销量</span>
          </div>
          <div class="chart-container">
            <!-- 销售图表 -->
            <div class="mock-line-chart"></div>
          </div>
        </el-card>
      </div>

      <!-- 经销商 -->
      <div class="card-group">
        <el-card class="card-item">
          <div slot="header" class="card-header">
            <span>经销商</span>
          </div>
          <el-table :data="dealers" style="width: 100%" height="250">
            <el-table-column prop="id" label="编号"></el-table-column>
            <el-table-column prop="name" label="名称"></el-table-column>
            <el-table-column prop="contact" label="联系人"></el-table-column>
            <el-table-column prop="phone" label="电话"></el-table-column>
          </el-table>
        </el-card>

        <el-card class="card-item">
          <div slot="header" class="card-header">
            <span>经销商分布</span>
          </div>
          <div class="chart-container">
            <!-- 经销商分布图表 -->
            <div class="mock-map-chart"></div>
          </div>
        </el-card>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 仓库存货表数据
      inventoryTable: [
        { name: '带鱼', quantity: '100kg', location: 'A区1排' },
        { name: '石斑鱼', quantity: '500kg', location: 'B区2排' },
        { name: '蜡鱼', quantity: '250kg', location: 'C区3排' },
        { name: '胡椒', quantity: '50kg', location: 'D区1排' },
        { name: '其他', quantity: '100kg', location: 'E区2排' }
      ],

      // 货物存量分布图数据
      inventoryChartData: [
        { name: '带鱼', value: 100 },
        { name: '石斑鱼', value: 500 },
        { name: '蜡鱼', value: 250 },
        { name: '胡椒', value: 50 },
        { name: '其他', value: 100 }
      ],

      // 进出库记录
      inOutRecords: [
        { date: '2023-05-01', type: '入库', name: '带鱼', quantity: '100kg' },
        { date: '2023-05-02', type: '出库', name: '石斑鱼', quantity: '50kg' },
        { date: '2023-05-03', type: '入库', name: '蜡鱼', quantity: '250kg' },
        { date: '2023-05-04', type: '出库', name: '胡椒', quantity: '10kg' },
        { date: '2023-05-05', type: '入库', name: '其他', quantity: '100kg' }
      ],

      // 进出库分布图数据
      inOutChartData: [
        { name: '带鱼', value: 20, color: '#409EFF' },
        { name: '石斑鱼', value: 35, color: '#67C23A' },
        { name: '蜡鱼', value: 25, color: '#E6A23C' },
        { name: '胡椒', value: 10, color: '#F56C6C' },
        { name: '其他', value: 10, color: '#909399' }
      ],

      // 车间数据
      workshops: [
        {
          name: '初加工车间',
          records: [
            { date: '2023-05-01', quantity: '200kg', worker: '张涛' },
            { date: '2023-05-02', quantity: '180kg', worker: '李四' }
          ]
        },
        {
          name: '分割车间',
          records: [
            { date: '2023-05-01', quantity: '150kg', worker: '王五' },
            { date: '2023-05-02', quantity: '160kg', worker: '赵六' }
          ]
        },
        {
          name: '腌制车间',
          records: [
            { date: '2023-05-01', quantity: '120kg', worker: '钱七' },
            { date: '2023-05-02', quantity: '130kg', worker: '孙八' }
          ]
        },
        {
          name: '内包装车间',
          records: [
            { date: '2023-05-01', quantity: '100件', worker: '周九' },
            { date: '2023-05-02', quantity: '110件', worker: '吴十' }
          ]
        },
        {
          name: '速冻车间',
          records: [
            { date: '2023-05-01', quantity: '90件', worker: '郑十一' },
            { date: '2023-05-02', quantity: '95件', worker: '王十二' }
          ]
        },
        {
          name: '外包装车间',
          records: [
            { date: '2023-05-01', quantity: '80箱', worker: '张十三' },
            { date: '2023-05-02', quantity: '85箱', worker: '李十四' }
          ]
        }
      ],

      // 销售订单数据
      salesOrders: [
        { id: 'y-9839', product: '带鱼', quantity: '100kg', amount: '￥7232' },
        { id: 'y-8392', product: '石斑鱼', quantity: '500kg', amount: '￥379' },
        { id: 'y-8393', product: '蜡鱼', quantity: '250kg', amount: '￥8234' },
        { id: 'y-8391', product: '胡椒', quantity: '50kg', amount: '￥500' }
      ],

      // 经销商数据
      dealers: [
        { id: '2300091', name: '渔场A', contact: '张涛', phone: '13800138001' },
        { id: '2390012', name: '渔场B', contact: '于蓝', phone: '13800138002' },
        { id: '2389898', name: '渔场C', contact: '胡新', phone: '13800138003' }
      ]
    }
  }
}
</script>

<style scoped>
.warehouse-container {
  display: flex;
  height: 100vh;
  padding: 10px;
  box-sizing: border-box;
  background-color: #f5f7fa;
}

.left-section, .right-section {
  flex: 7;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.middle-section {
  flex: 10;
  margin: 0 10px;
}

.card-group {
  display: flex;
  flex-direction: column;
  gap: 10px;
  height: 50%;
}

.card-item {
  flex: 1;
  overflow: hidden;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.card-header {
  font-weight: bold;
  font-size: 16px;
}

.chart-container {
  height: 250px;
  display: flex;
  justify-content: center;
  align-items: center;
}

/* 模拟图表样式 */
.mock-chart {
  display: flex;
  justify-content: space-around;
  align-items: flex-end;
  height: 200px;
  width: 100%;
  padding: 20px;
}

.chart-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.chart-bar {
  width: 30px;
  background-color: #409EFF;
  margin-bottom: 10px;
}

.chart-label {
  font-size: 12px;
}

.mock-pie-chart {
  display: flex;
  width: 100%;
  height: 100%;
}

.pie-chart {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  background: conic-gradient(
      #409EFF 0% 20%,
      #67C23A 20% 55%,
      #E6A23C 55% 80%,
      #F56C6C 80% 90%,
      #909399 90% 100%
  );
}

.pie-legend {
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-left: 20px;
}

.legend-item {
  display: flex;
  align-items: center;
  margin: 5px 0;
  font-size: 12px;
}

.legend-color {
  display: inline-block;
  width: 12px;
  height: 12px;
  margin-right: 5px;
  border-radius: 2px;
}

.mock-line-chart, .mock-map-chart {
  width: 100%;
  height: 200px;
  background-color: #f0f2f5;
  border-radius: 4px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #909399;
}

/* 车间网格布局 */
.workshop-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: repeat(3, 1fr);
  gap: 10px;
  height: 100%;
}

.workshop-card {
  border-radius: 8px;
  overflow: hidden;
}

.workshop-content {
  display: flex;
  flex-direction: column;
  height: calc(100% - 40px);
}

.workshop-chart {
  flex: 1;
  margin-bottom: 10px;
}

.mock-mini-chart {
  width: 100%;
  height: 100px;
  background-color: #f0f2f5;
  border-radius: 4px;
}
</style>