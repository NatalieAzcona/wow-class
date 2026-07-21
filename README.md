# WöW Class

Plataforma web para clases particulares de inglés y matemáticas orientada a niños. Cuenta con dos roles: estudiante y profesor.

Los estudiantes pueden avanzar por niveles y módulos de contenido educativo, ver videos, completar quizzes y reservar clases personalizadas con el profesor directamente desde la plataforma. El profesor tiene dos opciones para gestionar clases: indicar su disponibilidad para que los estudiantes hagan solicitudes, o agendar directamente una clase confirmada con un estudiante en modo presencial u online. También confirma o rechaza solicitudes pendientes y crea y edita el contenido de cada módulo. Al confirmar una clase online, la plataforma genera automáticamente un enlace de Google Meet y envía correos de confirmación tanto al estudiante como al profesor. En todo momento la plataforma dispone de un botón de WhatsApp para consultas directas.

Construida con **React + Vite** en el frontend, **Node.js + Express** en el backend y **MongoDB** como base de datos. Usa **TanStack Query** para la gestión del estado del servidor, **Tiptap** como editor de contenido enriquecido, **react-big-calendar** para la agenda y **Nodemailer** para el envío de correos transaccionales.

---

## Tecnologías

### Backend
| Tecnología | Uso |
|---|---|
| Node.js + Express 5 | Servidor y API REST |
| MongoDB + Mongoose | Base de datos y modelos |
| JSON Web Token (JWT) | Autenticación con roles |
| bcrypt | Hash de contraseñas |
| Nodemailer | Confirmaciones por correo |
| Google APIs (googleapis) | Generación de enlaces Google Meet al confirmar clases online |
| dotenv | Variables de entorno |

### Frontend
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

---

## Librerías fuera del temario del curso

Las siguientes librerías no forman parte del temario y fueron investigadas e integradas de forma autónoma:

- **TanStack Query v5** — gestión avanzada del estado del servidor: caché automática, refetch, estados de carga y error, invalidación de queries tras mutaciones. Sustituye el patrón manual de `useEffect` + `fetch` + `useState`.
- **Tiptap** — editor de texto enriquecido (basado en ProseMirror) usado para crear y editar el contenido de los módulos educativos.
- **react-hook-form** — librería de formularios con validación integrada y mínimo re-render.
- **react-big-calendar** — componente de calendario con vistas semana/mes, arrastrar y soltar eventos, y soporte de zonas horarias.
- **Google APIs (googleapis)** — OAuth 2.0 con Google: al conectar la cuenta se obtiene el email de Google y los tokens de acceso. Al confirmar una clase online, el backend genera automáticamente un enlace de Google Meet y lo incluye en el correo de confirmación.
- **Nodemailer** — envío de correos transaccionales (confirmación de reserva para alumno y profesor) desde el backend.

---

## Arquitectura del proyecto

```
wow-class/
├── backend/
│   ├── controllers/        # Lógica de negocio por recurso
│   ├── middlewares/        # Auth (isAuth, isTeacher)
│   ├── models/             # Esquemas Mongoose
│   ├── routes/             # Rutas Express por recurso
│   ├── seed/               # Semillas + archivos CSV de datos
│   ├── app.js              # Configuración Express y rutas
│   └── server.js           # Conexión a MongoDB y arranque
│
└── frontend/
    └── src/
        ├── components/
        │   ├── calendar/   # Calendario, modales de reserva, banner Google
        │   ├── subjects/   # Niveles, módulos, quizzes, editor de contenido
        │   └── profile/    # Avatar, tarjeta de perfil
        ├── context/        # AuthContext (token, user, login, logout)
        ├── layout/
        │   ├── public/     # NavBarPublic, Footer
        │   └── private/    # NavBarPrivate
        ├── pages/
        │   ├── dashboards/ # ProfilePage, ModulesPage
        │   ├── legal/      # AvisoLegal, Privacidad, Cookies
        │   ├── Home.jsx    # Landing page
        │   ├── Login.jsx
        │   └── Register.jsx
        ├── router/         # AppRouter, PrivateRoute
        └── styles/         # Variables CSS globales, mixins SCSS compartidos
```

---

## Colecciones de la base de datos

El proyecto tiene cinco colecciones relacionadas entre sí:

### User
Usuarios con dos roles posibles: `student`, `teacher`. Almacena datos de contacto, credenciales cifradas, tokens de Google OAuth y el email de la cuenta de Google conectada para la integración con Calendar.

### Availability
Franja horaria que un profesor pone disponible. Referencia al usuario profesor y contiene fecha, hora y modalidad (online/presencial). Una disponibilidad solo puede tener una reserva asociada.

### Reservation
Relaciona un estudiante (User) con una franja horaria (Availability). Incluye la modalidad elegida. Al crearse, dispara el envío automático de correos de confirmación.

### Module
Unidades de contenido educativo organizadas por asignatura (`ingles`, `mates`) y nivel (`1` a `5`). Cada módulo tiene título, descripción, video de YouTube, contenido enriquecido (HTML via Tiptap) y orden.

### Quiz
Preguntas de opción múltiple asociadas a un módulo. Cada pregunta tiene cuatro opciones y el texto de la respuesta correcta.

**Relaciones:**

```
User (professor) ──< Availability ──< Reservation >── User (student)
Module ──< Quiz
```

### Generación de la base de datos desde CSV

Los módulos educativos se cargaron a partir de dos archivos CSV (`modules_ingles.csv`, `modules_mates.csv`) mediante el módulo `fs` de Node.js. La semilla lee los archivos parsea las filas y crea los documentos en MongoDB:

