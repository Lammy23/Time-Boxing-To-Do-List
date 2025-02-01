// apiService.ts
import axios from 'axios';
import { Task, TaskHistory, DailyStat } from '../types';

const TASK_API = 'https://api1.example.com';
const HISTORY_API = 'https://api2.example.com';
const STATS_API = 'https://api3.example.com';

// Debounce function for optimizing API calls
const debounce = (func: Function, wait: number) => {
  let timeout: NodeJS.Timeout;
  return function executedFunction(...args: any[]) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Batch updates for active tasks
const taskUpdateQueue: { [key: number]: Task } = {};

// Task-related API calls
export const taskApi = {
  // Get all tasks for today
  getTasks: async (date: string): Promise<Task[]> => {
    const response = await axios.get(`${TASK_API}/Tasks`, {
      params: { date }
    });
    return response.data;
  },

  // Create a new task
  createTask: async (task: Task): Promise<Task> => {
    const response = await axios.post(`${TASK_API}/Tasks`, task);
    return response.data;
  },

  // Update task - debounced for active timers
  updateTask: debounce(async (task: Task) => {
    try {
      await axios.put(`${TASK_API}/Tasks/${task.id}`, task);
      delete taskUpdateQueue[task.id];
    } catch (error) {
      // Keep failed updates in queue for retry
      taskUpdateQueue[task.id] = task;
    }
  }, 5000), // Sync every 5 seconds at most

  // Immediate task update for important state changes
  updateTaskImmediate: async (task: Task): Promise<void> => {
    await axios.put(`${TASK_API}/Tasks/${task.id}`, task);
  },

  // Delete task
  deleteTask: async (taskId: number): Promise<void> => {
    await axios.delete(`${TASK_API}/Tasks/${taskId}`);
  },

  // Queue task update for batch processing
  queueTaskUpdate: (task: Task) => {
    taskUpdateQueue[task.id] = task;
    taskApi.updateTask(task);
  }
};

// Task history API calls
export const historyApi = {
  getTaskHistory: async (): Promise<TaskHistory> => {
    const response = await axios.get(`${HISTORY_API}/TaskHistory`);
    return response.data;
  },

  updateTaskHistory: async (taskHistory: TaskHistory): Promise<void> => {
    await axios.put(`${HISTORY_API}/TaskHistory`, taskHistory);
  },

  // Update specific task history entry
  updateTaskHistoryEntry: async (
    taskName: string, 
    historyEntry: { 
      completionTimes: number[],
      averageTime: number,
      completionCount: number,
      failedAttempts: number
    }
  ): Promise<void> => {
    await axios.put(
      `${HISTORY_API}/TaskHistory/${encodeURIComponent(taskName)}`, 
      historyEntry
    );
  }
};

// Daily stats API calls
export const statsApi = {
  getDailyStats: async (): Promise<DailyStat[]> => {
    const response = await axios.get(`${STATS_API}/DailyStats`);
    return response.data;
  },

  updateDailyStats: async (date: string, stats: DailyStat): Promise<void> => {
    await axios.put(`${STATS_API}/DailyStats/${date}`, stats);
  },

  createDailyStat: async (stat: DailyStat): Promise<void> => {
    await axios.post(`${STATS_API}/DailyStats`, stat);
  }
};

// Error handling middleware
axios.interceptors.response.use(
  response => response,
  error => {
    // Log errors and handle offline status
    console.error('API Error:', error);
    
    // Implement retry logic for failed requests
    if (!error.response) {
      // Network error - could be offline
      // Queue for retry when back online
      return Promise.reject(error);
    }
    
    return Promise.reject(error);
  }
);