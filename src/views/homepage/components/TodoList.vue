<template>
  <div>
    已完成：
    <div v-for="todo in unfinList" class="todo_item">
      <el-checkbox v-model="todo.done" />
      <div @click="handleClickText" class="todo_item_text">{{ todo.text }}</div>
    </div>
    未完成：
    <div v-for="todo in completedList" class="todo_item">
      <el-checkbox v-model="todo.done" />
      <div :class="['todo_item_text', { todo_item_text_completed: todo.done }]">
        {{ todo.text }}
      </div>
    </div>
    showDrawer:{{ showDrawer }}
    <TodoDrawer :visible="showDrawer" />
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import TodoDrawer from "./TodoDrawer.vue";
import {
  // 紧急程度
  URGENT_IMPORTANT, // 紧急 重要
  URGENT_NOT_IMPORTANT, // 紧急 不重要
  NOT_URGENT_IMPORTANT, // 不紧急 重要
  NOT_URGENT_NOT_IMPORTANT, // 不紧急 不重要
  URGENT_IMPORTANT_COLOR, // 紧急 重要color
  URGENT_NOT_IMPORTANT_COLOR, // 紧急 不重要color
  NOT_URGENT_IMPORTANT_COLOR, // 不紧急 重要color
  NOT_URGENT_NOT_IMPORTANT_COLOR, // 不紧急 不重要color
} from "@/constant/todo";

const todos = ref([]);
// 从 localStorage 读取数据
function loadTodos() {
  const storedTodos = localStorage.getItem("todos");
  if (storedTodos) {
    todos.value = JSON.parse(storedTodos);
  }
}
// 已完成list
const unfinList = computed(() => {
  return todos.value.filter((todo) => !todo.done);
});
// 已完成list
const completedList = computed(() => {
  return todos.value.filter((todo) => todo.done);
});
watch(
  todos,
  (newTodos) => {
    localStorage.setItem("todos", JSON.stringify(newTodos));
    setTimeout(() => {
      loadTodos();
    }, 0);
  },
  { deep: true }
);
const showDrawer = ref(false);
const handleClickText = () => {
  showDrawer.value = true;
}
onMounted(() => {
  loadTodos();
});
</script>

<style lang="scss" scoped>
.todo_item {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  padding: 10px;
  background: #fff;
  border-radius: 5px;
  .todo_item_text {
    margin-left: 10px;
    color: #333;
    font-size: 16px;
    cursor: pointer;
  }
  .todo_item_text_completed {
    text-decoration: line-through;
    color: #999;
    cursor: default;
  }
}
</style>
