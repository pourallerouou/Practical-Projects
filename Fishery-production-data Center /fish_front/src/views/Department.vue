<template>
  <div class="employee-container">
    <!-- 左侧部分 -->
    <div class="left-section">
      <!-- 上半部分：员工架构图 -->
      <el-card class="card">
        <div slot="header" class="card-header">
          <span>所有员工架构结构</span>
        </div>
        <div class="chart-container">
          <div id="org-chart" style="width: 100%; height: 400px;"></div>
        </div>
      </el-card>

      <!-- 下半部分：员工信息表 -->
      <el-card class="card">
        <div slot="header" class="card-header">
          <div class="search-container">
            <el-input
                v-model="searchQuery.name"
                placeholder="按姓名搜索"
                style="width: 150px; margin-right: 10px;"
                clearable
            ></el-input>
            <el-input
                v-model="searchQuery.employeeId"
                placeholder="按员工号搜索"
                style="width: 150px; margin-right: 10px;"
                clearable
            ></el-input>
            <el-input
                v-model="searchQuery.age"
                placeholder="按年龄搜索"
                style="width: 120px; margin-right: 10px;"
                clearable
            ></el-input>
            <el-select
                v-model="searchQuery.position"
                placeholder="按职位筛选"
                style="width: 150px; margin-right: 10px;"
                clearable
            >
              <el-option
                  v-for="item in positionOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
              ></el-option>
            </el-select>
            <el-select
                v-model="searchQuery.department"
                placeholder="按部门筛选"
                style="width: 150px;"
                clearable
            >
              <el-option
                  v-for="item in departmentOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
              ></el-option>
            </el-select>
          </div>
        </div>
        <el-table
            :data="filteredEmployees"
            style="width: 100%"
            height="400"
            @row-click="handleEmployeeClick"
        >
          <el-table-column prop="employeeId" label="员工号" width="100"></el-table-column>
          <el-table-column prop="name" label="姓名" width="120"></el-table-column>
          <el-table-column prop="gender" label="性别" width="80"></el-table-column>
          <el-table-column prop="age" label="年龄" width="80"></el-table-column>
          <el-table-column prop="department" label="部门" width="120"></el-table-column>
          <el-table-column prop="position" label="职位"></el-table-column>
        </el-table>
      </el-card>
    </div>

    <!-- 右侧部分：员工档案 -->
    <div class="right-section">
      <el-card class="card-right">
        <div slot="header" class="card-header">
          <span>员工档案详情</span>
        </div>
        <div v-if="selectedEmployee" class="employee-detail">
          <!-- 基本信息表格 -->
          <div class="detail-section py-4">
            <h5>基本信息</h5>
            <el-table :data="[selectedEmployee]" border style="width: 100%">
              <el-table-column prop="name" label="姓名" width="120"></el-table-column>
              <el-table-column prop="employeeId" label="员工号" width="120"></el-table-column>
              <el-table-column prop="gender" label="性别" width="80"></el-table-column>
              <el-table-column prop="age" label="年龄" width="80"></el-table-column>
              <el-table-column prop="department" label="部门"></el-table-column>
              <el-table-column prop="position" label="职位"></el-table-column>
            </el-table>
          </div>

          <!-- 详细信息表格 -->
          <div class="detail-section py-2">
            <h5>详细信息</h5>
            <el-table :data="[selectedEmployee]" border style="width: 100%">
              <el-table-column prop="joinDate" label="入职日期" width="120"></el-table-column>
              <el-table-column prop="phone" label="联系电话" width="150"></el-table-column>
              <el-table-column prop="email" label="邮箱"></el-table-column>
              <el-table-column prop="address" label="住址"></el-table-column>
            </el-table>
          </div>

          <!-- 绩效图表 -->
          <div class="detail-section py-2">
            <h5>绩效表现</h5>
            <div id="performance-chart" style="width: 100%; height: 250px;"></div>
          </div>
        </div>
        <div v-else class="empty-state">
          <el-empty description="请点击左侧表格中的员工查看详情"></el-empty>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script>
import * as echarts from 'echarts';

