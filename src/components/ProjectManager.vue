<template>
  <div class="project-manager">
    <div class="project-header">
      <h2>项目管理</h2>
      <el-button type="primary" @click="showAddProjectDialog">新建项目</el-button>
    </div>

    <!-- 项目列表 -->
    <div class="project-list">
      <el-collapse v-model="activeProjects">
        <el-collapse-item v-for="project in projects" :key="project.id" :title="project.name" :name="project.id">
          <template #title>
            <div class="project-item-header">
              <span>{{ project.name }}</span>
              <div class="project-progress">
                <el-progress 
                  :percentage="calculateProgress(project)" 
                  :stroke-width="8"
                  :format="format"
                />
              </div>
            </div>
          </template>

          <!-- 子任务列表 -->
          <div class="subtasks-list">
            <div v-for="task in project.tasks" :key="task.id" class="subtask-item">
              <el-checkbox v-model="task.completed" @change="handleTaskStatusChange(task)">
                {{ task.title }}
              </el-checkbox>
              <div class="task-actions">
                <el-button text type="primary" @click="editTask(task)">编辑</el-button>
                <el-button text type="danger" @click="deleteTask(task)">删除</el-button>
              </div>
            </div>
            <el-button text type="primary" @click="showAddTaskDialog(project)">
              <el-icon><Plus /></el-icon> 添加子任务
            </el-button>
          </div>
        </el-collapse-item>
      </el-collapse>
    </div>

    <!-- 新建/编辑项目对话框 -->
    <el-dialog
      v-model="projectDialogVisible"
      :title="editingProject ? '编辑项目' : '新建项目'"
      width="500px"
    >
      <el-form :model="projectForm" label-width="80px">
        <el-form-item label="项目名称">
          <el-input v-model="projectForm.name" placeholder="请输入项目名称" />
        </el-form-item>
        <el-form-item label="描述">
          <el-input
            v-model="projectForm.description"
            type="textarea"
            placeholder="请输入项目描述"
          />
        </el-form-item>
        <el-form-item label="截止日期">
          <el-date-picker
            v-model="projectForm.deadline"
            type="date"
            placeholder="选择截止日期"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="projectDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="saveProject">确定</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 新建/编辑任务对话框 -->
    <el-dialog
      v-model="taskDialogVisible"
      :title="editingTask ? '编辑任务' : '新建任务'"
      width="500px"
    >
      <el-form :model="taskForm" label-width="80px">
        <el-form-item label="任务名称">
          <el-input v-model="taskForm.title" placeholder="请输入任务名称" />
        </el-form-item>
        <el-form-item label="预计番茄钟">
          <el-input-number v-model="taskForm.estimatedPomodoros" :min="1" />
        </el-form-item>
        <el-form-item label="优先级">
          <el-select v-model="taskForm.priority">
            <el-option label="低" value="low" />
            <el-option label="中" value="medium" />
            <el-option label="高" value="high" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="taskDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="saveTask">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { Plus } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';

// 状态
const projects = ref([]);
const activeProjects = ref([]);
const projectDialogVisible = ref(false);
const taskDialogVisible = ref(false);
const editingProject = ref(null);
const editingTask = ref(null);
const currentProject = ref(null);

// 表单数据
const projectForm = ref({
  name: '',
  description: '',
  deadline: null
});

const taskForm = ref({
  title: '',
  estimatedPomodoros: 1,
  priority: 'medium'
});

// 计算项目完成进度
function calculateProgress(project) {
  if (!project.tasks || project.tasks.length === 0) return 0;
  const completedTasks = project.tasks.filter(task => task.completed).length;
  return Math.round((completedTasks / project.tasks.length) * 100);
}

// 格式化进度显示
function format(percentage) {
  return percentage === 100 ? '完成' : `${percentage}%`;
}

// 显示新建项目对话框
function showAddProjectDialog() {
  editingProject.value = null;
  projectForm.value = {
    name: '',
    description: '',
    deadline: null
  };
  projectDialogVisible.value = true;
}

