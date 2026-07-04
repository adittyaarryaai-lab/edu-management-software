import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:url_launcher/url_launcher.dart';
import '../../../core/network/api_client.dart';
import '../../../shared/widgets/custom_loader.dart';

class Mentorship extends StatefulWidget {
  const Mentorship({super.key});

  @override
  State<Mentorship> createState() => _MentorshipState();
}

class _MentorshipState extends State<Mentorship> {
  bool loading = true;
  Map<String, dynamic>? mentor;
  String? error;

  @override
  void initState() {
    super.initState();
    _fetchMentor();
  }

  Future<void> _fetchMentor() async {
    try {
      if (mounted) setState(() { error = null; });
      final response = await ApiClient.dio.get('/users/my-mentor');
      
      if (mounted) {
        setState(() {
          mentor = response.data;
          loading = false;
        });
      }
    } catch (err) {
      if (mounted) {
        setState(() {
          // Dynamic error parsing
          if (err is Map && err['response'] != null && err['response']['data'] != null) {
            error = err['response']['data']['message'];
          } else {
            error = "Mentor connection failed";
          }
          loading = false;
        });
      }
    }
  }

  Future<void> _handleRefresh() async {
    await _fetchMentor();
  }

  // --- CALL LAUNCHER LOGIC ---
  Future<void> _makePhoneCall(String phoneNumber) async {
    final Uri launchUri = Uri(
      scheme: 'tel',
      path: phoneNumber,
    );
    if (await canLaunchUrl(launchUri)) {
      await launchUrl(launchUri);
    } else {
      _showToast("Could not launch dialer");
    }
  }

