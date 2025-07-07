<template>
  <div>
    <button @click="openDrawer('fishery')">渔务中心</button>
    <button @click="openDrawer('water')">水质中心</button>
    <button @click="openDrawer('tran')">运输中心</button>
    <button @click="openDrawer('ship')">船务中心</button>
    <button @click="openDrawer('dock')">码头中心</button>
    <button @click="openDrawer('mess')">消息中心</button>

    <DrawerFisheryCenter v-model="drawerFisheryCenter" />
    <DrawerWaterCenter v-model="drawerWaterCenter" />
    <DrawerTranCenter v-model="drawerTranCenter" />
    <DrawerDockCenter v-model="drawerDockCenter" />
    <DrawerShipCenter v-model="drawerShipCenter" />
    <DrawerMessCenter v-model="drawerMessCenter" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import DrawerFisheryCenter from './fisheries/FisheryCenter.vue'
import DrawerWaterCenter from './fisheries/WaterCenter.vue'
import DrawerTranCenter from './fisheries/TranCenter.vue'
import DrawerDockCenter from './fisheries/DockCenter.vue'
import DrawerShipCenter from './fisheries/ShipCenter.vue'
import DrawerMessCenter from './fisheries/MessCenter.vue'

const drawerFisheryCenter = ref(false)
const drawerWaterCenter = ref(false)
const drawerTranCenter = ref(false)
const drawerDockCenter = ref(false)
const drawerShipCenter = ref(false)
const drawerMessCenter = ref(false)

const openDrawer = (type) => {
  switch(type.toLowerCase()) {
    case 'fishery': drawerFisheryCenter.value = true; break
    case 'water': drawerWaterCenter.value = true; break
    case 'tran': drawerTranCenter.value = true; break
    case 'dock': drawerDockCenter.value = true; break
    case 'ship': drawerShipCenter.value = true; break
    case 'mess': drawerMessCenter.value = true; break
  }
}
</script>