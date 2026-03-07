# 🔥 Configuração Firebase - Guia de Integração

## ✅ Instalação Concluída

O Firebase foi integrado ao projeto! Aqui está o que foi configurado:

### 📁 Arquivos Criados

1. **Configuração**
   - `src/environments/environment.ts` - Configuração de desenvolvimento
   - `src/environments/environment.prod.ts` - Configuração de produção
   - `src/app/firebase.config.ts` - Inicialização do Firebase

2. **Serviços**
   - `src/app/services/auth.service.ts` - Serviço de autenticação
   - `src/app/guards/auth.guard.ts` - Guard para rotas protegidas

3. **Componentes de Exemplo**
   - `src/app/components/login.component.ts` - Lógica do login
   - `src/app/components/login.component.html` - Template do login
   - `src/app/components/login.component.css` - Estilos do login

---

## 🚀 Próximos Passos

### 1. Configurar o Firebase Console

1. Acesse: https://console.firebase.google.com/
2. Crie um novo projeto (ou use existente)
3. Vá em **Project Settings** (⚙️) > **Your apps**
4. Clique em **Add app** > Escolha **Web** (ícone `</>`)
5. Copie as credenciais do Firebase

### 2. Atualizar as Credenciais

Edite os arquivos de environment e substitua os valores:

```typescript
// src/environments/environment.ts
export const environment = {
  production: false,
  firebase: {
    apiKey: "AIzaSyC...",  // ← Cole suas credenciais aqui
    authDomain: "seu-projeto.firebaseapp.com",
    projectId: "seu-projeto-id",
    storageBucket: "seu-projeto.appspot.com",
    messagingSenderId: "123456789",
    appId: "1:123456789:web:abc123"
  }
};
```

Faça o mesmo para `environment.prod.ts`.

### 3. Habilitar Authentication no Firebase

1. No Firebase Console, vá em **Authentication**
2. Clique em **Get Started**
3. Vá na aba **Sign-in method**
4. Habilite **Email/Password**

### 4. Registrar o Componente de Login

Adicione o `LoginComponent` no `app-module.ts`:

```typescript
import { LoginComponent } from './components/login.component';

@NgModule({
  declarations: [
    App,
    LoginComponent  // ← Adicione aqui
  ],
  // ...
})
```

### 5. Configurar Rotas

Edite `src/app/app-routing-module.ts`:

```typescript
import { LoginComponent } from './components/login.component';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { 
    path: 'dashboard', 
    component: DashboardComponent,  // Seu componente protegido
    canActivate: [AuthGuard]  // ← Protege a rota
  },
  { path: '', redirectTo: '/login', pathMatch: 'full' }
];
```

---

## 💡 Como Usar o AuthService

### Em Componentes

```typescript
import { AuthService } from './services/auth.service';

export class MeuComponente {
  constructor(private authService: AuthService) {
    // Observar estado de autenticação
    this.authService.getAuthState().subscribe(user => {
      if (user) {
        console.log('Usuário logado:', user.email);
      } else {
        console.log('Usuário não logado');
      }
    });
  }

  async fazerLogin() {
    try {
      await this.authService.login('email@exemplo.com', 'senha123');
      console.log('Login realizado!');
    } catch (error) {
      console.error('Erro no login:', error);
    }
  }

  async fazerLogout() {
    await this.authService.logout();
  }

  obterUsuario() {
    const user = this.authService.getCurrentUser();
    console.log('Usuário atual:', user?.email);
  }
}
```

---

## 🔒 Proteção de Rotas

O `AuthGuard` já está pronto! Basta adicionar nas rotas:

```typescript
const routes: Routes = [
  { 
    path: 'privado', 
    component: PaginaPrivadaComponent,
    canActivate: [AuthGuard]  // ← Usuários não autenticados serão redirecionados
  }
];
```

---

## 🧪 Testando

1. Inicie o servidor: `npm start`
2. Acesse: http://localhost:4200/login
3. Clique em "Criar Conta" para registrar um usuário
4. Faça login com as credenciais criadas

---

## 📝 Recursos Adicionais do Firebase

Além da autenticação, você pode adicionar:

- **Firestore** - Banco de dados NoSQL
- **Storage** - Armazenamento de arquivos
- **Cloud Functions** - Backend serverless
- **Analytics** - Análise de uso

Para adicionar Firestore, por exemplo:

```typescript
import { getFirestore, collection, getDocs } from 'firebase/firestore';

const db = getFirestore(getFirebaseApp());
const querySnapshot = await getDocs(collection(db, "users"));
```

---

## ⚠️ Importante: Segurança

1. **Nunca commite as credenciais reais** no Git
2. Adicione ao `.gitignore`:
   ```
   src/environments/environment.prod.ts
   ```
3. Use variáveis de ambiente no CI/CD
4. Configure regras de segurança no Firebase Console

---

## 🆘 Problemas Comuns

### "Firebase Auth não inicializado"
- Certifique-se que o `APP_INITIALIZER` está configurado no `app-module.ts`

### "Invalid API key"
- Verifique se copiou todas as credenciais corretamente
- Confirme que o projeto está ativo no Firebase Console

### "Email already exists"
- O email já foi registrado anteriormente
- Use outro email ou faça login ao invés de registrar

---

📚 **Documentação Oficial:** https://firebase.google.com/docs/web/setup

🎉 **Pronto para usar!** Qualquer dúvida, consulte este guia.
