// TaskTimerApp.tsx
"use client";

import React from "react";

const TaskTimerApp: React.FC = () => {
  // const [tasks, setTasks] = useState<Task[]>([]);
  // const [score, setScore] = useState(0);
  // const [todaysStat, setTodaysStat] = useState<DailyStat | null>(null);
  // const [completionRate, setCompletionRate] = useState(0);
  // const [totalAttempts, setTotalAttempts] = useState(0);
  // const [resetDialogOpen, setResetDialogOpen] = useState(false);
  // const [completeDialogOpen, setCompleteDialogOpen] = useState(false);
  // const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null);
  // const [showHistory, setShowHistory] = useState(false);
  // // #TODO: Potential optimization is when creating a task to save the index of the task to a new list
  // // We can use this list_of_indexes to increment the timer
  // // This will save us from iterating over the entire list of tasks to find the active task
  // // Load DailyStats data from API on component mount
  // useEffect(() => {
  //   const today = formatDate(Date.now(), localTz);
  //   getDailyStatbyDate(today).then((value: DailyStat) => {
  //     setTodaysStat(value);
  //   });
  // }, []);
  // // Save data to API whenever it changes
  // // useEffect(() => {
  // //   localStorage.setItem("taskHistory", JSON.stringify(taskHistory));
  // //   localStorage.setItem("dailyStats", JSON.stringify(dailyStats));
  // //   localStorage.setItem("tasks", JSON.stringify(tasks));
  // //   localStorage.setItem("score", score.toString());
  // // }, [taskHistory, dailyStats, tasks, score]);
  // // Check for day change and reset tasks
  // useEffect(() => {
  //   const checkDate = () => {
  //     const today = formatDate(Date.now(), localTz);
  //     const lastDate = localStorage.getItem("lastDate");
  //     if (lastDate !== today) {
  //       if (lastDate) {
  //         const newDailyStat: DailyStat = {
  //           lastDate,
  //           score,
  //           completionRate,
  //           totalAttempts,
  //         };
  //         setDailyStats((prev) => [...prev, newDailyStat]);
  //       }
  //       setTasks([]);
  //       setScore(0);
  //       setCompletionRate(0);
  //       setTotalAttempts(0);
  //       localStorage.setItem("lastDate", today);
  //     }
  //   };
  //   checkDate();
  //   const interval = setInterval(checkDate, 60000); // Check every minute
  //   return () => clearInterval(interval);
  // }, [score, completionRate, totalAttempts]);
  // // Update completion rate whenever tasks change
  // useEffect(() => {
  //   const completedTasks = tasks.filter(
  //     (task) => task.status === "completed"
  //   ).length;
  //   const failedTasks = tasks.filter((task) => task.status === "failed").length;
  //   // Only calculate rate if there are any completed or failed tasks
  //   if (completedTasks > 0 || failedTasks > 0) {
  //     const totalAttempts = completedTasks + failedTasks;
  //     const newCompletionRate = (completedTasks / totalAttempts) * 100;
  //     setCompletionRate(newCompletionRate);
  //     setTotalAttempts(totalAttempts);
  //   } else {
  //     setCompletionRate(0);
  //     setTotalAttempts(0);
  //   }
  // }, [tasks]);
  // const handleReset = () => {
  //   setTasks([]);
  //   setScore(0);
  //   setCompletionRate(0);
  //   setTotalAttempts(0);
  //   setTaskHistory({}); // Reset task history
  //   setDailyStats([]); // Reset daily stats
  //   localStorage.removeItem("taskHistory");
  //   localStorage.removeItem("dailyStats");
  //   setResetDialogOpen(false);
  // };
  // const handleUpdateTaskName = (oldName: string, newName: string) => {
  //   if (taskHistory[oldName]) {
  //     const updatedHistory = { ...taskHistory };
  //     updatedHistory[newName] = updatedHistory[oldName];
  //     delete updatedHistory[oldName];
  //     setTaskHistory(updatedHistory);
  //     localStorage.setItem("taskHistory", JSON.stringify(updatedHistory));
  //   }
  // };
  // const calculatePoints = (
  //   completionTime: number,
  //   averageTime: number | null,
  //   isFirstCompletion: boolean
  // ) => {
  //   // Base points for completion
  //   const points = 10;
  //   // First completion always gets 10 points
  //   if (isFirstCompletion) {
  //     return points;
  //   }
  //   // If there's an average time
  //   if (averageTime !== null) {
  //     if (completionTime === averageTime) {
  //       // Exact match with average gets 10 points
  //       return points;
  //     } else if (completionTime < averageTime) {
  //       // Calculate bonus points based on how much faster than average
  //       const timeImprovement = averageTime - completionTime;
  //       const improvementRatio = timeImprovement / averageTime;
  //       const bonusPoints = Math.floor(points * improvementRatio);
  //       return points + bonusPoints;
  //     }
  //   }
  //   return points;
  // };
  // const startTask = (taskId: number) => {
  //   setTasks(
  //     tasks.map((task) => {
  //       if (task.id === taskId) {
  //         return { ...task, active: true, startTime: Date.now() };
  //       }
  //       return task;
  //     })
  //   );
  // };
  // const initiateCompleteTask = (taskId: number) => {
  //   setSelectedTaskId(taskId);
  //   setCompleteDialogOpen(true);
  // };
  // const completeTask = (taskId: number) => {
  //   setTasks(
  //     tasks.map((task) => {
  //       if (task.id === taskId) {
  //         const completionTime =
  //           task.timeLimit - task.timeRemaining + task.additionalTime;
  //         const success = task.timeRemaining > 0;
  //         const taskData = taskHistory[task.title] || {
  //           completionTimes: [],
  //           averageTime: 0,
  //           completionCount: 0,
  //           failedAttempts: 0,
  //         };
  //         const newCompletionTimes = [
  //           ...taskData.completionTimes,
  //           completionTime,
  //         ];
  //         const newAverage =
  //           newCompletionTimes.reduce((a, b) => a + b, 0) /
  //           newCompletionTimes.length;
  //         setTaskHistory((prev) => ({
  //           ...prev,
  //           [task.title]: {
  //             ...taskData,
  //             completionTimes: newCompletionTimes,
  //             averageTime: newAverage,
  //             completionCount: taskData.completionCount + 1,
  //           },
  //         }));
  //         const isFirstCompletion = taskData.completionCount === 0;
  //         const pointsEarned = success
  //           ? calculatePoints(
  //               completionTime,
  //               taskData.averageTime,
  //               isFirstCompletion
  //             )
  //           : 0;
  //         setScore((prev) => prev + pointsEarned);
  //         return {
  //           ...task,
  //           status: success ? "completed" : "failed",
  //           active: false,
  //           completionTime,
  //         };
  //       }
  //       return task;
  //     })
  //   );
  //   setCompleteDialogOpen(false);
  //   setSelectedTaskId(null);
  // };
  // return (
  //   <>
  //     <CompletionRateDisplay rate={completionRate} />
  //     {/* DEBUG */}
  //     <Button
  //       onClick={() => {
  //         getTasks();
  //       }}
  //     >
  //       API TEST
  //     </Button>
  //     <Card className="w-full max-w-2xl mx-auto">
  //       <CardHeader>
  //         <CardTitle className="flex justify-between items-center">
  //           <span>Task Timer</span>
  //           <div className="flex items-center gap-4">
  //             <span className="text-sm">Score: {score}</span>
  //             <Button
  //               variant="outline"
  //               size="sm"
  //               onClick={() => setShowHistory(true)}
  //             >
  //               View History
  //             </Button>
  //             <Button
  //               variant="destructive"
  //               size="sm"
  //               onClick={() => setResetDialogOpen(true)}
  //               className="flex items-center gap-2"
  //             >
  //               <Trash2 className="w-4 h-4" /> Reset All
  //             </Button>
  //           </div>
  //         </CardTitle>
  //       </CardHeader>
  //       <CardContent>
  //         <div className="space-y-4">
  //           <TaskInputForm />
  //           <TaskList />
  //           <DailyStats />
  //         </div>
  //       </CardContent>
  //     </Card>
  //     {/* Task History Page */}
  //     <ResetDialog
  //       open={resetDialogOpen}
  //       onOpenChange={setResetDialogOpen}
  //       onConfirm={handleReset}
  //     />
  //     {selectedTaskId && (
  //       <CompleteTaskDialog
  //         open={completeDialogOpen}
  //         onOpenChange={setCompleteDialogOpen}
  //         onConfirm={() => completeTask(selectedTaskId)}
  //         taskTitle={tasks.find((t) => t.id === selectedTaskId)?.title || ""}
  //       />
  //     )}
  //   </>
  // );
  return <div>Hello</div>;
};

export default TaskTimerApp;
