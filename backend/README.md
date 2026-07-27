# Backend — WöW Class

API REST construida con Node.js + Express 5. Gestiona autenticación, disponibilidades, reservas, módulos y quizzes.

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

El proyecto tiene cinco colecciones relacionadas entre sí:

### User
Usuarios con dos roles posibles: `student`, `teacher`. Almacena datos de contacto, credenciales cifradas, tokens de Google OAuth, el email de la cuenta de Google conectada y el nivel educativo del estudiante.

### Availability
Franja horaria que un profesor pone disponible. Referencia al usuario profesor y contiene fecha, hora y modalidad. Una disponibilidad solo puede tener una reserva asociada.

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
| PUT | `/api/v1/reservation/:id` | Profesor | Confirmar o rechazar reserva |
| DELETE | `/api/v1/reservation/:id` | Autenticado | Cancelar reserva |

### Módulos
| Método | Ruta | Acceso | Descripción |
|---|---|---|---|
| GET | `/api/v1/modules` | Autenticado | Listar módulos (filtrar por asignatura/nivel) |
| POST | `/api/v1/modules` | Profesor | Crear módulo |
| PUT | `/api/v1/modules/:id` | Profesor | Editar módulo |
| DELETE | `/api/v1/modules/:id` | Profesor | Eliminar módulo |

### Quizzes
| Método | Ruta | Acceso | Descripción |
|---|---|---|---|
| GET | `/api/v1/quiz/:moduleId` | Autenticado | Preguntas de un módulo |
| POST | `/api/v1/quiz` | Profesor | Crear pregunta |
| PUT | `/api/v1/quiz/:id` | Profesor | Editar pregunta |
| DELETE | `/api/v1/quiz/:id` | Profesor | Eliminar pregunta |
