import { FirebaseError } from 'firebase/app';

const FIREBASE_AUTH_ERROR_MESSAGES: Record<string, string> = {
  'auth/invalid-credential': 'E-mail ou senha inválidos.',
  'auth/user-not-found': 'E-mail ou senha inválidos.',
  'auth/wrong-password': 'E-mail ou senha inválidos.',
  'auth/invalid-email': 'O e-mail informado é inválido.',
  'auth/user-disabled': 'Esta conta foi desativada. Entre em contato com o suporte.',
  'auth/too-many-requests': 'Muitas tentativas. Tente novamente em alguns minutos.',
  'auth/network-request-failed': 'Falha de conexão. Verifique sua internet e tente novamente.',
  'auth/internal-error': 'Ocorreu um erro interno. Tente novamente.',
  'auth/popup-closed-by-user': 'O login com Google foi cancelado.',
  'auth/popup-blocked': 'O navegador bloqueou a janela de login. Permita pop-ups e tente novamente.',
  'auth/cancelled-popup-request': 'Já existe uma tentativa de login em andamento.',
  'auth/account-exists-with-different-credential':
    'Já existe uma conta com este e-mail usando outro método de acesso.',
  'auth/operation-not-allowed': 'Este método de login não está habilitado no momento.',
  'auth/email-already-in-use': 'Este e-mail já está em uso.',
  'auth/weak-password': 'A senha é muito fraca. Use pelo menos 6 caracteres.',
  'auth/missing-email': 'Informe um e-mail válido.',
  'auth/missing-password': 'Informe sua senha.',
};

export function mapFirebaseAuthError(error: unknown, fallbackMessage: string): Error {
  if (error instanceof FirebaseError) {
    const friendlyMessage = FIREBASE_AUTH_ERROR_MESSAGES[error.code] ?? fallbackMessage;
    return new Error(friendlyMessage);
  }

  if (error instanceof Error && error.message) {
    return error;
  }

  return new Error(fallbackMessage);
}
