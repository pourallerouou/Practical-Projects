<template>
  <el-drawer
      v-model="visible"
      title="消息中心"
      direction="rtl"
      size="50%"
      :with-header="true"
      destroy-on-close
      class="message-center-drawer"
  >
    <div class="drawer-content">
      <div class="header">
        <h2>企业消息中心</h2>
        <el-button @click="closeDrawer" type="primary" size="small">返回主页</el-button>
      </div>

      <div class="message-container">
        <!-- 消息分类标签页 -->
        <el-tabs v-model="activeTab" type="card" class="message-tabs">
          <el-tab-pane label="重要置顶" name="important">
            <message-list :messages="importantMessages" @item-click="enterChatRoom" />
          </el-tab-pane>
          <el-tab-pane label="总部消息" name="headquarters">
            <message-list :messages="headquartersMessages" @item-click="enterChatRoom" />
          </el-tab-pane>
          <el-tab-pane label="车队消息" name="fleet">
            <message-list :messages="fleetMessages" @item-click="enterChatRoom" />
          </el-tab-pane>
          <el-tab-pane label="码头消息" name="dock">
            <message-list :messages="dockMessages" @item-click="enterChatRoom" />
          </el-tab-pane>
          <el-tab-pane label="渔船消息" name="ship">
            <message-list :messages="shipMessages" @item-click="enterChatRoom" />
          </el-tab-pane>
          <el-tab-pane label="渔场消息" name="fishery">
            <message-list :messages="fisheryMessages" @item-click="enterChatRoom" />
          </el-tab-pane>
          <el-tab-pane label="生产车间" name="workshop">
            <message-list :messages="workshopMessages" @item-click="enterChatRoom" />
          </el-tab-pane>
          <el-tab-pane label="其他消息" name="others">
            <message-list :messages="otherMessages" @item-click="enterChatRoom" />
          </el-tab-pane>
        </el-tabs>

        <!-- 聊天室对话框 -->
        <div v-if="currentChatRoom" class="chat-room-container">
          <div class="chat-room-header">
            <h3>{{ currentChatRoom.title }}</h3>
            <el-button @click="exitChatRoom" type="text" icon="el-icon-close"></el-button>
          </div>

          <div class="chat-messages" ref="chatMessages">
            <div v-for="(msg, index) in currentChatRoom.messages" :key="index" class="message-item">
              <div class="message-content" :class="{ 'is-me': msg.isMe }">
                <div class="message-avatar">
                  <el-avatar :src="msg.avatar" :size="40"></el-avatar>
                </div>
                <div class="message-body">
                  <div class="message-info">
                    <span class="sender">{{ msg.sender }}</span>
                    <span class="time">{{ msg.time }}</span>
                  </div>
                  <div class="message-text" v-html="msg.content"></div>
                </div>
              </div>
            </div>
          </div>

          <div class="message-editor">
            <el-input
                v-model="newMessage"
                type="textarea"
                :rows="3"
                placeholder="输入消息内容..."
                resize="none"
            ></el-input>
            <div class="editor-toolbar">
              <el-button-group>
                <el-button size="small" @click="insertEmoji">😊</el-button>
                <el-button size="small" @click="insertImage">图片</el-button>
                <el-button size="small" @click="insertFile">文件</el-button>
              </el-button-group>
              <el-button type="primary" size="small" @click="sendMessage">发送</el-button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </el-drawer>
</template>

<script setup>
import { ref, computed, onMounted, watch, nextTick } from 'vue'
import MessageList from './MessageList.vue'

const props = defineProps({
  modelValue: Boolean
})

const emit = defineEmits(['update:modelValue'])

// 控制抽屉显示
const visible = computed({
  get() {
    return props.modelValue
  },
  set(value) {
    emit('update:modelValue', value)
  }
})

// 关闭抽屉
const closeDrawer = () => {
  visible.value = false
}

