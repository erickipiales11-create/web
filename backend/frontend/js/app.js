import { 
    getFarmacias, 
    getMedicamentos, 
    searchMedicamentos,
    createMedicamento,
    updateStock,
    deleteMedicamento,
    getMedicamentosPorVencer,
    getMedicamentosBajoStock,
    getFarmaciasByCity
} from './api.js';
import { 
    iniciarSesion, 
    registrarUsuario, 
    registrarFarmacia, 
    cerrarSesion,
    actualizarUIUsuario,
    isAuthenticated,
    isFarmacia,
    getCurrentUser
} from './auth.js';

// ============================================
// VARIABLES GLOBALES
// ============================================

let farmaciasData = [];
let medicamentosData = [];

// ============================================
// TOAST NOTIFICATIONS
// ============================================

export const showToast = (message, type = 'info') => {
    const container = document.getElementById('toastContainer') || crearToastContainer();
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    container.appendChild(toast);
    
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(100px)';
        setTimeout(() => toast.remove(), 300);
    }, 4000);
};

function crearToastContainer() {
    const container = document.createElement('div');
    container.id = 'toastContainer';
    container.className = 'toast-container';
    document.body.appendChild(container);
    return container;
}

// ============================================
// NAVEGACIÓN
// ============================================

export function navegar(pagina) {
    const pages = document.querySelectorAll('.page');
    pages.forEach(p => p.classList.remove('active'));
    
    const target = document.getElementById(`page-${pagina}`);
    if (target) target.classList.add('active');
    
    // Actualizar links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.toggle('active', link.dataset.page === pagina);
    });
}

// ============================================
// MODALES
// ============================================

export function abrirModal(id) {
    const modal = document.getElementById(id);
    if (modal) modal.classList.add('active');
}

export function cerrarModal(id) {
    const modal = document.getElementById(id);
    if (modal) modal.classList.remove('active');
}

// ============================================
// CARGAR DATOS
// ============================================

export async function cargarFarmacias() {
    const container = document.getElementById('farmaciasContainer');
    try {
        const result = await getFarmacias();
        farmaciasData = result.farmacias || [];
        
        if (farmaciasData.length === 0) {
            container.innerHTML = '<div class="loading">No hay farmacias registradas</div>';
            return;
        }
        
        const totalFarmacias = document.getElementById('totalFarmacias');
        if (totalFarmacias) totalFarmacias.textContent = farmaciasData.length;
        
        let html = `
            <table>
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Dirección</th>
                        <th>Ciudad</th>
                        <th>Teléfono</th>
                        <th>Licencia</th>
                        <th>Estado</th>
                    </tr>
                </thead>
                <tbody>
        `;
        
        farmaciasData.forEach(f => {
            html += `
                <tr>
                    <td><strong>${f.nombre_farmacia}</strong></td>
                    <td>${f.direccion || '-'}</td>
                    <td>${f.ciudad || '-'}</td>
                    <td>${f.telefono || '-'}</td>
                    <td>${f.numero_licencia || '-'}</td>
                    <td>
                        <span class="badge ${f.activo ? 'badge-success' : 'badge-danger'}">
                            ${f.activo ? 'Activo' : 'Inactivo'}
                        </span>
                    </td>
                </tr>
            `;
        });
        
        html += '</tbody></table>';
        container.innerHTML = html;
    } catch (error) {
        container.innerHTML = `<div class="loading" style="color: var(--danger);">❌ ${error.message}</div>`;
    }
}

export async function cargarMedicamentos() {
    const container = document.getElementById('medicamentosContainer');
    try {
        const result = await getMedicamentos();
        medicamentosData = result.medicamentos || [];
        
        if (medicamentosData.length === 0) {
            container.innerHTML = '<div class="loading">No hay medicamentos registrados</div>';
            return;
        }
        
        const totalMedicamentos = document.getElementById('totalMedicamentos');
        if (totalMedicamentos) totalMedicamentos.textContent = medicamentosData.length;
        
        let html = `
            <table>
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Farmacia</th>
                        <th>Cantidad</th>
                        <th>Precio</th>
                        <th>Lote</th>
                        <th>Caducidad</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
        `;
        
        medicamentosData.forEach(m => {
            const caducidad = new Date(m.fecha_caducidad);
            const hoy = new Date();
            const dias = Math.ceil((caducidad - hoy) / (1000 * 60 * 60 * 24));
            let badge = 'badge-success';
            if (dias < 30) badge = 'badge-warning';
            if (dias < 0) badge = 'badge-danger';
            
            html += `
                <tr>
                    <td><strong>${m.nombre}</strong></td>
                    <td>${m.Farmacia?.nombre_farmacia || '-'}</td>
                    <td>${m.cantidad}</td>
                    <td>$${m.precio}</td>
                    <td>${m.numero_lote}</td>
                    <td>
                        <span class="badge ${badge}">
                            ${m.fecha_caducidad}
                        </span>
                    </td>
                    <td>
                        <div class="actions">
                            <button class="btn-edit" onclick="editarMedicamento(${m.id})">Editar</button>
                            <button class="btn-delete" onclick="eliminarMedicamento(${m.id})">Eliminar</button>
                        </div>
                    </td>
                </tr>
            `;
        });
        
        html += '</tbody></table>';
        container.innerHTML = html;
    } catch (error) {
        container.innerHTML = `<div class="loading" style="color: var(--danger);">❌ ${error.message}</div>`;
    }
}