// 显示新建任务对话框
function showAddTaskDialog(project) {
  editingTask.value = null;
  currentProject.value = project;
  taskForm.value = {
    title: '',
    estimatedPomodoros: 1,
    priority: 'medium'
  };
  taskDialogVisible.value = true;
}

// 保存项目
function saveProject() {
  if (!projectForm.value.name) {
    ElMessage.warning('请输入项目名称');
    return;
  }

  const projectData = {
    id: editingProject.value?.id || Date.now(),
    name: projectForm.value.name,
    description: projectForm.value.description,
    deadline: projectForm.value.deadline,
    tasks: editingProject.value?.tasks || []
  };

  if (editingProject.value) {
    const index = projects.value.findIndex(p => p.id === editingProject.value.id);
    if (index !== -1) {
      projects.value[index] = projectData;
    }
  } else {
    projects.value.push(projectData);
  }

  projectDialogVisible.value = false;
  ElMessage.success(editingProject.value ? '项目更新成功' : '项目创建成功');
}

// 保存任务
function saveTask() {
  if (!taskForm.value.title) {
    ElMessage.warning('请输入任务名称');
    return;
  }

  const taskData = {
    id: editingTask.value?.id || Date.now(),
    title: taskForm.value.title,
    estimatedPomodoros: taskForm.value.estimatedPomodoros,
    priority: taskForm.value.priority,
    completed: editingTask.value?.completed || false
  };

  if (editingTask.value) {
    const projectIndex = projects.value.findIndex(p => p.id === currentProject.value.id);
    const taskIndex = projects.value[projectIndex].tasks.findIndex(t => t.id === editingTask.value.id);
    if (taskIndex !== -1) {
      projects.value[projectIndex].tasks[taskIndex] = taskData;
    }
  } else {
    const project = projects.value.find(p => p.id === currentProject.value.id);
    if (!project.tasks) project.tasks = [];
    project.tasks.push(taskData);
  }

  taskDialogVisible.value = false;
  ElMessage.success(editingTask.value ? '任务更新成功' : '任务创建成功');
}

// 编辑任务
function editTask(task) {
  editingTask.value = task;
  currentProject.value = projects.value.find(p => p.tasks?.some(t => t.id === task.id));
  taskForm.value = {
    title: task.title,
    estimatedPomodoros: task.estimatedPomodoros,
    priority: task.priority
  };
  taskDialogVisible.value = true;
}

// 删除任务
function deleteTask(task) {
  const project = projects.value.find(p => p.tasks?.some(t => t.id === task.id));
  if (project) {
    project.tasks = project.tasks.filter(t => t.id !== task.id);
    ElMessage.success('任务删除成功');
  }
}

// 处理任务状态变更
function handleTaskStatusChange(task) {
  const project = projects.value.find(p => p.tasks?.some(t => t.id === task.id));
  if (project) {
    const taskIndex = project.tasks.findIndex(t => t.id === task.id);
    if (taskIndex !== -1) {
      project.tasks[taskIndex].completed = task.completed;
    }
  }
}
</script>

<style lang="scss" scoped>
.project-manager {
  padding: 20px;

  .project-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;

    h2 {
      margin: 0;
      font-weight: 500;
    }
  }

  .project-list {
    .project-item-header {
      display: flex;
      align-items: center;
      gap: 20px;
      flex: 1;

      .project-progress {
        flex: 1;
        max-width: 200px;
      }
    }

    .subtasks-list {
      padding: 10px 0;

      .subtask-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 8px 0;
        border-bottom: 1px solid #f0f0f0;

        &:last-child {
          border-bottom: none;
        }

        .task-actions {
          display: flex;
          gap: 8px;
        }
      }
    }
  }
}

:deep(.el-collapse-item__header) {
  font-size: 16px;
}

:deep(.el-progress) {
  margin-bottom: 0;
}
</style>