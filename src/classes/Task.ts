export interface TaskJSON {
  id: number;
  title: string;
  startTime: number | null;
  timeLimitInSeconds: number;
  timeUsedInSeconds: number;
  status: TaskStatus;
  date: string;
  completionTimes: number[];
}

export enum TaskStatus {
  Pending = "pending",
  Tracking = "tracking", // Task running but still under time limit
  Overrun = "overrun", // Task running but past time limit
  Completed = "completed",
  Failed = "failed",
}

export default class Task {
  id: number;
  title: string;
  startTime: number | null;
  timeLimitInSeconds: number;
  timeUsedInSeconds: number;
  status: TaskStatus;
  date: string;
  completionTimes: number[];

  constructor(
    id: number = 0,
    title: string = "",
    timeLimitInSeconds: number = 0,
    timeUsedInSeconds: number = 0,
    status: TaskStatus = TaskStatus.Pending,
    startTime: number | null = null,
    date: string = "",
    completionTimes: number[] = []
  ) {
    this.id = id;
    this.title = title;
    this.startTime = startTime;
    this.timeLimitInSeconds = timeLimitInSeconds;
    this.timeUsedInSeconds = timeUsedInSeconds;
    this.status = status;
    this.date = date;
    this.completionTimes = completionTimes;
  }

  /**
   * Returns the average time taken to complete the task
   * @returns Average time taken to complete the task
   */
  getAverageTime(): number {
    if (this.completionTimes.length === 0) return 0;
    const sum = this.completionTimes.reduce((a, b) => a + b, 0);
    return sum / this.completionTimes.length;
  }

  /**
   * Returns the number of times the task has been completed
   * @returns Number of times the task has been completed
   */
  getCompletionCount(): number {
    return this.completionTimes.length;
  }

  start(): Task {
    return new Task(
      this.id,
      this.title,
      this.timeLimitInSeconds,
      this.timeUsedInSeconds,
      TaskStatus.Tracking,
      Date.now(),
      this.date,
      this.completionTimes
    );
  }

  complete(): Task {
    return new Task(
      this.id,
      this.title,
      this.timeLimitInSeconds,
      this.timeUsedInSeconds,
      TaskStatus.Completed,
      this.startTime,
      this.date,
      [...this.completionTimes, this.timeUsedInSeconds]
    );
  }

  fail(): Task {
    return new Task(
      this.id,
      this.title,
      this.timeLimitInSeconds,
      this.timeUsedInSeconds,
      TaskStatus.Failed,
      this.startTime,
      this.date,
      this.completionTimes
    );
  }

  overrun(): Task {
    return new Task(
      this.id,
      this.title,
      this.timeLimitInSeconds,
      this.timeUsedInSeconds,
      TaskStatus.Overrun,
      this.startTime,
      this.date,
      this.completionTimes
    );
  }

  /**
   * Returns the time left for the task to complete
   * @returns Time left for the task to complete
   */
  getTimeLeft(): number {
    return this.timeLimitInSeconds - this.timeUsedInSeconds;
  }
}
