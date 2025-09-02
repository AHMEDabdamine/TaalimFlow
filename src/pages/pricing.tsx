import React from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Star, Users, Settings, Crown, Gift } from "lucide-react";

const PricingSection = () => {
  const { t, i18n } = useTranslation();

  const scrollToContact = () => {
    // Navigate to contact section
    const contactSection = document.getElementById("contact-section");
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: "smooth" });
    } else {
      // Fallback for external navigation
      window.location.href = "/#contact-section";
    }
  };

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
        "إصلاح أخطاء مجاني وسريع",
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

  return (
    <div className="py-20">
      {/* Section Header */}
      <div className="text-center mb-16">
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
          {t("pricing.title")}
        </h2>
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          {t("pricing.description")}
        </p>
      </div>

      {/* Pricing Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 xl:grid-cols-4 gap-8">
          {plans.map((plan) => {
            const colorClasses = getColorClasses(plan.color, plan.popular);
            const IconComponent = plan.icon;

            return (
              <Card
                key={plan.id}
                className={`relative hover:shadow-xl transition-all duration-300 ${colorClasses.border} ${colorClasses.bg}`}
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
                    <div className="flex items-baseline justify-center gap-2">
                      <span className="text-4xl font-bold text-gray-900 dark:text-white">
                        {plan.price}
                      </span>
                      <span className="text-lg text-gray-600 dark:text-gray-300">
                        {t("pricing.currency")}
                      </span>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300">
                      {getCurrentPeriod(plan)}
                    </p>
                    {plan.setup && (
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {t("pricing.setup")}: {plan.setup}{" "}
                        {t("pricing.currency")}
                      </p>
                    )}
                    {plan.yearlyPrice && (
                      <p className="text-sm text-green-600 dark:text-green-400 font-medium">
                        {t("pricing.yearly")}: {plan.yearlyPrice}{" "}
                        {t("pricing.currency")}
                      </p>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="space-y-6">
                  <ul className="space-y-3">
                    {getCurrentFeatures(plan).map((feature, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    className={`w-full ${colorClasses.button} text-white py-3 text-lg font-semibold`}
                    onClick={scrollToContact}
                  >
                    {t("pricing.startNow")}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PricingSection;
