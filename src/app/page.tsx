"use client";

import {
  ArrowRight,
  Edit,
  Video,
  Users,
  MessageSquare,
  Twitter,
  Instagram,
  Linkedin,
  Menu,
  X,
  Command,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  SignInButton,
  SignUpButton,
  UserButton,
  SignedIn,
  SignedOut,
} from "@clerk/nextjs";
import { ModeToggle } from "@/components/theme-toggle";
import { useState } from "react";
import { motion } from "framer-motion";
import { GymFAQ } from "@/components/landing/gym-faq-section";
import { Feature } from "@/components/landing/feature-section-with-bento-grid";
import { GymPricing } from "@/components/landing/gym-pricing-cards";

// Social links
const socialLinks = [
  { icon: Twitter, name: "Twitter", href: "#" },
  { icon: Instagram, name: "Instagram", href: "#" },
  { icon: Linkedin, name: "LinkedIn", href: "#" },
];

// Navigation items
const navItems = [
  { name: "기능", href: "#features" },
  { name: "요금제", href: "#pricing" },
  { name: "자주묻는질문", href: "#faq" },
];

// Smooth scroll function
const smoothScrollTo = (targetId: string) => {
  const target = document.querySelector(targetId);
  if (target) {
    const headerHeight = 80; // Approximate header height
    const targetPosition =
      target.getBoundingClientRect().top + window.pageYOffset - headerHeight;

    window.scrollTo({
      top: targetPosition,
      behavior: "smooth",
    });
  }
};

// Header Component
const Header = ({
  mobileMenuOpen,
  toggleMobileMenu,
}: {
  mobileMenuOpen: boolean;
  toggleMobileMenu: () => void;
}) => (
  <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-white dark:bg-gray-900">
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4">
      <div className="flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center">
            <span className="text-black dark:text-white text-xl">❃</span>
          </div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">
            Sweat Station
          </h1>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:block">
          <ul className="flex items-center gap-4">
            {navItems.map((item) => (
              <li key={item.name}>
                <button
                  onClick={() => smoothScrollTo(item.href)}
                  className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white font-medium cursor-pointer transition-colors px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  {item.name}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Right side items */}
        <div className="flex items-center space-x-2 sm:space-x-4">
          <ModeToggle />

          {/* Desktop Auth */}
          <div className="hidden md:flex items-center space-x-4">
            <SignedOut>
              <SignInButton>
                <Button
                  variant="ghost"
                  className="cursor-pointer text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  로그인
                </Button>
              </SignInButton>
              <SignUpButton>
                <Button variant="default" className="cursor-pointer">
                  시작하기
                </Button>
              </SignUpButton>
            </SignedOut>
            <SignedIn>
              <Link href="/dashboard">
                <Button>Dashboard</Button>
              </Link>
              <UserButton />
            </SignedIn>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={toggleMobileMenu}
            className="md:hidden p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-4 py-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 rounded-lg shadow-lg">
          <nav className="space-y-2">
            {navItems.map((item) => (
              <button
                key={item.name}
                onClick={() => {
                  smoothScrollTo(item.href);
                  toggleMobileMenu();
                }}
                className="w-full justify-start text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white font-medium transition-colors px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 text-left"
              >
                {item.name}
              </button>
            ))}
          </nav>

          {/* Mobile Auth */}
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 space-y-2">
            <SignedOut>
              <SignInButton>
                <Button
                  variant="ghost"
                  className="w-full justify-start cursor-pointer text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  로그인
                </Button>
              </SignInButton>
              <SignUpButton>
                <Button variant="default" className="w-full cursor-pointer">
                  시작하기
                </Button>
              </SignUpButton>
            </SignedOut>
            <SignedIn>
              <Link href="/dashboard" onClick={toggleMobileMenu}>
                <Button className="w-full">Dashboard</Button>
              </Link>
              <div className="flex justify-center pt-2">
                <UserButton />
              </div>
            </SignedIn>
          </div>
        </div>
      )}
    </div>
  </header>
);

