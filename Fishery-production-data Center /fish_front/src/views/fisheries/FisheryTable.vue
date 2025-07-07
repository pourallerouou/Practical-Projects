<script setup>
import { ref, onMounted } from 'vue';
import axios from "axios";

const fishery_data = ref([]);

onMounted(() => {
  axios.get("http://localhost:8080/select").then(res => {
    console.log(res.data);
    fishery_data.value = res.data; // 注意 .value
  });
});
</script>


<template >
  <div class="card"  style="height: 370px">
    <div class="py-1" style="text-align: center;  align-items: center;">
      <h5>渔场数据</h5>
    </div>
    <el-table :data="fishery_data" style="width: 100%" :hearder-cell-style="{fontWeight:'bold',color:'black'}">
      <el-table-column prop="fsy_id" label="渔场编号" width="180" />
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
  </div>
</template>

<style scoped>

</style>