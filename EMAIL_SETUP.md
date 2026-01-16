# Guía de Configuración de Notificaciones por Email

Esta guía te ayudará a configurar las notificaciones por email para recibir alertas cuando lleguen nuevos leads.

## 📋 Tabla de Contenidos

1. [Configuración con Gmail](#configuración-con-gmail)
2. [Configuración con Outlook/Hotmail](#configuración-con-outlookhotmail)
3. [Configuración con otros proveedores](#otros-proveedores-smtp)
4. [Prueba del sistema](#probar-el-sistema-de-email)
5. [Solución de problemas](#solución-de-problemas)

---

## Configuración con Gmail

### Paso 1: Habilitar la verificación en dos pasos

1. Ve a tu [Cuenta de Google](https://myaccount.google.com/security)
2. En la sección "Iniciar sesión en Google", selecciona **Verificación en dos pasos**
3. Sigue las instrucciones para activarla

### Paso 2: Generar una contraseña de aplicación

1. Ve a [Contraseñas de aplicaciones](https://myaccount.google.com/apppasswords)
2. En "Seleccionar aplicación", elige **Correo**
3. En "Seleccionar dispositivo", elige **Otro (nombre personalizado)**
4. Escribe "Leads API" o cualquier nombre descriptivo
5. Haz clic en **Generar**
6. **Copia la contraseña de 16 caracteres** que aparece (sin espacios)

### Paso 3: Configurar el archivo .env

```env
EMAIL_ENABLED=true
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=tu-email@gmail.com
EMAIL_PASSWORD=la-contraseña-de-16-caracteres-generada
EMAIL_FROM=tu-email@gmail.com
NOTIFICATION_EMAIL=email-donde-recibiras-notificaciones@gmail.com
```

**Ejemplo:**
```env
EMAIL_ENABLED=true
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=miempresa@gmail.com
EMAIL_PASSWORD=abcd efgh ijkl mnop
EMAIL_FROM=miempresa@gmail.com
NOTIFICATION_EMAIL=ventas@miempresa.com
```

---

## Configuración con Outlook/Hotmail

### Paso 1: Configurar el .env

```env
EMAIL_ENABLED=true
EMAIL_HOST=smtp-mail.outlook.com
EMAIL_PORT=587
EMAIL_USER=tu-email@outlook.com
EMAIL_PASSWORD=tu-contraseña-normal
EMAIL_FROM=tu-email@outlook.com
NOTIFICATION_EMAIL=destinatario@example.com
```

**Nota:** Outlook permite usar tu contraseña normal, pero se recomienda crear una contraseña de aplicación para mayor seguridad.

---

## Otros Proveedores SMTP

### SendGrid

```env
EMAIL_ENABLED=true
EMAIL_HOST=smtp.sendgrid.net
EMAIL_PORT=587
EMAIL_USER=apikey
EMAIL_PASSWORD=tu-api-key-de-sendgrid
EMAIL_FROM=sender@tudominio.com
NOTIFICATION_EMAIL=destinatario@example.com
```

### Mailgun

```env
EMAIL_ENABLED=true
EMAIL_HOST=smtp.mailgun.org
EMAIL_PORT=587
EMAIL_USER=postmaster@tudominio.mailgun.org
EMAIL_PASSWORD=tu-password-de-mailgun
EMAIL_FROM=sender@tudominio.com
NOTIFICATION_EMAIL=destinatario@example.com
```

### Yahoo

```env
EMAIL_ENABLED=true
EMAIL_HOST=smtp.mail.yahoo.com
EMAIL_PORT=587
EMAIL_USER=tu-email@yahoo.com
EMAIL_PASSWORD=contraseña-de-aplicacion
EMAIL_FROM=tu-email@yahoo.com
NOTIFICATION_EMAIL=destinatario@example.com
```

**Nota:** Yahoo también requiere una contraseña de aplicación.

---

## Probar el Sistema de Email

### 1. Reiniciar el servidor

```bash
npm run start:dev
```

Deberías ver en la consola:
```
[EmailService] Email service initialized successfully
```

### 2. Crear un lead de prueba

Usa un cliente HTTP como Postman, cURL, o tu formulario web:

```bash
curl -X POST http://localhost:3001/leads \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Prueba Email",
    "email": "prueba@example.com",
    "phone": "+34 600 123 456",
    "message": "Este es un mensaje de prueba para verificar el sistema de email"
  }'
```

### 3. Verificar el email

Revisa la bandeja de entrada del correo configurado en `NOTIFICATION_EMAIL`.

**Si funciona correctamente:**
- ✅ Recibirás un email con el asunto "🎯 Nuevo Lead Recibido"
- ✅ El email contendrá toda la información del lead
- ✅ En los logs del servidor verás: `[EmailService] Email sent successfully: <message-id>`

---

## Solución de Problemas

### Error: "Invalid login"

**Causa:** Credenciales incorrectas o contraseña de aplicación inválida.

**Solución:**
- Verifica que `EMAIL_USER` y `EMAIL_PASSWORD` sean correctos
- Si usas Gmail, asegúrate de usar la contraseña de aplicación de 16 caracteres, no tu contraseña normal
- Revisa que la verificación en dos pasos esté activada

### Error: "Connection timeout"

**Causa:** Problemas de red o firewall bloqueando el puerto SMTP.

**Solución:**
- Verifica que `EMAIL_PORT` sea correcto (587 para TLS, 465 para SSL)
- Asegúrate de que tu firewall permita conexiones salientes en ese puerto
- Intenta cambiar el puerto si es necesario

### No se envían emails y no hay errores

**Causa:** `EMAIL_ENABLED` está en `false` o las credenciales no están configuradas.

**Solución:**
- Verifica que `EMAIL_ENABLED=true` en el archivo `.env`
- Asegúrate de que todas las variables de email estén configuradas
- Revisa los logs del servidor en busca de advertencias

### Email llega a spam

**Causa:** Configuración de SPF/DKIM o reputación del servidor.

**Solución:**
- Añade el dominio a tu lista de remitentes seguros
- Si usas un dominio personalizado, configura los registros SPF y DKIM
- Usa un servicio como SendGrid o Mailgun para mejor entregabilidad

### Error: "NOTIFICATION_EMAIL not configured"

**Causa:** No has especificado a quién enviar las notificaciones.

**Solución:**
- Agrega `NOTIFICATION_EMAIL=tu-email@example.com` en el archivo `.env`
- Reinicia el servidor

---

## Desactivar las Notificaciones

Si quieres desactivar temporalmente las notificaciones por email:

```env
EMAIL_ENABLED=false
```

La API seguirá funcionando normalmente, pero no enviará emails.

---

## Formato del Email

### Asunto
```
🎯 Nuevo Lead Recibido
```

### Contenido (HTML + texto plano)

El email incluye:
- **Nombre completo** del contacto
- **Email** (con enlace mailto)
- **Teléfono** (con enlace tel)
- **Mensaje** completo
- **Fecha y hora** del contacto

El email se envía en formato HTML con un diseño profesional y también en texto plano para clientes de email que no soporten HTML.

---

## Variables de Entorno - Referencia Rápida

| Variable | Requerido | Descripción | Ejemplo |
|----------|-----------|-------------|---------|
| `EMAIL_ENABLED` | Sí | Activar/desactivar emails | `true` o `false` |
| `EMAIL_HOST` | Sí* | Servidor SMTP | `smtp.gmail.com` |
| `EMAIL_PORT` | No | Puerto SMTP (default: 587) | `587` o `465` |
| `EMAIL_USER` | Sí* | Usuario SMTP | `tu-email@gmail.com` |
| `EMAIL_PASSWORD` | Sí* | Contraseña o API key | `abcd efgh ijkl mnop` |
| `EMAIL_FROM` | No | Email del remitente | `noreply@tudominio.com` |
| `NOTIFICATION_EMAIL` | Sí* | Email que recibe las notificaciones | `ventas@tudominio.com` |

\* Solo requerido si `EMAIL_ENABLED=true`

---

## Seguridad

⚠️ **Importante:**
- **NUNCA** compartas tu archivo `.env` con nadie
- **NUNCA** subas el archivo `.env` a repositorios públicos
- Usa contraseñas de aplicación, no contraseñas principales
- El archivo `.env` ya está en `.gitignore` por seguridad

---

## Soporte

Si tienes problemas con la configuración de email:

1. Revisa los logs del servidor para mensajes de error específicos
2. Verifica que todas las variables estén correctamente configuradas
3. Prueba con diferentes proveedores de email si es necesario
4. Consulta la documentación de tu proveedor de email para configuraciones específicas
