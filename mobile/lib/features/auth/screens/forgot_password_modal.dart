import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../providers/auth_provider.dart';

class ForgotPasswordModal extends ConsumerStatefulWidget {
  const ForgotPasswordModal({super.key});

  @override
  ConsumerState<ForgotPasswordModal> createState() => _ForgotPasswordModalState();
}

class _ForgotPasswordModalState extends ConsumerState<ForgotPasswordModal> {
  int step = 1;
  String email = '';
  String otp = '';
  String newPassword = '';
  String confirmPassword = '';
  String message = '';
  bool isSuccessMsg = false;
  bool loading = false;

  void handleSendOtp() async {
    setState(() { loading = true; message = ''; });
    final error = await ref.read(authProvider.notifier).sendOtp(email);
    setState(() {
      loading = false;
      if (error == null) {
        step = 2;
        message = "OTP sent to your registered email";
        isSuccessMsg = true;
      } else {
        message = error;
        isSuccessMsg = false;
      }
    });
  }

  void handleReset() async {
    if (newPassword != confirmPassword) {
      setState(() { message = "Ciphers do not match!"; isSuccessMsg = false; });
      return;
    }
    setState(() { loading = true; message = ''; });
    final error = await ref.read(authProvider.notifier).resetPassword({
      'email': email, 'otp': otp, 'newPassword': newPassword
    });
    
    setState(() => loading = false);
    if (error == null) {
      setState(() { message = "Password updated! Please log in."; isSuccessMsg = true; });
      Future.delayed(const Duration(seconds: 2), () => Navigator.pop(context));
    } else {
      setState(() { message = error; isSuccessMsg = false; });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: EdgeInsets.only(bottom: MediaQuery.of(context).viewInsets.bottom + 20, top: 30, left: 24, right: 24),
      decoration: const BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.vertical(top: Radius.circular(40))
      ),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          Row(
            children: [
              const Icon(Icons.security, color: Color(0xFF42A5F5), size: 30),
              const SizedBox(width: 10),
              const Text("Password Reset", style: TextStyle(fontSize: 24, fontWeight: FontWeight.w900, fontStyle: FontStyle.italic)),
              const Spacer(),
              IconButton(icon: const Icon(Icons.close), onPressed: () => Navigator.pop(context))
            ],
          ),
          const SizedBox(height: 20),
          
          if (message.isNotEmpty)
            Container(
              padding: const EdgeInsets.all(10),
              margin: const EdgeInsets.only(bottom: 15),
              color: isSuccessMsg ? Colors.blue.shade50 : Colors.red.shade50,
              child: Text(message, style: TextStyle(color: isSuccessMsg ? Colors.blue : Colors.red, fontWeight: FontWeight.bold)),
            ),

          if (step == 1) ...[
            TextField(
              onChanged: (v) => email = v,
              decoration: InputDecoration(hintText: "Registered Email ID", border: OutlineInputBorder(borderRadius: BorderRadius.circular(15))),
            ),
            const SizedBox(height: 15),
            ElevatedButton(
              onPressed: loading ? null : handleSendOtp,
              style: ElevatedButton.styleFrom(minimumSize: const Size(double.infinity, 50), backgroundColor: const Color(0xFF42A5F5)),
              child: loading ? const CircularProgressIndicator(color: Colors.white) : const Text("Request OTP", style: TextStyle(color: Colors.white)),
            )
          ] else ...[
            TextField(onChanged: (v) => otp = v, decoration: InputDecoration(hintText: "6-digit OTP", border: OutlineInputBorder(borderRadius: BorderRadius.circular(15)))),
            const SizedBox(height: 10),
            TextField(onChanged: (v) => newPassword = v, obscureText: true, decoration: InputDecoration(hintText: "New Password", border: OutlineInputBorder(borderRadius: BorderRadius.circular(15)))),
            const SizedBox(height: 10),
            TextField(onChanged: (v) => confirmPassword = v, obscureText: true, decoration: InputDecoration(hintText: "Confirm Password", border: OutlineInputBorder(borderRadius: BorderRadius.circular(15)))),
            const SizedBox(height: 15),
            ElevatedButton(
              onPressed: loading ? null : handleReset,
              style: ElevatedButton.styleFrom(minimumSize: const Size(double.infinity, 50), backgroundColor: const Color(0xFF42A5F5)),
              child: loading ? const CircularProgressIndicator(color: Colors.white) : const Text("Reset Password", style: TextStyle(color: Colors.white)),
            )
          ]
        ],
      ),
    );
  }
}