# Frontend — WöW Class

Interfaz de usuario construida con React 19 + Vite. SPA con rutas protegidas por rol (estudiante / profesor).

## Tecnologías

| Tecnología | Uso |
|---|---|
| React 19 + Vite | Interfaz de usuario |
| React Router DOM v7 | Navegación y rutas protegidas |
| TanStack Query v5 | Fetching, caché e invalidación de datos |
| SCSS | Estilos con sistema de variables y mixins |
| react-big-calendar | Visualización del calendario |
| Tiptap | Editor de texto enriquecido para contenido de módulos |
| react-hook-form | Gestión y validación de formularios |
| date-fns | Formateo y manipulación de fechas |
| react-floating-whatsapp | Botón de contacto |
| Font Awesome | Iconografía |

## Estructura

```
frontend/src/
├── components/
│   ├── calendar/   # Calendario, modales de reserva, banner Google
│   ├── subjects/   # Niveles, módulos, quizzes, editor de contenido
│   └── profile/    # Avatar, tarjeta de perfil
├── context/        # AuthContext (token, user, login, logout)
├── data/           # PLANS, LEVELS, STEPS — fuente única de datos estáticos
├── hooks/          # Custom hooks reutilizables
├── layout/
│   ├── public/     # NavBarPublic, Footer
│   └── private/    # NavBarPrivate
├── pages/
│   ├── dashboards/ # ProfilePage, ModulesPage, PlansPage, RevenuePage
│   ├── legal/      # AvisoLegal, Privacidad, Cookies
│   ├── Home.jsx    # Landing page
│   ├── Login.jsx
│   └── Register.jsx
├── router/         # AppRouter, PrivateRoute
└── styles/         # Variables CSS globales, mixins SCSS compartidos
```

## Variables de entorno

Crear `.env` en `/frontend`:

```env
VITE_API_URL=http://localhost:3000/api/v1
```

## Instalación y arranque

```bash
npm install
npm run dev
```

## Sistema de estilos

SCSS con variables CSS globales definidas en `src/index.css`:

```css
--color-black, --color-white
--color-pink, --color-yellow, --color-turquoise
--color-gray-100 a --color-gray-900
--font-heading, --font-body
```

Mixins compartidos en `src/styles/mixins.scss`: `outline-btn($color)`, `primary-btn`, `btn-pressed`, `section-title`, etc. Todos los componentes importan los mixins con `@use '../../styles/mixins' as *` y siguen nomenclatura BEM.

Las asignaturas aplican tematización por CSS custom properties (`--color-subject-light`, `--color-subject-dark`) que cambian según la clase del contenedor, de forma que módulos, niveles y estados bloqueados adoptan el color de la asignatura automáticamente.

## Custom hooks

| Hook | Para qué |
|---|---|
| `useAuth` | Acceso al contexto de autenticación. Expone `user`, `token`, `login`, `logout`, `updateUser`, `isTeacher`, `isStudent` sin necesidad de importar `AuthContext` directamente. |

## Hooks de React utilizados

| Hook | Dónde | Para qué |
|---|---|---|
| `useContext` | Encapsulado en `useAuth` | Acceso global a `AuthContext` |
| `useRef` | Modales del calendario, menú de módulos | Control de `<dialog>` nativo y detección de click fuera del menú |
| `useQuery` | Fetching de datos | Obtener disponibilidades, reservas, módulos, quizzes y progreso con caché automática |
| `useMutation` | Formularios | Crear reservas, guardar módulos, responder quizzes con invalidación de caché |
| `useQueryClient` | Tras mutaciones | `invalidateQueries({ queryKey })` para refrescar datos sin recargar la página |
| `useNavigate` | Logout, formularios, retroceso dinámico | Redirección programática tras acciones |
| `useParams` | Rutas anidadas | Extraer `subject`, `level`, `moduleId` de la URL |
| `useLocation` | Google OAuth | Detectar `?connected=true` al volver del flujo de autorización |

## Sistema de planes

Los estudiantes tienen tres planes: `clases`, `contenido` y `completo`. El plan determina qué módulos son accesibles:

- **clases**: solo el primer módulo de cada nivel es libre, el resto muestra un acceso bloqueado con enlace a `/dashboard/plans`.
- **contenido** y **completo**: acceso completo a todos los módulos.

El profesor puede cambiar el plan y el nivel de cualquier estudiante desde el panel de gestión de planes (`PlansManager`).

## Progresión por quiz

Dentro de cada módulo hay un quiz. Al aprobarlo, el módulo queda marcado como completado y el siguiente se desbloquea. Si el estudiante vuelve a entrar a un módulo ya completado, ve una pantalla de confirmación con la opción de repetir el quiz en modo práctica (sin afectar el progreso ya guardado).

## Librerías fuera del temario del curso

- **TanStack Query v5** — gestión avanzada del estado del servidor: caché automática, refetch, estados de carga y error, invalidación de queries tras mutaciones. Sustituye el patrón manual de `useEffect` + `fetch` + `useState`.
- **Tiptap** — editor de texto enriquecido usado para crear y editar el contenido de los módulos educativos.
- **react-hook-form** — librería de formularios con validación integrada y mínimo re-render.
- **react-big-calendar** — componente de calendario con vistas semana/mes y soporte de zonas horarias.
