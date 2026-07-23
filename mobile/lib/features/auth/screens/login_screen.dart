import 'dart:convert';
import 'dart:math' as math;
import 'dart:ui';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../providers/auth_provider.dart';
import 'forgot_password_modal.dart';

// ============================================================
// Generic placeholder legal copy — swap in your real policy text
// whenever you have it; this just keeps the sheets from being empty.
// ============================================================
const String _privacyPolicyContent = '''
Last updated: July 2026

1. Introduction
EduFlowAI ("we", "our", "us") provides a school management and learning platform for students, teachers, and administrators. This Privacy Policy explains what information we collect, how we use it, and the choices you have.

2. Information We Collect
We collect account information such as your name, email address, and role (student, teacher, finance, or admin). We also collect basic usage data — pages visited, features used, and device/browser information — to help us keep the app reliable and secure.

3. How We Use Your Information
Your information is used to operate your account, provide the features you request, communicate important updates, and improve the platform over time. We do not sell your personal information.

4. Data Sharing
We only share information with school staff who need it to do their jobs (e.g. a teacher viewing their own class), and with service providers who help us run the platform under strict confidentiality obligations.

5. Data Security
We use industry-standard safeguards, including encrypted connections and access controls, to protect your data from unauthorized access, alteration, or loss.

6. Children's Privacy
Where students under 18 use EduFlowAI, accounts are created and managed by the school, and we collect only the information necessary for educational purposes. Parents and schools may contact us to review or request deletion of a student's data.

7. Your Rights
You may request access to, correction of, or deletion of your personal information at any time by contacting your school administrator or reaching out to us directly.

8. Changes to This Policy
We may update this policy from time to time. We'll let you know about significant changes within the app.

9. Contact Us
Questions about this policy can be sent to your school's EduFlowAI administrator.
''';

const String _termsContent = '''
Last updated: July 2026

1. Acceptance of Terms
By creating an account or using EduFlowAI, you agree to these Terms of Service. If you don't agree, please don't use the platform.

2. Use of the Platform
EduFlowAI is provided for school-related educational and administrative purposes only. Access is granted through your school and tied to your assigned role.

3. Account Responsibilities
You're responsible for keeping your login credentials confidential and for all activity under your account. Notify your school administrator immediately if you suspect unauthorized access.

4. Acceptable Use
You agree not to misuse the platform — this includes not attempting to access accounts or data that aren't yours, not disrupting the service, and not uploading harmful or unlawful content.

5. Intellectual Property
All content, branding, and software associated with EduFlowAI remain the property of EduFlowAI and its licensors. You retain ownership of the content you personally submit.

6. Termination
Your school or EduFlowAI may suspend or terminate access if these terms are violated, or when you're no longer affiliated with the school.

7. Limitation of Liability
EduFlowAI is provided "as is." We work hard to keep it reliable, but we aren't liable for indirect or incidental damages arising from use of the platform.

8. Changes to These Terms
We may revise these terms occasionally. Continued use of the platform after changes means you accept the updated terms.

9. Contact Us
Questions about these terms can be directed to your school's EduFlowAI administrator.
''';

/// ============================================================
/// EDUFLOW AI — PREMIUM CINEMATIC LOGIN SCREEN
/// ============================================================
/// Sab kuch original logic (authProvider, role routing, forgot
/// password modal) bilkul same rakha hai. Is version mein:
///   • Fixed top-left BRAND HEADER — hamesha stable, keyboard se
///     bhi nahi hilta (chhote kids wale characters hata diye hain)
///   • Fixed bottom footer — "Privacy Policy" / "Terms of Service"
///     jinpe tap karne se actual content wala sheet khulta hai
///   • KEYBOARD FIX — jab keyboard khulta hai, background/header/
///     footer bilkul stable rehte hain; sirf form card upar scroll
///     hoke us field ko keyboard ke thik upar la deta hai jaha type
///     ho raha hai
///   • LOGIN button dabate hi keyboard turant band ho jata hai
///   • Card ke peeche continuously chalta hua animated background
///     (floating glow orbs + drifting particles)
///   • Staggered cinematic entrance, focus-glow fields, scanning
///     highlight line, premium button micro-interactions, shake on
///     wrong credentials — sab pehle wala intact hai
class LoginScreen extends ConsumerStatefulWidget {
  const LoginScreen({super.key});

