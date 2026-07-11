import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:intl/intl.dart';
import 'package:url_launcher/url_launcher.dart';
import '../../../core/network/api_client.dart';
import '../../../core/theme/theme_provider.dart';
import '../../../shared/widgets/custom_loader.dart';
import '../../../core/constants/app_config.dart';

class TeacherLeaveRequests extends ConsumerStatefulWidget {
  const TeacherLeaveRequests({super.key});

  @override
  ConsumerState<TeacherLeaveRequests> createState() => _TeacherLeaveRequestsState();
}

class _TeacherLeaveRequestsState extends ConsumerState<TeacherLeaveRequests> {
  bool isLoading = true;
  List<dynamic> requests = [];


  @override
  void initState() {
    super.initState();
    _fetchRequests();
  }

  Future<void> _fetchRequests({bool isRefresh = false}) async {
    if (!isRefresh && mounted) setState(() => isLoading = true);

    try {
      final response = await ApiClient.dio.get('/leaves/requests');
      if (mounted) {
        setState(() {
          requests = response.data ?? [];
        });
      }
    } catch (e) {
      _showToast("Failed to fetch requests", isError: true);
    } finally {
      if (mounted) setState(() => isLoading = false);
    }
  }

  Future<void> _handleAction(String id, String status) async {
    setState(() {
      requests = requests.map((req) {
        if (req['_id'] == id) {
          req['status'] = status;
        }
        return req;
      }).toList();
    });

    try {
      await ApiClient.dio.put('/leaves/update-status/$id', data: {'status': status});
      _showToast(status == "Confirmed" ? "Leave Confirmed! ✅" : "Leave Rejected! ❌");
    } catch (e) {
      _showToast("Action failed!", isError: true);
      _fetchRequests(isRefresh: true);
    }
  }

  Future<void> _openDocument(String docPath) async {
    // 🔥 CONFIG SE DIRECT ABSOLUTE URL LEY LIYA 🔥
    String url = AppConfig.getAbsoluteUrl(docPath);
    final Uri uri = Uri.parse(url);
    try {
      if (!await launchUrl(uri, mode: LaunchMode.externalApplication)) {
        _showToast("Could not open document", isError: true);
      }
    } catch (e) {
      _showToast("Error opening link", isError: true);
    }
  }

