import { inject, Injectable } from '@angular/core';
import { Observable, from, map, catchError, throwError, switchMap } from 'rxjs';
import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  doc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  Timestamp,
  DocumentData
} from 'firebase/firestore';
import { FIREBASE_FIRESTORE_TOKEN } from '../../../core/index';
import { Task, TaskFormData, TaskRepository } from '../domain/index';

const TASKS_COLLECTION = 'tasks';

@Injectable({
  providedIn: 'root'
})
export class TaskFirestoreRepositoryImpl implements TaskRepository {
  private readonly firestore = inject(FIREBASE_FIRESTORE_TOKEN);

  createTask(task: Omit<Task, 'id'>): Observable<Task> {
    const tasksCollection = collection(this.firestore, TASKS_COLLECTION);
    const firestoreData = this.taskToFirestore(task);

    return from(addDoc(tasksCollection, firestoreData)).pipe(
      map(docRef => ({
        ...task,
        id: docRef.id,
      })),
      catchError(error => {
        console.error('Erro ao criar tarefa no Firestore:', error);
        return throwError(() => new Error('Falha ao criar tarefa'));
      })
    );
  }

  getTasksByUserId(userId: string): Observable<Task[]> {
    const tasksCollection = collection(this.firestore, TASKS_COLLECTION);
    const q = query(
      tasksCollection,
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );

    return from(getDocs(q)).pipe(
      map(snapshot => snapshot.docs.map(taskDoc => this.taskFromFirestore(taskDoc.id, taskDoc.data()))),
      catchError(error => {
        console.error('Erro ao buscar tarefas no Firestore:', error);
        return throwError(() => new Error('Falha ao buscar tarefas'));
      })
    );
  }

  getTaskById(id: string, userId: string): Observable<Task> {
    const taskDoc = doc(this.firestore, TASKS_COLLECTION, id);

    return from(getDoc(taskDoc)).pipe(
      map(docSnap => {
        if (!docSnap.exists()) {
          throw new Error(`Tarefa com id ${id} nao encontrada`);
        }

        const task = this.taskFromFirestore(docSnap.id, docSnap.data());
        if (task.userId !== userId) {
          throw new Error('Acesso negado para esta tarefa');
        }

        return task;
      }),
      catchError(error => {
        console.error('Erro ao buscar tarefa no Firestore:', error);
        return throwError(() => new Error('Falha ao buscar tarefa'));
      })
    );
  }

  updateTask(id: string, taskData: Partial<TaskFormData>, userId: string): Observable<Task> {
    const taskDoc = doc(this.firestore, TASKS_COLLECTION, id);
    const updateData: Partial<DocumentData> = {
      ...taskData,
      updatedAt: Timestamp.fromDate(new Date()),
    };

    if (taskData.dueDate !== undefined) {
      updateData['dueDate'] = taskData.dueDate ? Timestamp.fromDate(taskData.dueDate) : null;
    }

    return this.getTaskById(id, userId).pipe(
      switchMap(() => from(updateDoc(taskDoc, updateData))),
      switchMap(() => this.getTaskById(id, userId)),
      catchError(error => {
        console.error('Erro ao atualizar tarefa no Firestore:', error);
        return throwError(() => new Error('Falha ao atualizar tarefa'));
      })
    );
  }

  deleteTask(id: string, userId: string): Observable<void> {
    const taskDoc = doc(this.firestore, TASKS_COLLECTION, id);

    return this.getTaskById(id, userId).pipe(
      switchMap(() => from(deleteDoc(taskDoc))),
      catchError(error => {
        console.error('Erro ao deletar tarefa no Firestore:', error);
        return throwError(() => new Error('Falha ao deletar tarefa'));
      })
    );
  }

  private taskFromFirestore(id: string, data: DocumentData): Task {
    return {
      id,
      title: data['title'],
      description: data['description'] ?? undefined,
      priority: data['priority'],
      dueDate: data['dueDate'] ? (data['dueDate'] as Timestamp).toDate() : undefined,
      status: data['status'],
      createdAt: (data['createdAt'] as Timestamp).toDate(),
      updatedAt: (data['updatedAt'] as Timestamp).toDate(),
      userId: data['userId'],
      color: data['color'] ?? undefined,
    };
  }

  private taskToFirestore(task: Omit<Task, 'id'>): DocumentData {
    return {
      title: task.title,
      description: task.description ?? null,
      priority: task.priority,
      dueDate: task.dueDate ? Timestamp.fromDate(task.dueDate) : null,
      status: task.status,
      createdAt: Timestamp.fromDate(task.createdAt),
      updatedAt: Timestamp.fromDate(task.updatedAt),
      userId: task.userId,
      color: task.color ?? null,
    };
  }
}