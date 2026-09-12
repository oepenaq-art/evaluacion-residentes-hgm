import { rubricasData } from './rubricas-data.js';
import { 
    auth, 
    db, 
    firebaseConfig,
    isFirebaseConfigured,
    initializeApp,
    getApp,
    getAuth,
    signInWithEmailAndPassword, 
    signOut, 
    onAuthStateChanged, 
    sendPasswordResetEmail,
    createUserWithEmailAndPassword,
    collection, 
    getDocs, 
    addDoc, 
    deleteDoc,
    doc,
    query, 
    where, 
    serverTimestamp 
} from './firebase-config.js';

// --- ELEMENTOS DEL DOM ---
const sections = {
    login: document.getElementById('sec-login'),
    dashboard: document.getElementById('sec-dashboard'),
    formulario: document.getElementById('sec-formulario'),
    informes: document.getElementById('sec-informes')
};

// Login
const formLogin = document.getElementById('form-login');
const loginEmail = document.getElementById('login-email');
const loginPassword = document.getElementById('login-password');
const btnForgotPassword = document.getElementById('btn-forgot-password');
const userInfo = document.getElementById('user-info');
const userEmailSpan = document.getElementById('user-email');
const btnLogout = document.getElementById('btn-logout');

// Dashboard
const btnProgramas = document.querySelectorAll('.btn-programa');
const estudiantesContainer = document.getElementById('estudiantes-container');
const selectEstudiante = document.getElementById('select-estudiante');
const rubricasContainer = document.getElementById('rubricas-container');
const btnRubricas = document.querySelectorAll('.btn-rubrica');
const btnInformes = document.getElementById('btn-informes');
const btnAdminEstudiantes = document.getElementById('btn-admin-estudiantes');
const btnAdminUsuarios = document.getElementById('btn-admin-usuarios');

// Formulario
const btnVolverDash = document.getElementById('btn-volver-dash');
const btnVerRubrica = document.getElementById('btn-ver-rubrica');
const formTitle = document.getElementById('form-title');
const formEstudianteNombre = document.getElementById('form-estudiante-nombre');
const campoSeminario = document.getElementById('campo-seminario');
const nombreSeminario = document.getElementById('nombre-seminario');
const itemsRubrica = document.getElementById('items-rubrica');
const formEvaluacion = document.getElementById('form-evaluacion');

// Informes
const btnVolverDashInf = document.getElementById('btn-volver-dash-inf');
const btnGenerarIa = document.getElementById('btn-generar-ia');
const infSelectEstudiante = document.getElementById('inf-select-estudiante');
const infApiKey = document.getElementById('inf-api-key');
const infResultado = document.getElementById('inf-resultado');
const infTexto = document.getElementById('inf-texto');
const infNotaAuto = document.getElementById('inf-nota-auto');

// --- ESTADO DE LA APP ---
let appState = {
    user: null, 
    programaSeleccionado: null,
    estudianteSeleccionado: null,
    rubricaSeleccionada: null,
    estudiantes: [],
    usuarios: []
};

// --- NAVEGACIÓN ---
function showSection(sectionId) {
    Object.values(sections).forEach(sec => sec.classList.add('hidden'));
    sections[sectionId].classList.remove('hidden');
    window.scrollTo(0, 0);
}

// Advertencia amigable si falta configurar Firebase
if (!isFirebaseConfigured()) {
    console.warn('Firebase aún no está configurado. Por favor ingresa tus credenciales en js/firebase-config.js');
}

// --- ESCUCHAR ESTADO DE AUTENTICACIÓN FIREBASE ---
if (auth) {
    onAuthStateChanged(auth, async (user) => {
        if (user) {
            let userRol = 'docente';
            try {
                const usuariosRef = collection(db, 'usuarios');
                const q = query(usuariosRef, where('correo', '==', user.email.toLowerCase().trim()));
                const querySnapshot = await getDocs(q);
                if (!querySnapshot.empty) {
                    const userData = querySnapshot.docs[0].data();
                    const r = (userData.rol || userData.Rol || '').toLowerCase().trim();
                    if (r === 'coordinador' || r === 'administrador') {
                        userRol = 'coordinador';
                    }
                }
            } catch (error) {
                console.error('Error al verificar rol de usuario en HGM:', error);
                if (user.email.toLowerCase().includes('coord') || user.email.toLowerCase().includes('admin')) {
                    userRol = 'coordinador';
                }
            }

            appState.user = {
                uid: user.uid,
                email: user.email,
                rol: userRol
            };
            
            userEmailSpan.textContent = user.email;
            userInfo.classList.remove('hidden');
            
            // Mostrar botones de administración si es coordinador
            if (appState.user.rol === 'coordinador') {
                btnInformes.classList.remove('hidden');
                if (btnAdminEstudiantes) btnAdminEstudiantes.classList.remove('hidden');
                if (btnAdminUsuarios) btnAdminUsuarios.classList.remove('hidden');
            } else {
                btnInformes.classList.add('hidden');
                if (btnAdminEstudiantes) btnAdminEstudiantes.classList.add('hidden');
                if (btnAdminUsuarios) btnAdminUsuarios.classList.add('hidden');
            }

            await cargarEstudiantesDesdeFirestore();
            showSection('dashboard');
        } else {
            appState.user = null;
            userInfo.classList.add('hidden');
            showSection('login');
        }
    });
} else {
    showSection('login');
}

// --- LÓGICA DE LOGIN CON FIREBASE ---
formLogin.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!isFirebaseConfigured()) {
        Swal.fire({
            icon: 'info',
            title: 'Configura tu Proyecto de Firebase',
            html: `
                <p class="text-sm text-left mb-3">Para conectar la base de datos del Hospital General de Medellín, ingresa a <code>js/firebase-config.js</code> y pega tus credenciales de Firebase.</p>
                <p class="text-xs text-gray-500 text-left">Revisa la guía en el archivo <code>README.md</code> para ver los pasos detallados.</p>
            `,
            confirmButtonColor: '#0056b3'
        });
        return;
    }

    const email = loginEmail.value.trim();
    const password = loginPassword.value;
    
    Swal.fire({
        title: 'Verificando credenciales...',
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading()
    });

    try {
        await signInWithEmailAndPassword(auth, email, password);
        Swal.fire({
            icon: 'success',
            title: '¡Bienvenido(a)!',
            text: 'Hospital General de Medellín',
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 2500
        });
    } catch (error) {
        console.error('Error de autenticación:', error);
        let mensajeError = `Error (${error.code || 'desconocido'}): Correo o contraseña incorrectos.`;
        if (error.code === 'auth/user-not-found' || error.code === 'auth/invalid-credential') {
            mensajeError = 'Usuario no encontrado o clave inválida. Revisa que el correo y contraseña coincidan con los creados en Firebase Authentication.';
        } else if (error.code === 'auth/wrong-password') {
            mensajeError = 'Contraseña incorrecta.';
        } else if (error.code === 'auth/invalid-email') {
            mensajeError = 'El formato del correo es inválido.';
        } else if (error.code === 'auth/unauthorized-domain') {
            mensajeError = 'Dominio no autorizado. Debes agregar tu dominio o localhost en Firebase > Authentication > Settings > Authorized domains.';
        } else if (error.code === 'auth/operation-not-allowed') {
            mensajeError = 'El acceso por Correo/Contraseña no está activado en Firebase > Authentication > Sign-in method.';
        }
        Swal.fire('Error de Acceso', mensajeError, 'error');
    }
});

