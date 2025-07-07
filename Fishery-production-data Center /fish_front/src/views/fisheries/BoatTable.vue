<script setup>
import { ref, onMounted } from 'vue';
import axios from "axios";

const Boat_data = ref([]);

onMounted(() => {
  axios.get("http://localhost:8080/boat").then(res => {
    console.log(res.data);
    Boat_data.value = res.data; // 注意 .value
  });
});
</script>

<template>
  <div class="card"  style="height: 370px">
    <div class="py-1" style="text-align: center;  align-items: center;"><h5>渔船数据</h5></div>
    <el-table :data="boat_data" style="width: 100%" :hearder-cell-style="{fontWeight:'bold',color:'black'}">
      <el-table-column prop="boat_id" label="渔船编号" />
      <el-table-column prop="boat_name" label="渔船名"/>
      <el-table-column prop="boat_mater" label="船长"/>
      <el-table-column prop="boat_power" label="动力系统" />
      <el-table-column prop="boat_material" label="船体材质"/>
      <el-table-column prop="boat_length" label="长度"/>
      <el-table-column prop="boat_load" label="载重" />
      <el-table-column prop="boat_tonage" label="排水量" />
      <el-table-column prop="boat_range" label="航程"/>
      <el-table-column prop="boat_equip" label="装备"/>
      <el-table-column prop="boat_function" label="功能" />
      <el-table-column prop="boat_tel" label="联系方式"/>
    </el-table>
  </div>
</template>

<style scoped>

</style>