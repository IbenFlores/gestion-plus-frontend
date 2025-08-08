export interface Task {
  id: number;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  progress: number;
  status: string;
  priority: string;
  dependencies?: string[];
  createdByUserName?: string;
  assignedUserName?: string;
}