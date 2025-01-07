import { ref, onMounted, onUnmounted } from 'vue';
import { offlineStorage } from '@/utils/offlineStorage';

export function useNetworkStatus() {
  const isOnline = ref(navigator.onLine);

  const updateOnlineStatus = async () => {
    isOnline.value = navigator.onLine;
    if (isOnline.value) {
      // 网络恢复时同步离线数据
      await offlineStorage.syncWithServer();
    }
  };

  onMounted(() => {
    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);
  });

  onUnmounted(() => {
    window.removeEventListener('online', updateOnlineStatus);
    window.removeEventListener('offline', updateOnlineStatus);
  });

  return {
    isOnline
  };
} 