import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../models/medicine.dart';
import '../../providers/medicine_provider.dart';
import '../../providers/pharmacy_provider.dart';
import '../../widgets/loading_indicator.dart';
import '../../widgets/custom_dropdown.dart';

class MedicineForm extends StatefulWidget {
  final Medicine? medicine;
  const MedicineForm({super.key, this.medicine});

  @override
  State<MedicineForm> createState() => _MedicineFormState();
}

class _MedicineFormState extends State<MedicineForm> {
  final _formKey = GlobalKey<FormState>();
  final _nameController = TextEditingController();
  final _descriptionController = TextEditingController();
  final _priceController = TextEditingController();
  final _stockController = TextEditingController();
  final _gramajeController = TextEditingController();
  final _activeIngredientController = TextEditingController();
  final _laboratoryController = TextEditingController();
  final _expirationDateController = TextEditingController();
  
  int? _selectedCategoryId;
  int? _selectedPharmacyId;
  String? _selectedTipo;
  bool _requiresPrescription = false;
  bool _isLoading = false;
  DateTime? _expirationDate;

  final List<Map<String, dynamic>> _tipos = [
    {'value': 'tableta', 'label': 'Tableta'},
    {'value': 'capsula', 'label': 'Cápsula'},
    {'value': 'liquido', 'label': 'Líquido'},
    {'value': 'crema', 'label': 'Crema'},
    {'value': 'inyectable', 'label': 'Inyectable'},
    {'value': 'polvo', 'label': 'Polvo'},
  ];

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      context.read<PharmacyProvider>().loadPharmacies();
    });

    if (widget.medicine != null) {
      _nameController.text = widget.medicine!.name;
      _descriptionController.text = widget.medicine!.description ?? '';
      _priceController.text = widget.medicine!.price.toString();
      _stockController.text = widget.medicine!.stock.toString();
      _gramajeController.text = widget.medicine!.gramaje ?? '';
      _activeIngredientController.text = widget.medicine!.activeIngredient ?? '';
      _laboratoryController.text = widget.medicine!.laboratory ?? '';
      _selectedCategoryId = widget.medicine!.categoryId;
      _selectedPharmacyId = widget.medicine!.pharmacyId;
      _selectedTipo = widget.medicine!.tipo;
      _requiresPrescription = widget.medicine!.requiresPrescription;
      _expirationDate = widget.medicine!.expirationDate;
      if (_expirationDate != null) {
        _expirationDateController.text = _expirationDate!.toLocal().toString().split(' ')[0];
      }
    }
  }

  @override
  void dispose() {
    _nameController.dispose();
    _descriptionController.dispose();
    _priceController.dispose();
    _stockController.dispose();
    _gramajeController.dispose();
    _activeIngredientController.dispose();
    _laboratoryController.dispose();
    _expirationDateController.dispose();
    super.dispose();
  }

  Future<void> _selectDate(BuildContext context) async {
    final DateTime? picked = await showDatePicker(
      context: context,
      initialDate: _expirationDate ?? DateTime.now(),
      firstDate: DateTime.now(),
      lastDate: DateTime.now().add(const Duration(days: 365 * 5)),
    );
    if (picked != null && picked != _expirationDate) {
      setState(() {
        _expirationDate = picked;
        _expirationDateController.text = picked.toLocal().toString().split(' ')[0];
      });
    }
  }

  Future<void> _save() async {
    if (!_formKey.currentState!.validate()) return;

    setState(() => _isLoading = true);

    try {
      final provider = context.read<MedicineProvider>();
      final data = {
        'name': _nameController.text.trim(),
        'category_id': _selectedCategoryId,
        'description': _descriptionController.text.trim(),
        'price': double.parse(_priceController.text),
        'stock': int.parse(_stockController.text),
        'requires_prescription': _requiresPrescription,
        'gramaje': _gramajeController.text.trim(),
        'tipo': _selectedTipo,
        'pharmacy_id': _selectedPharmacyId,
        'expiration_date': _expirationDate?.toIso8601String().split('T')[0],
        'active_ingredient': _activeIngredientController.text.trim(),
        'laboratory': _laboratoryController.text.trim(),
      };

      bool success;
      if (widget.medicine == null) {
        success = await provider.createMedicine(data);
      } else {
        success = await provider.updateMedicine(widget.medicine!.id, data);
      }

      if (!mounted) return;

      if (success) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(
              widget.medicine == null
                  ? 'Medicamento creado correctamente'
                  : 'Medicamento actualizado correctamente',
            ),
            backgroundColor: Colors.green,
          ),
        );
        Navigator.pop(context);
      }
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Error: ${e.toString()}'),
          backgroundColor: Colors.red,
        ),
      );
    } finally {
      if (mounted) setState(() => _isLoading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(
          widget.medicine == null ? 'Nuevo Medicamento' : 'Editar Medicamento',
        ),
        backgroundColor: Colors.green,
        foregroundColor: Colors.white,
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(20),
          child: Form(
            key: _formKey,
            child: Column(
              children: [
                TextFormField(
                  controller: _nameController,
                  decoration: InputDecoration(
                    labelText: 'Nombre del medicamento',
                    prefixIcon: const Icon(Icons.medication),
                    border: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(12),
                    ),
                  ),
                  validator: (value) {
                    if (value == null || value.isEmpty) {
                      return 'Ingresa el nombre';
                    }
                    return null;
                  },
                ),
                const SizedBox(height: 16),
                TextFormField(
                  controller: _activeIngredientController,
                  decoration: InputDecoration(
                    labelText: 'Componente activo',
                    hintText: 'Ej: Paracetamol, Amoxicilina...',
                    prefixIcon: const Icon(Icons.science),
                    border: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(12),
                    ),
                  ),
                ),
                const SizedBox(height: 16),
                Row(
                  children: [
                    Expanded(
                      child: TextFormField(
                        controller: _priceController,
                        decoration: InputDecoration(
                          labelText: 'Precio',
                          prefixIcon: const Icon(Icons.attach_money),
                          border: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(12),
                          ),
                        ),
                        keyboardType: TextInputType.number,
                        validator: (value) {
                          if (value == null || value.isEmpty) {
                            return 'Ingresa el precio';
                          }
                          return null;
                        },
                      ),
                    ),
                    const SizedBox(width: 16),
                    Expanded(
                      child: TextFormField(
                        controller: _stockController,
                        decoration: InputDecoration(
                          labelText: 'Stock',
                          prefixIcon: const Icon(Icons.inventory),
                          border: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(12),
                          ),
                        ),
                        keyboardType: TextInputType.number,
                        validator: (value) {
                          if (value == null || value.isEmpty) {
                            return 'Ingresa el stock';
                          }
                          return null;
                        },
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 16),
                Row(
                  children: [
                    Expanded(
                      child: CustomDropdown(
                        label: 'Categoría',
                        items: [], // Aquí irían las categorías
                        value: _selectedCategoryId,
                        onChanged: (value) {
                          setState(() {
                            _selectedCategoryId = value as int?;
                          });
                        },
                      ),
                    ),
                    const SizedBox(width: 16),
                    Expanded(
                      child: CustomDropdown(
                        label: 'Tipo',
                        items: _tipos,
                        value: _selectedTipo,
                        onChanged: (value) {
                          setState(() {
                            _selectedTipo = value as String?;
                          });
                        },
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 16),
                Row(
                  children: [
                    Expanded(
                      child: TextFormField(
                        controller: _gramajeController,
                        decoration: InputDecoration(
                          labelText: 'Gramaje',
                          hintText: 'Ej: 500mg, 10ml',
                          prefixIcon: const Icon(Icons.scale),
                          border: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(12),
                          ),
                        ),
                      ),
                    ),
                    const SizedBox(width: 16),
                    Expanded(
                      child: TextFormField(
                        controller: _laboratoryController,
                        decoration: InputDecoration(
                          labelText: 'Laboratorio',
                          prefixIcon: const Icon(Icons.business),
                          border: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(12),
                          ),
                        ),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 16),
                TextFormField(
                  controller: _descriptionController,
                  decoration: InputDecoration(
                    labelText: 'Descripción',
                    prefixIcon: const Icon(Icons.description),
                    border: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(12),
                    ),
                  ),
                  maxLines: 3,
                ),
                const SizedBox(height: 16),
                Row(
                  children: [
                    Expanded(
                      child: Consumer<PharmacyProvider>(
                        builder: (context, pharmacyProvider, child) {
                          if (pharmacyProvider.isLoading) {
                            return const LoadingIndicator();
                          }
                          return CustomDropdown(
                            label: 'Farmacia',
                            items: pharmacyProvider.pharmacies.map((p) => {
                              'value': p.id,
                              'label': p.name,
                            }).toList(),
                            value: _selectedPharmacyId,
                            onChanged: (value) {
                              setState(() {
                                _selectedPharmacyId = value as int?;
                              });
                            },
                          );
                        },
                      ),
                    ),
                    const SizedBox(width: 16),
                    Expanded(
                      child: TextFormField(
                        controller: _expirationDateController,
                        decoration: InputDecoration(
                          labelText: 'Fecha de caducidad',
                          prefixIcon: const Icon(Icons.calendar_today),
                          border: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(12),
                          ),
                          suffixIcon: IconButton(
                            icon: const Icon(Icons.date_range),
                            onPressed: () => _selectDate(context),
                          ),
                        ),
                        readOnly: true,
                        onTap: () => _selectDate(context),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 16),
                SwitchListTile(
                  title: const Text('Requiere receta médica'),
                  subtitle: const Text('Indica si este medicamento necesita receta'),
                  value: _requiresPrescription,
                  onChanged: (value) {
                    setState(() {
                      _requiresPrescription = value;
                    });
                  },
                  activeColor: Colors.red,
                ),
                const SizedBox(height: 30),
                SizedBox(
                  width: double.infinity,
                  height: 50,
                  child: ElevatedButton(
                    onPressed: _isLoading ? null : _save,
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.green,
                      foregroundColor: Colors.white,
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(12),
                      ),
                    ),
                    child: _isLoading
                        ? const LoadingIndicator(color: Colors.white)
                        : Text(
                            widget.medicine == null
                                ? 'Crear Medicamento'
                                : 'Actualizar Medicamento',
                            style: const TextStyle(
                              fontSize: 18,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}