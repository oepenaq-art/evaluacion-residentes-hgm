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

## 🚀 Guía Paso a Paso: Configuración de Firebase

Para que la aplicación funcione de manera 100% independiente con su propia base de datos, sigue estos pasos en la consola de Firebase:

### Paso 1: Crear el Nuevo Proyecto en Firebase
1. Ingresa a la consola de Firebase: [https://console.firebase.google.com/](https://console.firebase.google.com/) con tu cuenta de Google.
2. Haz clic en **"Agregar proyecto"** (o "Add project").
3. Asigna un nombre al proyecto, por ejemplo: `hgm-evaluacion-residentes`.
4. Puedes deshabilitar Google Analytics (o dejarlo habilitado si lo prefieres) y haz clic en **"Crear proyecto"**.

---

### Paso 2: Registrar la Aplicación Web y Obtener las Credenciales
1. En la pantalla principal de tu nuevo proyecto (Visión general del proyecto), haz clic en el ícono de aplicación Web: **`</>`**.
2. Escribe un apodo para la app (por ejemplo: `HGM Web App`).
3. (Opcional) Puedes marcar o no la casilla de Firebase Hosting.
4. Haz clic en **"Registrar app"**.
5. Firebase te mostrará un bloque de código con el objeto `const firebaseConfig = { ... }`.
6. Copia los valores y reemplázalos en el archivo:
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
4. Habilita la primera casilla: **"Habilitar"** (la de vínculos sin contraseña déjala desactivada).
5. Haz clic en **"Guardar"**.

---

### Paso 4: Crear los Primeros Usuarios (Docentes y Coordinador)
1. En la misma sección de **Authentication**, dirígete a la pestaña **"Users"** (Usuarios).
2. Haz clic en **"Agregar usuario"**:
   - Ingresa el correo (ejemplo: `coordinador@hgm.gov.co` o tu correo personal).
   - Ingresa una contraseña segura de mínimo 6 caracteres.
3. Haz clic en **"Agregar usuario"**.
4. Puedes agregar de la misma forma las cuentas de los demás docentes evaluadores.

---

### Paso 5: Crear la Base de Datos Cloud Firestore
1. En el menú lateral izquierdo, ve a **Compilación** (Build) > **Firestore Database**.
2. Haz clic en **"Crear base de datos"** (Create database).
3. Selecciona la ubicación de la base de datos (por ejemplo: `us-east1` o `southamerica-east1`).
4. Selecciona **"Iniciar en modo de producción"** y haz clic en **"Siguiente"** o **"Crear"**.

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
3. Haz clic en **"Publicar"** (Publish). Esto garantiza que únicamente los docentes y coordinadores que hayan iniciado sesión puedan leer y registrar calificaciones.

---

### Paso 7: Configurar el Rol de Coordinador en Firestore
Para que tu cuenta tenga acceso a los botones **"👥 Gestionar Residentes"** y **"📊 Generar Informe Final"**:
1. En Firestore Database, ve a la pestaña **"Datos"** (Data).
2. Haz clic en **"Iniciar colección"** (Start collection):
   - **ID de colección:** `usuarios`
3. En el primer documento:
   - **ID del documento:** (Puedes dejar el automático o poner el UID de Authentication).
   - Agrega los campos:
     - `correo` (tipo `string`): El correo exacto del usuario (ejemplo: `coordinador@hgm.gov.co`).
     - `rol` (tipo `string`): `coordinador`
4. Haz clic en **"Guardar"**.

> 💡 **Nota:** Si el correo contiene la palabra `coord` (por ejemplo `coordinacion.pediatria@hgm.gov.co`), el sistema también lo reconocerá automáticamente como coordinador por respaldo.

---

### Paso 8: Autorizar Dominios (Si vas a publicar en GitHub Pages o Dominio Propio)
1. En Firebase Console, ve a **Authentication** > pestaña **"Settings"** (Configuración).
2. Haz clic en **"Authorized domains"** (Dominios autorizados).
3. Asegúrate de que figure `localhost` (si pruebas localmente) y agrega tu dominio o usuario de GitHub Pages (ejemplo: `tu-usuario.github.io`).

---

## 💻 Cómo Ejecutar la Aplicación en tu Computador

Debido a que la aplicación utiliza módulos modernos de JavaScript (`import`/`export`), debe ejecutarse a través de un servidor HTTP local (no haciendo doble clic directo al archivo `file://`):

### Opción A: Con Python (Rápido y sin instalar nada extra)
Abre PowerShell o CMD en la carpeta del proyecto y ejecuta:
```powershell
python -m http.server 8080
```
Luego abre tu navegador en: [http://localhost:8080](http://localhost:8080)

### Opción B: Con Visual Studio Code (Live Server)
1. Abre la carpeta `evaluacion-residentes-hgm` en VS Code.
2. Instala la extensión **Live Server**.
3. Haz clic derecho en `index.html` y selecciona **"Open with Live Server"**.

---

## 🩺 Cargar y Gestionar Estudiantes
1. Inicia sesión con la cuenta con rol de `coordinador`.
2. Verás en la esquina superior el botón verde **"👥 Gestionar Residentes"**.
3. Haz clic allí para añadir los residentes de pediatría o fellows con su nombre completo y programa. Se guardarán en la base de datos de tu nuevo Firebase y estarán disponibles para todos los docentes evaluadores de inmediato.

---

## 🤖 Generación de Informes con IA (Google Gemini)
1. En el panel de Coordinador, haz clic en **"📊 Generar Informe Final"**.
2. Selecciona el residente, las fechas de la rotación y la nota de autoevaluación (5%).
3. Ingresa tu **API Key de Gemini** (obtenida gratis en [Google AI Studio](https://aistudio.google.com/)). La clave se guardará de forma segura y local en tu navegador.
4. Haz clic en **"Generar Informe y Calcular Notas"**.
5. El sistema calculará la ponderación oficial (Ronda 40%, Seminarios 35%, Tema Central 20%, Autoevaluación 5%), redactará la síntesis académica con IA y descargará automáticamente el informe formateado en **Microsoft Word (.docx)** con el logo y membrete oficial del Hospital General de Medellín.
