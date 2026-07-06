import 'dart:convert'; // jsonDecode ke liye zaroori hai
import 'package:dio/dio.dart';
import 'package:shared_preferences/shared_preferences.dart';

class ApiClient {
  static final Dio dio = Dio(
    BaseOptions(
      baseUrl: 'http://192.168.20.131:5000/api',
      connectTimeout: const Duration(seconds: 10),
    ),
  );

  static Future<void> init() async {
    dio.interceptors.add(InterceptorsWrapper(
      onRequest: (options, handler) async {
        final prefs = await SharedPreferences.getInstance();
        final userData = prefs.getString('user');
        
        if (userData != null) {
          // Logic: Web app ki tarah JSON parse karke token nikaalo
          final Map<String, dynamic> user = jsonDecode(userData);
          final String token = user['token'];
          
          if (token.isNotEmpty) {
            options.headers['Authorization'] = 'Bearer $token';
          }
        }
        return handler.next(options);
      },
    ));
  }
}