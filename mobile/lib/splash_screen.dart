import 'dart:async';
import 'dart:math';
import 'dart:ui';
import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:go_router/go_router.dart';

class SplashScreen extends StatefulWidget {
  const SplashScreen({super.key});

  @override
  State<SplashScreen> createState() => _SplashScreenState();
}

class _SplashScreenState extends State<SplashScreen>
    with TickerProviderStateMixin {
  late AnimationController robotController;

  @override
  void initState() {
    super.initState();

    robotController = AnimationController(
      vsync: this,
      duration: const Duration(seconds: 3),
    )..repeat(reverse: true);

    // 5.5 Seconds Cinematic Experience
    Future.delayed(const Duration(milliseconds: 5500), () {
      if (mounted) {
        context.go('/login');
      }
    });
  }

  @override
  void dispose() {
    robotController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final rest = "duFlowAI";

    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      body: Stack(
        children: [
          /// 1. ULTRA-PREMIUM LIQUID GRADIENT BACKGROUND
          Container(
            decoration: const BoxDecoration(
              gradient: LinearGradient(
                colors: [
                  Color(0xFFE0F7FA),
                  Color(0xFFF1F5F9),
                  Color(0xFFE3F2FD)
                ],
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
                stops: [0.1, 0.5, 0.9],
              ),
            ),
          ),

          /// 2. BLURRED GLOW ORBS (Glassmorphism Effect)
          Positioned(
            top: -100,
            left: -50,
            child: Container(
              width: 350,
              height: 350,
              decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  color: const Color(0xFF4FC3F7).withOpacity(0.4)),
            )
                .animate(onPlay: (c) => c.repeat(reverse: true))
                .scale(
                    duration: 5.seconds,
                    begin: const Offset(1, 1),
                    end: const Offset(1.3, 1.3))
                .moveX(begin: 0, end: 30, duration: 4.seconds),
          ),

          Positioned(
            bottom: -150,
            right: -100,
            child: Container(
              width: 400,
              height: 400,
              decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  color: const Color(0xFF7E57C2).withOpacity(0.3)),
            )
                .animate(onPlay: (c) => c.repeat(reverse: true))
                .scale(
                    duration: 6.seconds,
                    begin: const Offset(1, 1),
                    end: const Offset(1.4, 1.4))
                .moveY(begin: 0, end: -40, duration: 5.seconds),
          ),

          // Glass Blur Layer over Orbs
          Positioned.fill(
            child: BackdropFilter(
              filter: ImageFilter.blur(sigmaX: 40, sigmaY: 40),
              child: Container(color: Colors.white.withOpacity(0.2)),
            ),
          ),

          /// 3. QUANTUM PARTICLES (Organic Floating)
          ...List.generate(25, (index) {
            final double size = Random().nextDouble() * 5 + 2;
            return Positioned(
              left: Random().nextDouble() * MediaQuery.of(context).size.width,
              top: Random().nextDouble() * MediaQuery.of(context).size.height,
              child: Container(
                width: size,
                height: size,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  color: Colors.white,
                  boxShadow: [
                    BoxShadow(
                        color: const Color(0xFF42A5F5), blurRadius: size * 2)
                  ],
                ),
              )
                  .animate(onPlay: (c) => c.repeat(reverse: true))
                  .moveY(
                      begin: 0,
                      end: -50 - Random().nextDouble() * 50,
                      duration: (2000 + index * 150).ms,
                      curve: Curves.easeInOutSine)
                  .moveX(
                      begin: 0,
                      end: 20 - Random().nextDouble() * 40,
                      duration: (2000 + index * 200).ms,
                      curve: Curves.easeInOutSine)
                  .fadeIn(duration: 800.ms),
            );
          }),

          /// 4. HOLOGRAPHIC ROBOT MASCOT
          Positioned(
            top: MediaQuery.of(context).size.height * 0.15,
            left: 0,
            right: 0,
            child: AnimatedBuilder(
              animation: robotController,
              builder: (context, child) {
                return Transform.translate(
                  offset: Offset(0, sin(robotController.value * pi) * 15),
                  child: Transform.rotate(
                    angle: sin(robotController.value * pi * 2) * 0.05,
                    child: child,
                  ),
                );
              },
              child: Stack(
                alignment: Alignment.center,
                children: [
                  // Outer Glow Ring
                  Container(
                    width: 120,
                    height: 120,
                    decoration: BoxDecoration(
                      shape: BoxShape.circle,
                      border: Border.all(
                          color: const Color(0xFF42A5F5).withOpacity(0.3),
                          width: 2),
                    ),
                  )
                      .animate(onPlay: (c) => c.repeat())
                      .scale(
                          begin: const Offset(0.8, 0.8),
                          end: const Offset(1.5, 1.5),
                          duration: 2.seconds)
                      .fadeOut(duration: 2.seconds),

                  // Robot Glass Capsule
                  Container(
                    width: 90,
                    height: 90,
                    decoration: BoxDecoration(
                      shape: BoxShape.circle,
                      color: Colors.white.withOpacity(0.9),
                      boxShadow: [
                        BoxShadow(
                          color: const Color(0xFF42A5F5).withOpacity(0.5),
                          blurRadius: 30,
                          spreadRadius: 5,
                        ),
                        BoxShadow(
                          color: Colors.white.withOpacity(0.8),
                          blurRadius: 12,
                          spreadRadius: -2,
                          offset: const Offset(-2, -2),
                        ),
                      ],
                    ),
                    child: const Center(
                      child: Icon(Icons.smart_toy_rounded,
                          size: 50, color: Color(0xFF1E293B)),
                    ),
                  ),
                ],
              ),
            ).animate().fadeIn(duration: 1.seconds).scale(
                begin: const Offset(0.5, 0.5), curve: Curves.easeOutBack),
          ),

          /// 5. NETFLIX-STYLE LOGO REVEAL
          Center(
            child: Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                // --- THE GIANT 'E' ---
                const Text(
                  "E",
                  style: TextStyle(
                    fontSize: 85,
                    fontWeight: FontWeight.w900,
                    letterSpacing: -2,
                    color: Color(0xFF1E293B),
                    fontStyle: FontStyle.italic,
                  ),
                )
                    .animate()
                    .scale(
                        begin: const Offset(3, 3),
                        end: const Offset(1, 1),
                        duration: 1200.ms,
                        curve: Curves.elasticOut)
                    .fadeIn(duration: 800.ms)
                    .custom(
                      duration: 1000.ms,
                      builder: (context, value, child) => Container(
                        decoration: BoxDecoration(
                          boxShadow: [
                            BoxShadow(
                                color: const Color(0xFF42A5F5)
                                    .withOpacity(0.4 * value),
                                blurRadius: 40 * value)
                          ],
                        ),
                        child: child,
                      ),
                    ),

                // --- THE REST OF THE NAME ---
                ...rest.split('').asMap().entries.map((entry) {
                  int i = entry.key;
                  String letter = entry.value;
                  bool isAI = letter == "A" || letter == "I";

                  return Text(
                    letter,
                    style: TextStyle(
                      fontSize: 65,
                      fontWeight: FontWeight.w800,
                      letterSpacing: -1,
                      color: isAI
                          ? const Color(0xFF42A5F5)
                          : const Color(0xFF334155),
                      fontStyle: FontStyle.italic,
                    ),
                  )
                      .animate()
                      .fadeIn(
                          delay: (1500 + i * 80).ms,
                          duration: 400.ms) // Domino effect
                      .slideX(
                          begin: 0.5,
                          end: 0,
                          duration: 400.ms,
                          curve: Curves.easeOutBack)
                      .scale(
                          begin: const Offset(0.5, 0.5),
                          end: const Offset(1, 1),
                          duration: 400.ms);
                }),

                // --- V2.0 BADGE ---
                Container(
                  margin: const EdgeInsets.only(left: 8, top: 20),
                  padding:
                      const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                  decoration: BoxDecoration(
                    color: Colors.amberAccent,
                    borderRadius: BorderRadius.circular(10),
                    boxShadow: [
                      BoxShadow(
                          color: Colors.amber.withOpacity(0.5), blurRadius: 10)
                    ],
                  ),
                  child: const Text("v2.0",
                      style: TextStyle(
                          fontSize: 14,
                          fontWeight: FontWeight.w900,
                          color: Colors.white,
                          fontStyle: FontStyle.italic)),
                )
                    .animate()
                    .fadeIn(delay: 2400.ms)
                    .scale(curve: Curves.elasticOut),
              ],
            ),
          ),

          /// 6. LASER SCANNER (Sweeps across the text)
          Positioned.fill(
            child: Align(
              alignment: Alignment.centerLeft,
              child: Container(
                width: 5,
                height: 120,
                decoration: BoxDecoration(
                  borderRadius: BorderRadius.circular(10),
                  color: Colors.white,
                  boxShadow: [
                    BoxShadow(
                        color: const Color(0xFF42A5F5).withOpacity(0.8),
                        blurRadius: 20,
                        spreadRadius: 5),
                    BoxShadow(
                        color: Colors.white.withOpacity(0.9),
                        blurRadius: 5,
                        spreadRadius: 2),
                  ],
                ),
              )
                  .animate()
                  .fadeIn(delay: 1000.ms, duration: 100.ms)
                  .moveX(
                      begin: -50,
                      end: MediaQuery.of(context).size.width + 50,
                      duration: 1800.ms,
                      curve: Curves.easeInOutSine)
                  .fadeOut(delay: 2700.ms, duration: 100.ms),
            ),
          ),

          /// 7. BOTTOM ICONS (Elegant Slide Up)
          Positioned(
            bottom: 120,
            left: 0,
            right: 0,
            child: Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                _buildBottomIcon(Icons.school_rounded, 2800.ms),
                const SizedBox(width: 40),
                _buildBottomIcon(Icons.auto_awesome, 3000.ms,
                    isBlue: true), // Magic/AI Icon
                const SizedBox(width: 40),
                _buildBottomIcon(Icons.memory_rounded, 3200.ms),
              ],
            ),
          ),

          /// 8. TAGLINE
          Positioned(
            bottom: 50,
            left: 0,
            right: 0,
            child: const Center(
              child: Text(
                "Smart School. Smart Future.",
                style: TextStyle(
                  fontSize: 14,
                  fontWeight: FontWeight.w900,
                  color: Color(0xFF64748B),
                  fontStyle: FontStyle.italic,
                  letterSpacing: 2,
                ),
              ),
            )
                .animate()
                .fadeIn(delay: 3500.ms)
                .slideY(begin: 1, curve: Curves.easeOutBack),
          ),
        ],
      ),
    );
  }

  // Helper for Bottom Icons
  Widget _buildBottomIcon(IconData icon, Duration delay,
      {bool isBlue = false}) {
    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: isBlue ? const Color(0xFF42A5F5).withOpacity(0.1) : Colors.white,
        shape: BoxShape.circle,
        boxShadow: [
          BoxShadow(
              color: Colors.black.withOpacity(0.05),
              blurRadius: 10,
              offset: const Offset(0, 5))
        ],
      ),
      child: Icon(icon,
          size: 26,
          color: isBlue ? const Color(0xFF42A5F5) : const Color(0xFF94A3B8)),
    )
        .animate()
        .fadeIn(delay: delay)
        .slideY(begin: 1, curve: Curves.easeOutBack);
  }
}
