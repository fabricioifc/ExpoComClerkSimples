## Autenticação de Usuário

Existem diversas formas de autenticação usando React Native e Expo.

### 🔐 **1. Autenticação com Email/Senha (Custom Backend ou Firebase)**

* **Firebase Authentication**: Uma das opções mais populares.

  * Fácil de integrar com `expo-firebase-auth`.
  * Suporte a autenticação com email/senha, redes sociais e telefone.
* **Backend próprio (Node.js, Django, etc.)**:

  * Você implementa a lógica de login, geração de tokens (ex: JWT) e verificação.
  * O app envia requisições via `fetch`/`axios`.

🔧 Libs úteis:

* [`expo-secure-store`](https://docs.expo.dev/versions/latest/sdk/securestore/): para armazenar tokens de forma segura.
* [`axios`](https://axios-http.com/): para comunicação com a API.

---

### 🪪 **2. Autenticação via Redes Sociais (OAuth)**

Permite login com:

* Google
* Apple
* Facebook
* GitHub

🔧 Libs/tools:

* `expo-auth-session`: autenticação via OAuth 2.0.
* `expo-google-auth-session`, `expo-apple-authentication`, etc.
* Firebase também oferece integração fácil com essas redes sociais.

---

### 🧑‍🤝‍🧑 **3. Autenticação com Provedores de Identidade (Auth-as-a-Service)**

Plataformas completas de autenticação com UI, gerenciamento de sessões e tokens prontos:

* **Clerk** ✅
* **Supabase Auth**
* **Firebase Authentication**

Vantagens:

* Menos código de backend.
* Funcionalidades prontas como verificação de email, 2FA, etc.

---

### 📱 **4. Autenticação Biométrica / Local**

Não substitui o login principal, mas melhora a UX:

* Face ID, Touch ID, digital
* Usado para desbloquear o app após login

🔧 Lib:

* [`expo-local-authentication`](https://docs.expo.dev/versions/latest/sdk/local-authentication/)

---

### 🔁 **5. Autenticação com Magic Links / Códigos por Email ou SMS**

* Login sem senha (passwordless)
* Firebase, Supabase ou serviços como Magic.link oferecem isso

---

### 🔒 **6. Autenticação com JWT + Refresh Token**

Muito comum em apps com backend próprio:

* Após login, o servidor retorna um access token (curta duração) e refresh token (longa duração).
* O app renova o token automaticamente quando expira.

---

### 📦 **7. Autenticação Offline com Realm ou SQLite**

* Útil para apps que precisam funcionar offline com sincronização posterior.
* Pode combinar com login local e sincronizar dados ao reconectar.

Perfeito! Segue o ajuste no **tutorial inicial**, adicionando ao final a seção sobre **uso do Drawer Navigation com expo-router** e o trecho de código correspondente.

---

## Autenticação de Usuário

Existem diversas formas de autenticação usando React Native e Expo.

### 🔐 **1. Autenticação com Email/Senha (Custom Backend ou Firebase)**

* **Firebase Authentication**: Uma das opções mais populares.

  * Fácil de integrar com `expo-firebase-auth`.
  * Suporte a autenticação com email/senha, redes sociais e telefone.
* **Backend próprio (Node.js, Django, etc.)**:

  * Você implementa a lógica de login, geração de tokens (ex: JWT) e verificação.
  * O app envia requisições via `fetch`/`axios`.

🔧 Libs úteis:

* [`expo-secure-store`](https://docs.expo.dev/versions/latest/sdk/securestore/): para armazenar tokens de forma segura.
* [`axios`](https://axios-http.com/): para comunicação com a API.

---

### 🪪 **2. Autenticação via Redes Sociais (OAuth)**

Permite login com:

* Google
* Apple
* Facebook
* GitHub

🔧 Libs/tools:

* `expo-auth-session`: autenticação via OAuth 2.0.
* `expo-google-auth-session`, `expo-apple-authentication`, etc.
* Firebase também oferece integração fácil com essas redes sociais.

---

### 🧑‍🤝‍🧑 **3. Autenticação com Provedores de Identidade (Auth-as-a-Service)**

Plataformas completas de autenticação com UI, gerenciamento de sessões e tokens prontos:

* **Clerk** ✅
* **Supabase Auth**
* **Firebase Authentication**

Vantagens:

* Menos código de backend.
* Funcionalidades prontas como verificação de email, 2FA, etc.

---

### 📱 **4. Autenticação Biométrica / Local**

Não substitui o login principal, mas melhora a UX:

* Face ID, Touch ID, digital.
* Usado para desbloquear o app após login.

🔧 Lib:

* [`expo-local-authentication`](https://docs.expo.dev/versions/latest/sdk/local-authentication/)

---

### 🔁 **5. Autenticação com Magic Links / Códigos por Email ou SMS**

* Login sem senha (passwordless).
* Firebase, Supabase ou serviços como Magic.link oferecem isso.

---

### 🔒 **6. Autenticação com JWT + Refresh Token**

Muito comum em apps com backend próprio:

* Após login, o servidor retorna um access token (curta duração) e refresh token (longa duração).
* O app renova o token automaticamente quando expira.

---

### 📦 **7. Autenticação Offline com Realm ou SQLite**

* Útil para apps que precisam funcionar offline com sincronização posterior.
* Pode combinar com login local e sincronizar dados ao reconectar.

---

## 🧭 **8. Navegação com Drawer usando expo-router**

Além da autenticação, é importante estruturar a navegação no app. Uma opção é usar **Drawer Navigation** com `expo-router`.

**Passos:**

1. Siga o passo a passo da [documentação](https://docs.expo.dev/router/advanced/drawer/).
2. Estruture sua pasta `/app` com as telas desejadas (`home.jsx`, `about.jsx`, `sign-in.jsx`).
3. No arquivo `app/_layout.jsx`, configure assim:

```jsx

export default function Layout() {
    return (
        <ClerkProvider
            publishableKey={CLERKPUBLIC_KEY}
            tokenCache={tokenCache}
        >
            <Drawer>
                <Drawer.Screen name="home" options={{ title: 'Início' }} />
                <Drawer.Screen name="about" options={{ title: 'Sobre' }} />
                <Drawer.Screen name="sign-in" options={{ title: 'Login' }} />
            </Drawer>
        </ClerkProvider>
    );
}
```
