import 'package:flutter/material.dart';
import 'navbar.dart';
import 'bottom_nav.dart';
import 'sidebar.dart';
import 'dart:ui';

class LayoutWrapper extends StatefulWidget {
  final Widget? child; // Admin/Finance ke static pages ke liye
  final Widget Function(String searchQuery)?
      childBuilder; // Student/Dashboard search ke liye
  final String role;

  const LayoutWrapper(
      {super.key, this.child, this.childBuilder, required this.role});

  @override
  State<LayoutWrapper> createState() => _LayoutWrapperState();
}

class _LayoutWrapperState extends State<LayoutWrapper> {
  String searchQuery = "";
  bool isSidebarOpen = false;

  @override
  Widget build(BuildContext context) {
    bool isMobile = MediaQuery.of(context).size.width < 800;

    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),

      // FIXED: CustomScrollView ke sath ClampingScrollPhysics.
      // Ab scroll karne par Navbar upar gayab hoga, aur top se neeche nahi khichega!
      body: Stack(
        children: [
          CustomScrollView(
            physics: const ClampingScrollPhysics(),
            slivers: [
              SliverToBoxAdapter(
                child: Navbar(
                  searchQuery: searchQuery,
                  onSearchChanged: (val) => setState(() => searchQuery = val),
                  onSupportClick: () {},
                  onMenuClick: () {
                    setState(() {
                      isSidebarOpen = true;
                    });
                  },
                ),
              ),
              SliverToBoxAdapter(
                child: widget.childBuilder != null
                    ? widget.childBuilder!(searchQuery)
                    : widget.child!,
              ),
            ],
          ),

          if (widget.role == 'student' && isMobile)
            Positioned(
              left: 0,
              right: 0,
              bottom: 0,
              child: IgnorePointer(
                ignoring: isSidebarOpen,
                child: AnimatedOpacity(
                  duration: const Duration(milliseconds: 300),
                  opacity: isSidebarOpen ? 0.3 : 1,
                  child: const BottomNav(),
                ),
              ),
            ),

          // Blur Overlay
          if (isSidebarOpen)
            Positioned.fill(
              child: GestureDetector(
                onTap: () {
                  setState(() {
                    isSidebarOpen = false;
                  });
                },
                child: BackdropFilter(
                  filter: ImageFilter.blur(sigmaX: 12, sigmaY: 12),
                  child: AnimatedContainer(
                    duration: const Duration(milliseconds: 400),
                    color: Colors.black.withValues(alpha: 0.15),
                  ),
                ),
              ),
            ),

          // Premium Smooth Sidebar
          AnimatedPositioned(
            duration: const Duration(milliseconds: 650),
            curve: Curves.easeOutExpo,
            left: isSidebarOpen ? 0 : -MediaQuery.of(context).size.width * 0.72,
            top: 0,
            bottom: 0,
            child: const Sidebar(),
          ),
        ],
      ),
    );
  }
}
