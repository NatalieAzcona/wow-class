# Backend — WöW Class

API REST construida con Node.js + Express 5. Gestiona autenticación, disponibilidades, reservas, módulos, quizzes y progreso de estudiantes.

## Tecnologías

| Tecnología | Uso |
|---|---|
| Node.js + Express 5 | Servidor y API REST |
| MongoDB + Mongoose | Base de datos y modelos |
| JSON Web Token (JWT) | Autenticación con roles |
| bcrypt | Hash de contraseñas |
| Nodemailer | Confirmaciones por correo |
| Google APIs (googleapis) | OAuth 2.0 y generación de enlaces Google Meet |
| dotenv | Variables de entorno |

## Estructura

```
backend/
├── controllers/        # Lógica de negocio por recurso
├── middlewares/        # Auth (isAuth, isTeacher)
├── models/             # Esquemas Mongoose
├── routes/             # Rutas Express por recurso
├── seed/               # Semillas + archivos CSV de datos
├── config/             # Google OAuth, Nodemailer
├── utils/              # Generación y verificación de JWT
├── app.js              # Configuración Express y rutas
└── server.js           # Conexión a MongoDB y arranque
```

## Variables de entorno

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

## Instalación y arranque

```bash
npm install
npm run dev
```

Para cargar los datos iniciales de módulos:

```bash
node seed/seed.js
```

## Colecciones de la base de datos

### User
Usuarios con dos roles posibles: `student` y `teacher`. Almacena datos de contacto, credenciales cifradas con bcrypt, tokens de Google OAuth, nivel educativo del estudiante y plan de acceso (`clases`, `contenido`, `completo`).

### Availability
Franja horaria que un profesor pone disponible. Referencia al usuario profesor y contiene fecha, hora y modalidad. Una disponibilidad solo puede tener una reserva asociada.

### Reservation
Relaciona un estudiante (User) con una franja horaria (Availability) y un profesor (User). Incluye estado (`pendiente`, `confirmada`, `rechazada`), modalidad y enlace Meet cuando aplica. Solo el propio estudiante o el profesor puede cancelarla.

### Module
Unidades de contenido educativo organizadas por asignatura (`inglés`, `matemáticas`) y nivel educativo. Cada módulo tiene título, orden, video de YouTube, contenido enriquecido (HTML via Tiptap) y referencias a sus quizzes.

### Quiz
Preguntas de opción múltiple asociadas a un módulo. Cada pregunta tiene cuatro opciones y la respuesta correcta identificada por texto.

### Progress
Registra qué módulos ha completado cada estudiante. Cada documento relaciona un `student` con un `module` con un índice único compuesto, de forma que un módulo solo puede marcarse como completado una vez por estudiante. El progreso controla el desbloqueo secuencial de módulos dentro de un nivel.

**Relaciones:**

```
User (teacher) ──< Availability ──< Reservation >── User (student)
Module ──< Quiz
User (student) ──< Progress >── Module
```

---

## Rutas de la API

### Auth
| Método | Ruta | Acceso | Descripción |
|---|---|---|---|
| POST | `/api/v1/auth/register` | Público | Registro de usuario |
| POST | `/api/v1/auth/login` | Público | Login, devuelve JWT |
| GET | `/api/v1/auth/me` | Autenticado | Datos del usuario en sesión |
| GET | `/api/v1/auth/google` | Profesor autenticado | Inicia flujo OAuth con Google |
| GET | `/api/v1/auth/google/callback` | Google | Callback OAuth, guarda tokens |
| DELETE | `/api/v1/auth/google` | Profesor autenticado | Desconecta Google Calendar |

### Usuarios
| Método | Ruta | Acceso | Descripción |
|---|---|---|---|
| GET | `/api/v1/users/me` | Autenticado | Perfil propio |
| PUT | `/api/v1/users/me` | Autenticado | Actualizar datos propios |
| GET | `/api/v1/users/students` | Profesor | Listar estudiantes |
| PATCH | `/api/v1/users/:id/plan` | Profesor | Cambiar plan de un estudiante |
| PATCH | `/api/v1/users/:id/level` | Profesor | Cambiar nivel de un estudiante |

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
| POST | `/api/v1/reservation` | Estudiante | Crear reserva |
| PUT | `/api/v1/reservation/:id` | Profesor | Confirmar o rechazar reserva |
| DELETE | `/api/v1/reservation/:id` | Propietario o profesor | Cancelar reserva |

### Módulos
| Método | Ruta | Acceso | Descripción |
|---|---|---|---|
| GET | `/api/v1/module` | Autenticado | Listar módulos |
| GET | `/api/v1/module/:id` | Autenticado | Obtener módulo por id |
| POST | `/api/v1/module` | Profesor | Crear módulo |
| PUT | `/api/v1/module/:id` | Profesor | Editar módulo |
| DELETE | `/api/v1/module/:id` | Profesor | Eliminar módulo |

### Quizzes
| Método | Ruta | Acceso | Descripción |
|---|---|---|---|
| GET | `/api/v1/quiz/module/:moduleId` | Autenticado | Quiz de un módulo |
| POST | `/api/v1/quiz` | Profesor | Crear quiz |
| PUT | `/api/v1/quiz/:id` | Profesor | Editar quiz |

### Progreso
| Método | Ruta | Acceso | Descripción |
|---|---|---|---|
| GET | `/api/v1/progress` | Estudiante | IDs de módulos completados |
| POST | `/api/v1/progress/:moduleId` | Estudiante | Marcar módulo como completado |
