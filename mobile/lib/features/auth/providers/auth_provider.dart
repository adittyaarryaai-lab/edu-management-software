import 'dart:convert';
import 'package:dio/dio.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../../../core/network/api_client.dart';

class AuthState {
  final bool isLoading;
  final String? error;
  AuthState({this.isLoading = false, this.error});
}

class AuthNotifier extends StateNotifier<AuthState> {
  AuthNotifier() : super(AuthState());

  Future<bool> login(
      String email, String password, BuildContext context) async {
    state = AuthState(isLoading: true, error: null);
    try {
      final response = await ApiClient.dio.post('/auth/login', data: {
        'email': email,
        'password': password,
      });

      // Save user to SharedPreferences (Equivalent to localStorage)
      final prefs = await SharedPreferences.getInstance();
      await prefs.setString('user', jsonEncode(response.data));

      state = AuthState(isLoading: false);
      return true; // Login success
    } on DioException catch (e) {
      print("ERROR TYPE: ${e.type}");
      print("ERROR MESSAGE: ${e.message}");
      print("FULL ERROR: ${e.response?.data}");
      print("STATUS CODE: ${e.response?.statusCode}");
      String errorMessage = "Login failed! Check your credentials.";
      if (e.response != null && e.response?.data != null) {
        errorMessage = e.response?.data['message'] ?? errorMessage;
      }
      state = AuthState(isLoading: false, error: errorMessage);
      return false; // Login failed
    } catch (e) {
      state = AuthState(isLoading: false, error: "System error occurred.");
      return false;
    }
  }

  // OTP and Reset Password Logic
  Future<String?> sendOtp(String email) async {
    try {
      await ApiClient.dio.post('/auth/send-otp', data: {'email': email});
      return null; // Null means success
    } on DioException catch (e) {
      final msg = e.response?.data['message'] ?? "";
      return msg.toLowerCase().contains("identity")
          ? "Invalid email id! ⚠️"
          : msg;
    }
  }

  Future<String?> resetPassword(Map<String, dynamic> data) async {
    try {
      await ApiClient.dio.post('/auth/reset-password', data: data);
      return null;
    } on DioException catch (e) {
      return e.response?.data['message'] ?? "Reset Failed";
    }
  }
}

final authProvider = StateNotifierProvider<AuthNotifier, AuthState>((ref) {
  return AuthNotifier();
});
