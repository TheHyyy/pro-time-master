<template>
  <div class>
    <el-input
      v-model="localTodo.text"
      placeholder="在'任务'中添加一个任务，按'回车'键保存"
      @keyup.enter="saveTodo"
    >
      <template #prepend>
        <el-select
          v-model="localTodo.priority"
          placeholder="Select"
          size="large"
          style="width: 80px"
        >
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
            <div class="select_option">
              <div class="select_option_label1">
                {{ item.label1 }}
              </div>
              <div class="select_option_label2">
                {{ item.label2 }}
              </div>
              <div class="select_option_icon">
                <el-icon :style="{ color: item.color || '#3f8ef7' }"
                  ><MessageBox
                /></el-icon>
              </div>
            </div>
          </el-option>
          <template #label>
            <div class="select_label">
              <el-icon
                :style="{
                  color: options.find(
                    (item) => item.value == localTodo.priority
                  )?.color,
                }"
                ><MessageBox
              /></el-icon>
            </div>
          </template>
        </el-select>
      </template>
      <template #append>
        <el-popover
          placement="top-start"
          :width="200"
          trigger="hover"
          content="预计番茄钟~"
        >
          <template #reference>
            <el-rate
              v-model="localTodo.estimatedPomodoros"
              :icons="icons"
              :void-icon="Clock"
              :colors="['#409eff', '#67c23a', '#FF9900']"
              clearable
            />
          </template>
        </el-popover>
      </template>
    </el-input>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
import { Clock } from "@element-plus/icons-vue";
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

const props = defineProps({
  todo: Object,
  visible: Boolean,
});

const emit = defineEmits(["update", "close"]);
const showDialog = ref(props.visible);
const icons = [Clock, Clock, Clock, Clock, Clock];
const options = [
  {
    value: URGENT_IMPORTANT,
    label1: "紧急",
    label2: "重要",
    color: URGENT_IMPORTANT_COLOR,
  },
  {
    value: URGENT_NOT_IMPORTANT,
    label1: "紧急",
    label2: "不重要",
    color: URGENT_NOT_IMPORTANT_COLOR,
  },
  {
    value: NOT_URGENT_IMPORTANT,
    label1: "不紧急",
    label2: "重要",
    color: NOT_URGENT_IMPORTANT_COLOR,
  },
  {
    value: NOT_URGENT_NOT_IMPORTANT,
    label1: "不紧急",
    label2: "不重要",
    color: NOT_URGENT_NOT_IMPORTANT_COLOR,
  },
];
const localTodo = ref({
  id: null,
  text: "",
  priority: NOT_URGENT_NOT_IMPORTANT,
  estimatedPomodoros: 0, // 预计番茄钟
});

const dialogTitle = ref("添加新的待办事项");

watch(
  () => props.todo,
  (newVal) => {
    if (newVal) {
      localTodo.value = { ...newVal };
      dialogTitle.value = "编辑待办事项";
      showDialog.value = true;
    } else {
      resetTodo();
    }
  },
  { immediate: true }
);

watch(
  () => props.visible,
  (val) => {
    showDialog.value = val;
  }
);

function resetTodo() {
  localTodo.value = {
    id: null,
    text: "",
    priority: NOT_URGENT_NOT_IMPORTANT,
    estimatedPomodoros: 0,
  };
  dialogTitle.value = "添加新的待办事项";
}

function saveTodo() {
  if (localTodo.value.text.trim()) {
    emit("update", { ...localTodo.value, done: false });
    closeDialog();
  }
}

function closeDialog() {
  emit("close");
}
</script>

<style scoped>
.dialog-footer {
  text-align: right;
}
.select_label {
  display: flex;
  justify-content: center;
  align-items: center;
}
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
  justify-content: right;
  align-items: center;
}
</style>
