import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';

class CustomLoader extends StatelessWidget {
  const CustomLoader({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC), // Same background as React
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            // --- ANIMATED CAT PAW PRINTS (Walking Effect) ---
            Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                _buildPaw(0),
                const SizedBox(width: 15),
                _buildPaw(300),
                const SizedBox(width: 15),
                _buildPaw(600),
              ],
            ),
            
            const SizedBox(height: 40),
            
            // --- EXACT TEXT FROM YOUR REACT CODE ---
            const Text(
              "PREPARING YOUR DASHBOARD...",
              style: TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.w600,
                color: Color(0xFF1E293B), // text-slate-800
                fontStyle: FontStyle.italic,
                letterSpacing: 1,
              ),
            ).animate(onPlay: (c) => c.repeat(reverse: true))
             .fadeIn(duration: 800.ms), // Animate-pulse effect
            
            const SizedBox(height: 8),
            
            const Text(
              "Syncing Data...",
              style: TextStyle(
                fontSize: 15,
                fontWeight: FontWeight.w900,
                color: Color(0xFF0F172A), // text-slate-900
              ),
            ),
          ],
        ),
      ),
    );
  }

  // Helper function to animate individual paw prints
  Widget _buildPaw(int delay) {
    return const Icon(
      Icons.pets, // Flutter's built-in Paw Icon
      size: 45, 
      color: Color(0xFF0F0E0D) // Dark color from your CSS
    )
    .animate(onPlay: (c) => c.repeat()) // Infinite loop
    .fadeIn(duration: 300.ms, delay: delay.ms) // Step-by-step appearance
    .moveY(begin: 10, end: -10, duration: 300.ms, curve: Curves.easeOut) // Slight bounce
    .then(delay: 600.ms)
    .fadeOut(duration: 300.ms);
  }
}