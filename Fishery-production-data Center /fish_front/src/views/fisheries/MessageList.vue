<template>
  <div class="message-list">
    <el-card
        v-for="message in messages"
        :key="message.id"
        shadow="hover"
        class="message-card"
        @click="$emit('item-click', message)"
    >
      <div class="message-card-content">
        <el-avatar :src="message.avatar" :size="50"></el-avatar>
        <div class="message-info">
          <div class="message-title">
            <span>{{ message.title }}</span>
            <el-tag v-if="message.unread" type="danger" size="small">{{ message.unread }}</el-tag>
          </div>
          <div class="message-preview">{{ message.content }}</div>
          <div class="message-meta">
            <span class="sender">{{ message.sender }}</span>
            <span class="time">{{ message.time }}</span>
          </div>
        </div>
      </div>
    </el-card>

    <el-empty v-if="messages.length === 0" description="暂无消息"></el-empty>
  </div>
</template>

<script setup>
defineProps({
  messages: {
    type: Array,
    default: () => []
  }
})

defineEmits(['item-click'])
</script>

<style scoped>
.message-list {
  height: 100%;
  overflow-y: auto;
  padding: 10px;
}

.message-card {
  margin-bottom: 15px;
  cursor: pointer;
  transition: all 0.3s;
}

.message-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.message-card-content {
  display: flex;
}

.message-info {
  flex: 1;
  margin-left: 15px;
}

.message-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 5px;
  font-weight: bold;
}

.message-preview {
  color: #606266;
  font-size: 14px;
  margin-bottom: 5px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

.message-meta {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #909399;
}
</style>