// --- RECUPERACIÓN DE CONTRASEÑA ---
if (btnForgotPassword) {
    btnForgotPassword.addEventListener('click', async (e) => {
        e.preventDefault();

        if (!isFirebaseConfigured()) {
            Swal.fire('Configuración requerida', 'Debes configurar las credenciales de Firebase en js/firebase-config.js para utilizar la recuperación de contraseñas.', 'info');
            return;
        }

        const { value: emailToReset } = await Swal.fire({
            title: 'Recuperar Contraseña',
            input: 'email',
            inputLabel: 'Ingresa tu correo institucional',
            inputPlaceholder: 'docente@hgm.gov.co',
            showCancelButton: true,
            confirmButtonText: 'Enviar Enlace',
            cancelButtonText: 'Cancelar',
            confirmButtonColor: '#0056b3'
        });

        if (emailToReset) {
            try {
                await sendPasswordResetEmail(auth, emailToReset);
                Swal.fire('¡Correo Enviado!', 'Revisa tu bandeja de entrada o la carpeta de spam para restablecer tu contraseña.', 'success');
            } catch (error) {
                console.error('Error al enviar recuperación:', error);
                Swal.fire('Error', 'Hubo un problema. Verifica que el correo esté bien escrito y registrado en Firebase.', 'error');
            }
        }
    });
}

// --- CERRAR SESIÓN ---
btnLogout.addEventListener('click', async () => {
    try {
        if (auth) await signOut(auth);
        loginEmail.value = '';
        loginPassword.value = '';
        estudiantesContainer.classList.add('hidden');
        rubricasContainer.classList.add('hidden');
        btnProgramas.forEach(b => {
            b.classList.remove('bg-[#0056b3]', 'text-white');
            b.classList.add('bg-white', 'text-gray-700');
        });
        showSection('login');
    } catch (error) {
        console.error('Error al cerrar sesión:', error);
    }
});

// --- CARGAR ESTUDIANTES DESDE FIRESTORE ---
async function cargarEstudiantesDesdeFirestore() {
    if (!db) return;
    try {
        console.log('Consultando colección estudiantes en Firestore (HGM)...');
        const querySnapshot = await getDocs(collection(db, 'estudiantes'));
        appState.estudiantes = [];
        querySnapshot.forEach((docSnap) => {
            const data = docSnap.data();
            const rawNombre = data.nombre || data.Nombre || data.NOMBRE || 'Sin nombre';
            let rawProgStr = (data.programa || data.Programa || data.PROGRAMA || '').toString().toLowerCase().trim();
            
            let rawPrograma = 'residente';
            if (rawProgStr.includes('fellow') || rawProgStr.includes('uci')) {
                rawPrograma = 'fellow';
            } else if (rawProgStr.includes('residente') || rawProgStr.includes('pedi')) {
                rawPrograma = 'residente';
            }

            appState.estudiantes.push({ 
                id: docSnap.id, 
                nombre: rawNombre, 
                programa: rawPrograma,
                ...data
            });
        });
        console.log('Lista final de estudiantes cargada (HGM):', appState.estudiantes);
    } catch (error) {
        console.error('Error al cargar estudiantes de Firestore:', error);
    }
}

// --- LÓGICA DEL DASHBOARD ---
btnProgramas.forEach(btn => {
    btn.addEventListener('click', async () => {
        btnProgramas.forEach(b => {
            b.classList.remove('bg-[#0056b3]', 'text-white');
            b.classList.add('bg-white', 'text-gray-700');
        });
        btn.classList.remove('bg-white', 'text-gray-700');
        btn.classList.add('bg-[#0056b3]', 'text-white');
        
        appState.programaSeleccionado = btn.dataset.prog;

        if (!appState.estudiantes || appState.estudiantes.length === 0) {
            await cargarEstudiantesDesdeFirestore();
        }
        
        filtrarEstudiantesEnSelect(appState.programaSeleccionado);
        
        estudiantesContainer.classList.remove('hidden');
        rubricasContainer.classList.add('hidden'); 
    });
});

function filtrarEstudiantesEnSelect(programa) {
    selectEstudiante.innerHTML = '<option value="">Seleccione estudiante...</option>';
    const filtrados = appState.estudiantes.filter(e => e.programa === programa);
    
    filtrados.forEach(est => {
        const option = document.createElement('option');
        option.value = est.id;
        option.textContent = est.nombre;
        selectEstudiante.appendChild(option);
    });
}

selectEstudiante.addEventListener('change', (e) => {
    if (e.target.value) {
        appState.estudianteSeleccionado = appState.estudiantes.find(est => est.id === e.target.value);
        rubricasContainer.classList.remove('hidden');
    } else {
        appState.estudianteSeleccionado = null;
        rubricasContainer.classList.add('hidden');
    }
});

btnRubricas.forEach(btn => {
    btn.addEventListener('click', () => {
        appState.rubricaSeleccionada = btn.dataset.rubrica;
        renderizarFormulario();
        showSection('formulario');
    });
});

// --- LÓGICA DEL FORMULARIO ---
btnVolverDash.addEventListener('click', () => showSection('dashboard'));

function getNombreNivel(val, esRonda) {
    if (esRonda) {
        if (val === 4) return 'Sobresaliente (4.1 - 5.0)';
        if (val === 3) return 'Aprobado / Bueno (3.0 - 4.0)';
        if (val === 2) return 'Por Mejorar / Regular (1.0 - 2.9)';
        if (val === 1) return 'Insuficiente (0)';
        return 'No Aplica';
    } else {
        if (val === 5) return 'Excelente (5.0)';
        if (val === 4) return 'Sobresaliente (4.0)';
        if (val === 3) return 'Aprobado / Bueno (3.0)';
        if (val === 2) return 'Por Mejorar / Regular (2.0)';
        if (val === 1) return 'Insuficiente (1.0)';
        return 'No Aplica';
    }
}

function getPrefijoGuia(val, esRonda) {
    if (esRonda) {
        if (val === 4) return '<span class="text-emerald-700 font-bold">Sobr. (4.1-5.0):</span>';
        if (val === 3) return '<span class="text-sky-700 font-bold">Aprob. (3.0-4.0):</span>';
        if (val === 2) return '<span class="text-amber-700 font-bold">Por mej. (1.0-2.9):</span>';
        if (val === 1) return '<span class="text-rose-700 font-bold">Insuf. (0):</span>';
        return '';
    } else {
        if (val === 5) return '<span class="text-green-800 font-bold">Excel. (5.0):</span>';
        if (val === 4) return '<span class="text-emerald-700 font-bold">Sobr. (4.0):</span>';
        if (val === 3) return '<span class="text-sky-700 font-bold">Aprob. (3.0):</span>';
        if (val === 2) return '<span class="text-amber-700 font-bold">Por mej. (2.0):</span>';
        if (val === 1) return '<span class="text-rose-700 font-bold">Insuf. (1.0):</span>';
        return '';
    }
}

