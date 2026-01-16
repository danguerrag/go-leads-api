# API de Leads - Documentación

API REST para recibir datos de formularios de contacto desde una página web, con persistencia en MongoDB.

## Requisitos previos

- Node.js (v18 o superior)
- MongoDB (v4.4 o superior)

### Instalación de MongoDB

**Opción 1: MongoDB Community Edition (local)**

**Windows:**
1. Descargar MongoDB desde: https://www.mongodb.com/try/download/community
2. Instalar y seguir las instrucciones del instalador
3. MongoDB se instalará como servicio de Windows

**macOS:**
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

**Linux (Ubuntu/Debian):**
```bash
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org
sudo systemctl start mongod
```

**Opción 2: MongoDB Atlas (cloud - recomendado para desarrollo)**

1. Crear una cuenta gratuita en https://www.mongodb.com/cloud/atlas
2. Crear un cluster gratuito
3. Obtener la cadena de conexión
4. Actualizar `.env` con tu URI de MongoDB Atlas:
```env
MONGODB_URI=mongodb+srv://<usuario>:<password>@<cluster>.mongodb.net/leads-db?retryWrites=true&w=majority
```

**Opción 3: Docker (más fácil para desarrollo)**

```bash
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

## Configuración

1. **Instalar dependencias:**
```bash
npm install
```

2. **Configurar variables de entorno:**

Crear un archivo `.env` en la raíz del proyecto:
```env
MONGODB_URI=mongodb://localhost:27017/leads-db
PORT=3001

# Email notifications (opcional)
EMAIL_ENABLED=false
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=tu-email@gmail.com
EMAIL_PASSWORD=tu-contraseña-de-aplicacion
EMAIL_FROM=tu-email@gmail.com
NOTIFICATION_EMAIL=destinatario@example.com
```

**Nota:** Ver [.env.example](.env.example) para instrucciones detalladas de configuración de email.

3. **Iniciar MongoDB:**

Asegúrate de que MongoDB esté corriendo según el método de instalación que elegiste.

## Iniciar el servidor

```bash
# Modo desarrollo (con recarga automática)
npm run start:dev

# Modo producción
npm run build
npm run start:prod
```

El servidor estará disponible en `http://localhost:3001`

## Endpoints

### Crear un Lead (POST)

**Endpoint:** `POST http://localhost:3001/leads`

**Body (JSON):**
```json
{
  "fullName": "Juan Pérez",
  "email": "juan.perez@example.com",
  "phone": "+34 600 123 456",
  "message": "Estoy interesado en sus servicios",
  "date": "2026-01-16T10:30:00.000Z"
}
```

**Nota:** El campo `date` es opcional. Si no se proporciona, se utilizará la fecha actual.

**Respuesta exitosa (201 Created):**
```json
{
  "_id": "679e8f4a2c3b1e4f8a1d2e3f",
  "fullName": "Juan Pérez",
  "email": "juan.perez@example.com",
  "phone": "+34 600 123 456",
  "message": "Estoy interesado en sus servicios",
  "date": "2026-01-16T10:30:00.000Z",
  "createdAt": "2026-01-16T10:30:00.000Z",
  "updatedAt": "2026-01-16T10:30:00.000Z",
  "__v": 0
}
```

**Nota:** MongoDB genera automáticamente un `_id` único para cada documento.

### Obtener todos los Leads (GET)

**Endpoint:** `GET http://localhost:3001/leads`

**Respuesta exitosa (200 OK):**
```json
[
  {
    "_id": "679e8f4a2c3b1e4f8a1d2e3f",
    "fullName": "Juan Pérez",
    "email": "juan.perez@example.com",
    "phone": "+34 600 123 456",
    "message": "Estoy interesado en sus servicios",
    "date": "2026-01-16T10:30:00.000Z",
    "createdAt": "2026-01-16T10:30:00.000Z",
    "updatedAt": "2026-01-16T10:30:00.000Z",
    "__v": 0
  }
]
```

### Obtener un Lead por ID (GET)

**Endpoint:** `GET http://localhost:3001/leads/:id`

**Ejemplo:** `GET http://localhost:3001/leads/679e8f4a2c3b1e4f8a1d2e3f`

**Nota:** El ID debe ser un ObjectId válido de MongoDB.

**Respuesta exitosa (200 OK):**
```json
{
  "_id": "679e8f4a2c3b1e4f8a1d2e3f",
  "fullName": "Juan Pérez",
  "email": "juan.perez@example.com",
  "phone": "+34 600 123 456",
  "message": "Estoy interesado en sus servicios",
  "date": "2026-01-16T10:30:00.000Z",
  "createdAt": "2026-01-16T10:30:00.000Z",
  "updatedAt": "2026-01-16T10:30:00.000Z",
  "__v": 0
}
```

### Actualizar un Lead (PATCH)

**Endpoint:** `PATCH http://localhost:3001/leads/:id`

**Body (JSON) - Todos los campos son opcionales:**
```json
{
  "phone": "+34 600 999 888"
}
```

