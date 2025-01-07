import { openDB } from 'idb';

const dbName = 'proTimeMaster';
const todoStoreName = 'todos';

export const db = await openDB(dbName, 1, {
  upgrade(db) {
    db.createObjectStore(todoStoreName, { keyPath: 'id' });
  },
});

export const offlineStorage = {
  async saveTodo(todo) {
    await db.put(todoStoreName, todo);
  },

  async getTodos() {
    return await db.getAll(todoStoreName);
  },

  async deleteTodo(id) {
    await db.delete(todoStoreName, id);
  },

  async syncWithServer() {
    const offlineTodos = await this.getTodos();
    // 实现与服务器同步的逻辑
  }
}; 