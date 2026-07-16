import 'package:flutter/material.dart';
import '../services/api_service.dart';
import '../models/medicine.dart';
import '../utils/logger.dart';

class MedicineProvider extends ChangeNotifier {
  final ApiService apiService;
  List<Medicine> _medicines = [];
  bool _isLoading = false;

  MedicineProvider(this.apiService);

  List<Medicine> get medicines => _medicines;
  bool get isLoading => _isLoading;

  Future<void> loadMedicines() async {
    _setLoading(true);
    try {
      final response = await apiService.get('/medicines');
      if (response is List) {
        _medicines = response.map((m) => Medicine.fromJson(m)).toList();
        notifyListeners();
        Logger.info('✅ Medicamentos cargados: ${_medicines.length}');
      }
    } catch (e) {
      Logger.error('Error cargando medicamentos: $e');
    } finally {
      _setLoading(false);
    }
  }

  Future<bool> createMedicine(Map<String, dynamic> data) async {
    try {
      final response = await apiService.post('/medicines', data);
      final medicine = Medicine.fromJson(response);
      _medicines.add(medicine);
      notifyListeners();
      return true;
    } catch (e) {
      Logger.error('Error creando medicamento: $e');
      return false;
    }
  }

  Future<bool> updateMedicine(int id, Map<String, dynamic> data) async {
    try {
      final response = await apiService.put('/medicines/$id', data);
      final updated = Medicine.fromJson(response);
      final index = _medicines.indexWhere((m) => m.id == id);
      if (index != -1) {
        _medicines[index] = updated;
        notifyListeners();
      }
      return true;
    } catch (e) {
      Logger.error('Error actualizando medicamento: $e');
      return false;
    }
  }

  Future<bool> deleteMedicine(int id) async {
    try {
      await apiService.delete('/medicines/$id');
      _medicines.removeWhere((m) => m.id == id);
      notifyListeners();
      return true;
    } catch (e) {
      Logger.error('Error eliminando medicamento: $e');
      return false;
    }
  }

  void _setLoading(bool loading) {
    _isLoading = loading;
    notifyListeners();
  }
}