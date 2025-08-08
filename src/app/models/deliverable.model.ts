export interface Deliverable {
  id: number;
  name: string;
  description: string;
  dueDate: string;
  status: string;
  projectId: number;
  createdAt?: Date;
  updatedAt?: Date;
}