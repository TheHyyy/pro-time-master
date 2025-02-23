<template>
  <div class="todo_item" :class="quadrantClass">
    <div class="todo_item_aside">
      <el-checkbox 
        v-model="todo.completed"
        @change="handleCheckboxClick"
      />
    </div>

    <div class="todo_item_content">
      <div class="todo_item_header">
        <div
          :class="[
            'todo_item_title',
            { todo_item_title_completed: todo.completed },
          ]"
          @click="$emit('select-task', todo)"
        >
          {{ todo.title }}
        </div>
        <el-tag :type="quadrantTagType">{{ quadrantLabel }}</el-tag>
      </div>

      <div class="todo_item_actions">
        <el-button
          v-if="!todo.completed"
          type="primary"
          size="small"
          circle
          :icon="Timer"
          @click="$emit('select-task', todo)"
        />
        <el-icon class="todo_item_delete" @click="handleDeleteClick">
          <Close />
        </el-icon>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { Close, Timer } from "@element-plus/icons-vue";
import { 
  URGENT_IMPORTANT, 
  URGENT_NOT_IMPORTANT,
  NOT_URGENT_IMPORTANT,
  NOT_URGENT_NOT_IMPORTANT,
  URGENT_LABEL_MAP,
  URGENT_COLOR_MAP 
} from '@/constant/todo';

const props = defineProps({
  todo: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(['update', 'delete', 'select-task']);

const quadrantLabel = computed(() => URGENT_LABEL_MAP[props.todo.quadrant]);
const quadrantTagType = computed(() => {
  switch(props.todo.quadrant) {
    case URGENT_IMPORTANT: return 'danger';
    case URGENT_NOT_IMPORTANT: return 'warning';
    case NOT_URGENT_IMPORTANT: return 'success';
    case NOT_URGENT_NOT_IMPORTANT: return 'info';
    default: return 'info';
  }
});

const quadrantClass = computed(() => `quadrant-${props.todo.quadrant}`);

const handleCheckboxClick = (value) => {
  emit('update-status', {
    ...props.todo,
    completed: value
  });
};

const handleDeleteClick = () => {
  emit('delete', props.todo);
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

  &.quadrant-1 {
    border-left: 4px solid var(--el-color-danger);
  }
  &.quadrant-2 {
    border-left: 4px solid var(--el-color-warning);
  }
  &.quadrant-3 {
    border-left: 4px solid var(--el-color-success);
  }
  &.quadrant-4 {
    border-left: 4px solid var(--el-color-info);
  }

  .todo_item_actions {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .todo_item_header {
    display: flex;
    align-items: center;
    gap: 8px;
  }
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
