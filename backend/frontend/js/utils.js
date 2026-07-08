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

export function abrirModal(id) {
    const modal = document.getElementById(id);
    if (modal) modal.classList.add('active');
}

export function cerrarModal(id) {
    const modal = document.getElementById(id);
    if (modal) modal.classList.remove('active');
}