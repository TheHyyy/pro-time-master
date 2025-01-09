const STORAGE_KEYS = {
  SETTINGS: 'pomodoroSettings',
  CURRENT_SESSION: 'currentPomodoroSession'
};

export const pomodoroStorage = {
  // 番茄钟设置
  saveSettings(settings) {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  },

  getSettings() {
    const defaultSettings = {
      workTime: 25,
      shortBreakTime: 5,
      longBreakTime: 15,
      longBreakInterval: 4,
      autoStartBreaks: true,
      autoStartPomodoros: true
    };

    const savedSettings = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    return savedSettings ? JSON.parse(savedSettings) : defaultSettings;
  },

  // 当前番茄钟会话
  saveCurrentSession(session) {
    localStorage.setItem(STORAGE_KEYS.CURRENT_SESSION, JSON.stringify({
      ...session,
      lastUpdated: new Date().toISOString()
    }));
  },

  getCurrentSession() {
    const saved = localStorage.getItem(STORAGE_KEYS.CURRENT_SESSION);
    return saved ? JSON.parse(saved) : null;
  },

  clearCurrentSession() {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_SESSION);
  }
}; 