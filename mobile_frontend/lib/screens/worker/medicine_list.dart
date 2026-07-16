import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../providers/medicine_provider.dart';
import '../../providers/pharmacy_provider.dart';
import '../../models/medicine.dart';
import '../../widgets/loading_indicator.dart';
import 'medicine_form.dart';

class MedicineList extends StatefulWidget {
  const MedicineList({super.key});

  @override
  State<MedicineList> createState() => _MedicineListState();
}

class _MedicineListState extends State<MedicineList> {
  String _searchQuery = '';
  int? _selectedCategoryId;
  int? _selectedPharmacyId;

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      context.read<MedicineProvider>().loadMedicines();
      context.read<PharmacyProvider>().loadPharmacies();
    });
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        _buildFilters(),
        Expanded(
          child: Consumer<MedicineProvider>(
            builder: (context, provider, child) {
              if (provider.isLoading) {
                return const LoadingIndicator();
              }

              var medicines = provider.medicines;
              
              // Aplicar filtros
              if (_searchQuery.isNotEmpty) {
                medicines = medicines.where((m) =>
                  m.name.toLowerCase().contains(_searchQuery.toLowerCase()) ||
                  (m.activeIngredient?.toLowerCase().contains(_searchQuery.toLowerCase()) ?? false)
                ).toList();
              }

              if (_selectedCategoryId != null) {
                medicines = medicines.where((m) => m.categoryId == _selectedCategoryId).toList();
              }

              if (_selectedPharmacyId != null) {
                medicines = medicines.where((m) => m.pharmacyId == _selectedPharmacyId).toList();
              }

              if (medicines.isEmpty) {
                return const Center(
                  child: Text('No hay medicamentos disponibles'),
                );
              }

              return RefreshIndicator(
                onRefresh: () => provider.loadMedicines(),
                child: ListView.builder(
                  padding: const EdgeInsets.all(16),
                  itemCount: medicines.length,
                  itemBuilder: (context, index) {
                    final medicine = medicines[index];
                    return _buildMedicineCard(medicine);
                  },
                ),
              );
            },
          ),
        ),
      ],
    );
  }

  Widget _buildFilters() {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        boxShadow: [
          BoxShadow(
            color: Colors.grey.withOpacity(0.1),
            spreadRadius: 1,
            blurRadius: 4,
          ),
        ],
      ),
      child: Column(
        children: [
          TextField(
            decoration: InputDecoration(
              hintText: 'Buscar medicamento...',
              prefixIcon: const Icon(Icons.search),
              border: OutlineInputBorder(
                borderRadius: BorderRadius.circular(12),
              ),
              filled: true,
              fillColor: Colors.grey[50],
            ),
            onChanged: (value) {
              setState(() {
                _searchQuery = value;
              });
            },
          ),
          const SizedBox(height: 12),
          Row(
            children: [
              Expanded(
                child: _buildCategoryFilter(),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: _buildPharmacyFilter(),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildCategoryFilter() {
    return DropdownButtonFormField<int>(
      value: _selectedCategoryId,
      decoration: InputDecoration(
        labelText: 'Categoría',
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
        ),
        filled: true,
        fillColor: Colors.grey[50],
      ),
      items: [
        const DropdownMenuItem<int>(
          value: null,
          child: Text('Todas'),
        ),
        // Aquí irían las categorías dinámicas
      ],
      onChanged: (value) {
        setState(() {
          _selectedCategoryId = value;
        });
      },
    );
  }

  Widget _buildPharmacyFilter() {
    final pharmacyProvider = context.watch<PharmacyProvider>();
    return DropdownButtonFormField<int>(
      value: _selectedPharmacyId,
      decoration: InputDecoration(
        labelText: 'Farmacia',
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
        ),
        filled: true,
        fillColor: Colors.grey[50],
      ),
      items: [
        const DropdownMenuItem<int>(
          value: null,
          child: Text('Todas'),
        ),
        ...pharmacyProvider.pharmacies.map((p) {
          return DropdownMenuItem<int>(
            value: p.id,
            child: Text(p.name),
          );
        }),
      ],
      onChanged: (value) {
        setState(() {
          _selectedPharmacyId = value;
        });
      },
    );
  }

  Widget _buildMedicineCard(Medicine medicine) {
    return Card(
      elevation: 2,
      margin: const EdgeInsets.only(bottom: 12),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      child: ListTile(
        contentPadding: const EdgeInsets.all(16),
        leading: Container(
          width: 50,
          height: 50,
          decoration: BoxDecoration(
            color: medicine.requiresPrescription 
              ? Colors.red.withOpacity(0.1)
              : Colors.green.withOpacity(0.1),
            borderRadius: BorderRadius.circular(8),
          ),
          child: Icon(
            medicine.requiresPrescription 
              ? Icons.medical_information
              : Icons.medication,
            color: medicine.requiresPrescription ? Colors.red : Colors.green,
          ),
        ),
        title: Text(
          medicine.name,
          style: const TextStyle(fontWeight: FontWeight.bold),
        ),
        subtitle: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const SizedBox(height: 4),
            if (medicine.activeIngredient != null)
              Text(
                'Componente: ${medicine.activeIngredient}',
                style: const TextStyle(fontSize: 12, color: Colors.grey),
              ),
            if (medicine.gramaje != null)
              Text(
                'Gramaje: ${medicine.gramaje}',
                style: const TextStyle(fontSize: 12, color: Colors.grey),
              ),
            Row(
              children: [
                const Icon(Icons.attach_money, size: 16, color: Colors.grey),
                Text(
                  '\$${medicine.price.toStringAsFixed(2)}',
                  style: const TextStyle(
                    fontWeight: FontWeight.bold,
                    color: Colors.green,
                  ),
                ),
                const SizedBox(width: 16),
                const Icon(Icons.inventory, size: 16, color: Colors.grey),
                Text(
                  'Stock: ${medicine.stock}',
                  style: TextStyle(
                    color: medicine.stock < 10 ? Colors.red : Colors.grey,
                  ),
                ),
                const SizedBox(width: 16),
                if (medicine.requiresPrescription)
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                    decoration: BoxDecoration(
                      color: Colors.red.withOpacity(0.1),
                      borderRadius: BorderRadius.circular(4),
                    ),
                    child: const Text(
                      'Requiere Receta',
                      style: TextStyle(
                        fontSize: 10,
                        color: Colors.red,
                      ),
                    ),
                  ),
              ],
            ),
          ],
        ),
        trailing: PopupMenuButton(
          itemBuilder: (context) => [
            const PopupMenuItem(
              value: 'edit',
              child: Row(
                children: [
                  Icon(Icons.edit, size: 20),
                  SizedBox(width: 8),
                  Text('Editar'),
                ],
              ),
            ),
            const PopupMenuItem(
              value: 'delete',
              child: Row(
                children: [
                  Icon(Icons.delete, size: 20, color: Colors.red),
                  SizedBox(width: 8),
                  Text('Eliminar', style: TextStyle(color: Colors.red)),
                ],
              ),
            ),
          ],
          onSelected: (value) {
            if (value == 'edit') {
              Navigator.push(
                context,
                MaterialPageRoute(
                  builder: (context) => MedicineForm(medicine: medicine),
                ),
              ).then((_) {
                context.read<MedicineProvider>().loadMedicines();
              });
            } else if (value == 'delete') {
              _deleteMedicine(medicine);
            }
          },
        ),
      ),
    );
  }

  void _deleteMedicine(Medicine medicine) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Eliminar Medicamento'),
        content: Text('¿Estás seguro de eliminar "${medicine.name}"?'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Cancelar'),
          ),
          TextButton(
            onPressed: () async {
              Navigator.pop(context);
              final provider = context.read<MedicineProvider>();
              final success = await provider.deleteMedicine(medicine.id);
              if (success && mounted) {
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(
                    content: Text('Medicamento eliminado correctamente'),
                    backgroundColor: Colors.green,
                  ),
                );
              }
            },
            child: const Text('Eliminar', style: TextStyle(color: Colors.red)),
          ),
        ],
      ),
    );
  }
}