import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { Task, TaskService, TaskFormData } from '../../domain';

@Injectable({
  providedIn: 'root'
})
export class TaskServiceImpl implements TaskService {
  // TODO: Implementar integração com backend/Firestore
  private mockTasks: Task[] = [];

  createTask(taskData: TaskFormData): Observable<Task> {
    const newTask: Task = {
      id: crypto.randomUUID(),
      title: taskData.title,
      description: taskData.description,
      priority: taskData.priority,
      dueDate: taskData.dueDate,
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date(),
      userId: 'current-user-id', // TODO: Obter do serviço de autenticação
    };

    this.mockTasks.push(newTask);
    return of(newTask).pipe(delay(300));
  }

  getTasks(): Observable<Task[]> {
    return of(this.mockTasks).pipe(delay(200));
  }

  getTaskById(id: string): Observable<Task> {
    const task = this.mockTasks.find(t => t.id === id);
    if (!task) {
      throw new Error(`Tarefa com id ${id} não encontrada`);
    }
    return of(task).pipe(delay(100));
  }

  updateTask(id: string, taskData: Partial<TaskFormData>): Observable<Task> {
    const taskIndex = this.mockTasks.findIndex(t => t.id === id);
    if (taskIndex === -1) {
      throw new Error(`Tarefa com id ${id} não encontrada`);
    }

    const updatedTask: Task = {
      ...this.mockTasks[taskIndex],
      ...taskData,
      updatedAt: new Date(),
    };

    this.mockTasks[taskIndex] = updatedTask;
    return of(updatedTask).pipe(delay(300));
  }

  deleteTask(id: string): Observable<void> {
    const taskIndex = this.mockTasks.findIndex(t => t.id === id);
    if (taskIndex === -1) {
      throw new Error(`Tarefa com id ${id} não encontrada`);
    }

    this.mockTasks.splice(taskIndex, 1);
    return of(void 0).pipe(delay(200));
  }
}
