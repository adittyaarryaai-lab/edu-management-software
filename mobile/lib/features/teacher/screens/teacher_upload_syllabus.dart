import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../../../core/network/api_client.dart';
import '../../../core/theme/theme_provider.dart';
import '../../../shared/widgets/custom_loader.dart';

class TeacherUploadSyllabus extends ConsumerStatefulWidget {
  const TeacherUploadSyllabus({super.key});

  @override
  ConsumerState<TeacherUploadSyllabus> createState() => _TeacherUploadSyllabusState();
}

class _TeacherUploadSyllabusState extends ConsumerState<TeacherUploadSyllabus> {
  bool isLoading = true;
  bool isActionLoading = false;
  
  Map<String, dynamic>? currentUser;
  String? assignedClass;
  String? employeeId;
  String? userId;

  String viewMode = 'pending'; // 'pending' or 'monitor'
  
  List<dynamic> pendingRequests = [];
  List<dynamic> managedSyllabuses = [];
  Map<String, bool> editModes = {};
  String? selectedMonitorId; // 🔥 SMART MONITOR HUB SELECTOR 🔥

  // Form State
  String formDataTitle = '';

  // Editor State
  Map<String, dynamic> editorData = {
    'syllabusId': '', 'subjectName': '', 'title': '', 'grade': '', 'content': '', 'mode': 'submit'
  };
  final TextEditingController _editorCtrl = TextEditingController();

  @override
  void initState() {
    super.initState();
    _initData();
  }

  @override
  void dispose() {
    _editorCtrl.dispose();
    super.dispose();
  }

  Future<void> _initData({bool isRefresh = false}) async {
    if (!isRefresh && mounted) setState(() => isLoading = true);

    try {
      final prefs = await SharedPreferences.getInstance();
      final userStr = prefs.getString('user');
      if (userStr != null) {
        currentUser = jsonDecode(userStr);
        assignedClass = currentUser?['assignedClass'];
        employeeId = currentUser?['employeeId'];
        userId = currentUser?['_id'];
      }

      await Future.wait([
        _fetchPendingRequests(),
        if (assignedClass != null && assignedClass!.isNotEmpty) _fetchManagedSyllabuses(),
      ]);

    } catch (e) {
      _showToast("Failed to sync data", isError: true);
    } finally {
      if (mounted) setState(() => isLoading = false);
    }
  }

  Future<void> _fetchPendingRequests() async {
    try {
      final res = await ApiClient.dio.get('/exam-syllabus/pending');
      if (mounted) setState(() => pendingRequests = res.data ?? []);
    } catch (e) {
      debugPrint("Error pending: $e");
    }
  }

  Future<void> _fetchManagedSyllabuses() async {
    if (assignedClass == null) return;
    try {
      final res = await ApiClient.dio.get('/exam-syllabus/monitor/$assignedClass');
      if (mounted) setState(() => managedSyllabuses = res.data ?? []);
    } catch (e) {
      debugPrint("Error managed: $e");
    }
  }

  void _handleBack() {
    if (viewMode == 'monitor') {
      setState(() {
        viewMode = 'pending';
        selectedMonitorId = null;
      });
    } else {
      if (context.canPop()) {
        context.pop();
      } else {
        context.go('/teacher/home');
      }
    }
  }

  Future<void> _handleFinalInitiate() async {
    if (formDataTitle.isEmpty) {
      return _showToast("Please enter a Syllabus Title! ⚠️", isError: true);
    }

    setState(() => isActionLoading = true);
    try {
      await ApiClient.dio.post('/exam-syllabus/initiate', data: {
        'grade': assignedClass,
        'title': formDataTitle,
      });
      
      setState(() => formDataTitle = '');
      _showToast("Request Broadcasted Successfully! 📡");
      _fetchManagedSyllabuses();
      _fetchPendingRequests();
    } catch (e) {
      _showToast("Failed to initiate.", isError: true);
    } finally {
      setState(() => isActionLoading = false);
    }
  }

  Future<void> _handleEditorFinalSubmit() async {
    if (_editorCtrl.text.trim().isEmpty) {
      return _showToast("Content cannot be empty! ⚠️", isError: true);
    }

    setState(() => isActionLoading = true);
    try {
      if (editorData['mode'] == 'submit') {
        await ApiClient.dio.post('/exam-syllabus/submit/${editorData['syllabusId']}', data: {
          'subjectName': editorData['subjectName'],
          'content': _editorCtrl.text.trim(),
          'action': 'submit'
        });
      } else {
        await ApiClient.dio.put('/exam-syllabus/edit-subject/${editorData['syllabusId']}', data: {
          'subjectName': editorData['subjectName'],
          'content': _editorCtrl.text.trim()
        });
      }

      _showToast("Syllabus Saved Successfully! 📝");
      _fetchPendingRequests();
      if (assignedClass != null) _fetchManagedSyllabuses();
    } catch (e) {
      _showToast("Failed to save syllabus.", isError: true);
    } finally {
      setState(() => isActionLoading = false);
    }
  }

