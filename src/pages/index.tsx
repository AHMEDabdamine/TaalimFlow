import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Header } from "@/components/header";
import PhoneCarousel from "@/components/PhoneCarousel";
import MacBookCarousel from "@/components/MacCarousel";

import {
  GraduationCap,
  Users,
  Calendar,
  MessageSquare,
  CreditCard,
  Globe,
  Wifi,
  QrCode,
  School,
  UserCheck,
  BookOpen,
  Shield,
  CheckCircle,
  Phone,
  Mail,
  MessageCircle,
  Star,
  ArrowLeft,
  Loader2,
  ArrowRight,
  Settings,
  Crown,
  Gift,
  Heart,
  Sparkles,
  Download,
  Smartphone,
  Monitor,
} from "lucide-react";

// Animated Counter Component
const AnimatedCounter = ({ targetValue, duration = 2000, suffix = "" }) => {
  const [currentValue, setCurrentValue] = useState(0);
  const { i18n } = useTranslation();

  useEffect(() => {
    if (targetValue === 0) return;

    const startTime = Date.now();
    const startValue = 0;

    const updateCounter = () => {
      const now = Date.now();
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const value = Math.floor(
        startValue + (targetValue - startValue) * easeOutQuart
      );

      setCurrentValue(value);

      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      }
    };

    requestAnimationFrame(updateCounter);
  }, [targetValue, duration]);

  const locale =
    i18n.language === "ar"
      ? "ar-DZ"
      : i18n.language === "fr"
      ? "fr-FR"
      : "en-US";

  return (
    <span className="font-bold text-2xl text-blue-600 dark:text-blue-400">
      {currentValue.toLocaleString(locale)}
      {suffix}
    </span>
  );
};

