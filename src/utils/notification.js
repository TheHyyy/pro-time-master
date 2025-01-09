// 创建新的通知工具
export const notification = {
  requestPermission() {
    return Notification.requestPermission();
  },
  
  show(title, options = {}) {
    if (Notification.permission === 'granted') {
      return new Notification(title, options);
    }
  }
}; 