  void _showToast(String message, {bool isError = false}) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Row(
          children: [
            Icon(isError ? Icons.error : Icons.check_circle, color: Colors.white, size: 20),
            const SizedBox(width: 10),
            Expanded(child: Text(message, style: const TextStyle(fontWeight: FontWeight.w900, fontStyle: FontStyle.italic, fontSize: 12))),
          ],
        ),
        backgroundColor: isError ? const Color(0xFFF43F5E) : const Color(0xFF10B981),
        behavior: SnackBarBehavior.floating,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
        margin: const EdgeInsets.all(20),
        duration: const Duration(seconds: 3),
      ),
    );
  }

  void _showConfirmDialog(String id, String status, bool isDarkMode, Color bgColor, Color textColor) {
    showGeneralDialog(
      context: context,
      barrierDismissible: true,
      barrierLabel: 'Confirm',
      transitionDuration: const Duration(milliseconds: 300),
      pageBuilder: (ctx, anim1, anim2) {
        return Scaffold(
          backgroundColor: Colors.transparent,
          body: Stack(
            children: [
              GestureDetector(
                onTap: () => Navigator.pop(ctx),
                child: Container(color: Colors.black.withOpacity(0.4)),
              ),
              Center(
                child: Container(
                  width: MediaQuery.of(context).size.width * 0.85,
                  padding: const EdgeInsets.all(30),
                  decoration: BoxDecoration(
                    color: bgColor,
                    borderRadius: BorderRadius.circular(40),
                    boxShadow: const [BoxShadow(color: Colors.black26, blurRadius: 20, offset: Offset(0, 10))],
                  ),
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Text("ARE YOU SURE?", style: TextStyle(fontSize: 18, fontWeight: FontWeight.w900, color: textColor, fontStyle: FontStyle.italic)),
                      const SizedBox(height: 12),
                      Text(
                        status == "Confirmed" ? "Do you want to confirm this leave?" : "Do you want to reject this leave?",
                        textAlign: TextAlign.center,
                        style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: Colors.grey),
                      ),
                      const SizedBox(height: 30),
                      Row(
                        children: [
                          Expanded(
                            child: GestureDetector(
                              onTap: () => Navigator.pop(ctx),
                              child: Container(
                                padding: const EdgeInsets.symmetric(vertical: 16),
                                alignment: Alignment.center,
                                decoration: BoxDecoration(color: isDarkMode ? const Color(0xFF334155) : const Color(0xFFF1F5F9), borderRadius: BorderRadius.circular(20)),
                                child: const Text("NO", style: TextStyle(fontSize: 11, fontWeight: FontWeight.w900, color: Colors.grey, letterSpacing: 1.5)),
                              ),
                            ),
                          ),
                          const SizedBox(width: 15),
                          Expanded(
                            child: GestureDetector(
                              onTap: () {
                                Navigator.pop(ctx);
                                _handleAction(id, status);
                              },
                              child: Container(
                                padding: const EdgeInsets.symmetric(vertical: 16),
                                alignment: Alignment.center,
                                decoration: BoxDecoration(
                                  color: status == "Confirmed" ? const Color(0xFF10B981) : const Color(0xFFF43F5E),
                                  borderRadius: BorderRadius.circular(20),
                                  boxShadow: [BoxShadow(color: (status == "Confirmed" ? const Color(0xFF10B981) : const Color(0xFFF43F5E)).withOpacity(0.4), blurRadius: 10)],
                                ),
                                child: const Text("YES", style: TextStyle(fontSize: 11, fontWeight: FontWeight.w900, color: Colors.white, letterSpacing: 1.5)),
                              ),
                            ),
                          ),
                        ],
                      )
                    ],
                  ),
                ).animate().scale(curve: Curves.easeOutBack, duration: 400.ms),
              ),
            ],
          ),
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    if (isLoading) return const CustomLoader();

    final themeMode = ref.watch(themeProvider);
    final bool isDarkMode = themeMode == ThemeMode.dark;

    final Color bgColor = isDarkMode ? const Color(0xFF0F172A) : const Color(0xFFF8FAFC);
    final Color cardColor = isDarkMode ? const Color(0xFF1E293B) : Colors.white;
    final Color cardBorder = isDarkMode ? const Color(0xFF334155) : const Color(0xFFDDE3EA);
    final Color textColorPrimary = isDarkMode ? const Color(0xFFF8FAFC) : const Color(0xFF1E293B);
    final Color textColorSecondary = isDarkMode ? const Color(0xFF94A3B8) : const Color(0xFF64748B);

    return PopScope(
      canPop: false,
      onPopInvokedWithResult: (didPop, result) {
        if (didPop) return;
        
        // 🔥 SAFE BACK ROUTING LOGIC 🔥
        if (context.canPop()) {
          context.pop(); 
        } else {
          context.go('/teacher/attendance');
        }
      },
      child: Scaffold(
        backgroundColor: bgColor,
        body: RefreshIndicator(
          color: const Color(0xFF42A5F5),
          backgroundColor: cardColor,
          onRefresh: () => _fetchRequests(isRefresh: true),
          child: CustomScrollView(
            // 🔥 YAHAN BOUNCING KI JAGAH CLAMPING LAGA DIYA 🔥
            physics: const AlwaysScrollableScrollPhysics(parent: ClampingScrollPhysics()),
            slivers: [
              SliverToBoxAdapter(
                child: Column(
                  children: [
                    // --- HEADER (Scrollable along with list) ---
                    Container(
                      padding: const EdgeInsets.only(top: 60, bottom: 40, left: 24, right: 24),
                      decoration: BoxDecoration(
                        gradient: LinearGradient(
                          colors: isDarkMode 
                              ? [const Color(0xFF1E3A8A), const Color(0xFF3B82F6)] 
                              : [const Color(0xFF64B5F6), const Color(0xFF42A5F5)],
                          begin: Alignment.topCenter, end: Alignment.bottomCenter,
                        ),
                        borderRadius: const BorderRadius.vertical(bottom: Radius.circular(55)),
                        boxShadow: const [BoxShadow(color: Colors.black12, blurRadius: 15, offset: Offset(0, 10))],
                      ),
                      child: Row(
                        crossAxisAlignment: CrossAxisAlignment.center,
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          GestureDetector(
                            onTap: () {
                              // 🔥 UI BACK ARROW BUTTON LOGIC (Same as PopScope) 🔥
                              if (context.canPop()) {
                                context.pop();
                              } else {
                                context.go('/teacher/attendance');
                              }
                            },
                            child: Container(
                              padding: const EdgeInsets.all(12),
                              decoration: BoxDecoration(color: Colors.white.withOpacity(0.2), borderRadius: BorderRadius.circular(16), border: Border.all(color: Colors.white.withOpacity(0.3))),
                              child: const Icon(Icons.arrow_back, color: Colors.white, size: 24),
                            ),
                          ),
                          Column(
                            mainAxisSize: MainAxisSize.min,
                            children: [
                              const Text("Leave Requests", style: TextStyle(fontSize: 24, fontWeight: FontWeight.w900, color: Colors.white, fontStyle: FontStyle.italic, letterSpacing: -0.5)),
                              Text("MANAGE STUDENT LEAVES", style: TextStyle(fontSize: 9, fontWeight: FontWeight.w900, color: Colors.white.withOpacity(0.9), letterSpacing: 2)),
                            ],
                          ),
                          Container(
                            padding: const EdgeInsets.all(12),
                            decoration: BoxDecoration(color: Colors.white.withOpacity(0.2), borderRadius: BorderRadius.circular(16), border: Border.all(color: Colors.white.withOpacity(0.3))),
                            child: const Icon(Icons.assignment, color: Colors.white, size: 24),
                          ),
                        ],
                      ),
                    ).animate().slideY(begin: -0.2, duration: 500.ms),

                    // --- MAIN SCROLLABLE LIST AREA ---
                    Transform.translate(
                      offset: const Offset(0, -20),
                      child: Padding(
                        padding: const EdgeInsets.symmetric(horizontal: 24),
                        child: requests.isEmpty
                            ? Container(
                                padding: const EdgeInsets.all(40),
                                width: double.infinity,
                                decoration: BoxDecoration(color: cardColor, borderRadius: BorderRadius.circular(40), border: Border.all(color: cardBorder), boxShadow: const [BoxShadow(color: Colors.black12, blurRadius: 15, offset: Offset(0, 5))]),
                                child: Column(
                                  children: [
                                    Icon(Icons.check_circle_outline, size: 50, color: textColorSecondary.withOpacity(0.3)),
                                    const SizedBox(height: 16),
                                    Text("NO PENDING REQUESTS", style: TextStyle(fontSize: 12, fontWeight: FontWeight.w900, color: textColorSecondary, fontStyle: FontStyle.italic, letterSpacing: 2)),
                                  ],
                                ),
                              ).animate().fadeIn()
                            : Column(
                                children: requests.map((req) {
                                  String dateStr = "";
                                  if (req['leaveType'] == "One Day") {
                                    dateStr = DateFormat('dd MMM yyyy').format(DateTime.parse(req['fromDate']));
                                  } else {
                                    dateStr = "${DateFormat('dd MMM').format(DateTime.parse(req['fromDate']))} TO ${DateFormat('dd MMM yyyy').format(DateTime.parse(req['toDate']))}";
                                  }

                                  String status = req['status'] ?? "Pending";
                                  bool isPending = status == "Pending";

                                  return Container(
                                    margin: const EdgeInsets.only(bottom: 20),
                                    padding: const EdgeInsets.all(24),
                                    decoration: BoxDecoration(
                                      color: cardColor,
                                      borderRadius: BorderRadius.circular(40),
                                      border: Border.all(color: cardBorder),
                                      boxShadow: const [BoxShadow(color: Colors.black12, blurRadius: 15, offset: Offset(0, 5))]
                                    ),
                                    child: Column(
                                      crossAxisAlignment: CrossAxisAlignment.start,
                                      children: [
                                        // Reason Badge
                                        Container(
                                          padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 6),
                                          decoration: BoxDecoration(color: isDarkMode ? const Color(0xFF1E3A8A).withOpacity(0.3) : Colors.blue.shade50, borderRadius: BorderRadius.circular(20)),
                                          child: Text((req['reason'] ?? 'Leave').toString().toUpperCase(), style: const TextStyle(fontSize: 9, fontWeight: FontWeight.w900, color: Color(0xFF42A5F5), letterSpacing: 1.5, fontStyle: FontStyle.italic)),
                                        ),
                                        const SizedBox(height: 16),

                                        // Student Info
                                        Row(
                                          children: [
                                            Container(
                                              padding: const EdgeInsets.all(12),
                                              decoration: BoxDecoration(color: isDarkMode ? const Color(0xFF1E3A8A).withOpacity(0.3) : Colors.blue.shade50, borderRadius: BorderRadius.circular(16)),
                                              child: const Icon(Icons.person, color: Color(0xFF42A5F5), size: 20),
                                            ),
                                            const SizedBox(width: 16),
                                            Expanded(
                                              child: Column(
                                                crossAxisAlignment: CrossAxisAlignment.start,
                                                children: [
                                                  Text((req['student']?['name'] ?? 'Unknown').toString().toUpperCase(), style: TextStyle(fontSize: 14, fontWeight: FontWeight.w900, color: textColorPrimary, fontStyle: FontStyle.italic)),
                                                  const SizedBox(height: 4),
                                                  Text("CLASS: ${req['student']?['grade'] ?? 'N/A'}", style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: textColorSecondary, letterSpacing: 1)),
                                                ],
                                              ),
                                            )
                                          ],
                                        ),
                                        const SizedBox(height: 20),

                                        // Date Range
                                        Container(
                                          padding: const EdgeInsets.all(16),
                                          decoration: BoxDecoration(color: isDarkMode ? const Color(0xFF0F172A) : const Color(0xFFF8FAFC), borderRadius: BorderRadius.circular(20), border: Border.all(color: cardBorder)),
                                          child: Row(
                                            children: [
                                              Icon(Icons.date_range, size: 16, color: textColorSecondary),
                                              const SizedBox(width: 10),
                                              Text(dateStr, style: TextStyle(fontSize: 11, fontWeight: FontWeight.w900, color: textColorSecondary, fontStyle: FontStyle.italic, letterSpacing: 1)),
                                            ],
                                          ),
                                        ),
                                        const SizedBox(height: 20),

                                        // View Document Button
                                        if (req['document'] != null)
                                          GestureDetector(
                                            onTap: () => _openDocument(req['document']),
                                            child: Container(
                                              width: double.infinity,
                                              padding: const EdgeInsets.symmetric(vertical: 14),
                                              decoration: BoxDecoration(color: isDarkMode ? const Color(0xFF1E3A8A).withOpacity(0.2) : const Color(0xFFF1F7FF), borderRadius: BorderRadius.circular(20), border: Border.all(color: isDarkMode ? const Color(0xFF1E3A8A) : const Color(0xFFD6E8FF))),
                                              child: const Row(
                                                mainAxisAlignment: MainAxisAlignment.center,
                                                children: [
                                                  Icon(Icons.file_present, size: 16, color: Color(0xFF42A5F5)),
                                                  SizedBox(width: 8),
                                                  Text("VIEW DOCUMENT", style: TextStyle(fontSize: 10, fontWeight: FontWeight.w900, color: Color(0xFF42A5F5), letterSpacing: 1.5, fontStyle: FontStyle.italic)),
                                                ],
                                              ),
                                            ),
                                          ),
                                        
                                        if (req['document'] != null) const SizedBox(height: 20),

                                        // Actions / Status
                                        if (isPending)
                                          Row(
                                            children: [
                                              Expanded(
                                                child: GestureDetector(
                                                  onTap: () => _showConfirmDialog(req['_id'], "Confirmed", isDarkMode, cardColor, textColorPrimary),
                                                  child: Container(
                                                    padding: const EdgeInsets.symmetric(vertical: 16),
                                                    alignment: Alignment.center,
                                                    decoration: BoxDecoration(color: const Color(0xFF10B981), borderRadius: BorderRadius.circular(20), boxShadow: [BoxShadow(color: const Color(0xFF10B981).withOpacity(0.4), blurRadius: 10)]),
                                                    child: const Text("CONFIRM", style: TextStyle(fontSize: 11, fontWeight: FontWeight.w900, color: Colors.white, letterSpacing: 1.5, fontStyle: FontStyle.italic)),
                                                  ),
                                                ),
                                              ),
                                              const SizedBox(width: 12),
                                              Expanded(
                                                child: GestureDetector(
                                                  onTap: () => _showConfirmDialog(req['_id'], "Rejected", isDarkMode, cardColor, textColorPrimary),
                                                  child: Container(
                                                    padding: const EdgeInsets.symmetric(vertical: 16),
                                                    alignment: Alignment.center,
                                                    decoration: BoxDecoration(color: const Color(0xFFF43F5E), borderRadius: BorderRadius.circular(20), boxShadow: [BoxShadow(color: const Color(0xFFF43F5E).withOpacity(0.4), blurRadius: 10)]),
                                                    child: const Text("REJECT", style: TextStyle(fontSize: 11, fontWeight: FontWeight.w900, color: Colors.white, letterSpacing: 1.5, fontStyle: FontStyle.italic)),
                                                  ),
                                                ),
                                              ),
                                            ],
                                          )
                                        else
                                          Container(
                                            width: double.infinity,
                                            padding: const EdgeInsets.symmetric(vertical: 16),
                                            alignment: Alignment.center,
                                            decoration: BoxDecoration(color: status == "Confirmed" ? const Color(0xFF10B981).withOpacity(0.1) : const Color(0xFFF43F5E).withOpacity(0.1), borderRadius: BorderRadius.circular(20)),
                                            child: Text(status.toUpperCase(), style: TextStyle(fontSize: 11, fontWeight: FontWeight.w900, color: status == "Confirmed" ? const Color(0xFF10B981) : const Color(0xFFF43F5E), letterSpacing: 2, fontStyle: FontStyle.italic)),
                                          )
                                      ],
                                    ),
                                  ).animate().fadeIn().slideY(begin: 0.1);
                                }).toList(),
                              ),
                      ),
                    ),
                    const SizedBox(height: 50), // 🔥 BOTTOM PADDING 50 LOCKED
                  ],
                ),
              )
            ],
          ),
        ),
      ),
    );
  }
}