  Future<void> _executeActionConfirm(String action, String id) async {
    setState(() => isActionLoading = true);
    try {
      if (action == 'delete') {
        await ApiClient.dio.delete('/exam-syllabus/$id');
        _showToast("Syllabus Request Deleted! 🗑️");
        if (selectedMonitorId == id) setState(() => selectedMonitorId = null);
      } else if (action == 'publish') {
        await ApiClient.dio.put('/exam-syllabus/publish/$id');
        _showToast("Published to Students! 🚀");
      }
      _fetchManagedSyllabuses();
      _fetchPendingRequests();
    } catch (e) {
      _showToast("Action failed.", isError: true);
    } finally {
      setState(() => isActionLoading = false);
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

  @override
  Widget build(BuildContext context) {
    if (isLoading) return const CustomLoader();

    final themeMode = ref.watch(themeProvider);
    final bool isDarkMode = themeMode == ThemeMode.dark;

    final Color bgColor = isDarkMode ? const Color(0xFF0F172A) : const Color(0xFFF8FAFC);
    final Color cardColor = isDarkMode ? const Color(0xFF1E293B) : Colors.white;
    final Color cardBorder = isDarkMode ? const Color(0xFF334155) : const Color(0xFFDDE3EA);
    final Color textColorPrimary = isDarkMode ? const Color(0xFFF8FAFC) : const Color(0xFF1E293B);
    final Color textColorSecondary = isDarkMode ? const Color(0xFF94A3B8) : const Color(0xFF475569);

    return PopScope(
      canPop: false,
      onPopInvokedWithResult: (didPop, result) {
        if (didPop) return;
        _handleBack();
      },
      child: Scaffold(
        backgroundColor: bgColor,
        body: RefreshIndicator(
          color: const Color(0xFF42A5F5),
          backgroundColor: cardColor,
          onRefresh: () => _initData(isRefresh: true),
          child: CustomScrollView(
            physics: const AlwaysScrollableScrollPhysics(parent: ClampingScrollPhysics()),
            slivers: [
              SliverToBoxAdapter(
                child: Column(
                  children: [
                    // HEADER
                    Container(
                      padding: const EdgeInsets.only(top: 60, bottom: 40, left: 24, right: 24),
                      decoration: BoxDecoration(
                        gradient: LinearGradient(
                          colors: isDarkMode ? [const Color(0xFF1E3A8A), const Color(0xFF3B82F6)] : [const Color(0xFF64B5F6), const Color(0xFF42A5F5)],
                          begin: Alignment.topCenter, end: Alignment.bottomCenter,
                        ),
                        borderRadius: const BorderRadius.vertical(bottom: Radius.circular(55)),
                        boxShadow: const [BoxShadow(color: Colors.black12, blurRadius: 15, offset: Offset(0, 10))],
                      ),
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          GestureDetector(
                            onTap: _handleBack,
                            child: Container(
                              padding: const EdgeInsets.all(12),
                              decoration: BoxDecoration(color: Colors.white.withOpacity(0.2), borderRadius: BorderRadius.circular(16), border: Border.all(color: Colors.white.withOpacity(0.3))),
                              child: const Icon(Icons.arrow_back, color: Colors.white, size: 24),
                            ),
                          ),
                          Column(
                            children: [
                              Text(viewMode == 'monitor' ? "Monitor Hub" : "Class Syllabus", style: const TextStyle(fontSize: 24, fontWeight: FontWeight.w900, color: Colors.white, fontStyle: FontStyle.italic, letterSpacing: -0.5)),
                              Text(viewMode == 'monitor' ? "CLASS $assignedClass" : (assignedClass != null ? "MANAGE & SUBMIT" : "SUBMISSIONS"), style: TextStyle(fontSize: 9, fontWeight: FontWeight.w900, color: Colors.white.withOpacity(0.9), letterSpacing: 2)),
                            ],
                          ),
                          Container(
                            padding: const EdgeInsets.all(12),
                            decoration: BoxDecoration(color: Colors.white.withOpacity(0.2), borderRadius: BorderRadius.circular(16), border: Border.all(color: Colors.white.withOpacity(0.3))),
                            child: Icon(viewMode == 'monitor' ? Icons.dashboard : Icons.menu_book, color: Colors.white, size: 24),
                          ),
                        ],
                      ),
                    ).animate().slideY(begin: -0.2, duration: 500.ms),

                    // BODY
                    Transform.translate(
                      offset: const Offset(0, -20),
                      child: Padding(
                        padding: const EdgeInsets.symmetric(horizontal: 24),
                        child: AnimatedSwitcher(
                          duration: const Duration(milliseconds: 400),
                          child: viewMode == 'pending' 
                               ? _buildPendingView(isDarkMode, cardColor, cardBorder, textColorPrimary, textColorSecondary)
                               : _buildMonitorView(isDarkMode, cardColor, cardBorder, textColorPrimary, textColorSecondary),
                        ),
                      ),
                    ),
                    const SizedBox(height: 50),
                  ],
                ),
              )
            ],
          ),
        ),
      ),
    );
  }

