import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart'; // 🔥 THEME IMPORT
import '../../../core/network/api_client.dart';
import '../../../shared/widgets/custom_loader.dart';
import '../../../core/theme/theme_provider.dart'; // 🔥 GLOBAL THEME

class StudentLibrary extends ConsumerStatefulWidget {
  const StudentLibrary({super.key});

  @override
  ConsumerState<StudentLibrary> createState() => _StudentLibraryState();
}

class _StudentLibraryState extends ConsumerState<StudentLibrary> {
  bool loading = true;
  List<dynamic> books = [];
  String search = '';

  @override
  void initState() {
    super.initState();
    _fetchBooks();
  }

  Future<void> _fetchBooks() async {
    try {
      final response = await ApiClient.dio.get('/library?search=$search');
      
      if (mounted) {
        setState(() {
          books = response.data as List<dynamic>;
          loading = false;
        });
      }
    } catch (err) {
      debugPrint("Library fetch error: $err");
      if (mounted) {
        setState(() {
          loading = false;
        });
      }
    }
  }

  Future<void> _handleRefresh() async {
    setState(() => loading = true);
    await _fetchBooks();
  }

  @override
  Widget build(BuildContext context) {
    if (loading) return const CustomLoader();

    // 🔥 GLOBAL THEME SE DARK MODE CHECK KAR RAHE HAIN 🔥
    final themeMode = ref.watch(themeProvider);
    final bool isDarkMode = themeMode == ThemeMode.dark;

    // 🔥 DYNAMIC COLORS FOR DARK/LIGHT MODE 🔥
    final Color bgColor = isDarkMode ? const Color(0xFF0F172A) : const Color(0xFFF8FAFC);
    final Color cardBg = isDarkMode ? const Color(0xFF1E293B) : Colors.white;
    final Color cardBorder = isDarkMode ? const Color(0xFF334155) : const Color(0xFFDDE3EA);
    final Color textColorPrimary = isDarkMode ? const Color(0xFFF8FAFC) : const Color(0xFF1E293B);
    final Color textColorSecondary = isDarkMode ? const Color(0xFF94A3B8) : const Color(0xFF94A3B8);
    final Color backBtnBg = isDarkMode ? const Color(0xFF1E293B) : Colors.white;
    final Color backBtnBorder = isDarkMode ? const Color(0xFF334155) : const Color(0xFFDDE3EA);

    return PopScope(
      canPop: false,
      onPopInvokedWithResult: (didPop, result) {
        if (didPop) return;
        if (context.canPop()) {
          context.pop();
        } else {
          context.go('/');
        }
      },
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 500),
        color: bgColor,
        child: Scaffold(
          backgroundColor: Colors.transparent, // Background transparent for AnimatedContainer
          body: RefreshIndicator(
            color: const Color(0xFF42A5F5),
            backgroundColor: cardBg,
            onRefresh: _handleRefresh,
            child: CustomScrollView(
              physics: const AlwaysScrollableScrollPhysics(),
              slivers: [
                SliverFillRemaining(
                  hasScrollBody: false,
                  child: Stack(
                    alignment: Alignment.center,
                    children: [
                      // --- TOP LEFT BACK BUTTON ---
                      Positioned(
                        top: 60,
                        left: 24,
                        child: GestureDetector(
                          onTap: () {
                            if (context.canPop()) {
                              context.pop();
                            } else {
                              context.go('/');
                            }
                          },
                          child: AnimatedContainer(
                            duration: const Duration(milliseconds: 400),
                            padding: const EdgeInsets.all(12),
                            decoration: BoxDecoration(
                              color: backBtnBg,
                              borderRadius: BorderRadius.circular(16),
                              border: Border.all(color: backBtnBorder),
                              boxShadow: const [
                                BoxShadow(color: Colors.black12, blurRadius: 8, offset: Offset(0, 4))
                              ]
                            ),
                            child: const Icon(Icons.arrow_back, color: Color(0xFF42A5F5), size: 24),
                          ),
                        ),
                      ),

                      // --- MAIN CENTERED CONTENT ---
                      Padding(
                        padding: const EdgeInsets.symmetric(horizontal: 24),
                        child: Column(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            // Animated Icon Container
                            Stack(
                              alignment: Alignment.center,
                              clipBehavior: Clip.none,
                              children: [
                                // Soft Blue Glow (Pulse effect)
                                Container(
                                  width: 140,
                                  height: 140,
                                  decoration: BoxDecoration(
                                    shape: BoxShape.circle,
                                    boxShadow: [
                                      BoxShadow(
                                        color: const Color(0xFF42A5F5).withOpacity(0.2),
                                        blurRadius: 40,
                                        spreadRadius: 20,
                                      )
                                    ]
                                  ),
                                ).animate(onPlay: (c) => c.repeat(reverse: true)).fade(begin: 0.5, end: 1.0, duration: 1.seconds),

                                // Main Dashed Box
                                AnimatedContainer(
                                  duration: const Duration(milliseconds: 400),
                                  padding: const EdgeInsets.all(40),
                                  decoration: BoxDecoration(
                                    color: cardBg,
                                    borderRadius: BorderRadius.circular(55),
                                    border: Border.all(
                                      color: cardBorder,
                                      width: 2, // Simulating dashed visually with standard border for now, custom dashed requires package but solid looks clean in flutter
                                    ),
                                  ),
                                  child: const Icon(Icons.construction, size: 80, color: Color(0xFF42A5F5))
                                      .animate(onPlay: (c) => c.repeat(reverse: true))
                                      .moveY(begin: -8, end: 8, duration: 800.ms, curve: Curves.easeInOut), // Bounce effect
                                ),

                                // Zap Mini Badge
                                Positioned(
                                  top: -10,
                                  right: -10,
                                  child: AnimatedContainer(
                                    duration: const Duration(milliseconds: 400),
                                    padding: const EdgeInsets.all(12),
                                    decoration: BoxDecoration(
                                      color: cardBg,
                                      shape: BoxShape.circle,
                                      border: Border.all(color: isDarkMode ? const Color(0xFF1E3A8A) : Colors.blue.shade50),
                                      boxShadow: const [BoxShadow(color: Colors.black12, blurRadius: 10)]
                                    ),
                                    child: const Icon(Icons.bolt, size: 24, color: Colors.amber)
                                        .animate(onPlay: (c) => c.repeat(reverse: true))
                                        .scale(begin: const Offset(0.9, 0.9), end: const Offset(1.2, 1.2), duration: 600.ms), // Pulse effect
                                  ),
                                )
                              ],
                            ),
                            const SizedBox(height: 40),

                            // Text Section
                            Text(
                              "MODULE UNDER\nCONSTRUCTION",
                              textAlign: TextAlign.center,
                              style: TextStyle(
                                fontSize: 32,
                                fontWeight: FontWeight.w900,
                                color: textColorPrimary,
                                fontStyle: FontStyle.italic,
                                letterSpacing: -0.5,
                                height: 1.1,
                              ),
                            ),
                            const SizedBox(height: 16),
                            
                            // Divider
                            Container(
                              height: 4,
                              width: 80,
                              decoration: BoxDecoration(
                                color: const Color(0xFF42A5F5),
                                borderRadius: BorderRadius.circular(10),
                                boxShadow: const [BoxShadow(color: Colors.black12, blurRadius: 4)]
                              ),
                            ),
                            const SizedBox(height: 24),

                            // Subtitle
                            RichText(
                              textAlign: TextAlign.center,
                              text: TextSpan(
                                style: TextStyle(
                                  fontSize: 16,
                                  fontWeight: FontWeight.bold,
                                  color: textColorSecondary,
                                  fontStyle: FontStyle.italic,
                                  height: 1.5,
                                ),
                                children: const [
                                  TextSpan(text: "Our digital library neural network is being synchronized.\n"),
                                  TextSpan(text: "Estimated deploy: Coming soon", style: TextStyle(color: Color(0xFF42A5F5))),
                                ]
                              )
                            ),
                            const SizedBox(height: 48),

                            // Status Indicator
                            AnimatedContainer(
                              duration: const Duration(milliseconds: 400),
                              padding: const EdgeInsets.symmetric(horizontal: 32, vertical: 16),
                              decoration: BoxDecoration(
                                color: cardBg,
                                borderRadius: BorderRadius.circular(40),
                                border: Border.all(color: cardBorder),
                                boxShadow: const [BoxShadow(color: Colors.black12, blurRadius: 5)]
                              ),
                              child: Row(
                                mainAxisSize: MainAxisSize.min,
                                children: [
                                  Container(
                                    width: 12,
                                    height: 12,
                                    decoration: const BoxDecoration(
                                      color: Color(0xFF10B981), // Emerald 500
                                      shape: BoxShape.circle,
                                    ),
                                  ).animate(onPlay: (c) => c.repeat(reverse: true)).fade(begin: 1.0, end: 0.3, duration: 800.ms), // Ping effect
                                  const SizedBox(width: 8),
                                  Text(
                                    "SYSTEM PROTOCOL 119: ACTIVE",
                                    style: TextStyle(
                                      fontSize: 8,
                                      fontWeight: FontWeight.w900,
                                      color: textColorSecondary,
                                      letterSpacing: 2,
                                    ),
                                  )
                                ],
                              ),
                            )
                          ],
                        ),
                      ),

                      // --- FOOTER TAG (With 50px Bottom Padding) ---
                      Positioned(
                        bottom: 50,
                        child: Opacity(
                          opacity: 0.3,
                          child: Row(
                            mainAxisSize: MainAxisSize.min,
                            children: [
                              Icon(Icons.security, size: 16, color: textColorSecondary),
                              const SizedBox(width: 8),
                              Text(
                                "EDUFLOWAI SECURITY MESH",
                                style: TextStyle(
                                  fontSize: 10,
                                  fontWeight: FontWeight.w900,
                                  color: textColorSecondary,
                                  letterSpacing: 4,
                                ),
                              ),
                            ],
                          ),
                        ),
                      )
                    ],
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}