// Modal Ver Rúbrica Completa
btnVerRubrica.addEventListener('click', (e) => {
    e.preventDefault();
    const dataRubrica = rubricasData[appState.rubricaSeleccionada];
    const esRonda = (appState.rubricaSeleccionada === 'ronda');
    const tieneNivel5 = dataRubrica.items.some(item => item.opciones.some(o => o.valor === 5));

    let headerHtml = '';
    if (esRonda) {
        headerHtml = `
            <thead class="text-white text-xs uppercase font-bold sticky top-0">
                <tr>
                    <th class="p-3 bg-[#0056b3] border border-blue-900 text-left min-w-[140px]">Ítem</th>
                    <th class="p-3 bg-[#e53e3e] border border-red-800 text-center min-w-[130px]">Insuficiente 0</th>
                    <th class="p-3 bg-[#dd6b20] border border-orange-800 text-center min-w-[130px]">Por Mejorar 1.0 - 2.9</th>
                    <th class="p-3 bg-[#0284c7] border border-sky-800 text-center min-w-[130px]">Aprobado 3.0 - 4.0</th>
                    <th class="p-3 bg-[#16a34a] border border-green-800 text-center min-w-[130px]">Sobresaliente 4.1 - 5.0</th>
                </tr>
            </thead>
        `;
    } else {
        headerHtml = `
            <thead class="text-white text-xs uppercase font-bold sticky top-0">
                <tr>
                    <th class="p-3 bg-[#0056b3] border border-blue-900 text-left min-w-[140px]">Ítem</th>
                    <th class="p-3 bg-[#e53e3e] border border-red-800 text-center min-w-[130px]">Insuficiente 1.0</th>
                    <th class="p-3 bg-[#dd6b20] border border-orange-800 text-center min-w-[130px]">Por Mejorar 2.0</th>
                    <th class="p-3 bg-[#0284c7] border border-sky-800 text-center min-w-[130px]">Aprobado 3.0</th>
                    <th class="p-3 bg-[#16a34a] border border-green-800 text-center min-w-[130px]">Sobresaliente 4.0</th>
                    ${tieneNivel5 ? '<th class="p-3 bg-[#15803d] border border-emerald-900 text-center min-w-[130px]">Excelente 5.0</th>' : ''}
                </tr>
            </thead>
        `;
    }

    let rowsHtml = dataRubrica.items.map(item => {
        const op1 = item.opciones.find(o => o.valor === 1)?.texto.replace(/^[A-ZÁÉÍÓÚ\s\(\)\d]+:\s*/i, '') || '-';
        const op2 = item.opciones.find(o => o.valor === 2)?.texto.replace(/^[A-ZÁÉÍÓÚ\s\(\)\d]+:\s*/i, '') || '-';
        const op3 = item.opciones.find(o => o.valor === 3)?.texto.replace(/^[A-ZÁÉÍÓÚ\s\(\)\d]+:\s*/i, '') || '-';
        const op4 = item.opciones.find(o => o.valor === 4)?.texto.replace(/^[A-ZÁÉÍÓÚ\s\(\)\d]+:\s*/i, '') || '-';
        const op5 = tieneNivel5 ? (item.opciones.find(o => o.valor === 5)?.texto.replace(/^[A-ZÁÉÍÓÚ\s\(\)\d]+:\s*/i, '') || '-') : '';

        return `
            <tr class="hover:bg-gray-50 transition border-b">
                <td class="p-3 font-bold text-gray-800 border bg-blue-50/40 text-xs">
                    ${item.titulo}
                    <div class="text-[10px] text-blue-700 font-semibold mt-1">Peso: ${item.peso}</div>
                </td>
                <td class="p-3 border text-xs text-gray-700 leading-relaxed">${op1}</td>
                <td class="p-3 border text-xs text-gray-700 leading-relaxed">${op2}</td>
                <td class="p-3 border text-xs text-gray-700 leading-relaxed">${op3}</td>
                <td class="p-3 border text-xs text-gray-700 leading-relaxed">${op4}</td>
                ${tieneNivel5 ? `<td class="p-3 border text-xs text-gray-700 leading-relaxed">${op5}</td>` : ''}
            </tr>
        `;
    }).join('');

    const tableModalHtml = `
        <div class="overflow-x-auto text-left max-h-[72vh] rounded-lg border shadow-sm">
            <table class="w-full text-left border-collapse bg-white">
                ${headerHtml}
                <tbody class="divide-y divide-gray-200">
                    ${rowsHtml}
                </tbody>
            </table>
        </div>
    `;

    Swal.fire({
        title: `Rúbrica de Evaluación Completa - ${dataRubrica.titulo}`,
        html: tableModalHtml,
        width: '95%',
        confirmButtonText: 'Cerrar Rúbrica',
        confirmButtonColor: '#0056b3',
        showCloseButton: true
    });
});

function renderizarFormulario() {
    const dataRubrica = rubricasData[appState.rubricaSeleccionada];
    const esRonda = (appState.rubricaSeleccionada === 'ronda');
    
    formTitle.textContent = dataRubrica.titulo;
    formEstudianteNombre.textContent = appState.estudianteSeleccionado.nombre;
    
    if (dataRubrica.requiereNombre) {
        campoSeminario.classList.remove('hidden');
        nombreSeminario.required = true;
    } else {
        campoSeminario.classList.add('hidden');
        nombreSeminario.required = false;
        nombreSeminario.value = '';
    }

    itemsRubrica.innerHTML = '';

    dataRubrica.items.forEach(item => {
        const botonesNivelesHtml = item.opciones.slice().reverse().map(op => {
            let colorClase = 'bg-gray-100 text-gray-700 hover:bg-gray-200 border-gray-300';
            if (op.valor === 5) colorClase = 'hover:bg-green-600 hover:text-white border-green-600 text-green-800 bg-green-50';
            if (op.valor === 4) colorClase = 'hover:bg-emerald-500 hover:text-white border-emerald-500 text-emerald-800 bg-emerald-50';
            if (op.valor === 3) colorClase = 'hover:bg-sky-500 hover:text-white border-sky-500 text-sky-800 bg-sky-50';
            if (op.valor === 2) colorClase = 'hover:bg-amber-500 hover:text-white border-amber-500 text-amber-800 bg-amber-50';
            if (op.valor === 1) colorClase = 'hover:bg-rose-500 hover:text-white border-rose-500 text-rose-800 bg-rose-50';

            return `
                <button type="button" 
                    class="btn-nivel-opcion border font-semibold py-2 px-3 rounded-lg text-xs transition duration-150 shadow-sm ${colorClase}"
                    data-item="${item.id}"
                    data-valor="${op.valor}">
                    ${getNombreNivel(op.valor, esRonda)}
                </button>
            `;
        }).join('');

        const botonNoAplicaHtml = `
            <button type="button" 
                class="btn-nivel-opcion border font-semibold py-2 px-3 rounded-lg text-xs transition duration-150 shadow-sm bg-gray-50 text-gray-600 border-gray-300 hover:bg-gray-600 hover:text-white"
                data-item="${item.id}"
                data-valor="0">
                No aplica
            </button>
        `;

        const guiaTextoHtml = item.opciones.slice().reverse().map(op => {
            const descripcionCorta = op.texto.replace(/^[A-ZÁÉÍÓÚ\s\(\)\d]+:\s*/i, '');
            return `${getPrefijoGuia(op.valor, esRonda)} ${descripcionCorta}`;
        }).join(' <span class="text-gray-300 font-bold mx-1.5">|</span> ');

        let inputNotaHtml = '';
        if (esRonda) {
            inputNotaHtml = `
                <div class="flex items-center gap-3 bg-gray-50 p-2.5 rounded-lg border border-gray-200 mb-3">
                    <label for="input_nota_${item.id}" class="text-xs sm:text-sm font-bold text-gray-700">
                        Nota (0.0 - 5.0):
                    </label>
                    <input type="number" 
                        id="input_nota_${item.id}" 
                        name="nota_${item.id}" 
                        step="0.1" 
                        min="0" 
                        max="5" 
                        placeholder="0.0" 
                        class="w-20 border-2 border-blue-500 rounded px-2 py-1 text-center font-bold text-base bg-white focus:ring-2 focus:ring-blue-400 outline-none" 
                        required>
                    <span class="text-xs text-gray-500">(Puedes ajustar la nota exacta libremente)</span>
                </div>
            `;
        } else {
            inputNotaHtml = `
                <input type="hidden" id="input_nota_${item.id}" name="nota_${item.id}" value="" required>
            `;
        }

        const itemCardHtml = `
            <div class="border rounded-xl p-5 bg-white shadow-sm border-gray-200" id="card_item_${item.id}">
                <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-3">
                    <h4 class="text-base font-bold text-gray-800">${item.titulo}</h4>
                    <span class="bg-blue-50 text-[#0056b3] text-xs font-bold px-3 py-1 rounded-full border border-blue-200">
                        Peso: ${item.peso}
                    </span>
                </div>

                <div class="grid grid-cols-2 sm:grid-cols-3 md:flex md:flex-wrap gap-2 mb-4">
                    ${botonesNivelesHtml}
                    ${botonNoAplicaHtml}
                </div>

                ${inputNotaHtml}

                <div class="text-[11px] text-gray-600 bg-white p-3 rounded-lg border border-gray-100 leading-relaxed shadow-inner">
                    <strong class="text-gray-800 font-bold">Guía de criterios:</strong> ${guiaTextoHtml}
                </div>
            </div>
        `;

        itemsRubrica.insertAdjacentHTML('beforeend', itemCardHtml);
    });

    document.querySelectorAll('.btn-nivel-opcion').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const itemId = btn.dataset.item;
            const valor = parseFloat(btn.dataset.valor);
            const input = document.getElementById(`input_nota_${itemId}`);

            if (esRonda) {
                let valorPorDefecto = 0.0;
                if (valor === 4) valorPorDefecto = 5.0;
                else if (valor === 3) valorPorDefecto = 4.0;
                else if (valor === 2) valorPorDefecto = 2.9;
                else if (valor === 1) valorPorDefecto = 0.0;
                else valorPorDefecto = 0.0;

                if (input) input.value = valorPorDefecto.toFixed(1);
            } else {
                if (input) input.value = valor.toFixed(1);
            }

            const parentCard = document.getElementById(`card_item_${itemId}`);
            parentCard.querySelectorAll('.btn-nivel-opcion').forEach(b => {
                b.classList.remove('ring-2', 'ring-offset-2', 'ring-blue-600', 'font-black', 'scale-105', 'bg-blue-600', 'text-white');
            });
            btn.classList.add('ring-2', 'ring-offset-2', 'ring-blue-600', 'font-black', 'scale-105');
        });
    });
}

