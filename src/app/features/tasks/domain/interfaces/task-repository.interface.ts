import { Observable } from 'rxjs';
import { Task } from './task.interface';
import { TaskFormData } from './task-form-data.interface';
import { TaskPageCursor } from './task-page-cursor.interface';
import { TaskPageResult } from './task-page-result.interface';
import { TaskStatus } from '../types/task-status.type';

export interface TaskRepository {
  createTask(task: Omit<Task, 'id'>): Observable<Task>;
  getAllTasksByUserId(userId: string): Observable<Task[]>;
  getActiveTasksByUserId(userId: string): Observable<Task[]>;
  getActiveTasksPageByUserId(userId: string, pageSize: number, cursor?: TaskPageCursor): Observable<TaskPageResult>;
  getTaskById(id: string, userId: string): Observable<Task>;
  updateTask(id: string, taskData: Partial<TaskFormData>, userId: string): Observable<Task>;
  updateTaskStatus(id: string, status: TaskStatus, userId: string): Observable<Task>;
  deleteTask(id: string, userId: string): Observable<void>;
}