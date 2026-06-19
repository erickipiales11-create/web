import { 
    getMedicamentos, 
    searchMedicamentos, 
    createMedicamento, 
    updateMedicamento, 
    updateStock, 
    deleteMedicamento,
    getMedicamentosPorVencer,
    getMedicamentosBajoStock
} from './api.js';
import { showToast } from './app.js';

// ============================================
// FUNCIONES DE MEDICAMENTOS
// ============================================

export async function listarMedicamentos() {
    try {
        const result = await getMedicamentos();
        return result.medicamentos || [];
    } catch (error) {
        showToast('❌ Error al cargar medicamentos: ' + error.message, 'error');
        return [];
    }
}

export async function buscarMedicamentos(query) {
    try {
        const result = await searchMedicamentos(query);
        return result.medicamentos || [];
    } catch (error) {
        showToast('❌ Error al buscar medicamentos: ' + error.message, 'error');
        return [];
    }
}

export async function agregarMedicamento(data) {
    try {
        const result = await createMedicamento(data);
        showToast('✅ Medicamento agregado correctamente', 'success');
        return result;
    } catch (error) {
        showToast('❌ Error al agregar medicamento: ' + error.message, 'error');
        throw error;
    }
}

export async function editarMedicamento(id, data) {
    try {
        const result = await updateMedicamento(id, data);
        showToast('✅ Medicamento actualizado correctamente', 'success');
        return result;
    } catch (error) {
        showToast('❌ Error al actualizar medicamento: ' + error.message, 'error');
        throw error;
    }
}

export async function actualizarStockMedicamento(id, cantidad) {
    try {
        const result = await updateStock(id, cantidad);
        showToast('✅ Stock actualizado correctamente', 'success');
        return result;
    } catch (error) {
        showToast('❌ Error al actualizar stock: ' + error.message, 'error');
        throw error;
    }
}

export async function eliminarMedicamento(id) {
    try {
        const result = await deleteMedicamento(id);
        showToast('✅ Medicamento desactivado correctamente', 'success');
        return result;
    } catch (error) {
        showToast('❌ Error al eliminar medicamento: ' + error.message, 'error');
        throw error;
    }
}

export async function listarPorVencer() {
    try {
        const result = await getMedicamentosPorVencer();
        return result.medicamentos || [];
    } catch (error) {
        showToast('❌ Error al cargar medicamentos por vencer: ' + error.message, 'error');
        return [];
    }
}

export async function listarBajoStock() {
    try {
        const result = await getMedicamentosBajoStock();
        return result.medicamentos || [];
    } catch (error) {
        showToast('❌ Error al cargar medicamentos con bajo stock: ' + error.message, 'error');
        return [];
    }
}