// --- GUARDAR EVALUACIÓN EN FIRESTORE ---
formEvaluacion.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const dataRubrica = rubricasData[appState.rubricaSeleccionada];
    const formData = new FormData(formEvaluacion);
    
    let notas = {};
    let totalPuntos = 0;
    let totalPeso = 0;

    dataRubrica.items.forEach(item => {
        const nota = parseFloat(formData.get(`nota_${item.id}`)) || 0;
        const peso = parseFloat(item.peso) / 100;
        
        notas[item.id] = nota;
        
        if (nota > 0) {
            totalPuntos += (nota * peso);
            totalPeso += peso;
        }
    });

    const notaCalculada = totalPeso > 0 ? (totalPuntos / totalPeso).toFixed(2) : 0;
    const aspectosPositivos = document.getElementById('aspectos-positivos-generales').value.trim();
    const aspectosMejorar = document.getElementById('aspectos-mejorar-generales').value.trim();

    const payload = {
        institucion: "Hospital General de Medellín",
        estudianteId: appState.estudianteSeleccionado.id,
        estudianteNombre: appState.estudianteSeleccionado.nombre,
        programa: appState.estudianteSeleccionado.programa,
        tipoRubrica: appState.rubricaSeleccionada,
        nombreSeminario: dataRubrica.requiereNombre ? nombreSeminario.value.trim() : null,
        docenteEmail: appState.user ? appState.user.email : 'docente@hgm.gov.co',
        docenteUid: appState.user ? appState.user.uid : null,
        notas,
        aspectosPositivosGenerales: aspectosPositivos,
        aspectosMejorarGenerales: aspectosMejorar,
        notaFinalRubrica: parseFloat(notaCalculada),
        fecha: new Date().toISOString(),
        createdAt: serverTimestamp()
    };

    Swal.fire({
        title: 'Guardando evaluación...',
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading()
    });

    try {
        await addDoc(collection(db, 'evaluaciones'), payload);
        Swal.fire({
            title: '¡Evaluación Guardada!',
            text: `Se ha registrado la calificación con éxito. Nota promedio calculada: ${notaCalculada}.`,
            icon: 'success',
            confirmButtonColor: '#0056b3'
        }).then(() => {
            formEvaluacion.reset();
            showSection('dashboard');
        });
    } catch (error) {
        console.error('Error al guardar en Firestore:', error);
        Swal.fire('Guardado Local', `La evaluación se completó (Nota: ${notaCalculada}). Revisa la conexión con Firebase.`, 'info')
        .then(() => {
            formEvaluacion.reset();
            showSection('dashboard');
        });
    }
});

// --- LÓGICA DE INFORMES (COORDINADOR) ---
btnInformes.addEventListener('click', () => {
    infSelectEstudiante.innerHTML = '<option value="">Seleccione estudiante...</option>';
    appState.estudiantes.forEach(est => {
        infSelectEstudiante.innerHTML += `<option value="${est.id}">${est.nombre} (${est.programa})</option>`;
    });
    
    const claveGuardada = localStorage.getItem('gemini_api_key_hgm');
    if (claveGuardada && !infApiKey.value) {
        infApiKey.value = claveGuardada;
    }

    showSection('informes');
});

btnVolverDashInf.addEventListener('click', () => showSection('dashboard'));