// ============================================
// BUSCAR
// ============================================

export async function buscarMedicamentos(query) {
    const container = document.getElementById('medicamentosContainer');
    if (!query.trim()) {
        cargarMedicamentos();
        return;
    }
    
    try {
        const result = await searchMedicamentos(query);
        const medicamentos = result.medicamentos || [];
        
        if (medicamentos.length === 0) {
            container.innerHTML = `<div class="loading">No se encontraron medicamentos para "${query}"</div>`;
            return;
        }
        
        let html = `
            <table>
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Farmacia</th>
                        <th>Cantidad</th>
                        <th>Precio</th>
                        <th>Lote</th>
                        <th>Caducidad</th>
                    </tr>
                </thead>
                <tbody>
        `;
        
        medicamentos.forEach(m => {
            html += `
                <tr>
                    <td><strong>${m.nombre}</strong></td>
                    <td>${m.Farmacia?.nombre_farmacia || '-'}</td>
                    <td>${m.cantidad}</td>
                    <td>$${m.precio}</td>
                    <td>${m.numero_lote}</td>
                    <td>${m.fecha_caducidad}</td>
                </tr>
            `;
        });
        
        html += '</tbody></table>';
        container.innerHTML = html;
    } catch (error) {
        container.innerHTML = `<div class="loading" style="color: var(--danger);">❌ ${error.message}</div>`;
    }
}

export async function buscarFarmacias(query) {
    const container = document.getElementById('farmaciasContainer');
    if (!query.trim()) {
        cargarFarmacias();
        return;
    }
    
    try {
        const result = await getFarmaciasByCity(query);
        const farmacias = result.farmacias || [];
        
        if (farmacias.length === 0) {
            container.innerHTML = `<div class="loading">No se encontraron farmacias en "${query}"</div>`;
            return;
        }
        
        let html = `
            <table>
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Dirección</th>
                        <th>Ciudad</th>
                        <th>Teléfono</th>
                        <th>Licencia</th>
                        <th>Estado</th>
                    </tr>
                </thead>
                <tbody>
        `;
        
        farmacias.forEach(f => {
            html += `
                <tr>
                    <td><strong>${f.nombre_farmacia}</strong></td>
                    <td>${f.direccion || '-'}</td>
                    <td>${f.ciudad || '-'}</td>
                    <td>${f.telefono || '-'}</td>
                    <td>${f.numero_licencia || '-'}</td>
                    <td>
                        <span class="badge ${f.activo ? 'badge-success' : 'badge-danger'}">
                            ${f.activo ? 'Activo' : 'Inactivo'}
                        </span>
                    </td>
                </tr>
            `;
        });
        
        html += '</tbody></table>';
        container.innerHTML = html;
    } catch (error) {
        container.innerHTML = `<div class="loading" style="color: var(--danger);">❌ ${error.message}</div>`;
    }
}

// ============================================
// CREAR MEDICAMENTO
// ============================================

export async function crearMedicamento(data) {
    try {
        const result = await createMedicamento(data);
        showToast('✅ Medicamento creado exitosamente', 'success');
        cerrarModal('modalMedicamento');
        cargarMedicamentos();
        return result;
    } catch (error) {
        showToast('❌ ' + error.message, 'error');
        throw error;
    }
}

// ============================================
// ELIMINAR MEDICAMENTO (global)
// ============================================

window.eliminarMedicamento = async function(id) {
    if (!confirm('¿Estás seguro de desactivar este medicamento?')) return;
    try {
        await deleteMedicamento(id);
        showToast('✅ Medicamento desactivado', 'success');
        cargarMedicamentos();
    } catch (error) {
        showToast('❌ ' + error.message, 'error');
    }
};

window.editarMedicamento = function(id) {
    const medicamento = medicamentosData.find(m => m.id === id);
    if (!medicamento) return;
    
    showToast('🔧 Función de edición en desarrollo', 'info');
};

