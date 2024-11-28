<template>
  <div>
    todos:{{todos}}
    <!-- 任务输入部分 -->
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
                <el-icon :style="{ color: item.color || '#3f8ef7' }">
                  <MessageBox />
                </el-icon>
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
              >
                <MessageBox />
              </el-icon>
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

    <!-- 任务展示部分 -->
    <div class="todo_box">
      <div v-for="todo in unfinList" :key="todo.id" class="todo_item">
        <div class="todo_item_content">
          <el-checkbox v-model="todo.done" @click.stop="playSound" />
          <div class="todo_item_text" @click="handleClickText(todo)">
            {{ todo.text }}
          </div>
          <div class="todo_item_tomato"></div>
        </div>
      </div>
    </div>

    <div
      v-if="completedList && completedList.length"
      class="show_com_todo"
      @click="() => (showCompletedTodo = !showCompletedTodo)"
    >
      <div class="show_com_todo_button" v-show="showCompletedTodo">
        隐藏已完成任务 <el-icon><ArrowUp /></el-icon>
      </div>
      <div class="show_com_todo_button" v-show="!showCompletedTodo">
        显示未完成任务 <el-icon><ArrowDown /></el-icon>
      </div>
    </div>

    <div v-show="showCompletedTodo" class="todo_box">
      <div v-for="todo in completedList" :key="todo.id" class="todo_item">
        <div class="todo_item_content">
          <el-checkbox v-model="todo.done" />
          <div
            :class="['todo_item_text', { todo_item_text_completed: todo.done }]"
          >
            {{ todo.text }}
          </div>
        </div>
      </div>
    </div>

    <!-- 任务详情抽屉 -->
    <TodoDrawer
      :visible="showDrawer"
      @update-visible="updateDrawerVisible"
      :data="currentTodoData"
      @delete="handleDeleteTodo"
    />
  </div>
</template>

<script setup>
import { computed, ref, watch, onMounted } from "vue";
import TodoDrawer from "./components/TodoDrawer.vue";
import { Clock, ArrowDown, ArrowUp, MessageBox } from "@element-plus/icons-vue";
import {
  URGENT_IMPORTANT,
  URGENT_NOT_IMPORTANT,
  NOT_URGENT_IMPORTANT,
  NOT_URGENT_NOT_IMPORTANT,
  URGENT_IMPORTANT_COLOR,
  URGENT_NOT_IMPORTANT_COLOR,
  NOT_URGENT_IMPORTANT_COLOR,
  NOT_URGENT_NOT_IMPORTANT_COLOR,
} from "@/constant/todo";
import { getTodos } from "@/api/todo";

// 数据和状态管理
const todos = ref([]);
const showCompletedTodo = ref(false);
const showDrawer = ref(false);
const currentTodoData = ref({});
const localTodo = ref({
  id: null,
  text: "",
  priority: NOT_URGENT_NOT_IMPORTANT,
  estimatedPomodoros: 0,
});

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

// 计算属性
const unfinList = computed(() => todos.value?.filter((todo) => !todo.done));
const completedList = computed(() => todos.value?.filter((todo) => todo.done));

// 从 localStorage 加载数据
function loadTodos() {
  const storedTodos = localStorage.getItem("todos");
  console.log("🚀 ~ loadTodos ~ storedTodos:", storedTodos);
  if (storedTodos) {
    todos.value = JSON.parse(storedTodos);
  }
}

// 监听 todos 数据变化
watch(
  todos,
  (newTodos) => {
    console.log("🚀 ~ newTodos:", newTodos);
    if (newTodos) {
      localStorage.setItem("todos", JSON.stringify(newTodos));
    }
  },
  { deep: true }
);

// 处理任务的保存
function saveTodo() {
  console.log("🚀 ~ todos.value:", todos.value)
  if (localTodo.value.text.trim()) {
    todos.value.push({ ...localTodo.value, id: Date.now(), done: false });
    resetTodo();
  }
}

// 重置当前任务数据
function resetTodo() {
  localTodo.value = {
    id: null,
    text: "",
    priority: NOT_URGENT_NOT_IMPORTANT,
    estimatedPomodoros: 0,
  };
}

// 播放音效
const playSound = () => {
  const audio = new Audio("/check-sound.mp3");
  audio.play();
};

// 处理任务文本点击，打开任务详情
const handleClickText = (todo) => {
  currentTodoData.value = todo;
  showDrawer.value = true;
};

// 更新抽屉的可见性
const updateDrawerVisible = (value) => {
  showDrawer.value = value;
};

// 删除任务
const handleDeleteTodo = (id) => {
  todos.value = todos.value.filter((todo) => todo.id !== id);
  showDrawer.value = false;
  currentTodoData.value = {};
};

// 获取任务数据
async function getTodo() {
  // const res = await getTodos();
  // console.log("🚀 ~ res:", res)
  // todos.value = res.data;
}

// 挂载时加载任务数据
onMounted(() => {
  loadTodos();
  getTodo();
});
</script>

<style lang="scss" scoped>
.todo_box {
  margin-top: 12px;
}
.todo_item {
  display: flex;
  align-items: center;
  background: #fff;
  border-radius: 5px;
  margin-bottom: 10px;
  height: 40px;
  overflow: hidden;
  border: 1px solid #eee;
  .todo_item_content {
    display: flex;
    align-items: center;
    padding: 10px;
    .todo_item_text {
      margin-left: 10px;
      color: #333;
      font-size: 16px;
      cursor: pointer;
      min-width: 200px;
    }
    .todo_item_text_completed {
      text-decoration: line-through;
      color: #999;
      cursor: default;
    }
  }
}
.show_com_todo {
  margin-top: 10px;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.show_com_todo_button {
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 12px;
  background: #fff;
  cursor: pointer;
  color: #999;
  padding: 2px 16px;
  font-size: 14px;
}
</style>
