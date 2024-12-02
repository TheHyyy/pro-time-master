<template>
  <div class="todo_item">
    <!-- 使用 v-model 双向绑定 todo.completed -->
    <el-checkbox v-model="todo.completed" @click="handleCheckboxClick" />
    <div
      :class="[
        'todo_item_title',
        { todo_item_title_completed: todo.completed },
      ]"
      @click="handleTitleClick"
    >
      {{ todo.title }}
    </div>
    <div class="todo_item_tomato"></div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from "vue";

const props = defineProps({
  todo: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(["update-status", "click-title"]);

const handleCheckboxClick = () => {
  // 当复选框点击时，通知父组件更新 todos
  emit("update-status", props.todo); // 将更新后的 todo 传递给父组件
};

const handleTitleClick = () => {
  // 通知父组件处理标题点击
  emit("click-title", props.todo);
};
</script>

<style scoped>
.todo_item {
  display: flex;
  align-items: center;
  background: #fff;
  border-radius: 5px;
  margin-bottom: 10px;
  height: 40px;
  overflow: hidden;
  border: 1px solid #eee;
  padding: 10px;
}

.todo_item_title {
  margin-left: 10px;
  color: #333;
  font-size: 16px;
  cursor: pointer;
  min-width: 200px;
}

.todo_item_title_completed {
  text-decoration: line-through;
  color: #999;
  cursor: default;
}
</style>
