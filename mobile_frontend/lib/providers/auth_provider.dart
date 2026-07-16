import 'package:flutter/material.dart';
import '../services/auth_service.dart';
import '../services/storage_service.dart';
import '../models/user.dart';
import '../utils/logger.dart';

class AuthProvider extends ChangeNotifier {
  final AuthService authService;
  final StorageService storageService;
  
  User? _user;
  List<User> _users = [];
  bool _isLoading = false;
  bool _isAuthenticated = false;

  AuthProvider(this.authService, this.storageService) {
    _checkAuthStatus();
  }

  User? get user => _user;
  List<User> get users => _users;
  bool get isLoading => _isLoading;
  bool get isAuthenticated => _isAuthenticated;

  Future<bool> login(String email, String password) async {
    _setLoading(true);
    try {
      final user = await authService.login(email, password);
      if (user != null) {
        _user = user;
        _isAuthenticated = true;
        notifyListeners();
        return true;
      }
      return false;
    } catch (e) {
      Logger.error('❌ Error en login: $e');
      return false;
    } finally {
      _setLoading(false);
    }
  }

  Future<bool> register(Map<String, dynamic> userData) async {
    _setLoading(true);
    try {
      final user = await authService.register(userData);
      if (user != null) {
        _user = user;
        _isAuthenticated = true;
        notifyListeners();
        return true;
      }
      return false;
    } catch (e) {
      Logger.error('❌ Error en registro: $e');
      return false;
    } finally {
      _setLoading(false);
    }
  }

  Future<bool> logout() async {
    _setLoading(true);
    try {
      final success = await authService.logout();
      if (success) {
        _user = null;
        _isAuthenticated = false;
        _users = [];
        notifyListeners();
        return true;
      }
      return false;
    } catch (e) {
      Logger.error('❌ Error en logout: $e');
      return false;
    } finally {
      _setLoading(false);
    }
  }

  Future<bool> isLoggedIn() async {
    try {
      // Verificar storage primero
      final hasToken = await storageService.getToken() != null;
      final hasUser = await storageService.getUser() != null;
      
      if (hasToken && hasUser) {
        // Validar con el servidor
        final isValid = await authService.validateToken();
        if (isValid) {
          final user = await authService.getCurrentUser();
          if (user != null) {
            _user = user;
            _isAuthenticated = true;
            notifyListeners();
            return true;
          }
        } else {
          // Token inválido, limpiar storage
          await storageService.clearAll();
        }
      }
      
      _isAuthenticated = false;
      return false;
    } catch (e) {
      Logger.error('❌ Error verificando autenticación: $e');
      return false;
    }
  }

  Future<void> loadUsers() async {
    _setLoading(true);
    try {
      _users = await authService.getUsers();
      notifyListeners();
    } catch (e) {
      Logger.error('Error cargando usuarios: $e');
    } finally {
      _setLoading(false);
    }
  }

  Future<bool> assignPharmacy(int userId, int pharmacyId) async {
    try {
      final success = await authService.assignPharmacy(userId, pharmacyId);
      if (success) {
        await loadUsers();
        return true;
      }
      return false;
    } catch (e) {
      Logger.error('Error asignando farmacia: $e');
      return false;
    }
  }

  void _checkAuthStatus() async {
    await isLoggedIn();
  }

  void _setLoading(bool loading) {
    _isLoading = loading;
    notifyListeners();
  }
}