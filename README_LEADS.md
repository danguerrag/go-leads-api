# API de Leads - NestJS + MongoDB

API REST para gestionar leads de formularios de contacto, construida con NestJS y MongoDB.

## � Documentación

- **[README_LEADS.md](README_LEADS.md)** - Este archivo (guía de inicio rápido)
- **[API_DOCUMENTATION.md](API_DOCUMENTATION.md)** - Documentación completa de la API y endpoints
- **[EMAIL_SETUP.md](EMAIL_SETUP.md)** - Guía detallada para configurar notificaciones por email
- **[.env.example](.env.example)** - Plantilla con todas las variables de entorno disponibles

## �🚀 Inicio Rápido con Docker

La forma más fácil de comenzar es usar Docker Compose:

```bash
# 1. Iniciar MongoDB
docker-compose up -d

# 2. Instalar dependencias
npm install

# 3. Crear archivo .env
# (ver sección de configuración)

# 4. Iniciar el servidor
npm run start:dev
```

La API estará disponible en `http://localhost:3001`

## 📋 Requisitos

- Node.js v18 o superior
- MongoDB 4.4 o superior (o Docker)

## 🔧 Instalación

### 1. Clonar e instalar dependencias

```bash
npm install
```

### 2. Configurar variables de entorno

Crear un archivo `.env` en la raíz del proyecto:

```env
MONGODB_URI=mongodb://localhost:27017/leads-db
PORT=3001

# Email notifications (opcional - ver .env.example)
EMAIL_ENABLED=false
```

**Para habilitar notificaciones por email:**
- Ver instrucciones detalladas en [.env.example](.env.example)
- Configurar con Gmail, Outlook, o cualquier servidor SMTP

### 3. Iniciar MongoDB

**Opción A: Con Docker (Recomendado)**
```bash
docker-compose up -d
```

**Opción B: MongoDB Local**
- Ver instrucciones de instalación en [API_DOCUMENTATION.md](API_DOCUMENTATION.md)

**Opción C: MongoDB Atlas (Cloud)**
- Crear cuenta en https://www.mongodb.com/cloud/atlas
- Actualizar `MONGODB_URI` en `.env` con tu cadena de conexión

### 4. Iniciar la aplicación

```bash
# Desarrollo
npm run start:dev

# Producción
npm run build
npm run start:prod
```

## 📚 Documentación de la API

Ver [API_DOCUMENTATION.md](API_DOCUMENTATION.md) para información detallada sobre los endpoints y uso.

### Endpoints principales

- `POST /leads` - Crear un nuevo lead
- `GET /leads` - Obtener todos los leads
- `GET /leads/:id` - Obtener un lead específico
- `PATCH /leads/:id` - Actualizar un lead
- `DELETE /leads/:id` - Eliminar un lead

## 🧪 Ejemplo de uso

```javascript
// Enviar un lead desde un formulario
const response = await fetch('http://localhost:3001/leads', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    fullName: "Juan Pérez",
    email: "juan@example.com",
    phone: "+34 600 123 456",
    message: "Estoy interesado en sus servicios"
  })
});

const lead = await response.json();
console.log(lead);
```

## 🛠️ Scripts disponibles

```bash
# Desarrollo
npm run start:dev

# Producción
npm run build
npm run start:prod

# Tests
npm run test
npm run test:e2e
npm run test:cov

# Linting
npm run lint
```

## 🗄️ Base de datos

**Database:** `leads-db`  
**Collection:** `leads`

**Campos:**
- `fullName`: String (requerido)
- `email`: String (requerido, validado)
- `phone`: String (requerido)
- `message`: String (requerido)
- `date`: Date (opcional, por defecto: fecha actual)
- Timestamps automáticos: `createdAt`, `updatedAt`

## 📧 Notificaciones por Email

La API envía notificaciones automáticas por email cuando se recibe un nuevo lead.

**Características:**
- ✅ Activación/desactivación configurable
- ✅ Compatible con Gmail, Outlook, Yahoo, SendGrid, Mailgun
- ✅ Email HTML con formato profesional
- ✅ Información completa del lead

**Configuración rápida con Gmail:**
1. Genera una "Contraseña de aplicación" en tu cuenta de Google
2. Configura las variables en `.env` (ver [.env.example](.env.example))
3. Establece `EMAIL_ENABLED=true`

Ver [API_DOCUMENTATION.md](API_DOCUMENTATION.md#notificaciones-por-email) para más detalles.

## 🐳 Docker

Para detener MongoDB:
```bash
docker-compose down
```

Para detener y eliminar los datos:
```bash
docker-compose down -v
```

## 📝 Licencia

UNLICENSED