  // --- VIEW 1: PENDING (SUBJECT TEACHER) ---
  Widget _buildPendingView(bool isDarkMode, Color cardColor, Color cardBorder, Color textColorPrimary, Color textColorSecondary) {
    return Column(
      key: const ValueKey('pending'),
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        if (assignedClass != null && assignedClass!.isNotEmpty) ...[
          Align(
            alignment: Alignment.centerRight,
            child: GestureDetector(
              onTap: () {
                setState(() {
                  viewMode = 'monitor';
                  selectedMonitorId = null;
                });
                Future.delayed(const Duration(milliseconds: 100), () => _showMonitorSelectionBottomSheet());
              },
              child: Container(
                padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
                decoration: BoxDecoration(color: cardColor, borderRadius: BorderRadius.circular(30), border: Border.all(color: cardBorder), boxShadow: const [BoxShadow(color: Colors.black12, blurRadius: 10, offset: Offset(0, 4))]),
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    const Icon(Icons.dashboard, color: Color(0xFF42A5F5), size: 18),
                    const SizedBox(width: 8),
                    Text("MONITOR HUB", style: TextStyle(fontSize: 11, fontWeight: FontWeight.w900, color: textColorPrimary, letterSpacing: 1.5, fontStyle: FontStyle.italic)),
                  ],
                ),
              ),
            ),
          ),
          const SizedBox(height: 16),
          Container(
            padding: const EdgeInsets.all(24),
            decoration: BoxDecoration(color: cardColor, borderRadius: BorderRadius.circular(40), border: Border.all(color: cardBorder), boxShadow: const [BoxShadow(color: Colors.black12, blurRadius: 15, offset: Offset(0, 5))]),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text("Manage Syllabus", style: TextStyle(fontSize: 18, fontWeight: FontWeight.w900, color: textColorPrimary, fontStyle: FontStyle.italic)),
                      const SizedBox(height: 4),
                      Text("INCHARGE: CLASS $assignedClass", style: const TextStyle(fontSize: 10, fontWeight: FontWeight.w900, color: Color(0xFF42A5F5), letterSpacing: 1.5)),
                    ],
                  ),
                ),
                GestureDetector(
                  onTap: _showInitiateModal,
                  child: Container(
                    padding: const EdgeInsets.all(16),
                    decoration: const BoxDecoration(color: Color(0xFF42A5F5), shape: BoxShape.circle, boxShadow: [BoxShadow(color: Color(0xFF42A5F5), blurRadius: 10, offset: Offset(0, 4))]),
                    child: const Icon(Icons.add, color: Colors.white, size: 28),
                  ),
                )
              ],
            ),
          ).animate().fadeIn(),
          const SizedBox(height: 30),
        ],

        Row(
          children: [
            const Icon(Icons.access_time_filled, color: Colors.amber, size: 20),
            const SizedBox(width: 8),
            Text("PENDING SUBMISSIONS", style: TextStyle(fontSize: 12, fontWeight: FontWeight.w900, color: textColorSecondary, letterSpacing: 2, fontStyle: FontStyle.italic)),
          ],
        ),
        const SizedBox(height: 16),

        if (pendingRequests.isEmpty)
          Container(
            width: double.infinity,
            padding: const EdgeInsets.symmetric(vertical: 40),
            decoration: BoxDecoration(color: cardColor, borderRadius: BorderRadius.circular(40), border: Border.all(color: cardBorder, style: BorderStyle.solid)),
            child: Column(
              children: [
                const Icon(Icons.check_circle, color: Color(0xFF10B981), size: 48).animate(onPlay: (c) => c.repeat(reverse: true)).slideY(begin: -0.1, end: 0.1),
                const SizedBox(height: 16),
                Text("ALL CAUGHT UP!", style: TextStyle(fontSize: 14, fontWeight: FontWeight.w900, color: textColorSecondary, fontStyle: FontStyle.italic, letterSpacing: 1.5)),
              ],
            ),
          )
        else
          ...pendingRequests.map((req) {
            List subjects = req['subjects'] ?? [];
            return Column(
              children: subjects.where((s) {
                List assigned = s['assignedTeachers'] ?? [];
                bool isMe = assigned.contains(employeeId) || assigned.contains(userId);
                return isMe && !(s['isSubmitted'] ?? false);
              }).map((sub) {
                return Container(
                  margin: const EdgeInsets.only(bottom: 20),
                  padding: const EdgeInsets.all(24),
                  decoration: BoxDecoration(color: cardColor, borderRadius: BorderRadius.circular(40), border: Border.all(color: cardBorder), boxShadow: const [BoxShadow(color: Colors.black12, blurRadius: 15, offset: Offset(0, 5))]),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(req['title'].toString().toUpperCase(), style: TextStyle(fontSize: 20, fontWeight: FontWeight.w900, color: textColorPrimary, fontStyle: FontStyle.italic)),
                      Text("CLASS: ${req['grade']}", style: TextStyle(fontSize: 10, fontWeight: FontWeight.w900, color: textColorSecondary, letterSpacing: 2)),
                      const SizedBox(height: 16),
                      Container(
                        padding: const EdgeInsets.all(16),
                        decoration: BoxDecoration(color: isDarkMode ? const Color(0xFF1E3A8A).withOpacity(0.3) : const Color(0xFFEFF6FF), borderRadius: BorderRadius.circular(20), border: Border.all(color: isDarkMode ? const Color(0xFF1E3A8A) : const Color(0xFFBFDBFE))),
                        child: Row(
                          children: [
                            const Icon(Icons.menu_book, color: Color(0xFF42A5F5), size: 24),
                            const SizedBox(width: 12),
                            Text(sub['subjectName'].toString().toUpperCase(), style: TextStyle(fontSize: 14, fontWeight: FontWeight.w900, color: isDarkMode ? Colors.white : const Color(0xFF1E3A8A), fontStyle: FontStyle.italic)),
                          ],
                        ),
                      ),
                      const SizedBox(height: 20),
                      GestureDetector(
                        onTap: () => _showEditorModal(req['_id'], req['title'], req['grade'], sub['subjectName'], '', 'submit'),
                        child: Container(
                          width: double.infinity,
                          padding: const EdgeInsets.symmetric(vertical: 16),
                          decoration: BoxDecoration(border: Border.all(color: const Color(0xFF42A5F5)), borderRadius: BorderRadius.circular(30)),
                          child: const Row(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              Icon(Icons.send, color: Color(0xFF42A5F5), size: 16),
                              SizedBox(width: 8),
                              Text("OPEN EDITOR", style: TextStyle(fontSize: 11, fontWeight: FontWeight.w900, color: Color(0xFF42A5F5), letterSpacing: 2, fontStyle: FontStyle.italic)),
                            ],
                          ),
                        ),
                      )
                    ],
                  ),
                ).animate().slideY(begin: 0.1);
              }).toList(),
            );
          }).toList(),
      ],
    );
  }

  // --- VIEW 2: MONITOR (CLASS TEACHER) ---
  Widget _buildMonitorView(bool isDarkMode, Color cardColor, Color cardBorder, Color textColorPrimary, Color textColorSecondary) {
    if (managedSyllabuses.isEmpty) {
      return Container(
        width: double.infinity,
        padding: const EdgeInsets.symmetric(vertical: 60),
        decoration: BoxDecoration(color: cardColor, borderRadius: BorderRadius.circular(40), border: Border.all(color: cardBorder, style: BorderStyle.solid)),
        child: Column(
          children: [
            const Icon(Icons.warning_amber_rounded, color: Colors.grey, size: 48).animate(onPlay: (c) => c.repeat(reverse: true)).slideY(begin: -0.1, end: 0.1),
            const SizedBox(height: 16),
            Text("NO SYLLABUS INITIATED", style: TextStyle(fontSize: 14, fontWeight: FontWeight.w900, color: textColorSecondary, fontStyle: FontStyle.italic, letterSpacing: 1.5)),
          ],
        ),
      );
    }

    if (selectedMonitorId == null || !managedSyllabuses.any((r) => r['_id'] == selectedMonitorId)) {
      return GestureDetector(
        onTap: _showMonitorSelectionBottomSheet,
        child: Container(
          width: double.infinity,
          padding: const EdgeInsets.symmetric(vertical: 40),
          decoration: BoxDecoration(color: cardColor, borderRadius: BorderRadius.circular(40), border: Border.all(color: const Color(0xFF42A5F5), width: 2), boxShadow: [BoxShadow(color: const Color(0xFF42A5F5).withOpacity(0.2), blurRadius: 15)]),
          child: Column(
            children: [
              const Icon(Icons.touch_app, color: Color(0xFF42A5F5), size: 48).animate(onPlay: (c) => c.repeat(reverse: true)).scale(),
              const SizedBox(height: 16),
              const Text("TAP TO SELECT SYLLABUS", style: TextStyle(fontSize: 14, fontWeight: FontWeight.w900, color: Color(0xFF42A5F5), fontStyle: FontStyle.italic, letterSpacing: 1.5)),
            ],
          ),
        ),
      ).animate().fadeIn();
    }

    final syllabus = managedSyllabuses.firstWhere((r) => r['_id'] == selectedMonitorId);
    bool allSubmitted = (syllabus['subjects'] as List).every((s) => s['isSubmitted'] == true);
    bool isPublished = syllabus['status'] == 'published';
    bool isEditMode = editModes[syllabus['_id']] ?? false;

    return Column(
      key: const ValueKey('monitor'),
      children: [
        Align(
          alignment: Alignment.centerRight,
          child: GestureDetector(
            onTap: _showMonitorSelectionBottomSheet,
            child: Container(
              margin: const EdgeInsets.only(bottom: 16),
              padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
              decoration: BoxDecoration(color: const Color(0xFFEFF6FF), borderRadius: BorderRadius.circular(30), border: Border.all(color: const Color(0xFFBFDBFE))),
              child: const Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Icon(Icons.swap_horiz, color: Color(0xFF42A5F5), size: 18),
                  SizedBox(width: 8),
                  Text("CHANGE SYLLABUS", style: TextStyle(fontSize: 11, fontWeight: FontWeight.w900, color: Color(0xFF42A5F5), letterSpacing: 1.5, fontStyle: FontStyle.italic)),
                ],
              ),
            ),
          ),
        ),

        Container(
          margin: const EdgeInsets.only(bottom: 24),
          padding: const EdgeInsets.all(24),
          decoration: BoxDecoration(color: cardColor, borderRadius: BorderRadius.circular(40), border: Border.all(color: isEditMode ? const Color(0xFF42A5F5) : cardBorder, width: isEditMode ? 2 : 1), boxShadow: const [BoxShadow(color: Colors.black12, blurRadius: 15, offset: Offset(0, 5))]),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(syllabus['title'].toString().toUpperCase(), style: TextStyle(fontSize: 17, fontWeight: FontWeight.w900, color: textColorPrimary, fontStyle: FontStyle.italic)),
                        const SizedBox(height: 6),
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
                          decoration: BoxDecoration(color: isPublished ? const Color(0xFFEFF6FF) : const Color(0xFFFFFBEB), borderRadius: BorderRadius.circular(20)),
                          child: Text("STATUS: ${syllabus['status']}", style: TextStyle(fontSize: 8, fontWeight: FontWeight.w900, color: isPublished ? const Color(0xFF42A5F5) : Colors.amber, letterSpacing: 1.5)),
                        )
                      ],
                    ),
                  ),
                  Row(
                    children: [
                      if (isPublished)
                        GestureDetector(
                          onTap: () => setState(() => editModes[syllabus['_id']] = !isEditMode),
                          child: Container(
                            padding: const EdgeInsets.all(12),
                            margin: const EdgeInsets.only(right: 8),
                            decoration: BoxDecoration(color: isEditMode ? const Color(0xFF1E293B) : const Color(0xFFEFF6FF), borderRadius: BorderRadius.circular(16)),
                            child: Icon(isEditMode ? Icons.close : Icons.edit, size: 16, color: isEditMode ? Colors.white : const Color(0xFF42A5F5)),
                          ),
                        ),
                      GestureDetector(
                        onTap: () => _showActionModal('delete', syllabus['_id']),
                        child: Container(
                          padding: const EdgeInsets.all(12),
                          decoration: BoxDecoration(color: const Color(0xFFFEF2F2), borderRadius: BorderRadius.circular(16)),
                          child: const Icon(Icons.delete, size: 16, color: Colors.red),
                        ),
                      )
                    ],
                  )
                ],
              ),
              const SizedBox(height: 24),
              ...(syllabus['subjects'] as List).map((sub) {
                bool showSubjectEdit = sub['isSubmitted'] && (!isPublished || isEditMode);
                return Container(
                  // Sirf margin rakha hai taaki subjects aapas mein chipke na
                  margin: const EdgeInsets.only(bottom: 24),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(sub['subjectName'].toString().toUpperCase(), style: TextStyle(fontSize: 14, fontWeight: FontWeight.w900, color: textColorPrimary)),
                              const SizedBox(height: 4),
                              Row(
                                children: [
                                  Icon(sub['isSubmitted'] ? Icons.check_circle : Icons.access_time, size: 12, color: sub['isSubmitted'] ? const Color(0xFF42A5F5) : Colors.amber),
                                  const SizedBox(width: 4),
                                  Text(sub['isSubmitted'] ? "Compiled Successfully" : "Pending Entry", style: TextStyle(fontSize: 9, fontWeight: FontWeight.w900, color: sub['isSubmitted'] ? const Color(0xFF42A5F5) : Colors.amber, letterSpacing: 0)),
                                ],
                              )
                            ],
                          ),
                          if (showSubjectEdit)
                            GestureDetector(
                              onTap: () => _showEditorModal(syllabus['_id'], syllabus['title'], syllabus['grade'], sub['subjectName'], sub['content'], 'edit'),
                              child: Container(
                                padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                                decoration: BoxDecoration(border: Border.all(color: const Color(0xFF42A5F5)), borderRadius: BorderRadius.circular(16)),
                                child: const Text("EDIT", style: TextStyle(fontSize: 10, fontWeight: FontWeight.w900, color: Color(0xFF42A5F5), letterSpacing: 1.5)),
                              ),
                            )
                        ],
                      ),
                      if (sub['isSubmitted']) ...[
                        const SizedBox(height: 12),
                        // Content ke peeche se bhi dabba hata diya, sirf ek cool left border rakha hai quote ki tarah
                        Container(
                          padding: const EdgeInsets.only(left: 12, top: 4, bottom: 4),
                          decoration: const BoxDecoration(
                            border: Border(left: BorderSide(color: Color(0xFF42A5F5), width: 3))
                          ),
                          child: Text(sub['content'].toString(), maxLines: 2, overflow: TextOverflow.ellipsis, style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: textColorSecondary, fontStyle: FontStyle.italic)),
                        )
                      ]
                    ],
                  ),
                );
              }).toList(),
              const SizedBox(height: 16),
              if (!isPublished && allSubmitted)
                GestureDetector(
                  onTap: () => _showActionModal('publish', syllabus['_id']),
                  child: Container(
                    width: double.infinity,
                    padding: const EdgeInsets.symmetric(vertical: 16),
                    decoration: BoxDecoration(gradient: const LinearGradient(colors: [Color(0xFF34D399), Color(0xFF10B981)]), borderRadius: BorderRadius.circular(30), boxShadow: [BoxShadow(color: const Color(0xFF10B981).withOpacity(0.4), blurRadius: 10, offset: const Offset(0, 4))]),
                    child: const Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Icon(Icons.check_circle_outline, color: Colors.white, size: 20),
                        SizedBox(width: 8),
                        Text("PUBLISH TO STUDENTS", style: TextStyle(fontSize: 11, fontWeight: FontWeight.w900, color: Colors.white, letterSpacing: 2, fontStyle: FontStyle.italic)),
                      ],
                    ),
                  ),
                ),
              if (isPublished && !isEditMode)
                Container(
                  width: double.infinity,
                  padding: const EdgeInsets.symmetric(vertical: 16),
                  decoration: BoxDecoration(color: const Color(0xFFEFF6FF), border: Border.all(color: const Color(0xFF42A5F5)), borderRadius: BorderRadius.circular(30)),
                  child: const Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Icon(Icons.check_circle, color: Color(0xFF42A5F5), size: 20),
                      SizedBox(width: 8),
                      Text("PUBLISHED", style: TextStyle(fontSize: 11, fontWeight: FontWeight.w900, color: Color(0xFF42A5F5), letterSpacing: 2, fontStyle: FontStyle.italic)),
                    ],
                  ),
                ),
              if (isPublished && isEditMode)
                GestureDetector(
                  onTap: () {
                    setState(() => editModes[syllabus['_id']] = false);
                    _showToast("Syllabus Updated Successfully! ✨");
                  },
                  child: Container(
                    width: double.infinity,
                    padding: const EdgeInsets.symmetric(vertical: 16),
                    decoration: BoxDecoration(color: const Color(0xFF42A5F5), borderRadius: BorderRadius.circular(30), boxShadow: [BoxShadow(color: const Color(0xFF42A5F5).withOpacity(0.4), blurRadius: 10, offset: const Offset(0, 4))]),
                    child: const Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Icon(Icons.update, color: Colors.white, size: 20),
                        SizedBox(width: 8),
                        Text("UPDATE CHANGES", style: TextStyle(fontSize: 11, fontWeight: FontWeight.w900, color: Colors.white, letterSpacing: 2, fontStyle: FontStyle.italic)),
                      ],
                    ),
                  ),
                ),
            ],
          ),
        ).animate().slideY(begin: 0.1),
      ],
    );
  }

  // --- MODALS (Initiate, Editor, Confirm, Action) ---
  void _showInitiateModal() {
    showGeneralDialog(
      context: context,
      barrierDismissible: true,
      barrierLabel: 'Initiate',
      transitionDuration: const Duration(milliseconds: 300),
      pageBuilder: (ctx, anim1, anim2) {
        return StatefulBuilder(
          builder: (context, setStateModal) {
            final themeMode = ref.watch(themeProvider);
            final bool isDark = themeMode == ThemeMode.dark;
            return Scaffold(
              backgroundColor: Colors.transparent,
              body: Stack(
                children: [
                  GestureDetector(onTap: () => Navigator.pop(ctx), child: Container(color: Colors.black.withOpacity(0.6))),
                  Center(
                    child: Container(
                      width: MediaQuery.of(context).size.width * 0.9,
                      padding: const EdgeInsets.all(24),
                      decoration: BoxDecoration(color: isDark ? const Color(0xFF1E293B) : Colors.white, borderRadius: BorderRadius.circular(40), border: Border.all(color: isDark ? const Color(0xFF334155) : const Color(0xFFDDE3EA))),
                      child: Column(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              const Text("NEW REQUEST", style: TextStyle(fontSize: 18, fontWeight: FontWeight.w900, color: Color(0xFF42A5F5), fontStyle: FontStyle.italic)),
                              GestureDetector(onTap: () => Navigator.pop(ctx), child: const Icon(Icons.close, color: Colors.grey))
                            ],
                          ),
                          const SizedBox(height: 24),
                          Container(
                            padding: const EdgeInsets.all(16),
                            decoration: BoxDecoration(color: const Color(0xFFEFF6FF), borderRadius: BorderRadius.circular(20), border: Border.all(color: const Color(0xFFBFDBFE))),
                            child: Row(
                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                              children: [
                                Text("CLASS $assignedClass", style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w900, color: Color(0xFF1E3A8A))),
                                const Text("LOCKED TARGET", style: TextStyle(fontSize: 9, fontWeight: FontWeight.w900, color: Color(0xFF42A5F5), letterSpacing: 1.5)),
                              ],
                            ),
                          ),
                          const SizedBox(height: 16),
                          TextField(
                            style: TextStyle(fontSize: 14, fontWeight: FontWeight.w900, color: isDark ? Colors.white : Colors.black),
                            decoration: InputDecoration(
                              hintText: 'SYLLABUS TITLE (e.g. Half Yearly)',
                              hintStyle: const TextStyle(fontSize: 11, fontWeight: FontWeight.w900, letterSpacing: 1.5, color: Colors.grey),
                              filled: true,
                              fillColor: isDark ? const Color(0xFF0F172A) : const Color(0xFFF8FAFC),
                              contentPadding: const EdgeInsets.all(20),
                              enabledBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(20), borderSide: BorderSide(color: isDark ? const Color(0xFF334155) : const Color(0xFFE2E8F0))),
                              focusedBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(20), borderSide: const BorderSide(color: Color(0xFF42A5F5), width: 2)),
                            ),
                            onChanged: (val) => formDataTitle = val,
                          ),
                          const SizedBox(height: 24),
                          GestureDetector(
                            onTap: () {
                              if(formDataTitle.trim().isEmpty) {
                                _showToast("Title is required!", isError: true);
                                return;
                              }
                              Navigator.pop(ctx);
                              _showConfirmModal('initiate');
                            },
                            child: Container(
                              width: double.infinity,
                              padding: const EdgeInsets.symmetric(vertical: 20),
                              decoration: BoxDecoration(color: const Color(0xFF42A5F5), borderRadius: BorderRadius.circular(30)),
                              child: const Text("CONTINUE", textAlign: TextAlign.center, style: TextStyle(fontSize: 12, fontWeight: FontWeight.w900, color: Colors.white, letterSpacing: 2)),
                            ),
                          )
                        ],
                      ),
                    ),
                  ).animate().scale(curve: Curves.easeOutBack),
                ],
              ),
            );
          },
        );
      },
    );
  }

  void _showEditorModal(String syllabusId, String title, String grade, String subjectName, String content, String mode) {
    setState(() {
      editorData = {'syllabusId': syllabusId, 'title': title, 'grade': grade, 'subjectName': subjectName, 'mode': mode};
      _editorCtrl.text = content;
    });

    showGeneralDialog(
      context: context,
      barrierDismissible: true,
      barrierLabel: 'Editor',
      transitionDuration: const Duration(milliseconds: 300),
      pageBuilder: (ctx, _, __) {
        final themeMode = ref.watch(themeProvider);
        final bool isDark = themeMode == ThemeMode.dark;
        return Scaffold(
          backgroundColor: Colors.transparent,
          body: Stack(
            children: [
              GestureDetector(onTap: () => Navigator.pop(ctx), child: Container(color: Colors.black.withOpacity(0.6))),
              Center(
                child: Container(
                  width: MediaQuery.of(context).size.width * 0.9,
                  padding: const EdgeInsets.all(24),
                  decoration: BoxDecoration(color: isDark ? const Color(0xFF1E293B) : Colors.white, borderRadius: BorderRadius.circular(40)),
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Expanded(child: Text(title.toUpperCase(), style: TextStyle(fontSize: 18, fontWeight: FontWeight.w900, color: isDark ? Colors.white : Colors.black, fontStyle: FontStyle.italic))),
                          GestureDetector(onTap: () => Navigator.pop(ctx), child: const Icon(Icons.close, color: Colors.grey))
                        ],
                      ),
                      const SizedBox(height: 12),
                      Row(
                        children: [
                          Container(padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4), decoration: BoxDecoration(color: isDark ? const Color(0xFF0F172A) : Colors.grey.shade100, borderRadius: BorderRadius.circular(10)), child: Text("CLASS $grade", style: const TextStyle(fontSize: 9, fontWeight: FontWeight.w900, color: Colors.grey, letterSpacing: 1.5))),
                          const SizedBox(width: 8),
                          Container(padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4), decoration: BoxDecoration(color: const Color(0xFFEFF6FF), borderRadius: BorderRadius.circular(10)), child: Text(subjectName.toUpperCase(), style: const TextStyle(fontSize: 9, fontWeight: FontWeight.w900, color: Color(0xFF42A5F5), letterSpacing: 1.5))),
                        ],
                      ),
                      const SizedBox(height: 24),
                      TextField(
                        controller: _editorCtrl,
                        maxLines: 6,
                        style: TextStyle(fontSize: 14, fontWeight: FontWeight.bold, color: isDark ? Colors.white : Colors.black, fontStyle: FontStyle.italic),
                        decoration: InputDecoration(
                          hintText: "Type chapters, topics, or detailed syllabus here...",
                          hintStyle: const TextStyle(fontSize: 12, color: Colors.grey),
                          filled: true,
                          fillColor: isDark ? const Color(0xFF0F172A) : const Color(0xFFF8FAFC),
                          border: OutlineInputBorder(borderRadius: BorderRadius.circular(20), borderSide: BorderSide.none),
                        ),
                      ),
                      const SizedBox(height: 24),
                      GestureDetector(
                        onTap: () {
                          Navigator.pop(ctx);
                          _showConfirmModal('editor');
                        },
                        child: Container(
                          width: double.infinity,
                          padding: const EdgeInsets.symmetric(vertical: 20),
                          decoration: BoxDecoration(color: const Color(0xFF42A5F5), borderRadius: BorderRadius.circular(30)),
                          child: const Text("SAVE & CONTINUE", textAlign: TextAlign.center, style: TextStyle(fontSize: 12, fontWeight: FontWeight.w900, color: Colors.white, letterSpacing: 2)),
                        ),
                      )
                    ],
                  ),
                ).animate().scale(curve: Curves.easeOutBack),
              ),
            ],
          ),
        );
      },
    );
  }

  void _showConfirmModal(String type) {
    showGeneralDialog(
      context: context,
      barrierDismissible: true,
      barrierLabel: 'Confirm',
      transitionDuration: const Duration(milliseconds: 300),
      pageBuilder: (ctx, _, __) {
        final themeMode = ref.watch(themeProvider);
        final bool isDark = themeMode == ThemeMode.dark;
        return Scaffold(
          backgroundColor: Colors.transparent,
          body: Stack(
            children: [
              GestureDetector(onTap: () => Navigator.pop(ctx), child: Container(color: Colors.black.withOpacity(0.6))),
              Center(
                child: Container(
                  width: MediaQuery.of(context).size.width * 0.85,
                  padding: const EdgeInsets.all(32),
                  decoration: BoxDecoration(color: isDark ? const Color(0xFF1E293B) : Colors.white, borderRadius: BorderRadius.circular(40)),
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Container(padding: const EdgeInsets.all(20), decoration: const BoxDecoration(color: Color(0xFFFFFBEB), shape: BoxShape.circle), child: const Icon(Icons.warning_amber_rounded, color: Colors.amber, size: 40)),
                      const SizedBox(height: 24),
                      const Text("CONFIRM ACTION", style: TextStyle(fontSize: 18, fontWeight: FontWeight.w900, fontStyle: FontStyle.italic)),
                      const SizedBox(height: 12),
                      Text(type == 'initiate' ? "Request '$formDataTitle' syllabus from all Class $assignedClass teachers?" : "Save syllabus content for ${editorData['subjectName']}?", textAlign: TextAlign.center, style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: Colors.grey, height: 1.5)),
                      const SizedBox(height: 32),
                      Row(
                        children: [
                          Expanded(
                            child: GestureDetector(
                              onTap: () => Navigator.pop(ctx),
                              child: Container(padding: const EdgeInsets.symmetric(vertical: 16), decoration: BoxDecoration(color: isDark ? const Color(0xFF0F172A) : const Color(0xFFF1F5F9), borderRadius: BorderRadius.circular(20)), child: Text("CANCEL", textAlign: TextAlign.center, style: TextStyle(fontSize: 11, fontWeight: FontWeight.w900, color: isDark ? Colors.white : Colors.black, letterSpacing: 1.5))),
                            ),
                          ),
                          const SizedBox(width: 12),
                          Expanded(
                            child: GestureDetector(
                              onTap: () {
                                Navigator.pop(ctx);
                                type == 'initiate' ? _handleFinalInitiate() : _handleEditorFinalSubmit();
                              },
                              child: Container(padding: const EdgeInsets.symmetric(vertical: 16), decoration: BoxDecoration(color: const Color(0xFF42A5F5), borderRadius: BorderRadius.circular(20)), child: const Text("CONFIRM", textAlign: TextAlign.center, style: TextStyle(fontSize: 11, fontWeight: FontWeight.w900, color: Colors.white, letterSpacing: 1.5))),
                            ),
                          ),
                        ],
                      )
                    ],
                  ),
                ).animate().scale(curve: Curves.easeOutBack),
              ),
            ],
          ),
        );
      },
    );
  }

  void _showActionModal(String action, String id) {
    showGeneralDialog(
      context: context,
      barrierDismissible: true,
      barrierLabel: 'Action',
      transitionDuration: const Duration(milliseconds: 300),
      pageBuilder: (ctx, _, __) {
        final themeMode = ref.watch(themeProvider);
        final bool isDark = themeMode == ThemeMode.dark;
        return Scaffold(
          backgroundColor: Colors.transparent,
          body: Stack(
            children: [
              GestureDetector(onTap: () => Navigator.pop(ctx), child: Container(color: Colors.black.withOpacity(0.6))),
              Center(
                child: Container(
                  width: MediaQuery.of(context).size.width * 0.85,
                  padding: const EdgeInsets.all(32),
                  decoration: BoxDecoration(color: isDark ? const Color(0xFF1E293B) : Colors.white, borderRadius: BorderRadius.circular(40)),
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Container(padding: const EdgeInsets.all(20), decoration: BoxDecoration(color: action == 'delete' ? const Color(0xFFFEF2F2) : const Color(0xFFECFDF5), shape: BoxShape.circle), child: Icon(action == 'delete' ? Icons.delete : Icons.check_circle, color: action == 'delete' ? Colors.red : const Color(0xFF10B981), size: 40)),
                      const SizedBox(height: 24),
                      const Text("ARE YOU SURE?", style: TextStyle(fontSize: 18, fontWeight: FontWeight.w900, fontStyle: FontStyle.italic)),
                      const SizedBox(height: 12),
                      Text(action == 'delete' ? "Delete this entire syllabus request? It will be removed from all teachers and students!" : "Publish to students? They will now see this in their dashboard.", textAlign: TextAlign.center, style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: Colors.grey, height: 1.5)),
                      const SizedBox(height: 32),
                      Row(
                        children: [
                          Expanded(
                            child: GestureDetector(
                              onTap: () => Navigator.pop(ctx),
                              child: Container(padding: const EdgeInsets.symmetric(vertical: 16), decoration: BoxDecoration(color: isDark ? const Color(0xFF0F172A) : const Color(0xFFF1F5F9), borderRadius: BorderRadius.circular(20)), child: Text("CANCEL", textAlign: TextAlign.center, style: TextStyle(fontSize: 11, fontWeight: FontWeight.w900, color: isDark ? Colors.white : Colors.black, letterSpacing: 1.5))),
                            ),
                          ),
                          const SizedBox(width: 12),
                          Expanded(
                            child: GestureDetector(
                              onTap: () {
                                Navigator.pop(ctx);
                                _executeActionConfirm(action, id);
                              },
                              child: Container(padding: const EdgeInsets.symmetric(vertical: 16), decoration: BoxDecoration(color: action == 'delete' ? Colors.red : const Color(0xFF10B981), borderRadius: BorderRadius.circular(20)), child: const Text("YES, CONFIRM", textAlign: TextAlign.center, style: TextStyle(fontSize: 11, fontWeight: FontWeight.w900, color: Colors.white, letterSpacing: 1.5))),
                            ),
                          ),
                        ],
                      )
                    ],
                  ),
                ).animate().scale(curve: Curves.easeOutBack),
              ),
            ],
          ),
        );
      },
    );
  }

  void _showMonitorSelectionBottomSheet() {
    final themeMode = ref.watch(themeProvider);
    final bool isDark = themeMode == ThemeMode.dark;

    showModalBottomSheet(
      context: context,
      backgroundColor: Colors.transparent,
      isScrollControlled: true,
      builder: (context) {
        return Container(
          height: MediaQuery.of(context).size.height * 0.6,
          padding: const EdgeInsets.only(top: 12, left: 24, right: 24, bottom: 24),
          decoration: BoxDecoration(
            color: isDark ? const Color(0xFF1E293B) : Colors.white,
            borderRadius: const BorderRadius.vertical(top: Radius.circular(40)),
            border: Border(top: BorderSide(color: isDark ? const Color(0xFF334155) : const Color(0xFFDDE3EA), width: 2)),
          ),
          child: Column(
            children: [
              Container(width: 50, height: 5, margin: const EdgeInsets.only(bottom: 24), decoration: BoxDecoration(color: isDark ? const Color(0xFF334155) : Colors.grey.shade300, borderRadius: BorderRadius.circular(10))),
              const Text("SELECT SYLLABUS TO MONITOR", style: TextStyle(fontSize: 14, fontWeight: FontWeight.w900, color: Color(0xFF42A5F5), fontStyle: FontStyle.italic, letterSpacing: 1)),
              const SizedBox(height: 16),
              
              Expanded(
                child: managedSyllabuses.isEmpty
                  ? Center(child: Text("NO ACTIVE SYLLABUS FOUND", style: TextStyle(fontSize: 12, fontWeight: FontWeight.w900, color: Colors.grey.shade400, letterSpacing: 1.5)))
                  : ListView.builder(
                  physics: const BouncingScrollPhysics(),
                  itemCount: managedSyllabuses.length,
                  itemBuilder: (context, index) {
                    final res = managedSyllabuses[index];
                    bool isPublished = res['status'] == 'published';
                    
                    return GestureDetector(
                      onTap: () {
                        setState(() => selectedMonitorId = res['_id']);
                        Navigator.pop(context);
                      },
                      child: Container(
                        margin: const EdgeInsets.only(bottom: 12),
                        padding: const EdgeInsets.all(20),
                        decoration: BoxDecoration(color: isDark ? const Color(0xFF0F172A) : const Color(0xFFF8FAFC), borderRadius: BorderRadius.circular(25), border: Border.all(color: isDark ? const Color(0xFF334155) : const Color(0xFFE2E8F0))),
                        child: Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Expanded(child: Text(res['title'].toString().toUpperCase(), style: TextStyle(fontSize: 13, fontWeight: FontWeight.w900, color: isDark ? Colors.white : Colors.black87))),
                            Container(
                              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                              decoration: BoxDecoration(color: isPublished ? const Color(0xFFEFF6FF) : const Color(0xFFFFFBEB), borderRadius: BorderRadius.circular(12)),
                              child: Text(isPublished ? "PUBLISHED" : "PENDING", style: TextStyle(fontSize: 9, fontWeight: FontWeight.w900, color: isPublished ? const Color(0xFF42A5F5) : Colors.amber, letterSpacing: 1)),
                            )
                          ],
                        ),
                      ),
                    );
                  },
                ),
              ),
            ],
          ),
        );
      },
    );
  }
}