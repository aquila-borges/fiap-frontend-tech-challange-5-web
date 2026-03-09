import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Task, TaskFormData, TaskService } from '../domain';
import { TASK_SERVICE_TOKEN } from '../infrastructure';

@Injectable({
  providedIn: 'root'
})
export class CreateTaskUseCase {
  private readonly taskService = inject<TaskService>(TASK_SERVICE_TOKEN);

  execute(taskData: TaskFormData): Observable<Task> {
    return this.taskService.createTask(taskData);
  }
}
