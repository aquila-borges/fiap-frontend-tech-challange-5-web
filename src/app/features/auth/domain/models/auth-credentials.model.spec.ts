import { AuthCredentials } from './auth-credentials.model';

describe('AuthCredentials', () => {
  it('deve criar credenciais validas quando email e senha atendem as regras', () => {
    const credentials = AuthCredentials.create('usuario@teste.com', '123456');

    expect(credentials.getEmail()).toBe('usuario@teste.com');
    expect(credentials.getPassword()).toBe('123456');
  });

  it('deve rejeitar email vazio ou apenas com espacos', () => {
    expect(() => AuthCredentials.create('', '123456')).toThrow('Email is required');
    expect(() => AuthCredentials.create('   ', '123456')).toThrow('Email is required');
  });

  it('deve rejeitar senha com menos de 6 caracteres', () => {
    expect(() => AuthCredentials.create('usuario@teste.com', '12345')).toThrow(
      'Password must be at least 6 characters'
    );
  });
});