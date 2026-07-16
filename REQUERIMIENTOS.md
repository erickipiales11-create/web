# ANÁLISIS DE REQUERIMIENTOS - SISTEMA DE FARMACIA

## 1. OBJETIVO DEL SISTEMA
Desarrollar una aplicación móvil para la gestión de farmacias que permita:
- Administrar farmacias, medicamentos y usuarios
- Gestionar pedidos con control de recetas médicas
- Asignar roles y permisos específicos
- Buscar medicamentos por componente activo

## 2. ACTORES DEL SISTEMA

### 2.1 Administrador
| ID | Requerimiento | Prioridad |
|----|--------------|-----------|
| ADM-01 | Iniciar sesión en el sistema | Alta |
| ADM-02 | Crear, editar y eliminar farmacias | Alta |
| ADM-03 | Ver lista de todos los trabajadores | Alta |
| ADM-04 | Asignar farmacia a un trabajador | Alta |
| ADM-05 | Registrar nuevos trabajadores | Alta |
| ADM-06 | Ver todos los medicamentos | Media |
| ADM-07 | Ver reportes del sistema | Baja |

### 2.2 Trabajador de Farmacia
| ID | Requerimiento | Prioridad |
|----|--------------|-----------|
| WRK-01 | Iniciar sesión en el sistema | Alta |
| WRK-02 | Ver solo su farmacia asignada | Alta |
| WRK-03 | Agregar nuevos medicamentos | Alta |
| WRK-04 | Editar medicamentos existentes | Alta |
| WRK-05 | Eliminar medicamentos | Alta |
| WRK-06 | Ver inventario de su farmacia | Alta |
| WRK-07 | Actualizar stock de medicamentos | Alta |
| WRK-08 | Gestionar órdenes de pacientes | Alta |

### 2.3 Paciente
| ID | Requerimiento | Prioridad |
|----|--------------|-----------|
| PAT-01 | Registrarse en el sistema | Alta |
| PAT-02 | Iniciar sesión en el sistema | Alta |
| PAT-03 | Buscar medicamentos por nombre | Alta |
| PAT-04 | Buscar medicamentos por componente activo | Alta |
| PAT-05 | Ver medicamentos equivalentes | Alta |
| PAT-06 | Realizar pedido de medicamento | Alta |
| PAT-07 | Subir imagen de receta médica | Alta |
| PAT-08 | Ver historial de pedidos | Alta |
| PAT-09 | Cancelar pedido pendiente | Media |
| PAT-10 | Seleccionar farmacia para retiro | Alta |

## 3. REQUERIMIENTOS FUNCIONALES

### 3.1 Autenticación
- Registro de usuarios con email y contraseña
- Inicio de sesión con JWT
- Roles: admin, worker, patient

### 3.2 Gestión de Farmacias (Solo Admin)
- Crear farmacia (nombre, dirección, teléfono, ubicación)
- Editar datos de farmacia
- Eliminar farmacia (soft delete)
- Listar todas las farmacias

### 3.3 Gestión de Usuarios (Solo Admin)
- Crear trabajadores
- Asignar farmacia a trabajador
- Listar todos los trabajadores
- Desactivar usuarios

### 3.4 Gestión de Medicamentos
- Crear medicamento (nombre, categoría, precio, stock)
- Editar medicamento
- Eliminar medicamento
- Ver medicamentos por farmacia
- Buscar por componente activo
- Mostrar medicamentos equivalentes

### 3.5 Gestión de Pedidos
- Paciente realiza pedido
- Subir imagen de receta si requiere
- Trabajador actualiza estado del pedido
- Paciente ve historial de pedidos
- Paciente cancela pedido

## 4. REQUERIMIENTOS NO FUNCIONALES

| ID | Requerimiento | Descripción |
|----|--------------|-------------|
| RNF-01 | Rendimiento | Tiempo de respuesta < 2 segundos |
| RNF-02 | Usabilidad | Interfaz intuitiva y consistente |
| RNF-03 | Seguridad | Autenticación JWT, contraseñas encriptadas |
| RNF-04 | Disponibilidad | 99.9% de uptime |
| RNF-05 | Escalabilidad | Soporte para múltiples farmacias |

## 5. TECNOLOGÍAS UTILIZADAS

- **Frontend**: Flutter (Dart)
- **Backend**: Node.js + Express
- **Base de datos**: PostgreSQL
- **Autenticación**: JWT
- **Gestión de estado**: Provider
- **Almacenamiento local**: SharedPreferences