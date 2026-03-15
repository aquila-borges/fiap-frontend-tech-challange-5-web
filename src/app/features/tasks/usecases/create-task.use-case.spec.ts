import { TestBed } from '@angular/core/testing';
import { firstValueFrom, of } from 'rxjs';
import { vi } from 'vitest';
import {
  CreateTaskUseCase,
  Task,
  TaskCurrentUserProvider,
  TaskFormData,
  TaskRepository,
  TASK_CURRENT_USER_PROVIDER_TOKEN,
  TASK_REPOSITORY_TOKEN,
} from '../index';

describe('CreateTaskUseCase', () => {
  const pastelColors = ['#fff6ac', '#ffdfe9', '#dff4ff', '#e7f8df', '#f5e6ff', '#ffe4d6'];

  const getCurrentUserIdMock = vi.fn<() => string | null>();
  const createTaskMock = vi.fn<TaskRepository['createTask']>();

  const currentUserProviderMock = {
    getCurrentUserId: getCurrentUserIdMock,
  } as unknown as TaskCurrentUserProvider;

  const taskRepositoryMock = {
    createTask: createTaskMock,
  } as unknown as TaskRepository;

  let useCase: CreateTaskUseCase;

  beforeEach(() => {
    vi.clearAllMocks();

    TestBed.configureTestingModule({
      providers: [
        CreateTaskUseCase,
        { provide: TASK_CURRENT_USER_PROVIDER_TOKEN, useValue: currentUserProviderMock },
        { provide: TASK_REPOSITORY_TOKEN, useValue: taskRepositoryMock },
      ],
    });

    useCase = TestBed.inject(CreateTaskUseCase);
  });

  it('deve retornar erro quando usuario nao estiver autenticado', async () => {
    getCurrentUserIdMock.mockReturnValue(null);

    await expect(
      firstValueFrom(
        useCase.execute({
          title: 'Tarefa',
          description: 'Descricao',
          dueDate: undefined,
          priority: 'medium',
        })
      )
    ).rejects.toThrow('Usuário não autenticado');

    expect(taskRepositoryMock.createTask).not.toHaveBeenCalled();
  });

  it('deve montar tarefa e delegar criacao para o repositorio', async () => {
    const userId = 'user-123';
    const formData: TaskFormData = {
      title: 'Revisar PR',
      description: 'Garantir cobertura de testes',
      dueDate: new Date('2026-03-20T12:00:00.000Z'),
      priority: 'high',
    };

    const createdTask: Task = {
      id: 'task-1',
      ...formData,
      status: 'pending',
      userId,
      color: '#fff6ac',
      createdAt: new Date('2026-03-15T10:00:00.000Z'),
      updatedAt: new Date('2026-03-15T10:00:00.000Z'),
    };

    getCurrentUserIdMock.mockReturnValue(userId);
    createTaskMock.mockReturnValue(of(createdTask));

    const result = await firstValueFrom(useCase.execute(formData));

    expect(result).toEqual(createdTask);
    expect(createTaskMock).toHaveBeenCalledTimes(1);

    const createdPayload = createTaskMock.mock.calls[0]?.[0];
    expect(createdPayload).toBeDefined();
    expect(createdPayload?.title).toBe(formData.title);
    expect(createdPayload?.description).toBe(formData.description);
    expect(createdPayload?.priority).toBe(formData.priority);
    expect(createdPayload?.dueDate).toEqual(formData.dueDate);
    expect(createdPayload?.status).toBe('pending');
    expect(createdPayload?.userId).toBe(userId);
    expect(createdPayload?.color).toBeDefined();
    expect(pastelColors).toContain(createdPayload?.color);
    expect(createdPayload?.createdAt).toBeInstanceOf(Date);
    expect(createdPayload?.updatedAt).toBeInstanceOf(Date);
    expect(createdPayload?.createdAt.getTime()).toBe(createdPayload?.updatedAt.getTime());
  });
});
