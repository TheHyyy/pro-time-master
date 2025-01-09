<template>
  <el-form :model="todoForm" @submit.prevent="handleSubmit">
    <el-form-item>
      <el-input v-model="todoForm.title" placeholder="请输入任务名称" />
    </el-form-item>
    
    <el-form-item label="任务优先级">
      <el-radio-group v-model="todoForm.quadrant">
        <el-radio-button 
          v-for="option in priorityOptions" 
          :key="option.value" 
          :label="option.value"
        >
          {{ option.label1 }} {{ option.label2 }}
        </el-radio-button>
      </el-radio-group>
    </el-form-item>

    <el-form-item>
      <el-button type="primary" @click="handleSubmit">添加任务</el-button>
    </el-form-item>
  </el-form>
</template>

<script setup>
import { ref } from 'vue';
import { priorityOptions } from '@/data/todoOptions';

const todoForm = ref({
  title: '',
  quadrant: '4' // 默认为不紧急不重要
});

const emit = defineEmits(['add']);

const handleSubmit = () => {
  if (!todoForm.value.title.trim()) {
    ElMessage.warning('请输入任务名称');
    return;
  }

  emit('add', { ...todoForm.value });
  todoForm.value.title = '';
};
</script>