// 消息分类标签
const activeTab = ref('important')

// 模拟消息数据
const importantMessages = ref([
  { id: 1, title: '系统维护通知', content: '今晚22:00-24:00系统将进行维护升级', sender: '系统管理员', time: '2023-05-10 09:30', unread: 3, avatar: 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png' },
  // 更多数据...
])

const headquartersMessages = ref([
  { id: 2, title: '月度经营会议', content: '请各部门负责人准备5月份经营分析报告', sender: '总经理办公室', time: '2023-05-09 14:20', unread: 0, avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png' },
  // 更多数据...
])

// 其他分类消息数据...
const fleetMessages = ref([])
const dockMessages = ref([])
const shipMessages = ref([])
const fisheryMessages = ref([])
const workshopMessages = ref([])
const otherMessages = ref([])

// 当前聊天室
const currentChatRoom = ref(null)
const newMessage = ref('')
const chatMessages = ref(null)

// 进入聊天室
const enterChatRoom = (message) => {
  currentChatRoom.value = {
    id: message.id,
    title: message.title,
    messages: [
      {
        id: 1,
        sender: message.sender,
        content: message.content,
        time: message.time,
        avatar: message.avatar,
        isMe: false
      },
      {
        id: 2,
        sender: '我',
        content: '收到，我们会按时准备',
        time: '2023-05-10 10:15',
        avatar: 'https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png',
        isMe: true
      }
      // 更多聊天记录...
    ]
  }

  // 标记为已读
  message.unread = 0
}

// 退出聊天室
const exitChatRoom = () => {
  currentChatRoom.value = null
}

// 发送消息
const sendMessage = () => {
  if (!newMessage.value.trim()) return

  const now = new Date()
  const timeStr = `${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}`

  currentChatRoom.value.messages.push({
    id: Date.now(),
    sender: '我',
    content: newMessage.value,
    time: timeStr,
    avatar: 'https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png',
    isMe: true
  })

  newMessage.value = ''

  // 滚动到底部
  nextTick(() => {
    chatMessages.value.scrollTop = chatMessages.value.scrollHeight
  })
}

// 插入表情
const insertEmoji = () => {
  newMessage.value += '😊'
}

// 插入图片
const insertImage = () => {
  // 实际项目中这里应该是文件上传逻辑
  newMessage.value += '[图片]'
}

// 插入文件
const insertFile = () => {
  // 实际项目中这里应该是文件上传逻辑
  newMessage.value += '[文件]'
}

// 生命周期
onMounted(() => {
  // 可以在这里加载消息数据
})
</script>

<style scoped>
.message-center-drawer {
  position: relative;
}

.drawer-content {
  padding: 20px;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.message-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.message-tabs {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.chat-room-container {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #fff;
  display: flex;
  flex-direction: column;
  z-index: 10;
}

.chat-room-header {
  padding: 15px;
  border-bottom: 1px solid #ebeef5;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.chat-messages {
  flex: 1;
  padding: 15px;
  overflow-y: auto;
  background-color: #f5f5f5;
}

.message-item {
  margin-bottom: 15px;
}

.message-content {
  display: flex;
  max-width: 80%;
}

.message-content.is-me {
  margin-left: auto;
  flex-direction: row-reverse;
}

.message-avatar {
  margin-right: 10px;
}

.message-content.is-me .message-avatar {
  margin-right: 0;
  margin-left: 10px;
}

.message-body {
  flex: 1;
}

.message-info {
  margin-bottom: 5px;
  font-size: 12px;
  color: #909399;
}

.message-content.is-me .message-info {
  text-align: right;
}

.message-text {
  padding: 10px 15px;
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  word-break: break-word;
}

.message-content.is-me .message-text {
  background-color: #d9ecff;
}

.message-editor {
  padding: 15px;
  border-top: 1px solid #ebeef5;
  background-color: #fff;
}

.editor-toolbar {
  margin-top: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>