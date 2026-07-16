import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import '../utils/logger.dart';

class ApiService {
  late String baseUrl;
  final http.Client client = http.Client();
  String? _authToken;

  ApiService() {
    baseUrl = dotenv.env['API_URL'] ?? 'http://localhost:3000/api';
    Logger.info('API URL: $baseUrl');
  }

  void setAuthToken(String token) {
    _authToken = token;
  }

  void clearAuthToken() {
    _authToken = null;
  }

  Map<String, String> _getHeaders() {
    final headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };
    
    if (_authToken != null) {
      headers['Authorization'] = 'Bearer $_authToken';
    }
    
    return headers;
  }

  Future<Map<String, dynamic>> get(String endpoint) async {
    try {
      final response = await client.get(
        Uri.parse('$baseUrl$endpoint'),
        headers: _getHeaders(),
      );
      return _handleResponse(response);
    } catch (e) {
      Logger.error('Error en GET $endpoint: $e');
      rethrow;
    }
  }

  Future<Map<String, dynamic>> post(String endpoint, dynamic data) async {
    try {
      final response = await client.post(
        Uri.parse('$baseUrl$endpoint'),
        headers: _getHeaders(),
        body: json.encode(data),
      );
      return _handleResponse(response);
    } catch (e) {
      Logger.error('Error en POST $endpoint: $e');
      rethrow;
    }
  }

  Future<Map<String, dynamic>> put(String endpoint, dynamic data) async {
    try {
      final response = await client.put(
        Uri.parse('$baseUrl$endpoint'),
        headers: _getHeaders(),
        body: json.encode(data),
      );
      return _handleResponse(response);
    } catch (e) {
      Logger.error('Error en PUT $endpoint: $e');
      rethrow;
    }
  }

  Future<Map<String, dynamic>> delete(String endpoint) async {
    try {
      final response = await client.delete(
        Uri.parse('$baseUrl$endpoint'),
        headers: _getHeaders(),
      );
      return _handleResponse(response);
    } catch (e) {
      Logger.error('Error en DELETE $endpoint: $e');
      rethrow;
    }
  }

  Map<String, dynamic> _handleResponse(http.Response response) {
    Logger.info('Response status: ${response.statusCode}');
    
    if (response.statusCode >= 200 && response.statusCode < 300) {
      if (response.body.isEmpty) {
        return {};
      }
      try {
        return json.decode(response.body);
      } catch (e) {
        Logger.error('Error parseando JSON: $e');
        return {};
      }
    } else {
      Logger.error('Error en API: ${response.statusCode} - ${response.body}');
      throw Exception('Error en la solicitud: ${response.statusCode}');
    }
  }

  void dispose() {
    client.close();
  }
}