export interface Movimiento {
  id?: number;
  medicamentoId: number;
  farmaciaId: number;
  tipo: 'entrada' | 'salida';
  cantidad: number;
  fecha: string;
  observacion?: string;
  createdAt?: string;
  updatedAt?: string;
}