export default {
  data() {
    return {
      employees: [
        {
          employeeId: '1001',
          name: '张三',
          gender: '男',
          age: 32,
          department: '技术部',
          position: '高级工程师',
          joinDate: '2018-05-10',
          phone: '13800138001',
          email: 'zhangsan@company.com',
          address: '北京市海淀区',
          performance: [89, 92, 95, 88, 90, 93]
        },
        {
          employeeId: '1002',
          name: '李四',
          gender: '女',
          age: 28,
          department: '市场部',
          position: '市场经理',
          joinDate: '2019-03-15',
          phone: '13800138002',
          email: 'lisi@company.com',
          address: '北京市朝阳区',
          performance: [85, 88, 90, 87, 89, 91]
        },
        {
          employeeId: '1003',
          name: '王五',
          gender: '男',
          age: 35,
          department: '人事部',
          position: '人事总监',
          joinDate: '2017-08-20',
          phone: '13800138003',
          email: 'wangwu@company.com',
          address: '北京市西城区',
          performance: [90, 92, 94, 91, 93, 95]
        },
        {
          employeeId: '1004',
          name: '赵六',
          gender: '女',
          age: 26,
          department: '财务部',
          position: '会计',
          joinDate: '2020-02-10',
          phone: '13800138004',
          email: 'zhaoliu@company.com',
          address: '北京市东城区',
          performance: [88, 85, 87, 89, 86, 90]
        },
        {
          employeeId: '1005',
          name: '钱七',
          gender: '男',
          age: 30,
          department: '技术部',
          position: '前端工程师',
          joinDate: '2019-11-05',
          phone: '13800138005',
          email: 'qianqi@company.com',
          address: '北京市海淀区',
          performance: [92, 94, 96, 93, 95, 97]
        }
      ],
      searchQuery: {
        name: '',
        employeeId: '',
        age: '',
        position: '',
        department: ''
      },
      positionOptions: [
        { value: '高级工程师', label: '高级工程师' },
        { value: '市场经理', label: '市场经理' },
        { value: '人事总监', label: '人事总监' },
        { value: '会计', label: '会计' },
        { value: '前端工程师', label: '前端工程师' }
      ],
      departmentOptions: [
        { value: '技术部', label: '技术部' },
        { value: '市场部', label: '市场部' },
        { value: '人事部', label: '人事部' },
        { value: '财务部', label: '财务部' }
      ],
      selectedEmployee: null,
      orgChart: null,
      performanceChart: null
    };
  },
  computed: {
    filteredEmployees() {
      return this.employees.filter(employee => {
        return (
            (this.searchQuery.name === '' || employee.name.includes(this.searchQuery.name)) &&
            (this.searchQuery.employeeId === '' || employee.employeeId.includes(this.searchQuery.employeeId)) &&
            (this.searchQuery.age === '' || employee.age.toString().includes(this.searchQuery.age)) &&
            (this.searchQuery.position === '' || employee.position === this.searchQuery.position) &&
            (this.searchQuery.department === '' || employee.department === this.searchQuery.department)
        );
      });
    }
  },
  mounted() {
    this.initOrgChart();
    // 默认选中第一个员工
    if (this.employees.length > 0) {
      this.selectedEmployee = this.employees[0];
      this.$nextTick(() => {
        this.initPerformanceChart();
      });
    }
  },
  beforeDestroy() {
    if (this.orgChart) {
      this.orgChart.dispose();
    }
    if (this.performanceChart) {
      this.performanceChart.dispose();
    }
  },
  methods: {
    initOrgChart() {
      this.orgChart = echarts.init(document.getElementById('org-chart'));

      const option = {
        tooltip: {
          trigger: 'item',
          triggerOn: 'mousemove'
        },
        series: [
          {
            type: 'tree',
            data: [
              {
                name: '公司组织架构',
                children: [
                  {
                    name: '技术部',
                    children: [
                      { name: '张三\n高级工程师' },
                      { name: '钱七\n前端工程师' }
                    ]
                  },
                  {
                    name: '市场部',
                    children: [
                      { name: '李四\n市场经理' }
                    ]
                  },
                  {
                    name: '人事部',
                    children: [
                      { name: '王五\n人事总监' }
                    ]
                  },
                  {
                    name: '财务部',
                    children: [
                      { name: '赵六\n会计' }
                    ]
                  }
                ]
              }
            ],
            symbol: 'roundRect',
            symbolSize: [100, 30],
            orient: 'vertical',
            expandAndCollapse: true,
            initialTreeDepth: 3,
            label: {
              position: 'inside',
              rotate: 0,
              verticalAlign: 'middle',
              align: 'center',
              fontSize: 12
            },
            leaves: {
              label: {
                position: 'inside',
                rotate: 0,
                verticalAlign: 'middle',
                align: 'center'
              }
            },
            emphasis: {
              focus: 'descendant'
            },
            animationDuration: 550,
            animationDurationUpdate: 750
          }
        ]
      };

      this.orgChart.setOption(option);
    },
    initPerformanceChart() {
      if (!this.selectedEmployee) return;

      this.performanceChart = echarts.init(document.getElementById('performance-chart'));

      const option = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: ['2023-Q1', '2023-Q2', '2023-Q3', '2023-Q4', '2024-Q1', '2024-Q2'],
          axisLabel: {
            rotate: 45
          }
        },
        yAxis: {
          type: 'value',
          min: 80,
          max: 100
        },
        series: [
          {
            name: '绩效评分',
            type: 'bar',
            data: this.selectedEmployee.performance,
            itemStyle: {
              color: '#409EFF'
            },
            label: {
              show: true,
              position: 'top'
            }
          }
        ]
      };

      this.performanceChart.setOption(option);
    },
    handleEmployeeClick(row) {
      this.selectedEmployee = row;
      this.$nextTick(() => {
        this.initPerformanceChart();
      });
    }
  }
};
</script>

<style scoped>
.employee-container {
  display: flex;
  height: 100vh;
  padding: 10px;
  box-sizing: border-box;
  background-color: #f5f7fa;
}

.left-section {
  flex: 14;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.right-section {
  flex: 10;
  margin-left: 10px;
  height: 100vh;
  gap: 10px;
}

.card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 0px;
  margin-bottom: 0px;
  height: calc(50% - 5px);
  display: flex;
  flex-direction: column;
}
/* 侧卡片布局另外定义 */

.card-right {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 5px;
  margin-bottom: 0px;
  height: calc(99% - 10px);
  display: flex;
  flex-direction: column;
}

.card-header {
  font-weight: bold;
  font-size: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.chart-container {
  flex: 1;
  width: 100%;
}

.search-container {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
}

.employee-detail {
  flex: 1;
  overflow-y: auto;
}

.detail-section {
  margin-bottom: 10px;
}

.detail-section h3 {
  margin-bottom: 5px;
  color: #303133;
}

.empty-state {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}

.el-table {
  margin-top: 10px;
}

.el-table >>> .el-table__row {
  cursor: pointer;
}

.el-table >>> .el-table__row:hover {
  background-color: #f5f7fa;
}
</style>