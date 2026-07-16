import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../providers/pharmacy_provider.dart';
import '../../models/pharmacy.dart';
import '../../widgets/loading_indicator.dart';
import 'pharmacy_form.dart';

class ManagePharmacies extends StatefulWidget {
  const ManagePharmacies({super.key});

  @override
  State<ManagePharmacies> createState() => _ManagePharmaciesState();
}

class _ManagePharmaciesState extends State<ManagePharmacies> {
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      context.read<PharmacyProvider>().loadPharmacies();
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      floatingActionButton: FloatingActionButton(
        onPressed: () {
          Navigator.push(
            context,
            MaterialPageRoute(
              builder: (context) => const PharmacyForm(),
            ),
          ).then((_) {
            context.read<PharmacyProvider>().loadPharmacies();
          });
        },
        backgroundColor: Colors.blue,
        foregroundColor: Colors.white,
        child: const Icon(Icons.add),
      ),
      body: Consumer<PharmacyProvider>(
        builder: (context, provider, child) {
          if (provider.isLoading) {
            return const LoadingIndicator();
          }

          if (provider.pharmacies.isEmpty) {
            return const Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(Icons.store, size: 80, color: Colors.grey),
                  SizedBox(height: 16),
                  Text(
                    'No hay farmacias registradas',
                    style: TextStyle(fontSize: 16, color: Colors.grey),
                  ),
                  SizedBox(height: 8),
                  Text(
                    'Toca el botón + para agregar una',
                    style: TextStyle(fontSize: 14, color: Colors.grey),
                  ),
                ],
              ),
            );
          }

          return RefreshIndicator(
            onRefresh: () => provider.loadPharmacies(),
            child: ListView.builder(
              padding: const EdgeInsets.all(16),
              itemCount: provider.pharmacies.length,
              itemBuilder: (context, index) {
                final pharmacy = provider.pharmacies[index];
                return _buildPharmacyCard(pharmacy);
              },
            ),
          );
        },
      ),
    );
  }

  Widget _buildPharmacyCard(Pharmacy pharmacy) {
    return Card(
      elevation: 2,
      margin: const EdgeInsets.only(bottom: 12),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      child: ListTile(
        contentPadding: const EdgeInsets.all(16),
        leading: CircleAvatar(
          backgroundColor: Colors.blue.withOpacity(0.1),
          child: const Icon(Icons.store, color: Colors.blue),
        ),
        title: Text(
          pharmacy.name,
          style: const TextStyle(fontWeight: FontWeight.bold),
        ),
        subtitle: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const SizedBox(height: 4),
            Row(
              children: [
                const Icon(Icons.location_on, size: 16, color: Colors.grey),
                const SizedBox(width: 4),
                Expanded(
                  child: Text(
                    pharmacy.address,
                    style: const TextStyle(fontSize: 12, color: Colors.grey),
                  ),
                ),
              ],
            ),
            Row(
              children: [
                const Icon(Icons.phone, size: 16, color: Colors.grey),
                const SizedBox(width: 4),
                Text(
                  pharmacy.phone,
                  style: const TextStyle(fontSize: 12, color: Colors.grey),
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
              _editPharmacy(pharmacy);
            } else if (value == 'delete') {
              _deletePharmacy(pharmacy);
            }
          },
        ),
      ),
    );
  }

  void _editPharmacy(Pharmacy pharmacy) {
    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (context) => PharmacyForm(pharmacy: pharmacy),
      ),
    ).then((_) {
      context.read<PharmacyProvider>().loadPharmacies();
    });
  }

  void _deletePharmacy(Pharmacy pharmacy) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Eliminar Farmacia'),
        content: Text('¿Estás seguro de eliminar "${pharmacy.name}"?'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Cancelar'),
          ),
          TextButton(
            onPressed: () async {
              Navigator.pop(context);
              final provider = context.read<PharmacyProvider>();
              final success = await provider.deletePharmacy(pharmacy.id);
              if (success && mounted) {
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(
                    content: Text('Farmacia eliminada correctamente'),
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