<template>
  <el-drawer
    :title="data ? '编辑任务' : '任务详情'"
    :model-value="visible"
    @update:model-value="$emit('update:visible')"
    :size="400"
    @close="handleClose"
  >
    <template #default>
      <el-form :model="todoForm" label-width="100px">
        <el-form-item label="任务名称">
          <el-input v-model="todoForm.title" />
        </el-form-item>

        <el-form-item label="任务描述">
          <el-input
            v-model="todoForm.description"
            type="textarea"
            rows="4"
          />
        </el-form-item>

        <el-form-item label="重要程度">
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

        <el-form-item label="完成状态">
          <el-switch
            v-model="todoForm.completed"
            active-text="已完成"
            inactive-text="未完成"
          />
        </el-form-item>

        <el-form-item label="番茄钟数">
          <el-tag type="success">已完成 {{ todoForm.pomodoroCount }} 个</el-tag>
        </el-form-item>

        <el-form-item label="创建时间">
          <span>{{ formatDate(todoForm.createdAt) }}</span>
        </el-form-item>

        <el-form-item label="更新时间">
          <span>{{ formatDate(todoForm.updatedAt) }}</span>
        </el-form-item>
      </el-form>
    </template>

    <template #footer>
      <div class="drawer-footer">
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" @click="handleSave">保存</el-button>
        <el-button type="danger" @click="handleDelete">删除</el-button>
      </div>
    </template>
  </el-drawer>
</template>

<script setup>
import { ref, watch } from 'vue';
import { priorityOptions } from '@/data/todoOptions';
import { updateTodo } from '@/api/todo';
import { ElMessage } from 'element-plus';

const props = defineProps({
  visible: Boolean,
  data: Object
});

const emit = defineEmits(['update:visible', 'update', 'delete']);

const todoForm = ref({
  title: '',
  description: '',
  quadrant: '4',
  completed: false,
  pomodoroCount: 0,
  createdAt: '',
  updatedAt: ''
});

watch(() => props.data, (newVal) => {
  if (newVal) {
    todoForm.value = { ...newVal };
  }
}, { immediate: true });

const handleClose = () => {
  emit('update:visible', false);
};

const handleSave = async () => {
  try {
    await updateTodo(todoForm.value);
    emit('update', todoForm.value);
    ElMessage.success('保存成功');
    handleClose();
  } catch (error) {
    ElMessage.error('保存失败');
  }
};

const handleDelete = () => {
  emit('delete', todoForm.value.id);
};

const formatDate = (date) => {
  if (!date) return '';
  return new Date(date).toLocaleString();
};
</script>

<style lang="scss" scoped>
.drawer-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 20px;
}
</style>
