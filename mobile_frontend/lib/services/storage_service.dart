import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';
import '../models/user.dart';
import '../models/medicine.dart';
import '../utils/logger.dart';

class StorageService {
  static const String _tokenKey = 'auth_token';
  static const String _userKey = 'user_data';
  static const String _themeKey = 'theme_mode';
  static const String _cachedMedicinesKey = 'cached_medicines';
  static const String _cacheTimestampKey = 'cache_timestamp';
  static const String _userIdKey = 'user_id';
  static const String _userRoleKey = 'user_role';

  // Token Management
  Future<void> saveToken(String token) async {
    try {
      final prefs = await SharedPreferences.getInstance();
      await prefs.setString(_tokenKey, token);
      Logger.debug('Token guardado exitosamente');
    } catch (e) {
      Logger.error('Error guardando token: $e');
    }
  }

  Future<String?> getToken() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      return prefs.getString(_tokenKey);
    } catch (e) {
      Logger.error('Error obteniendo token: $e');
      return null;
    }
  }

  // User Management
  Future<void> saveUser(User user) async {
    try {
      final prefs = await SharedPreferences.getInstance();
      await prefs.setString(_userKey, json.encode(user.toJson()));
      await prefs.setInt(_userIdKey, user.id);
      await prefs.setString(_userRoleKey, user.role);
      Logger.debug('Usuario guardado exitosamente');
    } catch (e) {
      Logger.error('Error guardando usuario: $e');
    }
  }

  Future<User?> getUser() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final userJson = prefs.getString(_userKey);
      if (userJson != null) {
        final data = json.decode(userJson);
        return User.fromJson(data);
      }
      return null;
    } catch (e) {
      Logger.error('Error obteniendo usuario: $e');
      return null;
    }
  }

  Future<int?> getUserId() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      return prefs.getInt(_userIdKey);
    } catch (e) {
      return null;
    }
  }

  Future<String?> getUserRole() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      return prefs.getString(_userRoleKey);
    } catch (e) {
      return null;
    }
  }

  // Theme Management
  Future<void> saveThemeMode(String themeMode) async {
    try {
      final prefs = await SharedPreferences.getInstance();
      await prefs.setString(_themeKey, themeMode);
    } catch (e) {
      Logger.error('Error guardando tema: $e');
    }
  }

  Future<String?> getThemeMode() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      return prefs.getString(_themeKey);
    } catch (e) {
      return null;
    }
  }

  // Cache Management (Medicines)
  Future<void> cacheMedicines(List<Medicine> medicines) async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final medicinesJson = medicines.map((m) => m.toJson()).toList();
      await prefs.setString(
        _cachedMedicinesKey,
        json.encode(medicinesJson),
      );
      await prefs.setInt(
        _cacheTimestampKey,
        DateTime.now().millisecondsSinceEpoch,
      );
      Logger.info('✅ Medicamentos cacheados: ${medicines.length}');
    } catch (e) {
      Logger.error('Error cacheando medicamentos: $e');
    }
  }

  Future<List<Medicine>> getCachedMedicines() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final cached = prefs.getString(_cachedMedicinesKey);
      if (cached != null) {
        final List data = json.decode(cached);
        return data.map((m) => Medicine.fromJson(m)).toList();
      }
      return [];
    } catch (e) {
      Logger.error('Error obteniendo medicamentos cacheados: $e');
      return [];
    }
  }

  bool isCacheValid() {
    try {
      final prefs = SharedPreferences.getInstance();
      final timestamp = prefs.getInt(_cacheTimestampKey) ?? 0;
      final elapsed = DateTime.now().millisecondsSinceEpoch - timestamp;
      // Cache válido por 5 minutos
      return elapsed < 5 * 60 * 1000;
    } catch (e) {
      return false;
    }
  }

  // Clear All Data
  Future<void> clearAll() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      await prefs.remove(_tokenKey);
      await prefs.remove(_userKey);
      await prefs.remove(_themeKey);
      await prefs.remove(_cachedMedicinesKey);
      await prefs.remove(_cacheTimestampKey);
      await prefs.remove(_userIdKey);
      await prefs.remove(_userRoleKey);
      Logger.info('✅ Todos los datos locales eliminados');
    } catch (e) {
      Logger.error('Error limpiando datos: $e');
    }
  }

  // Check if user is logged in
  Future<bool> isLoggedIn() async {
    try {
      final token = await getToken();
      final user = await getUser();
      return token != null && user != null;
    } catch (e) {
      return false;
    }
  }
}