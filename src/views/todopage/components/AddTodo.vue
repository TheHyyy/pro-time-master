<template>
  <div class="add-todo">
    <el-input
      v-model="localTodo.title"
      placeholder="在'任务'中添加一个任务，按'回车'键保存"
      @keyup.enter="saveTodo"
    >
      <template #prepend>
        <el-select
          v-model="localTodo.priority"
          placeholder="优先级"
          style="width: 110px"
        >
          <el-option
            v-for="item in priorityOptions"
            :key="item.value"
            :label="item.label1 + item.label2"
            :value="item.value"
          >
            <div class="priority-option">
              <el-tag :color="item.color" size="small">
                {{ item.label1 }}{{ item.label2 }}
              </el-tag>
            </div>
          </el-option>
        </el-select>
      </template>
      
      <template #append>
        <el-popover
          placement="top"
          trigger="hover"
          content="预计番茄钟数量"
        >
          <template #reference>
            <el-input-number 
              v-model="localTodo.estimatedPomodoros"
              :min="1"
              :max="10"
              size="small"
              style="width: 100px"
            />
          </template>
        </el-popover>
        
        <el-date-picker
          v-model="localTodo.dueDate"
          type="date"
          placeholder="截止日期"
          size="small"
          :shortcuts="dateShortcuts"
        />
      </template>
    </el-input>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { priorityOptions } from '@/data/todoOptions';

const emit = defineEmits(['add']);

const dateShortcuts = [
  {
    text: '今天',
    value: new Date(),
  },
  {
    text: '明天',
    value: () => {
      const date = new Date();
      date.setTime(date.getTime() + 3600 * 1000 * 24);
      return date;
    },
  },
  {
    text: '一周后',
    value: () => {
      const date = new Date();
      date.setTime(date.getTime() + 3600 * 1000 * 24 * 7);
      return date;
    },
  },
];

const localTodo = ref({
  title: '',
  priority: 4,
  estimatedPomodoros: 1,
  dueDate: null,
  completed: false,
  completedPomodoros: 0,
});

const saveTodo = () => {
  if (!localTodo.value.title.trim()) {
    ElMessage.warning('请输入任务标题');
    return;
  }

  emit('add', { ...localTodo.value });
  
  // 重置表单
  localTodo.value = {
    title: '',
    priority: 4,
    estimatedPomodoros: 1,
    dueDate: null,
    completed: false,
    completedPomodoros: 0,
  };
};
</script>

<style lang="scss" scoped>
.add-todo {
  margin-bottom: 20px;
  
  .priority-option {
    display: flex;
    align-items: center;
  }
}
</style>
