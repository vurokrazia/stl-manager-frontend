# Frontend - React + Vite

## Agente activo

**IMPORTANTE**: Antes de responder a CUALQUIER solicitud, SIEMPRE debes:
1. Usa las directrices del agente: `.claude/agents/react-frontend-expert.md`
2. Seguir TODAS las reglas definidas en ese archivo
3. Aplicar el protocolo anti-suposiciones obligatoriamente

Si no has leído ese archivo en esta sesión, léelo AHORA antes de continuar.
---

## Stack tecnológico

### Core
- React 18+
- Vite 5+
- TypeScript: [Sí/No]
- React Router: [v6/otra versión]

### UI/Estilos
- Librería de componentes: [COMPLETA: Material-UI/Ant Design/Chakra/shadcn/Tailwind/CSS Modules]
- CSS Framework: [COMPLETA si aplica]

### Estado
- State management: [COMPLETA: Context API/Zustand/Redux Toolkit/Jotai]
- Server state: [COMPLETA: TanStack Query/SWR/ninguno]

### HTTP Client
- Cliente: [COMPLETA: fetch nativo/axios/TanStack Query]

### Formularios
- Librería de forms: [COMPLETA: React Hook Form/Formik/ninguno]
- Validación: [COMPLETA: Zod/Yup/ninguno]

---

## Estructura del proyecto

```
frontend/
├── src/
│   ├── components/          - Componentes reutilizables
│   │   ├── ui/             - Componentes base (Button, Input, etc)
│   │   └── layout/         - Layout components (Header, Footer, etc)
│   ├── features/            - Features por dominio
│   │   ├── auth/
│   │   ├── users/
│   │   └── products/
│   ├── pages/               - Páginas/vistas
│   ├── hooks/               - Custom hooks
│   ├── services/            - API calls
│   ├── types/               - TypeScript types/interfaces
│   ├── utils/               - Utilidades
│   ├── App.tsx
│   └── main.tsx
├── public/
├── index.html
├── vite.config.ts
└── package.json
```

---

## Convenciones de código

### Naming
- Componentes: `PascalCase.tsx` (ej: `UserCard.tsx`)
- Hooks: `camelCase.ts` con prefijo `use` (ej: `useAuth.ts`)
- Funciones: `camelCase` (ej: `handleSubmit`, `validateEmail`)
- Constantes: `UPPER_SNAKE_CASE` (ej: `API_BASE_URL`)
- Tipos: `PascalCase` (ej: `User`, `UserResponse`)

### Estructura de componentes
```tsx
// Imports
import { useState } from 'react';

// Types/Interfaces
interface ButtonProps {
  label: string;
  onClick: () => void;
}

// Component
export function Button({ label, onClick }: ButtonProps) {
  return <button onClick={onClick}>{label}</button>;
}
```

---

## API y Backend

### URL base del API
```typescript
// src/config.ts
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';
```

### Documentación del backend
**IMPORTANTE**: 
- SIEMPRE leer la documentación antes de consumir endpoints
- Ubicación: `../backend/docs/api/endpoints.md`
- NO inventar endpoints o estructuras de datos
- Crear tipos TypeScript basados en la documentación exacta

### Estructura de servicios API
```typescript
// src/services/userService.ts
import { API_BASE_URL } from '@/config';
import type { User, CreateUserRequest, CreateUserResponse } from '@/types/user';

export async function createUser(data: CreateUserRequest): Promise<CreateUserResponse> {
  const response = await fetch(`${API_BASE_URL}/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error.message);
  }

  return response.json();
}
```

---

## Manejo de estados comunes

### Loading, Error, Data
```typescript
const [data, setData] = useState<User | null>(null);
const [loading, setLoading] = useState(false);
const [error, setError] = useState<string | null>(null);

