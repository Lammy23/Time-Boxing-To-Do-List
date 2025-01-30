export interface DailyStatJSON {
  date: string;
  score: number;
  completionRate: number;
  totalAttempts: number;
}

export default class DailyStat {
  date: string;
  score: number;
  completionRate: number;
  totalAttempts: number;

  constructor(
    date: string = "",
    score: number = 0,
    completionRate: number = 0,
    totalAttempts: number = 0
  ) {
    this.date = date;
    this.score = score;
    this.completionRate = completionRate;
    this.totalAttempts = totalAttempts;
  }
}
