<template>
  <div class="fishery-table-container">
    <!-- 搜索框 -->
    <el-input
        v-model="searchQuery"
        placeholder="输入关键词全局搜索"
        clearable
        style="margin-bottom: 20px"
        @input="handleSearch"
    />

    <!-- 数据表格 -->
    <el-table
        :data="filteredData"
        border
        style="width: 100%"
        height="400"
        v-loading="loading"
    >
      <el-table-column prop="fsy_id" label="渔场编号" />
      <el-table-column prop="fsy_name" label="渔场名" />
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
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import axios from 'axios'

// 状态管理
const fisheryData = ref([]) // 原始数据
const filteredData = ref([]) // 过滤后数据
const loading = ref(false)
const searchQuery = ref('')

// 获取数据
const fetchData = async () => {
  try {
    loading.value = true
    const response = await axios.get('http://localhost:8080/select')
    fisheryData.value = response.data
    filteredData.value = [...fisheryData.value] // 初始化过滤数据
  } catch (error) {
    console.error('数据获取失败:', error)
    ElMessage.error('数据加载失败')
  } finally {
    loading.value = false
  }
}

// 全局模糊搜索
const handleSearch = () => {
  if (!searchQuery.value) {
    filteredData.value = [...fisheryData.value]
    return
  }

  const query = searchQuery.value.toLowerCase()
  filteredData.value = fisheryData.value.filter(item => {
    return Object.values(item).some(
        value => value && value.toString().toLowerCase().includes(query)
    )
  })
}

// 生命周期钩子
onMounted(() => {
  fetchData()
})
</script>

<style scoped>
.fishery-table-container {
  padding: 20px;
  background-color: #f5f7fa;
}
</style>