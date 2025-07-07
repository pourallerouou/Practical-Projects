<script setup>
import {reactive} from "vue";
import Search from "@element-plus/icons-vue";
import axios from "axios"

const data = reactive({
  name: null,
  pageNum: 1,
  pageSize: 5,
  total: 6,
  tableData: [

  ]
})

axios.get("http://localhost:8080/Fishery").then((res) => {
  console.log(res)
})


</script>

<template>

</template>

<style scoped>

</style>