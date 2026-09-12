# Sistema de Evaluación de Residentes y Fellows - Hospital General de Medellín (HGM)

Aplicación web institucional independiente para la calificación, seguimiento y generación de informes de rotación con Inteligencia Artificial (Google Gemini) y exportación a Microsoft Word (`.docx`), adaptada para el **Hospital General de Medellín - Luz Castro de Gutiérrez E.S.E.**

---

## 📁 Estructura del Proyecto

```text
evaluacion-residentes-hgm/
├── assets/
│   ├── hospital-bg.jpg      # Foto en alta resolución de la fachada del HGM
│   ├── logo.jpg             # Logo oficial HGM (utilizado en la app y en los informes Word)
│   ├── logo.png             # Logo oficial HGM en formato PNG
│   ├── logo.svg             # Vector SVG oficial del Hospital General de Medellín
│   └── logo_banner.png      # Banner horizontal institucional
├── js/
│   ├── app.js               # Lógica del frontend, autenticación, cálculo y Word
│   ├── firebase-config.js   # Credenciales de conexión a tu nuevo Firebase
│   └── rubricas-data.js     # Rúbricas pedagógicas (Ronda, Seminarios, Tema Central)
├── firestore.rules          # Reglas de seguridad para la base de datos de Firebase
├── index.html               # Interfaz de usuario con Tailwind CSS y SweetAlert2
└── README.md                # Guía técnica de configuración y despliegue
```

---

## 🌐 Publicación en GitHub y Despliegue en la Web (GitHub Pages)

El proyecto ya está inicializado con Git y su primer commit realizado localmente en tu equipo. Para publicarlo en GitHub y tener tu app funcionando en la web:

