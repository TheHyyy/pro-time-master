export function formatDate(date) {
  if (!date) return '未设置';
  
  const d = new Date(date);
  return d.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
} 