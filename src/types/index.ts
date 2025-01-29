// types/index.ts
export interface Task {
    id: number;
    title: string;
    timeLimit: number;
    timeRemaining: number;
    additionalTime: number; // Change to 'timeLimit' then 'timeUsed' instead of timeRemaining and additionalTime
    status: "pending" | "running" | "completed" | "failed"; // ('End task' button when failed, 'Complete task' button when running)
    active: boolean;
    startTime: number | null;
    date: string;
  }
  
  export interface TaskHistory {
    [key: string]: {
      completionTimes: number[];
      averageTime: number;
      completionCount: number;
      failedAttempts: number;
    };
  }
  
  export interface Suggestion {
    title: string;
    averageTime: number;
    completionCount: number;
  }
  
  export interface DailyStat {
    date: string;
    score: number;
    completionRate: number;
    totalAttempts: number;
  }
  
  export interface TaskActions {
    startTask: (taskId: number) => void;
    completeTask: (taskId: number) => void;
    deleteTask?: (taskId: number) => void;
  }