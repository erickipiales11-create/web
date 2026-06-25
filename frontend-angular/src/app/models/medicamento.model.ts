export interface Medicamento {
  id?: number;
  nombre: string;
  descripcion: string;
  precio: number;
  stock: number;
  categoriaId: number;
  farmaciaId: number;
  fechaVencimiento?: string;
  createdAt?: string;
  updatedAt?: string;
}
