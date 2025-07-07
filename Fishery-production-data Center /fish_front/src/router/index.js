import { createRouter, createWebHistory } from 'vue-router'


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', redirect: '/main/fishery' },
    { path: '/main',component: import('../views/Main.vue'),
    children: [
      {path: 'fishery', component: import('../views/fishery.vue'),},
      {path: 'department', component: import('../views/Department.vue'),},
      {path: '/catchtrans', component: import('../views/CatchTrans.vue'),},
      {path: '/productionsale', component: import('../views/ProductionSale.vue'),},
      {path: 'table', component: import('../views/fisheries/FisheryTable.vue'),},
      {path: 'drawer', component: import('../views/fisheries/drawer.vue'),},
      {path: 'page2', component: import('../views/Page2.vue'),},

    ]},
    {path: '/data', component: import('../views/DataPage.vue'),},
    {path: '/catchtrans', component: import('../views/CatchTrans.vue'),},
    {path: '/productionsale', component: import('../views/ProductionSale.vue'),},
    {path: '/weather', component: import('../views/Weathertest.vue'),},
    {path: '/chart', component: import('../views/Chart.vue'),},
    {path: '/fis', component: import('../views/fis.vue'),},
    {path: '/page3', component: import('../views/Page3.vue'),},
    {path: '/page4', component: import('../views/Page4.vue'),},
    {path: '/table', component: import('../views/table.vue'),},
    { path: '/notFound',component: import('../views/404.vue'),},
    { path: '/:pathMatch(.*)',redirect:'/notFound',}
  ],
})

export default router
