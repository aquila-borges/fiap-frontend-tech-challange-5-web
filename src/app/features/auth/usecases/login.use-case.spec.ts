import { TestBed } from '@angular/core/testing';
import { vi } from 'vitest';
import { AUTH_SERVICE_TOKEN } from '../index';
import { AuthService, User } from '../domain';
import { LoginUsecase } from './login.use-case';

describe('LoginUsecase', () => {
  const loginMock = vi.fn<AuthService['login']>();

  const authServiceMock = {
    login: loginMock,
  } as unknown as AuthService;

  let useCase: LoginUsecase;

  beforeEach(() => {
    vi.clearAllMocks();

    TestBed.configureTestingModule({
      providers: [
        LoginUsecase,
        { provide: AUTH_SERVICE_TOKEN, useValue: authServiceMock },
      ],
    });

    useCase = TestBed.inject(LoginUsecase);
  });

  it('deve autenticar e retornar sucesso quando credenciais forem validas', async () => {
    const user: User = {
      id: 'user-1',
      email: 'usuario@teste.com',
      createdAt: new Date('2026-03-15T10:00:00.000Z'),
    };

    loginMock.mockResolvedValue(user);

    const result = await useCase.execute('usuario@teste.com', '123456');

    expect(result.isSuccess()).toBe(true);
    expect(result.getUser()).toEqual(user);
    expect(result.getError()).toBeUndefined();
    expect(loginMock).toHaveBeenCalledTimes(1);

    const credentials = loginMock.mock.calls[0]?.[0];
    expect(credentials).toBeDefined();
    expect(credentials?.getEmail()).toBe('usuario@teste.com');
    expect(credentials?.getPassword()).toBe('123456');
  });

  it('deve retornar erro amigavel quando servico falhar com Error', async () => {
    loginMock.mockRejectedValue(new Error('Credenciais invalidas'));

    const result = await useCase.execute('usuario@teste.com', '123456');

    expect(result.isSuccess()).toBe(false);
    expect(result.getUser()).toBeUndefined();
    expect(result.getError()).toBe('Credenciais invalidas');
  });

  it('deve retornar mensagem padrao quando erro nao for instancia de Error', async () => {
    loginMock.mockRejectedValue('erro-desconhecido');

    const result = await useCase.execute('usuario@teste.com', '123456');

    expect(result.isSuccess()).toBe(false);
    expect(result.getError()).toBe('Ocorreu um erro inesperado. Tente novamente.');
  });
});