```
backend/seed/
├── modules_ingles.csv   # 60 módulos de inglés (niveles 1-5)
├── modules_mates.csv    # 60 módulos de matemáticas (niveles 1-5)
└── seed.js              # Lee CSVs con fs.readFileSync y puebla la BD
```

Para ejecutar la semilla:

```bash
cd backend
node seed/seed.js
```

---

## Hooks avanzados de React utilizados

| Hook | Dónde | Para qué |
|---|---|---|
| `useContext` | Toda la app | Acceso global a `AuthContext` (token, user, login, logout) |
| `useRef` | Modales del calendario, menú de módulos | Control de `<dialog>` nativo y detección de click fuera del menú |
| `useQuery` | Fetching de datos | Obtener disponibilidades, reservas, módulos y quizzes con caché automática |
| `useMutation` | Formularios | Crear reservas, guardar módulos, responder quizzes con invalidación de caché |
| `useQueryClient` | Tras mutaciones | `invalidateQueries` para refrescar datos sin recargar la página |
| `useNavigate` | Logout, formularios | Redirección programática tras acciones |
| `useParams` | Rutas anidadas | Extraer `subject`, `level`, `moduleId` de la URL |
| `useLocation` | Google OAuth, Login | Detectar `?connected=true` al volver de OAuth y mostrar mensaje de registro exitoso |

---

## Sistema de estilos

El diseño usa SCSS con un sistema de variables CSS globales definidas en `src/index.css`:

```css
--color-black, --color-white
--color-pink, --color-yellow, --color-turquoise
--color-gray-100 a --color-gray-900
--font-heading, --font-body
```

Los mixins compartidos en `src/styles/mixins.scss` encapsulan patrones reutilizables: `outline-btn($color)`, `content-card`, etc. Todos los componentes importan los mixins con `@use '../../styles/mixins' as *` y siguen nomenclatura BEM.

---

## Rutas de la API

### Auth
| Método | Ruta | Acceso | Descripción |
|---|---|---|---|
| POST | `/api/v1/auth/register` | Público | Registro de usuario |
| POST | `/api/v1/auth/login` | Público | Login, devuelve JWT |
| GET | `/api/v1/auth/google` | Profesor autenticado | Inicia flujo OAuth con Google |
| GET | `/api/v1/auth/google/callback` | Google | Callback OAuth, guarda tokens |
| DELETE | `/api/v1/auth/google` | Profesor autenticado | Desconecta Google Calendar |

### Usuarios
| Método | Ruta | Acceso | Descripción |
|---|---|---|---|
| GET | `/api/v1/users/me` | Autenticado | Perfil propio |
| PUT | `/api/v1/users/me` | Autenticado | Actualizar datos propios |
| GET | `/api/v1/users/students` | Profesor | Listar estudiantes |

### Disponibilidades
| Método | Ruta | Acceso | Descripción |
|---|---|---|---|
| GET | `/api/v1/availability` | Autenticado | Listar disponibilidades |
| POST | `/api/v1/availability` | Profesor | Crear franja horaria |
| DELETE | `/api/v1/availability/:id` | Profesor | Eliminar franja |

### Reservas
| Método | Ruta | Acceso | Descripción |
|---|---|---|---|
| GET | `/api/v1/reservation` | Autenticado | Reservas propias |
| POST | `/api/v1/reservation` | Estudiante | Crear reserva (valida duplicados) |
| PUT | `/api/v1/reservation/:id` | Profesor | Confirmar con Meet link |
| DELETE | `/api/v1/reservation/:id` | Autenticado | Cancelar reserva |

### Módulos
| Método | Ruta | Acceso | Descripción |
|---|---|---|---|
| GET | `/api/v1/modules` | Autenticado | Listar módulos (filtrar por asignatura/nivel) |
| POST | `/api/v1/modules` | Profesor/Admin | Crear módulo |
| PUT | `/api/v1/modules/:id` | Profesor/Admin | Editar módulo |
| DELETE | `/api/v1/modules/:id` | Profesor/Admin | Eliminar módulo |

### Quizzes
| Método | Ruta | Acceso | Descripción |
|---|---|---|---|
| GET | `/api/v1/quiz/:moduleId` | Autenticado | Preguntas de un módulo |
| POST | `/api/v1/quiz` | Profesor/Admin | Crear pregunta |
| PUT | `/api/v1/quiz/:id` | Profesor/Admin | Editar pregunta |
| DELETE | `/api/v1/quiz/:id` | Profesor/Admin | Eliminar pregunta |

---

## Instalación y ejecución local

### Requisitos
- Node.js 18+
- MongoDB local o Atlas

### Backend

```bash
cd backend
npm install
```

Crear `.env` en `/backend`:

```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/wowclass
JWT_SECRET=tu_secreto_jwt

GMAIL_USER=tu_correo@gmail.com
GMAIL_PASS=tu_app_password_gmail

GOOGLE_CLIENT_ID=tu_google_client_id
GOOGLE_CLIENT_SECRET=tu_google_client_secret
GOOGLE_REDIRECT_URI=http://localhost:3000/api/v1/auth/google/callback

FRONTEND_URL=http://localhost:5173
```

```bash
npm run dev
```

Para cargar los datos iniciales de módulos:

```bash
node seed/seed.js
```

### Frontend

```bash
cd frontend
npm install
```

Crear `.env` en `/frontend`:

```env
VITE_API_URL=http://localhost:3000/api/v1
```

```bash
npm run dev
```

---

## Despliegue

| | Enlace |
|---|---|
| Frontend | https://wow-class-frontend.vercel.app |
| Backend | https://wow-class-backend.onrender.com |

---

## Autora

Natalie Azcona — proyecto final Rock The Code de ThePower
