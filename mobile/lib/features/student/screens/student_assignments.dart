import 'dart:convert';
import 'dart:io';
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:url_launcher/url_launcher.dart';
import 'package:intl/intl.dart';
import 'package:file_selector/file_selector.dart';
import 'package:path_provider/path_provider.dart'; // 🔥 NAYA IMPORT FOR DIRECTORY PATHS
import 'package:dio/dio.dart';
import '../../../core/network/api_client.dart';
import '../../../shared/widgets/custom_loader.dart';
import '../../../core/theme/theme_provider.dart';
import '../../../core/constants/app_config.dart';

class StudentAssignments extends ConsumerStatefulWidget {
  const StudentAssignments({super.key});

  @override
  ConsumerState<StudentAssignments> createState() => _StudentAssignmentsState();
}

class _StudentAssignmentsState extends ConsumerState<StudentAssignments> {
  bool loading = true;
  bool uploading = false;
  Map<String, dynamic>? user;

  List<dynamic> assignments = [];
  List<dynamic> mySubmissions = [];

  String view = 'pending'; // 'pending' or 'history'

  XFile? submitFile;
  String submitUrl = '';

  @override
  void initState() {
    super.initState();
    _initializeData();
  }

  Future<void> _initializeData() async {
    final prefs = await SharedPreferences.getInstance();
    final userStr = prefs.getString('user');
    if (userStr != null) {
      user = jsonDecode(userStr);
    }
    await _fetchAllData();
  }

  Future<void> _fetchAllData() async {
    if (user == null) return;
    try {
      setState(() => loading = true);

      // 1. Saare assignments laao
      final allAsgnRes =
          await ApiClient.dio.get('/assignments/${user?['grade']}');
      List<dynamic> allAsgn = allAsgnRes.data;

      // 2. Bache ki submissions laao
      final subsRes =
          await ApiClient.dio.get('/assignments/student/my-submissions');
      List<dynamic> subs = subsRes.data;

      // 3. Filter: Sirf wo dikhao jinki ID submissions mein nahi hai
      List<String> submittedIds = subs
          .where(
              (s) => s['assignment'] != null && s['assignment']['_id'] != null)
          .map((s) => s['assignment']['_id'].toString())
          .toList();

      List<dynamic> pending = allAsgn
          .where((a) => !submittedIds.contains(a['_id'].toString()))
          .toList();

      if (mounted) {
        setState(() {
          mySubmissions = subs;
          assignments = pending;
          loading = false;
        });
      }
    } catch (err) {
      debugPrint("Sync Error: $err");
      if (mounted) setState(() => loading = false);
    }
  }

  bool _isExpired(String? dateStr) {
    if (dateStr == null) return false;
    return DateTime.parse(dateStr).isBefore(DateTime.now());
  }

  Future<void> _handleSubmission() async {
    final XFile? selectedFile = await openFile();
    if (selectedFile == null) return;

    setState(() => uploading = true);

    try {
      FormData formData = FormData.fromMap({
        'file': await MultipartFile.fromFile(selectedFile.path,
            filename: selectedFile.name),
      });

      final response = await ApiClient.dio.post('/upload', data: formData);

      if (mounted) {
        setState(() {
          submitUrl = response.data.toString();
          submitFile = selectedFile;
          uploading = false;
        });
      }
    } catch (err) {
      _showToast("Uplink Failed", isError: true);
      if (mounted) setState(() => uploading = false);
    }
  }

  Future<void> _confirmSubmit(String id) async {
    try {
      await ApiClient.dio.post('/assignments/submit',
          data: {'assignmentId': id, 'fileUrl': submitUrl});

      setState(() {
        assignments.removeWhere((item) => item['_id'] == id);
        submitFile = null;
        submitUrl = '';
      });

      _showToast("Task Synchronized Successfully! ✅");
      _fetchAllData(); // Refresh history
    } catch (err) {
      _showToast("Submission Failed", isError: true);
    }
  }

