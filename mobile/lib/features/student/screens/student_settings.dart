import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:flutter_animate/flutter_animate.dart';
import '../../../shared/widgets/custom_loader.dart';

class StudentSettings extends StatefulWidget {
  const StudentSettings({super.key});

  @override
  State<StudentSettings> createState() => _StudentSettingsState();
}

class _StudentSettingsState extends State<StudentSettings> {
  bool loading = true;
  bool isDarkMode = false; // Local state to handle theme switch for now

  @override
  void initState() {
    super.initState();
    _simulateLoading();
  }

  // Fake loading to ensure CustomLoader is shown as per your strict rule
  Future<void> _simulateLoading() async {
    setState(() => loading = true);
    await Future.delayed(const Duration(milliseconds: 600));
    if (mounted) {
      setState(() => loading = false);
    }
  }

  Future<void> _handleRefresh() async {
    await _simulateLoading();
  }

  @override
  Widget build(BuildContext context) {
    // 🔥 ALWAYS USING LOADER AS REQUESTED 🔥
    if (loading) return const CustomLoader();

    final List<Map<String, dynamic>> appSettings = [
      {
        'title': 'Change password',
        'subtitle': 'Security configurations',
        'icon': Icons.lock_outline,
        'color': const Color(0xFFF43F5E), // rose-500
        'bg': const Color(0xFFFFF1F2), // rose-50
        'path': '/change-password',
        'isTheme': false,
      },
      {
        'title': 'Notifications',
        'subtitle': 'Manage alerts and updates',
        'icon': Icons.notifications_none,
        'color': const Color(0xFFEAB308), // yellow-500
        'bg': const Color(0xFFFEFCE8), // yellow-50
        'path': null,
        'isTheme': false,
      },
      {
        'title': 'Appearance',
        'subtitle': 'Dark and light mode settings',
        'icon': isDarkMode ? Icons.wb_sunny_outlined : Icons.dark_mode_outlined,
        'color': isDarkMode ? const Color(0xFFEAB308) : const Color(0xFF334155),
        'bg': isDarkMode ? const Color(0xFFFEFCE8) : const Color(0xFFF8FAFC),
        'path': null,
        'isTheme': true,
      },
      {
        'title': 'Language',
        'subtitle': 'Select your preferred language',
        'icon': Icons.language,
        'color': const Color(0xFF3B82F6), // blue-500
        'bg': const Color(0xFFEFF6FF), // blue-50
        'path': null,
        'isTheme': false,
      },
    ];

    return PopScope(
      canPop: false,
      onPopInvokedWithResult: (didPop, result) {
        if (didPop) return;
        if (context.canPop()) context.pop();
        else context.go('/');
      },
      child: Scaffold(
        backgroundColor: const Color(0xFFF8FAFC),
        body: RefreshIndicator(
          color: const Color(0xFF42A5F5),
          backgroundColor: Colors.white,
          onRefresh: _handleRefresh,
          child: CustomScrollView(
            physics: const AlwaysScrollableScrollPhysics(),
            slivers: [
              SliverToBoxAdapter(
                child: Column(
                  children: [
                    // --- BLUE HEADER SECTION ---
                    Container(
                      width: double.infinity,
                      padding: const EdgeInsets.only(top: 60, bottom: 80, left: 24, right: 24),
                      decoration: const BoxDecoration(
                        color: Color(0xFF42A5F5),
                        gradient: LinearGradient(
                          colors: [Color(0xFF64B5F6), Color(0xFF42A5F5)],
                          begin: Alignment.topCenter,
                          end: Alignment.bottomCenter,
                        ),
                        borderRadius: BorderRadius.vertical(bottom: Radius.circular(55)),
                        boxShadow: [BoxShadow(color: Colors.black12, blurRadius: 15, offset: Offset(0, 10))],
                      ),
                      child: Stack(
                        clipBehavior: Clip.none,
                        children: [
                          // Giant background icon
                          Positioned(
                            right: -10,
                            top: -10,
                            child: Icon(Icons.security, size: 100, color: Colors.white.withOpacity(0.2)),
                          ),
                          Row(
                            crossAxisAlignment: CrossAxisAlignment.center,
                            children: [
                              GestureDetector(
                                onTap: () {
                                  if (context.canPop()) context.pop();
                                  else context.go('/');
                                },
                                child: Container(
                                  padding: const EdgeInsets.all(12),
                                  decoration: BoxDecoration(
                                    color: Colors.white.withOpacity(0.2),
                                    borderRadius: BorderRadius.circular(16),
                                    border: Border.all(color: Colors.white.withOpacity(0.3)),
                                  ),
                                  child: const Icon(Icons.arrow_back, color: Colors.white, size: 22),
                                ),
                              ),
                              const SizedBox(width: 16),
                              Expanded(
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    const Text("Settings", style: TextStyle(fontSize: 32, fontWeight: FontWeight.w900, color: Colors.white, fontStyle: FontStyle.italic, letterSpacing: -1)),
                                    Text("SYSTEM CONFIGURATION", style: TextStyle(fontSize: 10, fontWeight: FontWeight.w900, color: Colors.white.withOpacity(0.9), letterSpacing: 2)),
                                  ],
                                ),
                              ),
                            ],
                          ),
                        ],
                      ),
                    ),

                    // --- CONTENT AREA ---
                    Transform.translate(
                      offset: const Offset(0, -40),
                      child: Padding(
                        padding: const EdgeInsets.symmetric(horizontal: 20),
                        child: Column(
                          children: [
                            // Settings List
                            Column(
                              children: appSettings.asMap().entries.map((entry) {
                                int idx = entry.key;
                                var setting = entry.value;

                                return GestureDetector(
                                  onTap: () {
                                    if (setting['isTheme'] == true) {
                                      setState(() { isDarkMode = !isDarkMode; });
                                    } else if (setting['path'] != null) {
                                      context.push(setting['path']);
                                    }
                                  },
                                  child: Container(
                                    margin: const EdgeInsets.only(bottom: 16),
                                    padding: const EdgeInsets.all(20),
                                    decoration: BoxDecoration(
                                      color: Colors.white,
                                      borderRadius: BorderRadius.circular(40),
                                      border: Border.all(color: const Color(0xFFE2E8F0)),
                                      boxShadow: const [BoxShadow(color: Colors.black12, blurRadius: 10, offset: Offset(0, 4))]
                                    ),
                                    child: Row(
                                      children: [
                                        // Icon Wrapper
                                        Container(
                                          padding: const EdgeInsets.all(16),
                                          decoration: BoxDecoration(color: setting['bg'], borderRadius: BorderRadius.circular(24)),
                                          child: Icon(setting['icon'], color: setting['color'], size: 22),
                                        ),
                                        const SizedBox(width: 16),
                                        
                                        // Text Data
                                        Expanded(
                                          child: Column(
                                            crossAxisAlignment: CrossAxisAlignment.start,
                                            children: [
                                              Text(
                                                setting['title'].toString().toUpperCase(), 
                                                style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w900, color: Color(0xFF334155), fontStyle: FontStyle.italic, letterSpacing: 0.5),
                                                maxLines: 1, overflow: TextOverflow.ellipsis,
                                              ),
                                              const SizedBox(height: 2),
                                              Text(
                                                setting['subtitle'].toString().toUpperCase(), 
                                                style: const TextStyle(fontSize: 8, fontWeight: FontWeight.bold, color: Color(0xFF94A3B8), letterSpacing: 1),
                                                maxLines: 1, overflow: TextOverflow.ellipsis,
                                              ),
                                            ],
                                          ),
                                        ),
                                        
                                        // Right Element (Theme Switch or Arrow)
                                        setting['isTheme'] == true
                                            ? AnimatedContainer(
                                                duration: const Duration(milliseconds: 400),
                                                width: 56, height: 28,
                                                decoration: BoxDecoration(
                                                  color: isDarkMode ? const Color(0xFF42A5F5) : const Color(0xFFE2E8F0),
                                                  borderRadius: BorderRadius.circular(20),
                                                  border: Border.all(color: const Color(0xFFE2E8F0)),
                                                ),
                                                child: Stack(
                                                  children: [
                                                    AnimatedPositioned(
                                                      duration: const Duration(milliseconds: 400),
                                                      curve: Curves.easeOutBack,
                                                      top: 2,
                                                      left: isDarkMode ? 30 : 2,
                                                      child: Container(
                                                        width: 22, height: 22,
                                                        decoration: const BoxDecoration(color: Colors.white, shape: BoxShape.circle, boxShadow: [BoxShadow(color: Colors.black12, blurRadius: 4)]),
                                                        alignment: Alignment.center,
                                                        child: Container(
                                                          width: 8, height: 8,
                                                          decoration: BoxDecoration(color: isDarkMode ? const Color(0xFF42A5F5) : const Color(0xFFCBD5E1), shape: BoxShape.circle),
                                                        ),
                                                      ),
                                                    ),
                                                  ],
                                                ),
                                              )
                                            : Container(
                                                padding: const EdgeInsets.all(8),
                                                decoration: BoxDecoration(color: const Color(0xFFF8FAFC), borderRadius: BorderRadius.circular(12), border: Border.all(color: const Color(0xFFF1F5F9))),
                                                child: const Icon(Icons.chevron_right, size: 20, color: Color(0xFFCBD5E1)),
                                              )
                                      ],
                                    ),
                                  ),
                                ).animate().fadeIn(delay: Duration(milliseconds: 100 * idx)).slideX(begin: 0.1);
                              }).toList(),
                            ),
                            
                            const SizedBox(height: 32),
                            // Version Badge
                            const Opacity(
                              opacity: 0.3,
                              child: Text("PROTOCOL V2 • SECURE LINK", style: TextStyle(fontSize: 10, fontWeight: FontWeight.w900, color: Colors.black, letterSpacing: 4)),
                            ).animate().fadeIn(delay: 500.ms),
                          ],
                        ),
                      ),
                    ),
                    const SizedBox(height: 50), // Standard bottom padding
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}