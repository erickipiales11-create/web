class Paciente {
    constructor(id, nombre, cedula, telefono, direccion, fechaNacimiento) {
        this.id = id;
        this.nombre = nombre;
        this.cedula = cedula;
        this.telefono = telefono;
        this.direccion = direccion;
        this.fechaNacimiento = fechaNacimiento;
    }
}

module.exports = Paciente;