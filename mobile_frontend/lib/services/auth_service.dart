import 'api_service.dart';
import 'storage_service.dart';
import '../models/user.dart';
import '../utils/logger.dart';

class AuthService {
  final ApiService apiService;
  final StorageService storageService;

  AuthService({
    required this.apiService,
    required this.storageService,
  });

  Future<User?> login(String email, String password) async {
    try {
      final response = await apiService.post('/auth/login', {
        'email': email,
        'password': password,
      });

      if (response.containsKey('user') && response.containsKey('token')) {
        final token = response['token'];
        final userData = response['user'];
        
        // Guardar token en API service
        apiService.setAuthToken(token);
        
        // Guardar en almacenamiento local
        await storageService.saveToken(token);
        final user = User.fromJson(userData);
        await storageService.saveUser(user);
        
        Logger.info('✅ Login exitoso: ${user.email}');
        return user;
      }
      
      return null;
    } catch (e) {
      Logger.error('Error en login: $e');
      return null;
    }
  }

  Future<User?> register(Map<String, dynamic> userData) async {
    try {
      final response = await apiService.post('/auth/register', userData);

      if (response.containsKey('user') && response.containsKey('token')) {
        final token = response['token'];
        final user = User.fromJson(response['user']);
        
        apiService.setAuthToken(token);
        await storageService.saveToken(token);
        await storageService.saveUser(user);
        
        Logger.info('✅ Registro exitoso: ${user.email}');
        return user;
      }
      
      return null;
    } catch (e) {
      Logger.error('Error en registro: $e');
      return null;
    }
  }

  Future<bool> logout() async {
    try {
      await storageService.clearAll();
      apiService.clearAuthToken();
      Logger.info('✅ Logout exitoso');
      return true;
    } catch (e) {
      Logger.error('Error en logout: $e');
      return false;
    }
  }

  Future<User?> getCurrentUser() async {
    try {
      // Intentar obtener de storage primero
      final cachedUser = await storageService.getUser();
      if (cachedUser != null) {
        return cachedUser;
      }
      
      // Si no está en cache, obtener del servidor
      final response = await apiService.get('/auth/me');
      if (response.containsKey('user')) {
        final user = User.fromJson(response['user']);
        await storageService.saveUser(user);
        return user;
      }
      return null;
    } catch (e) {
      Logger.error('Error obteniendo usuario: $e');
      return null;
    }
  }

  Future<bool> validateToken() async {
    try {
      await apiService.get('/auth/validate');
      return true;
    } catch (e) {
      return false;
    }
  }

  Future<List<User>> getUsers() async {
    try {
      final response = await apiService.get('/users');
      if (response is List) {
        return response.map((u) => User.fromJson(u)).toList();
      }
      return [];
    } catch (e) {
      Logger.error('Error obteniendo usuarios: $e');
      return [];
    }
  }

  Future<bool> assignPharmacy(int userId, int pharmacyId) async {
    try {
      await apiService.post('/users/assign-pharmacy', {
        'userId': userId,
        'pharmacyId': pharmacyId,
      });
      return true;
    } catch (e) {
      Logger.error('Error asignando farmacia: $e');
      return false;
    }
  }
}