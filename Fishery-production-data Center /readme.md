### 渔业生产数据管理中台项目实现（中大型）

# 项目架构
fish/
├── .idea/
├── fish_back/
│   ├── .idea/
│   ├── pom.xml
│   ├── target/
│   └── src/
│       └── main/
│           ├── java/
│           │   └── com/
│           │       └── xxxx/
│           │           └── fish_back/
│           │               ├── Fish_backApplication.java
│           │               ├── controller/
│           │               │   ├── CatchController.java
│           │               │   ├── Catch_PreController.java
│           │               │   ├── DirectController.java
│           │               │   ├── DockController.java
│           │               │   ├── FisheryController.java
│           │               │   ├── FleetController.java
│           │               │   ├── ShipController.java
│           │               │   ├── TodayDockMinController.java
│           │               │   ├── TodayFleetMinController.java
│           │               │   ├── TodayShipMinController.java
│           │               │   ├── TransController.java
│           │               │   └── WaterController.java
│           │               ├── entity/
│           │               │   ├── Catch.java
│           │               │   ├── Catch_Pre.java
│           │               │   ├── Direct.java
│           │               │   ├── Dock.java
│           │               │   ├── Fishery.java
│           │               │   ├── Fleet.java
│           │               │   ├── Ship.java
│           │               │   ├── TodayDockMin.java
│           │               │   ├── TodayFleetMin.java
│           │               │   ├── TodayShipMin.java
│           │               │   ├── Trans.java
│           │               │   └── Water.java
│           │               ├── mapper/
│           │               │   ├── CatchMapper.java
│           │               │   ├── Catch_PreMapper.java
│           │               │   ├── DirectMapper.java
│           │               │   ├── DockMapper.java
│           │               │   ├── FisheryMapper.java
│           │               │   ├── FleetMapper.java
│           │               │   ├── ShipMapper.java
│           │               │   ├── TodayDockMinMapper.java
│           │               │   ├── TodayFleetMinMapper.java
│           │               │   ├── TodayShipMinMapper.java
│           │               │   ├── TransMapper.java
│           │               │   └── WaterMapper.java
│           │               └── service/
│           │                   └── FisheryService.java
│           └── resources/
│               ├── application.yml
│               └── sql/
├── fish_front/
│   ├── .idea/
│   ├── dist/
│   ├── node_modules/
│   ├── package.json
│   ├── package-lock.json
│   ├── vite.config.js
│   ├── index.html
│   ├── jsconfig.json
│   ├── public/
│   └── src/
│       ├── main.js
│       ├── App.vue
│       ├── assets/
│       │   ├── css/
│       │   │   ├── global.css
│       │   │   └── index.scss
│       │   ├── data/
│       │   │   ├── fishery_1.json
│       │   │   ├── fishery_min_1.json
│       │   │   ├── fishery_min_2.json
│       │   │   ├── fishery_min_3.json
│       │   │   ├── fleet_min_1.json
│       │   │   ├── ship_min_1.json
│       │   │   └── wharf_min_1.json
│       │   ├── img/
│       │   │   ├── 404.jpg
│       │   │   ├── cry.jpeg
│       │   │   ├── happy.jpg
│       │   │   ├── logo.svg
│       │   │   ├── mylog.jpg
│       │   │   ├── peace.webp
│       │   │   └── 普陀.png
│       │   ├── leaflet/
│       │   │   ├── images/
│       │   │   ├── leaflet.css
│       │   │   ├── leaflet.js
│       │   │   ├── leaflet.js.map
│       │   │   ├── leaflet-src.esm.js
│       │   │   ├── leaflet-src.esm.js.map
│       │   │   ├── leaflet-src.js
│       │   │   └── leaflet-src.js.map
│       │   ├── video/
│       │   └── dependency/
│       ├── components/
│       ├── router/
│       │   └── index.js
│       └── views/
│           ├── 404.vue
│           ├── About.vue
│           ├── CatchTrans.vue
│           ├── Chart.vue
│           ├── DataPage.vue
│           ├── Department.vue
│           ├── Fishery.vue
│           ├── Home.vue
│           ├── Main.vue
│           ├── Manager.vue
│           ├── Page2.vue
│           ├── Page3.vue
│           ├── Page4.vue
│           ├── Production.vue
│           ├── ProductionSale.vue
│           ├── Weathertest.vue
│           ├── departments/
│           │   ├── MarkingCenter.vue
│           │   ├── ProducingCenter.vue
│           │   └── WarehouseCenter.vue
│           ├── fisheries/
│           │   ├── BoatTable.vue
│           │   ├── DockCenter.vue
│           │   ├── DrawerA.vue
│           │   ├── FisheryCenter.vue
│           │   ├── FisheryTable.vue
│           │   ├── MessCenter.vue
│           │   ├── MessageList.vue
│           │   ├── ShipCenter.vue
│           │   ├── TranCenter.vue
│           │   ├── WaterCenter.vue
│           │   └── drawer.vue
│           ├── fis.vue
│           ├── table.vue
│           └── test.vue


# 技术栈

1. 后端（fish_back）
	核心框架：Spring Boot 3.0.2
	JDK版本：Java 17
	ORM框架：MyBatis-Plus
	数据库：MySQL（通过 mysql-connector-j 连接）
	分页插件：PageHelper
	JSON处理：Gson
	测试：spring-boot-starter-test
	代码简化：Lombok
	构建工具：Maven
	
2. 前端（fish_front）
	核心框架：Vue 3
	路由管理：vue-router
	UI组件库：Element Plus、Bootstrap
	数据可视化：ECharts
	地图可视化：Leaflet
	HTTP请求：Axios
	构建工具：Vite
	自动导入插件：unplugin-auto-import、unplugin-vue-components
	样式预处理：Sass

# 项目特点

前后端分离：采用 Spring Boot 3 + Vue 3 的主流分层架构，易于维护和扩展。
现代前端技术：使用 Vite 作为构建工具，开发体验和构建速度快；Vue 3 组合式 API 更易于大型项目管理。
丰富的可视化能力：集成 ECharts 和 Leaflet，适合渔业生产数据的图表和地理信息展示。
UI体验良好：Element Plus + Bootstrap，界面美观且组件丰富。
高效开发：Lombok 简化 Java 代码，MyBatis-Plus 提高数据库操作效率，自动导入插件提升前端开发效率。
分页与大数据处理：PageHelper 支持后端高效分页，适合数据量较大的业务场景。