import 'package:flutter/material.dart';
import 'dart:convert';
import 'package:go_router/go_router.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:url_launcher/url_launcher.dart';
import 'package:path_provider/path_provider.dart'; // 🔥 FILE SAVING KE LIYE
import 'package:open_filex/open_filex.dart'; // 🔥 "OPEN WITH" POPUP KE LIYE
import 'package:dio/dio.dart';
import 'package:pdf/pdf.dart'; // 🔥 NAYA ASLI PDF GENERATOR
import 'package:pdf/widgets.dart' as pw; // 🔥 PDF WIDGETS
import 'package:intl/intl.dart';
import 'dart:io'; // 🔥 FILE HANDLING KE LIYE
import '../../../core/network/api_client.dart';
import '../../../core/theme/theme_provider.dart';
import '../../../shared/widgets/custom_loader.dart';
import '../../../core/constants/app_config.dart';

class TeacherDatesheet extends ConsumerStatefulWidget {
  const TeacherDatesheet({super.key});

  @override
  ConsumerState<TeacherDatesheet> createState() => _TeacherDatesheetState();
}

class _TeacherDatesheetState extends ConsumerState<TeacherDatesheet> {
  bool isLoading = true;
  List<dynamic> datesheets = [];
  List<dynamic> availableClasses = [];
  
  String currentView = 'list'; // 'list' or 'download'
  Map<String, dynamic>? selectedDatesheet;


  @override
  void initState() {
    super.initState();
    _initData();
  }

  Future<void> _initData({bool isRefresh = false}) async {
    if (!isRefresh && mounted) setState(() => isLoading = true);

    try {
      final results = await Future.wait([
        ApiClient.dio.get('/notices/meta/classes'),
        ApiClient.dio.get('/datesheet/teacher-datesheets'),
      ]);

      if (mounted) {
        setState(() {
          availableClasses = results[0].data ?? [];
          datesheets = results[1].data ?? [];
        });
      }
    } catch (e) {
      _showToast("Failed to load institutional schedules.", isError: true);
    } finally {
      if (mounted) setState(() => isLoading = false);
    }
  }

  void _handleBack() {
    if (currentView != 'list') {
      setState(() {
        currentView = 'list';
        selectedDatesheet = null;
      });
    } else {
      if (context.canPop()) {
        context.pop();
      } else {
        context.go('/teacher/home');
      }
    }
  }

  void _handleSelectDatesheet(Map<String, dynamic> ds) {
    setState(() {
      selectedDatesheet = ds;
      currentView = 'download';
    });
  }

// 🔥 1. DOWNLOAD HANDLER 🔥
  Future<void> _handleDownload() async {
    if (selectedDatesheet == null) return;

    if (selectedDatesheet!['isManual'] == true) {
      String fileUrl = AppConfig.getAbsoluteUrl(selectedDatesheet!['fileUrl'] ?? '');
      
      _showToast("Downloading File... ⏳");
      try {
        final Directory dir = await getApplicationDocumentsDirectory();
        final String fileName = "${selectedDatesheet!['title']}_Datesheet.pdf";
        final String filePath = "${dir.path}/$fileName";

        await ApiClient.dio.download(fileUrl, filePath);
        _showToast("File Ready! Opening... ✅");
        
        await OpenFilex.open(filePath); // 🔥 Seedha Open With Popup
      } catch (e) {
        _showToast("Direct download failed. Routing via browser...", isError: true);
        final Uri url = Uri.parse(fileUrl);
        if (await canLaunchUrl(url)) {
          await launchUrl(url, mode: LaunchMode.externalApplication);
        }
      }
    } else {
      // 🔥 AI GENERATED DATESHEET (LIKE STUDENT MODULE) 🔥
      _showToast("Generating Master PDF... ⏳");
      await _generateAndSaveAIPdf();
    }
  }

