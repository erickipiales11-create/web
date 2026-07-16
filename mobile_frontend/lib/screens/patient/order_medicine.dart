import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../providers/medicine_provider.dart';
import '../../providers/pharmacy_provider.dart';
import '../../providers/order_provider.dart';
import '../../models/medicine.dart';
import '../../widgets/loading_indicator.dart';

class OrderMedicine extends StatefulWidget {
  const OrderMedicine({super.key});

  @override
  State<OrderMedicine> createState() => _OrderMedicineState();
}

class _OrderMedicineState extends State<OrderMedicine> {
  String _searchQuery = '';
  int? _selectedPharmacyId;
  Medicine? _selectedMedicine;
  int _quantity = 1;

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
    return Padding(
      padding: const EdgeInsets.all(16),
      child: Column(
        children: [
          _buildSearchBar(),
          const SizedBox(height: 16),
          _buildFilters(),
          const SizedBox(height: 16),
          Expanded(
            child: _buildMedicineList(),
          ),
        ],
      ),
    );
  }

  Widget _buildSearchBar() {
    return TextField(
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
    );
  }

  Widget _buildFilters() {
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
          child: Text('Todas las farmacias'),
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

  Widget _buildMedicineList() {
    final medicineProvider = context.watch<MedicineProvider>();
    final pharmacyProvider = context.watch<PharmacyProvider>();

    if (medicineProvider.isLoading || pharmacyProvider.isLoading) {
      return const LoadingIndicator();
    }

    var medicines = medicineProvider.medicines;

    if (_searchQuery.isNotEmpty) {
      medicines = medicines.where((m) =>
        m.name.toLowerCase().contains(_searchQuery.toLowerCase()) ||
        (m.activeIngredient?.toLowerCase().contains(_searchQuery.toLowerCase()) ?? false)
      ).toList();
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
      onRefresh: () => medicineProvider.loadMedicines(),
      child: ListView.builder(
        itemCount: medicines.length,
        itemBuilder: (context, index) {
          final medicine = medicines[index];
          return _buildMedicineCard(medicine);
        },
      ),
    );
  }

  Widget _buildMedicineCard(Medicine medicine) {
    final pharmacy = context.read<PharmacyProvider>().getPharmacy(medicine.pharmacyId);

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
            if (pharmacy != null)
              Text(
                'Farmacia: ${pharmacy.name}',
                style: const TextStyle(fontSize: 12, color: Colors.blue),
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
                if (medicine.requiresPrescription) ...[
                  const SizedBox(width: 16),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                    decoration: BoxDecoration(
                      color: Colors.red.withOpacity(0.1),
                      borderRadius: BorderRadius.circular(4),
                    ),
                    child: const Text(
                      'Receta',
                      style: TextStyle(
                        fontSize: 10,
                        color: Colors.red,
                      ),
                    ),
                  ),
                ],
              ],
            ),
          ],
        ),
        trailing: medicine.stock > 0
            ? IconButton(
                icon: const Icon(Icons.add_shopping_cart, color: Colors.purple),
                onPressed: () => _showOrderDialog(medicine),
              )
            : const Icon(Icons.shopping_cart_disabled, color: Colors.grey),
      ),
    );
  }

  void _showOrderDialog(Medicine medicine) {
    _selectedMedicine = medicine;
    _quantity = 1;

    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Confirmar Pedido'),
        content: StatefulBuilder(
          builder: (context, setState) {
            return Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'Medicamento: ${medicine.name}',
                  style: const TextStyle(fontWeight: FontWeight.bold),
                ),
                const SizedBox(height: 8),
                Text('Precio: \$${medicine.price.toStringAsFixed(2)}'),
                const SizedBox(height: 16),
                Row(
                  children: [
                    const Text('Cantidad:'),
                    const SizedBox(width: 16),
                    IconButton(
                      icon: const Icon(Icons.remove),
                      onPressed: _quantity > 1
                          ? () {
                              setState(() {
                                _quantity--;
                              });
                            }
                          : null,
                    ),
                    Text(
                      '$_quantity',
                      style: const TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    IconButton(
                      icon: const Icon(Icons.add),
                      onPressed: _quantity < medicine.stock
                          ? () {
                              setState(() {
                                _quantity++;
                              });
                            }
                          : null,
                    ),
                  ],
                ),
                const SizedBox(height: 8),
                Text(
                  'Total: \$${(medicine.price * _quantity).toStringAsFixed(2)}',
                  style: const TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                    color: Colors.green,
                  ),
                ),
                if (medicine.requiresPrescription) ...[
                  const SizedBox(height: 16),
                  Container(
                    padding: const EdgeInsets.all(12),
                    decoration: BoxDecoration(
                      color: Colors.red.withOpacity(0.1),
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: const Row(
                      children: [
                        Icon(Icons.warning, color: Colors.red),
                        SizedBox(width: 8),
                        Expanded(
                          child: Text(
                            'Este medicamento requiere receta médica. Debes presentarla al retirar.',
                            style: TextStyle(fontSize: 12, color: Colors.red),
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ],
            );
          },
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Cancelar'),
          ),
          ElevatedButton(
            onPressed: () => _confirmOrder(medicine),
            style: ElevatedButton.styleFrom(
              backgroundColor: Colors.purple,
              foregroundColor: Colors.white,
            ),
            child: const Text('Confirmar Pedido'),
          ),
        ],
      ),
    );
  }

  void _confirmOrder(Medicine medicine) async {
    Navigator.pop(context);
    final orderProvider = context.read<OrderProvider>();
    
    final success = await orderProvider.createOrder({
      'pharmacy_id': medicine.pharmacyId,
      'medicine_id': medicine.id,
      'quantity': _quantity,
      'notes': '',
    });

    if (!mounted) return;

    if (success) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Pedido creado correctamente'),
          backgroundColor: Colors.green,
        ),
      );
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Error al crear el pedido'),
          backgroundColor: Colors.red,
        ),
      );
    }
  }
}