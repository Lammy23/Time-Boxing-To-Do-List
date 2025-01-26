// types/index.ts
export interface Task {
    id: number;
    title: string;
    timeLimit: number;
    timeRemaining: number;
    additionalTime: number; // New guy
    status: "pending" | "completed" | "failed";
    active: boolean;
    startTime: number | null;
    date: string;
    hasBeenRescheduled?: boolean; // Marked for deletion
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
    rescheduleTask: (taskId: number) => void;
    deleteTask?: (taskId: number) => void;
  }