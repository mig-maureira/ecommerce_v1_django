# Ecommercer_v1_django

# Proyecto Django - Sistema de Usuarios y Contacto

Este proyecto es una aplicación web desarrollada en Django que incluye un sistema completo de autenticación (registro, login, logout), gestión de perfiles de usuario con imágenes, un panel de control (dashboard) protegido y un formulario de contacto.

## 🚀 Pasos para ejecutar el proyecto

Sigue estas instrucciones para levantar el proyecto en tu entorno local:

1. **Clonar el repositorio y acceder a la carpeta:**
```bash
    git clone <url-de-tu-repositorio>
    cd ecommerce 
```
   
   ** Crear y activar un entorno virtual:**
   Windows:
```bash
    python -m venv venv
    venv\Scripts\activate   
```
macOS/Linux:
```bash
    python3 -m venv venv
    source venv/bin/activate
```
    
2. **Instalar las dependencias:**

```bash
pip install -r requirements.txt
```
3. **Aplicar las migraciones a la base de datos:**
```bash
python manage.py makemigrations
python manage.py migrate
```
4. **Iniciar el servidor de desarrollo:**
```bash
python manage.py runserver
```

El proyecto estará disponible en:
```bash
http://127.0.0.1:8000/
```
# 🗺️ Rutas Principales

La aplicación cuenta con las siguientes rutas clave configuradas en `urls.py`:

---

## 🌐 Públicas

### `/` (index)
Página principal.  
Muestra el listado de productos disponibles.

### `/pago/` (pago)
Página de procesamiento de pagos.

### `/register/` (register)
Formulario de registro para nuevos usuarios.  
Crea la cuenta y un perfil básico automáticamente.

### `/login/` (login)
Inicio de sesión.

### `/logout/` (logout)
Cierre de sesión (redirige al index).

---

## 🔐 Protegidas (Requieren autenticación)

### `/dashboard/` (dashboard)
Panel de control del usuario.  

Permite actualizar:
- Datos personales (`first_name`, `last_name`)
- Información del perfil:
  - Imagen  
  - Dirección  
  - Ciudad  
  - Teléfono  

> Requiere estar logueado.

### `/dashboard-mixin/`
Versión del dashboard gestionada mediante vistas basadas en clases (CBV).

---

## 🛡️ Protegidas (Requieren permisos especiales)

### `/permiso/`
Vista protegida.  
Solo accesible para usuarios que tengan el permiso explícito `auth.view_user`.

### `/permiso-mixin/`
Versión de la vista con permisos utilizando CBV.

# 👥 Usuarios de Prueba

Como no se sube la base de datos local al repositorio, puedes utilizar o crear los siguientes usuarios para probar la plataforma:


## 👤 Usuario Normal  
*(Para probar el `/dashboard/`)*

Puedes crear uno tú mismo registrándote desde la ruta:

```bash
http://127.0.0.1:8000/register/
```


O utilizar estas credenciales sugeridas para pruebas:

- **Usuario:** `cliente_test`  
- **Contraseña:** `Prueba1234!`

---

## 👑 Usuario Administrador  
*(Para probar rutas con permisos como `/permiso/`)*

Para acceder a vistas que requieren el permiso `auth.view_user`, lo ideal es crear un superusuario desde la consola:

```bash
python manage.py createsuperuser
```
(Sigue los pasos en la terminal para asignar nombre de usuario, correo y contraseña).