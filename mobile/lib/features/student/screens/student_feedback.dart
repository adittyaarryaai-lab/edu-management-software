import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:flutter_animate/flutter_animate.dart';
import '../../../core/network/api_client.dart';
import '../../../shared/widgets/custom_loader.dart';

class StudentFeedback extends StatefulWidget {
  const StudentFeedback({super.key});

  @override
  State<StudentFeedback> createState() => _StudentFeedbackState();
}

class _StudentFeedbackState extends State<StudentFeedback> {
  // 🔥 FIX 1: Split loaders into initial (full screen) and content (partial screen)
  bool initialLoading = true;
  bool contentLoading = false;

  Map<String, dynamic>? studentProfile;

  List<dynamic> activeSessions = [];
  String? selectedSessionId;
  bool hasSubmitted = false;

  List<dynamic> teachers = [];
  // format: { "EMP123": { "rating": 4, "comment": "Good teacher" } }
  Map<String, Map<String, dynamic>> evaluations = {};
  bool isDropdownOpen = false;

  @override
  void initState() {
    super.initState();
    _initializeData();
  }

  Future<void> _initializeData() async {
    final prefs = await SharedPreferences.getInstance();
    final userStr = prefs.getString('user');
    if (userStr != null) {
      studentProfile = jsonDecode(userStr);
    }
    await _fetchActiveSessions();
  }

  Future<void> _fetchActiveSessions() async {
    try {
      final response = await ApiClient.dio.get('/feedback/active-sessions');
      if (mounted) {
        setState(() {
          activeSessions = response.data as List<dynamic>;
          initialLoading = false; // Initial full-screen loading done
        });
      }
    } catch (e) {
      _showToast("Failed to load active sessions.", isError: true);
      if (mounted) setState(() => initialLoading = false);
    }
  }

  Future<void> _checkStatusAndFetchTeachers(String sessionId) async {
    setState(() {
      contentLoading = true; // Sirf niche ka part load hoga
      selectedSessionId = sessionId;
      isDropdownOpen = false;
    });

    try {
      final statusRes =
          await ApiClient.dio.get('/feedback/check-status/$sessionId');

      if (statusRes.data['submitted'] == true) {
        if (mounted) {
          setState(() {
            hasSubmitted = true;
            contentLoading = false;
          });
        }
      } else {
        final teacherRes = await ApiClient.dio.get('/feedback/my-teachers');
        if (mounted) {
          setState(() {
            hasSubmitted = false;
            teachers = teacherRes.data as List<dynamic>;

            // Initialize empty evaluations
            evaluations.clear();
            for (var t in teachers) {
              evaluations[t['teacherEmpId']] = {'rating': 0, 'comment': ''};
            }
            contentLoading = false;
          });
        }
      }
    } catch (err) {
      _showToast("Failed to load details.", isError: true);
      if (mounted) setState(() => contentLoading = false);
    }
  }

  void _handleRating(String empId, int starValue) {
    setState(() {
      evaluations[empId]!['rating'] = starValue;
    });
  }

  void _handleComment(String empId, String text) {
    setState(() {
      evaluations[empId]!['comment'] = text;
    });
  }

  void _handlePreSubmit() {
    bool missingRatings = false;
    for (var t in teachers) {
      if (evaluations[t['teacherEmpId']]!['rating'] == 0) {
        missingRatings = true;
        break;
      }
    }

    if (missingRatings) {
      _showToast("Please give a star rating to all your teachers! ⚠️",
          isError: true);
      return;
    }
    _showConfirmModal();
  }