btnGenerarIa.addEventListener('click', async () => {
    const apiKey = infApiKey.value.trim();
    const estId = infSelectEstudiante.value;
    const notaAuto = parseFloat(infNotaAuto.value);
    
    const fechaDesdeStr = document.getElementById('inf-fecha-desde').value;
    const fechaHastaStr = document.getElementById('inf-fecha-hasta').value;
    const rotacionSeleccionada = document.getElementById('inf-rotacion').value;
    
    if (!apiKey || !estId || isNaN(notaAuto)) {
        Swal.fire('Campos requeridos', 'Por favor ingresa la API Key de Gemini, selecciona el estudiante e indica la nota de autoevaluación.', 'warning');
        return;
    }

    localStorage.setItem('gemini_api_key_hgm', apiKey);

    const est = appState.estudiantes.find(e => e.id === estId);
    
    btnGenerarIa.innerHTML = '<span>⏳</span> Consultando evaluaciones y procesando con Gemini...';
    btnGenerarIa.disabled = true;

    try {
        let evaluacionesFiltradas = [];
        try {
            const q = query(collection(db, 'evaluaciones'), where('estudianteId', '==', estId));
            const querySnapshot = await getDocs(q);
            
            const fechaDesde = fechaDesdeStr ? new Date(fechaDesdeStr + 'T00:00:00') : new Date('2000-01-01');
            const fechaHasta = fechaHastaStr ? new Date(fechaHastaStr + 'T23:59:59') : new Date('2100-01-01');

            querySnapshot.forEach(docSnap => {
                const data = docSnap.data();
                const evalDate = new Date(data.fecha);
                if (evalDate >= fechaDesde && evalDate <= fechaHasta) {
                    evaluacionesFiltradas.push(data);
                }
            });
        } catch (e) {
            console.warn('No se pudieron consultar evaluaciones:', e);
        }

        if (evaluacionesFiltradas.length === 0) {
            Swal.fire('Sin evaluaciones', 'No se encontraron evaluaciones para este residente en el período seleccionado.', 'info');
            btnGenerarIa.innerHTML = '<span>🔍</span> Generar Informe y Calcular Notas';
            btnGenerarIa.disabled = false;
            return;
        }

        let sumRonda = 0, countRonda = 0;
        let sumSeminarios = 0, countSeminarios = 0;
        let sumTemaCentral = 0, countTemaCentral = 0;
        
        let resumenFeedbackCualitativo = '';

        evaluacionesFiltradas.forEach((ev, idx) => {
            if (ev.tipoRubrica === 'ronda') { sumRonda += ev.notaFinalRubrica; countRonda++; }
            if (ev.tipoRubrica === 'seminarios') { sumSeminarios += ev.notaFinalRubrica; countSeminarios++; }
            if (ev.tipoRubrica === 'tema_central') { sumTemaCentral += ev.notaFinalRubrica; countTemaCentral++; }
            
            resumenFeedbackCualitativo += `\nEvaluación #${idx+1} [${ev.tipoRubrica.toUpperCase()}]:\n`;
            if (ev.aspectosPositivosGenerales) resumenFeedbackCualitativo += `- Aspectos Positivos: ${ev.aspectosPositivosGenerales}\n`;
            if (ev.aspectosMejorarGenerales) resumenFeedbackCualitativo += `- Aspectos a Mejorar: ${ev.aspectosMejorarGenerales}\n`;
        });

        const promRonda = countRonda > 0 ? (sumRonda / countRonda) : 0;
        const promSeminarios = countSeminarios > 0 ? (sumSeminarios / countSeminarios) : 0;
        const promTemaCentral = countTemaCentral > 0 ? (sumTemaCentral / countTemaCentral) : 0;
        
        const notaFinalDefinitiva = (promRonda * 0.40) + (promSeminarios * 0.35) + (promTemaCentral * 0.20) + (notaAuto * 0.05);

        const promptText = `Actúa como el Coordinador Académico del Departamento de Pediatría del Hospital General de Medellín (Luz Castro de Gutiérrez E.S.E.).
Redacta la "SÍNTESIS CUALITATIVA DEL DESEMPEÑO" para el informe final de rotación del residente.

**Residente:** ${est.nombre}
**Programa:** ${est.programa.toUpperCase()}
**Rotación:** ${rotacionSeleccionada}
**Nota Promedio Final:** ${notaFinalDefinitiva.toFixed(2)} / 5.0

**Desglose de notas:**
- Ronda Clínica (40%): ${promRonda.toFixed(2)}
- Seminarios (35%): ${promSeminarios.toFixed(2)}
- Tema Central (20%): ${promTemaCentral.toFixed(2)}
- Autoevaluación (5%): ${notaAuto.toFixed(2)}

**Comentarios recopilados de los docentes durante la rotación:**
${resumenFeedbackCualitativo || 'No hay comentarios registrados.'}

**Instrucciones estrictas:**
1. Redacta en tercera persona de forma muy formal, técnica y profesional.
2. NO menciones los nombres de los docentes evaluadores bajo ninguna circunstancia.
3. El informe debe constar de 2 a 3 párrafos bien estructurados.
4. Conecta el desempeño real del residente (notas y comentarios) explícitamente con las competencias clínicas esperadas en el Hospital General de Medellín.
5. Si el promedio es menor a 3.6, enfatiza en un tono constructivo pero firme las áreas críticas a mejorar.
6. NO incluyas saludos, títulos, HTML ni despedidas, ve directo al texto del informe en texto plano.`;

        const modelsRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
        if (!modelsRes.ok) {
            let errorDetalle = `Error ${modelsRes.status}`;
            try {
                const errData = await modelsRes.json();
                if (errData.error?.message) errorDetalle = errData.error.message;
            } catch (e) {}
            throw new Error(`Fallo al validar la API Key: ${errorDetalle}`);
        }

        const modelsData = await modelsRes.json();
        let availableModels = modelsData.models.filter(m => 
            m.supportedGenerationMethods && 
            m.supportedGenerationMethods.includes('generateContent') &&
            m.name.includes('gemini')
        );

        if (availableModels.length === 0) {
            throw new Error('La llave es válida, pero no tiene modelos Gemini habilitados en este proyecto de Google Cloud / AI Studio.');
        }

        availableModels.sort((a, b) => b.name.localeCompare(a.name));

        let textoIA = null;
        let selectedModel = null;
        let ultimoError = null;

        for (const modelObj of availableModels) {
            selectedModel = modelObj.name;
            try {
                const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/${selectedModel}:generateContent?key=${apiKey}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 
                        contents: [{ parts: [{ text: promptText }] }],
                        generationConfig: { temperature: 0.3 }
                    })
                });

                if (response.ok) {
                    const data = await response.json();
                    if (data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
                        textoIA = data.candidates[0].content.parts[0].text;
                        break;
                    }
                } else {
                    let detalleGoogle = `Error ${response.status}`;
                    try {
                        const errData = await response.json();
                        if (errData.error?.message) detalleGoogle = errData.error.message;
                    } catch (e) {}

                    ultimoError = new Error(`[${selectedModel.replace('models/', '')}] ${detalleGoogle}`);
                    if (response.status === 404 || detalleGoogle.toLowerCase().includes('no longer available')) continue; 
                    throw ultimoError;
                }
            } catch (errLoop) {
                ultimoError = errLoop;
                if (errLoop.message && (errLoop.message.includes('404') || errLoop.message.toLowerCase().includes('no longer available'))) continue;
                throw errLoop;
            }
        }

        if (!textoIA) {
            throw ultimoError || new Error('No se pudo generar el texto con los modelos disponibles.');
        }
        
        let cleanHtml = textoIA.replace(/```html/g, '').replace(/```/g, '').trim();
        let parrafosHTML = cleanHtml.split('\n').filter(p => p.trim() !== '').map(p => `<p style="margin-bottom: 10px;">${p.trim()}</p>`).join('');
        
        let calificacionCualitativa = notaFinalDefinitiva >= 4.1 ? 'SOBRESALIENTE' : notaFinalDefinitiva >= 3.0 ? 'APROBADO / BUENO' : 'INSUFICIENTE / POR MEJORAR';
        let colorNota = notaFinalDefinitiva >= 3.0 ? '#1A6632' : '#DC3545';

        const periodoEval = `${fechaDesdeStr || 'Inicio'} a ${fechaHastaStr || 'Fin'}`;

        infTexto.innerHTML = `
            <div style="font-family: 'Inter', Arial, sans-serif; color: #333; padding: 20px 30px; background: white; border-radius: 8px;">
                <div style="text-align: center; margin-bottom: 20px; color: #16a34a; font-weight: bold; padding: 10px; background: #dcfce7; border-radius: 8px;">
                    ✅ ¡Informe generado con éxito! Tu documento de Word se descargará automáticamente.
                </div>
                <div style="text-align: center; margin-bottom: 30px;">
                    <h2 style="color: #005A9C; margin: 0; font-size: 22px; font-weight: bold;">HOSPITAL GENERAL DE MEDELLÍN</h2>
                    <h3 style="color: #333; margin: 5px 0; font-size: 16px;">Luz Castro de Gutiérrez E.S.E.</h3>
                    <p style="color: #666; margin: 0; font-size: 13px;">Departamento de Pediatría / Programa Docente Asistencial</p>
                    <hr style="border: none; border-top: 2px solid #005A9C; margin: 15px 0;">
                    <h2 style="color: #005A9C; margin: 15px 0; font-size: 20px; font-weight: bold;">INFORME FINAL CONSOLIDADO DE ROTACIÓN</h2>
                </div>

                <div style="margin-bottom: 25px; line-height: 1.8; font-size: 14px; background: #f8fafc; padding: 15px; border-radius: 8px;">
                    <p style="margin:0;"><strong>Residente / Fellow:</strong> ${est.nombre}</p>
                    <p style="margin:0;"><strong>Programa:</strong> ${est.programa.toUpperCase()}</p>
                    <p style="margin:0;"><strong>Rotación:</strong> ${rotacionSeleccionada}</p>
                    <p style="margin:0;"><strong>Período evaluado:</strong> ${periodoEval}</p>
                </div>

                <h3 style="color: #005A9C; font-size: 15px; font-weight: bold; margin-bottom: 15px; text-transform: uppercase;">Calificación Promedio por Componentes</h3>
                <table style="width: 100%; border-collapse: collapse; margin-bottom: 25px; font-size: 13px;">
                    <thead>
                        <tr style="background-color: #005A9C; color: white;">
                            <th style="padding: 10px; border: 1px solid #ddd; text-align: left;">Componente Evaluado</th>
                            <th style="padding: 10px; border: 1px solid #ddd; text-align: center; width: 15%;">Peso</th>
                            <th style="padding: 10px; border: 1px solid #ddd; text-align: center; width: 25%;">Promedio Consolidado</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td style="padding: 10px; border: 1px solid #ddd;">1. Ronda Clínica (Aplicación Práctica y Criterio)</td>
                            <td style="padding: 10px; border: 1px solid #ddd; text-align: center;">40%</td>
                            <td style="padding: 10px; border: 1px solid #ddd; text-align: center; font-weight: bold;">${promRonda.toFixed(2)}</td>
                        </tr>
                        <tr style="background-color: #f8fafc;">
                            <td style="padding: 10px; border: 1px solid #ddd;">2. Seminarios (Conocimientos Académicos)</td>
                            <td style="padding: 10px; border: 1px solid #ddd; text-align: center;">35%</td>
                            <td style="padding: 10px; border: 1px solid #ddd; text-align: center; font-weight: bold;">${promSeminarios.toFixed(2)}</td>
                        </tr>
                        <tr>
                            <td style="padding: 10px; border: 1px solid #ddd;">3. Tema Central (Investigación y Profundización)</td>
                            <td style="padding: 10px; border: 1px solid #ddd; text-align: center;">20%</td>
                            <td style="padding: 10px; border: 1px solid #ddd; text-align: center; font-weight: bold;">${promTemaCentral.toFixed(2)}</td>
                        </tr>
                        <tr style="background-color: #f8fafc;">
                            <td style="padding: 10px; border: 1px solid #ddd;">4. Autoevaluación del Residente</td>
                            <td style="padding: 10px; border: 1px solid #ddd; text-align: center;">5%</td>
                            <td style="padding: 10px; border: 1px solid #ddd; text-align: center; font-weight: bold;">${notaAuto.toFixed(2)}</td>
                        </tr>
                    </tbody>
                </table>

                <div style="text-align: center; margin: 30px 0; background: #f0fdf4; border: 1px solid #bbf7d0; padding: 15px; border-radius: 8px;">
                    <h2 style="margin: 0; color: ${colorNota}; font-size: 18px;">
                        NOTA DEFINITIVA: ${notaFinalDefinitiva.toFixed(2)} / 5.0 — ${calificacionCualitativa}
                    </h2>
                </div>

                <h3 style="color: #005A9C; font-size: 15px; font-weight: bold; margin-bottom: 10px; text-transform: uppercase;">Síntesis Cualitativa del Desempeño</h3>
                <div style="font-size: 13.5px; text-align: justify; margin-bottom: 30px; line-height: 1.6;">
                    ${parrafosHTML}
                </div>

                <h3 style="color: #005A9C; font-size: 15px; font-weight: bold; margin-bottom: 10px; text-transform: uppercase;">Síntesis de Comentarios de los Docentes</h3>
                <div style="background-color: #f8fafc; padding: 15px; border-left: 4px solid #005A9C; font-size: 13px; margin-bottom: 60px; line-height: 1.6;">
                    ${resumenFeedbackCualitativo ? resumenFeedbackCualitativo.replace(/\n/g, '<br>') : '<em>No hay comentarios cualitativos registrados en el período evaluado.</em>'}
                </div>
            </div>
        `;
        infResultado.classList.remove('hidden');

        try {
            lastWordData = [
                est,
                rotacionSeleccionada,
                periodoEval,
                { promRonda, promSeminarios, promTemaCentral, notaAuto, notaFinal: notaFinalDefinitiva },
                textoIA,
                resumenFeedbackCualitativo,
                selectedModel
            ];
            await descargarInformeWord(...lastWordData);
        } catch (e) {
            console.error("Error al generar Word:", e);
            Swal.fire('Atención', 'El texto se generó bien, pero hubo un problema descargando el archivo Word: ' + e.message, 'warning');
        }

    } catch (error) {
        console.error('Error al generar informe:', error);
        Swal.fire('Error de Google Gemini', error.message, 'error');
    } finally {
        btnGenerarIa.innerHTML = '<span>🔍</span> Generar Informe y Calcular Notas';
        btnGenerarIa.disabled = false;
    }
});

