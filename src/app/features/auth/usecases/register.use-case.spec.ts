import { TestBed } from '@angular/core/testing';
import { vi } from 'vitest';
import { AUTH_SERVICE_TOKEN } from '../index';
import { AuthService, User } from '../domain';
import { RegisterUsecase } from './register.use-case';

describe('RegisterUsecase', () => {
  const registerMock = vi.fn<AuthService['register']>();

  const authServiceMock = {
    register: registerMock,
  } as unknown as AuthService;

  let useCase: RegisterUsecase;

  beforeEach(() => {
    vi.clearAllMocks();

    TestBed.configureTestingModule({
      providers: [
        RegisterUsecase,
        { provide: AUTH_SERVICE_TOKEN, useValue: authServiceMock },
      ],
    });

    useCase = TestBed.inject(RegisterUsecase);
  });

  it('deve registrar usuario e retornar sucesso', async () => {
    const user: User = {
      id: 'user-2',
      email: 'novo@teste.com',
      createdAt: new Date('2026-03-15T11:00:00.000Z'),
    };

    registerMock.mockResolvedValue(user);

    const result = await useCase.execute('novo@teste.com', '123456');

    expect(result.isSuccess()).toBe(true);
    expect(result.getUser()).toEqual(user);
    expect(result.getError()).toBeUndefined();
    expect(registerMock).toHaveBeenCalledTimes(1);

    const credentials = registerMock.mock.calls[0]?.[0];
    expect(credentials).toBeDefined();
    expect(credentials?.getEmail()).toBe('novo@teste.com');
    expect(credentials?.getPassword()).toBe('123456');
  });

  it('deve retornar erro quando servico falhar com Error', async () => {
    registerMock.mockRejectedValue(new Error('Nao foi possivel cadastrar agora'));

    const result = await useCase.execute('novo@teste.com', '123456');

    expect(result.isSuccess()).toBe(false);
    expect(result.getUser()).toBeUndefined();
    expect(result.getError()).toBe('Nao foi possivel cadastrar agora');
  });

  it('deve falhar quando credenciais forem invalidas no dominio', async () => {
    const result = await useCase.execute('', '123');

    expect(result.isSuccess()).toBe(false);
    expect(result.getError()).toBe('Email is required');
    expect(registerMock).not.toHaveBeenCalled();
  });
});