  // 🔥 2. NATIVE MULTI-COLUMN PDF GENERATOR (TEACHER SPECIFIC) 🔥
  Future<void> _generateAndSaveAIPdf() async {
    final pdf = pw.Document();

    final String title = (selectedDatesheet!['title'] ?? '').toString().toUpperCase();
    final String schoolName = (selectedDatesheet!['schoolName'] ?? 'EduFlowAI Public School').toString().toUpperCase();
    final String timing = (selectedDatesheet!['timing'] ?? 'N/A').toString();
    final String resultDate = selectedDatesheet!['resultDate'] != null
        ? DateFormat('dd MMM yyyy').format(DateTime.parse(selectedDatesheet!['resultDate'].toString()))
        : 'N/A';

    final List<dynamic> schedule = selectedDatesheet!['schedule'] ?? [];
    final List<String> classes = List<String>.from(selectedDatesheet!['classes'] ?? []);
    final String notesStr = (selectedDatesheet!['notes'] ?? '').toString();

    pw.MemoryImage? inchargeImage;
    pw.MemoryImage? principalImage;

    // Fetch Signatures
    try {
      if (selectedDatesheet!['signatures']?['incharge'] != null) {
        String fullUrl = AppConfig.getAbsoluteUrl(selectedDatesheet!['signatures']['incharge']);
        final response = await ApiClient.dio.get(fullUrl, options: Options(responseType: ResponseType.bytes));
        inchargeImage = pw.MemoryImage(response.data);
      }

      if (selectedDatesheet!['signatures']?['principal'] != null) {
        String fullUrl = AppConfig.getAbsoluteUrl(selectedDatesheet!['signatures']['principal']);
        final response = await ApiClient.dio.get(fullUrl, options: Options(responseType: ResponseType.bytes));
        principalImage = pw.MemoryImage(response.data);
      }
    } catch (e) {
      debugPrint("Signature Images failed to download: $e");
    }

    // 🔥 PREPARE MULTI-COLUMN TABLE FOR TEACHER 🔥
    final headers = ['DATE & DAY', ...classes.map((c) => 'CLASS $c')];
    final tableData = schedule.map((col) {
      final row = ["${col['date']}\n${col['day']}"];
      for (var cls in classes) {
        String subject = (col['classExams']?[cls] ?? "-").toString().toUpperCase();
        if (subject == '-' || subject == 'NO EXAM') subject = "NO EXAM";
        row.add(subject);
      }
      return row;
    }).toList();

    // Build PDF Document
    pdf.addPage(pw.MultiPage(
      pageFormat: PdfPageFormat.a4,
      margin: const pw.EdgeInsets.all(32),
      build: (pw.Context context) {
        return [
          pw.Center(child: pw.Text(schoolName, style: pw.TextStyle(fontSize: 24, fontWeight: pw.FontWeight.bold))),
          pw.SizedBox(height: 8),
          pw.Center(child: pw.Text(title, style: pw.TextStyle(fontSize: 18, fontWeight: pw.FontWeight.bold))),
          pw.Center(child: pw.Text("MASTER SCHEDULE MATRIX", style: pw.TextStyle(fontSize: 14))),
          pw.SizedBox(height: 24),

          // 🔥 TEACHER KA BADA MATRIX TABLE 🔥
          pw.Table.fromTextArray(
            headers: headers,
            headerStyle: pw.TextStyle(fontWeight: pw.FontWeight.bold, color: PdfColors.white, fontSize: 10),
            headerDecoration: const pw.BoxDecoration(color: PdfColors.blue800),
            cellStyle: const pw.TextStyle(fontSize: 9),
            cellAlignment: pw.Alignment.center,
            data: tableData,
          ),
          pw.SizedBox(height: 24),

          pw.Text("KINDLY NOTE:", style: pw.TextStyle(fontWeight: pw.FontWeight.bold, decoration: pw.TextDecoration.underline)),
          pw.SizedBox(height: 8),
          pw.Bullet(text: "Examination Timing: $timing"),
          pw.Bullet(text: "Result Declaration: $resultDate"),
          ...notesStr.split('\n').where((n) => n.trim().isNotEmpty).map((note) => pw.Bullet(text: note)).toList(),

          pw.SizedBox(height: 40),
          pw.Row(
            mainAxisAlignment: pw.MainAxisAlignment.spaceBetween,
            crossAxisAlignment: pw.CrossAxisAlignment.end,
            children: [
              pw.Column(crossAxisAlignment: pw.CrossAxisAlignment.start, children: [
                if (inchargeImage != null) pw.Image(inchargeImage, height: 40),
                pw.SizedBox(height: 8),
                pw.Container(width: 120, decoration: const pw.BoxDecoration(border: pw.Border(top: pw.BorderSide(width: 2)))),
                pw.SizedBox(height: 4),
                pw.Text("EXAMINATION INCHARGE", style: pw.TextStyle(fontWeight: pw.FontWeight.bold, fontSize: 10)),
              ]),
              pw.Column(crossAxisAlignment: pw.CrossAxisAlignment.end, children: [
                if (principalImage != null) pw.Image(principalImage, height: 40),
                pw.SizedBox(height: 8),
                pw.Container(width: 120, decoration: const pw.BoxDecoration(border: pw.Border(top: pw.BorderSide(width: 2)))),
                pw.SizedBox(height: 4),
                pw.Text("PRINCIPAL", style: pw.TextStyle(fontWeight: pw.FontWeight.bold, fontSize: 10)),
              ])
            ]
          )
        ];
      },
    ));

    // Save and Trigger Open With
    try {
      final Directory dir = await getApplicationDocumentsDirectory();
      final String filePath = "${dir.path}/${title}_Master_Schedule.pdf";

      final file = File(filePath);
      await file.writeAsBytes(await pdf.save());

      _showToast("PDF Ready! Opening... ✅");
      await OpenFilex.open(filePath);
    } catch (e) {
      _showToast("Failed to open PDF", isError: true);
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
        _handleBack(); // 🔥 SAFE NAVIGATION 🔥
      },
      child: Scaffold(
        backgroundColor: bgColor,
        body: RefreshIndicator(
          color: const Color(0xFF42A5F5),
          backgroundColor: cardColor,
          onRefresh: () => _initData(isRefresh: true),
          child: CustomScrollView(
            physics: const AlwaysScrollableScrollPhysics(parent: ClampingScrollPhysics()), // 🔥 NO RUBBER BANDING 🔥
            slivers: [
              SliverToBoxAdapter(
                child: Column(
                  children: [
                    // --- HEADER SECTION ---
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
                            onTap: _handleBack,
                            child: Container(
                              padding: const EdgeInsets.all(12),
                              decoration: BoxDecoration(color: Colors.white.withOpacity(0.2), borderRadius: BorderRadius.circular(16), border: Border.all(color: Colors.white.withOpacity(0.3))),
                              child: const Icon(Icons.arrow_back, color: Colors.white, size: 24),
                            ),
                          ),
                          Column(
                            mainAxisSize: MainAxisSize.min,
                            children: [
                              const Text("Date Sheet", style: TextStyle(fontSize: 24, fontWeight: FontWeight.w900, color: Colors.white, fontStyle: FontStyle.italic, letterSpacing: -0.5)),
                              Text("EXAMINATION SCHEDULE", style: TextStyle(fontSize: 9, fontWeight: FontWeight.w900, color: Colors.white.withOpacity(0.9), letterSpacing: 2)),
                            ],
                          ),
                          Container(
                            padding: const EdgeInsets.all(12),
                            decoration: BoxDecoration(color: Colors.white.withOpacity(0.2), borderRadius: BorderRadius.circular(16), border: Border.all(color: Colors.white.withOpacity(0.3))),
                            child: const Icon(Icons.calendar_today, color: Colors.white, size: 24),
                          ),
                        ],
                      ),
                    ).animate().slideY(begin: -0.2, duration: 500.ms),

                    // --- MAIN CONTENT AREA ---
                    Transform.translate(
                      offset: const Offset(0, -20),
                      child: Padding(
                        padding: const EdgeInsets.symmetric(horizontal: 24),
                        child: AnimatedSwitcher(
                          duration: const Duration(milliseconds: 400),
                          switchInCurve: Curves.easeOutBack,
                          switchOutCurve: Curves.easeIn,
                          child: currentView == 'list' 
                            ? _buildListView(isDarkMode, cardColor, cardBorder, textColorPrimary, textColorSecondary)
                            : _buildDownloadView(isDarkMode, cardColor, cardBorder, textColorPrimary, textColorSecondary),
                        ),
                      ),
                    ),
                    
                    const SizedBox(height: 50), // 🔥 EXACT 50PX BOTTOM PADDING LOCKED 🔥
                  ],
                ),
              )
            ],
          ),
        ),
      ),
    );
  }

  // --- VIEW 1: DATESHEET LIST ---
  Widget _buildListView(bool isDarkMode, Color cardColor, Color cardBorder, Color textColorPrimary, Color textColorSecondary) {
    if (datesheets.isEmpty) {
      return Container(
        padding: const EdgeInsets.symmetric(vertical: 60),
        width: double.infinity,
        decoration: BoxDecoration(color: cardColor, borderRadius: BorderRadius.circular(40), border: Border.all(color: cardBorder, width: 2), boxShadow: const [BoxShadow(color: Colors.black12, blurRadius: 15, offset: Offset(0, 5))]),
        child: Column(
          children: [
            const Icon(Icons.calendar_month, size: 60, color: Colors.grey).animate(onPlay: (c) => c.repeat(reverse: true)).slideY(begin: -0.1, end: 0.1, duration: 1.seconds),
            const SizedBox(height: 24),
            Text("NO SCHEDULES FOUND", style: TextStyle(fontSize: 14, fontWeight: FontWeight.w900, color: textColorPrimary, fontStyle: FontStyle.italic, letterSpacing: 1.5)),
            const SizedBox(height: 8),
            Text("The administration has not published any schedules.", textAlign: TextAlign.center, style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: textColorSecondary, letterSpacing: 1.5)),
          ],
        ),
      ).animate().fadeIn();
    }

    return Column(
      key: const ValueKey('list'),
      children: datesheets.asMap().entries.map((entry) {
        int index = entry.key;
        var ds = entry.value;
        
        List<dynamic> dsClasses = ds['classes'] ?? [];
        String classText = (dsClasses.length == availableClasses.length && availableClasses.isNotEmpty) 
            ? "CLASSES: ALL CLASSES" 
            : "CLASSES: ${dsClasses.join(', ')}";

        // 🔥 COLOR THEME FIXED: EMERALD SE SKY BLUE MEIN SWITCH KIYA 🔥
        Color gradientStart = isDarkMode ? const Color(0xFF0F172A) : const Color(0xFFEFF6FF);
        Color gradientEnd = isDarkMode ? const Color(0xFF1E3A8A) : Colors.white;
        Color accentColor = const Color(0xFF42A5F5);

        return GestureDetector(
          onTap: () => _handleSelectDatesheet(ds),
          child: Container(
            margin: const EdgeInsets.only(bottom: 24),
            child: Column(
              children: [
                Container(
                  width: double.infinity,
                  padding: const EdgeInsets.all(24),
                  decoration: BoxDecoration(
                    gradient: LinearGradient(colors: [gradientStart, gradientEnd], begin: Alignment.topLeft, end: Alignment.bottomRight),
                    borderRadius: BorderRadius.circular(35),
                    border: Border.all(color: accentColor.withOpacity(0.3), width: 1.5),
                    boxShadow: [BoxShadow(color: accentColor.withOpacity(0.2), blurRadius: 20, offset: const Offset(0, 10))],
                  ),
                  child: Row(
                    children: [
                      Container(
                        padding: const EdgeInsets.all(16),
                        decoration: BoxDecoration(
                          color: isDarkMode ? const Color(0xFF0F172A) : Colors.white,
                          borderRadius: BorderRadius.circular(20),
                          border: Border.all(color: accentColor.withOpacity(0.5), width: 2),
                          boxShadow: [BoxShadow(color: accentColor.withOpacity(0.3), blurRadius: 15)],
                        ),
                        child: Icon(Icons.file_present, color: accentColor, size: 28),
                      ).animate(onPlay: (c) => c.repeat(reverse: true)).scale(begin: const Offset(1, 1), end: const Offset(1.05, 1.05), duration: 2.seconds),
                      const SizedBox(width: 20),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(ds['title'].toString().toUpperCase(), style: TextStyle(fontSize: 16, fontWeight: FontWeight.w900, color: isDarkMode ? Colors.white : const Color(0xFF1E3A8A), fontStyle: FontStyle.italic, letterSpacing: 0.5)),
                            const SizedBox(height: 6),
                            Text(classText, style: TextStyle(fontSize: 9, fontWeight: FontWeight.w900, color: isDarkMode ? Colors.white70 : const Color(0xFF3B82F6), letterSpacing: 2)),
                          ],
                        ),
                      )
                    ],
                  ),
                ).animate().slideY(begin: 0.2, delay: Duration(milliseconds: 100 * index)),
                const SizedBox(height: 12),
                Text("CLICK TO ACCESS FILE", style: TextStyle(fontSize: 10, fontWeight: FontWeight.w900, color: accentColor, letterSpacing: 3, fontStyle: FontStyle.italic)).animate().fadeIn(delay: Duration(milliseconds: 200 + (100 * index))),
              ],
            ),
          ),
        );
      }).toList(),
    );
  }

  // --- VIEW 2: DOWNLOAD VIEW ---
  Widget _buildDownloadView(bool isDarkMode, Color cardColor, Color cardBorder, Color textColorPrimary, Color textColorSecondary) {
    return Container(
      key: const ValueKey('download'),
      padding: const EdgeInsets.all(40),
      width: double.infinity,
      decoration: BoxDecoration(
        color: cardColor,
        borderRadius: BorderRadius.circular(50),
        border: Border.all(color: cardBorder, width: 2),
        boxShadow: const [BoxShadow(color: Colors.black12, blurRadius: 20, offset: Offset(0, 10))]
      ),
      child: Column(
        children: [
          Stack(
            alignment: Alignment.bottomRight,
            children: [
              Container(
                width: 100, height: 100,
                decoration: BoxDecoration(
                  color: isDarkMode ? const Color(0xFF1E3A8A).withOpacity(0.3) : Colors.blue.shade50,
                  borderRadius: BorderRadius.circular(35),
                  border: Border.all(color: isDarkMode ? const Color(0xFF1E3A8A) : Colors.blue.shade100, width: 2),
                ),
                child: const Icon(Icons.file_download, color: Color(0xFF42A5F5), size: 48),
              ),
              Container(
                padding: const EdgeInsets.all(6),
                decoration: BoxDecoration(color: const Color(0xFF10B981), shape: BoxShape.circle, border: Border.all(color: cardColor, width: 4)),
                child: const Icon(Icons.check, color: Colors.white, size: 16),
              )
            ],
          ).animate().scale(curve: Curves.easeOutBack),
          const SizedBox(height: 24),
          
          Text("FILE UNLOCKED", style: TextStyle(fontSize: 20, fontWeight: FontWeight.w900, color: textColorPrimary, fontStyle: FontStyle.italic, letterSpacing: 1)),
          const SizedBox(height: 8),
          Text(selectedDatesheet?['title']?.toString().toUpperCase() ?? 'DOCUMENT', textAlign: TextAlign.center, style: TextStyle(fontSize: 11, fontWeight: FontWeight.w900, color: textColorSecondary, letterSpacing: 2)),
          
          const SizedBox(height: 40),
          
          GestureDetector(
            onTap: _handleDownload, // 🔥 TRIGGER DOWNLOAD AND OPEN WITH POPUP 🔥
            child: Container(
              width: double.infinity,
              padding: const EdgeInsets.symmetric(vertical: 20),
              decoration: BoxDecoration(
                gradient: const LinearGradient(colors: [Color(0xFF42A5F5), Color(0xFF2563EB)]),
                borderRadius: BorderRadius.circular(40),
                boxShadow: [BoxShadow(color: const Color(0xFF42A5F5).withOpacity(0.4), blurRadius: 15, offset: const Offset(0, 5))]
              ),
              child: const Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(Icons.download, color: Colors.white, size: 20),
                  SizedBox(width: 12),
                  Text("DOWNLOAD DOCUMENT", style: TextStyle(fontSize: 11, fontWeight: FontWeight.w900, color: Colors.white, letterSpacing: 2, fontStyle: FontStyle.italic)),
                ],
              ),
            ),
          ).animate().slideY(begin: 0.2, delay: 200.ms),
        ],
      ),
    );
  }
}