import 'package:flutter/material.dart';
import '../services/api_service.dart';
import '../models/pharmacy.dart';
import '../utils/logger.dart';

class PharmacyProvider extends ChangeNotifier {
  final ApiService apiService;
  List<Pharmacy> _pharmacies = [];
  bool _isLoading = false;

  PharmacyProvider(this.apiService);

  List<Pharmacy> get pharmacies => _pharmacies;
  bool get isLoading => _isLoading;

  Future<void> loadPharmacies() async {
    _setLoading(true);
    try {
      final response = await apiService.get('/pharmacies');
      if (response is List) {
        _pharmacies = response.map((p) => Pharmacy.fromJson(p)).toList();
        notifyListeners();
        Logger.info('✅ Farmacias cargadas: ${_pharmacies.length}');
      }
    } catch (e) {
      Logger.error('Error cargando farmacias: $e');
    } finally {
      _setLoading(false);
    }
  }

  Future<bool> createPharmacy(Map<String, dynamic> data) async {
    try {
      final response = await apiService.post('/pharmacies', data);
      final pharmacy = Pharmacy.fromJson(response);
      _pharmacies.add(pharmacy);
      notifyListeners();
      return true;
    } catch (e) {
      Logger.error('Error creando farmacia: $e');
      return false;
    }
  }

  Future<bool> updatePharmacy(int id, Map<String, dynamic> data) async {
    try {
      final response = await apiService.put('/pharmacies/$id', data);
      final updated = Pharmacy.fromJson(response);
      final index = _pharmacies.indexWhere((p) => p.id == id);
      if (index != -1) {
        _pharmacies[index] = updated;
        notifyListeners();
      }
      return true;
    } catch (e) {
      Logger.error('Error actualizando farmacia: $e');
      return false;
    }
  }

  Future<bool> deletePharmacy(int id) async {
    try {
      await apiService.delete('/pharmacies/$id');
      _pharmacies.removeWhere((p) => p.id == id);
      notifyListeners();
      return true;
    } catch (e) {
      Logger.error('Error eliminando farmacia: $e');
      return false;
    }
  }

  Pharmacy? getPharmacy(int? id) {
    if (id == null) return null;
    try {
      return _pharmacies.firstWhere((p) => p.id == id);
    } catch (e) {
      return null;
    }
  }

  void _setLoading(bool loading) {
    _isLoading = loading;
    notifyListeners();
  }
}