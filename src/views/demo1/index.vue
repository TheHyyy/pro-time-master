<template>
  <div>
    <h1>待办事项列表</h1>
    <input v-model="newTodo" placeholder="添加新的待办事项" />
    <button @click="addTodo">添加</button>
    <ul>
      <li v-for="(todo, index) in todos" :key="index">
        <input type="checkbox" v-model="todo.done" />
        <span v-bind:class="{ completed: todo.done }">{{ todo.text }}</span>
        <button @click="removeTodo(index)">删除</button>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref } from "vue";

const todos = ref([]);
const newTodo = ref("");

function addTodo() {
  if (newTodo.value.trim()) {
    todos.value.push({ text: newTodo.value, done: false });
    newTodo.value = "";
  }
}

function removeTodo(index) {
  todos.value.splice(index, 1);
}
</script>

<style>
.completed {
  text-decoration: line-through;
}
</style>
