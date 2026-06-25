export interface Prescripcion {
  id?: number;
  medicamentoId: number;
  paciente: string;
  dosis: string;
  frecuencia: string;
  duracion: string;
  fechaPrescripcion: string;
  medico: string;
  createdAt?: string;
  updatedAt?: string;
}
