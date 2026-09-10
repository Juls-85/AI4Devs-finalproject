# Guía de Testing - Frapen Angels

## Descripción General

Este proyecto incluye una suite completa de testing que cubre:
- **Tests Unitarios** (Servicios del backend)
- **Tests de Componentes** (Componentes React del frontend)
- **Tests E2E** (Flujo completo de autenticación)

## Requisitos Previos

Asegúrate de que tienes instaladas todas las dependencias:

```bash
npm install
```

## Ejecutar Tests

### 1. Tests Unitarios (Backend)

Ejecutar todos los tests unitarios de los servicios del backend:

```bash
npm test
```

Ejecutar tests en modo watch (se re-ejecutan al cambiar archivos):

```bash
npm run test:watch
```

Ejecutar tests con reporte de cobertura:

```bash
npm run test:cov
```

#### Archivos de Tests del Backend

- `src/app/auth/services/auth.service.spec.ts` - Tests del AuthService
  - ✅ Registro de usuario
  - ✅ Login de usuario
  - ✅ Validación de email
  - ✅ Validación de contraseña
  - ✅ Manejo de errores

- `src/app/members/services/members.service.spec.ts` - Tests del MembersService
  - ✅ Obtener información del miembro
  - ✅ Actualizar perfil del miembro
  - ✅ Actualizar foto de perfil
  - ✅ Manejo de errores para miembros no existentes

### 2. Tests de Componentes (Frontend)

#### Tests de LoginPage
- Archivo: `src/presentation/pages/LoginPage.test.tsx`
- Tests:
  - ✅ Renderizado del formulario
  - ✅ Actualización de campos del formulario
  - ✅ Presencia del botón de login
  - ✅ Links de navegación (registro, olvidé contraseña)

#### Tests de RegisterPage
- Archivo: `src/presentation/pages/RegisterPage.test.tsx`
- Tests:
  - ✅ Renderizado del formulario con todos los campos
  - ✅ Campos requeridos y opcionales
  - ✅ Layout de 2 columnas para los campos
  - ✅ Actualización de campos del formulario
  - ✅ Links de navegación

### 3. Tests E2E (Flujo de Autenticación)

El test E2E simula el flujo completo de autenticación del usuario.

#### Requisitos Previos para Tests E2E

1. **Inicia el servidor del backend:**
```bash
npm run dev
```

2. **En otra terminal, inicia el frontend:**
```bash
npm run dev:frontend
```

El frontend debe estar ejecutándose en `http://localhost:3001`

#### Ejecutar Tests E2E

**Modo interactivo (GUI de Cypress):**
```bash
npm run test:e2e
```

**Modo headless (CI/CD):**
```bash
npm run test:e2e:run
```

#### Flujo del Test E2E

La suite de tests `cypress/e2e/auth-flow.cy.ts` cubre:

1. **Navegar a la página de Registro**
   - ✅ Verificar que la página de inicio con el botón de registro sea visible
   - ✅ Hacer clic en el botón de registro y navegar a la página de registro

2. **Registrar Nuevo Usuario**
   - ✅ Rellenar todos los campos del formulario con datos válidos
   - ✅ Enviar el formulario de registro
   - ✅ Verificar redirección a la página de inicio después del registro

3. **Verificar Estado de Sesión Iniciada**
   - ✅ Verificar si la barra lateral es visible (usuario conectado)
   - ✅ Verificar que los datos del usuario se muestren

4. **Logout**
   - ✅ Hacer clic en el botón de logout
   - ✅ Redirigir a la página de login

5. **Login con Usuario Registrado**
   - ✅ Navegar a la página de login
   - ✅ Rellenar credenciales de login
   - ✅ Enviar el formulario de login
   - ✅ Redirigir a la página de inicio

6. **Verificar Información de Usuario Conectado**
   - ✅ Verificar la visibilidad de la barra lateral
   - ✅ Verificar que el nombre y email del usuario se muestren

7. **Navegar al Perfil**
   - ✅ Hacer clic en "Mi Perfil" en la barra lateral
   - ✅ Verificar que la página de perfil se cargue
   - ✅ Verificar que la información del usuario se muestre

8. **Logout desde el Perfil**
   - ✅ Hacer clic en el botón de logout
   - ✅ Redirigir a la página de login
   - ✅ Verificar que no haya barra lateral en la página de inicio

### 4. Ejecutar Todos los Tests

Ejecutar todos los tests unitarios y E2E:

```bash
npm run test:all
```

Nota: Los tests E2E requieren que tanto el servidor del backend como el del frontend estén ejecutándose.

## Resultados de Tests y Cobertura

Después de ejecutar los tests, ver los reportes de cobertura:

```bash
npm run test:cov
```

Los reportes de cobertura se generan en el directorio `coverage/`.

## Estructura de Tests

```
src/
├── app/
│   ├── auth/
│   │   └── services/
│   │       ├── auth.service.ts
│   │       └── auth.service.spec.ts
│   └── members/
│       └── services/
│           ├── members.service.ts
│           └── members.service.spec.ts
├── presentation/
│   ├── pages/
│   │   ├── LoginPage.tsx
│   │   ├── LoginPage.test.tsx
│   │   ├── RegisterPage.tsx
│   │   └── RegisterPage.test.tsx
│   └── ...
cypress/
├── e2e/
│   └── auth-flow.cy.ts
├── support/
│   ├── commands.ts
│   └── e2e.ts
└── ...
```

## Integración CI/CD

Para ejecutar tests en pipelines de CI/CD:

```bash
# Tests unitarios y de componentes
npm test

# Tests E2E (requiere servidores en ejecución)
npm run test:e2e:run

# Todos los tests
npm run test:all
```

## Solución de Problemas

### Los Tests E2E no pueden conectar

**Problema:** Cypress no puede conectar a la aplicación

**Solución:**
1. Asegúrate de que el backend está en ejecución: `npm run dev`
2. Asegúrate de que el frontend está en ejecución: `npm run dev:frontend` (en otra terminal)
3. Verifica que el frontend esté en `http://localhost:3001`
4. Comprueba la configuración del firewall

### Tests se agota el tiempo

**Problema:** Los tests tardan demasiado o se agota el tiempo

**Solución:**
1. Aumentar el timeout de Jest en los archivos de test:
   ```typescript
   jest.setTimeout(10000); // 10 segundos
   ```

2. Aumentar el timeout de Cypress en `cypress.config.ts`:
   ```typescript
   defaultCommandTimeout: 10000
   ```

### Problemas de Conexión a la Base de Datos

**Problema:** Los tests del backend fallan debido a la base de datos

**Solución:**
- Los tests del backend utilizan repositorios simulados (no se necesita base de datos real)
- Asegúrate de que PostgreSQL esté en ejecución para desarrollo local
- Utiliza la configuración de base de datos de prueba para tests de integración

## Contribuir

Cuando agregues nuevas características:
1. Escribe tests unitarios para los servicios del backend
2. Escribe tests de componentes para los componentes React
3. Añade tests E2E para los flujos de usuario críticos
4. Mantén una cobertura mínima del 70%
5. Ejecuta `npm run test:all` antes de hacer commit

## Recursos

- [Documentación de Jest](https://jestjs.io/)
- [React Testing Library](https://testing-library.com/react)
- [Documentación de Cypress](https://docs.cypress.io/)
- [Testing en NestJS](https://docs.nestjs.com/fundamentals/testing)
