<template>
  <div class="todo-list">
    <TodoItem
      v-for="todo in todos"
      :key="todo.id"
      :todo="todo"
      @update="$emit('update', $event)"
      @delete="$emit('delete', $event)"
      @select-task="$emit('select-task', $event)"
    />
  </div>
</template>

<script setup>
import TodoItem from './TodoItem.vue';

defineProps({
  todos: {
    type: Array,
    required: true
  }
});

defineEmits(['update', 'delete', 'select-task']);
</script> 