// Hero Section Component
const HeroSection = () => (
  <motion.section
    className="container mx-auto px-4 sm:px-6 pt-32 sm:pt-40 pb-12 sm:pb-16"
    initial={{ opacity: 0, y: 50 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8, ease: "easeOut" }}
  >
    <div className="max-w-7xl mx-auto text-center">
      <motion.div
        className="border border-gray-200 dark:border-gray-700 w-fit mx-auto text-xs font-light mb-8 tracking-wide uppercase p-2 rounded-lg flex items-center gap-2 bg-gray-100 dark:bg-gray-800 shadow-md hover:shadow-lg transition-all duration-300"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          duration: 0.6,
          delay: 0.2,
          type: "spring",
          bounce: 0.3,
        }}
        whileHover={{ scale: 1.05 }}
      >
        <Command className="w-3 h-3" />
        SWEAT STATION
      </motion.div>

      <motion.h1
        className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
      >
        <motion.span
          className="text-gray-900 dark:text-white"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          당신만의 체육관을 만들고
        </motion.span>
        <br />
        <motion.span
          className="text-gray-900 dark:text-white italic"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          체육관 관리의 미래를 경험해보세요.
        </motion.span>
      </motion.h1>

      <motion.p
        className="text-lg sm:text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-12 sm:mb-16 max-w-2xl mx-auto leading-relaxed font-medium"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1.0 }}
      >
        우리의 스마트 플랫폼이 회원 관리를 쉽게 만들어 당신의 피트니스 사업이
        성장할 수 있도록 돕습니다.
      </motion.p>

      <SignedOut>
        <motion.div
          className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-6 mb-8 sm:mb-10"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.2 }}
        >
          <SignInButton>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <Button
                variant="default"
                className="cursor-pointer text-lg sm:text-xl font-bold transition-all duration-300 px-6 sm:px-8 py-3 sm:py-4"
                size="lg"
              >
                회원 관리 시작하기
                <motion.div
                  initial={{ x: 0 }}
                  animate={{ x: 0 }}
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 ml-2" />
                </motion.div>
              </Button>
            </motion.div>
          </SignInButton>
        </motion.div>
        <motion.div
          className="text-sm text-gray-500 dark:text-gray-400 mb-16 sm:mb-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 1.4 }}
        >
          신용카드 없이 무료 시작
        </motion.div>
      </SignedOut>
    </div>
  </motion.section>
);

// Demo Interface Component
const DemoInterface = () => (
  <motion.div
    className="bg-white dark:bg-gray-800 rounded-3xl p-6 sm:p-8 md:p-12 lg:p-16 mb-16 sm:mb-20 lg:mb-24 shadow-2xl border border-gray-100 dark:border-gray-700 max-w-7xl mx-auto"
    initial={{ opacity: 0, y: 50, scale: 0.95 }}
    whileInView={{ opacity: 1, y: 0, scale: 1 }}
    viewport={{ once: true, margin: "-100px" }}
    transition={{
      duration: 0.8,
      ease: "easeOut",
      delay: 0.2,
    }}
    whileHover={{
      scale: 1.02,
      boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
    }}
  >
    <motion.div
      className="w-full h-48 sm:h-64 md:h-80 lg:h-96 bg-gray-100 dark:bg-gray-700 rounded-2xl mb-6 sm:mb-8 flex items-center justify-center"
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{
        duration: 0.6,
        delay: 0.4,
        ease: "easeOut",
      }}
      whileHover={{
        scale: 1.05,
        backgroundColor: "rgb(243 244 246)",
        transition: { duration: 0.3 },
      }}
    >
      <motion.div
        className="text-gray-500 dark:text-gray-400 text-sm sm:text-base md:text-lg font-semibold text-center px-4"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{
          duration: 0.5,
          delay: 0.6,
          ease: "easeOut",
        }}
        whileHover={{
          scale: 1.1,
          color: "rgb(107 114 128)",
          transition: { duration: 0.2 },
        }}
      >
        AI Portrait Studio Interface
      </motion.div>
    </motion.div>
  </motion.div>
);