  @override
  ConsumerState<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends ConsumerState<LoginScreen>
    with TickerProviderStateMixin {
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
  final _emailFocus = FocusNode();
  final _passwordFocus = FocusNode();

  bool _showPass = false;
  bool _isExiting = false;
  bool _showSuccessPop = false;
  int _shakeTrigger = 0;

  late final AnimationController _bgController; // ambient background loop
  late final AnimationController _scanController; // field focus scan line
  late final AnimationController _buttonPressController;

  @override
  void initState() {
    super.initState();

    _bgController = AnimationController(
      vsync: this,
      duration: const Duration(seconds: 6),
    )..repeat();

    _scanController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 1400),
    )..repeat();

    _buttonPressController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 120),
      lowerBound: 0.0,
      upperBound: 1.0,
      value: 0.0,
    );

    _emailFocus.addListener(() => setState(() {}));
    _passwordFocus.addListener(() => setState(() {}));
  }

  @override
  void dispose() {
    _emailController.dispose();
    _passwordController.dispose();
    _emailFocus.dispose();
    _passwordFocus.dispose();
    _bgController.dispose();
    _scanController.dispose();
    _buttonPressController.dispose();
    super.dispose();
  }

  void _handleLogin() async {
    // Keyboard should drop the moment Login is tapped.
    FocusScope.of(context).unfocus();

    if (_emailController.text.isEmpty || _passwordController.text.isEmpty) {
      setState(() => _shakeTrigger++);
      return;
    }

    final success = await ref
        .read(authProvider.notifier)
        .login(_emailController.text, _passwordController.text, context);

    if (!mounted) return;

    if (success) {
      // Premium success beat: quick checkmark pop, then fade the whole
      // screen out before actually navigating.
      setState(() => _showSuccessPop = true);
      await Future.delayed(const Duration(milliseconds: 550));
      if (!mounted) return;
      setState(() => _isExiting = true);
      await Future.delayed(const Duration(milliseconds: 320));
      if (!mounted) return;

      final prefs = await SharedPreferences.getInstance();
      final userStr = prefs.getString('user');
      if (userStr != null) {
        final role = jsonDecode(userStr)['role'];
        if (role == 'superadmin') {
          context.go('/superadmin/dashboard');
        } else if (role == 'finance') {
          context.go('/finance/dashboard');
        } else {
          context.go('/');
        }
      }
    } else {
      setState(() => _shakeTrigger++);
    }
  }

  void _showLegalSheet(String title, String content) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (context) {
        return DraggableScrollableSheet(
          initialChildSize: 0.75,
          minChildSize: 0.4,
          maxChildSize: 0.92,
          expand: false,
          builder: (context, scrollController) {
            return Container(
              decoration: const BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.vertical(top: Radius.circular(32)),
              ),
              child: Column(
                children: [
                  const SizedBox(height: 12),
                  Container(
                    width: 44,
                    height: 5,
                    decoration: BoxDecoration(
                      color: const Color(0xFFE2E8F0),
                      borderRadius: BorderRadius.circular(10),
                    ),
                  ),
                  Padding(
                    padding: const EdgeInsets.fromLTRB(24, 16, 12, 8),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text(
                          title,
                          style: const TextStyle(
                            fontSize: 20,
                            fontWeight: FontWeight.w900,
                            fontStyle: FontStyle.italic,
                            color: Color(0xFF1E293B),
                          ),
                        ),
                        IconButton(
                          icon: const Icon(Icons.close_rounded, color: Color(0xFF94A3B8)),
                          onPressed: () => Navigator.pop(context),
                        ),
                      ],
                    ),
                  ),
                  Expanded(
                    child: SingleChildScrollView(
                      controller: scrollController,
                      padding: const EdgeInsets.fromLTRB(24, 0, 24, 32),
                      child: Text(
                        content,
                        style: const TextStyle(fontSize: 13.5, height: 1.65, color: Color(0xFF475569)),
                      ),
                    ),
                  ),
                ],
              ),
            );
          },
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    final authState = ref.watch(authProvider);
    const accent = Color(0xFF42A5F5);
    const accentSoft = Color(0xFF9C6BFF);
    const gold = Colors.amber;
    final bottomInset = MediaQuery.of(context).viewInsets.bottom;

    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      // We handle the keyboard ourselves below, so the background,
      // top header and footer never resize or jump when it opens.
      resizeToAvoidBottomInset: false,
      body: GestureDetector(
        behavior: HitTestBehavior.opaque,
        onTap: () => FocusScope.of(context).unfocus(),
        child: AnimatedOpacity(
          opacity: _isExiting ? 0.0 : 1.0,
          duration: const Duration(milliseconds: 320),
          curve: Curves.easeOut,
          child: AnimatedScale(
            scale: _isExiting ? 1.04 : 1.0,
            duration: const Duration(milliseconds: 320),
            curve: Curves.easeOut,
            child: Stack(
              children: [
                // --- BACKGROUND GRADIENT ---
                Container(
                  decoration: const BoxDecoration(
                    gradient: LinearGradient(
                      colors: [Color(0xFFE0F2FE), Color(0xFFF8FAFC), Color(0xFFF1F5F9)],
                      begin: Alignment.topLeft,
                      end: Alignment.bottomRight,
                    ),
                  ),
                ),

                // --- AMBIENT FLOATING GLOW ORBS (continuously alive) ---
                AnimatedBuilder(
                  animation: _bgController,
                  builder: (context, child) {
                    final t = _bgController.value;
                    return Positioned(
                      top: -100 + math.sin(t * 2 * math.pi) * 20,
                      left: -60 + math.cos(t * 2 * math.pi) * 15,
                      child: Container(
                        width: 300,
                        height: 300,
                        decoration: BoxDecoration(
                          shape: BoxShape.circle,
                          color: accent.withValues(alpha: 0.22),
                        ),
                      ),
                    );
                  },
                ),
                AnimatedBuilder(
                  animation: _bgController,
                  builder: (context, child) {
                    final t = _bgController.value;
                    return Positioned(
                      bottom: -130 + math.cos(t * 2 * math.pi) * 25,
                      right: -80 + math.sin(t * 2 * math.pi) * 18,
                      child: Container(
                        width: 340,
                        height: 340,
                        decoration: BoxDecoration(
                          shape: BoxShape.circle,
                          color: accentSoft.withValues(alpha: 0.18),
                        ),
                      ),
                    );
                  },
                ),

                Positioned.fill(
                  child: BackdropFilter(
                    filter: ImageFilter.blur(sigmaX: 50, sigmaY: 50),
                    child: Container(color: Colors.white.withValues(alpha: 0.15)),
                  ),
                ),

                // --- DRIFTING AMBIENT PARTICLES BEHIND CARD ---
                ...List.generate(16, (index) {
                  final rand = math.Random(index);
                  final startX = rand.nextDouble();
                  final startY = rand.nextDouble();
                  final size = rand.nextDouble() * 3 + 1.5;
                  return AnimatedBuilder(
                    animation: _bgController,
                    builder: (context, child) {
                      final t = (_bgController.value + index * 0.06) % 1.0;
                      final drift = math.sin(t * 2 * math.pi) * 14;
                      return Positioned(
                        left: startX * MediaQuery.of(context).size.width + drift,
                        top: startY * MediaQuery.of(context).size.height,
                        child: Opacity(
                          opacity: 0.35 + (math.sin(t * 2 * math.pi) * 0.25),
                          child: Container(
                            width: size,
                            height: size,
                            decoration: BoxDecoration(
                              shape: BoxShape.circle,
                              color: accent,
                              boxShadow: [BoxShadow(color: accent.withValues(alpha: 0.5), blurRadius: size * 2)],
                            ),
                          ),
                        ),
                      );
                    },
                  );
                }),

                // --- MAIN CARD (scrolls itself up above the keyboard) ---
                Positioned.fill(
                  child: Center(
                    child: AnimatedPadding(
                      duration: const Duration(milliseconds: 250),
                      curve: Curves.easeOut,
                      padding: EdgeInsets.only(bottom: bottomInset),
                      child: SingleChildScrollView(
                        padding: const EdgeInsets.symmetric(horizontal: 24),
                        child: _ShakeWrapper(
                          trigger: _shakeTrigger,
                          child: Container(
                            width: double.infinity,
                            padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 40),
                            decoration: BoxDecoration(
                              color: Colors.white,
                              borderRadius: BorderRadius.circular(50),
                              boxShadow: [
                                BoxShadow(
                                  color: Colors.black.withValues(alpha: 0.06),
                                  blurRadius: 40,
                                  spreadRadius: 10,
                                  offset: const Offset(0, 10),
                                ),
                              ],
                            ),
                            child: Column(
                              mainAxisSize: MainAxisSize.min,
                              children: [
                                // --- LOGO & TITLE ---
                                Row(
                                  mainAxisAlignment: MainAxisAlignment.center,
                                  crossAxisAlignment: CrossAxisAlignment.center,
                                  children: [
                                    const Icon(Icons.memory, color: accent, size: 36)
                                        .animate(onPlay: (c) => c.repeat())
                                        .rotate(duration: 10.seconds),
                                    const SizedBox(width: 14),
                                    const Text(
                                      "EduFlowAI",
                                      style: TextStyle(
                                        fontSize: 34,
                                        fontWeight: FontWeight.w900,
                                        fontStyle: FontStyle.italic,
                                        color: Color(0xFF1E293B),
                                        letterSpacing: -1.2,
                                        height: 1,
                                      ),
                                    ),
                                    const SizedBox(width: 14),
                                    Container(
                                      decoration: BoxDecoration(
                                        shape: BoxShape.circle,
                                        boxShadow: [
                                          BoxShadow(color: gold.withValues(alpha: 0.35), blurRadius: 8, spreadRadius: 1),
                                        ],
                                      ),
                                      child: const Icon(Icons.bolt, color: gold, size: 38),
                                    )
                                        .animate(onPlay: (c) => c.repeat(reverse: true))
                                        .scale(duration: 1500.ms, begin: const Offset(1, 1), end: const Offset(1.12, 1.12)),
                                  ],
                                )
                                    .animate()
                                    .fadeIn(duration: 500.ms)
                                    .scale(begin: const Offset(0.85, 0.85), curve: Curves.easeOutBack),

                                const SizedBox(height: 12),

                                // Animated blue divider — grows in from nothing
                                Container(
                                  height: 4,
                                  width: 60,
                                  decoration: BoxDecoration(color: accent, borderRadius: BorderRadius.circular(10)),
                                )
                                    .animate()
                                    .fadeIn(delay: 250.ms, duration: 300.ms)
                                    .then()
                                    .animate(onPlay: (c) => c.repeat(reverse: true))
                                    .scaleX(duration: 1.2.seconds, begin: 1, end: 1.5),

                                const SizedBox(height: 16),

                                const Text(
                                  "LOGIN REQUIRED",
                                  style: TextStyle(
                                    color: Color(0xFF475569),
                                    fontWeight: FontWeight.w800,
                                    fontStyle: FontStyle.italic,
                                    fontSize: 14,
                                    letterSpacing: 1,
                                  ),
                                ).animate().fadeIn(delay: 350.ms, duration: 400.ms),

                                const SizedBox(height: 35),

                                // --- PREMIUM EMAIL FIELD ---
                                _PremiumField(
                                  controller: _emailController,
                                  focusNode: _emailFocus,
                                  scanController: _scanController,
                                  hint: "Email ID",
                                  icon: Icons.email_outlined,
                                  keyboardType: TextInputType.emailAddress,
                                  accent: accent,
                                ).animate().fadeIn(delay: 450.ms, duration: 450.ms).slideY(begin: 0.25, curve: Curves.easeOutCubic),

                                const SizedBox(height: 20),

                                // --- PREMIUM PASSWORD FIELD ---
                                _PremiumField(
                                  controller: _passwordController,
                                  focusNode: _passwordFocus,
                                  scanController: _scanController,
                                  hint: "Enter Password",
                                  icon: Icons.lock_outline,
                                  obscureText: !_showPass,
                                  accent: accent,
                                  suffix: GestureDetector(
                                    onTap: () => setState(() => _showPass = !_showPass),
                                    child: AnimatedSwitcher(
                                      duration: const Duration(milliseconds: 250),
                                      transitionBuilder: (child, anim) => RotationTransition(
                                        turns: Tween<double>(begin: 0.75, end: 1).animate(anim),
                                        child: ScaleTransition(scale: anim, child: child),
                                      ),
                                      child: Icon(
                                        _showPass ? Icons.visibility_off_outlined : Icons.visibility_outlined,
                                        key: ValueKey(_showPass),
                                        color: const Color(0xFF94A3B8),
                                        size: 22,
                                      ),
                                    ),
                                  ),
                                ).animate().fadeIn(delay: 550.ms, duration: 450.ms).slideY(begin: 0.25, curve: Curves.easeOutCubic),

                                // --- ERROR MESSAGE ---
                                if (authState.error != null)
                                  Padding(
                                    padding: const EdgeInsets.only(top: 12),
                                    child: Text(
                                      authState.error!,
                                      style: const TextStyle(
                                          color: Colors.redAccent, fontStyle: FontStyle.italic, fontWeight: FontWeight.bold, fontSize: 13),
                                    ),
                                  ).animate().fadeIn().slideY(begin: -0.2),

                                const SizedBox(height: 24),

                                // --- SECURE LOGIN & FORGOT PASSWORD ROW ---
                                Row(
                                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                  children: [
                                    const Row(
                                      children: [
                                        Icon(Icons.security, size: 16, color: Color(0xFF94A3B8)),
                                        SizedBox(width: 6),
                                        Text("SECURE\nLOGIN",
                                            style: TextStyle(
                                                fontSize: 10,
                                                fontWeight: FontWeight.w900,
                                                color: Color(0xFF94A3B8),
                                                fontStyle: FontStyle.italic,
                                                height: 1.1)),
                                      ],
                                    ),
                                    TextButton(
                                      onPressed: () {
                                        showModalBottomSheet(
                                          context: context,
                                          isScrollControlled: true,
                                          backgroundColor: Colors.transparent,
                                          builder: (context) => const ForgotPasswordModal(),
                                        );
                                      },
                                      child: const Text("FORGOT PASSWORD?",
                                          style: TextStyle(
                                              color: accent,
                                              fontWeight: FontWeight.w900,
                                              fontSize: 11,
                                              fontStyle: FontStyle.italic,
                                              letterSpacing: 0.5)),
                                    ),
                                  ],
                                ).animate().fadeIn(delay: 650.ms, duration: 400.ms),

                                const SizedBox(height: 24),

                                // --- PREMIUM LOGIN BUTTON ---
                                GestureDetector(
                                  onTapDown: (_) => _buttonPressController.forward(),
                                  onTapUp: (_) => _buttonPressController.reverse(),
                                  onTapCancel: () => _buttonPressController.reverse(),
                                  onTap: authState.isLoading ? null : _handleLogin,
                                  child: AnimatedBuilder(
                                    animation: _buttonPressController,
                                    builder: (context, child) {
                                      final scale = 1.0 - (_buttonPressController.value * 0.035);
                                      return Transform.scale(scale: scale, child: child);
                                    },
                                    child: Container(
                                      width: double.infinity,
                                      height: 60,
                                      decoration: BoxDecoration(
                                        borderRadius: BorderRadius.circular(40),
                                        gradient: const LinearGradient(
                                          colors: [accent, Color(0xFF2F6DF6)],
                                          begin: Alignment.centerLeft,
                                          end: Alignment.centerRight,
                                        ),
                                        boxShadow: [
                                          BoxShadow(color: accent.withValues(alpha: 0.4), blurRadius: 20, offset: const Offset(0, 8)),
                                        ],
                                      ),
                                      alignment: Alignment.center,
                                      child: AnimatedSwitcher(
                                        duration: const Duration(milliseconds: 280),
                                        transitionBuilder: (child, anim) =>
                                            ScaleTransition(scale: anim, child: FadeTransition(opacity: anim, child: child)),
                                        child: _showSuccessPop
                                            ? const Icon(Icons.check_circle_rounded, key: ValueKey('success'), color: Colors.white, size: 28)
                                                .animate()
                                                .scale(begin: const Offset(0.5, 0.5), curve: Curves.elasticOut)
                                            : authState.isLoading
                                                ? const SizedBox(
                                                    key: ValueKey('loading'),
                                                    height: 24,
                                                    width: 24,
                                                    child: CircularProgressIndicator(color: Colors.white, strokeWidth: 3),
                                                  )
                                                : const Row(
                                                    key: ValueKey('idle'),
                                                    mainAxisAlignment: MainAxisAlignment.center,
                                                    children: [
                                                      Text("LOGIN",
                                                          style: TextStyle(
                                                              color: Colors.white,
                                                              fontSize: 16,
                                                              fontWeight: FontWeight.w900,
                                                              fontStyle: FontStyle.italic,
                                                              letterSpacing: 1)),
                                                      SizedBox(width: 8),
                                                      Icon(Icons.bolt, size: 20, color: Colors.white),
                                                    ],
                                                  ),
                                      ),
                                    ),
                                  ),
                                ).animate().fadeIn(delay: 750.ms, duration: 450.ms).slideY(begin: 0.3, curve: Curves.easeOutBack),
                              ],
                            ),
                          ),
                        ),
                      ),
                    ),
                  ),
                ),

                // --- (NEW) FIXED TOP-LEFT BRAND HEADER — never moves, ---
                // --- not even when the keyboard opens.               ---
                Positioned(
                  top: 0,
                  left: 0,
                  right: 0,
                  child: SafeArea(
                    bottom: false,
                    child: Padding(
                      padding: const EdgeInsets.fromLTRB(20, 14, 20, 0),
                      child: Row(
                        children: [
                          Container(
                            width: 32,
                            height: 32,
                            decoration: const BoxDecoration(
                              shape: BoxShape.circle,
                              gradient: LinearGradient(colors: [accent, Color(0xFF2F6DF6)]),
                            ),
                            child: const Icon(Icons.memory, color: Colors.white, size: 17),
                          ),
                          const SizedBox(width: 9),
                          const Text(
                            "EduFlowAI",
                            style: TextStyle(
                              fontSize: 17,
                              fontWeight: FontWeight.w900,
                              fontStyle: FontStyle.italic,
                              color: Color(0xFF1E293B),
                              letterSpacing: -0.6,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                ).animate().fadeIn(duration: 500.ms),

                // --- (NEW) FIXED BOTTOM FOOTER — Privacy Policy / Terms ---
                Positioned(
                  left: 0,
                  right: 0,
                  bottom: 0,
                  child: SafeArea(
                    top: false,
                    child: Padding(
                      padding: const EdgeInsets.only(bottom: 14),
                      child: Center(
                        child: Wrap(
                          alignment: WrapAlignment.center,
                          crossAxisAlignment: WrapCrossAlignment.center,
                          children: [
                            GestureDetector(
                              onTap: () => _showLegalSheet("Privacy Policy", _privacyPolicyContent),
                              child: const Text(
                                "PRIVACY POLICY",
                                style: TextStyle(
                                  color: Color(0xFF94A3B8),
                                  fontWeight: FontWeight.w800,
                                  fontSize: 10.5,
                                  fontStyle: FontStyle.italic,
                                  letterSpacing: 0.5,
                                ),
                              ),
                            ),
                            const Padding(
                              padding: EdgeInsets.symmetric(horizontal: 8),
                              child: Text("•", style: TextStyle(color: Color(0xFFCBD5E1))),
                            ),
                            GestureDetector(
                              onTap: () => _showLegalSheet("Terms of Service", _termsContent),
                              child: const Text(
                                "TERMS OF SERVICE",
                                style: TextStyle(
                                  color: Color(0xFF94A3B8),
                                  fontWeight: FontWeight.w800,
                                  fontSize: 10.5,
                                  fontStyle: FontStyle.italic,
                                  letterSpacing: 0.5,
                                ),
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                  ),
                ).animate().fadeIn(delay: 300.ms, duration: 500.ms),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

/// A premium text field: floating focus glow, scanning highlight line
/// along the border while focused, and an icon that gently pulses
/// when the user is actively typing in it.
class _PremiumField extends StatelessWidget {
  final TextEditingController controller;
  final FocusNode focusNode;
  final AnimationController scanController;
  final String hint;
  final IconData icon;
  final bool obscureText;
  final Widget? suffix;
  final TextInputType? keyboardType;
  final Color accent;

  const _PremiumField({
    required this.controller,
    required this.focusNode,
    required this.scanController,
    required this.hint,
    required this.icon,
    required this.accent,
    this.obscureText = false,
    this.suffix,
    this.keyboardType,
  });

  @override
  Widget build(BuildContext context) {
    final bool isFocused = focusNode.hasFocus;

    return AnimatedContainer(
      duration: const Duration(milliseconds: 250),
      curve: Curves.easeOut,
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(40),
        boxShadow: isFocused
            ? [BoxShadow(color: accent.withValues(alpha: 0.28), blurRadius: 22, spreadRadius: 1)]
            : [],
      ),
      child: Stack(
        alignment: Alignment.centerLeft,
        children: [
          TextFormField(
            controller: controller,
            focusNode: focusNode,
            obscureText: obscureText,
            keyboardType: keyboardType,
            style: const TextStyle(fontWeight: FontWeight.bold, fontStyle: FontStyle.italic, color: Color(0xFF334155)),
            decoration: InputDecoration(
              hintText: hint,
              hintStyle: const TextStyle(color: Color(0xFF94A3B8), fontWeight: FontWeight.bold, fontStyle: FontStyle.italic),
              prefixIcon: AnimatedBuilder(
                animation: scanController,
                builder: (context, child) {
                  final pulse = isFocused ? (0.5 + 0.5 * math.sin(scanController.value * 2 * math.pi)) : 0.0;
                  return Transform.scale(
                    scale: 1.0 + (pulse * 0.12),
                    child: Icon(icon, color: isFocused ? accent : accent.withValues(alpha: 0.75), size: 22),
                  );
                },
              ),
              suffixIcon: suffix,
              filled: true,
              fillColor: Colors.white,
              contentPadding: const EdgeInsets.symmetric(vertical: 20),
              enabledBorder: OutlineInputBorder(
                borderRadius: BorderRadius.circular(40),
                borderSide: const BorderSide(color: Color(0xFFCBD5E1), width: 1),
              ),
              focusedBorder: OutlineInputBorder(
                borderRadius: BorderRadius.circular(40),
                borderSide: BorderSide(color: accent, width: 2),
              ),
            ),
          ),

          // Scanning highlight sweep — only visible while focused
          if (isFocused)
            IgnorePointer(
              child: ClipRRect(
                borderRadius: BorderRadius.circular(40),
                child: AnimatedBuilder(
                  animation: scanController,
                  builder: (context, child) {
                    final t = scanController.value;
                    return Align(
                      alignment: Alignment(-1.0 + 2.0 * t, 0),
                      child: FractionallySizedBox(
                        widthFactor: 0.18,
                        child: Container(
                          height: 60,
                          decoration: BoxDecoration(
                            gradient: LinearGradient(
                              colors: [
                                accent.withValues(alpha: 0.0),
                                accent.withValues(alpha: 0.10),
                                accent.withValues(alpha: 0.0),
                              ],
                            ),
                          ),
                        ),
                      ),
                    );
                  },
                ),
              ),
            ),
        ],
      ),
    );
  }
}

/// Wraps a child and shakes it horizontally whenever [trigger] changes
/// (used for wrong-credentials / empty-field feedback on the whole card).
class _ShakeWrapper extends StatefulWidget {
  final int trigger;
  final Widget child;
  const _ShakeWrapper({required this.trigger, required this.child});

  @override
  State<_ShakeWrapper> createState() => _ShakeWrapperState();
}

class _ShakeWrapperState extends State<_ShakeWrapper> with SingleTickerProviderStateMixin {
  late final AnimationController _controller;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(vsync: this, duration: const Duration(milliseconds: 450));
  }

  @override
  void didUpdateWidget(covariant _ShakeWrapper oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (widget.trigger != oldWidget.trigger && widget.trigger != 0) {
      _controller.forward(from: 0);
    }
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return AnimatedBuilder(
      animation: _controller,
      builder: (context, child) {
        final t = _controller.value;
        final offset = math.sin(t * math.pi * 6) * (1 - t) * 10;
        return Transform.translate(offset: Offset(offset, 0), child: child);
      },
      child: widget.child,
    );
  }
}