  void _showToast(String message) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(message, style: const TextStyle(fontWeight: FontWeight.w900, fontStyle: FontStyle.italic, fontSize: 13)),
        backgroundColor: Colors.redAccent,
        behavior: SnackBarBehavior.floating,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
        margin: const EdgeInsets.all(20),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    if (loading) return const CustomLoader();

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
      child: Scaffold(
        backgroundColor: const Color(0xFFF8FAFC),
        body: RefreshIndicator(
          color: const Color(0xFF42A5F5),
          backgroundColor: Colors.white,
          onRefresh: _handleRefresh,
          child: SingleChildScrollView(
            physics: const AlwaysScrollableScrollPhysics(),
            padding: const EdgeInsets.only(bottom: 50),
            child: Column(
              children: [
                // --- BLUE HEADER SECTION ---
                Container(
                  width: double.infinity,
                  padding: const EdgeInsets.only(top: 60, bottom: 80),
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
                  child: Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 24),
                    child: Column(
                      children: [
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            GestureDetector(
                              onTap: () {
                                if (context.canPop()) context.pop();
                                else context.go('/');
                              },
                              child: Container(
                                padding: const EdgeInsets.all(10),
                                decoration: BoxDecoration(
                                  color: Colors.white.withOpacity(0.2),
                                  borderRadius: BorderRadius.circular(16),
                                  border: Border.all(color: Colors.white.withOpacity(0.3)),
                                ),
                                child: const Icon(Icons.arrow_back, color: Colors.white, size: 22),
                              ),
                            ),
                            Column(
                              children: [
                                const Text("Mentorship", style: TextStyle(fontSize: 32, fontWeight: FontWeight.w900, color: Colors.white, fontStyle: FontStyle.italic, letterSpacing: -1)),
                                Text("GUIDANCE & STUDENT SUPPORT", style: TextStyle(fontSize: 9, fontWeight: FontWeight.w900, color: Colors.white.withOpacity(0.9), letterSpacing: 2)),
                              ],
                            ),
                            Container(
                              padding: const EdgeInsets.all(10),
                              decoration: BoxDecoration(
                                color: Colors.white.withOpacity(0.2),
                                borderRadius: BorderRadius.circular(16),
                                border: Border.all(color: Colors.white.withOpacity(0.3)),
                              ),
                              child: const Icon(Icons.people_outline, color: Colors.white, size: 22),
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),
                ),

                // --- CONTENT AREA ---
                Transform.translate(
                  offset: const Offset(0, -40),
                  child: Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 24),
                    child: error != null
                        ? Container(
                            width: double.infinity,
                            padding: const EdgeInsets.symmetric(vertical: 60, horizontal: 20),
                            decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(45), border: Border.all(color: const Color(0xFFF1F5F9)), boxShadow: const [BoxShadow(color: Colors.black12, blurRadius: 20, offset: Offset(0, 10))]),
                            child: Column(
                              children: [
                                const Icon(Icons.security, size: 60, color: Color(0xFFE2E8F0)),
                                const SizedBox(height: 16),
                                Text(error!.toUpperCase(), textAlign: TextAlign.center, style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w900, fontStyle: FontStyle.italic, color: Color(0xFF94A3B8), letterSpacing: 2)),
                              ],
                            ),
                          ).animate().fadeIn().scale(begin: const Offset(0.9, 0.9))
                        : Container(
                            width: double.infinity,
                            padding: const EdgeInsets.all(32),
                            decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(55), border: Border.all(color: const Color(0xFFF1F5F9)), boxShadow: const [BoxShadow(color: Colors.black12, blurRadius: 25, offset: Offset(0, 10))]),
                            child: Column(
                              children: [
                                // --- Avatar Node ---
                                SizedBox(
                                  width: 140, height: 140,
                                  child: Stack(
                                    children: [
                                      Container(
                                        width: 140, height: 140,
                                        decoration: BoxDecoration(
                                          color: Colors.blue.shade50,
                                          shape: BoxShape.circle,
                                          border: Border.all(color: Colors.white, width: 5),
                                          boxShadow: [BoxShadow(color: Colors.blue.shade100, blurRadius: 20, offset: const Offset(0, 10))]
                                        ),
                                        clipBehavior: Clip.hardEdge,
                                        child: (mentor?['avatar'] != null && mentor!['avatar'].toString().isNotEmpty)
                                            // Handle backend IP if running on emulator (localhost to 10.0.2.2)
                                            ? Image.network("http://10.0.2.2:5000${mentor!['avatar']}", fit: BoxFit.cover, errorBuilder: (c, e, s) => const Icon(Icons.person, size: 60, color: Color(0xFF42A5F5)))
                                            : const Icon(Icons.person, size: 60, color: Color(0xFF42A5F5)),
                                      ),
                                      Positioned(
                                        bottom: 0, right: 0,
                                        child: Container(
                                          padding: const EdgeInsets.all(8),
                                          decoration: BoxDecoration(color: const Color(0xFF10B981), shape: BoxShape.circle, border: Border.all(color: Colors.white, width: 4), boxShadow: const [BoxShadow(color: Colors.black12, blurRadius: 5)]),
                                          child: const Icon(Icons.verified_user, color: Colors.white, size: 18),
                                        ).animate(onPlay: (c) => c.repeat(reverse: true)).scale(begin: const Offset(0.9, 0.9), end: const Offset(1.1, 1.1), duration: 1.seconds),
                                      )
                                    ],
                                  ),
                                ),
                                const SizedBox(height: 24),

                                // --- Mentor Details ---
                                Text((mentor?['name'] ?? 'Unknown Faculty').toString().toUpperCase(), textAlign: TextAlign.center, style: const TextStyle(fontSize: 26, fontWeight: FontWeight.w900, color: Color(0xFF1E293B), fontStyle: FontStyle.italic, letterSpacing: -0.5, height: 1.1)),
                                const SizedBox(height: 8),
                                Container(
                                  padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 6),
                                  decoration: BoxDecoration(color: Colors.blue.shade50, borderRadius: BorderRadius.circular(20), border: Border.all(color: Colors.blue.shade100)),
                                  child: const Text("CLASS TEACHER", style: TextStyle(fontSize: 11, fontWeight: FontWeight.w900, color: Color(0xFF42A5F5), fontStyle: FontStyle.italic, letterSpacing: 2)),
                                ),
                                const SizedBox(height: 32),

                                // --- Number Box with Call Button ---
                                Container(
                                  padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
                                  decoration: BoxDecoration(color: const Color(0xFFF8FAFC), borderRadius: BorderRadius.circular(35), border: Border.all(color: const Color(0xFFF1F5F9))),
                                  child: Row(
                                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                    children: [
                                      Row(
                                        children: [
                                          Container(padding: const EdgeInsets.all(12), decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(15), boxShadow: const [BoxShadow(color: Colors.black12, blurRadius: 5)]), child: const Icon(Icons.phone, color: Color(0xFF42A5F5), size: 18)),
                                          const SizedBox(width: 16),
                                          Column(
                                            crossAxisAlignment: CrossAxisAlignment.start,
                                            children: [
                                              const Text("CONTACT NO.", style: TextStyle(fontSize: 10, fontWeight: FontWeight.w900, color: Color(0xFF94A3B8), fontStyle: FontStyle.italic, letterSpacing: 1.5)),
                                              Text(mentor?['phone'] ?? '+91 N/A', style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w900, color: Color(0xFF334155), letterSpacing: 1.5)),
                                            ],
                                          ),
                                        ],
                                      ),
                                      GestureDetector(
                                        onTap: () {
                                          if (mentor?['phone'] != null) {
                                            _makePhoneCall(mentor!['phone']);
                                          }
                                        },
                                        child: Container(
                                          padding: const EdgeInsets.all(14),
                                          decoration: BoxDecoration(color: const Color(0xFF10B981), borderRadius: BorderRadius.circular(20), boxShadow: [BoxShadow(color: const Color(0xFF10B981).withOpacity(0.4), blurRadius: 10, offset: const Offset(0, 4))]),
                                          child: const Icon(Icons.call, color: Colors.white, size: 20),
                                        ),
                                      )
                                    ],
                                  ),
                                ),
                                const SizedBox(height: 16),

                                // --- Assigned Subjects Node ---
                                Container(
                                  width: double.infinity,
                                  padding: const EdgeInsets.all(24),
                                  decoration: BoxDecoration(color: Colors.blue.shade50.withOpacity(0.5), borderRadius: BorderRadius.circular(35), border: Border.all(color: Colors.blue.shade100.withOpacity(0.5))),
                                  child: Row(
                                    crossAxisAlignment: CrossAxisAlignment.start,
                                    children: [
                                      Container(padding: const EdgeInsets.all(12), decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(15), boxShadow: const [BoxShadow(color: Colors.black12, blurRadius: 5)]), child: const Icon(Icons.school, color: Color(0xFF42A5F5), size: 18)),
                                      const SizedBox(width: 16),
                                      Expanded(
                                        child: Column(
                                          crossAxisAlignment: CrossAxisAlignment.start,
                                          children: [
                                            const Text("TEACHING EXPERTISE", style: TextStyle(fontSize: 10, fontWeight: FontWeight.w900, color: Color(0xFF94A3B8), fontStyle: FontStyle.italic, letterSpacing: 1.5)),
                                            const SizedBox(height: 4),
                                            Text(
                                              (mentor?['subjects'] != null && mentor!['subjects'] is List) 
                                                ? (mentor!['subjects'] as List).join(', ').toUpperCase() 
                                                : "EXPERT FACULTY", 
                                              style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: Color(0xFF475569), fontStyle: FontStyle.italic, height: 1.4)
                                            ),
                                          ],
                                        ),
                                      ),
                                    ],
                                  ),
                                ),
                                
                                const SizedBox(height: 32),
                                // Footer Mark
                                Column(
                                  children: [
                                    Container(width: 40, height: 4, decoration: BoxDecoration(color: const Color(0xFFCBD5E1), borderRadius: BorderRadius.circular(10))),
                                    const SizedBox(height: 8),
                                    const Text("OFFICIAL NEURAL NODE VERIFIED", style: TextStyle(fontSize: 8, fontWeight: FontWeight.w900, color: Color(0xFF94A3B8), letterSpacing: 3)),
                                  ],
                                ).animate().fadeIn(delay: 500.ms)
                              ],
                            ),
                          ).animate().fadeIn().slideY(begin: 0.1),
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