<template>
  <div>
    <el-input
      v-model="localTodo.title"
      placeholder="在'任务'中添加一个任务，按'回车'键保存"
      @keyup.enter="saveTodo"
    >
      <template #prepend>
        <el-select
          v-model="localTodo.priority"
          placeholder="选择优先级"
          size="large"
          style="width: 80px"
        >
          <el-option
            v-for="item in priorityOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
            <div class="select_option">
              <div class="select_option_label1">{{ item.label1 }}</div>
              <div class="select_option_label2">{{ item.label2 }}</div>
              <div class="select_option_icon">
                <el-icon :style="{ color: item.color || '#3f8ef7' }">
                  <MessageBox />
                </el-icon>
              </div>
            </div>
          </el-option>
        </el-select>
      </template>
      <template #append>
        <el-popover
          placement="top-start"
          :width="200"
          trigger="hover"
          content="预计番茄钟"
        >
          <template #reference>
            <el-rate
              v-model="localTodo.estimatedPomodoro"
              :icons="icons"
              :void-icon="Clock"
              :colors="['#409eff', '#67c23a', '#FF9900']"
              clearable
            />
          </template>
        </el-popover>
        <el-date-picker
          v-model="localTodo.dueDate"
          type="date"
          placeholder="选择日期"
          size="small"
          format="YYYY-MM-DD"
        />
      </template>
    </el-input>
  </div>
</template>

<script setup>
import { ref, computed, watchEffect } from "vue";
import { Clock } from "@element-plus/icons-vue";
import { priorityOptions } from "@/data/todoOptions";

const props = defineProps({
  todo: Object,
  visible: Boolean,
});

const emit = defineEmits(["update", "close"]);

const icons = [Clock, Clock, Clock, Clock, Clock];
const localTodo = ref({
  id: null,
  title: "",
  priority: 4, // 对应后端 importance 的默认值
  estimatedPomodoro: 0, // 预计番茄钟
  dueDate: null, // 选择日期
  completed: false, // 是否完成，默认 false
});


const isEditing = computed(() => !!props.todo);

watchEffect(() => {
  if (isEditing.value) {
    localTodo.value = { ...props.todo };
  } else {
    resetTodo();
  }
});

function resetTodo() {
  localTodo.value = {
    id: null,
    title: "",
    priority: 4, // 默认优先级 '不紧急不重要'
    estimatedPomodoro: 0,
    dueDate: null,
    completed: false,
  };
}

function saveTodo() {
  const title = localTodo.value.title.trim();
  if (!title) {
    alert("请输入任务内容！");
    return;
  }
  emit("update", { ...localTodo.value });
  closeDialog();
}

function closeDialog() {
  emit("close");
}
</script>

<style scoped>
.select_option {
  display: flex;
}
.select_option_label1 {
  width: 80px;
}
.select_option_label2 {
  width: 80px;
}
.select_option_icon {
  flex: 1;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
</style>
