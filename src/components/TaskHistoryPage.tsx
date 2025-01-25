// components/TaskHistoryPage.tsx
import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Edit2, Save, X, ArrowLeft } from "lucide-react";
import { TaskHistory } from "../types";
import { formatTime } from "../utils/formatTime";

interface TaskHistoryPageProps {
  taskHistory: TaskHistory;
  onUpdateTaskName: (oldName: string, newName: string) => void;
  onClose: () => void;
}

const TaskHistoryPage: React.FC<TaskHistoryPageProps> = ({
  taskHistory,
  onUpdateTaskName,
  onClose,
}) => {
  const [editingTask, setEditingTask] = useState<string | null>(null);
  const [newTaskName, setNewTaskName] = useState("");

  const handleEdit = (taskName: string) => {
    setEditingTask(taskName);
    setNewTaskName(taskName);
  };

  const handleSave = (oldName: string) => {
    if (newTaskName && newTaskName !== oldName) {
      onUpdateTaskName(oldName, newTaskName);
    }
    setEditingTask(null);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="flex flex-row items-center justify-between">
        <Button variant="ghost" size="icon" onClick={onClose}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <CardTitle>Task History</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {Object.entries(taskHistory).map(([taskName, data]) => (
            <div key={taskName} className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                {editingTask === taskName ? (
                  <div className="flex gap-2 flex-1">
                    <Input
                      value={newTaskName}
                      onChange={(e) => setNewTaskName(e.target.value)}
                      className="flex-1"
                    />
                    <Button size="icon" onClick={() => handleSave(taskName)}>
                      <Save className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <>
                    <span className="font-medium">{taskName}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(taskName)}
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                  </>
                )}
              </div>
              <div className="text-sm text-gray-500 space-y-1">
                <div>Completed: {data.completionCount} times</div>
                <div>Failed: {data.failedAttempts} times</div>
                <div>Average Time: {formatTime(data.averageTime)}</div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default TaskHistoryPage;