  // 🔥 HIGH-PERFORMANCE NATIVE DOWNLOAD SYSTEM 🔥
  Future<void> _downloadResource(String? urlStr) async {
    if (urlStr == null || urlStr.isEmpty) return;

    _showToast("Downloading resource file... 📥");

   try {
      final String remoteUrl = AppConfig.getAbsoluteUrl(urlStr); // 🔥 CONFIG SE URL UTHAO
      final String fileName = urlStr.split('/').last;

      // Android Public Downloads folder path
      String localPath = "/storage/emulated/0/Download/$fileName";

      try {
        await ApiClient.dio.download(remoteUrl, localPath);
        _showToast("File saved securely in phone 'Downloads' folder! ✅");
      } catch (e) {
        final Directory? extDir = await getExternalStorageDirectory();
        if (extDir != null) {
          localPath = "${extDir.path}/$fileName";
          await ApiClient.dio.download(remoteUrl, localPath);
          _showToast("Saved in Institutional App Ledger! ✅");
        } else {
          throw Exception("Storage Unavailable");
        }
      }
    } catch (err) {
      debugPrint("Download Core Error: $err");
      _showToast("Direct download failed. Routing via browser...", isError: true);

      // FALLBACK: Browser me khol do agar direct download na chale
      final Uri url = Uri.parse(AppConfig.getAbsoluteUrl(urlStr));
      if (await canLaunchUrl(url)) {
        await launchUrl(url, mode: LaunchMode.externalApplication);
      }
    }
  }

  void _showToast(String message, {bool isError = false}) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Row(
          children: [
            Icon(isError ? Icons.error : Icons.check_circle,
                color: Colors.white, size: 20),
            const SizedBox(width: 10),
            Expanded(
                child: Text(message,
                    style: const TextStyle(
                        fontWeight: FontWeight.w900,
                        fontStyle: FontStyle.italic,
                        fontSize: 13))),
          ],
        ),
        backgroundColor:
            isError ? const Color(0xFFF43F5E) : const Color(0xFF10B981),
        behavior: SnackBarBehavior.floating,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
        margin: const EdgeInsets.all(20),
        duration: const Duration(seconds: 3),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    if (loading) return const CustomLoader();

    final themeMode = ref.watch(themeProvider);
    final bool isDarkMode = themeMode == ThemeMode.dark;

    final Color bgColor =
        isDarkMode ? const Color(0xFF0F172A) : const Color(0xFFF8FAFC);
    final Color cardColor = isDarkMode ? const Color(0xFF1E293B) : Colors.white;
    final Color cardBorder =
        isDarkMode ? const Color(0xFF334155) : const Color(0xFFF1F5F9);
    final Color textColorPrimary =
        isDarkMode ? const Color(0xFFF8FAFC) : const Color(0xFF1E293B);
    final Color textColorSecondary =
        isDarkMode ? const Color(0xFF94A3B8) : const Color(0xFF94A3B8);
    final Color subtleBg =
        isDarkMode ? const Color(0xFF0F172A) : const Color(0xFFF8FAFC);

