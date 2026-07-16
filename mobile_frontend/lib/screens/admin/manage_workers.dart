import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../providers/auth_provider.dart';
import '../../providers/pharmacy_provider.dart';
import '../../models/user.dart';
import '../../models/pharmacy.dart';
import '../../widgets/loading_indicator.dart';
import '../auth/register_screen.dart';

class ManageWorkers extends StatefulWidget {
  const ManageWorkers({super.key});

  @override
  State<ManageWorkers> createState() => _ManageWorkersState();
}

class _ManageWorkersState extends State<ManageWorkers> {
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      context.read<AuthProvider>().loadUsers();
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
              builder: (context) => const RegisterScreen(),
            ),
          ).then((_) {
            context.read<AuthProvider>().loadUsers();
          });
        },
        backgroundColor: Colors.blue,
        foregroundColor: Colors.white,
        child: const Icon(Icons.person_add),
      ),
      body: Consumer<AuthProvider>(
        builder: (context, authProvider, child) {
          if (authProvider.isLoading) {
            return const LoadingIndicator();
          }

          final workers = authProvider.users.where((u) => u.role == 'worker').toList();

          if (workers.isEmpty) {
            return const Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(Icons.people, size: 80, color: Colors.grey),
                  SizedBox(height: 16),
                  Text(
                    'No hay trabajadores registrados',
                    style: TextStyle(fontSize: 16, color: Colors.grey),
                  ),
                  SizedBox(height: 8),
                  Text(
                    'Toca el botón + para agregar uno',
                    style: TextStyle(fontSize: 14, color: Colors.grey),
                  ),
                ],
              ),
            );
          }

          return RefreshIndicator(
            onRefresh: () async {
              await authProvider.loadUsers();
              await context.read<PharmacyProvider>().loadPharmacies();
            },
            child: ListView.builder(
              padding: const EdgeInsets.all(16),
              itemCount: workers.length,
              itemBuilder: (context, index) {
                final worker = workers[index];
                return _buildWorkerCard(worker);
              },
            ),
          );
        },
      ),
    );
  }

  Widget _buildWorkerCard(User worker) {
    final pharmacyProvider = context.watch<PharmacyProvider>();
    final pharmacies = pharmacyProvider.pharmacies;

    return Card(
      elevation: 2,
      margin: const EdgeInsets.only(bottom: 12),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                CircleAvatar(
                  backgroundColor: Colors.orange.withOpacity(0.1),
                  child: const Icon(Icons.person, color: Colors.orange),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        worker.name,
                        style: const TextStyle(
                          fontWeight: FontWeight.bold,
                          fontSize: 16,
                        ),
                      ),
                      Text(
                        worker.email,
                        style: const TextStyle(
                          fontSize: 12,
                          color: Colors.grey,
                        ),
                      ),
                    ],
                  ),
                ),
                const Chip(
                  label: Text('Trabajador'),
                  backgroundColor: Colors.orange,
                  labelStyle: TextStyle(color: Colors.white),
                ),
              ],
            ),
            const SizedBox(height: 12),
            const Divider(),
            const SizedBox(height: 12),
            Row(
              children: [
                const Text(
                  'Farmacia: ',
                  style: TextStyle(fontWeight: FontWeight.bold),
                ),
                Expanded(
                  child: DropdownButton<int>(
                    value: worker.pharmacyId,
                    isExpanded: true,
                    hint: const Text('Asignar farmacia'),
                    items: [
                      const DropdownMenuItem<int>(
                        value: null,
                        child: Text('Sin asignar'),
                      ),
                      ...pharmacies.map((pharmacy) {
                        return DropdownMenuItem<int>(
                          value: pharmacy.id,
                          child: Text(pharmacy.name),
                        );
                      }),
                    ],
                    onChanged: (pharmacyId) async {
                      final success = await context.read<AuthProvider>().assignPharmacy(
                        worker.id,
                        pharmacyId!,
                      );
                      if (success && mounted) {
                        ScaffoldMessenger.of(context).showSnackBar(
                          const SnackBar(
                            content: Text('Farmacia asignada correctamente'),
                            backgroundColor: Colors.green,
                          ),
                        );
                        context.read<AuthProvider>().loadUsers();
                      }
                    },
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}