// Footer Component
const Footer = () => (
  <footer className="text-white py-12 sm:py-16 lg:py-20">
    <div className="max-w-6xl mx-auto bg-black px-6 sm:px-8 lg:px-10 py-8 sm:py-10 rounded-3xl">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-6 sm:gap-8 lg:gap-12">
          {/* Logo and Copyright */}
          <div className="sm:col-span-2 md:col-span-1">
            <div className="flex items-center gap-3 mb-4 sm:mb-6">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center">
                <span className="text-white dark:text-black text-xl">❃</span>
              </div>
              <span className="text-white text-xl sm:text-2xl font-bold">
                Sweat Station
              </span>
            </div>
            <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
              Sweat Station은 체육관 운영을 위한 최적의 솔루션을 제공합니다.
            </p>
            <p className="text-gray-500 text-xs sm:text-sm mt-4">© 2025</p>
          </div>

          {/* Product */}
          <div>
            <h4 className="text-white font-bold mb-4 sm:mb-6 text-base sm:text-lg">
              Product
            </h4>
            <ul className="space-y-2 sm:space-y-3 lg:space-y-4 text-gray-400 text-sm sm:text-base">
              <li>
                <button
                  onClick={() => smoothScrollTo("#features")}
                  className="hover:text-white transition-colors hover:underline text-left"
                >
                  Features
                </button>
              </li>
              <li>
                <button
                  onClick={() => smoothScrollTo("#pricing")}
                  className="hover:text-white transition-colors hover:underline text-left"
                >
                  Pricing
                </button>
              </li>
              <li>
                <button
                  onClick={() => smoothScrollTo("#faq")}
                  className="hover:text-white transition-colors hover:underline text-left"
                >
                  FAQ
                </button>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-white font-bold mb-4 sm:mb-6 text-base sm:text-lg">
              Company
            </h4>
            <ul className="space-y-2 sm:space-y-3 lg:space-y-4 text-gray-400 text-sm sm:text-base">
              <li>
                <a
                  href="/about"
                  className="hover:text-white transition-colors hover:underline"
                >
                  About
                </a>
              </li>
              <li>
                <a
                  href="/blog"
                  className="hover:text-white transition-colors hover:underline"
                >
                  Blog
                </a>
              </li>
              <li>
                <a
                  href="/careers"
                  className="hover:text-white transition-colors hover:underline"
                >
                  Careers
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-white font-bold mb-4 sm:mb-6 text-base sm:text-lg">
              Legal
            </h4>
            <ul className="space-y-2 sm:space-y-3 lg:space-y-4 text-gray-400 text-sm sm:text-base">
              <li>
                <a
                  href="/privacy"
                  className="hover:text-white transition-colors hover:underline"
                >
                  Privacy
                </a>
              </li>
              <li>
                <a
                  href="/terms"
                  className="hover:text-white transition-colors hover:underline"
                >
                  Terms
                </a>
              </li>
              <li>
                <a
                  href="/security"
                  className="hover:text-white transition-colors hover:underline"
                >
                  Security
                </a>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="text-white font-bold mb-4 sm:mb-6 text-base sm:text-lg">
              Connect
            </h4>
            <ul className="space-y-2 sm:space-y-3 lg:space-y-4 text-gray-400 text-sm sm:text-base">
              {socialLinks.map((social, index) => {
                const IconComponent = social.icon;
                return (
                  <li key={index}>
                    <a
                      href={social.href}
                      className="hover:text-white transition-colors flex items-center gap-2 sm:gap-3 hover:underline"
                    >
                      <IconComponent className="w-4 h-4 sm:w-5 sm:h-5" />
                      {social.name}
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </div>
  </footer>
);

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <Header
        mobileMenuOpen={mobileMenuOpen}
        toggleMobileMenu={toggleMobileMenu}
      />
      <HeroSection />
      <DemoInterface />

      {/* Bento Grid Feature Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6" id="features">
        <Feature />
      </div>

      {/* FAQ Section */}
      <section id="faq" className="px-4 sm:px-6">
        <GymFAQ />
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="px-4 sm:px-6">
        <GymPricing />
      </section>

      <Footer />
    </div>
  );
}
