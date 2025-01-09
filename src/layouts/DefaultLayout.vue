<template>
  <el-container class="layout-container">
    <el-aside width="240px" class="layout-aside">
      <div class="logo">Pro Time Master</div>
      <el-menu
        :default-active="activeMenu"
        class="menu"
        @select="handleMenuSelect"
      >
        <el-menu-item index="all">
          <el-icon><List /></el-icon>
          <span>全部任务</span>
        </el-menu-item>

        <el-menu-item index="urgent-important">
          <el-icon><Warning /></el-icon>
          <span>紧急且重要</span>
        </el-menu-item>

        <el-menu-item index="completed">
          <el-icon><Select /></el-icon>
          <span>已完成</span>
        </el-menu-item>

        <el-menu-item index="statistics">
          <el-icon><DataLine /></el-icon>
          <span>图表统计</span>
        </el-menu-item>
      </el-menu>
      <div class="menu-footer">
        <el-button 
          type="text" 
          @click="showSettings = true"
          class="settings-btn"
        >
          <el-icon><Setting /></el-icon>
          设置
        </el-button>
      </div>
    </el-aside>

    <el-container>
      <el-header class="layout-header">
        <div class="header-left">
          <el-breadcrumb>
            <el-breadcrumb-item>首页</el-breadcrumb-item>
            <el-breadcrumb-item>{{ currentPage }}</el-breadcrumb-item>
          </el-breadcrumb>
        </div>
      </el-header>

      <el-main class="layout-main">
        <router-view></router-view>
      </el-main>
    </el-container>

    <el-dialog
      title="设置"
      v-model="showSettings"
      width="500px"
    >
      <el-form :model="settings" label-width="120px">
        <h4>番茄钟设置</h4>
        <el-form-item label="工作时长(分钟)">
          <el-input-number v-model="settings.workTime" :min="1" :max="60" />
        </el-form-item>
        <el-form-item label="短休息时长">
          <el-input-number v-model="settings.shortBreakTime" :min="1" :max="30" />
        </el-form-item>
        <el-form-item label="长休息时长">
          <el-input-number v-model="settings.longBreakTime" :min="5" :max="60" />
        </el-form-item>
        <el-form-item label="自动开始休息">
          <el-switch v-model="settings.autoStartBreaks" />
        </el-form-item>
        <el-form-item label="自动开始工作">
          <el-switch v-model="settings.autoStartPomodoros" />
        </el-form-item>

        <h4>声音设置</h4>
        <el-form-item label="提醒铃声">
          <el-select v-model="settings.sound" style="width: 200px">
            <el-option label="默认铃声" value="default" />
            <el-option label="温和提示音" value="gentle" />
          </el-select>
          <el-button @click="playSound" size="small" style="margin-left: 10px">
            试听
          </el-button>
        </el-form-item>
      </el-form>
      
      <template #footer>
        <el-button @click="showSettings = false">取消</el-button>
        <el-button type="primary" @click="saveSettings">保存</el-button>
      </template>
    </el-dialog>
  </el-container>
</template>

<script setup>
import { ref, computed } from 'vue';
import { List, Warning, Select, DataLine, Setting } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
import { pomodoroStorage } from '@/utils/pomodoroStorage';

const activeMenu = ref('all');

const currentPage = computed(() => {
  switch(activeMenu.value) {
    case 'all': return '全部任务';
    case 'urgent-important': return '紧急且重要';
    case 'completed': return '已完成';
    case 'statistics': return '图表统计';
    default: return '全部任务';
  }
});

const handleMenuSelect = (index) => {
  activeMenu.value = index;
  window.dispatchEvent(new CustomEvent('filter-todos', { detail: index }));
};

const showSettings = ref(false);
const settings = ref(pomodoroStorage.getSettings());

const saveSettings = () => {
  pomodoroStorage.saveSettings(settings.value);
  showSettings.value = false;
  ElMessage.success('设置已保存');
};

const playSound = () => {
  const audio = new Audio(`/sounds/${settings.value.sound}.mp3`);
  audio.play();
};
</script>

<style lang="scss" scoped>
.layout-container {
  height: 100vh;

  .layout-aside {
    background-color: #304156;
    color: #fff;

    .logo {
      height: 60px;
      line-height: 60px;
      text-align: center;
      font-size: 20px;
      font-weight: bold;
      border-bottom: 1px solid #1f2d3d;
    }

    .menu {
      border-right: none;
      background-color: transparent;
    }
  }

  .layout-header {
    background-color: #fff;
    border-bottom: 1px solid #dcdfe6;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 20px;

    .user-info {
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 8px;
    }
  }

  .layout-main {
    background-color: #f0f2f5;
    padding: 20px;
  }

  .menu-footer {
    position: absolute;
    bottom: 20px;
    width: 100%;
    padding: 0 20px;
    
    .settings-btn {
      display: flex;
      align-items: center;
      gap: 8px;
      color: #fff;
      
      &:hover {
        opacity: 0.8;
      }
    }
  }
}

:deep(.el-dialog__body) {
  h4 {
    margin: 16px 0;
    padding-bottom: 8px;
    border-bottom: 1px solid #eee;
    color: #606266;
  }
}
</style>