**Respuesta exitosa (200 OK):**
```json
{
  "_id": "679e8f4a2c3b1e4f8a1d2e3f",
  "fullName": "Juan Pérez",
  "email": "juan.perez@example.com",
  "phone": "+34 600 999 888",
  "message": "Estoy interesado en sus servicios",
  "date": "2026-01-16T10:30:00.000Z",
  "createdAt": "2026-01-16T10:30:00.000Z",
  "updatedAt": "2026-01-16T10:35:00.000Z",
  "__v": 0
}
```

### Eliminar un Lead (DELETE)

**Endpoint:** `DELETE http://localhost:3001/leads/:id`

**Ejemplo:** `DELETE http://localhost:3001/leads/679e8f4a2c3b1e4f8a1d2e3f`

**Respuesta exitosa (204 No Content):** Sin contenido

## Validaciones

- `fullName`: Requerido, debe ser una cadena de texto
- `email`: Requerido, debe ser un email válido
- `phone`: Requerido, debe ser una cadena de texto
- `message`: Requerido, debe ser una cadena de texto
- `date`: Opcional, debe ser una fecha válida

## Base de datos MongoDB

**Database:** `leads-db`  
**Collection:** `leads`

**Schema:**
- `_id`: ObjectId (generado automáticamente)
- `fullName`: String (requerido)
- `email`: String (requerido)
- `phone`: String (requerido)
- `message`: String (requerido)
- `date`: Date (por defecto: fecha actual)
- `createdAt`: Date (timestamp automático)
- `updatedAt`: Date (timestamp automático)
- `__v`: Number (versión del documento - Mongoose)

## Ejemplo de uso desde un formulario HTML

```javascript
async function enviarFormulario(event) {
  event.preventDefault();
  
  const formData = {
    fullName: document.getElementById('fullName').value,
    email: document.getElementById('email').value,
    phone: document.getElementById('phone').value,
    message: document.getElementById('message').value
  };

  try {
    const response = await fetch('http://localhost:3001/leads', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    });

    if (response.ok) {
      const lead = await response.json();
      console.log('Lead creado:', lead);
      alert('¡Mensaje enviado correctamente!');
    } else {
      console.error('Error al enviar el formulario');
    }
  } catch (error) {
    console.error('Error:', error);
  }
}
```

## Iniciar el servidor

```bash
# Modo desarrollo (con recarga automática)
npm run start:dev

# Modo producción
npm run build
npm run start:prod
```

El servidor estará disponible en `http://localhost:3001`

## CORS

CORS está habilitado por defecto, permitiendo peticiones desde cualquier origen.

## Notificaciones por Email

La API puede enviar notificaciones por email automáticamente cuando se recibe un nuevo lead.

### Configuración de Email

1. **Habilitar las notificaciones:**
   
   En el archivo `.env`, configura:
   ```env
   EMAIL_ENABLED=true
   ```

2. **Configurar Gmail (recomendado para pruebas):**

   a. Activa la verificación en dos pasos en tu cuenta de Google:
      - Ve a https://myaccount.google.com/security
   
   b. Genera una "Contraseña de aplicación":
      - Ve a https://myaccount.google.com/apppasswords
      - Selecciona "Correo" y "Otro (nombre personalizado)"
      - Ingresa "Leads API" como nombre
      - Copia la contraseña de 16 caracteres generada
   
   c. Actualiza tu `.env`:
      ```env
      EMAIL_ENABLED=true
      EMAIL_HOST=smtp.gmail.com
      EMAIL_PORT=587
      EMAIL_USER=tu-email@gmail.com
      EMAIL_PASSWORD=contraseña-de-16-caracteres
      EMAIL_FROM=tu-email@gmail.com
      NOTIFICATION_EMAIL=donde-recibiras-las-notificaciones@example.com
      ```

3. **Otros proveedores:**
   
   Ver [.env.example](.env.example) para configuración de Outlook, Yahoo, SendGrid, Mailgun, etc.

### Formato del Email

Cuando se crea un nuevo lead, se envía un email con:
- Asunto: "🎯 Nuevo Lead Recibido"
- Contenido HTML con formato profesional
- Información completa del lead: nombre, email, teléfono, mensaje, fecha

### Desactivar notificaciones

Para desactivar las notificaciones, simplemente configura:
```env
EMAIL_ENABLED=false
```

La API seguirá funcionando normalmente, solo no enviará emails.

## Comandos útiles de MongoDB

**Conectar a MongoDB (local):**
```bash
mongosh
```

**Ver todas las bases de datos:**
```javascript
show dbs
```

**Usar la base de datos leads-db:**
```javascript
use leads-db
```

**Ver todas las colecciones:**
```javascript
show collections
```

**Ver todos los leads:**
```javascript
db.leads.find().pretty()
```

**Contar leads:**
```javascript
db.leads.countDocuments()
```

**Eliminar todos los leads:**
```javascript
db.leads.deleteMany({})
```

## Solución de problemas

**Error: "MongooseServerSelectionError: connect ECONNREFUSED"**
- MongoDB no está corriendo. Inicia MongoDB según tu método de instalación.

**Error: "Authentication failed"**
- Verifica las credenciales en tu `MONGODB_URI`.

**Error: "Database name cannot be empty"**
- Asegúrate de que `MONGODB_URI` incluya el nombre de la base de datos.
