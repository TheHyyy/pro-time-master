<template>
  <div class="todo_item">
    <!-- 使用 v-model 双向绑定 todo.completed -->
    <div class="todo_item_aside">
      <el-checkbox v-model="todo.completed" @click="handleCheckboxClick" />
    </div>

    <div class="todo_item_content">
      <div
        :class="[
          'todo_item_title',
          { todo_item_title_completed: todo.completed },
        ]"
        @click="handleTitleClick"
      >
        {{ todo.title }}
      </div>

      <el-icon class="todo_item_delete" :style="{ color: '#3f8ef7' }" @click="handleDeleteClick">
        <Close />
      </el-icon>
    </div>
  </div>
</template>
<script setup>
import { defineProps, defineEmits } from "vue";
import { Close } from "@element-plus/icons-vue";

const props = defineProps({
  todo: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(["update-status", "click-title", "delete"]);

const handleCheckboxClick = () => {
  // 当复选框点击时，通知父组件更新 todos
  emit("update-status", props.todo); // 将更新后的 todo 传递给父组件
};

const handleTitleClick = () => {
  // 通知父组件处理标题点击
  emit("click-title", props.todo);
};

// 处理删除操作，通知父组件删除
const handleDeleteClick = () => {
  console.log("🚀 ~ handleDeleteClick ~ props.todo:", props.todo);
  emit("delete", props.todo); // 向父组件发送删除事件
};
</script>
<style lang="scss" scoped>
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
.todo_item_content {
  display: flex;

  justify-content: space-between;
  width: 100%;
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

  /* 删除按钮 */
  .todo_item_delete {
    margin-left: auto; /* 将按钮推到右边 */
    margin-right: 10px;
    cursor: pointer;
  }
}
</style>
