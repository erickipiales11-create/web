class Cita {
    constructor(id, fecha, hora, pacienteId, medicoId, estado) {
        this.id = id;
        this.fecha = fecha;
        this.hora = hora;
        this.pacienteId = pacienteId;
        this.medicoId = medicoId;
        this.estado = estado;
    }
}

module.exports = Cita;