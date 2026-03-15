import { TestBed } from '@angular/core/testing';
import { Router, UrlTree } from '@angular/router';
import { firstValueFrom, of } from 'rxjs';
import { vi } from 'vitest';
import { AuthService, AUTH_SERVICE_TOKEN } from '../../features/auth';
import { AuthGuard } from './auth.guard';

describe('AuthGuard', () => {
  const getAuthStateMock = vi.fn<AuthService['getAuthState']>();
  const createUrlTreeMock = vi.fn<Router['createUrlTree']>();

  const authServiceMock = {
    getAuthState: getAuthStateMock,
  } as unknown as AuthService;

  const routerMock = {
    createUrlTree: createUrlTreeMock,
  } as unknown as Router;

  let guard: AuthGuard;

  beforeEach(() => {
    vi.clearAllMocks();

    TestBed.configureTestingModule({
      providers: [
        AuthGuard,
        { provide: AUTH_SERVICE_TOKEN, useValue: authServiceMock },
        { provide: Router, useValue: routerMock },
      ],
    });

    guard = TestBed.inject(AuthGuard);
  });

  it('deve permitir ativacao quando usuario estiver autenticado', async () => {
    getAuthStateMock.mockReturnValue(of(true));

    const result = await firstValueFrom(guard.canActivate());

    expect(result).toBe(true);
    expect(createUrlTreeMock).not.toHaveBeenCalled();
  });

  it('deve redirecionar para login quando usuario nao estiver autenticado', async () => {
    const loginUrlTree = {} as UrlTree;

    getAuthStateMock.mockReturnValue(of(false));
    createUrlTreeMock.mockReturnValue(loginUrlTree);

    const result = await firstValueFrom(guard.canActivate());

    expect(createUrlTreeMock).toHaveBeenCalledTimes(1);
    expect(createUrlTreeMock).toHaveBeenCalledWith(['/login']);
    expect(result).toBe(loginUrlTree);
  });
});