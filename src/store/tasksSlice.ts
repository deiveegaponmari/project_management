import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export type TaskStatus = 'backlog' | 'todo' | 'in-progress' | 'review' | 'done';

export interface TaskItem {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  assignee: string;
  dueDate: string | null;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  comments: string[];
  activity: string[];
}

interface TasksState {
  tasks: TaskItem[];
}

const initialState: TasksState = {
  tasks: [],
};

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    setTasks: (state, action: PayloadAction<TaskItem[]>) => {
      state.tasks = action.payload;
    },
    moveTask: (
      state,
      action: PayloadAction<{ taskId: string; destination: TaskStatus }>
    ) => {
      const task = state.tasks.find((item) => item.id === action.payload.taskId);
      if (task) {
        task.status = action.payload.destination;
        task.activity = [...(task.activity || []), `Moved to ${action.payload.destination}`];
      }
    },
    addTask: (state, action: PayloadAction<TaskItem>) => {
      state.tasks.push(action.payload);
    },
  },
});

export const { setTasks, moveTask, addTask } = tasksSlice.actions;
export default tasksSlice.reducer;
