import { 
    login as apiLogin, 
    register as apiRegister, 
    registerPharmacy as apiRegisterPharmacy,
    setToken, 
    removeToken, 
    setUsuario, 
    removeUsuario,
    getUsuario 
} from './api.js';
import { showToast } from './app.js';

// ============================================
// FUNCIONES DE AUTENTICACIÓN
// ============================================

// Iniciar sesión
export const iniciarSesion = async (email, password) => {
    try {
        const result = await apiLogin(email, password);
        
        setToken(result.token);
        setUsuario(result.usuario);
        
        showToast('✅ ' + result.mensaje, 'success');
        actualizarUIUsuario();
        cerrarModal('modalLogin');
        
        return result;
    } catch (error) {
        showToast('❌ ' + error.message, 'error');
        throw error;
    }
};

// Registrar usuario
export const registrarUsuario = async (data) => {
    try {
        const result = await apiRegister(data);
        showToast('✅ ' + result.mensaje, 'success');
        cerrarModal('modalRegister');
        return result;
    } catch (error) {
        showToast('❌ ' + error.message, 'error');
        throw error;
    }
};

// Registrar farmacia
export const registrarFarmacia = async (data) => {
    try {
        const result = await apiRegisterPharmacy(data);
        showToast('✅ ' + result.mensaje, 'success');
        return result;
    } catch (error) {
        showToast('❌ ' + error.message, 'error');
        throw error;
    }
};

// Cerrar sesión
export const cerrarSesion = () => {
    removeToken();
    removeUsuario();
    actualizarUIUsuario();
    showToast('✅ Sesión cerrada correctamente', 'info');
};

// Verificar si el usuario está autenticado
export const isAuthenticated = () => {
    return !!getToken();
};

// Obtener usuario actual
export const getCurrentUser = () => {
    return getUsuario();
};

// Verificar si es farmacia
export const isFarmacia = () => {
    const user = getCurrentUser();
    return user && user.rol === 'farmacia';
};

// ============================================
// ACTUALIZAR UI SEGÚN AUTENTICACIÓN
// ============================================

export const actualizarUIUsuario = () => {
    const navAuth = document.getElementById('navAuth');
    const navUser = document.getElementById('navUser');
    const userName = document.getElementById('userName');
    const user = getCurrentUser();

    if (isAuthenticated() && user) {
        navAuth.style.display = 'none';
        navUser.style.display = 'flex';
        userName.textContent = user.nombre || user.email;
        
        // Mostrar/ocultar opciones según rol
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            const page = link.dataset.page;
            if (page === 'registro-farmacia') {
                link.style.display = user.rol === 'farmacia' ? 'block' : 'none';
            }
        });
    } else {
        navAuth.style.display = 'flex';
        navUser.style.display = 'none';
    }
};