### 1. Crear el Repositorio en GitHub
1. Abre tu navegador e ingresa a: **[https://github.com/new](https://github.com/new)**.
2. En **Repository name**, escribe: `evaluacion-residentes-hgm`.
3. Elige si deseas que sea **Public** o **Private**.
4. **NO** marques las casillas de "Add a README file" ni ".gitignore" (ya están creados en tu proyecto).
5. Haz clic en el botón verde **"Create repository"**.

### 2. Subir el Código desde tu Computador
Abre PowerShell o tu terminal en la carpeta del proyecto y ejecuta:
```powershell
cd "C:\Users\LENOVO\.gemini\antigravity\scratch\evaluacion-residentes-hgm"
git push -u origin main
```
*(Tus credenciales de GitHub se usarán automáticamente para subir los archivos).*

### 3. Activar GitHub Pages (Acceso Web Público)
1. En tu repositorio de GitHub, haz clic en la pestaña superior **Settings** (Configuración).
2. En el menú lateral izquierdo, selecciona **Pages**.
3. En **Build and deployment**:
   - **Source:** Selecciona *Deploy from a branch*.
   - **Branch:** Selecciona `main` y la carpeta `/(root)`.
4. Haz clic en **Save**.
5. En 1-2 minutos, tu aplicación estará disponible públicamente en:
   👉 **`https://oepenaq-art.github.io/evaluacion-residentes-hgm/`**

---

## 🚀 Guía Paso a Paso: Configuración de Firebase

Para que la aplicación funcione de manera 100% independiente con su propia base de datos, sigue estos pasos en la consola de Firebase:

### Paso 1: Crear el Nuevo Proyecto en Firebase
1. Ingresa a la consola de Firebase: [https://console.firebase.google.com/](https://console.firebase.google.com/) con tu cuenta de Google.
2. Haz clic en **"Agregar proyecto"** (o "Add project").
3. Asigna un nombre al proyecto, por ejemplo: `hgm-evaluacion-residentes`.
4. Haz clic en **"Crear proyecto"**.

---

### Paso 2: Registrar la Aplicación Web y Obtener las Credenciales
1. En la pantalla principal de tu nuevo proyecto (Visión general del proyecto), haz clic en el ícono de aplicación Web: **`</>`**.
2. Escribe un apodo para la app (por ejemplo: `HGM Web App`).
3. Haz clic en **"Registrar app"**.
4. Firebase te mostrará un bloque de código con el objeto `const firebaseConfig = { ... }`.
5. Copia los valores y reemplázalos en el archivo:
   👉 **`js/firebase-config.js`**
   ```javascript
   const firebaseConfig = {
     apiKey: "AIzaSy...",
     authDomain: "tu-proyecto.firebaseapp.com",
     projectId: "tu-proyecto",
     storageBucket: "tu-proyecto.firebasestorage.app",
     messagingSenderId: "123456789...",
     appId: "1:123456789:web:...",
     measurementId: "G-..."
   };
   ```

---

### Paso 3: Activar Autenticación (Email / Contraseña)
1. En el menú lateral izquierdo de Firebase, ve a **Compilación** (Build) > **Authentication**.
2. Haz clic en **"Comenzar"** (Get started).
3. En la pestaña **"Sign-in method"**, haz clic en el proveedor **"Correo electrónico/Contraseña"** (Email/Password).
4. Habilita la primera casilla: **"Habilitar"** y guarda los cambios.

---

### Paso 4: Crear los Primeros Usuarios (Docentes y Coordinador)
1. En la misma sección de **Authentication**, dirígete a la pestaña **"Users"** (Usuarios).
2. Haz clic en **"Agregar usuario"**:
   - Ingresa el correo (ejemplo: `coordinador@hgm.gov.co`).
   - Ingresa una contraseña de mínimo 6 caracteres.
3. Haz clic en **"Agregar usuario"**.
4. Puedes agregar de la misma forma las cuentas de los demás docentes evaluadores.

---

### Paso 5: Crear la Base de Datos Cloud Firestore
1. En el menú lateral izquierdo, ve a **Compilación** (Build) > **Firestore Database**.
2. Haz clic en **"Crear base de datos"** (Create database).
3. Selecciona la ubicación (por ejemplo: `us-east1` o `southamerica-east1`).
4. Selecciona **"Iniciar en modo de producción"** y haz clic en **"Crear"**.

---

### Paso 6: Configurar las Reglas de Seguridad de Firestore
1. Dentro de **Firestore Database**, ve a la pestaña **"Reglas"** (Rules).
2. Borra el contenido existente y pega el contenido del archivo `firestore.rules`:
   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /{document=**} {
         allow read, write: if request.auth != null;
       }
     }
   }
   ```
3. Haz clic en **"Publicar"** (Publish).

---

### Paso 7: Configurar el Rol de Coordinador en Firestore
Para que tu cuenta tenga acceso a los botones **"👥 Gestionar Residentes"** y **"📊 Generar Informe Final"**:
1. En Firestore Database, ve a la pestaña **"Datos"** (Data).
2. Haz clic en **"Iniciar colección"** (Start collection):
   - **ID de colección:** `usuarios`
3. En el primer documento:
   - Agrega los campos:
     - `correo` (tipo `string`): `coordinador@hgm.gov.co` (el correo del usuario creado).
     - `rol` (tipo `string`): `coordinador`
4. Haz clic en **"Guardar"**.

---

### Paso 8: Autorizar Dominios en Firebase (Muy Importante para GitHub Pages)
1. En Firebase Console, ve a **Authentication** > pestaña **"Settings"** (Configuración).
2. Haz clic en **"Authorized domains"** (Dominios autorizados).
3. Asegúrate de agregar:
   - `oepenaq-art.github.io`
   - `localhost` (para pruebas en tu PC)

---

## 💻 Cómo Ejecutar la Aplicación en tu Computador (Local)

Si deseas probar la aplicación localmente en cualquier momento:
```powershell
cd "C:\Users\LENOVO\.gemini\antigravity\scratch\evaluacion-residentes-hgm"
python -m http.server 8080
```
Luego abre tu navegador en: [http://localhost:8080](http://localhost:8080)
