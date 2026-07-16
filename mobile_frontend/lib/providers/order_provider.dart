import 'package:flutter/material.dart';
import '../services/api_service.dart';
import '../models/order.dart';
import '../utils/logger.dart';

class OrderProvider extends ChangeNotifier {
  final ApiService apiService;
  List<Order> _orders = [];
  bool _isLoading = false;

  OrderProvider(this.apiService);

  List<Order> get orders => _orders;
  bool get isLoading => _isLoading;

  Future<void> loadOrders() async {
    _setLoading(true);
    try {
      final response = await apiService.get('/orders');
      if (response is List) {
        _orders = response.map((o) => Order.fromJson(o)).toList();
        notifyListeners();
        Logger.info('✅ Órdenes cargadas: ${_orders.length}');
      }
    } catch (e) {
      Logger.error('Error cargando órdenes: $e');
    } finally {
      _setLoading(false);
    }
  }

  Future<bool> createOrder(Map<String, dynamic> data) async {
    try {
      final response = await apiService.post('/orders', data);
      final order = Order.fromJson(response);
      _orders.insert(0, order);
      notifyListeners();
      return true;
    } catch (e) {
      Logger.error('Error creando orden: $e');
      return false;
    }
  }

  Future<bool> updateOrderStatus(int id, String status) async {
    try {
      await apiService.put('/orders/$id/status', {'status': status});
      final index = _orders.indexWhere((o) => o.id == id);
      if (index != -1) {
        _orders[index].status = status;
        notifyListeners();
      }
      return true;
    } catch (e) {
      Logger.error('Error actualizando orden: $e');
      return false;
    }
  }

  Future<bool> cancelOrder(int id) async {
    try {
      await apiService.put('/orders/$id/cancel', {});
      final index = _orders.indexWhere((o) => o.id == id);
      if (index != -1) {
        _orders[index].status = 'cancelled';
        notifyListeners();
      }
      return true;
    } catch (e) {
      Logger.error('Error cancelando orden: $e');
      return false;
    }
  }

  void _setLoading(bool loading) {
    _isLoading = loading;
    notifyListeners();
  }
}