  Future<void> _confirmSubmit() async {
    Navigator.of(context).pop(); // Close modal

    setState(() => contentLoading = true);

    try {
      List<Map<String, dynamic>> evaluationArray = teachers.map((t) {
        String empId = t['teacherEmpId'];
        return {
          'teacherEmpId': empId,
          'teacherName': t['teacherName'],
          'rating': evaluations[empId]!['rating'],
          'comment': evaluations[empId]!['comment']
        };
      }).toList();

      await ApiClient.dio.post('/feedback/submit', data: {
        'sessionId': selectedSessionId,
        'evaluations': evaluationArray
      });

      _showToast("Feedback Submitted Successfully! 🎉");
      if (mounted) {
        setState(() {
          hasSubmitted = true;
          contentLoading = false;
        });
      }
    } catch (err) {
      _showToast("Submission failed.", isError: true);
      if (mounted) setState(() => contentLoading = false);
    }
  }

  void _showConfirmModal() {
    showDialog(
      context: context,
      barrierColor: const Color(0xFF0F172A).withOpacity(0.4),
      builder: (BuildContext context) {
        return Dialog(
          backgroundColor: Colors.transparent,
          insetPadding: const EdgeInsets.all(20),
          child: Container(
            width: double.infinity,
            padding: const EdgeInsets.all(24),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(32),
              border: Border.all(color: Colors.blue.shade50, width: 4),
            ),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                Container(
                  width: 60,
                  height: 60,
                  decoration: BoxDecoration(
                      color: Colors.blue.shade50,
                      shape: BoxShape.circle,
                      border: Border.all(color: Colors.blue.shade100)),
                  child: const Icon(Icons.security,
                      size: 24, color: Color(0xFF42A5F5)),
                ),
                const SizedBox(height: 16),
                const Text("SUBMIT FEEDBACK?",
                    style: TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.w900,
                        color: Color(0xFF1E293B),
                        letterSpacing: 1.5,
                        fontStyle: FontStyle.italic)),
                const SizedBox(height: 8),
                const Text(
                    "Are you sure you want to submit? You cannot change your ratings once submitted.",
                    textAlign: TextAlign.center,
                    style: TextStyle(
                        fontSize: 11,
                        fontWeight: FontWeight.bold,
                        color: Color(0xFF64748B))),
                const SizedBox(height: 24),
                Row(
                  children: [
                    Expanded(
                      child: GestureDetector(
                        onTap: () => Navigator.of(context).pop(),
                        child: Container(
                          padding: const EdgeInsets.symmetric(vertical: 14),
                          decoration: BoxDecoration(
                              color: const Color(0xFFF1F5F9),
                              borderRadius: BorderRadius.circular(25)),
                          alignment: Alignment.center,
                          child: const Text("CANCEL",
                              style: TextStyle(
                                  fontSize: 10,
                                  fontWeight: FontWeight.w900,
                                  color: Color(0xFF475569),
                                  letterSpacing: 2)),
                        ),
                      ),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: GestureDetector(
                        onTap: _confirmSubmit,
                        child: Container(
                          padding: const EdgeInsets.symmetric(vertical: 14),
                          decoration: BoxDecoration(
                              color: const Color(0xFF42A5F5),
                              borderRadius: BorderRadius.circular(25),
                              border: const Border(
                                  bottom: BorderSide(
                                      color: Color(0xFF1D4ED8), width: 3)),
                              boxShadow: [
                                BoxShadow(
                                    color: const Color(0xFF42A5F5)
                                        .withOpacity(0.4),
                                    blurRadius: 10,
                                    offset: const Offset(0, 4))
                              ]),
                          alignment: Alignment.center,
                          child: const Text("YES, SUBMIT",
                              style: TextStyle(
                                  fontSize: 10,
                                  fontWeight: FontWeight.w900,
                                  color: Colors.white,
                                  letterSpacing: 2)),
                        ),
                      ),
                    ),
                  ],
                )
              ],
            ),
          )
              .animate()
              .scale(begin: const Offset(0.9, 0.9), curve: Curves.easeOutBack),
        );
      },
    );
  }

  void _showToast(String message, {bool isError = false}) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(message,
            style: const TextStyle(
                fontWeight: FontWeight.w900,
                fontStyle: FontStyle.italic,
                fontSize: 13)),
        backgroundColor: isError ? Colors.redAccent : const Color(0xFF10B981),
        behavior: SnackBarBehavior.floating,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
        margin: const EdgeInsets.all(20),
      ),
    );
  }

  Future<void> _handleRefresh() async {
    if (selectedSessionId != null) {
      await _checkStatusAndFetchTeachers(selectedSessionId!);
    } else {
      await _fetchActiveSessions();
    }
  }

  @override
  Widget build(BuildContext context) {
    // 🔥 FIX 2: Full screen loader for initial load
    if (initialLoading) {
      return const Scaffold(
        backgroundColor: Color(0xFFF8FAFC),
        body: Center(child: CustomLoader()),
      );
    }

    return PopScope(
      canPop: false,
      onPopInvokedWithResult: (didPop, result) {
        if (didPop) return;
        if (context.canPop())
          context.pop();
        else
          context.go('/');
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
                                // Back Button
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
                                
                                // Center Heading
                                Column(
                                  children: [
                                    const Text("Feedback", style: TextStyle(fontSize: 32, fontWeight: FontWeight.w900, color: Colors.white, fontStyle: FontStyle.italic, letterSpacing: -1)),
                                    Text("SHARE YOUR EXPERIENCE", style: TextStyle(fontSize: 10, fontWeight: FontWeight.w900, color: Colors.white.withOpacity(0.9), letterSpacing: 2)),
                                  ],
                                ),

                                // Right Icon
                                Container(
                                  padding: const EdgeInsets.all(10),
                                  decoration: BoxDecoration(
                                    color: Colors.white.withOpacity(0.2),
                                    borderRadius: BorderRadius.circular(16),
                                    border: Border.all(color: Colors.white.withOpacity(0.3)),
                                  ),
                                  child: const Icon(Icons.chat_bubble_outline, color: Colors.white, size: 22),
                                ),
                              ],
                            ),
                            const SizedBox(height: 30), // Standard spacing

                            // Locked Identity Badge
                            Container(
                              padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 10),
                              decoration: BoxDecoration(
                                color: Colors.white.withOpacity(0.2),
                                borderRadius: BorderRadius.circular(30),
                                border: Border.all(color: Colors.white.withOpacity(0.3)),
                              ),
                              child: Row(
                                mainAxisSize: MainAxisSize.min,
                                children: [
                                  const Icon(Icons.account_circle, color: Colors.white, size: 18),
                                  const SizedBox(width: 8),
                                  Text((studentProfile?['name'] ?? 'STUDENT').toString().toUpperCase(), style: const TextStyle(color: Colors.white, fontSize: 11, fontWeight: FontWeight.w900, letterSpacing: 1.5)),
                                  Container(margin: const EdgeInsets.symmetric(horizontal: 10), width: 4, height: 4, decoration: BoxDecoration(color: Colors.white.withOpacity(0.5), shape: BoxShape.circle)),
                                  const Icon(Icons.lock, color: Colors.white70, size: 12),
                                  const SizedBox(width: 4),
                                  Text("CLASS ${studentProfile?['grade'] ?? 'LOCKED'}", style: const TextStyle(color: Colors.white, fontSize: 11, fontWeight: FontWeight.w900, letterSpacing: 1.5)),
                                ],
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),

                    // --- CONTENT AREA ---
                    Transform.translate(
                      offset: const Offset(0, -30),
                      child: Padding(
                        padding: const EdgeInsets.symmetric(horizontal: 20),
                        child: Column(
                          children: [
                            // SESSION SELECTOR DROPDOWN (Compacted)
                            Container(
                              width: double.infinity,
                              padding: const EdgeInsets.all(20),
                              decoration: BoxDecoration(
                                  color: Colors.white,
                                  borderRadius: BorderRadius.circular(30),
                                  border: Border.all(
                                      color: const Color(0xFFF1F5F9)),
                                  boxShadow: const [
                                    BoxShadow(
                                        color: Colors.black12,
                                        blurRadius: 10,
                                        offset: Offset(0, 4))
                                  ]),
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Row(
                                    children: [
                                      const Icon(Icons.chat_bubble_outline,
                                          size: 16, color: Color(0xFF42A5F5)),
                                      const SizedBox(width: 6),
                                      const Text("SELECT FORM TO FILL",
                                          style: TextStyle(
                                              fontSize: 9,
                                              fontWeight: FontWeight.w900,
                                              color: Color(0xFF94A3B8),
                                              letterSpacing: 2,
                                              fontStyle: FontStyle.italic)),
                                    ],
                                  ),
                                  const SizedBox(height: 12),
                                  GestureDetector(
                                    onTap: () {
                                      setState(() {
                                        isDropdownOpen = !isDropdownOpen;
                                      });
                                    },
                                    child: Container(
                                      padding: const EdgeInsets.symmetric(
                                          horizontal: 16, vertical: 12),
                                      decoration: BoxDecoration(
                                          color: const Color(0xFFF8FAFC),
                                          borderRadius:
                                              BorderRadius.circular(20),
                                          border: Border.all(
                                              color: isDropdownOpen
                                                  ? const Color(0xFF42A5F5)
                                                  : const Color(0xFFE2E8F0),
                                              width: 1.5)),
                                      child: Row(
                                        mainAxisAlignment:
                                            MainAxisAlignment.spaceBetween,
                                        children: [
                                          Expanded(
                                            child: Text(
                                              selectedSessionId != null
                                                  ? activeSessions
                                                      .firstWhere(
                                                          (s) =>
                                                              s['_id'] ==
                                                              selectedSessionId,
                                                          orElse: () => {
                                                                'title':
                                                                    'Unknown'
                                                              })['title']
                                                      .toString()
                                                      .toUpperCase()
                                                  : (activeSessions.isEmpty
                                                      ? "NO FORMS AVAILABLE"
                                                      : "CHOOSE FORM"),
                                              style: const TextStyle(
                                                  fontSize: 12,
                                                  fontWeight: FontWeight.w900,
                                                  color: Color(0xFF334155),
                                                  letterSpacing: 1),
                                              overflow: TextOverflow.ellipsis,
                                            ),
                                          ),
                                          Icon(
                                              isDropdownOpen
                                                  ? Icons.keyboard_arrow_up
                                                  : Icons.keyboard_arrow_down,
                                              color: const Color(0xFF42A5F5),
                                              size: 18),
                                        ],
                                      ),
                                    ),
                                  ),

                                  // Dropdown Menu List
                                  AnimatedSize(
                                    duration: const Duration(milliseconds: 300),
                                    curve: Curves.easeInOut,
                                    child: isDropdownOpen &&
                                            activeSessions.isNotEmpty
                                        ? Container(
                                            margin:
                                                const EdgeInsets.only(top: 8),
                                            padding: const EdgeInsets.all(8),
                                            decoration: BoxDecoration(
                                                color: Colors.white,
                                                borderRadius:
                                                    BorderRadius.circular(20),
                                                border: Border.all(
                                                    color:
                                                        const Color(0xFF42A5F5),
                                                    width: 1.5),
                                                boxShadow: const [
                                                  BoxShadow(
                                                      color: Colors.black12,
                                                      blurRadius: 10,
                                                      offset: Offset(0, 4))
                                                ]),
                                            child: Column(
                                              children:
                                                  activeSessions.map((session) {
                                                return GestureDetector(
                                                  onTap: () =>
                                                      _checkStatusAndFetchTeachers(
                                                          session['_id']),
                                                  child: Container(
                                                    width: double.infinity,
                                                    padding: const EdgeInsets
                                                        .symmetric(
                                                        vertical: 14,
                                                        horizontal: 12),
                                                    decoration: BoxDecoration(
                                                        borderRadius:
                                                            BorderRadius
                                                                .circular(12)),
                                                    child: Text(
                                                        session['title']
                                                            .toString()
                                                            .toUpperCase(),
                                                        style: const TextStyle(
                                                            fontSize: 11,
                                                            fontWeight:
                                                                FontWeight.w900,
                                                            color: Color(
                                                                0xFF334155),
                                                            letterSpacing: 1)),
                                                  ),
                                                );
                                              }).toList(),
                                            ),
                                          )
                                        : const SizedBox.shrink(),
                                  )
                                ],
                              ),
                            ).animate().fadeIn().slideY(begin: 0.1),
                            const SizedBox(height: 20),

                            // 🔥 FIX 2: Content Area Loader
                            if (contentLoading)
                              const SizedBox(
                                height: 250,
                                child: Center(child: CustomLoader()),
                              )
                            else if (selectedSessionId != null)
                              hasSubmitted
                                  ? // SUBMITTED SUCCESS CARD
                                  Container(
                                      width: double.infinity,
                                      padding: const EdgeInsets.all(24),
                                      decoration: BoxDecoration(
                                          color: Colors.white,
                                          borderRadius:
                                              BorderRadius.circular(30),
                                          border: Border.all(
                                              color: const Color(0xFF10B981),
                                              width: 3),
                                          boxShadow: const [
                                            BoxShadow(
                                                color: Colors.black12,
                                                blurRadius: 10,
                                                offset: Offset(0, 5))
                                          ]),
                                      child: Column(
                                        children: [
                                          Container(
                                              width: 60,
                                              height: 60,
                                              decoration: BoxDecoration(
                                                  color:
                                                      const Color(0xFFECFDF5),
                                                  shape: BoxShape.circle,
                                                  border: Border.all(
                                                      color: const Color(
                                                          0xFFD1FAE5))),
                                              child: const Icon(
                                                  Icons.check_circle,
                                                  size: 32,
                                                  color: Color(0xFF10B981))),
                                          const SizedBox(height: 16),
                                          const Text("FEEDBACK RECEIVED",
                                              style: TextStyle(
                                                  fontSize: 16,
                                                  fontWeight: FontWeight.w900,
                                                  color: Color(0xFF1E293B),
                                                  fontStyle: FontStyle.italic,
                                                  letterSpacing: 1.5)),
                                          const SizedBox(height: 8),
                                          Container(
                                              padding:
                                                  const EdgeInsets.symmetric(
                                                      horizontal: 16,
                                                      vertical: 12),
                                              decoration: BoxDecoration(
                                                  color:
                                                      const Color(0xFFF8FAFC),
                                                  borderRadius:
                                                      BorderRadius.circular(20),
                                                  border: Border.all(
                                                      color: const Color(
                                                          0xFFF1F5F9))),
                                              child: const Text(
                                                  "Thank you for your response! Your ratings have been submitted successfully and securely recorded.",
                                                  textAlign: TextAlign.center,
                                                  style: TextStyle(
                                                      fontSize: 11,
                                                      fontWeight:
                                                          FontWeight.bold,
                                                      color: Color(0xFF64748B),
                                                      fontStyle:
                                                          FontStyle.italic))),
                                        ],
                                      ),
                                    )
                                      .animate()
                                      .fadeIn()
                                      .scale(begin: const Offset(0.9, 0.9))
                                  : // FEEDBACK FORM LIST (Compacted)
                                  Column(
                                      children: [
                                        Container(
                                          margin:
                                              const EdgeInsets.only(bottom: 20),
                                          padding: const EdgeInsets.all(16),
                                          decoration: BoxDecoration(
                                              color: Colors.blue.shade50,
                                              borderRadius:
                                                  BorderRadius.circular(24),
                                              border: Border.all(
                                                  color: Colors.blue.shade100)),
                                          child: Row(
                                            crossAxisAlignment:
                                                CrossAxisAlignment.start,
                                            children: [
                                              const Icon(Icons.security,
                                                  color: Color(0xFF42A5F5),
                                                  size: 20),
                                              const SizedBox(width: 12),
                                              const Expanded(
                                                child: Text(
                                                    "Please rate your teachers honestly. Your feedback helps the school improve your learning experience. Responses are secure.",
                                                    style: TextStyle(
                                                        fontSize: 11,
                                                        fontWeight:
                                                            FontWeight.bold,
                                                        color:
                                                            Color(0xFF1E3A8A),
                                                        height: 1.4)),
                                              )
                                            ],
                                          ),
                                        ).animate().fadeIn(),
                                        if (teachers.isEmpty)
                                          Container(
                                            width: double.infinity,
                                            padding: const EdgeInsets.symmetric(
                                                vertical: 40),
                                            decoration: BoxDecoration(
                                                color: Colors.white,
                                                borderRadius:
                                                    BorderRadius.circular(30),
                                                border: Border.all(
                                                    color: const Color(
                                                        0xFFE2E8F0))),
                                            child: const Text(
                                                "NO TEACHERS ASSIGNED TO YOUR CLASS YET.",
                                                textAlign: TextAlign.center,
                                                style: TextStyle(
                                                    fontSize: 10,
                                                    fontWeight: FontWeight.w900,
                                                    color: Color(0xFF94A3B8),
                                                    letterSpacing: 1.5)),
                                          )
                                        else
                                          ...teachers.map((t) {
                                            String empId = t['teacherEmpId'];
                                            int currentRating =
                                                evaluations[empId]?['rating'] ??
                                                    0;

                                            return Container(
                                              margin: const EdgeInsets.only(
                                                  bottom: 20),
                                              padding: const EdgeInsets.all(20),
                                              decoration: BoxDecoration(
                                                  color: Colors.white,
                                                  borderRadius:
                                                      BorderRadius.circular(30),
                                                  border: Border.all(
                                                      color: const Color(
                                                          0xFFF1F5F9)),
                                                  boxShadow: const [
                                                    BoxShadow(
                                                        color: Colors.black12,
                                                        blurRadius: 10,
                                                        offset: Offset(0, 4))
                                                  ]),
                                              child: Column(
                                                crossAxisAlignment:
                                                    CrossAxisAlignment.start,
                                                children: [
                                                  Row(
                                                    children: [
                                                      Container(
                                                          width: 40,
                                                          height: 40,
                                                          decoration: BoxDecoration(
                                                              color: const Color(
                                                                  0xFFF8FAFC),
                                                              shape: BoxShape
                                                                  .circle,
                                                              border: Border.all(
                                                                  color: const Color(
                                                                      0xFFE2E8F0))),
                                                          child: const Icon(
                                                              Icons
                                                                  .account_circle,
                                                              size: 24,
                                                              color: Color(
                                                                  0xFF94A3B8))),
                                                      const SizedBox(width: 12),
                                                      Expanded(
                                                          child: Text(
                                                              t['teacherName']
                                                                  .toString()
                                                                  .toUpperCase(),
                                                              style: const TextStyle(
                                                                  fontSize: 16,
                                                                  fontWeight:
                                                                      FontWeight
                                                                          .w900,
                                                                  color: Color(
                                                                      0xFF1E293B),
                                                                  fontStyle:
                                                                      FontStyle
                                                                          .italic))),
                                                    ],
                                                  ),
                                                  const Padding(
                                                      padding:
                                                          EdgeInsets.symmetric(
                                                              vertical: 12),
                                                      child: Divider(
                                                          color:
                                                              Color(0xFFF1F5F9),
                                                          thickness: 1)),
                                                  const Text(
                                                      "GIVE RATING (1 TO 5 STARS)",
                                                      style: TextStyle(
                                                          fontSize: 9,
                                                          fontWeight:
                                                              FontWeight.w900,
                                                          color:
                                                              Color(0xFF475569),
                                                          letterSpacing: 1.5)),
                                                  const SizedBox(height: 10),
                                                  Row(
                                                    mainAxisAlignment:
                                                        MainAxisAlignment
                                                            .spaceBetween,
                                                    children: List.generate(5,
                                                        (index) {
                                                      int starValue = index + 1;
                                                      bool isSelected =
                                                          currentRating >=
                                                              starValue;
                                                      return GestureDetector(
                                                        onTap: () =>
                                                            _handleRating(empId,
                                                                starValue),
                                                        child: Icon(Icons.star,
                                                            size: 32,
                                                            color: isSelected
                                                                ? const Color(
                                                                    0xFFFBBF24)
                                                                : const Color(
                                                                    0xFFE2E8F0)), // Star chhota kar diya (40->32)
                                                      );
                                                    }),
                                                  ),
                                                  const SizedBox(height: 16),
                                                  Container(
                                                    padding: const EdgeInsets
                                                        .symmetric(
                                                        horizontal: 16,
                                                        vertical:
                                                            4), // Padding kam ki
                                                    decoration: BoxDecoration(
                                                        color: const Color(
                                                            0xFFF8FAFC),
                                                        borderRadius:
                                                            BorderRadius
                                                                .circular(20),
                                                        border: Border.all(
                                                            color: const Color(
                                                                0xFFE2E8F0))),
                                                    child: Row(
                                                      crossAxisAlignment:
                                                          CrossAxisAlignment
                                                              .start,
                                                      children: [
                                                        const Padding(
                                                            padding:
                                                                EdgeInsets.only(
                                                                    top: 14),
                                                            child: Icon(
                                                                Icons.edit,
                                                                size: 14,
                                                                color: Color(
                                                                    0xFF94A3B8))),
                                                        const SizedBox(
                                                            width: 10),
                                                        Expanded(
                                                          child: TextField(
                                                            onChanged: (val) =>
                                                                _handleComment(
                                                                    empId, val),
                                                            maxLines:
                                                                2, // 3 -> 2
                                                            style: const TextStyle(
                                                                fontSize: 12,
                                                                fontWeight:
                                                                    FontWeight
                                                                        .bold,
                                                                color: Color(
                                                                    0xFF334155)),
                                                            decoration:
                                                                const InputDecoration(
                                                              hintText:
                                                                  "Suggestions/Comments? (Optional)",
                                                              hintStyle: TextStyle(
                                                                  fontSize: 11,
                                                                  fontWeight:
                                                                      FontWeight
                                                                          .w900,
                                                                  color: Color(
                                                                      0xFF94A3B8),
                                                                  fontStyle:
                                                                      FontStyle
                                                                          .italic),
                                                              border:
                                                                  InputBorder
                                                                      .none,
                                                            ),
                                                          ),
                                                        )
                                                      ],
                                                    ),
                                                  )
                                                ],
                                              ),
                                            )
                                                .animate()
                                                .fadeIn()
                                                .slideY(begin: 0.1);
                                          }),
                                        if (teachers.isNotEmpty)
                                          GestureDetector(
                                            onTap: _handlePreSubmit,
                                            child: Container(
                                              width: double.infinity,
                                              padding:
                                                  const EdgeInsets.symmetric(
                                                      vertical: 16),
                                              decoration: BoxDecoration(
                                                  color:
                                                      const Color(0xFF42A5F5),
                                                  borderRadius:
                                                      BorderRadius.circular(30),
                                                  border: const Border(
                                                      bottom: BorderSide(
                                                          color:
                                                              Color(0xFF1D4ED8),
                                                          width: 3)),
                                                  boxShadow: [
                                                    BoxShadow(
                                                        color: const Color(
                                                                0xFF42A5F5)
                                                            .withOpacity(0.4),
                                                        blurRadius: 10,
                                                        offset:
                                                            const Offset(0, 4))
                                                  ]),
                                              child: const Center(
                                                child: Text(
                                                    "SUBMIT EVALUATION SECURELY",
                                                    style: TextStyle(
                                                        fontSize: 11,
                                                        fontWeight:
                                                            FontWeight.w900,
                                                        color: Colors.white,
                                                        letterSpacing: 2)),
                                              ),
                                            ),
                                          ).animate().fadeIn()
                                      ],
                                    )
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
