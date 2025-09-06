export type Priority = 'low' | 'medium' | 'high';

export type Task = {
  id: string;
  title: string;
  dueDate: string; // YYYY-MM-DD
  priority: Priority;
  notes?: string;
  emoji?: string;
  completed?: boolean;
};

export type Plan = {
  tasks: Task[];
  createdAt?: string;
};
