<template>
  <div class="statistics">
    <el-card class="chart-card">
      <template #header>
        <div class="card-header">
          <span>任务四象限分布</span>
        </div>
      </template>
      <div ref="quadrantChart" class="chart"></div>
    </el-card>

    <el-card class="chart-card">
      <template #header>
        <div class="card-header">
          <span>本周任务完成情况</span>
        </div>
      </template>
      <div ref="weeklyChart" class="chart"></div>
    </el-card>

    <el-card class="chart-card">
      <template #header>
        <div class="card-header">
          <span>番茄钟统计</span>
        </div>
      </template>
      <div ref="pomodoroChart" class="chart"></div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import * as echarts from 'echarts';
import { getTodoStats } from '@/api/todo';
import { URGENT_LABEL_MAP } from '@/constant/todo';
import { ElMessage } from 'element-plus';

const quadrantChart = ref(null);
const weeklyChart = ref(null);
const pomodoroChart = ref(null);

onMounted(async () => {
  try {
    const stats = await getTodoStats();
    initQuadrantChart(stats.quadrantDistribution);
    initWeeklyChart(stats.weeklyCompletion);
    initPomodoroChart(stats.pomodoroStats);
  } catch (error) {
    ElMessage.error('获取统计数据失败');
    console.error('Failed to load statistics:', error);
  }
});

function initQuadrantChart(data) {
  const chart = echarts.init(quadrantChart.value);
  chart.setOption({
    title: {
      text: '任务分布'
    },
    tooltip: {
      trigger: 'item'
    },
    legend: {
      orient: 'vertical',
      left: 'left'
    },
    series: [
      {
        type: 'pie',
        radius: '50%',
        data: Object.entries(data).map(([key, value]) => ({
          name: URGENT_LABEL_MAP[key],
          value
        })),
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }
    ]
  });
}

function initWeeklyChart(data) {
  const chart = echarts.init(weeklyChart.value);
  chart.setOption({
    title: {
      text: '本周任务完成情况'
    },
    tooltip: {
      trigger: 'axis'
    },
    xAxis: {
      type: 'category',
      data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        name: '已完成',
        type: 'bar',
        data: data.completed
      },
      {
        name: '未完成',
        type: 'bar',
        data: data.pending
      }
    ]
  });
}

function initPomodoroChart(data) {
  const chart = echarts.init(pomodoroChart.value);
  chart.setOption({
    title: {
      text: '番茄钟使用统计'
    },
    tooltip: {
      trigger: 'axis'
    },
    xAxis: {
      type: 'category',
      data: data.dates
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        name: '完成番茄钟数',
        type: 'line',
        data: data.counts,
        smooth: true,
        areaStyle: {}
      }
    ]
  });
}
</script>

<style lang="scss" scoped>
.statistics {
  padding: 20px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;

  .chart-card {
    .chart {
      height: 300px;
    }
  }
}
</style> 