<template>
  <div class="statistics">
    <el-card class="chart-card">
      <template #header>
        <div class="card-header">
          <span>今日番茄钟统计</span>
        </div>
      </template>
      <div ref="dailyChart" class="chart"></div>
    </el-card>

    <el-card class="chart-card">
      <template #header>
        <div class="card-header">
          <span>本周任务完成情况</span>
        </div>
      </template>
      <div ref="weeklyChart" class="chart"></div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import * as echarts from 'echarts';

const dailyChart = ref(null);
const weeklyChart = ref(null);

onMounted(() => {
  initDailyChart();
  initWeeklyChart();
});

function initDailyChart() {
  const chart = echarts.init(dailyChart.value);
  // 配置图表选项...
}

function initWeeklyChart() {
  const chart = echarts.init(weeklyChart.value);
  // 配置图表选项...
}
</script> 