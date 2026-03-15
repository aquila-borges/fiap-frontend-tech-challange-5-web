import { TestBed } from '@angular/core/testing';
import { firstValueFrom, of } from 'rxjs';
import { vi } from 'vitest';
import {
  DeleteTasksUseCase,
  TaskCurrentUserProvider,
  TaskRepository,
  TASK_CURRENT_USER_PROVIDER_TOKEN,
  TASK_REPOSITORY_TOKEN,
} from '../index';

describe('DeleteTasksUseCase', () => {
  const getCurrentUserIdMock = vi.fn<() => string | null>();
  const deleteTaskMock = vi.fn<TaskRepository['deleteTask']>();

  const currentUserProviderMock = {
    getCurrentUserId: getCurrentUserIdMock,
  } as unknown as TaskCurrentUserProvider;

  const taskRepositoryMock = {
    deleteTask: deleteTaskMock,
  } as unknown as TaskRepository;

  let useCase: DeleteTasksUseCase;

  beforeEach(() => {
    vi.clearAllMocks();

    TestBed.configureTestingModule({
      providers: [
        DeleteTasksUseCase,
        { provide: TASK_CURRENT_USER_PROVIDER_TOKEN, useValue: currentUserProviderMock },
        { provide: TASK_REPOSITORY_TOKEN, useValue: taskRepositoryMock },
      ],
    });

    useCase = TestBed.inject(DeleteTasksUseCase);
  });

  it('deve retornar erro quando usuario nao estiver autenticado', async () => {
    getCurrentUserIdMock.mockReturnValue(null);

    await expect(firstValueFrom(useCase.execute(['a', 'b']))).rejects.toThrow('Usuário não autenticado');
    expect(deleteTaskMock).not.toHaveBeenCalled();
  });

  it('deve retornar array vazio quando nao houver ids', async () => {
    getCurrentUserIdMock.mockReturnValue('user-1');

    const result = await firstValueFrom(useCase.execute([]));

    expect(result).toEqual([]);
    expect(deleteTaskMock).not.toHaveBeenCalled();
  });

  it('deve remover cada id informado com o userId atual', async () => {
    getCurrentUserIdMock.mockReturnValue('user-abc');
    deleteTaskMock.mockReturnValue(of(void 0));

    const result = await firstValueFrom(useCase.execute(['task-1', 'task-2', 'task-3']));

    expect(result).toHaveLength(3);
    expect(deleteTaskMock).toHaveBeenCalledTimes(3);
    expect(deleteTaskMock).toHaveBeenNthCalledWith(1, 'task-1', 'user-abc');
    expect(deleteTaskMock).toHaveBeenNthCalledWith(2, 'task-2', 'user-abc');
    expect(deleteTaskMock).toHaveBeenNthCalledWith(3, 'task-3', 'user-abc');
  });
});
