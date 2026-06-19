// ============================================
// CONFIGURACIÓN DE LA API
// ============================================

const API_URL = 'http://localhost:3000/api';

// Obtener token del localStorage
export const getToken = () => localStorage.getItem('token');

// Guardar token en localStorage
export const setToken = (token) => localStorage.setItem('token', token);

// Eliminar token
export const removeToken = () => localStorage.removeItem('token');

// Obtener usuario del localStorage
export const getUsuario = () => {
    try {
        const user = localStorage.getItem('usuario');
        return user ? JSON.parse(user) : null;
    } catch {
        return null;
    }
};

// Guardar usuario en localStorage
export const setUsuario = (usuario) => {
    localStorage.setItem('usuario', JSON.stringify(usuario));
};

// Eliminar usuario
export const removeUsuario = () => localStorage.removeItem('usuario');

// Función para hacer peticiones a la API
export const apiRequest = async (endpoint, method = 'GET', data = null, auth = true) => {
    const url = `${API_URL}${endpoint}`;
    const headers = {
        'Content-Type': 'application/json',
    };

    if (auth) {
        const token = getToken();
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
    }

    const config = {
        method,
        headers,
    };

    if (data && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
        config.body = JSON.stringify(data);
    }

    try {
        const response = await fetch(url, config);
        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.mensaje || result.error || 'Error en la petición');
        }

        return result;
    } catch (error) {
        throw error;
    }
};

// ============================================
// FUNCIONES ESPECÍFICAS DE LA API
// ============================================

// AUTH
export const login = async (email, password) => {
    return apiRequest('/auth/login', 'POST', { email, password }, false);
};

export const register = async (data) => {
    return apiRequest('/auth/registrar', 'POST', data, false);
};

export const registerPharmacy = async (data) => {
    return apiRequest('/auth/registrar-farmacia', 'POST', data, false);
};

export const getProfile = async () => {
    return apiRequest('/auth/perfil', 'GET');
};

// FARMACIAS
export const getFarmacias = async () => {
    return apiRequest('/farmacias', 'GET', null, false);
};

export const getFarmaciaById = async (id) => {
    return apiRequest(`/farmacias/${id}`, 'GET', null, false);
};

export const getFarmaciasByCity = async (ciudad) => {
    return apiRequest(`/farmacias/ciudad/${ciudad}`, 'GET', null, false);
};

export const updateFarmacia = async (data) => {
    return apiRequest('/farmacias/actualizar', 'PUT', data);
};

// MEDICAMENTOS
export const getMedicamentos = async () => {
    return apiRequest('/medicamentos', 'GET', null, false);
};

export const searchMedicamentos = async (query) => {
    return apiRequest(`/medicamentos/buscar?query=${query}`, 'GET', null, false);
};

export const getMisMedicamentos = async () => {
    return apiRequest('/medicamentos/mis-medicamentos', 'GET');
};

export const createMedicamento = async (data) => {
    return apiRequest('/medicamentos', 'POST', data);
};

export const updateMedicamento = async (id, data) => {
    return apiRequest(`/medicamentos/${id}`, 'PUT', data);
};

export const updateStock = async (id, cantidad) => {
    return apiRequest(`/medicamentos/${id}/stock`, 'PUT', { cantidad });
};

export const deleteMedicamento = async (id) => {
    return apiRequest(`/medicamentos/${id}`, 'DELETE');
};

export const getMedicamentosPorVencer = async () => {
    return apiRequest('/medicamentos/por-vencer', 'GET');
};

export const getMedicamentosBajoStock = async () => {
    return apiRequest('/medicamentos/bajo-stock', 'GET');
};