    return PopScope(
      canPop: false,
      onPopInvokedWithResult: (didPop, result) {
        if (didPop) return;
        if (context.canPop())
          context.pop();
        else
          context.go('/');
      },
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 500),
        color: bgColor,
        child: Scaffold(
          backgroundColor: Colors.transparent,
          body: RefreshIndicator(
            color: const Color(0xFF42A5F5),
            backgroundColor: cardColor,
            onRefresh: _fetchAllData,
            child: CustomScrollView(
              physics: const AlwaysScrollableScrollPhysics(),
              slivers: [
                SliverToBoxAdapter(
                  child: Column(
                    children: [
                      // --- BLUE HEADER SECTION ---
                      Container(
                        width: double.infinity,
                        padding: const EdgeInsets.only(
                            top: 60, bottom: 80, left: 24, right: 24),
                        decoration: BoxDecoration(
                          color: const Color(0xFF42A5F5),
                          gradient: LinearGradient(
                            colors: isDarkMode
                                ? [
                                    const Color(0xFF1E3A8A),
                                    const Color(0xFF3B82F6)
                                  ]
                                : [
                                    const Color(0xFF64B5F6),
                                    const Color(0xFF42A5F5)
                                  ],
                            begin: Alignment.topCenter,
                            end: Alignment.bottomCenter,
                          ),
                          borderRadius: const BorderRadius.vertical(
                              bottom: Radius.circular(55)),
                          boxShadow: const [
                            BoxShadow(
                                color: Colors.black12,
                                blurRadius: 15,
                                offset: Offset(0, 10))
                          ],
                        ),
                        child: Column(
                          children: [
                            // --- TOP ROW (Back Button | Title & Subtitle | Right Icon) ---
                            Row(
                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                // BACK BUTTON
                                GestureDetector(
                                  onTap: () {
                                    if (context.canPop())
                                      context.pop();
                                    else
                                      context.go('/');
                                  },
                                  child: Container(
                                    padding: const EdgeInsets.all(12),
                                    decoration: BoxDecoration(
                                      color: Colors.white.withOpacity(0.2),
                                      borderRadius: BorderRadius.circular(16),
                                      border: Border.all(
                                          color: Colors.white.withOpacity(0.3)),
                                    ),
                                    child: const Icon(Icons.arrow_back,
                                        color: Colors.white, size: 24),
                                  ),
                                ),
                                
                                // CENTER TITLE & SUBTITLE
                                Column(
                                  children: [
                                    const Text("Assignments",
                                        style: TextStyle(
                                            fontSize: 32,
                                            fontWeight: FontWeight.w900,
                                            color: Colors.white,
                                            fontStyle: FontStyle.italic,
                                            letterSpacing: -1)),
                                    Text("YOUR DAILY WORK & TASKS",
                                        style: TextStyle(
                                            fontSize: 10,
                                            fontWeight: FontWeight.w900,
                                            color: Colors.white.withOpacity(0.9),
                                            letterSpacing: 2)),
                                  ],
                                ),

                                // RIGHT ICON
                                Container(
                                  padding: const EdgeInsets.all(12),
                                  decoration: BoxDecoration(
                                    color: Colors.white.withOpacity(0.2),
                                    borderRadius: BorderRadius.circular(16),
                                    border: Border.all(
                                        color: Colors.white.withOpacity(0.3)),
                                  ),
                                  child: const Icon(Icons.menu_book,
                                      color: Colors.white, size: 24),
                                ),
                              ],
                            ),
                            
                            const SizedBox(height: 25), // Spacing before toggle button
                            
                            // --- TOGGLE BUTTON ---
                            GestureDetector(
                              onTap: () => setState(() => view =
                                  view == 'pending' ? 'history' : 'pending'),
                              child: AnimatedContainer(
                                duration: const Duration(milliseconds: 300),
                                padding: const EdgeInsets.symmetric(
                                    horizontal: 20, vertical: 12),
                                decoration: BoxDecoration(
                                    color: isDarkMode
                                        ? const Color(0xFF1E293B)
                                        : Colors.white, // Dark mode support
                                    borderRadius: BorderRadius.circular(20),
                                    border: Border.all(
                                        color: isDarkMode
                                            ? const Color(0xFF334155)
                                            : Colors.transparent),
                                    boxShadow: const [
                                      BoxShadow(
                                          color: Colors.black12,
                                          blurRadius: 10,
                                          offset: Offset(0, 5))
                                    ]),
                                child: Row(
                                  mainAxisSize: MainAxisSize.min,
                                  children: [
                                    const Icon(Icons.assignment_turned_in,
                                        color: Color(0xFF42A5F5), size: 18),
                                    const SizedBox(width: 8),
                                    Text(
                                      view == 'pending'
                                          ? "VIEW MY SUBMISSIONS"
                                          : "VIEW PENDING TASKS",
                                      style: const TextStyle(
                                          fontSize: 11,
                                          fontWeight: FontWeight.w900,
                                          color: Color(0xFF42A5F5),
                                          letterSpacing: 1.5,
                                          fontStyle: FontStyle.italic),
                                    )
                                  ],
                                ),
                              ),
                            ).animate().scale(
                                duration: 400.ms, curve: Curves.easeOutBack),
                          ],
                        ),
                      ),

                      // --- CONTENT AREA ---
                      Transform.translate(
                        offset: const Offset(0, -40),
                        child: Padding(
                          padding: const EdgeInsets.symmetric(horizontal: 20),
                          child: view == 'pending'
                              ? _buildPendingView(
                                  isDarkMode,
                                  cardColor,
                                  cardBorder,
                                  textColorPrimary,
                                  textColorSecondary,
                                  subtleBg)
                              : _buildHistoryView(
                                  isDarkMode,
                                  cardColor,
                                  cardBorder,
                                  textColorPrimary,
                                  textColorSecondary,
                                  subtleBg),
                        ),
                      ),
                      const SizedBox(height: 50),
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

  Widget _buildPendingView(bool isDarkMode, Color cardColor, Color cardBorder,
      Color textColorPrimary, Color textColorSecondary, Color subtleBg) {
    if (assignments.isEmpty) {
      return Container(
        padding: const EdgeInsets.all(40),
        decoration: BoxDecoration(
          color: cardColor,
          borderRadius: BorderRadius.circular(40),
          border: Border.all(color: cardBorder, width: 2),
        ),
        child: Column(
          children: [
            Icon(Icons.check_circle,
                size: 60, color: const Color(0xFF10B981).withOpacity(0.2)),
            const SizedBox(height: 16),
            Text("NO ASSIGNMENTS ACTIVE",
                style: TextStyle(
                    fontSize: 12,
                    fontWeight: FontWeight.w900,
                    color: textColorSecondary,
                    letterSpacing: 2,
                    fontStyle: FontStyle.italic)),
          ],
        ),
      ).animate().fadeIn();
    }

    return Column(
      children: assignments.asMap().entries.map((entry) {
        int idx = entry.key;
        var asgn = entry.value;
        bool expired = _isExpired(asgn['dueDate']);

        return AnimatedContainer(
          duration: const Duration(milliseconds: 400),
          margin: const EdgeInsets.only(bottom: 24),
          padding: const EdgeInsets.all(28),
          decoration: BoxDecoration(
              color: cardColor,
              borderRadius: BorderRadius.circular(45),
              border: Border.all(color: cardBorder),
              boxShadow: const [
                BoxShadow(
                    color: Colors.black12, blurRadius: 15, offset: Offset(0, 5))
              ]),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Container(
                    padding:
                        const EdgeInsets.symmetric(horizontal: 16, vertical: 6),
                    decoration: BoxDecoration(
                        color: isDarkMode
                            ? const Color(0xFF1E3A8A).withOpacity(0.3)
                            : Colors.blue.shade50,
                        borderRadius: BorderRadius.circular(20),
                        border: Border.all(
                            color: isDarkMode
                                ? const Color(0xFF1E3A8A)
                                : Colors.blue.shade100)),
                    child: Text(
                      (asgn['subject'] ?? "General").toString().toUpperCase(),
                      style: const TextStyle(
                          fontSize: 8,
                          fontWeight: FontWeight.w900,
                          color: Color(0xFF42A5F5),
                          letterSpacing: 1.5),
                    ),
                  ),
                  if (expired)
                    Container(
                      padding: const EdgeInsets.symmetric(
                          horizontal: 16, vertical: 6),
                      decoration: BoxDecoration(
                          color: isDarkMode
                              ? const Color(0xFF7F1D1D).withOpacity(0.3)
                              : Colors.red.shade50,
                          borderRadius: BorderRadius.circular(20),
                          border: Border.all(
                              color: isDarkMode
                                  ? const Color(0xFF7F1D1D)
                                  : Colors.red.shade100)),
                      child: const Text(
                        "SUBMISSION CLOSED",
                        style: TextStyle(
                            fontSize: 8,
                            fontWeight: FontWeight.w900,
                            color: Colors.redAccent,
                            letterSpacing: 1.5),
                      ),
                    ),
                ],
              ),
              const SizedBox(height: 16),

              Row(
                children: [
                  Container(
                    width: 24,
                    height: 24,
                    decoration: const BoxDecoration(
                        color: Color(0xFFDBEAFE), shape: BoxShape.circle),
                    child: const Icon(Icons.person,
                        size: 14, color: Color(0xFF42A5F5)),
                  ),
                  const SizedBox(width: 8),
                  Text(
                    "PROF. ${asgn['teacher']?['name'] ?? 'FACULTY NODE'}",
                    style: const TextStyle(
                        fontSize: 11,
                        fontWeight: FontWeight.w900,
                        color: Color(0xFF42A5F5),
                        fontStyle: FontStyle.italic,
                        letterSpacing: 1.5),
                  )
                ],
              ),
              const SizedBox(height: 12),

              Text(
                (asgn['title'] ?? '').toString().toUpperCase(),
                style: TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.w900,
                    color: textColorPrimary,
                    fontStyle: FontStyle.italic,
                    height: 1.1),
              ),
              const SizedBox(height: 8),
              Text(
                asgn['description'] ?? '',
                style: TextStyle(
                    fontSize: 13,
                    fontWeight: FontWeight.bold,
                    color: textColorSecondary,
                    fontStyle: FontStyle.italic),
              ),
              const SizedBox(height: 20),

              Container(
                padding: const EdgeInsets.symmetric(vertical: 16),
                decoration: BoxDecoration(
                    border: Border.symmetric(
                        horizontal: BorderSide(
                            color: isDarkMode
                                ? const Color(0xFF334155)
                                : Colors.grey.shade100))),
                child: Row(
                  children: [
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Text("DEADLINE",
                              style: TextStyle(
                                  fontSize: 10,
                                  fontWeight: FontWeight.w900,
                                  color: Color(0xFF42A5F5),
                                  letterSpacing: 1.5,
                                  fontStyle: FontStyle.italic)),
                          const SizedBox(height: 4),
                          Container(
                            padding: const EdgeInsets.all(10),
                            decoration: BoxDecoration(
                                color: subtleBg,
                                borderRadius: BorderRadius.circular(12),
                                border: Border.all(color: cardBorder)),
                            child: Row(
                              mainAxisSize: MainAxisSize.min,
                              children: [
                                const Icon(Icons.access_time,
                                    size: 14, color: Color(0xFF42A5F5)),
                                const SizedBox(width: 6),
                                Text(
                                  asgn['dueDate'] != null
                                      ? DateFormat('dd MMM yyyy').format(
                                          DateTime.parse(asgn['dueDate']))
                                      : 'N/A',
                                  style: TextStyle(
                                      fontSize: 11,
                                      fontWeight: FontWeight.w900,
                                      color: textColorSecondary),
                                )
                              ],
                            ),
                          )
                        ],
                      ),
                    ),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Text("TOTAL MARKS",
                              style: TextStyle(
                                  fontSize: 10,
                                  fontWeight: FontWeight.w900,
                                  color: Color(0xFF42A5F5),
                                  letterSpacing: 1.5,
                                  fontStyle: FontStyle.italic)),
                          const SizedBox(height: 4),
                          Container(
                            padding: const EdgeInsets.all(10),
                            decoration: BoxDecoration(
                                color: subtleBg,
                                borderRadius: BorderRadius.circular(12),
                                border: Border.all(color: cardBorder)),
                            child: Row(
                              mainAxisSize: MainAxisSize.min,
                              children: [
                                const Icon(Icons.adjust,
                                    size: 14, color: Color(0xFF42A5F5)),
                                const SizedBox(width: 6),
                                Text(
                                  "${asgn['totalMarks'] ?? '—'} MARKS",
                                  style: TextStyle(
                                      fontSize: 11,
                                      fontWeight: FontWeight.w900,
                                      color: textColorSecondary),
                                )
                              ],
                            ),
                          )
                        ],
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 20),

              // 🔥 GENERATED COMPONENT: Direct Storage Downloader Link 🔥
              if (asgn['fileUrl'] != null &&
                  asgn['fileUrl'].toString().isNotEmpty)
                GestureDetector(
                  onTap: () => _downloadResource(
                      asgn['fileUrl']), // Changed function trigger
                  child: Container(
                    width: double.infinity,
                    padding: const EdgeInsets.symmetric(vertical: 16),
                    margin: const EdgeInsets.only(bottom: 20),
                    decoration: BoxDecoration(
                        color: subtleBg,
                        borderRadius: BorderRadius.circular(20),
                        border: Border.all(
                            color: isDarkMode
                                ? const Color(0xFF1E3A8A)
                                : Colors.blue.shade100)),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: const [
                        Icon(Icons.download_for_offline,
                            color: Color(0xFF42A5F5), size: 18),
                        SizedBox(width: 10),
                        Text("DOWNLOAD RESOURCE",
                            style: TextStyle(
                                fontSize: 12,
                                fontWeight: FontWeight.w900,
                                color: Color(0xFF42A5F5),
                                letterSpacing: 2))
                      ],
                    ),
                  ),
                ),

              if (!expired)
                submitFile == null
                    ? GestureDetector(
                        onTap: uploading ? null : _handleSubmission,
                        child: Container(
                          width: double.infinity,
                          padding: const EdgeInsets.symmetric(vertical: 30),
                          decoration: BoxDecoration(
                            color: subtleBg,
                            borderRadius: BorderRadius.circular(30),
                            border: Border.all(color: cardBorder, width: 2),
                          ),
                          child: Column(
                            children: [
                              uploading
                                  ? const SizedBox(
                                      height: 24,
                                      width: 24,
                                      child: CircularProgressIndicator(
                                          strokeWidth: 3,
                                          color: Color(0xFF42A5F5)))
                                  : const Icon(Icons.upload_file,
                                      color: Color(0xFF94A3B8), size: 30),
                              const SizedBox(height: 10),
                              Text(
                                  uploading
                                      ? "UPLOADING..."
                                      : "UPLOAD ASSIGNMENT SOL.",
                                  style: TextStyle(
                                      fontSize: 12,
                                      fontWeight: FontWeight.w900,
                                      color: textColorSecondary,
                                      letterSpacing: 1.5))
                            ],
                          ),
                        ),
                      )
                    : Column(
                        children: [
                          Container(
                            padding: const EdgeInsets.all(20),
                            decoration: BoxDecoration(
                                color: isDarkMode
                                    ? const Color(0xFF064E3B).withOpacity(0.3)
                                    : const Color(0xFFECFDF5),
                                borderRadius: BorderRadius.circular(20),
                                border: Border.all(
                                    color: isDarkMode
                                        ? const Color(0xFF064E3B)
                                        : const Color(0xFFD1FAE5))),
                            child: Row(
                              children: [
                                const Icon(Icons.description,
                                    color: Color(0xFF10B981), size: 20),
                                const SizedBox(width: 12),
                                Expanded(
                                  child: Text(
                                    submitFile!.name.toUpperCase(),
                                    style: const TextStyle(
                                        fontSize: 11,
                                        fontWeight: FontWeight.w900,
                                        color: Color(0xFF059669)),
                                    maxLines: 1,
                                    overflow: TextOverflow.ellipsis,
                                  ),
                                ),
                                GestureDetector(
                                  onTap: () => setState(() {
                                    submitFile = null;
                                    submitUrl = '';
                                  }),
                                  child: Container(
                                    padding: const EdgeInsets.all(8),
                                    decoration: BoxDecoration(
                                        color: isDarkMode
                                            ? const Color(0xFF1E293B)
                                            : Colors.white,
                                        borderRadius:
                                            BorderRadius.circular(10)),
                                    child: const Icon(Icons.close,
                                        size: 16, color: Colors.redAccent),
                                  ),
                                )
                              ],
                            ),
                          ).animate().scale(),
                          const SizedBox(height: 16),
                          GestureDetector(
                            onTap: () => _confirmSubmit(asgn['_id']),
                            child: Container(
                              width: double.infinity,
                              padding: const EdgeInsets.symmetric(vertical: 20),
                              decoration: BoxDecoration(
                                  color: const Color(0xFF10B981),
                                  borderRadius: BorderRadius.circular(30),
                                  boxShadow: [
                                    BoxShadow(
                                        color: const Color(0xFF10B981)
                                            .withOpacity(0.4),
                                        blurRadius: 15,
                                        offset: const Offset(0, 5))
                                  ]),
                              child: const Center(
                                child: Text("UPLOAD",
                                    style: TextStyle(
                                        fontSize: 12,
                                        fontWeight: FontWeight.w900,
                                        color: Colors.white,
                                        letterSpacing: 2)),
                              ),
                            ),
                          )
                        ],
                      )
              else
                Container(
                  width: double.infinity,
                  padding: const EdgeInsets.all(24),
                  decoration: BoxDecoration(
                      color: subtleBg,
                      borderRadius: BorderRadius.circular(30),
                      border: Border.all(color: cardBorder)),
                  child: Column(
                    children: [
                      const Icon(Icons.lock,
                          color: Color(0xFF94A3B8), size: 24),
                      const SizedBox(height: 8),
                      Text("TEMPORAL SUBMISSION WINDOW\nHAS BEEN SEVERED",
                          textAlign: TextAlign.center,
                          style: TextStyle(
                              fontSize: 9,
                              fontWeight: FontWeight.w900,
                              color: textColorSecondary,
                              letterSpacing: 1.5,
                              fontStyle: FontStyle.italic,
                              height: 1.5))
                    ],
                  ),
                )
            ],
          ),
        )
            .animate()
            .fadeIn(delay: Duration(milliseconds: 100 * idx))
            .slideY(begin: 0.1);
      }).toList(),
    );
  }

  Widget _buildHistoryView(bool isDarkMode, Color cardColor, Color cardBorder,
      Color textColorPrimary, Color textColorSecondary, Color subtleBg) {
    if (mySubmissions.isEmpty) {
      return Container(
        padding: const EdgeInsets.all(40),
        decoration: BoxDecoration(
          color: cardColor,
          borderRadius: BorderRadius.circular(40),
          border: Border.all(color: cardBorder, width: 2),
        ),
        child: Column(
          children: [
            Icon(Icons.history,
                size: 60, color: const Color(0xFF94A3B8).withOpacity(0.3)),
            const SizedBox(height: 16),
            Text("NO HISTORY FOUND",
                style: TextStyle(
                    fontSize: 12,
                    fontWeight: FontWeight.w900,
                    color: textColorSecondary,
                    letterSpacing: 2,
                    fontStyle: FontStyle.italic)),
          ],
        ),
      ).animate().fadeIn();
    }

    return Column(
      children: mySubmissions.asMap().entries.map((entry) {
        int idx = entry.key;
        var sub = entry.value;
        bool isGraded = sub['status'] == 'Graded';

        return AnimatedContainer(
          duration: const Duration(milliseconds: 400),
          margin: const EdgeInsets.only(bottom: 24),
          padding: const EdgeInsets.all(28),
          decoration: BoxDecoration(
              color: cardColor,
              borderRadius: BorderRadius.circular(45),
              border: Border.all(color: cardBorder),
              boxShadow: const [
                BoxShadow(
                    color: Colors.black12, blurRadius: 15, offset: Offset(0, 5))
              ]),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                "SENT: ${sub['submittedAt'] != null ? DateFormat('dd MMM yyyy').format(DateTime.parse(sub['submittedAt'])) : 'N/A'}",
                style: TextStyle(
                    fontSize: 11,
                    fontWeight: FontWeight.w900,
                    color: textColorSecondary,
                    fontStyle: FontStyle.italic),
              ),
              const SizedBox(height: 8),
              Container(
                padding:
                    const EdgeInsets.symmetric(horizontal: 16, vertical: 6),
                decoration: BoxDecoration(
                    color: isGraded
                        ? (isDarkMode
                            ? const Color(0xFF064E3B).withOpacity(0.3)
                            : const Color(0xFFECFDF5))
                        : (isDarkMode
                            ? const Color(0xFF1E3A8A).withOpacity(0.3)
                            : Colors.blue.shade50),
                    borderRadius: BorderRadius.circular(20),
                    border: Border.all(
                        color: isGraded
                            ? (isDarkMode
                                ? const Color(0xFF064E3B)
                                : const Color(0xFFD1FAE5))
                            : (isDarkMode
                                ? const Color(0xFF1E3A8A)
                                : Colors.blue.shade100))),
                child: Text(
                  isGraded ? "EVALUATION COMPLETE" : "UNDER REVIEW",
                  style: TextStyle(
                      fontSize: 9,
                      fontWeight: FontWeight.w900,
                      color: isGraded
                          ? const Color(0xFF10B981)
                          : const Color(0xFF42A5F5),
                      letterSpacing: 1.5),
                ),
              ),
              const SizedBox(height: 16),
              Text(
                (sub['assignment']?['title'] ?? '').toString().toUpperCase(),
                style: TextStyle(
                    fontSize: 17,
                    fontWeight: FontWeight.w900,
                    color: textColorPrimary,
                    fontStyle: FontStyle.italic,
                    height: 1.1),
              ),
              const SizedBox(height: 4),
              Text(
                "PROF: ${sub['assignment']?['teacher']?['name'] ?? 'UNKNOWN'}",
                style: TextStyle(
                    fontSize: 12,
                    fontWeight: FontWeight.w900,
                    color: textColorSecondary,
                    fontStyle: FontStyle.italic),
              ),
              const SizedBox(height: 24),
              Container(
                padding: const EdgeInsets.all(24),
                decoration: BoxDecoration(
                    color: isGraded ? const Color(0xFF10B981) : subtleBg,
                    borderRadius: BorderRadius.circular(35),
                    border: Border.all(
                        color: isGraded ? const Color(0xFF10B981) : cardBorder),
                    boxShadow: isGraded
                        ? [
                            BoxShadow(
                                color: const Color(0xFF10B981).withOpacity(0.3),
                                blurRadius: 15,
                                offset: const Offset(0, 5))
                          ]
                        : []),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Row(
                      children: [
                        Icon(Icons.adjust,
                            size: 24,
                            color:
                                isGraded ? Colors.white : textColorSecondary),
                        const SizedBox(width: 12),
                        Text(
                          isGraded
                              ? "${sub['marksObtained']} MARKS"
                              : "PENDING SCORE",
                          style: TextStyle(
                              fontSize: 10,
                              fontWeight: FontWeight.w900,
                              color: isGraded ? Colors.white : textColorPrimary,
                              letterSpacing: 1.5,
                              fontStyle: FontStyle.italic),
                        )
                      ],
                    ),
                    Text(
                      "OUT OF ${sub['assignment']?['totalMarks'] ?? '—'}",
                      style: TextStyle(
                          fontSize: 10,
                          fontWeight: FontWeight.w900,
                          color: isGraded ? Colors.white70 : textColorSecondary,
                          fontStyle: FontStyle.italic),
                    )
                  ],
                ),
              ),
              if (sub['feedback'] != null &&
                  sub['feedback'].toString().isNotEmpty)
                Container(
                  margin: const EdgeInsets.only(top: 16),
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                      color: isDarkMode
                          ? const Color(0xFF1E3A8A).withOpacity(0.2)
                          : Colors.blue.shade50.withOpacity(0.5),
                      borderRadius: BorderRadius.circular(20),
                      border: Border.all(
                          color: isDarkMode
                              ? const Color(0xFF1E3A8A)
                              : Colors.blue.shade50)),
                  child: Text(
                    "\" ${sub['feedback']} \"",
                    style: TextStyle(
                        fontSize: 12,
                        fontWeight: FontWeight.bold,
                        color: isDarkMode
                            ? const Color(0xFF38BDF8)
                            : const Color(0xFF475569),
                        fontStyle: FontStyle.italic),
                  ),
                )
            ],
          ),
        )
            .animate()
            .fadeIn(delay: Duration(milliseconds: 100 * idx))
            .slideX(begin: 0.1);
      }).toList(),
    );
  }
}
