// components/TaskHistoryPage.tsx
import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Edit2, Save, ArrowLeft } from "lucide-react";
import { formatTime } from "../utils/formatTime";
import Task from "@/classes/Task";
import { getTasks, updateTaskName } from "@/service/apiService";

// interface TaskHistoryPageProps {
//   taskHistory: TaskHistory;
//   onUpdateTaskName: (oldName: string, newName: string) => void;
//   onClose: () => void;
// }

const TaskHistoryPage: React.FC = () => {
  const [editingTask, setEditingTask] = useState<string | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskName, setNewTaskName] = useState("");

  // Load the tasks on component mount
  useEffect(() => {
    getTasks().then((tasks: Task[]) => {
      setTasks(tasks);
    });
  }, []);

  const handleEdit = (taskName: string) => {
    setEditingTask(taskName);
    setNewTaskName(taskName);
  };

  const handleSaveChanges = (
    taskId: number,
    oldTitle: string,
    newTitle: string
  ) => {
    if (newTitle && newTitle !== oldTitle) {
      updateTaskName(taskId, newTitle);
    }
    setEditingTask(null);
  };

  const handleNavigateBack = () => {
    // #TODO: use react navigation to go back
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="flex flex-row items-center justify-between">
        <Button variant="ghost" size="icon" onClick={handleNavigateBack}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <CardTitle>Task History</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {tasks.map((task) => (
            <div key={task.id} className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                {editingTask === task.title ? (
                  <div className="flex gap-2 flex-1">
                    <Input
                      value={newTaskName}
                      onChange={(e) => setNewTaskName(e.target.value)}
                      className="flex-1"
                    />
                    <Button
                      size="icon"
                      onClick={() =>
                        handleSaveChanges(task.id, task.title, newTaskName)
                      }
                    >
                      <Save className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <>
                    <span className="font-medium">{task.title}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(task.title)}
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                  </>
                )}
              </div>
              <div className="text-sm text-gray-500 space-y-1">
                <div>Completed: {task.getCompletionCount()} times</div>
                <div>Average Time: {formatTime(task.getAverageTime())}</div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default TaskHistoryPage;