// En UI
if (loading) return <div>Loading...</div>;
if (error) return <div>Error: {error}</div>;
if (!data) return null;
```

---

## Variables de entorno

```env
# .env
VITE_API_BASE_URL=http://localhost:8080/api
```

**Acceso en código:**
```typescript
const apiUrl = import.meta.env.VITE_API_BASE_URL;
```

---

## Rutas (React Router v6)

```tsx
// src/App.tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/users" element={<Users />} />
        <Route path="/users/:id" element={<UserDetail />} />
      </Routes>
    </BrowserRouter>
  );
}
```

---

## Autenticación (si aplica)

### Almacenamiento de token
```typescript
// src/utils/auth.ts
export function setToken(token: string) {
  localStorage.setItem('token', token);
}

export function getToken(): string | null {
  return localStorage.getItem('token');
}

export function removeToken() {
  localStorage.removeItem('token');
}
```

### Agregar token a requests
```typescript
const token = getToken();
const headers: HeadersInit = {
  'Content-Type': 'application/json',
};

if (token) {
  headers['Authorization'] = `Bearer ${token}`;
}
```

---

## Testing (si aplica)

```typescript
// Button.test.tsx
import { render, screen } from '@testing-library/react';
import { Button } from './Button';

test('renders button with label', () => {
  render(<Button label="Click me" onClick={() => {}} />);
  expect(screen.getByText('Click me')).toBeInTheDocument();
});
```

---

## Comandos útiles

```bash
# Desarrollo
npm run dev

# Build producción
npm run build

# Preview build
npm run preview

# Tests
npm run test

# Linting
npm run lint

# Type checking (si usas TypeScript)
npm run type-check
```

---

## Reglas importantes

1. **NUNCA hagas suposiciones** sobre APIs - Lee la documentación
2. **SIEMPRE pregunta** dónde está la doc del endpoint antes de consumirlo
3. **SIEMPRE crea tipos** TypeScript basados en la doc del backend
4. **NO inventes** estructuras de datos o endpoints
5. **SIEMPRE maneja** estados de loading y error
6. **PREGUNTA** sobre UI/UX antes de implementar componentes complejos

---

## Workflow de desarrollo

### Para consumir un endpoint:

1. Preguntar: "¿Dónde está la documentación del endpoint?"
2. Leer `../backend/docs/api/endpoints.md`
3. Crear tipos TypeScript basados en la doc
4. Confirmar entendimiento
5. ESPERAR confirmación
6. Implementar servicio API
7. Implementar componente/hook
8. Reportar archivos creados

### Para crear un componente:

1. Preguntar: 
   - ¿Qué debe mostrar?
   - ¿Qué interacciones tiene?
   - ¿Hay diseño/mockup?
   - ¿Consume algún endpoint? (si sí, pedir doc)
2. Confirmar entendimiento
3. ESPERAR confirmación
4. Implementar
5. Reportar

---

## Estructura de tipos (TypeScript)

```typescript
// src/types/user.ts

// Request types
export interface CreateUserRequest {
  email: string;
  password: string;
  name: string;
}

// Response types
export interface User {
  id: string;
  email: string;
  name: string;
  created_at: string;
}

export interface CreateUserResponse {
  data: User;
  message: string;
}

export interface ApiError {
  error: {
    code: string;
    message: string;
    details?: string[];
  };
}
```

---

## Performance

- Lazy loading de rutas con `React.lazy()`
- Memoización con `React.memo()` solo cuando sea necesario
- `useMemo` y `useCallback` con criterio
- Optimización de imágenes (webp, lazy loading)

---

## Accesibilidad (a11y)

- Usar elementos semánticos HTML
- Agregar `aria-label` cuando sea necesario
- Asegurar navegación por teclado
- Contraste de colores WCAG AA mínimo

---

## Notas del proyecto

[AGREGA AQUÍ NOTAS ESPECÍFICAS DE TU PROYECTO]

- Feature actual en desarrollo: 
- Componentes completados: 
- Componentes pendientes: 
- Issues conocidos: 

---

**Última actualización**: 2024-11-02
