// TaskTimerApp.tsx
"use client";

import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import TaskInputForm from "@/components/TaskInputForm";
import TaskList from "@/components/TaskList";
import DailyStats from "@/components/DailyStats";
import ResetDialog from "@/components/ResetDialog";
import CompleteTaskDialog from "@/components/CompleteTaskDialog";
import CompletionRateDisplay from "@/components/CompletionRateDisplay";
import TaskHistoryPage from "@/components/TaskHistoryPage";
import { Task, TaskHistory, DailyStat } from "../types/index";
import { formatDate, localTz } from "@/utils/formatDate";

const TaskTimerApp: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [score, setScore] = useState(0);
  const [completionRate, setCompletionRate] = useState(0);
  const [totalAttempts, setTotalAttempts] = useState(0);
  const [taskHistory, setTaskHistory] = useState<TaskHistory>({});
  const [dailyStats, setDailyStats] = useState<DailyStat[]>([]);
  const [resetDialogOpen, setResetDialogOpen] = useState(false);
  const [completeDialogOpen, setCompleteDialogOpen] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null);
  const [showHistory, setShowHistory] = useState(false);

  // Load data from localStorage on component mount
  useEffect(() => {
    const loadedTaskHistory = JSON.parse(
      localStorage.getItem("taskHistory") || "{}"
    );
    const loadedDailyStats = JSON.parse(
      localStorage.getItem("dailyStats") || "[]"
    );
    // const today = new Date().toISOString().split("T")[0];

    const today = formatDate(Date.now(), localTz);

    const loadedTasks = JSON.parse(localStorage.getItem("tasks") || "[]");
    const loadedScore = parseInt(localStorage.getItem("score") || "0");

    setTaskHistory(loadedTaskHistory);
    setDailyStats(loadedDailyStats);
    setTasks(loadedTasks.filter((task: Task) => task.date === today));
    setScore(loadedScore);

    const todayStats = loadedDailyStats.find(
      (stat: DailyStat) => stat.date === today
    );
    if (todayStats) {
      setCompletionRate(todayStats.completionRate);
      setTotalAttempts(todayStats.totalAttempts);
    }
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("taskHistory", JSON.stringify(taskHistory));
    localStorage.setItem("dailyStats", JSON.stringify(dailyStats));
    localStorage.setItem("tasks", JSON.stringify(tasks));
    localStorage.setItem("score", score.toString());
  }, [taskHistory, dailyStats, tasks, score]);

  // Check for day change and reset tasks
  useEffect(() => {
    const checkDate = () => {
      const today = formatDate(Date.now(), localTz);
      const lastDate = localStorage.getItem("lastDate");

      if (lastDate !== today) {
        if (lastDate) {
          const newDailyStat = {
            date: lastDate,
            score,
            completionRate,
            totalAttempts,
          };
          setDailyStats((prev) => [...prev, newDailyStat]);
        }

        setTasks([]);
        setScore(0);
        setCompletionRate(0);
        setTotalAttempts(0);
        localStorage.setItem("lastDate", today);
      }
    };

    checkDate();
    const interval = setInterval(checkDate, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [score, completionRate, totalAttempts]);

  // Update completion rate whenever tasks change
  useEffect(() => {
    const completedTasks = tasks.filter(
      (task) => task.status === "completed"
    ).length;
    const failedTasks = tasks.filter((task) => task.status === "failed").length;

    // Only calculate rate if there are any completed or failed tasks
    if (completedTasks > 0 || failedTasks > 0) {
      const totalAttempts = completedTasks + failedTasks;
      const newCompletionRate = (completedTasks / totalAttempts) * 100;
      setCompletionRate(newCompletionRate);
      setTotalAttempts(totalAttempts);
    } else {
      setCompletionRate(0);
      setTotalAttempts(0);
    }
  }, [tasks]);

  const handleReset = () => {
    setTasks([]);
    setScore(0);
    setCompletionRate(0);
    setTotalAttempts(0);
    setTaskHistory({}); // Reset task history
    setDailyStats([]); // Reset daily stats
    localStorage.removeItem("taskHistory");
    localStorage.removeItem("dailyStats");
    setResetDialogOpen(false);
  };

  const handleUpdateTaskName = (oldName: string, newName: string) => {
    if (taskHistory[oldName]) {
      const updatedHistory = { ...taskHistory };
      updatedHistory[newName] = updatedHistory[oldName];
      delete updatedHistory[oldName];
      setTaskHistory(updatedHistory);
      localStorage.setItem("taskHistory", JSON.stringify(updatedHistory));
    }
  };

  const calculatePoints = (
    completionTime: number,
    averageTime: number | null,
    isFirstCompletion: boolean
  ) => {
    // Base points for completion
    const points = 10;

    // First completion always gets 10 points
    if (isFirstCompletion) {
      return points;
    }

    // If there's an average time
    if (averageTime !== null) {
      if (completionTime === averageTime) {
        // Exact match with average gets 10 points
        return points;
      } else if (completionTime < averageTime) {
        // Calculate bonus points based on how much faster than average
        const timeImprovement = averageTime - completionTime;
        const improvementRatio = timeImprovement / averageTime;
        const bonusPoints = Math.floor(points * improvementRatio);
        return points + bonusPoints;
      }
    }

    return points;
  };

  const handleAddTask = (title: string, timeInSeconds: number) => {
    const newTask: Task = {
      id: Date.now(),
      title,
      timeLimit: timeInSeconds,
      timeRemaining: timeInSeconds,
      additionalTime: 0,
      status: "pending",
      active: false,
      startTime: null,
      date: formatDate(Date.now(), localTz),
    };

    setTasks((prev) => [...prev, newTask]);
  };

  const startTask = (taskId: number) => {
    setTasks(
      tasks.map((task) => {
        if (task.id === taskId) {
          return { ...task, active: true, startTime: Date.now() };
        }
        return task;
      })
    );
  };

  const initiateCompleteTask = (taskId: number) => {
    setSelectedTaskId(taskId);
    setCompleteDialogOpen(true);
  };

  const completeTask = (taskId: number) => {
    setTasks(
      tasks.map((task) => {
        if (task.id === taskId) {
          const completionTime =
            task.timeLimit - task.timeRemaining + task.additionalTime;
          const success = task.status === "completed";

          const taskData = taskHistory[task.title] || {
            completionTimes: [],
            averageTime: 0,
            completionCount: 0,
            failedAttempts: 0,
          };

          const newCompletionTimes = [
            ...taskData.completionTimes,
            completionTime,
          ];
          const newAverage =
            newCompletionTimes.reduce((a, b) => a + b, 0) /
            newCompletionTimes.length;

          setTaskHistory((prev) => ({
            ...prev,
            [task.title]: {
              ...taskData,
              completionTimes: newCompletionTimes,
              averageTime: newAverage,
              completionCount: taskData.completionCount + 1,
            },
          }));

          const isFirstCompletion = taskData.completionCount === 0;
          const pointsEarned = calculatePoints(
            completionTime,
            taskData.averageTime,
            isFirstCompletion
          );

          setScore((prev) => prev + pointsEarned);

          return {
            ...task,
            status: success ? "completed" : "failed",
            active: false,
            completionTime,
          };
        }
        return task;
      })
    );
    setCompleteDialogOpen(false);
    setSelectedTaskId(null);
  };

  const rescheduleTask = (taskId: number) => {
    const failedTask = tasks.find((task) => task.id === taskId);
    if (!failedTask) return;

    // Mark the original task as rescheduled
    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId ? { ...task, hasBeenRescheduled: true } : task
      )
    );

    const newTask: Task = {
      id: Date.now(),
      title: failedTask.title,
      timeLimit: failedTask.timeLimit * 2,
      timeRemaining: failedTask.timeLimit * 2,
      additionalTime: 0, // whole function to be removed
      status: "pending",
      active: false,
      startTime: null,
      date: formatDate(Date.now(), localTz),
      hasBeenRescheduled: false,
    };

    setTasks((prev) => [...prev, newTask]);
  };

  const deleteTask = (taskId: number) => {
    setTasks((prev) => prev.filter((task) => task.id !== taskId));
  };

  // Timer effect for active tasks
  useEffect(() => {
    console.log("Checking");
    const interval = setInterval(() => {
      setTasks((prevTasks) =>
        prevTasks.map((task) => {
          // if (task.active && task.status === "pending") {
          if (task.active) {
            if (task.status === "pending") {
              const now = Date.now();
              const startTime = task.startTime || now; // Add startTime if not present
              const elapsedSeconds = Math.floor((now - startTime) / 1000);
              const newTimeRemaining = task.timeLimit - elapsedSeconds;
              if (newTimeRemaining <= 0) {
                // Flip the switch to fail
                return {
                  ...task,
                  timeRemaining: 0,
                  // active: false,
                  status: "failed",
                };
              }
              return { ...task, timeRemaining: newTimeRemaining };
            } else if (task.status === "failed") {
              const now = Date.now();
              const startTime = task.startTime || now; // Add startTime if not present
              const elapsedSeconds = Math.floor((now - startTime) / 1000);
              const additionalTime = elapsedSeconds - task.timeLimit;
              // DEBUG
              // console.log("Additional time for ", task.title, " is ", task.additionalTime);

              return { ...task, additionalTime: additionalTime };
            }
          }
          return task;
        })
      );
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <CompletionRateDisplay rate={completionRate} />

      {!showHistory ? (
        <Card className="w-full max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              <span>Task Timer</span>
              <div className="flex items-center gap-4">
                <span className="text-sm">Score: {score}</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowHistory(true)}
                >
                  View History
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => setResetDialogOpen(true)}
                  className="flex items-center gap-2"
                >
                  <Trash2 className="w-4 h-4" /> Reset All
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <TaskInputForm
                taskHistory={taskHistory}
                onAddTask={handleAddTask}
              />
              <TaskList
                tasks={tasks}
                taskHistory={taskHistory}
                actions={{
                  startTask,
                  completeTask: initiateCompleteTask,
                  rescheduleTask,
                  deleteTask,
                }}
              />
              <DailyStats stats={dailyStats} />
            </div>
          </CardContent>
        </Card>
      ) : (
        <TaskHistoryPage
          taskHistory={taskHistory}
          onUpdateTaskName={handleUpdateTaskName}
          onClose={() => setShowHistory(false)}
        />
      )}

      <ResetDialog
        open={resetDialogOpen}
        onOpenChange={setResetDialogOpen}
        onConfirm={handleReset}
      />

      {selectedTaskId && (
        <CompleteTaskDialog
          open={completeDialogOpen}
          onOpenChange={setCompleteDialogOpen}
          onConfirm={() => completeTask(selectedTaskId)}
          taskTitle={tasks.find((t) => t.id === selectedTaskId)?.title || ""}
        />
      )}
    </>
  );
};

export default TaskTimerApp;
