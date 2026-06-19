import { getFarmacias, getFarmaciaById, updateFarmacia, getFarmaciasByCity } from './api.js';
import { showToast } from './app.js';

// ============================================
// FUNCIONES DE FARMACIAS
// ============================================

export async function listarFarmacias() {
    try {
        const result = await getFarmacias();
        return result.farmacias || [];
    } catch (error) {
        showToast('❌ Error al cargar farmacias: ' + error.message, 'error');
        return [];
    }
}

export async function obtenerFarmacia(id) {
    try {
        const result = await getFarmaciaById(id);
        return result;
    } catch (error) {
        showToast('❌ Error al obtener farmacia: ' + error.message, 'error');
        return null;
    }
}

export async function actualizarFarmacia(data) {
    try {
        const result = await updateFarmacia(data);
        showToast('✅ Farmacia actualizada correctamente', 'success');
        return result;
    } catch (error) {
        showToast('❌ Error al actualizar farmacia: ' + error.message, 'error');
        throw error;
    }
}

export async function buscarFarmaciasPorCiudad(ciudad) {
    try {
        const result = await getFarmaciasByCity(ciudad);
        return result.farmacias || [];
    } catch (error) {
        showToast('❌ Error al buscar farmacias: ' + error.message, 'error');
        return [];
    }
}