async function descargarInformeWord(est, rotacion, fechas, notas, textoIA, comentariosDocentes, modeloUsado) {
    if (!window.docx) {
        throw new Error('La librería docx no se ha cargado en el navegador.');
    }

    const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, AlignmentType, WidthType, ImageRun, ShadingType } = window.docx;

    let logoBuffer = null;
    try {
        const logoRes = await fetch('assets/logo.jpg');
        if (logoRes.ok) {
            logoBuffer = await logoRes.arrayBuffer();
        }
    } catch (e) {
        console.warn('No se pudo cargar el logo para el documento Word', e);
    }

    const { promRonda, promSeminarios, promTemaCentral, notaAuto, notaFinal } = notas;
    const calificacionCualitativa = notaFinal >= 4.1 ? 'SOBRESALIENTE' : notaFinal >= 3.0 ? 'APROBADO / BUENO' : 'INSUFICIENTE / POR MEJORAR';
    const colorNota = notaFinal >= 3.0 ? '1A6632' : 'DC3545';

    const headerChildren = [];
    if (logoBuffer) {
        headerChildren.push(new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
                new ImageRun({
                    data: logoBuffer,
                    transformation: { width: 130, height: 130 }
                })
            ],
            spacing: { after: 200 }
        }));
    }

    headerChildren.push(
        new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 80 }, children: [
            new TextRun({ text: 'HOSPITAL GENERAL DE MEDELLÍN', bold: true, size: 30, color: '005A9C' })
        ]}),
        new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 80 }, children: [
            new TextRun({ text: 'Luz Castro de Gutiérrez E.S.E.', bold: true, size: 24, color: '333333' })
        ]}),
        new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 300 }, children: [
            new TextRun({ text: 'Departamento de Pediatría / Programa Docente Asistencial', size: 22, color: '666666' })
        ]}),
        new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 400 }, children: [
            new TextRun({ text: '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', size: 16, color: '00A3E0' })
        ]}),
        new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 400 }, children: [
            new TextRun({ text: 'INFORME FINAL CONSOLIDADO DE ROTACIÓN', bold: true, size: 28, color: '005A9C' })
        ]})
    );

    const infoResidente = [
        new Paragraph({ spacing: { after: 150 }, children: [new TextRun({ text: 'Residente / Fellow: ', bold: true, size: 22 }), new TextRun({ text: est.nombre, size: 22 })] }),
        new Paragraph({ spacing: { after: 150 }, children: [new TextRun({ text: 'Programa: ', bold: true, size: 22 }), new TextRun({ text: est.programa.toUpperCase(), size: 22 })] }),
        new Paragraph({ spacing: { after: 150 }, children: [new TextRun({ text: 'Rotación: ', bold: true, size: 22 }), new TextRun({ text: rotacion, size: 22 })] }),
        new Paragraph({ spacing: { after: 400 }, children: [new TextRun({ text: 'Período evaluado: ', bold: true, size: 22 }), new TextRun({ text: fechas, size: 22 })] }),
    ];

    const tableHeader = new TableRow({
        tableHeader: true,
        children: [
            new TableCell({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Componente Evaluado', bold: true, color: 'FFFFFF', size: 20 })] })], shading: { fill: '005A9C', type: ShadingType.CLEAR } }),
            new TableCell({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Peso', bold: true, color: 'FFFFFF', size: 20 })] })], shading: { fill: '005A9C', type: ShadingType.CLEAR }, width: { size: 15, type: WidthType.PERCENTAGE } }),
            new TableCell({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Promedio Consolidado', bold: true, color: 'FFFFFF', size: 20 })] })], shading: { fill: '005A9C', type: ShadingType.CLEAR }, width: { size: 25, type: WidthType.PERCENTAGE } })
        ]
    });

    const createRow = (name, weight, score) => new TableRow({
        children: [
            new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: name, size: 20 })] })], margins: { top: 100, bottom: 100, left: 100 } }),
            new TableCell({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: weight, size: 20 })] })], margins: { top: 100, bottom: 100 } }),
            new TableCell({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: score, bold: true, size: 20 })] })], margins: { top: 100, bottom: 100 } })
        ]
    });

    const table = new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        rows: [
            tableHeader,
            createRow('1. Ronda Clínica (Aplicación Práctica y Criterio)', '40%', promRonda.toFixed(2)),
            createRow('2. Seminarios (Conocimientos Académicos)', '35%', promSeminarios.toFixed(2)),
            createRow('3. Tema Central (Investigación y Profundización)', '20%', promTemaCentral.toFixed(2)),
            createRow('4. Autoevaluación del Residente', '5%', notaAuto.toFixed(2))
        ]
    });

    const notaFinalP = new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 400, after: 400 },
        children: [
            new TextRun({ text: `NOTA DEFINITIVA: ${notaFinal.toFixed(2)} / 5.0 — ${calificacionCualitativa}`, bold: true, size: 26, color: colorNota })
        ]
    });

    const iaTitle = new Paragraph({ spacing: { before: 200, after: 200 }, children: [new TextRun({ text: 'SÍNTESIS CUALITATIVA DEL DESEMPEÑO', bold: true, size: 24, color: '005A9C' })] });
    const aiParagraphs = textoIA.split('\n').filter(p => p.trim() !== '').map(p => 
        new Paragraph({ alignment: AlignmentType.JUSTIFIED, spacing: { after: 150 }, children: [new TextRun({ text: p.trim(), size: 22 })] })
    );

    const commentTitle = new Paragraph({ spacing: { before: 300, after: 200 }, children: [new TextRun({ text: 'SÍNTESIS DE COMENTARIOS DE LOS DOCENTES', bold: true, size: 24, color: '005A9C' })] });
    let comText = comentariosDocentes || 'No hay comentarios cualitativos registrados en el período evaluado.';
    const commentsParagraphs = comText.split('\n').map(c => 
        new Paragraph({
            alignment: AlignmentType.JUSTIFIED,
            spacing: { after: 100 },
            children: [new TextRun({ text: c.trim(), size: 20, italics: !comentariosDocentes })]
        })
    );

    const firmas = [
        new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 1000 }, children: [new TextRun({ text: '____________________________________', size: 22 })] }),
        new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 100 }, children: [new TextRun({ text: 'Coordinador Académico de Pediatría', bold: true, size: 22 })] }),
        new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Hospital General de Medellín - Luz Castro de Gutiérrez', size: 20, color: '666666' })] }),
        new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 100 }, children: [new TextRun({ text: `Fecha de generación: ${new Date().toLocaleDateString('es-CO')}`, size: 18, color: '999999' })] }),
        new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: `IA: ${modeloUsado.replace('models/', '')}`, size: 16, color: 'BBBBBB' })] })
    ];

    const docxObj = new Document({
        sections: [{
            properties: { page: { margin: { top: 1440, bottom: 1440, left: 1440, right: 1440 } } },
            children: [
                ...headerChildren,
                ...infoResidente,
                new Paragraph({ spacing: { before: 300, after: 150 }, children: [new TextRun({ text: 'CALIFICACIÓN PROMEDIO POR COMPONENTES', bold: true, size: 20, color: '005A9C' })] }),
                table,
                notaFinalP,
                iaTitle,
                ...aiParagraphs,
                commentTitle,
                ...commentsParagraphs,
                ...firmas
            ]
        }]
    });

    const blob = await Packer.toBlob(docxObj);
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Informe_Final_${est.nombre.replace(/\s+/g, '_')}_${rotacion.replace(/\s+/g, '_')}_HGM.docx`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

let lastWordData = null;

const btnDescargarWord = document.getElementById('btn-descargar-word');
if (btnDescargarWord) {
    btnDescargarWord.addEventListener('click', async () => {
        if (!lastWordData) {
            Swal.fire('Atención', 'Primero debes generar el informe antes de descargarlo.', 'warning');
            return;
        }
        
        btnDescargarWord.disabled = true;
        btnDescargarWord.innerHTML = '<span>⏳</span> Descargando...';
        
        try {
            await descargarInformeWord(...lastWordData);
        } catch (error) {
            console.error('Error al descargar el Word:', error);
            Swal.fire('Error', 'No se pudo descargar el archivo Word.', 'error');
        } finally {
            btnDescargarWord.disabled = false;
            btnDescargarWord.innerHTML = '<span>📄</span> Descargar Word';
        }
    });
}

// --- GESTIÓN DE RESIDENTES / FELLOWS (COORDINADOR) ---
if (btnAdminEstudiantes) {
    btnAdminEstudiantes.addEventListener('click', async () => {
        await abrirModalGestionEstudiantes();
    });
}

async function abrirModalGestionEstudiantes() {
    Swal.fire({
        title: 'Cargando lista de estudiantes...',
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading()
    });

    await cargarEstudiantesDesdeFirestore();

    const listaHtml = appState.estudiantes.map(est => `
        <div class="flex justify-between items-center p-2 border-b text-sm">
            <div class="text-left">
                <strong>${est.nombre}</strong> 
                <span class="text-xs px-2 py-0.5 rounded ${est.programa === 'fellow' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'} font-semibold ml-2 uppercase">${est.programa}</span>
            </div>
            <button class="btn-eliminar-est text-red-500 hover:text-red-700 text-xs px-2 py-1 font-bold" data-id="${est.id}">Eliminar</button>
        </div>
    `).join('');

    const modalHtml = `
        <div class="text-left space-y-4">
            <div class="bg-gray-50 p-3 rounded border">
                <h4 class="font-bold text-sm text-[#0056b3] mb-2">➕ Agregar Nuevo Residente o Fellow</h4>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-2">
                    <input type="text" id="nuevo-est-nombre" placeholder="Nombre completo (ej. Dra. Laura Gómez)" class="border rounded p-2 text-sm w-full">
                    <select id="nuevo-est-programa" class="border rounded p-2 text-sm w-full bg-white">
                        <option value="residente">Residente de Pediatría</option>
                        <option value="fellow">Fellow de Cuidado Intensivo</option>
                    </select>
                </div>
                <button id="btn-guardar-nuevo-est" class="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-1.5 px-3 rounded text-sm transition shadow-sm">
                    Guardar Residente en Base de Datos
                </button>
            </div>

            <div>
                <h4 class="font-bold text-sm text-gray-700 mb-2">📋 Lista Actual de Residentes y Fellows (HGM):</h4>
                <div class="max-h-48 overflow-y-auto border rounded bg-white p-2 divide-y">
                    ${listaHtml || '<p class="text-xs text-gray-400 p-2">No hay residentes registrados aún.</p>'}
                </div>
            </div>
        </div>
    `;

    Swal.fire({
        title: 'Gestión de Residentes y Fellows - HGM',
        html: modalHtml,
        width: '550px',
        showConfirmButton: false,
        showCloseButton: true,
        didOpen: () => {
            const btnGuardar = document.getElementById('btn-guardar-nuevo-est');
            const inputNombre = document.getElementById('nuevo-est-nombre');
            const selectProg = document.getElementById('nuevo-est-programa');

            btnGuardar.addEventListener('click', async () => {
                const nombre = inputNombre.value.trim();
                const programa = selectProg.value;

                if (!nombre) {
                    Swal.showValidationMessage('Por favor escribe el nombre del residente');
                    return;
                }

                try {
                    await addDoc(collection(db, 'estudiantes'), {
                        nombre,
                        programa,
                        institucion: "Hospital General de Medellín",
                        createdAt: serverTimestamp()
                    });
                    
                    Swal.fire({
                        icon: 'success',
                        title: 'Residente Agregado',
                        toast: true,
                        position: 'top-end',
                        showConfirmButton: false,
                        timer: 2000
                    });

                    await cargarEstudiantesDesdeFirestore();
                    if (appState.programaSeleccionado) {
                        filtrarEstudiantesEnSelect(appState.programaSeleccionado);
                    }
                    abrirModalGestionEstudiantes();

                } catch (err) {
                    console.error('Error al agregar estudiante:', err);
                    Swal.fire('Error', 'No se pudo guardar el residente en Firebase.', 'error');
                }
            });

            document.querySelectorAll('.btn-eliminar-est').forEach(btn => {
                btn.addEventListener('click', async (e) => {
                    const estId = e.target.dataset.id;
                    const confirm = await Swal.fire({
                        title: '¿Eliminar residente?',
                        text: 'Esta acción no se puede deshacer.',
                        icon: 'warning',
                        showCancelButton: true,
                        confirmButtonText: 'Sí, eliminar',
                        cancelButtonText: 'Cancelar',
                        confirmButtonColor: '#d33'
                    });

                    if (confirm.isConfirmed) {
                        try {
                            await deleteDoc(doc(db, 'estudiantes', estId));
                            await cargarEstudiantesDesdeFirestore();
                            if (appState.programaSeleccionado) {
                                filtrarEstudiantesEnSelect(appState.programaSeleccionado);
                            }
                            abrirModalGestionEstudiantes();
                        } catch (err) {
                            console.error('Error al eliminar:', err);
                            Swal.fire('Error', 'No se pudo eliminar de Firebase.', 'error');
                        }
                    }
                });
            });
        }
    });
}

// --- GESTIÓN DE USUARIOS: DOCENTES Y ADMINISTRADORES (COORDINADOR) ---
if (btnAdminUsuarios) {
    btnAdminUsuarios.addEventListener('click', async () => {
        await abrirModalGestionUsuarios();
    });
}

async function cargarUsuariosDesdeFirestore() {
    if (!db) return;
    try {
        const querySnapshot = await getDocs(collection(db, 'usuarios'));
        appState.usuarios = [];
        querySnapshot.forEach((docSnap) => {
            const data = docSnap.data();
            appState.usuarios.push({
                id: docSnap.id,
                correo: (data.correo || data.email || '').toLowerCase().trim(),
                rol: (data.rol || data.Rol || 'docente').toLowerCase().trim(),
                ...data
            });
        });
    } catch (error) {
        console.error('Error al consultar usuarios:', error);
    }
}

async function abrirModalGestionUsuarios() {
    Swal.fire({
        title: 'Cargando lista de docentes y administradores...',
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading()
    });

    await cargarUsuariosDesdeFirestore();

    const listaHtml = appState.usuarios.map(u => {
        const esCoord = (u.rol === 'coordinador' || u.rol === 'administrador');
        const badgeColor = esCoord ? 'bg-indigo-100 text-indigo-800 border-indigo-200' : 'bg-blue-100 text-blue-800 border-blue-200';
        const rolTexto = esCoord ? 'Coordinador / Admin' : 'Docente Evaluador';

        return `
            <div class="flex justify-between items-center p-2.5 border-b text-sm">
                <div class="text-left">
                    <span class="font-medium text-gray-800">${u.correo}</span>
                    <span class="text-[11px] px-2 py-0.5 rounded-full border font-bold ml-2 ${badgeColor}">${rolTexto}</span>
                </div>
                <button class="btn-eliminar-usuario text-red-500 hover:text-red-700 text-xs px-2 py-1 font-bold" data-id="${u.id}" data-correo="${u.correo}">Eliminar</button>
            </div>
        `;
    }).join('');

    const modalHtml = `
        <div class="text-left space-y-4">
            <div class="bg-gray-50 p-3.5 rounded-lg border border-gray-200">
                <h4 class="font-bold text-sm text-[#0056b3] mb-2 flex items-center gap-1">
                    <span>➕</span> Registrar Nuevo Docente o Administrador
                </h4>
                <div class="space-y-2 mb-3">
                    <div>
                        <label class="block text-xs font-bold text-gray-700 mb-0.5">Correo Electrónico:</label>
                        <input type="email" id="nuevo-user-email" placeholder="ejemplo@hgm.gov.co" class="border rounded p-2 text-sm w-full bg-white outline-none focus:border-blue-500">
                    </div>
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <div>
                            <label class="block text-xs font-bold text-gray-700 mb-0.5">Contraseña Inicial:</label>
                            <input type="password" id="nuevo-user-password" placeholder="Mínimo 6 caracteres" class="border rounded p-2 text-sm w-full bg-white outline-none focus:border-blue-500">
                        </div>
                        <div>
                            <label class="block text-xs font-bold text-gray-700 mb-0.5">Rol en la Plataforma:</label>
                            <select id="nuevo-user-rol" class="border rounded p-2 text-sm w-full bg-white outline-none focus:border-blue-500 font-medium">
                                <option value="docente">Docente Evaluador</option>
                                <option value="coordinador">Coordinador (Administrador)</option>
                            </select>
                        </div>
                    </div>
                </div>
                <button id="btn-guardar-nuevo-user" class="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-3 rounded text-sm transition shadow-sm">
                    Crear y Autorizar Usuario
                </button>
            </div>

            <div>
                <h4 class="font-bold text-sm text-gray-700 mb-2">📋 Usuarios Registrados en el Sistema:</h4>
                <div class="max-h-52 overflow-y-auto border rounded bg-white p-2 divide-y">
                    ${listaHtml || '<p class="text-xs text-gray-400 p-2">No hay usuarios registrados aún.</p>'}
                </div>
            </div>
        </div>
    `;

    Swal.fire({
        title: 'Gestión de Docentes y Coordinadores - HGM',
        html: modalHtml,
        width: '580px',
        showConfirmButton: false,
        showCloseButton: true,
        didOpen: () => {
            const btnGuardar = document.getElementById('btn-guardar-nuevo-user');
            const inputEmail = document.getElementById('nuevo-user-email');
            const inputPassword = document.getElementById('nuevo-user-password');
            const selectRol = document.getElementById('nuevo-user-rol');

            btnGuardar.addEventListener('click', async () => {
                const email = inputEmail.value.trim().toLowerCase();
                const password = inputPassword.value;
                const rol = selectRol.value;

                if (!email || !email.includes('@')) {
                    Swal.showValidationMessage('Ingresa un correo electrónico válido');
                    return;
                }
                if (!password || password.length < 6) {
                    Swal.showValidationMessage('La contraseña debe tener mínimo 6 caracteres');
                    return;
                }

                btnGuardar.disabled = true;
                btnGuardar.innerHTML = '<span>⏳</span> Creando usuario en Firebase...';

                try {
                    // Instancia secundaria para NO cerrar la sesión activa del coordinador actual
                    let secondaryApp;
                    try {
                        secondaryApp = initializeApp(firebaseConfig, "SecondaryAuth");
                    } catch (e) {
                        secondaryApp = getApp("SecondaryAuth");
                    }

                    const secondaryAuth = getAuth(secondaryApp);
                    let uid = null;

                    try {
                        const cred = await createUserWithEmailAndPassword(secondaryAuth, email, password);
                        uid = cred.user.uid;
                        await signOut(secondaryAuth);
                    } catch (authErr) {
                        if (authErr.code === 'auth/email-already-in-use') {
                            console.log('El correo ya existe en Firebase Authentication, registrando rol en Firestore...');
                        } else {
                            throw authErr;
                        }
                    }

                    // Guardar rol en Firestore
                    await addDoc(collection(db, 'usuarios'), {
                        correo: email,
                        rol: rol,
                        uid: uid || null,
                        institucion: "Hospital General de Medellín",
                        createdAt: serverTimestamp()
                    });

                    Swal.fire({
                        icon: 'success',
                        title: 'Usuario Creado y Autorizado',
                        text: `${email} ahora puede ingresar con su contraseña como ${rol === 'coordinador' ? 'Coordinador' : 'Docente'}.`,
                        confirmButtonColor: '#0056b3'
                    }).then(() => {
                        abrirModalGestionUsuarios();
                    });

                } catch (err) {
                    console.error('Error al registrar usuario:', err);
                    let msg = err.message || 'Error desconocido';
                    if (err.code === 'auth/email-already-in-use') msg = 'El correo ya está registrado en Firebase Authentication.';
                    Swal.fire('Error', 'No se pudo crear el usuario: ' + msg, 'error');
                }
            });

            document.querySelectorAll('.btn-eliminar-usuario').forEach(btn => {
                btn.addEventListener('click', async (e) => {
                    const userId = e.target.dataset.id;
                    const userEmail = e.target.dataset.correo;

                    const confirm = await Swal.fire({
                        title: '¿Revocar acceso?',
                        text: `Se eliminarán los permisos de ${userEmail}.`,
                        icon: 'warning',
                        showCancelButton: true,
                        confirmButtonText: 'Sí, revocar',
                        cancelButtonText: 'Cancelar',
                        confirmButtonColor: '#d33'
                    });

                    if (confirm.isConfirmed) {
                        try {
                            await deleteDoc(doc(db, 'usuarios', userId));
                            Swal.fire({
                                icon: 'success',
                                title: 'Acceso Revocado',
                                toast: true,
                                position: 'top-end',
                                showConfirmButton: false,
                                timer: 2000
                            });
                            abrirModalGestionUsuarios();
                        } catch (err) {
                            console.error('Error al eliminar usuario:', err);
                            Swal.fire('Error', 'No se pudo eliminar de Firestore.', 'error');
                        }
                    }
                });
            });
        }
    });
}