// ============================================
// INICIALIZAR EVENTOS
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    // NAVEGACIÓN
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const page = link.dataset.page;
            navegar(page);
            
            if (page === 'farmacias') cargarFarmacias();
            if (page === 'medicamentos') cargarMedicamentos();
            if (page === 'inicio') {
                cargarFarmacias();
                cargarMedicamentos();
            }
        });
    });

    // LOGIN
    document.getElementById('btnLogin').addEventListener('click', () => {
        abrirModal('modalLogin');
    });

    document.getElementById('closeLogin').addEventListener('click', () => {
        cerrarModal('modalLogin');
    });

    document.getElementById('formLogin').addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        await iniciarSesion(email, password);
        document.getElementById('formLogin').reset();
    });

    // REGISTRAR USUARIO
    document.getElementById('btnRegister').addEventListener('click', () => {
        abrirModal('modalRegister');
    });

    document.getElementById('closeRegister').addEventListener('click', () => {
        cerrarModal('modalRegister');
    });

    document.getElementById('formRegister').addEventListener('submit', async (e) => {
        e.preventDefault();
        const data = {
            nombre: document.getElementById('regUserNombre').value,
            email: document.getElementById('regUserEmail').value,
            password: document.getElementById('regUserPassword').value,
            telefono: document.getElementById('regUserTelefono').value || null
        };
        await registrarUsuario(data);
        document.getElementById('formRegister').reset();
    });

    // REGISTRAR FARMACIA
    document.getElementById('formRegistroFarmacia').addEventListener('submit', async (e) => {
        e.preventDefault();
        const data = {
            nombre: document.getElementById('regNombre').value,
            email: document.getElementById('regEmail').value,
            password: document.getElementById('regPassword').value,
            telefono: document.getElementById('regTelefono').value || null,
            nombre_farmacia: document.getElementById('regNombreFarmacia').value,
            direccion: document.getElementById('regDireccion').value,
            ciudad: document.getElementById('regCiudad').value,
            estado: document.getElementById('regEstado').value,
            telefono_farmacia: document.getElementById('regTelefonoFarmacia').value,
            numero_licencia: document.getElementById('regLicencia').value
        };
        await registrarFarmacia(data);
        document.getElementById('formRegistroFarmacia').reset();
        navegar('farmacias');
        cargarFarmacias();
    });

    // MEDICAMENTO - Modal
    document.getElementById('btnMostrarRegistroMedicamento').addEventListener('click', () => {
        if (!isAuthenticated()) {
            showToast('⚠️ Debes iniciar sesión como farmacia', 'warning');
            abrirModal('modalLogin');
            return;
        }
        if (!isFarmacia()) {
            showToast('⚠️ Solo farmacias pueden agregar medicamentos', 'warning');
            return;
        }
        abrirModal('modalMedicamento');
    });

    document.getElementById('closeMedicamento').addEventListener('click', () => {
        cerrarModal('modalMedicamento');
    });

    document.getElementById('formMedicamento').addEventListener('submit', async (e) => {
        e.preventDefault();
        const data = {
            nombre: document.getElementById('medNombre').value,
            nombre_generico: document.getElementById('medGenerico').value || null,
            marca: document.getElementById('medMarca').value || null,
            cantidad: parseInt(document.getElementById('medCantidad').value) || 0,
            precio: parseFloat(document.getElementById('medPrecio').value) || 0,
            numero_lote: document.getElementById('medLote').value,
            fecha_caducidad: document.getElementById('medCaducidad').value,
            categoria: document.getElementById('medCategoria').value || null,
            requiere_receta: document.getElementById('medReceta').checked
        };
        await crearMedicamento(data);
        document.getElementById('formMedicamento').reset();
    });

    // BÚSQUEDAS
    document.getElementById('btnBuscarMedicamento').addEventListener('click', () => {
        const query = document.getElementById('searchMedicamento').value;
        buscarMedicamentos(query);
    });

    document.getElementById('searchMedicamento').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const query = document.getElementById('searchMedicamento').value;
            buscarMedicamentos(query);
        }
    });

    document.getElementById('btnBuscarFarmacia').addEventListener('click', () => {
        const query = document.getElementById('searchFarmacia').value;
        buscarFarmacias(query);
    });

    document.getElementById('searchFarmacia').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const query = document.getElementById('searchFarmacia').value;
            buscarFarmacias(query);
        }
    });

    // CERRAR SESIÓN
    document.getElementById('btnLogout').addEventListener('click', cerrarSesion);

    // MOSTRAR REGISTRO FARMACIA DESDE BOTÓN
    document.getElementById('btnMostrarRegistroFarmacia').addEventListener('click', () => {
        navegar('registro-farmacia');
    });

    // Cerrar modales al hacer clic fuera
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
            }
        });
    });

    // INICIALIZAR
    actualizarUIUsuario();
    cargarFarmacias();
    cargarMedicamentos();
});