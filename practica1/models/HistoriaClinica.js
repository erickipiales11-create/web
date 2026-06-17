class HistoriaClinica {
    constructor(id, pacienteId, diagnostico, tratamiento, observaciones) {
        this.id = id;
        this.pacienteId = pacienteId;
        this.diagnostico = diagnostico;
        this.tratamiento = tratamiento;
        this.observaciones = observaciones;
    }
}

module.exports = HistoriaClinica;