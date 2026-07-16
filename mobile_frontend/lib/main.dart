import 'package:flutter/material.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:provider/provider.dart';
import 'theme/app_theme.dart';
import 'screens/shared/splash_screen.dart';
import 'screens/auth/login_screen.dart';
import 'screens/admin/admin_dashboard.dart';
import 'screens/worker/worker_dashboard.dart';
import 'screens/patient/patient_dashboard.dart';
import 'providers/auth_provider.dart';
import 'providers/pharmacy_provider.dart';
import 'providers/medicine_provider.dart';
import 'providers/order_provider.dart';
import 'services/api_service.dart';
import 'services/auth_service.dart';
import 'services/storage_service.dart';
import 'utils/logger.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  
  try {
    await dotenv.load(fileName: ".env");
    Logger.info('✅ .env cargado correctamente');
  } catch (e) {
    Logger.error('❌ Error cargando .env: $e');
  }
  
  final storageService = StorageService();
  final apiService = ApiService();
  final authService = AuthService(apiService: apiService, storageService: storageService);
  
  runApp(
    MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => AuthProvider(authService, storageService)),
        ChangeNotifierProvider(create: (_) => PharmacyProvider(apiService)),
        ChangeNotifierProvider(create: (_) => MedicineProvider(apiService)),
        ChangeNotifierProvider(create: (_) => OrderProvider(apiService)),
      ],
      child: const MyApp(),
    ),
  );
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Farmacia App',
      theme: AppTheme.lightTheme,
      darkTheme: AppTheme.darkTheme,
      themeMode: ThemeMode.light,
      home: const SplashScreen(),
      debugShowCheckedModeBanner: false,
      routes: {
        '/login': (context) => const LoginScreen(),
        '/admin': (context) => const AdminDashboard(),
        '/worker': (context) => const WorkerDashboard(),
        '/patient': (context) => const PatientDashboard(),
      },
    );
  }
}