// User Count Display Component
const UserCountDisplay = () => {
  const [userCount, setUserCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    // Simulate user count for demo purposes
    const simulatedCount = 1500 + Math.floor(Math.random() * 100);
    setTimeout(() => {
      setUserCount(simulatedCount);
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
          <span className="text-gray-600 dark:text-gray-300">
            {t("hero.loading")}
          </span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Phone className="w-5 h-5 text-red-600" />
          <span className="text-red-600 dark:text-red-300">
            {t("hero.errorLoading")}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 text-center border-2 border-blue-100 dark:border-blue-800">
      <div className="flex items-center justify-center gap-3 mb-2">
        <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
          <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
        </div>
        <div className="text-right">
          <AnimatedCounter targetValue={userCount} suffix="+" />
          <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
            {t("hero.activeUsers")}
          </p>
        </div>
      </div>
      <p className="text-xs text-gray-500 dark:text-gray-400">
        {t("hero.newUsersDaily")}
      </p>
    </div>
  );
};

const TaalimFlowLanding = () => {
  const { t, i18n } = useTranslation();

  // Promotion banner control: 1 = show, 0 = hide
  const SHOW_PROMOTION_BANNER = 1;

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    schoolName: "",
    message: "",
    status: "new", // Add default status
  });
  const [downloadLinks, setDownloadLinks] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({
    name: "",
    email: "",
    schoolName: "",
    message: "",
  });

  // Update document direction when language changes
  useEffect(() => {
    const isRTL = i18n.language === "ar";
    document.documentElement.dir = isRTL ? "rtl" : "ltr";
    document.documentElement.lang = i18n.language;
  }, [i18n.language]);

  // Load download links - using static data
  useEffect(() => {
    // Static download links for demo
    const staticLinks = {
      ios: { url: "", enabled: false },
      android: { url: "", enabled: false },
      windows: { url: "", enabled: false },
      mac: { url: "", enabled: false },
      linux: { url: "", enabled: false },
    };
    setDownloadLinks(staticLinks);
  }, []);

  const scrollToContact = () => {
    const contactSection = document.getElementById("contact-section");
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError("");
    setFieldErrors({ name: "", email: "", schoolName: "", message: "" });

    // Validate required fields
    const errors: {
      name?: string;
      email?: string;
      schoolName?: string;
      message?: string;
    } = {};
    if (!formData.name.trim())
      errors.name = t("contact.form.nameRequired") || "الاسم مطلوب";
    if (!formData.email.trim())
      errors.email =
        t("contact.form.emailRequired") || "البريد الإلكتروني مطلوب";
    if (
      formData.email.trim() &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())
    ) {
      errors.email =
        t("contact.form.emailInvalid") || "البريد الإلكتروني غير صحيح";
    }
    if (!formData.schoolName.trim())
      errors.schoolName =
        t("contact.form.schoolNameRequired") || "اسم المدرسة مطلوب";
    if (!formData.message.trim())
      errors.message = t("contact.form.messageRequired") || "الرسالة مطلوبة";

    if (Object.keys(errors).length > 0) {
      setFieldErrors({
        name: errors.name || "",
        email: errors.email || "",
        schoolName: errors.schoolName || "",
        message: errors.message || "",
      });
      setIsSubmitting(false);
      return;
    }

    // Submit form to backend API
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
          schoolName: formData.schoolName.trim(),
          message: formData.message.trim(),
        }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        console.log("✅ Form submitted successfully:", result);
        setShowSuccess(true);
        setSubmitError("");
        setFieldErrors({ name: "", email: "", schoolName: "", message: "" });
        setFormData({
          name: "",
          email: "",
          phone: "",
          schoolName: "",
          message: "",
          status: "new",
        });

        // Hide success message after 5s
        setTimeout(() => setShowSuccess(false), 5000);
      } else {
        throw new Error(result.message || "Failed to submit form");
      }
    } catch (error) {
      console.error("❌ Error submitting form:", error);
      setSubmitError(
        error instanceof Error
          ? error.message
          : t("contact.form.submitError") || "حدث خطأ أثناء إرسال النموذج"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const isRTL = i18n.language === "ar";

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />

      {/* Hero Section */}
      <section
        id="hero-section"
        className="relative overflow-hidden bg-gradient-to-br from-blue-50 to-green-50 dark:from-blue-950 dark:to-green-950 pt-16 pb-20"
      >
        {/* Floating Particles */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Particle 1 */}
          <div className="absolute top-20 left-20 w-2 h-2 bg-blue-400 rounded-full opacity-60 animate-float-slow"></div>
          <div className="absolute top-32 right-32 w-3 h-3 bg-blue-300 rounded-full opacity-40 animate-float-medium"></div>
          <div className="absolute top-48 left-1/4 w-1.5 h-1.5 bg-blue-500 rounded-full opacity-50 animate-float-fast"></div>

          {/* Particle 2 */}
          <div className="absolute top-60 right-20 w-2.5 h-2.5 bg-green-400 rounded-full opacity-50 animate-float-slow delay-1000"></div>
          <div className="absolute top-40 left-1/3 w-2 h-2 bg-green-300 rounded-full opacity-40 animate-float-medium delay-2000"></div>
          <div className="absolute top-72 right-1/4 w-1 h-1 bg-green-500 rounded-full opacity-60 animate-float-fast delay-1500"></div>

          {/* Particle 3 */}
          <div className="absolute bottom-40 left-16 w-3 h-3 bg-blue-200 rounded-full opacity-30 animate-float-medium delay-3000"></div>
          <div className="absolute bottom-60 right-40 w-1.5 h-1.5 bg-blue-400 rounded-full opacity-50 animate-float-slow delay-500"></div>
          <div className="absolute bottom-32 left-1/2 w-2 h-2 bg-green-200 rounded-full opacity-40 animate-float-fast delay-2500"></div>

          {/* More subtle particles */}
          <div className="absolute top-1/3 left-12 w-1 h-1 bg-blue-300 rounded-full opacity-30 animate-float-slow delay-4000"></div>
          <div className="absolute top-2/3 right-12 w-1.5 h-1.5 bg-green-300 rounded-full opacity-35 animate-float-medium delay-1800"></div>
          <div className="absolute top-1/2 left-3/4 w-2 h-2 bg-blue-200 rounded-full opacity-25 animate-float-fast delay-3500"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="text-center lg:text-right space-y-8">
              <div className="space-y-4">
                <div className="relative">
                  {/* Blue glow effect behind title */}
                  <div className="absolute inset-0 blur-3xl opacity-30 bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 rounded-full transform scale-110"></div>
                  <h1 className="relative text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white leading-tight">
                    {t("hero.title")}
                    <span className="block text-blue-600 dark:text-blue-400 text-5xl sm:text-6xl lg:text-7xl">
                      {t("hero.subtitle")}
                    </span>
                  </h1>
                </div>
                <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto lg:mx-0">
                  {t("hero.description")}
                </p>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start relative z-10">
                <Button
                  size="lg"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg rounded-xl"
                  onClick={scrollToContact}
                >
                  {t("hero.startNow")}
                  <ArrowRight
                    className={`w-5 h-5 ${isRTL ? "mr-2" : "ml-2"}`}
                  />
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="border-2 border-blue-600 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 px-8 py-3 text-lg rounded-xl"
                  onClick={scrollToContact}
                >
                  {t("hero.bookDemo")}
                </Button>
              </div>
            </div>

            {/* Right Content - Education Illustration */}
            <div className="relative">
              <div className="flex items-center justify-center">
                <img
                  src="/images/landing-page/phone-laptop.webp"
                  alt="OnSchool Platform - Mobile and Desktop"
                  className="w-full max-w-9xl h-auto transform hover:scale-105 transition-transform duration-300 drop-shadow-2xl"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Features Section */}
      <section
        id="features-section"
        className="py-20 bg-white dark:bg-gray-900"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              {t("features.title")}
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              {t("features.description")}
            </p>
          </div>

          {/* Enhanced responsive grid layout with better card distribution */}
          <div className="flex flex-col items-center gap-8">
            {/* First row - 3 cards on larger screens, responsive on smaller */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-6xl">
              <Card className="group hover:shadow-xl hover:scale-105 transition-all duration-300 border-2 hover:border-blue-300 dark:hover:border-blue-500 bg-gradient-to-br from-blue-50/50 to-blue-100/30 dark:from-blue-950/50 dark:to-blue-900/30">
                <CardHeader className="text-center pb-4">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900 dark:to-blue-800 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <Users className="w-10 h-10 text-blue-600 dark:text-blue-400" />
                  </div>
                  <CardTitle className="text-xl font-bold text-gray-900 dark:text-white">
                    {t("features.studentPortal.title")}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center text-base leading-relaxed text-gray-700 dark:text-gray-300">
                    {t("features.studentPortal.description")}
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="group hover:shadow-xl hover:scale-105 transition-all duration-300 border-2 hover:border-green-300 dark:hover:border-green-500 bg-gradient-to-br from-green-50/50 to-green-100/30 dark:from-green-950/50 dark:to-green-900/30">
                <CardHeader className="text-center pb-4">
                  <div className="w-20 h-20 bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900 dark:to-green-800 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <MessageSquare className="w-10 h-10 text-green-600 dark:text-green-400" />
                  </div>
                  <CardTitle className="text-xl font-bold text-gray-900 dark:text-white">
                    {t("features.communication.title")}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center text-base leading-relaxed text-gray-700 dark:text-gray-300">
                    {t("features.communication.description")}
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="group hover:shadow-xl hover:scale-105 transition-all duration-300 border-2 hover:border-purple-300 dark:hover:border-purple-500 bg-gradient-to-br from-purple-50/50 to-purple-100/30 dark:from-purple-950/50 dark:to-purple-900/30 md:col-span-2 lg:col-span-1">
                <CardHeader className="text-center pb-4">
                  <div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-900 dark:to-purple-800 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <School className="w-10 h-10 text-purple-600 dark:text-purple-400" />
                  </div>
                  <CardTitle className="text-xl font-bold text-gray-900 dark:text-white">
                    {t("features.management.title")}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center text-base leading-relaxed text-gray-700 dark:text-gray-300">
                    {t("features.management.description")}
                  </CardDescription>
                </CardContent>
              </Card>
            </div>

            {/* Second row - 2 cards centered */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
              <Card className="group hover:shadow-xl hover:scale-105 transition-all duration-300 border-2 hover:border-orange-300 dark:hover:border-orange-500 bg-gradient-to-br from-orange-50/50 to-orange-100/30 dark:from-orange-950/50 dark:to-orange-900/30">
                <CardHeader className="text-center pb-4">
                  <div className="w-20 h-20 bg-gradient-to-br from-orange-100 to-orange-200 dark:from-orange-900 dark:to-orange-800 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <Globe className="w-10 h-10 text-orange-600 dark:text-orange-400" />
                  </div>
                  <CardTitle className="text-xl font-bold text-gray-900 dark:text-white">
                    {t("features.languages.title")}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center text-base leading-relaxed text-gray-700 dark:text-gray-300">
                    {t("features.languages.description")}
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="group hover:shadow-xl hover:scale-105 transition-all duration-300 border-2 hover:border-red-300 dark:hover:border-red-500 bg-gradient-to-br from-red-50/50 to-red-100/30 dark:from-red-950/50 dark:to-red-900/30">
                <CardHeader className="text-center pb-4">
                  <div className="w-20 h-20 bg-gradient-to-br from-red-100 to-red-200 dark:from-red-900 dark:to-red-800 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <QrCode className="w-10 h-10 text-red-600 dark:text-red-400" />
                  </div>
                  <CardTitle className="text-xl font-bold text-gray-900 dark:text-white">
                    {t("features.qrCards.title")}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center text-base leading-relaxed text-gray-700 dark:text-gray-300">
                    {t("features.qrCards.description")}
                  </CardDescription>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Phone Carousel Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              {t("features.carousel.title")}
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              {t("features.subtitle")}
            </p>
          </div>
          {/* Add this wrapper with fixed height */}
          <div className="min-h-[600px] md:min-h-[700px] lg:min-h-[800px]">
            <PhoneCarousel />
          </div>
        </div>
      </section>

      {/* Mac Carousel Section */}
      <section className="pt-12 pb-0 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-1 sm:px-6 lg:px-8">
          {/* Maximum height wrapper for small screens */}
          <div className="min-h-[95vh] md:min-h-[900px] lg:min-h-[1000px] xl:min-h-[1100px]">
            <MacBookCarousel />
          </div>
        </div>
      </section>

      {/* Benefits by Role Section */}
      <section
        id="benefits-section"
        className="pt-0 pb-16 bg-gray-50 dark:bg-gray-800"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              {t("benefits.title")}
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              {t("benefits.description")}
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Schools */}
            <Card className="bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <GraduationCap className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-2xl text-green-800 dark:text-green-200">
                  {t("benefits.schools.title")}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                  <span className="text-green-700 dark:text-green-300">
                    {t("benefits.schools.feature1")}
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                  <span className="text-green-700 dark:text-green-300">
                    {t("benefits.schools.feature2")}
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                  <span className="text-green-700 dark:text-green-300">
                    {t("benefits.schools.feature3")}
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                  <span className="text-green-700 dark:text-green-300">
                    {t("benefits.schools.feature4")}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Teachers */}
            <Card className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-2xl text-blue-800 dark:text-blue-200">
                  {t("benefits.teachers.title")}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
                  <span className="text-blue-700 dark:text-blue-300">
                    {t("benefits.teachers.feature1")}
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
                  <span className="text-blue-700 dark:text-blue-300">
                    {t("benefits.teachers.feature2")}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Students & Parents */}
            <Card className="bg-purple-50 dark:bg-purple-950 border-purple-200 dark:border-purple-800">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <UserCheck className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-2xl text-purple-800 dark:text-purple-200">
                  {t("benefits.students.title")}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-purple-600 mt-1 flex-shrink-0" />
                  <span className="text-purple-700 dark:text-purple-300">
                    {t("benefits.students.feature1")}
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-purple-600 mt-1 flex-shrink-0" />
                  <span className="text-purple-700 dark:text-purple-300">
                    {t("benefits.students.feature2")}
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-purple-600 mt-1 flex-shrink-0" />
                  <span className="text-purple-700 dark:text-purple-300">
                    {t("benefits.students.feature3")}
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-purple-600 mt-1 flex-shrink-0" />
                  <span className="text-purple-700 dark:text-purple-300">
                    {t("benefits.students.feature4")}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              {t("trust.title")}
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="font-semibold text-lg mb-2">
                {t("trust.dataIsolation.title")}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                {t("trust.dataIsolation.description")}
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="font-semibold text-lg mb-2">
                {t("trust.algeriaCompliance.title")}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                {t("trust.algeriaCompliance.description")}
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <Globe className="w-8 h-8 text-orange-600 dark:text-orange-400" />
              </div>
              <h3 className="font-semibold text-lg mb-2">
                {t("trust.rtlSupport.title")}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                {t("trust.rtlSupport.description")}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section
        id="how-it-works-section"
        className="py-20 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              {t("howItWorks.title")}
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              {t("howItWorks.description")}
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="relative">
                <div className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl font-bold text-white">1</span>
                </div>
                <div className="hidden lg:block absolute top-10 right-0 w-full h-0.5 bg-blue-200 dark:bg-blue-800 -z-10"></div>
              </div>
              <h3 className="text-xl font-semibold mb-4">
                {t("howItWorks.step1.title")}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                {t("howItWorks.step1.description")}
              </p>
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md">
                <div className="h-32 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900 dark:to-blue-800 rounded-lg flex items-center justify-center">
                  <School className="w-12 h-12 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            </div>

            <div className="text-center">
              <div className="relative">
                <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl font-bold text-white">2</span>
                </div>
                <div className="hidden lg:block absolute top-10 right-0 w-full h-0.5 bg-green-200 dark:bg-green-800 -z-10"></div>
              </div>
              <h3 className="text-xl font-semibold mb-4">
                {t("howItWorks.step2.title")}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                {t("howItWorks.step2.description")}
              </p>
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md">
                <div className="h-32 bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900 dark:to-green-800 rounded-lg flex items-center justify-center">
                  <Users className="w-12 h-12 text-green-600 dark:text-green-400" />
                </div>
              </div>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-white">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-4">
                {t("howItWorks.step3.title")}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                {t("howItWorks.step3.description")}
              </p>
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md">
                <div className="h-32 bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-900 dark:to-purple-800 rounded-lg flex items-center justify-center">
                  <Calendar className="w-12 h-12 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing-section" className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              {t("pricing.title")}
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              {t("pricing.description")}
            </p>
          </div>

          {/* First 10 Schools Offer */}
          {SHOW_PROMOTION_BANNER === 1 && (
            <div className="flex justify-center mb-16 mt-12">
              <div className="bg-gradient-to-br from-red-600 via-red-700 to-rose-700 rounded-xl px-10 py-6 text-center shadow-xl max-w-4xl border border-red-300 hover:shadow-2xl hover:scale-105 transition-all duration-300">
                <div className="flex items-center justify-center mb-3">
                  <span className="text-red-800 font-bold text-sm uppercase tracking-wide bg-yellow-400 px-3 py-1 rounded-full shadow-md">
                    {i18n.language === "ar"
                      ? "عرض خاص"
                      : i18n.language === "fr"
                      ? "Offre Spéciale"
                      : "Special Offer"}
                  </span>
                </div>

                <h3 className="text-white font-bold text-xl mb-3">
                  {i18n.language === "ar"
                    ? "للمدارس العشر الأولى فقط"
                    : i18n.language === "fr"
                    ? "Seulement pour les 10 premières écoles"
                    : "First 10 Schools Only"}
                </h3>

                <p className="text-red-100 text-sm font-medium mb-4">
                  {i18n.language === "ar"
                    ? "خصم كبير على رسوم الإعداد + استشارة مجانية"
                    : i18n.language === "fr"
                    ? "Grande réduction sur les frais d'installation + consultation gratuite"
                    : "Big discount on setup fees + free consultation"}
                </p>

                <button
                  onClick={() => {
                    const contactSection =
                      document.getElementById("contact-section");
                    if (contactSection) {
                      contactSection.scrollIntoView({ behavior: "smooth" });
                    }
                  }}
                  className="bg-white text-red-700 px-6 py-3 rounded-full text-sm font-bold shadow-lg hover:bg-red-50 hover:shadow-xl transition-all duration-200 hover:scale-105"
                >
                  {i18n.language === "ar"
                    ? "احجز مكانك الآن"
                    : i18n.language === "fr"
                    ? "Réservez votre place maintenant"
                    : "Reserve Your Spot Now"}
                </button>
              </div>
            </div>
          )}

          {/* Pricing Cards */}
          <div className="grid lg:grid-cols-2 xl:grid-cols-4 gap-8">
            {(() => {
              const plans = [
                {
                  id: "free-trial",
                  name: "تجربة مجانية",
                  nameEn: "Free Trial",
                  nameFr: "Essai gratuit",
                  price: "0",
                  period: "لمدة أسبوع",
                  periodEn: "for 1 week",
                  periodFr: "pour 1 semaine",
                  setup: null,
                  popular: false,
                  icon: Gift,
                  color: "green",
                  features: [
                    "تجربة مجانية للمدرسة كاملة",
                    "عدد محدود من الطلاب",
                    "دعم أساسي أثناء التجربة",
                  ],
                  featuresEn: [
                    "Full school trial experience",
                    "Limited number of students",
                    "Basic support during trial",
                  ],
                  featuresFr: [
                    "Expérience d'essai complète de l'école",
                    "Nombre limité d'étudiants",
                    "Support de base pendant l'essai",
                  ],
                },
                {
                  id: "basic",
                  name: "الخطة الأساسية",
                  nameEn: "Basic Plan",
                  nameFr: "Plan de base",
                  price: "1,500",
                  period: "شهر",
                  periodEn: "month",
                  periodFr: "mois",
                  setup: "29,000",
                  popular: true,
                  icon: Users,
                  color: "blue",
                  yearlyPrice: "10,000",
                  features: [
                    "تخصيص كامل (شعار المدرسة – الألوان – الواجهة)",
                    "إدارة الطلاب والمعلمين",
                    "تسجيل الحضور والغياب",
                    "إرسال رسائل وتنبيهات لأولياء الأمور",
                    "تحديثات وتحسينات مستمرة",
                  ],
                  featuresEn: [
                    "Full customization (school logo - colors - interface)",
                    "Student and teacher management",
                    "Attendance tracking",
                    "Send messages and notifications to parents",
                    "Continuous updates and improvements",
                  ],
                  featuresFr: [
                    "Personnalisation complète (logo école - couleurs - interface)",
                    "Gestion des étudiants et enseignants",
                    "Suivi des présences",
                    "Envoi de messages et notifications aux parents",
                    "Mises à jour et améliorations continues",
                  ],
                },
                {
                  id: "standard",
                  name: "الخطة القياسية",
                  nameEn: "Standard Plan",
                  nameFr: "Plan standard",
                  price: "3,000",
                  period: "شهر",
                  periodEn: "month",
                  periodFr: "mois",
                  setup: "29,000",
                  popular: false,
                  icon: Settings,
                  color: "purple",
                  yearlyPrice: "20,000",
                  features: [
                    "كل مزايا الخطة الأساسية",
                    "إصل.�ح أخطاء مجاني وسريع",
                    "إمكانية تعديل النظام حسب احتياجاتكم",
                  ],
                  featuresEn: [
                    "All Basic Plan features",
                    "Free and fast bug fixes",
                    "System customization according to your needs",
                  ],
                  featuresFr: [
                    "Toutes les fonctionnalités du plan de base",
                    "Corrections de bugs gratuites et rapides",
                    "Personnalisation du système selon vos besoins",
                  ],
                },
                {
                  id: "lifetime",
                  name: "خطة مدى الحياة",
                  nameEn: "Lifetime Plan",
                  nameFr: "Plan à vie",
                  price: "90,000",
                  period: "دفعة واحدة",
                  periodEn: "one-time payment",
                  periodFr: "paiement unique",
                  setup: null,
                  popular: false,
                  icon: Crown,
                  color: "gold",
                  features: [
                    "تسطيب كامل بدون اشتراكات",
                    "كل مزايا الخطة القياسية",
                    "دعم فني أولوية 24/7",
                    "إصلاح أخطاء مجاني وسريع",
                    "إمكانية تعديل النظام حسب احتياجاتكم",
                  ],
                  featuresEn: [
                    "Complete setup without subscriptions",
                    "All Standard Plan features",
                    "Priority 24/7 technical support",
                    "Free and fast bug fixes",
                    "System customization according to your needs",
                  ],
                  featuresFr: [
                    "Installation complète sans abonnements",
                    "Toutes les fonctionnalités du plan standard",
                    "Support technique prioritaire 24/7",
                    "Corrections de bugs gratuites et rapides",
                    "Personnalisation du système selon vos besoins",
                  ],
                },
              ];

              const getColorClasses = (color, popular) => {
                const baseClasses = {
                  green: {
                    border: "border-green-200 dark:border-green-800",
                    bg: "bg-green-50 dark:bg-green-950",
                    icon: "bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400",
                    button: "bg-green-600 hover:bg-green-700",
                  },
                  blue: {
                    border: "border-blue-200 dark:border-blue-800",
                    bg: "bg-blue-50 dark:bg-blue-950",
                    icon: "bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400",
                    button: "bg-blue-600 hover:bg-blue-700",
                  },
                  purple: {
                    border: "border-purple-200 dark:border-purple-800",
                    bg: "bg-purple-50 dark:bg-purple-950",
                    icon: "bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-400",
                    button: "bg-purple-600 hover:bg-purple-700",
                  },
                  gold: {
                    border: "border-yellow-200 dark:border-yellow-800",
                    bg: "bg-yellow-50 dark:bg-yellow-950",
                    icon: "bg-yellow-100 dark:bg-yellow-900 text-yellow-600 dark:text-yellow-400",
                    button: "bg-yellow-600 hover:bg-yellow-700",
                  },
                };

                return popular
                  ? {
                      border: "border-2 border-blue-500 dark:border-blue-400",
                      bg: "bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900",
                      icon: baseClasses[color].icon,
                      button: baseClasses[color].button,
                    }
                  : baseClasses[color];
              };

              const getCurrentFeatures = (plan) => {
                switch (i18n.language) {
                  case "ar":
                    return plan.features;
                  case "fr":
                    return plan.featuresFr;
                  case "en":
                    return plan.featuresEn;
                  default:
                    return plan.features;
                }
              };

              const getCurrentPlanName = (plan) => {
                switch (i18n.language) {
                  case "ar":
                    return plan.name;
                  case "fr":
                    return plan.nameFr;
                  case "en":
                    return plan.nameEn;
                  default:
                    return plan.name;
                }
              };

              const getCurrentPeriod = (plan) => {
                switch (i18n.language) {
                  case "ar":
                    return plan.period;
                  case "fr":
                    return plan.periodFr;
                  case "en":
                    return plan.periodEn;
                  default:
                    return plan.period;
                }
              };

              const scrollToContact = () => {
                const contactSection =
                  document.getElementById("contact-section");
                if (contactSection) {
                  contactSection.scrollIntoView({ behavior: "smooth" });
                } else {
                  window.location.href = "/#contact-section";
                }
              };

              return plans.map((plan) => {
                const colorClasses = getColorClasses(plan.color, plan.popular);
                const IconComponent = plan.icon;

                return (
                  <Card
                    key={plan.id}
                    className={`relative hover:shadow-xl transition-all duration-300 ${colorClasses.border} ${colorClasses.bg} flex flex-col h-full`}
                  >
                    {plan.popular && (
                      <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                        <Badge className="bg-blue-600 text-white px-4 py-1 text-sm font-semibold">
                          <Star className="w-4 h-4 mr-1" />
                          {t("pricing.popular")}
                        </Badge>
                      </div>
                    )}

                    <CardHeader className="text-center pb-4">
                      <div
                        className={`w-16 h-16 ${colorClasses.icon} rounded-full flex items-center justify-center mx-auto mb-4`}
                      >
                        <IconComponent className="w-8 h-8" />
                      </div>
                      <CardTitle className="text-2xl font-bold">
                        {getCurrentPlanName(plan)}
                      </CardTitle>
                      <div className="space-y-2">
                        {plan.setup && (
                          <div className="flex items-baseline justify-center gap-2">
                            <span className="text-4xl font-bold text-gray-900 dark:text-white">
                              {plan.setup}
                            </span>
                            <span className="text-lg text-gray-600 dark:text-gray-300">
                              {t("pricing.currency")}
                            </span>
                          </div>
                        )}
                        {plan.setup && (
                          <p className="text-gray-600 dark:text-gray-300 font-semibold">
                            {t("pricing.setup")}
                          </p>
                        )}
                        {!plan.setup && (
                          <div className="flex items-baseline justify-center gap-2">
                            <span className="text-4xl font-bold text-gray-900 dark:text-white">
                              {plan.price}
                            </span>
                            <span className="text-lg text-gray-600 dark:text-gray-300">
                              {t("pricing.currency")}
                            </span>
                          </div>
                        )}
                        {!plan.setup && (
                          <p className="text-gray-600 dark:text-gray-300 font-semibold">
                            {getCurrentPeriod(plan)}
                          </p>
                        )}
                        {plan.setup && (
                          <div className="text-center">
                            <div className="text-lg font-semibold text-gray-900 dark:text-white">
                              + {plan.price}
                              {t("pricing.currency")} {getCurrentPeriod(plan)}
                              {plan.yearlyPrice && (
                                <span className="text-lg font-semibold text-gray-900 dark:text-white">
                                  {" "}
                                  أو {t("pricing.yearly")}: {plan.yearlyPrice}{" "}
                                  {t("pricing.currency")}
                                </span>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-6 flex flex-col h-full">
                      <ul className="space-y-3 flex-grow">
                        {getCurrentFeatures(plan).map((feature, index) => (
                          <li key={index} className="flex items-start gap-3">
                            <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                              {feature}
                            </span>
                          </li>
                        ))}
                      </ul>

                      <div className="mt-auto">
                        <Button
                          className={`w-full ${colorClasses.button} text-white py-3 text-lg font-semibold`}
                          onClick={scrollToContact}
                        >
                          {t("pricing.startNow")}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              });
            })()}
          </div>
        </div>
      </section>

      {/* Download Apps Section - Hidden for now */}
      {false && (
        <section className="py-20 bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-950 dark:to-blue-950">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                {t("download.title")}
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8">
                {t("download.subtitle")}
              </p>
              <p className="text-lg text-gray-500 dark:text-gray-400">
                {t("download.description")}
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Mobile Apps */}
              <div className="text-center">
                <div className="w-20 h-20 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Smartphone className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  {t("download.mobile")}
                </h3>
                <div className="space-y-4">
                  <Button
                    variant="outline"
                    size="lg"
                    className={`w-full max-w-xs border-2 border-gray-300 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 ${
                      !downloadLinks?.mobile?.appstore?.enabled ||
                      downloadLinks?.mobile?.appstore?.comingSoon
                        ? ""
                        : "cursor-pointer"
                    }`}
                    disabled={
                      !downloadLinks?.mobile?.appstore?.enabled ||
                      downloadLinks?.mobile?.appstore?.comingSoon
                    }
                    onClick={() => {
                      if (
                        downloadLinks?.mobile?.appstore?.enabled &&
                        !downloadLinks?.mobile?.appstore?.comingSoon
                      ) {
                        window.open(
                          downloadLinks.mobile.appstore.url,
                          "_blank"
                        );
                      }
                    }}
                  >
                    <Download
                      className={`w-5 h-5 ${isRTL ? "ml-2" : "mr-2"}`}
                    />
                    {t("download.ios")}
                    {(!downloadLinks?.mobile?.appstore?.enabled ||
                      downloadLinks?.mobile?.appstore?.comingSoon) && (
                      <Badge
                        variant="secondary"
                        className={`${isRTL ? "mr-2" : "ml-2"} text-xs`}
                      >
                        {t("download.comingSoon")}
                      </Badge>
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    className={`w-full max-w-xs border-2 border-gray-300 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 ${
                      !downloadLinks?.mobile?.googleplay?.enabled ||
                      downloadLinks?.mobile?.googleplay?.comingSoon
                        ? ""
                        : "cursor-pointer"
                    }`}
                    disabled={
                      !downloadLinks?.mobile?.googleplay?.enabled ||
                      downloadLinks?.mobile?.googleplay?.comingSoon
                    }
                    onClick={() => {
                      if (
                        downloadLinks?.mobile?.googleplay?.enabled &&
                        !downloadLinks?.mobile?.googleplay?.comingSoon
                      ) {
                        window.open(
                          downloadLinks.mobile.googleplay.url,
                          "_blank"
                        );
                      }
                    }}
                  >
                    <Download
                      className={`w-5 h-5 ${isRTL ? "ml-2" : "mr-2"}`}
                    />
                    {t("download.android")}
                    {(!downloadLinks?.mobile?.googleplay?.enabled ||
                      downloadLinks?.mobile?.googleplay?.comingSoon) && (
                      <Badge
                        variant="secondary"
                        className={`${isRTL ? "mr-2" : "ml-2"} text-xs`}
                      >
                        {t("download.comingSoon")}
                      </Badge>
                    )}
                  </Button>
                </div>
              </div>

              {/* Desktop Apps */}
              <div className="text-center">
                <div className="w-20 h-20 bg-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Monitor className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  {t("download.desktop")}
                </h3>
                <div className="space-y-4">
                  <Button
                    variant="outline"
                    size="lg"
                    className={`w-full max-w-xs border-2 border-gray-300 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 ${
                      !downloadLinks?.desktop?.windows?.enabled ||
                      downloadLinks?.desktop?.windows?.comingSoon
                        ? ""
                        : "cursor-pointer"
                    }`}
                    disabled={
                      !downloadLinks?.desktop?.windows?.enabled ||
                      downloadLinks?.desktop?.windows?.comingSoon
                    }
                    onClick={() => {
                      if (
                        downloadLinks?.desktop?.windows?.enabled &&
                        !downloadLinks?.desktop?.windows?.comingSoon
                      ) {
                        window.open(
                          downloadLinks.desktop.windows.url,
                          "_blank"
                        );
                      }
                    }}
                  >
                    <Download
                      className={`w-5 h-5 ${isRTL ? "ml-2" : "mr-2"}`}
                    />
                    {t("download.windows")}
                    {(!downloadLinks?.desktop?.windows?.enabled ||
                      downloadLinks?.desktop?.windows?.comingSoon) && (
                      <Badge
                        variant="secondary"
                        className={`${isRTL ? "mr-2" : "ml-2"} text-xs`}
                      >
                        {t("download.comingSoon")}
                      </Badge>
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    className={`w-full max-w-xs border-2 border-gray-300 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 ${
                      !downloadLinks?.desktop?.mac?.enabled ||
                      downloadLinks?.desktop?.mac?.comingSoon
                        ? ""
                        : "cursor-pointer"
                    }`}
                    disabled={
                      !downloadLinks?.desktop?.mac?.enabled ||
                      downloadLinks?.desktop?.mac?.comingSoon
                    }
                    onClick={() => {
                      if (
                        downloadLinks?.desktop?.mac?.enabled &&
                        !downloadLinks?.desktop?.mac?.comingSoon
                      ) {
                        window.open(downloadLinks.desktop.mac.url, "_blank");
                      }
                    }}
                  >
                    <Download
                      className={`w-5 h-5 ${isRTL ? "ml-2" : "mr-2"}`}
                    />
                    {t("download.mac")}
                    {(!downloadLinks?.desktop?.mac?.enabled ||
                      downloadLinks?.desktop?.mac?.comingSoon) && (
                      <Badge
                        variant="secondary"
                        className={`${isRTL ? "mr-2" : "ml-2"} text-xs`}
                      >
                        {t("download.comingSoon")}
                      </Badge>
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full max-w-xs border-2 border-gray-300 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                    disabled
                  >
                    <Download
                      className={`w-5 h-5 ${isRTL ? "ml-2" : "mr-2"}`}
                    />
                    {t("download.linux")}
                    <Badge
                      variant="secondary"
                      className={`${isRTL ? "mr-2" : "ml-2"} text-xs`}
                    >
                      {t("download.comingSoon")}
                    </Badge>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Contact Section */}
      <section
        id="contact-section"
        className="py-20 bg-gray-50 dark:bg-gray-800"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Left info side */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                {t("contact.title")}
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
                {t("contact.description")}
              </p>
              <div className="space-y-8">
                {/* Phone Contact Card */}
                <div className="bg-white dark:bg-gray-700 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-600">
                  <div className="flex items-center gap-6">
                    <div className="flex-shrink-0">
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                        <Phone className="w-8 h-8 text-white" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                        {t("contact.phone")}
                      </h3>
                      <a
                        href="tel:+213542512213"
                        className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105"
                      >
                        <svg
                          className="w-5 h-5 mr-2"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                        </svg>
                        <span dir="ltr">+213 542 512 213</span>
                      </a>
                    </div>
                  </div>
                </div>

                {/* Email Contact Card */}
                <div className="bg-white dark:bg-gray-700 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-600">
                  <div className="flex items-center gap-6">
                    <div className="flex-shrink-0">
                      <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                        <Mail className="w-8 h-8 text-white" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                        {t("contact.email")}
                      </h3>
                      <a
                        href="mailto:info@taalimflow.com"
                        className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105"
                      >
                        <svg
                          className="w-5 h-5 mr-2"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M14.243 5.757a6 6 0 10-.986 9.284 1 1 0 111.087 1.678A8 8 0 1118 10a3 3 0 01-4.8 2.401A4 4 0 1114 10a1 1 0 102 0c0-1.537-.586-3.07-1.757-4.243zM12 10a2 2 0 10-4 0 2 2 0 004 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                        info@taalimflow.com
                      </a>
                    </div>
                  </div>
                </div>

                {/* Facebook Contact Card */}
                <div className="bg-white dark:bg-gray-700 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-600">
                  <div className="flex items-center gap-6">
                    <div className="flex-shrink-0">
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center shadow-lg">
                        <svg
                          className="w-8 h-8 text-white"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                        </svg>
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                        Facebook
                      </h3>
                      <a
                        href="https://facebook.com/taalimflow"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105"
                      >
                        <svg
                          className="w-5 h-5 mr-2"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                        </svg>
                        تابعنا على فيسبوك
                      </a>
                    </div>
                  </div>
                </div>

                {/* Instagram Contact Card */}
                <div className="bg-white dark:bg-gray-700 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-600">
                  <div className="flex items-center gap-6">
                    <div className="flex-shrink-0">
                      <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg">
                        <svg
                          className="w-8 h-8 text-white"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M12.017 0C8.396 0 7.929.013 6.71.072 5.493.131 4.73.333 4.058.63c-.68.3-1.277.703-1.86 1.286C1.616 2.5 1.213 3.097.913 3.777.616 4.449.414 5.212.355 6.429.296 7.648.283 8.115.283 11.736c0 3.621.013 4.088.072 5.307.059 1.217.261 1.98.558 2.652.3.68.703 1.277 1.286 1.86.583.583 1.18.986 1.86 1.286.672.297 1.435.499 2.652.558 1.219.059 1.686.072 5.307.072 3.621 0 4.088-.013 5.307-.072 1.217-.059 1.98-.261 2.652-.558.68-.3 1.277-.703 1.86-1.286.583-.583.986-1.18 1.286-1.86.297-.672.499-1.435.558-2.652.059-1.219.072-1.686.072-5.307 0-3.621-.013-4.088-.072-5.307-.059-1.217-.261-1.98-.558-2.652-.3-.68-.703-1.277-1.286-1.86C18.337.913 17.74.51 17.06.21 16.388-.087 15.625-.289 14.408-.348 13.189-.407 12.722-.42 9.101-.42h2.916zm-.056 5.417c3.914 0 7.088 3.174 7.088 7.088s-3.174 7.088-7.088 7.088-7.088-3.174-7.088-7.088 3.174-7.088 7.088-7.088zm0 11.69c2.549 0 4.602-2.053 4.602-4.602S14.51 7.913 11.961 7.913s-4.602 2.053-4.602 4.602 2.053 4.602 4.602 4.602zm9.007-11.69c0 .914-.741 1.655-1.655 1.655s-1.655-.741-1.655-1.655.741-1.655 1.655-1.655 1.655.741 1.655 1.655z" />
                        </svg>
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                        Instagram
                      </h3>
                      <a
                        href="https://instagram.com/taalimflow"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-pink-500 to-orange-500 text-white font-semibold rounded-xl hover:from-pink-600 hover:to-orange-600 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105"
                      >
                        <svg
                          className="w-5 h-5 mr-2"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M12.017 0C8.396 0 7.929.013 6.71.072 5.493.131 4.73.333 4.058.63c-.68.3-1.277.703-1.86 1.286C1.616 2.5 1.213 3.097.913 3.777.616 4.449.414 5.212.355 6.429.296 7.648.283 8.115.283 11.736c0 3.621.013 4.088.072 5.307.059 1.217.261 1.98.558 2.652.3.68.703 1.277 1.286 1.86.583.583 1.18.986 1.86 1.286.672.297 1.435.499 2.652.558 1.219.059 1.686.072 5.307.072 3.621 0 4.088-.013 5.307-.072 1.217-.059 1.98-.261 2.652-.558.68-.3 1.277-.703 1.86-1.286.583-.583.986-1.18 1.286-1.86.297-.672.499-1.435.558-2.652.059-1.219.072-1.686.072-5.307 0-3.621-.013-4.088-.072-5.307-.059-1.217-.261-1.98-.558-2.652-.3-.68-.703-1.277-1.286-1.86C18.337.913 17.74.51 17.06.21 16.388-.087 15.625-.289 14.408-.348 13.189-.407 12.722-.42 9.101-.42h2.916zm-.056 5.417c3.914 0 7.088 3.174 7.088 7.088s-3.174 7.088-7.088 7.088-7.088-3.174-7.088-7.088 3.174-7.088 7.088-7.088zm0 11.69c2.549 0 4.602-2.053 4.602-4.602S14.51 7.913 11.961 7.913s-4.602 2.053-4.602 4.602 2.053 4.602 4.602 4.602zm9.007-11.69c0 .914-.741 1.655-1.655 1.655s-1.655-.741-1.655-1.655.741-1.655 1.655-1.655 1.655.741 1.655 1.655z" />
                        </svg>
                        تابعنا على انستغرام
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Form side */}
            <Card
              className={
                isSubmitting ? "opacity-75 transition-opacity duration-300" : ""
              }
            >
              <CardHeader>
                <CardTitle className="text-xl">
                  {t("contact.form.title")}
                </CardTitle>
                <CardDescription></CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  <span className="text-red-500">*</span>{" "}
                  {t("contact.form.requiredFields") || "الحقول المطلوبة"}
                </div>
                {showSuccess && (
                  <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-950 dark:to-blue-950 border-2 border-green-200 dark:border-green-800 rounded-xl p-6 mb-6 text-center">
                    <div className="flex flex-col items-center gap-4">
                      <div className="relative">
                        <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                          <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
                        </div>
                        <div className="absolute -top-2 -right-2">
                          <Sparkles className="w-6 h-6 text-yellow-500 animate-pulse" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-xl font-bold text-green-800 dark:text-green-200">
                          {t("contact.form.successTitle") || "شكراً لك! 🎉"}
                        </h3>
                        <p className="text-green-700 dark:text-green-300 text-lg">
                          {t("contact.form.successMessage") ||
                            "تم استلام رسالتك بنجاح وسنتواصل معك قريباً"}
                        </p>
                        <div className="flex items-center justify-center gap-2 mt-3">
                          <Heart className="w-5 h-5 text-red-500 animate-pulse" />
                          <span className="text-sm text-green-600 dark:text-green-400">
                            {t("contact.form.appreciation") ||
                              "نقدر اهتمامك بنا"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {submitError && (
                  <div className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-4">
                    <p className="text-red-800 dark:text-red-200 font-medium">
                      {t("contact.form.error")}
                    </p>
                  </div>
                )}

                {/* ✅ form now saves to JSON file through Express */}
                <form onSubmit={handleSubmit}>
                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        {t("contact.form.name")} *
                      </label>
                      <Input
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder={t("contact.form.namePlaceholder")}
                        required
                        disabled={isSubmitting}
                        className={fieldErrors.name ? "border-red-500" : ""}
                      />
                      {fieldErrors.name && (
                        <p className="text-red-500 text-xs mt-1">
                          {fieldErrors.name}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        {t("contact.form.email")} *
                      </label>
                      <Input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder={t("contact.form.emailPlaceholder")}
                        required
                        disabled={isSubmitting}
                        className={fieldErrors.email ? "border-red-500" : ""}
                      />
                      {fieldErrors.email && (
                        <p className="text-red-500 text-xs mt-1">
                          {fieldErrors.email}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">
                      {t("contact.form.phone")}
                    </label>
                    <Input
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder={t("contact.form.phonePlaceholder")}
                      disabled={isSubmitting}
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">
                      {t("contact.form.schoolName")} *
                    </label>
                    <Input
                      name="schoolName"
                      value={formData.schoolName}
                      onChange={handleInputChange}
                      placeholder={t("contact.form.schoolNamePlaceholder")}
                      required
                      disabled={isSubmitting}
                      className={fieldErrors.schoolName ? "border-red-500" : ""}
                    />
                    {fieldErrors.schoolName && (
                      <p className="text-red-500 text-xs mt-1">
                        {fieldErrors.schoolName}
                      </p>
                    )}
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">
                      {t("contact.form.message")} *
                    </label>
                    <Textarea
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder={t("contact.form.messagePlaceholder")}
                      rows={4}
                      required
                      disabled={isSubmitting}
                      maxLength={500}
                      className={fieldErrors.message ? "border-red-500" : ""}
                    />
                    {fieldErrors.message && (
                      <p className="text-red-500 text-xs mt-1">
                        {fieldErrors.message}
                      </p>
                    )}
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {formData.message.length}/500{" "}
                        {t("contact.form.characters") || "حرف"}
                      </span>
                    </div>
                  </div>
                  {isSubmitting && (
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-4">
                      <div
                        className="bg-blue-600 h-2 rounded-full animate-pulse"
                        style={{ width: "100%" }}
                      ></div>
                    </div>
                  )}
                  <Button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg font-semibold relative overflow-hidden"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <div className="flex items-center justify-center gap-2">
                        <Loader2 className="w-5 h-5 animate-spin text-white" />
                        <span>
                          {t("contact.form.submitting") || "جاري الإرسال..."}
                        </span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center gap-2">
                        <MessageCircle className="w-5 h-5" />
                        <span>
                          {t("contact.form.submit") || "إرسال الرسالة"}
                        </span>
                      </div>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 dark:bg-gray-950 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-1">
              <h3 className="text-xl font-bold mb-4 text-white dark:text-gray-100">
                {t("footer.title")}
              </h3>
              <p className="text-gray-400 dark:text-gray-300 mb-6">
                {t("footer.description")}
              </p>
              <div
                className={`flex ${
                  isRTL ? "space-x-reverse space-x-4" : "space-x-4"
                }`}
              >
                <div className="w-10 h-10 bg-blue-600 hover:bg-blue-700 rounded-full flex items-center justify-center transition-colors cursor-pointer">
                  <span className="text-sm font-semibold text-white">f</span>
                </div>
                <div className="w-10 h-10 bg-blue-400 hover:bg-blue-500 rounded-full flex items-center justify-center transition-colors cursor-pointer">
                  <span className="text-sm font-semibold text-white">t</span>
                </div>
                <div className="w-10 h-10 bg-blue-700 hover:bg-blue-800 rounded-full flex items-center justify-center transition-colors cursor-pointer">
                  <span className="text-sm font-semibold text-white">in</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-4 text-white dark:text-gray-100">
                {t("footer.features.title")}
              </h4>
              <ul className="space-y-3">
                <li className="text-gray-400 dark:text-gray-300 hover:text-gray-300 dark:hover:text-gray-200 transition-colors cursor-pointer">
                  {t("footer.features.studentManagement")}
                </li>
                <li className="text-gray-400 dark:text-gray-300 hover:text-gray-300 dark:hover:text-gray-200 transition-colors cursor-pointer">
                  {t("footer.features.attendanceTracking")}
                </li>
                <li className="text-gray-400 dark:text-gray-300 hover:text-gray-300 dark:hover:text-gray-200 transition-colors cursor-pointer">
                  {t("footer.features.paymentSystem")}
                </li>
                <li className="text-gray-400 dark:text-gray-300 hover:text-gray-300 dark:hover:text-gray-200 transition-colors cursor-pointer">
                  {t("footer.features.communication")}
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4 text-white dark:text-gray-100">
                {t("footer.about.title")}
              </h4>
              <ul className="space-y-3">
                <li className="text-gray-400 dark:text-gray-300 hover:text-gray-300 dark:hover:text-gray-200 transition-colors cursor-pointer">
                  {t("footer.about.aboutUs")}
                </li>
                <li className="text-gray-400 dark:text-gray-300 hover:text-gray-300 dark:hover:text-gray-200 transition-colors cursor-pointer">
                  {t("footer.about.faq")}
                </li>
                <li className="text-gray-400 dark:text-gray-300 hover:text-gray-300 dark:hover:text-gray-200 transition-colors cursor-pointer">
                  {t("footer.about.support")}
                </li>
                <li className="text-gray-400 dark:text-gray-300 hover:text-gray-300 dark:hover:text-gray-200 transition-colors cursor-pointer">
                  {t("footer.about.privacy")}
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4 text-white dark:text-gray-100">
                {t("footer.technical.title")}
              </h4>
              <ul className="space-y-3">
                <li className="text-gray-400 dark:text-gray-300 hover:text-gray-300 dark:hover:text-gray-200 transition-colors text-sm">
                  {t("footer.technical.worksOnAnyDevice")}
                </li>
                <li className="text-gray-400 dark:text-gray-300 hover:text-gray-300 dark:hover:text-gray-200 transition-colors text-sm">
                  {t("footer.technical.compatibleWithAllBrowsers")}
                </li>
                <li className="text-gray-400 dark:text-gray-300 hover:text-gray-300 dark:hover:text-gray-200 transition-colors text-sm">
                  {t("footer.technical.noInstallationRequired")}
                </li>
              </ul>
            </div>
          </div>

          <div className="text-center pt-8 border-t border-gray-700 dark:border-gray-600">
            <p className="text-gray-500 dark:text-gray-400">
              © {new Date().getFullYear()} Taalim Flow. {t("footer.copyright")}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default TaalimFlowLanding;
