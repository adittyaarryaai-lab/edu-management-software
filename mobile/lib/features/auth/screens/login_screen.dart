import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../providers/auth_provider.dart';
import 'forgot_password_modal.dart';

class LoginScreen extends ConsumerStatefulWidget {
  const LoginScreen({super.key});

  @override
  ConsumerState<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends ConsumerState<LoginScreen> {
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
  bool _showPass = false;

  void _handleLogin() async {
    if (_emailController.text.isEmpty || _passwordController.text.isEmpty) {
      return;
    }

    final success = await ref
        .read(authProvider.notifier)
        .login(_emailController.text, _passwordController.text, context);

    if (success && mounted) {
      final prefs = await SharedPreferences.getInstance();
      final userStr = prefs.getString('user');
      if (userStr != null) {
        final role = jsonDecode(userStr)['role'];
        if (role == 'superadmin') {
          context.go('/superadmin/dashboard');
        } else if (role == 'finance') {
          context.go('/finance/dashboard');
        } else {
          context.go('/');
        }
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final authState = ref.watch(authProvider);

    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      body: Stack(
        children: [
          // Background Gradient (Matched to your image's soft blue/white look)
          Container(
            decoration: const BoxDecoration(
              gradient: LinearGradient(
                colors: [
                  Color(0xFFE0F2FE),
                  Color(0xFFF8FAFC),
                  Color(0xFFF1F5F9)
                ],
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
              ),
            ),
          ),

          Center(
            child: SingleChildScrollView(
              padding: const EdgeInsets.symmetric(horizontal: 24),
              child: Container(
                width: double.infinity,
                padding:
                    const EdgeInsets.symmetric(horizontal: 24, vertical: 40),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius:
                      BorderRadius.circular(50), // Exact roundness from image
                  boxShadow: [
                    BoxShadow(
                      color: Colors.black.withValues(alpha: 0.06),
                      blurRadius: 40,
                      spreadRadius: 10,
                      offset: const Offset(0, 10),
                    )
                  ],
                ),
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    // --- LOGO & TITLE ---
                    Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      crossAxisAlignment: CrossAxisAlignment.center,
                      children: [
                        const Icon(
                          Icons.memory,
                          color: Color(0xFF42A5F5),
                          size: 36,
                        )
                            .animate(
                              onPlay: (controller) => controller.repeat(),
                            )
                            .rotate(
                              duration: 10.seconds,
                            ),
                        const SizedBox(width: 14),
                        const Text(
                          "EduFlowAI",
                          style: TextStyle(
                            fontSize: 34,
                            fontWeight: FontWeight.w900,
                            fontStyle: FontStyle.italic,
                            color: Color(0xFF1E293B),
                            letterSpacing: -1.2, // tracking tighter
                            height: 1,
                          ),
                        ),
                        const SizedBox(width: 14),
                        Container(
                          decoration: BoxDecoration(
                            shape: BoxShape.circle,
                            boxShadow: [
                              BoxShadow(
                                color: Colors.amber.withValues(alpha: 0.35),
                                blurRadius: 8,
                                spreadRadius: 1,
                              ),
                            ],
                          ),
                          child: const Icon(
                            Icons.bolt,
                            color: Colors.amber,
                            size: 38,
                          ),
                        )
                            .animate(
                              onPlay: (controller) =>
                                  controller.repeat(reverse: true),
                            )
                            .scale(
                              duration: 1500.ms,
                              begin: const Offset(1, 1),
                              end: const Offset(1.12, 1.12),
                            ),
                      ],
                    ),
                    const SizedBox(height: 12),

                    // Animated Blue Divider
                    Container(
                      height: 4,
                      width: 60,
                      decoration: BoxDecoration(
                        color: const Color(0xFF42A5F5),
                        borderRadius: BorderRadius.circular(10),
                      ),
                    )
                        .animate(
                            onPlay: (controller) =>
                                controller.repeat(reverse: true))
                        .scaleX(duration: 1.2.seconds, begin: 1, end: 1.5),

                    const SizedBox(height: 16),

                    const Text(
                      "LOGIN REQUIRED",
                      style: TextStyle(
                        color: Color(0xFF475569),
                        fontWeight: FontWeight.w800,
                        fontStyle: FontStyle.italic,
                        fontSize: 14,
                        letterSpacing: 1,
                      ),
                    ),
                    const SizedBox(height: 35),

                    // --- EMAIL FIELD ---
                    TextFormField(
                      controller: _emailController,
                      keyboardType: TextInputType.emailAddress,
                      style: const TextStyle(
                          fontWeight: FontWeight.bold,
                          fontStyle: FontStyle.italic,
                          color: Color(0xFF334155)),
                      decoration: InputDecoration(
                        hintText: "Email ID",
                        hintStyle: const TextStyle(
                            color: Color(0xFF94A3B8),
                            fontWeight: FontWeight.bold,
                            fontStyle: FontStyle.italic),
                        prefixIcon: const Icon(Icons.email_outlined,
                            color: Color(0xFF42A5F5), size: 22),
                        filled: true,
                        fillColor: Colors.white,
                        contentPadding:
                            const EdgeInsets.symmetric(vertical: 20),
                        enabledBorder: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(40),
                          borderSide: const BorderSide(
                              color: Color(0xFFCBD5E1), width: 1),
                        ),
                        focusedBorder: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(40),
                          borderSide: const BorderSide(
                              color: Color(0xFF42A5F5), width: 2),
                        ),
                      ),
                    ),
                    const SizedBox(height: 20),

                    // --- PASSWORD FIELD ---
                    TextFormField(
                      controller: _passwordController,
                      obscureText: !_showPass,
                      style: const TextStyle(
                          fontWeight: FontWeight.bold,
                          fontStyle: FontStyle.italic,
                          color: Color(0xFF334155)),
                      decoration: InputDecoration(
                        hintText: "Enter Password",
                        hintStyle: const TextStyle(
                            color: Color(0xFF94A3B8),
                            fontWeight: FontWeight.bold,
                            fontStyle: FontStyle.italic),
                        prefixIcon: const Icon(Icons.lock_outline,
                            color: Color(0xFF42A5F5), size: 22),
                        suffixIcon: IconButton(
                          icon: Icon(
                              _showPass
                                  ? Icons.visibility_off_outlined
                                  : Icons.visibility_outlined,
                              color: const Color(0xFF94A3B8),
                              size: 22),
                          onPressed: () =>
                              setState(() => _showPass = !_showPass),
                        ),
                        filled: true,
                        fillColor: Colors.white,
                        contentPadding:
                            const EdgeInsets.symmetric(vertical: 20),
                        enabledBorder: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(40),
                          borderSide: const BorderSide(
                              color: Color(0xFFCBD5E1), width: 1),
                        ),
                        focusedBorder: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(40),
                          borderSide: const BorderSide(
                              color: Color(0xFF42A5F5), width: 2),
                        ),
                      ),
                    ),

                    // --- ERROR MESSAGE ---
                    if (authState.error != null)
                      Padding(
                              padding: const EdgeInsets.only(top: 12),
                              child: Text(authState.error!,
                                  style: const TextStyle(
                                      color: Colors.redAccent,
                                      fontStyle: FontStyle.italic,
                                      fontWeight: FontWeight.bold,
                                      fontSize: 13)))
                          .animate()
                          .fadeIn()
                          .slideY(begin: -0.2),

                    const SizedBox(height: 24),

                    // --- SECURE LOGIN & FORGOT PASSWORD ROW ---
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        const Row(
                          children: [
                            Icon(Icons.security,
                                size: 16, color: Color(0xFF94A3B8)),
                            SizedBox(width: 6),
                            Text("SECURE\nLOGIN",
                                style: TextStyle(
                                    fontSize: 10,
                                    fontWeight: FontWeight.w900,
                                    color: Color(0xFF94A3B8),
                                    fontStyle: FontStyle.italic,
                                    height: 1.1))
                          ],
                        ),
                        TextButton(
                          onPressed: () {
                            showModalBottomSheet(
                              context: context,
                              isScrollControlled: true,
                              backgroundColor: Colors.transparent,
                              builder: (context) => const ForgotPasswordModal(),
                            );
                          },
                          child: const Text("FORGOT PASSWORD?",
                              style: TextStyle(
                                  color: Color(0xFF42A5F5),
                                  fontWeight: FontWeight.w900,
                                  fontSize: 11,
                                  fontStyle: FontStyle.italic,
                                  letterSpacing: 0.5)),
                        )
                      ],
                    ),
                    const SizedBox(height: 24),

                    // --- LOGIN BUTTON ---
                    SizedBox(
                      width: double.infinity,
                      height: 60,
                      child: ElevatedButton(
                        onPressed: authState.isLoading ? null : _handleLogin,
                        style: ElevatedButton.styleFrom(
                          backgroundColor: const Color(0xFF42A5F5),
                          foregroundColor: Colors.white,
                          shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(40)),
                          elevation:
                              0, // Removed shadow to match your clean image
                        ),
                        child: authState.isLoading
                            ? const SizedBox(
                                height: 24,
                                width: 24,
                                child: CircularProgressIndicator(
                                    color: Colors.white, strokeWidth: 3))
                            : const Row(
                                mainAxisAlignment: MainAxisAlignment.center,
                                children: [
                                  Text("LOGIN",
                                      style: TextStyle(
                                          fontSize: 16,
                                          fontWeight: FontWeight.w900,
                                          fontStyle: FontStyle.italic,
                                          letterSpacing: 1)),
                                  SizedBox(width: 8),
                                  Icon(Icons.bolt, size: 20)
                                ],
                              ),
                      ),
                    )
                  ],
                ),
              ).animate().fadeIn(duration: 600.ms).slideY(
                  begin: 0.1, duration: 600.ms, curve: Curves.easeOutQuad),
              // ^^^ YE HAI NAYI ANIMATION: Side se nahi aayega, neeche se halke se upar aayega!
            ),
          ),
        ],
      ),
    );
  }
}
